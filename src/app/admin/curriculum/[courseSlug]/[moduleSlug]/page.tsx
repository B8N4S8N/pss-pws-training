import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  deleteLessonAction,
  upsertChapterAction,
  upsertLessonAction,
  upsertModuleAction,
} from "@/lib/cms-actions";
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

export default async function ModuleCurriculumEditorPage({
  params,
}: {
  params: Promise<{ courseSlug: string; moduleSlug: string }>;
}) {
  const { courseSlug, moduleSlug } = await params;
  const user = await requireUser(["ADMIN", "INSTRUCTOR"]);
  if (!user) redirect("/sign-in");

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course) notFound();

  const courseModule = await prisma.module.findUnique({
    where: { courseId_slug: { courseId: course.id, slug: moduleSlug } },
    include: {
      chapters: {
        orderBy: { sortOrder: "asc" },
        include: { lessons: { orderBy: { orderIndex: "asc" } } },
      },
      lessons: { orderBy: { orderIndex: "asc" } },
    },
  });
  if (!courseModule) notFound();

  const standaloneLessons = courseModule.chapters.length
    ? courseModule.lessons.filter((lesson) => !lesson.chapterId)
    : courseModule.lessons;
  const lessonGroups = courseModule.chapters.length
    ? [
        ...courseModule.chapters.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          description: chapter.description,
          lessons: chapter.lessons,
        })),
        ...(standaloneLessons.length
          ? [
              {
                id: `${courseModule.id}-standalone`,
                title: "Standalone lessons",
                description: null,
                lessons: standaloneLessons,
              },
            ]
          : []),
      ]
    : [
        {
          id: `${courseModule.id}-flat`,
          title: "Lessons",
          description: null,
          lessons: standaloneLessons,
        },
      ];

  return (
    <div className="min-h-screen">
      <header className="border-b-[3px] border-primary bg-white/90 px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            className="font-black text-primary underline"
            href={`/admin/curriculum/${course.slug}`}
          >
            Back to {course.type} editor
          </Link>
          <span className="text-sm font-bold text-muted-foreground">
            {user.name} · {user.role}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <section className="brutal-box-yellow p-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">
            Module editor
          </p>
          <h1 className="mt-2 font-display text-4xl text-primary">{courseModule.title}</h1>
          <p className="mt-2 font-medium text-foreground/80">
            {courseModule.chapters.length} chapters · {courseModule.lessons.length} lessons ·{" "}
            {courseModule.estimatedHours} hours
          </p>
        </section>

        <section className="brutal-box p-6">
          <h2 className="font-display text-2xl text-primary">Module details</h2>
          <form action={upsertModuleAction} className="mt-4 grid gap-3 md:grid-cols-2">
            <input type="hidden" name="id" value={courseModule.id} />
            <input type="hidden" name="courseId" value={course.id} />
            <input type="hidden" name="courseSlug" value={course.slug} />
            <div>
              <Label htmlFor="module-title">Title</Label>
              <Input id="module-title" name="title" defaultValue={courseModule.title} />
            </div>
            <div>
              <Label htmlFor="module-slug">Slug</Label>
              <Input id="module-slug" name="slug" defaultValue={courseModule.slug} />
            </div>
            <div>
              <Label htmlFor="module-order">Order</Label>
              <Input
                id="module-order"
                name="orderIndex"
                type="number"
                defaultValue={courseModule.orderIndex}
              />
            </div>
            <div>
              <Label htmlFor="module-hours">Hours</Label>
              <Input
                id="module-hours"
                name="estimatedHours"
                type="number"
                step="0.25"
                defaultValue={courseModule.estimatedHours}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="module-description">Description</Label>
              <Textarea
                id="module-description"
                name="description"
                rows={3}
                defaultValue={courseModule.description}
              />
            </div>
            <div>
              <Label htmlFor="module-oar">OAR references</Label>
              <Textarea
                id="module-oar"
                name="oarReferences"
                rows={3}
                defaultValue={JSON.parse(courseModule.oarReferences).join("\n")}
              />
            </div>
            <div>
              <Label htmlFor="module-competencies">Competencies</Label>
              <Textarea
                id="module-competencies"
                name="competencies"
                rows={3}
                defaultValue={JSON.parse(courseModule.competencies).join("\n")}
              />
            </div>
            <Button className="brutal-btn md:col-span-2" type="submit">
              Save module
            </Button>
          </form>
        </section>

        <section className="brutal-box p-6">
          <h2 className="font-display text-2xl text-primary">Chapters</h2>
          <div className="mt-4 space-y-4">
            {courseModule.chapters.map((chapter) => (
              <form
                key={chapter.id}
                action={upsertChapterAction}
                className="grid gap-3 border-[3px] border-primary bg-mist/60 p-4 md:grid-cols-[1fr_1fr_120px_auto] md:items-end"
              >
                <input type="hidden" name="id" value={chapter.id} />
                <input type="hidden" name="moduleId" value={courseModule.id} />
                <input type="hidden" name="courseSlug" value={course.slug} />
                <input type="hidden" name="moduleSlug" value={courseModule.slug} />
                <div>
                  <Label htmlFor={`chapter-title-${chapter.id}`}>Title</Label>
                  <Input
                    id={`chapter-title-${chapter.id}`}
                    name="title"
                    defaultValue={chapter.title}
                  />
                </div>
                <div>
                  <Label htmlFor={`chapter-slug-${chapter.id}`}>Slug</Label>
                  <Input
                    id={`chapter-slug-${chapter.id}`}
                    name="slug"
                    defaultValue={chapter.slug}
                  />
                </div>
                <div>
                  <Label htmlFor={`chapter-order-${chapter.id}`}>Order</Label>
                  <Input
                    id={`chapter-order-${chapter.id}`}
                    name="sortOrder"
                    type="number"
                    defaultValue={chapter.sortOrder}
                  />
                </div>
                <Button className="brutal-btn" type="submit">
                  Save
                </Button>
                <div className="md:col-span-4">
                  <Label htmlFor={`chapter-description-${chapter.id}`}>Description</Label>
                  <Textarea
                    id={`chapter-description-${chapter.id}`}
                    name="description"
                    rows={2}
                    defaultValue={chapter.description || ""}
                  />
                </div>
              </form>
            ))}
          </div>

          <form
            action={upsertChapterAction}
            className="mt-6 grid gap-3 border-[3px] border-primary bg-white p-4 md:grid-cols-2"
          >
            <input type="hidden" name="moduleId" value={courseModule.id} />
            <input type="hidden" name="courseSlug" value={course.slug} />
            <input type="hidden" name="moduleSlug" value={courseModule.slug} />
            <div>
              <Label htmlFor="new-chapter-title">New chapter title</Label>
              <Input id="new-chapter-title" name="title" required />
            </div>
            <div>
              <Label htmlFor="new-chapter-slug">Slug</Label>
              <Input id="new-chapter-slug" name="slug" placeholder="auto if blank" />
            </div>
            <div>
              <Label htmlFor="new-chapter-order">Sort order</Label>
              <Input
                id="new-chapter-order"
                name="sortOrder"
                type="number"
                defaultValue={courseModule.chapters.length + 1}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="new-chapter-description">Description</Label>
              <Textarea id="new-chapter-description" name="description" rows={2} />
            </div>
            <Button className="brutal-btn md:col-span-2" type="submit">
              Add chapter
            </Button>
          </form>
        </section>

        <section className="brutal-box p-6">
          <h2 className="font-display text-2xl text-primary">Lessons</h2>
          <div className="mt-5 space-y-5">
            {lessonGroups.map((group) => (
              <div key={group.id} className="border-l-[6px] border-primary pl-4">
                <h3 className="font-display text-xl text-primary">{group.title}</h3>
                {group.description && (
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                )}
                <div className="mt-3 space-y-3">
                  {group.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex flex-wrap items-center justify-between gap-3 border-[3px] border-primary bg-white p-3 shadow-[3px_3px_0_#143028]"
                    >
                      <div>
                        <p className="font-black text-primary">
                          {lesson.orderIndex}. {lesson.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {lesson.isModuleQuiz ? "MODULE QUIZ · " : ""}
                          {lesson.type} · {lesson.estimatedMinutes} min
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild variant="outline">
                          <Link
                            href={`/admin/curriculum/${course.slug}/${courseModule.slug}/${lesson.slug}`}
                          >
                            Edit
                          </Link>
                        </Button>
                        <form action={deleteLessonAction}>
                          <input type="hidden" name="id" value={lesson.id} />
                          <input type="hidden" name="courseSlug" value={course.slug} />
                          <input type="hidden" name="moduleSlug" value={courseModule.slug} />
                          <Button variant="destructive" type="submit">
                            Delete
                          </Button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <form
            action={upsertLessonAction}
            className="mt-6 grid gap-3 border-[3px] border-primary bg-mist/60 p-4 md:grid-cols-2"
          >
            <input type="hidden" name="moduleId" value={courseModule.id} />
            <input type="hidden" name="courseSlug" value={course.slug} />
            <input type="hidden" name="moduleSlug" value={courseModule.slug} />
            <div>
              <Label htmlFor="new-lesson-title">Lesson title</Label>
              <Input id="new-lesson-title" name="title" required />
            </div>
            <div>
              <Label htmlFor="new-lesson-slug">Slug</Label>
              <Input id="new-lesson-slug" name="slug" placeholder="auto if blank" />
            </div>
            <div>
              <Label htmlFor="new-lesson-type">Type</Label>
              <select
                id="new-lesson-type"
                name="type"
                className="h-10 w-full border border-input bg-background px-3 text-sm"
                defaultValue="READING"
              >
                {LESSON_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="new-lesson-chapter">Chapter</Label>
              <select
                id="new-lesson-chapter"
                name="chapterId"
                className="h-10 w-full border border-input bg-background px-3 text-sm"
                defaultValue=""
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
              <Label htmlFor="new-lesson-order">Order</Label>
              <Input
                id="new-lesson-order"
                name="orderIndex"
                type="number"
                defaultValue={courseModule.lessons.length + 1}
              />
            </div>
            <div>
              <Label htmlFor="new-lesson-minutes">Minutes</Label>
              <Input
                id="new-lesson-minutes"
                name="estimatedMinutes"
                type="number"
                defaultValue="20"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="new-lesson-content">Content</Label>
              <Textarea
                id="new-lesson-content"
                name="contentMd"
                rows={6}
                defaultValue="# New lesson"
              />
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <input id="new-lesson-quiz" name="isModuleQuiz" type="checkbox" />
              <Label htmlFor="new-lesson-quiz">This is the module quiz</Label>
            </div>
            <Button className="brutal-btn md:col-span-2" type="submit">
              Add lesson
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}
