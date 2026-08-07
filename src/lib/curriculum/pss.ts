import {
  callout,
  deepDiveSection,
  documentation,
  flattenModuleLessons,
  moduleQuiz,
  moduleWithFlatLessons,
  reading,
  reflection,
  scenario,
  slugify,
  storyReading,
  videoLesson,
  withModuleQuiz,
} from "./helpers";
import {
  HHS_HIPAA,
  LIFELINE_988,
  LINES_FOR_LIFE,
  MOTIVATIONAL_INTERVIEWING_NETWORK,
  OHA_PEER_DELIVERED_SERVICES,
  OHA_THW_REQUIREMENTS,
  OHA_THW_RULES,
  OREGON_211,
  OREGON_HEALTH_PLAN,
  SAMHSA_PEER_SUPPORT,
  SAMHSA_RECOVERY,
  SAMHSA_TRAUMA,
} from "./references";
import type {
  ChapterSeed,
  CourseSeed,
  LearningMode,
  LessonSeed,
  ModuleSeed,
  QuizQuestion,
  ReferenceLink,
} from "./types";

type PracticeChoice = {
  text: string;
  feedback: string;
  score: number;
};

type PssModuleSpec = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  estimatedHours: number;
  oarReferences: string[];
  competencies: string[];
  hook: string;
  coreTruth: string;
  preservedContent: string;
  oregonContext: string;
  keySkills: string[];
  watchPrompt: string;
  scenarioTitle: string;
  scenarioPrompt: string;
  choices: PracticeChoice[];
  appliedTitle: string;
  appliedPrompt: string;
  appliedKind: "documentation" | "reflection" | "roleplay" | "live";
  references: ReferenceLink[];
  modes: LearningMode[];
  quizFocus: string;
};

const commonPeerRefs = [
  OHA_THW_RULES,
  OHA_THW_REQUIREMENTS,
  OHA_PEER_DELIVERED_SERVICES,
  SAMHSA_PEER_SUPPORT,
];

