-- Run this in the Supabase SQL Editor

-- 1. Generations Table (Stores all prompt kits)
CREATE TABLE public.generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Clerk User ID
    project_name TEXT NOT NULL,
    project_type TEXT NOT NULL,
    tech_stack TEXT NOT NULL,
    description TEXT NOT NULL,
    foundation_prompt JSONB NOT NULL,
    file_map JSONB NOT NULL,
    build_steps JSONB NOT NULL,
    follow_up_runs JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookups by user
CREATE INDEX idx_generations_user_id ON public.generations(user_id);
CREATE INDEX idx_generations_created_at ON public.generations(created_at DESC);

-- 2. Subscriptions Table (Stores Dodo Payments Subscription Data)
CREATE TABLE public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE, -- Clerk User ID
    dodo_subscription_id TEXT,
    dodo_customer_id TEXT,
    status TEXT NOT NULL, -- 'active', 'canceled', 'past_due'
    plan_id TEXT NOT NULL, -- 'pro_subscription'
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Usage Logs Table (Tracks API calls for limits/analytics)
CREATE TABLE public.usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    action_type TEXT NOT NULL, -- 'generate_kit' or 'follow_up'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_usage_logs_user_id_action ON public.usage_logs(user_id, action_type);
