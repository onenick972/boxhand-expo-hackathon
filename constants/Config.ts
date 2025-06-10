// Supabase configuration
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Algorand configuration
export const ALGOD_TOKEN = process.env.EXPO_PUBLIC_ALGOD_TOKEN ?? '';
export const ALGOD_SERVER = process.env.EXPO_PUBLIC_ALGOD_SERVER ?? '';
export const ALGOD_index_SERVER = process.env.EXPO_PUBLIC_ALGOD_INDEX_SERVER ?? '';

export const ALGOD_PORT = process.env.EXPO_PUBLIC_ALGOD_PORT ?? '';

// Validate environment variables at startup
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing required environment variables:');
  if (!SUPABASE_URL) console.error('- EXPO_PUBLIC_SUPABASE_URL');
  if (!SUPABASE_ANON_KEY) console.error('- EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

// Validate Algorand configuration
if (!ALGOD_TOKEN || !ALGOD_SERVER || !ALGOD_PORT) {
  console.warn('Missing Algorand configuration. Some features may be limited:');
  if (!ALGOD_TOKEN) console.warn('- EXPO_PUBLIC_ALGOD_TOKEN');
  if (!ALGOD_SERVER) console.warn('- EXPO_PUBLIC_ALGOD_SERVER');
  if (!ALGOD_PORT) console.warn('- EXPO_PUBLIC_ALGOD_PORT');
}