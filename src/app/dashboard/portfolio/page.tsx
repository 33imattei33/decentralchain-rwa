"use client";

import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const holdings = [
  {
    id: 1,
    name: "Miami Hotel Suite",
    location: "Miami Beach, FL",
    fractions: 250,
    value: 6250,
    yield: 8.4,
    color: "#06b6d4",
  },
  {
    id: 2,
    name: "London Office Tower",
    location: "Canary Wharf, UK",
    fractions: 100,
    value: 12000,
    yield: 6.2,
    color: "#8b5cf6",
  },
  {
    id: 3,
    name: "Solar Farm Nevada",
    location: "Clark County, NV",
    fractions: 400,
    value: 19200,
    yield: 11.3,
    color: "#f59e0b",
  },
  {
    id: 4,
    name: "Napa Valley Vineyard",
    location: "Napa, CA",
    fractions: 50,
    value: 3600,
    yield: 5.8,
    color: "#10b981",
  },
  {
    id: 5,
    name: "Art Collection Geneva",
    location: "Geneva, Switzerland",
    fractions: 200,
    value: 7200,
    yield: 4.1,
    color: "#ec4899",
  },
];

const allocationData = holdings.map((h) => ({
  name: h.name,
  value: h.value,
  color: h.color,
}));

const totalValue = holdings.reduce((s, h) => s + h.value, 0);

export default function Portfolio() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Portfolio</h1>
        <p className="mt-1 text-sm text-gray-500">
          Your fractional RWA holdings and allocation breakdown.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Holdings list */}
        <div className="space-y-3 lg:col-span-2">
          {holdings.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex cursor-pointer items-center gap-4 rounded-xl border border-white/5 bg-gray-900/60 p-4 transition hover:border-cyan-500/20 hover:bg-cyan-500/5"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: h.color + "15" }}
              >
                <Building2 className="h-5 w-5" style={{ color: h.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-white">
                  {h.name}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin size={12} /> {h.location}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-white">
                  ${h.value.toLocaleString()} CRS
                </div>
                <div className="text-xs text-gray-500">
                  {h.fractions} fractions
                </div>
              </div>
              <div className="hidden text-right sm:block">
                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-400">
                  <TrendingUp size={14} /> {h.yield}%
                </div>
                <div className="text-xs text-gray-500">APY</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Allocation chart + upcoming yields */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl border border-white/5 bg-gray-900/60 p-6"
          >
            <h3 className="mb-1 text-base font-semibold text-white">
              Allocation
            </h3>
            <p className="mb-4 text-xs text-gray-500">By asset value</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {allocationData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "#fff",
                  }}
                  formatter={(v) => [
                    `$${Number(v ?? 0).toLocaleString()}`,
                    "Value",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="mt-4 space-y-2">
              {allocationData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-400">{item.name}</span>
                  </div>
                  <span className="font-medium text-white">
                    {((item.value / totalValue) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>

            {/* Upcoming yields */}
            <div className="mt-6 border-t border-white/5 pt-4">
              <h4 className="mb-3 text-xs font-semibold text-gray-400">
                Upcoming Yields
              </h4>
              <div className="space-y-2">
                {[
                  { name: "Miami Hotel Suite", date: "Mar 1", amount: "$1,240" },
                  { name: "Solar Farm NV", date: "Mar 5", amount: "$524" },
                  { name: "London Office", date: "Mar 15", amount: "$890" },
                ].map((y) => (
                  <div
                    key={y.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-medium text-gray-300">{y.name}</div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock size={10} /> {y.date}
                      </div>
                    </div>
                    <span className="font-semibold text-emerald-400">
                      {y.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
