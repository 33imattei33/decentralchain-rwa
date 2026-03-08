import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Proxy /api/node/* requests to the local DCC node to avoid CORS issues */
  async rewrites() {
    const nodeUrl = process.env.NEXT_PUBLIC_DC_NODE_URL || "https://mainnet-node.decentralchain.io";
    return [
      {
        source: "/api/node/:path*",
        destination: `${nodeUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
