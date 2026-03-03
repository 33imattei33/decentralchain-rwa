/**
 * Core data model for a Real-World Asset (RWA) on DecentralChain.
 *
 * Each RWA token represents fractional ownership of a physical asset
 * whose legal documentation is pinned to IPFS for immutability.
 */
export interface RealWorldAsset {
  /** Unique on-chain asset ID issued via DecentralChain Smart Assets */
  assetId: string;

  /** Human-readable title, e.g. "Luxury Hotel Suite – Miami Beach" */
  title: string;

  /** Description of the asset */
  description: string;

  /** Physical address / GPS coordinates of the underlying asset */
  physicalLocation: string;

  /** Full valuation in USD (mirrored by CRS stable pricing) */
  totalValuation: number;

  /** Price per single fractional token denominated in CRS */
  fractionalTokenPrice: number;

  /** Total number of fractional tokens issued for this asset */
  totalFractions: number;

  /** Number of fractions already sold / funded */
  fractionsSold: number;

  /** IPFS CID pointing to the legal compliance package (deed, KYC docs, audit) */
  legalDocumentIpfsHash: string;

  /** Current annual percentage yield distributed to token holders */
  currentYieldAPY: number;

  /** Asset category for filtering */
  category: RWACategory;

  /** URL or IPFS hash of the hero image */
  imageUrl: string;

  /** Wallet address of the asset issuer / property manager */
  issuerAddress: string;

  /** ISO-8601 date when the asset was tokenized */
  listedAt: string;

  /** Whether the asset is currently open for new investment */
  isActive: boolean;
}

export type RWACategory =
  | "real-estate"
  | "hospitality"
  | "infrastructure"
  | "agriculture"
  | "art"
  | "commodities";

/**
 * Wallet balances across the three DecentralChain ecosystem tokens.
 */
export interface WalletBalances {
  /** DCC – gas / network utility token */
  dcc: number;
  /** CRS – CR Stable, the USD-pegged settlement token */
  crs: number;
  /** CR Coin – loyalty / cashback reward token */
  crCoin: number;
}

/**
 * Represents a single fraction purchase order before broadcast.
 */
export interface FractionOrder {
  /** The RWA asset being purchased */
  assetId: string;
  /** Number of fractions the buyer wants */
  fractionsToBuy: number;
  /** Total cost in CRS */
  totalCostCRS: number;
  /** Estimated gas fee in DCC */
  gasFee: number;
  /** Buyer's DecentralChain address */
  buyerAddress: string;
}

/**
 * On-chain transaction receipt returned after broadcast.
 */
export interface TransactionReceipt {
  transactionId: string;
  status: "confirmed" | "pending" | "failed";
  blockHeight?: number;
  timestamp: string;
}
