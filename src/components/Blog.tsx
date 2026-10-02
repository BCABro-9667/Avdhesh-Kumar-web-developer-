import React, { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Clock, Tag, ArrowRight, Calendar, BookOpen } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { BlogPostItem, PORTFOLIO_DATA } from "../data/portfolio";
import { MagneticButton } from "./MagneticButton";
import { LikeButton } from "./LikeButton";
import { fetchBlogPosts } from "../lib/apiClient";
import { BlogGridSkeleton } from "./Skeleton";
import { calculateReadingTime } from "../utils/readingTime";

interface BlogProps {
  onNavigate?: (page: string) => void;
}

const getBlogFallbackImage = (slugOrTitle: string = "") => {
  const s = slugOrTitle.toLowerCase();
  if (s.includes("ai") || s.includes("artificial") || s.includes("daily")) return "/blogs/ai-tools.jpg";
  if (s.includes("gandhi") || s.includes("mahatma")) return "/blogs/mahatma.jpg";
  if (s.includes("putin") || s.includes("battlefield") || s.includes("war")) return "/blogs/putin.webp";
  return "/og-image.png";
};

const BlogCardThumbnail: React.FC<{ post: BlogPostItem }> = ({ post }) => {
  const fallbackUrl = getBlogFallbackImage(post.id || post.title);
  const rawUrl = post.imageUrl || post.featuredImage;
  const initialUrl = rawUrl || fallbackUrl;

  const [currentSrc, setCurrentSrc] = useState<string>(initialUrl);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const nextUrl = post.imageUrl || post.featuredImage || fallbackUrl;
    setCurrentSrc(nextUrl);
    setHasError(false);
  }, [post.imageUrl, post.featuredImage, post.id, post.title]);

  const handleImageError = () => {
    if (currentSrc !== fallbackUrl) {
      setCurrentSrc(fallbackUrl);
    } else {
      setHasError(true);
      setIsLoaded(true);
    }
  };

  return (
    <div className="w-full md:w-[320px] lg:w-[380px] xl:w-[420px] shrink-0 h-[220px] md:h-full bg-white relative flex items-center justify-center p-3 sm:p-4 overflow-hidden border-0 shadow-none outline-none select-none">
      {/* Loading Shimmer Skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-3 sm:inset-4 rounded-2xl bg-[#EFECE4] animate-pulse flex items-center justify-center z-0">
          <div className="w-6 h-6 border-2 border-[#141413]/20 border-t-[#141413] rounded-full animate-spin" />
        </div>
      )}

      {hasError ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#FAF8F2] rounded-2xl font-mono text-xs text-[#6B6862] p-4 text-center">
          <BookOpen className="w-8 h-8 text-[#141413]/40 mb-2" />
          <span className="font-display font-bold text-sm text-[#141413] line-clamp-1">{post.title}</span>
          <span className="font-mono text-[10px] text-[#6B6862] mt-1">{post.category}</span>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={post.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={handleImageError}
          className={`w-full h-full object-cover rounded-2xl group-hover:scale-[1.02] transition-all duration-500 border-0 shadow-none outline-none ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          referrerPolicy="no-referrer"
        />
      )}

      {/* Category Badge */}
      <div className="absolute top-5 left-5 z-10 px-2.5 py-1 rounded-full bg-[#141413]/85 backdrop-blur-md text-[#F5F2EA] font-mono text-[10px] uppercase tracking-wider border border-white/20 shadow-none">
        {post.category}
      </div>
    </div>
  );
};

