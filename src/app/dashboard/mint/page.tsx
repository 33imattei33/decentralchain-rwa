"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Shield,
  Coins,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Building2,
  MapPin,
  DollarSign,
  Hash,
  Percent,
  ImageIcon,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Sparkles,
} from "lucide-react";

/* ── RWA categories ── */
const CATEGORIES = [
  { value: "real-estate", label: "Real Estate", emoji: "🏢" },
  { value: "hospitality", label: "Hospitality", emoji: "🏨" },
  { value: "infrastructure", label: "Infrastructure", emoji: "⚡" },
  { value: "agriculture", label: "Agriculture", emoji: "🌾" },
  { value: "art", label: "Art & Collectibles", emoji: "🎨" },
  { value: "commodities", label: "Commodities", emoji: "💎" },
];

/* ── Step metadata ── */
const STEPS = [
  { id: 1, label: "Asset Details", icon: Building2 },
  { id: 2, label: "Tokenomics", icon: Coins },
  { id: 3, label: "Legal & Compliance", icon: FileText },
  { id: 4, label: "Review & Mint", icon: Shield },
];

/* ── Form state shape ── */
interface MintForm {
  title: string;
  description: string;
  category: string;
  location: string;
  imageUrl: string;
  totalValuation: string;
  totalFractions: string;
  pricePerFraction: string;
  yieldAPY: string;
  ipfsHash: string;
  kycRequired: boolean;
  accreditedOnly: boolean;
  acceptTerms: boolean;
}

const INITIAL_FORM: MintForm = {
  title: "",
  description: "",
  category: "",
  location: "",
  imageUrl: "",
  totalValuation: "",
  totalFractions: "",
  pricePerFraction: "",
  yieldAPY: "",
  ipfsHash: "",
  kycRequired: true,
  accreditedOnly: false,
  acceptTerms: false,
};

/* ── Helpers ── */
const fmt = (n: number) =>
  n.toLocaleString("en-US", { maximumFractionDigits: 2 });

