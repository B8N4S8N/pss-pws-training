import { generateText, streamText, Output } from "ai";
import { z } from "zod";
import { aiProvidersConfigured, resolveModelForTask } from "@/lib/ai/models";

/** @deprecated Prefer resolveModelForTask — kept for env docs compatibility */
export const DEFAULT_MODEL = "google/gemini-2.5-flash";

export function aiConfigured() {
  return aiProvidersConfigured();
}

function modelFor(
  task: "tiny" | "teach" | "generate" | "evaluate" | "roleplay" | "crisis"
) {
  const resolved = resolveModelForTask(task);
  if (!resolved.model) {
    throw new Error("AI offline — no provider configured");
  }
  return resolved.model as never;
}

export const evaluationSchema = z.object({
  overallScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  growthAreas: z.array(z.string()),
  domainScores: z.object({
    activeListening: z.number().min(0).max(100),
    openQuestions: z.number().min(0).max(100),
    boundaries: z.number().min(0).max(100),
    motivationalInterviewing: z.number().min(0).max(100),
    traumaInformedLanguage: z.number().min(0).max(100),
    recoveryOrientedLanguage: z.number().min(0).max(100),
    crisisAwareness: z.number().min(0).max(100),
  }),
  missedOpportunities: z.array(z.string()),
  coachingNotes: z.string(),
  recommendMorePractice: z.boolean(),
});

export type EvaluationResult = z.infer<typeof evaluationSchema>;

export const moduleReviewEvaluationSchema = z.object({
  overallScore: z.number().min(0).max(100),
  passed: z.boolean(),
  strengths: z.array(z.string()),
  growthAreas: z.array(z.string()),
  rubricScores: z.object({
    peerVoice: z.number().min(0).max(100),
    choiceConsent: z.number().min(0).max(100),
    scopeSafety: z.number().min(0).max(100),
    warmthWithoutRescue: z.number().min(0).max(100),
  }),
  coachingNotes: z.string(),
  redFlags: z.array(z.string()),
  recommendMorePractice: z.boolean(),
});

export type ModuleReviewEvaluationResult = z.infer<
  typeof moduleReviewEvaluationSchema
>;

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

function formatReviewValue(value: unknown, fallback = "None provided") {
  if (Array.isArray(value)) {
    const items = value.map(String).filter(Boolean);
    return items.length ? items.map((item) => `- ${item}`).join("\n") : fallback;
  }
  if (typeof value === "string") return value || fallback;
  if (value && typeof value === "object") return JSON.stringify(value, null, 2);
  return fallback;
}

function moduleReviewSystemPrompt(args: {
  moduleTitle: string;
  goals: unknown;
  mustCover: unknown;
  rubric: unknown;
  starterQuestions?: unknown;
}) {
  return `You are Cascade Guide, a warm peer teacher for Cascade Peer Academy.

This is an AI Module Review for: ${args.moduleTitle}

Your style:
- Sound like a supportive peer educator, not an academic examiner.
- Be conversational, plain-language, hopeful, and practical.
- Ask one question at a time from the starter flow before moving on.
- Coach briefly when a student gets close, then invite them to try the next sentence.
- Never invent Oregon law. If a rule is uncertain, tell the student to verify with OHA THW materials or their instructor.
- Never let the student diagnose, treat, or act as a clinician. Keep them in peer scope.
- Remind students to follow real crisis protocols, including 988/emergency services and employer policy when safety risk appears.
- Record-ready tone: instructors may review this practice evidence, but humans still certify competency.

Module goals:
${formatReviewValue(args.goals)}

Must-cover checkpoints:
${formatReviewValue(args.mustCover)}

Starter flow:
${formatReviewValue(args.starterQuestions)}

Rubric:
${formatReviewValue(args.rubric)}

Keep replies short enough for chat. Ask exactly one question at the end unless the student is finishing.`;
}

export async function streamTutorReply(args: {
  messages: { role: "user" | "assistant" | "system"; content: string }[];
}) {
  return streamText({
    model: modelFor("teach"),
    system: `You are Cascade Guide, an AI tutor for Oregon Peer Support Specialist (PSS) and Peer Wellness Specialist (PWS) students training toward OHA Traditional Health Worker competencies (OAR 950-060-0140).

Teach in plain, warm peer language — not textbook voice. Never invent Oregon law. If unsure about a regulation, say students should verify with OHA THW materials and their instructor.

Remind students that AI practice is not a substitute for final human competency evaluation.`,
    messages: args.messages,
  });
}

export async function streamModuleReviewReply(args: {
  moduleTitle: string;
  goals: unknown;
  mustCover: unknown;
  rubric: unknown;
  starterQuestions?: unknown;
  transcriptSoFar: string;
  messages: ChatMessage[];
}) {
  return streamText({
    model: modelFor("teach"),
    system: `${moduleReviewSystemPrompt(args)}

Transcript so far:
${args.transcriptSoFar || "No prior student transcript yet."}`,
    messages: args.messages,
  });
}

export async function streamPersonaReply(args: {
  systemPrompt: string;
  messages: { role: "user" | "assistant"; content: string }[];
}) {
  return streamText({
    model: modelFor("roleplay"),
    system: `${args.systemPrompt}

Additional rules:
- This is a training simulation for peer specialists.
- Stay in character as the peer receiving support.
- Do not provide meta coaching while in character.
- Keep replies conversational and realistic (2-6 sentences usually).
- If the student says they are ending the session, acknowledge briefly.`,
    messages: args.messages,
  });
}

