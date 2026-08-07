import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default async function CourseLearnPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      modules: {
        orderBy: { orderIndex: "asc" },
        include: { lessons: { orderBy: { orderIndex: "asc" } } },
      },
    },
  });
  if (!course) notFound();

  const progress = await prisma.lessonProgress.findMany({
    where: { userId: user.id },
  });
  const progressMap = new Map(progress.map((p) => [p.lessonId, p]));

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const completed = allLessons.filter(
    (l) => progressMap.get(l.id)?.status === "COMPLETED"
  ).length;
  const pct = allLessons.length ? (completed / allLessons.length) * 100 : 0;

  return (
    <div className="min-h-screen">
      <header className="border-b border-primary/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary">
            ← Dashboard
          </Link>
          <Badge>{course.type}</Badge>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-3xl text-primary">{course.title}</h1>
        <p className="mt-2 text-muted-foreground">{course.subtitle}</p>
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm">
            <span>Course progress</span>
            <span>
              {completed}/{allLessons.length} lessons · {Math.round(pct)}%
            </span>
          </div>
          <Progress value={pct} />
        </div>

        <div className="mt-10 space-y-6">
          {course.modules.map((mod) => {
            const modDone = mod.lessons.filter(
              (l) => progressMap.get(l.id)?.status === "COMPLETED"
            ).length;
            return (
              <section
                key={mod.id}
                className="rounded-2xl border border-primary/10 bg-white/70 p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-display text-xl text-primary">{mod.title}</h2>
                  <span className="text-sm text-muted-foreground">
                    {mod.estimatedHours}h · {modDone}/{mod.lessons.length}
                  </span>
                </div>
                <p className="mt-2 text-sm text-foreground/80">{mod.description}</p>
                <ul className="mt-4 space-y-2">
                  {mod.lessons.map((lesson) => {
                    const st = progressMap.get(lesson.id)?.status || "NOT_STARTED";
                    return (
                      <li key={lesson.id}>
                        <Link
                          href={`/learn/${course.slug}/${mod.slug}/${lesson.slug}`}
                          className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-mist/80"
                        >
                          <span className="text-sm">
                            <span className="mr-2 text-xs uppercase text-muted-foreground">
                              {lesson.type}
                            </span>
                            {lesson.title}
                          </span>
                          <Badge
                            variant={st === "COMPLETED" ? "default" : "outline"}
                            className="text-xs"
                          >
                            {st.replace("_", " ")}
                          </Badge>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
