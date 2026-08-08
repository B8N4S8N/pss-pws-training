import Link from "next/link";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Student Dashboard" };

export default async function DashboardPage() {
  const user = await requireUser();
  if (!user) redirect("/sign-in");
  if (user.role === "ADMIN" || user.role === "INSTRUCTOR") redirect("/admin");

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: true,
      cohort: { include: { liveSessions: { orderBy: { startsAt: "asc" } } } },
    },
  });

  const aiCount = await prisma.aiSession.count({ where: { userId: user.id } });
  const certificates = await prisma.certificate.findMany({
    where: { userId: user.id, revoked: false },
  });
  const payments = await prisma.payment.findMany({
    where: { userId: user.id },
    include: { course: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="min-h-screen">
      <header className="border-b border-primary/10 bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="font-display text-xl">Cascade Peer Academy</p>
            <p className="text-sm text-primary-foreground/75">Welcome, {user.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="secondary" size="sm">
              <Link href="/enroll">Enroll / pay</Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link href="/practice">Practice Lab</Link>
            </Button>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        {!enrollments.length && (
          <section className="rounded-2xl border border-accent/30 bg-white/80 p-6">
            <h2 className="font-display text-xl text-primary">Complete enrollment</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign-in is done. Next, pay for PSS or PWS (card, or Klarna/Afterpay when
              offered) to unlock your coursework.
            </p>
            <Button asChild className="mt-4 bg-accent text-accent-foreground">
              <Link href="/enroll">Choose a program & pay</Link>
            </Button>
          </section>
        )}

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-primary/10 bg-white/70 p-5">
            <p className="text-sm text-muted-foreground">Active enrollments</p>
            <p className="mt-1 font-display text-3xl text-primary">{enrollments.length}</p>
          </div>
          <div className="rounded-2xl border border-primary/10 bg-white/70 p-5">
            <p className="text-sm text-muted-foreground">AI practice sessions</p>
            <p className="mt-1 font-display text-3xl text-primary">{aiCount}</p>
          </div>
          <div className="rounded-2xl border border-primary/10 bg-white/70 p-5">
            <p className="text-sm text-muted-foreground">Certificates</p>
            <p className="mt-1 font-display text-3xl text-primary">{certificates.length}</p>
          </div>
        </section>

        <section>
          <h1 className="font-display text-3xl text-primary">Your courses</h1>
          <div className="mt-6 space-y-4">
            {enrollments.map((e) => (
              <div
                key={e.id}
                className="rounded-2xl border border-primary/10 bg-white/70 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl text-primary">{e.course.title}</h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary">{e.course.type}</Badge>
                      <Badge variant="outline">{e.deliveryMode}</Badge>
                      <Badge>{e.status}</Badge>
                    </div>
                  </div>
                  <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href={`/learn/${e.course.slug}`}>Continue learning</Link>
                  </Button>
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(e.overallProgress)}%</span>
                  </div>
                  <Progress value={e.overallProgress} />
                  <p className="mt-2 text-sm text-muted-foreground">
                    ~{e.hoursLogged.toFixed(1)} / {e.course.contactHours} contact hours
                    logged
                  </p>
                </div>
                {e.cohort && e.deliveryMode === "HYBRID" && (
                  <div className="mt-4 rounded-xl bg-mist/70 p-4 text-sm">
                    <p className="font-semibold text-primary">Upcoming live sessions</p>
                    <ul className="mt-2 space-y-1">
                      {e.cohort.liveSessions.slice(0, 3).map((s) => (
                        <li key={s.id}>
                          {s.title} —{" "}
                          {s.startsAt.toLocaleString("en-US", {
                            timeZone: "America/Los_Angeles",
                          })}{" "}
                          PT
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {payments.length > 0 && (
          <section>
            <h2 className="font-display text-2xl text-primary">Payments</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {payments.map((p) => (
                <li key={p.id} className="rounded-xl border bg-white/70 px-4 py-3">
                  {p.course.type} · ${(p.amountCents / 100).toFixed(2)} · {p.status}
                  {p.paymentMethodTypes ? ` · ${p.paymentMethodTypes}` : ""}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-4">
          <Link
            href="/learn/personalize"
            className="rounded-2xl border border-primary/10 bg-white/70 p-5 hover:border-accent"
          >
            <h3 className="font-display text-lg text-primary">Personalize</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              AI-created modules in your learning style
            </p>
          </Link>
          <Link
            href="/practice"
            className="rounded-2xl border border-primary/10 bg-white/70 p-5 hover:border-accent"
          >
            <h3 className="font-display text-lg text-primary">AI Practice Lab</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Roleplay clients & scored feedback
            </p>
          </Link>
          <Link
            href="/tutor"
            className="rounded-2xl border border-primary/10 bg-white/70 p-5 hover:border-accent"
          >
            <h3 className="font-display text-lg text-primary">AI Tutor</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Ask about any competency domain
            </p>
          </Link>
          <Link
            href="/interview"
            className="rounded-2xl border border-primary/10 bg-white/70 p-5 hover:border-accent"
          >
            <h3 className="font-display text-lg text-primary">Mock Interview</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Technical peer hiring practice
            </p>
          </Link>
        </section>

        {certificates.length > 0 && (
          <section>
            <h2 className="font-display text-2xl text-primary">
              Certificates of completion
            </h2>
            <ul className="mt-4 space-y-2">
              {certificates.map((c) => (
                <li key={c.id} className="rounded-xl border bg-white/70 px-4 py-3 text-sm">
                  {c.courseType} — {c.certificateCode} — {c.hoursCompleted} hours — issued{" "}
                  {c.issuedAt.toLocaleDateString()}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
