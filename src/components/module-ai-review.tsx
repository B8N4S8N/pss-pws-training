"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Msg = { role: "user" | "assistant"; content: string };

type ModuleAiReviewLesson = {
  id: string;
  title: string;
  interactivePayload: string | null;
  passScore: number;
};

type ModuleReviewFeedback = {
  overallScore?: number;
  passed?: boolean;
  strengths?: string[];
  growthAreas?: string[];
  rubricScores?: Record<string, number>;
  coachingNotes?: string;
  redFlags?: string[];
  recommendMorePractice?: boolean;
};

function parsePayload(raw: string | null) {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function asList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function labelFromKey(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

export function ModuleAiReview({
  lesson,
  introHtml,
}: {
  lesson: ModuleAiReviewLesson;
  introHtml: string;
}) {
  const router = useRouter();
  const payload = useMemo(
    () => parsePayload(lesson.interactivePayload),
    [lesson.interactivePayload]
  ) as {
    goals?: unknown;
    mustCover?: unknown;
    rubric?: unknown;
    starterQuestions?: unknown;
    passScore?: unknown;
  };
  const goals = asList(payload.goals);
  const mustCover = asList(payload.mustCover);
  const starterQuestions = asList(payload.starterQuestions);
  const passScore = Number(payload.passScore) || lesson.passScore || 80;

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<ModuleReviewFeedback | null>(null);

  async function send() {
    const text = input.trim();
    if (!text || busy || feedback?.passed) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setNotice(null);
    try {
      const res = await fetch("/api/ai/module-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          messages: next,
          sessionId,
        }),
      });
      if (!res.ok) {
        setNotice("The review guide could not respond yet. Please try again.");
        return;
      }
      const data = await res.json();
      if (data.sessionId) setSessionId(data.sessionId);
      if (data.text) {
        setMessages([...next, { role: "assistant", content: data.text }]);
      }
      if (data.offline) {
        setNotice("Offline practice mode is on. Your transcript is still saved.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function finishReview() {
    if (busy || messages.filter((message) => message.role === "user").length === 0) {
      setNotice("Share at least one answer before finishing the review.");
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      const res = await fetch("/api/ai/module-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          messages,
          sessionId,
          finalize: true,
        }),
      });
      if (!res.ok) {
        setNotice("We could not finalize the review yet. Please try again.");
        return;
      }
      const data = await res.json();
      if (data.sessionId) setSessionId(data.sessionId);
      setFeedback(data.feedback);
      if (data.passed) {
        setNotice("Passed. Nice work - your lesson is marked complete.");
        router.refresh();
      } else {
        setNotice(`Not quite yet. Aim for ${data.passScore ?? passScore}% and try again.`);
      }
    } finally {
      setBusy(false);
    }
  }

  function retry() {
    setMessages([]);
    setInput("");
    setSessionId(undefined);
    setFeedback(null);
    setNotice(null);
  }

  return (
    <section className="space-y-6">
      <div className="brutal-box animate-pop-in p-6 md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-accent">
          AI module review
        </p>
        <div
          className="prose-lesson mt-3"
          dangerouslySetInnerHTML={{ __html: introHtml }}
        />
        <p className="mt-4 text-sm font-bold text-primary/80">
          This is practice evidence. Cascade instructors can review the recording,
          and a human still makes final certification decisions.
        </p>
      </div>

      <div className="brutal-box-yellow animate-pop-in grid gap-4 p-6 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-primary">What we are listening for</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm font-medium">
            {(goals.length ? goals : ["Peer voice, choice, scope, and warmth."]).map(
              (goal) => (
                <li key={goal}>{goal}</li>
              )
            )}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-xl text-primary">Starter flow</h3>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm font-medium">
            {(starterQuestions.length
              ? starterQuestions
              : ["Start by answering in your own words: what would you do first?"]
            ).map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ol>
        </div>
        {mustCover.length > 0 && (
          <div className="md:col-span-2">
            <h3 className="font-display text-xl text-primary">Must-cover checkpoints</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {mustCover.map((item) => (
                <span
                  key={item}
                  className="border-[3px] border-primary bg-white px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0_#143028]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="brutal-box animate-pop-in space-y-4 p-4 md:p-6">
        <div className="min-h-[320px] space-y-3 rounded-xl border-[3px] border-primary bg-white p-4">
          {!messages.length && (
            <p className="text-sm font-medium text-muted-foreground">
              Start with the first prompt above. Cascade Guide will ask one question at a
              time and coach you in plain language.
            </p>
          )}
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`whitespace-pre-wrap rounded-xl border-[3px] border-primary px-3 py-2 text-sm shadow-[2px_2px_0_#143028] ${
                message.role === "user"
                  ? "ml-8 bg-primary text-primary-foreground"
                  : "mr-8 bg-mist text-foreground"
              }`}
            >
              <p className="mb-1 text-[10px] font-black uppercase opacity-70">
                {message.role === "user" ? "You" : "Cascade Guide"}
              </p>
              {message.content}
            </div>
          ))}
        </div>

        <Textarea
          rows={4}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Answer as yourself. Keep it real, kind, and within peer scope..."
          disabled={busy || Boolean(feedback?.passed)}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            className="brutal-btn brutal-active"
            onClick={send}
            disabled={busy || !input.trim() || Boolean(feedback?.passed)}
          >
            Send answer
          </Button>
          <Button
            variant="secondary"
            className="brutal-active border-[3px] border-primary shadow-[3px_3px_0_#143028]"
            onClick={finishReview}
            disabled={busy || Boolean(feedback?.passed)}
          >
            Finish & score
          </Button>
          {feedback && !feedback.passed && (
            <Button variant="outline" onClick={retry}>
              Try again
            </Button>
          )}
        </div>
      </div>

      {feedback && (
        <div className="brutal-box-copper animate-pop-in space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl">Review feedback</h2>
            <span className="border-[3px] border-primary bg-white px-3 py-1 font-black shadow-[3px_3px_0_#143028]">
              {feedback.overallScore ?? "-"}% / pass {passScore}%
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {Object.entries(feedback.rubricScores || {}).map(([key, score]) => (
              <div key={key} className="border-[3px] border-primary bg-white p-3 shadow-[3px_3px_0_#143028]">
                <p className="text-xs font-black uppercase text-primary">
                  {labelFromKey(key)}
                </p>
                <p className="mt-1 font-display text-2xl">{score}%</p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="border-[3px] border-primary bg-white p-4 shadow-[3px_3px_0_#143028]">
              <h3 className="font-display text-lg text-primary">Strengths</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {(feedback.strengths || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="border-[3px] border-primary bg-white p-4 shadow-[3px_3px_0_#143028]">
              <h3 className="font-display text-lg text-primary">Growth areas</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {(feedback.growthAreas || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-[3px] border-primary bg-white p-4 shadow-[3px_3px_0_#143028]">
            <h3 className="font-display text-lg text-primary">Coaching notes</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm">{feedback.coachingNotes}</p>
          </div>
          {Boolean(feedback.redFlags?.length) && (
            <div className="border-[3px] border-primary bg-[#f4e04d] p-4 shadow-[3px_3px_0_#143028]">
              <h3 className="font-display text-lg text-primary">Instructor watch-outs</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-medium">
                {feedback.redFlags?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {notice && (
        <p className="brutal-box-yellow animate-nudge px-4 py-3 text-sm font-bold text-primary">
          {notice}
        </p>
      )}
    </section>
  );
}
