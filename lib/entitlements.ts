// lib/entitlements.ts — Per-user plan, trial, and follow-up run entitlements via Clerk publicMetadata

import { clerkClient } from "@clerk/nextjs/server";

export type Plan = "free" | "starter" | "pro";

export interface UserEntitlements {
  readonly plan: Plan;
  readonly projectTrialUsed: boolean;
  readonly freeFollowUpRunsUsed: number;
  readonly monthlyFollowUpRunsUsed: number;
  readonly topupRunsRemaining: number;
  /** Starter Pass: total kit generations used (out of STARTER_KIT_LIMIT) */
  readonly starterKitsUsed: number;
  /** Starter Pass: total protocol runs used (out of STARTER_PROTOCOL_LIMIT) */
  readonly starterProtocolsUsed: number;
}

export const FREE_FOLLOWUP_RUN_LIMIT = 2;
export const PRO_MONTHLY_RUN_LIMIT = 50;
export const TOPUP_RUN_GRANT = 5;
export const STARTER_KIT_LIMIT = 5;
export const STARTER_PROTOCOL_LIMIT = 5;

export type FollowUpGateResult =
  | { allowed: true; consumeFrom: "free" | "monthly" | "topup" | "starter" }
  | { allowed: false; reason: "free_limit_reached" | "needs_topup" | "starter_limit_reached" };

function isValidPlan(value: unknown): value is Plan {
  return value === "free" || value === "starter" || value === "pro";
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
    starterKitsUsed: safeNumber(metadata["starterKitsUsed"]),
    starterProtocolsUsed: safeNumber(metadata["starterProtocolsUsed"]),
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
  starterKitsUsed: 0,
  starterProtocolsUsed: 0,
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
  if (entitlements.plan === "pro") return true;
  if (entitlements.plan === "starter") return entitlements.starterKitsUsed < STARTER_KIT_LIMIT;
  // Free tier: 1 kit per month (tracked by projectTrialUsed)
  return !entitlements.projectTrialUsed;
}

export function canRunFollowUp(e: UserEntitlements): FollowUpGateResult {
  // Free tier: limited free runs
  if (e.plan === "free") {
    return e.freeFollowUpRunsUsed < FREE_FOLLOWUP_RUN_LIMIT
      ? { allowed: true, consumeFrom: "free" }
      : { allowed: false, reason: "free_limit_reached" };
  }

  // Starter tier: limited starter protocol runs, can also use topups
  if (e.plan === "starter") {
    if (e.starterProtocolsUsed < STARTER_PROTOCOL_LIMIT) {
      return { allowed: true, consumeFrom: "starter" };
    }
    return e.topupRunsRemaining > 0
      ? { allowed: true, consumeFrom: "topup" }
      : { allowed: false, reason: "starter_limit_reached" };
  }

  // Pro tier: monthly limit then topups
  if (e.monthlyFollowUpRunsUsed < PRO_MONTHLY_RUN_LIMIT) {
    return { allowed: true, consumeFrom: "monthly" };
  }
  return e.topupRunsRemaining > 0
    ? { allowed: true, consumeFrom: "topup" }
    : { allowed: false, reason: "needs_topup" };
}

export async function consumeFollowUpRun(
  userId: string,
  consumeFrom: "free" | "monthly" | "topup" | "starter",
  current: UserEntitlements
): Promise<void> {
  const client = await clerkClient();
  let update: Record<string, unknown>;

  switch (consumeFrom) {
    case "free":
      update = { freeFollowUpRunsUsed: current.freeFollowUpRunsUsed + 1 };
      break;
    case "starter":
      update = { starterProtocolsUsed: current.starterProtocolsUsed + 1 };
      break;
    case "monthly":
      update = { monthlyFollowUpRunsUsed: current.monthlyFollowUpRunsUsed + 1 };
      break;
    case "topup":
      update = { topupRunsRemaining: current.topupRunsRemaining - 1 };
      break;
  }

  await client.users.updateUserMetadata(userId, { publicMetadata: update });
}

export async function consumeStarterKit(userId: string, current: UserEntitlements): Promise<void> {
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { starterKitsUsed: current.starterKitsUsed + 1 },
  });
}

export async function markProjectTrialUsed(userId: string): Promise<void> {
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { projectTrialUsed: true },
  });
}
