import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Clock, Tag, ArrowRight, Calendar } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { BlogPostItem } from "../data/portfolio";
import { MagneticButton } from "./MagneticButton";
import { LikeButton } from "./LikeButton";
import { fetchBlogPosts } from "../lib/apiClient";
import { BlogGridSkeleton } from "./Skeleton";
import { calculateReadingTime } from "../utils/readingTime";

interface BlogProps {
  onNavigate?: (page: string) => void;
}

export const Blog: React.FC<BlogProps> = ({ onNavigate }) => {
  const [blogsList, setBlogsList] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const posts = await fetchBlogPosts();
        if (posts && posts.length > 0 && isMounted) {
          const mapped: BlogPostItem[] = posts.map((p: any, idx: number) => ({
            id: p.slug || p._id || `blog-${idx}`,
            title: p.title,
            status: p.status || "published",
            category: p.category || "Web Development",
            readTime: p.readTime || calculateReadingTime(p.content),
            excerpt: p.excerpt || p.content?.slice(0, 140) || "",
            tags: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : [p.category || "Full-Stack"],
            content: p.content,
            imageUrl: p.featuredImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
            date: p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Active Journal",
          }));
          setBlogsList(mapped);
        } else if (isMounted) {
          setBlogsList([]);
        }
      } catch (err) {
        console.warn("Could not load dynamic blog posts:", err);
        if (isMounted) setBlogsList([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

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
                {/* Left Side: Image container with white background and card-matching border radius */}
                <div className="w-full md:w-[320px] lg:w-[380px] xl:w-[420px] shrink-0 h-[220px] md:h-full bg-white relative flex items-center justify-center p-3 sm:p-4 overflow-hidden border-0 shadow-none outline-none">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-[1.02] transition-transform duration-500 border-0 shadow-none outline-none"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white rounded-2xl font-mono text-xs text-[#6B6862]">
                      Article Preview
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-[#141413]/85 backdrop-blur-md text-[#F5F2EA] font-mono text-[10px] uppercase tracking-wider border border-white/20 shadow-none">
                    {post.category}
                  </div>
                </div>

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
                      {post.tags.map((tag) => (
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
