import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { markAttendanceAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Cohorts" };

export default async function CohortsPage() {
  const user = await requireUser(["ADMIN", "INSTRUCTOR"]);
  if (!user) redirect("/login");

  const cohorts = await prisma.cohort.findMany({
    include: {
      course: true,
      instructor: true,
      enrollments: { include: { user: true } },
      liveSessions: { orderBy: { startsAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white/80 px-4 py-4">
        <div className="mx-auto max-w-6xl">
          <Link href="/admin" className="text-sm text-muted-foreground">
            ← Admin
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 space-y-6">
        <h1 className="font-display text-3xl text-primary">Cohorts & attendance</h1>
        {cohorts.map((c) => (
          <section key={c.id} className="rounded-2xl border bg-white/70 p-6">
            <h2 className="font-display text-xl text-primary">{c.name}</h2>
            <p className="text-sm text-muted-foreground">
              {c.course.type} · {c.deliveryMode} · Instructor:{" "}
              {c.instructor?.name ?? "Unassigned"} · {c.enrollments.length} students
            </p>
            <p className="mt-2 text-sm">{c.liveSessionNotes}</p>

            <div className="mt-4">
              <h3 className="font-semibold text-sm">Live sessions</h3>
              <ul className="mt-2 space-y-3">
                {c.liveSessions.map((s) => (
                  <li key={s.id} className="rounded-xl bg-mist/60 p-3 text-sm">
                    <p className="font-medium">{s.title}</p>
                    <p>
                      {s.startsAt.toLocaleString("en-US", {
                        timeZone: "America/Los_Angeles",
                      })}{" "}
                      PT
                    </p>
                    {c.enrollments.slice(0, 5).map((e) => (
                      <form
                        key={e.id}
                        action={markAttendanceAction}
                        className="mt-2 flex flex-wrap items-center gap-2"
                      >
                        <input type="hidden" name="userId" value={e.userId} />
                        <input type="hidden" name="cohortId" value={c.id} />
                        <input type="hidden" name="liveSessionId" value={s.id} />
                        <input type="hidden" name="present" value="true" />
                        <input type="hidden" name="minutes" value="180" />
                        <span>{e.user.name}</span>
                        <Button size="sm" type="submit" variant="outline">
                          Mark present
                        </Button>
                      </form>
                    ))}
                  </li>
                ))}
                {!c.liveSessions.length && (
                  <li className="text-muted-foreground">No live sessions (AYOP cohort).</li>
                )}
              </ul>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
