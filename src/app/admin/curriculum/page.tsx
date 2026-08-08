import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata = { title: "Curriculum" };

export default async function CurriculumAdminPage() {
  const user = await requireUser(["ADMIN", "INSTRUCTOR"]);
  if (!user) redirect("/sign-in");

  const courses = await prisma.course.findMany({
    include: {
      modules: {
        orderBy: { orderIndex: "asc" },
        include: {
          chapters: { orderBy: { sortOrder: "asc" } },
          lessons: { orderBy: { orderIndex: "asc" } },
        },
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
        <section className="brutal-box-yellow p-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">
            Curriculum CMS
          </p>
          <h1 className="mt-2 font-display text-4xl text-primary">Curriculum map</h1>
          <p className="mt-2 font-medium text-foreground/80">
            OHA-aligned module inventory and staff editing hub for Cascade Peer
            Academy.
          </p>
        </section>
        {courses.map((course) => (
          <section key={course.id} className="brutal-box p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl text-primary">
                {course.type}: {course.title}
              </h2>
              <Link
                className="brutal-box-yellow px-3 py-2 text-sm font-black"
                href={`/admin/curriculum/${course.slug}`}
              >
                Edit course
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              {course.contactHours} contact hours · {course.modules.length} modules ·{" "}
              {course.modules.reduce((n, m) => n + m.chapters.length, 0)} chapters ·{" "}
              {course.modules.reduce((n, m) => n + m.lessons.length, 0)} lessons
            </p>
            <ol className="mt-4 space-y-3">
              {course.modules.map((m) => (
                <li
                  key={m.id}
                  className="border-[3px] border-primary bg-mist/60 p-3 text-sm shadow-[3px_3px_0_#143028]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">
                      {m.orderIndex}. {m.title} ({m.estimatedHours}h)
                    </p>
                    <Link
                      className="font-black text-primary underline"
                      href={`/admin/curriculum/${course.slug}/${m.slug}`}
                    >
                      Edit module
                    </Link>
                  </div>
                  <p className="text-muted-foreground">
                    OAR: {JSON.parse(m.oarReferences).join(", ")}
                  </p>
                  <p className="mt-1">
                    {m.chapters.length} chapters · Lessons:{" "}
                    {m.lessons.map((l) => l.title).join(" · ")}
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
