import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PSS_COURSE, PWS_COURSE, AI_PERSONAS } from "../src/lib/curriculum/courses";
import type { ChapterSeed, LessonSeed, ModuleSeed } from "../src/lib/curriculum/courses";
// Seed runs via tsx from repo root; relative import to generated client is intentional.

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

type SeedLesson = LessonSeed & { referencesJson?: string };

function moduleLessons(mod: ModuleSeed): { chapter?: ChapterSeed; lessons: SeedLesson[] }[] {
  if (mod.chapters?.length) {
    return mod.chapters.map((chapter) => ({
      chapter,
      lessons: (chapter.lessons || []) as SeedLesson[],
    }));
  }
  return [{ lessons: (mod.lessons || []) as SeedLesson[] }];
}

function toJsonString(value: unknown) {
  if (value == null || value === "") return null;
  return typeof value === "string" ? value : JSON.stringify(value);
}

async function seedCourse(courseData: typeof PSS_COURSE) {
  const course = await prisma.course.upsert({
    where: { slug: courseData.slug },
    update: {
      title: courseData.title,
      subtitle: courseData.subtitle,
      description: courseData.description,
      contactHours: courseData.contactHours,
      priceCents: courseData.priceCents,
      competencies: JSON.stringify(courseData.competencies),
      learningOutcomes: JSON.stringify(courseData.learningOutcomes),
      isPublished: true,
    },
    create: {
      slug: courseData.slug,
      type: courseData.type,
      title: courseData.title,
      subtitle: courseData.subtitle,
      description: courseData.description,
      contactHours: courseData.contactHours,
      priceCents: courseData.priceCents,
      competencies: JSON.stringify(courseData.competencies),
      learningOutcomes: JSON.stringify(courseData.learningOutcomes),
      isPublished: true,
    },
  });

  for (const [mIndex, mod] of courseData.modules.entries()) {
    const moduleRow = await prisma.module.upsert({
      where: { courseId_slug: { courseId: course.id, slug: mod.slug } },
      update: {
        title: mod.title,
        description: mod.description,
        orderIndex: mIndex + 1,
        estimatedHours: mod.estimatedHours,
        oarReferences: JSON.stringify(mod.oarReferences),
        competencies: JSON.stringify(mod.competencies),
      },
      create: {
        courseId: course.id,
        slug: mod.slug,
        title: mod.title,
        description: mod.description,
        orderIndex: mIndex + 1,
        estimatedHours: mod.estimatedHours,
        oarReferences: JSON.stringify(mod.oarReferences),
        competencies: JSON.stringify(mod.competencies),
      },
    });

    let lessonOrderIndex = 1;
    for (const [chapterIndex, group] of moduleLessons(mod).entries()) {
      const chapterRow = group.chapter
        ? await prisma.chapter.upsert({
            where: {
              moduleId_slug: { moduleId: moduleRow.id, slug: group.chapter.slug },
            },
            update: {
              title: group.chapter.title,
              description: group.chapter.description ?? null,
              sortOrder: chapterIndex + 1,
            },
            create: {
              moduleId: moduleRow.id,
              slug: group.chapter.slug,
              title: group.chapter.title,
              description: group.chapter.description ?? null,
              sortOrder: chapterIndex + 1,
            },
          })
        : null;

      for (const lesson of group.lessons) {
        const lessonData = {
          title: lesson.title,
          type: lesson.type,
          orderIndex: lessonOrderIndex,
          chapterId: chapterRow?.id ?? null,
          estimatedMinutes: lesson.estimatedMinutes,
          contentMd: lesson.contentMd,
          videoUrl: lesson.videoUrl ?? null,
          videoProvider: lesson.videoProvider ?? null,
          referencesJson: toJsonString(lesson.referencesJson ?? lesson.references),
          learningModes: toJsonString(lesson.learningModes),
          isModuleQuiz: Boolean(lesson.isModuleQuiz),
          isModuleAiReview: Boolean(lesson.isModuleAiReview),
          storytellingHook: lesson.storytellingHook ?? null,
          interactivePayload: lesson.interactivePayload
            ? JSON.stringify(lesson.interactivePayload)
            : null,
          passScore: lesson.passScore ?? 80,
        };

        await prisma.lesson.upsert({
          where: { moduleId_slug: { moduleId: moduleRow.id, slug: lesson.slug } },
          update: lessonData,
          create: {
            moduleId: moduleRow.id,
            slug: lesson.slug,
            ...lessonData,
          },
        });
        lessonOrderIndex += 1;
      }
    }
  }

  return course;
}

