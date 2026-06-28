// app/sign-in/[[...sign-in]]/page.tsx — Clerk hosted sign-in — warm design system

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F4F0] px-4">
      <SignIn />
    </main>
  );
}
