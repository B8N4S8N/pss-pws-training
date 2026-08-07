import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteLessonAction, upsertLessonAction } from "@/lib/cms-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const LESSON_TYPES = [
  "READING",
  "VIDEO",
  "QUIZ",
  "REFLECTION",
  "DOCUMENTATION",
  "SCENARIO",
  "ROLEPLAY",
  "LIVE_SESSION",
];

export default async function LessonCurriculumEditorPage({
  params,
}: {
  params: Promise<{ courseSlug: string; moduleSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, moduleSlug, lessonSlug } = await params;
  const user = await requireUser(["ADMIN", "INSTRUCTOR"]);
  if (!user) redirect("/sign-in");

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course) notFound();

  const courseModule = await prisma.module.findUnique({
    where: { courseId_slug: { courseId: course.id, slug: moduleSlug } },
    include: { chapters: { orderBy: { sortOrder: "asc" } } },
  });
  if (!courseModule) notFound();

  const lesson = await prisma.lesson.findUnique({
    where: { moduleId_slug: { moduleId: courseModule.id, slug: lessonSlug } },
    include: { chapter: true },
  });
  if (!lesson) notFound();

  return (
    <div className="min-h-screen">
      <header className="border-b-[3px] border-primary bg-white/90 px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            className="font-black text-primary underline"
            href={`/admin/curriculum/${course.slug}/${courseModule.slug}`}
          >
            Back to module editor
          </Link>
          <span className="text-sm font-bold text-muted-foreground">
            {user.name} · {user.role}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
        <section className="brutal-box-yellow p-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">
            Lesson editor
          </p>
          <h1 className="mt-2 font-display text-4xl text-primary">{lesson.title}</h1>
          <p className="mt-2 font-medium text-foreground/80">
            {course.type} · {courseModule.title}
            {lesson.chapter ? ` · ${lesson.chapter.title}` : ""} · {lesson.type}
          </p>
        </section>

        <form action={upsertLessonAction} className="brutal-box grid gap-4 p-6 md:grid-cols-2">
          <input type="hidden" name="id" value={lesson.id} />
          <input type="hidden" name="moduleId" value={courseModule.id} />
          <input type="hidden" name="courseSlug" value={course.slug} />
          <input type="hidden" name="moduleSlug" value={courseModule.slug} />

          <div>
            <Label htmlFor="lesson-title">Title</Label>
            <Input id="lesson-title" name="title" defaultValue={lesson.title} />
          </div>
          <div>
            <Label htmlFor="lesson-slug">Slug</Label>
            <Input id="lesson-slug" name="slug" defaultValue={lesson.slug} />
          </div>
          <div>
            <Label htmlFor="lesson-type">Type</Label>
            <select
              id="lesson-type"
              name="type"
              className="h-10 w-full border border-input bg-background px-3 text-sm"
              defaultValue={lesson.type}
            >
              {LESSON_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="lesson-chapter">Chapter</Label>
            <select
              id="lesson-chapter"
              name="chapterId"
              className="h-10 w-full border border-input bg-background px-3 text-sm"
              defaultValue={lesson.chapterId || ""}
            >
              <option value="">No chapter / standalone</option>
              {courseModule.chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="lesson-order">Order</Label>
            <Input
              id="lesson-order"
              name="orderIndex"
              type="number"
              defaultValue={lesson.orderIndex}
            />
          </div>
          <div>
            <Label htmlFor="lesson-minutes">Estimated minutes</Label>
            <Input
              id="lesson-minutes"
              name="estimatedMinutes"
              type="number"
              defaultValue={lesson.estimatedMinutes}
            />
          </div>
          <div>
            <Label htmlFor="lesson-pass-score">Pass score</Label>
            <Input
              id="lesson-pass-score"
              name="passScore"
              type="number"
              defaultValue={lesson.passScore}
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              id="lesson-module-quiz"
              name="isModuleQuiz"
              type="checkbox"
              defaultChecked={lesson.isModuleQuiz}
            />
            <Label htmlFor="lesson-module-quiz">This is the module quiz</Label>
          </div>

          <div>
            <Label htmlFor="lesson-video-url">Video URL</Label>
            <Input
              id="lesson-video-url"
              name="videoUrl"
              type="url"
              defaultValue={lesson.videoUrl || ""}
              placeholder="YouTube or Vimeo URL"
            />
          </div>
          <div>
            <Label htmlFor="lesson-video-provider">Video provider</Label>
            <Input
              id="lesson-video-provider"
              name="videoProvider"
              defaultValue={lesson.videoProvider || ""}
              placeholder="youtube, vimeo, other"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="lesson-storytelling-hook">Storytelling hook</Label>
            <Textarea
              id="lesson-storytelling-hook"
              name="storytellingHook"
              rows={3}
              defaultValue={lesson.storytellingHook || ""}
              placeholder="A short lived-experience prompt or scenario opener."
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="lesson-content">Lesson content markdown</Label>
            <Textarea
              id="lesson-content"
              name="contentMd"
              rows={18}
              defaultValue={lesson.contentMd}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Use blockquotes like {"> **Story:** ..."} or {"> **Practice:** ..."} for
              styled callouts.
            </p>
          </div>
          <div>
            <Label htmlFor="lesson-learning-modes">Learning modes</Label>
            <Textarea
              id="lesson-learning-modes"
              name="learningModes"
              rows={5}
              defaultValue={lesson.learningModes || ""}
              placeholder='JSON array or lines, e.g. "Watch", "Practice", "Reflect"'
            />
          </div>
          <div>
            <Label htmlFor="lesson-references">References</Label>
            <Textarea
              id="lesson-references"
              name="referencesJson"
              rows={5}
              defaultValue={lesson.referencesJson || ""}
              placeholder="JSON ReferenceLink[] or lines: Title | https://url | description"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="lesson-payload">Interactive payload JSON</Label>
            <Textarea
              id="lesson-payload"
              name="interactivePayload"
              rows={12}
              defaultValue={lesson.interactivePayload || ""}
              placeholder='{"questions":[...]} or {"scenario":"...","choices":[...]}'
            />
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <Button className="brutal-btn" type="submit">
              Save lesson
            </Button>
            <Button asChild variant="outline">
              <Link href={`/learn/${course.slug}/${courseModule.slug}/${lesson.slug}`}>
                Preview lesson
              </Link>
            </Button>
          </div>
        </form>

        <section className="brutal-box-copper p-6">
          <h2 className="font-display text-2xl">Delete lesson</h2>
          <p className="mt-2 text-sm">
            Hard delete is available for admin cleanup. This also removes progress,
            quiz attempts, reflections, and material lesson links through database
            relations.
          </p>
          <form action={deleteLessonAction} className="mt-4">
            <input type="hidden" name="id" value={lesson.id} />
            <input type="hidden" name="courseSlug" value={course.slug} />
            <input type="hidden" name="moduleSlug" value={courseModule.slug} />
            <input type="hidden" name="redirectToModule" value="true" />
            <Button variant="destructive" type="submit">
              Delete lesson
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}
