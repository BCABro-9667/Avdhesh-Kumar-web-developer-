import React from "react";
import { motion } from "motion/react";
import { ArrowDown, ArrowUpRight, Sparkles, Terminal, Code2, Layers, Cpu } from "lucide-react";
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
      className="relative min-h-[92vh] pt-28 sm:pt-36 pb-16 flex flex-col justify-between overflow-hidden"
    >
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none bg-[linear-gradient(to_right,#141413_1px,transparent_1px),linear-gradient(to_bottom,#141413_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Top Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#FAF8F2] border border-[#141413]/15 shadow-xs mb-8"
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

        {/* Main Grid: Headline + Abstract Developer Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Huge Editorial Headline & CTAs */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-bold tracking-tight text-[#141413] leading-[1.02]"
            >
              I build{" "}
              <span className="relative inline-block text-[#141413] italic font-serif font-light underline decoration-[#D4F050] decoration-[4px] underline-offset-8">
                digital
              </span>{" "}
              experiences that feel{" "}
              <span className="relative inline-block px-3.5 py-0.5 bg-[#D4F050] text-[#141413] rounded-xl -rotate-1 border border-[#141413] shadow-[3px_3px_0px_#141413]">
                alive.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-xl md:text-2xl text-[#6B6862] font-normal leading-relaxed max-w-2xl"
            >
              {PORTFOLIO_DATA.personal.heroSubtext}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <MagneticButton strength={0.3}>
                <button
                  onClick={onExploreClick}
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-[#141413] text-[#F5F2EA] font-mono text-sm uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-all duration-300 shadow-[4px_4px_0px_rgba(20,20,19,0.15)] border border-[#141413]"
                >
                  <span>Explore my work</span>
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </button>
              </MagneticButton>

              <MagneticButton strength={0.25}>
                <button
                  onClick={onContactClick}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-[#FAF8F2] text-[#141413] font-mono text-sm uppercase tracking-wider hover:bg-[#D4F050] transition-all duration-200 border border-[#141413]/20 hover:border-[#141413]"
                >
                  <span>Say hello</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </MagneticButton>

              <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-[#141413]/15 font-mono text-xs text-[#6B6862]">
                <span>MCA Student & Full-Stack Engineer</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Abstract Developer Identity Composition */}
          <div
            className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end"
            data-cursor="explore"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 flex items-center justify-center select-none"
            >
              {/* Outer Orbit 1 with Dashed Border */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-[#141413]/20"
              />

              {/* Outer Orbit 2 with Angle Markers */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-[#141413]/10 flex items-center justify-between"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#141413]/30 -translate-x-1" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#D4F050] border border-[#141413] translate-x-1" />
              </motion.div>

              {/* Inner Orbit 3 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-12 rounded-full border border-[#141413]/15"
              />

              {/* Central Core: Fully Animated Kinetic Circular Composition with User Image & Theme Colors */}
              <div className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-[#141413] via-[#1f1e1c] to-[#141413] flex items-center justify-center p-1.5 shadow-[0_0_40px_rgba(212,240,80,0.4)] border-4 border-[#D4F050] overflow-hidden group">
                {/* Rotating theme gradient background glow */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-[conic-gradient(from_0deg,#D4F050,#141413,#A5C418,#141413,#D4F050)] opacity-35 blur-sm"
                />

                {/* Pulsing rings */}
                <motion.div
                  animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-1 rounded-full border-2 border-dashed border-[#D4F050]/70 z-10 pointer-events-none"
                />

                {/* Profile Image with smooth hover scale transition */}
                <div className="relative z-20 w-full h-full rounded-full overflow-hidden border-2 border-[#141413] bg-[#141413]">
                  <img
                    src="/avdhesh-kumar.png"
                    alt="Avdhesh Kumar"
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle dark gradient overlay at bottom for name badge overlay effect */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#141413]/85 via-[#141413]/40 to-transparent py-2.5 text-center">
                    <span className="font-mono text-[10px] tracking-widest text-[#D4F050] uppercase font-bold drop-shadow">
                      AVDHESH KUMAR
                    </span>
                  </div>
                </div>

                {/* Orbiting particle dot on inner border */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 pointer-events-none z-30"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#D4F050] shadow-[0_0_12px_#D4F050]" />
                </motion.div>
              </div>

              {/* Floating Technology Badge 1: Next.js */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  x: [0, 4, 0],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-2 left-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F2] border border-[#141413] text-[#141413] font-mono text-xs font-medium shadow-[2px_2px_0px_#141413]"
              >
                <Code2 className="w-3.5 h-3.5 text-[#141413]" />
                <span>Next.js</span>
              </motion.div>

              {/* Floating Technology Badge 2: React */}
              <motion.div
                animate={{
                  y: [0, 9, 0],
                  x: [0, -6, 0],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-2 right-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4F050] border border-[#141413] text-[#141413] font-mono text-xs font-semibold shadow-[2px_2px_0px_#141413]"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>React.js</span>
              </motion.div>

              {/* Floating Technology Badge 3: Node.js */}
              <motion.div
                animate={{
                  y: [0, -6, 0],
                  x: [0, -5, 0],
                }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -left-4 -translate-y-1/2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8E5F7] border border-[#141413] text-[#141413] font-mono text-xs font-medium shadow-[2px_2px_0px_#141413]"
              >
                <Cpu className="w-3.5 h-3.5 text-[#7A74A8]" />
                <span>Node.js</span>
              </motion.div>

              {/* Floating Technology Badge 4: Full Stack */}
              <motion.div
                animate={{
                  y: [0, 8, 0],
                  x: [0, 5, 0],
                }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute top-16 -right-2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F2] border border-[#141413] text-[#141413] font-mono text-xs font-medium shadow-[2px_2px_0px_#141413]"
              >
                <Terminal className="w-3 h-3 text-[#141413]" />
                <span>REST APIs</span>
              </motion.div>
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
