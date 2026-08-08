import { moduleAiReview, moduleWithFlatLessons, reading, sectionQuiz, slugify } from "./helpers";
import type { ChapterSeed, LearningMode, ModuleSeed, QuizQuestion, ReferenceLink } from "./types";

export type SectionQuizSpec = {
  focus: string;
  safeAction: string;
  unsafeAction: string;
  scopeBoundary: string;
  boundaryMistake: string;
  privacyAction: string;
  privacyMistake: string;
  choiceAction: string;
  choiceMistake: string;
};

export type HybridSectionSpec = {
  slug: string;
  title: string;
  minutes?: number;
  description: string;
  scene: string;
  plainTalk: string;
  trySaying: string[];
  practice: string;
  commonTrap: string;
  mustKnow: string;
  quiz: SectionQuizSpec;
};

export type HybridModuleAiReviewSpec = {
  goals: string[];
  mustCover: string[];
  rubric: {
    peerVoice: string;
    choiceConsent: string;
    scopeSafety: string;
    warmthWithoutRescue: string;
  };
  starterQuestions: string[];
};

export type HybridModuleSpec = {
  slug: string;
  title: string;
  description: string;
  estimatedHours: number;
  oarReferences: string[];
  competencies: string[];
  peerNugget: string;
  sections: HybridSectionSpec[];
  aiReview: HybridModuleAiReviewSpec;
  references?: ReferenceLink[];
  learningModes?: LearningMode[];
};

function sectionReadingBody(module: HybridModuleSpec, section: HybridSectionSpec) {
  return `# ${section.title}

${section.scene}

Here’s the real talk. ${section.plainTalk}

Peer support is walking beside someone, not taking the wheel. In this section, keep asking three quiet questions in the back of your mind: "What does this person want?", "What is mine to do as a peer?", and "What keeps dignity and safety in the room?" Those questions work in a lobby, a group room, a jail reentry meeting, a hospital discharge call, or a coffee shop check-in.

${module.peerNugget}

## What this looks like in real life

A peer may not use neat training words. They may say, "I’m tired of everyone telling me what to do," or "I already messed this up," or "Can you just call them and fix it?" Your first job is to slow the moment down. Reflect what you heard. Ask permission before offering ideas. Name your role in plain language. If safety is involved, be honest about the limits and route to the right help without making the person feel punished for telling the truth.

## Try saying this

${section.trySaying.map((line) => `- "${line}"`).join("\n")}

Say these out loud, then make them sound like you. A script is only useful if it can survive real breath, real nerves, and real people.

## Common trap

${section.commonTrap}

The repair is simple, even when it is not easy: pause, own the pressure, and come back to choice. "I got ahead of you for a second. Let me back up. What would feel useful right now?"

## Tiny practice

${section.practice}

## Must-know

${section.mustKnow}`;
}

function buildSectionQuestions(
  moduleSlug: string,
  section: HybridSectionSpec
): QuizQuestion[] {
  const idBase = `${moduleSlug}-${section.slug}`;

  return [
    {
      id: `${idBase}-q1`,
      prompt: `In ${section.quiz.focus}, what is the best first peer move?`,
      options: [
        section.quiz.unsafeAction,
        section.quiz.safeAction,
        "Wait silently until a clinician, supervisor, or case manager can make every decision.",
        "Tell the peer exactly what worked for you and ask them to copy that plan.",
      ],
      correctIndex: 1,
      explanation:
        "Start with consent, reflection, and the peer's own goal before offering ideas.",
    },
    {
      id: `${idBase}-q2`,
      prompt: "Which answer stays inside Oregon peer scope?",
      options: [
        section.quiz.boundaryMistake,
        "Promise the peer the system will approve the outcome if they follow your advice.",
        section.quiz.scopeBoundary,
        "Make a diagnosis in plain language so the peer knows what is really happening.",
      ],
      correctIndex: 2,
      explanation:
        "Peers use lived experience, support, advocacy, and navigation. We do not diagnose, prescribe, or guarantee outcomes.",
    },
    {
      id: `${idBase}-q3`,
      prompt: "What is the strongest privacy and safety choice here?",
      options: [
        "Share the story freely if your intentions are good.",
        section.quiz.privacyMistake,
        section.quiz.privacyAction,
        "Avoid documenting anything because privacy always means no records.",
      ],
      correctIndex: 2,
      explanation:
        "Privacy means consent and role clarity, with safety exceptions handled through employer policy and required reporting rules.",
    },
    {
      id: `${idBase}-q4`,
      prompt: "How do you keep choice at the center?",
      options: [
        section.quiz.choiceAction,
        section.quiz.choiceMistake,
        "Skip choices because too many options can slow down the work.",
        "Use pressure if the peer's choice is different from what helped you.",
      ],
      correctIndex: 0,
      explanation:
        "Peer support protects self-determination: offer options, ask permission, and let the peer choose the next doable step.",
    },
  ];
}

