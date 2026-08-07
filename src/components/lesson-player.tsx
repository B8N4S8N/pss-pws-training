"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  completeLessonAction,
  submitQuizAction,
  submitReflectionAction,
  submitScenarioAction,
} from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

function renderMarkdown(md: string) {
  // Lightweight markdown-ish renderer for lesson content
  const html = md
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/^\- (.*$)/gim, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)/gim, "<ul>$1</ul>")
    .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hul]|<li|<p)(.+)$/gim, "<p>$1</p>");
  return html;
}

export function LessonPlayer({
  lesson,
  courseSlug,
}: {
  courseSlug: string;
  lesson: {
    id: string;
    title: string;
    type: string;
    contentMd: string;
    interactivePayload: string | null;
    passScore: number;
  };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const payload = useMemo(() => {
    if (!lesson.interactivePayload) return null;
    try {
      return JSON.parse(lesson.interactivePayload);
    } catch {
      return null;
    }
  }, [lesson.interactivePayload]);

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [reflection, setReflection] = useState("");
  const [docText, setDocText] = useState("");

  function markComplete(score?: number) {
    startTransition(async () => {
      await completeLessonAction(lesson.id, score);
      setMessage("Lesson marked complete.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <article
        className="prose-lesson rounded-2xl border border-primary/10 bg-white/80 p-6 md:p-8"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(lesson.contentMd) }}
      />

      {lesson.type === "QUIZ" && payload?.questions && (
        <div className="space-y-6 rounded-2xl border border-primary/10 bg-white/80 p-6">
          <h2 className="font-display text-xl text-primary">Quiz</h2>
          {payload.questions.map(
            (q: {
              id: string;
              prompt: string;
              options: string[];
              explanation: string;
            }) => (
              <div key={q.id} className="space-y-3">
                <p className="font-medium">{q.prompt}</p>
                <RadioGroup
                  onValueChange={(v) =>
                    setAnswers((a) => ({ ...a, [q.id]: Number(v) }))
                  }
                >
                  {q.options.map((opt, idx) => (
                    <div key={opt} className="flex items-center gap-2">
                      <RadioGroupItem value={String(idx)} id={`${q.id}-${idx}`} />
                      <Label htmlFor={`${q.id}-${idx}`}>{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )
          )}
          <Button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const res = await submitQuizAction(lesson.id, answers);
                if ("error" in res && res.error) {
                  setMessage(res.error);
                  return;
                }
                setMessage(
                  res.passed
                    ? `Passed with ${res.score}% (${res.correct}/${res.total}).`
                    : `Score ${res.score}%. Need ${lesson.passScore}% to pass. Review and retry.`
                );
                router.refresh();
              })
            }
          >
            Submit quiz
          </Button>
        </div>
      )}

      {lesson.type === "SCENARIO" && payload?.choices && (
        <div className="space-y-4 rounded-2xl border border-primary/10 bg-white/80 p-6">
          <h2 className="font-display text-xl text-primary">Choose your response</h2>
          <p className="text-sm text-muted-foreground">{payload.scenario}</p>
          <div className="space-y-2">
            {payload.choices.map(
              (
                c: { text: string; feedback: string; score: number },
                idx: number
              ) => (
                <Button
                  key={c.text}
                  variant="outline"
                  className="h-auto w-full whitespace-normal p-4 text-left justify-start"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      const res = await submitScenarioAction(lesson.id, idx);
                      if ("error" in res && res.error) setMessage(res.error);
                      else
                        setMessage(
                          `${res.feedback} (score ${res.score}${res.passed ? " — completed" : " — try a stronger response"})`
                        );
                      router.refresh();
                    })
                  }
                >
                  {c.text}
                </Button>
              )
            )}
          </div>
        </div>
      )}

      {lesson.type === "REFLECTION" && (
        <div className="space-y-3 rounded-2xl border border-primary/10 bg-white/80 p-6">
          <h2 className="font-display text-xl text-primary">Your reflection</h2>
          <Textarea
            rows={8}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Write your reflection here…"
          />
          <Button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const res = await submitReflectionAction(lesson.id, reflection);
                if (res?.error) setMessage(res.error);
                else setMessage("Reflection saved. Lesson complete.");
                router.refresh();
              })
            }
          >
            Submit reflection
          </Button>
        </div>
      )}

      {(lesson.type === "DOCUMENTATION" ||
        lesson.type === "READING" ||
        lesson.type === "VIDEO" ||
        lesson.type === "LIVE_SESSION" ||
        lesson.type === "ROLEPLAY") && (
        <div className="space-y-3 rounded-2xl border border-primary/10 bg-white/80 p-6">
          {lesson.type === "DOCUMENTATION" && (
            <>
              <h2 className="font-display text-xl text-primary">Your work product</h2>
              <Textarea
                rows={8}
                value={docText}
                onChange={(e) => setDocText(e.target.value)}
                placeholder="Draft your documentation / plan here…"
              />
            </>
          )}
          {lesson.type === "ROLEPLAY" && (
            <p className="text-sm text-muted-foreground">
              Complete the required sessions in the{" "}
              <a className="underline" href="/practice">
                Practice Lab
              </a>
              , then mark this lesson complete.
            </p>
          )}
          {lesson.type === "LIVE_SESSION" && (
            <p className="text-sm text-muted-foreground">
              Hybrid students: attend the scheduled Zoom session. AYOP students: schedule
              your live competency evaluation with an instructor.
            </p>
          )}
          <Button disabled={pending} onClick={() => markComplete()}>
            Mark complete
          </Button>
        </div>
      )}

      {message && (
        <p className="rounded-xl bg-mist px-4 py-3 text-sm text-primary">{message}</p>
      )}

      <div>
        <Button variant="outline" onClick={() => router.push(`/learn/${courseSlug}`)}>
          Back to modules
        </Button>
      </div>
    </div>
  );
}
