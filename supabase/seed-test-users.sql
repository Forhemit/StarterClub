-- ============================================================================
-- TEST USERS SEED FILE
-- Purpose: Create test users for QA team end-to-end testing
-- Environment: DEVELOPMENT/STAGING ONLY - Never run in production
-- ============================================================================

-- NOTE: This file documents the test users. To create them in Supabase:
-- Option 1: Use Supabase Dashboard > Authentication > Users > Add User
-- Option 2: Use Supabase Auth Admin API with Service Role Key

-- ============================================================================
-- TEST USER SPECIFICATIONS
-- ============================================================================
-- Password for ALL test accounts: TestPass123!
-- ============================================================================

-- User 1: Company Admin
-- Email: company_admin@test.com
-- Role: Company Administrator with full permissions
-- Access: /member-dashboard

-- User 2: Company Member 1
-- Email: company_member1@test.com
-- Role: Standard company user (reports to Company Admin)
-- Access: /member-dashboard

-- User 3: Company Member 2
-- Email: company_member2@test.com
-- Role: Standard company user
-- Access: /member-dashboard

-- User 4: Partner Company Admin
-- Email: partner_admin@test.com
-- Role: Partner organization administrator
-- Access: /partner-portal

-- User 5: Partner Member
-- Email: partner_member@test.com
-- Role: Standard partner user (reports to Partner Admin)
-- Access: /partner-portal

-- User 6: Sponsor Admin
-- Email: sponsor_admin@test.com
-- Role: Sponsor-only administrator
-- Access: /member-dashboard

-- ============================================================================
-- MANUAL CREATION STEPS (via Supabase Dashboard)
-- ============================================================================
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" > "Create New User"
-- 3. Enter email and password (TestPass123!) for each user
-- 4. After creation, update user metadata if needed:
--    - company_admin@test.com: { "role": "company_admin" }
--    - company_member1@test.com: { "role": "company_member" }
--    - company_member2@test.com: { "role": "company_member" }
--    - partner_admin@test.com: { "role": "partner_admin" }
--    - partner_member@test.com: { "role": "partner_member" }
--    - sponsor_admin@test.com: { "role": "sponsor_admin" }

-- ============================================================================
-- CLEANUP (if needed)
-- ============================================================================
-- To remove test users, go to Authentication > Users and delete each manually
-- Or use the Auth Admin API:
-- await supabase.auth.admin.deleteUser(userId)
