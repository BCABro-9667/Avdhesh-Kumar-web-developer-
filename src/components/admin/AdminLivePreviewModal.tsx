import React, { useState, useEffect } from "react";
import {
  X,
  ExternalLink,
  Monitor,
  Tablet,
  Smartphone,
  Calendar,
  Clock,
  Tag,
  Github,
  Globe,
  Heart,
  Share2,
  Check,
  Eye,
  Sparkles,
  Layers,
  ArrowUpRight,
  Maximize2
} from "lucide-react";
import { RichContentRenderer } from "../RichContentRenderer";
import { calculateReadingTime } from "../../utils/readingTime";

export interface PreviewData {
  _id?: string;
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  shortDescription?: string;
  content?: string;
  description?: string;
  featuredImage?: string;
  imageUrl?: string;
  imageAlt?: string;
  category?: string;
  keywords?: string | string[];
  tags?: string | string[];
  techStack?: string | string[];
  liveUrl?: string;
  githubUrl?: string;
  author?: string;
  status?: string;
  likes?: number;
  publishedAt?: string | Date;
  createdAt?: string | Date;
  features?: string[];
}

interface AdminLivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "blog" | "project";
  data: PreviewData | null;
}

type ViewportMode = "desktop" | "tablet" | "mobile";
type PreviewTab = "rendered" | "live_frame";

