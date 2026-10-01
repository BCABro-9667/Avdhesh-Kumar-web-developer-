import React from "react";
import { motion } from "motion/react";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { PORTFOLIO_DATA } from "../data/portfolio";

interface HeroProps {
  onExploreClick: () => void;
  onContactClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onContactClick }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[90vh] pt-24 sm:pt-32 pb-12 flex flex-col justify-between overflow-x-clip"
    >
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none bg-[linear-gradient(to_right,#141413_1px,transparent_1px),linear-gradient(to_bottom,#141413_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Top Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#FAF8F2] border border-[#141413]/15 shadow-xs mb-6 sm:mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#A5C418] ring-4 ring-[#D4F050]/50 animate-pulse" />
          <span className="font-mono text-xs tracking-wider uppercase text-[#141413] font-medium">
            {PORTFOLIO_DATA.personal.statusText}
          </span>
          <span className="text-[#6B6862]/60 font-mono text-xs">/</span>
          <span className="font-mono text-xs text-[#6B6862] hidden sm:inline">
            GURGAON, INDIA
          </span>
        </motion.div>

        {/* Main Grid: Headline + Developer Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
          {/* Left Column: Editorial Headline & CTAs (7 of 12 columns on desktop) */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6 sm:space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-tight text-[#141413] leading-[1.08]"
            >
              I'm{" "}
              <span className="relative inline-block text-[#141413] italic font-serif font-light underline decoration-[#D4F050] decoration-[4px] underline-offset-8">
                Avdhesh Kumar
              </span>
              , a developer who builds{" "}
              <span className="relative inline-block px-3 py-0.5 bg-[#D4F050] text-[#141413] rounded-xl -rotate-1 border border-[#141413] shadow-[3px_3px_0px_#141413]">
                for the web.
              </span>
            </motion.h1>

            {/* Identity Line */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-2 font-mono text-xs sm:text-sm font-semibold text-[#141413]"
            >
              <span className="px-3 py-1 rounded-full bg-[#FAF8F2] border border-[#141413]/20 shadow-2xs">
                MCA Student
              </span>
              <span className="text-[#6B6862]">·</span>
              <span className="px-3 py-1 rounded-full bg-[#FAF8F2] border border-[#141413]/20 shadow-2xs">
                BCA Graduate (DPG College)
              </span>
              <span className="text-[#6B6862]">·</span>
              <span className="px-3 py-1 rounded-full bg-[#FAF8F2] border border-[#141413]/20 shadow-2xs">
                Chess Enthusiast
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg md:text-xl text-[#6B6862] font-normal leading-relaxed max-w-xl"
            >
              Full-stack & frontend web developer building modern, responsive and user-focused web applications with React, Next.js, Node.js and MongoDB.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 pt-1 sm:pt-2"
            >
              <MagneticButton strength={0.3}>
                <button
                  onClick={onExploreClick}
                  className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-[#141413] text-[#F5F2EA] font-mono text-xs sm:text-sm uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-all duration-300 shadow-[4px_4px_0px_rgba(20,20,19,0.15)] border border-[#141413] cursor-pointer"
                >
                  <span>Explore my work</span>
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </button>
              </MagneticButton>

              <MagneticButton strength={0.25}>
                <button
                  onClick={onContactClick}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 rounded-full bg-[#FAF8F2] text-[#141413] font-mono text-xs sm:text-sm uppercase tracking-wider hover:bg-[#D4F050] transition-all duration-200 border border-[#141413]/20 hover:border-[#141413] cursor-pointer"
                >
                  <span>Say hello</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </MagneticButton>

              <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-[#141413]/15 font-mono text-xs text-[#6B6862]">
                <span>MCA Student & Full-Stack Engineer</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Developer Photo Card (5 of 12 columns on desktop, perfectly side-by-side) */}
          <div
            className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end items-center pt-8 lg:pt-0"
            data-cursor="explore"
          >
            <motion.div
              style={{ opacity: 1 }}
              initial={{ opacity: 1, scale: 0.96, rotate: -3.5 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: [-3.5, -1.5, -4.5, -2, -3.5],
                y: [0, -7, 2, -5, 0],
                x: [0, 2, -2, 1, 0],
              }}
              transition={{
                rotate: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
                x: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
              }}
              whileHover={{
                scale: 1.04,
                rotate: 0,
                y: -8,
                transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
              }}
              className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[350px] xl:max-w-[365px] rounded-3xl overflow-hidden border-2 border-[#141413] shadow-[8px_8px_0px_#141413] sm:shadow-[12px_12px_0px_#141413] bg-[#FAF8F2] select-none group cursor-pointer transition-shadow"
            >
              {/* Top Accent Floating Tag */}
              <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141413]/90 backdrop-blur-md text-[#F5F2EA] border border-[#141413]/20 shadow-xs font-mono text-[10px] tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-[#D4F050] animate-pulse" />
                <span>AVDHESH KUMAR</span>
              </div>

              {/* Status Badge Top Right */}
              <div className="absolute top-3.5 right-3.5 z-20 px-2.5 py-1 rounded-full bg-[#D4F050] text-[#141413] font-mono text-[9px] font-black uppercase tracking-wider border border-[#141413]/30 shadow-xs">
                AVAILABLE
              </div>

              {/* Card Photo */}
              <div className="w-full aspect-[4/5] relative overflow-hidden bg-[#141413]">
                <img
                  src="/avdhesh-kumar.png"
                  alt="Avdhesh Kumar, full-stack web developer"
                  width={365}
                  height={456}
                  className="w-full h-full object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.src.includes("profile.jpg")) {
                      img.src = "/profile.jpg";
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/70 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity pointer-events-none" />
              </div>

              {/* Bottom Card Footer Details */}
              <div className="p-4 sm:p-5 bg-[#FAF8F2] border-t-2 border-[#141413] flex items-center justify-between">
                <div>
                  <div className="font-display font-bold text-sm sm:text-base text-[#141413]">
                    {PORTFOLIO_DATA.personal.name}
                  </div>
                  <div className="font-mono text-xs text-[#6B6862]">
                    Full-Stack & Frontend Dev
                  </div>
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-[#D4F050] text-[#141413] font-bold uppercase border border-[#141413]/20 shrink-0">
                  Gurgaon, IN
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 flex items-center justify-between font-mono text-xs text-[#6B6862]">
        <div className="flex items-center gap-3">
          <button
            onClick={onExploreClick}
            className="flex items-center gap-2 group hover:text-[#141413] transition-colors focus:outline-none"
          >
            <div className="w-5 h-8 rounded-full border border-[#141413]/30 flex items-start justify-center p-1 group-hover:border-[#141413]">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-1.5 rounded-full bg-[#141413]"
              />
            </div>
            <span className="tracking-widest uppercase text-[11px] font-medium">
              SCROLL TO EXPLORE
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <span>01 / 07</span>
          <span className="w-12 h-[1px] bg-[#141413]/20" />
          <span>PORTFOLIO '26</span>
        </div>
      </div>
    </section>
  );
};
