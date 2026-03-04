"use client";

import { useNodeStatus } from "@/hooks/useNodeStatus";
import { Activity, Wifi, WifiOff, Box, Users, RefreshCw } from "lucide-react";

/**
 * Compact badge showing live node connection status.
 * Place anywhere in the dashboard (sidebar bottom, top bar, etc.)
 */
export default function NodeStatusBadge({ className = "" }: { className?: string }) {
  const { online, version, blockHeight, peerCount, loading, refresh } =
    useNodeStatus(12_000);

  return (
    <div
      className={`rounded-xl border bg-gray-900/60 p-3 text-xs backdrop-blur ${
        online
          ? "border-emerald-500/20"
          : "border-rose-500/20"
      } ${className}`}
    >
      {/* Header row */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {online ? (
            <Wifi size={12} className="text-emerald-400" />
          ) : (
            <WifiOff size={12} className="text-rose-400" />
          )}
          <span
            className={`font-semibold ${
              online ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {loading ? "Connecting…" : online ? "Node Online" : "Node Offline"}
          </span>
        </div>
        <button
          onClick={refresh}
          className="text-gray-500 transition hover:text-white"
          title="Refresh"
        >
          <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {online && (
        <div className="space-y-1 text-[10px] text-gray-400">
          {version && (
            <div className="flex items-center gap-1.5">
              <Activity size={10} className="text-gray-500" />
              <span>{version}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Box size={10} className="text-gray-500" />
            <span>Block #{blockHeight.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={10} className="text-gray-500" />
            <span>{peerCount} peer{peerCount !== 1 ? "s" : ""}</span>
          </div>
        </div>
      )}

      {!online && !loading && (
        <p className="text-[10px] text-gray-500">
          Cannot reach localhost:16879
        </p>
      )}
    </div>
  );
}
