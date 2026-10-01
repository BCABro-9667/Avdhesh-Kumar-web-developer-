import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  Coffee,
  Heart,
  Sparkles,
  Trophy,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  RefreshCw,
  Send,
  Lock,
  ExternalLink,
  Crown,
  Smile,
  XCircle,
} from "lucide-react";
import { MagneticButton } from "../components/MagneticButton";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { ChaiSupportersSkeleton } from "../components/Skeleton";

export interface Supporter {
  _id?: string;
  supporterName: string;
  message: string;
  amount: number;
  avatar: string;
  merchantTransactionId: string;
  phonepeTransactionId?: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  createdAt: string;
}

interface BuyMeAChaiPageProps {
  onNavigate: (page: string) => void;
}

// Preset Amounts in INR
const PRESET_AMOUNTS = [
  { amount: 10, label: "1 Chai ☕", detail: "Quick cutting chai" },
  { amount: 20, label: "2 Chais ☕☕", detail: "Double energy boost" },
  { amount: 50, label: "Masala Chai 🫖", detail: "With bun maska" },
  { amount: 100, label: "Chai & Samosa 🥟", detail: "Full hacker fuel" },
];

// 6 Illustrated Avatar Options
const AVATAR_OPTIONS = [
  { id: "chai-cup", label: "Cutting Chai", emoji: "☕", bg: "bg-[#FFF4E5] border-[#F59E0B]" },
  { id: "chess-knight", label: "Chess Knight", emoji: "♞", bg: "bg-[#E8E5F7] border-[#7C3AED]" },
  { id: "dev-rocket", label: "Launch Rocket", emoji: "🚀", bg: "bg-[#E0F2FE] border-[#0284C7]" },
  { id: "code-ninja", label: "Code Terminal", emoji: "⚡", bg: "bg-[#DCFCE7] border-[#16A34A]" },
  { id: "heart-gem", label: "Kind Heart", emoji: "💖", bg: "bg-[#FCE7F3] border-[#DB2777]" },
  { id: "golden-star", label: "Super Star", emoji: "⭐", bg: "bg-[#FEF08A] border-[#CA8A04]" },
];

