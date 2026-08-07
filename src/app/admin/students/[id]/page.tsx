import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { saveCompetencyEvaluationAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const actor = await requireUser(["ADMIN", "INSTRUCTOR"]);
  if (!actor) redirect("/login");

  const student = await prisma.user.findUnique({
    where: { id },
    include: {
      enrollments: { include: { course: true, cohort: true } },
      lessonProgress: { include: { lesson: true }, take: 50 },
      quizAttempts: { orderBy: { createdAt: "desc" }, take: 20 },
      aiSessions: { orderBy: { createdAt: "desc" }, take: 20, include: { persona: true } },
      attendanceRecords: true,
      certificates: true,
      evaluations: { include: { instructor: true }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!student) notFound();

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white/80 px-4 py-4">
        <div className="mx-auto max-w-5xl">
          <Link href="/admin/students" className="text-sm text-muted-foreground">
            ← Students
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 space-y-8">
        <div>
          <h1 className="font-display text-3xl text-primary">{student.name}</h1>
          <p className="text-muted-foreground">{student.email}</p>
          <p className="mt-1 text-sm">{student.peerIdentity}</p>
        </div>

        <section className="rounded-2xl border bg-white/70 p-6">
          <h2 className="font-display text-xl text-primary">Final competency evaluation</h2>
          <form action={saveCompetencyEvaluationAction} className="mt-4 grid gap-3 md:grid-cols-2">
            <input type="hidden" name="studentId" value={student.id} />
            <div className="space-y-2">
              <Label>Course type</Label>
              <select name="courseType" className="h-9 w-full rounded-md border px-3 text-sm">
                <option value="PSS">PSS</option>
                <option value="PWS">PWS</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Recommendation</Label>
              <select name="recommendation" className="h-9 w-full rounded-md border px-3 text-sm">
                <option value="PENDING">Pending</option>
                <option value="MORE_PRACTICE">More practice</option>
                <option value="READY">Ready — issue certificate</option>
              </select>
            </div>
            {["communication", "ethics", "trauma", "crisis", "mi", "documentation"].map(
              (d) => (
                <div key={d} className="space-y-2">
                  <Label>{d} (0-100)</Label>
                  <Input name={d} type="number" min={0} max={100} defaultValue={80} />
                </div>
              )
            )}
            <div className="md:col-span-2 space-y-2">
              <Label>Narrative</Label>
              <Textarea name="narrative" rows={4} required />
            </div>
            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input type="checkbox" name="liveObserved" /> Live observed roleplay completed
            </label>
            <Button type="submit" className="md:col-span-2">
              Save evaluation
            </Button>
          </form>
        </section>

        <section className="rounded-2xl border bg-white/70 p-6">
          <h2 className="font-display text-xl text-primary">AI practice history</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {student.aiSessions.map((s) => (
              <li key={s.id} className="border-t py-2">
                {s.type} · {s.title} · score {s.overallScore ?? "—"} ·{" "}
                {s.createdAt.toLocaleString()}
              </li>
            ))}
            {!student.aiSessions.length && <li>No AI sessions yet.</li>}
          </ul>
        </section>

        <section className="rounded-2xl border bg-white/70 p-6">
          <h2 className="font-display text-xl text-primary">Quiz attempts</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {student.quizAttempts.map((q) => (
              <li key={q.id}>
                Attempt #{q.attemptNum} · {q.score}% · {q.passed ? "passed" : "failed"} ·{" "}
                {q.createdAt.toLocaleString()}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
