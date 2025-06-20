import algosdk, {
  TransactionSigner,
  encodeUnsignedTransaction,
  decodeSignedTransaction,
  makePaymentTxnWithSuggestedParamsFromObject,
  OnApplicationComplete,
  LogicSigAccount,
  waitForConfirmation as waitTxConfirmation,
  Algodv2 as AlgodClient,
  Indexer as IndexerClient,
  assignGroupID,
} from 'algosdk';

import { PeraWalletConnect } from '@perawallet/connect';
import MyAlgoConnect from '@randlabs/myalgo-connect';

import { WalletConnectModal } from '@walletconnect/modal';
import SignClient from '@walletconnect/sign-client';
import { Buffer } from 'buffer';
import { WALLETCONNECT_PROJECT_ID, APP_NAME, APP_DESCRIPTION, APP_URL, APP_ICON } from '@/constants/Config';

const algodClient = new AlgodClient(
  process.env.EXPO_PUBLIC_ALGOD_TOKEN || '',
  process.env.EXPO_PUBLIC_ALGOD_SERVER || '',
  process.env.EXPO_PUBLIC_ALGOD_PORT || ''
);

const indexerClient = new IndexerClient(
  process.env.EXPO_PUBLIC_ALGOD_TOKEN || '',
  process.env.EXPO_PUBLIC_ALGOD_INDEX_SERVER || '',
  process.env.EXPO_PUBLIC_ALGOD_PORT || ''
);

const peraWallet = new PeraWalletConnect();
const myAlgoWallet = new MyAlgoConnect();

const wcModal = new WalletConnectModal({
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: ['algorand:testnet'],
});

let activeWallet: 'pera' | 'myalgo' | 'defly' | 'exodus' | 'lute' | null = null;
let connectedAccounts: string[] = [];
let wcSession: any = null;
let wcClient: SignClient | null = null;

export async function connectWallet(
  wallet: typeof activeWallet
): Promise<string> {
  activeWallet = wallet;

  if (wallet === 'pera') {
    connectedAccounts = await peraWallet.connect();
    peraWallet.connector?.on('disconnect', disconnectWallet);
    return connectedAccounts[0];
  }

  if (wallet === 'myalgo') {
    const accounts = await myAlgoWallet.connect();
    connectedAccounts = accounts.map((acc) => acc.address);
    return connectedAccounts[0];
  }

  // WalletConnect v2
  if (!wcClient) {
    wcClient = await SignClient.init({
      projectId: WALLETCONNECT_PROJECT_ID,
      metadata: {
        name: APP_NAME,
        description: APP_DESCRIPTION,
        url: APP_URL,
        icons: [APP_ICON],
      },
    });
  }

  await wcModal.openModal();
  const sessions = wcClient.session.values;
  wcSession = sessions.length > 0 ? sessions[0] : null;
  if (!wcSession) throw new Error('No WalletConnect session established');
  const address = wcSession.namespaces.algorand.accounts[0].split(':')[2];
  connectedAccounts = [address];
  return address;
}

export function disconnectWallet() {
  if (activeWallet === 'pera') peraWallet.disconnect();
  if (activeWallet === 'myalgo') {
    // No disconnect method for MyAlgoConnect, just clear state
  }
  if (['defly', 'exodus', 'lute'].includes(activeWallet!)) {
    if (wcSession && wcClient)
      wcClient.disconnect({
        topic: wcSession.topic,
        reason: { code: 6000, message: 'User disconnected' },
      });
    wcSession = null;
  }
  connectedAccounts = [];
  activeWallet = null;
}

export async function getBalance(address: string): Promise<number> {
  const info = await algodClient.accountInformation(address).do();
  return info.amount / 1e6;
}

export async function getTransactions(address: string): Promise<any[]> {
  const txns = await indexerClient
    .searchForTransactions()
    .address(address)
    .limit(10)
    .do();
  return txns.transactions;
}

