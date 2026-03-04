/**
 * Type definitions for the DecentralChain (Waves-compatible) Node REST API.
 * These mirror the JSON shapes returned by http://localhost:16879.
 */

/* ── Node Info ── */

export interface NodeVersion {
  version: string;
}

export interface NodeStatus {
  blockchainHeight: number;
  stateHeight: number;
  updatedTimestamp: number;
  updatedDate: string;
}

/* ── Blocks ── */

export interface BlockHeight {
  height: number;
}

export interface BlockInfo {
  version: number;
  timestamp: number;
  reference: string;
  "nxt-consensus": {
    "base-target": number;
    "generation-signature": string;
  };
  generator: string;
  signature: string;
  blocksize: number;
  transactionCount: number;
  height: number;
  totalFee: number;
  fee: number;
  transactions: TransactionInfo[];
}

/* ── Balances ── */

export interface AssetBalance {
  assetId: string;
  balance: number;
  reissuable?: boolean;
  minSponsoredAssetFee?: number | null;
  sponsorBalance?: number;
  quantity?: number;
  issueTransaction?: TransactionInfo | null;
}

/* ── Data Entries (dApp state) ── */

export type DataEntry =
  | { key: string; type: "integer"; value: number }
  | { key: string; type: "boolean"; value: boolean }
  | { key: string; type: "string"; value: string }
  | { key: string; type: "binary"; value: string };

/* ── Transactions ── */

export interface TransactionInfo {
  type: number;
  id: string;
  sender: string;
  senderPublicKey: string;
  fee: number;
  feeAssetId: string | null;
  timestamp: number;
  version: number;
  height?: number;
  /** InvokeScript-specific */
  dApp?: string;
  call?: {
    function: string;
    args: { type: string; value: string | number | boolean }[];
  };
  payment?: { amount: number; assetId: string | null }[];
  /** Transfer-specific */
  recipient?: string;
  amount?: number;
  assetId?: string | null;
  /** Generic proofs */
  proofs: string[];
}

/* ── Script Info ── */

export interface ScriptInfo {
  address: string;
  script: string | null;
  scriptText: string | null;
  complexity: number;
  extraFee: number;
}

/* ── Peers ── */

export interface PeerInfo {
  address: string;
  declaredAddress: string;
  peerName: string;
  peerNonce: number;
  applicationName: string;
  applicationVersion: string;
}
