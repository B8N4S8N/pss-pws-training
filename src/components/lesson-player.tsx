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

type ReferenceLink = {
  title: string;
  url: string;
  description?: string;
};

type LessonPlayerLesson = {
  id: string;
  title: string;
  type: string;
  contentMd: string;
  videoUrl: string | null;
  videoProvider: string | null;
  referencesJson: string | null;
  learningModes: string | null;
  storytellingHook: string | null;
  isModuleQuiz: boolean;
  interactivePayload: string | null;
  passScore: number;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatInline(value: string) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer">$1</a>'
    )
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");
}

function renderMarkdown(md: string) {
  const lines = md.split(/\r?\n/);
  const html: string[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let orderedList = false;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${paragraph.map(formatInline).join("<br />")}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    const tag = orderedList ? "ol" : "ul";
    html.push(`<${tag}>${listItems.join("")}</${tag}>`);
    listItems = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      html.push(`<h${level}>${formatInline(heading[2])}</h${level}>`);
      continue;
    }

    if (trimmed.startsWith(">")) {
      flushParagraph();
      flushList();
      const calloutText = trimmed.replace(/^>\s?/, "");
      const plain = calloutText.replace(/\*\*/g, "").toLowerCase();
      const calloutClass = plain.startsWith("story:")
        ? "lesson-callout-story"
        : plain.startsWith("practice:") || plain.startsWith("try:")
          ? "lesson-callout-practice"
          : plain.startsWith("warn:") ||
              plain.startsWith("warning:") ||
              plain.startsWith("caution:")
            ? "lesson-callout-warn"
            : "";
      html.push(
        `<div class="lesson-callout ${calloutClass} animate-pop-in">${formatInline(
          calloutText
        )}</div>`
      );
      continue;
    }

    const bullet = trimmed.match(/^[-*]\s+(.+)$/);
    const numbered = trimmed.match(/^\d+\.\s+(.+)$/);
    if (bullet || numbered) {
      flushParagraph();
      const isOrdered = Boolean(numbered);
      if (listItems.length && orderedList !== isOrdered) flushList();
      orderedList = isOrdered;
      listItems.push(`<li>${formatInline((bullet || numbered)?.[1] || "")}</li>`);
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  return html.join("\n");
}

function parseReferences(raw: string | null): ReferenceLink[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => ({
          title: String(item.title || item.label || item.url || "Reference"),
          url: String(item.url || ""),
          description: item.description ? String(item.description) : undefined,
        }))
        .filter((item) => item.url);
    }
  } catch {
    // Textarea CMS input can be line-based: Title | URL | optional description.
  }

  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((part) => part.trim());
      const urlMatch = line.match(/https?:\/\/\S+/);
      if (parts.length >= 2) {
        return { title: parts[0], url: parts[1], description: parts[2] };
      }
      return {
        title: line.replace(urlMatch?.[0] || "", "").trim() || "Reference",
        url: urlMatch?.[0] || "",
      };
    })
    .filter((item) => item.url);
}

function parseLearningModes(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    // Fall back to comma/newline separated values.
  }
  return raw
    .split(/[,\n]/)
    .map((mode) => mode.trim())
    .filter(Boolean);
}

function videoEmbedUrl(videoUrl: string | null, provider: string | null) {
  if (!videoUrl) return null;
  const normalizedProvider = provider?.toLowerCase();
  const youtubeId =
    videoUrl.match(/youtu\.be\/([^?&]+)/)?.[1] ||
    videoUrl.match(/[?&]v=([^?&]+)/)?.[1] ||
    videoUrl.match(/youtube\.com\/embed\/([^?&/]+)/)?.[1];
  if (youtubeId || normalizedProvider === "youtube") {
    return youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : videoUrl;
  }

  const vimeoId =
    videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1] ||
    videoUrl.match(/player\.vimeo\.com\/video\/(\d+)/)?.[1];
  if (vimeoId || normalizedProvider === "vimeo") {
    return vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : videoUrl;
  }

  return null;
}

