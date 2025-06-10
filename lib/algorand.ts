
import algosdk from 'algosdk';
import { PeraWalletConnect } from '@perawallet/connect';
import MyAlgoConnect from '@randlabs/myalgo-connect';
import { WalletConnectModal } from '@walletconnect/modal';
import { createWalletClient } from '@walletconnect/core';

//Initialize Algo Client
const algodClient = new algosdk.Algodv2(process.env.EXPO_PUBLIC_ALGOD_TOKEN || '',
  process.env.EXPO_PUBLIC_ALGOD_SERVER || '',
  process.env.EXPO_PUBLIC_ALGOD_PORT || '');

//Initialize Algo Indexer
const indexerClient = new algosdk.Indexer( process.env.EXPO_PUBLIC_ALGOD_TOKEN || '',
  process.env.EXPO_PUBLIC_ALGOD_INDEX_SERVER || '',
  process.env.EXPO_PUBLIC_ALGOD_PORT || '');

const peraWallet = new PeraWalletConnect();
const myAlgoWallet = new MyAlgoConnect();

const wcModal = new WalletConnectModal({
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // REQUIRED
  chains: ['algorand:testnet'],
  metadata: {
    name: 'BoxHand',
    description: 'Micro-savings Circle App',
    url: 'https://boxhand.app',
    icons: ['https://yourdomain.com/icon.png'],
  },
});

let activeWallet: 'pera' | 'myalgo' | 'defly' | 'exodus' | 'lute' | null = null;
let connectedAccounts: string[] = [];

export async function connectWallet(wallet: typeof activeWallet): Promise<string> {
  activeWallet = wallet;

  if (wallet === 'pera') {
    connectedAccounts = await peraWallet.connect();
    peraWallet.connector?.on('disconnect', disconnectWallet);
    return connectedAccounts[0];
  }

  if (wallet === 'myalgo') {
    const accounts = await myAlgoWallet.connect();
    connectedAccounts = accounts.map(acc => acc.address);
    return connectedAccounts[0];
  }

  // Defly, Exodus, Lute
  const session = await wcModal.connect();
  const address = session.namespaces.algorand.accounts[0].split(':')[2];
  connectedAccounts = [address];
  return address;
}

export function disconnectWallet() {
  if (activeWallet === 'pera') peraWallet.disconnect();
  if (activeWallet === 'myalgo') myAlgoWallet.disconnect?.();
  if (activeWallet === 'defly' || activeWallet === 'exodus' || activeWallet === 'lute') wcModal.disconnect();

  connectedAccounts = [];
  activeWallet = null;
}

export async function getBalance(address: string): Promise<number> {
  const info = await algodClient.accountInformation(address).do();
  return info.amount / 1e6;
}

export async function getTransactions(address: string): Promise<any[]> {
  const txns = await indexerClient.searchForTransactions().address(address).limit(10).do();
  return txns.transactions;
}

export async function sendAlgo(from: string, to: string, amountAlgo: number) {
  const suggestedParams = await algodClient.getTransactionParams().do();
  const amount = Math.round(amountAlgo * 1e6);

  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from,
    to,
    amount,
    suggestedParams,
  });

  let signedTxns;

  if (activeWallet === 'pera') {
    signedTxns = await peraWallet.signTransaction([{ txn, signers: [from] }]);
  } else if (activeWallet === 'myalgo') {
    const signed = await myAlgoWallet.signTransaction(txn.toByte());
    signedTxns = [signed.blob];
  } else {
    const wcClient = createWalletClient({ core: wcModal.core });
    const encodedTxn = Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString('base64');
    const result = await wcClient.request({
      topic: wcModal.session.topic,
      chainId: 'algorand:testnet',
      request: {
        method: 'algorand_signTxn',
        params: [[{ txn: encodedTxn }]],
      },
    });
    signedTxns = [Buffer.from(result[0], 'base64')];
  }

  const { txId } = await algodClient.sendRawTransaction(signedTxns).do();
  await waitForConfirmation(txId);
  return txId;
}

export async function waitForConfirmation(txId: string): Promise<void> {
  let lastRound = (await algodClient.status().do())['last-round'];
  while (true) {
    const info = await algodClient.pendingTransactionInformation(txId).do();
    if (info['confirmed-round']) return;
    lastRound++;
    await algodClient.statusAfterBlock(lastRound).do();
  }
}

export async function compileTeal(tealSource: string): Promise<algosdk.LogicSigAccount> {
  const compileResp = await algodClient.compile(tealSource).do();
  const programBytes = new Uint8Array(Buffer.from(compileResp.result, 'base64'));
  return new algosdk.LogicSigAccount(programBytes);
}

export async function withdrawFromCircleContract(
  logicSig: algosdk.LogicSigAccount,
  to: string,
  amountAlgo: number
) {
  const suggestedParams = await algodClient.getTransactionParams().do();
  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: logicSig.address(),
    to,
    amount: Math.round(amountAlgo * 1e6),
    suggestedParams,
  });

  const { txId } = await algodClient.sendRawTransaction(txn.signTxn(logicSig.sk!)).do();
  await waitForConfirmation(txId);
  return txId;
}