// Helper to dynamically load Razorpay SDK on-demand
const loadRazorpaySDK = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof (window as any).Razorpay !== "undefined") {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const BuyMeAChaiPage: React.FC<BuyMeAChaiPageProps> = ({ onNavigate }) => {
  // Form State - 20 rupees active always by default and autofilled
  const [selectedAmount, setSelectedAmount] = useState<number>(20);
  const [customAmountInput, setCustomAmountInput] = useState<string>("20");
  const [name, setName] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [selectedAvatar, setSelectedAvatar] = useState<string>("chai-cup");

  // Interaction & Gateway State
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingSupporters, setFetchingSupporters] = useState<boolean>(true);
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [stats, setStats] = useState<{ totalSupporters: number; totalAmount: number; topSupporter: Supporter | null }>({
    totalSupporters: 0,
    totalAmount: 0,
    topSupporter: null,
  });

  // Result & Modal States
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "loading" | "success" | "failed" | "cancelled">("idle");
  const [activeTxId, setActiveTxId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [simulatorModal, setSimulatorModal] = useState<{ open: boolean; txId: string; amount: number; name: string } | null>(null);

  // Fetch Supporters from MongoDB
  const loadSupporters = async () => {
    try {
      setFetchingSupporters(true);
      const res = await fetch("/api/donations/supporters");
      if (res.ok) {
        const data = await res.json();
        setSupporters(data.supporters || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to load supporters:", err);
    } finally {
      setFetchingSupporters(false);
    }
  };

  useEffect(() => {
    loadSupporters();

    // Check URL parameters for status upon return from gateway
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    const urlStatus = params.get("status");
    const txId = params.get("txId");
    const isSim = params.get("simulator") === "true";

    if (isSim && txId) {
      const amount = Number(params.get("amount") || 50);
      const donorName = params.get("name") || "Supporter";
      setSimulatorModal({ open: true, txId, amount, name: donorName });
    } else if (urlStatus === "success" && txId) {
      setActiveTxId(txId);
      setPaymentStatus("success");
      verifyTransaction(txId);
    } else if (urlStatus === "failed") {
      setPaymentStatus("failed");
      setErrorMessage(params.get("error") || "Payment could not be completed.");
    } else if (urlStatus === "pending" && txId) {
      verifyTransaction(txId);
    }
  }, []);

  const verifyTransaction = async (txId: string) => {
    try {
      const res = await fetch(`/api/donations/verify/${txId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === "COMPLETED") {
          setPaymentStatus("success");
          loadSupporters();
        } else if (data.status === "FAILED") {
          setPaymentStatus("failed");
          setErrorMessage("PhonePe transaction marked as failed or cancelled.");
        }
      }
    } catch (err) {
      console.error("Verification poll error:", err);
    }
  };

  // Trigger confetti and handle success
  useEffect(() => {
    if (paymentStatus === "success") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4F050", "#141413", "#7C3AED", "#0284C7", "#16A34A"],
      });
    }
  }, [paymentStatus]);
  const handleSelectPreset = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmountInput(amount.toString());
  };

  // Handle Custom Amount Input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmountInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setSelectedAmount(num);
    } else if (val === "") {
      setSelectedAmount(0);
    }
  };

  // Handle Razorpay Donation Submission
  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAmount < 1) {
      setErrorMessage("Please enter an amount of at least ₹1.");
      return;
    }

    setLoading(true);
    setPaymentStatus("loading");
    setErrorMessage("");

    try {
      const supporterName = isAnonymous ? "Anonymous" : (name.trim() || "Supporter");
      const cheerMessage = message.trim() || "Keep building awesome open-source stuff! ☕";

      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supporterName,
          message: cheerMessage,
          amount: selectedAmount,
          avatar: selectedAvatar,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create Razorpay order");
      }

      setActiveTxId(data.merchantTransactionId);

      // Dynamically ensure Razorpay SDK is loaded
      await loadRazorpaySDK();

      if (typeof (window as any).Razorpay !== "undefined") {
        const options = {
          key: data.keyId || "rzp_test_TfKwgALCzFrTl9",
          amount: data.amount,
          currency: data.currency,
          name: "Avdhesh Kumar Portfolio",
          description: "Buy Me a Chai Donation",
          order_id: data.orderId,
          prefill: {
            name: supporterName,
            email: "supporter@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#D4F050",
          },
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch("/api/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                setPaymentStatus("success");
                await loadSupporters();
              } else {
                throw new Error(verifyData.error || "Payment verification failed.");
              }
            } catch (err: any) {
              setErrorMessage(err.message);
              setPaymentStatus("failed");
            } finally {
              setLoading(false);
            }
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              setPaymentStatus("cancelled");
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Fallback to test simulation modal if external script blocked
        setSimulatorModal({
          open: true,
          txId: data.merchantTransactionId,
          amount: selectedAmount,
          name: supporterName,
        });
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Razorpay initiation error:", err);
      setLoading(false);
      setPaymentStatus("failed");
      setErrorMessage(err.message || "An unexpected error occurred while connecting to Razorpay.");
    }
  };

  // Handle Simulator Success (Instant Verification for Testing)
  const handleSimulatePayment = async (status: "success" | "failed") => {
    if (!simulatorModal?.txId) return;
    setLoading(true);

    if (status === "failed") {
      setSimulatorModal(null);
      setLoading(false);
      setPaymentStatus("cancelled");
      return;
    }

    try {
      const res = await fetch("/api/donations/simulate-success", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txId: simulatorModal.txId }),
      });

      if (res.ok) {
        setSimulatorModal(null);
        setPaymentStatus("success");
        await loadSupporters();
      } else {
        throw new Error("Failed to verify simulated payment.");
      }
    } catch (err: any) {
      setErrorMessage(err.message);
      setPaymentStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  const getAvatarBadge = (avatarId: string) => {
    const found = AVATAR_OPTIONS.find((a) => a.id === avatarId);
    return found || AVATAR_OPTIONS[0];
  };

  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-24 bg-transparent text-[#141413]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =========================================================================
            TOP SECTION: Profile, Name, Chai Line & Live Metrics
           ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          {/* Illustrated Profile / Steaming Chai Cup Avatar */}
          <div className="relative inline-block mb-6">
            {/* Animated Glow Halo */}
            <div className="absolute -inset-2 rounded-full bg-[#D4F050] blur-md opacity-40 animate-pulse" />

            {/* Profile Avatar Frame with Neo-Brutalist Border */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#FAF8F2] border-3 border-[#141413] shadow-[4px_4px_0px_#141413] overflow-hidden p-1">
              <img
                src="/avdhesh-kumar.png"
                alt="Avdhesh Kumar"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Steaming Chai Badge Overlay */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
              className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-[#D4F050] text-[#141413] border-2 border-[#141413] shadow-[2px_2px_0px_#141413] flex items-center justify-center text-lg cursor-pointer"
              title="Hot Cutting Chai"
            >
              ☕
            </motion.div>
          </div>

          {/* User Tag & Name */}
        

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-[#141413] tracking-tight leading-tight mb-4">
            Buy Me a Chai <span className="inline-block text-[#7A9A00]">☕</span>
          </h1>

          <p className="font-display font-medium text-lg sm:text-xl text-[#141413] mb-3">
            “Support my work with a chai”
          </p>

         

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-lg mx-auto">
            <div className="p-3 rounded-2xl bg-[#FAF8F2] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] text-center">
              <div className="font-mono text-[10px] uppercase text-[#6B6862] font-semibold">Total Chais</div>
              <div className="font-display text-xl sm:text-2xl font-bold text-[#141413] mt-0.5">
                {stats.totalSupporters > 0 ? stats.totalSupporters : 0} ☕
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF8F2] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] text-center">
              <div className="font-mono text-[10px] uppercase text-[#6B6862] font-semibold">Community Raised</div>
              <div className="font-display text-xl sm:text-2xl font-bold text-[#141413] mt-0.5">
                ₹{stats.totalAmount > 0 ? stats.totalAmount : 0}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF8F2] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] text-center">
              <div className="font-mono text-[10px] uppercase text-[#6B6862] font-semibold">Top Supporter</div>
              <div className="font-display text-xs sm:text-sm font-bold text-[#141413] mt-1.5 truncate">
                {stats.topSupporter ? stats.topSupporter.supporterName : "Claim #1"}
              </div>
            </div>
          </div>
        </motion.div>

        {/* =========================================================================
            TWO-COLUMN RESPONSIVE LAYOUT
            Left: Top Supporters (MongoDB Dynamic)
            Right: Donate Now (PhonePe Form & States)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* =======================================================================
              LEFT COLUMN: TOP SUPPORTERS (lg:col-span-6)
             ======================================================================= */}
          <div className="lg:col-span-6 lg:order-1 order-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#141413] text-[#D4F050] flex items-center justify-center font-bold text-sm shadow-[2px_2px_0px_#141413]">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#141413] leading-none">
                    Supporters
                  </h2>
                 
                </div>
              </div>

              <button
                onClick={loadSupporters}
                disabled={fetchingSupporters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F2] hover:bg-[#141413] hover:text-[#D4F050] border border-[#141413]/20 font-mono text-xs transition-colors cursor-pointer"
                title="Refresh Supporters"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${fetchingSupporters ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            {/* Supporter Cards List / Skeleton */}
            {fetchingSupporters ? (
              <ChaiSupportersSkeleton count={3} />
            ) : supporters.length === 0 ? (
              /* Clean Empty State as explicitly requested */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-10 sm:p-14 rounded-3xl bg-[#FAF8F2] border-2 border-dashed border-[#141413]/30 text-center space-y-4 shadow-[4px_4px_0px_#141413]"
              >
                <div className="w-16 h-16 rounded-full bg-[#D4F050]/40 border-2 border-[#141413] flex items-center justify-center text-3xl mx-auto shadow-[2px_2px_0px_#141413]">
                  ☕
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display font-bold text-xl text-[#141413]">
                    No supporters yet
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#6B6862] max-w-sm mx-auto leading-relaxed">
                    Be the very first patron to buy a chai! Your name and cheer message will be permanently honored as the founding supporter right here.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      const input = document.getElementById("supporter-name-input");
                      input?.focus();
                    }}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#141413] text-[#F5F2EA] font-mono text-xs uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-colors border border-[#141413] cursor-pointer"
                  >
                    <span>Claim #1 Supporter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Supporter Cards List with Touch Scroll & Neo-Brutalist Scrollbar */
              <div
                className="space-y-3 max-h-[580px] lg:max-h-[660px] overflow-y-auto overscroll-contain pr-1.5 -mr-1.5 touch-pan-y [scrollbar-width:thin] [scrollbar-color:#141413_#FAF8F2] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#FAF8F2] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#141413] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-[#FAF8F2] hover:[&::-webkit-scrollbar-thumb]:bg-[#D4F050]"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {(() => {
                  const maxAmount = Math.max(0, ...supporters.map((s) => s.amount || 0));
                  return supporters.map((supporter, idx) => {
                    const isTopSupporter = supporter.amount === maxAmount && maxAmount > 0;
                    const avatarInfo = getAvatarBadge(supporter.avatar);

                    return (
                      <motion.div
                        key={supporter._id || supporter.merchantTransactionId || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.2) }}
                        className={`rounded-2xl border-2 border-[#141413] p-3.5 sm:p-4 transition-all duration-200 relative ${
                          isTopSupporter
                            ? "bg-[#D4F050]/20 shadow-[4px_4px_0px_#141413] mt-2.5"
                            : "bg-[#FAF8F2] shadow-[3px_3px_0px_#141413] hover:shadow-[4px_4px_0px_#141413] hover:-translate-y-0.5"
                        }`}
                      >
                        {/* Highlight Badge for #1 Top Supporter by Highest Amount */}
                        {isTopSupporter && (
                          <div className="absolute -top-3 left-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4F050] text-[#141413] font-mono text-[9px] font-black uppercase tracking-wider border-2 border-[#141413] shadow-[2px_2px_0px_#141413] z-20">
                            <Crown className="w-3 h-3 text-[#141413]" />
                            <span>#1 TOP SUPPORTER</span>
                          </div>
                        )}

                        {/* Supporter Row: avatar, name, message, amount */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-start gap-2.5 min-w-0 flex-1">
                            {/* Supporter Illustrated Avatar / icon */}
                            <div
                              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg border-2 border-[#141413] shrink-0 shadow-[1.5px_1.5px_0px_#141413] ${avatarInfo.bg}`}
                            >
                              <span>{avatarInfo.emoji}</span>
                            </div>

                            {/* Supporter Details: Name & Message */}
                            <div className="min-w-0 flex-1 pr-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="font-display font-bold text-xs sm:text-sm text-[#141413] truncate leading-tight">
                                  {supporter.supporterName}
                                </h4>
                                {isTopSupporter && (
                                  <span className="text-amber-500 text-xs font-bold leading-none" title="Gold Patron">
                                    ★
                                  </span>
                                )}
                              </div>

                              {/* Message */}
                              <p className="font-sans text-xs text-[#141413]/85 leading-tight mt-0.5 break-words line-clamp-2">
                                "{supporter.message}"
                              </p>
                            </div>
                          </div>

                          {/* Donation Amount Badge */}
                          <div className="shrink-0 self-center">
                            <div
                              className={`inline-flex items-center gap-1 font-mono font-bold text-xs sm:text-sm px-3 py-1.5 rounded-xl border-2 border-[#141413] shadow-[2px_2px_0px_#141413] ${
                                isTopSupporter
                                  ? "bg-[#D4F050] text-[#141413]"
                                  : "bg-[#141413] text-[#F5F2EA]"
                              }`}
                            >
                              <span>₹{supporter.amount}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  });
                })()}
              </div>
            )}

            {/* Gratitude Callout */}
            <div className="p-5 rounded-2xl bg-[#E8E5F7] border-2 border-[#141413] shadow-[4px_4px_0px_#141413] flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#141413] text-[#F5F2EA] flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4 text-[#F43F5E]" />
              </div>
              <p className="font-sans text-xs text-[#141413] leading-snug">
                <strong>Every contribution matters.</strong> Supporters are listed in real-time right after PhonePe confirms the transaction. Thank you for empowering my journey!
              </p>
            </div>
          </div>

          {/* =======================================================================
              RIGHT COLUMN: DONATE NOW (lg:col-span-6)
             ======================================================================= */}
          <div className="lg:col-span-6 lg:order-2 order-1 space-y-6">
            <div className="rounded-3xl bg-[#FAF8F2] border-2 border-[#141413] shadow-[8px_8px_0px_#141413] p-6 sm:p-8">

              {/* Form Title & Security Note */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#141413]/10">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#141413]">
                    Donate Now
                  </h2>
                </div>
                
              </div>

              {/* Status Alert Panels (Loading, Success, Failure, Cancelled) */}
              <AnimatePresence>
                {paymentStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-5 rounded-2xl bg-[#DCFCE7] border-2 border-[#16A34A] text-[#14532D] mb-6 space-y-2 shadow-[2px_2px_0px_#16A34A]"
                  >
                    <div className="flex items-center gap-2 font-display font-bold text-base">
                      <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                      <span>Chai Received! Thank You So Much! ☕</span>
                    </div>
                    <p className="text-xs text-[#14532D] leading-relaxed">
                      Your PhonePe payment was verified successfully. Your name and message are now honored in the Top Supporters list!
                    </p>
                    {activeTxId && (
                      <div className="font-mono text-[10px] text-[#14532D]/80 pt-1">
                        Transaction Ref: {activeTxId}
                      </div>
                    )}
                  </motion.div>
                )}

                {paymentStatus === "failed" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-5 rounded-2xl bg-[#FEE2E2] border-2 border-[#DC2626] text-[#7F1D1D] mb-6 space-y-2 shadow-[2px_2px_0px_#DC2626]"
                  >
                    <div className="flex items-center gap-2 font-display font-bold text-base">
                      <AlertCircle className="w-5 h-5 text-[#DC2626]" />
                      <span>Payment Not Completed</span>
                    </div>
                    <p className="text-xs leading-relaxed">
                      {errorMessage || "The transaction could not be completed. You can try again or test using the Sandbox Simulator."}
                    </p>
                    <button
                      onClick={() => setPaymentStatus("idle")}
                      className="text-xs font-mono font-bold underline hover:text-[#B91C1C] cursor-pointer pt-1"
                    >
                      Dismiss and try again →
                    </button>
                  </motion.div>
                )}

                {paymentStatus === "cancelled" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-2xl bg-[#FEF3C7] border-2 border-[#D97706] text-[#78350F] mb-6 space-y-1"
                  >
                    <div className="flex items-center gap-2 font-display font-bold text-sm">
                      <XCircle className="w-4 h-4 text-[#D97706]" />
                      <span>Payment Cancelled</span>
                    </div>
                    <p className="text-xs">
                      No charges were deducted. You can retry whenever you're ready!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Content */}
              <form onSubmit={handleInitiatePayment} className="space-y-6">

                {/* 1. Preset Amount Buttons */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#141413]">
                      Select Chai Amount:
                    </label>
                    <span className="font-mono text-xs font-bold text-[#7A9A00]">
                      Selected: ₹{selectedAmount}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {PRESET_AMOUNTS.map((item) => {
                      const isSelected = selectedAmount === item.amount;
                      return (
                        <button
                          key={item.amount}
                          type="button"
                          onClick={() => handleSelectPreset(item.amount)}
                          className={`p-3 rounded-2xl border-2 border-[#141413] transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                            isSelected
                              ? "bg-[#D4F050] text-[#141413] shadow-[3px_3px_0px_#141413] -translate-y-0.5"
                              : "bg-[#F5F2EA] text-[#141413] hover:bg-[#FAF8F2] shadow-[1px_1px_0px_#141413]"
                          }`}
                        >
                          <span className="font-display font-bold text-base sm:text-lg">
                            ₹{item.amount}
                          </span>
                          <span className="font-mono text-[10px] text-[#6B6862] leading-tight mt-0.5">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Custom Donation Amount Input (autofilled from presets) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#141413]">
                      Enter Amount (₹):
                    </label>
                   
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-lg text-[#141413]">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="1"
                      placeholder="20"
                      value={customAmountInput}
                      onChange={handleCustomAmountChange}
                      className="w-full pl-9 pr-4 py-3 rounded-2xl bg-[#F5F2EA] border-2 border-[#141413] text-[#141413] font-display font-bold text-base focus:outline-none focus:bg-[#FAF8F2] focus:ring-2 focus:ring-[#D4F050] transition-colors shadow-[2px_2px_0px_#141413]"
                    />
                  </div>
                </div>

                {/* 3. Name Input & Anonymous Option */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="supporter-name-input"
                      className="font-mono text-xs font-bold uppercase tracking-wider text-[#141413]"
                    >
                      Your Name or Handle:
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-xs text-[#6B6862] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded border-[#141413] text-[#141413] focus:ring-[#D4F050]"
                      />
                      <span>Stay Anonymous</span>
                    </label>
                  </div>
                  <input
                    id="supporter-name-input"
                    type="text"
                    disabled={isAnonymous}
                    placeholder={isAnonymous ? "Anonymous" : "Name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={50}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F5F2EA] border-2 border-[#141413] text-[#141413] font-sans text-sm focus:outline-none focus:bg-[#FAF8F2] transition-colors shadow-[2px_2px_0px_#141413] disabled:opacity-50"
                  />
                </div>

                {/* 4. Choose Avatar */}
                <div className="space-y-2">
                  <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#141413]">
                    Pick Your Supporter Badge:
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {AVATAR_OPTIONS.map((item) => {
                      const isSelected = selectedAvatar === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedAvatar(item.id)}
                          className={`h-11 rounded-xl flex items-center justify-center text-xl border-2 transition-transform cursor-pointer ${
                            item.bg
                          } ${
                            isSelected
                              ? "border-[#141413] shadow-[2px_2px_0px_#141413] scale-110 ring-2 ring-[#D4F050]"
                              : "border-transparent opacity-80 hover:opacity-100 hover:scale-105"
                          }`}
                          title={item.label}
                        >
                          {item.emoji}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Message Input */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#141413]">
                    Cheer Message:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={280}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F5F2EA] border-2 border-[#141413] text-[#141413] font-sans text-sm focus:outline-none focus:bg-[#FAF8F2] transition-colors shadow-[2px_2px_0px_#141413] resize-none"
                  />
                  <div className="text-right font-mono text-[10px] text-[#6B6862]">
                    {message.length}/280
                  </div>
                </div>

                {/* 6. Primary Action: Pay via PhonePe Button */}
                <div className="pt-2 space-y-3">
                  <MagneticButton strength={0.2}>
                    <button
                      type="submit"
                      disabled={loading || selectedAmount < 1}
                      className="w-full py-4 px-6 rounded-full bg-[#D4F050] hover:bg-[#c2df3f] text-[#141413] font-mono text-sm uppercase tracking-wider font-black flex items-center justify-center gap-3 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] hover:shadow-[6px_6px_0px_#141413] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Connecting to Razorpay...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-lg">☕</span>
                          <span>Pay ₹{selectedAmount}</span>
                          <ArrowRight className="w-4 h-4 text-[#D4F050]" />
                        </>
                      )}
                    </button>
                  </MagneticButton>

                  {/* PhonePe Badges & Trust Footer */}
                  
                </div>
              </form>
            </div>

            {/* Quick Navigation Back to Portfolio */}
            <div className="p-6 rounded-3xl bg-[#FAF8F2] border-2 border-[#141413] shadow-[4px_4px_0px_#141413] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="font-display font-bold text-sm text-[#141413]">
                  Prefer direct freelance or commercial project?
                </div>
                <div className="font-sans text-xs text-[#6B6862]">
                  Explore my 6 core web development services or book a call.
                </div>
              </div>
              <button
                onClick={() => onNavigate("contact")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141413] text-[#F5F2EA] font-mono text-xs uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-colors border border-[#141413] cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Let's talk specs ↗</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PHONEPE SANDBOX PAYMENT SIMULATOR MODAL
            (Allows testing the end-to-end MongoDB verification flow cleanly in dev/preview)
           ========================================================================= */}
        <AnimatePresence>
          {simulatorModal?.open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-md bg-[#FAF8F2] rounded-3xl border-3 border-[#141413] shadow-[10px_10px_0px_#141413] p-6 sm:p-8 space-y-6"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-[#141413]/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#5f259f] text-white flex items-center justify-center font-bold text-sm">
                      P
                    </div>
                    <div>
                      <div className="font-display font-bold text-lg text-[#141413] leading-none">
                        PhonePe UAT Sandbox
                      </div>
                      <div className="font-mono text-[10px] text-[#6B6862] uppercase tracking-wider">
                        Payment Gateway Simulator
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4F050] text-[#141413] font-mono text-[10px] font-bold uppercase border border-[#141413]/20">
                    TEST UAT
                  </span>
                </div>

                {/* Checkout Summary */}
                <div className="p-4 rounded-2xl bg-[#F5F2EA] border border-[#141413]/10 space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#6B6862]">Merchant ID:</span>
                    <span className="text-[#141413] font-bold">PGTESTPAYUAT86</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B6862]">Supporter:</span>
                    <span className="text-[#141413] font-bold truncate max-w-[180px]">
                      {simulatorModal.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B6862]">Transaction ID:</span>
                    <span className="text-[#141413] font-bold text-[10px]">
                      {simulatorModal.txId}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#141413]/10 font-display font-bold text-base text-[#141413]">
                    <span>Amount Payable:</span>
                    <span className="text-[#5f259f]">₹{simulatorModal.amount}</span>
                  </div>
                </div>

                <p className="text-xs text-[#6B6862] leading-relaxed">
                  In production, PhonePe redirects to the live UPI/Card interface. In this preview sandbox, you can simulate a successful payment to test MongoDB database persistence and instant top-supporter updates.
                </p>

                {/* Action Buttons */}
                <div className="space-y-2.5">
                  <button
                    onClick={() => handleSimulatePayment("success")}
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white font-mono text-xs uppercase tracking-wider font-bold border-2 border-[#141413] shadow-[3px_3px_0px_#141413] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simulate Successful Payment (Verify & Save)</span>
                  </button>

                  <button
                    onClick={() => handleSimulatePayment("failed")}
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-full bg-[#FAF8F2] hover:bg-[#FEE2E2] text-[#DC2626] font-mono text-xs uppercase tracking-wider font-semibold border border-[#DC2626]/30 cursor-pointer"
                  >
                    Cancel / Simulate Failure
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
