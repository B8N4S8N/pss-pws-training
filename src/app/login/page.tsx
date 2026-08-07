"use client";

import { useState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const res = await loginAction(formData);
    if (res?.error) {
      setError(res.error);
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <Link href="/" className="font-display text-2xl text-primary">
        Cascade Peer Academy
      </Link>
      <h1 className="mt-6 font-display text-3xl text-primary">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Demo: student@cascadepeer.academy / CascadeDemo2026!
      </p>
      <form action={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-sm">
        New student?{" "}
        <Link href="/register" className="text-accent underline">
          Enroll
        </Link>
      </p>
    </main>
  );
}
