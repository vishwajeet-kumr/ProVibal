// app/sign-up/[[...sign-up]]/page.tsx — Clerk hosted sign-up UI

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <SignUp />
    </main>
  );
}
