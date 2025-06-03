import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { BlurView } from 'expo-blur';
import { ArrowUpRight, ArrowDownRight, Wallet, ArrowDownLeft, Plus, LinkIcon } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import TransactionList from '@/components/TransactionList';

// Mock data
const mockBalance = 2450.75;
const mockAlgoPrice = 1.35;

export default function WalletScreen() {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const [connectedWallet, setConnectedWallet] = useState(user?.walletAddress || '');

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Wallet</Text>
          </View>

          {/* Balance Card */}
          <Animated.View entering={FadeInDown.duration(600)}>
            <BlurView
              intensity={80}
              tint={isDark ? 'dark' : 'light'}
              style={[styles.balanceCard, { borderColor: theme.border }]}
            >
              <View style={styles.balanceHeader}>
                <Text style={[styles.balanceLabel, { color: theme.text }]}>Total Balance</Text>
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

          {/* Wallet Connection */}
          {!connectedWallet ? (
            <Animated.View entering={FadeInDown.delay(200).duration(600)}>
              <BlurView
                intensity={80}
                tint={isDark ? 'dark' : 'light'}
                style={[styles.connectCard, { borderColor: theme.border }]}
              >
                <Wallet size={40} color={theme.primary} />
                <Text style={[styles.connectTitle, { color: theme.text }]}>
                  Connect Your Algorand Wallet
                </Text>
                <Text style={[styles.connectDescription, { color: theme.inactive }]}>
                  Link your existing Algorand wallet to participate in savings circles
                </Text>
                <Pressable
                  style={[styles.connectButton, { backgroundColor: theme.primary }]}
                  onPress={() => setConnectedWallet('ALGO123456789ABCDEFG')}
                >
                  <Text style={styles.connectButtonText}>Connect Wallet</Text>
                </Pressable>
              </BlurView>
            </Animated.View>
          ) : (
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
                  <View style={[styles.statusIndicator, { backgroundColor: theme.success }]} />
                </View>
                <View style={styles.addressContainer}>
                  <Text style={[styles.walletAddress, { color: theme.text }]}>
                    {formatWalletAddress(connectedWallet)}
                  </Text>
                  <Pressable style={styles.copyButton}>
                    <LinkIcon size={16} color={theme.primary} />
                  </Pressable>
                </View>
              </BlurView>
            </Animated.View>
          )}

          {/* Transactions */}
          <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.transactionsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Transactions</Text>
              <Pressable style={styles.viewAllButton}>
                <Text style={[styles.viewAllText, { color: theme.primary }]}>View All</Text>
              </Pressable>
            </View>
            <TransactionList />
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onPress: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, color, onPress }) => {
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
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
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
  connectCard: {
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 24,
    alignItems: 'center',
  },
  connectTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  connectDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
  connectButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButtonText: {
    fontSize: 16,
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