export const Blog: React.FC<BlogProps> = ({ onNavigate }) => {
  const { data: rawPosts } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: () => fetchBlogPosts(),
    initialData: PORTFOLIO_DATA.blogs,
    staleTime: 5 * 60 * 1000,
  });

  const blogsList = useMemo(() => {
    if (rawPosts && Array.isArray(rawPosts) && rawPosts.length > 0) {
      return rawPosts.map((p: any, idx: number) => {
        const fallbackImg = getBlogFallbackImage(p.slug || p.id || p.title);
        return {
          id: p.slug || p.id || p._id || `blog-${idx}`,
          title: p.title,
          status: p.status || "published",
          category: p.category || "Web Development",
          readTime: p.readTime || calculateReadingTime(p.content),
          excerpt: p.excerpt || (typeof p.content === "string" ? p.content.slice(0, 140) : "") || "",
          tags: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : [p.category || "Full-Stack"],
          content: p.content,
          imageUrl: p.imageUrl || p.featuredImage || fallbackImg,
          featuredImage: p.featuredImage || p.imageUrl || fallbackImg,
          date: p.date || (p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Active Journal"),
        };
      });
    }
    return PORTFOLIO_DATA.blogs;
  }, [rawPosts]);

  const loading = !blogsList || blogsList.length === 0;

  const handlePostClick = (postId: string) => {
    window.location.hash = `blog/${postId}`;
    if (onNavigate) {
      onNavigate(`blog/${postId}`);
    }
  };

  return (
    <section id="journal" className="py-24 sm:py-32 relative bg-[#FAF8F2]/60 border-t border-[#141413]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            label="03 / JOURNAL & ARTICLES"
            title="Ideas, builds & lessons."
            subtitle="Thoughts, architectural case studies, and engineering notes on modern web craftsmanship."
          />

          {onNavigate && (
            <MagneticButton strength={0.3}>
              <button
                onClick={() => onNavigate("blogs")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141413] text-[#F5F2EA] font-mono text-xs uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-colors border border-[#141413] cursor-pointer shrink-0"
              >
                <span>Explore more journal ↗</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </MagneticButton>
          )}
        </div>

        {loading ? (
          <BlogGridSkeleton count={3} />
        ) : (
          <div className="flex flex-col gap-6 sm:gap-8">
            {blogsList.slice(0, 3).map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => handlePostClick(post.id)}
                className="rounded-3xl bg-[#FAF8F2] border border-[#141413]/20 shadow-[3px_3px_0px_rgba(20,20,19,0.12)] hover:shadow-[1px_1px_0px_rgba(20,20,19,0.12)] hover:border-[#141413]/40 hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col md:flex-row items-stretch group min-h-[260px] md:h-[280px]"
              >
                {/* Left Side: Thumbnail with smooth loading & fallback */}
                <BlogCardThumbnail post={post} />

                {/* Right Side: Title, Description, Tags, Published info (No View Read Button) */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between overflow-hidden">
                  <div>
                    {/* Meta info: Published Date, Status, Read Time */}
                    <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap font-mono text-xs text-[#6B6862] mb-3">
                      <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[#D4F050] text-[#141413] font-bold uppercase tracking-wider">
                        {post.status || "PUBLISHED"}
                      </span>
                      <span className="flex items-center gap-1.5 text-[#141413]/80 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#141413]/60" />
                        <span>Published: {post.date || "2026"}</span>
                      </span>
                      {post.readTime && (
                        <span className="flex items-center gap-1 text-[#6B6862]">
                          <Clock className="w-3 h-3 text-[#141413]/60" />
                          <span>{post.readTime}</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-[#141413] mb-3 group-hover:underline underline-offset-4 decoration-2 decoration-[#141413] transition-all line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Short Description */}
                    <p className="font-sans text-sm sm:text-base text-[#6B6862] leading-relaxed line-clamp-2 sm:line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Tags row with Like Button (NO view read button) */}
                  <div className="pt-3 border-t border-[#141413]/10 flex items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5 overflow-hidden">
                      {(post.tags || []).map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 font-mono text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-[#F5F2EA] text-[#6B6862] border border-[#141413]/10"
                        >
                          <Tag className="w-2.5 h-2.5 opacity-60" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                      <LikeButton itemId={post.id} type="blog" size="sm" />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {onNavigate && (
          <div className="mt-12 text-center sm:hidden">
            <button
              onClick={() => onNavigate("blogs")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141413] text-[#F5F2EA] font-mono text-xs uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-colors border border-[#141413]"
            >
              <span>Explore more journal ↗</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
