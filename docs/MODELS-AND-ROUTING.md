# Models & routing — Cascade Peer Academy

This branch adds **AI-created personalized modules** on top of fixed OHA guidelines, with **task-based model routing** (flash for small jobs, mid/large for big jobs).

## Product rule (non-negotiable)

| Fixed | Personalized |
|-------|----------------|
| Module goals, must-cover points, OAR map, pass rubrics, hour requirements | Stories, metaphors, examples, tone, quiz *wording*, teaching pace |
| Human certificate authorization | AI rehearsal + generation evidence for supervisors |

Custom **delivery**, not custom **standards**.

---

## The lowdown: free / metered options (Aug 2026)

### 1) Google Gemini via AI Studio (best free Flash quality)
- **Docs:** [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing), [rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- **Free tier:** Flash / Flash-Lite are the practical free workhorses. Pro is tightly limited or paid-gated depending on account/tier.
- **Typical free shape:** generous daily Flash requests vs Pro (often ~50 RPD-class limits on Pro when present at all). Exact RPM/RPD vary by project tier — check AI Studio.
- **Gotcha for peer training:** Free-tier prompts/outputs **may be used to improve Google products**. For recovery/student content, treat this as a privacy risk.
- **Env:** `GOOGLE_GENERATIVE_AI_API_KEY` or `GEMINI_API_KEY`
- **Use for:** `generate`, `teach` (Flash), `tiny` (Flash-Lite)

### 2) Groq (best free speed + stronger open models, no card for free plan)
- **Docs:** [Groq rate limits](https://console.groq.com/docs/rate-limits)
- **Free plan examples (org-level):** e.g. `llama-3.1-8b-instant` high daily RPM/RPD; `llama-3.3-70b-versatile` and `openai/gpt-oss-120b` usable but tighter daily caps; ~30 RPM class on many models.
- **Why we like it:** Fast, free tier without prepaid credits, solid mid-size models for evaluation/roleplay, generally better privacy posture than Google free training terms.
- **Env:** `GROQ_API_KEY`
- **Use for:** `tiny`/`roleplay` (8B), `teach`/`generate`/`evaluate`/`crisis` (70B / gpt-oss-120b)

### 3) Vercel AI Gateway (unified routing; free subset + paid credits)
- **Docs:** [AI Gateway pricing](https://vercel.com/docs/ai-gateway/pricing), [models](https://vercel.com/ai-gateway/models)
- **Free tier:** subset of catalog + rate limits; not full frontier access. Some models get temporary free-tier restrictions under abuse controls.
- **Paid:** buy credits, no markup on provider list price; BYOK available on paid tier.
- **Env:** `AI_GATEWAY_API_KEY` and/or Vercel OIDC
- **Use for:** production failover + paid quality models (`openai/gpt-5.4`, paid Gemini, etc.)

### 4) OpenRouter `:free` models (breadth fallback — not primary)
- Free-tagged models exist, but daily free request caps are tight until you purchase a small credit amount.
- Good as optional breadth/failover later; not our default path in this branch.

### What we recommend for Cascade right now

**Dev / low-cost launch**
1. `GROQ_API_KEY` (chat + eval + roleplay)
2. optional `GOOGLE_GENERATIVE_AI_API_KEY` for Flash generation quality
3. set `AI_PREFER_NO_TRAINING=1` so Groq wins when both exist (especially crisis/eval)

**Production / OHA-serious**
1. Vercel AI Gateway credits (observability + failover)
2. BYOK Groq + paid Gemini (or Gateway Google) so student content isn’t on free-training tiers
3. Keep offline fallbacks (already in code) for demos and outages

---

## Task → model size map

| Task | Job | Default size |
|------|-----|--------------|
| `tiny` | MCQ wording, tips, titles | Flash / 8B |
| `roleplay` | Practice Lab persona turns | Flash / 8B |
| `teach` | Section teacher + module review chat | Flash / 70B |
| `generate` | Full personalized section content | Flash / 70B (+ Pro if paid) |
| `evaluate` | Rubric scoring | 70B / Flash / paid GPT |
| `crisis` | Safety-sensitive coaching | Prefer no-training mid/large |

Code: `src/lib/ai/models.ts` → `resolveModelForTask()`.

Env overrides: `AI_MODEL_TINY`, `AI_MODEL_TEACH`, `AI_MODEL_GENERATE`, `AI_MODEL_EVALUATE`, `AI_MODEL_ROLEPLAY`, `AI_MODEL_CRISIS` (Gateway model strings).

---

## How AI-created modules work

1. Canonical guidelines live in curriculum (`pss.ts` / `pws.ts` / hybrid builder).
2. Learner profile at `/learn/personalize` (style, plain language, example themes).
3. `POST /api/ai/generate-section` builds a personalized section + quiz from those guidelines.
4. Saves `GeneratedContent` + `AiSession(type=GENERATED_CURRICULUM)` for admin supervision.
5. Hybrid assessment spine still applies: section checks + module AI review + human gate.

---

## Privacy checklist

- [ ] Prefer `AI_PREFER_NO_TRAINING=1` for student recovery content
- [ ] Do not put crisis disclosures on free Google training tier if avoidable
- [ ] Tell students in UI that AI practice is recorded for instructors
- [ ] Humans still certify — AI never issues OHA completion alone
