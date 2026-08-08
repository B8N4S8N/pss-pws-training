import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { saveLearnerProfileAction } from "@/lib/learner-actions";
import { describeModelRouting } from "@/lib/ai/models";
import { PSS_COURSE } from "@/lib/curriculum";
import { AiSectionGenerator } from "@/components/ai-section-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const metadata = { title: "Personalize learning" };

export default async function PersonalizePage() {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const profile = await prisma.learnerProfile.findUnique({
    where: { userId: user.id },
  });
  const routing = describeModelRouting();
  const firstModule = PSS_COURSE.modules[0];
  const firstSection = firstModule.chapters[0];

  return (
    <div className="min-h-screen">
      <header className="border-b-[3px] border-primary bg-white/90 px-4 py-4">
        <div className="mx-auto flex max-w-4xl justify-between gap-3">
          <Link href="/dashboard" className="text-sm font-bold">
            ← Dashboard
          </Link>
          <Link href="/learn/oregon-pss-40" className="text-sm font-bold">
            Course map →
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl space-y-8 px-4 py-10">
        <section className="brutal-box-yellow p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em]">AI-created modules</p>
          <h1 className="mt-2 font-display text-4xl text-primary">
            Make the course sound like it was built for you
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed">
            Requirements stay fixed for OHA alignment. Stories, examples, quiz wording, and teaching
            tone adapt to your style. Everything generated is recorded for instructor supervision.
            Humans still authorize certificates.
          </p>
        </section>

        <section className="brutal-box p-6">
          <h2 className="font-display text-2xl text-primary">Your learning profile</h2>
          <form action={saveLearnerProfileAction} className="mt-4 grid gap-4">
            <div>
              <Label htmlFor="learningStyle">How should Cascade Guide teach you?</Label>
              <select
                id="learningStyle"
                name="learningStyle"
                defaultValue={profile?.learningStyle || "peer-talk"}
                className="mt-1 w-full border-[3px] border-primary bg-white px-3 py-2"
              >
                <option value="peer-talk">Talk to me like a peer</option>
                <option value="story">Story-first</option>
                <option value="checklist">Checklists and steps</option>
                <option value="short-chunks">Short chunks</option>
              </select>
            </div>
            <div>
              <Label htmlFor="readingLevel">Reading level</Label>
              <select
                id="readingLevel"
                name="readingLevel"
                defaultValue={profile?.readingLevel || "plain"}
                className="mt-1 w-full border-[3px] border-primary bg-white px-3 py-2"
              >
                <option value="plain">Plain language</option>
                <option value="standard">Standard</option>
              </select>
            </div>
            <div>
              <Label htmlFor="prefersExamplesAbout">
                Example themes (comma-separated)
              </Label>
              <Input
                id="prefersExamplesAbout"
                name="prefersExamplesAbout"
                defaultValue={
                  profile?.prefersExamplesJson
                    ? JSON.parse(profile.prefersExamplesJson).join(", ")
                    : "addiction recovery, rural Oregon, housing"
                }
              />
            </div>
            <div>
              <Label htmlFor="backgroundNotes">Anything else Cascade Guide should know?</Label>
              <Textarea
                id="backgroundNotes"
                name="backgroundNotes"
                rows={4}
                defaultValue={profile?.backgroundNotes || ""}
                placeholder="e.g. I learn better with short scenes and less jargon."
              />
            </div>
            <div>
              <Label htmlFor="modelPreference">Model preference hint</Label>
              <select
                id="modelPreference"
                name="modelPreference"
                defaultValue={profile?.modelPreference || "free"}
                className="mt-1 w-full border-[3px] border-primary bg-white px-3 py-2"
              >
                <option value="free">Free / metered free first</option>
                <option value="balanced">Balanced</option>
                <option value="quality">Highest quality available</option>
              </select>
            </div>
            <Button type="submit" className="brutal-btn w-fit">
              Save profile
            </Button>
          </form>
        </section>

        <section className="brutal-box p-6">
          <h2 className="font-display text-2xl text-primary">Active model routing</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Bigger tasks use mid/large models. Tiny tasks use flash models. Configure keys in env —
            see docs/MODELS-AND-ROUTING.md.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              Gateway: <strong>{routing.gateway ? "yes" : "no"}</strong> · Google:{" "}
              <strong>{routing.google ? "yes" : "no"}</strong> · Groq:{" "}
              <strong>{routing.groq ? "yes" : "no"}</strong>
            </li>
            {routing.tasks.map((t) => (
              <li key={t.task} className="border-[2px] border-primary/30 px-3 py-2">
                <span className="font-black uppercase">{t.task}</span> → {t.label} ({t.provider}
                {t.mayTrainOnPrompts ? " · may train on free prompts" : ""})
              </li>
            ))}
          </ul>
        </section>

        <AiSectionGenerator
          moduleSlug={firstModule.slug}
          sectionSlug={firstSection.slug}
          sectionTitle={firstSection.title}
        />
      </main>
    </div>
  );
}
