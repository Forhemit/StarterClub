# Setting up Clerk + Supabase Integration

The error `ClerkAPIResponseError: Not Found` means Clerk doesn't know about the "supabase" token template. You need to create it.

## Steps

1.  Log in to your **Clerk Dashboard**.
2.  Go to **Configure > JWT Templates**.
3.  Click **New Template** and select **Supabase**.
4.  Name it exactly: `supabase` (lowercase).
5.  **Get the Signing Key**:
    *   In the template settings, look for "Signing Key" (often you need to grab the JWT Secret from Supabase first).
    *   **Go to Supabase Dashboard > Project Settings > API**.
    *   Copy the **JWT Secret** (you might need to reveal it).
    *   **Back in Clerk**: Paste this Supabase JWT Secret into the "Signing Key" field (or "Hmac secret key") if asked, to ensure Supabase can verify tokens signed by Clerk.
    *   *Note: Clerk's "Supabase" template wizard usually guides you to paste the key.*
6.  **Save** the template.

Once this is done:
- `auth().getToken({ template: "supabase" })` will work.
- You won't see "Not Found" errors.
