import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { EyeTrackerAvatar } from "./EyeTrackerAvatar";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { useSiteSettings } from "../context/SiteSettingsContext";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  promoBarVisible?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, promoBarVisible = false }) => {
  const { settings } = useSiteSettings();
  const isWhiteTheme = settings?.themeBg === "white";
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setScrolled(y > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Top offset so Navbar sits cleanly below the non-fixed promotion bar when at top of page,
  // and smoothly sticks to top-0 when the user scrolls past the promotion bar.
  const promoHeight = 44;
  const currentTop = promoBarVisible ? Math.max(0, promoHeight - scrollY) : 0;

  // Main Navigation links
  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "blogs", label: "Blogs" },
    { id: "gallery", label: "Gallery" },
    { id: "chai", label: "Chai ☕" },
    { id: "contact", label: "Contact" },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <header
        style={{ top: `${currentTop}px` }}
        className={`fixed left-0 right-0 z-50 transition-all duration-150 ${
          scrolled
            ? isWhiteTheme
              ? "py-3 bg-white/95 backdrop-blur-md border-b border-[#141413]/10 shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
              : "py-3 bg-[#F5F2EA]/90 backdrop-blur-md border-b border-[#141413]/10 shadow-[0_4px_24px_rgba(20,20,19,0.04)]"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Monogram */}
          <MagneticButton>
            <button
              onClick={() => handleLinkClick("home")}
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] rounded-md px-1 py-0.5 cursor-pointer"
              aria-label="Avdhesh Kumar - Home"
            >
              <EyeTrackerAvatar size={40} />
              <div className="hidden sm:flex flex-col text-left">
                <span className="font-display font-semibold text-sm tracking-tight text-[#141413]">
                  {PORTFOLIO_DATA.personal.name}
                </span>
                <span className="font-mono text-[10px] tracking-wider text-[#6B6862] uppercase">
                  Full-Stack Dev
                </span>
              </div>
            </button>
          </MagneticButton>

          {/* Desktop Nav Links (Home, About, Projects, Blogs, Contact) */}
          <nav
            className={`hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#141413]/10 shadow-xs ${
              isWhiteTheme ? "bg-white/95" : "bg-[#FAF8F2]/90"
            }`}
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative px-4 py-1.5 text-xs font-mono tracking-wider uppercase transition-colors duration-200 rounded-full cursor-pointer ${
                    isActive
                      ? "text-[#141413] font-bold"
                      : "text-[#6B6862] hover:text-[#141413]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-[#D4F050] rounded-full -z-10 border border-[#141413]/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <MagneticButton strength={0.3}>
              <button
                onClick={() => handleLinkClick("contact")}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#141413] text-[#F5F2EA] font-mono text-xs uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-all duration-200 shadow-xs border border-[#141413] cursor-pointer"
              >
                <span>Let's talk</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </MagneticButton>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => handleLinkClick("chai")}
              className={`px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-colors border border-[#141413] cursor-pointer ${
                currentPage === "chai"
                  ? "bg-[#D4F050] text-[#141413] font-bold"
                  : isWhiteTheme
                  ? "bg-white text-[#141413] hover:bg-[#D4F050]"
                  : "bg-[#FAF8F2] text-[#141413] hover:bg-[#D4F050]"
              }`}
              title="Buy Me a Chai"
            >
              ☕
            </button>
            <button
              onClick={() => handleLinkClick("contact")}
              className="px-3.5 py-1.5 rounded-full bg-[#141413] text-[#F5F2EA] font-mono text-xs uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-colors"
            >
              Talk ↗
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-full border border-[#141413]/15 text-[#141413] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] cursor-pointer ${
                isWhiteTheme ? "bg-white" : "bg-[#FAF8F2]"
              }`}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at top right)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at top right)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at top right)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#141413] text-[#F5F2EA] flex flex-col justify-between p-6 sm:p-10 md:hidden"
          >
            {/* Top Row with Close & Status */}
            <div className="flex items-center justify-between pt-16 border-b border-white/10 pb-6">
              <div className="flex items-center gap-2 font-mono text-xs text-[#D4F050]">
                <span className="w-2 h-2 rounded-full bg-[#D4F050] animate-pulse" />
                <span>{PORTFOLIO_DATA.personal.statusText}</span>
              </div>
              <div className="font-mono text-xs text-[#9E9A91]">Gurgaon, India</div>
            </div>

            {/* Menu Links */}
            <nav className="flex flex-col space-y-4 py-8">
              {navLinks.map((link, idx) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05, duration: 0.4 }}
                  onClick={() => handleLinkClick(link.id)}
                  className="flex items-baseline justify-between text-left group cursor-pointer"
                >
                  <span
                    className={`font-display text-3xl sm:text-4xl font-bold tracking-tight transition-colors ${
                      currentPage === link.id
                        ? "text-[#D4F050]"
                        : "text-[#F5F2EA] group-hover:text-[#D4F050]"
                    }`}
                  >
                    {link.label}
                  </span>
                  <span className="font-mono text-xs text-[#6B6862] group-hover:text-[#D4F050]">
                    0{idx + 1}
                  </span>
                </motion.button>
              ))}
            </nav>

            {/* Bottom Info & Social */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 font-mono text-xs text-[#9E9A91]">
              <div>
                <p className="text-white font-medium">{PORTFOLIO_DATA.personal.email}</p>
                <p>{PORTFOLIO_DATA.personal.phone}</p>
              </div>
              <div className="flex gap-4">
                <a
                  href={PORTFOLIO_DATA.personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D4F050] transition-colors"
                >
                  LinkedIn ↗
                </a>
                <a
                  href="https://github.com/BCABro-9667"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D4F050] transition-colors"
                >
                  GitHub ↗
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
