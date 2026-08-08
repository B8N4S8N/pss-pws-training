"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type GeneratedSection = {
  title: string;
  hook: string;
  contentMd: string;
  trySaying: string[];
  commonTrap: string;
  mustKnow: string;
  quiz: {
    questions: {
      id: string;
      prompt: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }[];
  };
};

export function AiSectionGenerator({
  moduleSlug,
  sectionSlug,
  sectionTitle,
}: {
  moduleSlug: string;
  sectionSlug: string;
  sectionTitle: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<string | null>(null);
  const [section, setSection] = useState<GeneratedSection | null>(null);

  function generate() {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/ai/generate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug, sectionSlug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed");
        return;
      }
      setSection(data.section);
      setMeta(
        `${data.offline ? "Offline fallback" : "Live"} · ${data.provider} · ${data.model}`
      );
    });
  }

  return (
    <div className="brutal-box space-y-4 p-5">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
          AI personalized section
        </p>
        <h3 className="font-display text-2xl text-primary">{sectionTitle}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Same required skills for everyone. Custom stories, examples, and quiz wording for you.
          Saved for instructor supervision.
        </p>
      </div>
      <Button disabled={pending} className="brutal-btn" onClick={generate}>
        {pending ? "Building your version…" : "Generate my version"}
      </Button>
      {meta && <p className="text-xs font-bold uppercase tracking-wide">{meta}</p>}
      {error && (
        <p className="brutal-box-copper rounded-none p-3 text-sm">{error}</p>
      )}
      {section && (
        <div className="space-y-4">
          <div className="lesson-callout-story">
            <strong>Hook:</strong> {section.hook}
          </div>
          <article className="prose-lesson whitespace-pre-wrap text-sm leading-relaxed">
            {section.contentMd}
          </article>
          <div className="brutal-box-yellow p-4">
            <p className="font-black">Try saying</p>
            <ul className="mt-2 list-disc pl-5 text-sm">
              {section.trySaying.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <p className="font-black">Section check (generated)</p>
            {section.quiz.questions.map((q) => (
              <div key={q.id} className="border-[3px] border-primary bg-white p-3">
                <p className="font-medium">{q.prompt}</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {q.options.map((opt, idx) => (
                    <li key={opt}>
                      {idx === q.correctIndex ? "✓ " : "• "}
                      {opt}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">{q.explanation}</p>
              </div>
            ))}
          </div>
          <Textarea
            readOnly
            rows={3}
            value={`Must-know: ${section.mustKnow}\nTrap: ${section.commonTrap}`}
          />
        </div>
      )}
    </div>
  );
}
