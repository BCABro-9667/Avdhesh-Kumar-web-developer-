import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import {
  Briefcase,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronDown,
  Wrench,
  FolderGit2,
  FileText,
  Check,
  Building2,
  ArrowRight,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { MagneticButton } from "./MagneticButton";
import { PORTFOLIO_DATA, ExperienceItem } from "../data/portfolio";
import { EstovirLogo, ReachcureLogo, VmdLogo } from "./BrandLogos";

interface ExperienceProps {
  onNavigate?: (page: string) => void;
}

const CompanyBrandLogo: React.FC<{ exp: ExperienceItem }> = ({ exp }) => {
  const [imgError, setImgError] = useState(false);

  // Exact provided URLs
  const logoSrc =
    exp.logoUrl ||
    (exp.id === "vmd-cad"
      ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCoB2s2G7AkNoLeGWMhql8bK2GcNHZfVFrgpGwRqnw27khaaV2BFg5Oa4&s=10"
      : exp.id === "estovir"
      ? "https://fplogoimages.withfloats.com/new-mobile/63b3e90ca4c3440001407fbd.png"
      : exp.id === "reachcure"
      ? "https://media.licdn.com/dms/image/v2/D563DAQFGo0pMfGAt1Q/image-scale_191_1128/B56ZYAogYsGcAk-/0/1743767341037/reachcure_cover?e=1791349200&v=beta&t=2Q0DILMaDG94XNFohLEeyhi-rdQ4BkHiM9rQA1rMqSo"
      : undefined);

  if (logoSrc && !imgError) {
    if (exp.id === "reachcure") {
      // Intelligently fit/contain the ReachCure banner image without distortion or stretching
      return (
        <div className="w-full h-20 sm:h-24 flex items-center justify-center overflow-hidden">
          <img
            src={logoSrc}
            alt={exp.company}
            onError={() => setImgError(true)}
            className="max-h-16 sm:max-h-20 w-auto max-w-[260px] object-contain mix-blend-multiply transition-transform duration-300"
            loading="lazy"
            crossOrigin="anonymous"
          />
        </div>
      );
    }
    return (
      <img
        src={logoSrc}
        alt={exp.company}
        onError={() => setImgError(true)}
        className="max-h-24 sm:max-h-28 max-w-[220px] sm:max-w-[250px] w-auto object-contain mix-blend-multiply transition-transform duration-300"
        loading="lazy"
        crossOrigin="anonymous"
      />
    );
  }

  switch (exp.id) {
    case "estovir":
      return <EstovirLogo className="w-20 h-20 sm:w-24 sm:h-24" />;
    case "reachcure":
      return <ReachcureLogo className="w-20 h-20 sm:w-24 sm:h-24" />;
    case "vmd-cad":
      return <VmdLogo className="w-20 h-20 sm:w-24 sm:h-24" />;
    default:
      return <Briefcase className="w-14 h-14 sm:w-16 sm:h-16 text-[#141413]" />;
  }
};

const ExperienceCard: React.FC<{
  exp: ExperienceItem;
  index: number;
}> = ({ exp, index }) => {
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
              {/* Header Row: Company Icon, Name & Type Pill */}
              <div className="flex items-center gap-3.5 mb-2.5">
                <div className="w-11 h-11 rounded-xl bg-white border-2 border-[#141413] shadow-[2px_2px_0px_#141413] flex items-center justify-center shrink-0 text-[#141413]">
                  <Building2 className="w-5 h-5 stroke-[2.2]" />
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={exp.companyUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/name inline-flex items-center gap-1.5 hover:underline underline-offset-4 decoration-2 decoration-[#141413] transition-colors"
                  >
                    <h3 className="font-display font-bold text-2xl sm:text-[26px] text-[#141413] tracking-tight">
                      {exp.company}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-[#141413] opacity-60 group-hover/name:opacity-100 group-hover/name:translate-x-0.5 group-hover/name:-translate-y-0.5 transition-all shrink-0" />
                  </a>
                  <span className="px-3.5 py-1 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider bg-[#C8E93D] text-[#141413] border border-black/10">
                    {exp.employmentType || exp.periodLabel || "FULL-TIME"}
                  </span>
                </div>
              </div>

              {/* Metadata Row with Pipes */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs sm:text-[13px] text-[#4A4742] mb-3.5">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#141413]" />
                  <span>{exp.location}</span>
                </span>
                <span className="text-gray-300 select-none">|</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#141413]" />
                  <span>{exp.duration}</span>
                </span>
                <span className="text-gray-300 select-none">|</span>
                <span className="flex items-center gap-1.5 font-semibold text-[#141413]">
                  <Briefcase className="w-3.5 h-3.5 text-[#141413]" />
                  <span>{exp.role}</span>
                </span>
                {exp.durationYears && (
                  <>
                    <span className="text-gray-300 select-none">|</span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#141413]">
                      <span className="w-2 h-2 rounded-full bg-[#C8E93D] shrink-0" />
                      <span>{exp.durationYears}</span>
                    </span>
                  </>
                )}
              </div>

              {/* Concise Role Description */}
              <p className="font-sans text-sm sm:text-[15px] text-[#4A4742] leading-relaxed mb-1">
                {exp.summary || exp.responsibilities[0]}
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
                    {/* Roles & Responsibilities */}
                    <div className="pt-6 mt-4 border-t border-gray-100 space-y-3.5">
                      <div className="flex items-center gap-2 font-display font-bold text-base text-[#141413]">
                        <FileText className="w-4 h-4 text-[#141413] stroke-[2.2]" />
                        <span>Roles & Responsibilities</span>
                      </div>
                      <div className="space-y-2.5 pl-0.5">
                        {exp.responsibilities.map((resp, rIdx) => (
                          <div
                            key={rIdx}
                            className="flex items-start gap-2.5 text-xs sm:text-[14px] text-[#2D2B28] leading-relaxed"
                          >
                            <span className="w-4 h-4 rounded-full bg-[#C8E93D] flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-2.5 h-2.5 text-[#141413] stroke-[3]" />
                            </span>
                            <span>{resp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tools & Technologies */}
                    <div className="pt-6 mt-5 border-t border-gray-100">
                      <div className="flex items-center gap-2 font-display font-bold text-base text-[#141413] mb-3">
                        <Wrench className="w-4 h-4 text-[#141413] stroke-[2.2]" />
                        <span>Tools & Technologies</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {exp.skillsUsed.map((skill) => (
                          <span
                            key={skill}
                            className="px-4 py-1.5 rounded-full font-mono text-xs bg-white text-[#141413] border border-gray-200 font-medium shadow-2xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Projects Worked On */}
                    {exp.projectsWorkedOn && exp.projectsWorkedOn.length > 0 && (
                      <div className="pt-6 mt-5 border-t border-gray-100">
                        <div className="flex items-center gap-2 font-display font-bold text-base text-[#141413] mb-3">
                          <FolderGit2 className="w-4 h-4 text-[#141413] stroke-[2.2]" />
                          <span>Projects Worked On</span>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          {exp.projectsWorkedOn.map((proj, pIdx) => {
                            const isClickable = proj.url && proj.url !== "#";
                            return isClickable ? (
                              <a
                                key={pIdx}
                                href={proj.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-mono text-xs border border-gray-200 bg-white text-[#141413] hover:border-[#141413] hover:bg-gray-50 transition-all duration-200 shadow-2xs group/proj cursor-pointer"
                              >
                                <span>{proj.name}</span>
                                <ExternalLink className="w-3.5 h-3.5 text-[#141413] group-hover/proj:translate-x-0.5 group-hover/proj:-translate-y-0.5 transition-transform" />
                              </a>
                            ) : (
                              <span
                                key={pIdx}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-mono text-xs border border-gray-200 bg-white text-[#141413] shadow-2xs"
                              >
                                <span>{proj.name}</span>
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

            {/* Company Logo with Transparent Background (No white square box) */}
            <div className="w-full h-24 sm:h-28 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <CompanyBrandLogo exp={exp} />
            </div>

            {/* Clickable Company Name with ExternalLink */}
            <a
              href={exp.companyUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-1.5 font-display font-bold text-lg text-[#141413] hover:underline underline-offset-4 decoration-2 decoration-[#141413] transition-colors cursor-pointer max-w-full"
            >
              <span className="truncate">{exp.company}</span>
              <ExternalLink className="w-4 h-4 text-[#141413] shrink-0 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </a>

            <span className="font-mono text-xs text-[#6B6862] mt-0.5">
              View Company Website
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
                  <span className="text-[#141413] truncate">{exp.location}</span>
                </div>
                <div className="flex items-center gap-2 text-[#4A4742]">
                  <Calendar className="w-3.5 h-3.5 text-[#141413] shrink-0" />
                  <span className="text-[#141413] truncate">{exp.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-[#4A4742]">
                  <Briefcase className="w-3.5 h-3.5 text-[#141413] shrink-0" />
                  <span className="text-[#141413] truncate">{exp.role}</span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#C8E93D] text-[#141413] font-bold text-[10px] uppercase border border-black/10">
                    {exp.employmentType || exp.periodLabel || "FULL-TIME"}
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
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <SectionHeading
            label="03 / EXPERIENCE"
            title="Practical engineering journey."
            subtitle="Professional journey and work experience delivering production apps, scalable components, SEO enhancements, and full-stack integrations."
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

        {/* Timeline Container */}
        <div ref={containerRef} className="relative max-w-5xl mx-auto mt-14">
          {/* Animated Vertical Spine Line */}
          <div className="absolute left-3.5 sm:left-7.5 top-9 bottom-9 w-[2px] bg-[#141413]/15">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-[#141413] origin-top"
            />
          </div>

          {/* Experience Cards */}
          <div className="space-y-10 sm:space-y-12">
            {PORTFOLIO_DATA.experience.map((exp, idx) => (
              <ExperienceCard key={exp.id} exp={exp} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
