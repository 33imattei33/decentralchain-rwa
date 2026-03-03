import MarketplaceGrid from "@/components/MarketplaceGrid";
import Features from "@/components/landing/Features";
import Architecture from "@/components/landing/Architecture";
import Performance from "@/components/landing/Performance";
import Ecosystem from "@/components/landing/Ecosystem";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-20 text-center">
        {/* Decorative gradient blob */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        <h1 className="relative mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          Own the{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Real World
          </span>
          , On-Chain
        </h1>
        <p className="relative mx-auto mt-4 max-w-xl text-lg text-gray-400">
          Fractional ownership of premium real-world assets — hotels, offices,
          solar farms &amp; more. Settled in CRS. Powered by DecentralChain.
        </p>
        <div className="relative mt-8 flex items-center justify-center gap-4">
          <a
            href="#explore"
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 px-6 py-3 text-sm font-bold text-gray-900 transition hover:brightness-110"
          >
            Start Investing
          </a>
          <a
            href="#features"
            className="rounded-xl border border-gray-700 px-6 py-3 text-sm font-medium text-gray-300 transition hover:bg-gray-800"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-white/5 bg-gray-900/50">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-4 py-8 text-center sm:grid-cols-4 sm:px-6">
          {[
            { label: "Total Value Locked", value: "$30.1M" },
            { label: "Assets Listed", value: "5" },
            { label: "Block Time", value: "~5 s" },
            { label: "Avg Gas Fee", value: "<$0.01" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <Features />

      {/* Architecture */}
      <Architecture />

      {/* Performance */}
      <Performance />

      {/* Ecosystem */}
      <Ecosystem />

      {/* Marketplace grid */}
      <div id="explore">
        <MarketplaceGrid />
      </div>

      {/* CTA */}
      <CTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}
