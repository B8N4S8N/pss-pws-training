"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatClient({
  endpoint,
  title,
  emptyPrompt,
}: {
  endpoint: string;
  title: string;
  emptyPrompt: string;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(seed?: string) {
    const text = (seed ?? input).trim();
    if (!text || busy) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        setMessages([...next, { role: "assistant", content: data.text }]);
      } else {
        const data = await res.text();
        setMessages([...next, { role: "assistant", content: data }]);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-primary">{title}</h1>
      <div className="min-h-[360px] space-y-3 rounded-2xl border border-primary/10 bg-white/80 p-4">
        {!messages.length && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{emptyPrompt}</p>
            <Button
              variant="outline"
              onClick={() => send("Help me practice reflective listening.")}
            >
              Start with a sample prompt
            </Button>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
              m.role === "user"
                ? "ml-8 bg-primary text-primary-foreground"
                : "mr-8 bg-mist"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>
      <Textarea
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message…"
      />
      <Button onClick={() => send()} disabled={busy || !input.trim()}>
        Send
      </Button>
    </div>
  );
}
