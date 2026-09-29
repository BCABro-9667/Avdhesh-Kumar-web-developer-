import React, { useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useSiteSettings } from "../context/SiteSettingsContext";

interface LikeButtonProps {
  itemId: string;
  type: "project" | "blog";
  initialLikes?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
  iconOnly?: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  itemId,
  type,
  initialLikes,
  size = "md",
  className = "",
  showText = false,
  iconOnly = false,
}) => {
  const { likes, hasLiked, likeItem } = useSiteSettings();
  const liked = hasLiked(itemId);
  const currentLikes = likes[itemId] !== undefined ? likes[itemId] : (initialLikes || 0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
    await likeItem(itemId, type);
  };

  const sizeClasses = {
    sm: iconOnly ? "w-8 h-8 p-0 flex items-center justify-center text-xs" : "px-2.5 py-1 text-xs gap-1.5",
    md: iconOnly ? "w-10 h-10 p-0 flex items-center justify-center text-xs" : "px-3.5 py-1.5 text-xs sm:text-sm gap-2",
    lg: iconOnly ? "w-12 h-12 p-0 flex items-center justify-center text-sm" : "px-5 py-2.5 text-sm sm:text-base gap-2.5",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-4.5 h-4.5",
    lg: "w-5 h-5",
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      title={liked ? `Liked (${currentLikes} likes)` : `Like this project (${currentLikes} likes)`}
      aria-label={liked ? "Unlike" : "Like"}
      className={`inline-flex items-center justify-center rounded-full font-mono font-bold transition-all cursor-pointer border-2 select-none ${
        sizeClasses[size]
      } ${
        liked
          ? "bg-[#141413] text-[#FF5A5F] border-[#141413] shadow-[2px_2px_0px_#FF5A5F]"
          : "bg-white/95 hover:bg-white text-[#141413] border-[#141413] hover:shadow-[3px_3px_0px_#141413] shadow-[2px_2px_0px_#141413]"
      } ${className}`}
    >
      <motion.span
        animate={isAnimating ? { scale: [1, 1.45, 0.9, 1.1, 1] } : {}}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center justify-center"
      >
        <Heart
          className={`${iconSizes[size]} transition-colors ${
            liked ? "fill-[#FF5A5F] text-[#FF5A5F]" : "text-[#141413] fill-transparent hover:text-[#FF5A5F]"
          }`}
        />
      </motion.span>
      {!iconOnly && (
        <span className="tabular-nums font-mono font-bold">{currentLikes}</span>
      )}
      {!iconOnly && showText && (
        <span className="hidden sm:inline font-sans text-xs opacity-80">
          {liked ? "Liked" : "Like"}
        </span>
      )}
    </motion.button>
  );
};