export function LessonPlayer({
  lesson,
  courseSlug,
}: {
  courseSlug: string;
  lesson: LessonPlayerLesson;
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
  const references = useMemo(
    () => parseReferences(lesson.referencesJson),
    [lesson.referencesJson]
  );
  const learningModes = useMemo(
    () => parseLearningModes(lesson.learningModes),
    [lesson.learningModes]
  );
  const embedUrl = useMemo(
    () => videoEmbedUrl(lesson.videoUrl, lesson.videoProvider),
    [lesson.videoProvider, lesson.videoUrl]
  );

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
      {(learningModes.length > 0 || lesson.isModuleQuiz) && (
        <div className="flex flex-wrap gap-2">
          {lesson.isModuleQuiz && (
            <span className="brutal-box-yellow animate-pop-in rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide">
              Module quiz
            </span>
          )}
          {learningModes.map((mode) => (
            <span
              key={mode}
              className="brutal-box rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
            >
              {mode}
            </span>
          ))}
        </div>
      )}

      {lesson.storytellingHook && (
        <aside className="lesson-callout lesson-callout-story animate-pop-in">
          <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-primary">
            Story hook
          </p>
          <p className="text-lg">{lesson.storytellingHook}</p>
        </aside>
      )}

      {embedUrl && (
        <section className="brutal-box animate-pop-in overflow-hidden">
          <div className="border-b-[3px] border-[#143028] bg-[#0f3d2e] px-4 py-2 text-sm font-black uppercase tracking-wide text-white">
            Watch
          </div>
          <div className="aspect-video bg-black">
            <iframe
              className="h-full w-full"
              src={embedUrl}
              title={`${lesson.title} video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {lesson.videoUrl && !embedUrl && (
        <a
          className="brutal-box-yellow inline-block px-4 py-3 font-black underline"
          href={lesson.videoUrl}
          target="_blank"
          rel="noreferrer"
        >
          Open lesson video
        </a>
      )}

      <article
        className="prose-lesson brutal-box animate-pop-in p-6 md:p-8"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(lesson.contentMd) }}
      />

      {lesson.type === "QUIZ" && payload?.questions && (
        <div className="brutal-box-yellow animate-pop-in space-y-6 p-6">
          <h2 className="font-display text-2xl text-primary">Quiz</h2>
          {payload.questions.map(
            (q: {
              id: string;
              prompt: string;
              options: string[];
              explanation: string;
            }) => (
              <div key={q.id} className="brutal-box space-y-3 bg-white p-4">
                <p className="font-medium">{q.prompt}</p>
                <RadioGroup
                  onValueChange={(v) =>
                    setAnswers((a) => ({ ...a, [q.id]: Number(v) }))
                  }
                >
                  {q.options.map((opt, idx) => (
                    <div
                      key={opt}
                      className="flex items-center gap-2 rounded-md border-2 border-transparent p-2 hover:border-primary"
                    >
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
            className="brutal-btn brutal-active"
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
        <div className="brutal-box animate-pop-in space-y-4 p-6">
          <h2 className="font-display text-2xl text-primary">Choose your response</h2>
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
                  className="brutal-active h-auto w-full justify-start whitespace-normal border-[3px] border-primary bg-white p-4 text-left shadow-[3px_3px_0_#143028] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#f4e04d] hover:shadow-[5px_5px_0_#143028]"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      const res = await submitScenarioAction(lesson.id, idx);
                      if ("error" in res && res.error) setMessage(res.error);
                      else
                        setMessage(
                          `${res.feedback} (score ${res.score}${
                            res.passed ? " - completed" : " - try a stronger response"
                          })`
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
        <div className="brutal-box animate-pop-in space-y-3 p-6">
          <h2 className="font-display text-2xl text-primary">Your reflection</h2>
          <Textarea
            rows={8}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Write your reflection here..."
          />
          <Button
            disabled={pending}
            className="brutal-btn brutal-active"
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
        <div className="brutal-box animate-pop-in space-y-3 p-6">
          {lesson.type === "DOCUMENTATION" && (
            <>
              <h2 className="font-display text-2xl text-primary">Your work product</h2>
              <Textarea
                rows={8}
                value={docText}
                onChange={(e) => setDocText(e.target.value)}
                placeholder="Draft your documentation / plan here..."
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
          <Button
            disabled={pending}
            className="brutal-btn brutal-active"
            onClick={() => markComplete()}
          >
            Mark complete
          </Button>
        </div>
      )}

      {references.length > 0 && (
        <section className="brutal-box bg-[#e8f2eb] p-6">
          <h2 className="font-display text-2xl text-primary">Go deeper</h2>
          <div className="mt-4 grid gap-3">
            {references.map((ref) => (
              <a
                key={`${ref.title}-${ref.url}`}
                href={ref.url}
                target="_blank"
                rel="noreferrer"
                className="brutal-active border-[3px] border-primary bg-white p-4 shadow-[3px_3px_0_#143028] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#f4e04d] hover:shadow-[5px_5px_0_#143028]"
              >
                <span className="block font-black text-primary">{ref.title}</span>
                {ref.description && (
                  <span className="mt-1 block text-sm text-foreground/80">
                    {ref.description}
                  </span>
                )}
              </a>
            ))}
          </div>
        </section>
      )}

      {message && (
        <p className="brutal-box-yellow animate-nudge px-4 py-3 text-sm font-bold text-primary">
          {message}
        </p>
      )}

      <div>
        <Button
          variant="outline"
          className="brutal-active border-[3px] border-primary bg-white shadow-[3px_3px_0_#143028]"
          onClick={() => router.push(`/learn/${courseSlug}`)}
        >
          Back to modules
        </Button>
      </div>
    </div>
  );
}
