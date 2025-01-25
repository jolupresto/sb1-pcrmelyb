/*
  # Enable Google Authentication
  
  Note: Google authentication must be configured through the Supabase dashboard:
  1. Go to Authentication > Providers > Google
  2. Enable Google auth
  3. Add Google Client ID and Secret
  4. Configure redirect URLs
*/

-- No SQL changes needed - Google auth is configured via Supabase dashboard
NOTIFY pgjwt, 'Google authentication enabled';