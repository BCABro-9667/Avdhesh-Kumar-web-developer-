import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Globe,
  ArrowUpRight,
  Send,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { MagneticButton } from "./MagneticButton";
import { useSiteSettings } from "../context/SiteSettingsContext";
import { submitContactMessage, verifyEmailAddress } from "../lib/apiClient";
import { sendContactEmail } from "../lib/emailService";
import { triggerIntenseConfetti } from "../utils/confetti";
import { XIcon } from "./XIcon";

export const Contact: React.FC = () => {
  const { settings } = useSiteSettings();
  const socialLinks = settings.socialLinks;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const isSubmittingRef = React.useRef(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [suggestedEmail, setSuggestedEmail] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Your name is required";
    if (!formData.email.trim()) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email format (e.g. name@example.com)";
    }
    if (!formData.subject.trim()) errs.subject = "Subject is required";
    if (!formData.message.trim()) {
      errs.message = "Message cannot be empty";
    } else if (formData.message.trim().length < 10) {
      errs.message = "Please include a bit more detail (min 10 characters)";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || status === "loading") return;
    if (!validate()) return;

    isSubmittingRef.current = true;
    setStatus("loading");
    setEmailVerifying(true);

    try {
      // 1. Verify email via Abstract API to prevent wrong / fake / undeliverable emails
      const verification = await verifyEmailAddress(formData.email.trim());
      setEmailVerifying(false);

      if (!verification.valid) {
        setErrors((prev) => ({
          ...prev,
          email: verification.error || "Please enter a valid, active email address.",
        }));
        if (verification.suggestedCorrection) {
          setSuggestedEmail(verification.suggestedCorrection);
        }
        setStatus("idle");
        isSubmittingRef.current = false;
        return;
      }

      setSuggestedEmail(null);

      let emailDispatched = false;
      let dbStored = false;

      // 2. Send email directly to Avdhesh via EmailJS
      try {
        await sendContactEmail({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        });
        emailDispatched = true;
      } catch (emailErr: any) {
        console.error("EmailJS notification error:", emailErr?.text || emailErr?.message || emailErr);
      }

      // 3. Also log inquiry to MongoDB / Admin CMS
      try {
        await submitContactMessage({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        });
        dbStored = true;
      } catch (dbErr: any) {
        console.warn("CMS Inquiry store error:", dbErr);
        if (dbErr?.message && dbErr.message.toLowerCase().includes("email")) {
          setErrors((prev) => ({ ...prev, email: dbErr.message }));
          setStatus("idle");
          isSubmittingRef.current = false;
          return;
        }
      }

      // If either EmailJS succeeded or DB recorded the message, consider it successful
      if (emailDispatched || dbStored) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setErrors({});
        setSuggestedEmail(null);

        // Trigger massive burst of confetti for 0.30s
        triggerIntenseConfetti(0.30);
      } else {
        throw new Error("Failed to send message via EmailJS or persist to CMS.");
      }
    } catch (err: any) {
      console.error("Contact submit error:", err);
      setStatus("error");
    } finally {
      isSubmittingRef.current = false;
      setEmailVerifying(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section id="contact" className="py-24 sm:py-36 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Big Editorial Headline */}
        <div className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#6B6862] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#D4F050] border border-[#141413]/30" />
            <span>05 / GET IN TOUCH</span>
          </div>

          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#141413] leading-[1.02] max-w-4xl">
            Have an idea? <br />
            <span className="text-[#141413] underline decoration-[#D4F050] decoration-[5px] underline-offset-8">
              Let's build it.
            </span>
          </h2>

          <p className="mt-6 text-lg sm:text-xl text-[#6B6862] max-w-2xl font-normal leading-relaxed">
            I'm always open to interesting projects, collaborations and opportunities. Feel free to send a message or connect through social links.
          </p>
        </div>

        {/* Grid: Direct Contact Details (Left) + Contact Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          {/* Left Column: Unified Direct Info & Social Profiles Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#FAF8F2] border-2 border-[#141413] shadow-[8px_8px_0px_#141413] h-full flex flex-col justify-between space-y-6">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-[#6B6862] border-b border-[#141413]/10 pb-3 mb-6">
                  DIRECT CHANNELS & PROFILES
                </div>

                <div className="space-y-4">
                  {/* Email Block */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#F5F2EA] border border-[#141413]/15 hover:border-[#141413]/35 transition-all duration-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#141413] text-[#D4F050] border border-[#141413] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#D4F050]">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-mono text-[11px] text-[#6B6862] uppercase tracking-wider">
                            Email
                          </div>
                          <a
                            href={`mailto:${socialLinks.email || PORTFOLIO_DATA.personal.email}`}
                            className="font-display font-semibold text-xs sm:text-sm md:text-base text-[#141413] hover:text-[#8EAE00] hover:underline break-all transition-colors block"
                          >
                            {socialLinks.email || PORTFOLIO_DATA.personal.email}
                          </a>
                        </div>
                      </div>

                      <button
                        onClick={() => copyToClipboard(socialLinks.email || PORTFOLIO_DATA.personal.email, "email")}
                        title="Copy email"
                        className="p-2 rounded-xl bg-[#FAF8F2] border border-[#141413]/20 hover:border-[#141413] hover:bg-[#141413] hover:text-[#D4F050] text-[#6B6862] transition-colors cursor-pointer shrink-0"
                      >
                        {copiedField === "email" ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Phone Block */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#F5F2EA] border border-[#141413]/15 hover:border-[#141413]/35 transition-all duration-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#141413] text-[#D4F050] border border-[#141413] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#D4F050]">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-mono text-[11px] text-[#6B6862] uppercase tracking-wider">
                            Phone / WhatsApp
                          </div>
                          <a
                            href={`tel:${(socialLinks.phone || PORTFOLIO_DATA.personal.phone).replace(/\s+/g, "")}`}
                            className="font-display font-semibold text-sm sm:text-base text-[#141413] hover:text-[#8EAE00] hover:underline transition-colors block"
                          >
                            {socialLinks.phone || PORTFOLIO_DATA.personal.phone}
                          </a>
                        </div>
                      </div>

                      <button
                        onClick={() => copyToClipboard(socialLinks.phone || PORTFOLIO_DATA.personal.phone, "phone")}
                        title="Copy phone"
                        className="p-2 rounded-xl bg-[#FAF8F2] border border-[#141413]/20 hover:border-[#141413] hover:bg-[#141413] hover:text-[#D4F050] text-[#6B6862] transition-colors cursor-pointer shrink-0"
                      >
                        {copiedField === "phone" ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Location (Local) Block */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#F5F2EA] border border-[#141413]/15 hover:border-[#141413]/35 transition-all duration-200">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#141413] text-[#D4F050] border border-[#141413] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#D4F050]">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-mono text-[11px] text-[#6B6862] uppercase tracking-wider">
                          Location
                        </div>
                        <div className="font-display font-semibold text-sm sm:text-base text-[#141413]">
                          {socialLinks.location || PORTFOLIO_DATA.personal.location}
                        </div>
                        <div className="font-mono text-xs text-[#6B6862] mt-0.5">
                          Available for onsite in Delhi-NCR & remote worldwide
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Profiles - Dynamic Icons Row */}
              <div className="pt-2 border-t border-[#141413]/10">
                <div className="font-mono text-xs uppercase tracking-widest text-[#6B6862] pb-3 mb-1">
                  CONNECT & SOCIAL PROFILES
                </div>

                <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                  {/* LinkedIn */}
                  <a
                    href={socialLinks.linkedin || PORTFOLIO_DATA.personal.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                    title="LinkedIn"
                    className="h-11 rounded-xl bg-[#F5F2EA] border-2 border-[#141413] hover:bg-[#141413] hover:text-[#D4F050] text-[#141413] transition-all duration-200 flex items-center justify-center shadow-[2px_2px_0px_#141413] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer group"
                  >
                    <Linkedin className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </a>

                  {/* GitHub */}
                  <a
                    href={socialLinks.github || PORTFOLIO_DATA.personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Profile"
                    title="GitHub"
                    className="h-11 rounded-xl bg-[#F5F2EA] border-2 border-[#141413] hover:bg-[#141413] hover:text-[#D4F050] text-[#141413] transition-all duration-200 flex items-center justify-center shadow-[2px_2px_0px_#141413] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer group"
                  >
                    <Github className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </a>

                  {/* X */}
                  <a
                    href={socialLinks.twitter || PORTFOLIO_DATA.personal.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X Profile"
                    title="X"
                    className="h-11 rounded-xl bg-[#F5F2EA] border-2 border-[#141413] hover:bg-[#141413] hover:text-[#D4F050] text-[#141413] transition-all duration-200 flex items-center justify-center shadow-[2px_2px_0px_#141413] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer group"
                  >
                    <XIcon className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                  </a>

                  {/* Instagram */}
                  <a
                    href={socialLinks.instagram || PORTFOLIO_DATA.personal.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram Profile"
                    title="Instagram"
                    className="h-11 rounded-xl bg-[#F5F2EA] border-2 border-[#141413] hover:bg-[#141413] hover:text-[#D4F050] text-[#141413] transition-all duration-200 flex items-center justify-center shadow-[2px_2px_0px_#141413] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer group"
                  >
                    <Instagram className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </a>

                  {/* YouTube */}
                  <a
                    href={socialLinks.youtube || "https://youtube.com/@BCABRO"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube Channel"
                    title="YouTube"
                    className="h-11 rounded-xl bg-[#F5F2EA] border-2 border-[#141413] hover:bg-[#141413] hover:text-[#D4F050] text-[#141413] transition-all duration-200 flex items-center justify-center shadow-[2px_2px_0px_#141413] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer group"
                  >
                    <Youtube className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </a>

                  {/* Facebook */}
                  <a
                    href={socialLinks.facebook || "https://facebook.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook Profile"
                    title="Facebook"
                    className="h-11 rounded-xl bg-[#F5F2EA] border-2 border-[#141413] hover:bg-[#141413] hover:text-[#D4F050] text-[#141413] transition-all duration-200 flex items-center justify-center shadow-[2px_2px_0px_#141413] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer group"
                  >
                    <Facebook className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </a>
                </div>
              </div>

              {/* Status indicator badge */}
              <div className="pt-2 border-t border-[#141413]/10">
                <div className="p-3.5 rounded-2xl bg-[#D4F050]/20 border border-[#141413]/15 flex items-center gap-3">
                  <div className="relative flex h-3 w-3 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8EAE00] opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#8EAE00]" />
                  </div>
                  <div className="text-xs font-mono text-[#141413]">
                    <span className="font-bold">{socialLinks.statusText || "Available for opportunities"}</span> — Fast response within ~24h
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#FAF8F2] border-2 border-[#141413] shadow-[8px_8px_0px_#141413] h-full flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#141413]/10 pb-4 mb-8">
                <div className="font-display text-2xl font-bold text-[#141413]">
                  Send a Direct Message
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col justify-between" noValidate>
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-name"
                      className="block font-mono text-xs uppercase tracking-wider text-[#141413] font-semibold"
                    >
                      Your Name <span className="text-[#FF6B35]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-xl bg-[#F5F2EA] border text-sm font-sans text-[#141413] placeholder:text-[#6B6862]/60 focus:outline-none focus:ring-1 focus:ring-[#141413] ${
                        errors.name ? "border-red-500 bg-red-50/50" : "border-[#141413]/20 focus:border-[#141413]"
                      }`}
                    />
                    {errors.name && (
                      <p className="font-mono text-xs text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="contact-email"
                        className="block font-mono text-xs uppercase tracking-wider text-[#141413] font-semibold"
                      >
                        Your Email <span className="text-[#FF6B35]">*</span>
                      </label>
                      {emailVerifying && (
                        <span className="font-mono text-[10px] text-[#6B6862] flex items-center gap-1 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#141413] animate-ping" />
                          <span>Verifying email...</span>
                        </span>
                      )}
                    </div>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) {
                          setErrors((prev) => {
                            const copy = { ...prev };
                            delete copy.email;
                            return copy;
                          });
                        }
                        if (suggestedEmail) setSuggestedEmail(null);
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-[#F5F2EA] border text-sm font-sans text-[#141413] placeholder:text-[#6B6862]/60 focus:outline-none focus:ring-1 focus:ring-[#141413] ${
                        errors.email ? "border-red-500 bg-red-50/50" : "border-[#141413]/20 focus:border-[#141413]"
                      }`}
                    />
                    {errors.email && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-xs text-red-700 space-y-1.5">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <span className="font-mono">{errors.email}</span>
                        </div>
                        {suggestedEmail && (
                          <div className="pt-2 border-t border-red-200/80 flex items-center justify-between gap-2 text-[11px] font-mono">
                            <span>Did you mean: <strong className="underline">{suggestedEmail}</strong>?</span>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, email: suggestedEmail });
                                setSuggestedEmail(null);
                                setErrors((prev) => {
                                  const copy = { ...prev };
                                  delete copy.email;
                                  return copy;
                                });
                              }}
                              className="px-2.5 py-1 rounded-md bg-red-700 text-white font-bold hover:bg-red-800 transition-colors cursor-pointer shrink-0"
                            >
                              Use suggestion
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label
                    htmlFor="contact-subject"
                    className="block font-mono text-xs uppercase tracking-wider text-[#141413] font-semibold"
                  >
                    Subject <span className="text-[#FF6B35]">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-xl bg-[#F5F2EA] border text-sm font-sans text-[#141413] placeholder:text-[#6B6862]/60 focus:outline-none focus:ring-1 focus:ring-[#141413] ${
                      errors.subject ? "border-red-500 bg-red-50/50" : "border-[#141413]/20 focus:border-[#141413]"
                    }`}
                  />
                  {errors.subject && (
                    <p className="font-mono text-xs text-red-600">{errors.subject}</p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label
                    htmlFor="contact-message"
                    className="block font-mono text-xs uppercase tracking-wider text-[#141413] font-semibold"
                  >
                    Message <span className="text-[#FF6B35]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-xl bg-[#F5F2EA] border text-sm font-sans text-[#141413] placeholder:text-[#6B6862]/60 focus:outline-none focus:ring-1 focus:ring-[#141413] resize-y ${
                      errors.message ? "border-red-500 bg-red-50/50" : "border-[#141413]/20 focus:border-[#141413]"
                    }`}
                  />
                  {errors.message && (
                    <p className="font-mono text-xs text-red-600">{errors.message}</p>
                  )}
                </div>

                {/* Status Messages */}
                <AnimatePresence>
                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 rounded-xl bg-[#D4F050]/50 border border-[#141413] flex items-center gap-3 text-sm text-[#141413] font-medium"
                    >
                      <CheckCircle className="w-5 h-5 text-[#141413] shrink-0" />
                      <div>
                        <strong>Message sent successfully!</strong> Thank you for reaching out. Avdhesh will get back to you shortly.
                      </div>
                    </motion.div>
                  )}

                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 rounded-xl bg-red-50 border border-red-300 flex items-center gap-3 text-sm text-red-700"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                      <div>
                        Unable to send right now. Please email directly at{" "}
                        <a
                          href={`mailto:${PORTFOLIO_DATA.personal.email}`}
                          className="underline font-medium"
                        >
                          {PORTFOLIO_DATA.personal.email}
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <div className="pt-2 flex items-center justify-between">
                  <MagneticButton strength={0.25}>
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#141413] text-[#F5F2EA] font-mono text-xs uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-colors border border-[#141413] disabled:opacity-60 cursor-pointer"
                    >
                      {status === "loading" ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send message</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </MagneticButton>

                 
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
