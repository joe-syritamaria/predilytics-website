import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/api/stripe(.*)",
  "/api/stripeCheckout(.*)",
  "/billing(.*)",
  "/enterprise(.*)",
]);
const isPublicRoute = createRouteMatcher([
  "/api/predict",
  "/api/email-report",
  "/api/support-ticket",
  "/api/ai-chat",
  "/api/health",
  "/api/debug(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    return;
  }
  if (isProtectedRoute(req)) {
    auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
