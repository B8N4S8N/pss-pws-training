import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import {
  aiConfigured,
  evaluateModuleReview,
  offlineModuleReviewEvaluation,
  offlineModuleReviewReply,
  streamModuleReviewReply,
} from "@/lib/ai/peer-ai";
import { prisma } from "@/lib/db";
import { completeModuleAiReviewAction } from "@/lib/actions";

type ReviewMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type ModuleReviewPayload = {
  kind?: string;
  goals?: unknown;
  mustCover?: unknown;
  rubric?: unknown;
  starterQuestions?: unknown;
  passScore?: unknown;
};

function parsePayload(raw: string | null): ModuleReviewPayload {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as ModuleReviewPayload) : {};
  } catch {
    return {};
  }
}

function cleanMessages(value: unknown): ReviewMessage[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((message) => {
      if (!message || typeof message !== "object") return null;
      const role = String((message as { role?: unknown }).role || "");
      const content = String((message as { content?: unknown }).content || "").trim();
      if (!["user", "assistant", "system"].includes(role) || !content) return null;
      return { role: role as ReviewMessage["role"], content };
    })
    .filter((message): message is ReviewMessage => Boolean(message));
}

function transcriptFromMessages(messages: ReviewMessage[]) {
  return messages
    .filter((message) => message.role !== "system")
    .map((message) => {
      const speaker = message.role === "user" ? "Student" : "Cascade Guide";
      return `${speaker}: ${message.content}`;
    })
    .join("\n");
}

function payloadPassScore(payload: ModuleReviewPayload, lessonPassScore: number) {
  const parsed = Number(payload.passScore);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : lessonPassScore || 80;
}

export async function POST(req: NextRequest) {
  const user = await requireUser(["STUDENT", "INSTRUCTOR", "ADMIN"]);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const lessonId = String(body.lessonId || "");
  const sessionId = body.sessionId ? String(body.sessionId) : undefined;
  const messages = cleanMessages(body.messages);
  const finalize = Boolean(body.finalize);

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: true },
  });
  if (!lesson) return new Response("Lesson not found", { status: 404 });

  const payload = parsePayload(lesson.interactivePayload);
  const isModuleReviewLesson =
    String(lesson.type) === "MODULE_AI_REVIEW" ||
    lesson.isModuleAiReview ||
    payload.kind === "moduleAiReview";
  if (!isModuleReviewLesson) {
    return new Response("Not a module AI review lesson", { status: 400 });
  }

  let session = sessionId
    ? await prisma.aiSession.findFirst({
        where: { id: sessionId, userId: user.id, type: "MODULE_REVIEW" },
      })
    : null;

  if (!session) {
    session = await prisma.aiSession.create({
      data: {
        userId: user.id,
        lessonId: lesson.id,
        moduleId: lesson.moduleId,
        type: "MODULE_REVIEW",
        title: `${lesson.module.title} — ${lesson.title}`,
        messagesJson: JSON.stringify(messages),
      },
    });
  } else {
    session = await prisma.aiSession.update({
      where: { id: session.id },
      data: {
        lessonId: lesson.id,
        moduleId: lesson.moduleId,
        messagesJson: JSON.stringify(messages),
      },
    });
  }

  const transcript = transcriptFromMessages(messages);
  const passScore = payloadPassScore(payload, lesson.passScore);

  if (finalize) {
    const feedback = aiConfigured()
      ? await evaluateModuleReview({
          moduleTitle: lesson.module.title,
          goals: payload.goals,
          mustCover: payload.mustCover,
          rubric: payload.rubric,
          transcript,
        })
      : offlineModuleReviewEvaluation();
    const passed = feedback.overallScore >= passScore && feedback.passed;
    const finalFeedback = { ...feedback, passed };

    await prisma.aiSession.update({
      where: { id: session.id },
      data: {
        messagesJson: JSON.stringify(messages),
        feedbackJson: JSON.stringify(finalFeedback),
        scoresJson: JSON.stringify(finalFeedback.rubricScores),
        overallScore: finalFeedback.overallScore,
        completedAt: new Date(),
      },
    });

    if (passed) {
      await completeModuleAiReviewAction(
        lesson.id,
        finalFeedback.overallScore,
        finalFeedback.coachingNotes
      );
    } else {
      await prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
        update: {
          status: "NEEDS_REVIEW",
          score: finalFeedback.overallScore,
          feedback: finalFeedback.coachingNotes,
        },
        create: {
          userId: user.id,
          lessonId: lesson.id,
          status: "NEEDS_REVIEW",
          score: finalFeedback.overallScore,
          feedback: finalFeedback.coachingNotes,
        },
      });
    }

    return Response.json({
      feedback: finalFeedback,
      passed,
      passScore,
      sessionId: session.id,
    });
  }

  const turn = messages.filter((message) => message.role === "assistant").length;
  const text = aiConfigured()
    ? await (
        await streamModuleReviewReply({
          moduleTitle: lesson.module.title,
          goals: payload.goals,
          mustCover: payload.mustCover,
          rubric: payload.rubric,
          starterQuestions: payload.starterQuestions,
          transcriptSoFar: transcript,
          messages,
        })
      ).text
    : offlineModuleReviewReply(turn, payload.starterQuestions);
  const nextMessages = [...messages, { role: "assistant" as const, content: text }];

  await prisma.aiSession.update({
    where: { id: session.id },
    data: { messagesJson: JSON.stringify(nextMessages) },
  });

  return Response.json({
    text,
    offline: !aiConfigured(),
    sessionId: session.id,
  });
}
