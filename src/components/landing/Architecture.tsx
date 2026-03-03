"use client";

import { motion } from "framer-motion";

const layers = [
  {
    label: "Frontend Layer",
    color: "from-cyan-500 to-cyan-600",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/10",
    items: ["Next.js dApp", "Tailwind UI", "Framer Motion", "Wallet Keeper"],
  },
  {
    label: "Smart Contract Layer",
    color: "from-violet-500 to-violet-600",
    border: "border-violet-500/20",
    bg: "bg-violet-500/10",
    items: ["RIDE v6 Scripts", "Smart Assets", "Escrow dApp", "KYC Registry"],
  },
  {
    label: "Blockchain Layer",
    color: "from-emerald-500 to-emerald-600",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/10",
    items: [
      "DecentralChain PoS",
      "5s Block Time",
      "DCC Gas Token",
      "Node API",
    ],
  },
  {
    label: "Data & Storage",
    color: "from-amber-500 to-amber-600",
    border: "border-amber-500/20",
    bg: "bg-amber-500/10",
    items: [
      "IPFS Legal Docs",
      "On-Chain State",
      "Token Balances",
      "Tx History",
    ],
  },
];

// Pre-computed positions to avoid SSR/client hydration mismatch from Math.cos/sin precision
const subsystems = (() => {
  const labels = [
    "KYC Whitelist",
    "Escrow Engine",
    "Yield Distribution",
    "Compliance Check",
    "Fee Collector",
    "Token Registry",
    "IPFS Pinning",
    "Node Indexer",
    "Cashback Module",
    "Governance DAO",
    "Audit Trail",
    "Oracle Feed",
    "Tax Module",
  ];
  const radius = 42;
  return labels.map((label, i) => {
    const angle = (i / labels.length) * 360;
    const x = +(50 + radius * Math.cos((angle * Math.PI) / 180)).toFixed(4);
    const y = +(50 + radius * Math.sin((angle * Math.PI) / 180)).toFixed(4);
    return { label, x, y };
  });
})();

export default function Architecture() {
  return (
    <section
      id="architecture"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      <div className="absolute inset-0 bg-gray-950" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(6,182,212,0.3) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-400">
            SYSTEM ARCHITECTURE
          </div>
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            13 Interconnected{" "}
            <span className="text-cyan-400">Subsystems</span>
          </h2>
          <p className="text-lg text-gray-400">
            A modular architecture bridging legal compliance and blockchain
            settlement with enterprise-grade reliability.
          </p>
        </motion.div>

        {/* Architecture layers + hub */}
        <div className="mb-16 grid gap-8 lg:grid-cols-2">
          {/* Left: layer cards */}
          <div className="space-y-4">
            {layers.map((layer, i) => (
              <motion.div
                key={layer.label}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`rounded-2xl border ${layer.border} bg-white/5 p-5 backdrop-blur-sm`}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full bg-gradient-to-r ${layer.color}`}
                  />
                  <h3 className="text-sm font-semibold text-white">
                    {layer.label}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {layer.items.map((item) => (
                    <span
                      key={item}
                      className={`rounded-lg ${layer.bg} px-3 py-1.5 text-xs font-medium text-gray-300`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: subsystem hub */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center"
          >
            <div className="relative aspect-square w-full max-w-md">
              {/* Center hub */}
              <div className="absolute left-1/2 top-1/2 z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-2xl shadow-cyan-500/30">
                <span className="text-center text-xs font-bold leading-tight text-white">
                  RWA
                  <br />
                  Core
                </span>
              </div>

              {/* Orbiting nodes */}
              {subsystems.map((sys, i) => (
                  <motion.div
                    key={sys.label}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
                    className="absolute -ml-10 -mt-5 flex h-10 w-20 items-center justify-center"
                    style={{ left: `${sys.x}%`, top: `${sys.y}%` }}
                  >
                    <div className="cursor-default whitespace-nowrap rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-[10px] font-medium text-gray-300 backdrop-blur-sm transition hover:border-cyan-500/30 hover:bg-cyan-500/20 hover:text-cyan-300">
                      {sys.label}
                    </div>
                  </motion.div>
              ))}

              {/* Connection rings */}
              <div className="absolute inset-[15%] rounded-full border border-cyan-500/10" />
              <div className="absolute inset-[30%] rounded-full border border-cyan-500/10" />
            </div>
          </motion.div>
        </div>

        {/* Transaction lifecycle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
        >
          <h3 className="mb-4 text-sm font-semibold text-white">
            Transaction Lifecycle
          </h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              "User Onboarding",
              "KYC Verification",
              "Wallet Connection",
              "Asset Discovery",
              "Compliance Check",
              "CRS Payment",
              "Escrow Lock",
              "Token Transfer",
              "Yield Accrual",
              "CR Coin Cashback",
            ].map((step, i) => (
              <div key={step} className="flex shrink-0 items-center gap-2">
                <span className="rounded-lg bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-300">
                  {step}
                </span>
                {i < 9 && (
                  <span className="text-gray-600">→</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
