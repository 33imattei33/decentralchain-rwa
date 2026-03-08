/**
 * GET /api/assets/[address] — Fetch all on-chain assets for a wallet address
 *
 * Returns enriched asset data including:
 * - Asset ID, name, description, quantity, decimals
 * - Issue transaction details
 * - On-chain data entries (RWA metadata)
 */
import { NextRequest, NextResponse } from "next/server";
import { DC_NODE_URL } from "@/lib/constants";

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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params;

  try {
    // 1. Fetch all asset balances
    const balRes = await fetch(`${DC_NODE_URL}/assets/balance/${address}`);
    if (!balRes.ok) {
      return NextResponse.json(
        { error: `Node error fetching balances`, address },
        { status: 502 },
      );
    }
    const balData = await balRes.json();
    const rawBalances: Array<{
      assetId: string;
      balance: number;
      issueTransaction?: Record<string, unknown> | null;
    }> = balData.balances ?? [];

    // 2. Enrich each asset with details
    const assets: AssetDetail[] = [];

    for (const item of rawBalances) {
      const it = item.issueTransaction;

      let name = "Unknown Token";
      let description = "";
      let decimals = 0;
      let quantity = 0;
      let reissuable = false;
      let scripted = false;
      let issuer = "";
      let issueTimestamp = 0;

      if (it) {
        name = (it.name as string) ?? "Unknown Token";
        description = (it.description as string) ?? "";
        decimals = (it.decimals as number) ?? 0;
        quantity = (it.quantity as number) ?? 0;
        reissuable = (it.reissuable as boolean) ?? false;
        scripted = !!it.script;
        issuer = (it.sender as string) ?? "";
        issueTimestamp = (it.timestamp as number) ?? 0;
      } else {
        // issueTransaction not available — fetch asset details individually
        try {
          const detailRes = await fetch(
            `${DC_NODE_URL}/assets/details/${item.assetId}`,
          );
          if (detailRes.ok) {
            const detail = await detailRes.json();
            name = detail.name ?? "Unknown Token";
            description = detail.description ?? "";
            decimals = detail.decimals ?? 0;
            quantity = detail.quantity ?? 0;
            reissuable = detail.reissuable ?? false;
            scripted = !!detail.scripted;
            issuer = detail.issuer ?? "";
            issueTimestamp = detail.issueTimestamp ?? 0;
          }
        } catch {
          // non-fatal — keep defaults
        }
      }

      // 3. Fetch on-chain data entries (RWA metadata) if issuer is this address
      let metadata: Record<string, unknown> = {};
      if (issuer === address) {
        try {
          const dataRes = await fetch(`${DC_NODE_URL}/addresses/data/${address}?matches=.*${item.assetId}.*`);
          if (dataRes.ok) {
            const dataEntries: Array<{ key: string; type: string; value: unknown }> =
              await dataRes.json();
            for (const entry of dataEntries) {
              metadata[entry.key] = entry.value;
            }
          }
        } catch {
          // non-fatal
        }

        // Also fetch generic RWA metadata keys
        try {
          const dataRes2 = await fetch(`${DC_NODE_URL}/addresses/data/${address}?matches=rwa_.*`);
          if (dataRes2.ok) {
            const dataEntries2: Array<{ key: string; type: string; value: unknown }> =
              await dataRes2.json();
            for (const entry of dataEntries2) {
              if (!metadata[entry.key]) {
                metadata[entry.key] = entry.value;
              }
            }
          }
        } catch {
          // non-fatal
        }
      }

      assets.push({
        assetId: item.assetId,
        balance: item.balance,
        name,
        description,
        decimals,
        quantity,
        reissuable,
        scripted,
        issuer,
        issueTimestamp,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
      });
    }

    // 4. Also fetch native DCC balance
    let dccBalance = 0;
    try {
      const nativeRes = await fetch(
        `${DC_NODE_URL}/addresses/balance/${address}`,
      );
      if (nativeRes.ok) {
        const nativeData = await nativeRes.json();
        dccBalance = nativeData.balance ?? 0;
      }
    } catch {
      // non-fatal
    }

    return NextResponse.json({
      address,
      dccBalance,
      dccBalanceFormatted: dccBalance / 1e8,
      totalAssets: assets.length,
      assets,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to fetch assets",
        address,
      },
      { status: 500 },
    );
  }
}
