-- Add ide_rules column to generations table
-- Run this in the Supabase SQL Editor

ALTER TABLE public.generations
  ADD COLUMN IF NOT EXISTS ide_rules JSONB DEFAULT NULL;

-- This column stores the generated IDE rules bundle:
-- { "cursorRules": "...", "windsurfRules": "...", "agentsMd": "..." }
