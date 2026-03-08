/**
 * Transaction helpers for the RWA Marketplace.
 *
 * Built on top of {@link @decentralchain/transactions} — the official
 * SDK for building, signing, and broadcasting DecentralChain txs.
 */

import {
  invokeScript,
  transfer,
  data,
  issue,
  broadcast,
  waitForTx,
  nodeInteraction,
  type IInvokeScriptParams,
  type ITransferParams,
  type IDataParams,
  type IIssueParams,
} from "@decentralchain/transactions";

import type { InvokeScriptCallArgument } from "@decentralchain/ts-types";

import {
  CRS_ASSET_ID,
  DCC_ASSET_ID,
  MARKETPLACE_DAPP,
  FEE_BPS,
  DC_CHAIN_ID,
  DC_NODE_URL,
} from "@/lib/constants";
import type { TransactionReceipt } from "@/types/rwa";

/* ═══════════════════════════════════════════════════════════════
   Re-exports — convenience access to raw SDK functions
   ═══════════════════════════════════════════════════════════════ */

export {
  invokeScript,
  transfer,
  data,
  issue,
  broadcast,
  waitForTx,
  nodeInteraction,
};

/* ═══════════════════════════════════════════════════════════════
   Broadcast helpers — use SDK's broadcast() + waitForTx()
   ═══════════════════════════════════════════════════════════════ */

/**
 * Broadcast any signed transaction to the DCC node via the SDK.
 */
export async function broadcastToNode(
  signedTx: Parameters<typeof broadcast>[0],
) {
  return broadcast(signedTx, DC_NODE_URL);
}

/**
 * Broadcast and wait until the tx is mined into a block.
 */
export async function broadcastAndWait(
  signedTx: Parameters<typeof broadcast>[0],
  timeoutMs = 60_000,
) {
  const result = await broadcast(signedTx, DC_NODE_URL);
  await waitForTx(result.id, {
    apiBase: DC_NODE_URL,
    timeout: timeoutMs,
  });
  return result;
}

/* ═══════════════════════════════════════════════════════════════
   Marketplace Transactions — built with SDK builders
   ═══════════════════════════════════════════════════════════════ */

/**
 * Build, sign, and broadcast an InvokeScript transaction that:
 *   1. Sends CRS tokens to the marketplace dApp (payment for fractions).
 *   2. Sends a DCC fee (2 %) to cover the marketplace commission.
 *   3. Calls `buyFractions(rwaAssetId, quantity)` on the dApp.
 *
 * Uses the `invokeScript()` builder from `@decentralchain/transactions`.
 * Signing is delegated to the DecentralChain Keeper browser extension
 * when no seed is provided — otherwise the SDK signs directly.
 */
