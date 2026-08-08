import { buildHybridModule, section, type HybridModuleSpec, type SectionQuizSpec } from "./hybrid";
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
import type { CourseSeed } from "./types";

const commonPeerRefs = [
  OHA_THW_RULES,
  OHA_THW_REQUIREMENTS,
  OHA_PEER_DELIVERED_SERVICES,
  SAMHSA_PEER_SUPPORT,
];

function q(
  focus: string,
  safeAction: string,
  unsafeAction: string,
  scopeBoundary: string,
  boundaryMistake: string,
  privacyAction: string,
  privacyMistake: string,
  choiceAction: string,
  choiceMistake: string
): SectionQuizSpec {
  return {
    focus,
    safeAction,
    unsafeAction,
    scopeBoundary,
    boundaryMistake,
    privacyAction,
    privacyMistake,
    choiceAction,
    choiceMistake,
  };
}

function aiReview(
  goals: string[],
  mustCover: string[],
  starterQuestions: string[]
): HybridModuleSpec["aiReview"] {
  return {
    goals,
    mustCover,
    rubric: {
      peerVoice: "Sounds like a real peer conversation: plain, grounded, hopeful, and not preachy.",
      choiceConsent: "Asks permission, offers menus, and lets the peer define what matters.",
      scopeSafety: "Names peer scope clearly and routes safety concerns to policy, 988, crisis teams, or supervision.",
      warmthWithoutRescue: "Shows care without taking over, promising outcomes, or making the peer dependent.",
    },
    starterQuestions,
  };
}

