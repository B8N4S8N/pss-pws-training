import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata = { title: "Curriculum" };

export default async function CurriculumAdminPage() {
  const user = await requireUser(["ADMIN", "INSTRUCTOR"]);
  if (!user) redirect("/login");

  const courses = await prisma.course.findMany({
    include: {
      modules: {
        orderBy: { orderIndex: "asc" },
        include: { lessons: { orderBy: { orderIndex: "asc" } } },
      },
    },
    orderBy: { contactHours: "asc" },
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
      <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <h1 className="font-display text-3xl text-primary">Curriculum map</h1>
        <p className="text-muted-foreground">
          OHA-aligned module inventory for TEMPS/OHA training program submission packages.
        </p>
        {courses.map((course) => (
          <section key={course.id} className="rounded-2xl border bg-white/70 p-6">
            <h2 className="font-display text-2xl text-primary">
              {course.type}: {course.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {course.contactHours} contact hours · {course.modules.length} modules ·{" "}
              {course.modules.reduce((n, m) => n + m.lessons.length, 0)} lessons
            </p>
            <ol className="mt-4 space-y-3">
              {course.modules.map((m) => (
                <li key={m.id} className="rounded-xl bg-mist/50 p-3 text-sm">
                  <p className="font-semibold">
                    {m.orderIndex}. {m.title} ({m.estimatedHours}h)
                  </p>
                  <p className="text-muted-foreground">
                    OAR: {JSON.parse(m.oarReferences).join(", ")}
                  </p>
                  <p className="mt-1">
                    Lessons: {m.lessons.map((l) => l.title).join(" · ")}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </main>
    </div>
  );
}
