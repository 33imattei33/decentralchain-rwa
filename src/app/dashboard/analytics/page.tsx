"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Activity, DollarSign } from "lucide-react";
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const tvlData = [
  { month: "Jul", tvl: 18200000 },
  { month: "Aug", tvl: 21400000 },
  { month: "Sep", tvl: 24100000 },
  { month: "Oct", tvl: 26800000 },
  { month: "Nov", tvl: 29500000 },
  { month: "Dec", tvl: 32100000 },
  { month: "Jan", tvl: 34600000 },
  { month: "Feb", tvl: 39900000 },
];

const txVolume = [
  { day: "Mon", volume: 142 },
  { day: "Tue", volume: 189 },
  { day: "Wed", volume: 167 },
  { day: "Thu", volume: 234 },
  { day: "Fri", volume: 198 },
  { day: "Sat", volume: 86 },
  { day: "Sun", volume: 62 },
];

const userGrowth = [
  { month: "Jul", users: 820 },
  { month: "Aug", users: 1050 },
  { month: "Sep", users: 1320 },
  { month: "Oct", users: 1680 },
  { month: "Nov", users: 2010 },
  { month: "Dec", users: 2340 },
  { month: "Jan", users: 2580 },
  { month: "Feb", users: 2847 },
];

const assetTypeDistribution = [
  { name: "Real Estate", value: 35, color: "#06b6d4" },
  { name: "Hospitality", value: 25, color: "#3b82f6" },
  { name: "Infrastructure", value: 18, color: "#10b981" },
  { name: "Agriculture", value: 12, color: "#84cc16" },
  { name: "Art", value: 7, color: "#f59e0b" },
  { name: "Other", value: 3, color: "#94a3b8" },
];

const topAssets = [
  { name: "Miami Hotel Suite", growth: "+14.1%", volume: "$2.4M", investors: 342 },
  { name: "Solar Farm Nevada", growth: "+11.5%", volume: "$1.8M", investors: 256 },
  { name: "London Office Tower", growth: "+8.2%", volume: "$1.5M", investors: 189 },
  { name: "Napa Valley Vineyard", growth: "+7.4%", volume: "$980K", investors: 134 },
  { name: "Art Collection Geneva", growth: "+6.8%", volume: "$1.1M", investors: 167 },
];

const summaryStats = [
  { label: "Total Value Locked", value: "$39.9M", change: "+14.3%", icon: DollarSign, color: "cyan" },
  { label: "Active Investors", value: "2,847", change: "+10.3%", icon: Users, color: "emerald" },
  { label: "Weekly Transactions", value: "1,078", change: "+22.1%", icon: Activity, color: "violet" },
  { label: "Avg APY", value: "6.7%", change: "+0.4%", icon: TrendingUp, color: "amber" },
];

const colorMap: Record<string, { bg: string; icon: string }> = {
  cyan: { bg: "bg-cyan-500/10", icon: "text-cyan-400" },
  emerald: { bg: "bg-emerald-500/10", icon: "text-emerald-400" },
  violet: { bg: "bg-violet-500/10", icon: "text-violet-400" },
  amber: { bg: "bg-amber-500/10", icon: "text-amber-400" },
};

const chartTooltipStyle = {
  backgroundColor: "#111827",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#fff",
};

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Platform metrics and market insights
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryStats.map((stat, i) => {
          const colors = colorMap[stat.color];
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-2xl border border-white/5 bg-gray-900/60 p-5"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors.bg}`}>
                  <stat.icon className={`h-4 w-4 ${colors.icon}`} />
                </div>
                <span className="text-xs font-medium text-emerald-400">
                  {stat.change}
                </span>
              </div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="mt-0.5 text-xs text-gray-500">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* TVL + Tx Volume */}
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl border border-white/5 bg-gray-900/60 p-6 lg:col-span-2"
        >
          <h3 className="mb-1 text-base font-semibold text-white">
            Total Value Locked
          </h3>
          <p className="mb-6 text-xs text-gray-500">
            Platform-wide TVL growth
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={tvlData}>
              <defs>
                <linearGradient id="gradTvl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1e6).toFixed(0)}M`} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [`$${(Number(v ?? 0) / 1e6).toFixed(1)}M`, "TVL"]} />
              <Area type="monotone" dataKey="tvl" stroke="#06b6d4" strokeWidth={2} fill="url(#gradTvl)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="rounded-2xl border border-white/5 bg-gray-900/60 p-6"
        >
          <h3 className="mb-1 text-base font-semibold text-white">
            Daily Tx Volume
          </h3>
          <p className="mb-6 text-xs text-gray-500">This week</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={txVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="volume" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* User growth + Asset distribution */}
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-2xl border border-white/5 bg-gray-900/60 p-6 lg:col-span-2"
        >
          <h3 className="mb-1 text-base font-semibold text-white">
            Investor Growth
          </h3>
          <p className="mb-6 text-xs text-gray-500">
            Verified investors over time
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="rounded-2xl border border-white/5 bg-gray-900/60 p-6"
        >
          <h3 className="mb-1 text-base font-semibold text-white">
            Asset Distribution
          </h3>
          <p className="mb-4 text-xs text-gray-500">By category</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={assetTypeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {assetTypeDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [`${v ?? 0}%`, "Share"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {assetTypeDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-400">{item.name}</span>
                </div>
                <span className="font-medium text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top assets table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="rounded-2xl border border-white/5 bg-gray-900/60 p-6"
      >
        <h3 className="mb-4 text-base font-semibold text-white">
          Top Performing Assets
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-xs text-gray-500">
                <th className="pb-3 font-medium">#</th>
                <th className="pb-3 font-medium">Asset</th>
                <th className="pb-3 font-medium">Growth</th>
                <th className="pb-3 font-medium">Volume</th>
                <th className="pb-3 font-medium">Investors</th>
              </tr>
            </thead>
            <tbody>
              {topAssets.map((a, i) => (
                <tr key={a.name} className="border-b border-white/5 last:border-0">
                  <td className="py-3 text-sm text-gray-500">{i + 1}</td>
                  <td className="py-3 text-sm font-medium text-white">{a.name}</td>
                  <td className="py-3 text-sm font-semibold text-emerald-400">{a.growth}</td>
                  <td className="py-3 text-sm text-gray-400">{a.volume}</td>
                  <td className="py-3 text-sm text-gray-400">{a.investors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
