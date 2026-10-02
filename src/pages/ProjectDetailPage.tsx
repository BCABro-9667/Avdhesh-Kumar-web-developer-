import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects, fetchProjectBySlug } from "../lib/apiClient";
import { ArrowLeft, ExternalLink, Github, Calendar, ChevronRight, Share2, ArrowRight, Clock, Check } from "lucide-react";
import { LikeButton } from "../components/LikeButton";
import { ProjectDetailSkeleton } from "../components/Skeleton";
import { calculateReadingTime } from "../utils/readingTime";
import { RichContentRenderer } from "../components/RichContentRenderer";
import { updateDocumentSEO } from "../utils/seo";

interface ProjectDetailPageProps {
  slug: string;
  onNavigate: (page: string) => void;
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

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ slug, onNavigate }) => {
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const { data, isLoading: loadingProject } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => fetchProjectBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });

  const { data: allProjects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchProjects(),
    staleTime: 5 * 60 * 1000,
  });

  const loading = loadingProject;

  const project = data?.project;

  const fallbackImg = getProjectFallbackImage(project?.slug || slug || project?.title);
  const [bannerSrc, setBannerSrc] = useState<string>("");

  useEffect(() => {
    if (project) {
      setBannerSrc(project.featuredImage || project.imageUrl || fallbackImg);
    }
  }, [project, fallbackImg]);

  // Real reading time calculated accurately from project content
  const readingTime = calculateReadingTime(project?.description);

  // Sync document SEO & social card meta tags
  useEffect(() => {
    if (project) {
      const canonicalUrl = `${window.location.origin}/projects/${project.slug || slug}`;
      const projectImg =
        project.featuredImage ||
        project.imageUrl ||
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80";

      updateDocumentSEO({
        title: `${project.title} — Project by Avdhesh Kumar`,
        description: project.shortDescription || "Full-stack web application built by Avdhesh Kumar.",
        image: projectImg,
        url: canonicalUrl,
        type: "website",
        category: project.category,
        publishedTime: project.publishedAt || project.createdAt,
        modifiedTime: project.updatedAt,
        schema: {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": project.title,
          "description": project.shortDescription || project.description?.slice(0, 160),
          "applicationCategory": project.category || "WebApplication",
          "operatingSystem": "All",
          "author": {
            "@type": "Person",
            "name": "Avdhesh Kumar",
            "url": window.location.origin
          },
          "image": projectImg,
          "url": canonicalUrl
        }
      });
    }
  }, [project, slug]);

  const handleShare = () => {
    if (!project) return;
    const shareUrl = `${window.location.origin}/projects/${project.slug || slug}`;

    if (navigator.share) {
      navigator.share({
        title: `${project.title} — Avdhesh Kumar`,
        text: project.shortDescription || `Check out ${project.title} built by Avdhesh Kumar`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 3000);
    }
  };

  if (loading) {
    return <ProjectDetailSkeleton />;
  }

  if (!data || !data.project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display font-bold text-3xl text-[#141413] mb-4">Project Not Found</h1>
        <p className="font-mono text-sm text-[#6B6862] mb-6">The project you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => onNavigate("projects")}
          className="px-6 py-3 rounded-2xl bg-[#141413] text-[#D4F050] font-mono text-xs uppercase font-bold tracking-wider cursor-pointer"
        >
          ← Back to Projects
        </button>
      </div>
    );
  }

  // Determine previous and next projects based on allProjects list
  const currentIndex = allProjects.findIndex((p: any) => p.slug === slug || p._id === project._id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto">
      {/* Toast Notification when link copied */}
      {showCopiedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#141413] text-[#F5F2EA] font-mono text-xs font-bold border-2 border-[#D4F050] shadow-[4px_4px_0px_#141413] animate-bounce">
          <Check className="w-4 h-4 text-[#D4F050]" />
          <span>Project link copied to clipboard!</span>
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 font-mono text-xs text-[#6B6862] mb-6">
        <button onClick={() => onNavigate("home")} className="hover:text-[#141413] cursor-pointer">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => onNavigate("projects")} className="hover:text-[#141413] cursor-pointer">Projects</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#141413] font-semibold truncate max-w-[200px]">{project.title}</span>
      </nav>

      {/* Header Info */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Category Badge */}
          <span className="px-3.5 py-1.5 rounded-full bg-[#141413] text-[#D4F050] font-mono text-xs uppercase tracking-wider font-bold">
            {project.category}
          </span>

          {/* Real Reading Time */}
          <span className="font-mono text-xs text-[#141413] flex items-center gap-1.5 bg-[#FAF8F2] px-3 py-1.5 rounded-full border border-[#141413]/20 shadow-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-[#141413]" />
            <span>{readingTime}</span>
          </span>

          {/* Published Date */}
          {project.publishedAt && (
            <span className="font-mono text-xs text-[#6B6862] flex items-center gap-1.5 ml-auto sm:ml-0">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(project.publishedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
          )}
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-[#141413] tracking-tight">
          {project.title}
        </h1>

        <p className="font-sans text-lg sm:text-xl text-[#6B6862] leading-relaxed">
          {project.shortDescription}
        </p>

        {/* Action Bar: Live, GitHub, and Share buttons aligned to the right side */}
        <div className="flex flex-wrap items-center justify-end pt-4 pb-6 border-b border-[#141413]/15 gap-2.5 sm:gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-full bg-[#141413] text-[#D4F050] hover:bg-[#D4F050] hover:text-[#141413] border-2 border-[#141413] font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[2px_2px_0px_#141413] cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Preview ↗</span>
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-full bg-[#FAF8F2] text-[#141413] hover:bg-[#141413] hover:text-[#FAF8F2] border-2 border-[#141413] font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[2px_2px_0px_#141413] cursor-pointer"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub ↗</span>
            </a>
          )}

          <button
            onClick={handleShare}
            title="Share Project"
            aria-label="Share Project"
            className="w-10 h-10 rounded-full bg-[#FAF8F2] border-2 border-[#141413] text-[#141413] hover:bg-[#141413] hover:text-[#F5F2EA] transition-colors flex items-center justify-center shadow-[2px_2px_0px_#141413] hover:shadow-[3px_3px_0px_#141413] cursor-pointer outline-none shrink-0"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Featured Banner Card - Clean & Borderless with NO overlaid text & Like button in bottom right */}
      {bannerSrc && (
        <div 
          className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl sm:rounded-3xl bg-[#141413] mb-10 overflow-hidden border-0 shadow-none outline-none ring-0 select-none"
        >
          <img
            src={bannerSrc}
            alt={project.title}
            onError={() => {
              if (bannerSrc !== fallbackImg) {
                setBannerSrc(fallbackImg);
              }
            }}
            className="w-full h-full object-cover border-0 outline-none"
            referrerPolicy="no-referrer"
          />
          {/* Like button in right bottom corner of the image */}
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20">
            <LikeButton
              itemId={project._id || slug}
              type="project"
              initialLikes={project.likes || 0}
              size="md"
            />
          </div>
        </div>
      )}

      {/* Main Content Article - Clean, borderless & outline-free */}
      <div className="bg-[#FAF8F2] rounded-2xl sm:rounded-3xl border-0 p-4 sm:p-12 space-y-6 font-sans text-base sm:text-lg text-[#141413]/90 leading-relaxed mb-16 shadow-none outline-none ring-0">
        <RichContentRenderer
          content={project.description || ""}
          readTime={readingTime}
          collapsible={false}
        />
      </div>

      {/* Project Navigation Footer */}
      <div className="pt-10 border-t border-[#141413]/15 flex flex-col sm:flex-row items-center justify-between gap-6">
        {prevProject ? (
          <button
            onClick={() => onNavigate(`projects/${prevProject.slug || prevProject.id}`)}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#FAF8F2] border border-[#141413] hover:bg-[#141413] hover:text-[#FAF8F2] transition-all shadow-[4px_4px_0px_#141413] group text-left w-full sm:w-auto cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider opacity-60">Previous Project</div>
              <div className="font-display font-bold text-base truncate max-w-[220px]">{prevProject.title}</div>
            </div>
          </button>
        ) : (
          <div />
        )}

        {nextProject ? (
          <button
            onClick={() => onNavigate(`projects/${nextProject.slug || nextProject.id}`)}
            className="flex items-center justify-between sm:justify-end gap-3 px-6 py-4 rounded-2xl bg-[#FAF8F2] border border-[#141413] hover:bg-[#141413] hover:text-[#FAF8F2] transition-all shadow-[4px_4px_0px_#141413] group text-right w-full sm:w-auto cursor-pointer ml-auto"
          >
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider opacity-60">Next Project</div>
              <div className="font-display font-bold text-base truncate max-w-[220px]">{nextProject.title}</div>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

