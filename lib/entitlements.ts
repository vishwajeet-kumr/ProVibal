// lib/entitlements.ts — Per-user plan, trial, and follow-up run entitlements via Clerk publicMetadata

import { clerkClient } from "@clerk/nextjs/server";

export type Plan = "free" | "pro";

export interface UserEntitlements {
  readonly plan: Plan;
  readonly projectTrialUsed: boolean;
  readonly freeFollowUpRunsUsed: number;
  readonly monthlyFollowUpRunsUsed: number;
  readonly topupRunsRemaining: number;
}

export const FREE_FOLLOWUP_RUN_LIMIT = 2;
export const PRO_MONTHLY_RUN_LIMIT = 50;
export const TOPUP_RUN_GRANT = 15;

export type FollowUpGateResult =
  | { allowed: true; consumeFrom: "free" | "monthly" | "topup" }
  | { allowed: false; reason: "free_limit_reached" | "needs_topup" };

function isValidPlan(value: unknown): value is Plan {
  return value === "free" || value === "pro";
}

function safeNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function resolveEntitlements(metadata: Record<string, unknown>): UserEntitlements {
  return {
    plan: isValidPlan(metadata["plan"]) ? metadata["plan"] : "free",
    projectTrialUsed: metadata["projectTrialUsed"] === true,
    freeFollowUpRunsUsed: safeNumber(metadata["freeFollowUpRunsUsed"]),
    monthlyFollowUpRunsUsed: safeNumber(metadata["monthlyFollowUpRunsUsed"]),
    topupRunsRemaining: safeNumber(metadata["topupRunsRemaining"]),
  };
}

function extractMetadata(sessionClaims: Record<string, unknown> | null): Record<string, unknown> {
  if (!sessionClaims) return {};
  const raw = sessionClaims["publicMetadata"];
  return typeof raw === "object" && raw !== null && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : {};
}

const DEFAULT_ENTITLEMENTS: UserEntitlements = {
  plan: "free",
  projectTrialUsed: false,
  freeFollowUpRunsUsed: 0,
  monthlyFollowUpRunsUsed: 0,
  topupRunsRemaining: 0,
};

export function getUserEntitlementsFromClaims(
  sessionClaims: Record<string, unknown> | null
): UserEntitlements {
  if (!sessionClaims) return DEFAULT_ENTITLEMENTS;
  return resolveEntitlements(extractMetadata(sessionClaims));
}

export async function getUserEntitlements(userId: string): Promise<UserEntitlements> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const metadata = user.publicMetadata as Record<string, unknown>;
  return resolveEntitlements(metadata);
}

export function canGenerate(entitlements: UserEntitlements): boolean {
  return entitlements.plan === "pro" || !entitlements.projectTrialUsed;
}

export function canRunFollowUp(e: UserEntitlements): FollowUpGateResult {
  if (e.plan !== "pro") {
    return e.freeFollowUpRunsUsed < FREE_FOLLOWUP_RUN_LIMIT
      ? { allowed: true, consumeFrom: "free" }
      : { allowed: false, reason: "free_limit_reached" };
  }
  if (e.monthlyFollowUpRunsUsed < PRO_MONTHLY_RUN_LIMIT) {
    return { allowed: true, consumeFrom: "monthly" };
  }
  return e.topupRunsRemaining > 0
    ? { allowed: true, consumeFrom: "topup" }
    : { allowed: false, reason: "needs_topup" };
}

export async function consumeFollowUpRun(
  userId: string,
  consumeFrom: "free" | "monthly" | "topup",
  current: UserEntitlements
): Promise<void> {
  const client = await clerkClient();
  const update =
    consumeFrom === "free"
      ? { freeFollowUpRunsUsed: current.freeFollowUpRunsUsed + 1 }
      : consumeFrom === "monthly"
        ? { monthlyFollowUpRunsUsed: current.monthlyFollowUpRunsUsed + 1 }
        : { topupRunsRemaining: current.topupRunsRemaining - 1 };
  await client.users.updateUserMetadata(userId, { publicMetadata: update });
}

export async function markProjectTrialUsed(userId: string): Promise<void> {
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { projectTrialUsed: true },
  });
}
