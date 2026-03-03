"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gavel,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Flame,
  Clock,
  Zap,
  Users,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useCountdown } from "@/hooks/useCountdown";

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */

interface Bidder {
  address: string;
  amount: number;
  timestamp: string;
}

interface Auction {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  rwaAssetId: string;
  fractions: number;
  startingBid: number;
  currentBid: number;
  highestBidder: string;
  deadline: Date;
  bidHistory: Bidder[];
  totalBids: number;
  verified: boolean;
}

/* ═══════════════════════════════════════════════════════════════
   Mock data — replace with on-chain reads in production
   ═══════════════════════════════════════════════════════════════ */

const MOCK_AUCTIONS: Auction[] = [
  {
    id: "AUC_001",
    title: "Beachfront Lot — Jacó",
    location: "Jacó, Puntarenas, CR",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    rwaAssetId: "RWA_001_JACO",
    fractions: 500,
    startingBid: 1200,
    currentBid: 4850,
    highestBidder: "CR...7kQm",
    deadline: new Date(Date.now() + 2 * 86_400_000 + 3 * 3_600_000 + 27 * 60_000),
    bidHistory: [
      { address: "CR...7kQm", amount: 4850, timestamp: "12 min ago" },
      { address: "CR...9xF2", amount: 4600, timestamp: "45 min ago" },
      { address: "CR...3aLp", amount: 4200, timestamp: "2h ago" },
    ],
    totalBids: 18,
    verified: true,
  },
  {
    id: "AUC_002",
    title: "Boutique Suite — Nosara",
    location: "Nosara, Guanacaste, CR",
    imageUrl: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    rwaAssetId: "RWA_002_NOSARA",
    fractions: 200,
    startingBid: 3000,
    currentBid: 12400,
    highestBidder: "CR...4x92",
    deadline: new Date(Date.now() + 45 * 60_000 + 12_000), // ~45 min — close to Golden Minute
    bidHistory: [
      { address: "CR...4x92", amount: 12400, timestamp: "3 min ago" },
      { address: "CR...1bNq", amount: 11800, timestamp: "18 min ago" },
      { address: "CR...6cWz", amount: 10500, timestamp: "1h ago" },
    ],
    totalBids: 34,
    verified: true,
  },
  {
    id: "AUC_003",
    title: "Coffee Estate — Tarrazú",
    location: "Tarrazú, San José, CR",
    imageUrl: "https://images.unsplash.com/photo-1524813686514-a57563d77965?w=800&q=80",
    rwaAssetId: "RWA_003_TARRAZU",
    fractions: 1000,
    startingBid: 800,
    currentBid: 2340,
    highestBidder: "CR...2mYj",
    deadline: new Date(Date.now() + 5 * 86_400_000 + 11 * 3_600_000),
    bidHistory: [
      { address: "CR...2mYj", amount: 2340, timestamp: "1h ago" },
      { address: "CR...8pRk", amount: 2100, timestamp: "3h ago" },
      { address: "CR...5dVn", amount: 1900, timestamp: "6h ago" },
    ],
    totalBids: 11,
    verified: true,
  },
  {
    id: "AUC_004",
    title: "Escazú Penthouse",
    location: "Escazú, San José, CR",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    rwaAssetId: "RWA_004_ESCAZU",
    fractions: 300,
    startingBid: 5000,
    currentBid: 18750,
    highestBidder: "CR...9xF2",
    deadline: new Date(Date.now() + 12 * 3_600_000 + 55 * 60_000),
    bidHistory: [
      { address: "CR...9xF2", amount: 18750, timestamp: "5 min ago" },
      { address: "CR...7kQm", amount: 17800, timestamp: "22 min ago" },
      { address: "CR...3aLp", amount: 16500, timestamp: "1h ago" },
    ],
    totalBids: 27,
    verified: true,
  },
];

/* simulated user state */
const USER_ADDRESS = "CR...7kQm";
const USER_BALANCE = 24_500;
const CR_COIN_USD = 0.85; // mock CR Coin → USD rate

