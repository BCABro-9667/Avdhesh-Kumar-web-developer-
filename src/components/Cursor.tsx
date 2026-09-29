import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

export type CursorVariant = "default" | "link" | "project" | "explore";

interface CursorState {
  x: number;
  y: number;
  variant: CursorVariant;
  visible: boolean;
}

export const Cursor: React.FC = () => {
  const [cursor, setCursor] = useState<CursorState>({
    x: -100,
    y: -100,
    variant: "default",
    visible: false,
  });

  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    // Check if device has coarse pointer (touchscreen) or prefers reduced motion
    const checkTouch = () => {
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setIsTouch(isCoarse || prefersReduced);
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);

    if (window.matchMedia("(pointer: coarse)").matches) {
      return () => window.removeEventListener("resize", checkTouch);
    }

    const onMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;

      let variant: CursorVariant = "default";
      if (target) {
        if (target.closest("[data-cursor='project']")) {
          variant = "project";
        } else if (target.closest("[data-cursor='explore']")) {
          variant = "explore";
        } else if (
          target.closest("a") ||
          target.closest("button") ||
          target.closest("[role='button']") ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest("[data-cursor='link']")
        ) {
          variant = "link";
        }
      }

      setCursor({
        x: e.clientX,
        y: e.clientY,
        variant,
        visible: true,
      });
    };

    const onMouseLeave = () => {
      setCursor((prev) => ({ ...prev, visible: false }));
    };

    const onMouseEnter = () => {
      setCursor((prev) => ({ ...prev, visible: true }));
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("resize", checkTouch);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, []);

  if (isTouch || !cursor.visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      {/* Primary Dot / Shape */}
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center rounded-full font-mono text-[10px] font-bold tracking-widest uppercase shadow-sm"
        animate={{
          x: cursor.x,
          y: cursor.y,
          translateX: "-50%",
          translateY: "-50%",
          width:
            cursor.variant === "project" || cursor.variant === "explore"
              ? 76
              : cursor.variant === "link"
              ? 48
              : 8,
          height:
            cursor.variant === "project" || cursor.variant === "explore"
              ? 76
              : cursor.variant === "link"
              ? 48
              : 8,
          backgroundColor:
            cursor.variant === "project"
              ? "#D4F050"
              : cursor.variant === "explore"
              ? "#E8E5F7"
              : cursor.variant === "link"
              ? "rgba(20, 20, 19, 0.08)"
              : "#141413",
          border:
            cursor.variant === "link"
              ? "1px solid rgba(20, 20, 19, 0.4)"
              : cursor.variant === "project" || cursor.variant === "explore"
              ? "1px solid rgba(20, 20, 19, 0.15)"
              : "none",
          color: "#141413",
        }}
        transition={{
          type: "spring",
          damping: 28,
          stiffness: 350,
          mass: 0.25,
        }}
      >
        {cursor.variant === "project" && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="font-bold text-[#141413]"
          >
            VIEW ↗
          </motion.span>
        )}
        {cursor.variant === "explore" && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="font-bold text-[#141413]"
          >
            EXPLORE
          </motion.span>
        )}
      </motion.div>

      {/* Subtle secondary trailing halo (for default & link) */}
      {(cursor.variant === "default" || cursor.variant === "link") && (
        <motion.div
          className="fixed top-0 left-0 rounded-full border border-[#141413]/25 pointer-events-none"
          animate={{
            x: cursor.x,
            y: cursor.y,
            translateX: "-50%",
            translateY: "-50%",
            width: cursor.variant === "link" ? 56 : 28,
            height: cursor.variant === "link" ? 56 : 28,
            opacity: cursor.variant === "link" ? 0.3 : 0.6,
          }}
          transition={{
            type: "spring",
            damping: 32,
            stiffness: 220,
            mass: 0.6,
          }}
        />
      )}
    </div>
  );
};
