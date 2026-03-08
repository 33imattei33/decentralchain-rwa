/**
 * POST /api/mint — Server-side RWA token minting
 *
 * Handles the full on-chain flow server-side (avoids browser SDK issues):
 *   1. Validate parameters
 *   2. Check account balance (need ≥ 1 DCC for issue fee)
 *   3. Issue the token via @decentralchain/transactions
 *   4. Optionally write metadata (Data tx)
 *   5. Return result with asset ID, tx IDs
 *
 * Body: { seed, name, description, quantity, decimals?, reissuable?, chainId?,
 *         kycRequired?, category, location, totalValuation, yieldAPY, ipfsHash, imageUrl? }
 */
import { NextRequest, NextResponse } from "next/server";
import {
  issue,
  data,
  broadcast,
  waitForTx,
  type IIssueParams,
  type IDataParams,
} from "@decentralchain/transactions";
import { DC_CHAIN_ID, DC_NODE_URL } from "@/lib/constants";
import { address as deriveAddress } from "@decentralchain/ts-lib-crypto";

// Minimum balance required: 1 DCC (100_000_000 wavelets) for issue + 100_000 for data tx
const MIN_BALANCE = 101_000_000;

interface MintRequestBody {
  seed: string;
  name: string;
  description: string;
  quantity: number;
  decimals?: number;
  reissuable?: boolean;
  kycRequired?: boolean;
  accreditedOnly?: boolean;
  category: string;
  location: string;
  totalValuation: number;
  yieldAPY: number;
  ipfsHash: string;
  imageUrl?: string;
  _checkOnly?: boolean;
}

