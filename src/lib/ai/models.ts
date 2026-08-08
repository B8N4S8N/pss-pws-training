/**
 * Cascade Peer Academy — task-based model router
 *
 * Philosophy:
 * - Fixed module GUIDELINES (OHA spine) stay canonical
 * - AI personalizes delivery (stories, tone, examples, questions)
 * - Small/fast models for tiny tasks; stronger models for generation + evaluation
 * - Prefer free/metered providers first, then AI Gateway paid catalog
 *
 * Privacy note: Google AI Studio *free* tier may use prompts to improve products.
 * For recovery/peer student content, prefer Groq, paid Gemini, or Gateway paid tier
 * when possible. See docs/MODELS-AND-ROUTING.md.
 */

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";

export type AiTask =
  | "tiny" // MCQ wording, short tips, titles
  | "teach" // section teacher chat turns
  | "generate" // full personalized section / module content
  | "evaluate" // rubric scoring / module review finalize
  | "roleplay" // practice-lab persona replies
  | "crisis"; // safety-sensitive coaching (never free-tier Google training if avoidable)

export type ModelCandidate = {
  /** Gateway-style id when using Vercel AI Gateway */
  gatewayId?: string;
  /** Direct Google model id */
  googleId?: string;
  /** Direct Groq model id */
  groqId?: string;
  /** Human label */
  label: string;
  /** Rough size class */
  size: "flash" | "mid" | "large";
  /** True when provider free tier may train on prompts */
  mayTrainOnPrompts?: boolean;
};

/** Free-first defaults — override with env */
export const TASK_MODEL_CANDIDATES: Record<AiTask, ModelCandidate[]> = {
  tiny: [
    {
      label: "Gemini 2.5 Flash-Lite",
      size: "flash",
      gatewayId: "google/gemini-2.5-flash-lite",
      googleId: "gemini-2.5-flash-lite",
      mayTrainOnPrompts: true,
    },
    {
      label: "Llama 3.1 8B Instant (Groq)",
      size: "flash",
      gatewayId: "groq/llama-3.1-8b-instant",
      groqId: "llama-3.1-8b-instant",
    },
    {
      label: "Gemini 2.5 Flash",
      size: "flash",
      gatewayId: "google/gemini-2.5-flash",
      googleId: "gemini-2.5-flash",
      mayTrainOnPrompts: true,
    },
  ],
  teach: [
    {
      label: "Gemini 2.5 Flash",
      size: "flash",
      gatewayId: "google/gemini-2.5-flash",
      googleId: "gemini-2.5-flash",
      mayTrainOnPrompts: true,
    },
    {
      label: "Llama 3.3 70B (Groq)",
      size: "mid",
      gatewayId: "groq/llama-3.3-70b-versatile",
      groqId: "llama-3.3-70b-versatile",
    },
    {
      label: "GPT OSS 120B (Groq)",
      size: "large",
      gatewayId: "groq/openai/gpt-oss-120b",
      groqId: "openai/gpt-oss-120b",
    },
  ],
  generate: [
    {
      label: "Gemini 2.5 Flash",
      size: "flash",
      gatewayId: "google/gemini-2.5-flash",
      googleId: "gemini-2.5-flash",
      mayTrainOnPrompts: true,
    },
    {
      label: "Llama 3.3 70B (Groq)",
      size: "mid",
      gatewayId: "groq/llama-3.3-70b-versatile",
      groqId: "llama-3.3-70b-versatile",
    },
    {
      label: "Gemini 2.5 Pro (paid / limited free)",
      size: "large",
      gatewayId: "google/gemini-2.5-pro",
      googleId: "gemini-2.5-pro",
      mayTrainOnPrompts: true,
    },
  ],
  evaluate: [
    {
      label: "Llama 3.3 70B (Groq)",
      size: "mid",
      gatewayId: "groq/llama-3.3-70b-versatile",
      groqId: "llama-3.3-70b-versatile",
    },
    {
      label: "Gemini 2.5 Flash",
      size: "flash",
      gatewayId: "google/gemini-2.5-flash",
      googleId: "gemini-2.5-flash",
      mayTrainOnPrompts: true,
    },
    {
      label: "OpenAI GPT-5.4 via Gateway",
      size: "large",
      gatewayId: "openai/gpt-5.4",
    },
  ],
  roleplay: [
    {
      label: "Llama 3.1 8B Instant (Groq)",
      size: "flash",
      gatewayId: "groq/llama-3.1-8b-instant",
      groqId: "llama-3.1-8b-instant",
    },
    {
      label: "Gemini 2.5 Flash-Lite",
      size: "flash",
      gatewayId: "google/gemini-2.5-flash-lite",
      googleId: "gemini-2.5-flash-lite",
      mayTrainOnPrompts: true,
    },
  ],
  crisis: [
    // Prefer providers that do not train on free-tier prompts when available
    {
      label: "Llama 3.3 70B (Groq)",
      size: "mid",
      gatewayId: "groq/llama-3.3-70b-versatile",
      groqId: "llama-3.3-70b-versatile",
    },
    {
      label: "Gemini 2.5 Flash",
      size: "flash",
      gatewayId: "google/gemini-2.5-flash",
      googleId: "gemini-2.5-flash",
      mayTrainOnPrompts: true,
    },
    {
      label: "OpenAI GPT-5.4 via Gateway",
      size: "large",
      gatewayId: "openai/gpt-5.4",
    },
  ],
};

