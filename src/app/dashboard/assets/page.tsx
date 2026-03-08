"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MarketplaceGrid from "@/components/MarketplaceGrid";
import {
  Wallet,
  Coins,
  Store,
  Search,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Shield,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Plug,
} from "lucide-react";
import { useWalletContext } from "@/contexts/WalletContext";

/* ─── types ─── */
interface AssetDetail {
  assetId: string;
  balance: number;
  name: string;
  description: string;
  decimals: number;
  quantity: number;
  reissuable: boolean;
  scripted: boolean;
  issuer: string;
  issueTimestamp: number;
  issueHeight?: number;
  metadata?: Record<string, unknown>;
}

interface AssetsResponse {
  address: string;
  dccBalance: number;
  dccBalanceFormatted: number;
  totalAssets: number;
  assets: AssetDetail[];
  error?: string;
}

/* ─── helpers ─── */
function formatBalance(raw: number, decimals: number): string {
  if (decimals === 0) return raw.toLocaleString();
  const val = raw / Math.pow(10, decimals);
  return val.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

function truncateId(id: string, chars = 8): string {
  if (id.length <= chars * 2 + 3) return id;
  return `${id.slice(0, chars)}...${id.slice(-chars)}`;
}

function timeAgo(timestamp: number): string {
  if (!timestamp) return "Unknown";
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/* ═════════════════════════════════════════════════════════════════
   My Assets Component — fetches real on-chain data
   ═════════════════════════════════════════════════════════════════ */
function MyAssets() {
  const wallet = useWalletContext();
  const [address, setAddress] = useState("");
  const [submittedAddress, setSubmittedAddress] = useState("");
  const [data, setData] = useState<AssetsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);

  // Auto-sync from wallet context
  useEffect(() => {
    if (wallet.address) {
      setAddress(wallet.address);
      setSubmittedAddress(wallet.address);
    }
  }, [wallet.address]);

  // Fallback: load from localStorage if no wallet connected
  useEffect(() => {
    if (!wallet.address) {
      const saved = localStorage.getItem("dcc_wallet_address");
      if (saved) {
        setAddress(saved);
        setSubmittedAddress(saved);
      }
    }
  }, [wallet.address]);

  // Fetch whenever submittedAddress changes
  useEffect(() => {
    if (!submittedAddress) return;
    fetchAssets(submittedAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedAddress]);

  const fetchAssets = useCallback(async (addr: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/assets/${addr}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || `HTTP ${res.status}`);
      }
      setData(json);
      localStorage.setItem("dcc_wallet_address", addr);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch assets");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = address.trim();
    if (!trimmed) return;
    setSubmittedAddress(trimmed);
  };

  const copyToClipboard = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  return (
    <div className="space-y-6">
      {/* Address input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your DCC wallet address (e.g. 3D...)"
            className="w-full rounded-xl border border-gray-700 bg-gray-800/50 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !address.trim()}
          className="flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <Wallet size={16} />
          )}
          Load Assets
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <AlertCircle size={18} className="text-red-400" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw size={32} className="animate-spin text-cyan-400" />
          <p className="mt-4 text-sm text-gray-400">
            Fetching assets from DecentralChain mainnet...
          </p>
        </div>
      )}

      {/* Data loaded */}
      {data && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Wallet size={16} />
                <span className="text-xs font-medium uppercase tracking-wide">
                  DCC Balance
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {data.dccBalanceFormatted.toLocaleString(undefined, {
                  maximumFractionDigits: 4,
                })}{" "}
                <span className="text-sm font-normal text-cyan-400">DCC</span>
              </p>
            </div>

            <div className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Coins size={16} />
                <span className="text-xs font-medium uppercase tracking-wide">
                  Total Tokens
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {data.totalAssets}
              </p>
            </div>

            <div className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Shield size={16} />
                <span className="text-xs font-medium uppercase tracking-wide">
                  Smart Assets
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {data.assets.filter((a) => a.scripted).length}
              </p>
            </div>
          </div>

          {/* Wallet address */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Wallet:</span>
            <code className="rounded bg-gray-800 px-2 py-0.5 text-xs text-cyan-400">
              {data.address}
            </code>
            <button
              onClick={() => copyToClipboard(data.address, "address")}
              className="text-gray-500 transition hover:text-cyan-400"
            >
              {copiedId === "address" ? (
                <Check size={14} className="text-green-400" />
              ) : (
                <Copy size={14} />
              )}
            </button>
            <button
              onClick={() => fetchAssets(data.address)}
              className="ml-auto flex items-center gap-1 text-xs text-gray-500 transition hover:text-cyan-400"
            >
              <RefreshCw size={12} />
              Refresh
            </button>
          </div>

          {/* Asset list */}
          {data.assets.length === 0 ? (
            <div className="py-16 text-center">
              <Coins size={48} className="mx-auto text-gray-600" />
              <p className="mt-4 text-gray-400">
                No tokens found for this wallet.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Mint a new token to see it here!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.assets.map((asset) => (
                <motion.div
                  key={asset.assetId}
                  layout
                  className="overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/30 transition hover:border-gray-600/50"
                >
                  {/* Main row */}
                  <div
                    className="flex cursor-pointer items-center gap-4 p-4"
                    onClick={() =>
                      setExpandedAsset(
                        expandedAsset === asset.assetId
                          ? null
                          : asset.assetId
                      )
                    }
                  >
                    {/* Icon */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        asset.scripted
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "bg-purple-500/20 text-purple-400"
                      }`}
                    >
                      {asset.scripted ? (
                        <Shield size={20} />
                      ) : (
                        <Coins size={20} />
                      )}
                    </div>

                    {/* Name + ID */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-white">
                        {asset.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-gray-500">
                          {truncateId(asset.assetId)}
                        </code>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(asset.assetId, asset.assetId);
                          }}
                          className="text-gray-600 transition hover:text-cyan-400"
                        >
                          {copiedId === asset.assetId ? (
                            <Check size={12} className="text-green-400" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">
                        {formatBalance(asset.balance, asset.decimals)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {asset.decimals > 0 ? `${asset.decimals} decimals` : "Indivisible"}
                      </p>
                    </div>

                    {/* Badges */}
                    <div className="hidden items-center gap-2 sm:flex">
                      {asset.scripted && (
                        <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-medium text-cyan-400">
                          Smart
                        </span>
                      )}
                      {asset.reissuable && (
                        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                          Reissuable
                        </span>
                      )}
                      {asset.issuer === data.address && (
                        <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                          Issuer
                        </span>
                      )}
                    </div>

                    {/* Expand arrow */}
                    <div className="text-gray-500">
                      {expandedAsset === asset.assetId ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {expandedAsset === asset.assetId && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-700/50 bg-gray-900/30 p-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <DetailItem
                              label="Asset ID"
                              value={asset.assetId}
                              mono
                              copyable
                              onCopy={copyToClipboard}
                              copiedId={copiedId}
                            />
                            <DetailItem
                              label="Total Supply"
                              value={formatBalance(
                                asset.quantity,
                                asset.decimals
                              )}
                            />
                            <DetailItem
                              label="Your Balance"
                              value={formatBalance(
                                asset.balance,
                                asset.decimals
                              )}
                            />
                            <DetailItem
                              label="Decimals"
                              value={String(asset.decimals)}
                            />
                            <DetailItem
                              label="Reissuable"
                              value={asset.reissuable ? "Yes" : "No"}
                            />
                            <DetailItem
                              label="Scripted"
                              value={asset.scripted ? "Yes (Smart Asset)" : "No"}
                            />
                            <DetailItem
                              label="Issuer"
                              value={asset.issuer || "Unknown"}
                              mono
                              copyable
                              onCopy={copyToClipboard}
                              copiedId={copiedId}
                            />
                            <DetailItem
                              label="Issued"
                              value={
                                asset.issueTimestamp
                                  ? `${new Date(asset.issueTimestamp).toLocaleDateString()} (${timeAgo(asset.issueTimestamp)})`
                                  : "Unknown"
                              }
                            />
                          </div>

                          {/* Description */}
                          {asset.description && (
                            <div className="mt-4">
                              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                                Description
                              </p>
                              <p className="text-sm text-gray-300">
                                {asset.description}
                              </p>
                            </div>
                          )}

                          {/* Metadata */}
                          {asset.metadata &&
                            Object.keys(asset.metadata).length > 0 && (
                              <div className="mt-4">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                                  <FileText
                                    size={12}
                                    className="mr-1 inline"
                                  />
                                  On-Chain Metadata
                                </p>
                                <div className="space-y-1">
                                  {Object.entries(asset.metadata).map(
                                    ([key, value]) => (
                                      <div
                                        key={key}
                                        className="flex items-start gap-2 text-xs"
                                      >
                                        <span className="shrink-0 text-gray-500">
                                          {key}:
                                        </span>
                                        <span className="break-all text-gray-300">
                                          {String(value)}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Explorer link */}
                          <div className="mt-4 flex gap-3">
                            <a
                              href={`https://mainnet-node.decentralchain.io/assets/details/${asset.assetId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-cyan-400 transition hover:text-cyan-300"
                            >
                              <ExternalLink size={12} />
                              View on Node
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Empty state — no address entered */}
      {!data && !loading && !error && !submittedAddress && (
        <div className="py-20 text-center">
          <Wallet size={48} className="mx-auto text-gray-600" />
          <p className="mt-4 text-lg text-gray-400">
            Connect your wallet to view your on-chain assets
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Your minted RWA tokens, DCC balance, and smart assets will appear
            here.
          </p>
          {!wallet.address && (
            <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3">
              <button
                onClick={wallet.connectCubensis}
                disabled={wallet.isConnecting}
                className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:opacity-60"
              >
                <Plug size={16} />
                Connect Wallet Extension
              </button>
              <button
                onClick={wallet.connectKeeper}
                disabled={wallet.isConnecting}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-700 px-5 py-3 text-sm font-medium text-gray-300 transition hover:border-cyan-500/30 hover:text-white disabled:opacity-60"
              >
                <Shield size={16} />
                Connect DCC Keeper
              </button>
              <p className="text-xs text-gray-600">
                Or use the Connect Wallet button in the top bar for more options
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Detail row helper ─── */
function DetailItem({
  label,
  value,
  mono,
  copyable,
  onCopy,
  copiedId,
}: {
  label: string;
  value: string;
  mono?: boolean;
  copyable?: boolean;
  onCopy?: (text: string, id: string) => void;
  copiedId?: string | null;
}) {
  const id = `${label}-${value}`;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <div className="mt-0.5 flex items-center gap-1">
        <p
          className={`truncate text-sm text-gray-200 ${mono ? "font-mono" : ""}`}
          title={value}
        >
          {value.length > 44 ? truncateId(value, 16) : value}
        </p>
        {copyable && onCopy && (
          <button
            onClick={() => onCopy(value, id)}
            className="shrink-0 text-gray-600 transition hover:text-cyan-400"
          >
            {copiedId === id ? (
              <Check size={12} className="text-green-400" />
            ) : (
              <Copy size={12} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   Tabbed Assets Page
   ═════════════════════════════════════════════════════════════════ */
export default function AssetsPage() {
  const [tab, setTab] = useState<"my-assets" | "marketplace">("my-assets");

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Assets
        </h1>
        <p className="mt-2 text-gray-400">
          View your on-chain tokens or browse the RWA marketplace.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="mb-8 flex gap-1 rounded-xl bg-gray-800/50 p-1">
        <button
          onClick={() => setTab("my-assets")}
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition ${
            tab === "my-assets"
              ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Wallet size={16} />
          My Assets
        </button>
        <button
          onClick={() => setTab("marketplace")}
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition ${
            tab === "marketplace"
              ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Store size={16} />
          Marketplace
        </button>
      </div>

      {/* Tab content */}
      {tab === "my-assets" ? <MyAssets /> : <MarketplaceGrid />}
    </section>
  );
}
