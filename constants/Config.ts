// Supabase configuration
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Validate environment variables at startup
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing required environment variables:');
  if (!SUPABASE_URL) console.error('- EXPO_PUBLIC_SUPABASE_URL');
  if (!SUPABASE_ANON_KEY) console.error('- EXPO_PUBLIC_SUPABASE_ANON_KEY');
}