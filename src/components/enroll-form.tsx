"use client";

import { useState, useTransition } from "react";
import { startCheckoutAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CourseOption = {
  slug: string;
  title: string;
  type: string;
  contactHours: number;
  priceCents: number;
};

export function EnrollForm({
  courses,
  defaultCourse,
  defaultPeerIdentity,
  stripeReady,
}: {
  courses: CourseOption[];
  defaultCourse: string;
  defaultPeerIdentity: string;
  stripeReady: boolean;
}) {
  const [courseSlug, setCourseSlug] = useState(defaultCourse);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const selected = courses.find((c) => c.slug === courseSlug) || courses[0];

  return (
    <form
      className="mt-8 space-y-5 rounded-2xl border border-primary/15 bg-white/80 p-6"
      action={(formData) => {
        startTransition(async () => {
          setError(null);
          const res = await startCheckoutAction(formData);
          if (res?.error) setError(res.error);
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="courseSlug">Program</Label>
        <select
          id="courseSlug"
          name="courseSlug"
          value={courseSlug}
          onChange={(e) => setCourseSlug(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
        >
          {courses.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.type} — {c.title} (${(c.priceCents / 100).toFixed(0)})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deliveryMode">Delivery mode</Label>
        <select
          id="deliveryMode"
          name="deliveryMode"
          defaultValue="AYOP"
          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="AYOP">At your own pace (AYOP)</option>
          <option value="HYBRID">Hybrid (online + live Zoom)</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="peerIdentity">Lived experience (self-attestation)</Label>
        <Input
          id="peerIdentity"
          name="peerIdentity"
          defaultValue={defaultPeerIdentity}
          placeholder="e.g., person in recovery / mental health peer / family peer"
        />
      </div>

      {selected && (
        <div className="rounded-xl bg-mist/80 p-4 text-sm">
          <p className="font-display text-lg text-primary">
            ${(selected.priceCents / 100).toFixed(2)} USD
          </p>
          <p className="mt-1 text-muted-foreground">
            {selected.contactHours} contact hours · Oregon THW-aligned curriculum
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-foreground/80">
            <li>Pay with card</li>
            <li>
              Or finance with Klarna / Cash App Afterpay when offered at Stripe Checkout
              (eligibility by amount, location, and Dashboard settings)
            </li>
            <li>
              Afterpay Pay-in-4 typically supports up to ~$2,000 USD; Klarna financing
              can go higher for eligible buyers
            </li>
          </ul>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        type="submit"
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        disabled={pending || !stripeReady}
      >
        {pending ? "Redirecting to Stripe…" : "Continue to secure checkout"}
      </Button>
    </form>
  );
}
