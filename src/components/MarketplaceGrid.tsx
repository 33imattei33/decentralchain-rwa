"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import RWAInvestmentCard from "@/components/RWAInvestmentCard";
import FractionSlider from "@/components/FractionSlider";
import { MOCK_ASSETS } from "@/data/mockAssets";
import { IPFS_GATEWAY } from "@/lib/constants";
import type { RealWorldAsset, RWACategory } from "@/types/rwa";

const categories: { label: string; value: RWACategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Real Estate", value: "real-estate" },
  { label: "Hospitality", value: "hospitality" },
  { label: "Infrastructure", value: "infrastructure" },
  { label: "Agriculture", value: "agriculture" },
  { label: "Art", value: "art" },
  { label: "Commodities", value: "commodities" },
];

export default function MarketplaceGrid() {
  const [filter, setFilter] = useState<RWACategory | "all">("all");
  const [selectedAsset, setSelectedAsset] = useState<RealWorldAsset | null>(
    null
  );

  const filtered =
    filter === "all"
      ? MOCK_ASSETS
      : MOCK_ASSETS.filter((a) => a.category === filter);

  const openDocs = useCallback(
    (hash: string) => window.open(`${IPFS_GATEWAY}${hash}`, "_blank"),
    []
  );

  const handleConfirm = useCallback((fractions: number, totalCRS: number) => {
    // In production this would call buyFractionalTokens(...)
    alert(
      `Order placed!\n\nFractions: ${fractions}\nTotal: ${totalCRS} CRS\n\nSign the transaction in your DecentralChain Keeper wallet.`
    );
    setSelectedAsset(null);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Explore Real-World Assets
        </h1>
        <p className="mt-2 text-gray-400">
          Invest in fractional ownership of vetted, yield-generating physical
          assets — settled in CRS, powered by DecentralChain.
        </p>
      </div>

      {/* Category filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === cat.value
                ? "bg-cyan-500 text-gray-900"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Asset grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((asset) => (
          <RWAInvestmentCard
            key={asset.assetId}
            asset={asset}
            onBuy={setSelectedAsset}
            onViewDocs={openDocs}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-20 text-center text-gray-500">
          No assets found in this category.
        </p>
      )}

      {/* Buy modal */}
      <AnimatePresence>
        {selectedAsset && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAsset(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <button
                onClick={() => setSelectedAsset(null)}
                className="absolute -right-3 -top-3 rounded-full bg-gray-700 p-1.5 text-gray-300 hover:bg-gray-600"
              >
                <X size={16} />
              </button>
              <FractionSlider
                asset={selectedAsset}
                onConfirm={handleConfirm}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
