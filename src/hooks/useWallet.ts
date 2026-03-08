"use client";

/**
 * Wallet connection hook — powered by @decentralchain/signer.
 *
 * The Signer class provides a unified API for wallet operations:
 * login, logout, getBalance, invoke, transfer, broadcast, etc.
 *
 * A Provider implementation (e.g. SeedProvider, KeeperProvider, or
 * WebProvider) can be set to control how transactions are signed.
 *
 * Falls back to the legacy DecentralChain Keeper extension API when
 * no Provider has been configured (for browser extension users).
 */

import { useState, useCallback, useRef } from "react";
import { Signer } from "@decentralchain/signer";
import type { Balance, UserData } from "@decentralchain/signer";
import { DC_NODE_URL, CRS_ASSET_ID, CR_COIN_ASSET_ID } from "@/lib/constants";
import {
  getDccBalance,
  getAllAssetBalances,
  isNodeReachable,
} from "@/lib/nodeApi";
import type { WalletBalances } from "@/types/rwa";

declare global {
  interface Window {
    DecentralChain?: {
      /** Prompt the user to connect their wallet */
      auth: (data: {
        data: string;
      }) => Promise<{ address: string; publicKey: string }>;
      signAndPublishTransaction: (tx: string) => Promise<string>;
    };
  }
}

/* ═══════════════════════════════════════════════════════════════
   Singleton Signer instance
   ═══════════════════════════════════════════════════════════════ */

let _signer: Signer | null = null;

/** Get (or create) the singleton Signer bound to the DCC node. */
export function getSignerInstance(): Signer {
  if (!_signer) {
    _signer = new Signer({ NODE_URL: DC_NODE_URL });
  }
  return _signer;
}

/* ═══════════════════════════════════════════════════════════════
   Hook
   ═══════════════════════════════════════════════════════════════ */

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balances, setBalances] = useState<WalletBalances>({
    dcc: 0,
    crs: 0,
    crCoin: 0,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nodeOnline, setNodeOnline] = useState<boolean | null>(null);

  /** Keep a stable ref to the signer */
  const signerRef = useRef<Signer | null>(null);

  /** Fetch token balances from the local DCC node via SDK */
  const fetchBalances = useCallback(async (addr: string) => {
    try {
      // Native DCC balance (like WAVES balance — not an issued asset)
      const nativeBalance = await getDccBalance(addr);

      // All issued-asset balances
      const assetBalances = await getAllAssetBalances(addr);
      const find = (id: string) =>
        assetBalances.find((b) => b.assetId === id)?.balance ?? 0;

      setBalances({
        dcc: nativeBalance,
        crs: find(CRS_ASSET_ID),
        crCoin: find(CR_COIN_ASSET_ID),
      });
      setNodeOnline(true);
    } catch {
      console.warn("Could not fetch balances; node may be unreachable.");
      setNodeOnline(false);
    }
  }, []);

  /**
   * Fetch balances via the Signer's `getBalance()` method.
   * This goes through the configured provider (if any) and returns
   * enriched Balance objects with `assetName`, `decimals`, etc.
   */
  const fetchBalancesViaSigner = useCallback(
    async (signer: Signer) => {
      try {
        const allBalances: Balance[] = await signer.getBalance();

        // Native DCC balance (assetId === "WAVES" or null in the response)
        const dccBal =
          allBalances.find(
            (b) => b.assetId === "WAVES" || b.assetId === "",
          )?.amount ?? 0;
        const crsBal =
          allBalances.find((b) => b.assetId === CRS_ASSET_ID)?.amount ?? 0;
        const crCoinBal =
          allBalances.find((b) => b.assetId === CR_COIN_ASSET_ID)?.amount ??
          0;

        setBalances({
          dcc: Number(dccBal),
          crs: Number(crsBal),
          crCoin: Number(crCoinBal),
        });
        setNodeOnline(true);
      } catch {
        // Fall back to nodeApi-based fetch
        const addr = signerRef.current?.currentProvider?.user?.address;
        if (addr) await fetchBalances(addr);
      }
    },
    [fetchBalances],
  );

  /** Check if the node is reachable */
  const checkNode = useCallback(async () => {
    const online = await isNodeReachable();
    setNodeOnline(online);
    return online;
  }, []);

  /**
   * Connect via the Signer SDK.
   *
   * If a Provider was previously set (via `setProvider()`), the Signer
   * will use it for login. Otherwise falls back to Keeper extension.
   */
  const connect = useCallback(async () => {
    setError(null);
    setIsConnecting(true);

    try {
      const signer = getSignerInstance();
      signerRef.current = signer;

      // If Signer has a provider, use SDK login
      if (signer.currentProvider) {
        const userData: UserData = await signer.login();
        setAddress(userData.address);
        setPublicKey(userData.publicKey);
        await fetchBalancesViaSigner(signer);
        return;
      }

      // Fallback: DecentralChain Keeper browser extension
      if (typeof window === "undefined" || !window.DecentralChain) {
        throw new Error(
          "DecentralChain Keeper extension not found. Please install it and refresh.",
        );
      }

      const { address: addr, publicKey: pk } =
        await window.DecentralChain.auth({
          data: "RWA Marketplace login",
        });

      setAddress(addr);
      setPublicKey(pk);
      await fetchBalances(addr);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Wallet connection failed";
      setError(msg);
    } finally {
      setIsConnecting(false);
    }
  }, [fetchBalances, fetchBalancesViaSigner]);

  /** Disconnect / reset state */
  const disconnect = useCallback(async () => {
    try {
      if (signerRef.current?.currentProvider) {
        await signerRef.current.logout();
      }
    } catch {
      // Ignore logout errors
    }
    setAddress(null);
    setPublicKey(null);
    setBalances({ dcc: 0, crs: 0, crCoin: 0 });
    signerRef.current = null;
  }, []);

  return {
    /** Connected wallet address */
    address,
    /** Connected wallet public key */
    publicKey,
    /** Token balances */
    balances,
    /** Whether a connection attempt is in progress */
    isConnecting,
    /** Last error message */
    error,
    /** Whether the DCC node is reachable */
    nodeOnline,
    /** Connect wallet (via Signer provider or Keeper fallback) */
    connect,
    /** Disconnect wallet */
    disconnect,
    /** Check node connectivity */
    checkNode,
    /** Refresh balances */
    refreshBalances: () => address && fetchBalances(address),
    /** Access the Signer instance for direct SDK calls */
    signer: signerRef.current,
  } as const;
}
