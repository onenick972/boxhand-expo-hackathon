import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { BlurView } from 'expo-blur';
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  ArrowDownLeft,
  Link as LinkIcon,
  Shield,
  Zap,
  Users,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import TransactionList from '@/components/TransactionList';
import { connectWallet } from '@/lib/walletHelper';

// Mock data for connected wallet
const mockBalance = 2450.75;
const mockAlgoPrice = 1.35;
// Mock user data
export default function WalletScreen() {
  const { theme, isDark } = useTheme();
  const { user, connectWallet: updateUserWallet } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      const walletAddress = await connectWallet();

      // Update user context with wallet address
      //await updateUserWallet(walletAddress);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      Alert.alert(
        'Wallet Connection Failed',
        'Unable to connect your wallet. Please try again.'
      );
    } finally {
      setIsConnecting(false);
    }
  };

  // Check if wallet is connected
  const isWalletConnected = user?.walletAddress;

  if (!isWalletConnected) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                Wallet
              </Text>
            </View>

            {/* Hero Section */}
            <Animated.View
              entering={FadeInUp.duration(800)}
              style={styles.heroSection}
            >
              <View
                style={[
                  styles.walletIconContainer,
                  { backgroundColor: theme.primary + '20' },
                ]}
              >
                <Wallet size={64} color={theme.primary} />
              </View>

              <Text style={[styles.heroTitle, { color: theme.text }]}>
                Connect Your Algorand Wallet
              </Text>

              <Text style={[styles.heroSubtitle, { color: theme.inactive }]}>
                Securely link your Algorand wallet to participate in savings
                circles, make contributions, and manage your funds with complete
                transparency.
              </Text>
            </Animated.View>

            {/* Features Section */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(600)}
              style={styles.featuresSection}
            >
              <FeatureCard
                icon={<Shield size={24} color={theme.success} />}
                title="Secure & Private"
                description="Your wallet remains under your control. We never store your private keys."
                theme={theme}
                isDark={isDark}
              />

              <FeatureCard
                icon={<Zap size={24} color={theme.accent} />}
                title="Fast Transactions"
                description="Leverage Algorand's speed for instant contributions and payouts."
                theme={theme}
                isDark={isDark}
              />

              <FeatureCard
                icon={<Users size={24} color={theme.primary} />}
                title="Circle Participation"
                description="Join savings circles and build trust through consistent participation."
                theme={theme}
                isDark={isDark}
              />
            </Animated.View>

            {/* Connect Button */}
            <Animated.View
              entering={FadeInDown.delay(400).duration(600)}
              style={styles.connectSection}
            >
              <BlurView
                intensity={80}
                tint={isDark ? 'dark' : 'light'}
                style={[styles.connectCard, { borderColor: theme.border }]}
              >
                <Text style={[styles.connectTitle, { color: theme.text }]}>
                  Ready to get started?
                </Text>

                <Text
                  style={[styles.connectDescription, { color: theme.inactive }]}
                >
                  Connect your Algorand wallet to unlock all features and start
                  your savings journey.
                </Text>

                <Pressable
                  style={[
                    styles.connectButton,
                    { backgroundColor: theme.primary },
                    isConnecting && { opacity: 0.7 },
                  ]}
                  onPress={handleConnectWallet}
                  disabled={isConnecting}
                >
                  <Text style={styles.connectButtonText}>
                    {isConnecting ? 'CONNECTING...' : 'CONNECT YOUR WALLET'}
                  </Text>
                </Pressable>

                <Text
                  style={[styles.supportedWallets, { color: theme.inactive }]}
                >
                  Supports MyAlgo and other Algorand wallets
                </Text>
              </BlurView>
            </Animated.View>

            {/* Security Notice */}
            <Animated.View
              entering={FadeInDown.delay(600).duration(600)}
              style={styles.securityNotice}
            >
              <View style={styles.securityHeader}>
                <Shield size={16} color={theme.success} />
                <Text style={[styles.securityTitle, { color: theme.text }]}>
                  Your Security Matters
                </Text>
              </View>

              <Text style={[styles.securityText, { color: theme.inactive }]}>
                BoxHand uses industry-standard security practices. Your private
                keys never leave your device, and all transactions are signed
                locally in your wallet.
              </Text>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // Wallet is connected - show wallet information
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Wallet
            </Text>
          </View>

          {/* Balance Card */}
          <Animated.View entering={FadeInDown.duration(600)}>
            <BlurView
              intensity={80}
              tint={isDark ? 'dark' : 'light'}
              style={[styles.balanceCard, { borderColor: theme.border }]}
            >
              <View style={styles.balanceHeader}>
                <Text style={[styles.balanceLabel, { color: theme.text }]}>
                  Total Balance
                </Text>
                <Image
                  source={require('@/assets/images/algorand-logo.png')}
                  style={styles.algorandLogo}
                />
              </View>
              <Text style={[styles.balanceAmount, { color: theme.text }]}>
                {mockBalance.toFixed(2)} ALGO
              </Text>
              <Text style={[styles.fiatAmount, { color: theme.inactive }]}>
                ${(mockBalance * mockAlgoPrice).toFixed(2)} USD
              </Text>

              <View style={styles.actionsContainer}>
                <ActionButton
                  icon={<ArrowUpRight size={20} color="white" />}
                  label="Send"
                  color={theme.primary}
                  onPress={() => {}}
                />
                <ActionButton
                  icon={<ArrowDownRight size={20} color="white" />}
                  label="Receive"
                  color={theme.success}
                  onPress={() => {}}
                />
                <ActionButton
                  icon={<ArrowDownLeft size={20} color="white" />}
                  label="Buy"
                  color={theme.accent}
                  onPress={() => {}}
                />
              </View>
            </BlurView>
          </Animated.View>

          {/* Connected Wallet Info */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <BlurView
              intensity={80}
              tint={isDark ? 'dark' : 'light'}
              style={[styles.connectedCard, { borderColor: theme.border }]}
            >
              <View style={styles.connectedHeader}>
                <Text style={[styles.connectedTitle, { color: theme.text }]}>
                  Connected Wallet
                </Text>
                <View
                  style={[
                    styles.statusIndicator,
                    { backgroundColor: theme.success },
                  ]}
                />
              </View>
              <View style={styles.addressContainer}>
                <Text style={[styles.walletAddress, { color: theme.text }]}>
                  {formatWalletAddress(user.walletAddress!)}
                </Text>
                <Pressable style={styles.copyButton}>
                  <LinkIcon size={16} color={theme.primary} />
                </Pressable>
              </View>
            </BlurView>
          </Animated.View>

          {/* Transactions */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={styles.transactionsContainer}
          >
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Recent Transactions
              </Text>
              <Pressable style={styles.viewAllButton}>
                <Text style={[styles.viewAllText, { color: theme.primary }]}>
                  View All
                </Text>
              </Pressable>
            </View>
            <TransactionList />
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  theme: any;
  isDark: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  theme,
  isDark,
}) => {
  return (
    <BlurView
      intensity={80}
      tint={isDark ? 'dark' : 'light'}
      style={[styles.featureCard, { borderColor: theme.border }]}
    >
      <View style={styles.featureIconContainer}>{icon}</View>
      <Text style={[styles.featureTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.featureDescription, { color: theme.inactive }]}>
        {description}
      </Text>
    </BlurView>
  );
};

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onPress: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  color,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress} style={styles.actionButton}>
      <View style={[styles.actionIconContainer, { backgroundColor: color }]}>
        {icon}
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
};

// Helper function to format wallet address
function formatWalletAddress(address: string): string {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },

  // Wallet Not Connected Styles
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  walletIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },

  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  featureCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  featureIconContainer: {
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },

  connectSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  connectCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 24,
    alignItems: 'center',
  },
  connectTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  connectDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  connectButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  connectButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: 'white',
    letterSpacing: 0.5,
  },
  supportedWallets: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },

  securityNotice: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  securityTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  securityText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },

  // Connected Wallet Styles
  balanceCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  algorandLogo: {
    width: 24,
    height: 24,
  },
  balanceAmount: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    marginTop: 8,
  },
  fiatAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },

  connectedCard: {
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 24,
  },
  connectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  connectedTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletAddress: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  copyButton: {
    padding: 8,
  },

  transactionsContainer: {
    marginTop: 24,
    marginBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  viewAllButton: {
    padding: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});
