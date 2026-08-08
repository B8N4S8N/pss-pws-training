import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  generatePersonalizedSection,
  learnerStyleSchema,
} from "@/lib/ai/generate-curriculum";
import { describeModelRouting } from "@/lib/ai/models";
import { PSS_COURSE, PWS_COURSE, flattenModuleLessons } from "@/lib/curriculum";

function findGuideline(moduleSlug: string, sectionSlug: string) {
  const courses = [PSS_COURSE, PWS_COURSE];
  for (const course of courses) {
    for (const mod of course.modules) {
      if (mod.slug !== moduleSlug) continue;
      const chapter =
        mod.chapters?.find((c) => c.slug === sectionSlug) ||
        mod.chapters?.find((c) => c.slug.includes(sectionSlug));
      if (!chapter) continue;
      const reading = chapter.lessons.find((l) => l.type === "READING");
      const ai = flattenModuleLessons(mod).find((l) => l.isModuleAiReview);
      const payload = (ai?.interactivePayload || {}) as {
        goals?: string[];
        mustCover?: string[];
      };
      return {
        courseSlug: course.slug,
        guideline: {
          moduleSlug: mod.slug,
          moduleTitle: mod.title,
          sectionSlug: chapter.slug,
          sectionTitle: chapter.title,
          goals: payload.goals || mod.competencies.slice(0, 4),
          mustCover: payload.mustCover || [
            "Stay in peer scope",
            "Center choice and consent",
            "Route safety concerns appropriately",
          ],
          oarReferences: mod.oarReferences,
          baseScene: reading?.storytellingHook || chapter.description,
          basePlainTalk: reading?.contentMd?.slice(0, 500),
        },
      };
    }
  }
  return null;
}

export async function GET() {
  const user = await requireUser(["ADMIN", "INSTRUCTOR", "STUDENT"]);
  if (!user) return new Response("Unauthorized", { status: 401 });
  return Response.json({ routing: describeModelRouting() });
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const moduleSlug = String(body.moduleSlug || "");
  const sectionSlug = String(body.sectionSlug || "");
  if (!moduleSlug || !sectionSlug) {
    return Response.json(
      { error: "moduleSlug and sectionSlug are required" },
      { status: 400 }
    );
  }

  const profile = await prisma.learnerProfile.findUnique({
    where: { userId: user.id },
  });

  const learnerParse = learnerStyleSchema.safeParse({
    learningStyle: body.learningStyle || profile?.learningStyle || "peer-talk",
    readingLevel: body.readingLevel || profile?.readingLevel || "plain",
    backgroundNotes: body.backgroundNotes || profile?.backgroundNotes || undefined,
    prefersExamplesAbout: body.prefersExamplesAbout ||
      (profile?.prefersExamplesJson
        ? JSON.parse(profile.prefersExamplesJson)
        : undefined),
  });
  if (!learnerParse.success) {
    return Response.json({ error: "Invalid learner profile" }, { status: 400 });
  }

  const found = findGuideline(moduleSlug, sectionSlug);
  if (!found) {
    return Response.json({ error: "Module/section not found" }, { status: 404 });
  }

  const result = await generatePersonalizedSection({
    guideline: found.guideline,
    learner: learnerParse.data,
  });

  if (!result.section) {
    return Response.json({ error: "Generation failed" }, { status: 500 });
  }

  const course = await prisma.course.findUnique({
    where: { slug: found.courseSlug },
  });
  const mod = course
    ? await prisma.module.findUnique({
        where: {
          courseId_slug: { courseId: course.id, slug: moduleSlug },
        },
      })
    : null;
  const chapter = mod
    ? await prisma.chapter.findUnique({
        where: {
          moduleId_slug: { moduleId: mod.id, slug: found.guideline.sectionSlug },
        },
      })
    : null;

  const saved = await prisma.generatedContent.create({
    data: {
      userId: user.id,
      courseId: course?.id,
      moduleId: mod?.id,
      chapterId: chapter?.id,
      kind: "SECTION_READING",
      title: result.section.title,
      contentMd: result.section.contentMd,
      contentJson: JSON.stringify(result.section),
      modelUsed: result.modelLabel,
      provider: result.provider,
      taskTier: "generate",
      promptMetaJson: JSON.stringify({
        moduleSlug,
        sectionSlug,
        learner: learnerParse.data,
        offline: result.offline,
        routing: describeModelRouting(),
      }),
    },
  });

  await prisma.aiSession.create({
    data: {
      userId: user.id,
      type: "GENERATED_CURRICULUM",
      title: `Generated: ${result.section.title}`,
      lessonId: null,
      moduleId: mod?.id,
      messagesJson: JSON.stringify([
        {
          role: "system",
          content: "Personalized section generated from fixed module guidelines.",
        },
        {
          role: "assistant",
          content: result.section.contentMd.slice(0, 4000),
        },
      ]),
      feedbackJson: JSON.stringify({
        generatedContentId: saved.id,
        model: result.modelLabel,
        provider: result.provider,
        offline: result.offline,
      }),
      completedAt: new Date(),
    },
  });

  return Response.json({
    id: saved.id,
    offline: result.offline,
    model: result.modelLabel,
    provider: result.provider,
    section: result.section,
  });
}
