import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";

export const ScrollToTop: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = scrollY / totalHeight;
        setScrollProgress(progress);
        // Show as soon as website is 20% scrolled
        setVisible(progress >= 0.2);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const percentage = Math.round(scrollProgress * 100);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-40"
        >
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="group relative flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-[#141413] text-[#F5F2EA] border-2 border-[#141413] shadow-[4px_4px_0px_#D4F050] hover:shadow-[2px_2px_0px_#D4F050] hover:translate-y-0.5 hover:bg-[#D4F050] hover:text-[#141413] transition-all duration-200 cursor-pointer"
          >
            {/* Circular Progress Ring */}
            <div className="relative w-6 h-6 flex items-center justify-center">
              <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="opacity-20"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  fill="none"
                  stroke="#D4F050"
                  strokeWidth="2.5"
                  strokeDasharray={56.5}
                  strokeDashoffset={56.5 - (scrollProgress * 56.5)}
                  className="transition-all duration-150 group-hover:stroke-[#141413]"
                />
              </svg>
              <ArrowUp className="w-3 h-3 absolute" />
            </div>

            <div className="flex items-baseline gap-1 font-mono text-xs font-bold tracking-wider">
              <span>TOP</span>
              <span className="text-[10px] opacity-70 font-normal">{percentage}%</span>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
