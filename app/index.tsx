import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Root() {
  const { session } = useAuth();
  
  // Redirect to the appropriate stack based on auth state
  return <Redirect href={session ? "/(tabs)" : "/(auth)"} />;
}