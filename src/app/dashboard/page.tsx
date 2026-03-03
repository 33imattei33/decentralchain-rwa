"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Shield,
  ArrowUpRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const portfolioData = [
  { month: "Aug", value: 1800000 },
  { month: "Sep", value: 1920000 },
  { month: "Oct", value: 2100000 },
  { month: "Nov", value: 2050000 },
  { month: "Dec", value: 2350000 },
  { month: "Jan", value: 2580000 },
  { month: "Feb", value: 2847392 },
];

const yieldData = [
  { month: "Aug", yield: 4200 },
  { month: "Sep", yield: 4800 },
  { month: "Oct", yield: 5100 },
  { month: "Nov", yield: 4900 },
  { month: "Dec", yield: 5800 },
  { month: "Jan", yield: 6200 },
  { month: "Feb", yield: 6840 },
];

const stats = [
  {
    label: "Portfolio Value",
    value: "$2,847,392",
    change: "+12.4%",
    up: true,
    icon: DollarSign,
    color: "cyan",
  },
  {
    label: "Monthly Yield",
    value: "$6,840",
    change: "+10.3%",
    up: true,
    icon: TrendingUp,
    color: "emerald",
  },
  {
    label: "Active Assets",
    value: "12",
    change: "+2",
    up: true,
    icon: Building2,
    color: "violet",
  },
  {
    label: "Compliance",
    value: "98%",
    change: "All clear",
    up: true,
    icon: Shield,
    color: "amber",
  },
];

const recentTx = [
  {
    asset: "Miami Hotel Suite",
    type: "Buy",
    amount: "250 fractions",
    value: "$6,250 CRS",
    time: "2h ago",
    status: "confirmed",
  },
  {
    asset: "Solar Farm NV",
    type: "Yield",
    amount: "Monthly Payout",
    value: "$524 CRS",
    time: "1d ago",
    status: "confirmed",
  },
  {
    asset: "London Office",
    type: "Buy",
    amount: "100 fractions",
    value: "$12,000 CRS",
    time: "3d ago",
    status: "confirmed",
  },
  {
    asset: "Napa Vineyard",
    type: "Buy",
    amount: "50 fractions",
    value: "$3,600 CRS",
    time: "5d ago",
    status: "pending",
  },
];

const colorMap: Record<string, { bg: string; border: string; icon: string }> = {
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    icon: "text-cyan-400",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: "text-emerald-400",
  },
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    icon: "text-violet-400",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: "text-amber-400",
  },
};

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back. Here&apos;s your portfolio overview.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const colors = colorMap[stat.color];
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`rounded-2xl border ${colors.border} bg-gray-900/60 p-5`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg}`}
                >
                  <stat.icon className={`h-5 w-5 ${colors.icon}`} />
                </div>
                <span
                  className={`flex items-center gap-1 text-xs font-medium ${
                    stat.up ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {stat.up ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="mt-1 text-xs text-gray-500">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Portfolio value chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl border border-white/5 bg-gray-900/60 p-6 lg:col-span-2"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">
                Portfolio Value
              </h3>
              <p className="text-xs text-gray-500">Last 7 months</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button className="rounded-lg bg-cyan-500/10 px-3 py-1.5 font-medium text-cyan-400">
                7M
              </button>
              <button className="rounded-lg px-3 py-1.5 text-gray-500 hover:bg-white/5">
                1Y
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={portfolioData}>
              <defs>
                <linearGradient id="gradValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  color: "#fff",
                }}
                formatter={(v) => [`$${Number(v ?? 0).toLocaleString()}`, "Value"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#06b6d4"
                strokeWidth={2}
                fill="url(#gradValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Yield chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="rounded-2xl border border-white/5 bg-gray-900/60 p-6"
        >
          <h3 className="mb-1 text-base font-semibold text-white">
            Monthly Yield
          </h3>
          <p className="mb-6 text-xs text-gray-500">CRS distributions</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={yieldData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  color: "#fff",
                }}
                formatter={(v) => [`$${Number(v ?? 0).toLocaleString()}`, "Yield"]}
              />
              <Bar dataKey="yield" fill="#34d399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-2xl border border-white/5 bg-gray-900/60 p-6"
      >
        <h3 className="mb-4 text-base font-semibold text-white">
          Recent Transactions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-xs text-gray-500">
                <th className="pb-3 font-medium">Asset</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Value</th>
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.map((tx, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  <td className="py-3 text-sm font-medium text-white">
                    {tx.asset}
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded-lg px-2 py-1 text-xs font-medium ${
                        tx.type === "Buy"
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-400">{tx.amount}</td>
                  <td className="py-3 text-sm font-medium text-white">
                    {tx.value}
                  </td>
                  <td className="py-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {tx.time}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`flex items-center gap-1 text-xs font-medium ${
                        tx.status === "confirmed"
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }`}
                    >
                      <CheckCircle2 size={12} />
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