function bullets(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

function foundationBody(spec: PssModuleSpec) {
  return `# ${spec.shortTitle}: the peer stance

${spec.coreTruth}

Here is the real talk for Oregon peer work: people do not need us to perform expertise at them. They need a steady relationship, transparent choices, and support that respects their definition of recovery. A Peer Support Specialist works from lived experience and a clear non-clinical scope. That means we can share story, model hope, help navigate systems, practice skills, and advocate with a person. It also means we do not diagnose, prescribe, coerce treatment, or turn our own recovery pathway into a rule for somebody else.

${callout(
  "story",
  `${spec.hook} Hold that feeling while you read. The goal is not to become a perfect helper. The goal is to become a trustworthy peer who can stay curious under pressure.`
)}

## Preserved course foundation

${spec.preservedContent}

## A scene you might recognize

Imagine sitting with someone who has already been through intake forms, waitlists, and well-meaning advice that missed the mark. They glance at your badge and wonder whether you are another professional who will talk *at* them. When you share that you know the system from the inside of recovery — carefully, with consent, and without turning your path into their prescription — the room often changes. That is the heart of this module: presence before performance.

In ${spec.quizFocus}, the temptation is to rush toward the "right" answer. Resist that. Ask what the person wants from the conversation. Name what you can and cannot do. Offer options. Leave space for silence. Silence is not failure; sometimes it is the first honest moment of the day.

## Oregon practice lens

${spec.oregonContext}

Use the OHA Traditional Health Worker rules as your anchor and your employer's policy as your local operating manual. When there is tension between heart and role, slow down. Ask: "What is the peer asking for? What is within my scope? What protects dignity, choice, and safety?" That pause is not bureaucracy for its own sake; it is how we keep peer support from becoming another system that takes over.

## Learning for every style

- **Reading / reflective:** underline one sentence that challenges your habits and journal why.
- **Visual / auditory:** sketch a three-box flowchart — peer ask → peer response → next shared step.
- **Kinesthetic:** rehearse two sentences out loud: one that invites choice, one that names a boundary.
- **Story:** notice where lived experience helps and where it risks centering you instead of the peer.

## Common traps in this topic

- Fixing too fast because discomfort is hard to sit with
- Using jargon that makes Oregon systems feel even more closed
- Treating cultural difference as a problem instead of a source of wisdom
- Confusing "being available" with having no boundaries
- Forgetting that AI practice is rehearsal — human instructors authorize completion

## What students should be able to do

${bullets(spec.keySkills)}

${callout(
  "practice",
  "Before you leave this chapter, write one credibility sentence from lived experience and one restraint sentence about your role. Keep both visible during the scenario."
)}

Close this reading by naming one place where your lived experience gives you credibility and one place where your role requires restraint. Both are part of ethical peer practice.${deepDiveSection(
    "shared anchors",
    spec.references
  )}`;
}

function practiceBody(spec: PssModuleSpec) {
  return `# Practice moves: ${spec.shortTitle}

Skill grows when we translate values into observable moves. In this module, your job is to turn warmth into words, choice into structure, and accountability into practice. A peer can usually feel the difference between "I am managing you" and "I am with you while you decide what comes next." The first narrows the room. The second creates enough safety for honesty.

Start with consent. Ask before giving information, before sharing personal experience, before calling a provider, and before writing anything that is not routine. Then use plain language. Oregon systems can be full of acronyms: OHP, CCO, THW, CMHP, ROI, HIPAA. Translate without talking down. If the person looks confused, treat that as feedback about the system, not a failure in the person.

## Micro-skills for this module

${bullets(spec.keySkills)}

## A short rehearsal script

Try this cadence in your own words:

1. **Open:** "Thanks for trusting me with this. What feels most important right now?"
2. **Clarify role:** "I can walk beside you and help navigate. I cannot make clinical decisions or promise outcomes I do not control."
3. **Offer choice:** "We could look at options together, practice one skill, or just talk through what happened. What would help?"
4. **Close with agency:** "What do you want to try before we meet again, and how can I support that without taking over?"

Adapt the words to culture, language access, disability access, and the person's energy. Scripts are training wheels, not handcuffs.

## When the conversation gets messy

Do not rush to the most dramatic intervention. Notice what is urgent, what is important, and what belongs to someone else's professional scope. If safety is at risk, follow protocol. If dignity is at risk, repair. If the peer is asking you to rescue, return to partnership: "I can do this with you. I cannot do it for you in a way that takes your voice out of the process."

${callout(
  "warn",
  "If you notice yourself performing competence instead of practicing curiosity, pause. Name the pressure to yourself, then return to the peer's goals."
)}

${callout(
  "practice",
  "In the next activity, answer as if the peer is sitting in front of you. Choose language you could actually say out loud."
)}`;
}

function watchContent(spec: PssModuleSpec) {
  return `# Watch-along: ${spec.shortTitle}

${spec.watchPrompt}

If your cohort has an instructor-selected video, watch it here. If no video is assigned, use this as a guided observation lab: listen to a public recovery, communication, trauma-informed care, or systems-navigation training clip chosen by your instructor and write down three moments where the speaker either increased or decreased choice.

While watching, track:

- What language sounds respectful and plain?
- Where does the helper resist the urge to fix?
- What would be different if this happened in a rural Oregon community with fewer immediate resources?
- What would need supervisor consultation or documentation?

Bring one quote or observation into the discussion board or live session.`;
}

function buildQuiz(spec: PssModuleSpec): QuizQuestion[] {
  const skillA = spec.keySkills[0] ?? "Stay within peer scope";
  const skillB = spec.keySkills[1] ?? "Center peer choice";
  return [
    {
      id: `${spec.slug}-q1`,
      prompt: `What is the safest peer stance in ${spec.quizFocus}?`,
      options: [
        "Take control quickly so the peer does not have to decide",
        "Use lived experience, choice, and role clarity while staying within scope",
        "Avoid the topic because it is always clinical",
        "Give the same advice that worked in your own recovery",
      ],
      correctIndex: 1,
      explanation:
        "Peer work combines lived experience with consent, scope, and self-determination.",
    },
    {
      id: `${spec.slug}-q2`,
      prompt: `In ${spec.shortTitle.toLowerCase()}, which action best matches: "${skillA}"?`,
      options: [
        "Do the task for the peer without asking so it gets done faster",
        "Invite collaboration, name your role, and practice the skill with the peer's consent",
        "Wait until a clinician takes over every decision",
        "Share every detail of your own story before hearing theirs",
      ],
      correctIndex: 1,
      explanation: `Module skill focus: ${skillA}. Peer support is collaborative, consent-based, and scope-aware.`,
    },
    {
      id: `${spec.slug}-q3`,
      prompt: "When you are unsure about a boundary, safety, or legal issue, your next step should be to:",
      options: [
        "Handle it privately so the peer knows you are loyal",
        "Post the details online without names",
        "Consult supervisor/policy and document according to organizational requirements",
        "Ignore the concern unless someone complains",
      ],
      correctIndex: 2,
      explanation:
        "Consultation and policy protect the peer, the worker, and the integrity of peer-delivered services.",
    },
    {
      id: `${spec.slug}-q4`,
      prompt: `Which response best applies "${skillB}" in ${spec.quizFocus}?`,
      options: [
        "Push one preferred pathway because it worked for someone else",
        "Slow down, check what matters to the peer, and co-create the next step",
        "Escalate immediately for any discomfort",
        "Avoid documenting anything related to the interaction",
      ],
      correctIndex: 1,
      explanation: `Module skill focus: ${skillB}. Recovery-oriented practice follows the peer's meaningful next step.`,
    },
    {
      id: `${spec.slug}-q5`,
      prompt: "Which response best reflects a recovery-oriented approach?",
      options: [
        "You need to follow the program exactly or you are not serious",
        "What would feel like a meaningful next step to you, and what support would help?",
        "I know what you should do because my recovery worked",
        "Let me decide and I will tell you later",
      ],
      correctIndex: 1,
      explanation:
        "Recovery-oriented support centers the person's goals, voice, and practical next steps.",
    },
    {
      id: `${spec.slug}-q6`,
      prompt: "Why are Oregon OAR/OHA references included in this module?",
      options: [
        "They replace employer policy in every situation",
        "They anchor training expectations and THW scope while local policy guides day-to-day operations",
        "They allow peers to provide clinical treatment",
        "They are optional trivia and do not matter after training",
      ],
      correctIndex: 1,
      explanation:
        "OHA/OAR standards define training and certification context; workers still follow role, site, and supervisor guidance.",
    },
    {
      id: `${spec.slug}-q7`,
      prompt: "A strong documentation or reflection after peer contact should:",
      options: [
        "Use respectful facts, peer voice, goals, and relevant next steps",
        "Include gossip because it might be useful later",
        "Label the peer's character to save time",
        "Avoid mentioning what support was provided",
      ],
      correctIndex: 0,
      explanation:
        "Peer documentation should be factual, respectful, necessary, and connected to the peer's goals.",
    },
    {
      id: `${spec.slug}-q8`,
      prompt: `How should Cascade Peer Academy students treat AI practice for ${spec.shortTitle.toLowerCase()}?`,
      options: [
        "As the final authority that replaces instructor evaluation",
        "As a rehearsal space for feedback before human competency review",
        "As optional entertainment with no learning value",
        "As a substitute for crisis protocols and supervision",
      ],
      correctIndex: 1,
      explanation:
        "AI supports skill rehearsal; human instructors authorize completion and competency decisions.",
    },
  ];
}

function appliedLesson(spec: PssModuleSpec): LessonSeed {
  const payload = {
    prompt: spec.appliedPrompt,
    rubric: [
      "Centers peer voice and self-defined goals",
      "Uses respectful, non-stigmatizing language",
      "Identifies role limits and consultation needs",
      "Names one practical next step",
    ],
  };

  if (spec.appliedKind === "documentation") {
    return documentation(
      spec.appliedTitle,
      spec.appliedPrompt,
      payload,
      30,
      { references: spec.references, learningModes: ["reading", "kinesthetic"] }
    );
  }

  if (spec.appliedKind === "roleplay") {
    return {
      slug: slugify(spec.appliedTitle),
      title: spec.appliedTitle,
      type: "ROLEPLAY",
      estimatedMinutes: 45,
      contentMd: `${spec.appliedPrompt}\n\nComplete the assigned AI Practice Lab simulation, then save one sentence you would reuse and one sentence you would revise.`,
      interactivePayload: payload,
      references: spec.references,
      learningModes: ["auditory", "kinesthetic", "reflective"],
    };
  }

  if (spec.appliedKind === "live") {
    return {
      slug: slugify(spec.appliedTitle),
      title: spec.appliedTitle,
      type: "LIVE_SESSION",
      estimatedMinutes: 60,
      contentMd: `${spec.appliedPrompt}\n\nBring your questions, a roleplay challenge, and a note about how you used feedback from this module.`,
      interactivePayload: payload,
      references: spec.references,
      learningModes: ["auditory", "kinesthetic", "reflective"],
    };
  }

  return reflection(spec.appliedTitle, spec.appliedPrompt, 25, {
    references: spec.references,
    learningModes: ["reflective", "reading"],
    interactivePayload: payload,
  });
}

function buildModule(spec: PssModuleSpec): ModuleSeed {
  const baseChapters: ChapterSeed[] = [
    {
      slug: `${spec.slug}-foundations`,
      title: "Chapter 1 - Foundations and Oregon scope",
      description:
        "Start with story, role clarity, OHA/OAR anchors, and the practical meaning of peer support.",
      lessons: [
        storyReading({
          title: `${spec.shortTitle}: real talk and role clarity`,
          hook: spec.hook,
          body: foundationBody(spec),
          minutes: 35,
          references: spec.references,
          learningModes: spec.modes,
        }),
        videoLesson(
          `Watch-along: ${spec.shortTitle}`,
          watchContent(spec),
          20,
          {
            references: spec.references,
            learningModes: ["visual", "auditory", "reflective"],
          }
        ),
      ],
    },
    {
      slug: `${spec.slug}-practice`,
      title: "Chapter 2 - Practice moves",
      description:
        "Turn values into observable communication, advocacy, and support behaviors.",
      lessons: [
        reading(
          `Practice moves for ${spec.shortTitle}`,
          practiceBody(spec),
          30,
          {
            references: spec.references,
            learningModes: ["reading", "kinesthetic", "reflective"],
          }
        ),
        scenario(
          spec.scenarioTitle,
          `# ${spec.scenarioTitle}\n\n${spec.scenarioPrompt}\n\nChoose the response that best protects dignity, choice, and safety. Then read the feedback before continuing.`,
          {
            scenario: spec.scenarioPrompt,
            choices: spec.choices,
          },
          25,
          { references: spec.references }
        ),
      ],
    },
    {
      slug: `${spec.slug}-integration`,
      title: "Chapter 3 - Integration and competency check",
      description:
        "Apply the module to documentation, reflection, roleplay, or live discussion before the final mini-quiz.",
      lessons: [
        appliedLesson(spec),
        reading(
          `Integration checklist: ${spec.shortTitle}`,
          `# Integration checklist

Before the quiz, make the learning concrete. Name the peer support value you used most in this module. Then name the operational safeguard: consent, confidentiality, crisis protocol, documentation, supervision, or a warm handoff. Strong peer work needs both. Values without structure can drift into over-involvement; structure without values can feel cold and system-centered.

Use this final checklist:

- I can describe the PSS role in this topic without sounding clinical or dismissive.
- I can identify when to slow down, ask permission, and return choice to the peer.
- I can name at least one Oregon resource, rule, or system partner connected to the topic.
- I can write a respectful note or reflection that would make sense to the peer if they read it.
- I know when to use supervision or emergency protocols.

${callout(
  "tip",
  "If you missed more than one scenario feedback point, revisit Chapter 2 before attempting the quiz."
)}`,
          15,
          {
            references: spec.references,
            learningModes: ["reading", "reflective"],
          }
        ),
      ],
    },
  ];

  const chapters = withModuleQuiz(
    baseChapters,
    moduleQuiz(
      `${spec.slug}-module-quiz`,
      `Mini-Quiz: ${spec.shortTitle}`,
      buildQuiz(spec),
      20
    )
  );

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

const PSS_SPECS: PssModuleSpec[] = [
  {
    slug: "recovery-foundations",
    title: "Module 1 - Recovery Foundations & the Peer Role",
    shortTitle: "Recovery foundations",
    description:
      "Ground yourself in recovery principles, recovery capital, and the unique value of lived experience in Oregon's peer-delivered services system.",
    estimatedHours: 4,
    oarReferences: ["950-060-0140(2)(s)", "950-060-0140(5)(b)", "950-060-0140(5)(c)"],
    competencies: ["recovery-principles", "peer-role-scope", "recovery-capital", "lived-experience"],
    hook:
      "Here's the real talk: your story is powerful, but the peer's story is the center of the work.",
    coreTruth:
      "Peer support is rooted in mutuality, hope, and lived experience. Recovery is self-defined: housing, relationships, purpose, wellness, substance-use goals, belonging, and meaning can all count.",
    preservedContent:
      "PSS and PWS workers are Traditional Health Workers in Oregon. They walk beside people; they do not diagnose, prescribe, provide therapy as licensed clinicians, or make medical decisions for someone else. They may share recovery stories strategically, model wellness and coping, help peers navigate services and systems, advocate, accompany, and connect to resources. A certificate of completion supports an OHA THW application; it is not automatic state certification.",
    oregonContext:
      "Oregon's peer-delivered services grew from community wisdom and formal THW policy. Students should understand that OHA approval, registry enrollment, and employer credentialing are related but distinct steps.",
    keySkills: [
      "Explain peer scope in plain language",
      "Use lived experience strategically without taking over",
      "Identify recovery capital across human, social, physical, and cultural domains",
      "Hold hope without minimizing pain",
    ],
    watchPrompt:
      "Watch for how recovery language changes when the helper shifts from fixing deficits to noticing resources and next steps.",
    scenarioTitle: "Scenario: The story that starts to take over",
    scenarioPrompt:
      "A peer says, 'You got sober, so tell me exactly what to do.' You feel pulled to give your whole recovery story and a step-by-step plan.",
    choices: [
      { text: "Give your complete story and tell them to follow it closely.", feedback: "This centers you and turns lived experience into prescription.", score: 35 },
      { text: "Ask what they hope will be different, share one brief relevant piece with permission, and return the focus to their choices.", feedback: "Strategic sharing plus autonomy keeps the peer's recovery in the lead.", score: 100 },
      { text: "Refuse to talk about recovery because sharing is never appropriate.", feedback: "Peer work can include story when it is purposeful, brief, and consent-based.", score: 55 },
    ],
    appliedTitle: "Reflection: your story as a tool",
    appliedPrompt:
      "Write 250-400 words on how you might share a piece of your lived experience strategically with a peer: what you would share, what you would hold private, and how you would keep the focus on their goals.",
    appliedKind: "reflection",
    references: [SAMHSA_RECOVERY, ...commonPeerRefs],
    modes: ["story", "reading", "reflective"],
    quizFocus: "recovery foundations and peer role clarity",
  },
  {
    slug: "communication",
    title: "Module 2 - Communication & Active Listening",
    shortTitle: "Communication",
    description:
      "Practice cross-cultural communication, reflective listening, open questions, and presence.",
    estimatedHours: 4,
    oarReferences: ["950-060-0140(2)(b)", "950-060-0140(2)(c)"],
    competencies: ["active-listening", "open-questions", "reflective-statements", "empowerment"],
    hook:
      "Here's the real talk: silence can be skill, but only when it is paired with attention and respect.",
    coreTruth:
      "Active listening in peer work is attention, reflection, curiosity, and cultural humility without hijacking the conversation. Presence is not passive; it is a disciplined way of making room.",
    preservedContent:
      "Core skills include minimal encouragers, body language that fits the cultural context, reflective statements, summaries, open-ended questions that invite story, and the ability to sit with silence. The empowerment stance asks, 'What matters most to you right now?' instead of defaulting to 'Have you tried...?'",
    oregonContext:
      "Communication across Oregon may happen in clinic rooms, recovery centers, tents, jail transition programs, tribal communities, shelters, and telehealth. Tone, pacing, and assumptions must adapt to the person and setting.",
    keySkills: [
      "Use open questions that invite story rather than interrogation",
      "Offer reflections that check meaning and feeling",
      "Summarize without adding your own agenda",
      "Notice power, culture, and accessibility in communication",
    ],
    watchPrompt:
      "Observe how the helper uses OARS skills and how quickly advice-giving changes the emotional temperature.",
    scenarioTitle: "Scenario: The peer who shuts down",
    scenarioPrompt:
      "Jordan says, 'Everyone keeps telling me what to do. I'm done talking.' Their arms are crossed and they look toward the door.",
    choices: [
      { text: "You're being resistant. Let's make a plan anyway.", feedback: "Labels and pressure escalate shutdown.", score: 0 },
      { text: "It makes sense you'd feel overloaded. We can slow down. What would feel useful, if anything, today?", feedback: "This validates experience, restores choice, and keeps the door open.", score: 100 },
      { text: "Fine, call me when you're ready to engage.", feedback: "This abandons the relationship without repair.", score: 30 },
    ],
    appliedTitle: "Practice log: three OARS responses",
    appliedPrompt:
      "Write one open question, one affirmation, one reflection, and one summary for this statement: 'I keep missing appointments because every office feels like another place to fail.'",
    appliedKind: "documentation",
    references: [SAMHSA_PEER_SUPPORT, MOTIVATIONAL_INTERVIEWING_NETWORK, ...commonPeerRefs],
    modes: ["auditory", "reading", "kinesthetic", "reflective"],
    quizFocus: "active listening and empowerment communication",
  },
  {
    slug: "boundaries-ethics",
    title: "Module 3 - Boundaries, Ethics & Professional Conduct",
    shortTitle: "Boundaries and ethics",
    description:
      "Navigate dual relationships, confidentiality, gifts, social media, and ethical gray zones.",
    estimatedHours: 4,
    oarReferences: ["950-060-0140(2)(i)", "950-060-0140(2)(j)", "950-060-0140(2)(l)"],
    competencies: ["ethics", "boundaries", "confidentiality", "professional-conduct", "hipaa"],
    hook:
      "Here's the real talk: being warm does not mean being available in every way.",
    coreTruth:
      "Peer ethics center dignity, consent, confidentiality, and non-exploitation. Boundaries protect the relationship from role confusion, favoritism, rescue, and harm.",
    preservedContent:
      "Common boundary challenges include running into peers in the community, social media friend requests, transportation and money, romantic or sexual attraction, personal contact information, and small rural communities where dual relationships can be hard to avoid. When dual relationships are unavoidable: disclose, document, consult, and minimize harm.",
    oregonContext:
      "Oregon's small towns, recovery communities, tribal communities, and close service networks make boundary work concrete. A peer may also be a neighbor, cousin, group member, or former treatment peer.",
    keySkills: [
      "Explain role boundaries kindly and clearly",
      "Protect confidentiality and minimum necessary information",
      "Use supervision before ethical gray zones become ethical injuries",
      "Document boundary issues without shaming the peer",
    ],
    watchPrompt:
      "Watch for moments where friendliness could blur into role confusion, and note how the helper repairs it.",
    scenarioTitle: "Scenario: The gift and the ride home",
    scenarioPrompt:
      "A peer offers you $40 and asks for a ride home after a hard meeting. You live nearby and want to help.",
    choices: [
      { text: "Take the money and give the ride because it is practical.", feedback: "Money creates obligation and role confusion.", score: 10 },
      { text: "Decline money, explore safer transport options, and consult supervisor about ride policies.", feedback: "This protects the relationship, follows policy, and keeps autonomy.", score: 100 },
      { text: "Post about it online asking what others would do, with enough details for context.", feedback: "This breaches confidentiality and professional conduct.", score: 0 },
    ],
    appliedTitle: "Documentation: boundary consultation note",
    appliedPrompt:
      "Draft a brief, respectful consultation note about a peer asking for your personal phone number and weekend hangouts. Include what was requested, how you responded, and what you will bring to supervision.",
    appliedKind: "documentation",
    references: [HHS_HIPAA, ...commonPeerRefs],
    modes: ["reading", "kinesthetic", "reflective"],
    quizFocus: "ethics, boundaries, confidentiality, and professional conduct",
  },
  {
    slug: "trauma-informed",
    title: "Module 4 - Trauma-Informed Care",
    shortTitle: "Trauma-informed care",
    description:
      "Understand trauma impacts, minimize re-traumatization, and practice safety, trust, choice, collaboration, and empowerment.",
    estimatedHours: 4,
    oarReferences: ["950-060-0140(2)(o)"],
    competencies: ["trauma-informed-care", "safety", "choice", "re-traumatization-prevention"],
    hook:
      "Here's the real talk: trauma-informed care is not a poster; it is how your pace, doorway, voice, and paperwork feel to someone with a nervous system on alert.",
    coreTruth:
      "Trauma-informed peer practice asks, 'What happened to you?' and 'What helps you feel safer right now?' rather than 'What is wrong with you?' It avoids forced disclosure and keeps choice visible.",
    preservedContent:
      "The principles include safety, trustworthiness and transparency, peer support and mutuality, collaboration, empowerment, voice and choice, and cultural, historical, and gender humility. Peers are not trauma therapists; they support regulation, connection, and pathways to appropriate care.",
    oregonContext:
      "Many Oregon peers carry trauma related to institutions, racism, forced treatment, houselessness, incarceration, family separation, violence, or medical harm. Services can retraumatize when they surprise, shame, corner, or rush people.",
    keySkills: [
      "Ask permission before sensitive topics",
      "Offer predictable structure and choices",
      "Avoid arguing with protective responses like shutdown or anger",
      "Support grounding while staying in peer scope",
    ],
    watchPrompt:
      "Look for environmental and relational cues: doors, seating, surprise touch, jargon, and how the helper explains choices.",
    scenarioTitle: "Scenario: Safety in the room",
    scenarioPrompt:
      "A peer sits with their back to the wall and flinches when someone knocks. You need to complete an intake-oriented conversation for your program.",
    choices: [
      { text: "Tell them the form is required and move quickly through every question.", feedback: "This prioritizes paperwork over safety and choice.", score: 20 },
      { text: "Name the interruption, ask what would feel safer, explain what is required, and offer pacing choices.", feedback: "This increases transparency, safety, and collaboration.", score: 100 },
      { text: "Ask for detailed trauma history so you understand the flinch.", feedback: "Peers should not force disclosure; details may not be needed.", score: 25 },
    ],
    appliedTitle: "Reflection: making safety visible",
    appliedPrompt:
      "Describe three concrete ways you will make a first meeting feel safer for someone with a trauma history: environment, language, and pacing.",
    appliedKind: "reflection",
    references: [SAMHSA_TRAUMA, ...commonPeerRefs],
    modes: ["story", "reading", "reflective"],
    quizFocus: "trauma-informed safety, choice, collaboration, and empowerment",
  },
  {
    slug: "crisis-safety",
    title: "Module 5 - Crisis Identification & Safety",
    shortTitle: "Crisis and safety",
    description:
      "Recognize suicide risk, overdose/intoxication, psychiatric crisis, and practice safety planning within peer scope.",
    estimatedHours: 4,
    oarReferences: ["950-060-0140(2)(k)"],
    competencies: ["suicide-awareness", "overdose-response", "crisis-identification", "safety-planning", "narcan-awareness"],
    hook:
      "Here's the real talk: calm peer presence matters in crisis, and so does knowing when presence is not enough.",
    coreTruth:
      "Peers often meet people in the hardest hours. The role is recognize, relate, and route: stay connected, ask direct safety questions when concerned, and follow crisis protocols when acute danger is present.",
    preservedContent:
      "Crisis domains include suicidal ideation and planning, overdose or intoxication emergencies, psychiatric crisis including psychosis-related distress, and interpersonal violence or immediate safety. Actions include staying calm, asking directly about suicide, knowing 988 and local crisis lines, supporting safety planning, and calling emergency services/use naloxone if trained and available for overdose.",
    oregonContext:
      "Oregon crisis response varies by county, mobile team availability, tribal and rural access, and organizational policy. Students must know 988, Lines for Life, employer on-call protocols, and local emergency pathways.",
    keySkills: [
      "Ask directly and compassionately about suicide when indicators appear",
      "Avoid secrecy promises about imminent harm",
      "Support safety planning without replacing crisis clinicians",
      "Recognize overdose warning signs and naloxone basics",
    ],
    watchPrompt:
      "Observe how direct questions can be compassionate rather than alarming, and how helpers explain confidentiality limits.",
    scenarioTitle: "Scenario: Tonight feels dangerous",
    scenarioPrompt:
      "Sam says, 'I don't want to be here tomorrow.' When gently asked, they mention pills at home and a plan for tonight.",
    choices: [
      { text: "Promise not to tell anyone so they keep trusting you.", feedback: "Imminent harm is a confidentiality limit; do not promise secrecy.", score: 0 },
      { text: "Stay with them, ask direct follow-up questions, and follow your crisis escalation protocol collaboratively.", feedback: "This balances relationship, safety, and scope.", score: 100 },
      { text: "Change the subject to positive thinking.", feedback: "Avoidance misses urgent risk.", score: 10 },
    ],
    appliedTitle: "Required roleplay: crisis routing practice",
    appliedPrompt:
      "Complete an AI Practice Lab session focused on suicidal ideation or overdose response. Practice direct inquiry, calm tone, safety steps, and debrief what you would document.",
    appliedKind: "roleplay",
    references: [LIFELINE_988, LINES_FOR_LIFE, ...commonPeerRefs],
    modes: ["auditory", "kinesthetic", "reflective"],
    quizFocus: "crisis recognition, suicide inquiry, overdose awareness, and safety protocols",
  },
  {
    slug: "culture-advocacy",
    title: "Module 6 - Cultural Humility & Advocacy",
    shortTitle: "Culture and advocacy",
    description:
      "Practice cultural humility, cross-cultural relationships, and advocacy without saviorism.",
    estimatedHours: 3,
    oarReferences: ["950-060-0140(2)(e)", "950-060-0140(2)(h)", "950-060-0140(2)(a)"],
    competencies: ["cultural-humility", "advocacy", "community-engagement", "anti-oppression"],
    hook:
      "Here's the real talk: cultural humility starts when you stop treating your assumptions like facts.",
    coreTruth:
      "Cultural humility is lifelong learning, self-critique, and redressing power imbalances. Advocacy means standing with people, not speaking over them because the system makes you angry too.",
    preservedContent:
      "Practice includes asking how someone identifies and what matters in their healing, noticing assumptions about family, religion, gender, disability, recovery pathways, and advocating with people rather than over them. Oregon communities include tribal nations, immigrant communities, rural towns, LGBTQ+ peers, Deaf community, veterans, and many more.",
    oregonContext:
      "Oregon's history includes colonization, exclusion laws, institutional racism, rural/urban divides, and culturally specific resilience. Peer workers should know local communities without claiming mastery over anyone's identity.",
    keySkills: [
      "Ask identity and preference questions without making the peer educate you on everything",
      "Use advocacy that keeps the peer's voice in front",
      "Notice power differences in systems meetings",
      "Connect to culturally specific and community-led resources when desired",
    ],
    watchPrompt:
      "Notice when helpers ask, assume, interrupt, translate jargon, or invite the peer to lead advocacy decisions.",
    scenarioTitle: "Scenario: Clinic front desk",
    scenarioPrompt:
      "Your peer is dismissed rudely at a clinic desk and wants to leave forever. They ask you to do something.",
    choices: [
      { text: "Yell at the receptionist for them.", feedback: "This may escalate and center you instead of the peer's agency.", score: 20 },
      { text: "Validate, ask what support they want, and follow their lead on speaking up, requesting a supervisor, rescheduling, or filing feedback.", feedback: "Collaborative advocacy preserves dignity and choice.", score: 100 },
      { text: "Tell them to toughen up because systems are always like this.", feedback: "This minimizes harm and models hopelessness.", score: 0 },
    ],
    appliedTitle: "Reflection: advocacy without taking over",
    appliedPrompt:
      "Write about a time you wanted someone to advocate with you. What helped? What felt controlling? Translate that lesson into three advocacy commitments for peer work.",
    appliedKind: "reflection",
    references: [SAMHSA_PEER_SUPPORT, OREGON_211, ...commonPeerRefs],
    modes: ["story", "reading", "reflective"],
    quizFocus: "cultural humility, advocacy, and community engagement",
  },
  {
    slug: "motivational-interviewing",
    title: "Module 7 - Motivational Interviewing Basics",
    shortTitle: "Motivational interviewing",
    description:
      "Learn MI spirit and core skills: partnership, acceptance, compassion, evocation; OARS.",
    estimatedHours: 4,
    oarReferences: ["950-060-0140(2)(z)", "950-060-0140(4)(e)"],
    competencies: ["motivational-interviewing", "oars", "stages-of-change", "change-talk"],
    hook:
      "Here's the real talk: the righting reflex feels helpful until it turns the peer into an audience for your argument.",
    coreTruth:
      "Motivational Interviewing is a collaborative conversation style that strengthens a person's own motivation for change. It fits peer work when we use it with partnership, acceptance, compassion, and evocation.",
    preservedContent:
      "MI spirit includes partnership, acceptance, compassion, and evocation. OARS skills are open questions, affirmations, reflections, and summaries. Stages of change include precontemplation, contemplation, preparation, action, maintenance, and recycling after relapse or return to use as part of learning.",
    oregonContext:
      "Peers use MI across housing, medications, treatment, harm reduction, family repair, benefits, and health goals. MI does not require you to agree with every choice; it asks you to evoke the peer's reasons and autonomy.",
    keySkills: [
      "Resist the righting reflex",
      "Use OARS to explore ambivalence",
      "Recognize change talk and sustain talk",
      "Support autonomy even when you are worried",
    ],
    watchPrompt:
      "Track OARS. Mark each open question, affirmation, reflection, and summary you hear, then note what evoked change talk.",
    scenarioTitle: "Scenario: Drinking and housing",
    scenarioPrompt:
      "A peer says, 'I know drinking is wrecking my housing, but it is the only way I sleep.'",
    choices: [
      { text: "Tell them they must stop drinking or they deserve eviction.", feedback: "Shame and confrontation increase defensiveness.", score: 0 },
      { text: "Reflect ambivalence and ask what they make of the connection between sleep, drinking, and housing.", feedback: "This evokes their own meaning and next steps.", score: 100 },
      { text: "Ignore the drinking and only talk about rent.", feedback: "This misses the peer's stated ambivalence.", score: 35 },
    ],
    appliedTitle: "Documentation: evoking change talk",
    appliedPrompt:
      "Write three OARS responses to the drinking-and-housing statement: one open question, one affirmation, and one complex reflection. Explain which response might evoke change talk.",
    appliedKind: "documentation",
    references: [MOTIVATIONAL_INTERVIEWING_NETWORK, ...commonPeerRefs],
    modes: ["auditory", "reading", "kinesthetic"],
    quizFocus: "MI spirit, OARS, stages of change, and change talk",
  },
  {
    slug: "documentation-legal",
    title: "Module 8 - Documentation, HIPAA & Legal Responsibilities",
    shortTitle: "Documentation and legal responsibilities",
    description:
      "Write recovery-oriented notes, understand Medicaid-relevant documentation expectations, and legal duties.",
    estimatedHours: 3,
    oarReferences: ["950-060-0140(2)(j)", "950-060-0140(2)(u)", "950-060-0140(2)(v)"],
    competencies: ["documentation", "hipaa", "medicaid-awareness", "legal-responsibilities"],
    hook:
      "Here's the real talk: write notes like the peer, your supervisor, and an auditor may all read them.",
    coreTruth:
      "Documentation should be factual, respectful, necessary, and connected to the peer's goals. Good notes protect continuity; harmful notes can follow a person through systems.",
    preservedContent:
      "Guidelines include writing as if the peer will read it, describing behavior and peer-reported experience, avoiding pejorative labels, connecting activities to goals and peer voice, knowing your EHR and billing rules, and never documenting gossip or unverified claims as fact.",
    oregonContext:
      "Oregon peer services may appear in Medicaid-related records, behavioral health EHRs, grant reporting, and supervision files. HIPAA, 42 CFR Part 2 when applicable, release-of-information policy, mandatory reporting, and employer procedure all matter.",
    keySkills: [
      "Use person-centered, non-stigmatizing language",
      "Document peer goals, service provided, and next step",
      "Protect minimum necessary information",
      "Know when to consult on mandatory reporting or legal questions",
    ],
    watchPrompt:
      "If reviewing a sample documentation training, pause after each note and ask: would this note help the peer or label them?",
    scenarioTitle: "Scenario: The note after a hard meeting",
    scenarioPrompt:
      "Alex missed shelter intake, cried, practiced grounding, declined a referral today, and asked to revisit Friday. You need to document the contact.",
    choices: [
      { text: "Write: 'Client was noncompliant and dramatic.'", feedback: "This is stigmatizing and not useful.", score: 0 },
      { text: "Write respectful facts, peer voice, support provided, decision made, and follow-up plan.", feedback: "This is recovery-oriented documentation.", score: 100 },
      { text: "Write nothing because documentation feels clinical.", feedback: "Required documentation can be done in a peer-centered way.", score: 25 },
    ],
    appliedTitle: "Exercise: write a peer progress note",
    appliedPrompt:
      "Scenario: You met Alex for 45 minutes at a resource center. Alex wanted help calling OHP enrollment support and practiced a grounding skill. Alex declined shelter referral today but asked to revisit Friday. Write a brief SOAP or DAP-style note that is recovery-oriented.",
    appliedKind: "documentation",
    references: [HHS_HIPAA, OREGON_HEALTH_PLAN, ...commonPeerRefs],
    modes: ["reading", "kinesthetic"],
    quizFocus: "documentation, HIPAA, Medicaid awareness, and legal responsibilities",
  },
  {
    slug: "systems-resources",
    title: "Module 9 - Systems Navigation & Community Resources",
    shortTitle: "Systems and resources",
    description:
      "Navigate Oregon behavioral health, housing, benefits, and mutual-aid resources with peers.",
    estimatedHours: 3,
    oarReferences: ["950-060-0140(2)(d)", "950-060-0140(2)(m)", "950-060-0140(2)(n)"],
    competencies: ["systems-navigation", "community-resources", "benefits-literacy", "family-support-systems"],
    hook:
      "Here's the real talk: a warm handoff can be the difference between a resource list and an actual door opening.",
    coreTruth:
      "Systems navigation helps people move through confusing service networks without creating dependency. The peer stays in the lead; the worker translates, accompanies, and connects.",
    preservedContent:
      "Peers help navigate Oregon Health Plan and coordinated care organizations, community mental health programs, SUD treatment and recovery support, housing systems, SNAP, SSI/SSDI advocacy pathways, peer-run organizations, and mutual aid. Skills include warm handoffs, appointment accompaniment, systems literacy, and knowing when to involve case managers or navigators.",
    oregonContext:
      "Rural Oregon access differs from Portland metro. Transportation, broadband, language access, tribal service pathways, shelter availability, and CCO differences can shape what is realistic today.",
    keySkills: [
      "Build and maintain a living regional resource map",
      "Make warm handoffs with consent",
      "Teach systems literacy without taking over",
      "Prioritize immediate safety, food, shelter, benefits, and connection",
    ],
    watchPrompt:
      "Observe whether the helper gives a list, makes a connection, or supports the peer to make the connection themselves.",
    scenarioTitle: "Scenario: Newly homeless family",
    scenarioPrompt:
      "A peer and their child just lost housing. They are overwhelmed and asking you to 'fix it.'",
    choices: [
      { text: "Promise you will find them an apartment by tomorrow.", feedback: "Overpromising harms trust.", score: 10 },
      { text: "Slow down, assess immediate safety and needs, co-create next steps such as 211, shelter options, benefits, school stability, and clarify what you can do together today.", feedback: "Collaborative, realistic, and empowerment-based.", score: 100 },
      { text: "Tell them to search online and call you later.", feedback: "This abandons without scaffolding.", score: 20 },
    ],
    appliedTitle: "Documentation: regional resource map",
    appliedPrompt:
      "Create a starter resource map for one Oregon community: crisis line, OHP/CCO help, shelter or coordinated entry, food, transportation, culturally specific support, and one peer-run or mutual-aid resource.",
    appliedKind: "documentation",
    references: [OREGON_211, OREGON_HEALTH_PLAN, ...commonPeerRefs],
    modes: ["visual", "reading", "kinesthetic"],
    quizFocus: "systems navigation, resource connection, and warm handoffs",
  },
  {
    slug: "self-care",
    title: "Module 10 - Self-Care & Sustainable Peer Work",
    shortTitle: "Self-care and sustainability",
    description:
      "Build personal wellness practices, recognize vicarious trauma, and use supervision.",
    estimatedHours: 3,
    oarReferences: ["950-060-0140(2)(p)"],
    competencies: ["self-care", "vicarious-trauma", "supervision-use"],
    hook:
      "Here's the real talk: burnout is not proof that you care; it is a signal to change the conditions around your care.",
    coreTruth:
      "Self-care is an ethical obligation in peer work. Burned-out peers can unintentionally harm relationships, blur boundaries, avoid documentation, or over-identify with crisis.",
    preservedContent:
      "Practices include a personal WRAP or wellness plan, supervision and peer consultation, boundaries around after-hours contact, grief and secondary trauma supports, and knowing when to step back. Vicarious trauma is the impact on helpers from repeated exposure to others' traumatic material.",
    oregonContext:
      "Peer workers in Oregon may serve communities they also belong to. That can be powerful and exhausting. Sustainable practice requires supervision that honors peer identity, not just productivity metrics.",
    keySkills: [
      "Identify early warning signs of burnout and vicarious trauma",
      "Create a daily maintenance and support plan",
      "Use supervision before resentment turns into rupture",
      "Set after-hours and personal disclosure boundaries",
    ],
    watchPrompt:
      "Watch for the difference between individual coping tips and systemic supports such as supervision, workload, and team culture.",
    scenarioTitle: "Scenario: The text after hours",
    scenarioPrompt:
      "A peer texts your personal number at midnight saying they are lonely and asking you to stay on the phone until morning.",
    choices: [
      { text: "Stay up all night and hide it from your supervisor.", feedback: "This creates unsustainable and unsafe role confusion.", score: 10 },
      { text: "Follow after-hours policy, offer appropriate crisis/warmline resources if needed, and bring the boundary issue to supervision.", feedback: "This protects care and sustainability.", score: 100 },
      { text: "Block them with no explanation.", feedback: "Abrupt disconnection can harm trust; use policy and repair when possible.", score: 25 },
    ],
    appliedTitle: "Reflection: personal wellness plan",
    appliedPrompt:
      "Create a one-page wellness plan: daily supports, early warning signs, people you can call, supervision topics, grief supports, and boundaries for this training and future peer work.",
    appliedKind: "reflection",
    references: [SAMHSA_TRAUMA, ...commonPeerRefs],
    modes: ["reflective", "reading", "kinesthetic"],
    quizFocus: "self-care, vicarious trauma, supervision, and sustainable peer work",
  },
  {
    slug: "pss-practice-lab",
    title: "Module 11 - Skills Lab, AI Practice & Competency Gate",
    shortTitle: "PSS practice lab",
    description:
      "Integrate skills through AI roleplays, documentation, and readiness for live evaluation.",
    estimatedHours: 4,
    oarReferences: ["950-060-0100", "950-060-0140(5)"],
    competencies: ["integrated-practice", "competency-demonstration", "roleplay-mastery"],
    hook:
      "Here's the real talk: seat time opens the door, but practice evidence shows you can walk through it.",
    coreTruth:
      "Cascade Peer Academy treats completion as competency-based. Students integrate listening, boundaries, trauma-informed practice, crisis routing, MI, documentation, and resource navigation.",
    preservedContent:
      "To complete PSS, students finish required modules and quizzes, complete required AI practice sessions across domains, submit documentation exercises, attend required live workshops for hybrid tracks, and pass a final human instructor competency evaluation. AI is a practice environment; human instructors make final completion recommendations.",
    oregonContext:
      "A completion certificate supports an OHA THW application but is not state certification by itself. Students should leave with a clean completion record, practice portfolio, and understanding of next steps.",
    keySkills: [
      "Use AI roleplay feedback to revise practice",
      "Prepare for observed roleplay with an instructor",
      "Connect documentation evidence to competency domains",
      "Explain completion versus OHA certification",
    ],
    watchPrompt:
      "Review your own AI feedback history like a game tape: what pattern improved, what repeated, and what needs instructor coaching?",
    scenarioTitle: "Scenario: Feedback that stings",
    scenarioPrompt:
      "Your AI roleplay feedback says you gave advice too quickly during a crisis scenario. You feel defensive because you were trying to help.",
    choices: [
      { text: "Dismiss the feedback and repeat the same approach.", feedback: "Competency grows when feedback changes practice.", score: 20 },
      { text: "Identify the moment, rewrite two responses, and practice again before live evaluation.", feedback: "This turns feedback into skill-building evidence.", score: 100 },
      { text: "Argue that AI decides certification.", feedback: "Human instructors make final completion recommendations; AI is practice support.", score: 35 },
    ],
    appliedTitle: "Required: complete AI roleplay set (PSS)",
    appliedPrompt:
      "Complete at least eight AI peer sessions covering listening, boundaries, crisis routing, MI, and systems navigation. Save feedback notes and one revised response from each domain.",
    appliedKind: "roleplay",
    references: [SAMHSA_PEER_SUPPORT, OHA_THW_REQUIREMENTS, ...commonPeerRefs],
    modes: ["auditory", "kinesthetic", "reflective"],
    quizFocus: "integrated PSS competencies and completion readiness",
  },
];

export const CORE_PSS_MODULES: ModuleSeed[] = PSS_SPECS.map(buildModule);

export const PSS_COURSE: CourseSeed = {
  slug: "oregon-pss-40",
  type: "PSS",
  title: "Peer Support Specialist (PSS) - 40-Hour Academy",
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
  modules: CORE_PSS_MODULES.map((mod) => ({
    ...mod,
    lessons: mod.lessons ?? flattenModuleLessons(mod),
  })),
};
