import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Quote, ArrowLeft, ArrowRight, UserCheck, Clock } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { MagneticButton } from "./MagneticButton";

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const testimonials = PORTFOLIO_DATA.testimonials;
  const current = testimonials[currentIndex];

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  return (
    <section id="testimonials" className="py-24 sm:py-32 relative bg-transparent border-t border-[#141413]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            label="COLLABORATION"
            title="People I work with."
            subtitle="Direct observations and peer feedback from engineering internships, supervisors, and academic mentors."
            className="mb-0!"
          />

          {/* Navigation Controls: Arrows & Index */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-[#6B6862] tracking-wider">
              0{currentIndex + 1} / 0{testimonials.length}
            </span>

            <div className="flex items-center gap-2">
              <MagneticButton strength={0.3}>
                <button
                  onClick={handlePrev}
                  aria-label="Previous testimonial"
                  className="w-12 h-12 rounded-full border border-[#141413] bg-[#FAF8F2] flex items-center justify-center hover:bg-[#141413] hover:text-[#F5F2EA] transition-colors shadow-xs cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </MagneticButton>

              <MagneticButton strength={0.3}>
                <button
                  onClick={handleNext}
                  aria-label="Next testimonial"
                  className="w-12 h-12 rounded-full border border-[#141413] bg-[#FAF8F2] flex items-center justify-center hover:bg-[#141413] hover:text-[#F5F2EA] transition-colors shadow-xs cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Full-Width Testimonial Card */}
        <div className="relative min-h-[320px] sm:min-h-[300px] w-full rounded-3xl bg-[#FAF8F2] border-2 border-[#141413] shadow-[8px_8px_0px_#141413] p-8 sm:p-14 overflow-hidden">
          {/* Subtle Background Watermark Quote */}
          <div className="absolute right-8 top-8 opacity-5 select-none pointer-events-none font-display text-9xl font-black text-[#141413]">
            “
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-between h-full relative z-10"
            >
             

              {/* Quote Content */}
              <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-[#141413] leading-snug tracking-tight mb-10">
                “{current.note}”
              </blockquote>

              {/* Author Details Footer */}
              <div className="pt-6 border-t border-[#141413]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#141413] bg-[#D4F050] flex items-center justify-center font-display font-bold text-base text-[#141413] shadow-xs">
                    {current.avatarUrl ? (
                      <img
                        src={current.avatarUrl}
                        alt={current.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      current.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="font-display font-bold text-lg text-[#141413] flex items-center gap-1.5">
                      <span>{current.name}</span>
                    </div>
                    <div className="font-mono text-xs text-[#6B6862]">
                      {current.role}
                    </div>
                  </div>
                </div>

                
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Points / Dots */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              aria-label={`Go to testimonial ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex
                  ? "w-8 h-3 bg-[#141413]"
                  : "w-3 h-3 bg-[#141413]/20 hover:bg-[#141413]/50"
              }`}
            />
          ))}
        </div>

        {/* Verification Note */}
        <div className="mt-8 text-center">
          <p className="font-mono text-xs text-[#6B6862]">
            Looking for formal supervisory references? Inquire directly via email or LinkedIn for verified contact credentials.
          </p>
        </div>
      </div>
    </section>
  );
};
