import algosdk, {
  Algodv2,
  Indexer,
  makePaymentTxnWithSuggestedParamsFromObject,
  assignGroupID,
  LogicSigAccount,
} from 'algosdk';
import { Core } from '@walletconnect/core';
import { WalletKit } from '@reown/walletkit';
import { Buffer } from 'buffer';

// Algorand network clients
const algodClient = new Algodv2(
  process.env.EXPO_PUBLIC_ALGOD_TOKEN || '',
  process.env.EXPO_PUBLIC_ALGOD_SERVER || '',
  process.env.EXPO_PUBLIC_ALGOD_PORT || ''
);

const indexerClient = new Indexer(
  process.env.EXPO_PUBLIC_ALGOD_TOKEN || '',
  process.env.EXPO_PUBLIC_ALGOD_INDEX_SERVER || '',
  process.env.EXPO_PUBLIC_ALGOD_PORT || ''
);

// WalletConnect Core instance
const core = new Core({
  projectId: process.env.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
});

// Async WalletKit initialization
let walletKit: any = null;
let walletKitReady: Promise<any> | null = null;

async function getWalletKit() {
  if (walletKit) return walletKit;
  if (!walletKitReady) {
    walletKitReady = WalletKit.init({
      core,
      metadata: {
        name: 'BoxHand',
        description: 'Micro-savings Circle App',
        url: 'https://boxhand.app',
        icons: ['https://yourdomain.com/icon.png'],
        redirect: {
          native: 'boxhand://',
        },
      },
    });
  }
  walletKit = await walletKitReady;
  return walletKit;
}

let connectedAccounts: string[] = [];

// Connect user's wallet (Pera via Reown)
export async function connectWallet(): Promise<string> {
  const kit = await getWalletKit();
  const account = await kit.connect();
  if (!account?.address) throw new Error('Failed to connect wallet');
  connectedAccounts = [account.address];
  return account.address;
}

// Disconnect wallet
export async function disconnectWallet() {
  const kit = await getWalletKit();
  kit.disconnect();
  connectedAccounts = [];
}

// Get balance of connected wallet or any address
export async function getBalance(address?: string): Promise<number> {
  const addr = address || connectedAccounts[0];
  if (!addr) throw new Error('No wallet connected');
  const info = await algodClient.accountInformation(addr).do();
  return info.amount / 1e6;
}

// Get list of all transactions for an address
export async function getTransactions(address?: string): Promise<any[]> {
  const addr = address || connectedAccounts[0];
  if (!addr) throw new Error('No wallet connected');
  const txns = await indexerClient
    .searchForTransactions()
    .address(addr)
    .limit(50)
    .do();
  return txns.transactions;
}

// Send Algos to another account or circle
export async function sendAlgo(
  to: string,
  amountAlgo: number,
  note?: string
): Promise<string> {
  const kit = await getWalletKit();
  const from = connectedAccounts[0];
  if (!from) throw new Error('No wallet connected');
  const suggestedParams = await algodClient.getTransactionParams().do();
  const txn = makePaymentTxnWithSuggestedParamsFromObject({
    from,
    to,
    amount: Math.round(amountAlgo * 1e6),
    note: note ? new Uint8Array(Buffer.from(note)) : undefined,
    suggestedParams,
  });
  const [signedTxn] = await kit.signTransactions([txn]);
  const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
  await waitForConfirmation(algodClient, txId, 3);
  return txId;
}

// Request Algos from another account (creates a request record, not an on-chain tx)
export async function requestAlgo(
  from: string,
  amountAlgo: number,
  circleId?: string
): Promise<{
  from: string;
  to: string;
  amount: number;
  circleId?: string;
  status: string;
}> {
  // This is an off-chain operation, you would typically store this in your backend
  // Here we just return a mock object
  return {
    from,
    to: connectedAccounts[0],
    amount: amountAlgo,
    circleId,
    status: 'pending',
  };
}

// Send group transactions (e.g., for circle payouts)
export async function sendGroupTransactions(
  txns: { to: string; amountAlgo: number; note?: string }[]
): Promise<string> {
  const kit = await getWalletKit();
  const from = connectedAccounts[0];
  if (!from) throw new Error('No wallet connected');
  const suggestedParams = await algodClient.getTransactionParams().do();

  const unsignedTxns = txns.map((tx) =>
    makePaymentTxnWithSuggestedParamsFromObject({
      from,
      to: tx.to,
      amount: Math.round(tx.amountAlgo * 1e6),
      note: tx.note ? new Uint8Array(Buffer.from(tx.note)) : undefined,
      suggestedParams,
    })
  );
  assignGroupID(unsignedTxns);
  const signedTxns = await kit.signTransactions(unsignedTxns);
  const { txId } = await algodClient.sendRawTransaction(signedTxns).do();
  await waitForConfirmation(algodClient, txId, 3);
  return txId;
}

// Deploy a Circle smart contract (mock implementation)
export async function deployCircleContract(
  name: string,
  contributionAmount: number,
  frequency: string,
  memberAddresses: string[]
): Promise<string> {
  // In a real implementation, you would compile and deploy a TEAL contract here
  // For now, return a mock contract ID
  return `CIRCLE_${Date.now()}`;
}

// Withdraw from a Circle contract using LogicSig
export async function withdrawFromCircleContract(
  logicSig: LogicSigAccount,
  to: string,
  amountAlgo: number
): Promise<string> {
  const suggestedParams = await algodClient.getTransactionParams().do();
  const txn = makePaymentTxnWithSuggestedParamsFromObject({
    from: logicSig.address(),
    to,
    amount: Math.round(amountAlgo * 1e6),
    suggestedParams,
  });
  const signedTxn = algosdk.signLogicSigTransactionObject(txn, logicSig).blob;
  const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
  await waitForConfirmation(algodClient, txId, 3);
  return txId;
}

// Utility: Validate Algorand address
export function isValidAlgorandAddress(address: string): boolean {
  try {
    return algosdk.isValidAddress(address);
  } catch {
    return false;
  }
}
// Utility: Convert microAlgos to Algos
export function microAlgosToAlgos(microAlgos: number): number {
  return microAlgos / 1e6;
}
// Utility: Convert Algos to microAlgos
export function algosToMicroAlgos(algo: number): number {
  return Math.round(algo * 1e6);
}
// Utility: Wait for transaction confirmation
export async function waitForConfirmation(
  algodClient: Algodv2,
  txId: string,
  timeout = 10
): Promise<void> {
  const startTime = Date.now();
  while (true) {
    const status = await algodClient.status().do();
    if (status.lastRound > 0) {
      const pendingInfo = await algodClient
        .pendingTransactionInformation(txId)
        .do();
      if (pendingInfo && pendingInfo.confirmedRound) {
        return;
      }
    }
    if (Date.now() - startTime > timeout * 1000) {
      throw new Error(
        `Transaction ${txId} not confirmed within ${timeout} seconds`
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
// Utility: Convert base64 to Uint8Array
export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
// Utility: Convert Uint8Array to base64
export function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  let binaryString = '';
  for (let i = 0; i < uint8Array.length; i++) {
    binaryString += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binaryString);
}