async function seedCourseMaterials({
  pssCourseId,
  pwsCourseId,
  createdById,
}: {
  pssCourseId: string;
  pwsCourseId: string;
  createdById: string;
}) {
  const pssIntroLesson = await prisma.lesson.findFirst({
    where: { module: { courseId: pssCourseId, slug: "recovery-foundations" } },
    orderBy: { orderIndex: "asc" },
  });
  const pwsLesson = await prisma.lesson.findFirst({
    where: { module: { courseId: pwsCourseId } },
    orderBy: { orderIndex: "asc" },
  });

  const materials = [
    {
      id: "seed-material-pss-oha-thw-rules",
      courseId: pssCourseId,
      lessonId: pssIntroLesson?.id,
      title: "OHA THW training and certification rules",
      description:
        "Reference page for Oregon Traditional Health Worker training requirements.",
      materialType: "link",
      url: "https://secure.sos.state.or.us/oard/displayDivisionRules.action?selectedDivision=7798",
      sortOrder: 1,
      createdById,
    },
    {
      id: "seed-material-pss-story-practice-handout",
      courseId: pssCourseId,
      lessonId: pssIntroLesson?.id,
      title: "Strategic story sharing worksheet",
      description:
        "A printable planning handout for deciding what to share, why, and when.",
      materialType: "handout",
      url: "https://example.com/cascade/strategic-story-sharing.pdf",
      sortOrder: 2,
      createdById,
    },
    {
      id: "seed-material-pws-wellness-planning",
      courseId: pwsCourseId,
      lessonId: pwsLesson?.id,
      title: "Peer wellness planning slide deck",
      description:
        "Demo slide resource staff can replace with the current cohort deck.",
      materialType: "slide",
      url: "https://example.com/cascade/peer-wellness-planning-slides",
      sortOrder: 1,
      createdById,
    },
  ];

  for (const material of materials) {
    await prisma.courseMaterial.upsert({
      where: { id: material.id },
      update: material,
      create: material,
    });
  }
}

