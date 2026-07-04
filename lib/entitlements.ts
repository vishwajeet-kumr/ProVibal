// lib/entitlements.ts — Per-user plan + trial entitlement checks via Clerk publicMetadata

import { clerkClient } from "@clerk/nextjs/server";

export type Plan = "free" | "pro";

export interface UserEntitlements {
  readonly plan: Plan;
  readonly trialUsed: boolean;
}

function isValidPlan(value: unknown): value is Plan {
  return value === "free" || value === "pro";
}

function resolveEntitlements(metadata: Record<string, unknown>): UserEntitlements {
  const plan: Plan = isValidPlan(metadata["plan"]) ? metadata["plan"] : "free";
  const trialUsed = metadata["trialUsed"] === true;
  return { plan, trialUsed };
}

export function getUserEntitlementsFromClaims(
  sessionClaims: Record<string, unknown> | null
): UserEntitlements {
  if (!sessionClaims) return { plan: "free", trialUsed: false };
  const raw = sessionClaims["publicMetadata"];
  const metadata =
    typeof raw === "object" && raw !== null && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  return resolveEntitlements(metadata);
}

export async function getUserEntitlements(userId: string): Promise<UserEntitlements> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const metadata = user.publicMetadata as Record<string, unknown>;
  return resolveEntitlements(metadata);
}

export function canGenerate(entitlements: UserEntitlements): boolean {
  return entitlements.plan === "pro" || !entitlements.trialUsed;
}

export async function markTrialUsed(userId: string): Promise<void> {
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { trialUsed: true },
  });
}
