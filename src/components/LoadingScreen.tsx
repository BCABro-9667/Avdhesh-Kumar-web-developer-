import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<"ak" | "full" | "exit">("ak");

  useEffect(() => {
    // Phase 1: "AK" for 350ms
    const t1 = setTimeout(() => {
      setPhase("full");
    }, 350);

    // Phase 2: "AVDHESH KUMAR" for 450ms then exit
    const t2 = setTimeout(() => {
      setPhase("exit");
    }, 850);

    // Phase 3: trigger completion
    const t3 = setTimeout(() => {
      onComplete();
    }, 1150);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] } }}
          onClick={() => onComplete()}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[#141413] text-[#F5F2EA] cursor-pointer selection:bg-transparent"
        >
          {/* Subtle noise/texture background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F5F2EA_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 flex flex-col items-center text-center px-4">
            {phase === "ak" ? (
              <motion.div
                key="ak-text"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="font-display text-7xl sm:text-8xl md:text-9xl font-bold tracking-tighter text-[#D4F050]"
              >
                AK
              </motion.div>
            ) : (
              <motion.div
                key="full-text"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-3"
              >
                <div className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-[#D4F050]">
                  Portfolio 2026
                </div>
                <div className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F5F2EA]">
                  AVDHESH KUMAR
                </div>
                <div className="font-mono text-xs text-[#9E9A91] tracking-widest uppercase">
                  Full-Stack & Frontend Web Developer
                </div>
              </motion.div>
            )}

            {/* Subtle bottom progress bar */}
            <div className="w-44 h-[2px] bg-white/10 rounded-full mt-10 overflow-hidden">
              <motion.div
                className="h-full bg-[#D4F050]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.85, ease: "easeInOut" }}
              />
            </div>
            <div className="font-mono text-[10px] text-[#6B6862] mt-3 tracking-wider">
              Click anywhere to skip
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
