"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PieChart,
  Shield,
  LineChart,
  Building2,
  Coins,
  Gavel,
  Bell,
  Search,
  ChevronLeft,
  Menu,
  User,
  Home,
  Leaf,
  Wallet,
  LogOut,
  Key,
  Plug,
  Copy,
  Check,
  ChevronDown,
  AlertCircle,
  Loader2,
  Usb,
  Hash,
} from "lucide-react";
import NodeStatusBadge from "@/components/dashboard/NodeStatusBadge";
import { useWalletContext } from "@/contexts/WalletContext";

const sidebarLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview", exact: true },
  { href: "/dashboard/portfolio", icon: PieChart, label: "Portfolio" },
  { href: "/dashboard/assets", icon: Building2, label: "Assets" },
  { href: "/dashboard/compliance", icon: Shield, label: "Compliance" },
  { href: "/dashboard/analytics", icon: LineChart, label: "Analytics" },
  { href: "/dashboard/mint", icon: Coins, label: "Mint", exact: true },
  { href: "/dashboard/auctions", icon: Gavel, label: "Auctions", exact: true },
];

function SidebarContent({
  collapsed,
  pathname,
  onNavigate,
}: {
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 py-5">
        <Leaf className="shrink-0 text-emerald-400" size={22} />
        {!collapsed && (
          <span className="text-lg font-bold text-white">
            RWA<span className="text-cyan-400">Market</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3">
        {sidebarLinks.map((link) => {
          const active = isActive(link.href, link.exact);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <link.icon size={18} />
              {!collapsed && link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/5 p-3">
        {!collapsed && <NodeStatusBadge className="mb-2" />}
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
        >
          <Home size={18} />
          {!collapsed && "Back to Home"}
        </Link>
      </div>
    </>
  );
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Desktop sidebar */}
      <aside
        className={`hidden flex-col border-r border-white/5 bg-gray-950 transition-all md:flex ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        <SidebarContent collapsed={collapsed} pathname={pathname} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-white/5 bg-gray-950 transition-transform md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent collapsed={false} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-white/5 bg-gray-950/80 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="text-gray-400 hover:text-white md:hidden"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="hidden text-gray-400 hover:text-white md:block"
            >
              <ChevronLeft
                size={18}
                className={`transition ${collapsed ? "rotate-180" : ""}`}
              />
            </button>

            {/* Search */}
            <div className="relative hidden sm:block">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search assets..."
                className="w-64 rounded-xl border border-white/5 bg-gray-900 py-2 pl-9 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500/40"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative text-gray-400 hover:text-white">
              <Bell size={18} />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-cyan-500" />
            </button>
            <WalletButton />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Wallet Connection Button — appears in the top bar
   Supports all DecentralChain Signer wallets
   ═══════════════════════════════════════════════════════════════ */
function WalletButton() {
  const {
    address,
    connectionMethod,
    isConnecting,
    error,
    hasDCW,
    hasCubensis,
    hasKeeper,
    connectDCW,
    connectCubensis,
    connectKeeper,
    connectSeed,
    connectAddress,
    disconnect,
    clearError,
  } = useWalletContext();

  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedOption, setExpandedOption] = useState<string | null>(null);
  const [seedValue, setSeedValue] = useState("");
  const [addressValue, setAddressValue] = useState("");
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setExpandedOption(null);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const copyAddr = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSeedConnect = async () => {
    await connectSeed(seedValue);
    setSeedValue("");
    setExpandedOption(null);
    setMenuOpen(false);
  };

  const handleAddressConnect = async () => {
    await connectAddress(addressValue);
    setAddressValue("");
    setExpandedOption(null);
    setMenuOpen(false);
  };

  const truncated = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  const methodLabel = connectionMethod
    ? ({
        dcw: "DCC Wallet",
        cubensis: "Cubensis",
        keeper: "Keeper",
        seed: "Seed",
        ledger: "Ledger",
        address: "Read-only",
        custom: "Custom",
      }[connectionMethod] ?? connectionMethod)
    : "";

  // ── Connected state ──
  if (address) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-sm transition hover:bg-cyan-500/20"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/30">
            <Wallet size={12} className="text-cyan-400" />
          </div>
          <span className="hidden text-cyan-300 sm:block">{truncated}</span>
          <ChevronDown
            size={14}
            className={`text-cyan-400 transition ${menuOpen ? "rotate-180" : ""}`}
          />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-gray-700/50 bg-gray-900 shadow-2xl shadow-black/40">
            <div className="border-b border-gray-700/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Connected Wallet
                </span>
                <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                  {methodLabel}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <code className="flex-1 truncate rounded bg-gray-800 px-2 py-1 text-xs text-cyan-300">
                  {address}
                </code>
                <button
                  onClick={copyAddr}
                  className="text-gray-500 transition hover:text-cyan-400"
                >
                  {copied ? (
                    <Check size={14} className="text-green-400" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>
            <div className="p-2">
              <button
                onClick={() => {
                  disconnect();
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-red-400"
              >
                <LogOut size={16} />
                Disconnect Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Disconnected state ──
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        disabled={isConnecting}
        className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:opacity-60"
      >
        {isConnecting ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Wallet size={14} />
        )}
        <span className="hidden sm:inline">
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </span>
      </button>

      {menuOpen && !isConnecting && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-gray-700/50 bg-gray-900 shadow-2xl shadow-black/40">
          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2 border-b border-gray-700/50 bg-red-500/10 p-3">
              <AlertCircle
                size={16}
                className="mt-0.5 shrink-0 text-red-400"
              />
              <p className="flex-1 text-xs text-red-300">
                {/* Render URLs inside the error as clickable links */}
                {error.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                  part.match(/^https?:\/\//) ? (
                    <a
                      key={i}
                      href={part}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-cyan-400 hover:text-cyan-300"
                    >
                      {part}
                    </a>
                  ) : (
                    <span key={i}>{part}</span>
                  ),
                )}
              </p>
              <button
                onClick={clearError}
                className="text-xs text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          )}

          <div className="p-3">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
              Connect with DecentralChain Wallet
            </p>

            {/* ── DecentralChainWallet Extension (PRIMARY) ── */}
            <WalletOption
              icon={<Wallet size={20} className="text-cyan-400" />}
              iconBg="bg-cyan-500/20"
              title="DCC Wallet"
              description={
                hasDCW
                  ? "DecentralChain Wallet extension"
                  : "Extension not detected — click to try"
              }
              badge={hasDCW ? "Detected" : "Recommended"}
              badgeColor={hasDCW ? "green" : "gray"}
              onClick={async () => {
                await connectDCW();
                setMenuOpen(false);
              }}
            />

            <div className="my-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-700/50" />
              <span className="text-xs text-gray-600">other wallets</span>
              <div className="h-px flex-1 bg-gray-700/50" />
            </div>

            {/* ── Cubensis Extension ── */}
            <WalletOption
              icon={<Plug size={20} className="text-purple-400" />}
              iconBg="bg-purple-500/20"
              title="Cubensis Wallet"
              description={
                hasCubensis
                  ? "Cubensis browser extension"
                  : "Extension not detected"
              }
              badge={hasCubensis ? "Detected" : undefined}
              badgeColor={hasCubensis ? "green" : undefined}
              onClick={async () => {
                await connectCubensis();
                setMenuOpen(false);
              }}
            />

            {/* ── DecentralChain Keeper ── */}
            <WalletOption
              icon={<Shield size={20} className="text-cyan-400" />}
              iconBg="bg-cyan-500/20"
              title="DCC Keeper"
              description={
                hasKeeper
                  ? "DecentralChain Keeper extension"
                  : "Extension not detected"
              }
              badge={hasKeeper ? "Detected" : undefined}
              badgeColor={hasKeeper ? "green" : undefined}
              onClick={async () => {
                await connectKeeper();
                setMenuOpen(false);
              }}
            />

            {/* ── Ledger Hardware Wallet ── */}
            <WalletOption
              icon={<Usb size={20} className="text-green-400" />}
              iconBg="bg-green-500/20"
              title="Ledger Hardware"
              description="Connect via USB (WebUSB)"
              badge="Coming Soon"
              disabled
              onClick={() => {}}
            />

            <div className="my-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-700/50" />
              <span className="text-xs text-gray-600">or</span>
              <div className="h-px flex-1 bg-gray-700/50" />
            </div>

            {/* ── Seed Phrase ── */}
            {expandedOption !== "seed" ? (
              <WalletOption
                icon={<Key size={20} className="text-amber-400" />}
                iconBg="bg-amber-500/20"
                title="Seed Phrase"
                description="Enter your 12-word seed phrase"
                onClick={() => setExpandedOption("seed")}
              />
            ) : (
              <div className="space-y-2 rounded-lg border border-gray-700/50 bg-gray-800/50 p-3">
                <div className="flex items-center gap-2 text-xs text-amber-400">
                  <Key size={12} />
                  <span className="font-medium">Seed Phrase</span>
                </div>
                <textarea
                  value={seedValue}
                  onChange={(e) => setSeedValue(e.target.value)}
                  placeholder="Enter your 12-word seed phrase..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-cyan-500"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setExpandedOption(null);
                      setSeedValue("");
                    }}
                    className="flex-1 rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSeedConnect}
                    disabled={!seedValue.trim()}
                    className="flex-1 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
                  >
                    Connect
                  </button>
                </div>
              </div>
            )}

            {/* ── Manual Address ── */}
            {expandedOption !== "address" ? (
              <WalletOption
                icon={<Hash size={20} className="text-gray-400" />}
                iconBg="bg-gray-500/20"
                title="Wallet Address"
                description="Paste address for read-only access"
                onClick={() => setExpandedOption("address")}
                className="mt-2"
              />
            ) : (
              <div className="mt-2 space-y-2 rounded-lg border border-gray-700/50 bg-gray-800/50 p-3">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Hash size={12} />
                  <span className="font-medium">Wallet Address (read-only)</span>
                </div>
                <input
                  type="text"
                  value={addressValue}
                  onChange={(e) => setAddressValue(e.target.value)}
                  placeholder="3D..."
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-cyan-500"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setExpandedOption(null);
                      setAddressValue("");
                    }}
                    className="flex-1 rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddressConnect}
                    disabled={!addressValue.trim()}
                    className="flex-1 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
                  >
                    Connect
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Reusable wallet option row */
function WalletOption({
  icon,
  iconBg,
  title,
  description,
  badge,
  badgeColor,
  disabled,
  onClick,
  className = "",
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: "green" | "gray";
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}) {
  const badgeCls =
    badgeColor === "green"
      ? "bg-green-500/20 text-green-400"
      : "bg-gray-700 text-gray-400";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-3 rounded-lg border border-gray-700/50 bg-gray-800/50 p-3 text-left transition hover:border-cyan-500/30 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-700/50 disabled:hover:bg-gray-800/50 ${className}`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-white">{title}</p>
          {badge && (
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${badgeCls}`}>
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </button>
  );
}
