import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

export default function SignInScreen() {
  const { theme } = u  seTheme();
  const { signIn, isLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      await signIn(email, password);
    } catch (err) {
      setError('Invalid email or password');
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Sign In</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.content}>
          <View style={styles.formContainer}>
            <Text style={[styles.formLabel, { color: theme.text }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border
                }
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={theme.inactive}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Text style={[styles.formLabel, { color: theme.text, marginTop: 16 }]}>Password</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border
                }
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={theme.inactive}
              secureTextEntry
            />
            
            {error ? (
              <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
            ) : null}
            
            <Pressable 
              style={[
                styles.signInButton, 
                { backgroundColor: theme.primary },
                (!email || !password) && { opacity: 0.7 }
              ]}
              onPress={handleSignIn}
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
            </Pressable>
            
            <Link href="/forgot-password" asChild>
              <Pressable>
                <Text style={[styles.forgotPassword, { color: theme.primary }]}>
                  Forgot Password?
                </Text>
              </Pressable>
            </Link>
          </View>
          
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.text }]}>
              Don't have an account?{' '}
            </Text>
            <Link href="/(auth)/sign-up" asChild>
              <Pressable>
                <Text style={[styles.signUpText, { color: theme.primary }]}>Sign Up</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  formContainer: {
    marginTop: 24,
  },
  formLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  signInButton: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  signInButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  forgotPassword: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  signUpText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
    textAlign: 'center',
  },
});