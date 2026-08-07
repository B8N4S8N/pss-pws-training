import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Programs" };

export default function ProgramsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="font-display text-4xl text-primary">Programs</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Both programs map to Oregon THW curriculum standards and include quizzes,
          reflections, scenarios, AI practice, and human competency evaluation.
        </p>

        <div className="mt-12 space-y-10">
          <article className="rounded-2xl border border-primary/15 bg-white/70 p-8">
            <h2 className="font-display text-3xl text-primary">
              PSS — Peer Support Specialist (40 hours)
            </h2>
            <p className="mt-2 text-sm text-accent font-semibold">From $895</p>
            <p className="mt-4 text-foreground/85">
              Core modules: Recovery Foundations, Communication, Boundaries & Ethics,
              Trauma-Informed Care, Crisis & Safety, Cultural Humility & Advocacy,
              Motivational Interviewing, Documentation & Legal, Systems Navigation,
              Self-Care, Skills Lab.
            </p>
            <Button asChild className="mt-6">
              <Link href="/register?course=oregon-pss-40">Enroll in PSS</Link>
            </Button>
          </article>

          <article className="rounded-2xl border border-primary/15 bg-white/70 p-8">
            <h2 className="font-display text-3xl text-primary">
              PWS — Peer Wellness Specialist (80 hours)
            </h2>
            <p className="mt-2 text-sm text-accent font-semibold">From $1,495</p>
            <p className="mt-4 text-foreground/85">
              All PSS modules plus WRAP, Addiction & Harm Reduction, Group Facilitation,
              Resilience & Self-Efficacy, Advanced MI, Health Promotion, Multidisciplinary
              Teams, SDOH & Partnerships, Housing & Benefits Deep Dive, Capstone.
            </p>
            <Button asChild className="mt-6">
              <Link href="/register?course=oregon-pws-80">Enroll in PWS</Link>
            </Button>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
