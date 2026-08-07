import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { ChatClient } from "@/components/chat-client";

export const metadata = { title: "Mock Interview" };

export default async function InterviewPage() {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="min-h-screen">
      <header className="border-b border-primary/10 bg-white/80 px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <Link href="/dashboard" className="text-sm text-muted-foreground">
            ← Dashboard
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <ChatClient
          endpoint="/api/ai/interview"
          title="Mock peer specialist interview"
          emptyPrompt="Practice a hiring / technical interview for peer roles. Click start, then answer as yourself."
        />
      </main>
    </div>
  );
}
