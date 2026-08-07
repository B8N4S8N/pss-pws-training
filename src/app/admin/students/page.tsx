import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { issueCertificateAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Students" };

export default async function AdminStudentsPage() {
  const user = await requireUser(["ADMIN", "INSTRUCTOR"]);
  if (!user) redirect("/login");

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {
      enrollments: { include: { course: true } },
      certificates: true,
      aiSessions: { take: 1, orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white/80 px-4 py-4">
        <div className="mx-auto flex max-w-6xl justify-between">
          <Link href="/admin" className="text-sm text-muted-foreground">
            ← Admin
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-3xl text-primary">Students & records</h1>
        <div className="mt-6 space-y-4">
          {students.map((s) => (
            <div key={s.id} className="rounded-2xl border bg-white/70 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/admin/students/${s.id}`}
                    className="font-display text-xl text-primary underline"
                  >
                    {s.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{s.email}</p>
                  <p className="mt-1 text-sm">{s.peerIdentity}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {s.enrollments.map((e) => (
                    <form
                      key={e.id}
                      action={async () => {
                        "use server";
                        await issueCertificateAction(s.id, e.course.type);
                      }}
                    >
                      <Button type="submit" size="sm" variant="outline">
                        Issue {e.course.type} certificate
                      </Button>
                    </form>
                  ))}
                </div>
              </div>
              <ul className="mt-3 text-sm text-muted-foreground">
                {s.enrollments.map((e) => (
                  <li key={e.id}>
                    {e.course.title} · {e.deliveryMode} · {Math.round(e.overallProgress)}% ·{" "}
                    {e.status}
                  </li>
                ))}
              </ul>
              {s.certificates.length > 0 && (
                <p className="mt-2 text-xs">
                  Certificates:{" "}
                  {s.certificates.map((c) => c.certificateCode).join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
