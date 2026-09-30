import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  Award,
  ShieldCheck,
  Trophy,
  Sparkles,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronDown,
  BookOpen,
  Check,
  FolderGit2,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { PORTFOLIO_DATA, EducationItem } from "../data/portfolio";
import { DpgCollegeLogo, HbseBoardLogo, SecondaryBoardLogo } from "./BrandLogos";

const renderInstitutionLogo = (degree: string, institution: string, logoUrl?: string) => {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={institution}
        className="max-h-16 max-w-[180px] w-auto object-contain mix-blend-multiply"
        loading="lazy"
        crossOrigin="anonymous"
      />
    );
  }
  if (institution.includes("DPG") || degree.includes("MCA") || degree.includes("BCA")) {
    return <DpgCollegeLogo className="w-14 h-14" />;
  }
  if (institution.includes("HBSE") || degree.includes("12th") || degree.includes("Senior Secondary")) {
    return <HbseBoardLogo className="w-14 h-14" />;
  }
  return <SecondaryBoardLogo className="w-14 h-14" />;
};

const EducationCard: React.FC<{
  edu: EducationItem;
  index: number;
}> = ({ edu, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-8 sm:pl-16 lg:pl-20"
    >
      {/* Node marker on the spine */}
      <div className="absolute left-3.5 sm:left-7.5 top-9 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-[#141413] flex items-center justify-center shadow-xs z-10">
        <div
          className={`w-2.5 h-2.5 rounded-full transition-transform duration-300 ${
            isExpanded ? "bg-[#C8E93D] scale-125" : "bg-[#141413]"
          }`}
        />
      </div>

      {/* Main Outer Card: Exactly matching reference UI */}
      <div className="rounded-[28px] sm:rounded-[32px] bg-white border-2 border-[#141413] shadow-[6px_6px_0px_#141413] p-5 sm:p-7 transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8">
          {/* ======================================================== */}
          {/* LEFT COLUMN: ~70% Content Information */}
          {/* ======================================================== */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              {/* Header Row: Program Icon, Degree Name & Status Pill */}
              <div className="flex items-center gap-3.5 mb-2.5">
                <div className="w-11 h-11 rounded-xl bg-white border-2 border-[#141413] shadow-[2px_2px_0px_#141413] flex items-center justify-center shrink-0 text-[#141413]">
                  <GraduationCap className="w-5 h-5 stroke-[2.2]" />
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="font-display font-bold text-2xl sm:text-[26px] text-[#141413] tracking-tight">
                    {edu.degree}
                  </h3>
                  <span className="px-3.5 py-1 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider bg-[#C8E93D] text-[#141413] border border-black/10">
                    {edu.statusOrGrade}
                  </span>
                </div>
              </div>

              {/* Institution Subheading - Clickable */}
              <div className="font-sans font-medium text-xs sm:text-[13px] text-[#141413]/85 mb-2.5">
                <a
                  href={edu.institutionUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/inst inline-flex items-center gap-1.5 hover:underline underline-offset-2 hover:text-[#141413] transition-colors"
                >
                  <span>{edu.institution}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#141413] opacity-60 group-hover/inst:opacity-100 group-hover/inst:translate-x-0.5 group-hover/inst:-translate-y-0.5 transition-all shrink-0" />
                </a>
              </div>

              {/* Metadata Row with Pipes */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs sm:text-[13px] text-[#4A4742] mb-3.5">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#141413]" />
                  <span>{edu.location}</span>
                </span>
                <span className="text-gray-300 select-none">|</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#141413]" />
                  <span>{edu.period}</span>
                </span>
                <span className="text-gray-300 select-none">|</span>
                <span className="flex items-center gap-1.5 font-semibold text-[#141413]">
                  <span className="w-2 h-2 rounded-full bg-[#C8E93D] shrink-0" />
                  <span>{edu.statusType === "pursuing" ? "Pursuing" : "Completed"}</span>
                </span>
              </div>

              {/* Concise Description */}
              <p className="font-sans text-sm sm:text-[15px] text-[#4A4742] leading-relaxed mb-1">
                {edu.notes}
              </p>

              {/* ======================================================== */}
              {/* EXPANDED ACCORDION CONTENT */}
              {/* ======================================================== */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="expanded-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    {/* Coursework & Specialized Subjects */}
                    {edu.coursework && edu.coursework.length > 0 && (
                      <div className="pt-6 mt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 font-display font-bold text-base text-[#141413] mb-3">
                          <BookOpen className="w-4 h-4 text-[#141413] stroke-[2.2]" />
                          <span>Core Coursework & Specialized Subjects</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {edu.coursework.map((subject) => (
                            <span
                              key={subject}
                              className="px-4 py-1.5 rounded-full font-mono text-xs bg-white text-[#141413] border border-gray-200 font-medium shadow-2xs"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Academic Achievements & Distinctions */}
                    {edu.achievements && edu.achievements.length > 0 && (
                      <div className="pt-6 mt-5 border-t border-gray-100 space-y-3.5">
                        <div className="flex items-center gap-2 font-display font-bold text-base text-[#141413]">
                          <Trophy className="w-4 h-4 text-[#A5C418] stroke-[2.2]" />
                          <span>Academic Distinctions & Highlights</span>
                        </div>
                        <div className="space-y-2.5 pl-0.5">
                          {edu.achievements.map((item, aIdx) => (
                            <div
                              key={aIdx}
                              className="flex items-start gap-2.5 text-xs sm:text-[14px] text-[#2D2B28] leading-relaxed"
                            >
                              <span className="w-4 h-4 rounded-full bg-[#C8E93D] flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-2.5 h-2.5 text-[#141413] stroke-[3]" />
                              </span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Activities & Academic Portals */}
                    {edu.activities && edu.activities.length > 0 && (
                      <div className="pt-6 mt-5 border-t border-gray-100">
                        <div className="flex items-center gap-2 font-display font-bold text-base text-[#141413] mb-3">
                          <FolderGit2 className="w-4 h-4 text-[#141413] stroke-[2.2]" />
                          <span>Academic Activities & Portals</span>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          {edu.activities.map((act, actIdx) => {
                            const isClickable = act.url && act.url !== "#";
                            return isClickable ? (
                              <a
                                key={actIdx}
                                href={act.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-mono text-xs border border-gray-200 bg-white text-[#141413] hover:border-[#141413] hover:bg-gray-50 transition-all duration-200 shadow-2xs group/act cursor-pointer"
                              >
                                <span>{act.name}</span>
                                <ExternalLink className="w-3.5 h-3.5 text-[#141413] group-hover/act:translate-x-0.5 group-hover/act:-translate-y-0.5 transition-transform" />
                              </a>
                            ) : (
                              <span
                                key={actIdx}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-mono text-xs border border-gray-200 bg-white text-[#141413] shadow-2xs"
                              >
                                <span>{act.name}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Read more / Read less trigger row at bottom */}
            <div className="border-t border-gray-100 mt-5 pt-3.5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1.5 font-display font-bold text-sm text-[#141413] hover:text-[#7A9818] transition-colors cursor-pointer group/btn"
              >
                <span>{isExpanded ? "Read less" : "Read more"}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: ~30% Branding Area (Soft Tint Sub-card) */}
          {/* ======================================================== */}
          <div className="lg:w-[320px] xl:w-[340px] shrink-0 bg-[#F3F7EC] rounded-[24px] p-6 sm:p-7 flex flex-col items-center justify-center text-center relative border border-black/5">
            {/* Circular Chevron Button in Top Right */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Read less" : "Read more"}
              title={isExpanded ? "Read less" : "Read more"}
              className="absolute top-5 right-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-[#141413] flex items-center justify-center shadow-xs cursor-pointer hover:bg-[#C8E93D] transition-colors z-10"
            >
              <ChevronDown
                className={`w-4 h-4 sm:w-5 sm:h-5 text-[#141413] transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Institution Logo / Crest with Transparent Background */}
            <div className="w-full h-20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              {renderInstitutionLogo(edu.degree, edu.institution, edu.logoUrl)}
            </div>

            {/* Clickable Institution Name with ExternalLink */}
            <a
              href={edu.institutionUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-1.5 font-display font-bold text-lg text-[#141413] hover:underline underline-offset-4 decoration-2 decoration-[#141413] transition-colors cursor-pointer max-w-full"
            >
              <span className="truncate">{edu.institution.split(",")[0]}</span>
              <ExternalLink className="w-4 h-4 text-[#141413] shrink-0 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </a>

            <span className="font-mono text-xs text-[#6B6862] mt-0.5">
              View College Website
            </span>

            {/* Quick Summary Info Box inside Right Area in Expanded State (matching Image 2) */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full mt-4 p-4 rounded-2xl bg-white shadow-xs border border-black/5 text-left space-y-2.5 font-mono text-xs"
              >
                <div className="flex items-center gap-2 text-[#4A4742]">
                  <MapPin className="w-3.5 h-3.5 text-[#141413] shrink-0" />
                  <span className="text-[#141413] truncate">{edu.location}</span>
                </div>
                <div className="flex items-center gap-2 text-[#4A4742]">
                  <Calendar className="w-3.5 h-3.5 text-[#141413] shrink-0" />
                  <span className="text-[#141413] truncate">{edu.period}</span>
                </div>
                <div className="flex items-center gap-2 text-[#4A4742]">
                  <GraduationCap className="w-3.5 h-3.5 text-[#141413] shrink-0" />
                  <span className="text-[#141413] truncate">
                    {edu.statusType === "pursuing" ? "Active Degree" : "Completed"}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#C8E93D] text-[#141413] font-bold text-[10px] uppercase border border-black/10">
                    {edu.statusOrGrade}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Education: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 70%"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="education" className="py-24 sm:py-32 relative bg-[#FAF8F2]/60 border-t border-[#141413]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="BACKGROUND"
          title="Education timeline & credentials."
          subtitle="My academic background and learning journey in Computer Applications, complemented by verified certifications and competitive achievements."
        />

        {/* Education Timeline */}
        <div ref={containerRef} className="relative max-w-5xl mx-auto mt-14 mb-24">
          {/* Animated Vertical Spine Line */}
          <div className="absolute left-3.5 sm:left-7.5 top-9 bottom-9 w-[2px] bg-[#141413]/15">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-[#141413] origin-top"
            />
          </div>

          {/* Education Cards */}
          <div className="space-y-10 sm:space-y-12">
            {PORTFOLIO_DATA.education.map((edu, idx) => (
              <EducationCard key={edu.degree} edu={edu} index={idx} />
            ))}
          </div>
        </div>

        {/* Certifications & Achievements Section */}
        <div className="space-y-12 max-w-5xl mx-auto">
          {/* Subheading: Certifications */}
          <div>
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#6B6862] mb-6">
              <ShieldCheck className="w-4 h-4 text-[#141413]" />
              <span>Government & Sector Certifications</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PORTFOLIO_DATA.certifications.map((cert, idx) => (
                <motion.div
                  key={cert.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-6 sm:p-7 rounded-2xl bg-[#F5F2EA] border-2 border-[#141413] shadow-[4px_4px_0px_#141413] flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#141413] text-[#F5F2EA] flex items-center justify-center shrink-0 border border-[#141413]">
                    <Award className="w-5 h-5 text-[#D4F050]" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="font-mono text-[11px] text-[#A5C418] uppercase tracking-wider font-bold">
                      {cert.issuer}
                    </div>
                    <h4 className="font-display text-lg font-bold text-[#141413]">
                      {cert.title}
                    </h4>
                    <p className="font-sans text-xs text-[#6B6862] leading-relaxed">
                      {cert.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Subheading: Honors & Achievements with Chess highlight */}
          <div>
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#6B6862] mb-6">
              <Trophy className="w-4 h-4 text-[#A5C418]" />
              <span>Honors, Competitions & Scholarships</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PORTFOLIO_DATA.achievements.map((item, idx) => {
                const isChess = item.iconType === "chess";
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`p-6 rounded-2xl border-2 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                      isChess
                        ? "bg-[#141413] text-[#F5F2EA] border-[#141413] shadow-[4px_4px_0px_#D4F050]"
                        : "bg-[#FAF8F2] text-[#141413] border-[#141413] shadow-[4px_4px_0px_#141413]"
                    }`}
                  >
                    {/* Subtle decorative Chessboard motif for chess achievement */}
                    {isChess && (
                      <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none">
                        <div className="grid grid-cols-4 gap-1 w-28 h-28">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-6 h-6 rounded-xs ${
                                (Math.floor(i / 4) + i) % 2 === 0 ? "bg-[#D4F050]" : "bg-white/20"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isChess
                              ? "bg-[#D4F050] text-[#141413] font-bold"
                              : "bg-[#141413]/10 text-[#141413] font-semibold"
                          }`}
                        >
                          {item.year}
                        </span>
                        {isChess && (
                          <div className="flex items-center gap-1 font-mono text-[10px] text-[#D4F050]">
                            <Sparkles className="w-3 h-3" />
                            <span>CHAMPION</span>
                          </div>
                        )}
                      </div>

                      <h4
                        className={`font-display text-xl font-bold tracking-tight mb-2 ${
                          isChess ? "text-[#F5F2EA]" : "text-[#141413]"
                        }`}
                      >
                        {item.title}
                      </h4>

                      <p
                        className={`text-xs leading-relaxed ${
                          isChess ? "text-[#9E9A91]" : "text-[#6B6862]"
                        }`}
                      >
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-current/10 font-mono text-[10px] opacity-70">
                      Verified Citation
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
