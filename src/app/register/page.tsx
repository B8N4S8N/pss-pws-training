"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { registerAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Suspense } from "react";

function RegisterForm() {
  const params = useSearchParams();
  const courseDefault = params.get("course") || "oregon-pss-40";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const res = await registerAction(formData);
    if (res?.error) {
      setError(res.error);
      setPending(false);
    }
  }

  return (
    <form action={onSubmit} className="mt-8 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" minLength={8} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="peerIdentity">Lived experience (self-attestation)</Label>
        <Input
          id="peerIdentity"
          name="peerIdentity"
          placeholder="e.g., person in recovery / family peer / mental health peer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="courseSlug">Program</Label>
        <select
          id="courseSlug"
          name="courseSlug"
          defaultValue={courseDefault}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="oregon-pss-40">PSS — 40 Hour</option>
          <option value="oregon-pws-80">PWS — 80 Hour</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="deliveryMode">Delivery mode</Label>
        <select
          id="deliveryMode"
          name="deliveryMode"
          defaultValue="AYOP"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="AYOP">At your own pace (AYOP)</option>
          <option value="HYBRID">Hybrid (online + live Zoom)</option>
        </select>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full bg-accent text-accent-foreground" disabled={pending}>
        {pending ? "Creating account…" : "Create student account"}
      </Button>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <Link href="/" className="font-display text-2xl text-primary">
        Cascade Peer Academy
      </Link>
      <h1 className="mt-6 font-display text-3xl text-primary">Enroll</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Create your student account and choose PSS or PWS + delivery mode.
      </p>
      <Suspense>
        <RegisterForm />
      </Suspense>
      <p className="mt-6 text-sm">
        Already enrolled?{" "}
        <Link href="/login" className="text-accent underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
