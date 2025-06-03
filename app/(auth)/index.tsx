import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  const { theme, isDark } = useTheme();
  
  return (
    <View style={StyleSheet.flatten([styles.container, { backgroundColor: theme.background }])}>
      <LinearGradient
        colors={['rgba(123, 97, 255, 0.5)', 'rgba(0, 210, 198, 0.3)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('@/assets/images/boxhand-logo.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={StyleSheet.flatten([styles.appName, { color: theme.text }])}>
                BoxHand
              </Text>
            </View>
            
            <BlurView 
              intensity={80} 
              tint={isDark ? 'dark' : 'light'} 
              style={styles.infoCard}
            >
              <Text style={StyleSheet.flatten([styles.title, { color: theme.text }])}>
                Community Savings Circles
              </Text>
              <Text style={StyleSheet.flatten([styles.subtitle, { color: theme.text }])}>
                Securely pool and manage funds with your trusted community using blockchain technology
              </Text>
              
              <View style={styles.buttonContainer}>
                <Link href="/(auth)/sign-in" asChild>
                  <Pressable style={StyleSheet.flatten([styles.button, styles.primaryButton, { backgroundColor: theme.primary }])}>
                    <Text style={styles.buttonText}>Sign In</Text>
                  </Pressable>
                </Link>
                
                <Link href="/(auth)/sign-up" asChild>
                  <Pressable style={StyleSheet.flatten([styles.button, styles.secondaryButton, { borderColor: theme.primary }])}>
                    <Text style={StyleSheet.flatten([styles.secondaryButtonText, { color: theme.primary }])}>
                      Create Account
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </BlurView>
            
            <View style={styles.featuresContainer}>
              <FeatureItem 
                title="Secure Pooling" 
                description="Blockchain-secured community saving circles" 
                theme={theme}
              />
              <FeatureItem 
                title="Build Trust" 
                description="Earn trust scores through consistent participation" 
                theme={theme}
              />
              <FeatureItem 
                title="Easy Access" 
                description="Get micro-loans based on your participation history" 
                theme={theme}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

interface FeatureItemProps {
  title: string;
  description: string;
  theme: any;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ title, description, theme }) => (
  <BlurView intensity={60} tint="light" style={styles.featureItem}>
    <Text style={StyleSheet.flatten([styles.featureTitle, { color: theme.text }])}>{title}</Text>
    <Text style={StyleSheet.flatten([styles.featureDescription, { color: theme.text }])}>{description}</Text>
  </BlurView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  logoContainer: {
    marginTop: 16, // Reduced from 40
    alignItems: 'center',
  },
  logo: {
    width: 100, // Reduced from 120
    height: 100, // Reduced from 120
  },
  appName: {
    fontSize: 32,
    fontFamily: 'Outfit-Bold',
    marginTop: 8, // Reduced from 16
  },
  infoCard: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    marginVertical: 24, // Reduced from 32
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Outfit-Bold',
    textAlign: 'center',
    marginBottom: 12, // Reduced from 16
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    textAlign: 'center',
    marginBottom: 24, // Reduced from 32
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 12, // Reduced from 16
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
  },
  featuresContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12, // Reduced from 16
    marginBottom: 16,
  },
  featureItem: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    opacity: 0.8,
  },
});