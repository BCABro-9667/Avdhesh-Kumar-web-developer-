import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, X, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { submitPopupSubscription } from "../lib/apiClient";

interface EmailStayConnectedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const EmailStayConnectedModal: React.FC<EmailStayConnectedModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await submitPopupSubscription({ email: trimmed });
      setIsSubmitted(true);
      onSuccess(trimmed);

      // Automatically dismiss after showing celebratory confirmation
      setTimeout(() => {
        onClose();
      }, 2400);
    } catch (err: any) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop with subtle blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#141413]/70 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            className="relative w-full max-w-lg rounded-3xl bg-[#FAF8F2] border-2 border-[#141413] shadow-[8px_8px_0px_#141413] p-6 sm:p-8 z-10 overflow-hidden"
          >
            {/* Top decorative accent bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#D4F050] border-b-2 border-[#141413]" />

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#F5F2EA] hover:bg-[#141413] text-[#141413] hover:text-[#D4F050] border border-[#141413]/20 hover:border-[#141413] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {!isSubmitted ? (
              <div className="pt-2">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4F050] text-[#141413] font-mono text-xs font-bold uppercase tracking-wider border border-[#141413] mb-4 shadow-[2px_2px_0px_#141413]">
                  <span> For Stay in Touch</span>
                </div>

                {/* Heading */}
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#141413] tracking-tight leading-tight mb-2">
                  Enjoying the portfolio? <br />
                  <span className="underline decoration-[#D4F050] decoration-[4px] underline-offset-4">
                    Let's stay connected.
                  </span>
                </h3>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-[#6B6862] leading-relaxed mb-6 font-normal">
                  You've been exploring for a minute! Drop your email below to receive updates on new case studies, open-source projects, and engineering experiments from Avdhesh.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="popup-subscriber-email"
                      className="block font-mono text-xs uppercase tracking-wider text-[#141413] font-semibold"
                    >
                      Your Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#141413]">
                        <Mail className="w-4 h-4 text-[#6B6862]" />
                      </div>
                      <input
                        id="popup-subscriber-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError("");
                        }}
                        placeholder="you@domain.com"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#F5F2EA] border-2 ${
                          error ? "border-red-500" : "border-[#141413]"
                        } text-[#141413] placeholder-[#9E9A91] text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#D4F050] transition-colors`}
                      />
                    </div>
                    {error && (
                      <p className="text-xs font-mono text-red-600 mt-1">
                        {error}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#141413] text-[#F5F2EA] hover:bg-[#D4F050] hover:text-[#141413] font-mono text-xs uppercase tracking-wider font-bold border-2 border-[#141413] shadow-[3px_3px_0px_#141413] transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Connecting...</span>
                      ) : (
                        <>
                          <span>Stay Connected</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-4 py-3.5 text-center font-mono text-xs uppercase tracking-wider text-[#6B6862] hover:text-[#141413] transition-colors cursor-pointer"
                    >
                      Maybe later
                    </button>
                  </div>
                </form>

                <div className="mt-5 pt-4 border-t border-[#141413]/10 flex items-center justify-between text-[11px] font-mono text-[#9E9A91]">
                  <span>Zero spam • Unsubscribe anytime</span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#D4F050] border-2 border-[#141413] flex items-center justify-center text-[#141413] shadow-[4px_4px_0px_#141413]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-bold text-[#141413]">
                  You're on the list!
                </h3>
                <p className="text-sm text-[#6B6862] max-w-sm mx-auto font-sans leading-relaxed">
                  Thank you for connecting with Avdhesh. We've saved your email (<strong>{email}</strong>) and you will never receive this popup again.
                </p>
                <div className="pt-2">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-[#141413] text-[#F5F2EA] font-mono text-xs uppercase tracking-wider border-2 border-[#141413] hover:bg-[#D4F050] hover:text-[#141413] transition-colors cursor-pointer"
                  >
                    Continue Exploring
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