/* ═══════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════ */

export default function AuctionSection() {
  return (
    <div className="space-y-6">
      {/* react-hot-toast provider */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0f172a",
            color: "#e2e8f0",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            fontSize: "13px",
          },
        }}
      />

      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Auctions{" "}
            <span className="bg-gradient-to-r from-[#00FF9D] to-emerald-400 bg-clip-text text-transparent">
              LIVE
            </span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Bid on tokenized real-world assets with CR Coin on DecentralChain
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-[#00FF9D]/20 bg-[#00FF9D]/10 px-4 py-2 text-xs font-semibold text-[#00FF9D]">
            <Zap size={14} />
            Balance: {USER_BALANCE.toLocaleString()} CR Coin
          </div>
          <div className="rounded-full border border-white/5 bg-white/5 px-3 py-2 text-xs text-gray-400">
            ≈ ${(USER_BALANCE * CR_COIN_USD).toLocaleString()} USD
          </div>
        </div>
      </div>

      {/* Golden Minute explainer */}
      <div className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-3 text-xs text-amber-300/90">
        <Flame size={16} className="shrink-0 text-amber-400" />
        <span>
          <strong>Golden Minute:</strong> If someone bids in the last 60
          seconds, the clock automatically extends +60s. No last-second
          sniping bots.
        </span>
      </div>

      {/* Auction grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {MOCK_AUCTIONS.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Auction Card
   ═══════════════════════════════════════════════════════════════ */

function AuctionCard({ auction }: { auction: Auction }) {
  const { timeLeft, extendOnBid } = useCountdown(auction.deadline);
  const [bidInput, setBidInput] = useState("");
  const [placing, setPlacing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [localBid, setLocalBid] = useState(auction.currentBid);
  const [localHighest, setLocalHighest] = useState(auction.highestBidder);
  const [localHistory, setLocalHistory] = useState(auction.bidHistory);
  /**
   * `wasOutbid` is set when an external bidder overtakes the user.
   * In production this would be driven by a websocket / polling event.
   * Here we derive it: the user WAS highest bidder at load time but is
   * no longer after a simulated external event.
   */
  const [wasOutbid, setWasOutbid] = useState(false);

  const isHighestBidder = localHighest === USER_ADDRESS;
  const minBid = Math.ceil(localBid * 1.05);
  const bidAmount = parseFloat(bidInput) || 0;
  const bidValid = bidAmount >= minBid && bidAmount <= USER_BALANCE;
  const isGoldenZone = timeLeft.total > 0 && timeLeft.total < 60_000;

  /**
   * Helper: simulates an external bidder outbidding the user.
   * Called from an external event source (e.g. websocket callback).
   * Kept here for demo — in production, wire to chain event listener.
   */
  const simulateOutbid = useCallback(
    (newBidder: string, newAmount: number) => {
      const userWasHighest = localHighest === USER_ADDRESS;
      setLocalBid(newAmount);
      setLocalHighest(newBidder);
      setLocalHistory((prev) => [
        { address: newBidder, amount: newAmount, timestamp: "just now" },
        ...prev.slice(0, 2),
      ]);
      if (userWasHighest) {
        setWasOutbid(true);
        toast(
          (t) => (
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="shrink-0 text-amber-400" />
              <div>
                <p className="font-semibold text-white">
                  You&apos;ve been outbid!
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {auction.title} — Bid again now
                </p>
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="ml-2 rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-300"
              >
                View
              </button>
            </div>
          ),
          { duration: 6000 },
        );
      }
    },
    [localHighest, auction.title],
  );

  /* expose simulateOutbid for demo — unused var is intentional */
  void simulateOutbid;

  /* ── Place bid handler ── */
  const handlePlaceBid = useCallback(async () => {
    if (!bidValid || placing) return;
    setPlacing(true);

    // Golden Minute extension
    extendOnBid();

    // Simulate broadcast delay
    await new Promise((r) => setTimeout(r, 1800));

    // Update local state
    setLocalBid(bidAmount);
    setLocalHighest(USER_ADDRESS);
    setLocalHistory((prev) => [
      { address: USER_ADDRESS, amount: bidAmount, timestamp: "just now" },
      ...prev.slice(0, 2),
    ]);
    setBidInput("");
    setPlacing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);

    toast.success(`Bid of ${bidAmount.toLocaleString()} CR Coin confirmed`, {
      icon: "🔨",
    });
  }, [bidValid, bidAmount, placing, extendOnBid]);

  /* ── Border glow logic ── */
  const borderClass = isHighestBidder
    ? "border-emerald-500/40 shadow-[0_0_30px_-5px_rgba(16,185,129,0.25)]"
    : wasOutbid
      ? "border-amber-500/40 shadow-[0_0_30px_-5px_rgba(245,158,11,0.25)]"
      : "border-white/[0.06]";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`group relative overflow-hidden rounded-2xl border bg-white/5 backdrop-blur-lg transition-all duration-500 ${borderClass}`}
    >
      {/* ── Image ── */}
      <div className="relative h-48 overflow-hidden sm:h-56">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${auction.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Live badge */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-red-600/80 px-3 py-1 text-[10px] font-bold tracking-wider text-white backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-300 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
          </span>
          LIVE
        </div>

        {/* Verified location */}
        {auction.verified && (
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-slate-900/70 px-3 py-1 text-[10px] font-medium text-gray-300 backdrop-blur-sm">
            <MapPin size={10} className="text-[#00FF9D]" />
            {auction.location}
            <ShieldCheck size={10} className="text-[#00FF9D]" />
          </div>
        )}

        {/* Golden Minute badge */}
        <AnimatePresence>
          {isGoldenZone && !timeLeft.expired && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute left-3 top-12 flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-[10px] font-bold text-amber-300 backdrop-blur-sm"
            >
              <Flame size={12} className="animate-pulse" />
              GOLDEN MINUTE
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fractions / bids */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="rounded-lg bg-slate-900/70 px-2 py-1 text-[10px] font-medium text-gray-300 backdrop-blur-sm">
            {auction.fractions} fractions
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-slate-900/70 px-2 py-1 text-[10px] font-medium text-gray-300 backdrop-blur-sm">
            <Users size={10} /> {auction.totalBids} bids
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-5">
        {/* Title + timer */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className="text-base font-bold leading-tight text-white">
            {auction.title}
          </h3>
          <CountdownPills timeLeft={timeLeft} isGolden={isGoldenZone} />
        </div>

        {/* Current bid */}
        <div className="mb-4 rounded-xl border border-white/5 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                Current Bid
              </p>
              <p className="mt-1 text-2xl font-bold text-[#00FF9D]">
                {localBid.toLocaleString()}{" "}
                <span className="text-sm font-medium text-[#00FF9D]/60">
                  CR Coin
                </span>
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                ≈ ${(localBid * CR_COIN_USD).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                USD
              </p>
            </div>
            <div className="text-right">
              {isHighestBidder ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 size={14} />
                  You are the highest bidder
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <TrendingUp size={14} />
                  Bidder: {localHighest}
                </div>
              )}
              <p className="mt-1 text-[10px] text-gray-600">
                Min. next: {minBid.toLocaleString()} CR
              </p>
            </div>
          </div>
        </div>

        {/* Bid input */}
        {!timeLeft.expired && (
          <div className="mb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  value={bidInput}
                  onChange={(e) => setBidInput(e.target.value)}
                  placeholder={`Min. ${minBid.toLocaleString()} CR Coin`}
                  className="w-full rounded-xl border border-white/5 bg-slate-900 py-2.5 pl-4 pr-20 text-sm text-white placeholder-gray-600 outline-none focus:border-[#00FF9D]/40"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-500">
                  CR Coin
                </span>
              </div>
              <button
                onClick={handlePlaceBid}
                disabled={!bidValid || placing || timeLeft.expired}
                className="relative flex items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-[#00FF9D] to-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100"
              >
                <AnimatePresence mode="wait">
                  {placing ? (
                    <motion.span
                      key="spin"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <Loader2 size={14} className="animate-spin" />
                      Bidding…
                    </motion.span>
                  ) : showSuccess ? (
                    <motion.span
                      key="ok"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={14} />
                      Confirmed!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="bid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <Gavel size={14} />
                      Bid
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
            {/* Validation hint */}
            {bidInput && !bidValid && (
              <p className="mt-1.5 text-[10px] text-rose-400">
                {bidAmount < minBid
                  ? `Bid must be at least 5% higher (${minBid.toLocaleString()} CR Coin)`
                  : "Insufficient CR Coin balance"}
              </p>
            )}
          </div>
        )}

        {/* Expired state */}
        {timeLeft.expired && (
          <div className="mb-4 rounded-xl border border-white/5 bg-slate-900/60 p-3 text-center text-xs text-gray-400">
            <Clock size={14} className="mx-auto mb-1 text-gray-500" />
            Auction ended — {localHighest === USER_ADDRESS ? "You won!" : `Winner: ${localHighest}`}
          </div>
        )}

        {/* Bid history: social proof */}
        <div className="mb-3 space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Recent bids
          </p>
          {localHistory.map((b, i) => (
            <div
              key={`${b.address}-${i}`}
              className="flex items-center justify-between rounded-lg border border-white/[0.03] bg-white/[0.02] px-3 py-1.5 text-xs"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    i === 0 ? "bg-[#00FF9D]" : "bg-gray-600"
                  }`}
                />
                <span
                  className={`font-mono ${
                    b.address === USER_ADDRESS
                      ? "font-semibold text-[#00FF9D]"
                      : "text-gray-400"
                  }`}
                >
                  {b.address}
                  {b.address === USER_ADDRESS && " (you)"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-white">
                  {b.amount.toLocaleString()} CR
                </span>
                <span className="text-gray-600">{b.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Gas fee footer */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[10px] text-gray-600">
          <span className="flex items-center gap-1">
            <ShieldCheck size={10} />
            Transaction secured by DecentralChain
          </span>
          <span>Fee: 0.01 DCC</span>
        </div>
      </div>

      {/* Success overlay flash */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-[#00FF9D]/50"
            style={{
              boxShadow: "0 0 40px -5px rgba(0,255,157,0.3), inset 0 0 40px -10px rgba(0,255,157,0.1)",
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Countdown Pills
   ═══════════════════════════════════════════════════════════════ */

function CountdownPills({
  timeLeft,
  isGolden,
}: {
  timeLeft: { days: number; hours: number; minutes: number; seconds: number; expired: boolean };
  isGolden: boolean;
}) {
  if (timeLeft.expired)
    return (
      <span className="rounded-lg bg-gray-800 px-2 py-1 text-[10px] font-semibold text-gray-400">
        Ended
      </span>
    );

  const pills = [
    { val: timeLeft.days, label: "D" },
    { val: timeLeft.hours, label: "H" },
    { val: timeLeft.minutes, label: "M" },
    { val: timeLeft.seconds, label: "S" },
  ];

  return (
    <div className="flex shrink-0 items-center gap-1">
      {pills.map((p) => (
        <div
          key={p.label}
          className={`flex h-8 w-8 flex-col items-center justify-center rounded-lg text-center ${
            isGolden
              ? "bg-amber-500/10 text-amber-300"
              : "bg-slate-800/80 text-gray-300"
          }`}
        >
          <span className="text-xs font-bold leading-none">
            {String(p.val).padStart(2, "0")}
          </span>
          <span className="text-[8px] leading-none text-gray-500">
            {p.label}
          </span>
        </div>
      ))}
    </div>
  );
}
