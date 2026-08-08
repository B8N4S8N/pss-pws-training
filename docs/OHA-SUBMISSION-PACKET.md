# OHA / TEMPS Training Program Submission Packet (Draft Outline)

Cascade Peer Academy — Peer Support Specialist (40h) & Peer Wellness Specialist (80h)

This document organizes evidence for an Oregon Health Authority Traditional Health Worker **initial training program application**. It is a living packet outline aligned to:

- [Become an OHA-approved THW training program](https://www.oregon.gov/oha/EI/Pages/Become-an-Oregon-Health-Authority-Approved-THW-Training-Program.aspx)
- OAR **950-060** (training program requirements & curriculum standards), including **950-060-0140**
- Public Law mirror of curriculum standards: [OAR 410-180-0370](https://oregon.public.law/rules/oar_410-180-0370) (historical numbering)

> Submit using OHA’s current application forms + TEMPS evaluation rubric. Applications are reviewed on OHA’s quarterly cycle — plan ~120 days ahead.

---

## 1. Organization

- Legal name, entity type (LLC / nonprofit / educational org / provider)
- Oregon business registration / FEIN
- Primary contact, physical/mailing address
- Statement of purpose: statewide / rural-accessible peer workforce pipeline
- Quality assurance & continuous improvement plan (student surveys, TEMPS feedback, instructor calibration)

## 2. Programs requested

| Program | Hours | Worker type |
|---------|-------|-------------|
| Cascade PSS Academy | 40 contact hours | Peer Support Specialist |
| Cascade PWS Academy | 80 contact hours | Peer Wellness Specialist |

Specializations supported in enrollment: Adult Addictions, Adult Mental Health, Family Support, Youth Support (as applicable to instructor capacity).

## 3. Teaching philosophy & methodology

**Competency-based hybrid digital academy**

1. Self-paced interactive modules (readings, quizzes, scenarios, reflections, documentation)
2. AI-assisted practice environment (roleplay clients, tutor, mock interviews) for high-repetition skill building
3. Hybrid live Zoom workshops (required for Hybrid cohorts; competency gates for AYOP)
4. **Human instructor final evaluation** — AI never alone issues completion

Framing for regulators: *AI multiplies practice repetitions; instructors authorize readiness.*

## 4. Curriculum map

See in-app **Admin → Curriculum** and source file `src/lib/curriculum/courses.ts`.

### PSS (40h) — covers 950-060-0140(5) / core topics including (2)(a)–(p) plus role/scope & recovery

1. Recovery Foundations & Peer Role  
2. Communication & Active Listening  
3. Boundaries, Ethics & Professional Conduct  
4. Trauma-Informed Care  
5. Crisis Identification & Safety  
6. Cultural Humility & Advocacy  
7. Motivational Interviewing Basics  
8. Documentation, HIPAA & Legal  
9. Systems Navigation & Community Resources  
10. Self-Care & Sustainable Peer Work  
11. Skills Lab, AI Practice & Competency Gate  

### PWS (80h) — adds 950-060-0140(2) expanded topics + (4)(a)–(e)

12. WRAP & Wellness Planning  
13. Addiction Recovery & Harm Reduction  
14. Group Facilitation  
15. Resilience & Self-Efficacy  
16. Advanced MI & Stages of Change  
17. Health Promotion, Chronic Disease & Whole Health  
18. Multidisciplinary Teams & Supervision  
19. Social Determinants & Community Partnerships  
20. Housing, Benefits & Oregon Resource Deep Dive  
21. Capstone Practicum & Final Evaluation  

Each module lists OAR references, competencies, estimated hours, and lesson-level assessments in the platform database after `npm run db:seed`.

## 5. Assessment & examination methods

| Method | Purpose |
|--------|---------|
| Section MCQs (pass typically ≥80%) | Quick must-know checks after each section (scope, safety, choice, confidentiality) |
| Module AI Review (conversational, recorded) | Applied judgment in plain language; rubric on peer voice, consent, scope/safety, warmth without rescue |
| Branching ethics/crisis scenarios | Applied judgment |
| Reflections & documentation exercises | Personal integration / recovery-oriented notes |
| AI Practice Lab roleplay portfolio | High-volume interpersonal practice |
| Live observed roleplay / oral evaluation | Human validation of interpersonal competence |
| Attendance records (Hybrid) | Contact-hour accountability |

**Assessment spine:** Module → Sections → section MCQ → AI module review → human competency gate.

Written + oral + practical combination satisfies OAR expectations for evaluating knowledge and skill mastery. AI reviews are practice evidence for instructors; humans authorize certificates of completion.

## 6. Attendance & participation policies

- **AYOP:** module completion timestamps + required live competency evaluation minutes
- **Hybrid:** live session attendance logged in admin dashboard; makeup policy via recorded workshop + instructor check-in
- Maximum time to complete: define in final OHA forms (e.g., 6 months PSS / 9 months PWS) with waiver pathway per OHA rules

## 7. Instructor qualifications (to attach resumes)

Preferred evidence package per instructor:

- Certified PSS and/or PWS (or equivalent peer credential)
- Years of peer practice + facilitation / adult education
- Trauma-informed, ethics, MI / recovery coaching training
- Experience supervising or mentoring peers

Experienced THWs involved in curriculum development and teaching (OAR training program requirement).

## 8. Student records retained

Platform stores (exportable for OHA audit):

- Enrollment, delivery mode, specialization
- Lesson progress, quiz attempts, reflections
- AI session history & scores
- Live attendance
- Competency evaluations & recommendations
- Certificates of completion (name, dates, hours, worker type, trainer, organization)

Retention policy: minimum per OHA expectations (propose 7 years).

## 9. Certificate of completion requirements

Issued only when:

1. Required instruction completed  
2. Competency requirements demonstrated  
3. Lived experience eligibility attested (PSS/PWS)  
4. Instructor recommendation = READY  

Certificate fields match OHA expectations: participant name, date range, worker type, hours, trainer name, organization name.  
**Note:** Certificate enables application to OHA — it is not state certification. Oral health training + background check + registry application remain student-side OHA steps.

## 10. Attachments checklist

- [ ] OHA Initial Training Program Application (PDF)
- [ ] TEMPS Evaluation Rubric self-score
- [ ] Syllabi / module outlines (export from Admin → Curriculum)
- [ ] Sample lesson plans & assessments
- [ ] Instructor CVs & credentials
- [ ] Attendance & grievance policies
- [ ] Sample certificate of completion
- [ ] Screenshots of student/admin dashboards & AI practice lab
- [ ] Data privacy / HIPAA-aligned platform security summary

---

*Prepared as part of the Cascade Peer Academy platform repository. Update with legal entity details before submission.*
