import React from "react";
import { motion } from "motion/react";
import {
  Code2,
  Palette,
  Layers,
  ShoppingCart,
  Zap,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { MagneticButton } from "./MagneticButton";
import { PORTFOLIO_DATA, ServiceItem } from "../data/portfolio";

interface ServicesProps {
  onNavigate?: (page: string) => void;
  isPageSection?: boolean;
  className?: string;
}

export const Services: React.FC<ServicesProps> = ({
  onNavigate,
  isPageSection = false,
  className = "",
}) => {
  const getIcon = (type: ServiceItem["iconType"]) => {
    switch (type) {
      case "web":
        return <Code2 className="w-5 h-5 text-[#141413]" />;
      case "uiux":
        return <Palette className="w-5 h-5 text-[#141413]" />;
      case "fullstack":
        return <Layers className="w-5 h-5 text-[#141413]" />;
      case "ecommerce":
        return <ShoppingCart className="w-5 h-5 text-[#141413]" />;
      case "seo":
        return <Zap className="w-5 h-5 text-[#141413]" />;
      case "support":
        return <ShieldCheck className="w-5 h-5 text-[#141413]" />;
      default:
        return <Code2 className="w-5 h-5 text-[#141413]" />;
    }
  };

  const handleInquire = () => {
    if (onNavigate) {
      onNavigate("contact");
    } else {
      const el = document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = "#contact";
      }
    }
  };

  return (
    <section
      id="services"
      className={`relative ${
        isPageSection ? "py-0! bg-transparent" : "py-24 sm:py-32 bg-[#F5F2EA]"
      } ${className}`}
    >
      <div className={isPageSection ? "w-full" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <SectionHeading
            label="SERVICES & EXPERTISE"
            title="Web Development & Engineering"
            subtitle="Six specialized engineering services crafted to bring high-performance web products, storefronts, and digital experiences to life."
            className="mb-0!"
          />

          {onNavigate && (
            <div className="shrink-0">
              <MagneticButton strength={0.25}>
                <button
                  onClick={handleInquire}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#141413] text-[#F5F2EA] font-mono text-xs uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-colors border-2 border-[#141413] shadow-[3px_3px_0px_#141413] cursor-pointer"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </MagneticButton>
            </div>
          )}
        </div>

        {/* 6 Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PORTFOLIO_DATA.services.map((service, index) => {
            const isLimeHighlight = index === 0 || index === 2; // Web Dev & Full-Stack accent
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="rounded-3xl bg-[#FAF8F2] border-2 border-[#141413] shadow-[6px_6px_0px_#141413] hover:shadow-[10px_10px_0px_#141413] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between p-6 sm:p-8 group"
              >
                <div>
                  {/* Card Top Row: Number, Icon & Badge */}
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                      {/* Number Tag */}
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#141413] text-[#F5F2EA]">
                        {service.number}
                      </span>
                      {/* Icon Container */}
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center border-2 border-[#141413] shadow-[2px_2px_0px_#141413] transition-transform duration-200 group-hover:scale-105 ${
                          isLimeHighlight
                            ? "bg-[#D4F050] text-[#141413]"
                            : "bg-[#E8E5F7] text-[#141413]"
                        }`}
                      >
                        {getIcon(service.iconType)}
                      </div>
                    </div>

                    {service.badge && (
                      <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#141413]/5 text-[#141413] border border-[#141413]/15">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & User Tagline */}
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#141413] tracking-tight mb-2 group-hover:text-[#141413]">
                    {service.title}
                  </h3>

                  {/* Tagline Callout */}
                  <div className="p-3 rounded-xl bg-[#F5F2EA] border border-[#141413]/10 mb-4">
                    <p className="font-display font-medium text-xs sm:text-sm text-[#141413] leading-snug">
                      {service.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="font-sans text-xs sm:text-sm text-[#6B6862] leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Deliverables List */}
                  <div className="space-y-2.5 mb-6 pt-4 border-t border-[#141413]/10">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[#6B6862] font-semibold">
                      WHAT'S INCLUDED:
                    </div>
                    <ul className="space-y-2">
                      {service.deliverables.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-[#141413]/85"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#8BA800] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Footer: Tech Stack & CTA */}
                <div className="pt-5 border-t border-[#141413]/10 mt-auto">
                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-5">
                    {service.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[#F5F2EA] text-[#6B6862] border border-[#141413]/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Inquire Action Button */}
                  <button
                    onClick={handleInquire}
                    className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#F5F2EA] hover:bg-[#141413] text-[#141413] hover:text-[#D4F050] font-mono text-xs uppercase tracking-wider font-semibold border border-[#141413]/20 hover:border-[#141413] transition-all duration-200 cursor-pointer group/btn"
                  >
                    <span>Inquire this service</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner Callout */}
        <div className="mt-14 sm:mt-16 p-6 sm:p-8 rounded-3xl bg-[#141413] text-[#F5F2EA] border-2 border-[#141413] shadow-[8px_8px_0px_#D4F050] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#D4F050] font-mono text-xs uppercase tracking-widest font-bold">
              <span>CUSTOM CONTRACT & FREELANCE INQUIRIES</span>
            </div>
            <h4 className="font-display text-xl sm:text-2xl font-bold">
              Need a custom full-stack or frontend solution?
            </h4>
            <p className="font-sans text-xs sm:text-sm text-[#F5F2EA]/70 max-w-2xl">
              From end-to-end web architectures to component refactoring, on-page SEO elevation, and e-commerce setups — I am available for immediate hire and contract work.
            </p>
          </div>

          <button
            onClick={handleInquire}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4F050] text-[#141413] font-mono text-xs uppercase tracking-wider font-bold hover:bg-[#FAF8F2] transition-colors border-2 border-[#D4F050] cursor-pointer shrink-0"
          >
            <span>Let's talk specs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
