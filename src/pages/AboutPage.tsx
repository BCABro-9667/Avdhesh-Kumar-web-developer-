import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Download, Linkedin, Github, Instagram, Facebook, MessageCircle, Mail, Globe, Trophy, Sparkles, CheckCircle2, TrendingUp, ArrowUpRight } from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { SectionHeading } from "../components/SectionHeading";
import { Experience } from "../components/Experience";
import { Education } from "../components/Education";
import { Skills } from "../components/Skills";
import { Services } from "../components/Services";
import { Testimonials } from "../components/Testimonials";
import { MagneticButton } from "../components/MagneticButton";
import { useSiteSettings } from "../context/SiteSettingsContext";

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

const HOBBIES = [
  {
    id: "chess",
    number: "01",
    tag: "4× CHAMPION • TACTICAL MINDSET",
    title: "Competitive Chess",
    quote: "Every move has a consequence. Think three moves ahead.",
    description:
      "Competitive chess is my ultimate mental gymnasium. As a 4-time College Chess Champion, tournament matches have forged my deep strategic patience, acute pattern recognition, and methodical anticipation under time pressure — principles that directly elevate every line of production software I architect.",
    traits: ["4× Champion", "Tournament Blitz", "Tactical Patience", "Endgame Calculation"],
    image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1000&q=80",
    imageCaption: "♟ Tournament Chess Match",
    tiltClass: "-rotate-3 group-hover:-rotate-6",
  },
  {
    id: "traveling",
    number: "02",
    tag: "WANDERLUST • HIGH ALTITUDE",
    title: "Traveling & Mountain Treks",
    quote: "New horizons bring fresh perspectives and unclouded vision.",
    description:
      "Exploring serene mountain passes, historic roads, and vibrant cultural hubs across India recharges my creative mind. Disconnecting from code to immerse in rugged trails and uncharted valleys instills humility, adaptability, and an expansive worldview.",
    traits: ["Mountain Valleys", "Road Journeys", "Cultural Immersion", "High-Altitude Trails"],
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80",
    imageCaption: "⛰ Wanderlust Road Journeys",
    tiltClass: "rotate-3 group-hover:rotate-6",
  },
  {
    id: "exploring",
    number: "03",
    tag: "PERPETUAL CURIOSITY",
    title: "Exploring New Things",
    quote: "Stay relentlessly curious about what tomorrow could be.",
    description:
      "Perpetually drawn to the bleeding edge — experimenting with generative AI agents, cutting-edge frontend tooling, spatial design paradigms, creative web animations, and novel hardware tinkering. Constant curiosity transforms technology into a playground.",
    traits: ["Emerging Frameworks", "AI Prototyping", "Creative Design", "Lifelong Learning"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
    imageCaption: "⚡ Experimental Tech & Tinkering",
    tiltClass: "-rotate-2 group-hover:-rotate-5",
  },
];

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { downloadResume } = useSiteSettings();
  return (
    <div className="pt-28 sm:pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="max-w-4xl mb-16">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#6B6862] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#D4F050] border border-[#141413]/30" />
            <span>ABOUT AVDHESH KUMAR</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#141413] leading-[1.15] mb-6">
            Developer. Problem solver.{" "}
            <span className="underline decoration-[#D4F050] decoration-4 underline-offset-8">
              Always learning.
            </span>
          </h1>

          <p className="font-sans text-lg sm:text-xl text-[#6B6862] leading-relaxed">
            Full-Stack and Frontend Web Developer based in Gurgaon, India. Focused on building high-performance, accessible web applications with modern React, Next.js, and Node.js.
          </p>
        </div>

        {/* Main About Composition: Big Photo (Left on Desktop, Top on Mobile) + About Me Content (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-16 sm:mb-20">
          {/* Left Column (Desktop: Left, Mobile: First/Top): Big Portrait Photo */}
          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#141413] shadow-[8px_8px_0px_#141413] bg-[#FAF8F2] group">
              {/* Top Accent Floating Tag */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141413]/85 backdrop-blur-md text-[#F5F2EA] border border-[#141413]/20 shadow-xs font-mono text-[10px] tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-[#D4F050]" />
                <span>AVDHESH KUMAR</span>
              </div>

              {/* Big Editorial Portrait Photograph */}
              <div className="w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] relative overflow-hidden bg-[#141413]">
                <img
                  src="/avdhesh-kumar.png"
                  alt="Avdhesh Kumar - Developer Portrait"
                  className="w-full h-full object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                  loading="eager"
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
                    Full-Stack & Frontend Web Developer
                  </div>
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-[#D4F050] text-[#141413] font-bold uppercase border border-[#141413]/20 shrink-0">
                  Gurgaon, India
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (Desktop: Right, Mobile: Second/Below Photo): About Me Content */}
          <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-[#141413]/85 leading-relaxed">
            <div className="font-mono text-xs uppercase tracking-widest text-[#6B6862] flex items-center gap-2 border-b border-[#141413]/10 pb-3">
              <span className="w-2 h-2 rounded-full bg-[#D4F050] border border-[#141413]/40" />
              <span>NARRATIVE & BACKGROUND</span>
            </div>

            <p>
              I am currently pursuing my <strong>Master of Computer Applications (MCA)</strong> at DPG Degree College, following a <strong>Bachelor of Computer Applications (BCA)</strong> graduated with an <strong>8.0 CGPA</strong> distinction.
            </p>
            <p>
              My professional journey includes over 9 months of intensive frontend and IT web engineering internships across <strong>Estovir Technologies</strong> and <strong>Reachcure Healthcare</strong>. I specialize in building responsive Next.js/React applications, custom WordPress components, on-page SEO architectures, and integrating RESTful APIs with Node.js and MongoDB/SQL databases.
            </p>
            <p>
              Beyond development, I am a <strong>4-time College Chess Champion</strong>. Competitive chess has deeply honed my approach to software engineering: strategic planning, deep concentration, pattern recognition, and anticipating edge cases before writing production code.
            </p>

            {/* Strategic Chess Mindset highlight box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F5F2EA] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#141413] text-[#D4F050] flex items-center justify-center font-bold text-xl border border-[#141413] shrink-0 shadow-[2px_2px_0px_#D4F050]">
                ♟
              </div>
              <div>
                <div className="font-display font-bold text-sm sm:text-base text-[#141413]">
                  Strategic Mindset & Tournament Focus
                </div>
                <div className="font-mono text-xs text-[#6B6862] mt-0.5">
                  Analytical problem solving and methodical decision-making influenced by competitive tournament chess.
                </div>
              </div>
            </div>

            {/* Social Media Platform Icons Only (no text names) */}
            <div className="pt-2">
              <div className="font-mono text-xs uppercase tracking-widest text-[#6B6862] mb-3">
                DIRECT CHANNELS & PROFILES
              </div>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <a
                  href="https://github.com/BCABro-9667"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub"
                  aria-label="GitHub"
                  className="w-11 h-11 rounded-full bg-[#141413] text-[#F5F2EA] hover:bg-[#D4F050] hover:text-[#141413] border border-[#141413] flex items-center justify-center transition-all duration-200 shadow-[2px_2px_0px_#141413] cursor-pointer"
                >
                  <Github className="w-4 h-4" />
                </a>

                <a
                  href={PORTFOLIO_DATA.personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                  aria-label="LinkedIn"
                  className="w-11 h-11 rounded-full bg-[#141413] text-[#F5F2EA] hover:bg-[#D4F050] hover:text-[#141413] border border-[#141413] flex items-center justify-center transition-all duration-200 shadow-[2px_2px_0px_#141413] cursor-pointer"
                >
                  <Linkedin className="w-4 h-4" />
                </a>

                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                  aria-label="Instagram"
                  className="w-11 h-11 rounded-full bg-[#141413] text-[#F5F2EA] hover:bg-[#D4F050] hover:text-[#141413] border border-[#141413] flex items-center justify-center transition-all duration-200 shadow-[2px_2px_0px_#141413] cursor-pointer"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                <a
                  href="https://www.chess.com/member/prankmaster5"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Chess.com"
                  aria-label="Chess.com"
                  className="w-11 h-11 rounded-full bg-[#141413] text-[#F5F2EA] hover:bg-[#D4F050] hover:text-[#141413] border border-[#141413] flex items-center justify-center transition-all duration-200 shadow-[2px_2px_0px_#141413] cursor-pointer"
                >
                  <span className="text-base leading-none select-none">♞</span>
                </a>

                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook"
                  aria-label="Facebook"
                  className="w-11 h-11 rounded-full bg-[#141413] text-[#F5F2EA] hover:bg-[#D4F050] hover:text-[#141413] border border-[#141413] flex items-center justify-center transition-all duration-200 shadow-[2px_2px_0px_#141413] cursor-pointer"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                <a
                  href="https://wa.me/919667346203"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="WhatsApp"
                  aria-label="WhatsApp"
                  className="w-11 h-11 rounded-full bg-[#141413] text-[#F5F2EA] hover:bg-[#D4F050] hover:text-[#141413] border border-[#141413] flex items-center justify-center transition-all duration-200 shadow-[2px_2px_0px_#141413] cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                <a
                  href="mailto:avdhesh6968@gmail.com"
                  title="Email"
                  aria-label="Email"
                  className="w-11 h-11 rounded-full bg-[#141413] text-[#F5F2EA] hover:bg-[#D4F050] hover:text-[#141413] border border-[#141413] flex items-center justify-center transition-all duration-200 shadow-[2px_2px_0px_#141413] cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Download Resume and Current Portfolio in one single line */}
            <div className="pt-2 flex items-center gap-2.5 sm:gap-3 w-full max-w-md">
              <button
                onClick={downloadResume}
                className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3.5 rounded-full bg-[#D4F050] text-[#141413] font-mono text-[11px] sm:text-xs uppercase tracking-wider font-bold hover:bg-[#141413] hover:text-[#F5F2EA] transition-colors border-2 border-[#141413] shadow-[2px_2px_0px_#141413] cursor-pointer whitespace-nowrap"
              >
                <span>Download Resume</span>
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
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
            </div>
          </div>
        </div>

        {/* Stats & Highlights Section: Horizontally Aligned, Strictly 2 in a Row on Mobile, 4 in a Row on Desktop */}
        <div className="mb-24 p-6 sm:p-8 rounded-3xl bg-[#FAF8F2] border-2 border-[#141413] shadow-[8px_8px_0px_#141413]">
          <div className="flex items-center justify-between border-b border-[#141413]/10 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4F050] border border-[#141413]/30" />
              <div className="font-mono text-xs uppercase tracking-widest text-[#6B6862]">
                KEY STATS & HIGHLIGHTS
              </div>
            </div>
            <span className="font-mono text-xs text-[#141413] font-bold px-2.5 py-0.5 rounded-full bg-[#D4F050] border border-[#141413]/20">
              2026 ACTIVE
            </span>
          </div>

          {/* Strictly 2 in a row on mobile devices, 4 in a row on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {PORTFOLIO_DATA.stats.map((stat, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-2xl bg-[#F5F2EA] border border-[#141413]/15 hover:border-[#141413] transition-all hover:shadow-[3px_3px_0px_#141413]"
              >
                <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141413] tracking-tight">
                  {stat.value}
                </div>
                <div className="font-sans font-semibold text-xs sm:text-sm text-[#141413] mt-1.5">
                  {stat.label}
                </div>
                <div className="font-mono text-[10px] sm:text-xs text-[#6B6862] mt-0.5 line-clamp-2">
                  {stat.detail}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses Section */}
        <div className="mb-24">
          <SectionHeading
            label="SELF AWARENESS"
            title="Strengths & areas of growth"
            subtitle="An honest assessment of my core capabilities, collaborative strengths, and personal focus areas."
            className="mb-12!"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Strengths Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#FAF8F2] border-2 border-[#141413] shadow-[8px_8px_0px_#141413] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#141413]/10 pb-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-[#D4F050] border border-[#141413] flex items-center justify-center text-[#141413]">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                    <span className="font-display font-bold text-xl sm:text-2xl text-[#141413]">
                      Strengths
                    </span>
                  </div>
                  <span className="font-mono text-[10px] sm:text-xs px-3 py-1 rounded-full bg-[#D4F050] text-[#141413] font-bold uppercase tracking-wider border border-[#141413]/20">
                    3 Core Assets
                  </span>
                </div>

                <div className="space-y-4">
                  {PORTFOLIO_DATA.strengths.map((item, idx) => (
                    <div
                      key={item.title}
                      className="p-5 rounded-2xl bg-[#F5F2EA] border border-[#141413]/10 hover:border-[#141413] transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-md bg-[#141413] text-[#F5F2EA] font-mono text-xs font-bold flex items-center justify-center">
                            0{idx + 1}
                          </span>
                          <h3 className="font-display font-bold text-base sm:text-lg text-[#141413]">
                            {item.title}
                          </h3>
                        </div>
                        <span className="font-mono text-[10px] text-[#6B6862] uppercase tracking-wider hidden sm:inline-block">
                          {item.tagline}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#6B6862] leading-relaxed pl-8.5">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#141413]/10 font-mono text-xs text-[#6B6862] flex items-center justify-between">
                <span>Working style: Proactive & adaptive</span>
                <span className="text-[#141413] font-semibold">High output</span>
              </div>
            </div>

            {/* Weaknesses Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#FAF8F2] border-2 border-[#141413] shadow-[8px_8px_0px_#141413] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#141413]/10 pb-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-[#E8E5F7] border border-[#141413] flex items-center justify-center text-[#141413]">
                      <TrendingUp className="w-4 h-4 text-[#7A74A8]" />
                    </span>
                    <span className="font-display font-bold text-xl sm:text-2xl text-[#141413]">
                      Weaknesses
                    </span>
                  </div>
                  <span className="font-mono text-[10px] sm:text-xs px-3 py-1 rounded-full bg-[#E8E5F7] text-[#141413] font-bold uppercase tracking-wider border border-[#141413]/20">
                    Active Growth
                  </span>
                </div>

                <div className="space-y-4">
                  {PORTFOLIO_DATA.weaknesses.map((item, idx) => (
                    <div
                      key={item.title}
                      className="p-5 rounded-2xl bg-[#F5F2EA] border border-[#141413]/10 hover:border-[#141413] transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-md bg-[#141413]/10 text-[#141413] font-mono text-xs font-bold flex items-center justify-center">
                            0{idx + 1}
                          </span>
                          <h3 className="font-display font-bold text-base sm:text-lg text-[#141413]">
                            {item.title}
                          </h3>
                        </div>
                        <span className="font-mono text-[10px] text-[#FF6B35] font-semibold uppercase tracking-wider hidden sm:inline-block">
                          {item.tagline}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#6B6862] leading-relaxed pl-8.5">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#141413]/10 font-mono text-xs text-[#6B6862] flex items-center justify-between">
                <span>Growth philosophy: Continuous refinement</span>
                <span className="text-[#141413] font-semibold">Active improvement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-24">
          <Skills />
        </div>

        {/* Experience Section */}
        <div className="mb-24">
          <Experience />
        </div>

        {/* Education & Credentials (with SERVICES & EXPERTISE after Government & Sector Certifications) */}
        <div className="mb-24">
          <Education
            afterCertifications={
              <Services onNavigate={onNavigate} isPageSection={true} />
            }
          />
        </div>

        {/* ======================================================== */}
        {/* MY HOBBIES & PASSIONS SECTION (Immediately after Honors, Competitions & Scholarships) */}
        {/* ======================================================== */}
        <section id="hobbies" className="mb-24 sm:mb-32">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#141413]/10 pb-4 mb-10 sm:mb-14">
            <div>
              <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-[#6B6862] mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4F050] border border-[#141413]/30" />
                <span>BEYOND THE CODE • PERSONAL PURSUITS</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#141413]">
                My Hobbies & Passions
              </h2>
            </div>
            <p className="font-mono text-xs text-[#6B6862] max-w-xs sm:text-right">
              Competitive chess, mountain treks & perpetual curiosity — tactical thinking, wanderlust, and endless learning.
            </p>
          </div>

          {/* Stacked Cards Interaction */}
          <div className="relative">
            {HOBBIES.map((hobby, idx) => {
              const isLast = idx === HOBBIES.length - 1;
              return (
                <div
                  key={hobby.id}
                  className={`sticky transition-all duration-300 ${
                    isLast ? "mb-0" : "mb-20 sm:mb-28"
                  }`}
                  style={{
                    top: `calc(4.75rem + ${idx * 24}px)`,
                    zIndex: (idx + 1) * 10,
                  }}
                >
                  <div className="relative rounded-3xl bg-[#FAF8F2] border-2 border-[#141413] shadow-[8px_8px_0px_#141413] hover:shadow-[10px_10px_0px_#141413] transition-all duration-300 p-6 sm:p-10 overflow-hidden group">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      {/* Left Side: Hobby Details */}
                      <div className="lg:col-span-7 flex flex-col justify-between">
                        <div>
                          {/* Number & Badge */}
                          <div className="flex items-center gap-3 mb-4">
                            <span className="font-mono text-2xl sm:text-3xl font-black text-[#141413]/30 group-hover:text-[#141413] transition-colors">
                              {hobby.number}
                            </span>
                            <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#D4F050] text-[#141413] font-bold uppercase tracking-wider border border-[#141413]/20">
                              {hobby.tag}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#141413] mb-3 group-hover:translate-x-1 transition-transform tracking-tight">
                            {hobby.title}
                          </h3>

                          {/* Quote */}
                          <div className="font-mono text-xs sm:text-sm text-[#141413]/70 italic border-l-2 border-[#D4F050] pl-3 my-3">
                            "{hobby.quote}"
                          </div>

                          {/* Description */}
                          <p className="font-sans text-sm sm:text-base text-[#141413]/85 leading-relaxed mb-6">
                            {hobby.description}
                          </p>
                        </div>

                        {/* Trait Pills */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#141413]/10">
                          {hobby.traits.map((trait) => (
                            <span
                              key={trait}
                              className="font-mono text-xs px-3 py-1 rounded-full bg-[#F5F2EA] text-[#141413] border border-[#141413]/15 font-medium group-hover:border-[#141413]/30 transition-colors"
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right Side: Tilted Aesthetic Image */}
                      <div className="lg:col-span-5 flex items-center justify-center p-2 sm:p-4">
                        <div
                          className={`relative w-full max-w-[340px] sm:max-w-[380px] aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#141413] shadow-[6px_6px_0px_#141413] transition-all duration-500 ease-out transform ${hobby.tiltClass} group-hover:scale-105 group-hover:shadow-[10px_10px_0px_#D4F050] group-hover:-translate-y-2 cursor-pointer`}
                        >
                          <img
                            src={hobby.image}
                            alt={hobby.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 border-0 shadow-none outline-none"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity pointer-events-none" />
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[#F5F2EA] font-mono text-[11px] pointer-events-none">
                            <span className="px-2.5 py-1 rounded-full bg-[#141413]/90 backdrop-blur-md border border-white/20">
                              {hobby.imageCaption}
                            </span>
                            <span className="w-2 h-2 rounded-full bg-[#D4F050] animate-ping" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Collaborators / Testimonials */}
        <div>
          <Testimonials />
        </div>
      </div>
    </div>
  );
};