async function main() {
  const passwordHash = await bcrypt.hash("CascadeDemo2026!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@cascadepeer.academy" },
    update: { role: "ADMIN", passwordHash },
    create: {
      email: "admin@cascadepeer.academy",
      name: "Academy Admin",
      passwordHash,
      role: "ADMIN",
      peerIdentity: "Program leadership",
    },
  });

  const instructor = await prisma.user.upsert({
    where: { email: "instructor@cascadepeer.academy" },
    update: { role: "INSTRUCTOR", passwordHash },
    create: {
      email: "instructor@cascadepeer.academy",
      name: "Jordan Lee, CPSS",
      passwordHash,
      role: "INSTRUCTOR",
      peerIdentity: "Lived experience — mental health & recovery",
      bio: "Certified peer with 10+ years facilitation and trauma-informed training experience.",
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@cascadepeer.academy" },
    update: { role: "STUDENT", passwordHash },
    create: {
      email: "student@cascadepeer.academy",
      name: "Taylor Nguyen",
      passwordHash,
      role: "STUDENT",
      peerIdentity: "Self-identified person in recovery from addiction",
    },
  });

  const pss = await seedCourse(PSS_COURSE);
  const pws = await seedCourse(PWS_COURSE);
  await seedCourseMaterials({
    pssCourseId: pss.id,
    pwsCourseId: pws.id,
    createdById: admin.id,
  });

  for (const persona of AI_PERSONAS) {
    await prisma.aiPersona.upsert({
      where: { slug: persona.slug },
      update: persona,
      create: persona,
    });
  }

  const ayop = await prisma.cohort.upsert({
    where: { id: "seed-cohort-pss-ayop" },
    update: {
      name: "PSS AYOP — Rolling Enrollment",
      deliveryMode: "AYOP",
      instructorId: instructor.id,
      isActive: true,
    },
    create: {
      id: "seed-cohort-pss-ayop",
      courseId: pss.id,
      instructorId: instructor.id,
      name: "PSS AYOP — Rolling Enrollment",
      deliveryMode: "AYOP",
      liveSessionNotes:
        "AYOP students complete online modules at their own pace. Required: AI practice portfolio + final live competency evaluation via Zoom.",
      maxSeats: 100,
    },
  });

  const hybrid = await prisma.cohort.upsert({
    where: { id: "seed-cohort-pws-hybrid" },
    update: {
      name: "PWS Hybrid Spring Cohort",
      deliveryMode: "HYBRID",
      instructorId: instructor.id,
      isActive: true,
    },
    create: {
      id: "seed-cohort-pws-hybrid",
      courseId: pws.id,
      instructorId: instructor.id,
      name: "PWS Hybrid Spring Cohort",
      deliveryMode: "HYBRID",
      startDate: new Date("2026-09-08"),
      endDate: new Date("2026-12-15"),
      liveSessionNotes:
        "Weekly Zoom workshops Fridays 9am–12pm PT + one observed roleplay lab + final evaluation.",
      maxSeats: 20,
    },
  });

  await prisma.liveSession.deleteMany({ where: { cohortId: hybrid.id } });
  await prisma.liveSession.createMany({
    data: [
      {
        cohortId: hybrid.id,
        title: "Orientation & Community Agreements",
        description: "Meet cohort, review hybrid expectations, wellness agreements.",
        startsAt: new Date("2026-09-11T16:00:00.000Z"),
        endsAt: new Date("2026-09-11T19:00:00.000Z"),
        meetingUrl: "https://zoom.example/cascade-orientation",
        isRequired: true,
      },
      {
        cohortId: hybrid.id,
        title: "Live MI & Boundaries Workshop",
        description: "Observed practice pairs with instructor coaching.",
        startsAt: new Date("2026-10-09T16:00:00.000Z"),
        endsAt: new Date("2026-10-09T19:00:00.000Z"),
        meetingUrl: "https://zoom.example/cascade-mi-lab",
        isRequired: true,
      },
      {
        cohortId: hybrid.id,
        title: "Crisis Skills & Final Competency Block",
        description: "Crisis routing drills and scheduled competency evaluations.",
        startsAt: new Date("2026-12-04T17:00:00.000Z"),
        endsAt: new Date("2026-12-04T21:00:00.000Z"),
        meetingUrl: "https://zoom.example/cascade-finals",
        isRequired: true,
      },
    ],
  });

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: student.id, courseId: pss.id } },
    update: { status: "ACTIVE", deliveryMode: "AYOP", cohortId: ayop.id },
    create: {
      userId: student.id,
      courseId: pss.id,
      cohortId: ayop.id,
      deliveryMode: "AYOP",
      specialization: "Adult Addictions",
      status: "ACTIVE",
    },
  });

  const badges = [
    {
      slug: "first-module",
      title: "First Steps",
      description: "Completed your first module",
      iconKey: "footprints",
      criteria: "Complete any module",
    },
    {
      slug: "listener",
      title: "Deep Listener",
      description: "Scored 85%+ on communication practice",
      iconKey: "ear",
      criteria: "Communication competency gate",
    },
    {
      slug: "crisis-ready",
      title: "Crisis Ready",
      description: "Passed crisis routing simulations",
      iconKey: "shield",
      criteria: "Crisis AI sessions + quiz",
    },
    {
      slug: "pss-complete",
      title: "PSS Completer",
      description: "Earned PSS certificate of completion",
      iconKey: "award",
      criteria: "PSS course complete + instructor sign-off",
    },
    {
      slug: "pws-complete",
      title: "PWS Completer",
      description: "Earned PWS certificate of completion",
      iconKey: "award",
      criteria: "PWS course complete + instructor sign-off",
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: badge,
      create: badge,
    });
  }

  console.log("Seed complete");
  console.log({
    admin: admin.email,
    instructor: instructor.email,
    student: student.email,
    password: "CascadeDemo2026!",
    courses: [pss.slug, pws.slug],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
