import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { GraduationCap, Award, ShieldCheck, Trophy, Sparkles, Calendar, MapPin } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { PORTFOLIO_DATA } from "../data/portfolio";

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
          subtitle="Academic rigor in Computer Applications complemented by verified industry certifications and competitive achievements."
        />

        {/* Education Timeline (matching Experience timeline style) */}
        <div ref={containerRef} className="relative max-w-4xl mx-auto mt-14 mb-24">
          {/* Animated Vertical Spine Line */}
          <div className="absolute left-4 sm:left-8 top-4 bottom-4 w-[2px] bg-[#141413]/15">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-[#141413] origin-top"
            />
          </div>

          {/* Timeline Items */}
          <div className="space-y-12 sm:space-y-16">
            {PORTFOLIO_DATA.education.map((edu, idx) => {
              const isMCA = edu.degree.includes("MCA");
              const isBCA = edu.degree.includes("BCA");
              return (
                <motion.div
                  key={edu.degree}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="relative pl-12 sm:pl-20"
                >
                  {/* Node marker on the spine */}
                  <div
                    className={`absolute left-4 sm:left-8 top-6 -translate-x-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center shadow-xs ${
                      isMCA
                        ? "bg-[#141413] border-[#D4F050]"
                        : isBCA
                        ? "bg-[#FAF8F2] border-[#141413]"
                        : "bg-[#FAF8F2] border-[#141413]"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isMCA ? "bg-[#D4F050]" : isBCA ? "bg-[#141413]" : "bg-[#141413]/60"
                      }`}
                    />
                  </div>

                  {/* Education Card */}
                  <div
                    className={`p-7 sm:p-9 rounded-3xl border-2 transition-all duration-300 ${
                      isMCA
                        ? "bg-[#141413] text-[#F5F2EA] border-[#141413] shadow-[8px_8px_0px_#D4F050]"
                        : isBCA
                        ? "bg-[#FAF8F2] text-[#141413] border-[#141413] shadow-[6px_6px_0px_#141413] hover:shadow-[8px_8px_0px_#141413]"
                        : "bg-[#FAF8F2] text-[#141413] border-[#141413]/15 shadow-[4px_4px_0px_rgba(20,20,19,0.1)] hover:border-[#141413] hover:shadow-[6px_6px_0px_#141413]"
                    }`}
                  >
                    {/* Top Meta Info */}
                    <div
                      className={`flex flex-wrap items-center justify-between gap-3 border-b pb-4 mb-5 ${
                        isMCA ? "border-white/10" : "border-[#141413]/10"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div
                          className={`flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider ${
                            isMCA ? "text-[#D4F050]" : "text-[#141413]"
                          }`}
                        >
                          <GraduationCap className="w-4 h-4" />
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 opacity-70" />
                            {edu.period}
                          </span>
                        </div>

                        {isMCA && (
                          <span className="font-mono text-[10px] bg-[#D4F050] text-[#141413] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            ACTIVE DEGREE
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`flex items-center gap-1 font-mono text-xs ${
                            isMCA ? "text-[#9E9A91]" : "text-[#6B6862]"
                          }`}
                        >
                          <MapPin className="w-3 h-3" />
                          {edu.location}
                        </span>

                        <span
                          className={`font-mono text-xs px-3 py-1 rounded-full font-bold uppercase ${
                            isBCA || edu.statusOrGrade.includes("8.0")
                              ? "bg-[#D4F050] text-[#141413] border border-[#141413]/20"
                              : isMCA
                              ? "bg-white/10 text-[#D4F050] border border-[#D4F050]/30"
                              : "bg-[#E8E5F7] text-[#141413] border border-[#141413]/10"
                          }`}
                        >
                          {edu.statusOrGrade}
                        </span>
                      </div>
                    </div>

                    {/* Degree Title */}
                    <h3
                      className={`font-display text-2xl sm:text-3xl font-bold mb-2 tracking-tight ${
                        isMCA ? "text-[#F5F2EA]" : "text-[#141413]"
                      }`}
                    >
                      {edu.degree}
                    </h3>

                    {/* Institution */}
                    <div
                      className={`font-sans text-base font-semibold mb-3 ${
                        isMCA ? "text-[#D4F050]" : "text-[#141413]/85"
                      }`}
                    >
                      {edu.institution}
                    </div>

                    {/* Notes & details */}
                    {edu.notes && (
                      <p
                        className={`text-sm sm:text-base leading-relaxed ${
                          isMCA ? "text-[#9E9A91]" : "text-[#6B6862]"
                        }`}
                      >
                        {edu.notes}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Certifications & Achievements Section */}
        <div className="space-y-12">
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
                  className="p-6 sm:p-7 rounded-2xl bg-[#F5F2EA] border border-[#141413]/15 shadow-xs flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#141413] text-[#F5F2EA] flex items-center justify-center shrink-0">
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
                    className={`p-6 rounded-2xl border flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                      isChess
                        ? "bg-[#141413] text-[#F5F2EA] border-[#141413] shadow-[4px_4px_0px_#D4F050]"
                        : "bg-[#FAF8F2] text-[#141413] border-[#141413]/15 shadow-xs hover:border-[#141413]"
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
