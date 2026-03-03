"use client";

import { motion } from "framer-motion";
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileCheck,
  User,
  Globe2,
  Lock,
  XCircle,
} from "lucide-react";

const complianceItems = [
  {
    label: "KYC Verification",
    status: "verified",
    icon: User,
    detail: "Identity verified via DecentralChain Keeper",
    date: "Jan 15, 2026",
  },
  {
    label: "AML Screening",
    status: "verified",
    icon: Shield,
    detail: "Clean screening – OFAC/PEP check passed",
    date: "Jan 15, 2026",
  },
  {
    label: "Investor Accreditation",
    status: "verified",
    icon: FileCheck,
    detail: "Qualified investor status confirmed",
    date: "Dec 20, 2025",
  },
  {
    label: "Wallet Verification",
    status: "verified",
    icon: Lock,
    detail: "DecentralChain address linked & verified",
    date: "Jan 10, 2026",
  },
  {
    label: "Jurisdiction Check",
    status: "verified",
    icon: Globe2,
    detail: "Permitted jurisdiction confirmed",
    date: "Feb 10, 2026",
  },
  {
    label: "Tax Documentation",
    status: "pending",
    icon: FileCheck,
    detail: "Annual tax filing due Mar 31",
    date: "Due: Mar 31, 2026",
  },
  {
    label: "Whitelist Status",
    status: "verified",
    icon: CheckCircle2,
    detail: "On-chain kyc_ entry active for all RWA assets",
    date: "Feb 1, 2026",
  },
  {
    label: "Annual Re-Verification",
    status: "pending",
    icon: Clock,
    detail: "Scheduled for Q2 2026",
    date: "Due: Jun 30, 2026",
  },
];

const statusConfig: Record<
  string,
  {
    color: string;
    bg: string;
    border: string;
    icon: typeof CheckCircle2;
    label: string;
  }
> = {
  verified: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: CheckCircle2,
    label: "Verified",
  },
  pending: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: AlertTriangle,
    label: "Pending",
  },
  failed: {
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    icon: XCircle,
    label: "Failed",
  },
};

const auditLog = [
  {
    action: "KYC re-verified for wallet 3PAx...k9Qm",
    time: "2 hours ago",
    type: "success",
  },
  {
    action: "AML screening auto-refresh completed",
    time: "1 day ago",
    type: "success",
  },
  {
    action: "Tax filing reminder sent",
    time: "3 days ago",
    type: "warning",
  },
  {
    action: "Whitelist entry added for RWA_005_ART",
    time: "1 week ago",
    type: "success",
  },
];

export default function Compliance() {
  const verified = complianceItems.filter(
    (i) => i.status === "verified"
  ).length;
  const total = complianceItems.length;
  const score = Math.round((verified / total) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Compliance Center</h1>
        <p className="mt-1 text-sm text-gray-500">
          Regulatory status and KYC verification for DecentralChain RWA
          marketplace.
        </p>
      </div>

      {/* Score + audit */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl bg-gradient-to-br from-cyan-600 to-emerald-700 p-6 text-white"
        >
          <div className="mb-4 flex items-center justify-between">
            <Shield size={32} className="text-cyan-200" />
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
              Updated 2h ago
            </span>
          </div>
          <div className="mb-1 text-5xl font-bold">{score}%</div>
          <div className="text-sm text-cyan-200">Compliance Score</div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-cyan-200">
            {verified} of {total} checks verified
          </div>
        </motion.div>

        {/* Audit log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl border border-white/5 bg-gray-900/60 p-6 lg:col-span-2"
        >
          <h3 className="mb-4 text-base font-semibold text-white">
            Audit Log
          </h3>
          <div className="space-y-3">
            {auditLog.map((entry, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-white/5 p-3"
              >
                <div
                  className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                    entry.type === "success" ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                />
                <div className="flex-1">
                  <div className="text-sm text-gray-300">{entry.action}</div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={10} /> {entry.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Compliance items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl border border-white/5 bg-gray-900/60 p-6"
      >
        <h3 className="mb-4 text-base font-semibold text-white">
          Verification Status
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {complianceItems.map((item, i) => {
            const cfg = statusConfig[item.status];
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.04 }}
                className={`flex items-center gap-3 rounded-xl border ${cfg.border} ${cfg.bg} p-4`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900/40">
                  <item.icon className={`h-5 w-5 ${cfg.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-white">
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500">{item.detail}</div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <cfg.icon className={`h-4 w-4 ${cfg.color}`} />
                  <span className={`text-xs font-semibold ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