function aiReviewContent(moduleTitle: string) {
  return `# Module AI review: ${moduleTitle}

You’ll talk this module through with Cascade Guide. Write like you would talk to a peer, not like a textbook.

Cascade Guide will ask you warm practice questions, listen for peer voice, and help you explain the big ideas in plain language. This is practice, not a certification decision.

This conversation is recorded for your instructor. A human instructor still reviews your work, checks attendance and practice requirements, and decides completion.

Bring your real voice. Use "I might say..." and "I would ask..." language. If you are unsure, name the uncertainty and say how you would use supervision or employer policy. That is strong peer practice.`;
}

export function buildHybridModule(spec: HybridModuleSpec): ModuleSeed {
  const chapters: ChapterSeed[] = spec.sections.map((section, index) => {
    const lessons = [
      reading(
        section.title,
        sectionReadingBody(spec, section),
        section.minutes ?? 35,
        {
          slug: section.slug,
          references: index === 0 ? spec.references : undefined,
          learningModes: spec.learningModes ?? ["story", "reading", "reflective"],
        }
      ),
      sectionQuiz(
        `Section Check: ${section.title}`,
        buildSectionQuestions(spec.slug, section),
        10
      ),
    ];

    if (index === spec.sections.length - 1) {
      lessons.push(
        moduleAiReview({
          title: `Cascade Guide Review: ${spec.title}`,
          moduleSlug: spec.slug,
          goals: spec.aiReview.goals,
          mustCover: spec.aiReview.mustCover,
          rubric: spec.aiReview.rubric,
          starterQuestions: spec.aiReview.starterQuestions,
          minutes: 55,
          contentMd: aiReviewContent(spec.title),
        })
      );
    }

    return {
      slug: section.slug,
      title: section.title,
      description: section.description,
      lessons,
    };
  });

  return moduleWithFlatLessons({
    slug: spec.slug,
    title: spec.title,
    description: spec.description,
    estimatedHours: spec.estimatedHours,
    oarReferences: spec.oarReferences,
    competencies: spec.competencies,
    chapters,
  });
}

export function cloneHybridModule(mod: ModuleSeed): ModuleSeed {
  return moduleWithFlatLessons({
    ...mod,
    oarReferences: [...mod.oarReferences],
    competencies: [...mod.competencies],
    chapters: mod.chapters.map((chapter) => ({
      ...chapter,
      lessons: chapter.lessons.map((lesson) => ({
        ...lesson,
        references: lesson.references ? [...lesson.references] : undefined,
        learningModes: lesson.learningModes ? [...lesson.learningModes] : undefined,
        interactivePayload:
          lesson.interactivePayload == null
            ? undefined
            : JSON.parse(JSON.stringify(lesson.interactivePayload)),
      })),
    })),
  });
}

export function section(
  title: string,
  spec: Omit<HybridSectionSpec, "slug" | "title">
): HybridSectionSpec {
  return {
    slug: slugify(title),
    title,
    ...spec,
  };
}
