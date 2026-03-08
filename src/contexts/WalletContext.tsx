"use client";

/**
 * WalletContext — global wallet connection state for the entire dashboard.
 *
 * Supports two connection methods:
 *   1. Cubensis Extension — uses @decentralchain/provider-cubensis (browser extension)
 *   2. Seed Phrase — uses @decentralchain/ts-lib-crypto for address derivation
 *
 * The connected address is persisted in localStorage so it survives page reloads.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { Signer } from "@decentralchain/signer";
import { ProviderCubensis } from "@decentralchain/provider-cubensis";
import { DC_NODE_URL } from "@/lib/constants";

/* ─── Types ─── */
export type ConnectionMethod = "cubensis" | "seed" | null;

interface WalletState {
  address: string | null;
  publicKey: string | null;
  connectionMethod: ConnectionMethod;
  isConnecting: boolean;
  error: string | null;
  signer: Signer | null;

  /** Connect via Cubensis browser extension */
  connectExtension: () => Promise<void>;
  /** Connect via seed phrase (derives address only — no signing) */
  connectSeed: (seed: string) => Promise<void>;
  /** Disconnect wallet */
  disconnect: () => void;
  /** Clear error */
  clearError: () => void;
}

const WalletContext = createContext<WalletState | null>(null);

/* ─── Provider ─── */
export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connectionMethod, setConnectionMethod] =
    useState<ConnectionMethod>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);

  // Restore saved address on mount
  useEffect(() => {
    const saved = localStorage.getItem("dcc_wallet_address");
    const method = localStorage.getItem(
      "dcc_connection_method",
    ) as ConnectionMethod;
    if (saved) {
      setAddress(saved);
      setConnectionMethod(method);
    }
  }, []);

  /** Save to localStorage whenever address changes */
  const persist = useCallback(
    (addr: string | null, method: ConnectionMethod) => {
      if (addr) {
        localStorage.setItem("dcc_wallet_address", addr);
        localStorage.setItem("dcc_connection_method", method ?? "");
      } else {
        localStorage.removeItem("dcc_wallet_address");
        localStorage.removeItem("dcc_connection_method");
      }
    },
    [],
  );

  /** Connect via Cubensis (DecentralChain Keeper / Signer extension) */
  const connectExtension = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const s = new Signer({ NODE_URL: DC_NODE_URL });
      const provider = new ProviderCubensis();
      s.setProvider(provider);

      const userData = await s.login();
      setAddress(userData.address);
      setPublicKey(userData.publicKey);
      setConnectionMethod("cubensis");
      setSigner(s);
      persist(userData.address, "cubensis");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Extension connection failed";

      // Give a more helpful message if extension not installed
      if (
        msg.includes("not found") ||
        msg.includes("not installed") ||
        msg.includes("CubensisConnect") ||
        msg.includes("timeout") ||
        msg.includes("Cannot read")
      ) {
        setError(
          "Cubensis Wallet extension not detected. Please install it from your browser's extension store and refresh the page.",
        );
      } else {
        setError(msg);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [persist]);

  /** Connect via seed phrase — server-side address derivation */
  const connectSeed = useCallback(
    async (seed: string) => {
      setError(null);
      setIsConnecting(true);
      try {
        const trimmed = seed.trim();
        if (!trimmed || trimmed.split(/\s+/).length < 12) {
          throw new Error("Please enter a valid 12+ word seed phrase");
        }

        // Derive address server-side
        const res = await fetch("/api/mint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ seed: trimmed, _checkOnly: true }),
        });
        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || "Failed to derive address");
        }

        setAddress(data.address);
        setPublicKey(null);
        setConnectionMethod("seed");
        setSigner(null);
        persist(data.address, "seed");
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Seed connection failed",
        );
      } finally {
        setIsConnecting(false);
      }
    },
    [persist],
  );

  /** Disconnect */
  const disconnect = useCallback(() => {
    if (signer) {
      try {
        signer.logout();
      } catch {
        // ignore
      }
    }
    setAddress(null);
    setPublicKey(null);
    setConnectionMethod(null);
    setSigner(null);
    setError(null);
    persist(null, null);
  }, [signer, persist]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <WalletContext.Provider
      value={{
        address,
        publicKey,
        connectionMethod,
        isConnecting,
        error,
        signer,
        connectExtension,
        connectSeed,
        disconnect,
        clearError,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

/** Hook to access wallet state anywhere in the dashboard */
export function useWalletContext() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return ctx;
}
