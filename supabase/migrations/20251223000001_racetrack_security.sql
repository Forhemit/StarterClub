-- Race Track Security: Zero-Knowledge Architecture

-- 1. Access Tokens Table
CREATE TABLE IF NOT EXISTS access_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL, -- The secret key (e.g., 'PIT-CREW-1234')
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE access_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see/manage their own tokens
DROP POLICY IF EXISTS "Users manage own tokens" ON access_tokens;
CREATE POLICY "Users manage own tokens" ON access_tokens
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- 2. Secure File Access RPC
-- Staff cannot query user_uploaded_files directly (RLS blocks them).
-- They must use this function with a valid token.
CREATE OR REPLACE FUNCTION request_file_access(
    file_id UUID,
    access_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated privileges to bypass RLS on user_uploaded_files
AS $$
DECLARE
    target_file RECORD;
    target_user_id UUID;
    is_token_valid BOOLEAN;
BEGIN
    -- 1. Get the file and its owner
    SELECT * INTO target_file FROM user_uploaded_files WHERE id = file_id;
    
    IF target_file IS NULL THEN
        RAISE EXCEPTION 'File not found';
    END IF;

    -- 2. Find the owner of this file (via user_businesses)
    SELECT user_id INTO target_user_id 
    FROM user_businesses 
    WHERE id = target_file.business_id;

    -- 3. Verify the token belongs to that user and is valid
    SELECT EXISTS (
        SELECT 1 FROM access_tokens
        WHERE user_id = target_user_id
        AND token = access_token
        AND expires_at > NOW()
    ) INTO is_token_valid;

    IF NOT is_token_valid THEN
        RAISE EXCEPTION 'Invalid or Expired Access Token';
    END IF;

    -- 4. Return the file data (In a real app, you'd generate a Signed URL here)
    -- For now, returning metadata + raw URL (assuming signed url logic is handled elsewhere or url is usable)
    RETURN jsonb_build_object(
        'id', target_file.id,
        'file_url', target_file.file_url,
        'file_name', target_file.file_name,
        'access_granted', true
    );
END;
$$;
