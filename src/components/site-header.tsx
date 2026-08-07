import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const session = await getSession();

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
          {session ? (
            <>
              <Link
                href={
                  session.role === "ADMIN" || session.role === "INSTRUCTOR"
                    ? "/admin"
                    : "/dashboard"
                }
                className="text-foreground/80 hover:text-primary"
              >
                Dashboard
              </Link>
              <form action={logoutAction}>
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-foreground/80 hover:text-primary">
                Sign in
              </Link>
              <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/register">Enroll</Link>
              </Button>
            </>
          )}
        </nav>
        <div className="md:hidden">
          <Button asChild size="sm" variant="outline">
            <Link href={session ? "/dashboard" : "/login"}>
              {session ? "App" : "Sign in"}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
