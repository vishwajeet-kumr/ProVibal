// middleware.ts — Clerk session middleware for Next.js 16 (project root)

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/generate(.*)",
  "/history(.*)",
  "/billing(.*)",
  "/settings(.*)",
  "/api/generate(.*)",
  "/api/follow-up(.*)",
  "/api/checkout(.*)",
  "/api/entitlements(.*)",
  "/api/generations(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
