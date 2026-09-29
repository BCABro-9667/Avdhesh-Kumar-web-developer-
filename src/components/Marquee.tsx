import React from "react";
import { PORTFOLIO_DATA } from "../data/portfolio";

interface MarqueeProps {
  reverse?: boolean;
  className?: string;
  items?: string[];
  speed?: "normal" | "slow" | "fast";
}

export const Marquee: React.FC<MarqueeProps> = ({
  className = "",
  items = PORTFOLIO_DATA.marqueeItems,
}) => {
  // Triple the items to ensure seamless infinite looping
  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <div
      className={`relative w-full overflow-hidden border-y border-[#141413]/15 bg-[#141413] text-[#F5F2EA] py-3.5 sm:py-4 select-none ${className}`}
    >
      {/* Subtle edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#141413] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#141413] to-transparent z-10 pointer-events-none" />

      {/* Track 1: Normal Direction */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {repeatedItems.map((item, idx) => (
          <div key={`m1-${idx}`} className="flex items-center">
            <span className="font-display text-sm sm:text-base font-bold tracking-widest text-[#F5F2EA] px-4 whitespace-nowrap hover:text-[#D4F050] transition-colors">
              {item}
            </span>
            <span className="text-[#D4F050] text-xs px-2 select-none">✦</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation-duration: 80s;
          }
        }
      `}</style>
    </div>
  );
};
