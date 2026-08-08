"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { LessonType } from "@/generated/prisma/client";

const LESSON_TYPES = new Set<LessonType>([
  "READING",
  "VIDEO",
  "QUIZ",
  "REFLECTION",
  "DOCUMENTATION",
  "SCENARIO",
  "ROLEPLAY",
  "MODULE_AI_REVIEW",
  "LIVE_SESSION",
]);

function value(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function nullableValue(formData: FormData, key: string) {
  const raw = value(formData, key);
  return raw ? raw : null;
}

function numberValue(formData: FormData, key: string, fallback: number) {
  const parsed = Number(value(formData, key));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function jsonArrayFromLines(raw: string) {
  return raw
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeReferences(raw: string | null) {
  if (!raw) return null;
  try {
    return JSON.stringify(JSON.parse(raw));
  } catch {
    const references = raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split("|").map((part) => part.trim());
        const urlMatch = line.match(/https?:\/\/\S+/);
        if (parts.length >= 2) {
          return { title: parts[0], url: parts[1], description: parts[2] || undefined };
        }
        return {
          title: line.replace(urlMatch?.[0] || "", "").trim() || "Reference",
          url: urlMatch?.[0] || "",
        };
      })
      .filter((item) => item.url);
    return references.length ? JSON.stringify(references) : null;
  }
}

function normalizeLearningModes(raw: string | null) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? JSON.stringify(parsed.map(String)) : null;
  } catch {
    const modes = jsonArrayFromLines(raw);
    return modes.length ? JSON.stringify(modes) : null;
  }
}

function normalizeJson(raw: string | null) {
  if (!raw) return null;
  try {
    return JSON.stringify(JSON.parse(raw));
  } catch {
    return raw;
  }
}

async function requireCmsUser() {
  const user = await requireUser(["ADMIN", "INSTRUCTOR"]);
  if (!user) throw new Error("Unauthorized");
  return user;
}

function revalidateCurriculumPaths({
  courseSlug,
  moduleSlug,
  lessonSlug,
}: {
  courseSlug?: string;
  moduleSlug?: string;
  lessonSlug?: string;
}) {
  revalidatePath("/admin");
  revalidatePath("/admin/curriculum");
  if (courseSlug) {
    revalidatePath(`/admin/curriculum/${courseSlug}`);
    revalidatePath(`/learn/${courseSlug}`);
  }
  if (courseSlug && moduleSlug) {
    revalidatePath(`/admin/curriculum/${courseSlug}/${moduleSlug}`);
  }
  if (courseSlug && moduleSlug && lessonSlug) {
    revalidatePath(`/admin/curriculum/${courseSlug}/${moduleSlug}/${lessonSlug}`);
    revalidatePath(`/learn/${courseSlug}/${moduleSlug}/${lessonSlug}`);
  }
}

export async function upsertModuleAction(formData: FormData) {
  await requireCmsUser();
  const id = nullableValue(formData, "id");
  const courseId = value(formData, "courseId");
  const courseSlug = value(formData, "courseSlug");
  const title = value(formData, "title");
  const slug = value(formData, "slug") || slugify(title);
  const data = {
    slug,
    title,
    description: value(formData, "description"),
    orderIndex: numberValue(formData, "orderIndex", 1),
    estimatedHours: numberValue(formData, "estimatedHours", 1),
    oarReferences: JSON.stringify(jsonArrayFromLines(value(formData, "oarReferences"))),
    competencies: JSON.stringify(jsonArrayFromLines(value(formData, "competencies"))),
  };

  if (id) {
    await prisma.module.update({ where: { id }, data });
  } else {
    await prisma.module.create({ data: { courseId, ...data } });
  }

  revalidateCurriculumPaths({ courseSlug, moduleSlug: slug });
}

