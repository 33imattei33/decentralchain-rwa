"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  TrendingUp,
  FileText,
  ShoppingCart,
  MapPin,
  Tag,
} from "lucide-react";
import type { RealWorldAsset } from "@/types/rwa";

interface Props {
  asset: RealWorldAsset;
  onBuy: (asset: RealWorldAsset) => void;
  onViewDocs: (ipfsHash: string) => void;
}

export default function RWAInvestmentCard({ asset, onBuy, onViewDocs }: Props) {
  const fundingPercent = Math.min(
    (asset.fractionsSold / asset.totalFractions) * 100,
    100
  );

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(0,0,0,.12)" }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg"
    >
      {/* Hero image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={asset.imageUrl}
          alt={asset.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
        {/* Category badge */}
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur">
          <Tag size={12} />
          {asset.category}
        </span>
        {/* Yield badge */}
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-bold backdrop-blur">
          <TrendingUp size={12} />
          {asset.currentYieldAPY.toFixed(1)}% APY
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold leading-tight">{asset.title}</h3>

        <p className="flex items-center gap-1 text-sm text-gray-400">
          <MapPin size={14} className="shrink-0" />
          {asset.physicalLocation}
        </p>

        {/* Valuation & price */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-500">Total Valuation</p>
            <p className="text-xl font-bold tracking-tight">
              ${asset.totalValuation.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Fraction Price</p>
            <p className="text-base font-semibold text-cyan-400">
              {asset.fractionalTokenPrice} CRS
            </p>
          </div>
        </div>

        {/* Funding progress bar */}
        <div>
          <div className="mb-1 flex justify-between text-xs text-gray-400">
            <span>Funding Progress</span>
            <span>{fundingPercent.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${fundingPercent}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {asset.fractionsSold.toLocaleString()} /{" "}
            {asset.totalFractions.toLocaleString()} fractions sold
          </p>
        </div>

        {/* Action buttons */}
        <div className="mt-auto flex gap-2 pt-2">
          <button
            onClick={() => onViewDocs(asset.legalDocumentIpfsHash)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-600 px-4 py-2.5 text-sm font-medium transition hover:bg-white/5"
          >
            <FileText size={16} />
            Legal Docs
          </button>
          <button
            onClick={() => onBuy(asset)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 px-4 py-2.5 text-sm font-bold text-gray-900 transition hover:brightness-110"
          >
            <ShoppingCart size={16} />
            Buy with CRS
          </button>
        </div>
      </div>
    </motion.div>
  );
}
