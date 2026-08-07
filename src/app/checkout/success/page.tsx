import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { fulfillCheckoutSession } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = { title: "Payment successful" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const { session_id } = await searchParams;
  if (!session_id) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-lg px-4 py-20 text-center">
          <h1 className="font-display text-3xl text-primary">Missing session</h1>
          <Button asChild className="mt-6">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </main>
        <SiteFooter />
      </>
    );
  }

  const result = await fulfillCheckoutSession(session_id);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-4xl text-primary">You&apos;re enrolled</h1>
        <p className="mt-3 text-muted-foreground">
          {result.ok
            ? "Payment confirmed. Your student dashboard is ready."
            : result.error || "We received your session — check your dashboard shortly."}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild className="bg-accent text-accent-foreground">
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
          {result.courseSlug && (
            <Button asChild variant="outline">
              <Link href={`/learn/${result.courseSlug}`}>Start learning</Link>
            </Button>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
