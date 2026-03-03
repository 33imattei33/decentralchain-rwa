"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, BookOpen, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-cyan-700 to-emerald-900" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Ready to Invest in
            <br />
            the Real World?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-cyan-200 sm:text-xl">
            Join the premier platform for compliant real-world asset
            tokenization. Start investing in fractional ownership with as little
            as $10 in CRS.
          </p>

          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-cyan-700 shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl"
            >
              Launch Dashboard
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://github.com/33imattei33/foliochain"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/20 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10"
            >
              <Github className="h-5 w-5" />
              View on GitHub
            </a>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-cyan-300">
            <a
              href="#"
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <BookOpen className="h-4 w-4" />
              Documentation
            </a>
            <a
              href="#"
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <MessageCircle className="h-4 w-4" />
              Community
            </a>
            <a
              href="https://github.com/33imattei33/foliochain"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
