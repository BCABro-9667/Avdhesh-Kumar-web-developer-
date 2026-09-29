import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Briefcase, Calendar, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { MagneticButton } from "./MagneticButton";
import { PORTFOLIO_DATA } from "../data/portfolio";

interface ExperienceProps {
  onNavigate?: (page: string) => void;
}

export const Experience: React.FC<ExperienceProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 70%"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <SectionHeading
            label="03 / EXPERIENCE"
            title="Practical engineering journey."
            subtitle="Hands-on industry experience delivering production sites, scalable components, SEO enhancements, and full-stack integrations."
            className="mb-0!"
          />

          {onNavigate && (
            <MagneticButton strength={0.3}>
              <button
                onClick={() => onNavigate("about")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141413] text-[#F5F2EA] font-mono text-xs uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-colors border border-[#141413] cursor-pointer shrink-0"
              >
                <span>Explore more experience ↗</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </MagneticButton>
          )}
        </div>

        <div ref={containerRef} className="relative max-w-4xl mx-auto mt-16">
          {/* Animated Vertical Spine Line */}
          <div className="absolute left-4 sm:left-8 top-4 bottom-4 w-[2px] bg-[#141413]/15">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-[#141413] origin-top"
            />
          </div>

          {/* Timeline Items */}
          <div className="space-y-12 sm:space-y-16">
            {PORTFOLIO_DATA.experience.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative pl-12 sm:pl-20"
              >
                {/* Node marker on the spine */}
                <div className="absolute left-4 sm:left-8 top-6 -translate-x-1/2 w-5 h-5 rounded-full bg-[#FAF8F2] border-2 border-[#141413] flex items-center justify-center shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-[#D4F050]" />
                </div>

                {/* Experience Card */}
                <div className="p-7 sm:p-9 rounded-3xl bg-[#FAF8F2] border border-[#141413]/15 shadow-[4px_4px_0px_#141413] hover:shadow-[6px_6px_0px_#141413] transition-all duration-300">
                  {/* Top Meta Info */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#141413]/10 pb-4 mb-5">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#141413] font-bold tracking-wider">
                      <Briefcase className="w-3.5 h-3.5 text-[#141413]" />
                      {exp.companyUrl ? (
                        <a
                          href={exp.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1"
                        >
                          <span>{exp.company}</span>
                          <span className="text-[10px] opacity-70">↗</span>
                        </a>
                      ) : (
                        <span>{exp.company}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 font-mono text-xs text-[#6B6862]">
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4F050]/50 text-[#141413] font-semibold">
                        <Calendar className="w-3 h-3" />
                        {exp.periodLabel}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  {/* Role Title */}
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#141413] mb-4">
                    {exp.role}
                  </h3>

                  {/* Responsibilities list */}
                  <div className="space-y-2.5 mb-6">
                    {exp.responsibilities.map((resp, rIdx) => (
                      <div
                        key={rIdx}
                        className="flex items-start gap-2.5 text-sm sm:text-base text-[#6B6862] leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#141413] shrink-0 mt-1" />
                        <span className="text-[#141413]/90">{resp}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack pills */}
                  <div className="pt-4 border-t border-[#141413]/10 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#6B6862] mr-2">
                      Tools & Tech:
                    </span>
                    {exp.skillsUsed.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full font-mono text-xs bg-[#F5F2EA] text-[#141413] border border-[#141413]/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
