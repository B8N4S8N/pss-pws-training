import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logoutAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const user = await requireUser(["ADMIN", "INSTRUCTOR"]);
  if (!user) redirect("/login");

  const [students, enrollments, certificates, aiSessions, cohorts] =
    await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.enrollment.count(),
      prisma.certificate.count(),
      prisma.aiSession.count(),
      prisma.cohort.count({ where: { isActive: true } }),
    ]);

  const recentEnrollments = await prisma.enrollment.findMany({
    take: 8,
    orderBy: { enrolledAt: "desc" },
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
          <div className="flex gap-2">
            <Button asChild size="sm" variant="secondary">
              <Link href="/admin/students">Students</Link>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <Link href="/admin/cohorts">Cohorts</Link>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <Link href="/admin/curriculum">Curriculum</Link>
            </Button>
            <form action={logoutAction}>
              <Button type="submit" size="sm" variant="outline" className="border-white/30 text-white">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <h1 className="font-display text-3xl text-primary">Operations dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Students", students],
            ["Enrollments", enrollments],
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
      </main>
    </div>
  );
}
