import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LessonPlayer } from "@/components/lesson-player";
import { Badge } from "@/components/ui/badge";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; moduleSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, moduleSlug, lessonSlug } = await params;
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course) notFound();

  const mod = await prisma.module.findUnique({
    where: { courseId_slug: { courseId: course.id, slug: moduleSlug } },
  });
  if (!mod) notFound();

  const lesson = await prisma.lesson.findUnique({
    where: { moduleId_slug: { moduleId: mod.id, slug: lessonSlug } },
    include: { chapter: true },
  });
  if (!lesson) notFound();

  return (
    <div className="min-h-screen">
      <header className="border-b-[3px] border-primary bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-4 text-sm">
          <Link
            href={`/learn/${courseSlug}`}
            className="brutal-active inline-block border-[3px] border-primary bg-white px-3 py-1 font-black shadow-[3px_3px_0_#143028] hover:bg-[#f4e04d]"
          >
            Back to {mod.title}
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="brutal-box-yellow p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="brutal-box-copper rounded-none px-3 py-1">
              {lesson.type}
            </Badge>
            {lesson.isModuleQuiz && (
              <Badge className="brutal-box rounded-none px-3 py-1">
                Module quiz
              </Badge>
            )}
          </div>
          <h1 className="mt-4 font-display text-4xl text-primary">{lesson.title}</h1>
          <p className="mt-3 text-sm font-bold text-primary/80">
            {course.title} · {mod.title}
            {lesson.chapter ? ` · ${lesson.chapter.title}` : ""} · ~
            {lesson.estimatedMinutes} minutes
          </p>
          <p className="mt-4 max-w-2xl text-base font-medium text-foreground/80">
            Settle in, take what is useful, and mark the work complete when you are
            ready.
          </p>
        </div>
        <div className="mt-8">
          <LessonPlayer courseSlug={courseSlug} lesson={lesson} />
        </div>
      </main>
    </div>
  );
}
