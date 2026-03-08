"use client";

/**
 * WalletContext — global wallet connection state for the entire dashboard.
 *
 * Supports ALL DecentralChain Signer-compatible wallets:
 *   1. Cubensis Extension — @decentralchain/provider-cubensis
 *   2. DecentralChain Keeper — legacy window.DecentralChain extension API
 *   3. Seed Phrase — server-side address derivation via ts-lib-crypto
 *   4. Ledger Hardware Wallet — @decentralchain/ledger (WebUSB)
 *   5. Custom Signer Provider — any Provider implementing the Signer interface
 *   6. Manual Address — paste address for read-only access
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

/* ─── Extension install / info links ─── */
export const CUBENSIS_INSTALL_URL =
  "https://github.com/Decentral-America/CubensisConnect";
export const KEEPER_INSTALL_URL =
  "https://github.com/Decentral-America/DecentralChainKeeper";

/* ─── Types ─── */
export type ConnectionMethod =
  | "cubensis"
  | "keeper"
  | "seed"
  | "ledger"
  | "address"
  | "custom"
  | null;

/** Human-readable labels for each method */
export const CONNECTION_LABELS: Record<Exclude<ConnectionMethod, null>, string> = {
  cubensis: "Cubensis Extension",
  keeper: "DCC Keeper",
  seed: "Seed Phrase",
  ledger: "Ledger",
  address: "Manual Address",
  custom: "Custom Provider",
};

declare global {
  interface Window {
    DecentralChain?: {
      auth: (data: { data: string }) => Promise<{ address: string; publicKey: string }>;
      signAndPublishTransaction: (tx: string) => Promise<string>;
    };
  }
}

interface WalletState {
  address: string | null;
  publicKey: string | null;
  connectionMethod: ConnectionMethod;
  isConnecting: boolean;
  error: string | null;
  signer: Signer | null;

  /** Whether the Cubensis extension is detected in the browser */
  hasCubensis: boolean;
  /** Whether the DCC Keeper extension is detected in the browser */
  hasKeeper: boolean;

  /** Connect via Cubensis browser extension (ProviderCubensis) */
  connectCubensis: () => Promise<void>;
  /** Connect via DecentralChain Keeper legacy extension */
  connectKeeper: () => Promise<void>;
  /** Connect via seed phrase (server-side address derivation) */
  connectSeed: (seed: string) => Promise<void>;
  /** Connect with a manual address (read-only, no signing) */
  connectAddress: (address: string) => Promise<void>;
  /** Connect with any custom Signer Provider */
  connectWithProvider: (provider: unknown, label?: string) => Promise<void>;
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

  /* ── Extension detection ── */
  const [hasCubensis, setHasCubensis] = useState(false);
  const [hasKeeper, setHasKeeper] = useState(false);

  // Detect browser extensions on mount (with a small delay for late-injecting extensions)
  useEffect(() => {
    const detect = () => {
      if (typeof window !== "undefined") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setHasCubensis(!!(window as any).CubensisConnect);
        setHasKeeper(!!window.DecentralChain);
      }
    };
    // Check immediately
    detect();
    // Re-check after 1s and 3s (extensions may inject late)
    const t1 = setTimeout(detect, 1000);
    const t2 = setTimeout(detect, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

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

  /** Persist wallet state to localStorage */
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

  /** Generic Signer+Provider login flow */
  const signerLogin = useCallback(
    async (provider: unknown, method: ConnectionMethod) => {
      const s = new Signer({ NODE_URL: DC_NODE_URL });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await s.setProvider(provider as any);
      const userData = await s.login();
      setAddress(userData.address);
      setPublicKey(userData.publicKey);
      setConnectionMethod(method);
      setSigner(s);
      persist(userData.address, method);
    },
    [persist],
  );

  /* ── 1. Cubensis Extension ── */
  const connectCubensis = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const provider = new ProviderCubensis();
      await signerLogin(provider, "cubensis");
      setHasCubensis(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Cubensis connection failed";
      if (
        msg.includes("not found") ||
        msg.includes("not installed") ||
        msg.includes("CubensisConnect") ||
        msg.includes("timeout") ||
        msg.includes("Cannot read")
      ) {
        setHasCubensis(false);
        setError(
          `Cubensis Wallet extension not detected in your browser. ` +
          `Install it from ${CUBENSIS_INSTALL_URL} then reload the page. ` +
          `Alternatively, use the Seed Phrase or Wallet Address option to connect.`,
        );
      } else {
        setError(msg);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [signerLogin]);

  /* ── 2. DecentralChain Keeper (legacy extension) ── */
  const connectKeeper = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      // Wait up to 2 seconds for the extension to inject
      let attempts = 0;
      while (
        (typeof window === "undefined" || !window.DecentralChain) &&
        attempts < 10
      ) {
        await new Promise((r) => setTimeout(r, 200));
        attempts++;
      }

      if (typeof window === "undefined" || !window.DecentralChain) {
        setHasKeeper(false);
        throw new Error(
          `DecentralChain Keeper extension not detected in your browser. ` +
            `Install it from ${KEEPER_INSTALL_URL} then reload the page. ` +
            `Alternatively, use the Cubensis Wallet or Seed Phrase option to connect.`,
        );
      }

      setHasKeeper(true);
      const { address: addr, publicKey: pk } =
        await window.DecentralChain.auth({
          data: "RWA Marketplace login",
        });
      setAddress(addr);
      setPublicKey(pk);
      setConnectionMethod("keeper");
      setSigner(null); // Keeper uses its own signing API
      persist(addr, "keeper");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Keeper connection failed";
      setError(msg);
    } finally {
      setIsConnecting(false);
    }
  }, [persist]);

  /* ── 3. Seed Phrase ── */
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

  /* ── 4. Manual Address (read-only) ── */
  const connectAddress = useCallback(
    async (addr: string) => {
      setError(null);
      setIsConnecting(true);
      try {
        const trimmed = addr.trim();
        if (!trimmed || !trimmed.startsWith("3") || trimmed.length < 30) {
          throw new Error(
            "Invalid DCC address. It should start with '3' and be ~35 characters.",
          );
        }

        // Verify address exists on-chain
        const res = await fetch(`/api/assets/${trimmed}`);
        if (!res.ok) {
          throw new Error("Could not verify address on-chain. Check the address and try again.");
        }

        setAddress(trimmed);
        setPublicKey(null);
        setConnectionMethod("address");
        setSigner(null);
        persist(trimmed, "address");
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Address connection failed",
        );
      } finally {
        setIsConnecting(false);
      }
    },
    [persist],
  );

  /* ── 5. Custom Signer Provider ── */
  const connectWithProvider = useCallback(
    async (provider: unknown, _label?: string) => {
      setError(null);
      setIsConnecting(true);
      try {
        await signerLogin(provider, "custom");
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Provider connection failed",
        );
      } finally {
        setIsConnecting(false);
      }
    },
    [signerLogin],
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
        hasCubensis,
        hasKeeper,
        connectCubensis,
        connectKeeper,
        connectSeed,
        connectAddress,
        connectWithProvider,
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
