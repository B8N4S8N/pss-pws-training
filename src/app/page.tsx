import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(31,107,82,0.22),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(196,92,38,0.18),transparent_35%),linear-gradient(135deg,#0f3d2e_0%,#164a38_45%,#1a5c44_70%,#0f3d2e_100%)]"
          />
          <div
            aria-hidden
            className="animate-soft-pulse pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-[#c45c26]/25 blur-3xl"
          />
          <div
            aria-hidden
            className="animate-drift pointer-events-none absolute left-[10%] top-[40%] h-40 w-40 rounded-full bg-white/10 blur-2xl"
          />

          <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-4 py-20 text-white">
            <p className="animate-rise font-display text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Cascade Peer Academy
            </p>
            <h1 className="animate-rise-delay-1 mt-6 max-w-2xl font-display text-2xl font-semibold leading-snug text-white/95 sm:text-3xl">
              Oregon’s modern PSS & PWS training — practice-ready, competency-based,
              built for OHA approval.
            </h1>
            <p className="animate-rise-delay-2 mt-5 max-w-xl text-base text-white/80 sm:text-lg">
              40-hour Peer Support Specialist and 80-hour Peer Wellness Specialist
              pathways with AI roleplay clients, quizzes, documentation labs, and
              human instructor sign-off.
            </p>
            <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/sign-up">Start enrollment</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/5 text-white hover:bg-white/15"
              >
                <Link href="/programs">Compare PSS & PWS</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="font-display text-3xl text-primary md:text-4xl">
            One academy. Two Oregon credentials.
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Designed to the Traditional Health Worker curriculum standards in OAR
            950-060-0140 — with hybrid Zoom workshops or fully at-your-own-pace online
            learning plus required live competency evaluation.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-primary/15 bg-white/70 p-8 shadow-sm backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                40 contact hours
              </p>
              <h3 className="mt-2 font-display text-2xl text-primary">
                Peer Support Specialist
              </h3>
              <p className="mt-3 text-foreground/80">
                Recovery foundations, communication, ethics, trauma-informed care,
                crisis routing, MI basics, documentation, and systems navigation —
                with AI practice before you ever sit with a real peer.
              </p>
              <Button asChild className="mt-6" variant="outline">
                <Link href="/enroll?course=oregon-pss-40">Enroll in PSS</Link>
              </Button>
            </div>
            <div className="rounded-2xl border border-primary/15 bg-white/70 p-8 shadow-sm backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                80 contact hours
              </p>
              <h3 className="mt-2 font-display text-2xl text-primary">
                Peer Wellness Specialist
              </h3>
              <p className="mt-3 text-foreground/80">
                Everything in PSS, plus WRAP, harm reduction, group facilitation,
                advanced MI, whole health, SDOH, housing/benefits deep dive, and a
                capstone practicum.
              </p>
              <Button asChild className="mt-6" variant="outline">
                <Link href="/enroll?course=oregon-pws-80">Enroll in PWS</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-y border-primary/10 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="font-display text-3xl md:text-4xl">
              Not another slide deck.
            </h2>
            <p className="mt-3 max-w-2xl text-primary-foreground/80">
              Short lessons, scored scenarios, AI clients, documentation drills, and
              instructor-observed finals — so completion means demonstrated skill, not
              just attendance.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
              {[
                "AI tutor for every competency domain",
                "Roleplay clients: crisis, relapse, psychosis, housing…",
                "Mock hiring / technical interviews",
                "Student + admin dashboards & records",
              ].map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-5"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="font-display text-3xl text-primary">Delivery that fits Oregon</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Built for rural learners who can’t easily travel for week-long trainings —
            without abandoning the interpersonal assessment OHA expects.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-mist/80 p-6">
              <h3 className="font-display text-xl text-primary">At your own pace</h3>
              <p className="mt-2 text-sm text-foreground/80">
                ~90% self-paced modules + required AI portfolio + scheduled live
                competency evaluation with an instructor.
              </p>
            </div>
            <div className="rounded-2xl bg-mist/80 p-6">
              <h3 className="font-display text-xl text-primary">Hybrid</h3>
              <p className="mt-2 text-sm text-foreground/80">
                Self-paced coursework plus weekly live Zoom workshops, observed
                roleplays, attendance tracking, and final evaluation.
              </p>
            </div>
          </div>
          <div className="mt-10">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/approach">See the learning model</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
