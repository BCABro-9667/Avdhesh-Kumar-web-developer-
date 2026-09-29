import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight, Trophy, GraduationCap, Briefcase, FolderGit2, Github, Linkedin, Instagram, Facebook, MessageCircle, Mail } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { MagneticButton } from "./MagneticButton";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { useSiteSettings } from "../context/SiteSettingsContext";

// Stat counter hook
const StatCard: React.FC<{
  value: string;
  label: string;
  detail: string;
  icon: React.ReactNode;
  delay: number;
}> = ({ value, label, detail, icon, delay }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    // Parse value details
    if (value === "2+") {
      let count = 0;
      const interval = setInterval(() => {
        count += 1;
        if (count >= 2) {
          setDisplayValue("2+");
          clearInterval(interval);
        } else {
          setDisplayValue(`${count}+`);
        }
      }, 180);
      return () => clearInterval(interval);
    } else if (value === "3" || value === "6") {
      const targetNum = parseInt(value, 10);
      let count = 0;
      const interval = setInterval(() => {
        count += 1;
        setDisplayValue(`${count}`);
        if (count >= targetNum) clearInterval(interval);
      }, 120);
      return () => clearInterval(interval);
    } else if (value === "8.0") {
      let current = 5.0;
      const interval = setInterval(() => {
        current = Math.min(8.0, current + 0.3);
        setDisplayValue(current.toFixed(1));
        if (current >= 8.0) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    } else if (value === "3×") {
      let count = 0;
      const interval = setInterval(() => {
        count += 1;
        setDisplayValue(`${count}×`);
        if (count >= 3) clearInterval(interval);
      }, 160);
      return () => clearInterval(interval);
    } else {
      setDisplayValue(value);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="p-4 sm:p-7 rounded-2xl bg-[#FAF8F2] border border-[#141413]/15 shadow-[2px_2px_0px_rgba(20,20,19,0.08)] hover:shadow-[4px_4px_0px_#141413] hover:border-[#141413] transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="p-2 sm:p-2.5 rounded-xl bg-[#F5F2EA] text-[#141413] group-hover:bg-[#D4F050] transition-colors border border-[#141413]/10">
          {icon}
        </div>
        <span className="font-mono text-[9px] sm:text-[10px] text-[#6B6862] uppercase tracking-widest">
          METRIC
        </span>
      </div>

      <div className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#141413] mb-1">
        {displayValue}
      </div>

      <div className="font-sans font-semibold text-xs sm:text-base text-[#141413] mb-1">
        {label}
      </div>

      <p className="font-sans text-[11px] sm:text-xs text-[#6B6862] leading-relaxed line-clamp-2 sm:line-clamp-none">
        {detail}
      </p>
    </motion.div>
  );
};

interface AboutProps {
  onNavigate?: (page: string) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
  const { downloadResume } = useSiteSettings();

  const handleDownloadResume = () => {
    downloadResume();
  };

  const statIcons = [
    <Briefcase className="w-5 h-5" />,
    <FolderGit2 className="w-5 h-5" />,
    <GraduationCap className="w-5 h-5" />,
    <Trophy className="w-5 h-5 text-[#A5C418]" />,
  ];

  return (
    <section id="about" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="01 / ABOUT ME"
          title="Developer. Problem solver. Always learning."
          subtitle="Combining computational depth, clean code standards, and practical product execution."
        />

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16 sm:mb-20">
          {/* Left Column: Core Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-display text-2xl sm:text-3xl text-[#141413] font-medium leading-relaxed"
            >
              {PORTFOLIO_DATA.personal.aboutBio1}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base sm:text-lg text-[#6B6862] font-normal leading-relaxed"
            >
              {PORTFOLIO_DATA.personal.aboutBio2}
            </motion.p>

            {/* Row 1: Social Media Platform Icons Only (no text names) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="pt-4 flex items-center gap-3"
            >
              <MagneticButton strength={0.3} asAnchor href="https://github.com/BCABro-9667" target="_blank" rel="noopener noreferrer">
                <span
                  title="GitHub"
                  aria-label="GitHub"
                  className="w-11 h-11 rounded-full bg-[#141413] text-[#F5F2EA] hover:bg-[#D4F050] hover:text-[#141413] border border-[#141413] flex items-center justify-center transition-all duration-200 shadow-[2px_2px_0px_#141413] cursor-pointer"
                >
                  <Github className="w-4 h-4" />
                </span>
              </MagneticButton>

              <MagneticButton strength={0.3} asAnchor href={PORTFOLIO_DATA.personal.linkedin} target="_blank" rel="noopener noreferrer">
                <span
                  title="LinkedIn"
                  aria-label="LinkedIn"
                  className="w-11 h-11 rounded-full bg-[#141413] text-[#F5F2EA] hover:bg-[#D4F050] hover:text-[#141413] border border-[#141413] flex items-center justify-center transition-all duration-200 shadow-[2px_2px_0px_#141413] cursor-pointer"
                >
                  <Linkedin className="w-4 h-4" />
                </span>
              </MagneticButton>

              <MagneticButton strength={0.3} asAnchor href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                <span
                  title="Instagram"
                  aria-label="Instagram"
                  className="w-11 h-11 rounded-full bg-[#141413] text-[#F5F2EA] hover:bg-[#D4F050] hover:text-[#141413] border border-[#141413] flex items-center justify-center transition-all duration-200 shadow-[2px_2px_0px_#141413] cursor-pointer"
                >
                  <Instagram className="w-4 h-4" />
                </span>
              </MagneticButton>

              <MagneticButton strength={0.3} asAnchor href="https://www.chess.com/member/prankmaster5" target="_blank" rel="noopener noreferrer">
                <span
                  title="Chess.com"
                  aria-label="Chess.com"
                  className="w-11 h-11 rounded-full bg-[#141413] text-[#F5F2EA] hover:bg-[#D4F050] hover:text-[#141413] border border-[#141413] flex items-center justify-center transition-all duration-200 shadow-[2px_2px_0px_#141413] cursor-pointer"
                >
                  <span className="text-base leading-none select-none">♞</span>
                </span>
              </MagneticButton>

              <MagneticButton strength={0.3} asAnchor href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                <span
                  title="Facebook"
                  aria-label="Facebook"
                  className="w-11 h-11 rounded-full bg-[#141413] text-[#F5F2EA] hover:bg-[#D4F050] hover:text-[#141413] border border-[#141413] flex items-center justify-center transition-all duration-200 shadow-[2px_2px_0px_#141413] cursor-pointer"
                >
                  <Facebook className="w-4 h-4" />
                </span>
              </MagneticButton>

              <MagneticButton strength={0.3} asAnchor href="https://wa.me/919667346203" target="_blank" rel="noopener noreferrer">
                <span
                  title="WhatsApp"
                  aria-label="WhatsApp"
                  className="w-11 h-11 rounded-full bg-[#141413] text-[#F5F2EA] hover:bg-[#D4F050] hover:text-[#141413] border border-[#141413] flex items-center justify-center transition-all duration-200 shadow-[2px_2px_0px_#141413] cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                </span>
              </MagneticButton>

              <MagneticButton strength={0.3} asAnchor href="mailto:avdhesh6968@gmail.com">
                <span
                  title="Email"
                  aria-label="Email"
                  className="w-11 h-11 rounded-full bg-[#141413] text-[#F5F2EA] hover:bg-[#D4F050] hover:text-[#141413] border border-[#141413] flex items-center justify-center transition-all duration-200 shadow-[2px_2px_0px_#141413] cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                </span>
              </MagneticButton>
            </motion.div>

            {/* Row 2: Download Resume and Current Portfolio in one single line */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="pt-2 flex items-center gap-2.5 sm:gap-3 w-full max-w-md"
            >
              <button
                onClick={handleDownloadResume}
                className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3.5 rounded-full bg-[#D4F050] text-[#141413] font-mono text-[11px] sm:text-xs uppercase tracking-wider font-bold hover:bg-[#141413] hover:text-[#F5F2EA] transition-colors border-2 border-[#141413] shadow-[2px_2px_0px_#141413] cursor-pointer whitespace-nowrap"
              >
                <span>Download Resume</span>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              </button>

              <a
                href={PORTFOLIO_DATA.personal.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3.5 rounded-full bg-[#FAF8F2] text-[#141413] font-mono text-[11px] sm:text-xs uppercase tracking-wider font-semibold hover:bg-[#141413] hover:text-[#D4F050] transition-colors border-2 border-[#141413] shadow-[2px_2px_0px_#141413] cursor-pointer whitespace-nowrap text-center"
              >
                <span>Current Portfolio</span>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              </a>
            </motion.div>
          </div>

          {/* Right Column: Editorial Profile Card with Swiss aesthetic */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="p-7 sm:p-8 rounded-3xl bg-[#FAF8F2] border border-[#141413]/20 shadow-[4px_4px_0px_#141413] relative overflow-hidden space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#141413]/10 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#141413] shadow-[2px_2px_0px_#141413] shrink-0 bg-[#D4F050]">
                    <img
                      src="/avdhesh-kumar.png"
                      alt="Avdhesh Kumar"
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm text-[#141413]">
                      {PORTFOLIO_DATA.personal.name}
                    </div>
                    <div className="font-mono text-[10px] tracking-widest text-[#6B6862] uppercase">
                      IDENTITY CARD
                    </div>
                  </div>
                </div>
                <div className="px-2.5 py-0.5 rounded-full bg-[#D4F050] text-[#141413] font-mono text-[10px] font-bold uppercase border border-[#141413]/20">
                  VERIFIED
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs sm:text-sm">
                <div className="flex justify-between py-1 border-b border-[#141413]/5">
                  <span className="text-[#6B6862]">Location:</span>
                  <span className="text-[#141413] font-medium">{PORTFOLIO_DATA.personal.location}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#141413]/5">
                  <span className="text-[#6B6862]">Current Degree:</span>
                  <span className="text-[#141413] font-medium">MCA (2025–2027)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#141413]/5">
                  <span className="text-[#6B6862]">Completed:</span>
                  <span className="text-[#141413] font-medium">BCA (CGPA: 8.0)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#141413]/5">
                  <span className="text-[#6B6862]">Primary Stack:</span>
                  <span className="text-[#141413] font-medium">React • Next.js • Node.js</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#141413]/5">
                  <span className="text-[#6B6862]">Strengths:</span>
                  <span className="text-[#141413] font-medium text-right">Multitasking • Team Work • Fast Learner</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#141413]/5">
                  <span className="text-[#6B6862]">Weaknesses:</span>
                  <span className="text-[#141413] font-medium text-right">Weak Communication • Overthinking</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#6B6862]">Mindset:</span>
                  <span className="text-[#141413] font-medium">Tactical & Resilient</span>
                </div>
              </div>

             

              {onNavigate && (
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate("about")}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#141413] text-[#F5F2EA] font-mono text-xs uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-colors border border-[#141413] cursor-pointer"
                  >
                    <span>Explore more about me ↗</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Animated Statistics Grid: 2 in a row horizontally on mobile, 4 in a row on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {PORTFOLIO_DATA.stats.map((stat, idx) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              detail={stat.detail}
              icon={statIcons[idx]}
              delay={0.1 * idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
