"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getNodeStatus,
  getNodeVersion,
  getBlockHeight,
  getConnectedPeers,
  isNodeReachable,
} from "@/lib/nodeApi";
import type { NodeStatus } from "@/types/node";

interface NodeInfo {
  online: boolean;
  version: string | null;
  blockHeight: number;
  stateHeight: number;
  peerCount: number;
  lastChecked: Date | null;
}

const INITIAL: NodeInfo = {
  online: false,
  version: null,
  blockHeight: 0,
  stateHeight: 0,
  peerCount: 0,
  lastChecked: null,
};

/**
 * Polls the local DCC node for status, height, peers.
 * @param pollIntervalMs  How often to refresh (default 10 s)
 */
export function useNodeStatus(pollIntervalMs = 10_000) {
  const [info, setInfo] = useState<NodeInfo>(INITIAL);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const online = await isNodeReachable();
    if (!online) {
      setInfo((prev) => ({ ...prev, online: false, lastChecked: new Date() }));
      setLoading(false);
      return;
    }

    try {
      const [version, status, height, peers] = await Promise.all([
        getNodeVersion().catch(() => ({ version: "unknown" })),
        getNodeStatus().catch(
          (): NodeStatus => ({
            blockchainHeight: 0,
            stateHeight: 0,
            updatedTimestamp: 0,
            updatedDate: "",
          }),
        ),
        getBlockHeight().catch(() => 0),
        getConnectedPeers().catch(() => ({ peers: [] })),
      ]);

      setInfo({
        online: true,
        version: version.version,
        blockHeight: height || status.blockchainHeight,
        stateHeight: status.stateHeight,
        peerCount: peers.peers.length,
        lastChecked: new Date(),
      });
    } catch {
      setInfo((prev) => ({ ...prev, online: false, lastChecked: new Date() }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, pollIntervalMs);
    return () => clearInterval(id);
  }, [refresh, pollIntervalMs]);

  return { ...info, loading, refresh } as const;
}
