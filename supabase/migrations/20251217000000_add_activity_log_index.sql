-- Migration: Add missing FK index to activity_log
-- Purpose: Resolve "Unindexed foreign keys" warning for activity_log(member_id)

CREATE INDEX IF NOT EXISTS idx_activity_log_member_id ON public.activity_log(member_id);
