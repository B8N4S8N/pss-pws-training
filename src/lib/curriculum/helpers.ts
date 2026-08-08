import type {
  ChapterSeed,
  LearningMode,
  LessonSeed,
  ModuleSeed,
  QuizQuestion,
  ReferenceLink,
} from "./types";

type LessonOptions = {
  slug?: string;
  references?: ReferenceLink[];
  learningModes?: LearningMode[];
  interactivePayload?: unknown;
};

type VideoLessonOptions = LessonOptions & {
  videoUrl?: string;
  videoProvider?: LessonSeed["videoProvider"];
};

type StoryReadingOptions = {
  title: string;
  hook: string;
  body: string;
  minutes: number;
  references?: ReferenceLink[];
  learningModes?: LearningMode[];
};

export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function quiz(questions: QuizQuestion[]) {
  return { questions };
}

export function callout(
  kind: "tip" | "story" | "practice" | "warning" | string,
  text: string
) {
  const labels: Record<string, string> = {
    tip: "Quick tip",
    story: "Real scene",
    practice: "Try it",
    warning: "Heads up",
    warn: "Heads up",
  };

  return `> **${labels[kind] ?? kind}:** ${text}`;
}

export function deepDiveSection(title: string, refs: ReferenceLink[] = []) {
  if (refs.length === 0) {
    return "";
  }

  const links = refs
    .map((ref) => `- [${ref.title}](${ref.url})${ref.note ? ` - ${ref.note}` : ""}`)
    .join("\n");

  return `\n\n## Go deeper: ${title}\n${links}`;
}

export function reading(
  title: string,
  body: string,
  minutes = 25,
  options: LessonOptions = {}
): LessonSeed {
  return {
    slug: options.slug ?? slugify(title),
    title,
    type: "READING",
    estimatedMinutes: minutes,
    contentMd: body,
    references: options.references,
    learningModes: options.learningModes ?? ["reading", "reflective"],
    interactivePayload: options.interactivePayload,
  };
}

export function storyReading({
  title,
  hook,
  body,
  minutes,
  references,
  learningModes,
}: StoryReadingOptions): LessonSeed {
  return reading(
    title,
    `${callout("story", hook)}\n\n${body}`,
    minutes,
    {
      references,
      learningModes: learningModes ?? ["story", "reading", "reflective"],
    }
  );
}

export function videoLesson(
  title: string,
  contentMd: string,
  minutes = 20,
  options: VideoLessonOptions = {}
): LessonSeed {
  return {
    slug: options.slug ?? slugify(title),
    title,
    type: "VIDEO",
    estimatedMinutes: minutes,
    contentMd,
    references: options.references,
    learningModes: options.learningModes ?? ["visual", "auditory", "reflective"],
    interactivePayload: options.interactivePayload,
    videoUrl: options.videoUrl,
    videoProvider: options.videoProvider,
  };
}

export function scenario(
  title: string,
  contentMd: string,
  interactivePayload: unknown,
  minutes = 25,
  options: LessonOptions = {}
): LessonSeed {
  return {
    slug: options.slug ?? slugify(title),
    title,
    type: "SCENARIO",
    estimatedMinutes: minutes,
    contentMd,
    references: options.references,
    learningModes: options.learningModes ?? ["kinesthetic", "story", "reflective"],
    interactivePayload,
  };
}

export function reflection(
  title: string,
  contentMd: string,
  minutes = 20,
  options: LessonOptions = {}
): LessonSeed {
  return {
    slug: options.slug ?? slugify(title),
    title,
    type: "REFLECTION",
    estimatedMinutes: minutes,
    contentMd,
    references: options.references,
    learningModes: options.learningModes ?? ["reflective", "reading"],
    interactivePayload: options.interactivePayload,
  };
}

export function documentation(
  title: string,
  contentMd: string,
  interactivePayload: unknown,
  minutes = 25,
  options: LessonOptions = {}
): LessonSeed {
  return {
    slug: options.slug ?? slugify(title),
    title,
    type: "DOCUMENTATION",
    estimatedMinutes: minutes,
    contentMd,
    references: options.references,
    learningModes: options.learningModes ?? ["reading", "kinesthetic"],
    interactivePayload,
  };
}

export function moduleQuiz(
  slug: string,
  title: string,
  questions: QuizQuestion[],
  minutes: number
): LessonSeed {
  return {
    slug,
    title,
    type: "QUIZ",
    estimatedMinutes: minutes,
    contentMd:
      "Mini-quiz for this module. Passing score is 80%. Review explanations after each attempt and revisit the chapter readings before retaking.",
    interactivePayload: quiz(questions),
    passScore: 80,
    isModuleQuiz: true,
    learningModes: ["reading", "reflective"],
  };
}

export function sectionQuiz(
  title: string,
  questions: QuizQuestion[],
  minutes = 10
): LessonSeed {
  return {
    slug: slugify(`${title} quiz`),
    title,
    type: "QUIZ",
    estimatedMinutes: minutes,
    contentMd:
      "Quick section check. You need 80% to pass. These questions stick to the must-know stuff: scope, safety, choice, and privacy.",
    interactivePayload: quiz(questions),
    passScore: 80,
    isModuleQuiz: false,
    learningModes: ["reading", "reflective"],
  };
}

type ModuleAiReviewOptions = {
  title: string;
  moduleSlug: string;
  goals: string[];
  mustCover: string[];
  rubric: {
    peerVoice: string;
    choiceConsent: string;
    scopeSafety: string;
    warmthWithoutRescue: string;
  };
  starterQuestions: string[];
  minutes?: number;
  contentMd?: string;
};

export function moduleAiReview({
  title,
  moduleSlug,
  goals,
  mustCover,
  rubric,
  starterQuestions,
  minutes = 50,
  contentMd,
}: ModuleAiReviewOptions): LessonSeed {
  return {
    slug: slugify(`${moduleSlug} ai review`),
    title,
    type: "MODULE_AI_REVIEW",
    estimatedMinutes: minutes,
    contentMd:
      contentMd ??
      "You’ll talk this module through with Cascade Guide. Write like you would talk to a peer, not like a textbook. This practice is recorded for your instructor, and a human instructor still decides completion.",
    interactivePayload: {
      kind: "moduleAiReview",
      moduleSlug,
      goals,
      mustCover,
      rubric,
      starterQuestions,
      passScore: 80,
    },
    passScore: 80,
    isModuleAiReview: true,
    learningModes: ["kinesthetic", "story", "reflective"],
  };
}

export function withModuleQuiz(
  chapters: ChapterSeed[],
  quizLesson: LessonSeed
): ChapterSeed[] {
  if (chapters.length === 0) {
    return [
      {
        slug: "module-quiz",
        title: "Module Quiz",
        description: "Final knowledge check for this module.",
        lessons: [quizLesson],
      },
    ];
  }

  return chapters.map((chapter, index) =>
    index === chapters.length - 1
      ? { ...chapter, lessons: [...chapter.lessons, quizLesson] }
      : chapter
  );
}

export function flattenModuleLessons(
  mod: Pick<ModuleSeed, "chapters">
): LessonSeed[] {
  return mod.chapters.flatMap((chapter) => chapter.lessons);
}

export function moduleWithFlatLessons(
  mod: Omit<ModuleSeed, "lessons"> & { lessons?: LessonSeed[] }
): ModuleSeed {
  return {
    ...mod,
    lessons: flattenModuleLessons(mod),
  };
}
