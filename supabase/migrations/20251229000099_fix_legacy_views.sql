-- Migration: 20251229000099_fix_legacy_views.sql
-- Description: Fix security definer view errors for legacy views
-- This ensures that RLS policies are enforced based on the querying user

ALTER VIEW public.member_summary SET (security_invoker = true);
