/** DecentralChain node & token configuration */

export const DC_NODE_URL =
  process.env.NEXT_PUBLIC_DC_NODE_URL ?? "https://nodes.decentralchain.io";

export const DC_API_URL =
  process.env.NEXT_PUBLIC_DC_API_URL ?? "https://api.decentralchain.io/v0";

/** Well-known asset IDs (replace with mainnet values) */
export const DCC_ASSET_ID =
  process.env.NEXT_PUBLIC_DCC_ASSET_ID ?? "DCC_ASSET_ID_PLACEHOLDER";

export const CRS_ASSET_ID =
  process.env.NEXT_PUBLIC_CRS_ASSET_ID ?? "CRS_ASSET_ID_PLACEHOLDER";

export const CR_COIN_ASSET_ID =
  process.env.NEXT_PUBLIC_CR_COIN_ASSET_ID ?? "CR_COIN_ASSET_ID_PLACEHOLDER";

/** Marketplace dApp address */
export const MARKETPLACE_DAPP =
  process.env.NEXT_PUBLIC_MARKETPLACE_DAPP ?? "3P_MARKETPLACE_DAPP_ADDRESS";

/** Marketplace fee in basis points (2 %) */
export const FEE_BPS = 200;

/** IPFS gateway for legal document retrieval */
export const IPFS_GATEWAY =
  process.env.NEXT_PUBLIC_IPFS_GATEWAY ?? "https://ipfs.io/ipfs/";
