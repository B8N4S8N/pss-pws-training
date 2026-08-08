import { generateText, Output } from "ai";
import { z } from "zod";
import { resolveModelForTask, type AiTask } from "@/lib/ai/models";

export const learnerStyleSchema = z.object({
  learningStyle: z.enum(["story", "checklist", "short-chunks", "peer-talk"]),
  readingLevel: z.enum(["plain", "standard"]).default("plain"),
  backgroundNotes: z.string().max(800).optional(),
  prefersExamplesAbout: z.array(z.string()).max(8).optional(),
});

export type LearnerStyle = z.infer<typeof learnerStyleSchema>;

export const generatedSectionSchema = z.object({
  title: z.string(),
  hook: z.string(),
  contentMd: z.string(),
  trySaying: z.array(z.string()).min(2).max(6),
  commonTrap: z.string(),
  mustKnow: z.string(),
  quiz: z.object({
    questions: z
      .array(
        z.object({
          id: z.string(),
          prompt: z.string(),
          options: z.array(z.string()).length(4),
          correctIndex: z.number().int().min(0).max(3),
          explanation: z.string(),
        })
      )
      .min(3)
      .max(5),
  }),
});

export type GeneratedSection = z.infer<typeof generatedSectionSchema>;

export type ModuleGuideline = {
  moduleSlug: string;
  moduleTitle: string;
  sectionSlug: string;
  sectionTitle: string;
  goals: string[];
  mustCover: string[];
  oarReferences?: string[];
  baseScene?: string;
  basePlainTalk?: string;
};

const voiceRules = `You write for Cascade Peer Academy students — people with lived experience of addiction, mental health, or family recovery. They are not lawyers or clinicians.

Voice rules:
- Warm peer mentor tone. Short paragraphs. Plain English.
- Use scenes and "try saying this" lines.
- Never invent Oregon law. If unsure, say ask instructor / check OHA materials.
- Never tell students to diagnose, prescribe, or replace crisis protocols.
- Crisis = recognize, relate, route (988 / employer policy).
- Keep peer scope: walk beside, don't take the wheel.
- Do NOT sound like a textbook or TEMPS packet.`;

export async function generatePersonalizedSection(args: {
  guideline: ModuleGuideline;
  learner: LearnerStyle;
}): Promise<{
  section: GeneratedSection | null;
  modelLabel: string;
  provider: string;
  offline: boolean;
}> {
  const resolved = resolveModelForTask("generate");
  if (!resolved.model) {
    return {
      section: offlineGeneratedSection(args.guideline, args.learner),
      modelLabel: "offline",
      provider: "offline",
      offline: true,
    };
  }

  try {
    const { output } = await generateText({
      model: resolved.model as never,
      output: Output.object({ schema: generatedSectionSchema }),
      prompt: `${voiceRules}

Create a personalized SECTION for this learner from FIXED guidelines.
Do not invent new competencies outside mustCover/goals.
Personalize stories, metaphors, and examples to the learner style — keep requirements identical.

Module: ${args.guideline.moduleTitle} (${args.guideline.moduleSlug})
Section: ${args.guideline.sectionTitle} (${args.guideline.sectionSlug})
Goals: ${args.guideline.goals.join("; ")}
Must cover: ${args.guideline.mustCover.join("; ")}
OAR anchors (for you, not to dump on student): ${(args.guideline.oarReferences || []).join(", ") || "none listed"}
Base scene hint: ${args.guideline.baseScene || "none"}
Base plain talk hint: ${args.guideline.basePlainTalk || "none"}

Learner profile:
- style: ${args.learner.learningStyle}
- reading level: ${args.learner.readingLevel}
- background notes: ${args.learner.backgroundNotes || "not provided"}
- example themes: ${(args.learner.prefersExamplesAbout || []).join(", ") || "general Oregon peer work"}

Return structured JSON matching the schema.
contentMd should be 900–1800 words worth of teaching in markdown with ## headings.
Quiz questions: 4 options each, one clearly best peer answer, realistic wrong answers, pass-focused on must-knows only.`,
    });

    return {
      section: output as GeneratedSection,
      modelLabel: resolved.label,
      provider: resolved.provider,
      offline: false,
    };
  } catch (error) {
    console.error("generatePersonalizedSection failed", error);
    return {
      section: offlineGeneratedSection(args.guideline, args.learner),
      modelLabel: resolved.label,
      provider: resolved.provider,
      offline: true,
    };
  }
}

