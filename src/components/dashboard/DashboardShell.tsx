"use client";

import { useState } from "react";
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
} from "lucide-react";

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
            <div className="flex items-center gap-2 rounded-xl border border-white/5 px-3 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/20">
                <User size={14} className="text-cyan-400" />
              </div>
              <span className="hidden text-sm text-gray-300 sm:block">
                Investor
              </span>
            </div>
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
