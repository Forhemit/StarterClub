-- Race Track Upgrade: Lifecycle Tracking & Decay Rate

-- 1. Upgrade user_checklist_status for Lifecycle Tracking
ALTER TABLE user_checklist_status
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS status_cache TEXT DEFAULT 'straw' CHECK (status_cache IN ('brick', 'wood', 'straw'));

-- 2. Create function to calculate status status based on verification age
CREATE OR REPLACE FUNCTION calculate_racetrack_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If verified_at is present
  IF NEW.verified_at IS NOT NULL THEN
    -- Check decay (180 days)
    IF NEW.verified_at > (NOW() - INTERVAL '180 days') THEN
        NEW.status_cache := 'brick'; -- Race Ready (Green)
    ELSE
        NEW.status_cache := 'wood'; -- Rusting (Yellow)
    END IF;
    -- Set expires_at automatically
    NEW.expires_at := NEW.verified_at + INTERVAL '180 days';
  ELSE
    -- Not verified or verification removed
    NEW.status_cache := 'straw'; -- High Risk (Red)
    NEW.expires_at := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Trigger to auto-update status when verified_at changes
DROP TRIGGER IF EXISTS update_racetrack_status ON user_checklist_status;
CREATE TRIGGER update_racetrack_status
BEFORE INSERT OR UPDATE OF verified_at ON user_checklist_status
FOR EACH ROW
EXECUTE FUNCTION calculate_racetrack_status();

-- 4. Scheduled Function (Cron candidate) to downgrade expired items
-- This function can be called daily by a cron job (pg_cron or external)
CREATE OR REPLACE FUNCTION downgrade_expired_items()
RETURNS void AS $$
BEGIN
  UPDATE user_checklist_status
  SET status_cache = 'wood'
  WHERE status_cache = 'brick' 
  AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
