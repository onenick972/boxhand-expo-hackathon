import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

export default function SignUpScreen() {
  const { theme } = useTheme();
  const { signUp, isLoading } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setError('');
      await signUp(email, password, name);
    } catch (err) {
      setError('Failed to create account');
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Create Account</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <Text style={[styles.formLabel, { color: theme.text }]}>Full Name</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border
                }
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor={theme.inactive}
            />
            
            <Text style={[styles.formLabel, { color: theme.text, marginTop: 16 }]}>Email</Text>
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
              placeholder="Create a password"
              placeholderTextColor={theme.inactive}
              secureTextEntry
            />
            
            <Text style={[styles.formLabel, { color: theme.text, marginTop: 16 }]}>Confirm Password</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border
                }
              ]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              placeholderTextColor={theme.inactive}
              secureTextEntry
            />
            
            {error ? (
              <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
            ) : null}
            
            <Pressable 
              style={[
                styles.signUpButton, 
                { backgroundColor: theme.primary },
                (!name || !email || !password || !confirmPassword) && { opacity: 0.7 }
              ]}
              onPress={handleSignUp}
              disabled={isLoading || !name || !email || !password || !confirmPassword}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.signUpButtonText}>Create Account</Text>
              )}
            </Pressable>
            
            <View style={styles.termsContainer}>
              <Text style={[styles.termsText, { color: theme.text }]}>
                By signing up, you agree to our{' '}
                <Text style={{ color: theme.primary }}>Terms of Service</Text> and{' '}
                <Text style={{ color: theme.primary }}>Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
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
  },
  formContainer: {
    marginTop: 8,
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
  signUpButton: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  signUpButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  termsContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  termsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
    textAlign: 'center',
  },
});