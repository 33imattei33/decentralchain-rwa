/**
 * GET /api/node/test — Test DCC mainnet node connectivity & SDK operability
 */
import { NextResponse } from "next/server";
import { DC_NODE_URL, DC_CHAIN_ID } from "@/lib/constants";

export async function GET() {
  const results: Record<string, unknown> = {
    nodeUrl: DC_NODE_URL,
    chainId: DC_CHAIN_ID,
    timestamp: new Date().toISOString(),
  };

  // 1. Test node version
  try {
    const res = await fetch(`${DC_NODE_URL}/node/version`);
    results.nodeVersion = await res.json();
  } catch (e) {
    results.nodeVersionError = (e as Error).message;
  }

  // 2. Test block height
  try {
    const res = await fetch(`${DC_NODE_URL}/blocks/height`);
    results.blockHeight = await res.json();
  } catch (e) {
    results.blockHeightError = (e as Error).message;
  }

  // 3. Test transaction broadcast endpoint (OPTIONS only, no actual tx)
  try {
    const res = await fetch(`${DC_NODE_URL}/transactions/unconfirmed/size`);
    results.unconfirmedPool = await res.json();
  } catch (e) {
    results.txEndpointError = (e as Error).message;
  }

  // 4. Test RIDE compile endpoint
  try {
    const testScript = `{-# STDLIB_VERSION 5 #-}\n{-# CONTENT_TYPE EXPRESSION #-}\n{-# SCRIPT_TYPE ASSET #-}\ntrue`;
    const res = await fetch(`${DC_NODE_URL}/utils/script/compile`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: testScript,
    });
    const data = await res.json();
    results.rideCompile = {
      success: !!data.script,
      complexity: data.complexity,
    };
  } catch (e) {
    results.rideCompileError = (e as Error).message;
  }

  return NextResponse.json(results, { status: 200 });
}
