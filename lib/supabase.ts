import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/constants/Config';

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase environment variables. Please ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set in your .env file.'
  );
}

// Create Supabase client with proper URL validation
let supabaseUrl: string;
try {
  // Ensure URL is properly formatted
  const url = new URL(SUPABASE_URL);
  supabaseUrl = url.toString();
} catch (error) {
  throw new Error(`Invalid SUPABASE_URL: ${SUPABASE_URL}. Please check your environment variables.`);
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, SUPABASE_ANON_KEY);