"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function saveLearnerProfileAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  if (!user) return;

  const learningStyle = String(formData.get("learningStyle") || "peer-talk");
  const readingLevel = String(formData.get("readingLevel") || "plain");
  const backgroundNotes = String(formData.get("backgroundNotes") || "").trim();
  const prefers = String(formData.get("prefersExamplesAbout") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8);
  const modelPreference = String(formData.get("modelPreference") || "free");

  await prisma.learnerProfile.upsert({
    where: { userId: user.id },
    update: {
      learningStyle,
      readingLevel,
      backgroundNotes: backgroundNotes || null,
      prefersExamplesJson: prefers.length ? JSON.stringify(prefers) : null,
      modelPreference,
    },
    create: {
      userId: user.id,
      learningStyle,
      readingLevel,
      backgroundNotes: backgroundNotes || null,
      prefersExamplesJson: prefers.length ? JSON.stringify(prefers) : null,
      modelPreference,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/learn/personalize");
}
