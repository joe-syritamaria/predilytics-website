import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware((auth) => {
  auth.protect();
});

export const config = {
  matcher: [
    "/api/stripe(.*)",
    "/api/stripeCheckout(.*)",
    "/api/me(.*)",
    "/api/orgs(.*)",
    "/api/gemla(.*)",
    "/gemla-zeta/checkout(.*)",
    "/gemla-zeta/dashboard(.*)",
    "/billing(.*)",
    "/enterprise(.*)",
  ],
};
