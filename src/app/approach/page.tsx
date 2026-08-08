import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = { title: "Approach" };

export default function ApproachPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-4xl text-primary">Learning approach</h1>
        <p className="mt-4 text-muted-foreground">
          Cascade Peer Academy is designed as a peer leadership academy — not a stack of
          PowerPoints. AI multiplies practice repetitions; humans still authorize
          readiness.
        </p>

        <ol className="mt-10 space-y-8">
          {[
            {
              t: "Phase 1 — Self-paced knowledge",
              d: "Interactive modules, readings, quizzes, reflection journals, ethics scenarios, documentation exercises. Progress gates unlock the next module.",
            },
            {
              t: "Phase 2 — AI practice",
              d: "Dozens of simulated peers: PTSD, active use, homelessness, psychosis, grief, suicidal ideation, system anger, relapse, boundary testing. Instant feedback on listening, MI, boundaries, trauma-informed language, and missed opportunities.",
            },
            {
              t: "Phase 3 — Skills mastery",
              d: "Competency demonstration across domains — not seat-time alone. Struggle areas require more practice before advancement.",
            },
            {
              t: "Phase 4 — Final human evaluation",
              d: "Live video interview / observed roleplay, review of AI performance history, and instructor competency recommendation before certificate of completion.",
            },
          ].map((p) => (
            <li key={p.t} className="rounded-2xl bg-white/70 border border-primary/10 p-6">
              <h2 className="font-display text-xl text-primary">{p.t}</h2>
              <p className="mt-2 text-foreground/80">{p.d}</p>
            </li>
          ))}
        </ol>
      </main>
      <SiteFooter />
    </>
  );
}
