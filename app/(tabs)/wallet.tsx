import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { BlurView } from 'expo-blur';
import { ArrowUpRight, ArrowDownRight, Wallet, ArrowDownLeft, Link as LinkIcon, Shield, Zap, Users } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import TransactionList from '@/components/TransactionList';
import WalletSelector from '../../components/WalletSelector';
import { connectWallet, getBalance, getTransactions, sendGroupTransactions } from '@/lib/algorand';

export default function WalletScreen() {
  const { theme, isDark } = useTheme();
  const { user, connectWallet: updateUserWallet } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [txList, setTxList] = useState<any[]>([]);

  const handleConnectWallet = async (walletType) => {
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
            <Pressable onPress={() => setShowWalletModal(true)}>
              <Text style={{ color: theme.primary, fontSize: 16 }}>Connect Wallet</Text>
            </Pressable>
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
          <Text style={[styles.headerTitle, { color: theme.text }]}>Wallet</Text>
          <Text style={[styles.balanceAmount, { color: theme.text }]}>Balance: {balance?.toFixed(2)} ALGO</Text>

          <Pressable onPress={handleSendAtomic}>
            <Text style={{ color: theme.primary }}>Send Circle Payout</Text>
          </Pressable>

          <TransactionList transactions={txList} />
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
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  balanceAmount: {
    fontSize: 20,
    marginVertical: 12,
  },
});