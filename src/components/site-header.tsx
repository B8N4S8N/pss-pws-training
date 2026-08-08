import Link from "next/link";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const { userId } = await auth();
  let role: string | null = null;
  if (userId) {
    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    role = dbUser?.role ?? null;
  }

  const appHome =
    role === "ADMIN" || role === "INSTRUCTOR" ? "/admin" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-[#f3f7f4]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-display text-xl tracking-tight text-primary">
          Cascade Peer Academy
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/programs" className="text-foreground/80 hover:text-primary">
            Programs
          </Link>
          <Link href="/approach" className="text-foreground/80 hover:text-primary">
            Approach
          </Link>
          <Link href="/oha" className="text-foreground/80 hover:text-primary">
            OHA Path
          </Link>
          <Link href="/enroll" className="text-foreground/80 hover:text-primary">
            Pricing
          </Link>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-foreground/80 hover:text-primary">Sign in</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Enroll
              </Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link href={appHome} className="text-foreground/80 hover:text-primary">
              Dashboard
            </Link>
            <Button asChild size="sm" variant="outline">
              <Link href="/enroll">Pay / enroll</Link>
            </Button>
            <UserButton />
          </Show>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button size="sm" variant="outline">
                Sign in
              </Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
