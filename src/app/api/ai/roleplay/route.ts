import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import {
  aiConfigured,
  evaluateRoleplay,
  offlineEvaluation,
  offlinePersonaReply,
  streamPersonaReply,
} from "@/lib/ai/peer-ai";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const personaId = String(body.personaId || "");
  const messages = (body.messages || []) as {
    role: "user" | "assistant";
    content: string;
  }[];
  const evaluate = Boolean(body.evaluate);
  const sessionId = body.sessionId as string | undefined;

  const persona = await prisma.aiPersona.findUnique({ where: { id: personaId } });
  if (!persona) return new Response("Persona not found", { status: 404 });

  let session = sessionId
    ? await prisma.aiSession.findUnique({ where: { id: sessionId } })
    : null;

  if (!session) {
    session = await prisma.aiSession.create({
      data: {
        userId: user.id,
        personaId: persona.id,
        type: body.type === "INTERVIEW" ? "INTERVIEW" : "ROLEPLAY",
        title: `${persona.name} — ${persona.presentation}`,
        messagesJson: JSON.stringify(messages),
      },
    });
  }

  if (evaluate) {
    const transcript = messages
      .map((m) => `${m.role === "user" ? "Specialist" : persona.name}: ${m.content}`)
      .join("\n");
    const rubric = JSON.parse(persona.evaluationRubric) as string[];
    const feedback = aiConfigured()
      ? await evaluateRoleplay({
          personaName: persona.name,
          rubric,
          transcript,
        })
      : offlineEvaluation();

    await prisma.aiSession.update({
      where: { id: session.id },
      data: {
        messagesJson: JSON.stringify(messages),
        feedbackJson: JSON.stringify(feedback),
        scoresJson: JSON.stringify(feedback.domainScores),
        overallScore: feedback.overallScore,
        completedAt: new Date(),
      },
    });

    return Response.json({ feedback, sessionId: session.id });
  }

  if (!aiConfigured()) {
    const turn = messages.filter((m) => m.role === "assistant").length;
    const text = offlinePersonaReply(persona.name, turn);
    const next = [...messages, { role: "assistant" as const, content: text }];
    await prisma.aiSession.update({
      where: { id: session.id },
      data: { messagesJson: JSON.stringify(next) },
    });
    return Response.json({ text, offline: true, sessionId: session.id });
  }

  const result = await streamPersonaReply({
    systemPrompt: persona.systemPrompt,
    messages,
  });
  return result.toTextStreamResponse();
}
