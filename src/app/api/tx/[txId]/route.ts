/**
 * GET /api/tx/[txId]/route.ts — Verify a transaction on DCC blockchain
 */
import { NextRequest, NextResponse } from "next/server";
import { DC_NODE_URL } from "@/lib/constants";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ txId: string }> },
) {
  const { txId } = await params;

  try {
    const res = await fetch(`${DC_NODE_URL}/transactions/info/${txId}`);
    if (!res.ok) {
      // Check unconfirmed
      const unconfRes = await fetch(
        `${DC_NODE_URL}/transactions/unconfirmed/info/${txId}`,
      );
      if (unconfRes.ok) {
        const unconfData = await unconfRes.json();
        return NextResponse.json({
          found: true,
          status: "unconfirmed",
          transaction: unconfData,
          nodeUrl: DC_NODE_URL,
        });
      }

      return NextResponse.json(
        {
          found: false,
          txId,
          error: "Transaction not found on blockchain",
          nodeUrl: DC_NODE_URL,
        },
        { status: 404 },
      );
    }

    const txData = await res.json();

    // If it's an issue tx, also fetch asset details
    let assetDetails = null;
    if (txData.type === 3) {
      try {
        const assetRes = await fetch(
          `${DC_NODE_URL}/assets/details/${txData.id}`,
        );
        if (assetRes.ok) {
          assetDetails = await assetRes.json();
        }
      } catch {
        // non-fatal
      }
    }

    return NextResponse.json({
      found: true,
      status: "confirmed",
      transaction: txData,
      assetDetails,
      nodeUrl: DC_NODE_URL,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to verify transaction",
        txId,
      },
      { status: 500 },
    );
  }
}