export async function sendAlgo(
  from: string,
  to: string,
  amountAlgo: number
): Promise<string> {
  const suggestedParams = await algodClient.getTransactionParams().do();
  const txn = makePaymentTxnWithSuggestedParamsFromObject({
    from,
    to,
    amount: Math.round(amountAlgo * 1e6),
    suggestedParams,
  });

  let signedTxns: Uint8Array[];

  if (activeWallet === 'pera') {
    signedTxns = await peraWallet.signTransaction([[{ txn, signers: [from] }]]);
  } else if (activeWallet === 'myalgo') {
    const signed = await myAlgoWallet.signTransaction(txn.toByte());
    signedTxns = [signed.blob];
  } else {
    // WalletConnect v2
    if (!wcSession || !wcClient) throw new Error('No WalletConnect session');
    const encodedTxn = Buffer.from(encodeUnsignedTransaction(txn)).toString(
      'base64'
    );
    const result = await wcClient.request({
      topic: wcSession.topic,
      chainId: 'algorand:testnet',
      request: {
        method: 'algo_signTxn',
        params: [[{ txn: encodedTxn }]],
      },
    });
    const resultArr = result as string[];
    signedTxns = [Buffer.from(resultArr[0], 'base64')];
  }

  const { txId } = await algodClient.sendRawTransaction(signedTxns).do();
  await waitTxConfirmation(algodClient, txId, 3);
  return txId;
}

export async function compileTeal(
  tealSource: string
): Promise<LogicSigAccount> {
  const compileResp = await algodClient.compile(tealSource).do();
  const programBytes = new Uint8Array(
    Buffer.from(compileResp.result, 'base64')
  );
  return new LogicSigAccount(programBytes);
}

export async function withdrawFromCircleContract(
  logicSig: LogicSigAccount,
  to: string,
  amountAlgo: number
) {
  const suggestedParams = await algodClient.getTransactionParams().do();
  const txn = makePaymentTxnWithSuggestedParamsFromObject({
    from: logicSig.address(),
    to,
    amount: Math.round(amountAlgo * 1e6),
    suggestedParams,
  });

  const signedTxn = algosdk.signLogicSigTransactionObject(txn, logicSig).blob;
  const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
  await waitTxConfirmation(algodClient, txId, 3);
  return txId;
}

export async function sendGroupTransactions(
  transactions: {
    from: string;
    to: string;
    amountAlgo: number;
  }[]
): Promise<string> {
  const suggestedParams = await algodClient.getTransactionParams().do();

  // Build unsigned txns
  const unsignedTxns = transactions.map((tx) =>
    makePaymentTxnWithSuggestedParamsFromObject({
      from: tx.from,
      to: tx.to,
      amount: Math.round(tx.amountAlgo * 1e6),
      suggestedParams,
    })
  );

  // Group them atomically
  assignGroupID(unsignedTxns);

  let signedTxns: Uint8Array[];

  if (activeWallet === 'pera') {
    signedTxns = await peraWallet.signTransaction([
      unsignedTxns.map((txn) => ({
        txn, // pass the Transaction object directly
        signers: [
          typeof txn.from === 'string' ? txn.from : txn.from.toString(),
        ],
      })),
    ]);
  } else if (activeWallet === 'myalgo') {
    const blobs = await myAlgoWallet.signTransaction(
      unsignedTxns.map((tx) => tx.toByte())
    );
    signedTxns = blobs.map((b: any) => b.blob);
  } else {
    // WalletConnect v2
    if (!wcSession || !wcClient) throw new Error('No WalletConnect session');
    const encoded = unsignedTxns.map((tx) => ({
      txn: Buffer.from(encodeUnsignedTransaction(tx)).toString('base64'),
    }));

    const result = await wcClient.request({
      topic: wcSession.topic,
      chainId: 'algorand:testnet',
      request: {
        method: 'algo_signTxn',
        params: [encoded],
      },
    });

    signedTxns = (result as string[]).map((r: string) =>
      Buffer.from(r, 'base64')
    );
  }

  const { txId } = await algodClient.sendRawTransaction(signedTxns).do();
  await waitTxConfirmation(algodClient, txId, 3);
  return txId;
}

export async function deployCircleContract(
  name: string,
  contributionAmount: number,
  frequency: string,
  memberAddresses: string[]
): Promise<string> {
  // Mock implementation for now
  // In a real implementation, this would deploy a smart contract
  return `CONTRACT_${Date.now()}`;
}

export function isValidAlgorandAddress(address: string): boolean {
  try {
    return algosdk.isValidAddress(address);
  } catch {
    return false;
  }
}