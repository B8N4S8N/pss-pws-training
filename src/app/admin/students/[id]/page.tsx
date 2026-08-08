import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { saveCompetencyEvaluationAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ReviewMessage = {
  role?: string;
  content?: string;
};

type ReviewFeedback = {
  passed?: boolean;
  strengths?: string[];
  growthAreas?: string[];
  rubricScores?: Record<string, number>;
  coachingNotes?: string;
  redFlags?: string[];
  recommendMorePractice?: boolean;
};

function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function labelFromKey(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const actor = await requireUser(["ADMIN", "INSTRUCTOR"]);
  if (!actor) redirect("/sign-in");

  const student = await prisma.user.findUnique({
    where: { id },
    include: {
      enrollments: { include: { course: true, cohort: true } },
      lessonProgress: { include: { lesson: true }, take: 50 },
      quizAttempts: { orderBy: { createdAt: "desc" }, take: 20 },
      aiSessions: {
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { persona: true, lesson: { include: { module: true } } },
      },
      attendanceRecords: true,
      certificates: true,
      evaluations: { include: { instructor: true }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!student) notFound();
  const moduleReviews = student.aiSessions.filter(
    (session) => session.type === "MODULE_REVIEW"
  );

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
          <h2 className="font-display text-xl text-primary">
            AI module review recordings
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            These conversations are practice evidence for supervision. They do not
            replace instructor certification decisions.
          </p>
          <div className="mt-4 space-y-4">
            {moduleReviews.map((session) => {
              const feedback = parseJson<ReviewFeedback>(session.feedbackJson, {});
              const messages = parseJson<ReviewMessage[]>(session.messagesJson, []);
              return (
                <article
                  key={session.id}
                  className="border-[3px] border-primary bg-white p-4 shadow-[3px_3px_0_#143028]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg text-primary">
                        {session.lesson?.module.title || "Module review"}
                      </h3>
                      <p className="text-sm font-medium">
                        {session.lesson?.title || session.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(session.completedAt || session.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-none border-[3px] border-primary bg-[#f4e04d] px-3 py-1 text-sm font-black shadow-[2px_2px_0_#143028]">
                      Score {session.overallScore ?? "-"}
                      {feedback.passed === undefined
                        ? ""
                        : feedback.passed
                          ? " · passed"
                          : " · needs review"}
                    </div>
                  </div>

                  {feedback.rubricScores && (
                    <div className="mt-3 grid gap-2 md:grid-cols-4">
                      {Object.entries(feedback.rubricScores).map(([key, score]) => (
                        <div key={key} className="rounded-lg border bg-mist/50 p-2">
                          <p className="text-[10px] font-black uppercase text-primary">
                            {labelFromKey(key)}
                          </p>
                          <p className="font-display text-xl">{score}%</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-black uppercase text-primary">
                        Growth areas
                      </p>
                      <ul className="mt-1 list-disc pl-5 text-sm">
                        {(feedback.growthAreas || ["No growth areas recorded."]).map(
                          (item) => (
                            <li key={item}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-primary">
                        Red flags
                      </p>
                      <ul className="mt-1 list-disc pl-5 text-sm">
                        {(feedback.redFlags?.length
                          ? feedback.redFlags
                          : ["None recorded."]
                        ).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {feedback.coachingNotes && (
                    <p className="mt-3 rounded-lg bg-mist p-3 text-sm">
                      {feedback.coachingNotes}
                    </p>
                  )}

                  <details className="mt-3 rounded-lg border bg-white p-3 text-sm">
                    <summary className="cursor-pointer font-black text-primary">
                      Transcript ({messages.length} messages)
                    </summary>
                    <div className="mt-3 space-y-2">
                      {messages.map((message, index) => (
                        <div key={index} className="rounded bg-mist/60 p-2">
                          <p className="text-[10px] font-black uppercase text-primary">
                            {message.role === "user" ? "Student" : "Cascade Guide"}
                          </p>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                </article>
              );
            })}
            {!moduleReviews.length && (
              <p className="text-sm text-muted-foreground">
                No AI module reviews recorded yet.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border bg-white/70 p-6">
          <h2 className="font-display text-xl text-primary">AI practice history</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {student.aiSessions
              .filter((s) => s.type !== "MODULE_REVIEW")
              .map((s) => (
              <li key={s.id} className="border-t py-2">
                {s.type} · {s.title} · score {s.overallScore ?? "—"} ·{" "}
                {s.createdAt.toLocaleString()}
              </li>
            ))}
            {!student.aiSessions.filter((s) => s.type !== "MODULE_REVIEW").length && (
              <li>No other AI sessions yet.</li>
            )}
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
