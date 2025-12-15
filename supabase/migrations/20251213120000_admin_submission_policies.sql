-- =============================================================================
-- Migration: Admin Submission Policies
-- Purpose: Allow admins (defined in partner_users) to view/edit submissions
-- =============================================================================

-- 1. Policies for waitlist_submissions

-- Admins can VIEW all waitlist submissions
DROP POLICY IF EXISTS "Admins can view all waitlist submissions" ON waitlist_submissions;
CREATE POLICY "Admins can view all waitlist submissions"
ON waitlist_submissions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM partner_users 
    WHERE clerk_user_id = requesting_user_id() 
    AND role = 'admin'
  )
);

-- Admins can UPDATE waitlist submissions (e.g. status)
DROP POLICY IF EXISTS "Admins can update waitlist submissions" ON waitlist_submissions;
CREATE POLICY "Admins can update waitlist submissions"
ON waitlist_submissions FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM partner_users 
    WHERE clerk_user_id = requesting_user_id() 
    AND role = 'admin'
  )
);

-- 2. Policies for partner_inquiries

-- Admins can VIEW all partner inquiries
DROP POLICY IF EXISTS "Admins can view all partner inquiries" ON partner_inquiries;
CREATE POLICY "Admins can view all partner inquiries"
ON partner_inquiries FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM partner_users 
    WHERE clerk_user_id = requesting_user_id() 
    AND role = 'admin'
  )
);

-- Admins can UPDATE partner inquiries (e.g. status)
DROP POLICY IF EXISTS "Admins can update partner inquiries" ON partner_inquiries;
CREATE POLICY "Admins can update partner inquiries"
ON partner_inquiries FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM partner_users 
    WHERE clerk_user_id = requesting_user_id() 
    AND role = 'admin'
  )
);