const pssModuleSpecs: HybridModuleSpec[] = [
  {
    slug: "recovery-foundations",
    title: "Recovery Foundations",
    description:
      "Peer support basics: hope, lived experience, recovery choice, role clarity, and the difference between helping and taking over.",
    estimatedHours: 4,
    oarReferences: ["OAR 950-060-0140 peer support foundations", "OAR 410-180 THW role standards"],
    competencies: ["Recovery principles", "Peer role clarity", "Strategic story sharing", "Self-determination"],
    peerNugget:
      "A peer voice does not need fancy language. It needs honesty, humility, and respect for the other person's path.",
    references: [...commonPeerRefs, SAMHSA_RECOVERY],
    sections: [
      section("Recovery Is Personal", {
        description: "Start with the peer's own definition of recovery, not yours.",
        scene:
          "Maya is waiting outside group with her hood up and her jaw tight. Someone just told her, 'You have to want recovery bad enough.' She looks at you and says, 'Recovery for who? Their version or mine?'",
        plainTalk:
          "Recovery is not a poster on the wall. It is the life a person is trying to build, one doable choice at a time. For one person it may include medication, meetings, family repair, housing, faith, culture, art, quiet mornings, or fewer hospital visits. For another person, today’s recovery may simply mean eating, showering, and not giving up.",
        trySaying: [
          "When you say recovery, what does that word mean to you today?",
          "I can share what helped me if you want, but your path does not have to copy mine.",
          "What would make tomorrow a little more livable?",
        ],
        practice:
          "Write a one-sentence recovery definition that leaves room for someone else's culture, body, family, and timeline.",
        commonTrap:
          "The trap is using your success story like a measuring stick. Hope is helpful; pressure dressed up as hope is not.",
        mustKnow:
          "Peers support self-defined recovery. We do not decide what recovery must look like for someone else.",
        quiz: q(
          "a first conversation about recovery",
          "Ask what recovery means to the peer today and reflect their words back.",
          "Explain the recovery path that worked for you and encourage them to follow it closely.",
          "Share lived experience with permission and support the peer's own goals.",
          "Tell the peer which recovery choices are clinically correct.",
          "Keep personal details private unless the peer consents or safety policy requires action.",
          "Tell the team the peer is not serious because their recovery definition is different.",
          "Offer a few possible next steps and ask which one fits.",
          "Choose the next step for them so they do not get overwhelmed."
        ),
      }),
      section("Lived Experience Without Taking Over", {
        description: "Use your story as a flashlight, not a spotlight.",
        scene:
          "Dre says, 'You ever been so anxious you couldn't answer the phone?' You have. A lot. You can feel three stories lining up in your mouth, all true, all intense.",
        plainTalk:
          "Strategic story sharing means your story serves the peer's moment. You share a slice, not the whole movie. You ask permission first. You skip details that could scare, glamorize, or pull attention away from the peer. Then you turn the conversation back: 'Does any part of that connect, or is your situation different?'",
        trySaying: [
          "A small piece of my story might fit here. Want to hear it?",
          "What helped me was one option, not the rule.",
          "I do not want to make this about me. What part of your story feels loud right now?",
        ],
        practice:
          "Pick one recovery story from your life and cut it to three sentences: before, turning point, what helped. Leave out the dramatic extra.",
        commonTrap:
          "The trap is bonding through too much detail. It can feel close in the moment and still leave the peer holding your pain.",
        mustKnow:
          "Lived experience is a tool. Consent, purpose, and timing decide whether it helps.",
        quiz: q(
          "sharing lived experience",
          "Ask permission, share a brief relevant piece, and return attention to the peer.",
          "Share the full story so the peer knows you really understand.",
          "Use lived experience for hope and connection, not diagnosis or advice-giving.",
          "Compare symptoms and tell the peer what condition they probably have.",
          "Avoid names and details that identify other people unless there is clear consent and policy support.",
          "Repeat a peer's story in group because it teaches a good lesson.",
          "Ask whether the story fits and let the peer decide what to use.",
          "Keep talking until the peer agrees your lesson applies."
        ),
      }),
      section("Hope With Honest Limits", {
        description: "Be hopeful without promising what you cannot control.",
        scene:
          "A peer gets denied housing again and says, 'So what, I’m just stuck forever?' Your heart wants to say, 'No, I promise we’ll fix this.' But you do not control the waitlist.",
        plainTalk:
          "Hope is not a guarantee. Real hope tells the truth and still leaves room for movement. A peer can say, 'This is unfair and exhausting,' while also helping look for the next phone call, appeal, warm handoff, or rest break. Honest hope builds trust because it does not sell magic.",
        trySaying: [
          "I cannot promise the outcome, but I can stay with you while we look at options.",
          "This denial is real. It is not the end of your story.",
          "Do you want problem-solving, a minute to breathe, or both?",
        ],
        practice:
          "Practice replacing 'I promise' with 'I can' statements. Write three things you truly can do in your role.",
        commonTrap:
          "The trap is rescuing with big promises because disappointment feels awful. Broken promises hurt trust more than a kind limit.",
        mustKnow:
          "Peers can offer support, navigation, and hope. We cannot guarantee housing, treatment, benefits, or safety outcomes.",
        quiz: q(
          "offering hope after a setback",
          "Validate the setback, name what you can do, and look at options with consent.",
          "Promise the peer you will get the outcome fixed so they do not lose hope.",
          "Provide peer support and navigation without guaranteeing system decisions.",
          "Tell the peer a denial means they are not ready for recovery.",
          "Document and share only what your role and policy allow, especially if safety concerns come up.",
          "Post about the unfair denial online without names because advocacy matters.",
          "Ask what kind of support they want before jumping into problem-solving.",
          "Insist on problem-solving immediately because sitting with feelings wastes time."
        ),
      }),
      section("Peer Scope in Plain English", {
        description: "Know what peers do, what peers do not do, and when to ask for backup.",
        scene:
          "At the end of a check-in, Lena asks, 'Do you think I’m bipolar? My sister says I am.' You care about her and you have your own experience with mood swings. This is where scope protects both of you.",
        plainTalk:
          "Scope means the lane you are trained and allowed to drive in. A Peer Support Specialist can listen, share lived experience, support goals, help navigate resources, practice questions, advocate with consent, and connect to support. A peer does not diagnose, prescribe, provide therapy, make legal decisions, or replace emergency help.",
        trySaying: [
          "I cannot diagnose, but I can help you write down what you are noticing for a provider.",
          "That sounds scary. Do you want support thinking about who could help assess it?",
          "My role is peer support. If safety is immediate, we need to use the crisis plan now.",
        ],
        practice:
          "Make two columns: 'peer lane' and 'not peer lane.' Put five real requests you might hear into the columns.",
        commonTrap:
          "The trap is answering outside scope because you want to be useful. Clear role language is useful.",
        mustKnow:
          "Oregon peer work is non-clinical. Recognize, relate, support, and route; do not diagnose or prescribe.",
        quiz: q(
          "a peer asking for a diagnosis",
          "Say you cannot diagnose and offer to help prepare questions for a qualified provider.",
          "Give your best guess because the peer asked directly and trusts you.",
          "Stay in the peer lane: support, story with consent, navigation, advocacy, and warm handoffs.",
          "Recommend a medication change based on what helped you.",
          "Follow privacy rules and safety policy when helping prepare information for another provider.",
          "Text the provider details without the peer knowing because it might help.",
          "Offer choices: write questions, call a clinic together, or sit with the worry for a few minutes.",
          "Tell them the only responsible choice is the one you would choose."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Explain recovery as self-defined and hopeful.",
        "Use lived experience with consent and purpose.",
        "Name peer scope in plain language.",
        "Offer hope without promising outcomes.",
      ],
      [
        "No diagnosing, prescribing, or therapy claims.",
        "Peer choice leads the plan.",
        "Strategic story sharing must be brief and consent-based.",
        "AI practice is recorded but does not certify anyone.",
      ],
      [
        "Tell me what peer support is in your own words.",
        "How would you respond if someone asks for a diagnosis?",
        "Give me a three-sentence story share that keeps focus on the peer.",
        "What is one promise a peer should not make?",
        "How do you keep hope real when systems disappoint people?",
      ]
    ),
  },
  {
    slug: "communication",
    title: "Communication That Feels Human",
    description:
      "Listening, reflecting, asking useful questions, repairing ruptures, and saying the thing in a way a real person can hear.",
    estimatedHours: 4,
    oarReferences: ["OAR 950-060-0140 communication skills", "OAR 410-180 THW engagement standards"],
    competencies: ["Active listening", "Reflection", "Plain language", "Repair"],
    peerNugget:
      "Good communication is not a performance. It is a steady way of saying, 'I am here, and you still get to be you.'",
    references: [...commonPeerRefs],
    sections: [
      section("Listening Before Fixing", {
        description: "Hear the person before reaching for solutions.",
        scene:
          "Sam walks in saying, 'Nobody listens. They just hand me pamphlets.' You can already think of three resources, but his face says the pamphlet pile is part of the problem.",
        plainTalk:
          "Listening is active work. It means you track the words, the feeling, the pace, and what the person is not ready to say yet. You do not have to agree with every detail to respect the experience. Often the most useful first response is a simple reflection that proves you heard the heart of it.",
        trySaying: [
          "You have had a lot of people talk at you, and you want someone to actually hear you.",
          "Before I offer ideas, what do you need me to understand?",
          "Do you want me to listen, help sort options, or both?",
        ],
        practice:
          "Listen to a friend or podcast for two minutes and write only reflections, not advice.",
        commonTrap:
          "The trap is treating silence like a hole you must fill. Sometimes silence is the peer deciding whether you are safe.",
        mustKnow:
          "Listening first protects choice and reduces the chance that support becomes advice-dumping.",
        quiz: q(
          "a peer who feels unheard",
          "Reflect the feeling and ask what they need before offering resources.",
          "Give three resources quickly so the meeting feels productive.",
          "Use listening, reflection, and support without acting as a therapist.",
          "Interpret the peer's behavior as a clinical symptom and explain it.",
          "Keep what they share private unless consent or safety policy says otherwise.",
          "Repeat their frustration to staff right away without asking because staff should know.",
          "Ask whether they want listening, options, or both.",
          "Decide they need resources first because feelings can wait."
        ),
      }),
      section("Questions That Open Doors", {
        description: "Ask questions that invite choice instead of cornering someone.",
        scene:
          "A peer missed an appointment and expects a lecture. The old question is, 'Why didn't you go?' The better question might change the whole room.",
        plainTalk:
          "Open questions make space. Closed questions have a place, especially for safety and concrete planning, but too many can feel like an interrogation. A good peer question is short, curious, and connected to what the person cares about.",
        trySaying: [
          "What got in the way that day?",
          "What would make the next appointment easier to get to?",
          "Would it help to practice the call, plan transportation, or leave it alone for today?",
        ],
        practice:
          "Rewrite three 'why didn't you' questions into 'what got in the way' questions.",
        commonTrap:
          "The trap is asking questions you already know the answer to because you want the peer to admit your point.",
        mustKnow:
          "Questions should support self-discovery and planning, not shame or control.",
        quiz: q(
          "asking about a missed appointment",
          "Ask what got in the way and what support would help next time.",
          "Ask why they keep sabotaging themselves so they face reality.",
          "Use questions for peer support and planning, not clinical assessment outside your role.",
          "Decide the missed appointment proves a diagnosis or lack of motivation.",
          "Only share appointment details with consent or according to program policy.",
          "Tell the clinic the peer is noncompliant before talking with the peer.",
          "Offer choices like practicing a call, planning a ride, or pausing the topic.",
          "Pick the solution because missing appointments affects the whole team."
        ),
      }),
      section("Plain Language, Not System Soup", {
        description: "Translate acronyms and paperwork without talking down.",
        scene:
          "A benefits letter says the peer must contact a CCO. They stare at it and say, 'I don't even know what language this is.'",
        plainTalk:
          "Acronyms can make smart people feel small. CCO means coordinated care organization: the local health plan group that helps manage Oregon Health Plan services. Say the long version once, then say what it does in everyday words. Translation is advocacy.",
        trySaying: [
          "That letter is written in system language. Let's turn it into human language.",
          "A CCO is the group connected to your Oregon Health Plan. They can help with covered services.",
          "Want to highlight the action step and the deadline together?",
        ],
        practice:
          "Choose one confusing system word and write a one-sentence plain-language translation.",
        commonTrap:
          "The trap is using acronyms to sound professional. Peers earn trust by making the room less confusing.",
        mustKnow:
          "Explain necessary acronyms once in plain English and check understanding without shaming.",
        quiz: q(
          "explaining a confusing benefits letter",
          "Translate the acronym once, explain the action step, and ask if they want help planning.",
          "Read the letter faster because the peer needs to learn system terms.",
          "Help with navigation and plain-language translation without giving legal advice.",
          "Tell the peer the letter is legally invalid because it seems confusing.",
          "Handle private benefit details only with the peer's consent and program policy.",
          "Email the letter to another agency before asking because deadlines matter.",
          "Ask whether they want to highlight deadlines, make a call, or come back later.",
          "Take the paperwork home and fix it for them without involving them."
        ),
      }),
      section("Repairing When You Miss", {
        description: "Own impact quickly when your words land wrong.",
        scene:
          "You say, 'At least you're housed now,' and the peer's face closes. You meant encouragement. They heard, 'Stop complaining.'",
        plainTalk:
          "Every peer will miss sometimes. Repair is not a speech about your good intentions. It is a short, honest return to respect. Notice the shift, name it without drama, apologize if needed, and ask how to continue.",
        trySaying: [
          "I think that landed wrong. I am sorry. I do not want to minimize what you are carrying.",
          "Let me try again: housed and safe are not the same thing.",
          "Do you want to keep talking, pause, or switch topics?",
        ],
        practice:
          "Write a repair sentence that does not include the word 'but.'",
        commonTrap:
          "The trap is defending your intent until the peer has to take care of your feelings.",
        mustKnow:
          "Repair protects trust. Impact matters even when intent was kind.",
        quiz: q(
          "a comment that hurt a peer",
          "Acknowledge the impact, apologize plainly, and ask how they want to continue.",
          "Explain your good intention until they understand you meant well.",
          "Repair the relationship while staying in peer support, not therapy.",
          "Analyze why the peer reacted that way and label it for them.",
          "Do not share the rupture outside the support team unless consent or policy requires it.",
          "Tell other peers about the reaction so they know what topics to avoid.",
          "Offer choices to continue, pause, or switch topics.",
          "Push through because stopping would make the mistake bigger."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Reflect feelings and meaning before solving.",
        "Ask open questions that reduce shame.",
        "Translate system language into plain words.",
        "Repair communication misses with humility.",
      ],
      [
        "No interrogation or pressure questions.",
        "Explain acronyms in everyday language.",
        "Privacy still applies during team communication.",
        "Repair focuses on impact, not defending intent.",
      ],
      [
        "Show me a reflection for someone who feels ignored.",
        "Turn a blaming question into an open question.",
        "How would you explain a CCO in plain language?",
        "What would you say after a comment lands badly?",
        "How do you know when to stop giving information and listen?",
      ]
    ),
  },
  {
    slug: "boundaries-ethics",
    title: "Boundaries and Ethics",
    description:
      "Kind limits, dual relationships, confidentiality, ethical choices, and staying trustworthy under real-world pressure.",
    estimatedHours: 4,
    oarReferences: ["OAR 950-060-0140 ethics and boundaries", "OAR 410-180 THW standards"],
    competencies: ["Ethical decision-making", "Confidentiality", "Boundaries", "Supervision use"],
    peerNugget:
      "A boundary is not a wall. It is a handrail that keeps the relationship safe enough to keep going.",
    references: [...commonPeerRefs, HHS_HIPAA],
    sections: [
      section("Warm Boundaries", {
        description: "Set limits without sounding cold or superior.",
        scene:
          "A peer asks for your personal number because weekends are hard. You know the ache of weekends. You also know your program has an on-call line for a reason.",
        plainTalk:
          "Warm boundaries tell the truth with care. They protect the peer from depending on one worker, and they protect you from becoming the whole safety plan. The tone matters: not 'I can't deal with you,' but 'I want support to be reliable and safe.'",
        trySaying: [
          "I do not use my personal phone for work, and I do want you supported this weekend.",
          "Let's put the on-call number and two other supports in your plan.",
          "I care about this. The boundary helps me show up consistently.",
        ],
        practice:
          "Practice one boundary sentence with a warm opening and a clear limit.",
        commonTrap:
          "The trap is making exceptions because the peer is struggling. Exceptions can quietly become promises you cannot keep.",
        mustKnow:
          "Boundaries protect trust, safety, and consistency. They are part of care.",
        quiz: q(
          "a request for your personal phone number",
          "Kindly decline, explain the work boundary, and help identify approved supports.",
          "Give the number just this once because weekends are hard.",
          "Provide peer support within program policy and use approved contact channels.",
          "Become the peer's personal crisis contact outside the program.",
          "Keep contact information and support plans private according to policy.",
          "Share the peer's weekend fears with a friend so someone else knows.",
          "Offer choices from approved supports and ask what feels usable.",
          "Tell them the boundary means they need to stop reaching out."
        ),
      }),
      section("Confidentiality in Real Life", {
        description: "Understand privacy, consent, and safety limits in plain language.",
        scene:
          "At the grocery store, someone says loudly, 'Hey, aren't you working with my cousin at that recovery place?' People are listening.",
        plainTalk:
          "Confidentiality means people control their story as much as the law and safety allow. HIPAA is a federal privacy law for health information; in plain English, it means protected information cannot be casually shared. Your employer will teach local rules, releases of information, and exceptions.",
        trySaying: [
          "Good to see you. I keep work private, so I cannot talk about who I may know from there.",
          "If your cousin wants support, they can contact the program directly.",
          "Let's talk somewhere private if you have a general resource question.",
        ],
        practice:
          "Write a grocery-store privacy response you could say without sounding robotic.",
        commonTrap:
          "The trap is confirming a connection because the person already seems to know. Confirmation is still sharing.",
        mustKnow:
          "Do not confirm, deny, or discuss someone's participation unless consent, role, and policy allow it.",
        quiz: q(
          "a public question about another participant",
          "Protect privacy and avoid confirming whether you know or work with that person.",
          "Confirm only if the person asking is family.",
          "Follow privacy law and employer policy while staying warm.",
          "Share basic participation details because no diagnosis is mentioned.",
          "Use releases and safety exceptions exactly as policy requires.",
          "Text a coworker the story with names because it happened off site.",
          "Offer a general way to contact the program without discussing the person.",
          "Answer quickly in public so the question does not become awkward."
        ),
      }),
      section("Dual Relationships and Small Towns", {
        description: "Navigate overlap when community life is connected.",
        scene:
          "You walk into a birthday party and see a peer from your program helping with the cake. They look as surprised as you feel.",
        plainTalk:
          "Dual relationships happen when the peer relationship overlaps with another role: neighbor, cousin's friend, meeting member, volunteer, social media contact, or community elder. Overlap is not always wrong, especially in small towns and cultural communities. The ethical move is transparency, supervision, and choice.",
        trySaying: [
          "Looks like our worlds overlap here. I will follow your lead about saying hello in public.",
          "We can talk with my supervisor about how to keep support comfortable and private.",
          "If this feels too close, we can look at another peer option.",
        ],
        practice:
          "Name three places your community roles might overlap and what you would bring to supervision.",
        commonTrap:
          "The trap is pretending overlap does not matter because nobody means harm. Unspoken overlap can pressure the peer.",
        mustKnow:
          "Dual relationships require transparency, supervision, and attention to the peer's choice and privacy.",
        quiz: q(
          "running into a peer in community",
          "Let the peer lead public contact and consult supervision about the overlap.",
          "Act like close friends so nobody feels awkward.",
          "Use supervision and program policy to manage overlap without abandoning peer support.",
          "Make private arrangements that the program does not know about.",
          "Do not reveal the peer's program connection in public.",
          "Post a party photo tagging the peer because the event was not work.",
          "Offer options if the overlap changes their comfort with services.",
          "Tell them they must keep working with you because rural communities are small."
        ),
      }),
      section("Ethical Gut Checks", {
        description: "Use supervision before a messy choice becomes a messy secret.",
        scene:
          "A peer offers you handmade jewelry as thanks. It is beautiful, and refusing feels rude. You are not sure what the policy says.",
        plainTalk:
          "Ethics is not only the huge dramatic stuff. It is the little moments where power, gratitude, money, privacy, attraction, culture, and pressure mix together. A gut check is a pause: What is the policy? What could this mean to the peer? What would I write in a note? What would I bring to supervision?",
        trySaying: [
          "This means a lot. I need to check our gift policy so I handle it respectfully.",
          "Your thanks matters to me. I want to keep our support clear and fair.",
          "Can we talk about another way to mark this win?",
        ],
        practice:
          "Create a four-question ethics pause card for your future desk or backpack.",
        commonTrap:
          "The trap is hiding small things because they seem too awkward to ask about. Hidden awkward things grow teeth.",
        mustKnow:
          "When unsure, pause, follow policy, document as required, and use supervision.",
        quiz: q(
          "an uncertain gift or favor",
          "Thank them, pause, check policy, and use supervision before accepting.",
          "Accept quietly because refusing might harm rapport.",
          "Use policy, documentation, and supervision to keep the peer relationship ethical.",
          "Trade gifts or favors for extra support time.",
          "Discuss the situation only with people who have a work need to know.",
          "Ask another peer what they think using the person's name.",
          "Offer another way to celebrate the win if the gift is not allowed.",
          "Decide for the peer that a boundary would hurt their feelings too much."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Set warm, clear boundaries.",
        "Explain confidentiality and safety limits plainly.",
        "Handle dual relationships with supervision.",
        "Use ethical pauses before acting.",
      ],
      [
        "No casual sharing of peer information.",
        "Use approved contact channels.",
        "Dual relationships are named and supervised.",
        "Policy and supervision are strengths, not punishments.",
      ],
      [
        "How would you set a phone boundary warmly?",
        "What would you say if someone asks about a peer in public?",
        "What makes dual relationships tricky in small communities?",
        "Walk me through an ethics gut check.",
        "How can a boundary show care?",
      ]
    ),
  },
  {
    slug: "trauma-informed",
    title: "Trauma-Informed Peer Support",
    description:
      "Safety, choice, collaboration, cultural humility, and practical support for nervous systems under stress.",
    estimatedHours: 4,
    oarReferences: ["OAR 950-060-0140 trauma-informed care", "OAR 410-180 THW standards"],
    competencies: ["Trauma-informed practice", "Choice", "Grounding", "Cultural humility"],
    peerNugget:
      "Trauma-informed support asks, 'What helps safety show up here?' instead of 'What is wrong with you?'",
    references: [...commonPeerRefs, SAMHSA_TRAUMA],
    sections: [
      section("Safety Is More Than No Danger", {
        description: "Notice emotional, cultural, physical, and relational safety.",
        scene:
          "The room is technically safe, but the peer keeps looking at the door. The chair blocks their exit, the lights buzz, and every question sounds like an intake.",
        plainTalk:
          "Safety is felt in the body before it is explained in words. A trauma-informed peer does not demand trust. You offer choices that let the person regain a little control: where to sit, whether the door stays open, whether to take a break, whether to write instead of talk.",
        trySaying: [
          "Where would you like to sit so this feels a little easier?",
          "We can pause, step outside, or keep going slowly.",
          "You do not have to tell the whole story for me to support you.",
        ],
        practice:
          "Look at a meeting space and list five small choices that could increase safety.",
        commonTrap:
          "The trap is assuming safety because the program says it is safe. The peer's body may have different information.",
        mustKnow:
          "Trauma-informed practice offers choice, predictability, and respect for the person's pace.",
        quiz: q(
          "a peer scanning the room and seeming tense",
          "Offer choices about seating, pace, and breaks without demanding details.",
          "Ask for the trauma story so you know how to help.",
          "Support felt safety without providing trauma therapy.",
          "Interpret their body language as a diagnosis.",
          "Protect privacy and avoid asking for unnecessary trauma details.",
          "Share the story with staff who are curious but not involved.",
          "Let the peer choose whether to pause, move, write, or continue.",
          "Tell them the room is safe and they need to relax."
        ),
      }),
      section("Triggers, Glimmers, and Grounding", {
        description: "Help people notice stress signals and return to the present.",
        scene:
          "A door slams in the hallway. The peer freezes, then laughs it off: 'I'm fine.' Their hands are shaking.",
        plainTalk:
          "A trigger is something that cues danger in the nervous system. A glimmer is the opposite: a small cue of safety, connection, or relief. Grounding helps someone orient to now. You are not doing therapy; you are offering simple, consent-based support in the moment.",
        trySaying: [
          "That sound hit hard. Want to take a second and notice the room with me?",
          "Would cold water, feet on the floor, or stepping outside help?",
          "What is one small thing here that tells your body this is today?",
        ],
        practice:
          "Try three grounding options yourself and notice which one feels respectful, not cheesy.",
        commonTrap:
          "The trap is forcing a grounding tool because it worked for you. Choice matters even with coping skills.",
        mustKnow:
          "Grounding is offered with consent and kept simple; crisis or clinical needs are routed to appropriate help.",
        quiz: q(
          "a peer startled by a loud sound",
          "Name what you noticed gently and offer simple grounding choices.",
          "Insist they use your favorite breathing exercise until calm.",
          "Offer peer-level grounding and route clinical or crisis needs appropriately.",
          "Process the trauma memory in detail to reduce the trigger.",
          "Share only what is needed for safety or support according to policy.",
          "Tell nearby people exactly why the peer reacted.",
          "Offer options like water, feet on floor, stepping out, or stopping.",
          "Decide grounding is required before the peer can leave."
        ),
      }),
      section("Power, Choice, and Collaboration", {
        description: "Reduce the power-over feeling that systems often create.",
        scene:
          "A peer says, 'If I say no, will it go in my chart?' That question is about more than paperwork. It is about power.",
        plainTalk:
          "Trauma often teaches people that saying no is dangerous. Systems can accidentally repeat that lesson. Peer support interrupts it by being clear: what is optional, what is required, what gets documented, and what choices the person still has.",
        trySaying: [
          "You can say no to this conversation. I can explain what I do and do not document.",
          "Here is what is required today, and here is where you still have choices.",
          "Would you like to decide the order we tackle these two things?",
        ],
        practice:
          "Take a common program requirement and write a choice-centered explanation of it.",
        commonTrap:
          "The trap is hiding requirements to seem nice. Surprise rules do not build trust.",
        mustKnow:
          "Choice includes honest information about limits, requirements, documentation, and safety exceptions.",
        quiz: q(
          "a peer worried that saying no will be punished",
          "Explain what is optional, what is required, and what documentation means.",
          "Say everything is optional even when the program has requirements.",
          "Clarify peer support and documentation limits without legal or clinical advice.",
          "Threaten discharge to encourage cooperation.",
          "Be transparent about what information is recorded and who can see it.",
          "Hide documentation details because they might make the peer anxious.",
          "Offer choices about order, pace, and how to participate where possible.",
          "Remove choices because requirements are already stressful."
        ),
      }),
      section("Trauma-Informed Is Also Culture-Informed", {
        description: "Respect that safety, healing, family, and authority mean different things across cultures.",
        scene:
          "You suggest a grounding exercise and the peer says, 'That is not how my family handles things.' This is not resistance. It is information.",
        plainTalk:
          "Culture shapes what feels respectful, what feels private, who gets included, how eye contact lands, and what healing looks like. Trauma-informed peer support does not make one coping style the standard. It asks, learns, and makes room.",
        trySaying: [
          "What does support usually look like in your family or community?",
          "Is there anyone you want included, or anyone you do not want involved?",
          "That tool may not fit. What has helped in your world?",
        ],
        practice:
          "Write two questions that invite culture without asking the peer to teach a whole class.",
        commonTrap:
          "The trap is calling something 'avoidance' when it may be privacy, culture, faith, disability access, or survival wisdom.",
        mustKnow:
          "Trauma-informed support honors culture and avoids forcing one definition of healing.",
        quiz: q(
          "a coping tool that does not fit the peer's culture",
          "Ask what support looks like in their world and adapt with consent.",
          "Explain that evidence-based tools work the same for everyone.",
          "Offer peer support that respects culture without claiming clinical expertise.",
          "Decide their cultural response is a symptom that needs correction.",
          "Ask consent before involving family, community, or spiritual supports.",
          "Call family members because culture probably values family involvement.",
          "Offer choices and let the peer decide what fits.",
          "Require the standard tool so everyone gets equal service."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Describe trauma-informed support in plain language.",
        "Offer grounding and safety choices with consent.",
        "Explain power, documentation, and requirements honestly.",
        "Connect trauma-informed practice with culture and humility.",
      ],
      [
        "Do not ask for trauma details you do not need.",
        "Grounding is optional and consent-based.",
        "Safety concerns route to policy and qualified help.",
        "Culture shapes what support feels safe.",
      ],
      [
        "How would you make a meeting room feel safer?",
        "What is a grounding choice you could offer without forcing it?",
        "How do you explain required documentation honestly?",
        "What would you do if your coping idea does not fit someone's culture?",
        "What does trauma-informed peer voice sound like?",
      ]
    ),
  },
  {
    slug: "crisis-safety",
    title: "Crisis and Safety",
    description:
      "Recognize warning signs, relate without panic, route to the right help, and keep peer scope clear during hard moments.",
    estimatedHours: 4,
    oarReferences: ["OAR 950-060-0140 crisis support", "OAR 410-180 THW standards"],
    competencies: ["Crisis recognition", "Safety planning", "Warm handoffs", "Scope under pressure"],
    peerNugget:
      "Crisis work for peers is recognize, relate, and route. We stay human while using the safety plan.",
    references: [...commonPeerRefs, LIFELINE_988, LINES_FOR_LIFE],
    sections: [
      section("Recognize When Safety Is in the Room", {
        description: "Notice warning signs without turning every hard feeling into a crisis.",
        scene:
          "A peer says, 'I am done. I cannot do this again.' They stare at the floor. You feel your stomach drop.",
        plainTalk:
          "Peers do not diagnose crisis. We recognize possible danger and respond according to training and employer policy. Hard feelings deserve care; immediate danger needs routing. The skill is staying calm enough to ask direct, respectful questions and bring in the right support.",
        trySaying: [
          "When you say you are done, are you thinking about killing yourself today?",
          "Thank you for telling me. I am going to stay with you and use our safety steps.",
          "We do not have to handle this alone.",
        ],
        practice:
          "Say the direct safety question out loud until it sounds caring, not dramatic.",
        commonTrap:
          "The trap is avoiding direct questions because you fear putting the idea in someone's head. Clear questions can create safety.",
        mustKnow:
          "Ask direct safety questions when warning signs appear and follow employer crisis protocol.",
        quiz: q(
          "a peer saying they are done",
          "Ask a direct safety question calmly and follow the crisis protocol.",
          "Avoid the suicide question because it might make things worse.",
          "Recognize possible crisis and route to trained crisis support; do not provide clinical assessment.",
          "Decide whether they are serious based on your gut alone.",
          "Share information needed for immediate safety according to policy.",
          "Keep everything secret even if there is immediate danger.",
          "Explain the safety steps and involve the peer as much as possible.",
          "Take control without telling the peer what is happening."
        ),
      }),
      section("Relate Without Panicking", {
        description: "Stay connected while safety steps are moving.",
        scene:
          "While waiting for crisis support, the peer says, 'Now you think I’m crazy too.' Your face, voice, and words matter.",
        plainTalk:
          "Relating in crisis is not a motivational speech. It is grounded presence. You can validate pain, reduce shame, and keep the next step visible. You also avoid making the crisis about your fear, your story, or your need to fix it.",
        trySaying: [
          "I do not think you are crazy. I think you are in a lot of pain and deserve support.",
          "I am here with you while we get the next right help involved.",
          "Would it help to sit quietly, get water, or call your support person with consent?",
        ],
        practice:
          "Practice a calm crisis voice: slower than usual, warm, and honest.",
        commonTrap:
          "The trap is over-sharing your own crisis story to prove you understand. In crisis, keep the spotlight on safety.",
        mustKnow:
          "Connection reduces shame, but safety protocol still moves forward.",
        quiz: q(
          "waiting for crisis support",
          "Validate the pain, reduce shame, and keep safety steps clear.",
          "Tell a detailed story about your own crisis so they feel less alone.",
          "Stay in peer support while crisis professionals or protocol handle assessment and intervention.",
          "Promise there will be no consequences if they stay calm.",
          "Share only what is needed for safety and continuity of care.",
          "Update friends or family without consent unless policy requires it for safety.",
          "Offer small choices like water, quiet, support person, or where to sit.",
          "Remove all choices because crisis means the peer has no voice."
        ),
      }),
      section("Warm Handoffs and 988", {
        description: "Route to crisis supports without dropping the person emotionally.",
        scene:
          "The plan says to call 988, the Suicide and Crisis Lifeline. The peer says, 'I hate hotlines. They never get me.'",
        plainTalk:
          "A warm handoff means you do not toss a number and disappear. With consent and policy, you can sit with someone while they call, help explain what to expect, or connect to a local crisis option. 988 is a national call, text, and chat line for suicide and crisis support; your employer may also have local steps.",
        trySaying: [
          "988 is one option. We can call together, text, or use the program crisis plan.",
          "I can stay with you while we connect, within our policy.",
          "What would make this handoff feel less awful?",
        ],
        practice:
          "Write a 30-second plain-language explanation of 988 and your local crisis protocol placeholder.",
        commonTrap:
          "The trap is treating a referral like the end of your responsibility. The handoff should feel like a bridge, not a shove.",
        mustKnow:
          "Use 988 and local crisis resources according to employer policy; AI roleplay is never real crisis support.",
        quiz: q(
          "connecting someone to 988 or local crisis support",
          "Explain options and make a warm handoff according to policy.",
          "Hand them a number and leave because crisis is no longer peer work.",
          "Route crisis support to trained resources while staying in a peer support role.",
          "Act as the crisis clinician if the peer trusts you more.",
          "Share safety information allowed or required by policy during the handoff.",
          "Promise the hotline the peer will do whatever they recommend.",
          "Ask whether calling, texting, local crisis, or a support person feels possible.",
          "Choose the route without explaining because faster is always safer."
        ),
      }),
      section("After the Crisis Moment", {
        description: "Debrief, document, and care for yourself after hard safety work.",
        scene:
          "The immediate danger has passed. Your hands are shaky now. The peer is embarrassed. Staff are asking what happened.",
        plainTalk:
          "After a crisis, the work is not over. The peer may need reassurance that they are not in trouble for telling the truth. The team may need clear, factual documentation. You may need supervision, grounding, and support. Strong peers do not pretend crisis work leaves no mark.",
        trySaying: [
          "I am glad you told me. You did not do anything wrong by asking for help.",
          "I need to document the safety steps we used, and I can explain what that means.",
          "I am going to debrief with my supervisor so I keep showing up well.",
        ],
        practice:
          "Write a factual three-line crisis note: concern stated, safety steps used, handoff completed.",
        commonTrap:
          "The trap is processing your adrenaline with the peer. Use supervision for your feelings so the peer does not have to carry them.",
        mustKnow:
          "Document factual safety actions and debrief with supervision; do not make AI practice or peer support a substitute for real protocols.",
        quiz: q(
          "the time after a crisis handoff",
          "Reassure the peer, document facts, and debrief with supervision.",
          "Avoid documentation because the peer might feel judged.",
          "Document peer observations and actions within policy, not clinical conclusions.",
          "Write a diagnosis to justify why crisis steps were used.",
          "Share safety information only with those allowed or required by policy.",
          "Tell another peer the story to release stress.",
          "Explain what documentation means and invite the peer's questions when appropriate.",
          "Skip debriefing because strong peers should be unaffected."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Ask direct safety questions when needed.",
        "Stay connected while following crisis protocol.",
        "Explain warm handoffs, including 988, in plain language.",
        "Document and debrief after safety events.",
      ],
      [
        "Crisis equals recognize, relate, route.",
        "No peer diagnosis or clinical risk assessment.",
        "Use employer policy and real crisis resources.",
        "AI practice is not emergency support.",
      ],
      [
        "How would you ask a direct suicide safety question?",
        "What do you say while waiting for crisis support?",
        "Explain 988 to someone who distrusts hotlines.",
        "What belongs in a factual crisis note?",
        "How do you care for yourself without making the peer care for you?",
      ]
    ),
  },
  {
    slug: "culture-advocacy",
    title: "Culture and Advocacy",
    description:
      "Cultural humility, identity safety, respectful advocacy, language access, and challenging systems without speaking over peers.",
    estimatedHours: 3,
    oarReferences: ["OAR 950-060-0140 culturally responsive services", "OAR 410-180 THW standards"],
    competencies: ["Cultural humility", "Advocacy", "Language access", "Anti-stigma practice"],
    peerNugget:
      "Advocacy is not grabbing the microphone. It is helping the peer's voice carry farther.",
    references: [...commonPeerRefs, OREGON_211],
    sections: [
      section("Culture Is Not a Checklist", {
        description: "Approach identity with humility and curiosity.",
        scene:
          "A peer says, 'People keep asking about my culture like it is a worksheet.' They are tired before the conversation starts.",
        plainTalk:
          "Culture can include race, tribe, language, faith, disability, gender, sexuality, family roles, recovery community, immigration story, rural identity, class, and more. Cultural humility means you do not assume you know the meaning of any of it. You ask what matters here, today, for this person.",
        trySaying: [
          "What parts of your identity should I keep in mind so support feels respectful?",
          "I do not want to assume. What should I know about what matters to you?",
          "If I miss something, I want you to be able to tell me.",
        ],
        practice:
          "Write one curiosity question that is respectful and one that asks someone to educate you too much.",
        commonTrap:
          "The trap is treating culture as a fact sheet instead of a living relationship.",
        mustKnow:
          "Cultural humility means asking, listening, repairing, and adapting without stereotyping.",
        quiz: q(
          "asking about identity and culture",
          "Ask what matters to the peer and avoid assumptions.",
          "Use a cultural checklist so you do not miss anything.",
          "Offer culturally responsive peer support without claiming expertise in the peer's identity.",
          "Explain what their culture probably means based on a training you took.",
          "Keep identity information private unless consent or safety policy applies.",
          "Share identity details with the team because culture is relevant to everyone.",
          "Invite the peer to name what respectful support looks like.",
          "Assume people from the same group want the same support."
        ),
      }),
      section("Language Access Is Respect", {
        description: "Use interpreters and accessible communication instead of winging it.",
        scene:
          "A peer's auntie is translating during a housing call. The peer looks uncomfortable, but everyone is moving fast.",
        plainTalk:
          "Language access is not a favor. It is part of meaningful choice. Family interpreters can be helpful in some moments, but they can also create pressure or privacy problems. Use qualified interpreters and accessible formats according to policy whenever important decisions, rights, safety, or benefits are involved.",
        trySaying: [
          "Would you like a trained interpreter for this call?",
          "You deserve to get this information in the language and format that works for you.",
          "Family can support you, but they do not have to carry private translation if you do not want that.",
        ],
        practice:
          "Find where your program keeps interpreter access steps and write them in plain language.",
        commonTrap:
          "The trap is using whoever is nearby to translate because it seems faster. Fast can become unfair.",
        mustKnow:
          "Offer language access and accessible formats, especially for rights, benefits, health, safety, and consent.",
        quiz: q(
          "a family member translating a benefits call",
          "Offer a qualified interpreter and ask what the peer wants.",
          "Continue with the family interpreter because they already started.",
          "Support access and advocacy without giving legal advice about benefits.",
          "Tell the agency the family interpreter is legally required.",
          "Protect privacy by using consent and appropriate interpreter processes.",
          "Discuss private details through family because they care.",
          "Let the peer choose family support, trained interpreter, or another accessible format when possible.",
          "Decide language access is too slow for urgent paperwork."
        ),
      }),
      section("Advocacy With, Not Over", {
        description: "Help systems hear the peer without taking their voice.",
        scene:
          "At a team meeting, the peer starts to explain what they need. A provider interrupts. Everyone looks at you because you are the peer worker.",
        plainTalk:
          "Advocacy can be quiet and powerful. Sometimes it is asking, 'Can we let Jordan finish?' Sometimes it is helping the peer prepare notes before the meeting. Sometimes it is asking permission before you add context. The goal is not to be the hero. The goal is more room for the peer's own voice.",
        trySaying: [
          "Jordan, do you want to finish your thought?",
          "Would it help if I shared what we practiced, or do you want to say it?",
          "Can we pause and make sure the plan matches what Jordan asked for?",
        ],
        practice:
          "Write one advocacy sentence for before, during, and after a meeting.",
        commonTrap:
          "The trap is speaking beautifully about the peer while the peer sits silent.",
        mustKnow:
          "Advocacy should be consent-based and strengthen the peer's voice, not replace it.",
        quiz: q(
          "a peer being interrupted in a meeting",
          "Invite the peer to continue and ask permission before adding your voice.",
          "Take over the explanation because you can make the point clearly.",
          "Advocate with consent while staying in the peer role.",
          "Give clinical recommendations to make the team listen.",
          "Share only information the peer agreed to share or policy requires.",
          "Reveal private context to prove the peer deserves help.",
          "Offer the peer options for speaking, having you support, or pausing.",
          "Decide advocacy means you should always speak first."
        ),
      }),
      section("Bias, Stigma, and Micro-Repairs", {
        description: "Respond to harm without turning every moment into a courtroom.",
        scene:
          "Someone calls a peer 'noncompliant' in a huddle. You see the peer's shoulders drop.",
        plainTalk:
          "Stigma often hides in everyday words. A peer worker can interrupt with respect and clarity. You do not have to shame the staff person to protect the peer. You can translate toward dignity: 'Could we say the plan is not working for them right now?'",
        trySaying: [
          "Can we use language that keeps the person in the center?",
          "I heard the peer say transportation was the barrier, not that they do not care.",
          "What would change if we called this a support need instead of noncompliance?",
        ],
        practice:
          "Replace five stigmatizing labels with person-centered, plain-language alternatives.",
        commonTrap:
          "The trap is staying silent because you do not want team tension. Silence can feel like agreement to the peer.",
        mustKnow:
          "Challenge stigma in ways that protect dignity, facts, and the peer relationship.",
        quiz: q(
          "stigmatizing language in a huddle",
          "Redirect to person-centered language and the actual barrier.",
          "Stay silent because huddles are not the place for advocacy.",
          "Use peer advocacy and facts without making clinical judgments.",
          "Diagnose staff bias and confront them in front of everyone.",
          "Protect the peer's private details while challenging stigma.",
          "Share extra personal history so the team feels compassion.",
          "Ask how the plan can better match the peer's stated barrier.",
          "Use shame so the team learns faster."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Practice cultural humility without stereotyping.",
        "Explain why language access matters.",
        "Advocate with consent and peer voice.",
        "Interrupt stigma with dignity.",
      ],
      [
        "Do not assume culture from identity labels.",
        "Use qualified interpreter/access processes when needed.",
        "Advocacy must not speak over the peer.",
        "Protect privacy during advocacy.",
      ],
      [
        "Ask a respectful culture question.",
        "How would you offer an interpreter?",
        "What would you say if a peer is interrupted?",
        "Replace 'noncompliant' with peer-centered language.",
        "How do you challenge bias without making the peer carry the moment?",
      ]
    ),
  },
  {
    slug: "motivational-interviewing",
    title: "Motivational Interviewing for Peers",
    description:
      "Peer-friendly motivational interviewing: partnership, open questions, affirmations, reflections, summaries, and change talk.",
    estimatedHours: 4,
    oarReferences: ["OAR 950-060-0140 communication and engagement", "OAR 410-180 THW standards"],
    competencies: ["Motivational interviewing basics", "Ambivalence", "Reflections", "Change talk"],
    peerNugget:
      "Motivational interviewing is not a trick to make people change. It is a respectful way to help people hear themselves.",
    references: [...commonPeerRefs, MOTIVATIONAL_INTERVIEWING_NETWORK],
    sections: [
      section("The Spirit: Partnership, Not Persuasion", {
        description: "Use MI as a respectful conversation style, not a sales pitch.",
        scene:
          "A peer says, 'Part of me wants to stop using, part of me does not.' You can feel the urge to argue for the safer side.",
        plainTalk:
          "Motivational interviewing, or MI, is a conversation style that supports change by honoring autonomy. The spirit is partnership, acceptance, compassion, and evocation. Evocation means drawing out the person's own reasons, not stuffing yours into the room.",
        trySaying: [
          "Both sides make sense. What does each side want for you?",
          "Would it be okay if we explored what you like and do not like about things staying the same?",
          "You are the one who gets to decide what, if anything, changes.",
        ],
        practice:
          "Write one persuasion sentence, then rewrite it as a partnership sentence.",
        commonTrap:
          "The trap is using MI words with a hidden agenda. People can feel the push.",
        mustKnow:
          "MI supports autonomy. It is not manipulation or advice in disguise.",
        quiz: q(
          "a peer feeling ambivalent about change",
          "Explore both sides with permission and honor that the choice is theirs.",
          "Argue strongly for the healthier choice so change talk increases.",
          "Use MI-consistent peer conversation without providing therapy or treatment plans.",
          "Assess their readiness clinically and assign a stage.",
          "Keep sensitive change conversations private according to consent and policy.",
          "Report every ambivalent statement to the team as resistance.",
          "Ask what each side of ambivalence wants for them.",
          "Pressure the safer side because autonomy can wait in risky situations."
        ),
      }),
      section("OARS That Do Not Sound Like Robots", {
        description: "Practice open questions, affirmations, reflections, and summaries.",
        scene:
          "You learned OARS in training: open questions, affirmations, reflections, summaries. Then a real peer says, 'Whatever, none of this matters,' and the acronym vanishes from your brain.",
        plainTalk:
          "OARS is just a memory tool. Open questions invite. Affirmations name strength. Reflections show you heard. Summaries gather the thread. The goal is not to use all four like a checklist. The goal is a conversation that feels respectful and useful.",
        trySaying: [
          "What has helped you get through weeks like this before?",
          "You kept showing up even after getting bad news. That says something about you.",
          "Part of you is exhausted, and part of you still came here today.",
        ],
        practice:
          "Create one open question, one affirmation, one reflection, and one summary for the same peer statement.",
        commonTrap:
          "The trap is fake-sounding affirmations. Affirm behavior, effort, values, or survival you actually noticed.",
        mustKnow:
          "OARS skills should sound natural and be connected to what the peer actually said.",
        quiz: q(
          "using OARS with a discouraged peer",
          "Use a real reflection or affirmation tied to what the peer said.",
          "Give a generic compliment so the peer feels encouraged.",
          "Use communication skills as peer support, not psychotherapy.",
          "Interpret their discouragement as a clinical symptom.",
          "Keep conversation details private unless consent or safety policy applies.",
          "Quote their vulnerable statement in group without asking.",
          "Ask an open question about what has helped before.",
          "Summarize only your advice so the direction is clear."
        ),
      }),
      section("Change Talk and Sustain Talk", {
        description: "Listen for reasons to change and reasons to stay the same.",
        scene:
          "The peer says, 'I hate probation, but I also hate waking up sick.' There are two truths in one sentence.",
        plainTalk:
          "Change talk points toward movement: desire, ability, reasons, need, commitment, taking steps. Sustain talk points toward keeping things the same. Peer work does not attack sustain talk. We reflect it and gently invite the person to hear their own change talk more clearly.",
        trySaying: [
          "You do not want anyone controlling you, and you are tired of waking up sick.",
          "What worries you most about changing? What worries you most about not changing?",
          "What would be different if mornings were not so brutal?",
        ],
        practice:
          "Highlight the change-talk words in three mixed statements.",
        commonTrap:
          "The trap is pouncing on change talk like a contract. Curiosity works better than celebration pressure.",
        mustKnow:
          "Reflect both sides and draw out the peer's own reasons without arguing.",
        quiz: q(
          "hearing mixed change and sustain talk",
          "Reflect both sides and ask what the peer makes of them.",
          "Ignore sustain talk because it strengthens bad choices.",
          "Support motivation within peer scope without creating a treatment plan for them.",
          "Tell the peer their statements prove addiction severity.",
          "Protect private change goals and share only with consent or policy support.",
          "Tell the team the peer committed to change when they only wondered out loud.",
          "Ask what would be different if the hard part changed.",
          "Treat any change talk as permission to take over planning."
        ),
      }),
      section("When Advice Wants to Jump Out", {
        description: "Ask permission before information, ideas, or story.",
        scene:
          "You know a great medication-assisted treatment clinic, a meeting, and a bus route. The peer says, 'I don't know what to do,' and your advice engine revs up.",
        plainTalk:
          "Information can help. Advice can help sometimes. The peer-centered move is permission. Ask if they want ideas. Offer a menu, not a command. Then ask what they think. This keeps the peer in charge and makes your information easier to hear.",
        trySaying: [
          "Would it be okay if I shared a couple options I know about?",
          "Here are three possibilities. Which, if any, feels worth looking at?",
          "What do you make of those options?",
        ],
        practice:
          "Practice the ask-offer-ask rhythm: ask permission, offer briefly, ask what they think.",
        commonTrap:
          "The trap is calling advice 'education' so you do not have to ask permission.",
        mustKnow:
          "Ask-offer-ask protects autonomy when sharing information or lived experience.",
        quiz: q(
          "wanting to share resources or advice",
          "Ask permission, offer a short menu, and ask what the peer thinks.",
          "Give the best resource first because hesitation wastes time.",
          "Share information and lived experience without prescribing a treatment choice.",
          "Tell the peer which treatment is clinically best.",
          "Share referral details only with consent and correct release processes.",
          "Send their information to a clinic before asking so the spot is not lost.",
          "Let the peer choose which option, if any, to explore.",
          "Keep explaining until they pick one of your options."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Explain MI spirit in peer language.",
        "Use OARS naturally.",
        "Respond to change and sustain talk.",
        "Use ask-offer-ask before advice.",
      ],
      [
        "MI is not manipulation.",
        "Autonomy stays central.",
        "Peers do not prescribe treatment choices.",
        "Safety limits still apply.",
      ],
      [
        "What does MI mean without jargon?",
        "Give me an open question and reflection for ambivalence.",
        "How do you respond to sustain talk?",
        "Show the ask-offer-ask rhythm.",
        "When would you stop MI and follow safety protocol?",
      ]
    ),
  },
  {
    slug: "documentation-legal",
    title: "Documentation and Legal Basics",
    description:
      "Factual notes, privacy, releases, mandated reporting basics, and plain-language legal boundaries for peer work.",
    estimatedHours: 3,
    oarReferences: ["OAR 950-060-0140 documentation and confidentiality", "OAR 410-180 THW standards"],
    competencies: ["Factual documentation", "Confidentiality", "Release of information", "Mandated reporting awareness"],
    peerNugget:
      "Good documentation is boring in the best way: clear, factual, respectful, and useful.",
    references: [...commonPeerRefs, HHS_HIPAA],
    sections: [
      section("Notes That Tell the Truth Without Drama", {
        description: "Write observable facts and peer-stated goals.",
        scene:
          "A peer leaves angry after a housing call. You need to write the note while the feeling is still hot in your chest.",
        plainTalk:
          "Documentation is not a diary and not a place to win an argument. Write what happened, what the peer said they wanted, what support you provided, and the next step. Avoid labels like manipulative, lazy, dramatic, or noncompliant. Use direct quotes when they help clarify.",
        trySaying: [
          "Peer stated they felt ignored during the call.",
          "Peer chose to pause housing calls until tomorrow.",
          "PSS offered to review the letter together at next visit.",
        ],
        practice:
          "Turn one judgment sentence into an observable fact sentence.",
        commonTrap:
          "The trap is writing your frustration into the record. The note may outlive the mood.",
        mustKnow:
          "Notes should be factual, respectful, and within your role.",
        quiz: q(
          "writing after a tense meeting",
          "Document facts, peer statements, support provided, and next steps.",
          "Write that the peer was dramatic so the team understands the tone.",
          "Write peer support notes, not clinical assessments or legal conclusions.",
          "Diagnose the reason the peer became angry.",
          "Include only information allowed by policy and needed for the record.",
          "Add extra personal history because it explains the anger.",
          "Reflect the peer's chosen next step in the note.",
          "Choose the next step in the note even if the peer did not agree."
        ),
      }),
      section("Releases and Need-to-Know", {
        description: "Share information only with consent and proper purpose.",
        scene:
          "A housing worker asks you to send 'everything you have' because it will speed up an application.",
        plainTalk:
          "A release of information is permission to share specific information with specific people for a specific reason. Need-to-know means not everyone who is curious gets access. When in doubt, slow down and check policy.",
        trySaying: [
          "Let's look at what the release actually allows before I send anything.",
          "We can share the minimum needed for this purpose.",
          "I want this to move fast and stay private.",
        ],
        practice:
          "Write the three questions you ask before sharing information: who, what, why.",
        commonTrap:
          "The trap is oversharing to be helpful. Privacy is part of helpful.",
        mustKnow:
          "Consent is specific. Share the minimum needed and follow releases and policy.",
        quiz: q(
          "a request for all records",
          "Check the release, share only what is allowed and needed, and involve the peer.",
          "Send everything because the housing worker is helping.",
          "Navigate releases and privacy without giving legal advice.",
          "Decide the release covers anything that might help.",
          "Use valid consent and minimum necessary sharing.",
          "Forward records through personal email because it is faster.",
          "Ask the peer what they want shared within the release.",
          "Tell the peer privacy slows down their application and skip the details."
        ),
      }),
      section("Mandated Reporting and Safety Limits", {
        description: "Know when privacy has limits and how to explain them.",
        scene:
          "A peer tells you something involving a child that may trigger mandatory reporting. They whisper, 'You won't tell anyone, right?'",
        plainTalk:
          "Some information cannot stay private. Mandated reporting rules depend on role, setting, population, and state law. Your employer trains the exact steps. Peer voice still matters: be honest, do not threaten, and do not promise secrecy you cannot keep.",
        trySaying: [
          "I want to be honest before you share more: there are a few safety things I cannot keep secret.",
          "I need to follow our reporting policy, and I can explain what happens next.",
          "I will not leave you alone with this if we can help it.",
        ],
        practice:
          "Practice a limits-of-confidentiality sentence before a hard conversation starts.",
        commonTrap:
          "The trap is promising total confidentiality because you want the peer to trust you.",
        mustKnow:
          "Explain privacy limits early and follow mandated reporting and safety policies.",
        quiz: q(
          "information that may require reporting",
          "Be honest about limits and follow employer reporting policy.",
          "Promise secrecy first so the peer feels safe enough to talk.",
          "Recognize reporting limits and consult policy/supervision; do not give legal advice.",
          "Investigate the report yourself to decide if it is true.",
          "Share required information through approved reporting channels.",
          "Tell unrelated staff so everyone can watch the peer closely.",
          "Explain what choices the peer still has during the process.",
          "Take over completely because reporting removes peer choice."
        ),
      }),
      section("Legal Questions Are Not Peer Advice", {
        description: "Support navigation without practicing law.",
        scene:
          "A peer hands you eviction papers and says, 'Should I fight this or move out?' You want to answer because the deadline is scary.",
        plainTalk:
          "Peers can help read forms, find deadlines, make calls, gather questions, and connect to legal resources. Peers do not give legal advice. Saying 'I am not a lawyer' is not cold; it protects the peer from bad information and connects them to the right help.",
        trySaying: [
          "I cannot tell you what legal choice to make, but I can help you find legal aid and list questions.",
          "Let's look for deadlines and contact information together.",
          "Do you want to call 211info or legal aid while I sit with you?",
        ],
        practice:
          "Create a legal-navigation script that names your limit and offers two supports.",
        commonTrap:
          "The trap is answering because the paperwork feels urgent. Urgency is exactly why scope matters.",
        mustKnow:
          "Support legal navigation, not legal advice. Route to qualified legal help.",
        quiz: q(
          "a peer asking what to do with eviction papers",
          "Name that you cannot give legal advice and help connect to legal resources.",
          "Tell them the option you would choose so they have direction.",
          "Help with navigation and questions while routing legal decisions to qualified help.",
          "Interpret the eviction notice as if you were their representative.",
          "Share legal paperwork only with consent and secure program processes.",
          "Send photos of the papers to your friend who knows rentals.",
          "Offer choices like calling legal aid, listing questions, or finding deadlines.",
          "Make the legal call yourself and decide what to say."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Write factual, respectful notes.",
        "Explain releases and minimum necessary sharing.",
        "Describe confidentiality limits and reporting basics.",
        "Support legal navigation without giving legal advice.",
      ],
      [
        "No clinical labels in peer notes.",
        "No promises of total secrecy.",
        "Use releases, policy, and supervision.",
        "Route legal questions to qualified help.",
      ],
      [
        "Turn a judgment into a factual note.",
        "What do you check before sharing records?",
        "How do you explain mandated reporting limits warmly?",
        "What would you say about eviction papers?",
        "Why is boring documentation a good thing?",
      ]
    ),
  },
  {
    slug: "systems-resources",
    title: "Systems and Resources",
    description:
      "Navigate benefits, healthcare, housing, transportation, and community supports without becoming the system yourself.",
    estimatedHours: 3,
    oarReferences: ["OAR 950-060-0140 resource navigation", "OAR 410-180 THW standards"],
    competencies: ["Resource navigation", "Warm referrals", "Benefits basics", "Systems advocacy"],
    peerNugget:
      "Navigation means making the maze more usable while the peer keeps their own map.",
    references: [...commonPeerRefs, OREGON_211, OREGON_HEALTH_PLAN],
    sections: [
      section("Mapping the Maze", {
        description: "Start with what the peer wants and what is already in place.",
        scene:
          "A peer needs food, a phone, ID, dental care, and a safer place to sleep. Every need is real. The list could swallow the whole day.",
        plainTalk:
          "Resource navigation starts with sorting, not solving everything at once. Ask what feels most urgent to the peer. Notice deadlines and safety needs. Then map what supports already exist: family, community, benefits, clinics, faith groups, mutual aid, and formal programs.",
        trySaying: [
          "That is a lot to carry. Which piece feels most urgent today?",
          "What support is already in your corner, even a little?",
          "Let's pick one next step that would make the rest easier.",
        ],
        practice:
          "Make a resource map with the peer in the center and supports around them.",
        commonTrap:
          "The trap is treating the loudest system deadline as the peer's top priority without asking.",
        mustKnow:
          "Navigation is collaborative prioritizing and connecting, not taking over every task.",
        quiz: q(
          "many urgent resource needs",
          "Ask the peer to choose the first priority while noticing safety and deadlines.",
          "Start with the resource you know best so you can make progress.",
          "Support navigation and advocacy without becoming a case manager outside your role.",
          "Decide eligibility for programs based on what the peer tells you.",
          "Share personal information only with consent and program need.",
          "Send the whole resource list to agencies without releases.",
          "Offer a menu of next steps and let the peer choose one.",
          "Create a full plan alone so the peer can rest."
        ),
      }),
      section("Warm Referrals That Do Not Feel Like Rejection", {
        description: "Connect people to supports while staying emotionally present.",
        scene:
          "You found a food pantry, but the peer says, 'So you're passing me off too?'",
        plainTalk:
          "A referral can feel like rejection if the relationship disappears. A warm referral explains why the support fits, what to expect, what choices exist, and whether you can help with the first step. It says, 'I am not the whole answer, and I am still with you in this.'",
        trySaying: [
          "I am not sending you away. This pantry can help with food, and I can help you plan the first call.",
          "Do you want the address, a phone call together, or to look at other options?",
          "Let's talk about what would make walking in feel less weird.",
        ],
        practice:
          "Write a warm referral script that includes why, what to expect, and choice.",
        commonTrap:
          "The trap is handing over a list and calling it support. A list is a tool, not a relationship.",
        mustKnow:
          "Warm referrals include consent, expectation-setting, and follow-through within role.",
        quiz: q(
          "referring to a food pantry",
          "Explain the fit, ask what support they want, and plan the first step together.",
          "Hand over a list quickly because the resource is accurate.",
          "Make referrals and warm handoffs without guaranteeing service approval.",
          "Promise the pantry will serve them today.",
          "Share only needed information with the resource and only with consent.",
          "Call the pantry with personal details before the peer agrees.",
          "Offer choices like call together, go over hours, or compare options.",
          "Insist they go because food is clearly the priority."
        ),
      }),
      section("Oregon Health Plan Basics", {
        description: "Help peers understand health coverage without pretending to be eligibility experts.",
        scene:
          "The peer says their Oregon Health Plan card stopped working. They missed one letter and now every appointment feels at risk.",
        plainTalk:
          "The Oregon Health Plan is Oregon's Medicaid program. Peers can help people read letters, find member services, call a coordinated care organization, and prepare questions. Peers do not determine eligibility or promise coverage. The goal is to make the next contact less confusing.",
        trySaying: [
          "Oregon Health Plan is the state Medicaid coverage. Let's find who the letter says to call.",
          "I cannot decide eligibility, but I can sit with you while you ask questions.",
          "Want to write down what happened before the call?",
        ],
        practice:
          "Write three questions a peer could ask member services about coverage.",
        commonTrap:
          "The trap is saying 'you should qualify' because it feels reassuring. Eligibility decisions belong to the program.",
        mustKnow:
          "Peers support health coverage navigation but do not determine eligibility or benefits.",
        quiz: q(
          "Oregon Health Plan confusion",
          "Help read the letter and prepare a call without promising eligibility.",
          "Reassure them they qualify because their need is obvious.",
          "Navigate coverage questions while routing decisions to OHP/member services.",
          "Tell the clinic the plan must cover the visit because you advocate for the peer.",
          "Use consent before sharing health or benefit information.",
          "Call member services as the peer without them present.",
          "Offer choices like call together, draft questions, or find member contacts.",
          "Take the letter and handle it alone."
        ),
      }),
      section("Following Up Without Chasing", {
        description: "Support follow-through without becoming the motivation police.",
        scene:
          "The peer did not call the resource you found together. You feel disappointed because the opening may close.",
        plainTalk:
          "Follow-up is a chance to learn, not a chance to scold. Barriers may include shame, phone anxiety, transportation, literacy, culture, past rejection, disability, or simply too much life. Ask what happened and what they want now.",
        trySaying: [
          "How did that plan fit once you got home?",
          "What got in the way, and do you still want that resource?",
          "Do you want to adjust the plan or choose something else?",
        ],
        practice:
          "Turn 'Did you do it?' into three curious follow-up questions.",
        commonTrap:
          "The trap is tracking tasks like compliance. Peer follow-up is about learning and adjusting.",
        mustKnow:
          "Follow-up should support self-efficacy and choice, not shame.",
        quiz: q(
          "a peer not completing a resource call",
          "Ask what got in the way and whether the plan still fits.",
          "Warn them they may lose your help if they do not follow through.",
          "Support follow-through as peer coaching, not compliance monitoring.",
          "Document the peer as noncompliant without asking about barriers.",
          "Keep resource information private and update records factually.",
          "Tell the resource the peer failed to call so they hold the spot.",
          "Offer choices to adjust, retry, or choose a different step.",
          "Do the call for them every time so barriers disappear."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Map resource needs with the peer's priorities.",
        "Make warm referrals with consent.",
        "Explain Oregon Health Plan basics plainly.",
        "Follow up without shame or chasing.",
      ],
      [
        "Do not promise eligibility, openings, or approvals.",
        "Use consent before sharing information.",
        "Warm referrals are not abandonment.",
        "Choice stays central even when resources are scarce.",
      ],
      [
        "How do you prioritize five urgent needs?",
        "Show me a warm referral script.",
        "Explain Oregon Health Plan without jargon.",
        "What would you ask after a missed resource call?",
        "How do you avoid becoming the whole system for someone?",
      ]
    ),
  },
  {
    slug: "self-care",
    title: "Self-Care and Sustainability",
    description:
      "Personal wellness, supervision, burnout prevention, boundaries, and staying in the work without losing yourself.",
    estimatedHours: 3,
    oarReferences: ["OAR 950-060-0140 self-care and professional development", "OAR 410-180 THW standards"],
    competencies: ["Self-awareness", "Burnout prevention", "Supervision", "Sustainable practice"],
    peerNugget:
      "Self-care is not a bubble bath requirement. It is how you keep your peer support from running on fumes.",
    references: [...commonPeerRefs],
    sections: [
      section("Know Your Signals", {
        description: "Notice stress early enough to respond kindly.",
        scene:
          "You are annoyed before the peer even sits down. Their story is not the problem; your tank is blinking empty.",
        plainTalk:
          "Self-awareness is a job skill. Your body may notice burnout before your calendar does: tight shoulders, cynicism, rescuing, dread, numbness, skipping notes, or wanting to avoid certain peers. Signals are not shame. They are dashboard lights.",
        trySaying: [
          "I am noticing I am activated. I need to slow down before I respond.",
          "This belongs in supervision, not in the peer conversation.",
          "I can be caring and still need support.",
        ],
        practice:
          "List five personal early warning signs and one small response for each.",
        commonTrap:
          "The trap is calling exhaustion dedication. Dedication without care can turn into harm.",
        mustKnow:
          "Peers need self-awareness to protect relationships, boundaries, and safety.",
        quiz: q(
          "noticing burnout signals",
          "Name the signal, slow down, and use support before it leaks into peer work.",
          "Ignore it because peers should be selfless.",
          "Use supervision and wellness tools while staying responsible for your role.",
          "Tell the peer they triggered you so they understand your mood.",
          "Keep peer details private when seeking support, using supervision appropriately.",
          "Vent with identifying details in a public recovery space.",
          "Choose a small support step like break, consult, grounding, or schedule adjustment.",
          "Quit responding to the peer without explanation."
        ),
      }),
      section("Supervision Is a Strength", {
        description: "Use supervision before stuckness becomes drift.",
        scene:
          "You keep thinking about one peer after work. You are checking your phone, replaying the conversation, and wondering if you should have done more.",
        plainTalk:
          "Supervision is not only for mistakes. It is where you sort scope, feelings, culture, ethics, safety, and next steps. Good supervision helps you stay peer, not rescuer, therapist, parent, or secret keeper.",
        trySaying: [
          "I need supervision on scope and my own pull to rescue here.",
          "Can we review what is mine to do and what belongs to the team?",
          "I want to support this peer without becoming their whole plan.",
        ],
        practice:
          "Write a supervision agenda with facts, feelings, scope question, and next-step question.",
        commonTrap:
          "The trap is waiting until you are in trouble to ask for supervision.",
        mustKnow:
          "Supervision supports ethical, safe, sustainable peer practice.",
        quiz: q(
          "feeling pulled to rescue a peer",
          "Bring facts, feelings, and a scope question to supervision.",
          "Work harder privately because the peer needs someone dependable.",
          "Use supervision to stay within peer scope and protect the relationship.",
          "Start providing therapy-like support after hours.",
          "Share only necessary details in the proper supervision setting.",
          "Ask social media friends what to do using the peer's situation.",
          "Choose next steps with supervisor guidance and peer consent where needed.",
          "Hide the rescue feelings because they sound unprofessional."
        ),
      }),
      section("Boundaries With Your Own Story", {
        description: "Care for your recovery while using lived experience.",
        scene:
          "A peer's story sounds close to yours. Too close. You can feel old memories trying to drive the conversation.",
        plainTalk:
          "Your lived experience is powerful, and it is also tender. You get to have privacy. You get to choose what not to share. You get to step back, consult, or ask for coverage when a topic hits too close. That is not failure; it is responsibility.",
        trySaying: [
          "I relate to parts of this, and I want to keep the focus on you.",
          "I need to pause for a moment so I can stay present.",
          "I am going to consult my supervisor to make sure I support you well.",
        ],
        practice:
          "Name three story areas you are comfortable sharing and three that need stronger boundaries.",
        commonTrap:
          "The trap is proving credibility by opening wounds that are not ready to be public.",
        mustKnow:
          "Peers can protect their own story and recovery while still being authentic.",
        quiz: q(
          "a peer story that hits close to your own",
          "Keep focus on the peer, use grounding, and consult supervision if needed.",
          "Share deeply so the peer knows they are not alone.",
          "Use lived experience selectively while maintaining boundaries and scope.",
          "Process your own trauma with the peer because mutuality means both people share equally.",
          "Keep the peer's story and your own private details appropriately protected.",
          "Tell coworkers the peer's story because it explains why you are upset.",
          "Choose whether to pause, continue, or seek support based on safety and presence.",
          "Push through no matter what because leaving would be abandonment."
        ),
      }),
      section("A Sustainable Peer Practice Plan", {
        description: "Build routines that make good work repeatable.",
        scene:
          "It is Friday. Notes are behind, your lunch is untouched, and you promised three people you would check on something before Monday.",
        plainTalk:
          "Sustainability is built in boring systems: realistic caseload habits, note time, breaks, peer consultation, recovery supports, sleep, food, movement, spiritual care, humor, and saying no before resentment takes over. The plan should fit real life, not an ideal version of you.",
        trySaying: [
          "I can follow up Monday morning, not tonight.",
          "Let me write that down so I do not carry it in my head all weekend.",
          "I need to close the loop on what I promised and what I cannot promise.",
        ],
        practice:
          "Make a Friday shutdown checklist: notes, promises, supervision flags, body check, next workday start.",
        commonTrap:
          "The trap is confusing availability with commitment. Reliable support has limits.",
        mustKnow:
          "Sustainable practice uses routines, boundaries, supervision, and personal recovery supports.",
        quiz: q(
          "ending the week overloaded",
          "Clarify promises, document, set realistic follow-up, and use support.",
          "Keep working unpaid until every need is handled.",
          "Maintain sustainable peer practice within role and employment policy.",
          "Ignore documentation so you can provide more emotional support.",
          "Protect privacy while organizing follow-up and supervision notes.",
          "Take peer files home casually to catch up over the weekend.",
          "Offer realistic follow-up choices and do not promise what you cannot do.",
          "Say yes to every request because peers have been let down before."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Name personal stress and burnout signals.",
        "Use supervision as a normal practice tool.",
        "Set boundaries with personal story sharing.",
        "Create a sustainable peer practice rhythm.",
      ],
      [
        "Self-care protects peers too.",
        "Supervision is used before crises and after hard moments.",
        "Do not process your recovery through the peer.",
        "Reliable support includes realistic limits.",
      ],
      [
        "What are your early burnout signals?",
        "How would you ask for supervision on rescue feelings?",
        "What part of your story needs a boundary?",
        "Build a Friday shutdown plan out loud.",
        "How can saying no be part of care?",
      ]
    ),
  },
  {
    slug: "pss-practice-lab",
    title: "PSS Practice Lab",
    description:
      "Put it all together with realistic conversations, peer voice, scope, safety, documentation, and instructor-ready reflection.",
    estimatedHours: 4,
    oarReferences: ["OAR 950-060-0140 applied practice", "OAR 410-180 THW competency standards"],
    competencies: ["Integrated peer practice", "Roleplay", "Documentation", "Competency readiness"],
    peerNugget:
      "Practice lab is where we stop admiring the values and start saying the words out loud.",
    references: commonPeerRefs,
    sections: [
      section("Opening a Peer Conversation", {
        description: "Start with consent, role clarity, and a human welcome.",
        scene:
          "A new peer sits down and says, 'So what is this supposed to be?' It is an invitation to explain your role without sounding like a brochure.",
        plainTalk:
          "A strong opening lowers pressure. Say who you are, what peer support can offer, what it cannot do, and how the person can use the time. Keep it short. The best opening creates room for the peer's agenda, not yours.",
        trySaying: [
          "I am here as a peer, meaning I use lived experience and support skills to walk beside you.",
          "I am not a therapist or prescriber. We can talk, plan, practice, and connect to resources.",
          "What would make this time useful for you?",
        ],
        practice:
          "Record yourself giving a 30-second peer support welcome and remove any jargon.",
        commonTrap:
          "The trap is over-explaining the role because you are nervous. Short and warm wins.",
        mustKnow:
          "Openings should include peer role, limits, choice, and invitation.",
        quiz: q(
          "opening a first peer meeting",
          "Briefly explain the peer role and ask what would make the time useful.",
          "Start with your full recovery story so they know you are credible.",
          "Name peer support limits without sounding clinical or superior.",
          "Offer therapy if they do not already have a counselor.",
          "Explain privacy and safety limits according to program practice.",
          "Skip privacy because it makes the opening too formal.",
          "Let the peer choose the focus for the conversation.",
          "Set the agenda yourself so the meeting has structure."
        ),
      }),
      section("The Middle: Staying With the Thread", {
        description: "Keep the conversation focused without controlling it.",
        scene:
          "Ten minutes in, the peer has touched housing, grief, relapse, food, and a fight with their sister. All of it matters.",
        plainTalk:
          "The middle of a conversation is where peers can get lost. Summaries help. So does asking what thread the person wants to follow first. You can honor the whole story without chasing every rabbit trail.",
        trySaying: [
          "I heard housing, grief, and your sister all tangled together. Which thread should we hold first?",
          "Can I pause us and check if we are still on what matters most today?",
          "What is the smallest useful step from this conversation?",
        ],
        practice:
          "Take a messy paragraph and write a two-sentence summary plus one focusing question.",
        commonTrap:
          "The trap is taking control because the story is messy. Collaboration can still have structure.",
        mustKnow:
          "Use summaries and focusing questions to support clarity while preserving peer choice.",
        quiz: q(
          "a conversation with many urgent threads",
          "Summarize the threads and ask which one to hold first.",
          "Pick the thread you can solve fastest.",
          "Use peer communication skills without acting as a counselor or case manager outside role.",
          "Interpret the messy story as a symptom pattern.",
          "Keep private details within the support relationship and policy.",
          "Share the whole messy story at huddle to get ideas.",
          "Ask the peer to choose the smallest useful next step.",
          "Push the original agenda even if the peer's priority changed."
        ),
      }),
      section("Closing Without Dropping", {
        description: "End with clarity, choice, and realistic follow-up.",
        scene:
          "The meeting is almost over. The peer says, 'So what now?' A good closing can turn a helpful talk into a doable next step.",
        plainTalk:
          "Closing is not an afterthought. Summarize what mattered, name the next step the peer chose, clarify who is doing what, and check for safety or support needs before leaving. Keep promises small enough to keep.",
        trySaying: [
          "Here is what I heard and what you chose for next step. Did I get it right?",
          "What, if anything, do you want me to follow up on?",
          "Before we wrap, is there any safety concern we need to plan for today?",
        ],
        practice:
          "Write a closing script with summary, next step, roles, and safety check.",
        commonTrap:
          "The trap is ending with vague encouragement. 'You got this' is nice; clear next steps are kinder.",
        mustKnow:
          "Closings should include summary, peer-chosen next step, role clarity, and safety check when appropriate.",
        quiz: q(
          "closing a peer meeting",
          "Summarize, confirm the peer's next step, clarify follow-up, and check safety if needed.",
          "End with encouragement only because planning can feel controlling.",
          "Close within peer scope and route safety concerns by protocol.",
          "Set a clinical homework assignment to keep momentum.",
          "Document follow-up and safety information according to policy.",
          "Avoid documentation because the conversation was informal.",
          "Ask what they want you to follow up on, if anything.",
          "Promise broad availability so they feel supported."
        ),
      }),
      section("Demo Readiness: What Instructors Listen For", {
        description: "Prepare for human evaluation with peer voice and clean scope.",
        scene:
          "You are about to do a practice conversation. Your nerves say, 'Sound professional.' Your training says, 'Sound like a grounded peer.'",
        plainTalk:
          "Instructors are not looking for a perfect script. They are listening for the stance: warmth, choice, lived-experience wisdom, boundaries, safety awareness, and plain language. If you make a mistake, repair it. Repair often shows more readiness than pretending nothing happened.",
        trySaying: [
          "Let me back up and ask permission before I offer that idea.",
          "I am not the person who can diagnose that, but I can help you think about support options.",
          "I care about this and I do not want to take over your choice.",
        ],
        practice:
          "Do a five-minute roleplay and mark every moment you asked permission, reflected, or named scope.",
        commonTrap:
          "The trap is trying to impress the instructor instead of being useful to the peer in front of you.",
        mustKnow:
          "AI practice helps rehearse, but certification and completion remain human instructor decisions.",
        quiz: q(
          "a final practice demonstration",
          "Use warm peer language, ask permission, name scope, and repair mistakes.",
          "Use more professional jargon so the instructor hears competence.",
          "Demonstrate peer support skills without claiming clinical, legal, or crisis authority.",
          "Diagnose quickly to show you caught the main issue.",
          "Treat practice records as private training records according to program policy.",
          "Share the practice scenario publicly because it is fictional.",
          "Let the peer's goals guide the conversation and next step.",
          "Do everything perfectly without asking for help or supervision."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Open, focus, and close a peer conversation.",
        "Use summaries, permission, and role clarity.",
        "Demonstrate scope and safety under practice pressure.",
        "Prepare for human instructor evaluation.",
      ],
      [
        "AI practice does not certify students.",
        "Practice must include peer choice and plain language.",
        "Scope and safety are non-negotiable.",
        "Repair is better than pretending.",
      ],
      [
        "Give me your 30-second peer support opening.",
        "How would you focus a messy conversation?",
        "Show me a strong closing statement.",
        "What would an instructor listen for in your demo?",
        "How do you recover after a roleplay mistake?",
      ]
    ),
  },
];

export const CORE_PSS_MODULES = pssModuleSpecs.map(buildHybridModule);

export const PSS_COURSE: CourseSeed = {
  slug: "pss",
  type: "PSS",
  title: "Peer Support Specialist Certification Training",
  subtitle: "40-hour Oregon-aligned PSS training with section checks and module AI review",
  description:
    "A warm, practical 40-hour Peer Support Specialist curriculum for people with lived experience who want to support others with hope, scope clarity, and real-world skills.",
  contactHours: 40,
  priceCents: 120000,
  competencies: [
    "Recovery-oriented peer support",
    "Communication and motivational interviewing",
    "Ethics, boundaries, confidentiality, and documentation",
    "Trauma-informed, culturally responsive, and crisis-aware practice",
    "Resource navigation, self-care, and applied peer conversation skills",
  ],
  learningOutcomes: [
    "Explain peer support in plain language and stay within Oregon peer scope.",
    "Use lived experience strategically while centering the peer's choice.",
    "Respond to crisis concerns by recognizing, relating, and routing through proper supports.",
    "Write factual peer notes and protect confidentiality.",
    "Complete section MCQs and module AI reviews for instructor review.",
  ],
  modules: CORE_PSS_MODULES,
};
