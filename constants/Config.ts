// Supabase configuration
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Algorand configuration
export const ALGOD_TOKEN = process.env.EXPO_PUBLIC_ALGOD_TOKEN ?? '';
export const ALGOD_SERVER = process.env.EXPO_PUBLIC_ALGOD_SERVER ?? '';
export const ALGOD_INDEX_SERVER = process.env.EXPO_PUBLIC_ALGOD_INDEX_SERVER ?? '';
export const ALGOD_PORT = process.env.EXPO_PUBLIC_ALGOD_PORT ?? '';

// WalletConnect configuration
export const WALLETCONNECT_PROJECT_ID = process.env.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '';

// App configuration
export const APP_NAME = process.env.EXPO_PUBLIC_APP_NAME ?? 'BoxHand';
export const APP_DESCRIPTION = process.env.EXPO_PUBLIC_APP_DESCRIPTION ?? 'Decentralized Micro-Savings Circles';
export const APP_URL = process.env.EXPO_PUBLIC_APP_URL ?? 'https://boxhand.app';
export const APP_ICON = process.env.EXPO_PUBLIC_APP_ICON ?? 'https://boxhand.app/icon.png';
export const ENVIRONMENT = process.env.EXPO_PUBLIC_ENVIRONMENT ?? 'development';
export const DEBUG = process.env.EXPO_PUBLIC_DEBUG === 'true';

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

// Validate WalletConnect configuration
if (!WALLETCONNECT_PROJECT_ID) {
  console.warn('Missing WalletConnect configuration:');
  console.warn('- EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID');
}