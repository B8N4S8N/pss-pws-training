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
import { PSS_COURSE } from "./pss";
import {
  CDC_NALOXONE,
  CDC_SOCIAL_DETERMINANTS,
  HHS_HIPAA,
  HHS_42_CFR_PART_2,
  HUD_EXCHANGE_COC,
  MOTIVATIONAL_INTERVIEWING_NETWORK,
  OHA_PEER_DELIVERED_SERVICES,
  OHA_THW_REQUIREMENTS,
  OHA_THW_RULES,
  OREGON_211,
  OREGON_HARM_REDUCTION,
  OREGON_HEALTH_PLAN,
  SAMHSA_PEER_SUPPORT,
  SAMHSA_RECOVERY,
  SAMHSA_TRAUMA,
  WRAP_INFO,
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

type Choice = { text: string; feedback: string; score: number };

type PwsSpec = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  estimatedHours: number;
  oarReferences: string[];
  competencies: string[];
  hook: string;
  core: string;
  preservedContent: string;
  oregonContext: string;
  advancedPractice: string[];
  watchPrompt: string;
  scenarioTitle: string;
  scenarioPrompt: string;
  choices: Choice[];
  appliedTitle: string;
  appliedPrompt: string;
  appliedKind: "documentation" | "reflection" | "roleplay" | "live";
  references: ReferenceLink[];
  modes: LearningMode[];
  quizFocus: string;
};

const pwsCoreRefs = [
  OHA_THW_RULES,
  OHA_THW_REQUIREMENTS,
  OHA_PEER_DELIVERED_SERVICES,
  SAMHSA_PEER_SUPPORT,
];

