import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { aiConfigured, offlineTutorReply, streamTutorReply } from "@/lib/ai/peer-ai";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const messages = (body.messages || []) as {
    role: "user" | "assistant";
    content: string;
  }[];

  const systemPreamble = {
    role: "system" as const,
    content: `You are conducting a mock hiring / peer specialist technical interview for an Oregon behavioral health employer. Ask one question at a time about: lived experience boundaries, ethics, crisis response, documentation, MI, trauma-informed care, and teamwork. After 6-8 questions, summarize strengths and growth areas. Be warm but evaluative.`,
  };

  await prisma.aiSession.create({
    data: {
      userId: user.id,
      type: "INTERVIEW",
      title: "Mock peer specialist interview",
      messagesJson: JSON.stringify(messages),
    },
  });

  if (!aiConfigured()) {
    const last = messages.filter((m) => m.role === "user").at(-1)?.content || "";
    const starter =
      messages.length === 0
        ? "Welcome — I'm your mock interviewer today. Tell me briefly why you want to work as a peer support specialist, and how you use lived experience without making the conversation about you."
        : offlineTutorReply(last);
    return Response.json({ text: starter, offline: true });
  }

  const result = await streamTutorReply({
    messages: [systemPreamble, ...messages],
  });
  return result.toTextStreamResponse();
}