export const AdminLivePreviewModal: React.FC<AdminLivePreviewModalProps> = ({
  isOpen,
  onClose,
  type,
  data,
}) => {
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [previewTab, setPreviewTab] = useState<PreviewTab>("rendered");
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const title = data.title || (type === "blog" ? "Untitled Blog Post" : "Untitled Project");
  const slug = data.slug || "preview-slug";
  const status = data.status || "published";
  const isPublished = status === "published";
  const category = data.category || (type === "blog" ? "Engineering" : "Full-Stack");
  const author = data.author || "Avdhesh Kumar";
  const bannerImage = data.featuredImage || data.imageUrl || (type === "blog" ? "/blogs/ai-tools.jpg" : "/projects/taskmaster.png");
  const imageAlt = data.imageAlt || title;

  // Process tags & tech stacks
  const tagsList: string[] = Array.isArray(data.tags)
    ? data.tags
    : typeof data.tags === "string" && data.tags.trim()
    ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [category];

  const techStackList: string[] = Array.isArray(data.techStack)
    ? data.techStack
    : typeof data.techStack === "string" && data.techStack.trim()
    ? data.techStack.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  // Content body
  const rawBody = type === "blog" ? data.content || data.excerpt || "" : data.description || data.shortDescription || "";
  const readingTime = calculateReadingTime(rawBody);

  // Live URL
  const livePath = type === "blog" ? `/blog/${slug}` : `/projects/${slug}`;
  const fullLiveUrl = `${window.location.origin}${livePath}`;

  const handleOpenLiveUrl = () => {
    window.open(livePath, "_blank");
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullLiveUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  // Viewport container width classes
  const getViewportWidthClass = () => {
    switch (viewport) {
      case "mobile":
        return "w-full max-w-[420px]";
      case "tablet":
        return "w-full max-w-[768px]";
      case "desktop":
      default:
        return "w-full max-w-[1100px]";
    }
  };

  const formattedDate = new Date(data.publishedAt || data.createdAt || Date.now()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Live Preview Modal"
    >
      {/* 1. TOP CONTROL BAR */}
      <header className="shrink-0 bg-[#FAF8F2] border-b-2 border-[#141413] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        {/* Left: Badge, Title & Public URL */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#141413] text-[#D4F050] font-mono text-[10px] uppercase font-bold tracking-wider shrink-0">
              {type === "blog" ? "Blog Preview" : "Project Preview"}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold tracking-wider border border-[#141413] shrink-0 ${
                isPublished ? "bg-[#D4F050] text-[#141413]" : "bg-neutral-200 text-[#141413]"
              }`}
            >
              {isPublished ? "● Published" : "○ Draft Preview"}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 border-l border-[#141413]/20 pl-3">
            <span className="font-display font-bold text-sm text-[#141413] truncate max-w-[280px]">
              {title}
            </span>
            <span className="font-mono text-xs text-[#6B6862] truncate max-w-[200px]">
              {livePath}
            </span>
          </div>
        </div>

        {/* Center: Device Viewport Controls & Tab switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Viewport Width Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-white border-2 border-[#141413] shadow-[2px_2px_0px_#141413]">
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                viewport === "desktop"
                  ? "bg-[#D4F050] text-[#141413] shadow-xs"
                  : "text-[#6B6862] hover:text-[#141413]"
              }`}
              title="Desktop View (100%)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport("tablet")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                viewport === "tablet"
                  ? "bg-[#D4F050] text-[#141413] shadow-xs"
                  : "text-[#6B6862] hover:text-[#141413]"
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport("mobile")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                viewport === "mobile"
                  ? "bg-[#D4F050] text-[#141413] shadow-xs"
                  : "text-[#6B6862] hover:text-[#141413]"
              }`}
              title="Mobile View (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          {/* Rendered vs Live Frame Toggle */}
          <div className="hidden md:flex items-center p-1 rounded-xl bg-white border-2 border-[#141413] shadow-[2px_2px_0px_#141413]">
            <button
              type="button"
              onClick={() => setPreviewTab("rendered")}
              className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                previewTab === "rendered"
                  ? "bg-[#141413] text-[#D4F050]"
                  : "text-[#6B6862] hover:text-[#141413]"
              }`}
            >
              Instant UI
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab("live_frame")}
              className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                previewTab === "live_frame"
                  ? "bg-[#141413] text-[#D4F050]"
                  : "text-[#6B6862] hover:text-[#141413]"
              }`}
              title="Interactive Live Page in Iframe"
            >
              Live Frame
            </button>
          </div>
        </div>

        {/* Right: Open in New Tab & Close Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyUrl}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#141413]/30 bg-white hover:border-[#141413] font-mono text-xs font-bold text-[#141413] cursor-pointer"
            title="Copy Public Page Link"
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleOpenLiveUrl}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#D4F050] border-2 border-[#141413] font-mono text-xs font-bold text-[#141413] shadow-[2px_2px_0px_#141413] hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer transition-all"
            title="Open Live Public Page in New Tab"
          >
            <span>Open in Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white border-2 border-[#141413] text-[#141413] hover:bg-red-50 hover:text-red-600 shadow-[2px_2px_0px_#141413] cursor-pointer ml-1"
            title="Close Preview (Esc)"
            aria-label="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. SCROLLABLE PREVIEW CANVAS */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start bg-neutral-900/60">
        <div
          className={`${getViewportWidthClass()} transition-all duration-300 ease-out bg-[#F5F2EA] border-2 border-[#141413] rounded-3xl shadow-[8px_8px_0px_rgba(0,0,0,0.5)] overflow-hidden my-auto`}
        >
          {previewTab === "live_frame" ? (
            /* Live Iframe View of the exact route */
            <div className="relative w-full h-[80vh] bg-white">
              <iframe
                src={livePath}
                title={`${title} live frame`}
                className="w-full h-full border-none"
              />
            </div>
          ) : type === "blog" ? (
            /* =======================================================
               AUTHENTIC BLOG POST LIVE PREVIEW
               ======================================================= */
            <article className="p-6 sm:p-10 lg:p-12 space-y-8 bg-[#FAF8F2]">
              {/* Category, Date & Read Time */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-[#141413] text-[#D4F050] font-mono text-xs uppercase font-bold tracking-wider">
                  {category}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-xs text-[#6B6862]">
                  <Calendar className="w-3.5 h-3.5 text-[#141413]" />
                  <span>{formattedDate}</span>
                </span>
                <span className="flex items-center gap-1.5 font-mono text-xs text-[#6B6862]">
                  <Clock className="w-3.5 h-3.5 text-[#141413]" />
                  <span>{readingTime}</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#141413] leading-[1.15] tracking-tight">
                {title}
              </h1>

              {/* Excerpt if present */}
              {data.excerpt && (
                <div className="p-5 rounded-2xl bg-white border-2 border-[#141413] shadow-[3px_3px_0px_#141413]">
                  <p className="font-sans text-base sm:text-lg text-[#141413] font-medium leading-relaxed italic">
                    "{data.excerpt}"
                  </p>
                </div>
              )}

              {/* Author & Meta Bar */}
              <div className="flex items-center justify-between py-4 border-y border-[#141413]/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#141413] bg-[#D4F050] shadow-[1px_1px_0px_#141413]">
                    <img
                      src="/avdhesh-kumar.png"
                      alt={author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm text-[#141413]">{author}</div>
                    <div className="font-mono text-[10px] text-[#6B6862]">Full-Stack Developer & Writer</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#141413]/30 bg-white font-mono text-xs text-[#141413]">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>{data.likes || 12} Likes</span>
                  </div>
                </div>
              </div>

              {/* Featured Banner Image */}
              {bannerImage && (
                <div className="rounded-2xl overflow-hidden border-2 border-[#141413] shadow-[4px_4px_0px_#141413] bg-white aspect-[16/9]">
                  <img
                    src={bannerImage}
                    alt={imageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Rich Content Article Body */}
              <div className="pt-2">
                {data.content ? (
                  <RichContentRenderer content={data.content} readTime={readingTime} />
                ) : (
                  <div className="py-12 text-center border-2 border-dashed border-[#141413]/30 rounded-2xl p-6 bg-white/50">
                    <Sparkles className="w-8 h-8 text-[#141413]/40 mx-auto mb-2" />
                    <p className="font-mono text-xs text-[#6B6862]">
                      No rich body content written yet. Write content in the editor to see it live here.
                    </p>
                  </div>
                )}
              </div>

              {/* Tags Section */}
              {tagsList.length > 0 && (
                <div className="pt-6 border-t border-[#141413]/15">
                  <div className="font-mono text-xs text-[#6B6862] uppercase tracking-wider mb-3">Tags & Topics</div>
                  <div className="flex flex-wrap gap-2">
                    {tagsList.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-white border border-[#141413] font-mono text-xs text-[#141413] shadow-[2px_2px_0px_#141413]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Bio Box */}
              <div className="p-6 rounded-3xl bg-[#F5F2EA] border-2 border-[#141413] shadow-[4px_4px_0px_#141413] flex flex-col sm:flex-row items-center gap-5">
                <img
                  src="/avdhesh-kumar.png"
                  alt="Avdhesh Kumar"
                  className="w-16 h-16 rounded-full border-2 border-[#141413] object-cover shrink-0"
                />
                <div className="text-center sm:text-left">
                  <div className="font-display font-bold text-lg text-[#141413]">Written by {author}</div>
                  <p className="font-sans text-xs text-[#6B6862] mt-1 leading-relaxed">
                    Full-Stack & Frontend Web Developer building modern web applications with React, Next.js, and Node.js. MCA student at DPG Degree College & 4× College Chess Champion.
                  </p>
                </div>
              </div>
            </article>
          ) : (
            /* =======================================================
               AUTHENTIC PROJECT LIVE PREVIEW
               ======================================================= */
            <article className="p-6 sm:p-10 lg:p-12 space-y-8 bg-[#FAF8F2]">
              {/* Category & Status */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="px-3.5 py-1 rounded-full bg-[#141413] text-[#D4F050] font-mono text-xs uppercase font-bold tracking-wider">
                  {category}
                </span>
                <span className="font-mono text-xs text-[#6B6862]">
                  Added: {formattedDate}
                </span>
              </div>

              {/* Project Title */}
              <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#141413] leading-[1.15] tracking-tight">
                {title}
              </h1>

              {/* Short Description Lead */}
              {data.shortDescription && (
                <p className="font-sans text-base sm:text-lg text-[#6B6862] leading-relaxed">
                  {data.shortDescription}
                </p>
              )}

              {/* Live Links Action Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {data.liveUrl && (
                  <a
                    href={data.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#D4F050] text-[#141413] border-2 border-[#141413] font-mono text-xs uppercase font-bold tracking-wider shadow-[3px_3px_0px_#141413] hover:translate-x-0.5 hover:translate-y-0.5"
                  >
                    <Globe className="w-4 h-4" />
                    <span>View Live Deployment</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}

                {data.githubUrl && (
                  <a
                    href={data.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-[#141413] border-2 border-[#141413] font-mono text-xs uppercase font-bold tracking-wider shadow-[3px_3px_0px_#141413] hover:translate-x-0.5 hover:translate-y-0.5"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub Repository</span>
                  </a>
                )}

                <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border-2 border-[#141413] bg-white font-mono text-xs font-bold text-[#141413] shadow-[2px_2px_0px_#141413]">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>{data.likes || 15} Likes</span>
                </div>
              </div>

              {/* Featured Project Showcase Image */}
              {bannerImage && (
                <div className="rounded-3xl overflow-hidden border-2 border-[#141413] shadow-[6px_6px_0px_#141413] bg-white aspect-[16/9]">
                  <img
                    src={bannerImage}
                    alt={imageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Tech Stack Chips */}
              {techStackList.length > 0 && (
                <div className="p-6 rounded-3xl bg-white border-2 border-[#141413] shadow-[4px_4px_0px_#141413]">
                  <div className="font-mono text-xs text-[#6B6862] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#141413]" />
                    <span>Technologies & Architecture</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {techStackList.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-[#FAF8F2] border border-[#141413] font-mono text-xs font-bold text-[#141413]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Project Description / Case Study */}
              <div className="pt-4">
                <div className="font-mono text-xs text-[#6B6862] uppercase tracking-wider mb-4">Project Overview & Details</div>
                {data.description ? (
                  <RichContentRenderer content={data.description} />
                ) : (
                  <p className="font-sans text-sm text-[#6B6862] italic">
                    No detailed description provided yet.
                  </p>
                )}
              </div>
            </article>
          )}
        </div>
      </main>

      {/* 3. BOTTOM FOOTER HINT */}
      <footer className="shrink-0 bg-[#FAF8F2] border-t-2 border-[#141413] px-6 py-2.5 flex items-center justify-between text-[#6B6862] font-mono text-xs">
        <div className="flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-[#141413]" />
          <span>Live Preview Mode — changes update in real time with the form</span>
        </div>
        <div className="hidden sm:block">
          Press <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-[#141413] text-[#141413] font-bold">Esc</kbd> to close
        </div>
      </footer>
    </div>
  );
};
