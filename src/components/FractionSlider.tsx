"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import type { RealWorldAsset } from "@/types/rwa";

interface Props {
  asset: RealWorldAsset;
  /** Called when the user confirms the purchase */
  onConfirm: (fractions: number, totalCRS: number) => void;
}

export default function FractionSlider({ asset, onConfirm }: Props) {
  const maxFractions = asset.totalFractions - asset.fractionsSold;
  const [fractions, setFractions] = useState(1);

  const totalCost = +(fractions * asset.fractionalTokenPrice).toFixed(2);
  const percentage = +((fractions / asset.totalFractions) * 100).toFixed(2);

  const handleSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFractions(Number(e.target.value)),
    []
  );

  const nudge = (delta: number) =>
    setFractions((prev) => Math.max(1, Math.min(maxFractions, prev + delta)));

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900/80 p-6 backdrop-blur-lg">
      <h4 className="mb-1 text-lg font-semibold text-white">
        Buy Fractions — {asset.title}
      </h4>
      <p className="mb-6 text-sm text-gray-400">
        Select how much of this asset you&apos;d like to own.
      </p>

      {/* Slider */}
      <input
        type="range"
        min={1}
        max={maxFractions}
        value={fractions}
        onChange={handleSlider}
        className="slider-thumb h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-700 accent-cyan-500 outline-none transition"
      />

      {/* Nudge buttons */}
      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => nudge(-1)}
          className="rounded-lg border border-gray-700 p-2 text-gray-300 transition hover:bg-gray-800"
        >
          <Minus size={16} />
        </button>

        <motion.span
          key={fractions}
          initial={{ scale: 1.15, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl font-bold tabular-nums text-white"
        >
          {fractions.toLocaleString()}
        </motion.span>

        <button
          onClick={() => nudge(1)}
          className="rounded-lg border border-gray-700 p-2 text-gray-300 transition hover:bg-gray-800"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Summary */}
      <div className="mt-5 space-y-2 rounded-xl bg-gray-800/60 p-4 text-sm">
        <div className="flex justify-between text-gray-400">
          <span>Fractions</span>
          <span className="text-white">{fractions.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Ownership</span>
          <span className="text-white">{percentage}%</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Price per Fraction</span>
          <span className="text-white">{asset.fractionalTokenPrice} CRS</span>
        </div>
        <div className="flex justify-between border-t border-gray-700 pt-2 text-base font-semibold">
          <span className="text-gray-300">Total</span>
          <span className="text-cyan-400">{totalCost.toLocaleString()} CRS</span>
        </div>
      </div>

      {/* Confirm */}
      <button
        onClick={() => onConfirm(fractions, totalCost)}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 py-3 text-sm font-bold text-gray-900 transition hover:brightness-110 active:scale-[0.98]"
      >
        Confirm Purchase
      </button>
    </div>
  );
}
