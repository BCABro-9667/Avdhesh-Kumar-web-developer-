import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, X, ExternalLink } from "lucide-react";
import { useSiteSettings } from "../context/SiteSettingsContext";

interface PromotionBarProps {
  onNavigate: (pageId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const PromotionBar: React.FC<PromotionBarProps> = ({
  onNavigate,
  isOpen,
  onClose,
}) => {
  const { settings } = useSiteSettings();

  const [promoConfig, setPromoConfig] = useState(() => {
    // 1. Try settings from context
    if (settings?.promotionBar) {
      return {
        active: settings.promotionBar.active !== undefined ? settings.promotionBar.active : true,
        text: settings.promotionBar.text || "Building a polished Next.js project from scratch",
        link: settings.promotionBar.link || "blog/building-polished-nextjs-project",
        badgeText: settings.promotionBar.badgeText || "Announcement",
      };
    }
    // 2. Try localStorage
    try {
      const saved = localStorage.getItem("portfolio_promo_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          active: parsed.active !== undefined ? Boolean(parsed.active) : true,
          text: parsed.text || parsed.reasonText || "Building a polished Next.js project from scratch",
          link: parsed.link || (parsed.blogId ? `blog/${parsed.blogId}` : "blog/building-polished-nextjs-project"),
          badgeText: parsed.badgeText || parsed.reasonText || "Announcement",
        };
      }
    } catch (e) {}

    return {
      active: true,
      text: "Building a polished Next.js project from scratch",
      link: "blog/building-polished-nextjs-project",
      badgeText: "Announcement",
    };
  });

  // Sync with context updates
  useEffect(() => {
    if (settings?.promotionBar) {
      setPromoConfig({
        active: settings.promotionBar.active !== undefined ? settings.promotionBar.active : true,
        text: settings.promotionBar.text || "Building a polished Next.js project from scratch",
        link: settings.promotionBar.link || "blog/building-polished-nextjs-project",
        badgeText: settings.promotionBar.badgeText || "Announcement",
      });
    }
  }, [settings?.promotionBar]);

  // Listen to storage / custom promo update events for instantaneous updates
  useEffect(() => {
    const handleSync = (e?: any) => {
      try {
        const saved = localStorage.getItem("portfolio_promo_settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          setPromoConfig((prev) => ({
            active: parsed.active !== undefined ? Boolean(parsed.active) : prev.active,
            text: parsed.text || parsed.reasonText || prev.text,
            link: parsed.link || (parsed.blogId ? `blog/${parsed.blogId}` : prev.link),
            badgeText: parsed.badgeText || parsed.reasonText || "Announcement",
          }));
        }
      } catch (err) {}
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("promo_settings_updated", handleSync);

    // Initial check from public endpoint
    fetch("/api/promotion")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.promotionBar) {
          const pb = data.promotionBar;
          setPromoConfig({
            active: pb.active !== undefined ? Boolean(pb.active) : true,
            text: pb.text || "Building a polished Next.js project from scratch",
            link: pb.link || "blog/building-polished-nextjs-project",
            badgeText: pb.badgeText || "Announcement",
          });
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("promo_settings_updated", handleSync);
    };
  }, []);

  if (!promoConfig.active || !isOpen) return null;

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const rawLink = (promoConfig.link || "").trim();
    if (!rawLink) return;

    if (rawLink.startsWith("http://") || rawLink.startsWith("https://")) {
      window.open(rawLink, "_blank", "noopener,noreferrer");
      return;
    }

    if (rawLink.startsWith("#")) {
      const el = document.querySelector(rawLink);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    // Clean internal route like "/projects/xyz" or "blog/xyz"
    const cleanRoute = rawLink.replace(/^\/+/, "");
    onNavigate(cleanRoute);
  };

  const isExternal = promoConfig.link?.startsWith("http://") || promoConfig.link?.startsWith("https://");

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="relative w-full z-40 bg-[#D4F050] text-[#141413] border-b-2 border-[#141413] overflow-hidden select-none"
        aria-label="Announcement Banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-3">
          {/* Clickable Announcement Area */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 justify-center sm:justify-start md:justify-center">
            {/* Reason / Badge Text */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#141413] text-[#D4F050] font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider shrink-0 shadow-[1px_1px_0px_#141413]">
              <span>{promoConfig.badgeText || "Announcement"}</span>
            </span>

            {/* Clickable Promo Text written from Admin */}
            <button
              type="button"
              onClick={handleLinkClick}
              className="inline-flex items-center gap-1.5 font-display font-bold text-xs sm:text-sm text-[#141413] hover:opacity-90 transition-all text-left truncate cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] rounded-sm"
              title={`Open: ${promoConfig.text}`}
            >
              <span className="truncate underline decoration-[#141413]/40 decoration-1 underline-offset-2 group-hover:decoration-[#141413] group-hover:underline font-semibold">
                {promoConfig.text}
              </span>

              <span className="inline-flex items-center gap-1 font-mono text-[10px] sm:text-[11px] font-bold shrink-0 bg-[#141413]/10 px-2 py-0.5 rounded-full group-hover:bg-[#141413] group-hover:text-[#D4F050] transition-colors ml-1">
                <span>{isExternal ? "Visit Link" : "Read Now"}</span>
                {isExternal ? (
                  <ExternalLink className="w-2.5 h-2.5" />
                ) : (
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                )}
              </span>
            </button>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#141413]/80 hover:text-[#141413] hover:bg-[#141413]/15 transition-colors shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141413]"
            aria-label="Close promotion bar"
            title="Close announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
