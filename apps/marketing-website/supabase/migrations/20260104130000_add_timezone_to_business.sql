-- Add timezone column to user_businesses table
ALTER TABLE user_businesses
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/Los_Angeles';

-- Comment on column
COMMENT ON COLUMN user_businesses.timezone IS 'Timezone for the business context, defaults to America/Los_Angeles';