export async function evaluateRoleplay(args: {
  personaName: string;
  rubric: string[];
  transcript: string;
}): Promise<EvaluationResult> {
  const { output } = await generateText({
    model: modelFor("evaluate"),
    output: Output.object({ schema: evaluationSchema }),
    prompt: `Evaluate this peer support training conversation.

Persona: ${args.personaName}
Rubric domains to emphasize: ${args.rubric.join(", ")}

Transcript:
${args.transcript}

Score the student peer specialist (not the simulated peer). Be rigorous but constructive. Oregon peer scope: non-clinical, recovery-oriented, trauma-informed, MI-aligned when relevant.`,
  });
  return output as EvaluationResult;
}

export async function evaluateModuleReview(args: {
  moduleTitle: string;
  goals: unknown;
  mustCover: unknown;
  rubric: unknown;
  transcript: string;
}): Promise<ModuleReviewEvaluationResult> {
  const { output } = await generateText({
    model: modelFor("evaluate"),
    output: Output.object({ schema: moduleReviewEvaluationSchema }),
    prompt: `Evaluate this Cascade Peer Academy AI Module Review.

Module: ${args.moduleTitle}

Goals:
${formatReviewValue(args.goals)}

Must-cover checkpoints:
${formatReviewValue(args.mustCover)}

Rubric:
${formatReviewValue(args.rubric)}

Transcript:
${args.transcript}

Score the student as an Oregon peer support/wellness student, not as a clinician. Look for peer voice, choice and consent, scope safety, warmth without rescuing, and crisis protocol reminders when relevant. Flag scope slips, clinical overreach, and safety misses in redFlags. Be constructive and plain-spoken.`,
  });
  return output as ModuleReviewEvaluationResult;
}

/** Deterministic offline fallback when AI Gateway is not configured. */
export function offlineTutorReply(userText: string) {
  return `**Cascade Guide (offline mode)**

I can still help you study while AI Gateway credentials are being configured.

You asked about: “${userText.slice(0, 280)}”

### Quick Oregon competency anchors (OAR 950-060-0140)
- **Communication**: active listening, open questions, reflective statements
- **Ethics/boundaries**: confidentiality, dual relationships, professional conduct
- **Trauma-informed care**: safety, choice, collaboration, empowerment
- **Crisis**: recognize, relate, route — do not replace emergency protocols
- **Recovery**: peer role clarity; hope; recovery capital

### Practice prompt
Write one reflective statement and one open question you could use with a peer who says: “I’m fine — stop asking.”

When \`AI_GATEWAY_API_KEY\` (or Vercel OIDC) is available, live streaming tutoring and scored roleplays unlock automatically. Human instructors still provide final competency sign-off.`;
}

export function offlinePersonaReply(personaName: string, turn: number) {
  const lines = [
    `Yeah… I don’t know. It’s been a rough stretch. (*${personaName} looks away*)`,
    `People keep telling me what to do. I’m tired of being managed.`,
    `If you’re actually listening, maybe… what would help is not being judged for once.`,
    `I might be open to one small next step — but don’t push me into a program today.`,
    `Can we slow down? I need a second.`,
  ];
  return lines[Math.min(turn, lines.length - 1)];
}

export function offlineModuleReviewReply(turn: number, starterQuestions: unknown) {
  const starters = Array.isArray(starterQuestions)
    ? starterQuestions.map(String).filter(Boolean)
    : [];
  const fallbackQuestions = [
    "In your own words, what is the peer role in this module?",
    "What is one way you would offer choice or consent before supporting someone?",
    "Where would you hold scope and avoid diagnosing or rescuing?",
    "If safety concerns came up, what real-world protocol would you follow?",
  ];
  const questions = starters.length ? starters : fallbackQuestions;
  const question = questions[Math.min(turn, questions.length - 1)];
  return `**Cascade Guide (offline mode)**\n\nThanks for staying with the practice. I’m recording this review for instructor supervision, even while live AI is offline.\n\n${question}`;
}

export function offlineEvaluation(): EvaluationResult {
  return {
    overallScore: 78,
    strengths: [
      "Maintained a respectful tone",
      "Asked at least one curious question",
      "Did not rush into clinical advice",
    ],
    growthAreas: [
      "Add more reflective listening before problem-solving",
      "Name autonomy/choice explicitly",
      "Check for safety when distress rises",
    ],
    domainScores: {
      activeListening: 80,
      openQuestions: 75,
      boundaries: 82,
      motivationalInterviewing: 70,
      traumaInformedLanguage: 76,
      recoveryOrientedLanguage: 78,
      crisisAwareness: 72,
    },
    missedOpportunities: [
      "Could have reflected feeling before offering resources",
    ],
    coachingNotes:
      "Offline evaluation placeholder. Connect AI Gateway for nuanced transcript scoring. Review with your instructor for high-stakes competency decisions.",
    recommendMorePractice: true,
  };
}

export function offlineModuleReviewEvaluation(): ModuleReviewEvaluationResult {
  return {
    overallScore: 84,
    passed: true,
    strengths: [
      "Used a warm peer tone",
      "Kept support grounded in choice and consent",
      "Stayed mostly within non-clinical peer scope",
    ],
    growthAreas: [
      "Name crisis routing steps more clearly when safety cues appear",
      "Use one more reflective statement before offering ideas",
    ],
    rubricScores: {
      peerVoice: 86,
      choiceConsent: 84,
      scopeSafety: 82,
      warmthWithoutRescue: 85,
    },
    coachingNotes:
      "Offline evaluation placeholder. Connect AI Gateway for nuanced transcript scoring. Instructors should review the recording before final competency decisions.",
    redFlags: [],
    recommendMorePractice: false,
  };
}
