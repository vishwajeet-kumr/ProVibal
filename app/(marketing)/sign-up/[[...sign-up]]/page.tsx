// app/sign-up/[[...sign-up]]/page.tsx — Clerk hosted sign-up — warm design system

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F4F0] px-4">
      <SignUp />
    </main>
  );
}