export function offlineGeneratedSection(
  guideline: ModuleGuideline,
  learner: LearnerStyle
): GeneratedSection {
  const styleNote =
    learner.learningStyle === "checklist"
      ? "Here's a simple checklist vibe for this section."
      : learner.learningStyle === "short-chunks"
        ? "We'll keep this in short chunks."
        : learner.learningStyle === "peer-talk"
          ? "Let's talk this through like peers."
          : "Here's a real-life scene to start.";

  return {
    title: guideline.sectionTitle,
    hook: `${styleNote} This section is custom-shaped for you, but the skills are the same for every Cascade student.`,
    contentMd: `# ${guideline.sectionTitle}

${guideline.baseScene || "You're sitting with someone who is tired of being managed."}

Here's the real talk. ${guideline.basePlainTalk || "Peer support means walking beside someone — not taking the wheel."}

## What you must hold onto

${guideline.mustCover.map((item) => `- ${item}`).join("\n")}

## Goals for this section

${guideline.goals.map((item) => `- ${item}`).join("\n")}

## Try saying this

- "Thanks for telling me that. What feels most important right now?"
- "I can walk with you on this. I can't make clinical decisions or promise outcomes."
- "Want options, practice, or just a minute to breathe first?"

## Common trap

Rushing to fix because silence feels awkward. Slow down. Reflect. Ask permission.

## Offline note

Live AI generation was unavailable, so you got the guideline-backed fallback version. Your instructor can still review your practice and AI module reviews.`,
    trySaying: [
      "What feels most important right now?",
      "I can walk with you — I can't take over.",
      "Want options, or just space first?",
    ],
    commonTrap: "Fixing too fast and skipping consent.",
    mustKnow: guideline.mustCover[0] || "Stay in peer scope and center choice.",
    quiz: {
      questions: [
        {
          id: `${guideline.sectionSlug}-off-1`,
          prompt: "Best first peer move?",
          options: [
            "Take over and solve it",
            "Reflect, ask permission, center their goal",
            "Diagnose the problem",
            "Ignore boundaries for loyalty",
          ],
          correctIndex: 1,
          explanation: "Consent and peer voice come first.",
        },
        {
          id: `${guideline.sectionSlug}-off-2`,
          prompt: "What stays in peer scope?",
          options: [
            "Prescribing medication advice",
            "Walking beside and navigating options",
            "Making a clinical diagnosis",
            "Promising housing by tomorrow",
          ],
          correctIndex: 1,
          explanation: "Peers support; they don't clinically treat.",
        },
        {
          id: `${guideline.sectionSlug}-off-3`,
          prompt: "If safety concerns show up?",
          options: [
            "Keep it secret no matter what",
            "Recognize, relate, and route using policy / 988",
            "Argue them out of feeling that way",
            "End the relationship immediately with no words",
          ],
          correctIndex: 1,
          explanation: "Safety routing protects dignity and life.",
        },
        {
          id: `${guideline.sectionSlug}-off-4`,
          prompt: "AI practice means…",
          options: [
            "AI certifies you automatically",
            "AI helps you rehearse; humans authorize completion",
            "You can skip live evaluation",
            "You should ignore instructor feedback",
          ],
          correctIndex: 1,
          explanation: "Humans still gate completion for OHA credibility.",
        },
      ],
    },
  };
}

export async function runWithTaskModel<T>(
  task: AiTask,
  fn: (model: unknown, meta: { label: string; provider: string }) => Promise<T>,
  offline: () => T
): Promise<T & { _meta?: { label: string; provider: string; offline: boolean } }> {
  const resolved = resolveModelForTask(task);
  if (!resolved.model) {
    const value = offline();
    return Object.assign(value as object, {
      _meta: { label: "offline", provider: "offline", offline: true },
    }) as T & { _meta?: { label: string; provider: string; offline: boolean } };
  }
  try {
    const value = await fn(resolved.model, {
      label: resolved.label,
      provider: resolved.provider,
    });
    return Object.assign(value as object, {
      _meta: {
        label: resolved.label,
        provider: resolved.provider,
        offline: false,
      },
    }) as T & { _meta?: { label: string; provider: string; offline: boolean } };
  } catch {
    const value = offline();
    return Object.assign(value as object, {
      _meta: {
        label: resolved.label,
        provider: resolved.provider,
        offline: true,
      },
    }) as T & { _meta?: { label: string; provider: string; offline: boolean } };
  }
}
