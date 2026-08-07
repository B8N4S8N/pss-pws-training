import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import {
  aiConfigured,
  offlineTutorReply,
  streamTutorReply,
} from "@/lib/ai/peer-ai";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const messages = (body.messages || []) as {
    role: "user" | "assistant";
    content: string;
  }[];
  const last = messages.filter((m) => m.role === "user").at(-1)?.content || "";

  const session = await prisma.aiSession.create({
    data: {
      userId: user.id,
      type: "TUTOR",
      title: last.slice(0, 80) || "Tutor session",
      messagesJson: JSON.stringify(messages),
    },
  });

  if (!aiConfigured()) {
    const text = offlineTutorReply(last);
    await prisma.aiSession.update({
      where: { id: session.id },
      data: {
        messagesJson: JSON.stringify([
          ...messages,
          { role: "assistant", content: text },
        ]),
        completedAt: new Date(),
      },
    });
    return Response.json({ text, offline: true, sessionId: session.id });
  }

  const result = await streamTutorReply({ messages });
  return result.toTextStreamResponse();
}
