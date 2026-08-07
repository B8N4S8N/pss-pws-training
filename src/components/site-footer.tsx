import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-primary/10 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">Cascade Peer Academy</p>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Oregon-focused PSS (40h) & PWS (80h) training built for OHA Traditional
            Health Worker approval pathways.
          </p>
        </div>
        <div className="text-sm space-y-2">
          <p className="font-semibold">For students</p>
          <Link href="/programs" className="block opacity-80 hover:opacity-100">
            Programs
          </Link>
          <Link href="/register" className="block opacity-80 hover:opacity-100">
            Enroll
          </Link>
          <Link href="/login" className="block opacity-80 hover:opacity-100">
            Student login
          </Link>
        </div>
        <div className="text-sm space-y-2">
          <p className="font-semibold">Regulatory note</p>
          <p className="opacity-80">
            Certificates of completion support OHA THW applications. They are not
            themselves state certification. Oral health training, background checks,
            and registry application remain separate OHA requirements.
          </p>
        </div>
      </div>
    </footer>
  );
}
