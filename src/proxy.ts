import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/learn(.*)",
  "/practice(.*)",
  "/tutor(.*)",
  "/interview(.*)",
  "/admin(.*)",
  "/enroll(.*)",
  "/checkout(.*)",
  "/api/ai(.*)",
  "/api/checkout(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Stripe webhooks must remain public (verified via signature)
  if (req.nextUrl.pathname.startsWith("/api/stripe/webhook")) {
    return;
  }
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
