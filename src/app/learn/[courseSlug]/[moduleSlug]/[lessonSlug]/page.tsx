import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LessonPlayer } from "@/components/lesson-player";

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
  });
  if (!lesson) notFound();

  return (
    <div className="min-h-screen">
      <header className="border-b border-primary/10 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-4 text-sm">
          <Link href={`/learn/${courseSlug}`} className="text-muted-foreground hover:text-primary">
            ← {mod.title}
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-xs uppercase tracking-wide text-accent">{lesson.type}</p>
        <h1 className="mt-1 font-display text-3xl text-primary">{lesson.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ~{lesson.estimatedMinutes} minutes
        </p>
        <div className="mt-8">
          <LessonPlayer courseSlug={courseSlug} lesson={lesson} />
        </div>
      </main>
    </div>
  );
}