export async function POST(req: NextRequest) {
  let body: MintRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const {
    seed,
    name,
    quantity,
    _checkOnly = false,
  } = body;

  const {
    description = "",
    decimals = 0,
    reissuable = false,
    category = "",
    location = "",
    totalValuation = 0,
    yieldAPY = 0,
    ipfsHash = "",
    imageUrl,
  } = body;

  // ── Validate required fields ──
  if (!seed) {
    return NextResponse.json(
      { error: "Seed phrase is required to sign the transaction" },
      { status: 400 },
    );
  }
  if (!name || name.length < 4 || name.length > 16) {
    return NextResponse.json(
      {
        error: `Token name must be 4–16 characters (got ${name?.length ?? 0})`,
      },
      { status: 400 },
    );
  }
  if (!quantity || quantity < 1) {
    return NextResponse.json(
      { error: "Quantity must be at least 1" },
      { status: 400 },
    );
  }

  const steps: { step: string; status: string; detail?: string }[] = [];

  try {
    // ── Step 1: Derive address from seed and check balance ──
    steps.push({ step: "check-balance", status: "running" });

    // Derive address from seed
    const senderAddress = deriveAddress(seed, DC_CHAIN_ID);

    // Fetch balance from node
    const balRes = await fetch(
      `${DC_NODE_URL}/addresses/balance/${senderAddress}`,
    );
    if (!balRes.ok) {
      const errText = await balRes.text();
      steps[steps.length - 1].status = "failed";
      steps[steps.length - 1].detail = errText;
      return NextResponse.json(
        {
          error: `Failed to fetch balance for ${senderAddress}: ${errText}`,
          senderAddress,
          steps,
        },
        { status: 400 },
      );
    }
    const balData = await balRes.json();
    const balance = balData.balance ?? 0;
    steps[steps.length - 1] = {
      step: "check-balance",
      status: "done",
      detail: `Address: ${senderAddress}, Balance: ${balance} (${(balance / 1e8).toFixed(8)} DCC)`,
    };

    // For _checkOnly, return immediately with balance info
    if (_checkOnly) {
      return NextResponse.json({
        senderAddress,
        balance,
        balanceDCC: balance / 1e8,
        canMint: balance >= MIN_BALANCE,
        steps,
      });
    }

    if (balance < MIN_BALANCE) {
      return NextResponse.json(
        {
          error: `Insufficient balance. Need at least ${(MIN_BALANCE / 1e8).toFixed(2)} DCC (${MIN_BALANCE} wavelets). Current balance: ${(balance / 1e8).toFixed(8)} DCC (${balance} wavelets)`,
          senderAddress,
          balance,
          balanceDCC: balance / 1e8,
          required: MIN_BALANCE,
          requiredDCC: MIN_BALANCE / 1e8,
          steps,
        },
        { status: 400 },
      );
    }

    // ── Step 2: Build & sign the Issue transaction ──
    steps.push({ step: "issue-token", status: "running" });

    const tokenDescription = [
      description,
      `\n---`,
      `Category: ${category}`,
      `Location: ${location}`,
      `Valuation: $${totalValuation.toLocaleString()}`,
      `Yield: ${yieldAPY}% APY`,
      `IPFS: ${ipfsHash}`,
    ].join("\n");

    const issueParams: IIssueParams = {
      name: name.slice(0, 16),
      description: tokenDescription.slice(0, 1000),
      quantity,
      decimals,
      reissuable,
      fee: 100_000_000, // 1 DCC
      chainId: DC_CHAIN_ID,
    };

    const signedIssueTx = issue(issueParams, seed);

    steps[steps.length - 1] = {
      step: "issue-token",
      status: "signed",
      detail: `Tx ID: ${signedIssueTx.id}, Type: ${signedIssueTx.type}`,
    };

    // ── Step 3: Broadcast the Issue transaction ──
    steps.push({ step: "broadcast-issue", status: "running" });

    let issueTxResult: { id: string };
    try {
      issueTxResult = await broadcast(signedIssueTx, DC_NODE_URL);
    } catch (broadcastErr) {
      const errMsg =
        broadcastErr instanceof Error
          ? broadcastErr.message
          : JSON.stringify(broadcastErr);
      steps[steps.length - 1] = {
        step: "broadcast-issue",
        status: "failed",
        detail: errMsg,
      };
      return NextResponse.json(
        {
          error: `Broadcast failed: ${errMsg}`,
          txId: signedIssueTx.id,
          senderAddress,
          steps,
        },
        { status: 502 },
      );
    }

    const assetId = issueTxResult.id;
    steps[steps.length - 1] = {
      step: "broadcast-issue",
      status: "done",
      detail: `Asset ID: ${assetId}`,
    };

    // ── Step 4: Wait for confirmation ──
    steps.push({ step: "wait-confirm", status: "running" });
    let confirmed = false;
    try {
      await waitForTx(assetId, { apiBase: DC_NODE_URL, timeout: 60_000 });
      confirmed = true;
    } catch {
      // May timeout but tx can still be in the pipeline
    }
    steps[steps.length - 1] = {
      step: "wait-confirm",
      status: confirmed ? "done" : "timeout",
      detail: confirmed
        ? "Transaction confirmed in blockchain"
        : "Waiting for confirmation (tx may still be processing)",
    };

    // ── Step 5: Write on-chain metadata (Data tx) ──
    let dataTxId: string | undefined;
    steps.push({ step: "write-metadata", status: "running" });
    try {
      const metadataEntries: IDataParams["data"] = [
        { key: `rwa_${assetId}_name`, type: "string", value: name },
        { key: `rwa_${assetId}_category`, type: "string", value: category },
        { key: `rwa_${assetId}_location`, type: "string", value: location },
        {
          key: `rwa_${assetId}_valuation`,
          type: "integer",
          value: totalValuation,
        },
        {
          key: `rwa_${assetId}_fractions`,
          type: "integer",
          value: quantity,
        },
        {
          key: `rwa_${assetId}_yield`,
          type: "integer",
          value: Math.round(yieldAPY * 100),
        },
        { key: `rwa_${assetId}_ipfs`, type: "string", value: ipfsHash },
        ...(imageUrl
          ? [
              {
                key: `rwa_${assetId}_image`,
                type: "string" as const,
                value: imageUrl,
              },
            ]
          : []),
      ];

      const signedData = data(
        {
          data: metadataEntries,
          fee: 100_000,
          chainId: DC_CHAIN_ID,
        },
        seed,
      );

      const dataResult = await broadcast(signedData, DC_NODE_URL);
      dataTxId = dataResult.id;
      steps[steps.length - 1] = {
        step: "write-metadata",
        status: "done",
        detail: `Data Tx ID: ${dataTxId}`,
      };
    } catch (dataErr) {
      steps[steps.length - 1] = {
        step: "write-metadata",
        status: "failed",
        detail:
          dataErr instanceof Error
            ? dataErr.message
            : "Metadata write failed",
      };
    }

    // ── Step 6: Get final block height ──
    let blockHeight = 0;
    try {
      const heightRes = await fetch(`${DC_NODE_URL}/blocks/height`);
      const heightData = await heightRes.json();
      blockHeight = heightData.height ?? 0;
    } catch {
      // non-fatal
    }

    // ── Return result ──
    return NextResponse.json({
      success: true,
      assetId,
      issueTxId: assetId,
      dataTxId: dataTxId ?? null,
      senderAddress,
      blockHeight,
      feePaid: 100_000_000 + (dataTxId ? 100_000 : 0),
      confirmed,
      steps,
      verifyUrl: `${DC_NODE_URL}/transactions/info/${assetId}`,
      assetUrl: `${DC_NODE_URL}/assets/details/${assetId}`,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Unknown error",
        stack:
          process.env.NODE_ENV === "development" && err instanceof Error
            ? err.stack
            : undefined,
        steps,
      },
      { status: 500 },
    );
  }
}
