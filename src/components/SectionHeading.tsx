import React from "react";
import { motion } from "motion/react";

interface SectionHeadingProps {
  label: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  label,
  title,
  subtitle,
  className = "",
  align = "left",
}) => {
  return (
    <div
      className={`mb-12 md:mb-16 ${
        align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-4xl"
      } ${className}`}
    >
      {/* Section Index / Label */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3 font-mono text-xs md:text-sm tracking-widest text-[#6B6862] uppercase mb-4"
      >
        <span className="inline-block w-2 h-2 bg-[#D4F050] border border-[#141413]/40 rounded-full" />
        <span>{label}</span>
      </motion.div>

      {/* Main Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-[#141413] leading-[1.05]"
      >
        {title}
      </motion.h2>

      {/* Optional Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 text-base sm:text-lg md:text-xl text-[#6B6862] font-normal leading-relaxed max-w-2xl"
        >
          {subtitle}
        </motion.p>
      )}

      {/* Fine Editorial Accent Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={`h-[1px] bg-[#141413]/15 mt-8 origin-left ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
    </div>
  );
};
