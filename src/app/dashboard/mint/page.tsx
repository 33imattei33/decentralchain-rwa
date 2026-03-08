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
  Key,
  Radio,
  Copy,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  mintRwaToken,
  type MintResult,
  type MintStep,
} from "@/lib/mintService";
import { useWallet } from "@/hooks/useWallet";
import { isNodeReachable } from "@/lib/nodeApi";
import { DC_NODE_URL } from "@/lib/constants";

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
  seed: string;
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
  seed: "",
};

/* ── Helpers ── */
const fmt = (n: number) =>
  n.toLocaleString("en-US", { maximumFractionDigits: 2 });

export default function MintPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<MintForm>(INITIAL_FORM);
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);
  const [mintResult, setMintResult] = useState<MintResult | null>(null);
  const [mintStep, setMintStep] = useState<MintStep | null>(null);
  const [mintDetail, setMintDetail] = useState<string>("");
  const [nodeOnline, setNodeOnline] = useState<boolean | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const { address, publicKey, connect, isConnecting } = useWallet();

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

  /* Check node on step 4 */
  const checkNodeStatus = useCallback(async () => {
    const online = await isNodeReachable();
    setNodeOnline(online);
    return online;
  }, []);

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

  /** Copy text to clipboard with visual feedback */
  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  /** Real on-chain minting via @decentralchain/transactions SDK */
  const handleMint = async () => {
    setMinting(true);
    setMintStep(null);
    setMintDetail("");

    try {
      // Need either a seed or Keeper + publicKey
      if (!form.seed && !publicKey) {
        toast.error("Connect your wallet or enter a seed phrase to sign the transaction.");
        setMinting(false);
        return;
      }

      const result = await mintRwaToken(
        {
          name: form.title,
          description: form.description,
          totalFractions: fractions,
          decimals: 0,
          reissuable: false,
          kycRequired: form.kycRequired,
          accreditedOnly: form.accreditedOnly,
          ipfsHash: form.ipfsHash,
          category: form.category,
          location: form.location,
          totalValuation: valuation,
          yieldAPY,
          imageUrl: form.imageUrl || undefined,
          seed: form.seed || undefined,
          senderPublicKey: publicKey || undefined,
        },
        (stepName, detail) => {
          setMintStep(stepName);
          setMintDetail(detail ?? "");
        },
      );

      setMintResult(result);
      setMinted(true);
      toast.success(`RWA Token minted! Asset ID: ${result.assetId.slice(0, 8)}…`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Minting failed";
      toast.error(msg);
      setMintStep("error");
      setMintDetail(msg);
    } finally {
      setMinting(false);
    }
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

                  {/* Signing — seed phrase input or wallet connect */}
                  <Card title="Transaction Signing">
                    {address ? (
                      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <div className="text-xs">
                          <span className="text-gray-400">Connected: </span>
                          <span className="font-mono text-emerald-400">{address}</span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={connect}
                        disabled={isConnecting}
                        className="flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-2.5 text-xs font-medium text-cyan-400 transition hover:bg-cyan-500/10"
                      >
                        {isConnecting ? <Loader2 size={14} className="animate-spin" /> : <Key size={14} />}
                        Connect Keeper Wallet
                      </button>
                    )}

                    <div className="mt-4">
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-400">
                        <Key size={12} />
                        Seed Phrase (direct signing)
                      </label>
                      <input
                        type="password"
                        value={form.seed}
                        onChange={(e) => set("seed", e.target.value)}
                        placeholder="Enter 15-word seed phrase for server-side signing…"
                        className="w-full rounded-xl border border-white/5 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-cyan-500/40"
                      />
                      <p className="mt-1.5 text-[10px] text-gray-600">
                        The seed phrase is used locally to sign the Issue transaction via the SDK. It is never sent to any server.
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Mint action sidebar */}
                <div className="space-y-4">
                  {/* Node status */}
                  <Card title="Node Status">
                    <button
                      onClick={checkNodeStatus}
                      className="flex w-full items-center gap-2 rounded-xl border border-white/5 px-3 py-2.5 text-xs transition hover:bg-white/5"
                    >
                      <Radio size={14} className={nodeOnline === true ? "text-emerald-400" : nodeOnline === false ? "text-red-400" : "text-gray-500"} />
                      <span className={nodeOnline === true ? "text-emerald-400" : nodeOnline === false ? "text-red-400" : "text-gray-500"}>
                        {nodeOnline === true
                          ? "Node online"
                          : nodeOnline === false
                            ? "Node offline"
                            : "Check connection"}
                      </span>
                      <span className="ml-auto font-mono text-[10px] text-gray-600">{DC_NODE_URL}</span>
                    </button>
                  </Card>

                  <Card title="On-Chain Actions">
                    <div className="space-y-3 text-xs text-gray-400">
                      <ActionStep
                        n={1}
                        label="Compile RIDE v6 Smart Asset script"
                        active={mintStep === "compiling"}
                        done={mintStep !== null && mintStep !== "compiling" && mintStep !== "error"}
                      />
                      <ActionStep
                        n={2}
                        label="Issue fractional token (Type 3 tx)"
                        active={mintStep === "issuing"}
                        done={["confirming", "registering", "writing-metadata", "done"].includes(mintStep ?? "")}
                      />
                      <ActionStep
                        n={3}
                        label="Wait for block confirmation"
                        active={mintStep === "confirming"}
                        done={["registering", "writing-metadata", "done"].includes(mintStep ?? "")}
                      />
                      <ActionStep
                        n={4}
                        label="Register in marketplace dApp"
                        active={mintStep === "registering"}
                        done={["writing-metadata", "done"].includes(mintStep ?? "")}
                      />
                      <ActionStep
                        n={5}
                        label="Write on-chain metadata"
                        active={mintStep === "writing-metadata"}
                        done={mintStep === "done"}
                      />
                    </div>

                    {/* Progress detail */}
                    {minting && mintDetail && (
                      <div className="mt-3 rounded-lg border border-cyan-500/10 bg-cyan-500/5 p-2.5 text-[11px] text-cyan-300">
                        {mintDetail}
                      </div>
                    )}

                    {/* Error display */}
                    {mintStep === "error" && mintDetail && (
                      <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/5 p-2.5 text-[11px] text-red-400">
                        {mintDetail}
                      </div>
                    )}

                    <button
                      onClick={handleMint}
                      disabled={minting || (!form.seed && !publicKey)}
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
                          Mint RWA Token on DCC
                        </>
                      )}
                    </button>

                    {!form.seed && !publicKey && (
                      <p className="mt-2 flex items-center gap-1 text-center text-[10px] text-amber-400/80">
                        <AlertTriangle size={10} />
                        Enter a seed phrase or connect wallet to enable minting
                      </p>
                    )}

                    <p className="mt-3 text-center text-[10px] text-gray-600">
                      Gas: 1 DCC (Issue fee) · Settlement: CRS · Cashback: CR Coin
                    </p>
                  </Card>
                </div>
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
              {form.kycRequired ? "RIDE v6 Smart Asset with embedded KYC enforcement" : "Standard token without transfer restrictions"}
            </p>

            <div className="mb-6 rounded-xl border border-white/5 bg-gray-900/60 p-4 text-left">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500">Asset ID</span>
                  <button
                    onClick={() => mintResult && copyToClipboard(mintResult.assetId, "assetId")}
                    className="mt-0.5 flex items-center gap-1 font-mono text-cyan-400 hover:text-cyan-300 transition"
                  >
                    {mintResult
                      ? `${mintResult.assetId.slice(0, 6)}…${mintResult.assetId.slice(-4)}`
                      : "—"}
                    {copied === "assetId" ? <Check size={10} /> : <Copy size={10} />}
                  </button>
                </div>
                <div>
                  <span className="text-gray-500">Tx Hash</span>
                  <button
                    onClick={() => mintResult && copyToClipboard(mintResult.issueTxId, "txId")}
                    className="mt-0.5 flex items-center gap-1 font-mono text-cyan-400 hover:text-cyan-300 transition"
                  >
                    {mintResult
                      ? `${mintResult.issueTxId.slice(0, 6)}…${mintResult.issueTxId.slice(-4)}`
                      : "—"}
                    {copied === "txId" ? <Check size={10} /> : <Copy size={10} />}
                  </button>
                </div>
                <div>
                  <span className="text-gray-500">Block</span>
                  <p className="mt-0.5 font-medium text-white">
                    {mintResult?.blockHeight
                      ? `#${mintResult.blockHeight.toLocaleString()}`
                      : "Pending…"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Gas Paid</span>
                  <p className="mt-0.5 font-medium text-white">
                    {mintResult ? `${(mintResult.feePaid / 1e8).toFixed(3)} DCC` : "—"}
                  </p>
                </div>
                {mintResult?.dataTxId && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Metadata Tx</span>
                    <button
                      onClick={() => copyToClipboard(mintResult.dataTxId!, "dataTxId")}
                      className="mt-0.5 flex items-center gap-1 font-mono text-cyan-400 hover:text-cyan-300 transition"
                    >
                      {mintResult.dataTxId.slice(0, 10)}…{mintResult.dataTxId.slice(-6)}
                      {copied === "dataTxId" ? <Check size={10} /> : <Copy size={10} />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Explorer link */}
            {mintResult && (
              <a
                href={`${DC_NODE_URL}/transactions/info/${mintResult.issueTxId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-4 inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:underline"
              >
                View on Node API <ExternalLink size={12} />
              </a>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setMinted(false);
                  setMintResult(null);
                  setMintStep(null);
                  setMintDetail("");
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

function ActionStep({
  n,
  label,
  active,
  done,
}: {
  n: number;
  label: string;
  active?: boolean;
  done?: boolean;
}) {
  return (
    <div className={`flex items-start gap-3 transition ${active ? "text-white" : done ? "text-emerald-400/80" : "text-gray-500"}`}>
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition ${
          done
            ? "bg-emerald-500/20 text-emerald-400"
            : active
            ? "bg-cyan-500/20 text-cyan-400 animate-pulse"
            : "bg-cyan-500/10 text-cyan-400/50"
        }`}
      >
        {done ? <Check size={12} /> : n}
      </div>
      <span className="leading-relaxed">{label}</span>
      {active && (
        <div className="ml-auto">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        </div>
      )}
    </div>
  );
}
