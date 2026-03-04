/** DecentralChain node & token configuration */

export const DC_NODE_URL =
  process.env.NEXT_PUBLIC_DC_NODE_URL ?? "http://localhost:16879";

export const DC_API_URL =
  process.env.NEXT_PUBLIC_DC_API_URL ?? "http://localhost:16879";

/** Chain ID character for transaction signing (DCC mainnet = '?' / 0x3F = 63) */
export const DC_CHAIN_ID = process.env.NEXT_PUBLIC_DC_CHAIN_ID ?? "?";
export const DC_CHAIN_ID_BYTE = DC_CHAIN_ID.charCodeAt(0); // 63

/** Node API key for admin / debug endpoints (server-side only) */
export const DC_API_KEY = process.env.DC_API_KEY ?? "";

/** Well-known asset IDs (replace with mainnet values) */
export const DCC_ASSET_ID =
  process.env.NEXT_PUBLIC_DCC_ASSET_ID ?? "DCC";

export const CRS_ASSET_ID =
  process.env.NEXT_PUBLIC_CRS_ASSET_ID ?? "CRS";

export const CR_COIN_ASSET_ID =
  process.env.NEXT_PUBLIC_CR_COIN_ASSET_ID ?? "CR_COIN";

/** Marketplace dApp address */
export const MARKETPLACE_DAPP =
  process.env.NEXT_PUBLIC_MARKETPLACE_DAPP ?? "3P_MARKETPLACE_DAPP_ADDRESS";

/** Marketplace fee in basis points (2 %) */
export const FEE_BPS = 200;

/** IPFS gateway for legal document retrieval */
export const IPFS_GATEWAY =
  process.env.NEXT_PUBLIC_IPFS_GATEWAY ?? "https://ipfs.io/ipfs/";
