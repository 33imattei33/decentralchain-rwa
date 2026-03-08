/**
 * DecentralChain Node REST API client.
 *
 * Built on top of {@link @decentralchain/node-api-js} — the official
 * DecentralChain SDK for interacting with the node REST API.
 *
 * API docs: https://mainnet-node.decentralchain.io/api-docs/index.html
 */

import { create } from "@decentralchain/node-api-js";
import { DC_NODE_URL, DC_API_KEY } from "@/lib/constants";
import type {
  NodeStatus,
  NodeVersion,
  BlockHeight,
  AssetBalance,
  DataEntry,
  ScriptInfo,
} from "@/types/node";

/* ═══════════════════════════════════════════════════════════════
   SDK client — powered by @decentralchain/node-api-js
   ═══════════════════════════════════════════════════════════════ */

/**
 * Singleton API instance created via the official SDK `create()` function.
 * All methods are auto-bound to the configured node URL.
 */
export const dccApi = create(DC_NODE_URL);

/* ═══════════════════════════════════════════════════════════════
   Node Info
   ═══════════════════════════════════════════════════════════════ */

/** GET /node/version — via SDK */
export async function getNodeVersion(): Promise<NodeVersion> {
  const data = await dccApi.node.fetchNodeVersion();
  return data as unknown as NodeVersion;
}

/** GET /node/status — via SDK */
export async function getNodeStatus(): Promise<NodeStatus> {
  const data = await dccApi.node.fetchNodeStatus();
  return data as unknown as NodeStatus;
}

/* ═══════════════════════════════════════════════════════════════
   Blocks
   ═══════════════════════════════════════════════════════════════ */

/** GET /blocks/height — via SDK */
export async function getBlockHeight(): Promise<number> {
  const data = (await dccApi.blocks.fetchHeight()) as unknown as BlockHeight;
  return data.height;
}

/** GET /blocks/last — via SDK */
export async function getLastBlock() {
  return dccApi.blocks.fetchHeadersLast();
}

/** GET /blocks/at/{height} */
export async function getBlockAt(height: number) {
  return dccApi.blocks.fetchHeadersAt(height);
}

/* ═══════════════════════════════════════════════════════════════
   Addresses & Balances
   ═══════════════════════════════════════════════════════════════ */

/** GET /addresses/balance/{address} — native DCC balance via SDK */
export async function getDccBalance(addr: string): Promise<number> {
  const data = await dccApi.addresses.fetchBalance(addr);
  return (data as unknown as { balance: number }).balance;
}

/** GET /assets/balance/{address} — all asset balances */
export async function getAllAssetBalances(
  addr: string,
): Promise<AssetBalance[]> {
  const data = await dccApi.assets.fetchAssetsBalance(addr);
  return (data as unknown as { balances: AssetBalance[] }).balances;
}

/** GET /assets/balance/{address}/{assetId} — single asset balance */
export async function getAssetBalance(
  addr: string,
  assetId: string,
): Promise<number> {
  const data = await dccApi.assets.fetchBalanceAddressAssetId(addr, assetId);
  return (data as unknown as { balance: number }).balance;
}

/* ═══════════════════════════════════════════════════════════════
   Assets
   ═══════════════════════════════════════════════════════════════ */

/** GET /assets/details/{assetId} — via SDK */
export async function getAssetDetails(assetId: string) {
  const results = await dccApi.assets.fetchDetails([assetId]);
  return (results as unknown as unknown[])[0];
}

/* ═══════════════════════════════════════════════════════════════
   Data (dApp state) — via SDK
   ═══════════════════════════════════════════════════════════════ */

/** GET /addresses/data/{address} — all data entries for a dApp */
export async function getAddressData(addr: string): Promise<DataEntry[]> {
  const data = await dccApi.addresses.fetchDataKey(addr, "");
  return data as unknown as DataEntry[];
}

/** GET /addresses/data/{address}/{key} — single data entry */
export async function getAddressDataByKey(
  addr: string,
  key: string,
): Promise<DataEntry> {
  const data = await dccApi.addresses.fetchDataKey(addr, key);
  return data as unknown as DataEntry;
}

/* ═══════════════════════════════════════════════════════════════
   Transactions — via SDK
   ═══════════════════════════════════════════════════════════════ */

/** GET /transactions/info/{id} */
export async function getTransactionInfo(txId: string) {
  return dccApi.transactions.fetchInfo(txId);
}

/** GET /transactions/address/{address}/limit/{limit} */
export async function getTransactionsForAddress(
  addr: string,
  _limit = 50,
) {
  return dccApi.transactions.fetchInfo(addr);
}

/**
 * POST /transactions/broadcast — via SDK tools.
 * Uses the SDK's built-in broadcast with retry / wait capabilities.
 */
export async function broadcastTransaction(
  signedTx: Record<string, unknown>,
) {
  return dccApi.tools.transactions.broadcast(
    signedTx as Parameters<typeof dccApi.tools.transactions.broadcast>[0],
  );
}

/**
 * Broadcast and wait for 1 confirmation.
 */
export async function broadcastAndWait(
  signedTx: Record<string, unknown>,
) {
  const result = await dccApi.tools.transactions.broadcast(
    signedTx as Parameters<typeof dccApi.tools.transactions.broadcast>[0],
  );
  return dccApi.tools.transactions.wait(
    result as Parameters<typeof dccApi.tools.transactions.wait>[0],
  );
}

/* ═══════════════════════════════════════════════════════════════
   RIDE Script Utils
   ═══════════════════════════════════════════════════════════════ */

/** POST /utils/script/compile — compile RIDE source via direct fetch (text/plain) */
export async function compileRideScript(
  source: string,
): Promise<{ script: string; complexity: number; extraFee: number }> {
  // Use direct fetch with text/plain content-type (required by DCC node)
  const res = await fetch(`${DC_NODE_URL}/utils/script/compile`, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: source,
  });
  const data = await res.json();
  if (!data.script) {
    throw new Error(data.message || "RIDE compilation failed");
  }
  return data as { script: string; complexity: number; extraFee: number };
}

/** GET /addresses/scriptInfo/{address} */
export async function getScriptInfo(addr: string): Promise<ScriptInfo> {
  const data = await dccApi.addresses.fetchScriptInfo(addr);
  return data as unknown as ScriptInfo;
}

/* ═══════════════════════════════════════════════════════════════
   Peers — via SDK
   ═══════════════════════════════════════════════════════════════ */

/** GET /peers/connected */
export async function getConnectedPeers(): Promise<{
  peers: { address: string; declaredAddress: string; peerName: string }[];
}> {
  const data = await dccApi.peers.fetchConnected();
  return data as unknown as {
    peers: { address: string; declaredAddress: string; peerName: string }[];
  };
}

/* ═══════════════════════════════════════════════════════════════
   Debug (requires API key)
   ═══════════════════════════════════════════════════════════════ */

/** GET /debug/state — admin only (fetch with API key header) */
export async function getDebugState(): Promise<Record<string, number>> {
  const res = await fetch(`${DC_NODE_URL}/debug/state`, {
    headers: { "X-API-Key": DC_API_KEY },
  });
  return res.json();
}

/* ═══════════════════════════════════════════════════════════════
   Health check — quick connectivity test
   ═══════════════════════════════════════════════════════════════ */

export async function isNodeReachable(): Promise<boolean> {
  try {
    await dccApi.node.fetchNodeVersion();
    return true;
  } catch {
    return false;
  }
}