export async function buyFractionalTokens(params: {
  rwaAssetId: string;
  quantity: number;
  totalCostCRS: number; // in smallest unit (e.g., 1 CRS = 10^8)
  senderPublicKey: string;
  seed?: string; // optional: if provided, SDK signs; otherwise Keeper signs
}): Promise<TransactionReceipt> {
  const { rwaAssetId, quantity, totalCostCRS, senderPublicKey, seed } = params;

  // Calculate 2 % DCC fee (same unit scale as CRS for simplicity)
  const dccFeeAmount = Math.ceil((totalCostCRS * FEE_BPS) / 10_000);

  const invokeParams: IInvokeScriptParams & { senderPublicKey: string } = {
    dApp: MARKETPLACE_DAPP,
    call: {
      function: "buyFractions",
      args: [
        { type: "string", value: rwaAssetId },
        { type: "integer", value: quantity },
      ],
    },
    payment: [
      { amount: totalCostCRS, assetId: CRS_ASSET_ID },
      { amount: dccFeeAmount, assetId: DCC_ASSET_ID },
    ],
    fee: 500_000, // 0.005 DCC standard invoke fee
    chainId: DC_CHAIN_ID,
    senderPublicKey,
  };

  // Path A — SDK signs with seed phrase
  if (seed) {
    const signedTx = invokeScript(invokeParams, seed);
    const result = await broadcast(signedTx, DC_NODE_URL);
    return {
      transactionId: result.id,
      status: "pending",
      timestamp: new Date().toISOString(),
    };
  }

  // Path B — Keeper extension signs
  if (typeof window === "undefined" || !window.DecentralChain) {
    throw new Error("DecentralChain Keeper is not available.");
  }

  // Build unsigned tx using SDK (adds correct proofs skeleton)
  const unsignedTx = invokeScript(invokeParams);
  const broadcastResult = await window.DecentralChain.signAndPublishTransaction(
    JSON.stringify(unsignedTx),
  );
  const parsed = JSON.parse(broadcastResult);

  return {
    transactionId: parsed.id,
    status: "pending",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generic invoke helper — call any dApp function via SDK.
 */
export async function invokeDapp(params: {
  dApp: string;
  functionName: string;
  args?: Array<InvokeScriptCallArgument>;
  payment?: IInvokeScriptParams["payment"];
  seed?: string;
  senderPublicKey?: string;
  fee?: number;
}): Promise<TransactionReceipt> {
  const invokeParams: IInvokeScriptParams = {
    dApp: params.dApp,
    call: {
      function: params.functionName,
      args: params.args ?? [],
    },
    payment: params.payment ?? [],
    fee: params.fee ?? 500_000,
    chainId: DC_CHAIN_ID,
    ...(params.senderPublicKey && {
      senderPublicKey: params.senderPublicKey,
    }),
  };

  if (params.seed) {
    const signedTx = invokeScript(invokeParams, params.seed);
    const result = await broadcast(signedTx, DC_NODE_URL);
    return {
      transactionId: result.id,
      status: "pending",
      timestamp: new Date().toISOString(),
    };
  }

  if (typeof window === "undefined" || !window.DecentralChain) {
    throw new Error("DecentralChain Keeper is not available.");
  }

  // Keeper path: senderPublicKey is required for unsigned tx
  if (!params.senderPublicKey) {
    throw new Error("senderPublicKey is required when signing via Keeper.");
  }

  const unsignedTx = invokeScript({
    ...invokeParams,
    senderPublicKey: params.senderPublicKey,
  });
  const broadcastResult = await window.DecentralChain.signAndPublishTransaction(
    JSON.stringify(unsignedTx),
  );
  const parsed = JSON.parse(broadcastResult);

  return {
    transactionId: parsed.id,
    status: "pending",
    timestamp: new Date().toISOString(),
  };
}

/**
 * SDK transfer helper — send DCC, CRS, or any asset.
 */
export async function transferToken(params: {
  recipient: string;
  amount: number;
  assetId?: string;
  seed: string;
  attachment?: string;
  fee?: number;
}): Promise<TransactionReceipt> {
  const transferParams: ITransferParams = {
    recipient: params.recipient,
    amount: params.amount,
    assetId: params.assetId ?? null,
    attachment: params.attachment,
    fee: params.fee ?? 100_000,
    chainId: DC_CHAIN_ID,
  };

  const signedTx = transfer(transferParams, params.seed);
  const result = await broadcast(signedTx, DC_NODE_URL);

  return {
    transactionId: result.id,
    status: "pending",
    timestamp: new Date().toISOString(),
  };
}

/**
 * SDK data transaction helper — write key-value data to account.
 */
export async function writeData(params: {
  data: IDataParams["data"];
  seed: string;
  fee?: number;
}): Promise<TransactionReceipt> {
  const dataParams: IDataParams = {
    data: params.data,
    fee: params.fee ?? 100_000,
    chainId: DC_CHAIN_ID,
  };

  const signedTx = data(dataParams, params.seed);
  const result = await broadcast(signedTx, DC_NODE_URL);

  return {
    transactionId: result.id,
    status: "pending",
    timestamp: new Date().toISOString(),
  };
}

/**
 * SDK issue helper — create a new token (e.g. RWA fractional token).
 */
export async function issueToken(params: {
  name: string;
  description: string;
  quantity: number;
  decimals?: number;
  reissuable?: boolean;
  script?: string;
  seed: string;
  fee?: number;
}): Promise<TransactionReceipt> {
  const issueParams: IIssueParams = {
    name: params.name,
    description: params.description,
    quantity: params.quantity,
    decimals: params.decimals ?? 8,
    reissuable: params.reissuable ?? false,
    script: params.script,
    fee: params.fee ?? 100_000_000, // 1 DCC for issue tx
    chainId: DC_CHAIN_ID,
  };

  const signedTx = issue(issueParams, params.seed);
  const result = await broadcast(signedTx, DC_NODE_URL);

  return {
    transactionId: result.id,
    status: "pending",
    timestamp: new Date().toISOString(),
  };
}

/* ═══════════════════════════════════════════════════════════════
   Node Interaction helpers — via SDK nodeInteraction
   ═══════════════════════════════════════════════════════════════ */

/** Read full account data from chain via SDK */
export async function readAccountData(addr: string) {
  return nodeInteraction.accountData(addr, DC_NODE_URL);
}

/** Read single key from account data via SDK */
export async function readAccountDataByKey(addr: string, key: string) {
  return nodeInteraction.accountDataByKey(key, addr, DC_NODE_URL);
}

/** Get current blockchain height via SDK */
export async function getCurrentHeight() {
  return nodeInteraction.currentHeight(DC_NODE_URL);
}

/** Get native balance via SDK */
export async function getBalance(addr: string) {
  return nodeInteraction.balance(addr, DC_NODE_URL);
}

/** Get asset balance via SDK */
export async function getAssetBalanceSDK(
  assetId: string,
  addr: string,
) {
  return nodeInteraction.assetBalance(assetId, addr, DC_NODE_URL);
}

/* ═══════════════════════════════════════════════════════════════
   Confirmation — wait using SDK waitForTx
   ═══════════════════════════════════════════════════════════════ */

/**
 * Wait until the transaction is confirmed on-chain.
 * Uses the SDK's `waitForTx()` instead of manual polling.
 */
export async function waitForConfirmation(
  txId: string,
  timeoutMs = 60_000,
): Promise<TransactionReceipt> {
  try {
    const tx = await waitForTx(txId, {
      apiBase: DC_NODE_URL,
      timeout: timeoutMs,
    });

    return {
      transactionId: txId,
      status: "confirmed",
      blockHeight: (tx as unknown as { height?: number }).height,
      timestamp: new Date((tx as unknown as { timestamp?: number }).timestamp ?? Date.now()).toISOString(),
    };
  } catch {
    return {
      transactionId: txId,
      status: "failed",
      timestamp: new Date().toISOString(),
    };
  }
}