function bulletList(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

function deepBody(spec: PwsSpec) {
  return `# ${spec.shortTitle}: expanded PWS practice

${spec.core}

PWS work builds on PSS foundations and asks for wider integration: whole health, addiction recovery, wellness planning, social determinants, group process, multidisciplinary teams, and advanced navigation. The tone remains peer-to-peer. The scope remains non-clinical. The responsibility grows because the settings are often more complex: primary care clinics, CCO-funded programs, residential and outpatient SUD services, housing partnerships, hospitals, peer-run programs, and community-based outreach.

${callout(
  "story",
  `${spec.hook} In PWS settings, that moment often happens in a waiting room, a huddle, a group circle, or a housing lobby — not in a quiet therapy office.`
)}

## Preserved and expanded content

${spec.preservedContent}

## A field story frame

Picture a peer who is managing chronic health needs, recovery goals, transportation gaps, and a care team that speaks in acronyms. Your job is not to become the care team. Your job is to help the person stay oriented to their own priorities while the system becomes more usable. That might look like preparing questions for a medical visit, co-building a WRAP section, practicing a harm-reduction plan, facilitating a group opening, or translating a benefits letter into plain language.

## Oregon practice lens

${spec.oregonContext}

The best PWS practice avoids two traps. The first trap is rescue: doing the work for the person until their own confidence shrinks. The second trap is professional mimicry: sounding like a junior clinician to gain credibility on a team. PWS credibility comes from lived experience, strong boundaries, accurate resource knowledge, and the ability to make systems more humane without pretending systems are simple.

## Learning for every style

- **Reading / reflective:** mark one sentence that would change how you speak in a multidisciplinary huddle.
- **Visual / auditory:** map the peer, the system actors, and the decision points on one page.
- **Kinesthetic:** rehearse a warm handoff and a boundary sentence aloud.
- **Story:** notice when your lived experience opens trust and when it risks oversharing.

## Advanced practice moves

${bulletList(spec.advancedPractice)}

${callout(
  "practice",
  "Write one sentence that starts, \"In this topic, my role is...\" and one that starts, \"In this topic, my role is not...\" Bring both to supervision."
)}

Pause at the end of this reading and write one sentence that starts, "In this topic, my role is..." and one sentence that starts, "In this topic, my role is not..." Those two sentences are a supervision tool.${deepDiveSection(
    "PWS anchors",
    spec.references
  )}`;
}

function practiceBody(spec: PwsSpec) {
  return `# Practice lab: ${spec.shortTitle}

This chapter turns the concept into repeatable PWS behavior. Start with the peer's definition of wellness. If your language gets bigger than the person's stated goal, shrink it back down. "Medication-assisted treatment," "social determinants," "coordinated entry," "whole health," and "stages of change" can all be useful concepts, but the peer may be asking for sleep tonight, a safer way to use, a ride to a benefits appointment, or a group where nobody talks over them.

Strong PWS practice uses a three-part rhythm:

1. **Name what you heard.** Reflect the person's words before translating them into systems language.
2. **Offer a menu.** Provide options without pretending the menu is complete or equally accessible.
3. **Choose the next doable action.** Make the next step small enough to attempt and meaningful enough to matter.

For this module, practice the following:

${bulletList(spec.advancedPractice)}

${callout(
  "warning",
  "Advanced does not mean outside scope. It means more precise consent, better resource knowledge, cleaner team communication, and stronger follow-through."
)}`;
}

function watchContent(spec: PwsSpec) {
  return `# Watch-along: ${spec.shortTitle}

${spec.watchPrompt}

Use an instructor-assigned public education clip or agency training segment when available. If no clip is assigned, treat this as a structured observation exercise: watch a credible public video connected to the module topic and listen for how the speaker frames dignity, choice, and practical next steps.

Write down:

- One phrase you would use with a peer.
- One phrase you would avoid or translate.
- One Oregon-specific resource or policy question to bring to supervision.
- One way the topic connects to whole-person wellness.`;
}

function buildQuiz(spec: PwsSpec): QuizQuestion[] {
  return [
    {
      id: `${spec.slug}-q1`,
      prompt: `In ${spec.quizFocus}, what makes the practice specifically peer-centered?`,
      options: [
        "The worker chooses the plan because they have more training",
        "The peer's goals, culture, consent, and lived context shape the support",
        "The worker avoids all systems because systems are clinical",
        "The same script is used for every participant",
      ],
      correctIndex: 1,
      explanation:
        "PWS practice remains peer-centered by honoring goals, culture, consent, and context.",
    },
    {
      id: `${spec.slug}-q2`,
      prompt: "When working in expanded PWS settings, scope clarity means:",
      options: [
        "Providing medical, legal, or clinical advice when the team is busy",
        "Refusing to collaborate with anyone outside peer roles",
        "Collaborating while naming what peers do and do not provide",
        "Documenting only when a supervisor asks twice",
      ],
      correctIndex: 2,
      explanation:
        "PWS workers collaborate with teams and systems while protecting the non-clinical peer role.",
    },
    {
      id: `${spec.slug}-q3`,
      prompt: "A strong next step in this module should usually be:",
      options: [
        "Small, consent-based, realistic, and connected to the peer's stated priority",
        "Large enough to prove the peer is serious",
        "Chosen secretly by the worker",
        "Delayed until every barrier is solved",
      ],
      correctIndex: 0,
      explanation:
        "Doable, peer-chosen steps build self-efficacy and reduce overwhelm.",
    },
    {
      id: `${spec.slug}-q4`,
      prompt: "If a peer's choice conflicts with what you personally would choose, the PWS stance is to:",
      options: [
        "Use shame to create motivation",
        "Explore values, risks, supports, and options without taking over",
        "End the relationship immediately",
        "Tell the team the peer is noncompliant",
      ],
      correctIndex: 1,
      explanation:
        "Peer work uses curiosity, MI-consistent language, harm reduction, and honest safety limits.",
    },
    {
      id: `${spec.slug}-q5`,
      prompt: "Why do PWS modules include documentation and resource exercises?",
      options: [
        "To turn peers into case managers",
        "To practice respectful continuity, resource literacy, and evidence of support",
        "To replace supervision",
        "To collect private details even when unnecessary",
      ],
      correctIndex: 1,
      explanation:
        "Documentation and resource exercises support continuity and competency while respecting privacy.",
    },
    {
      id: `${spec.slug}-q6`,
      prompt: "The most appropriate use of supervision in this module is:",
      options: [
        "Only after something goes badly wrong",
        "For scope questions, safety concerns, team pressure, ethical gray zones, and skill growth",
        "Never, because peer work must be independent",
        "To ask supervisors to make every peer decision",
      ],
      correctIndex: 1,
      explanation:
        "Supervision is a normal support for ethical, sustainable, high-quality PWS work.",
    },
  ];
}

function appliedLesson(spec: PwsSpec): LessonSeed {
  const payload = {
    prompt: spec.appliedPrompt,
    rubric: [
      "Advanced peer scope is clear",
      "Peer goals and self-determination are central",
      "Oregon resource or team context is accurate",
      "Next step is practical and documented respectfully",
    ],
  };

  if (spec.appliedKind === "documentation") {
    return documentation(spec.appliedTitle, spec.appliedPrompt, payload, 35, {
      references: spec.references,
      learningModes: ["reading", "kinesthetic"],
    });
  }

  if (spec.appliedKind === "roleplay") {
    return {
      slug: slugify(spec.appliedTitle),
      title: spec.appliedTitle,
      type: "ROLEPLAY",
      estimatedMinutes: 60,
      contentMd: `${spec.appliedPrompt}\n\nComplete the assigned AI Practice Lab session and save a feedback note about peer choice, scope, and next step planning.`,
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
      estimatedMinutes: 75,
      contentMd: `${spec.appliedPrompt}\n\nUse the live session to rehearse language, compare resource maps, and ask instructor questions about scope.`,
      interactivePayload: payload,
      references: spec.references,
      learningModes: ["auditory", "kinesthetic", "reflective"],
    };
  }

  return reflection(spec.appliedTitle, spec.appliedPrompt, 30, {
    references: spec.references,
    learningModes: ["reflective", "reading"],
    interactivePayload: payload,
  });
}

function buildModule(spec: PwsSpec): ModuleSeed {
  const baseChapters: ChapterSeed[] = [
    {
      slug: `${spec.slug}-foundations`,
      title: "Chapter 1 - Expanded foundations",
      description:
        "Connect the PWS topic to whole-person wellness, Oregon scope, and lived-experience practice.",
      lessons: [
        storyReading({
          title: `${spec.shortTitle}: real talk for PWS practice`,
          hook: spec.hook,
          body: deepBody(spec),
          minutes: 40,
          references: spec.references,
          learningModes: spec.modes,
        }),
        videoLesson(`Watch-along: ${spec.shortTitle}`, watchContent(spec), 25, {
          references: spec.references,
          learningModes: ["visual", "auditory", "reflective"],
        }),
      ],
    },
    {
      slug: `${spec.slug}-applied-skills`,
      title: "Chapter 2 - Applied PWS skills",
      description:
        "Practice advanced peer moves with consent, resource accuracy, and scope clarity.",
      lessons: [
        reading(`Applied skills for ${spec.shortTitle}`, practiceBody(spec), 35, {
          references: spec.references,
          learningModes: ["reading", "kinesthetic", "reflective"],
        }),
        scenario(
          spec.scenarioTitle,
          `# ${spec.scenarioTitle}\n\n${spec.scenarioPrompt}\n\nChoose a response that stays peer-centered while using the expanded PWS skill set.`,
          { scenario: spec.scenarioPrompt, choices: spec.choices },
          30,
          { references: spec.references }
        ),
      ],
    },
    {
      slug: `${spec.slug}-portfolio`,
      title: "Chapter 3 - Portfolio integration",
      description:
        "Create a portfolio artifact and finish with a module mini-quiz.",
      lessons: [
        appliedLesson(spec),
        reading(
          `Portfolio checkpoint: ${spec.shortTitle}`,
          `# Portfolio checkpoint

PWS completion requires evidence that you can integrate values, scope, and action. Add one artifact from this module to your portfolio: a resource map, wellness plan draft, group outline, documentation note, MI transcript, roleplay feedback, or supervision question. The artifact does not need to be perfect. It needs to show how you think and how you revise.

Before the quiz, answer these prompts:

- What is the peer's goal in this topic?
- What system or resource barrier might get in the way?
- What would be a respectful first step?
- What belongs in documentation?
- What belongs in supervision?

${callout(
  "practice",
  "Advanced PWS work is not louder or more complicated. It is clearer, better coordinated, and more accountable to the peer."
)}`,
          20,
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
    moduleQuiz(`${spec.slug}-module-quiz`, `Mini-Quiz: ${spec.shortTitle}`, buildQuiz(spec), 20)
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

function cloneLesson(lesson: LessonSeed): LessonSeed {
  return {
    ...lesson,
  };
}

function cloneModule(module: ModuleSeed): ModuleSeed {
  const chapters = module.chapters.map((chapter) => ({
    ...chapter,
    lessons: chapter.lessons.map(cloneLesson),
  }));

  return {
    ...module,
    chapters,
    lessons: chapters.flatMap((chapter) => chapter.lessons),
  };
}

const PWS_SPECS: PwsSpec[] = [
  {
    slug: "wrap-wellness",
    title: "Module 12 - WRAP & Wellness Planning",
    shortTitle: "WRAP and wellness planning",
    description:
      "Facilitate Wellness Recovery Action Planning concepts and individualized wellness tools.",
    estimatedHours: 4,
    oarReferences: ["950-060-0140(4)(d)", "950-060-0140(5)(c)"],
    competencies: ["wrap", "wellness-planning", "recovery-tools"],
    hook:
      "Here's the real talk: a wellness plan is not a compliance worksheet; it is a map the peer owns.",
    core:
      "WRAP and related wellness planning tools help people name what keeps them well, what throws them off, and what support they want before, during, and after crisis.",
    preservedContent:
      "Wellness planning includes a wellness toolbox, daily maintenance plan, triggers, early warning signs, crisis planning, and post-crisis planning. As a PWS, you support peers in building plans that are theirs, not documents written to satisfy somebody else's definition of stability.",
    oregonContext:
      "Wellness plans may travel across peer-run programs, outpatient teams, shelters, hospitals, and family systems. Consent matters: a plan belongs to the peer even when it is helpful to share parts with a team.",
    advancedPractice: [
      "Ask what wellness looks like on an ordinary Tuesday, not just after crisis",
      "Separate daily maintenance, triggers, early warning signs, crisis supports, and post-crisis repair",
      "Use strengths-based language that a peer would recognize as their own",
      "Document plan elements only with consent and purpose",
    ],
    watchPrompt:
      "Watch for whether the facilitator writes with the person or for the person, and how they handle disagreement.",
    scenarioTitle: "Scenario: The plan that sounds like staff",
    scenarioPrompt:
      "A peer reads a wellness plan from a prior program and says, 'This sounds like what staff wanted, not me.'",
    choices: [
      { text: "Tell them to keep it because staff probably knew best.", feedback: "This removes ownership.", score: 0 },
      { text: "Ask what parts feel true, what should be removed, and what wellness language sounds like their own.", feedback: "This restores ownership and practical use.", score: 100 },
      { text: "Throw it away without discussing safety information.", feedback: "Some parts may still be useful; collaborate instead.", score: 40 },
    ],
    appliedTitle: "Exercise: co-create a mini wellness plan",
    appliedPrompt:
      "Draft a mini wellness plan for a fictional peer who experiences anxiety and stimulant cravings. Include toolbox items, daily maintenance, early warning signs, crisis preferences, and one post-crisis repair step.",
    appliedKind: "documentation",
    references: [WRAP_INFO, SAMHSA_RECOVERY, ...pwsCoreRefs],
    modes: ["reading", "kinesthetic", "reflective"],
    quizFocus: "WRAP, wellness planning, and recovery tools",
  },
  {
    slug: "addiction-harm-reduction",
    title: "Module 13 - Addiction Recovery & Harm Reduction",
    shortTitle: "Addiction recovery and harm reduction",
    description:
      "Support multiple pathways to recovery including harm reduction, abstinence, MAT, and mutual aid.",
    estimatedHours: 5,
    oarReferences: ["950-060-0140(2)(w)", "950-060-0140(4)(d)"],
    competencies: ["harm-reduction", "addiction-recovery", "mat-awareness", "mutual-aid"],
    hook:
      "Here's the real talk: meeting people where they are means actually staying there long enough to be useful.",
    core:
      "Addiction recovery includes multiple pathways: abstinence-based mutual aid, SMART Recovery, medication for opioid use disorder, harm reduction, culturally specific supports, faith-based recovery, and self-directed change.",
    preservedContent:
      "Peer stance means respecting the peer's goals, not imposing your pathway, reducing shame, celebrating movement toward self-defined wellness, and understanding relapse or return to use as information rather than moral failure.",
    oregonContext:
      "Oregon harm reduction work includes naloxone access, syringe service programs, fentanyl risk education, low-barrier treatment, Measure 110-era service changes, and county-by-county resource differences.",
    advancedPractice: [
      "Offer safer-use and overdose-prevention resources without requiring abstinence first",
      "Discuss MOUD/MAT as one evidence-supported pathway without prescribing or pressuring",
      "Use MI to explore ambivalence around use, housing, health, and relationships",
      "Know 42 CFR Part 2 confidentiality concerns in SUD settings",
    ],
    watchPrompt:
      "Watch for language that reduces shame and for moments where safety information is offered without coercion.",
    scenarioTitle: "Scenario: Active use and housing",
    scenarioPrompt:
      "A peer says they will keep using meth but want help staying housed and safer.",
    choices: [
      { text: "Refuse to help until they commit to abstinence.", feedback: "Withholding support increases harm.", score: 0 },
      { text: "Explore housing and safety goals, offer harm reduction resources, and connect to low-barrier supports without shaming.", feedback: "This aligns harm reduction and peer ethics.", score: 100 },
      { text: "Threaten police involvement to scare them sober.", feedback: "This destroys trust and can create danger.", score: 0 },
    ],
    appliedTitle: "Roleplay: harm reduction conversation",
    appliedPrompt:
      "Complete an AI roleplay with a peer in active use. Practice offering naloxone or safer-use resources with consent, then reflect on where you felt the righting reflex.",
    appliedKind: "roleplay",
    references: [OREGON_HARM_REDUCTION, CDC_NALOXONE, HHS_42_CFR_PART_2, ...pwsCoreRefs],
    modes: ["auditory", "kinesthetic", "reflective"],
    quizFocus: "addiction recovery, harm reduction, MOUD/MAT awareness, and mutual aid",
  },
  {
    slug: "group-facilitation",
    title: "Module 14 - Group Facilitation",
    shortTitle: "Group facilitation",
    description:
      "Facilitate peer groups with safety, structure, and shared leadership.",
    estimatedHours: 4,
    oarReferences: ["950-060-0140(4)(b)"],
    competencies: ["group-facilitation", "peer-groups", "conflict-in-groups"],
    hook:
      "Here's the real talk: the loudest person in group is not the group, and the quietest person is still participating.",
    core:
      "Peer groups are communities of practice. They need structure, safety agreements, shared leadership, and room for different recovery pathways without becoming advice factories.",
    preservedContent:
      "Group skills include opening and closing rituals, confidentiality limits, balancing voices, redirecting advice-giving, handling conflict and crisis in group, and co-facilitation. Peer groups are not therapy process groups unless within a clinical program design.",
    oregonContext:
      "Groups may be held in peer-run centers, clinics, residential programs, shelters, jails, recovery cafes, online cohorts, and culturally specific organizations. Access and safety look different in each setting.",
    advancedPractice: [
      "Open with agreements that name confidentiality limits and shared voice",
      "Redirect cross-talk without shaming",
      "Balance structure with organic peer connection",
      "Plan crisis and conflict responses before group begins",
    ],
    watchPrompt:
      "Observe how the facilitator uses rituals, agreements, body language, and summaries to keep the group peer-led.",
    scenarioTitle: "Scenario: Cross-talk and advice giving",
    scenarioPrompt:
      "In group, one member repeatedly tells another, 'Just stop hanging out with those people.' The original speaker gets quiet.",
    choices: [
      { text: "Publicly shame the advice-giver.", feedback: "This creates unsafety.", score: 15 },
      { text: "Thank them for caring, remind the group of sharing guidelines, and invite the original speaker to name what support would help.", feedback: "This protects norms and voice.", score: 100 },
      { text: "Ignore it and hope the group self-corrects.", feedback: "Harmful norms can set in quickly.", score: 25 },
    ],
    appliedTitle: "Documentation: design a peer group outline",
    appliedPrompt:
      "Create a 60-minute peer group outline with opening, agreements, topic prompt, shared activity, crisis plan, and closing. Include how you will balance voices.",
    appliedKind: "documentation",
    references: [SAMHSA_PEER_SUPPORT, ...pwsCoreRefs],
    modes: ["visual", "reading", "kinesthetic"],
    quizFocus: "peer group facilitation, conflict, and shared leadership",
  },
  {
    slug: "resilience-efficacy",
    title: "Module 15 - Resilience & Self-Efficacy",
    shortTitle: "Resilience and self-efficacy",
    description:
      "Cultivate individual resilience and self-efficacy using strengths-based peer practice.",
    estimatedHours: 3,
    oarReferences: ["950-060-0140(4)(a)", "950-060-0140(4)(c)"],
    competencies: ["resilience", "self-efficacy", "strengths-based"],
    hook:
      "Here's the real talk: resilience is not toughness theater; it is supported recovery after stress.",
    core:
      "Self-efficacy is belief in one's ability to act. PWS workers grow it by noticing small wins, breaking goals into doable steps, modeling coping, and avoiding rescue that steals agency.",
    preservedContent:
      "Resilience and self-efficacy are built through strengths-based practice, mastery experiences, social modeling, encouragement, and reducing barriers. The peer's own evidence of survival matters.",
    oregonContext:
      "For people navigating poverty, racism, disability, houselessness, grief, and health barriers, resilience language can sound blaming unless paired with structural awareness and tangible support.",
    advancedPractice: [
      "Name strengths without turning hardship into a compliment",
      "Break goals into doable actions that create mastery",
      "Use peer modeling carefully and with consent",
      "Track wins that the peer recognizes, not just program milestones",
    ],
    watchPrompt:
      "Notice whether the speaker frames resilience as individual grit or supported capacity in context.",
    scenarioTitle: "Scenario: 'I always fail'",
    scenarioPrompt:
      "A peer says, 'I always fail. Why bother trying another appointment?' They missed two prior intakes.",
    choices: [
      { text: "Agree that the pattern is hopeless.", feedback: "This reinforces shame.", score: 0 },
      { text: "Reflect discouragement, identify what got in the way, and ask about one smaller supportable step.", feedback: "This builds efficacy through doable action.", score: 100 },
      { text: "Make the appointment for them without asking.", feedback: "This may solve a task while reducing agency.", score: 45 },
    ],
    appliedTitle: "Reflection: strengths inventory",
    appliedPrompt:
      "List 10 strengths you bring as a peer worker and describe how each could support someone else's self-efficacy without making their recovery about you.",
    appliedKind: "reflection",
    references: [SAMHSA_RECOVERY, SAMHSA_TRAUMA, ...pwsCoreRefs],
    modes: ["story", "reading", "reflective"],
    quizFocus: "resilience, self-efficacy, and strengths-based practice",
  },
  {
    slug: "advanced-mi-change",
    title: "Module 16 - Advanced MI & Stages of Change",
    shortTitle: "Advanced MI and change",
    description:
      "Deepen MI practice across ambivalence, discord, and maintenance.",
    estimatedHours: 4,
    oarReferences: ["950-060-0140(2)(z)", "950-060-0140(4)(e)"],
    competencies: ["advanced-mi", "discord", "maintenance-support"],
    hook:
      "Here's the real talk: discord is not a character flaw; it is data about the relationship, pace, or plan.",
    core:
      "Advanced MI deepens work with ambivalence, sustain talk, change talk, discord, maintenance, and return to use. The worker listens for desire, ability, reasons, need, commitment, activation, and taking steps.",
    preservedContent:
      "Ambivalence is normal. Discord, formerly called resistance in older MI language, often signals relationship rupture or mismatched pace. Skills include softening sustain talk without arguing, eliciting DARN-CAT change talk, repairing discord, and supporting maintenance or recycling after return to use.",
    oregonContext:
      "Advanced MI supports conversations about SUD treatment, tobacco, chronic disease care, housing rules, probation requirements, family repair, and medications without becoming coercive.",
    advancedPractice: [
      "Reflect both sides of ambivalence without stacking the deck",
      "Respond to discord by changing your approach",
      "Elicit DARN-CAT change talk",
      "Support maintenance and return-to-use learning without shame",
    ],
    watchPrompt:
      "Listen for sustain talk and change talk. Mark how the helper responds when the peer pushes back.",
    scenarioTitle: "Scenario: 'You sound like everyone else'",
    scenarioPrompt:
      "A peer says, 'You sound like everyone else trying to make me go to treatment.'",
    choices: [
      { text: "Argue that treatment is obviously the right choice.", feedback: "This increases discord.", score: 0 },
      { text: "Reflect the concern, apologize for pushing, and ask what kind of conversation would feel useful.", feedback: "This repairs alliance and restores autonomy.", score: 100 },
      { text: "End the conversation because MI failed.", feedback: "Discord is a signal to adjust, not quit.", score: 20 },
    ],
    appliedTitle: "Required: advanced MI roleplays",
    appliedPrompt:
      "Complete AI sessions tagged MI/ambivalence and relapse support. Save one example of sustain talk, one example of change talk, and your best complex reflection.",
    appliedKind: "roleplay",
    references: [MOTIVATIONAL_INTERVIEWING_NETWORK, ...pwsCoreRefs],
    modes: ["auditory", "kinesthetic", "reflective"],
    quizFocus: "advanced MI, discord, change talk, and maintenance support",
  },
  {
    slug: "health-promotion",
    title: "Module 17 - Health Promotion, Chronic Disease & Whole Health",
    shortTitle: "Health promotion and whole health",
    description:
      "Support whole-person wellness including chronic disease literacy, tobacco, and when to seek medical help.",
    estimatedHours: 4,
    oarReferences: ["950-060-0140(2)(w)", "950-060-0140(2)(x)", "950-060-0140(2)(aa)", "950-060-0140(2)(bb)"],
    competencies: ["health-promotion", "chronic-disease-literacy", "health-literacy", "whole-health"],
    hook:
      "Here's the real talk: whole health is not telling people what to eat; it is helping them get care without shame.",
    core:
      "PWS workers integrate behavioral health and primary care navigation while staying out of medical practice. They support health literacy, appointment preparation, tobacco cessation interest, chronic disease self-management goals, and urgent-care decision-making.",
    preservedContent:
      "Whole health includes warning signs that need medical attention, tobacco cessation support without coercion, health literacy, oral health training awareness for OHA certification pathways, and life-span considerations. Peers do not practice medicine; they support engagement and understanding.",
    oregonContext:
      "Oregon Health Plan, CCOs, Federally Qualified Health Centers, tribal clinics, public health, dental access, and rural transportation all shape health promotion options.",
    advancedPractice: [
      "Help peers prepare questions for medical visits",
      "Use teach-back without sounding patronizing",
      "Recognize symptoms that need urgent or emergency evaluation per protocol",
      "Discuss tobacco or chronic disease goals without moralizing bodies",
    ],
    watchPrompt:
      "Watch for shame-free health language and how the helper responds to physical symptoms outside their scope.",
    scenarioTitle: "Scenario: Chest pain or panic?",
    scenarioPrompt:
      "A peer with anxiety says they have chest pain and shortness of breath but worries the ER will judge them.",
    choices: [
      { text: "Diagnose panic and coach breathing only.", feedback: "Peers do not diagnose and chest pain may be urgent.", score: 0 },
      { text: "Validate fear, explain you cannot diagnose, and support urgent/emergency evaluation per protocol.", feedback: "This stays in scope and prioritizes safety.", score: 100 },
      { text: "Ignore physical symptoms because they are outside peer scope.", feedback: "Outside scope does not mean ignore; route appropriately.", score: 20 },
    ],
    appliedTitle: "Reflection: whole health without moralizing",
    appliedPrompt:
      "Write how you will talk about physical health, tobacco, sleep, food, movement, medication questions, and medical appointments without shame or unauthorized advice.",
    appliedKind: "reflection",
    references: [OREGON_HEALTH_PLAN, CDC_SOCIAL_DETERMINANTS, ...pwsCoreRefs],
    modes: ["reading", "reflective"],
    quizFocus: "health promotion, chronic disease literacy, and whole health navigation",
  },
  {
    slug: "teams-supervision",
    title: "Module 18 - Multidisciplinary Teams & Supervision",
    shortTitle: "Teams and supervision",
    description:
      "Work effectively on care teams, understand supervision, and protect peer integrity in clinical settings.",
    estimatedHours: 3,
    oarReferences: ["950-060-0140(2)(t)", "950-060-0140(2)(s)"],
    competencies: ["teamwork", "supervision", "role-clarity", "peer-integrity"],
    hook:
      "Here's the real talk: collaboration does not require surrendering peer values at the conference table.",
    core:
      "PWS workers often collaborate with clinicians, case managers, nurses, prescribers, housing staff, supervisors, and community partners. Role clarity protects the peer perspective.",
    preservedContent:
      "Peers on care teams clarify role in every setting, resist pressure to become a junior clinician, use supervision for ethics and secondary trauma, and share peer perspective in team meetings with consent and professionalism.",
    oregonContext:
      "Oregon peer roles may be embedded in CCO networks, CMHPs, SUD programs, hospitals, primary care, and peer-run organizations. Each setting has different documentation, supervision, and billing expectations.",
    advancedPractice: [
      "Introduce the peer role in team language without losing peer voice",
      "Use supervision for team pressure and ethical tension",
      "Share information with consent and minimum necessary principles",
      "Translate clinical plans into peer-centered support options",
    ],
    watchPrompt:
      "Notice how team members discuss the peer. Who names strengths? Who names choice? Who uses labels?",
    scenarioTitle: "Scenario: Team asks you to confront",
    scenarioPrompt:
      "A clinician asks you to 'make' a peer accept residential treatment today.",
    choices: [
      { text: "Agree and pressure the peer.", feedback: "This violates peer ethics and MI spirit.", score: 0 },
      { text: "Clarify your role, offer to explore the peer's perspective and ambivalence, and invite collaborative planning.", feedback: "This maintains integrity and teamwork.", score: 100 },
      { text: "Complain about the clinician to the peer.", feedback: "This splits the team and harms trust.", score: 15 },
    ],
    appliedTitle: "Live lab: role clarity on a team",
    appliedPrompt:
      "In live session, rehearse a one-minute explanation of the PWS role for a multidisciplinary team and practice responding to pressure to act outside scope.",
    appliedKind: "live",
    references: [HHS_HIPAA, HHS_42_CFR_PART_2, ...pwsCoreRefs],
    modes: ["auditory", "kinesthetic", "reflective"],
    quizFocus: "multidisciplinary teams, supervision, role clarity, and peer integrity",
  },
  {
    slug: "sdoh-partnerships",
    title: "Module 19 - Social Determinants & Community Partnerships",
    shortTitle: "SDOH and partnerships",
    description:
      "Address SDOH, build partnerships, and support structural navigation.",
    estimatedHours: 3,
    oarReferences: ["950-060-0140(2)(q)", "950-060-0140(2)(r)", "950-060-0140(2)(f)", "950-060-0140(2)(g)"],
    competencies: ["sdoh", "partnerships", "strengths-needs-assessment", "conflict-problem-solving"],
    hook:
      "Here's the real talk: people do not recover in a vacuum; rent, racism, food, transport, and loneliness show up in the room.",
    core:
      "Social determinants of health include housing, income, racism, transportation, education, neighborhood conditions, food access, disability access, and social connection. PWS workers help peers navigate these realities without blaming them for structural barriers.",
    preservedContent:
      "Peers help with strengths-and-needs conversations, conflict problem-solving, and partnerships with local agencies while keeping the peer in the lead. Strengths are documented alongside needs, not after everything is fixed.",
    oregonContext:
      "Oregon partnerships may include CCOs, coordinated entry, culturally specific organizations, tribal programs, public health, food banks, domestic violence programs, recovery community organizations, libraries, and rural transportation networks.",
    advancedPractice: [
      "Conduct strengths-and-needs conversations without turning people into problems",
      "Map resource gaps and partnership opportunities",
      "Use conflict problem-solving with landlords, agencies, and teams",
      "Document structural barriers respectfully and specifically",
    ],
    watchPrompt:
      "Watch whether the speaker frames SDOH as context, not excuses and not personal failure.",
    scenarioTitle: "Scenario: Eviction, diabetes, and isolation",
    scenarioPrompt:
      "A peer faces eviction, diabetes management challenges, and isolation. They say, 'Everyone acts like I am lazy.'",
    choices: [
      { text: "Focus only on motivation and ignore barriers.", feedback: "This individualizes structural problems.", score: 10 },
      { text: "Validate the weight of the barriers, identify strengths, prioritize with the peer, and map partners for housing, health, and connection.", feedback: "This is SDOH-aware and peer-centered.", score: 100 },
      { text: "Make calls without telling the peer so it is faster.", feedback: "This removes consent and agency.", score: 25 },
    ],
    appliedTitle: "Exercise: strengths and needs snapshot",
    appliedPrompt:
      "Create a strengths-and-needs snapshot for the eviction/diabetes/isolation scenario. Put peer priorities first, include strengths, and identify partner domains.",
    appliedKind: "documentation",
    references: [CDC_SOCIAL_DETERMINANTS, OREGON_211, ...pwsCoreRefs],
    modes: ["visual", "reading", "kinesthetic"],
    quizFocus: "social determinants, partnerships, strengths-needs assessment, and problem-solving",
  },
  {
    slug: "housing-benefits-deep",
    title: "Module 20 - Housing, Benefits & Oregon Resource Deep Dive",
    shortTitle: "Housing and benefits deep dive",
    description:
      "Practice advanced navigation for housing, benefits, and rural access barriers.",
    estimatedHours: 4,
    oarReferences: ["950-060-0140(2)(m)", "950-060-0140(2)(d)"],
    competencies: ["housing-navigation", "benefits-navigation", "rural-access"],
    hook:
      "Here's the real talk: do not promise housing; promise honest navigation, persistence, and dignity.",
    core:
      "Housing and benefits navigation requires practical knowledge and careful scope. PWS workers can support understanding, applications, warm handoffs, appointment preparation, and follow-up without providing legal representation or guaranteeing outcomes.",
    preservedContent:
      "Deep skills include coordinated entry and 211, shelter and transitional programs, fair housing basics awareness, OHP enrollment support, SSI/SSDI paperwork accompaniment without unauthorized legal advice, and transportation/digital access barriers in rural Oregon.",
    oregonContext:
      "Oregon housing resources vary sharply by county and tribal jurisdiction. Coordinated entry, domestic violence shelters, youth systems, veteran resources, and CCO flexible services may all intersect with peer support.",
    advancedPractice: [
      "Explain coordinated entry and waitlists honestly",
      "Support benefits paperwork while avoiding legal advice",
      "Plan for phone, ID, transportation, and document barriers",
      "Create warm handoffs to housing, benefits, and culturally specific partners",
    ],
    watchPrompt:
      "Listen for overpromising. Strong navigation names what is possible today and what requires follow-up.",
    scenarioTitle: "Scenario: Benefits maze",
    scenarioPrompt:
      "A peer has no ID, missed an OHP notice, and is sleeping in a car outside city limits with limited phone access.",
    choices: [
      { text: "Tell them to fix their paperwork first and come back.", feedback: "This ignores barriers and abandons navigation.", score: 0 },
      { text: "Prioritize immediate safety, list document steps, identify phone/transport options, and make warm handoffs with consent.", feedback: "This is realistic and collaborative.", score: 100 },
      { text: "Guarantee approval if they follow your instructions.", feedback: "Guarantees harm trust and exceed role.", score: 10 },
    ],
    appliedTitle: "Required: housing navigation roleplay",
    appliedPrompt:
      "Complete the 'Newly homeless family' and 'Benefits maze' AI personas. Save your warm handoff plan, scope limits, and what you would document.",
    appliedKind: "roleplay",
    references: [OREGON_211, OREGON_HEALTH_PLAN, HUD_EXCHANGE_COC, ...pwsCoreRefs],
    modes: ["visual", "auditory", "kinesthetic"],
    quizFocus: "housing navigation, benefits support, and Oregon resource mapping",
  },
  {
    slug: "pws-capstone",
    title: "Module 21 - Capstone Practicum & Final Evaluation",
    shortTitle: "PWS capstone",
    description:
      "Integrate 80-hour competencies through practicum evidence and live instructor evaluation.",
    estimatedHours: 6,
    oarReferences: ["950-060-0100", "950-060-0140(1)", "950-060-0140(4)"],
    competencies: ["capstone", "live-evaluation", "practice-readiness"],
    hook:
      "Here's the real talk: the capstone is not a performance; it is evidence that you can practice safely, warmly, and within role.",
    core:
      "The PWS capstone integrates the full 80-hour pathway: PSS foundations plus wellness planning, harm reduction, groups, resilience, advanced MI, whole health, teams, SDOH, housing, benefits, and Oregon resource navigation.",
    preservedContent:
      "To complete PWS, students pass modules and quizzes, complete an expanded AI practice portfolio across listening, crisis routing, MI, harm reduction, housing, and groups, submit documentation portfolio items, attend required live workshops for hybrid tracks, complete final instructor competency evaluation, and receive a certificate of completion for OHA THW application support. Oral health training remains a separate OHA certification requirement for applicants.",
    oregonContext:
      "Capstone evidence should be useful beyond the course: it helps students talk with employers, supervisors, and OHA application processes about what they completed and what they still need.",
    advancedPractice: [
      "Organize portfolio artifacts by competency domain",
      "Use feedback from AI and instructors to show revision",
      "Prepare for observed roleplay and oral competency review",
      "Explain completion, certification application, registry, and role limits",
    ],
    watchPrompt:
      "Review your own practice recordings or feedback artifacts. Look for growth patterns, not perfection theater.",
    scenarioTitle: "Scenario: Final evaluation nerves",
    scenarioPrompt:
      "Before live evaluation, you notice you still rush to fix during housing and crisis scenarios.",
    choices: [
      { text: "Hide the pattern and hope the instructor does not notice.", feedback: "Avoidance blocks growth.", score: 20 },
      { text: "Name the pattern, practice revised responses, and bring a focused question to evaluation prep.", feedback: "This demonstrates reflective competence.", score: 100 },
      { text: "Assume AI feedback already certified you.", feedback: "Human instructors make final completion decisions.", score: 30 },
    ],
    appliedTitle: "Capstone AI portfolio gate",
    appliedPrompt:
      "Ensure your Practice Lab history shows successful sessions across required tags: listening, boundaries, crisis, MI, harm reduction, housing, groups, and whole health. Prepare a portfolio summary for instructor review.",
    appliedKind: "roleplay",
    references: [OHA_THW_REQUIREMENTS, WRAP_INFO, MOTIVATIONAL_INTERVIEWING_NETWORK, ...pwsCoreRefs],
    modes: ["auditory", "kinesthetic", "reflective"],
    quizFocus: "PWS capstone integration and practice readiness",
  },
];

export const PWS_EXTRA_MODULES: ModuleSeed[] = PWS_SPECS.map(buildModule);

const clonedPssModules = PSS_COURSE.modules.map(cloneModule);

export const PWS_COURSE: CourseSeed = {
  slug: "oregon-pws-80",
  type: "PWS",
  title: "Peer Wellness Specialist (PWS) - 80-Hour Academy",
  subtitle: "Expanded OHA-aligned wellness, addiction, and systems training",
  description:
    "An 80-hour Peer Wellness Specialist program building on PSS core competencies with expanded wellness planning, harm reduction, group facilitation, whole health, SDOH, and advanced practice simulations - designed for Oregon OHA Traditional Health Worker approval pathways.",
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
  modules: [...clonedPssModules, ...PWS_EXTRA_MODULES].map((mod) => ({
    ...mod,
    lessons: mod.lessons ?? flattenModuleLessons(mod),
  })),
};
