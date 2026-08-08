import {
  buildHybridModule,
  cloneHybridModule,
  section,
  type HybridModuleSpec,
  type SectionQuizSpec,
} from "./hybrid";
import { CORE_PSS_MODULES } from "./pss";
import {
  CDC_NALOXONE,
  CDC_SOCIAL_DETERMINANTS,
  HHS_42_CFR_PART_2,
  HHS_HIPAA,
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
import type { CourseSeed } from "./types";

const pwsCoreRefs = [
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
      peerVoice: "Keeps a warm peer-to-peer voice, even in medical, housing, or team settings.",
      choiceConsent: "Checks consent before sharing ideas, involving partners, or moving a plan forward.",
      scopeSafety: "Names the PWS lane clearly and routes medical, legal, clinical, or crisis needs.",
      warmthWithoutRescue: "Offers steady support without becoming the peer's whole wellness system.",
    },
    starterQuestions,
  };
}

const pwsExtraSpecs: HybridModuleSpec[] = [
  {
    slug: "wrap-wellness",
    title: "WRAP and Wellness Planning",
    description:
      "Use Wellness Recovery Action Plan ideas and everyday wellness tools without turning the plan into homework someone hates.",
    estimatedHours: 4,
    oarReferences: ["OAR 950-060-0140 wellness planning", "OAR 410-180 THW standards"],
    competencies: ["Wellness planning", "WRAP basics", "Self-directed planning", "Early warning signs"],
    peerNugget:
      "A wellness plan should feel like a backpack the peer chose, not a binder the system handed them.",
    references: [...pwsCoreRefs, WRAP_INFO, SAMHSA_RECOVERY],
    sections: [
      section("Wellness in the Peer’s Own Words", {
        description: "Start with what helps the person feel more like themselves.",
        scene:
          "A peer says, 'Everyone asks about symptoms. Nobody asks what a decent day looks like.' That is your doorway.",
        plainTalk:
          "Wellness is not only medical stability. It can be sleep, food, culture, movement, medication, quiet, humor, spiritual practice, pets, music, medication appointments, fewer fights, or getting outside. A Peer Wellness Specialist helps the person name what works for them and build from there.",
        trySaying: [
          "What tells you a day is going a little better?",
          "What helps you feel more like yourself, even by five percent?",
          "Do you want to make a simple wellness list that sounds like you?",
        ],
        practice:
          "Make a two-column list: 'what drains me' and 'what gives me a little life.' Keep the words everyday.",
        commonTrap:
          "The trap is defining wellness for the peer based on program goals. The peer's lived definition has to lead.",
        mustKnow:
          "Wellness planning is peer-directed and whole-person, not a clinician-made symptom checklist.",
        quiz: q(
          "starting a wellness plan",
          "Ask what wellness looks like to the peer and build from their words.",
          "Start with the program wellness template and tell them what belongs in each box.",
          "Support wellness planning without diagnosing, prescribing, or setting clinical goals.",
          "Tell the peer which symptoms prove they are well enough.",
          "Keep wellness details private unless the peer consents or safety policy applies.",
          "Share the wellness list with the whole team because wellness is positive information.",
          "Offer choices about format, pace, and what parts to include.",
          "Require the same wellness categories for everyone."
        ),
      }),
      section("WRAP Without the Worksheet Voice", {
        description: "Use WRAP ideas in plain language.",
        scene:
          "The worksheet says 'daily maintenance plan.' The peer says, 'That sounds like an oil change.' You both laugh, and now you can translate.",
        plainTalk:
          "WRAP stands for Wellness Recovery Action Plan. In plain English, it is a self-made plan for what keeps you well, what throws you off, what helps early, and what support you want during hard times. The tool is useful only if the peer recognizes themselves in it.",
        trySaying: [
          "WRAP is just a plan in your own words for what helps and what to do when things get rough.",
          "What would you call this section so it does not sound like a robot wrote it?",
          "Want to start with daily stuff, stress signals, or support people?",
        ],
        practice:
          "Rename three WRAP headings into language a real peer might use.",
        commonTrap:
          "The trap is treating the form as the goal. The goal is a plan the person might actually use.",
        mustKnow:
          "WRAP is self-directed; peers can support the process but should not fill it out for someone.",
        quiz: q(
          "using a WRAP worksheet",
          "Translate the headings and let the peer decide where to start.",
          "Complete the worksheet for them so it is thorough.",
          "Facilitate self-directed wellness planning while staying non-clinical.",
          "Use WRAP to replace a provider's treatment plan.",
          "Ask consent before sharing any WRAP section with supporters or staff.",
          "Put the WRAP in the chart automatically because it is helpful.",
          "Offer choices about headings, format, and first section.",
          "Insist on the official wording so the plan is valid."
        ),
      }),
      section("Early Signs and Support Before the Cliff", {
        description: "Notice patterns before things become crisis.",
        scene:
          "A peer says, 'I do not notice I am slipping until I have already blown up my phone and stopped sleeping.'",
        plainTalk:
          "Early warning signs are small signals that support may be needed: skipping meals, isolating, spending fast, racing thoughts, missing meds, craving, pain flares, or snapping at people. The tone matters. This is not surveillance; it is self-knowledge.",
        trySaying: [
          "What are the small signs that life is getting louder?",
          "Who notices before you do, and do you want them involved?",
          "What is a support step that does not feel like punishment?",
        ],
        practice:
          "Choose three early signs and match each with one gentle support step.",
        commonTrap:
          "The trap is turning early signs into a monitoring system controlled by staff.",
        mustKnow:
          "Early support should be consent-based and chosen by the peer before a crisis hits.",
        quiz: q(
          "planning for early warning signs",
          "Ask the peer to name signs and choose gentle support steps.",
          "Create a staff monitoring checklist without telling the peer.",
          "Support self-awareness and planning without clinical monitoring or diagnosis.",
          "Tell the peer which early signs predict relapse for them.",
          "Ask consent before involving family, staff, or supporters.",
          "Notify supporters whenever you notice a sign, even without consent.",
          "Let the peer choose which signs and supports belong in the plan.",
          "Make the plan strict so the peer takes it seriously."
        ),
      }),
      section("Crisis Preferences and Aftercare", {
        description: "Plan for hard moments without taking away voice.",
        scene:
          "The peer says, 'If I ever end up in the hospital again, I need someone to tell them not to call my brother.'",
        plainTalk:
          "Wellness planning can include crisis preferences: who to call, who not to call, what helps, what makes things worse, medications or health needs to mention, cultural or spiritual supports, and what aftercare should look like. Crisis preferences do not override law or safety policy, but they preserve dignity where choice is possible.",
        trySaying: [
          "Let's write what helps and what does not help if things get intense.",
          "Who do you want contacted, and who should not be contacted unless required?",
          "After a crisis, what helps you feel human again?",
        ],
        practice:
          "Draft three crisis preference prompts that include choice and safety limits.",
        commonTrap:
          "The trap is promising the plan will control every crisis decision. It can guide support, but safety rules still matter.",
        mustKnow:
          "Crisis preferences support dignity but must be used alongside crisis policy and required safety steps.",
        quiz: q(
          "writing crisis preferences",
          "Help the peer name preferences and explain safety limits honestly.",
          "Promise the plan will prevent any unwanted intervention.",
          "Support planning while routing real crisis response through policy and qualified help.",
          "Decide which family members should be involved based on your judgment.",
          "Share crisis preferences only with consent or as policy requires for safety.",
          "Ignore the do-not-call list because family usually helps.",
          "Offer choices about contacts, helpful actions, and aftercare.",
          "Remove crisis choices because safety always means staff decide everything."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Explain wellness planning in peer language.",
        "Use WRAP as a self-directed tool.",
        "Support early warning sign planning with consent.",
        "Respect crisis preferences while naming safety limits.",
      ],
      [
        "WRAP is not clinical treatment planning.",
        "The peer chooses the language and format.",
        "Safety policy still applies in crisis.",
        "Plans are private unless consent or policy says otherwise.",
      ],
      [
        "How would you introduce WRAP without worksheet language?",
        "Ask about early warning signs in a non-shaming way.",
        "What belongs in crisis preferences?",
        "How do you avoid taking over a wellness plan?",
        "How would you explain sharing limits for a WRAP plan?",
      ]
    ),
  },
  {
    slug: "addiction-harm-reduction",
    title: "Addiction Recovery and Harm Reduction",
    description:
      "Support substance use recovery, safer-use planning, naloxone, recurrence of use, and medication pathways with dignity.",
    estimatedHours: 5,
    oarReferences: ["OAR 950-060-0140 addiction recovery support", "OAR 410-180 THW standards"],
    competencies: ["Harm reduction", "Addiction recovery support", "Naloxone basics", "Non-stigmatizing language"],
    peerNugget:
      "Harm reduction says a person's life is worth protecting before, during, and after any change.",
    references: [...pwsCoreRefs, OREGON_HARM_REDUCTION, CDC_NALOXONE, HHS_42_CFR_PART_2],
    sections: [
      section("Recovery Paths Are Not One-Size", {
        description: "Honor abstinence, medication, harm reduction, faith, culture, and mixed paths.",
        scene:
          "A peer says, 'I use medication and my cousin says that means I am not really clean.' They look ready for you to judge too.",
        plainTalk:
          "Addiction recovery has many valid pathways. Some people choose abstinence, some use medications, some use harm reduction, some use meetings, some use culture, faith, therapy, family, or a mix. A PWS does not rank recovery paths. We support safer, self-defined movement.",
        trySaying: [
          "Your recovery does not have to pass your cousin's test to be real.",
          "What parts of your path are helping you stay alive and connected?",
          "Do you want support talking about stigma around medication?",
        ],
        practice:
          "Write three recovery-path affirmations that do not rank one path above another.",
        commonTrap:
          "The trap is letting your own recovery pathway become the hidden standard.",
        mustKnow:
          "Peers support self-defined addiction recovery and do not shame medication or harm reduction choices.",
        quiz: q(
          "a peer using medication for addiction recovery",
          "Affirm their self-defined path and ask what support they want.",
          "Explain that medication is temporary and abstinence is the real goal.",
          "Support recovery choices without prescribing, discouraging, or managing medication.",
          "Tell them which medication dose means they are stable.",
          "Protect substance use and medication information according to consent, HIPAA, Part 2, and policy.",
          "Tell their family medication is legitimate without asking the peer.",
          "Offer choices for stigma support, provider questions, or peer groups.",
          "Push the pathway that worked for your recovery."
        ),
      }),
      section("Harm Reduction in Plain Words", {
        description: "Make risky moments safer without requiring perfection first.",
        scene:
          "A peer says, 'I used last night, so I guess I blew it.' You hear shame trying to turn one night into a whole identity.",
        plainTalk:
          "Harm reduction means reducing danger while honoring the person's dignity and choices. It can include not using alone, fentanyl test strips where legal and available, safer supplies, hydration, wound care, naloxone, less risky routes, medication support, or planning a safer place to be. It is not giving up on recovery. It is keeping people alive and connected.",
        trySaying: [
          "Using last night does not erase your worth or the work you have done.",
          "Do you want to talk about what would make the next 24 hours safer?",
          "We can look at safer-use supports and recovery supports. Both can matter.",
        ],
        practice:
          "Name five harm-reduction supports and practice saying them without judgment in your voice.",
        commonTrap:
          "The trap is thinking safety planning means approving of every choice. Safety support is not the same as permission or judgment.",
        mustKnow:
          "Harm reduction is a dignity and safety approach; it does not require abstinence before support.",
        quiz: q(
          "a peer returning to use",
          "Reduce shame and ask if they want to plan for safer next steps.",
          "Tell them they are back at zero so they understand the seriousness.",
          "Offer harm-reduction peer support without medical advice or treatment orders.",
          "Tell them which substances are safe to combine.",
          "Keep substance-use disclosures private unless consent or safety law/policy requires sharing.",
          "Report the recurrence to housing automatically because they need accountability.",
          "Offer choices like naloxone, not using alone, support call, or treatment questions.",
          "Require abstinence before helping with safety."
        ),
      }),
      section("Naloxone and Overdose Response", {
        description: "Talk about naloxone clearly and route training to approved sources.",
        scene:
          "A peer says, 'If I carry naloxone, people will think I am using again.'",
        plainTalk:
          "Naloxone is a medicine that can reverse an opioid overdose. Carrying it is community care, like carrying a first-aid kit. Programs have specific training on recognizing overdose, calling emergency help, rescue breathing, naloxone use, and staying until help arrives. A PWS can encourage training and access without pretending a quick chat replaces real training.",
        trySaying: [
          "Naloxone is about keeping people alive. Carrying it does not define your recovery.",
          "Want help finding where our program or local public health offers training?",
          "We can talk through stigma and make a plan that feels safe for you.",
        ],
        practice:
          "Practice a 20-second explanation of naloxone that includes training and emergency help.",
        commonTrap:
          "The trap is treating naloxone like a moral statement. It is a safety tool.",
        mustKnow:
          "Naloxone access and overdose response should follow current training, emergency steps, and local policy.",
        quiz: q(
          "talking about naloxone",
          "Explain naloxone as an overdose reversal medicine and connect to approved training/access.",
          "Say carrying naloxone is only for people actively using opioids.",
          "Support naloxone access without replacing formal overdose response training or medical advice.",
          "Teach a made-up overdose protocol from memory.",
          "Respect privacy around substance use and naloxone decisions.",
          "Tell the peer's recovery group they carry naloxone so stigma decreases.",
          "Offer choices for training, carrying, or discussing stigma.",
          "Pressure everyone to carry it the same way."
        ),
      }),
      section("Stigma, Shame, and Return to Use", {
        description: "Respond to recurrence without panic, punishment, or false cheer.",
        scene:
          "A peer says, 'Don't tell my counselor. I slipped and I can't handle the look.'",
        plainTalk:
          "A return to use can bring danger, grief, shame, and learning. Your role is not to hide safety issues or punish honesty. Slow down. Ask what happened, what is safer now, what supports they want, and what information must be shared by policy or release. Keep the door open.",
        trySaying: [
          "I am glad you told me. Let's talk about safety first and then choices.",
          "I cannot promise to hide safety information, and I can be honest about what I have to share.",
          "What would help you take the next right step without drowning in shame?",
        ],
        practice:
          "Write a recurrence response that includes gratitude, safety, privacy limits, and choice.",
        commonTrap:
          "The trap is either minimizing risk or reacting like the relationship is broken. Stay steady.",
        mustKnow:
          "Respond to return to use with dignity, safety planning, privacy clarity, and appropriate routing.",
        quiz: q(
          "a peer disclosing return to use",
          "Thank them, check safety, explain privacy limits, and ask what support they want.",
          "Promise not to tell anyone so they keep trusting you.",
          "Provide peer support and route medical, clinical, or crisis needs to the right help.",
          "Decide their treatment level needs to change.",
          "Follow consent, Part 2, HIPAA, release, and safety policy for any sharing.",
          "Tell the counselor immediately with every detail before checking policy.",
          "Offer choices for safer next steps and support connections.",
          "Treat the recurrence as proof they are not ready."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Affirm multiple addiction recovery pathways.",
        "Explain harm reduction in plain, non-shaming language.",
        "Discuss naloxone as a safety tool with proper training.",
        "Respond to return to use with dignity and safety.",
      ],
      [
        "No medication advice or treatment orders.",
        "Harm reduction is not shame or permission; it is safety.",
        "Substance use privacy may include extra protections.",
        "Overdose/crisis routes use real protocols, not AI practice.",
      ],
      [
        "How would you respond to medication stigma?",
        "Explain harm reduction to someone who thinks it means giving up.",
        "What do you say about naloxone?",
        "How do you handle return to use and privacy limits?",
        "What words would you avoid because they add shame?",
      ]
    ),
  },
  {
    slug: "group-facilitation",
    title: "Group Facilitation",
    description:
      "Create peer groups that feel safe, lively, structured, and truly peer-led without becoming therapy groups.",
    estimatedHours: 4,
    oarReferences: ["OAR 950-060-0140 group facilitation", "OAR 410-180 THW standards"],
    competencies: ["Group agreements", "Facilitation", "Conflict support", "Peer learning"],
    peerNugget:
      "A good group is not controlled by the facilitator; it is held by clear agreements and shared respect.",
    references: [...pwsCoreRefs, SAMHSA_PEER_SUPPORT],
    sections: [
      section("Opening a Group With Agreements", {
        description: "Start groups with clarity, welcome, and shared expectations.",
        scene:
          "Six people arrive: one quiet, one joking, one angry, one late, one nervous, one ready to overshare. The opening matters.",
        plainTalk:
          "Group agreements are not school rules. They are promises the group makes so people can participate with less fear. Keep them short: confidentiality limits, speak from I, pass is allowed, respect time, no fixing, phones handled respectfully, crisis steps if needed.",
        trySaying: [
          "Pass is always allowed here.",
          "We share from our own lives and avoid fixing each other.",
          "Confidentiality matters, and I will explain the safety limits.",
        ],
        practice:
          "Write five group agreements in warm language, not rule-poster language.",
        commonTrap:
          "The trap is rushing agreements because everyone has heard them before. Agreements create the container.",
        mustKnow:
          "Group agreements should include confidentiality limits, choice to pass, respect, and safety.",
        quiz: q(
          "opening a peer group",
          "Set warm agreements including pass, privacy limits, respect, and safety.",
          "Skip agreements so the group feels casual and peer-led.",
          "Facilitate peer support, not group therapy.",
          "Promise full confidentiality no matter what is shared.",
          "Explain privacy and safety limits at the start.",
          "Let people share others' stories outside group if names are changed.",
          "Offer choices for participation, including passing.",
          "Require everyone to share so the group bonds."
        ),
      }),
      section("Keeping Groups Lively and Safe", {
        description: "Use structure without making the group stiff.",
        scene:
          "The group topic is coping with stress. Fifteen minutes later, two people are debating politics and one person has disappeared into their hoodie.",
        plainTalk:
          "Facilitation is gentle steering. You can reflect, summarize, invite quieter voices without putting them on the spot, and bring the group back to purpose. Structure can be playful: check-in question, pair share, draw it, stand-up stretch, one-word close.",
        trySaying: [
          "I am going to bring us back to stress tools so we use the time well.",
          "For anyone who has not spoken, you are welcome in, and passing is okay.",
          "Let's do a quick reset: one word for what you need right now.",
        ],
        practice:
          "Plan a 30-minute group with opening, activity, discussion, and closing.",
        commonTrap:
          "The trap is letting one strong voice become the group. Peer-led does not mean facilitator-absent.",
        mustKnow:
          "Facilitators protect purpose, participation choice, and emotional safety.",
        quiz: q(
          "a group drifting off topic",
          "Gently summarize and bring the group back to the agreed purpose.",
          "Let it drift because redirecting is controlling.",
          "Hold peer group structure without providing therapy.",
          "Analyze why a participant is withdrawing and process it publicly.",
          "Protect group privacy and avoid exposing personal details in redirection.",
          "Use someone's disclosure as an example without asking.",
          "Invite participation while making passing acceptable.",
          "Call on quiet people by name until they join."
        ),
      }),
      section("Conflict and Big Feelings in Group", {
        description: "Respond to tension without shaming or freezing.",
        scene:
          "One participant says, 'That is a terrible take.' Another stands up and says, 'I'm out.' Everyone watches you.",
        plainTalk:
          "Conflict in group is not failure. It is information that safety needs tending. Slow the pace, name the agreement, separate impact from intent, offer a reset, and route safety concerns if needed. You do not have to solve everyone's history in front of the circle.",
        trySaying: [
          "Let's pause. We can disagree without attacking each other.",
          "I want to check safety and give everyone a breath.",
          "You can step out, and I will check in according to our group plan.",
        ],
        practice:
          "Write a conflict pause script with breath, agreement, choice, and safety.",
        commonTrap:
          "The trap is either over-policing conflict or pretending it did not happen.",
        mustKnow:
          "Group conflict requires calm structure, agreements, choice, and safety routing when needed.",
        quiz: q(
          "conflict in a peer group",
          "Pause, restate agreements, offer reset choices, and check safety.",
          "Let participants work it out completely on their own.",
          "Facilitate safety and respect without doing therapy with the group.",
          "Diagnose who is triggered and why.",
          "Keep disclosures private while addressing behavior and safety.",
          "Tell the next group what happened so they are prepared.",
          "Offer choices like breath, break, reset, or stepping out safely.",
          "Remove choice because conflict means strict control is needed."
        ),
      }),
      section("Closing Groups With Care", {
        description: "End with grounding, next steps, and clean emotional exits.",
        scene:
          "A powerful story lands five minutes before the end. People are teary and nobody wants to leave abruptly.",
        plainTalk:
          "Closing helps people re-enter the world. Summarize themes, honor courage without spotlighting details, offer grounding, remind about support options, and give a small closing prompt. If someone needs follow-up, use the group safety plan and privacy rules.",
        trySaying: [
          "Let's take one grounding breath and name one thing we are taking with us.",
          "If anything feels too open after group, please check in before you leave.",
          "Thank you for protecting each other's stories.",
        ],
        practice:
          "Create three closing prompts: light, medium, and deep.",
        commonTrap:
          "The trap is ending right after heavy sharing because the clock says so. Build time to land.",
        mustKnow:
          "Group closings should protect privacy, grounding, and follow-up needs.",
        quiz: q(
          "closing after heavy sharing",
          "Ground the group, summarize themes, and invite follow-up support if needed.",
          "End immediately because time boundaries matter most.",
          "Close a peer group without processing trauma clinically.",
          "Ask everyone to give advice to the person who shared.",
          "Protect participant stories and follow privacy/safety policy.",
          "Email the group a recap with personal stories so learning continues.",
          "Offer choices for closing words, quiet, or checking in after group.",
          "Force everyone to share a takeaway."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Open groups with warm agreements.",
        "Use structure while keeping peer voice alive.",
        "Handle conflict and big feelings safely.",
        "Close groups with grounding and follow-up options.",
      ],
      [
        "Peer groups are not therapy groups.",
        "Pass is allowed.",
        "Confidentiality has safety limits.",
        "Conflict response uses agreements, not shame.",
      ],
      [
        "Give me your group opening agreements.",
        "How would you redirect a drifting group?",
        "What would you say during group conflict?",
        "How do you close after heavy sharing?",
        "How do you keep one voice from taking over?",
      ]
    ),
  },
  {
    slug: "resilience-efficacy",
    title: "Resilience and Self-Efficacy",
    description:
      "Help peers notice strengths, practice doable steps, recover after setbacks, and build confidence without cheerleading over pain.",
    estimatedHours: 3,
    oarReferences: ["OAR 950-060-0140 strengths-based support", "OAR 410-180 THW standards"],
    competencies: ["Strengths-based support", "Self-efficacy", "Setback planning", "Celebration"],
    peerNugget:
      "Self-efficacy is the feeling of, 'I can try one next thing.' Peer support helps that feeling grow honestly.",
    references: [...pwsCoreRefs, SAMHSA_RECOVERY],
    sections: [
      section("Strengths Without Toxic Positivity", {
        description: "Notice strengths while respecting pain.",
        scene:
          "A peer says, 'Don't tell me I'm strong. I'm tired of being strong.'",
        plainTalk:
          "Strengths-based support does not mean forcing a silver lining. It means noticing real survival, values, skills, relationships, and choices without denying what hurt. Sometimes the strength is still being here. Sometimes it is asking for a ride. Sometimes it is saying no.",
        trySaying: [
          "I hear you. You should not have had to be strong that way.",
          "Can I name something I noticed, and you can tell me if it fits?",
          "What got you through the last hour?",
        ],
        practice:
          "Write three affirmations that include reality, not glitter.",
        commonTrap:
          "The trap is cheerleading so hard that the peer feels unseen.",
        mustKnow:
          "Strengths-based support validates pain and names real strengths with permission.",
        quiz: q(
          "a peer tired of being called strong",
          "Validate the exhaustion and ask permission before naming a strength.",
          "Insist they are strong because positive thinking helps.",
          "Use strengths-based peer support without dismissing distress or providing therapy.",
          "Tell them their resilience proves they do not need more services.",
          "Keep personal stories and strengths private unless consent applies.",
          "Share their inspiring story with others to motivate the group.",
          "Let the peer decide whether an affirmation fits.",
          "Push celebration because staying sad is unhealthy."
        ),
      }),
      section("Small Wins That Count", {
        description: "Use doable steps to build confidence.",
        scene:
          "The peer's goal is 'get my life together.' That is a mountain. Today they might only have shoes and fifteen minutes.",
        plainTalk:
          "Self-efficacy grows through doable action. Shrink the step until the peer says, 'I could maybe do that.' A small win is not small if it breaks paralysis. The step should belong to the peer and connect to something they care about.",
        trySaying: [
          "What is the smallest version of that goal?",
          "What would count as a win by tonight?",
          "On a hard day, what step is still possible?",
        ],
        practice:
          "Turn three giant goals into five-minute, fifteen-minute, and one-call versions.",
        commonTrap:
          "The trap is making steps impressive instead of doable.",
        mustKnow:
          "Doable, peer-chosen steps build confidence more safely than huge pressured goals.",
        quiz: q(
          "a huge life goal",
          "Help shrink it into a peer-chosen doable next step.",
          "Set a challenging goal so the peer sees their potential.",
          "Coach practical next steps without becoming a clinician or case manager outside role.",
          "Decide the peer's low confidence means a diagnosis is worsening.",
          "Document goals and progress respectfully according to policy.",
          "Tell the team the peer lacks motivation if the step is small.",
          "Ask what would count as a win today.",
          "Choose the step that would impress the program."
        ),
      }),
      section("Setbacks Without Shame Spirals", {
        description: "Make room for learning after things go sideways.",
        scene:
          "A peer missed two goals and says, 'See? I always ruin it.'",
        plainTalk:
          "A setback is data, not a verdict. Peer support helps sort what happened: Was the step too big? Was support missing? Did shame take the wheel? Did the system throw a barrier? The question is not 'Why did you fail?' It is 'What did we learn?'",
        trySaying: [
          "This did not go how you wanted. It does not mean you are the problem.",
          "What got in the way, and what would make the next try kinder?",
          "Do you want to adjust the goal or rest before planning?",
        ],
        practice:
          "Write a setback debrief with three columns: what happened, what mattered, what next.",
        commonTrap:
          "The trap is rescuing from shame by saying the setback does not matter. It may matter. It just does not define them.",
        mustKnow:
          "Setback support uses curiosity, dignity, and adjusted planning.",
        quiz: q(
          "a peer missing goals",
          "Explore what got in the way and adjust the plan without shame.",
          "Tell them the goals were not important so they feel better.",
          "Support learning and planning without clinical interpretation.",
          "Label the setback as denial or resistance.",
          "Keep goal details private and document facts if needed.",
          "Tell staff the peer failed again without context or consent.",
          "Offer choices to adjust, rest, retry, or choose another step.",
          "Take over the plan because they lost confidence."
        ),
      }),
      section("Celebration and Credit", {
        description: "Help peers own progress without making it about you.",
        scene:
          "A peer gets their ID and says, 'I only did it because you pushed me.' It would feel nice to accept the credit.",
        plainTalk:
          "Celebration should return power to the peer. You can be glad. You can name effort. But do not become the reason they succeeded. Help them see what they did, who supported them, and how that strength can travel to the next hard thing.",
        trySaying: [
          "I walked with you, but you made the calls and showed up.",
          "What did you do that you want to remember next time?",
          "How do you want to mark this win?",
        ],
        practice:
          "Write a celebration statement that gives the peer the credit.",
        commonTrap:
          "The trap is becoming the magic helper in the story. That makes future wins depend on you.",
        mustKnow:
          "Celebrate in ways that build self-efficacy and peer ownership.",
        quiz: q(
          "celebrating a peer's win",
          "Reflect the peer's effort and ask how they want to mark the win.",
          "Accept the credit so they know you are dependable.",
          "Celebrate peer progress without creating dependence or false promises.",
          "Write that your intervention caused the success.",
          "Ask consent before sharing wins with team, group, or family.",
          "Announce the win publicly because it is positive.",
          "Help the peer name what they did and what support helped.",
          "Set the next bigger goal immediately so momentum is not lost."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Affirm strengths without minimizing pain.",
        "Build self-efficacy through small peer-chosen steps.",
        "Debrief setbacks without shame.",
        "Celebrate progress while giving credit back to the peer.",
      ],
      [
        "No toxic positivity.",
        "Steps must be doable and peer-owned.",
        "Setbacks are not moral failure.",
        "Celebration protects privacy and autonomy.",
      ],
      [
        "Give an affirmation that does not sound fake.",
        "Shrink a giant goal into a next step.",
        "How would you respond to 'I always ruin it'?",
        "Celebrate a win while giving credit back.",
        "How does self-efficacy differ from pressure?",
      ]
    ),
  },
  {
    slug: "advanced-mi-change",
    title: "Advanced MI and Change Conversations",
    description:
      "Deepen MI skills for discord, values, planning, confidence, and conversations where change feels risky.",
    estimatedHours: 4,
    oarReferences: ["OAR 950-060-0140 advanced engagement", "OAR 410-180 THW standards"],
    competencies: ["Advanced MI", "Discord", "Values exploration", "Change planning"],
    peerNugget:
      "Advanced MI is still humble. The fancier the tool, the more carefully we protect autonomy.",
    references: [...pwsCoreRefs, MOTIVATIONAL_INTERVIEWING_NETWORK],
    sections: [
      section("Discord Is a Signal", {
        description: "Notice when the conversation becomes a tug-of-war.",
        scene:
          "You say, 'Have you thought about treatment?' The peer leans back: 'There it is. Everybody wants to send me away.'",
        plainTalk:
          "Discord means tension in the working relationship. It is not a bad peer. It may mean you moved too fast, missed a value, sounded like the system, or touched a fear. Advanced practice means you soften, reflect, and return choice.",
        trySaying: [
          "That sounded like me pushing. Let me back up.",
          "You are tired of people deciding where you belong.",
          "What would be useful to talk about instead?",
        ],
        practice:
          "Write three 'back up' statements that repair a pushy moment.",
        commonTrap:
          "The trap is arguing with discord. Arguing usually proves the peer's point.",
        mustKnow:
          "Discord is repaired by slowing down, reflecting, and restoring autonomy.",
        quiz: q(
          "MI discord after a treatment suggestion",
          "Acknowledge the push, reflect the concern, and return choice.",
          "Explain why treatment is still the responsible option.",
          "Use MI-consistent repair without providing clinical treatment recommendations.",
          "Tell the peer their defensiveness shows they are not ready.",
          "Keep sensitive treatment conversation private according to consent and policy.",
          "Warn the team the peer is resistant without context.",
          "Ask what would be useful instead.",
          "Push harder because discord means the topic matters."
        ),
      }),
      section("Values, Not Lectures", {
        description: "Connect change talk to what the peer already cares about.",
        scene:
          "A peer says, 'I do not care what happens to me.' Ten minutes later they light up talking about their niece.",
        plainTalk:
          "Values are the things that still matter under the mess: family, freedom, faith, pets, music, dignity, culture, work, health, justice, peace. Values conversations are not lectures about priorities. They are invitations to notice what the peer already protects.",
        trySaying: [
          "When you talk about your niece, your voice changes.",
          "What does being the kind of uncle you want to be look like this week?",
          "How, if at all, does this choice connect to that value?",
        ],
        practice:
          "Listen for one value in a peer statement and reflect it without adding advice.",
        commonTrap:
          "The trap is using values as leverage: 'If you cared about family, you would...' That is shame, not MI.",
        mustKnow:
          "Values exploration draws out meaning without using values as pressure.",
        quiz: q(
          "connecting change to values",
          "Reflect the value you heard and ask how it connects, if at all.",
          "Use the value to prove they should change.",
          "Explore values as peer conversation, not clinical therapy.",
          "Interpret their values conflict as a diagnosis.",
          "Protect family and personal details shared in values work.",
          "Call the niece to motivate the peer without consent.",
          "Let the peer decide whether the value matters to the next step.",
          "Tell them the value should be enough motivation."
        ),
      }),
      section("Confidence Rulers That Do Not Shame", {
        description: "Use scaling questions to find supports, not judge readiness.",
        scene:
          "You ask, 'How confident are you?' The peer says, 'Two. So I guess that's bad.'",
        plainTalk:
          "A confidence ruler is a 0-to-10 question that helps explore what makes change possible. The magic is not the number. The magic is the follow-up: 'Why a two and not a zero?' That question finds strengths. Then ask what could move it one point.",
        trySaying: [
          "Two is not bad. What makes it a two instead of zero?",
          "What would help it move to a three?",
          "Who or what has helped your confidence before?",
        ],
        practice:
          "Practice three follow-up questions after a low confidence number.",
        commonTrap:
          "The trap is treating low confidence as lack of motivation. Low confidence often points to missing support.",
        mustKnow:
          "Scaling questions should uncover strengths and supports, not grade the peer.",
        quiz: q(
          "a low confidence score",
          "Ask why it is not lower and what might move it one point.",
          "Tell them a two means the goal is not worth trying.",
          "Use scaling as peer support, not a clinical assessment tool.",
          "Record the number as proof of clinical readiness.",
          "Keep confidence details private and document only as appropriate.",
          "Tell the team the peer has only two percent motivation.",
          "Offer choices for supports that might raise confidence.",
          "Set a harder goal to raise confidence faster."
        ),
      }),
      section("From Talk to Plan", {
        description: "Move toward action only after the peer is ready enough.",
        scene:
          "After a long conversation, the peer says, 'Maybe I could call tomorrow.' That is a small door opening.",
        plainTalk:
          "Planning in MI is not grabbing the steering wheel. It is asking whether the person wants to make a plan, making it specific enough to try, and checking barriers. If the plan belongs to you, it probably will not travel home with them.",
        trySaying: [
          "Do you want to turn that maybe into a tiny plan?",
          "When tomorrow would be least awful to call?",
          "What could get in the way, and what would help?",
        ],
        practice:
          "Make a plan sentence with what, when, support, and backup.",
        commonTrap:
          "The trap is planning too early because change talk feels exciting.",
        mustKnow:
          "Action plans should be invited, specific, peer-owned, and realistic.",
        quiz: q(
          "turning change talk into a plan",
          "Ask if they want to plan, then make the step specific and realistic.",
          "Immediately schedule the call for them because momentum matters.",
          "Support peer-owned action planning without prescribing treatment.",
          "Create a clinical goal with compliance measures.",
          "Share the plan only with consent and program purpose.",
          "Tell providers about the plan before the peer decides.",
          "Ask about timing, barriers, support, and backup choices.",
          "Make the plan ambitious so they feel inspired."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Repair discord and restore autonomy.",
        "Explore values without shame.",
        "Use confidence rulers to find supports.",
        "Invite realistic peer-owned plans.",
      ],
      [
        "No MI manipulation.",
        "No clinical readiness labels.",
        "Planning waits for consent.",
        "Discord is a relationship signal, not a character flaw.",
      ],
      [
        "Show me how you repair a pushy moment.",
        "Reflect a value without using it as pressure.",
        "What do you ask after a confidence score of two?",
        "Turn 'maybe I could call' into a peer-owned plan.",
        "How do you know you are arguing instead of evoking?",
      ]
    ),
  },
  {
    slug: "health-promotion",
    title: "Health Promotion for Whole-Person Wellness",
    description:
      "Support everyday health goals, medical visits, pain, sleep, movement, medications, and prevention while staying non-clinical.",
    estimatedHours: 4,
    oarReferences: ["OAR 950-060-0140 health promotion", "OAR 410-180 THW standards"],
    competencies: ["Whole health", "Medical navigation", "Health goals", "Scope with providers"],
    peerNugget:
      "Whole health support is not telling people to be healthier. It is helping health goals fit real life.",
    references: [...pwsCoreRefs, OREGON_HEALTH_PLAN],
    sections: [
      section("Whole Health Starts With Real Life", {
        description: "Connect health goals to housing, food, sleep, pain, culture, and stress.",
        scene:
          "A peer's doctor told them to walk daily. They are sleeping in a car and keeping their belongings safe all day.",
        plainTalk:
          "Health advice can sound simple when life is stable. PWS support puts advice in context. Walking, food, medication, appointments, sleep, and stress all live inside transportation, safety, money, trauma, disability, and culture. Start with what is possible.",
        trySaying: [
          "What did the doctor suggest, and what part feels realistic right now?",
          "What would make that health goal fit your actual day?",
          "Do you want help turning it into a smaller step or a question for the doctor?",
        ],
        practice:
          "Take one health recommendation and name three real-life barriers and supports.",
        commonTrap:
          "The trap is repeating health advice like the barrier is information. Often the barrier is life.",
        mustKnow:
          "PWS health promotion supports realistic goals but does not provide medical advice.",
        quiz: q(
          "a health recommendation that does not fit life",
          "Ask what feels realistic and help prepare questions or smaller steps.",
          "Repeat the doctor's advice firmly because health is important.",
          "Support health navigation without diagnosing, prescribing, or changing medical advice.",
          "Tell the peer the doctor is wrong and suggest a better plan.",
          "Keep health information private and share only with consent or policy.",
          "Call the doctor with personal details before the peer agrees.",
          "Offer choices like smaller step, questions, or resource support.",
          "Decide the health goal for them because the doctor already advised it."
        ),
      }),
      section("Preparing for Medical Visits", {
        description: "Help peers use appointments without speaking for them.",
        scene:
          "A peer has seven minutes with a provider and fourteen worries. They say, 'I always forget what I meant to ask.'",
        plainTalk:
          "A PWS can help prepare: write top questions, list medications as the peer reports them, practice saying concerns, plan transportation, ask about interpreter or disability access, and debrief afterward. You can attend with consent and role clarity, but the peer's voice leads.",
        trySaying: [
          "What are the top two things you want the provider to hear?",
          "Do you want to practice saying it out loud?",
          "If I come with you, how do you want me to support your voice?",
        ],
        practice:
          "Create a one-page appointment prep sheet with top concerns, questions, and follow-up.",
        commonTrap:
          "The trap is becoming the spokesperson because appointments are intimidating.",
        mustKnow:
          "Medical visit support requires consent, role clarity, and no medical advice.",
        quiz: q(
          "preparing for a medical visit",
          "Help list questions and ask how the peer wants support.",
          "Plan to speak for the peer so nothing is missed.",
          "Support appointment preparation without giving medical advice.",
          "Recommend medication changes to ask for.",
          "Use consent before attending visits or sharing health details.",
          "Send the provider a long update without a release.",
          "Offer choices: prep questions, roleplay, attend with consent, or debrief.",
          "Take over because providers listen better to workers."
        ),
      }),
      section("Medication Conversations Without Prescribing", {
        description: "Support questions, routines, and provider communication.",
        scene:
          "A peer says, 'These meds make me feel weird. Should I stop?' You know how scary side effects can feel.",
        plainTalk:
          "Peers do not tell people to start, stop, raise, lower, or skip medication. We can support the peer to track what they notice, call the prescriber, ask about side effects, plan reminders, and talk through fears. Medication choices belong with the peer and qualified medical provider.",
        trySaying: [
          "I cannot advise you to stop or change meds, but I can help you contact the prescriber.",
          "Want to write down what you are noticing and when it happens?",
          "What would make it easier to ask your provider directly?",
        ],
        practice:
          "Write a medication boundary sentence plus two support options.",
        commonTrap:
          "The trap is sharing what worked for your meds in a way that sounds like advice.",
        mustKnow:
          "Do not give medication advice. Help the peer communicate with qualified providers.",
        quiz: q(
          "a medication side-effect question",
          "State you cannot advise changes and help contact the prescriber.",
          "Share whether stopping worked for you so they can decide.",
          "Support tracking and provider communication without prescribing.",
          "Tell them to skip one dose and see if it improves.",
          "Protect medication information and use releases for provider contact.",
          "Discuss their medication question with family without consent.",
          "Offer choices like calling provider, writing symptoms, or preparing questions.",
          "Decide the safest medication choice because delay is risky."
        ),
      }),
      section("Prevention, Screening, and Follow-Through", {
        description: "Support preventive care without shaming bodies or choices.",
        scene:
          "A peer tosses a screening reminder in the trash: 'Last time they treated me like a problem.'",
        plainTalk:
          "Preventive care can bring up trauma, stigma, body shame, racism, transphobia, disability barriers, and past medical harm. PWS support names those realities and helps the peer decide what, if anything, they want next: questions, a different provider, support person, complaint process, or waiting.",
        trySaying: [
          "That reminder may be simple paper, but your last experience was not simple.",
          "Do you want to talk through options or leave it alone for today?",
          "What would need to be different for that appointment to feel safer?",
        ],
        practice:
          "Make a prevention-support menu that includes access, questions, support person, and no-pressure pause.",
        commonTrap:
          "The trap is using fear to motivate preventive care. Fear may already be the barrier.",
        mustKnow:
          "Preventive care support should be trauma-informed, culturally responsive, and choice-based.",
        quiz: q(
          "a preventive screening reminder",
          "Validate past harm and ask what option, if any, they want to explore.",
          "Warn them about worst-case outcomes so they take it seriously.",
          "Support preventive care navigation without medical pressure or advice.",
          "Decide the screening is medically required and schedule it.",
          "Share screening information only with consent and policy support.",
          "Tell the clinic the peer refuses care without asking why.",
          "Offer choices including questions, different provider, support person, or pause.",
          "Push through discomfort because prevention matters."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Support realistic whole-health goals.",
        "Help peers prepare for medical visits.",
        "Handle medication questions within scope.",
        "Approach prevention with choice and trauma awareness.",
      ],
      [
        "No medical advice or medication changes.",
        "Consent before provider communication.",
        "Health goals must fit real life.",
        "Prevention support does not use shame.",
      ],
      [
        "How do you respond to unrealistic health advice?",
        "Prep a peer for a seven-minute medical visit.",
        "What do you say about medication side effects?",
        "How do you support preventive care after medical harm?",
        "Where is the PWS scope line in health promotion?",
      ]
    ),
  },
  {
    slug: "teams-supervision",
    title: "Teams, Huddles, and Supervision",
    description:
      "Work in multidisciplinary teams while protecting peer identity, using supervision, and communicating clearly.",
    estimatedHours: 4,
    oarReferences: ["OAR 950-060-0140 team collaboration", "OAR 410-180 THW standards"],
    competencies: ["Team collaboration", "Supervision", "Peer role advocacy", "Huddle communication"],
    peerNugget:
      "On a team, your peer voice is not less professional because it is plain. It is the point.",
    references: [...pwsCoreRefs, HHS_HIPAA],
    sections: [
      section("Bringing Peer Voice to the Team", {
        description: "Speak in team spaces without becoming a junior clinician.",
        scene:
          "In huddle, everyone uses clinical shorthand. You know the peer said, 'I just want one quiet night.'",
        plainTalk:
          "PWS team communication should add what peer work sees best: goals in the person's words, barriers, strengths, consent, culture, and what support the peer wants. You do not need to mimic clinical language to be credible.",
        trySaying: [
          "In the peer's words, the priority is one quiet night of sleep.",
          "They gave consent for me to share the transportation barrier.",
          "Can we make sure the plan includes what they said matters most?",
        ],
        practice:
          "Write a huddle update with peer words, consent, barrier, strength, and next step.",
        commonTrap:
          "The trap is translating the peer into clinical language until their voice disappears.",
        mustKnow:
          "Team updates should preserve peer voice, consent, and scope.",
        quiz: q(
          "a clinical team huddle",
          "Share peer-stated goals and consented barriers in plain language.",
          "Use clinical guesses so the team takes your update seriously.",
          "Collaborate on teams while staying in the peer role.",
          "Diagnose the peer's motivation for the team.",
          "Share only what consent, role, and policy allow.",
          "Bring up private details because huddles are internal.",
          "Ask the team to include the peer's stated priority.",
          "Let the team decide the priority because they know services."
        ),
      }),
      section("Supervision for Complex Settings", {
        description: "Bring scope, ethics, safety, and team tension into supervision.",
        scene:
          "A nurse asks you to convince a peer to accept a plan. The plan may help, but 'convince' feels wrong.",
        plainTalk:
          "Complex settings create role pressure. Supervision helps you sort requests that sound helpful but may undermine peer choice. Bring the exact ask, the peer's stated preference, your worry, and what policy says.",
        trySaying: [
          "I want supervision on a team request that may put me in a persuader role.",
          "The peer's stated choice is different from the team's recommendation.",
          "How do I advocate and collaborate without pressuring?",
        ],
        practice:
          "Create a supervision note: situation, scope question, ethics question, proposed next step.",
        commonTrap:
          "The trap is saying yes to team requests to prove peers belong on the team.",
        mustKnow:
          "Supervision protects peer role integrity in complex team settings.",
        quiz: q(
          "a team asking you to persuade a peer",
          "Bring the request to supervision and clarify peer choice and scope.",
          "Persuade the peer because the team plan is probably best.",
          "Collaborate with teams without coercion or clinical authority.",
          "Tell the peer the team will discharge them unless they agree.",
          "Discuss only necessary information through proper team/supervision channels.",
          "Share the team conflict with the peer in a blaming way.",
          "Look for options that preserve informed peer choice.",
          "Refuse all team collaboration because peer work must be separate."
        ),
      }),
      section("Clean Handoffs and Closed Loops", {
        description: "Make sure support does not disappear between people.",
        scene:
          "You leave a message for a housing partner. The peer thinks you handled it. The partner never calls back.",
        plainTalk:
          "Closed-loop communication means everyone knows who is doing what by when, and someone checks whether it happened. It reduces dropped balls without making you responsible for everything. Write it down. Confirm consent. Follow up realistically.",
        trySaying: [
          "I will call today and tell you by Friday whether I reached them.",
          "If I do not reach them, what do you want our backup step to be?",
          "Let's write who is doing what so it does not live in our heads.",
        ],
        practice:
          "Draft a closed-loop plan with task, person, deadline, backup, and privacy note.",
        commonTrap:
          "The trap is assuming a referral happened because you sent a message.",
        mustKnow:
          "Closed loops clarify responsibility without overpromising outcomes.",
        quiz: q(
          "a handoff to a partner agency",
          "Clarify who does what, by when, with backup and consent.",
          "Tell the peer it is handled after leaving one message.",
          "Coordinate handoffs without guaranteeing partner response.",
          "Sign forms for the peer so the handoff moves faster.",
          "Use releases and minimum necessary information for partner contact.",
          "Send full background to the partner so they understand urgency.",
          "Offer choices for backup steps if the partner does not respond.",
          "Take responsibility for all partner follow-up indefinitely."
        ),
      }),
      section("When Team Culture Hurts Peer Work", {
        description: "Respond when systems drift into stigma, coercion, or burnout.",
        scene:
          "A staff member jokes, 'Our frequent flyers are back.' People laugh. You know the peer in the lobby heard it.",
        plainTalk:
          "Team culture can heal or harm. PWS workers can interrupt stigma, ask for person-centered language, and bring concerns to supervision or leadership. Do it with courage and strategy. You are not there to shame coworkers; you are there to protect dignity and improve care.",
        trySaying: [
          "Can we use language we would be comfortable with the peer hearing?",
          "I am concerned that phrase could increase shame.",
          "I want to bring this to supervision because it affects peer trust.",
        ],
        practice:
          "Write two ways to interrupt stigmatizing team language: one in the moment, one in supervision.",
        commonTrap:
          "The trap is becoming either silent or explosive. Strategy helps your advocacy land.",
        mustKnow:
          "Peer role advocacy includes challenging stigma through appropriate team and supervision channels.",
        quiz: q(
          "stigmatizing team language",
          "Redirect to dignity-centered language and use supervision if needed.",
          "Ignore it because team humor helps burnout.",
          "Advocate for peer dignity while staying professional and within role.",
          "Publicly diagnose the coworker as biased.",
          "Protect peer privacy while addressing the harmful language.",
          "Tell the peer exactly who joked so they can complain.",
          "Choose an in-the-moment or supervision path based on safety and impact.",
          "Shame the staff member so the message is clear."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Bring peer voice into team spaces.",
        "Use supervision for role pressure.",
        "Make clean handoffs and closed loops.",
        "Challenge team stigma strategically.",
      ],
      [
        "Do not become a junior clinician.",
        "Consent guides team sharing.",
        "Supervision protects role and safety.",
        "Closed loops do not guarantee outcomes.",
      ],
      [
        "Give a huddle update in peer voice.",
        "What do you do if a team asks you to persuade?",
        "Build a closed-loop handoff.",
        "How would you interrupt stigmatizing team language?",
        "How do you collaborate without losing peer identity?",
      ]
    ),
  },
  {
    slug: "sdoh-partnerships",
    title: "Social Drivers and Community Partnerships",
    description:
      "Understand social drivers of health, build community partnerships, and support practical needs without blaming people for barriers.",
    estimatedHours: 4,
    oarReferences: ["OAR 950-060-0140 community resources", "OAR 410-180 THW standards"],
    competencies: ["Social drivers of health", "Partnerships", "Community navigation", "Barrier reduction"],
    peerNugget:
      "Social drivers are the life conditions around a person. Peer support names the barriers without making the person the barrier.",
    references: [...pwsCoreRefs, CDC_SOCIAL_DETERMINANTS, OREGON_211],
    sections: [
      section("Social Drivers in Plain Language", {
        description: "Talk about housing, food, transport, safety, and money without jargon.",
        scene:
          "A provider says 'SDOH.' The peer hears alphabet soup. What they know is the bus does not run after 6.",
        plainTalk:
          "Social drivers of health, sometimes called SDOH, are the conditions around a person's life that affect health: housing, food, income, transportation, racism, safety, education, community, and access to care. In plain language: life stuff affects wellness.",
        trySaying: [
          "Life stuff affects health. Transportation is part of the health plan here.",
          "What outside stress is making the health goal harder?",
          "Do you want to map barriers and supports together?",
        ],
        practice:
          "Translate SDOH into a sentence you could say at a bus stop.",
        commonTrap:
          "The trap is using the concept to sound smart while the peer still needs a ride.",
        mustKnow:
          "Social drivers are real barriers and supports, not personal failures.",
        quiz: q(
          "explaining social drivers of health",
          "Say life conditions like housing, food, and transportation affect wellness.",
          "Use the acronym repeatedly so the peer learns professional language.",
          "Support barrier navigation without making clinical or eligibility decisions.",
          "Tell the peer their health problem is caused by poverty.",
          "Protect private information about income, housing, and safety.",
          "Share barrier details broadly because everyone knows SDOH matters.",
          "Ask which barrier they want to map first.",
          "Choose the barrier the care team thinks matters most."
        ),
      }),
      section("Partnerships That Do Not Become Promises", {
        description: "Work with community partners while staying honest about limits.",
        scene:
          "A new partner says they can help with phones, but the supply changes every week. The peer needs one now.",
        plainTalk:
          "Partnerships are relationships, not vending machines. They work best when you know eligibility basics, contact routes, response times, and limits. Be hopeful and honest. 'We can ask' is cleaner than 'They will help.'",
        trySaying: [
          "This partner sometimes has phones. I cannot promise supply, but we can check.",
          "Let's ask what they need and what the backup option is.",
          "Do you want me to make the connection with you present?",
        ],
        practice:
          "Make a partner cheat sheet: what they offer, who qualifies, how to contact, what not to promise.",
        commonTrap:
          "The trap is overselling a partner because you want relief for the peer.",
        mustKnow:
          "Partnership navigation requires accurate limits, consent, and backup planning.",
        quiz: q(
          "a partner with limited supplies",
          "Explain the possibility and limits, then check with consent and backup options.",
          "Promise the phone because the partner usually comes through.",
          "Coordinate partner support without guaranteeing resources.",
          "Tell the partner the peer qualifies before confirming criteria.",
          "Share only necessary information with the partner and with consent.",
          "Send the partner the peer's whole story to improve chances.",
          "Offer choices for contacting the partner or trying backups.",
          "Decide the partner path is the only useful option."
        ),
      }),
      section("No Wrong Door, Still Real Limits", {
        description: "Welcome needs warmly even when your program cannot meet them.",
        scene:
          "Someone comes to a wellness program asking for diapers, a bus pass, and help with a shutoff notice. None of those are on your program flyer.",
        plainTalk:
          "No wrong door means people should not be shamed for asking in the wrong place. It does not mean your program can do everything. A PWS can welcome the need, clarify what is available, and connect to better-fit supports.",
        trySaying: [
          "You came to a fine place to ask. We may need a partner for parts of this.",
          "Here is what I can help with here, and here is what we can look for together.",
          "Which need feels most urgent before the end of today?",
        ],
        practice:
          "Write a no-wrong-door response for a need your program cannot directly meet.",
        commonTrap:
          "The trap is feeling guilty and quietly doing work your program is not set up to do.",
        mustKnow:
          "Welcome the ask, name real limits, and connect to appropriate resources.",
        quiz: q(
          "needs outside your program's services",
          "Welcome the ask, name limits, and help connect to appropriate resources.",
          "Say they came to the wrong program and give the front desk number.",
          "Navigate resources without promising services or going outside role.",
          "Approve emergency funds that you do not control.",
          "Protect private details while making referrals.",
          "Tell partner agencies everything because the needs are urgent.",
          "Ask which need is most urgent and offer resource options.",
          "Take all tasks personally so the person is not bounced around."
        ),
      }),
      section("Community Trust and Follow-Back", {
        description: "Treat partners and peers with reliability.",
        scene:
          "A community pantry says your program keeps sending people after hours. The peers arrive embarrassed and hungry.",
        plainTalk:
          "Partnership trust is built through accurate information and follow-back. If hours change, update the resource list. If a referral goes badly, learn from it. If a partner makes a mistake, address it without burning the bridge unless safety or dignity requires escalation.",
        trySaying: [
          "Thank you for telling us. We need to update our information.",
          "I am sorry we sent you when they were closed. Let's find the next option.",
          "Can we confirm the best referral steps so peers are not turned away?",
        ],
        practice:
          "Create a resource-update habit: check date, contact person, eligibility, and peer feedback.",
        commonTrap:
          "The trap is treating resource lists like they stay true forever.",
        mustKnow:
          "Reliable partnerships require updated information, accountability, and respectful repair.",
        quiz: q(
          "a resource list sending peers to closed services",
          "Apologize, update information, and confirm accurate referral steps.",
          "Blame the partner because they should have clearer hours.",
          "Maintain partnerships and resource accuracy without guaranteeing access.",
          "Tell peers the pantry failed them so they know who is at fault.",
          "Share peer feedback without unnecessary identifying details.",
          "Send names of everyone affected so the pantry understands impact.",
          "Offer updated options and ask what the peer wants next.",
          "Stop using the partner forever after one mistake."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Explain social drivers in plain language.",
        "Use partners without overpromising.",
        "Practice no-wrong-door support with limits.",
        "Maintain community trust through accurate follow-back.",
      ],
      [
        "Do not blame people for structural barriers.",
        "Partnerships are not promises.",
        "Consent and minimum information guide referrals.",
        "Resource lists need updating.",
      ],
      [
        "Translate SDOH for a peer.",
        "How do you describe a partner with limited supplies?",
        "Give a no-wrong-door response.",
        "What do you do when a resource list is wrong?",
        "How can peers advocate around barriers without taking over?",
      ]
    ),
  },
  {
    slug: "housing-benefits-deep",
    title: "Housing and Benefits Deep Dive",
    description:
      "Go deeper on housing systems, benefits letters, coordinated entry, documentation support, and advocacy with clean legal boundaries.",
    estimatedHours: 4,
    oarReferences: ["OAR 950-060-0140 housing and benefits navigation", "OAR 410-180 THW standards"],
    competencies: ["Housing navigation", "Benefits support", "Coordinated entry basics", "Legal scope"],
    peerNugget:
      "Housing and benefits work can feel like decoding a locked door. Your job is to help with the keys you actually hold.",
    references: [...pwsCoreRefs, HUD_EXCHANGE_COC, OREGON_211, OREGON_HEALTH_PLAN],
    sections: [
      section("Housing Systems Without False Hope", {
        description: "Explain waitlists, eligibility, and options honestly.",
        scene:
          "A peer asks, 'If I do this assessment, will I get housing?' You know the honest answer is complicated.",
        plainTalk:
          "Housing systems often include shelters, outreach, coordinated entry, transitional housing, vouchers, supportive housing, and local waitlists. Coordinated entry is a community process for connecting people to homelessness resources. It is not a guarantee. Honest navigation protects trust.",
        trySaying: [
          "This assessment can help connect you to options, but it does not guarantee housing.",
          "Let's ask what the next step and timeline usually look like.",
          "Do you want to look at backup safety options while we wait?",
        ],
        practice:
          "Write a no-false-hope explanation of coordinated entry.",
        commonTrap:
          "The trap is making the system sound more certain than it is because uncertainty feels cruel.",
        mustKnow:
          "Housing navigation should be accurate about eligibility, waitlists, and limits.",
        quiz: q(
          "explaining coordinated entry",
          "Explain it may connect to options but does not guarantee housing.",
          "Say the assessment will get them housed if they answer correctly.",
          "Navigate housing systems without giving legal advice or guaranteeing placement.",
          "Decide which housing program must accept them.",
          "Share housing vulnerability information only with consent and policy.",
          "Send assessment details to multiple partners without releases.",
          "Offer backup safety options and next-step choices.",
          "Tell them not to try if waitlists are long."
        ),
      }),
      section("Benefits Letters and Deadlines", {
        description: "Turn scary mail into next steps without practicing law.",
        scene:
          "The peer brings three unopened letters. One says 'action required' in bold. They say, 'I can't look.'",
        plainTalk:
          "Benefits mail can trigger panic. A PWS can sit beside the peer, open one letter at a time if they want, find deadlines, highlight contact information, help write questions, and connect to benefits specialists or legal aid. Do not interpret rights or advise appeals as if you are a lawyer.",
        trySaying: [
          "We can open one at a time, and you can stop whenever you need.",
          "Let's find the deadline and the phone number first.",
          "I cannot give legal advice, but I can help connect you to someone who can.",
        ],
        practice:
          "Make a benefits-letter checklist: deadline, action, contact, documents, support referral.",
        commonTrap:
          "The trap is reading fast and taking over because the deadline scares you too.",
        mustKnow:
          "Support benefits navigation and deadlines; route legal rights and appeals to qualified help.",
        quiz: q(
          "scary benefits letters",
          "Help identify deadlines and contacts, then route legal questions to qualified help.",
          "Tell them whether to appeal based on what seems fair.",
          "Support paperwork navigation without legal advice.",
          "Interpret the law behind the denial notice.",
          "Handle benefit information privately and with consent.",
          "Copy letters to anyone who might help without asking.",
          "Offer choices about opening, pausing, calling, or finding legal aid.",
          "Open and handle all letters yourself to reduce their stress."
        ),
      }),
      section("Documents, IDs, and Proof", {
        description: "Help gather paperwork without becoming the keeper of someone’s life.",
        scene:
          "A housing application needs ID, birth certificate, income proof, and a disability verification. The peer says, 'I lose everything.'",
        plainTalk:
          "Documents are power in system life. PWS support can include checklists, safe storage ideas, appointment prep, replacement ID steps, and asking agencies what alternatives they accept. Keep copies only according to policy and consent.",
        trySaying: [
          "Let's make a document list and mark what you already have.",
          "Where would feel safe and realistic to keep copies?",
          "We can ask the agency what alternatives they accept.",
        ],
        practice:
          "Create a document-gathering plan with consent, storage, and backup options.",
        commonTrap:
          "The trap is holding documents for the peer casually. That can create privacy and power problems.",
        mustKnow:
          "Documents require consent, secure handling, and realistic storage planning.",
        quiz: q(
          "gathering documents for housing",
          "Make a checklist and plan secure handling with consent.",
          "Keep copies on your personal phone so they are not lost.",
          "Support document navigation without controlling the peer's records.",
          "Sign verification forms on behalf of providers.",
          "Store or share documents only according to policy and consent.",
          "Email documents through personal accounts for convenience.",
          "Offer choices for storage, replacement steps, and agency questions.",
          "Take over document management because the peer loses things."
        ),
      }),
      section("Advocacy When Systems Say No", {
        description: "Respond to denials, delays, and unfair treatment with strategy.",
        scene:
          "The housing worker says the peer is ineligible. The peer shuts down. You feel anger rising.",
        plainTalk:
          "A denial may be correct, mistaken, incomplete, discriminatory, or appealable. PWS advocacy starts with facts: what was decided, why, what deadline, what options, what support, what consent. Strong advocacy can be calm and fierce at the same time.",
        trySaying: [
          "Can we ask for the reason in writing and any appeal or review steps?",
          "I cannot give legal advice, but I can help you connect to an advocate.",
          "Do you want me to help ask questions, or do you want to speak first?",
        ],
        practice:
          "Write three advocacy questions for a denial: reason, deadline, next option.",
        commonTrap:
          "The trap is letting anger write checks your role cannot cash.",
        mustKnow:
          "Advocacy uses facts, consent, documentation, and legal/resource referrals when needed.",
        quiz: q(
          "a housing denial",
          "Ask for reasons, deadlines, and options with the peer's consent.",
          "Accuse the worker immediately so they take the denial seriously.",
          "Advocate and navigate without legal representation or guarantees.",
          "Tell the peer the denial is illegal.",
          "Share only necessary information and document advocacy steps factually.",
          "Reveal private hardships to pressure the worker without consent.",
          "Ask whether the peer wants to speak, have support, or pause.",
          "Take over because the peer shut down."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Explain housing systems without false hope.",
        "Support benefits letters and deadlines within scope.",
        "Handle documents with consent and security.",
        "Advocate around denials using facts and referrals.",
      ],
      [
        "No housing, benefits, or legal guarantees.",
        "No legal advice.",
        "Documents and vulnerability details are private.",
        "Advocacy is with the peer, not over them.",
      ],
      [
        "Explain coordinated entry honestly.",
        "What do you do with a scary benefits letter?",
        "How do you support document gathering safely?",
        "Respond to a housing denial.",
        "Where is the legal scope line in benefits advocacy?",
      ]
    ),
  },
  {
    slug: "pws-capstone",
    title: "PWS Capstone Practice",
    description:
      "Integrate PSS and PWS skills in whole-person scenarios with wellness, addiction recovery, health, housing, teams, and instructor review.",
    estimatedHours: 4,
    oarReferences: ["OAR 950-060-0140 applied PWS competency", "OAR 410-180 THW standards"],
    competencies: ["Integrated PWS practice", "Capstone roleplay", "Whole-person planning", "Instructor readiness"],
    peerNugget:
      "Capstone is not about sounding advanced. It is about staying peer while the situation gets complex.",
    references: [...pwsCoreRefs, SAMHSA_TRAUMA, CDC_SOCIAL_DETERMINANTS],
    sections: [
      section("Whole-Person Case Mapping", {
        description: "Hold complexity without turning the peer into a project.",
        scene:
          "The capstone peer has diabetes concerns, recent return to use, shelter stress, a court date, and a sister who wants updates.",
        plainTalk:
          "Whole-person mapping helps you see connections without taking over. Put the peer's stated priority in the center. Then map health, recovery, housing, legal, family, culture, safety, strengths, and partners. The map is for orientation, not control.",
        trySaying: [
          "There are a lot of moving pieces. What feels most important to you today?",
          "Can we map this so it feels less tangled?",
          "Which parts do you want support with, and which parts are private for now?",
        ],
        practice:
          "Build a capstone map with priority, strengths, risks, supports, and scope lines.",
        commonTrap:
          "The trap is treating a complex life like a case to manage instead of a person to partner with.",
        mustKnow:
          "Whole-person practice centers the peer's priority and keeps clear scope lines.",
        quiz: q(
          "a complex whole-person scenario",
          "Ask the peer's priority and map supports, risks, and scope with consent.",
          "Start with the highest medical risk because it matters most objectively.",
          "Integrate PWS support while routing medical, legal, clinical, and crisis needs.",
          "Create a master treatment plan for all issues.",
          "Ask consent before involving family or partners and protect private details.",
          "Update the sister because she is worried and involved.",
          "Offer choices about what to map and what to keep private.",
          "Take control because complexity can overwhelm the peer."
        ),
      }),
      section("Capstone Conversation Flow", {
        description: "Open, focus, support, route, and close a complex conversation.",
        scene:
          "In roleplay, the peer changes topics quickly. You can feel yourself wanting to chase every need.",
        plainTalk:
          "A strong PWS conversation has a flow: warm opening, role clarity, peer priority, reflection, menu of support, scope routing, next step, and closing. You may touch several topics, but one peer-chosen next step usually beats ten half-started fixes.",
        trySaying: [
          "Let me pause us and make sure I am following what matters most.",
          "That part sounds medical, so my role is to help you prepare for the provider, not answer it myself.",
          "What next step do you want to leave with today?",
        ],
        practice:
          "Practice a seven-minute capstone flow and mark each scope-routing moment.",
        commonTrap:
          "The trap is trying to prove advanced skill by covering everything.",
        mustKnow:
          "Complex conversations still need role clarity, peer priority, scope routing, and a realistic close.",
        quiz: q(
          "a fast-moving capstone roleplay",
          "Pause, reflect priorities, route scope issues, and choose one next step.",
          "Cover every issue so the instructor sees your knowledge.",
          "Use PWS skills without answering medical, legal, or clinical questions.",
          "Give quick advice on each issue to maintain momentum.",
          "Protect privacy when discussing partners, family, and records.",
          "Share all issues in documentation even if irrelevant.",
          "Let the peer choose the next step to leave with.",
          "Choose the safest-looking next step without asking."
        ),
      }),
      section("Documentation and Team Handoff", {
        description: "Write and communicate capstone work clearly.",
        scene:
          "After the practice, you need to brief a supervisor: enough information to support continuity, not every detail from the peer's life.",
        plainTalk:
          "Capstone documentation should show peer voice, facts, consent, support provided, referrals or routing, safety steps, and the peer-chosen next step. A team handoff should be even shorter: what matters, what is allowed to share, who does what next.",
        trySaying: [
          "Peer stated housing safety is today's priority.",
          "With consent, PWS will help prepare questions for clinic appointment.",
          "Safety concern was routed according to program protocol.",
        ],
        practice:
          "Write a capstone note and a three-sentence team handoff from the same scenario.",
        commonTrap:
          "The trap is writing a novel to prove you noticed everything.",
        mustKnow:
          "Capstone notes and handoffs should be factual, consent-aware, and scope-clean.",
        quiz: q(
          "capstone documentation and handoff",
          "Document facts, consent, support, routing, and peer-chosen next step.",
          "Include every detail so the instructor knows you listened.",
          "Write PWS notes without clinical assessment or legal conclusions.",
          "State your diagnosis of the main problem.",
          "Share only what is needed and allowed for continuity.",
          "Tell the team private details because capstone cases are complex.",
          "Confirm what the peer agreed to share in the handoff.",
          "Make the handoff plan yourself because teams need clarity."
        ),
      }),
      section("Instructor Review Readiness", {
        description: "Prepare for human evaluation and next-step growth.",
        scene:
          "You finish the roleplay and immediately remember three things you wish you had said differently.",
        plainTalk:
          "Capstone readiness is not perfection. It is the ability to notice your practice, name what went well, name what needs supervision, and keep learning. AI review can help you rehearse, but a human instructor reviews completion and certification readiness.",
        trySaying: [
          "I stayed warm and I missed one chance to ask permission before offering resources.",
          "I routed the medical question correctly, and I want supervision on the family privacy issue.",
          "If I repeated this conversation, I would slow down at the first topic shift.",
        ],
        practice:
          "Complete a self-review with strengths, missed moments, scope checks, and supervision questions.",
        commonTrap:
          "The trap is treating feedback like a verdict. Feedback is how peer practice gets safer.",
        mustKnow:
          "AI practice supports learning; human instructors still decide completion and certification readiness.",
        quiz: q(
          "capstone self-review",
          "Name strengths, missed moments, scope checks, and supervision questions.",
          "Defend every choice so the instructor knows you were intentional.",
          "Use feedback to improve PWS practice while respecting human certification decisions.",
          "Let AI review certify that you passed.",
          "Treat capstone records as private training records.",
          "Post your roleplay transcript for peer feedback online.",
          "Choose one growth step for future practice.",
          "Ignore mistakes because confidence matters in final review."
        ),
      }),
    ],
    aiReview: aiReview(
      [
        "Map complex whole-person scenarios with peer priority at the center.",
        "Run a capstone conversation with clean scope routing.",
        "Document and hand off clearly.",
        "Prepare for human instructor review with honest self-reflection.",
      ],
      [
        "Advanced PWS work remains non-clinical.",
        "Human instructors certify; AI practice does not.",
        "Consent and privacy govern team/family sharing.",
        "One realistic next step beats taking over everything.",
      ],
      [
        "Map a complex capstone case in plain language.",
        "How do you route a medical question while staying warm?",
        "Give me a three-sentence handoff.",
        "What would you say in an honest self-review?",
        "How do you know when you are taking over?",
      ]
    ),
  },
];

export const PWS_EXTRA_MODULES = pwsExtraSpecs.map(buildHybridModule);

const PWS_PSS_MODULES = CORE_PSS_MODULES.map(cloneHybridModule);

export const PWS_COURSE: CourseSeed = {
  slug: "pws",
  type: "PWS",
  title: "Peer Wellness Specialist Certification Training",
  subtitle: "80-hour Oregon-aligned PWS training with PSS foundations, section checks, and module AI review",
  description:
    "A practical 80-hour Peer Wellness Specialist curriculum that includes all PSS foundations plus whole-health, addiction recovery, group, systems, housing, and capstone practice.",
  contactHours: 80,
  priceCents: 180000,
  competencies: [
    "All Peer Support Specialist competencies",
    "Wellness planning and WRAP-informed support",
    "Addiction recovery and harm reduction",
    "Whole-health navigation and community partnership",
    "Group facilitation, team collaboration, housing/benefits navigation, and capstone practice",
  ],
  learningOutcomes: [
    "Apply all PSS skills in broader wellness and healthcare settings.",
    "Support addiction recovery and harm reduction while protecting dignity and scope.",
    "Facilitate groups and collaborate with teams without losing peer voice.",
    "Navigate social drivers, housing, benefits, and health resources with consent and honest limits.",
    "Complete section MCQs and module AI reviews for instructor review across 80 contact hours.",
  ],
  modules: [...PWS_PSS_MODULES, ...PWS_EXTRA_MODULES],
};
