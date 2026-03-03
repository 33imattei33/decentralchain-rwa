"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Waves,
  TreePine,
  Sun,
  Mountain,
  Palette,
} from "lucide-react";

const assetTypes = [
  {
    icon: Building2,
    title: "Commercial Real Estate",
    description:
      "Grade-A offices, retail centers, and mixed-use developments in global financial hubs.",
    stats: { tvl: "$12.4M", assets: 24, yield: "6.2%" },
    color: "cyan",
  },
  {
    icon: Waves,
    title: "Hospitality & Resorts",
    description:
      "Beachfront hotels, luxury villas, and resort developments with rental yield.",
    stats: { tvl: "$8.7M", assets: 12, yield: "8.1%" },
    color: "sky",
  },
  {
    icon: TreePine,
    title: "Eco & Conservation",
    description:
      "Sustainable forestry, carbon credits, and conservation land generating green revenue.",
    stats: { tvl: "$3.2M", assets: 8, yield: "4.8%" },
    color: "emerald",
  },
  {
    icon: Sun,
    title: "Solar & Renewable Energy",
    description:
      "Photovoltaic farms and power purchase agreements with long-term yield contracts.",
    stats: { tvl: "$4.8M", assets: 6, yield: "11.3%" },
    color: "amber",
  },
  {
    icon: Mountain,
    title: "Agricultural Land",
    description:
      "Vineyards, plantations, and farmland with export-driven agricultural output.",
    stats: { tvl: "$7.2M", assets: 10, yield: "5.9%" },
    color: "teal",
  },
  {
    icon: Palette,
    title: "Fine Art & Collectibles",
    description:
      "Curated portfolios of blue-chip contemporary art stored in secured freeports.",
    stats: { tvl: "$3.6M", assets: 5, yield: "4.1%" },
    color: "violet",
  },
];

const colorMap: Record<
  string,
  { bg: string; border: string; text: string; iconBg: string }
> = {
  cyan: {
    bg: "bg-cyan-950/30",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
  },
  sky: {
    bg: "bg-sky-950/30",
    border: "border-sky-500/20",
    text: "text-sky-400",
    iconBg: "bg-sky-500/10",
  },
  emerald: {
    bg: "bg-emerald-950/30",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
  },
  amber: {
    bg: "bg-amber-950/30",
    border: "border-amber-500/20",
    text: "text-amber-400",
    iconBg: "bg-amber-500/10",
  },
  teal: {
    bg: "bg-teal-950/30",
    border: "border-teal-500/20",
    text: "text-teal-400",
    iconBg: "bg-teal-500/10",
  },
  violet: {
    bg: "bg-violet-950/30",
    border: "border-violet-500/20",
    text: "text-violet-400",
    iconBg: "bg-violet-500/10",
  },
};

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="relative bg-gray-900/50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-400">
            ASSET ECOSYSTEM
          </div>
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            Diverse Asset{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Classes
            </span>
          </h2>
          <p className="text-lg text-gray-400">
            From urban real estate to renewable energy — tokenize any real-world
            asset with full compliance on DecentralChain.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {assetTypes.map((asset, i) => {
            const colors = colorMap[asset.color];
            return (
              <motion.div
                key={asset.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`rounded-2xl border ${colors.border} ${colors.bg} p-6 backdrop-blur transition hover:border-white/10`}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${colors.iconBg}`}
                >
                  <asset.icon className={`h-6 w-6 ${colors.text}`} />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">
                  {asset.title}
                </h3>
                <p className="mb-4 text-sm text-gray-400">
                  {asset.description}
                </p>
                <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                  <div>
                    <div className="text-sm font-bold text-white">
                      {asset.stats.tvl}
                    </div>
                    <div className="text-[11px] text-gray-500">TVL</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {asset.stats.assets}
                    </div>
                    <div className="text-[11px] text-gray-500">Assets</div>
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${colors.text}`}>
                      {asset.stats.yield}
                    </div>
                    <div className="text-[11px] text-gray-500">Avg Yield</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Total stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 rounded-2xl border border-white/5 bg-gray-900/60 p-8 text-center"
        >
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { label: "Total Value Locked", value: "$39.9M" },
              { label: "Tokenized Assets", value: "65" },
              { label: "Active Investors", value: "2,847" },
              { label: "Average APY", value: "6.7%" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-3xl font-bold text-transparent">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
