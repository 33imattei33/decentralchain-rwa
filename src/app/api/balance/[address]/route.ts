/**
 * GET /api/balance/[address]/route.ts — Check DCC balance for an address
 */
import { NextRequest, NextResponse } from "next/server";
import { DC_NODE_URL } from "@/lib/constants";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params;

  try {
    // Fetch native DCC balance
    const balRes = await fetch(
      `${DC_NODE_URL}/addresses/balance/${address}`,
    );
    if (!balRes.ok) {
      const errText = await balRes.text();
      return NextResponse.json(
        { error: `Node error: ${errText}`, address },
        { status: 502 },
      );
    }
    const balData = await balRes.json();
    const balance = balData.balance ?? 0;

    // Fetch all asset balances
    let assets: unknown[] = [];
    try {
      const assetsRes = await fetch(
        `${DC_NODE_URL}/assets/balance/${address}`,
      );
      if (assetsRes.ok) {
        const assetsData = await assetsRes.json();
        assets = assetsData.balances ?? [];
      }
    } catch {
      // non-fatal
    }

    return NextResponse.json({
      address,
      balance,
      balanceDCC: balance / 1e8,
      assets,
      canMint: balance >= 101_000_000,
      nodeUrl: DC_NODE_URL,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to fetch balance",
        address,
      },
      { status: 500 },
    );
  }
}
