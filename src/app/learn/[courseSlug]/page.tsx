import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

function lessonKindLabel(lesson: {
  type: string;
  isModuleQuiz?: boolean;
  isModuleAiReview?: boolean;
  interactivePayload?: string | null;
}) {
  let payloadKind: string | undefined;
  if (lesson.interactivePayload) {
    try {
      payloadKind = JSON.parse(lesson.interactivePayload)?.kind;
    } catch {
      payloadKind = undefined;
    }
  }
  if (
    lesson.type === "MODULE_AI_REVIEW" ||
    lesson.isModuleAiReview ||
    payloadKind === "moduleAiReview"
  ) {
    return "AI MODULE REVIEW";
  }
  if (lesson.isModuleQuiz) return "SECTION QUIZ";
  return lesson.type;
}

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
        include: {
          chapters: {
            orderBy: { sortOrder: "asc" },
            include: { lessons: { orderBy: { orderIndex: "asc" } } },
          },
          lessons: { orderBy: { orderIndex: "asc" } },
        },
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
      <header className="border-b-[3px] border-primary bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link
            href="/dashboard"
            className="brutal-active border-[3px] border-primary bg-white px-3 py-1 text-sm font-black shadow-[3px_3px_0_#143028] hover:bg-[#f4e04d]"
          >
            Back to dashboard
          </Link>
          <Badge className="brutal-box-copper rounded-none px-3 py-1">
            {course.type}
          </Badge>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="brutal-box-yellow p-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">
            Your learning map
          </p>
          <h1 className="mt-2 font-display text-4xl text-primary">{course.title}</h1>
          <p className="mt-2 max-w-3xl font-medium text-foreground/80">
            {course.subtitle}
          </p>
        </div>
        <div className="brutal-box mt-6 p-4">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-black uppercase tracking-wide">Course progress</span>
            <span className="font-bold">
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
            const orphanLessons = mod.chapters.length
              ? mod.lessons.filter((lesson) => !lesson.chapterId)
              : mod.lessons;
            const lessonGroups = mod.chapters.length
              ? [
                  ...mod.chapters.map((chapter) => ({
                    id: chapter.id,
                    title: chapter.title,
                    description: chapter.description,
                    lessons: chapter.lessons,
                  })),
                  ...(orphanLessons.length
                    ? [
                        {
                          id: `${mod.id}-standalone`,
                          title: "Standalone lessons",
                          description: null,
                          lessons: orphanLessons,
                        },
                      ]
                    : []),
                ]
              : [
                  {
                    id: `${mod.id}-flat`,
                    title: "Lessons",
                    description: null,
                    lessons: orphanLessons,
                  },
                ];
            return (
              <section
                key={mod.id}
                className="brutal-box animate-pop-in p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-display text-2xl text-primary">{mod.title}</h2>
                  <span className="brutal-box-yellow px-3 py-1 text-sm font-black">
                    {mod.estimatedHours}h · {modDone}/{mod.lessons.length}
                  </span>
                </div>
                <p className="mt-2 text-sm text-foreground/80">{mod.description}</p>
                <div className="mt-5 space-y-5">
                  {lessonGroups.map((group) => (
                    <div key={group.id} className="border-l-[6px] border-primary pl-4">
                      {mod.chapters.length > 0 && (
                        <div className="mb-3">
                          <h3 className="font-display text-lg text-primary">
                            {group.title}
                          </h3>
                          {group.description && (
                            <p className="text-sm text-muted-foreground">
                              {group.description}
                            </p>
                          )}
                        </div>
                      )}
                      <ul className="space-y-2">
                        {group.lessons.map((lesson) => {
                          const st =
                            progressMap.get(lesson.id)?.status || "NOT_STARTED";
                          return (
                            <li key={lesson.id}>
                              <Link
                                href={`/learn/${course.slug}/${mod.slug}/${lesson.slug}`}
                                className="brutal-active flex items-center justify-between gap-4 border-[3px] border-primary bg-white px-3 py-3 shadow-[3px_3px_0_#143028] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#e8f2eb] hover:shadow-[5px_5px_0_#143028]"
                              >
                                <span className="text-sm">
                                  <span className="mr-2 text-xs font-black uppercase text-accent">
                                    {lessonKindLabel(lesson)}
                                  </span>
                                  {lesson.title}
                                </span>
                                <Badge
                                  variant={st === "COMPLETED" ? "default" : "outline"}
                                  className={
                                    lesson.isModuleQuiz || lessonKindLabel(lesson) === "AI MODULE REVIEW"
                                      ? "brutal-box-yellow rounded-none text-xs"
                                      : "rounded-none text-xs"
                                  }
                                >
                                  {st.replace("_", " ")}
                                </Badge>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
