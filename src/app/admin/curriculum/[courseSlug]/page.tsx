import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  createCourseMaterialAction,
  deleteCourseMaterialAction,
  upsertModuleAction,
} from "@/lib/cms-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function CourseCurriculumEditorPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const user = await requireUser(["ADMIN", "INSTRUCTOR"]);
  if (!user) redirect("/sign-in");

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      modules: {
        orderBy: { orderIndex: "asc" },
        include: {
          chapters: { orderBy: { sortOrder: "asc" } },
          lessons: { orderBy: { orderIndex: "asc" } },
        },
      },
      materials: {
        orderBy: { sortOrder: "asc" },
        include: { lesson: true, createdBy: true },
      },
    },
  });
  if (!course) notFound();

  const allLessons = course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      id: lesson.id,
      title: `${module.title}: ${lesson.title}`,
    }))
  );

  return (
    <div className="min-h-screen">
      <header className="border-b-[3px] border-primary bg-white/90 px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link className="font-black text-primary underline" href="/admin/curriculum">
            Back to curriculum
          </Link>
          <span className="text-sm font-bold text-muted-foreground">
            {user.name} · {user.role}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <section className="brutal-box-yellow p-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">
            Course editor
          </p>
          <h1 className="mt-2 font-display text-4xl text-primary">{course.title}</h1>
          <p className="mt-2 font-medium text-foreground/80">
            {course.contactHours} contact hours · {course.modules.length} modules ·{" "}
            {course.modules.reduce((count, module) => count + module.chapters.length, 0)}{" "}
            chapters ·{" "}
            {course.modules.reduce((count, module) => count + module.lessons.length, 0)}{" "}
            lessons
          </p>
        </section>

        <section className="brutal-box p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-primary">Modules</h2>
            <Link
              className="brutal-box-yellow px-3 py-2 text-sm font-black"
              href={`/learn/${course.slug}`}
            >
              View learner map
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {course.modules.map((module) => (
              <form
                key={module.id}
                action={upsertModuleAction}
                className="grid gap-3 border-[3px] border-primary bg-mist/60 p-4 md:grid-cols-[1fr_1fr_110px_130px_auto] md:items-end"
              >
                <input type="hidden" name="id" value={module.id} />
                <input type="hidden" name="courseId" value={course.id} />
                <input type="hidden" name="courseSlug" value={course.slug} />
                <div>
                  <Label htmlFor={`module-title-${module.id}`}>Title</Label>
                  <Input
                    id={`module-title-${module.id}`}
                    name="title"
                    defaultValue={module.title}
                  />
                </div>
                <div>
                  <Label htmlFor={`module-slug-${module.id}`}>Slug</Label>
                  <Input
                    id={`module-slug-${module.id}`}
                    name="slug"
                    defaultValue={module.slug}
                  />
                </div>
                <div>
                  <Label htmlFor={`module-order-${module.id}`}>Order</Label>
                  <Input
                    id={`module-order-${module.id}`}
                    name="orderIndex"
                    type="number"
                    defaultValue={module.orderIndex}
                  />
                </div>
                <div>
                  <Label htmlFor={`module-hours-${module.id}`}>Hours</Label>
                  <Input
                    id={`module-hours-${module.id}`}
                    name="estimatedHours"
                    type="number"
                    step="0.25"
                    defaultValue={module.estimatedHours}
                  />
                </div>
                <div className="flex gap-2">
                  <Button className="brutal-btn" type="submit">
                    Save
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={`/admin/curriculum/${course.slug}/${module.slug}`}>
                      Edit
                    </Link>
                  </Button>
                </div>
                <div className="md:col-span-5">
                  <Label htmlFor={`module-description-${module.id}`}>Description</Label>
                  <Textarea
                    id={`module-description-${module.id}`}
                    name="description"
                    rows={2}
                    defaultValue={module.description}
                  />
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div>
                      <Label htmlFor={`module-oar-${module.id}`}>
                        OAR references (comma or lines)
                      </Label>
                      <Textarea
                        id={`module-oar-${module.id}`}
                        name="oarReferences"
                        rows={2}
                        defaultValue={JSON.parse(module.oarReferences).join("\n")}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`module-competencies-${module.id}`}>
                        Competencies (comma or lines)
                      </Label>
                      <Textarea
                        id={`module-competencies-${module.id}`}
                        name="competencies"
                        rows={2}
                        defaultValue={JSON.parse(module.competencies).join("\n")}
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-bold text-muted-foreground">
                    {module.chapters.length} chapters · {module.lessons.length} lessons
                  </p>
                </div>
              </form>
            ))}
          </div>
        </section>

        <section className="brutal-box p-6">
          <h2 className="font-display text-2xl text-primary">Add module</h2>
          <form action={upsertModuleAction} className="mt-4 grid gap-3 md:grid-cols-2">
            <input type="hidden" name="courseId" value={course.id} />
            <input type="hidden" name="courseSlug" value={course.slug} />
            <div>
              <Label htmlFor="new-module-title">Title</Label>
              <Input id="new-module-title" name="title" required />
            </div>
            <div>
              <Label htmlFor="new-module-slug">Slug</Label>
              <Input id="new-module-slug" name="slug" placeholder="auto if blank" />
            </div>
            <div>
              <Label htmlFor="new-module-order">Order</Label>
              <Input
                id="new-module-order"
                name="orderIndex"
                type="number"
                defaultValue={course.modules.length + 1}
              />
            </div>
            <div>
              <Label htmlFor="new-module-hours">Hours</Label>
              <Input
                id="new-module-hours"
                name="estimatedHours"
                type="number"
                step="0.25"
                defaultValue="1"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="new-module-description">Description</Label>
              <Textarea id="new-module-description" name="description" required />
            </div>
            <div>
              <Label htmlFor="new-module-oar">OAR references</Label>
              <Textarea id="new-module-oar" name="oarReferences" rows={3} />
            </div>
            <div>
              <Label htmlFor="new-module-competencies">Competencies</Label>
              <Textarea id="new-module-competencies" name="competencies" rows={3} />
            </div>
            <Button className="brutal-btn md:col-span-2" type="submit">
              Create module
            </Button>
          </form>
        </section>

        <section className="brutal-box p-6">
          <h2 className="font-display text-2xl text-primary">Course materials</h2>
          <div className="mt-4 space-y-3">
            {course.materials.map((material) => (
              <div
                key={material.id}
                className="flex flex-wrap items-center justify-between gap-3 border-[3px] border-primary bg-white p-3 shadow-[3px_3px_0_#143028]"
              >
                <div>
                  <p className="font-black text-primary">
                    {material.title} · {material.materialType}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {material.lesson ? `Lesson: ${material.lesson.title} · ` : ""}
                    {material.description || material.url}
                  </p>
                </div>
                <form action={deleteCourseMaterialAction}>
                  <input type="hidden" name="id" value={material.id} />
                  <input type="hidden" name="courseSlug" value={course.slug} />
                  <Button variant="destructive" type="submit">
                    Delete
                  </Button>
                </form>
              </div>
            ))}
            {!course.materials.length && (
              <p className="text-sm text-muted-foreground">No materials yet.</p>
            )}
          </div>

          <form
            action={createCourseMaterialAction}
            className="mt-6 grid gap-3 border-[3px] border-primary bg-mist/60 p-4 md:grid-cols-2"
          >
            <input type="hidden" name="courseId" value={course.id} />
            <input type="hidden" name="courseSlug" value={course.slug} />
            <div>
              <Label htmlFor="material-title">Title</Label>
              <Input id="material-title" name="title" required />
            </div>
            <div>
              <Label htmlFor="material-type">Type</Label>
              <Input
                id="material-type"
                name="materialType"
                defaultValue="link"
                placeholder="video, pdf, link, slide, handout, other"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="material-url">URL</Label>
              <Input id="material-url" name="url" type="url" required />
            </div>
            <div>
              <Label htmlFor="material-lesson">Attach to lesson</Label>
              <select
                id="material-lesson"
                name="lessonId"
                className="h-10 w-full border border-input bg-background px-3 text-sm"
                defaultValue=""
              >
                <option value="">Course-level material</option>
                {allLessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="material-order">Sort order</Label>
              <Input id="material-order" name="sortOrder" type="number" defaultValue="0" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="material-description">Description</Label>
              <Textarea id="material-description" name="description" rows={3} />
            </div>
            <Button className="brutal-btn md:col-span-2" type="submit">
              Add material
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}
