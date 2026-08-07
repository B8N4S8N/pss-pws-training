import { generateText, streamText, Output } from "ai";
import { z } from "zod";

/** Prefer AI Gateway model strings; works when AI_GATEWAY_API_KEY or Vercel OIDC is present. */
export const DEFAULT_MODEL = "openai/gpt-5.4";

export function aiConfigured() {
  return Boolean(
    process.env.AI_GATEWAY_API_KEY ||
      process.env.VERCEL_OIDC_TOKEN ||
      process.env.AI_GATEWAY_BASE_URL
  );
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

export async function streamTutorReply(args: {
  messages: { role: "user" | "assistant" | "system"; content: string }[];
}) {
  return streamText({
    model: DEFAULT_MODEL,
    system: `You are Cascade Guide, an AI tutor for Oregon Peer Support Specialist (PSS) and Peer Wellness Specialist (PWS) students training toward OHA Traditional Health Worker competencies (OAR 950-060-0140).

Teach clearly, use recovery-oriented language, cite competencies when helpful, and never invent Oregon law. If unsure about a regulation, say students should verify with OHA THW materials and their instructor.

Remind students that AI practice is not a substitute for final human competency evaluation.`,
    messages: args.messages,
  });
}

export async function streamPersonaReply(args: {
  systemPrompt: string;
  messages: { role: "user" | "assistant"; content: string }[];
}) {
  return streamText({
    model: DEFAULT_MODEL,
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
    model: DEFAULT_MODEL,
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
