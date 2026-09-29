import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { submitFeedbackMessage } from "../lib/apiClient";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [category, setCategory] = useState("Portfolio Design");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Portfolio Design",
    "Projects & Code",
    "Hire / Collaboration",
    "Suggestions",
    "General Review",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please write a quick comment or feedback.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      await submitFeedbackMessage({
        name: name.trim() || "Anonymous Visitor",
        email: email.trim() || "visitor@feedback.com",
        rating,
        category,
        message: message.trim(),
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setMessage("");
        setName("");
        setEmail("");
        onClose();
      }, 2200);
    } catch (err: any) {
      setError(err.message || "Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#141413]/70 backdrop-blur-xs transition-opacity"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", duration: 0.45 }}
            className="relative w-full max-w-lg rounded-3xl bg-[#FAF8F2] border-2 border-[#141413] shadow-[8px_8px_0px_#141413] p-6 sm:p-8 z-10 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#D4F050] border-b-2 border-[#141413]" />

            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#F5F2EA] hover:bg-[#141413] text-[#141413] hover:text-[#D4F050] border border-[#141413]/20 hover:border-[#141413] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {isSuccess ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#D4F050] border-2 border-[#141413] text-[#141413] flex items-center justify-center mx-auto shadow-[3px_3px_0px_#141413] animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-bold text-[#141413]">
                  Thank You for Your Feedback!
                </h3>
                <p className="text-sm text-[#6B6862] max-w-sm mx-auto">
                  Your review has been logged and sent directly to Avdhesh's dashboard.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="pt-2 space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4F050] text-[#141413] font-mono text-[11px] font-bold uppercase tracking-wider border border-[#141413] mb-3 shadow-[2px_2px_0px_#141413]">
                    <MessageSquare className="w-3 h-3" />
                    <span>Quick Feedback</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#141413] tracking-tight">
                    Share Your Thoughts
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B6862] mt-1">
                    Help me improve this portfolio or leave a testimonial review!
                  </p>
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-[#141413] mb-2">
                    Overall Experience
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (hoverRating !== null ? hoverRating : rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setRating(star)}
                          className="p-1 cursor-pointer transition-transform hover:scale-115 focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              active
                                ? "text-[#141413] fill-[#D4F050]"
                                : "text-[#141413]/30 fill-transparent"
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="font-mono text-xs font-bold text-[#141413] ml-2">
                      {rating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Category Pills */}
                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-[#141413] mb-2">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer border ${
                          category === cat
                            ? "bg-[#141413] text-[#D4F050] border-[#141413] font-bold shadow-[2px_2px_0px_#D4F050]"
                            : "bg-[#F5F2EA] text-[#141413] border-[#141413]/20 hover:border-[#141413]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea */}
                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-[#141413] mb-1.5">
                    Your Feedback <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What did you like? Any bugs or suggestions?..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#141413] text-sm text-[#141413] placeholder-[#6B6862]/60 focus:outline-none focus:ring-2 focus:ring-[#D4F050] shadow-[2px_2px_0px_#141413]"
                  />
                </div>

                {/* Optional Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] font-bold uppercase text-[#6B6862] mb-1">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#141413]/30 text-xs text-[#141413] focus:outline-none focus:border-[#141413]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-bold uppercase text-[#6B6862] mb-1">
                      Your Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#141413]/30 text-xs text-[#141413] focus:outline-none focus:border-[#141413]"
                    />
                  </div>
                </div>

                {error && (
                  <p className="font-mono text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl bg-[#141413] hover:bg-[#D4F050] text-[#F5F2EA] hover:text-[#141413] font-mono text-xs uppercase font-bold tracking-wider border-2 border-[#141413] shadow-[3px_3px_0px_#141413] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Send Feedback</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
