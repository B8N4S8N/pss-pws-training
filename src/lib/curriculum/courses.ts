/**
 * OHA-aligned curriculum for Cascade Peer Academy
 * Maps to OAR 950-060-0140 / historically 410-180-0370 THW curriculum standards.
 *
 * PSS: minimum 40 contact hours — core topics (2)(a)–(p) + role/scope + recovery/resilience/wellness
 * PWS: minimum 80 contact hours — full core (2)(a)–(bb) + PWS extras (4)(a)–(e)
 *
 * Sources:
 * - https://secure.sos.state.or.us/oard/displayDivisionRules.action?selectedDivision=7798
 * - https://oregon.public.law/rules/oar_410-180-0370
 * - https://www.oregon.gov/oha/EI/Pages/THW-Training-Certification-Requirements.aspx
 */

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

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
};

export type ModuleSeed = {
  slug: string;
  title: string;
  description: string;
  estimatedHours: number;
  oarReferences: string[];
  competencies: string[];
  lessons: LessonSeed[];
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

function quiz(questions: QuizQuestion[]) {
  return { questions };
}

function reading(title: string, body: string, minutes = 25): LessonSeed {
  return {
    slug: title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    title,
    type: "READING",
    estimatedMinutes: minutes,
    contentMd: body,
  };
}

const CORE_PSS_MODULES: ModuleSeed[] = [
  {
    slug: "recovery-foundations",
    title: "Module 1 — Recovery Foundations & the Peer Role",
    description:
      "Ground yourself in recovery principles, recovery capital, and the unique value of lived experience in Oregon's peer-delivered services system.",
    estimatedHours: 4,
    oarReferences: [
      "950-060-0140(2)(s)",
      "950-060-0140(5)(b)",
      "950-060-0140(5)(c)",
    ],
    competencies: [
      "recovery-principles",
      "peer-role-scope",
      "recovery-capital",
      "lived-experience",
    ],
    lessons: [
      reading(
        "What Peer Support Is (and Is Not)",
        `# What Peer Support Is (and Is Not)

Peer support is rooted in **mutuality**, **hope**, and **lived experience**. In Oregon, Peer Support Specialists (PSS) and Peer Wellness Specialists (PWS) are Traditional Health Workers (THWs) under the Oregon Health Authority (OHA).

## Core ideas
- You walk beside people — you do not diagnose, prescribe, or "fix" them.
- Your credibility comes from shared experience and relationship, not clinical hierarchy.
- Recovery is self-defined: housing, relationships, purpose, wellness, sobriety goals, and meaning can all count.

## Scope of practice
PSS/PWS work may include:
- Sharing recovery stories strategically
- Modeling wellness and coping
- Helping peers navigate services and systems
- Advocacy and accompaniment
- Wellness planning and resource connection

PSS/PWS work does **not** include:
- Clinical assessment or diagnosis
- Providing therapy as a licensed clinician
- Making medical decisions for someone else
- Dual relationships that exploit power

## Oregon context
Graduates of an **OHA-approved** training program receive a certificate of **completion**. That certificate allows application for THW certification/registry enrollment — it is not itself state certification.

References: OAR 950-060 (THW training & certification); OHA Peer-Delivered Services.`,
        30
      ),
      reading(
        "Recovery Capital and Hope",
        `# Recovery Capital and Hope

**Recovery capital** is the depth and breadth of resources a person can draw on to initiate and sustain recovery.

## Domains
1. **Human** — skills, health, coping, values
2. **Social** — supportive relationships, community
3. **Physical** — housing, income, transportation, food
4. **Cultural** — belonging, identity, spirituality, community norms

As a peer worker, you help people **notice and build** capital — not catalog deficits.

## Hope as a practice
Hope is not toxic positivity. It is the believable next step. Peers often hold hope when someone cannot yet hold it for themselves — without minimizing pain.`,
        25
      ),
      {
        slug: "recovery-foundations-quiz",
        title: "Knowledge Check: Recovery Foundations",
        type: "QUIZ",
        estimatedMinutes: 15,
        contentMd: "Demonstrate understanding of peer role and recovery capital.",
        interactivePayload: quiz([
          {
            id: "q1",
            prompt: "Which statement best describes Oregon peer support scope?",
            options: [
              "Peers diagnose mental health conditions under supervision",
              "Peers walk alongside people using lived experience within a defined non-clinical scope",
              "Peers replace licensed clinicians for therapy sessions",
              "Peers only provide transportation and paperwork help",
            ],
            correctIndex: 1,
            explanation:
              "Peer support is relational and non-clinical; diagnosis/therapy are outside PSS/PWS scope.",
          },
          {
            id: "q2",
            prompt: "Recovery capital primarily refers to:",
            options: [
              "Only the amount of money someone has saved",
              "A person's deficits that must be fixed before recovery",
              "Internal and external resources that support recovery",
              "A clinical assessment score",
            ],
            correctIndex: 2,
            explanation:
              "Recovery capital includes human, social, physical, and cultural resources.",
          },
          {
            id: "q3",
            prompt:
              "An OHA-approved training certificate of completion means:",
            options: [
              "The graduate is automatically a state-certified THW",
              "The graduate may apply for THW certification/registry using that training evidence",
              "No further steps are required for Medicaid billing eligibility",
              "The graduate may supervise other peers immediately",
            ],
            correctIndex: 1,
            explanation:
              "Completion certificates support application; OHA certification/registry is a separate process.",
          },
        ]),
      },
      {
        slug: "recovery-reflection",
        title: "Reflection: Your Recovery Story as a Tool",
        type: "REFLECTION",
        estimatedMinutes: 20,
        contentMd: `Write 250–400 words on how you might share a piece of your lived experience strategically with a peer — what you would share, what you would hold private, and how you would keep the focus on their goals.`,
      },
    ],
  },
  {
    slug: "communication",
    title: "Module 2 — Communication & Active Listening",
    description:
      "Practice cross-cultural communication, reflective listening, open questions, and presence.",
    estimatedHours: 4,
    oarReferences: ["950-060-0140(2)(b)", "950-060-0140(2)(c)"],
    competencies: [
      "active-listening",
      "open-questions",
      "reflective-statements",
      "empowerment",
    ],
    lessons: [
      reading(
        "Presence, Listening, and Power",
        `# Presence, Listening, and Power

Active listening in peer work is more than silence. It is **attention + reflection + curiosity** without hijacking the conversation.

## Skills
- Minimal encouragers and body language that fit the cultural context
- Reflective statements ("It sounds like…")
- Summaries that organize meaning
- Open-ended questions that invite story, not interrogation
- Sitting with silence

## Empowerment stance
Ask: *What matters most to you right now?* rather than *Have you tried…?*

Avoid: advice-giving as default, interrupting with your own story, debating someone's reality.`,
        25
      ),
      {
        slug: "communication-scenario",
        title: "Scenario: The Peer Who Shuts Down",
        type: "SCENARIO",
        estimatedMinutes: 25,
        contentMd:
          "Practice choosing responses that keep dignity and invitation open.",
        interactivePayload: {
          scenario:
            "Jordan (28) says: 'Everyone keeps telling me what to do. I'm done talking.'",
          choices: [
            {
              text: "You're being resistant. Let's make a plan anyway.",
              feedback:
                "Labels and pressure escalate shutdown. Not trauma-informed.",
              score: 0,
            },
            {
              text: "It makes sense you'd feel overloaded. We can slow down — what would feel useful, if anything, today?",
              feedback:
                "Validates experience, restores choice, keeps door open.",
              score: 100,
            },
            {
              text: "Fine — call me when you're ready to engage.",
              feedback:
                "Abandons relationship without repair. Misses opportunity for mutuality.",
              score: 30,
            },
          ],
        },
      },
      {
        slug: "communication-quiz",
        title: "Knowledge Check: Communication",
        type: "QUIZ",
        estimatedMinutes: 15,
        contentMd: "Check listening and empowerment skills.",
        interactivePayload: quiz([
          {
            id: "c1",
            prompt: "Which is the strongest open-ended question?",
            options: [
              "Did you take your medication?",
              "Are you still using?",
              "What has been helping you get through this week?",
              "You went to the meeting, right?",
            ],
            correctIndex: 2,
            explanation:
              "Open questions invite narrative and strengths without forcing yes/no.",
          },
          {
            id: "c2",
            prompt: "A reflective statement primarily:",
            options: [
              "Gives advice",
              "Mirrors meaning/feeling to check understanding",
              "Documents for the chart",
              "Challenges irrational thoughts",
            ],
            correctIndex: 1,
            explanation:
              "Reflections deepen understanding and show you are listening.",
          },
        ]),
      },
    ],
  },
  {
    slug: "boundaries-ethics",
    title: "Module 3 — Boundaries, Ethics & Professional Conduct",
    description:
      "Navigate dual relationships, confidentiality, gifts, social media, and ethical gray zones.",
    estimatedHours: 4,
    oarReferences: [
      "950-060-0140(2)(i)",
      "950-060-0140(2)(j)",
      "950-060-0140(2)(l)",
    ],
    competencies: [
      "ethics",
      "boundaries",
      "confidentiality",
      "professional-conduct",
      "hipaa",
    ],
    lessons: [
      reading(
        "Ethics in a Multicultural Peer Context",
        `# Ethics in a Multicultural Peer Context

Peer ethics center **dignity, consent, confidentiality, and non-exploitation**.

## Common boundary challenges
- Running into peers in the community
- Friend requests on social media
- Transportation and money
- Romantic/sexual attraction
- Sharing personal contact information
- Working in small rural Oregon communities where dual relationships are hard to avoid

## Practice
When dual relationships are unavoidable, **disclose, document, consult, and minimize harm**. Use supervision.

## Confidentiality & HIPAA
Share minimum necessary information. Know mandatory reporting limits in Oregon and your employer's policies. Never gossip about peers "for support" outside appropriate channels.`,
        30
      ),
      {
        slug: "ethics-scenario",
        title: "Scenario: The Gift and the Ride Home",
        type: "SCENARIO",
        estimatedMinutes: 20,
        contentMd: "Choose the most ethical path.",
        interactivePayload: {
          scenario:
            "A peer offers you $40 and asks for a ride home after a hard meeting. You live nearby.",
          choices: [
            {
              text: "Take the money and give the ride — it's practical.",
              feedback: "Money creates obligation and role confusion.",
              score: 10,
            },
            {
              text: "Decline money, explore safer transport options, and consult supervisor about ride policies.",
              feedback:
                "Protects relationship, follows policy channels, keeps peer autonomy.",
              score: 100,
            },
            {
              text: "Post about it on Facebook asking what others would do, naming the peer.",
              feedback: "Confidentiality breach.",
              score: 0,
            },
          ],
        },
      },
      {
        slug: "ethics-quiz",
        title: "Knowledge Check: Ethics & Boundaries",
        type: "QUIZ",
        estimatedMinutes: 15,
        contentMd: "Ethics mastery check.",
        interactivePayload: quiz([
          {
            id: "e1",
            prompt: "Best first step when unsure about a boundary issue:",
            options: [
              "Decide alone and keep it private",
              "Ask the peer to keep it secret",
              "Consult supervision/policy and document as required",
              "Ask unrelated friends online",
            ],
            correctIndex: 2,
            explanation: "Supervision and policy protect peers and workers.",
          },
          {
            id: "e2",
            prompt: "Confidentiality means:",
            options: [
              "Never speak about the peer in any professional context",
              "Share freely with other staff in the break room",
              "Protect information and share only as authorized/required",
              "Post anonymized stories with enough detail to identify someone",
            ],
            correctIndex: 2,
            explanation:
              "Confidentiality allows appropriate care-team sharing under policy — not gossip or social media.",
          },
        ]),
      },
    ],
  },
  {
    slug: "trauma-informed",
    title: "Module 4 — Trauma-Informed Care",
    description:
      "Understand trauma impacts, minimize re-traumatization, and practice safety, trust, choice, collaboration, and empowerment.",
    estimatedHours: 4,
    oarReferences: ["950-060-0140(2)(o)"],
    competencies: [
      "trauma-informed-care",
      "safety",
      "choice",
      "re-traumatization-prevention",
    ],
    lessons: [
      reading(
        "Trauma-Informed Peer Practice",
        `# Trauma-Informed Peer Practice

Trauma-informed care asks: **What happened to you?** — not **What is wrong with you?**

## Principles (adapted for peer roles)
1. Safety
2. Trustworthiness & transparency
3. Peer support & mutuality
4. Collaboration & mutuality
5. Empowerment, voice, and choice
6. Cultural, historical, and gender humility

## Minimize re-traumatization
- Ask permission before sensitive topics
- Avoid forcing disclosure of trauma details
- Watch power dynamics in rooms, doors, tone, and surprise touch
- Offer predictable structure

Peers are not trauma therapists. You support regulation, connection, and pathways to appropriate care.`,
        30
      ),
      {
        slug: "trauma-reflection",
        title: "Reflection: Safety in the Room",
        type: "REFLECTION",
        estimatedMinutes: 20,
        contentMd:
          "Describe three concrete ways you will make a first meeting feel safer for someone with trauma history (environment, language, pacing).",
      },
      {
        slug: "trauma-quiz",
        title: "Knowledge Check: Trauma-Informed Care",
        type: "QUIZ",
        estimatedMinutes: 15,
        contentMd: "TIC knowledge check.",
        interactivePayload: quiz([
          {
            id: "t1",
            prompt: "A trauma-informed peer response prioritizes:",
            options: [
              "Extracting a full trauma history in the first meeting",
              "Safety, choice, and paced trust-building",
              "Confronting denial immediately",
              "Diagnosing PTSD",
            ],
            correctIndex: 1,
            explanation:
              "Safety and choice reduce re-traumatization; peers do not diagnose.",
          },
        ]),
      },
    ],
  },
  {
    slug: "crisis-safety",
    title: "Module 5 — Crisis Identification & Safety",
    description:
      "Recognize suicide risk, overdose/intoxication, psychiatric crisis, and practice safety planning within peer scope.",
    estimatedHours: 4,
    oarReferences: ["950-060-0140(2)(k)"],
    competencies: [
      "suicide-awareness",
      "overdose-response",
      "crisis-identification",
      "safety-planning",
      "narcan-awareness",
    ],
    lessons: [
      reading(
        "Crisis Within Peer Scope",
        `# Crisis Within Peer Scope

Peers often meet people in the hardest hours. Your job is **recognize, relate, and route** — not replace crisis clinicians or 911 when acute danger is present.

## Domains
- Suicidal ideation and planning
- Overdose / intoxication emergencies
- Psychiatric crisis (including psychosis-related distress)
- Interpersonal violence / immediate safety

## Actions
1. Stay calm and present
2. Ask directly about suicide when concerned
3. Know local crisis lines (988), employer protocols, and when to escalate
4. Support safety planning (warning signs, coping, people, places, means reduction) without promising secrecy about imminent harm
5. Overdose: call emergency services, use naloxone if trained/available, recovery position

## Oregon resources
- 988 Suicide & Crisis Lifeline
- Lines for Life / local crisis services
- Employer on-call / emergency protocols

This module prepares you for practice simulations; it does not replace organization-specific emergency training.`,
        35
      ),
      {
        slug: "crisis-roleplay-intro",
        title: "Prep: Crisis Roleplay Expectations",
        type: "READING",
        estimatedMinutes: 15,
        contentMd: `# Crisis Roleplay Expectations

In the AI Practice Lab you will encounter simulated peers in distress. Rules:
- Treat simulations seriously
- Practice asking directly about suicide
- Never agree to keep imminent harm secret
- Debrief with AI feedback and, in hybrid tracks, with instructors
- If a simulation triggers you, pause, use your wellness plan, and contact supports`,
      },
      {
        slug: "crisis-quiz",
        title: "Knowledge Check: Crisis & Safety",
        type: "QUIZ",
        estimatedMinutes: 15,
        contentMd: "Crisis knowledge check.",
        interactivePayload: quiz([
          {
            id: "k1",
            prompt: "If a peer describes a specific plan and intent for suicide tonight, you should:",
            options: [
              "Keep confidentiality no matter what",
              "Change the subject to reduce distress",
              "Follow crisis protocol / escalate for safety",
              "Argue that things will get better and leave",
            ],
            correctIndex: 2,
            explanation:
              "Imminent risk requires protocol-based escalation; confidentiality has safety limits.",
          },
          {
            id: "k2",
            prompt: "Naloxone (Narcan) is used to:",
            options: [
              "Treat alcohol withdrawal",
              "Reverse opioid overdose",
              "Sedate someone in psychosis",
              "Replace calling 911",
            ],
            correctIndex: 1,
            explanation:
              "Naloxone reverses opioid overdose; still call emergency services.",
          },
        ]),
      },
    ],
  },
  {
    slug: "culture-advocacy",
    title: "Module 6 — Cultural Humility & Advocacy",
    description:
      "Practice cultural humility, cross-cultural relationships, and advocacy without saviorism.",
    estimatedHours: 3,
    oarReferences: [
      "950-060-0140(2)(e)",
      "950-060-0140(2)(h)",
      "950-060-0140(2)(a)",
    ],
    competencies: [
      "cultural-humility",
      "advocacy",
      "community-engagement",
      "anti-oppression",
    ],
    lessons: [
      reading(
        "Cultural Humility Over Cultural Competence Checklists",
        `# Cultural Humility

Cultural humility is lifelong learning, self-critique, and redressing power imbalances — not mastery of "other cultures."

## Practice
- Ask how someone identifies and what matters in their healing
- Notice assumptions about family, religion, gender, disability, recovery pathways
- Advocate *with* people, not *over* them
- Bridge systems without forcing assimilation

Oregon communities are diverse — tribal nations, immigrant communities, rural towns, LGBTQ+ peers, Deaf community, veterans, and more. Your job is relationship and respect.`,
        25
      ),
      {
        slug: "advocacy-scenario",
        title: "Scenario: Clinic Front Desk",
        type: "SCENARIO",
        estimatedMinutes: 20,
        contentMd: "Advocate without taking over.",
        interactivePayload: {
          scenario:
            "Your peer is dismissed rudely at a clinic desk and wants to leave forever.",
          choices: [
            {
              text: "Yell at the receptionist for them.",
              feedback: "May escalate and center you, not the peer's agency.",
              score: 20,
            },
            {
              text: "Validate feelings, ask what support they want (speak up with them, request supervisor, reschedule, file feedback), and follow their lead.",
              feedback: "Collaborative advocacy preserves dignity and choice.",
              score: 100,
            },
            {
              text: "Tell them to toughen up because systems are always like this.",
              feedback: "Minimizes harm and models hopelessness.",
              score: 0,
            },
          ],
        },
      },
      {
        slug: "culture-quiz",
        title: "Knowledge Check: Culture & Advocacy",
        type: "QUIZ",
        estimatedMinutes: 10,
        contentMd: "Culture & advocacy check.",
        interactivePayload: quiz([
          {
            id: "a1",
            prompt: "Cultural humility emphasizes:",
            options: [
              "Memorizing facts about every culture",
              "Lifelong learning and addressing power imbalances",
              "Treating everyone exactly the same with no adaptation",
              "Avoiding all conversations about identity",
            ],
            correctIndex: 1,
            explanation:
              "Humility is process-oriented and power-aware, not a trivia checklist.",
          },
        ]),
      },
    ],
  },
  {
    slug: "motivational-interviewing",
    title: "Module 7 — Motivational Interviewing Basics",
    description:
      "Learn MI spirit and core skills: partnership, acceptance, compassion, evocation; OARS.",
    estimatedHours: 4,
    oarReferences: ["950-060-0140(2)(z)", "950-060-0140(4)(e)"],
    competencies: [
      "motivational-interviewing",
      "oars",
      "stages-of-change",
      "change-talk",
    ],
    lessons: [
      reading(
        "MI Spirit and OARS for Peers",
        `# Motivational Interviewing for Peers

MI is a collaborative conversation style that strengthens a person's own motivation for change.

## Spirit
- Partnership
- Acceptance
- Compassion
- Evocation

## OARS
- **O**pen questions
- **A**ffirmations
- **R**eflections
- **S**ummaries

## Stages of change
Precontemplation → Contemplation → Preparation → Action → Maintenance (and relapse as part of learning)

Peers use MI to avoid the "righting reflex" — the urge to fix — and instead evoke the peer's own reasons for change.`,
        30
      ),
      {
        slug: "mi-documentation",
        title: "Practice: Evoking Change Talk",
        type: "DOCUMENTATION",
        estimatedMinutes: 25,
        contentMd:
          "Write three OARS responses to: 'I know drinking is wrecking my housing, but it's the only way I sleep.'",
        interactivePayload: {
          prompt:
            "Provide one Open question, one Affirmation, one Reflection for the statement above.",
          rubric: [
            "Uses open (not closed) question",
            "Affirmation is genuine and specific",
            "Reflection captures ambivalence without arguing for change",
          ],
        },
      },
      {
        slug: "mi-quiz",
        title: "Knowledge Check: MI",
        type: "QUIZ",
        estimatedMinutes: 15,
        contentMd: "MI check.",
        interactivePayload: quiz([
          {
            id: "m1",
            prompt: "The 'righting reflex' refers to:",
            options: [
              "A first-aid technique",
              "The urge to correct or fix someone else's behavior",
              "Documenting progress notes correctly",
              "Mandatory reporting",
            ],
            correctIndex: 1,
            explanation:
              "MI trains us to resist fixing and instead evoke the person's motivation.",
          },
        ]),
      },
    ],
  },
  {
    slug: "documentation-legal",
    title: "Module 8 — Documentation, HIPAA & Legal Responsibilities",
    description:
      "Write recovery-oriented notes, understand Medicaid-relevant documentation expectations, and legal duties.",
    estimatedHours: 3,
    oarReferences: [
      "950-060-0140(2)(j)",
      "950-060-0140(2)(u)",
      "950-060-0140(2)(v)",
    ],
    competencies: [
      "documentation",
      "hipaa",
      "medicaid-awareness",
      "legal-responsibilities",
    ],
    lessons: [
      reading(
        "Recovery-Oriented Documentation",
        `# Recovery-Oriented Documentation

Notes should be **factual, respectful, and necessary**.

## Guidelines
- Write as if the peer will read it
- Describe behavior and peer-reported experience — avoid pejorative labels
- Connect activities to goals and peer voice
- Know your organization's EHR and billing rules
- Never document gossip or unverified claims as fact

## Legal
Understand mandatory reporting categories relevant to your role and setting. When unsure, consult supervisors — do not freelance legal interpretations.`,
        25
      ),
      {
        slug: "documentation-exercise",
        title: "Exercise: Write a Peer Progress Note",
        type: "DOCUMENTATION",
        estimatedMinutes: 30,
        contentMd: `Scenario: You met Alex for 45 minutes at a resource center. Alex wanted help calling OHHP/OHP enrollment support and practiced a grounding skill. Alex declined shelter referral today but asked to revisit Friday.

Write a brief progress note (SOAP or DAP style) that is recovery-oriented.`,
        interactivePayload: {
          prompt: "Write a recovery-oriented progress note for the Alex visit.",
          rubric: [
            "Includes peer voice/goals",
            "Avoids stigmatizing language",
            "States facts and peer decisions clearly",
            "Notes follow-up",
          ],
        },
      },
      {
        slug: "documentation-quiz",
        title: "Knowledge Check: Documentation",
        type: "QUIZ",
        estimatedMinutes: 10,
        contentMd: "Documentation check.",
        interactivePayload: quiz([
          {
            id: "d1",
            prompt: "Best documentation practice:",
            options: [
              "Use sarcastic humor to keep notes interesting",
              "Record respectful, necessary, goal-linked facts",
              "Copy-paste the same note daily",
              "Include other peers' names freely for context",
            ],
            correctIndex: 1,
            explanation:
              "Notes should be necessary, respectful, and tied to support provided.",
          },
        ]),
      },
    ],
  },
  {
    slug: "systems-resources",
    title: "Module 9 — Systems Navigation & Community Resources",
    description:
      "Navigate Oregon behavioral health, housing, benefits, and mutual-aid resources with peers.",
    estimatedHours: 3,
    oarReferences: [
      "950-060-0140(2)(d)",
      "950-060-0140(2)(m)",
      "950-060-0140(2)(n)",
    ],
    competencies: [
      "systems-navigation",
      "community-resources",
      "benefits-literacy",
      "family-support-systems",
    ],
    lessons: [
      reading(
        "Navigating Oregon Systems",
        `# Navigating Oregon Systems

Peers help people move through complex systems:
- Oregon Health Plan (OHP) / coordinated care organizations (CCOs)
- Community mental health programs
- SUD treatment and recovery support
- Housing (Continuum of Care, shelters, rapid rehousing)
- SNAP, SSI/SSDI advocacy pathways
- Peer-run organizations and mutual aid

## Skills
- Warm handoffs
- Accompanying to appointments when appropriate
- Teaching systems literacy without creating dependency
- Knowing when to involve case managers / navigators

Build a living resource list for your region — rural Oregon access differs from Portland metro.`,
        30
      ),
      {
        slug: "resource-scenario",
        title: "Scenario: Newly Homeless Family",
        type: "SCENARIO",
        estimatedMinutes: 20,
        contentMd: "Prioritize navigation steps.",
        interactivePayload: {
          scenario:
            "A peer and their child just lost housing. They are overwhelmed and asking you to 'fix it.'",
          choices: [
            {
              text: "Promise you will find them an apartment by tomorrow.",
              feedback: "Overpromising harms trust.",
              score: 10,
            },
            {
              text: "Slow down, assess immediate safety/needs, co-create next steps (211/homeless services, shelter options, benefits), and clarify what you can do together today.",
              feedback: "Collaborative, realistic, empowerment-based.",
              score: 100,
            },
            {
              text: "Tell them to search Craigslist and call you later.",
              feedback: "Abandons without scaffolding.",
              score: 20,
            },
          ],
        },
      },
      {
        slug: "systems-quiz",
        title: "Knowledge Check: Systems",
        type: "QUIZ",
        estimatedMinutes: 10,
        contentMd: "Systems check.",
        interactivePayload: quiz([
          {
            id: "s1",
            prompt: "A warm handoff means:",
            options: [
              "Emailing a link and ending the conversation",
              "Actively connecting a peer to a person/service with consent and continuity",
              "Driving someone without asking",
              "Filing a complaint",
            ],
            correctIndex: 1,
            explanation:
              "Warm handoffs preserve relationship and reduce drop-off.",
          },
        ]),
      },
    ],
  },
  {
    slug: "self-care",
    title: "Module 10 — Self-Care & Sustainable Peer Work",
    description:
      "Build personal wellness practices, recognize vicarious trauma, and use supervision.",
    estimatedHours: 3,
    oarReferences: ["950-060-0140(2)(p)"],
    competencies: ["self-care", "vicarious-trauma", "supervision-use"],
    lessons: [
      reading(
        "Self-Care Is an Ethical Obligation",
        `# Self-Care Is an Ethical Obligation

Burned-out peers can unintentionally harm relationships. Self-care is professional sustainability — not a luxury.

## Practices
- Personal WRAP / wellness plan
- Supervision and peer consultation
- Boundaries around after-hours contact
- Grief and secondary trauma supports
- Knowing when to step back

You will practice building your own plan in the reflection.`,
        20
      ),
      {
        slug: "self-care-reflection",
        title: "Reflection: Personal Wellness Plan",
        type: "REFLECTION",
        estimatedMinutes: 25,
        contentMd:
          "Create a one-page wellness plan: early warning signs, daily supports, people you can call, and boundaries for this training/work.",
      },
      {
        slug: "self-care-quiz",
        title: "Knowledge Check: Self-Care",
        type: "QUIZ",
        estimatedMinutes: 10,
        contentMd: "Self-care check.",
        interactivePayload: quiz([
          {
            id: "sc1",
            prompt: "Vicarious trauma refers to:",
            options: [
              "A peer lying about trauma",
              "Impact on helpers from exposure to others' traumatic material",
              "Only physical injuries on the job",
              "Failing a quiz",
            ],
            correctIndex: 1,
            explanation:
              "Helpers can be affected by repeated exposure to traumatic stories; supports matter.",
          },
        ]),
      },
    ],
  },
  {
    slug: "pss-practice-lab",
    title: "Module 11 — Skills Lab, AI Practice & Competency Gate",
    description:
      "Integrate skills through AI roleplays, documentation, and readiness for live evaluation.",
    estimatedHours: 4,
    oarReferences: ["950-060-0100", "950-060-0140(5)"],
    competencies: [
      "integrated-practice",
      "competency-demonstration",
      "roleplay-mastery",
    ],
    lessons: [
      reading(
        "Competency-Based Completion",
        `# Competency-Based Completion

Cascade Peer Academy does not treat seat time alone as mastery. To complete PSS you will:
1. Finish required modules and quizzes (passing score typically 80%+)
2. Complete required AI practice sessions across domains
3. Submit documentation exercises
4. For hybrid tracks: attend required live workshops
5. Pass a final human instructor competency evaluation

AI is a **practice environment**. Human instructors make final completion recommendations.`,
        20
      ),
      {
        slug: "pss-roleplay-required",
        title: "Required: Complete AI Roleplay Set (PSS)",
        type: "ROLEPLAY",
        estimatedMinutes: 90,
        contentMd:
          "Complete at least 8 AI peer sessions covering listening, boundaries, crisis routing, and MI. Use the Practice Lab.",
      },
      {
        slug: "pss-live-eval-prep",
        title: "Live Evaluation Prep (Hybrid / Final Gate)",
        type: "LIVE_SESSION",
        estimatedMinutes: 60,
        contentMd:
          "Prepare for observed roleplay with an instructor. Bring questions and review your AI feedback history.",
      },
    ],
  },
];

const PWS_EXTRA_MODULES: ModuleSeed[] = [
  {
    slug: "wrap-wellness",
    title: "Module 12 — WRAP & Wellness Planning",
    description:
      "Facilitate Wellness Recovery Action Planning concepts and individualized wellness tools.",
    estimatedHours: 4,
    oarReferences: ["950-060-0140(4)(d)", "950-060-0140(5)(c)"],
    competencies: ["wrap", "wellness-planning", "recovery-tools"],
    lessons: [
      reading(
        "WRAP Foundations for Peer Wellness",
        `# WRAP & Wellness Planning

Wellness Recovery Action Planning (WRAP) and related tools help people identify:
- Wellness toolbox
- Daily maintenance plans
- Triggers and early warning signs
- Crisis planning
- Post-crisis planning

As a PWS, you support peers in building plans that are **theirs** — not compliance documents.`,
        30
      ),
      {
        slug: "wrap-exercise",
        title: "Exercise: Co-Create a Mini Wellness Plan",
        type: "DOCUMENTATION",
        estimatedMinutes: 35,
        contentMd:
          "Draft a sample daily maintenance plan and early warning sign list for a fictional peer who experiences anxiety and stimulant cravings.",
        interactivePayload: {
          prompt: "Create a mini wellness plan with toolbox + early warning signs + one action step.",
          rubric: [
            "Peer-centered language",
            "Practical toolbox items",
            "Clear early warning signs",
            "Actionable next step",
          ],
        },
      },
      {
        slug: "wrap-quiz",
        title: "Knowledge Check: WRAP",
        type: "QUIZ",
        estimatedMinutes: 10,
        contentMd: "WRAP check.",
        interactivePayload: quiz([
          {
            id: "w1",
            prompt: "A strong wellness plan is primarily:",
            options: [
              "Written by the clinician without peer input",
              "Owned and shaped by the person receiving support",
              "A legal contract",
              "Only for people with severe mental illness diagnoses",
            ],
            correctIndex: 1,
            explanation: "Ownership and self-definition are central.",
          },
        ]),
      },
    ],
  },
  {
    slug: "addiction-harm-reduction",
    title: "Module 13 — Addiction Recovery & Harm Reduction",
    description:
      "Support multiple pathways to recovery including harm reduction, abstinence, MAT, and mutual aid.",
    estimatedHours: 5,
    oarReferences: ["950-060-0140(2)(w)", "950-060-0140(4)(d)"],
    competencies: [
      "harm-reduction",
      "addiction-recovery",
      "mat-awareness",
      "mutual-aid",
    ],
    lessons: [
      reading(
        "Multiple Pathways & Harm Reduction",
        `# Multiple Pathways & Harm Reduction

Recovery is not one-size-fits-all. Pathways may include:
- Abstinence-based mutual aid (AA/NA and alternatives)
- SMART Recovery
- Medication for opioid use disorder (MOUD/MAT)
- Harm reduction (safer use, naloxone, syringe services)
- Faith-based and culturally specific supports

## Peer stance
Respect the peer's goals. Do not impose your pathway. Reduce shame. Celebrate any movement toward self-defined wellness.

## Relapse
Relapse can be part of many recovery journeys. Respond with curiosity and safety — not punishment.`,
        35
      ),
      {
        slug: "harm-reduction-scenario",
        title: "Scenario: Active Use and Housing",
        type: "SCENARIO",
        estimatedMinutes: 25,
        contentMd: "Hold harm reduction and housing goals together.",
        interactivePayload: {
          scenario:
            "A peer says they will keep using meth but want help staying housed and safer.",
          choices: [
            {
              text: "Refuse to help until they commit to abstinence.",
              feedback: "Withholds support; increases harm.",
              score: 0,
            },
            {
              text: "Explore their housing/safety goals, offer harm reduction resources, and connect to low-barrier supports without shaming.",
              feedback: "Aligns with harm reduction and peer ethics.",
              score: 100,
            },
            {
              text: "Threaten to call the police for possession.",
              feedback: "Destroys trust and may create danger.",
              score: 0,
            },
          ],
        },
      },
      {
        slug: "addiction-quiz",
        title: "Knowledge Check: Addiction & Harm Reduction",
        type: "QUIZ",
        estimatedMinutes: 15,
        contentMd: "SUD/harm reduction check.",
        interactivePayload: quiz([
          {
            id: "hr1",
            prompt: "Harm reduction primarily aims to:",
            options: [
              "Force abstinence immediately",
              "Reduce the negative consequences of behaviors without requiring abstinence as a precondition",
              "Ignore safety concerns",
              "Replace all treatment",
            ],
            correctIndex: 1,
            explanation:
              "Harm reduction meets people where they are to reduce harm.",
          },
        ]),
      },
    ],
  },
  {
    slug: "group-facilitation",
    title: "Module 14 — Group Facilitation",
    description:
      "Facilitate peer groups with safety, structure, and shared leadership.",
    estimatedHours: 4,
    oarReferences: ["950-060-0140(4)(b)"],
    competencies: ["group-facilitation", "peer-groups", "conflict-in-groups"],
    lessons: [
      reading(
        "Facilitating Peer Groups",
        `# Facilitating Peer Groups

Group skills for PWS:
- Opening/closing rituals
- Agreements for safety and confidentiality limits
- Balancing voices
- Redirecting advice-giving
- Handling conflict and crisis in group
- Co-facilitation

Groups are communities of practice — not therapy process groups unless within a clinical program design.`,
        25
      ),
      {
        slug: "group-scenario",
        title: "Scenario: Cross-Talk and Advice Giving",
        type: "SCENARIO",
        estimatedMinutes: 20,
        contentMd: "Facilitate without shaming.",
        interactivePayload: {
          scenario:
            "In group, one member repeatedly tells another 'Just stop hanging out with those people.'",
          choices: [
            {
              text: "Publicly shame the advice-giver.",
              feedback: "Creates unsafety.",
              score: 15,
            },
            {
              text: "Thank them for caring, remind the group of sharing guidelines, and invite the original speaker to share what support would feel helpful.",
              feedback: "Protects norms and peer voice.",
              score: 100,
            },
            {
              text: "Ignore it.",
              feedback: "Allows harmful norms to set in.",
              score: 25,
            },
          ],
        },
      },
      {
        slug: "group-quiz",
        title: "Knowledge Check: Groups",
        type: "QUIZ",
        estimatedMinutes: 10,
        contentMd: "Group facilitation check.",
        interactivePayload: quiz([
          {
            id: "g1",
            prompt: "A key facilitation goal is:",
            options: [
              "Make sure you talk more than anyone else",
              "Protect safety agreements and shared voice",
              "Force everyone to disclose trauma",
              "Diagnose each member",
            ],
            correctIndex: 1,
            explanation: "Safety and shared voice define peer group culture.",
          },
        ]),
      },
    ],
  },
  {
    slug: "resilience-efficacy",
    title: "Module 15 — Resilience & Self-Efficacy",
    description:
      "Cultivate individual resilience and self-efficacy using strengths-based peer practice.",
    estimatedHours: 3,
    oarReferences: ["950-060-0140(4)(a)", "950-060-0140(4)(c)"],
    competencies: ["resilience", "self-efficacy", "strengths-based"],
    lessons: [
      reading(
        "Building Self-Efficacy",
        `# Building Self-Efficacy

Self-efficacy is belief in one's ability to act. Peers grow it by:
- Noticing small wins
- Breaking goals into doable steps
- Modeling coping
- Avoiding rescue that steals agency

Resilience is not toughness theater — it is flexible recovery after stress.`,
        20
      ),
      {
        slug: "resilience-reflection",
        title: "Reflection: Strengths Inventory",
        type: "REFLECTION",
        estimatedMinutes: 20,
        contentMd:
          "List 10 strengths you bring as a peer worker and how each could support someone else's self-efficacy.",
      },
      {
        slug: "resilience-quiz",
        title: "Knowledge Check: Resilience",
        type: "QUIZ",
        estimatedMinutes: 10,
        contentMd: "Resilience check.",
        interactivePayload: quiz([
          {
            id: "r1",
            prompt: "Self-efficacy grows most when peers:",
            options: [
              "Do everything for the person",
              "Support doable actions and notice competence",
              "Set goals without the person",
              "Focus only on deficits",
            ],
            correctIndex: 1,
            explanation: "Mastery experiences build efficacy.",
          },
        ]),
      },
    ],
  },
  {
    slug: "advanced-mi-change",
    title: "Module 16 — Advanced MI & Stages of Change",
    description:
      "Deepen MI practice across ambivalence, discord, and maintenance.",
    estimatedHours: 4,
    oarReferences: ["950-060-0140(2)(z)", "950-060-0140(4)(e)"],
    competencies: ["advanced-mi", "discord", "maintenance-support"],
    lessons: [
      reading(
        "Working with Ambivalence and Discord",
        `# Ambivalence and Discord

Ambivalence is normal. Discord (formerly "resistance") often signals relationship rupture or mismatched pace.

## Skills
- Softening sustain talk without arguing
- Eliciting change talk (DARN-CAT)
- Repairing discord
- Supporting maintenance and recycle after return to use`,
        25
      ),
      {
        slug: "advanced-mi-roleplay",
        title: "Required: Advanced MI Roleplays",
        type: "ROLEPLAY",
        estimatedMinutes: 60,
        contentMd:
          "Complete AI sessions tagged MI/ambivalence and relapse support in the Practice Lab.",
      },
      {
        slug: "advanced-mi-quiz",
        title: "Knowledge Check: Advanced MI",
        type: "QUIZ",
        estimatedMinutes: 15,
        contentMd: "Advanced MI check.",
        interactivePayload: quiz([
          {
            id: "ami1",
            prompt: "Discord in MI often indicates:",
            options: [
              "The peer is a bad client",
              "A signal to adjust alliance, pace, or approach",
              "That confrontation is required",
              "That MI does not work",
            ],
            correctIndex: 1,
            explanation: "Discord is information about the relationship/process.",
          },
        ]),
      },
    ],
  },
  {
    slug: "health-promotion",
    title: "Module 17 — Health Promotion, Chronic Disease & Whole Health",
    description:
      "Support whole-person wellness including chronic disease literacy, tobacco, and when to seek medical help.",
    estimatedHours: 4,
    oarReferences: [
      "950-060-0140(2)(w)",
      "950-060-0140(2)(x)",
      "950-060-0140(2)(aa)",
      "950-060-0140(2)(bb)",
    ],
    competencies: [
      "health-promotion",
      "chronic-disease-literacy",
      "health-literacy",
      "whole-health",
    ],
    lessons: [
      reading(
        "Whole Health in Peer Wellness Work",
        `# Whole Health in Peer Wellness Work

PWS integrate behavioral health and primary care navigation:
- Warning signs that need medical attention
- Supporting tobacco cessation interest without coercion
- Health literacy (helping peers understand instructions)
- Oral health training awareness (OHA requirement for certification pathway)
- Life-span considerations

Peers do not practice medicine — they support engagement and understanding.`,
        30
      ),
      {
        slug: "health-quiz",
        title: "Knowledge Check: Health Promotion",
        type: "QUIZ",
        estimatedMinutes: 15,
        contentMd: "Health promotion check.",
        interactivePayload: quiz([
          {
            id: "hp1",
            prompt: "If a peer describes chest pain and shortness of breath, you should:",
            options: [
              "Diagnose a panic attack and coach breathing only",
              "Encourage appropriate urgent/emergency medical evaluation per protocol",
              "Ignore physical symptoms as outside peer scope",
              "Provide medication from your own supply",
            ],
            correctIndex: 1,
            explanation:
              "Peers help people seek appropriate care for possible medical emergencies.",
          },
        ]),
      },
      {
        slug: "health-reflection",
        title: "Reflection: Whole Health Goals",
        type: "REFLECTION",
        estimatedMinutes: 20,
        contentMd:
          "How will you talk about physical health with peers without moralizing bodies, food, or weight?",
      },
    ],
  },
  {
    slug: "teams-supervision",
    title: "Module 18 — Multidisciplinary Teams & Supervision",
    description:
      "Work effectively on care teams, understand supervision, and protect peer integrity in clinical settings.",
    estimatedHours: 3,
    oarReferences: ["950-060-0140(2)(t)", "950-060-0140(2)(s)"],
    competencies: [
      "teamwork",
      "supervision",
      "role-clarity",
      "peer-integrity",
    ],
    lessons: [
      reading(
        "Peers on Care Teams",
        `# Peers on Care Teams

PWS often work beside clinicians, case managers, and medical staff.

## Keys
- Clarify role in every setting
- Resist pressure to become a "junior clinician"
- Use supervision for ethics and secondary trauma
- Share peer perspective in team meetings with consent and professionalism`,
        25
      ),
      {
        slug: "teams-scenario",
        title: "Scenario: Team Asks You to Confront",
        type: "SCENARIO",
        estimatedMinutes: 20,
        contentMd: "Protect peer role.",
        interactivePayload: {
          scenario:
            "A clinician asks you to 'make' a peer accept residential treatment today.",
          choices: [
            {
              text: "Agree and pressure the peer.",
              feedback: "Violates peer ethics and MI spirit.",
              score: 0,
            },
            {
              text: "Explain your peer role, offer to explore the peer's perspective and ambivalence, and invite collaborative planning.",
              feedback: "Maintains integrity and teamwork.",
              score: 100,
            },
            {
              text: "Complain about the clinician to the peer.",
              feedback: "Splits team and harms trust.",
              score: 15,
            },
          ],
        },
      },
      {
        slug: "teams-quiz",
        title: "Knowledge Check: Teams",
        type: "QUIZ",
        estimatedMinutes: 10,
        contentMd: "Teams check.",
        interactivePayload: quiz([
          {
            id: "tm1",
            prompt: "On multidisciplinary teams, peers should:",
            options: [
              "Abandon peer values to fit in",
              "Maintain role clarity while collaborating",
              "Never speak in meetings",
              "Override clinical recommendations always",
            ],
            correctIndex: 1,
            explanation: "Collaboration with role clarity is the goal.",
          },
        ]),
      },
    ],
  },
  {
    slug: "sdoh-partnerships",
    title: "Module 19 — Social Determinants & Community Partnerships",
    description:
      "Address SDOH, build partnerships, and support structural navigation.",
    estimatedHours: 3,
    oarReferences: [
      "950-060-0140(2)(q)",
      "950-060-0140(2)(r)",
      "950-060-0140(2)(f)",
      "950-060-0140(2)(g)",
    ],
    competencies: [
      "sdoh",
      "partnerships",
      "strengths-needs-assessment",
      "conflict-problem-solving",
    ],
    lessons: [
      reading(
        "Social Determinants of Health",
        `# Social Determinants of Health

Housing, racism, poverty, transportation, education, and neighborhood conditions shape recovery outcomes as much as individual motivation.

Peers help with strengths-and-needs conversations, conflict problem-solving, and partnerships with local agencies — always with the peer in the lead.`,
        25
      ),
      {
        slug: "sdoh-documentation",
        title: "Exercise: Strengths & Needs Snapshot",
        type: "DOCUMENTATION",
        estimatedMinutes: 25,
        contentMd:
          "Create a strengths-and-needs snapshot for a peer facing eviction, diabetes management challenges, and isolation — center their priorities.",
        interactivePayload: {
          prompt: "Write a strengths/needs snapshot with peer priorities first.",
          rubric: [
            "Lists strengths not only deficits",
            "Centers peer priorities",
            "Identifies concrete resource domains",
          ],
        },
      },
      {
        slug: "sdoh-quiz",
        title: "Knowledge Check: SDOH",
        type: "QUIZ",
        estimatedMinutes: 10,
        contentMd: "SDOH check.",
        interactivePayload: quiz([
          {
            id: "sd1",
            prompt: "Social determinants of health include:",
            options: [
              "Only genetic risk",
              "Conditions like housing, income, and discrimination that shape health",
              "Willpower alone",
              "Peer specialist certification numbers",
            ],
            correctIndex: 1,
            explanation: "SDOH are structural and environmental conditions.",
          },
        ]),
      },
    ],
  },
  {
    slug: "housing-benefits-deep",
    title: "Module 20 — Housing, Benefits & Oregon Resource Deep Dive",
    description:
      "Practice advanced navigation for housing, benefits, and rural access barriers.",
    estimatedHours: 4,
    oarReferences: ["950-060-0140(2)(m)", "950-060-0140(2)(d)"],
    competencies: [
      "housing-navigation",
      "benefits-navigation",
      "rural-access",
    ],
    lessons: [
      reading(
        "Housing & Benefits Navigation",
        `# Housing & Benefits Navigation

Deepen skills for:
- Coordinated entry / 211
- Shelter and transitional programs
- Fair housing basics awareness
- OHP enrollment support
- SSI/SSDI paperwork accompaniment (not legal representation)
- Transportation and digital access barriers in rural Oregon

Document local resource maps during training.`,
        30
      ),
      {
        slug: "housing-roleplay",
        title: "Required: Housing Navigation Roleplay",
        type: "ROLEPLAY",
        estimatedMinutes: 45,
        contentMd:
          "Complete the 'Newly homeless family' and 'Benefits maze' AI personas in Practice Lab.",
      },
      {
        slug: "housing-quiz",
        title: "Knowledge Check: Housing & Benefits",
        type: "QUIZ",
        estimatedMinutes: 15,
        contentMd: "Housing/benefits check.",
        interactivePayload: quiz([
          {
            id: "hb1",
            prompt: "When helping with benefits paperwork, peers should:",
            options: [
              "Fill forms secretly without the peer",
              "Support understanding and accompaniment within role; avoid unauthorized legal advice",
              "Guarantee approval",
              "Use someone else's identity documents",
            ],
            correctIndex: 1,
            explanation: "Support literacy and accompaniment; stay in scope.",
          },
        ]),
      },
    ],
  },
  {
    slug: "pws-capstone",
    title: "Module 21 — Capstone Practicum & Final Evaluation",
    description:
      "Integrate 80-hour competencies through practicum evidence and live instructor evaluation.",
    estimatedHours: 6,
    oarReferences: ["950-060-0100", "950-060-0140(1)", "950-060-0140(4)"],
    competencies: [
      "capstone",
      "live-evaluation",
      "practice-readiness",
    ],
    lessons: [
      reading(
        "Capstone Requirements",
        `# Capstone Requirements (PWS)

To complete the 80-hour PWS pathway:
1. All modules + quizzes passed
2. Expanded AI practice portfolio (listening, crisis routing, MI, harm reduction, housing, groups)
3. Documentation portfolio reviewed
4. Hybrid students: required live workshops & observed roleplays
5. Final instructor competency evaluation covering OHA domains
6. Certificate of completion issued (for OHA THW application — not itself certification)

Oral health training remains a separate OHA certification requirement for applicants.`,
        25
      ),
      {
        slug: "pws-capstone-roleplay",
        title: "Capstone AI Portfolio Gate",
        type: "ROLEPLAY",
        estimatedMinutes: 120,
        contentMd:
          "Ensure your Practice Lab history shows successful sessions across all required tags before requesting live evaluation.",
      },
      {
        slug: "pws-final-live",
        title: "Final Live Competency Evaluation",
        type: "LIVE_SESSION",
        estimatedMinutes: 90,
        contentMd:
          "Instructor-observed roleplay + oral competency review + AI portfolio discussion.",
      },
    ],
  },
];

export const PSS_COURSE: CourseSeed = {
  slug: "oregon-pss-40",
  type: "PSS",
  title: "Peer Support Specialist (PSS) — 40-Hour Academy",
  subtitle: "OHA Traditional Health Worker aligned foundational training",
  description:
    "A modern, competency-based 40-hour Peer Support Specialist training designed for Oregon OHA approval. Combines self-paced interactive learning, AI practice simulations, and human instructor evaluation. Available as fully at-your-own-pace (AYOP) with required live competency gates, or hybrid with scheduled virtual workshops.",
  contactHours: 40,
  priceCents: 89500,
  competencies: [
    "recovery-principles",
    "communication",
    "ethics-boundaries",
    "trauma-informed-care",
    "crisis-safety",
    "cultural-humility",
    "motivational-interviewing",
    "documentation",
    "systems-navigation",
    "self-care",
  ],
  learningOutcomes: [
    "Demonstrate peer role clarity and recovery-oriented practice within Oregon THW scope",
    "Use active listening, empowerment, and MI-aligned communication",
    "Apply ethics, boundaries, confidentiality, and trauma-informed principles",
    "Recognize crisis indicators and follow safety/escalation protocols",
    "Navigate basic community resources and document support respectfully",
    "Complete AI practice portfolio and pass human competency evaluation",
  ],
  modules: CORE_PSS_MODULES,
};

export const PWS_COURSE: CourseSeed = {
  slug: "oregon-pws-80",
  type: "PWS",
  title: "Peer Wellness Specialist (PWS) — 80-Hour Academy",
  subtitle: "Expanded OHA-aligned wellness, addiction, and systems training",
  description:
    "An 80-hour Peer Wellness Specialist program building on PSS core competencies with expanded wellness planning, harm reduction, group facilitation, whole health, SDOH, and advanced practice simulations — designed for Oregon OHA Traditional Health Worker approval pathways.",
  contactHours: 80,
  priceCents: 149500,
  competencies: [
    "all-pss-competencies",
    "wrap-wellness",
    "harm-reduction",
    "group-facilitation",
    "resilience",
    "advanced-mi",
    "health-promotion",
    "teamwork-supervision",
    "sdoh",
    "housing-benefits",
  ],
  learningOutcomes: [
    "Meet expanded PWS competencies including wellness models, MI, and group facilitation",
    "Support multiple recovery pathways including harm reduction",
    "Integrate whole-health navigation and SDOH-aware practice",
    "Demonstrate advanced peer skills via AI portfolio and live evaluation",
    "Prepare a completion file suitable for OHA THW application support",
  ],
  modules: [...CORE_PSS_MODULES, ...PWS_EXTRA_MODULES],
};

export const AI_PERSONAS = [
  {
    slug: "veteran-ptsd",
    name: "Marcus",
    ageRange: "40s",
    presentation: "Quiet veteran with PTSD, distrustful of systems",
    background: "Army veteran, housing unstable, avoids VA some days",
    challenges: "Nightmares, anger, isolation, hypervigilance",
    goals: "Wants sleep and someone who won't 'treat me like a chart'",
    riskLevel: "moderate",
    tags: "trauma,veterans,listening,boundaries",
    systemPrompt: `You are Marcus, a peer in a training simulation. You are an Army veteran in your 40s with PTSD. You are wary of clinical language. You open up slowly if the specialist listens, reflects, and doesn't push. If they give advice too fast or use jargon, you shut down or get irritable. Never break character. You are not suicidal today but hate when people minimize combat trauma.`,
    evaluationRubric: JSON.stringify([
      "active listening",
      "trauma-informed pacing",
      "avoided clinical jargon",
      "honored autonomy",
    ]),
  },
  {
    slug: "meth-active-use",
    name: "Riley",
    ageRange: "20s",
    presentation: "Person in active methamphetamine use seeking practical help",
    background: "Cycles through friends' couches, missed last intake appointment",
    challenges: "Paranoia, hunger, stigma, chaotic schedule",
    goals: "Wants food, phone charger, and maybe a low-barrier program later",
    riskLevel: "moderate",
    tags: "harm-reduction,addiction,mi,resources",
    systemPrompt: `You are Riley in a peer support training simulation. You are actively using meth. You are not ready for abstinence. You respond well to nonjudgmental, practical help and MI. You get defensive if shamed. You may minimize use. Stay in character.`,
    evaluationRubric: JSON.stringify([
      "nonjudgmental stance",
      "harm reduction",
      "MI spirit",
      "practical resource focus",
    ]),
  },
  {
    slug: "homeless-family",
    name: "Aisha",
    ageRange: "30s",
    presentation: "Parent newly homeless with a child, overwhelmed",
    background: "Evicted after job loss; scared about DHS and school",
    challenges: "Panic, stigma, systems overwhelm",
    goals: "Safe place tonight and keep child in school",
    riskLevel: "moderate",
    tags: "housing,advocacy,systems,family",
    systemPrompt: `You are Aisha in a training simulation. You and your child lost housing this week. You are overwhelmed and scared someone will take your child. You need help prioritizing. Respond positively to calm collaborative planning. Become tearful if pressured. Stay in character.`,
    evaluationRubric: JSON.stringify([
      "collaborative prioritization",
      "no overpromising",
      "family-sensitive support",
      "systems navigation",
    ]),
  },
  {
    slug: "psychosis-distress",
    name: "Devon",
    ageRange: "20s",
    presentation: "Experiencing distressing psychosis-related beliefs",
    background: "Stopped meds after side effects; scared of hospital",
    challenges: "Fear, mistrust, sleep deprivation",
    goals: "Feel safer without being forced",
    riskLevel: "elevated",
    tags: "psychosis,crisis,trauma,listening",
    systemPrompt: `You are Devon in a training simulation. You are frightened by voices and believe people at the clinic are watching you. You do not want hospitalization. Respond to calm, validating, non-arguing approaches. If the specialist argues with delusions or threatens force casually, escalate fear. You are not imminently violent. Stay in character.`,
    evaluationRubric: JSON.stringify([
      "validation without collusion in harm",
      "non-arguing stance",
      "safety awareness",
      "trauma-informed tone",
    ]),
  },
  {
    slug: "grief-child-loss",
    name: "Helen",
    ageRange: "50s",
    presentation: "Grieving the death of an adult child",
    background: "Uses alcohol more since the funeral; friends disappeared",
    challenges: "Grief waves, guilt, loneliness",
    goals: "Someone to sit with grief without fixing",
    riskLevel: "moderate",
    tags: "grief,listening,self-care,substance",
    systemPrompt: `You are Helen in a training simulation. Your adult child died six months ago. You want presence more than advice. If the specialist silver-linings you, you get cold. If they listen and reflect, you share more. Occasional passive death wishes without plan unless asked carefully. Stay in character.`,
    evaluationRubric: JSON.stringify([
      "presence over fixing",
      "grief literacy",
      "sensitive suicide inquiry if indicated",
      "nonjudgmental",
    ]),
  },
  {
    slug: "suicide-ideation",
    name: "Sam",
    ageRange: "30s",
    presentation: "Peer with active suicidal ideation needing careful support",
    background: "Breakup + job loss this month; history of attempts years ago",
    challenges: "Hopelessness, shame asking for help",
    goals: "Wants pain to stop; ambivalent about living",
    riskLevel: "high",
    tags: "crisis,suicide,safety-planning,ethics",
    systemPrompt: `You are Sam in a TRAINING simulation for peer specialists. You have suicidal ideation. If asked directly, you admit thinking of overdosing on leftover pills tonight, with pills accessible. You want help but fear hospitalization. Reward direct compassionate inquiry and collaborative safety steps. Punish avoidance or secrecy promises about imminent harm. This is fictional training — stay in character as Sam.`,
    evaluationRubric: JSON.stringify([
      "asked directly about suicide",
      "did not promise secrecy on imminent harm",
      "collaborative safety steps",
      "appropriate escalation awareness",
    ]),
  },
  {
    slug: "angry-system",
    name: "Chris",
    ageRange: "40s",
    presentation: "Angry at 'the system' after denied benefits",
    background: "Multiple denials; feels humiliated by caseworkers",
    challenges: "Rage, swearing, pacing, distrust",
    goals: "Wants advocacy and to be believed",
    riskLevel: "moderate",
    tags: "de-escalation,boundaries,advocacy,listening",
    systemPrompt: `You are Chris in a training simulation. You are furious about benefits denials. You raise your voice and swear. You calm if the specialist validates and sets calm boundaries. You escalate if they lecture or threaten to kick you out immediately without de-escalation. Stay in character.`,
    evaluationRubric: JSON.stringify([
      "de-escalation",
      "validation",
      "boundaries",
      "advocacy without overidentifying",
    ]),
  },
  {
    slug: "refusing-services",
    name: "Jordan",
    ageRange: "20s",
    presentation: "Peer refusing all services after bad experiences",
    background: "Felt coerced in prior treatment",
    challenges: "Shutdown, sarcasm, missed appointments",
    goals: "Unclear — testing whether you will push",
    riskLevel: "low",
    tags: "mi,autonomy,engagement,trauma",
    systemPrompt: `You are Jordan in a training simulation. You refuse services. You test the specialist for control moves. MI-consistent autonomy support works; pressure fails. Stay in character.`,
    evaluationRubric: JSON.stringify([
      "honored autonomy",
      "avoided righting reflex",
      "kept door open",
      "trauma-aware",
    ]),
  },
  {
    slug: "relapse-two-years",
    name: "Pat",
    ageRange: "30s",
    presentation: "Relapsed after two years sober; flooded with shame",
    background: "Had strong recovery capital that feels destroyed",
    challenges: "Shame, secrecy, catastrophizing",
    goals: "Wants to stabilize without losing peer job hopes",
    riskLevel: "moderate",
    tags: "relapse,mi,shame,recovery-capital",
    systemPrompt: `You are Pat in a training simulation. You relapsed after two years. Shame is huge. Respond to nonjudgmental curiosity and recovery capital rebuilding. Harsh confrontation increases secrecy. Stay in character.`,
    evaluationRubric: JSON.stringify([
      "shame-sensitive",
      "relapse as learning",
      "rebuild capital",
      "MI consistent",
    ]),
  },
  {
    slug: "boundary-tester",
    name: "Alex",
    ageRange: "30s",
    presentation: "Friendly peer asking for personal cell and weekend hangouts",
    background: "Lonely; previous worker became a friend and it got messy",
    challenges: "Loneliness, blurred roles",
    goals: "Connection",
    riskLevel: "low",
    tags: "boundaries,ethics,dual-relationships",
    systemPrompt: `You are Alex in a training simulation. You ask for the specialist's personal number and want to hang out this weekend. Be warm and persistent. Respond well to kind clear boundaries; sulk if rejected coldly. Stay in character.`,
    evaluationRubric: JSON.stringify([
      "clear boundaries",
      "kindness",
      "role explanation",
      "offered appropriate alternatives",
    ]),
  },
];
