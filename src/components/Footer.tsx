import React from "react";
import { ArrowUp, Github, Instagram, Linkedin, Globe, Mail, Facebook, MessageCircle, Youtube } from "lucide-react";
import { XIcon } from "./XIcon";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { MagneticButton } from "./MagneticButton";
import { useSiteSettings } from "../context/SiteSettingsContext";

interface FooterProps {
  onBackToTop: () => void;
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onBackToTop, onNavigate }) => {
  const { settings } = useSiteSettings();
  const s = settings.socialLinks;

  return (
    <footer className="border-t border-[#141413]/15 bg-[#141413] text-[#F5F2EA] pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Social Platforms Row */}
        <div className="pb-8 border-b border-white/10 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 font-mono text-xs text-center">
          <span className="text-[#9E9A91] uppercase tracking-widest text-[11px]">
            Connect & Follow:
          </span>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a
              href={s.github || "https://github.com/BCABro-9667"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#F5F2EA] hover:text-[#D4F050] transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>

            <a
              href={s.linkedin || PORTFOLIO_DATA.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#F5F2EA] hover:text-[#D4F050] transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>

            {s.twitter && (
              <a
                href={s.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#F5F2EA] hover:text-[#D4F050] transition-colors"
              >
                <XIcon className="w-3.5 h-3.5" />
                <span>X</span>
              </a>
            )}

            <a
              href={s.instagram || "https://www.instagram.com/"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#F5F2EA] hover:text-[#D4F050] transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>

            {s.youtube && (
              <a
                href={s.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#F5F2EA] hover:text-[#D4F050] transition-colors"
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>YouTube</span>
              </a>
            )}

            <a
              href={s.facebook || "https://www.facebook.com/"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#F5F2EA] hover:text-[#D4F050] transition-colors"
            >
              <Facebook className="w-3.5 h-3.5" />
              <span>Facebook</span>
            </a>

            <a
              href={`mailto:${s.email || PORTFOLIO_DATA.personal.email}`}
              className="flex items-center gap-1.5 text-[#F5F2EA] hover:text-[#D4F050] transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>

            <a
              href="#chai"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) {
                  onNavigate("chai");
                } else {
                  window.location.hash = "chai";
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4F050] text-[#141413] font-bold text-xs hover:bg-[#FAF8F2] transition-colors border border-[#141413]/20"
            >
              <span>☕</span>
              <span>Buy Me a Chai</span>
            </a>
          </div>
        </div>

        {/* Grand Bold Editorial Name Typography */}
        <div className="pt-12 sm:pt-16 pb-4 overflow-hidden select-none">
          <div className="font-display font-black text-5xl sm:text-7xl md:text-9xl lg:text-[12.5vw] tracking-tighter text-[#F5F2EA] text-center leading-none uppercase transition-all duration-300 hover:text-[#D4F050]">
            AVDHESH KUMAR
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between font-mono text-[11px] text-[#9E9A91] tracking-widest uppercase mt-6 pt-4 border-t border-white/10 gap-2">
            <span>FULL-STACK & FRONTEND WEB DEVELOPER</span>
            <span>GURGAON, HARYANA, INDIA</span>
            <span>© 2026 ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
