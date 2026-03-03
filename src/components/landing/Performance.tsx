"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Zap,
  Activity,
  Server,
  Database,
  Shield,
} from "lucide-react";

const metrics = [
  {
    icon: Clock,
    label: "Block Time",
    value: "~5 sec",
    target: "Target: 5s",
    actual: "Current: 4.8s",
    progress: 96,
    color: "cyan",
  },
  {
    icon: Zap,
    label: "Gas Cost",
    value: "< $0.01",
    target: "DCC Gas Token",
    actual: "vs ETH: $5-50+",
    progress: 99,
    color: "emerald",
  },
  {
    icon: Activity,
    label: "KYC Check Latency",
    value: "< 2 sec",
    target: "Target: <2s",
    actual: "Avg: 1.2s",
    progress: 88,
    color: "violet",
  },
  {
    icon: Server,
    label: "Node Uptime",
    value: "99.9%",
    target: "Target: 99.9%",
    actual: "Current: 99.7%",
    progress: 97,
    color: "sky",
  },
  {
    icon: Database,
    label: "Throughput",
    value: "1,000+ TPS",
    target: "DecentralChain PoS",
    actual: "vs ETH: 15-30",
    progress: 92,
    color: "amber",
  },
  {
    icon: Shield,
    label: "Carbon Neutral",
    value: "100%",
    target: "Green validators",
    actual: "Zero emissions",
    progress: 100,
    color: "teal",
  },
];

const colorMap: Record<
  string,
  { bar: string; bg: string; icon: string; glow: string }
> = {
  cyan: {
    bar: "bg-cyan-500",
    bg: "bg-cyan-950/40",
    icon: "text-cyan-400",
    glow: "shadow-cyan-500/20",
  },
  emerald: {
    bar: "bg-emerald-500",
    bg: "bg-emerald-950/40",
    icon: "text-emerald-400",
    glow: "shadow-emerald-500/20",
  },
  violet: {
    bar: "bg-violet-500",
    bg: "bg-violet-950/40",
    icon: "text-violet-400",
    glow: "shadow-violet-500/20",
  },
  sky: {
    bar: "bg-sky-500",
    bg: "bg-sky-950/40",
    icon: "text-sky-400",
    glow: "shadow-sky-500/20",
  },
  amber: {
    bar: "bg-amber-500",
    bg: "bg-amber-950/40",
    icon: "text-amber-400",
    glow: "shadow-amber-500/20",
  },
  teal: {
    bar: "bg-teal-500",
    bg: "bg-teal-950/40",
    icon: "text-teal-400",
    glow: "shadow-teal-500/20",
  },
};

export default function Performance() {
  return (
    <section id="performance" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
            PERFORMANCE BENCHMARKS
          </div>
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            Enterprise-Grade{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Performance
            </span>
          </h2>
          <p className="text-lg text-gray-400">
            DecentralChain delivers low-cost, high-throughput operations with
            carbon-neutral consensus and sub-second compliance checks.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric, i) => {
            const colors = colorMap[metric.color];
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border border-white/5 bg-gray-900/60 p-6 shadow-sm backdrop-blur"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg}`}
                  >
                    <metric.icon className={`h-5 w-5 ${colors.icon}`} />
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {metric.value}
                  </span>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-white">
                  {metric.label}
                </h3>
                <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{metric.target}</span>
                  <span>{metric.actual}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                  <motion.div
                    className={`h-full rounded-full ${colors.bar}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${metric.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.08 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {[
            { label: "Block Time", value: "~5 sec", sub: "DecentralChain PoS" },
            { label: "Min Investment", value: "$10", sub: "Fractional CRS tokens" },
            { label: "Settlement", value: "Instant", sub: "On-chain escrow" },
            { label: "Eco Score", value: "100%", sub: "Carbon-neutral nodes" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/5 bg-gray-900/40 p-5 text-center"
            >
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm font-medium text-gray-400">
                {stat.label}
              </div>
              <div className="mt-1 text-xs text-gray-600">{stat.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
