import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserProfile } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-normal tracking-tight text-[var(--text-primary)]">
          Settings
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Manage your account profile and preferences.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden flex justify-center py-10">
        <UserProfile 
          appearance={{
            elements: {
              card: "shadow-none border-none",
              rootBox: "w-full max-w-3xl",
            }
          }}
        />
      </div>
    </div>
  );
}
