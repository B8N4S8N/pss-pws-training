# Technical documentation — Cascade Peer Academy

## Stack

- **Next.js 16** App Router + TypeScript + Tailwind CSS v4 + shadcn/ui
- **Prisma 7** + SQLite (`better-sqlite3` driver adapter) for greenfield local/prod-lite
- **Jose** JWT httpOnly cookie sessions
- **Vercel AI SDK** (`ai`) with AI Gateway model strings (`openai/gpt-5.4`)
- Offline fallbacks when gateway credentials are absent

## Key directories

```
prisma/schema.prisma          # data model
prisma/seed.ts                # demo users + full curriculum + personas
src/lib/curriculum/courses.ts # OHA-aligned PSS/PWS content source of truth
src/lib/auth.ts               # session helpers
src/lib/actions.ts            # server actions (auth, quizzes, certificates)
src/lib/ai/peer-ai.ts         # tutor/roleplay/evaluation helpers
src/app/(marketing pages)     # /, /programs, /approach, /oha
src/app/dashboard             # student home
src/app/learn/...             # module & lesson player
src/app/practice|tutor|interview
src/app/admin/...             # instructor/admin tools
src/app/api/ai/...            # AI route handlers
```

## Data model (summary)

Users (STUDENT/INSTRUCTOR/ADMIN) → Enrollments → Courses → Modules → Lessons  
Cohorts + LiveSessions + AttendanceRecords for Hybrid  
LessonProgress, QuizAttempt, Reflection  
AiPersona + AiSession  
CompetencyEvaluation + Certificate + Badge

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run db:setup` | generate + push + seed |
| `npm run db:seed` | reseed curriculum/users |
| `npm run dev` | local server |
| `npm run build` | production build |

## Auth

Demo credential auth suitable for MVP. Promote to Clerk/Auth.js + Postgres for production multi-tenant deployment. `AUTH_SECRET` required.

## AI

`POST /api/ai/tutor|roleplay|interview`  
Roleplay supports `evaluate: true` for structured scoring via `Output.object`.  
Never treat AI scores as sole completion authority — admin evaluation flow issues certificates.

## Migrating to Postgres

1. Change Prisma datasource to `postgresql`
2. Set `DATABASE_URL` to Neon/Vercel Postgres
3. Swap adapter to `@prisma/adapter-neon` (or pg)
4. `prisma migrate dev`

## Security notes

- Do not commit `.env` / `*.db`
- Crisis simulations are fictional training content; UI should remind students to use real-world crisis protocols with actual peers
- Production: add rate limits on AI routes, audit logs, encrypted backups

## Chaptered curriculum CMS structure

Curriculum content now lives in `src/lib/curriculum/` as typed seed data:

- `types.ts` defines courses, modules, chapters, lessons, references, learning modes, and quizzes.
- `pss.ts` and `pws.ts` are the chaptered OHA-aligned course sources. Each module has `chapters` as the preferred CMS structure.
- `helpers.ts` provides lesson builders and `flattenModuleLessons()` so legacy seed/admin/learn code can still read `module.lessons`.
- `courses.ts` re-exports `./index` for backward-compatible imports.

Admin CMS work should treat `Course -> Module -> Chapter -> Lesson` as the canonical editing model. Keep `lessons` as a derived flat compatibility field until the database/UI fully supports chapters.

## Hybrid curriculum assessment model

PSS/PWS curriculum now uses `Module -> Section chapter -> personable teaching -> section MCQ -> module AI review`.
Each section ends with a 4-question `QUIZ` (`isModuleQuiz: false`, 80% pass score). Each module's final lesson is `MODULE_AI_REVIEW` with `isModuleAiReview: true` and a structured `moduleAiReview` payload. The AI review is practice evidence for instructors; human instructor/admin review still controls completion and certification decisions.
