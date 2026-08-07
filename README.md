# Cascade Peer Academy

Oregon-focused **Peer Support Specialist (PSS, 40-hour)** and **Peer Wellness Specialist (PWS, 80-hour)** online academy — designed for OHA Traditional Health Worker training program approval.

## What this platform includes

- Full OHA-aligned modular curriculum (readings, quizzes, scenarios, reflections, documentation labs)
- Student dashboard with progress / hours tracking
- Admin & instructor dashboard (students, cohorts, attendance, competency evaluations, certificates)
- Delivery modes: **AYOP** (at your own pace) and **Hybrid** (self-paced + live Zoom)
- AI Tutor, AI mock interview, AI peer roleplay Practice Lab (with offline fallback)
- Certificate of completion issuance (supports OHA application — not itself state certification)

## Quick start

```bash
npm install
cp .env.example .env.local
# set AUTH_SECRET to a long random string
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Student | student@cascadepeer.academy | CascadeDemo2026! |
| Instructor | instructor@cascadepeer.academy | CascadeDemo2026! |
| Admin | admin@cascadepeer.academy | CascadeDemo2026! |

## AI features

Set `AI_GATEWAY_API_KEY` (Vercel AI Gateway) for live streaming tutor/roleplay/evaluation.
Without it, the app uses high-quality **offline fallback** responses so the UX still works for demos and local development.

## Documentation

- `docs/OHA-SUBMISSION-PACKET.md` — materials outline for OHA/TEMPS approval
- `docs/TECHNICAL.md` — architecture for developers
- `docs/LAYMAN-GUIDE.md` — plain-language guide for staff and students
- `lessons.cursorrules` — build lessons / gotchas

## Regulatory posture

Training must be offered by an **OHA-approved** THW training program before graduates can use certificates toward Oregon THW certification. This software encodes curriculum, assessment, and records workflows to support that approval pathway. See OAR 950-060 and OHA Equity & Inclusion THW pages.
