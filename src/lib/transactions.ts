import axios from "axios";
import {
  DC_NODE_URL,
  CRS_ASSET_ID,
  DCC_ASSET_ID,
  MARKETPLACE_DAPP,
  FEE_BPS,
} from "@/lib/constants";
import type { TransactionReceipt } from "@/types/rwa";

/**
 * Build, sign, and broadcast an InvokeScript transaction that:
 *   1. Sends CRS tokens to the marketplace dApp (payment for fractions).
 *   2. Sends a DCC fee (2 %) to cover the marketplace commission.
 *   3. Calls `buyFractions(rwaAssetId, quantity)` on the dApp.
 *
 * Signing is delegated to the DecentralChain Keeper browser extension.
 */
export async function buyFractionalTokens(params: {
  rwaAssetId: string;
  quantity: number;
  totalCostCRS: number; // in smallest unit (e.g., 1 CRS = 10^8)
  senderPublicKey: string;
}): Promise<TransactionReceipt> {
  const { rwaAssetId, quantity, totalCostCRS, senderPublicKey } = params;

  // Calculate 2 % DCC fee (same unit scale as CRS for simplicity)
  const dccFeeAmount = Math.ceil((totalCostCRS * FEE_BPS) / 10_000);

  // InvokeScript transaction JSON (DecentralChain format)
  const invokeTx = {
    type: 16, // InvokeScript
    version: 2,
    senderPublicKey,
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
    feeAssetId: DCC_ASSET_ID,
    chainId: 68, // DecentralChain mainnet chain ID ('D')
    timestamp: Date.now(),
  };

  // Sign via Keeper extension
  if (typeof window === "undefined" || !window.DecentralChain) {
    throw new Error("DecentralChain Keeper is not available.");
  }

  const broadcastResult = await window.DecentralChain.signAndPublishTransaction(
    JSON.stringify(invokeTx)
  );

  const parsed = JSON.parse(broadcastResult);

  return {
    transactionId: parsed.id,
    status: "pending",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Poll the node until the transaction is confirmed (appears in a block).
 */
export async function waitForConfirmation(
  txId: string,
  timeoutMs = 60_000,
  pollIntervalMs = 3_000
): Promise<TransactionReceipt> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const { data } = await axios.get(
        `${DC_NODE_URL}/transactions/info/${txId}`
      );

      if (data.height) {
        return {
          transactionId: txId,
          status: "confirmed",
          blockHeight: data.height,
          timestamp: new Date(data.timestamp).toISOString(),
        };
      }
    } catch {
      // Transaction not yet indexed — keep polling
    }

    await new Promise((r) => setTimeout(r, pollIntervalMs));
  }

  return {
    transactionId: txId,
    status: "failed",
    timestamp: new Date().toISOString(),
  };
}
