-- Migration: Add Missing Database Indexes
-- Purpose: Improve query performance for frequently accessed columns

-- Add index for activity_log.member_id (frequently filtered/joined)
CREATE INDEX IF NOT EXISTS idx_activity_log_member_id 
    ON public.activity_log(member_id);

-- Add index for profiles.phone (used in member lookup)
CREATE INDEX IF NOT EXISTS idx_profiles_phone 
    ON public.profiles(phone);

-- Add index for profiles.last_name (used with ILIKE in searches)
-- Using lower() for case-insensitive matching
CREATE INDEX IF NOT EXISTS idx_profiles_last_name_lower 
    ON public.profiles(lower(last_name));

-- Add index for activity_log.visit_type (commonly filtered)
CREATE INDEX IF NOT EXISTS idx_activity_log_visit_type 
    ON public.activity_log(visit_type);
