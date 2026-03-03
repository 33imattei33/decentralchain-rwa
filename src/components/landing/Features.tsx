"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Layers,
  Zap,
  FileCheck,
  Workflow,
  TrendingUp,
  Globe2,
  Brain,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "KYC-Gated Smart Assets",
    description:
      "Every RWA token carries an embedded RIDE script that enforces whitelist-only transfers. Only verified investors can hold or trade.",
    color: "from-cyan-500 to-cyan-600",
    bg: "bg-cyan-950/40",
    iconColor: "text-cyan-400",
  },
  {
    icon: Brain,
    title: "On-Chain Compliance Metadata",
    description:
      "Legal documents, audit reports, and KYC proofs are pinned to IPFS and referenced directly from the asset token — immutable and verifiable.",
    color: "from-violet-500 to-violet-600",
    bg: "bg-violet-950/40",
    iconColor: "text-violet-400",
  },
  {
    icon: Layers,
    title: "Fractional Ownership",
    description:
      "Divide any high-value asset into thousands of affordable tokens. Invest with as little as $10 in CRS and own a piece of the real world.",
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-950/40",
    iconColor: "text-emerald-400",
  },
  {
    icon: FileCheck,
    title: "Automated Escrow",
    description:
      "The marketplace dApp holds CRS payments in escrow until compliance checks pass and fractional tokens are released — no intermediaries.",
    color: "from-amber-500 to-amber-600",
    bg: "bg-amber-950/40",
    iconColor: "text-amber-400",
  },
  {
    icon: Workflow,
    title: "3-Token Ecosystem",
    description:
      "CRS for stable settlement, DCC for gas & governance, CR Coin for loyalty rewards. Each token serves a distinct role in the marketplace.",
    color: "from-rose-500 to-rose-600",
    bg: "bg-rose-950/40",
    iconColor: "text-rose-400",
  },
  {
    icon: TrendingUp,
    title: "Yield Distribution",
    description:
      "Automated pro-rata income allocation to token holders. Track your rental yields, dividends, and energy revenue in real time.",
    color: "from-sky-500 to-sky-600",
    bg: "bg-sky-950/40",
    iconColor: "text-sky-400",
  },
  {
    icon: Zap,
    title: "5-Second Block Time",
    description:
      "DecentralChain delivers near-instant finality. Gas fees are fractions of a cent — no profit eaten by network costs.",
    color: "from-indigo-500 to-indigo-600",
    bg: "bg-indigo-950/40",
    iconColor: "text-indigo-400",
  },
  {
    icon: Globe2,
    title: "Carbon-Neutral Nodes",
    description:
      "All validators run on carbonless infrastructure. A massive differentiator for ESG-conscious institutional and retail investors.",
    color: "from-teal-500 to-teal-600",
    bg: "bg-teal-950/40",
    iconColor: "text-teal-400",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-gray-900" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-400">
            PROTOCOL FEATURES
          </div>
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            Built for{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Real Assets
            </span>
          </h2>
          <p className="text-lg text-gray-400">
            Every component is purpose-built for compliant, fractional,
            yield-generating tokenization on DecentralChain.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={itemVariants}
              className="group rounded-2xl border border-white/5 bg-gray-900/60 p-6 backdrop-blur transition hover:border-white/10"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${f.bg}`}
              >
                <f.icon className={`h-6 w-6 ${f.iconColor}`} />
              </div>
              <h3 className="mb-2 text-base font-semibold text-white">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-400">
                {f.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
