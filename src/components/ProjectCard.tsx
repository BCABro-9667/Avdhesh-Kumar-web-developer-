import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ExternalLink, Code2 } from "lucide-react";
import { Project } from "../data/portfolio";
import { LikeButton } from "./LikeButton";

interface ProjectCardProps {
  project: Project;
  onSelect?: (project: Project) => void;
  onNavigate?: (page: string) => void;
  index: number;
}

const getProjectFallbackImage = (slugOrTitle: string = "") => {
  const s = slugOrTitle.toLowerCase();
  if (s.includes("taskmaster")) return "/projects/taskmaster.png";
  if (s.includes("shortly")) return "/projects/shortly.png";
  if (s.includes("music") || s.includes("love4u")) return "/projects/love4u.jpg";
  if (s.includes("chess")) return "/projects/chess-form.jpg";
  if (s.includes("smtems")) return "/projects/smtems.png";
  return "/og-image.png";
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onNavigate }) => {
  const slug =
    project.slug ||
    project.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate(`projects/${slug}`);
    }
  };

  const fallbackUrl = getProjectFallbackImage(project.slug || project.title);
  const rawUrl = project.imageUrl || (project as any).featuredImage;
  const initialUrl = rawUrl || fallbackUrl;

  const [currentSrc, setCurrentSrc] = useState<string>(initialUrl);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const nextUrl = project.imageUrl || (project as any).featuredImage || fallbackUrl;
    setCurrentSrc(nextUrl);
    setHasError(false);
  }, [project.imageUrl, (project as any).featuredImage, project.slug, project.title]);

  const handleImageError = () => {
    if (currentSrc !== fallbackUrl) {
      setCurrentSrc(fallbackUrl);
    } else {
      setHasError(true);
      setIsLoaded(true);
    }
  };

  return (
    <motion.article
      data-cursor="project"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full rounded-3xl p-5 sm:p-6 border border-[#141413]/20 bg-[#FAF8F2] shadow-[3px_3px_0px_rgba(20,20,19,0.12)] hover:shadow-[1px_1px_0px_rgba(20,20,19,0.12)] hover:border-[#141413]/40 hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden"
    >
      <div>
        {/* 1. Project Image with Category Badge in Left Top Corner - 16:10 Aspect Ratio */}
        <div
          onClick={handleNavigate}
          className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-4 sm:mb-5 border border-[#141413]/10 bg-[#141413]/5 flex items-center justify-center cursor-pointer group/img select-none"
        >
          {/* Ambient blurred backdrop for aesthetic cohesion */}
          {!hasError && (
            <div
              className="absolute inset-0 bg-cover bg-center blur-lg opacity-15 scale-110 pointer-events-none transition-opacity duration-500"
              style={{ backgroundImage: `url(${currentSrc})` }}
            />
          )}

          {/* Shimmer loading skeleton */}
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 bg-[#EFECE4] animate-pulse z-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#141413]/20 border-t-[#141413] rounded-full animate-spin" />
            </div>
          )}

          {/* Category Badge in Left Top Corner */}
          {project.category && (
            <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-[#141413]/90 backdrop-blur-md text-[#D4F050] font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border border-white/20 shadow-none">
              {project.category}
            </div>
          )}

          {hasError ? (
            /* Elegant graphic fallback if both main and fallback images fail */
            <div className="relative z-1 w-full h-full flex flex-col items-center justify-center bg-[#FAF8F2] p-4 text-center">
              <Code2 className="w-8 h-8 text-[#141413]/40 mb-2" />
              <span className="font-display font-bold text-sm text-[#141413] line-clamp-1">{project.title}</span>
              <span className="font-mono text-[10px] text-[#6B6862] mt-1">{project.category}</span>
            </div>
          ) : (
            <img
              src={currentSrc}
              alt={project.title}
              loading="lazy"
              decoding="async"
              onLoad={() => setIsLoaded(true)}
              onError={handleImageError}
              className={`relative z-1 w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-500 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              referrerPolicy="no-referrer"
            />
          )}

          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-2" />
        </div>

        {/* 2. Project Title */}
        <h3
          onClick={handleNavigate}
          className="font-display text-xl sm:text-2xl font-bold text-[#141413] hover:underline group-hover:underline underline-offset-4 decoration-2 decoration-[#141413] transition-all mb-5 leading-snug cursor-pointer line-clamp-2"
          title={project.title}
        >
          {project.title}
        </h3>
      </div>

      {/* 3. Actions Row: Explore + Preview (icon) + Like (icon only) */}
      <div className="pt-4 border-t border-[#141413]/10 flex items-center justify-between gap-3">
        {/* Explore Button */}
        <button
          type="button"
          onClick={handleNavigate}
          className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-[#141413] text-[#F5F2EA] hover:bg-[#D4F050] hover:text-[#141413] font-mono text-xs uppercase font-bold tracking-wider border-2 border-[#141413] shadow-[2px_2px_0px_#141413] hover:shadow-[3px_3px_0px_#141413] transition-all cursor-pointer"
        >
          <span>Explore</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>

        {/* Preview (icon) & Like (icon only) */}
        <div className="flex items-center gap-2">
          {/* Preview icon button */}
          <a
            href={project.url && project.url !== "#" ? project.url : undefined}
            onClick={(e) => {
              if (!project.url || project.url === "#") {
                e.preventDefault();
                handleNavigate();
              }
            }}
            target="_blank"
            rel="noopener noreferrer"
            title="Live Preview"
            aria-label="Live Preview"
            className="w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#141413] hover:text-[#141413] border-2 border-[#141413] shadow-[2px_2px_0px_#141413] hover:shadow-[3px_3px_0px_#141413] hover:scale-105 transition-all flex items-center justify-center cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* Like (icon only) */}
          <LikeButton
            itemId={project.id || project._id || slug}
            type="project"
            size="md"
            iconOnly={true}
          />
        </div>
      </div>
    </motion.article>
  );
};
