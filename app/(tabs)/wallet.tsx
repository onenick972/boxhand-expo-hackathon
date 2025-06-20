import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { BlurView } from 'expo-blur';
import { ArrowUpRight, ArrowDownRight, Wallet, ArrowDownLeft, Link as LinkIcon, Shield, Zap, Users } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import TransactionList from '@/components/TransactionList';
import WalletSelector from '@/components/WalletSelector';
import { connectWallet, getBalance, getTransactions, sendGroupTransactions } from '@/lib/algorand';

export default function WalletScreen() {
  const { theme, isDark } = useTheme();
  const { user, connectWallet: updateUserWallet } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [txList, setTxList] = useState<any[]>([]);

  const handleConnectWallet = async (walletType: 'pera' | 'myalgo' | 'defly' | 'exodus' | 'lute') => {
    try {
      setIsConnecting(true);
      const address = await connectWallet(walletType);
      await updateUserWallet(address);
      setShowWalletModal(false);
      const newBalance = await getBalance(address);
      setBalance(newBalance);
      const transactions = await getTransactions(address);
      setTxList(transactions);
    } catch (err) {
      console.error(err);
      Alert.alert('Connection Error', 'Wallet connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSendAtomic = async () => {
    if (!user?.walletAddress) {
      Alert.alert('Error', 'No wallet connected');
      return;
    }

    try {
      const txId = await sendGroupTransactions([
        { from: user.walletAddress, to: 'ESCROW_ADDR', amountAlgo: 2 },
        { from: 'ESCROW_ADDR', to: 'MEMBER_ADDR', amountAlgo: 2 },
      ]);
      Alert.alert('Transaction Sent', `Tx ID: ${txId}`);
    } catch (err) {
      Alert.alert('Error', 'Atomic transfer failed');
    }
  };

  const isWalletConnected = user?.walletAddress;

  if (!isWalletConnected) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}> 
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Wallet</Text>
            
            <BlurView
              intensity={80}
              tint={isDark ? 'dark' : 'light'}
              style={[styles.connectCard, { borderColor: theme.border }]}
            >
              <Wallet size={48} color={theme.primary} />
              <Text style={[styles.connectTitle, { color: theme.text }]}>
                Connect Your Wallet
              </Text>
              <Text style={[styles.connectDescription, { color: theme.inactive }]}>
                Connect your Algorand wallet to start participating in savings circles
              </Text>
              
              <Pressable 
                style={[styles.connectButton, { backgroundColor: theme.primary }]}
                onPress={() => setShowWalletModal(true)}
              >
                <Text style={styles.connectButtonText}>Connect Wallet</Text>
              </Pressable>
            </BlurView>
          </ScrollView>
        </SafeAreaView>
        <WalletSelector
          visible={showWalletModal}
          onSelect={handleConnectWallet}
          onClose={() => setShowWalletModal(false)}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Wallet</Text>
          </View>

          {/* Balance Card */}
          <Animated.View entering={FadeInUp.duration(600)}>
            <BlurView
              intensity={80}
              tint={isDark ? 'dark' : 'light'}
              style={[styles.balanceCard, { borderColor: theme.border }]}
            >
              <View style={styles.balanceHeader}>
                <Text style={[styles.balanceLabel, { color: theme.inactive }]}>
                  Total Balance
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: theme.success + '20' }]}>
                  <View style={[styles.statusDot, { backgroundColor: theme.success }]} />
                  <Text style={[styles.statusText, { color: theme.success }]}>
                    Connected
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.balanceAmount, { color: theme.text }]}>
                {balance?.toFixed(2) || '0.00'} ALGO
              </Text>
              
              <Text style={[styles.walletAddress, { color: theme.inactive }]}>
                {user.walletAddress?.slice(0, 8)}...{user.walletAddress?.slice(-8)}
              </Text>
            </BlurView>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <View style={styles.actionsContainer}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Quick Actions
              </Text>
              
              <View style={styles.actionsGrid}>
                <Pressable 
                  style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                  onPress={handleSendAtomic}
                >
                  <ArrowUpRight size={24} color={theme.primary} />
                  <Text style={[styles.actionTitle, { color: theme.text }]}>
                    Send Circle Payout
                  </Text>
                  <Text style={[styles.actionDescription, { color: theme.inactive }]}>
                    Execute atomic transfer
                  </Text>
                </Pressable>
                
                <Pressable 
                  style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  <ArrowDownRight size={24} color={theme.accent} />
                  <Text style={[styles.actionTitle, { color: theme.text }]}>
                    Receive
                  </Text>
                  <Text style={[styles.actionDescription, { color: theme.inactive }]}>
                    Show QR code
                  </Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>

          {/* Transaction History */}
          <Animated.View entering={FadeInDown.delay(400).duration(600)}>
            <View style={styles.transactionsContainer}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Recent Transactions
              </Text>
              <TransactionList transactions={txList} />
            </View>
          </Animated.View>
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
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  connectCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    overflow: 'hidden',
  },
  connectTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  connectDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  connectButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  connectButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  balanceCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    overflow: 'hidden',
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  balanceAmount: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  walletAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  actionsContainer: {
    marginHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginTop: 8,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  transactionsContainer: {
    marginTop: 24,
    marginBottom: 100,
  },
});