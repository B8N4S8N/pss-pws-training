import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = { title: "OHA Path" };

export default function OhaPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-4xl text-primary">OHA approval path</h1>
        <p className="mt-4 text-muted-foreground">
          Students cannot use just any 40- or 80-hour class toward Oregon certification.
          The training organization must become an OHA-approved Traditional Health Worker
          training program.
        </p>

        <div className="mt-8 space-y-4 text-foreground/85">
          <p>
            <strong>Rules:</strong> OAR chapter 950 division 060 (THW training,
            certification, curriculum standards). Curriculum topics for PSS/PWS are in
            950-060-0140 (also published historically as 410-180-0370).
          </p>
          <p>
            <strong>Student pathway after completion:</strong> approved training → OHA
            oral health training → background check (as applicable) → THW application /
            registry enrollment.
          </p>
          <p>
            <strong>Our framing to OHA:</strong> AI is a practice environment that
            increases repetitions. Human instructors oversee competency and make the
            final certification-of-completion recommendation.
          </p>
          <p>
            <strong>Next operational step:</strong> request the OHA new training program
            approval packet and TEMPS evaluation rubric from the Traditional Health Worker
            program, then submit curriculum, lesson plans, instructor qualifications,
            attendance policies, testing methods, learning objectives, and evaluation
            process.
          </p>
          <p className="text-sm text-muted-foreground">
            References:{" "}
            <a
              className="underline"
              href="https://www.oregon.gov/oha/EI/Pages/Become-an-Oregon-Health-Authority-Approved-THW-Training-Program.aspx"
              target="_blank"
              rel="noreferrer"
            >
              Become an OHA-approved THW training program
            </a>
            ;{" "}
            <a
              className="underline"
              href="https://secure.sos.state.or.us/oard/displayDivisionRules.action?selectedDivision=7798"
              target="_blank"
              rel="noreferrer"
            >
              OAR 950-060
            </a>
            .
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
