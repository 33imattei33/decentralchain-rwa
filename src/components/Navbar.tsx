"use client";

import { useState, useEffect } from "react";
import { Wallet, LogOut, Loader2, Leaf, LayoutDashboard } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import Link from "next/link";

const sections = [
  { label: "Features", href: "#features" },
  { label: "Architecture", href: "#architecture" },
  { label: "Performance", href: "#performance" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Explore", href: "#explore" },
];

export default function Navbar() {
  const { address, balances, isConnecting, connect, disconnect } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const shortAddr = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-gray-950/90 backdrop-blur-xl shadow-lg shadow-black/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="text-emerald-400" size={24} />
          <span className="text-lg font-bold tracking-tight text-white">
            RWA<span className="text-cyan-400">Market</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-5 md:flex">
          {sections.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="text-sm text-gray-400 transition hover:text-white"
            >
              {s.label}
            </a>
          ))}
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-3 py-1.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20"
          >
            <LayoutDashboard size={14} />
            Dashboard
          </Link>
        </div>

        {/* Wallet */}
        <div className="flex items-center gap-3">
          {address ? (
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-cyan-400 lg:inline-block">
                {balances.crs.toLocaleString()} CRS
              </span>
              <span className="hidden rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-emerald-400 lg:inline-block">
                {balances.dcc.toLocaleString()} DCC
              </span>
              <button
                onClick={disconnect}
                className="flex items-center gap-1.5 rounded-xl border border-gray-700 px-3 py-2 text-sm text-gray-300 transition hover:bg-gray-800"
              >
                <LogOut size={14} />
                {shortAddr}
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 px-4 py-2 text-sm font-bold text-gray-900 transition hover:brightness-110 disabled:opacity-60"
            >
              {isConnecting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Wallet size={16} />
              )}
              {isConnecting ? "Connecting…" : "Connect Wallet"}
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            className="ml-1 md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="sr-only">Menu</span>
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-white/5 px-4 pb-4 md:hidden">
          {sections.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="block py-2 text-sm text-gray-300 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {s.label}
            </a>
          ))}
          <Link
            href="/dashboard"
            className="mt-1 flex items-center gap-1.5 py-2 text-sm font-medium text-cyan-400"
            onClick={() => setMenuOpen(false)}
          >
            <LayoutDashboard size={14} />
            Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
}
