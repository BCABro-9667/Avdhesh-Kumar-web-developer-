import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Clock, Tag, Search, Sparkles, Calendar, Filter, X } from "lucide-react";
import { BlogPostItem, PORTFOLIO_DATA } from "../data/portfolio";
import { LikeButton } from "../components/LikeButton";
import { fetchBlogPosts } from "../lib/apiClient";
import { BlogGridSkeleton } from "../components/Skeleton";
import { calculateReadingTime } from "../utils/readingTime";
import { updateDocumentSEO } from "../utils/seo";

interface BlogsPageProps {
  onNavigate: (page: string) => void;
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

export const BlogsPage: React.FC<BlogsPageProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    updateDocumentSEO({
      title: "Engineering Journal & Articles — Avdhesh Kumar",
      description: "In-depth engineering notes, React patterns, full-stack case studies, and modern web architecture lessons by Avdhesh Kumar.",
      url: "https://avdheshkumar.me/blogs",
      image: "https://avdheshkumar.me/og-image.png",
    });
  }, []);

  const { data: postsData, isLoading: loading } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: () => fetchBlogPosts(),
    initialData: PORTFOLIO_DATA.blogs,
    staleTime: 5 * 60 * 1000,
  });

  const allPosts: BlogPostItem[] = useMemo(() => {
    if (postsData && Array.isArray(postsData) && postsData.length > 0) {
      return postsData.map((p: any, idx: number) => {
        const fallbackImg = getBlogFallbackImage(p.slug || p.id || p.title);
        return {
          id: p.slug || p._id || `blog-${idx}`,
          title: p.title,
          status: p.status || "published",
          category: p.category || "Web Development",
          readTime: p.readTime || calculateReadingTime(p.content),
          excerpt: p.excerpt || (typeof p.content === "string" ? p.content.slice(0, 140) : "") || "",
          tags: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : [p.category || "Full-Stack"],
          content: p.content,
          imageUrl: p.imageUrl || p.featuredImage || fallbackImg,
          featuredImage: p.featuredImage || p.imageUrl || fallbackImg,
          date: p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Active Journal",
        };
      });
    }
    return PORTFOLIO_DATA.blogs;
  }, [postsData]);

  // Compute unique categories dynamically from all available posts
  const categories = useMemo(() => {
    const rawCategories = allPosts.map((p) => p.category).filter(Boolean);
    const unique = Array.from(new Set(rawCategories));
    return ["All", ...unique];
  }, [allPosts]);

  // Compute counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allPosts.length };
    allPosts.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [allPosts]);

  const filteredPosts = allPosts.filter((b) => {
    const matchesCategory =
      selectedCategory === "All" ||
      b.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim();

    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      b.title.toLowerCase().includes(query) ||
      b.category.toLowerCase().includes(query) ||
      (b.excerpt && b.excerpt.toLowerCase().includes(query)) ||
      b.tags.some((t) => t.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const handlePostClick = (postId: string) => {
    window.location.hash = `blog/${postId}`;
    onNavigate(`blog/${postId}`);
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="max-w-4xl mb-12">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#6B6862] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#D4F050] border border-[#141413]/30" />
            <span>JOURNAL & CASE STUDIES</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#141413] leading-[1.05] mb-6">
            Ideas, builds & <br />
            <span className="underline decoration-[#D4F050] decoration-4 underline-offset-8">
              engineering lessons.
            </span>
          </h1>

          <p className="font-sans text-lg sm:text-xl text-[#6B6862] leading-relaxed">
            Technical notes, architecture decisions, and observations on modern frontend development, REST APIs, and SEO optimization.
          </p>
        </div>

        {/* Filter and Search Controls Bar */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <div className="flex items-center gap-1.5 text-[#6B6862] font-mono text-xs uppercase tracking-wider mr-1 shrink-0">
                <Filter className="w-3.5 h-3.5 text-[#141413]" />
                <span className="font-bold text-[#141413]">Topic:</span>
              </div>
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                const count = categoryCounts[cat] ?? 0;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer border ${
                      isActive
                        ? "bg-[#141413] text-[#D4F050] border-[#141413] shadow-[2px_2px_0px_#141413] font-bold"
                        : "bg-[#FAF8F2] text-[#6B6862] border-[#141413]/15 hover:border-[#141413] hover:text-[#141413]"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? "bg-[#D4F050] text-[#141413] font-bold"
                          : "bg-[#141413]/10 text-[#6B6862]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-80 shrink-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6862]" />
                <input
                  type="text"
                  placeholder="Search title, tag, or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-full bg-[#FAF8F2] border border-[#141413]/20 font-sans text-xs text-[#141413] placeholder:text-[#6B6862] focus:outline-none focus:border-[#141413] transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6862] hover:text-[#141413]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Filter Indicator & Reset */}
          {(selectedCategory !== "All" || search) && (
            <div className="flex items-center gap-2 pt-1 font-mono text-xs text-[#6B6862] flex-wrap">
              <span>Showing results for:</span>
              {selectedCategory !== "All" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4F050] text-[#141413] font-bold text-[11px] border border-[#141413]/20">
                  Topic: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="hover:opacity-75 cursor-pointer ml-1"
                    title="Remove category filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#141413] text-[#F5F2EA] text-[11px]">
                  Keyword: "{search}"
                  <button
                    onClick={() => setSearch("")}
                    className="hover:opacity-75 cursor-pointer ml-1"
                    title="Clear search query"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearch("");
                }}
                className="underline hover:text-[#141413] ml-2 cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Articles List: Horizontally Aligned One by One, Uniform Size */}
        {loading ? (
          <div className="mb-16">
            <BlogGridSkeleton count={4} />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#FAF8F2] border-2 border-[#141413] text-center mb-16 shadow-[4px_4px_0px_#141413]">
            <p className="font-mono text-base font-bold text-[#141413] mb-2">No articles found</p>
            <p className="font-mono text-xs text-[#6B6862] mb-4">
              No journal articles matched your selected topic "{selectedCategory}"{search ? ` and search "${search}"` : ""}.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearch("");
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#141413] text-[#D4F050] font-mono text-xs uppercase tracking-wider font-bold hover:bg-[#D4F050] hover:text-[#141413] transition-colors border border-[#141413] cursor-pointer"
            >
              Reset Filters & Show All
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 sm:gap-8 mb-16">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
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
      </div>
    </div>
  );
};
