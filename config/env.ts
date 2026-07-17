// config/env.ts — All env vars Zod-validated at startup, exported typed

import { z } from "zod";

const envSchema = z.object({
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),
  CLERK_PUBLISHABLE_KEY: z.string().min(1, "CLERK_PUBLISHABLE_KEY is required"),
  DODO_PAYMENTS_API_KEY: z.string().min(1, "DODO_PAYMENTS_API_KEY is required"),
  DODO_WEBHOOK_SECRET: z.string().min(1, "DODO_WEBHOOK_SECRET is required"),
  DODO_PRO_PRODUCT_ID: z.string().min(1, "DODO_PRO_PRODUCT_ID is required"),
  DODO_REFILL_PRODUCT_ID: z.string().min(1, "DODO_REFILL_PRODUCT_ID is required"),
  DODO_ENVIRONMENT: z.enum(["test_mode", "live_mode"]),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  // Skip environment variable validation during the Next.js build phase
  // so that missing runtime secrets don't crash Vercel deployments.
  if (
    process.env.npm_lifecycle_event === "build" ||
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.VERCEL_ENV === "preview"
  ) {
    return process.env as unknown as Env;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `  ✗ ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `\n❌ Invalid environment variables:\n${formatted}\n\nPlease check your .env.local file or Vercel project settings.\n`
    );
  }

  return parsed.data;
}

export const env: Env = validateEnv();
