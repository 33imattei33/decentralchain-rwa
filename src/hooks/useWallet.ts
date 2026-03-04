"use client";

import { useState, useCallback } from "react";
import {
  getDccBalance,
  getAllAssetBalances,
  isNodeReachable,
} from "@/lib/nodeApi";
import { CRS_ASSET_ID, CR_COIN_ASSET_ID } from "@/lib/constants";
import type { WalletBalances } from "@/types/rwa";

declare global {
  interface Window {
    DecentralChain?: {
      /** Prompt the user to connect their wallet */
      auth: (data: { data: string }) => Promise<{ address: string; publicKey: string }>;
      signAndPublishTransaction: (tx: string) => Promise<string>;
    };
  }
}

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

  /** Fetch token balances from the local DCC node */
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

  /** Check if the node is reachable */
  const checkNode = useCallback(async () => {
    const online = await isNodeReachable();
    setNodeOnline(online);
    return online;
  }, []);

  /** Connect via DecentralChain Keeper browser extension */
  const connect = useCallback(async () => {
    setError(null);
    setIsConnecting(true);

    try {
      if (typeof window === "undefined" || !window.DecentralChain) {
        throw new Error(
          "DecentralChain Keeper extension not found. Please install it and refresh."
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
      const msg = err instanceof Error ? err.message : "Wallet connection failed";
      setError(msg);
    } finally {
      setIsConnecting(false);
    }
  }, [fetchBalances]);

  /** Disconnect / reset state */
  const disconnect = useCallback(() => {
    setAddress(null);
    setPublicKey(null);
    setBalances({ dcc: 0, crs: 0, crCoin: 0 });
  }, []);

  return {
    address,
    publicKey,
    balances,
    isConnecting,
    error,
    nodeOnline,
    connect,
    disconnect,
    checkNode,
    refreshBalances: () => address && fetchBalances(address),
  } as const;
}
