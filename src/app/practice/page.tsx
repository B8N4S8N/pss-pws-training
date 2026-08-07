import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PracticeLabClient } from "@/components/practice-lab-client";

export const metadata = { title: "Practice Lab" };

export default async function PracticePage() {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const personas = await prisma.aiPersona.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen">
      <header className="border-b border-primary/10 bg-white/80 px-4 py-4">
        <div className="mx-auto flex max-w-5xl justify-between">
          <Link href="/dashboard" className="text-sm text-muted-foreground">
            ← Dashboard
          </Link>
          <Link href="/tutor" className="text-sm text-accent">
            AI Tutor
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-3xl text-primary">AI Practice Lab</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Practice with simulated peers before live evaluation. AI feedback supports
          learning; instructors authorize completion.
        </p>
        <div className="mt-8">
          <PracticeLabClient personas={personas} />
        </div>
      </main>
    </div>
  );
}
