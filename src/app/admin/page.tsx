import Link from "next/link";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const user = await requireUser(["ADMIN", "INSTRUCTOR"]);
  if (!user) redirect("/sign-in");

  const [students, enrollments, certificates, aiSessions, cohorts, payments] =
    await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.enrollment.count(),
      prisma.certificate.count(),
      prisma.aiSession.count(),
      prisma.cohort.count({ where: { isActive: true } }),
      prisma.payment.count({ where: { status: "PAID" } }),
    ]);

  const recentEnrollments = await prisma.enrollment.findMany({
    take: 8,
    orderBy: { enrolledAt: "desc" },
    include: { user: true, course: true },
  });

  const recentPayments = await prisma.payment.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { user: true, course: true },
  });

  return (
    <div className="min-h-screen">
      <header className="bg-sidebar text-sidebar-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="font-display text-xl">Cascade Admin</p>
            <p className="text-sm opacity-75">
              {user.name} · {user.role}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="secondary">
              <Link href="/admin/students">Students</Link>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <Link href="/admin/cohorts">Cohorts</Link>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <Link href="/admin/curriculum">Curriculum</Link>
            </Button>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <h1 className="font-display text-3xl text-primary">Operations dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {[
            ["Students", students],
            ["Enrollments", enrollments],
            ["Paid checkouts", payments],
            ["Active cohorts", cohorts],
            ["Certificates", certificates],
            ["AI sessions", aiSessions],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl border bg-white/70 p-4">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="font-display text-3xl text-primary">{value}</p>
            </div>
          ))}
        </div>

        <section className="brutal-box-yellow p-6">
          <h2 className="font-display text-2xl text-primary">Curriculum CMS</h2>
          <p className="mt-2 max-w-3xl font-medium text-foreground/80">
            Edit course modules, chapters, lessons, videos, references, quizzes, and
            downloadable materials from the curriculum hub.
          </p>
          <Button asChild className="brutal-btn mt-4">
            <Link href="/admin/curriculum">Open curriculum CMS</Link>
          </Button>
        </section>

        <section className="rounded-2xl border bg-white/70 p-6">
          <h2 className="font-display text-xl text-primary">Recent enrollments</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2">Student</th>
                  <th>Course</th>
                  <th>Mode</th>
                  <th>Status</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {recentEnrollments.map((e) => (
                  <tr key={e.id} className="border-t">
                    <td className="py-2">
                      <Link className="underline" href={`/admin/students/${e.userId}`}>
                        {e.user.name}
                      </Link>
                    </td>
                    <td>{e.course.type}</td>
                    <td>{e.deliveryMode}</td>
                    <td>{e.status}</td>
                    <td>{Math.round(e.overallProgress)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border bg-white/70 p-6">
          <h2 className="font-display text-xl text-primary">Recent payments</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {recentPayments.map((p) => (
              <li key={p.id} className="border-t py-2">
                {p.user.name} · {p.course.type} · ${(p.amountCents / 100).toFixed(2)} ·{" "}
                {p.status}
                {p.paymentMethodTypes ? ` · ${p.paymentMethodTypes}` : ""}
              </li>
            ))}
            {!recentPayments.length && <li>No payments yet.</li>}
          </ul>
        </section>
      </main>
    </div>
  );
}