export async function upsertChapterAction(formData: FormData) {
  await requireCmsUser();
  const id = nullableValue(formData, "id");
  const moduleId = value(formData, "moduleId");
  const courseSlug = value(formData, "courseSlug");
  const moduleSlug = value(formData, "moduleSlug");
  const title = value(formData, "title");
  const slug = value(formData, "slug") || slugify(title);
  const data = {
    slug,
    title,
    description: nullableValue(formData, "description"),
    sortOrder: numberValue(formData, "sortOrder", 1),
  };

  if (id) {
    await prisma.chapter.update({ where: { id }, data });
  } else {
    await prisma.chapter.create({ data: { moduleId, ...data } });
  }

  revalidateCurriculumPaths({ courseSlug, moduleSlug });
}

export async function upsertLessonAction(formData: FormData) {
  await requireCmsUser();
  const id = nullableValue(formData, "id");
  const moduleId = value(formData, "moduleId");
  const courseSlug = value(formData, "courseSlug");
  const moduleSlug = value(formData, "moduleSlug");
  const title = value(formData, "title");
  const slug = value(formData, "slug") || slugify(title);
  const type = value(formData, "type") || "READING";
  const lessonType: LessonType = LESSON_TYPES.has(type as LessonType)
    ? (type as LessonType)
    : "READING";
  const data = {
    slug,
    title,
    type: lessonType,
    contentMd: value(formData, "contentMd") || "Add lesson content here.",
    videoUrl: nullableValue(formData, "videoUrl"),
    videoProvider: nullableValue(formData, "videoProvider"),
    estimatedMinutes: numberValue(formData, "estimatedMinutes", 20),
    passScore: numberValue(formData, "passScore", 80),
    isModuleQuiz: value(formData, "isModuleQuiz") === "on",
    isModuleAiReview:
      value(formData, "isModuleAiReview") === "on" ||
      lessonType === "MODULE_AI_REVIEW",
    storytellingHook: nullableValue(formData, "storytellingHook"),
    referencesJson: normalizeReferences(nullableValue(formData, "referencesJson")),
    learningModes: normalizeLearningModes(nullableValue(formData, "learningModes")),
    interactivePayload: normalizeJson(nullableValue(formData, "interactivePayload")),
    chapterId: nullableValue(formData, "chapterId"),
    orderIndex: numberValue(formData, "orderIndex", 1),
  };

  if (id) {
    await prisma.lesson.update({ where: { id }, data });
  } else {
    await prisma.lesson.create({ data: { moduleId, ...data } });
  }

  revalidateCurriculumPaths({ courseSlug, moduleSlug, lessonSlug: slug });
}

export async function deleteLessonAction(formData: FormData) {
  await requireCmsUser();
  const id = value(formData, "id");
  const courseSlug = value(formData, "courseSlug");
  const moduleSlug = value(formData, "moduleSlug");
  if (id) {
    await prisma.lesson.delete({ where: { id } });
  }
  revalidateCurriculumPaths({ courseSlug, moduleSlug });

  if (value(formData, "redirectToModule") === "true") {
    redirect(`/admin/curriculum/${courseSlug}/${moduleSlug}`);
  }
}

export async function createCourseMaterialAction(formData: FormData) {
  const user = await requireCmsUser();
  const courseSlug = value(formData, "courseSlug");
  await prisma.courseMaterial.create({
    data: {
      courseId: value(formData, "courseId"),
      lessonId: nullableValue(formData, "lessonId"),
      title: value(formData, "title"),
      description: nullableValue(formData, "description"),
      materialType: value(formData, "materialType") || "link",
      url: value(formData, "url"),
      sortOrder: numberValue(formData, "sortOrder", 0),
      createdById: user.id,
    },
  });
  revalidateCurriculumPaths({ courseSlug });
}

export async function deleteCourseMaterialAction(formData: FormData) {
  await requireCmsUser();
  const id = value(formData, "id");
  const courseSlug = value(formData, "courseSlug");
  if (id) {
    await prisma.courseMaterial.delete({ where: { id } });
  }
  revalidateCurriculumPaths({ courseSlug });
}
