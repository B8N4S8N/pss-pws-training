export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type ReferenceLink = {
  title: string;
  url: string;
  type: "oar" | "oha" | "article" | "video" | "tool" | "book";
  note?: string;
};

export type LearningMode =
  | "visual"
  | "auditory"
  | "reading"
  | "kinesthetic"
  | "story"
  | "reflective";

export type LessonSeed = {
  slug: string;
  title: string;
  type:
    | "READING"
    | "VIDEO"
    | "QUIZ"
    | "REFLECTION"
    | "DOCUMENTATION"
    | "SCENARIO"
    | "ROLEPLAY"
    | "LIVE_SESSION";
  estimatedMinutes: number;
  contentMd: string;
  interactivePayload?: unknown;
  passScore?: number;
  references?: ReferenceLink[];
  learningModes?: LearningMode[];
  videoUrl?: string;
  videoProvider?: "youtube" | "vimeo" | "upload" | "external";
  isModuleQuiz?: boolean;
  storytellingHook?: string;
};

export type ChapterSeed = {
  slug: string;
  title: string;
  description: string;
  lessons: LessonSeed[];
};

export type ModuleSeed = {
  slug: string;
  title: string;
  description: string;
  estimatedHours: number;
  oarReferences: string[];
  competencies: string[];
  chapters: ChapterSeed[];
  /** optional flat lessons for backward compat - prefer chapters */
  lessons?: LessonSeed[];
};

export type CourseSeed = {
  slug: string;
  type: "PSS" | "PWS";
  title: string;
  subtitle: string;
  description: string;
  contactHours: number;
  priceCents: number;
  competencies: string[];
  learningOutcomes: string[];
  modules: ModuleSeed[];
};
