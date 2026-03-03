import Link from "next/link";
import { Leaf } from "lucide-react";

const footerLinks: Record<string, { label: string; href: string; external?: boolean }[]> = {
  Protocol: [
    { label: "Features", href: "#features" },
    { label: "Architecture", href: "#architecture" },
    { label: "Performance", href: "#performance" },
    { label: "Ecosystem", href: "#ecosystem" },
  ],
  Resources: [
    { label: "Documentation", href: "#", external: false },
    { label: "GitHub", href: "https://github.com/33imattei33/foliochain", external: true },
    { label: "DecentralChain Docs", href: "#", external: false },
    { label: "RIDE Language", href: "#", external: false },
  ],
  Legal: [
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Compliance", href: "#" },
    { label: "Disclaimer", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-gray-950 py-16 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Leaf className="text-emerald-400" size={22} />
              <span className="text-lg font-bold text-white">
                RWA<span className="text-cyan-400">Market</span>
              </span>
            </div>
            <p className="mb-6 max-w-sm text-sm leading-relaxed">
              The premier real-world asset tokenization platform on
              DecentralChain. Transparent, compliant, and accessible
              investment for everyone.
            </p>
            <p className="text-xs text-gray-600">
              Powered by DecentralChain &bull; Carbon-Neutral Infrastructure
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold text-white">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm transition-colors hover:text-cyan-400"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm transition-colors hover:text-cyan-400"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} RWA Marketplace. MIT License.
          </p>
          <p className="text-xs text-gray-600">
            Built on DecentralChain &bull; CRS Settlement &bull; DCC Gas
          </p>
        </div>
      </div>
    </footer>
  );
}