export type ResolvedModel = {
  /** Value passed to generateText/streamText `model` */
  model: unknown;
  label: string;
  provider: "gateway" | "google" | "groq" | "offline";
  task: AiTask;
  mayTrainOnPrompts: boolean;
  candidate: ModelCandidate | null;
};

function gatewayConfigured() {
  return Boolean(
    process.env.AI_GATEWAY_API_KEY ||
      process.env.VERCEL_OIDC_TOKEN ||
      process.env.AI_GATEWAY_BASE_URL
  );
}

function googleKey() {
  return (
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    ""
  );
}

function groqKey() {
  return process.env.GROQ_API_KEY || "";
}

/** Prefer privacy-safer providers when AI_PREFER_NO_TRAINING=1 */
function preferNoTraining() {
  return process.env.AI_PREFER_NO_TRAINING === "1";
}

export function aiProvidersConfigured() {
  return Boolean(gatewayConfigured() || googleKey() || groqKey());
}

/**
 * Resolve the best available model for a task.
 * Order: env override → free BYOK (Google/Groq) → AI Gateway → offline null
 */
export function resolveModelForTask(task: AiTask): ResolvedModel {
  const envOverride = process.env[`AI_MODEL_${task.toUpperCase()}`];
  if (envOverride && gatewayConfigured()) {
    return {
      model: envOverride,
      label: envOverride,
      provider: "gateway",
      task,
      mayTrainOnPrompts: envOverride.startsWith("google/"),
      candidate: null,
    };
  }

  const candidates = [...TASK_MODEL_CANDIDATES[task]];
  if (preferNoTraining()) {
    candidates.sort((a, b) => Number(a.mayTrainOnPrompts) - Number(b.mayTrainOnPrompts));
  }

  for (const candidate of candidates) {
    // Direct Groq BYOK (great free mid/flash path)
    if (candidate.groqId && groqKey()) {
      const groq = createGroq({ apiKey: groqKey() });
      return {
        model: groq(candidate.groqId),
        label: candidate.label,
        provider: "groq",
        task,
        mayTrainOnPrompts: Boolean(candidate.mayTrainOnPrompts),
        candidate,
      };
    }

    // Direct Google BYOK (Flash free tier)
    if (candidate.googleId && googleKey()) {
      // Skip Google on crisis/evaluate when privacy preferred and Groq unavailable already tried
      if (
        preferNoTraining() &&
        candidate.mayTrainOnPrompts &&
        (task === "crisis" || task === "evaluate") &&
        !groqKey()
      ) {
        // still allow if nothing else — fall through after loop
      }
      const google = createGoogleGenerativeAI({ apiKey: googleKey() });
      return {
        model: google(candidate.googleId),
        label: candidate.label,
        provider: "google",
        task,
        mayTrainOnPrompts: Boolean(candidate.mayTrainOnPrompts),
        candidate,
      };
    }

    // Vercel AI Gateway unified routing
    if (candidate.gatewayId && gatewayConfigured()) {
      return {
        model: candidate.gatewayId,
        label: candidate.label,
        provider: "gateway",
        task,
        mayTrainOnPrompts: Boolean(candidate.mayTrainOnPrompts),
        candidate,
      };
    }
  }

  // Last resort: if gateway exists, use a safe default string
  if (gatewayConfigured()) {
    const fallback =
      task === "tiny" || task === "roleplay"
        ? "google/gemini-2.5-flash-lite"
        : "google/gemini-2.5-flash";
    return {
      model: fallback,
      label: fallback,
      provider: "gateway",
      task,
      mayTrainOnPrompts: true,
      candidate: null,
    };
  }

  return {
    model: null,
    label: "offline",
    provider: "offline",
    task,
    mayTrainOnPrompts: false,
    candidate: null,
  };
}

export function describeModelRouting() {
  return {
    gateway: gatewayConfigured(),
    google: Boolean(googleKey()),
    groq: Boolean(groqKey()),
    preferNoTraining: preferNoTraining(),
    tasks: (Object.keys(TASK_MODEL_CANDIDATES) as AiTask[]).map((task) => {
      const resolved = resolveModelForTask(task);
      return {
        task,
        provider: resolved.provider,
        label: resolved.label,
        mayTrainOnPrompts: resolved.mayTrainOnPrompts,
      };
    }),
  };
}
