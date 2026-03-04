/**
 * DecentralChain Node REST API client.
 *
 * Wraps the Waves-compatible REST API exposed by the DCC node at
 * http://localhost:16879.  All public endpoints mirror the standard
 * Waves node API paths.
 *
 * API docs: http://localhost:16879/api-docs/index.html
 */

import axios, { type AxiosRequestConfig } from "axios";
import { DC_NODE_URL, DC_API_KEY } from "@/lib/constants";
import type {
  NodeStatus,
  NodeVersion,
  BlockHeight,
  BlockInfo,
  AssetBalance,
  DataEntry,
  TransactionInfo,
  ScriptInfo,
} from "@/types/node";

/* ═══════════════════════════════════════════════════════════════
   Axios instance — points at the local DCC node
   ═══════════════════════════════════════════════════════════════ */

const api = axios.create({
  baseURL: DC_NODE_URL,
  timeout: 15_000,
  headers: { Accept: "application/json" },
});

/** Attach the API key header for admin/debug requests */
function withApiKey(): AxiosRequestConfig {
  return { headers: { "X-API-Key": DC_API_KEY } };
}

/* ═══════════════════════════════════════════════════════════════
   Node Info
   ═══════════════════════════════════════════════════════════════ */

/** GET /node/version */
export async function getNodeVersion(): Promise<NodeVersion> {
  const { data } = await api.get<NodeVersion>("/node/version");
  return data;
}

/** GET /node/status */
export async function getNodeStatus(): Promise<NodeStatus> {
  const { data } = await api.get<NodeStatus>("/node/status");
  return data;
}

/* ═══════════════════════════════════════════════════════════════
   Blocks
   ═══════════════════════════════════════════════════════════════ */

/** GET /blocks/height */
export async function getBlockHeight(): Promise<number> {
  const { data } = await api.get<BlockHeight>("/blocks/height");
  return data.height;
}

/** GET /blocks/last */
export async function getLastBlock(): Promise<BlockInfo> {
  const { data } = await api.get<BlockInfo>("/blocks/last");
  return data;
}

/** GET /blocks/at/{height} */
export async function getBlockAt(height: number): Promise<BlockInfo> {
  const { data } = await api.get<BlockInfo>(`/blocks/at/${height}`);
  return data;
}

/* ═══════════════════════════════════════════════════════════════
   Addresses & Balances
   ═══════════════════════════════════════════════════════════════ */

/** GET /addresses — list node wallet addresses */
export async function getNodeAddresses(): Promise<string[]> {
  const { data } = await api.get<string[]>("/addresses");
  return data;
}

/** GET /addresses/balance/{address} — native DCC balance */
export async function getDccBalance(address: string): Promise<number> {
  const { data } = await api.get<{ address: string; balance: number }>(
    `/addresses/balance/${address}`,
  );
  return data.balance;
}

/** GET /assets/balance/{address} — all asset balances */
export async function getAllAssetBalances(
  address: string,
): Promise<AssetBalance[]> {
  const { data } = await api.get<{ address: string; balances: AssetBalance[] }>(
    `/assets/balance/${address}`,
  );
  return data.balances;
}

/** GET /assets/balance/{address}/{assetId} — single asset balance */
export async function getAssetBalance(
  address: string,
  assetId: string,
): Promise<number> {
  const { data } = await api.get<{ address: string; assetId: string; balance: number }>(
    `/assets/balance/${address}/${assetId}`,
  );
  return data.balance;
}

/* ═══════════════════════════════════════════════════════════════
   Assets
   ═══════════════════════════════════════════════════════════════ */

/** GET /assets/details/{assetId} */
export async function getAssetDetails(assetId: string) {
  const { data } = await api.get(`/assets/details/${assetId}`);
  return data;
}

/* ═══════════════════════════════════════════════════════════════
   Data (dApp state)
   ═══════════════════════════════════════════════════════════════ */

/** GET /addresses/data/{address} — all data entries for a dApp */
export async function getAddressData(address: string): Promise<DataEntry[]> {
  const { data } = await api.get<DataEntry[]>(`/addresses/data/${address}`);
  return data;
}

/** GET /addresses/data/{address}/{key} — single data entry */
export async function getAddressDataByKey(
  address: string,
  key: string,
): Promise<DataEntry> {
  const { data } = await api.get<DataEntry>(
    `/addresses/data/${address}/${encodeURIComponent(key)}`,
  );
  return data;
}

/* ═══════════════════════════════════════════════════════════════
   Transactions
   ═══════════════════════════════════════════════════════════════ */

/** GET /transactions/info/{id} */
export async function getTransactionInfo(
  txId: string,
): Promise<TransactionInfo> {
  const { data } = await api.get<TransactionInfo>(
    `/transactions/info/${txId}`,
  );
  return data;
}

/** GET /transactions/address/{address}/limit/{limit} */
export async function getTransactionsForAddress(
  address: string,
  limit = 50,
): Promise<TransactionInfo[][]> {
  const { data } = await api.get<TransactionInfo[][]>(
    `/transactions/address/${address}/limit/${limit}`,
  );
  return data;
}

/** POST /transactions/broadcast — broadcast a signed transaction */
export async function broadcastTransaction(
  signedTx: Record<string, unknown>,
): Promise<TransactionInfo> {
  const { data } = await api.post<TransactionInfo>(
    "/transactions/broadcast",
    signedTx,
  );
  return data;
}

/* ═══════════════════════════════════════════════════════════════
   RIDE Script Utils
   ═══════════════════════════════════════════════════════════════ */

/** POST /utils/script/compile — compile RIDE source to base64 */
export async function compileRideScript(
  source: string,
): Promise<{ script: string; complexity: number; extraFee: number }> {
  const { data } = await api.post("/utils/script/compile", source, {
    headers: { "Content-Type": "text/plain" },
  });
  return data;
}

/** GET /addresses/scriptInfo/{address} — get script info for an address */
export async function getScriptInfo(address: string): Promise<ScriptInfo> {
  const { data } = await api.get<ScriptInfo>(
    `/addresses/scriptInfo/${address}`,
  );
  return data;
}

/* ═══════════════════════════════════════════════════════════════
   Peers
   ═══════════════════════════════════════════════════════════════ */

/** GET /peers/connected */
export async function getConnectedPeers(): Promise<{
  peers: { address: string; declaredAddress: string; peerName: string }[];
}> {
  const { data } = await api.get("/peers/connected");
  return data;
}

/* ═══════════════════════════════════════════════════════════════
   Debug (requires API key)
   ═══════════════════════════════════════════════════════════════ */

/** GET /debug/state — full blockchain state (admin only) */
export async function getDebugState(): Promise<Record<string, number>> {
  const { data } = await api.get<Record<string, number>>(
    "/debug/state",
    withApiKey(),
  );
  return data;
}

/* ═══════════════════════════════════════════════════════════════
   Health check — quick connectivity test
   ═══════════════════════════════════════════════════════════════ */

export async function isNodeReachable(): Promise<boolean> {
  try {
    await api.get("/node/version", { timeout: 3_000 });
    return true;
  } catch {
    return false;
  }
}
