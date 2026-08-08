import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripeConfigured } from "@/lib/stripe";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnrollForm } from "@/components/enroll-form";

export const metadata = { title: "Enroll & Pay" };

export default async function EnrollPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; canceled?: string }>;
}) {
  const user = await requireUser();
  if (!user) redirect("/sign-in?redirect_url=/enroll");

  const params = await searchParams;
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { contactHours: "asc" },
  });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="font-display text-4xl text-primary">Enroll & pay</h1>
        <p className="mt-3 text-muted-foreground">
          Secure checkout via Stripe. Cards are always available. When enabled in our
          Stripe Dashboard, eligible students also see{" "}
          <strong>Klarna</strong> and <strong>Cash App Afterpay</strong> financing
          options at checkout — no hard-coded payment method list (dynamic payment
          methods).
        </p>

        {params.canceled && (
          <p className="mt-4 rounded-xl bg-mist px-4 py-3 text-sm text-primary">
            Checkout canceled — you can try again anytime.
          </p>
        )}

        {!stripeConfigured() && (
          <div className="mt-4 rounded-xl border border-accent/40 bg-white p-4 text-sm">
            <p className="font-semibold text-accent">Stripe keys needed</p>
            <p className="mt-1 text-muted-foreground">
              Add <code>STRIPE_SECRET_KEY</code> and{" "}
              <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> to enable live checkout.
              Enable Klarna and Afterpay under Stripe → Settings → Payment methods.
            </p>
          </div>
        )}

        <Suspense>
          <EnrollForm
            courses={courses.map((c) => ({
              slug: c.slug,
              title: c.title,
              type: c.type,
              contactHours: c.contactHours,
              priceCents: c.priceCents,
            }))}
            defaultCourse={params.course || "oregon-pss-40"}
            defaultPeerIdentity={user.peerIdentity || ""}
            stripeReady={stripeConfigured()}
          />
        </Suspense>

        <p className="mt-8 text-sm text-muted-foreground">
          Already paid?{" "}
          <Link href="/dashboard" className="underline">
            Go to your dashboard
          </Link>
          . Scholarships / employer billing: contact academy admin.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