export default function MintPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<MintForm>(INITIAL_FORM);
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);

  const set = useCallback(
    <K extends keyof MintForm>(key: K, value: MintForm[K]) =>
      setForm((f) => ({ ...f, [key]: value })),
    [],
  );

  /* derived values */
  const valuation = parseFloat(form.totalValuation) || 0;
  const fractions = parseInt(form.totalFractions) || 0;
  const pricePerFraction =
    fractions > 0 ? valuation / fractions : parseFloat(form.pricePerFraction) || 0;
  const yieldAPY = parseFloat(form.yieldAPY) || 0;
  const platformFee = valuation * 0.02;

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return !!(form.title && form.category && form.location && form.description);
      case 2:
        return valuation > 0 && fractions > 0;
      case 3:
        return !!(form.ipfsHash && form.acceptTerms);
      default:
        return true;
    }
  };

  const handleMint = async () => {
    setMinting(true);
    // Simulate on-chain tx
    await new Promise((r) => setTimeout(r, 2500));
    setMinting(false);
    setMinted(true);
  };

  /* ─────────────── Render ─────────────── */
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mint RWA Token</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tokenize a real-world asset on DecentralChain
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-400">
          <Sparkles size={14} />
          RIDE v6 Smart Asset
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => {
          const done = step > s.id;
          const active = step === s.id;
          return (
            <div key={s.id} className="flex items-center gap-2">
              <button
                onClick={() => done && setStep(s.id)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${
                  active
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                    : done
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-pointer"
                      : "text-gray-500 border border-white/5"
                }`}
              >
                {done ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <s.icon size={14} />
                )}
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{s.id}</span>
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight size={14} className="text-gray-600" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        {!minted ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* ── Step 1: Asset Details ── */}
            {step === 1 && (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                  <Card title="Basic Information">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Asset Title"
                        icon={Building2}
                        value={form.title}
                        onChange={(v) => set("title", v)}
                        placeholder="Luxury Hotel Suite – Miami Beach"
                      />
                      <Input
                        label="Physical Location"
                        icon={MapPin}
                        value={form.location}
                        onChange={(v) => set("location", v)}
                        placeholder="Miami Beach, FL, USA"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="mb-1.5 block text-xs font-medium text-gray-400">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={form.description}
                        onChange={(e) => set("description", e.target.value)}
                        placeholder="Describe the underlying asset, its location, condition, and investment thesis..."
                        className="w-full rounded-xl border border-white/5 bg-gray-900 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-cyan-500/40"
                      />
                    </div>
                    <div className="mt-4">
                      <Input
                        label="Image URL"
                        icon={ImageIcon}
                        value={form.imageUrl}
                        onChange={(v) => set("imageUrl", v)}
                        placeholder="https://... or ipfs://..."
                      />
                    </div>
                  </Card>
                </div>

                {/* Category picker */}
                <Card title="Asset Category">
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => set("category", cat.value)}
                        className={`rounded-xl border p-3 text-left transition ${
                          form.category === cat.value
                            ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                            : "border-white/5 text-gray-400 hover:border-white/10 hover:bg-white/5"
                        }`}
                      >
                        <span className="text-lg">{cat.emoji}</span>
                        <p className="mt-1 text-xs font-medium">{cat.label}</p>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* ── Step 2: Tokenomics ── */}
            {step === 2 && (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                  <Card title="Token Economics">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Total Valuation (USD)"
                        icon={DollarSign}
                        value={form.totalValuation}
                        onChange={(v) => set("totalValuation", v)}
                        placeholder="2,500,000"
                        type="number"
                      />
                      <Input
                        label="Total Fractions"
                        icon={Hash}
                        value={form.totalFractions}
                        onChange={(v) => set("totalFractions", v)}
                        placeholder="100,000"
                        type="number"
                      />
                      <Input
                        label="Expected Yield APY (%)"
                        icon={Percent}
                        value={form.yieldAPY}
                        onChange={(v) => set("yieldAPY", v)}
                        placeholder="8.4"
                        type="number"
                      />
                    </div>
                  </Card>
                </div>

                {/* Live preview */}
                <Card title="Token Preview">
                  <div className="space-y-3">
                    <PreviewRow
                      label="Price / Fraction"
                      value={`$${fmt(pricePerFraction)} CRS`}
                    />
                    <PreviewRow
                      label="Total Supply"
                      value={`${fractions.toLocaleString()} tokens`}
                    />
                    <PreviewRow
                      label="Expected Yield"
                      value={`${yieldAPY}% APY`}
                    />
                    <PreviewRow
                      label="Platform Fee (2%)"
                      value={`$${fmt(platformFee)} CRS`}
                    />
                    <div className="my-3 border-t border-white/5" />
                    <PreviewRow
                      label="Settlement"
                      value="CRS (USD-pegged)"
                      highlight
                    />
                    <PreviewRow
                      label="Gas Token"
                      value="DCC"
                      highlight
                    />
                    <PreviewRow
                      label="Cashback"
                      value="CR Coin"
                      highlight
                    />
                  </div>
                </Card>
              </div>
            )}

            {/* ── Step 3: Legal & Compliance ── */}
            {step === 3 && (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                  <Card title="Legal Documentation">
                    <Input
                      label="IPFS Document Hash"
                      icon={Upload}
                      value={form.ipfsHash}
                      onChange={(v) => set("ipfsHash", v)}
                      placeholder="QmXoypiz... (CID of legal compliance package)"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Upload your legal compliance package (deed, KYC policy,
                      audit report) to IPFS and paste the CID above.
                    </p>

                    <div className="mt-6 space-y-3">
                      <Toggle
                        label="Require KYC verification for all token holders"
                        description="Embeds a RIDE whitelist check in the Smart Asset script"
                        checked={form.kycRequired}
                        onChange={(v) => set("kycRequired", v)}
                      />
                      <Toggle
                        label="Accredited investors only"
                        description="Restricts to investors with verified accreditation status"
                        checked={form.accreditedOnly}
                        onChange={(v) => set("accreditedOnly", v)}
                      />
                    </div>
                  </Card>
                </div>

                <Card title="Compliance Summary">
                  <div className="space-y-3">
                    <ComplianceItem
                      label="KYC-Gated Transfers"
                      active={form.kycRequired}
                    />
                    <ComplianceItem
                      label="Accredited Only"
                      active={form.accreditedOnly}
                    />
                    <ComplianceItem
                      label="IPFS Legal Docs"
                      active={!!form.ipfsHash}
                    />
                    <ComplianceItem
                      label="RIDE v6 Script"
                      active
                    />
                    <ComplianceItem
                      label="On-Chain Audit Trail"
                      active
                    />
                  </div>

                  <div className="mt-6 border-t border-white/5 pt-4">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={form.acceptTerms}
                        onChange={(e) => set("acceptTerms", e.target.checked)}
                        className="mt-0.5 h-4 w-4 accent-cyan-500"
                      />
                      <span className="text-xs text-gray-400">
                        I confirm this asset has proper legal documentation and I
                        am authorized to tokenize it on DecentralChain.
                      </span>
                    </label>
                  </div>
                </Card>
              </div>
            )}

            {/* ── Step 4: Review & Mint ── */}
            {step === 4 && (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                  <Card title="Review Summary">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <ReviewField label="Title" value={form.title} />
                      <ReviewField
                        label="Category"
                        value={
                          CATEGORIES.find((c) => c.value === form.category)
                            ?.label ?? "—"
                        }
                      />
                      <ReviewField label="Location" value={form.location} />
                      <ReviewField
                        label="Valuation"
                        value={`$${fmt(valuation)}`}
                      />
                      <ReviewField
                        label="Total Fractions"
                        value={fractions.toLocaleString()}
                      />
                      <ReviewField
                        label="Price / Fraction"
                        value={`$${fmt(pricePerFraction)} CRS`}
                      />
                      <ReviewField
                        label="Yield APY"
                        value={`${yieldAPY}%`}
                      />
                      <ReviewField
                        label="Platform Fee"
                        value={`$${fmt(platformFee)} CRS (2%)`}
                      />
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <ReviewField
                        label="IPFS Legal Hash"
                        value={
                          form.ipfsHash.length > 20
                            ? form.ipfsHash.slice(0, 10) +
                              "..." +
                              form.ipfsHash.slice(-10)
                            : form.ipfsHash || "—"
                        }
                      />
                      <ReviewField
                        label="Compliance"
                        value={[
                          form.kycRequired && "KYC",
                          form.accreditedOnly && "Accredited",
                          "RIDE v6",
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      />
                    </div>
                  </Card>

                  {/* Description preview */}
                  <Card title="Description">
                    <p className="text-sm leading-relaxed text-gray-400">
                      {form.description || "No description provided."}
                    </p>
                  </Card>
                </div>

                {/* Mint action sidebar */}
                <Card title="On-Chain Actions">
                  <div className="space-y-3 text-xs text-gray-400">
                    <ActionStep
                      n={1}
                      label="Issue Smart Asset via RIDE v6 script"
                    />
                    <ActionStep
                      n={2}
                      label="Attach KYC whitelist enforcement"
                    />
                    <ActionStep
                      n={3}
                      label="Register in marketplace dApp"
                    />
                    <ActionStep
                      n={4}
                      label="Pin metadata to IPFS reference"
                    />
                    <ActionStep
                      n={5}
                      label="Open fractions for investment"
                    />
                  </div>

                  <button
                    onClick={handleMint}
                    disabled={minting}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 py-3 text-sm font-bold text-gray-900 transition hover:brightness-110 disabled:opacity-60"
                  >
                    {minting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Broadcasting…
                      </>
                    ) : (
                      <>
                        <Coins size={16} />
                        Mint RWA Token
                      </>
                    )}
                  </button>

                  <p className="mt-3 text-center text-[10px] text-gray-600">
                    Gas paid in DCC · Settlement in CRS · Cashback in CR Coin
                  </p>
                </Card>
              </div>
            )}
          </motion.div>
        ) : (
          /* ── Success state ── */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-lg rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">
              RWA Token Minted!
            </h2>
            <p className="mb-1 text-sm text-gray-400">
              <span className="font-medium text-white">{form.title}</span> has
              been tokenized into{" "}
              <span className="text-cyan-400">
                {fractions.toLocaleString()} fractions
              </span>{" "}
              on DecentralChain.
            </p>
            <p className="mb-6 text-xs text-gray-500">
              RIDE v6 Smart Asset with embedded KYC enforcement
            </p>

            <div className="mb-6 rounded-xl border border-white/5 bg-gray-900/60 p-4 text-left">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500">Asset ID</span>
                  <p className="mt-0.5 font-mono text-cyan-400">
                    3PA...x9Qm
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Tx Hash</span>
                  <p className="mt-0.5 font-mono text-cyan-400">
                    7Hk...mW2f
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Block</span>
                  <p className="mt-0.5 font-medium text-white">#2,847,293</p>
                </div>
                <div>
                  <span className="text-gray-500">Gas Paid</span>
                  <p className="mt-0.5 font-medium text-white">0.005 DCC</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setMinted(false);
                  setStep(1);
                  setForm(INITIAL_FORM);
                }}
                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5"
              >
                Mint Another
              </button>
              <a
                href="/dashboard/assets"
                className="flex items-center gap-1.5 rounded-xl bg-cyan-500/10 px-5 py-2.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20"
              >
                View Assets <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      {!minted && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-white/5 disabled:opacity-30"
          >
            <ChevronLeft size={16} /> Back
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-500/10 px-5 py-2.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-30"
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   Sub-components (file-scoped)
   ══════════════════════════════════════════ */

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-gray-900/60 p-6">
      <h3 className="mb-4 text-sm font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
}

function Input({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-400">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/5 bg-gray-900 py-2.5 pl-9 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-cyan-500/40"
        />
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/5 p-4 transition hover:bg-white/5">
      <div className="relative mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className="h-5 w-9 rounded-full bg-gray-700 transition peer-checked:bg-cyan-500" />
        <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
      </div>
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
    </label>
  );
}

function PreviewRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-500">{label}</span>
      <span
        className={
          highlight ? "font-semibold text-cyan-400" : "font-medium text-white"
        }
      >
        {value}
      </span>
    </div>
  );
}

function ComplianceItem({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {active ? (
        <CheckCircle2 size={14} className="text-emerald-400" />
      ) : (
        <AlertTriangle size={14} className="text-gray-600" />
      )}
      <span className={active ? "text-gray-300" : "text-gray-600"}>
        {label}
      </span>
    </div>
  );
}

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 p-3">
      <div className="text-[10px] font-medium text-gray-500">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-white">{value}</div>
    </div>
  );
}

function ActionStep({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-[10px] font-bold text-cyan-400">
        {n}
      </div>
      <span className="leading-relaxed">{label}</span>
    </div>
  );
}
