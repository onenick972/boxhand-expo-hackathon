import algosdk from 'algosdk';
import { supabase } from './supabase';

// Initialize Algorand client
const algodClient = new algosdk.Algodv2(
  process.env.EXPO_PUBLIC_ALGOD_TOKEN || '',
  process.env.EXPO_PUBLIC_ALGOD_SERVER || '',
  process.env.EXPO_PUBLIC_ALGOD_PORT || ''
);

// Wallet connection types
export type WalletType = 'pera' | 'myalgo';

// Connect wallet and update user profile
// Connect to wallet and return address
export async function connectWallet(type: WalletType): Promise<string> {
  try {
    let walletAddress: string;
    
    if (type === 'pera') {
      // In production, integrate with PeraWallet SDK
      const mockAccount = algosdk.generateAccount();
      walletAddress = mockAccount.addr;
    } else {
      // In production, integrate with MyAlgo SDK
      const mockAccount = algosdk.generateAccount();
      walletAddress = mockAccount.addr;
    }
    
    // Verify address is valid
    if (!isValidAlgorandAddress(walletAddress)) {
      throw new Error('Invalid wallet address');
    }
    
    // Update user profile with wallet address
    const { error } = await supabase.auth.updateUser({
      data: { wallet_address: walletAddress }
    });

    if (error) throw error;
    
    return walletAddress;
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw error;
  }
}

export async function deployCircleContract(
  name: string,
  contributionAmount: number,
  frequency: string,
  memberAddresses: string[]
) {
  try {
    // This is a simplified version. In production, you'd need to:
    // 1. Create and deploy actual smart contract
    // 2. Handle contract initialization
    // 3. Set up proper error handling
    // 4. Implement proper transaction signing
    
    // For demo, we'll just return a mock contract address
    const mockContractAddress = `ALGO${Math.random().toString(36).substring(2, 15)}`;
    return mockContractAddress;
  } catch (error) {
    console.error('Failed to deploy circle contract:', error);
    throw error;
  }
}

// Verify if an address is valid
export function isValidAlgorandAddress(address: string): boolean {
  try {
    return algosdk.isValidAddress(address);
  } catch {
    return false;
  }
}