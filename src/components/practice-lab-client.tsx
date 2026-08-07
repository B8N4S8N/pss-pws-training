"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Msg = { role: "user" | "assistant"; content: string };

type Persona = {
  id: string;
  slug: string;
  name: string;
  presentation: string;
  riskLevel: string;
  tags: string;
};

export function PracticeLabClient({ personas }: { personas: Persona[] }) {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, unknown> | null>(null);

  async function send() {
    if (!persona || !input.trim() || busy) return;
    const next = [...messages, { role: "user" as const, content: input.trim() }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/ai/roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaId: persona.id,
          messages: next,
          sessionId,
        }),
      });
      const data = await res.json();
      if (data.sessionId) setSessionId(data.sessionId);
      if (data.text) {
        setMessages([...next, { role: "assistant", content: data.text }]);
      }
    } finally {
      setBusy(false);
    }
  }

  async function endAndEvaluate() {
    if (!persona || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/ai/roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaId: persona.id,
          messages,
          sessionId,
          evaluate: true,
        }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
    } finally {
      setBusy(false);
    }
  }

  if (!persona) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {personas.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setPersona(p);
              setMessages([]);
              setFeedback(null);
              setSessionId(undefined);
            }}
            className="rounded-2xl border border-primary/10 bg-white/70 p-5 text-left hover:border-accent"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-lg text-primary">{p.name}</h3>
              <Badge variant="outline">{p.riskLevel}</Badge>
            </div>
            <p className="mt-2 text-sm text-foreground/80">{p.presentation}</p>
            <p className="mt-2 text-xs text-muted-foreground">{p.tags}</p>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-2xl text-primary">
            Session with {persona.name}
          </h2>
          <p className="text-sm text-muted-foreground">{persona.presentation}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setPersona(null);
            setMessages([]);
            setFeedback(null);
          }}
        >
          Choose another peer
        </Button>
      </div>

      <div className="min-h-[320px] space-y-3 rounded-2xl border border-primary/10 bg-white/80 p-4">
        {!messages.length && (
          <p className="text-sm text-muted-foreground">
            Start the conversation as the peer specialist. Practice listening, boundaries,
            and MI. End the session for scored feedback.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-xl px-3 py-2 text-sm ${
              m.role === "user"
                ? "ml-8 bg-primary text-primary-foreground"
                : "mr-8 bg-mist text-foreground"
            }`}
          >
            <p className="mb-1 text-[10px] uppercase opacity-70">
              {m.role === "user" ? "You (specialist)" : persona.name}
            </p>
            {m.content}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Your response as a peer specialist…"
        />
        <div className="flex flex-wrap gap-2">
          <Button onClick={send} disabled={busy || !input.trim()}>
            Send
          </Button>
          <Button
            variant="secondary"
            onClick={endAndEvaluate}
            disabled={busy || messages.length < 2}
          >
            End & evaluate
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="rounded-2xl border border-accent/30 bg-white p-5 text-sm space-y-2">
          <h3 className="font-display text-lg text-primary">
            Feedback — score {String((feedback as { overallScore?: number }).overallScore ?? "—")}
          </h3>
          <pre className="whitespace-pre-wrap text-xs text-foreground/80">
            {JSON.stringify(feedback, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
