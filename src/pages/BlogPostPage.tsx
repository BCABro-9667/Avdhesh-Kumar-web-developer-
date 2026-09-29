import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, useScroll } from "motion/react";
import { ArrowLeft, Clock, Tag, Share2, Sparkles, BookOpen, Quote, CheckCircle2, ChevronRight, ChevronDown, Check, MessageSquare, Send, AlertCircle } from "lucide-react";
import { PORTFOLIO_DATA, BlogPostItem } from "../data/portfolio";
import { MagneticButton } from "../components/MagneticButton";
import { LikeButton } from "../components/LikeButton";
import { fetchBlogPostBySlug, fetchComments, postComment } from "../lib/apiClient";
import { BlogPostDetailSkeleton } from "../components/Skeleton";
import { calculateReadingTime } from "../utils/readingTime";
import { RichContentRenderer } from "../components/RichContentRenderer";
import { updateDocumentSEO } from "../utils/seo";

interface CommentItem {
  _id: string;
  blogId: string;
  displayName: string;
  avatarUrl?: string;
  comment: string;
  createdAt: string;
}

function formatTimeAgo(dateString: string | Date): string {
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffSec = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));
    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 7) return `${diffDay}d ago`;
    const diffWeek = Math.floor(diffDay / 7);
    if (diffWeek < 4) return `${diffWeek}w ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "recently";
  }
}

const CommentItemRow: React.FC<{ comment: CommentItem }> = ({ comment }) => {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="py-4 sm:py-5 flex items-start gap-3.5 sm:gap-4 border-b border-[#141413]/10 last:border-b-0">
      {/* Circular Avatar from avtars.json */}
      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[#D4F050]/20 border border-[#141413]/10 flex items-center justify-center">
        {comment.avatarUrl && !imgErr ? (
          <img
            src={comment.avatarUrl}
            alt={comment.displayName}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="font-display font-bold text-sm text-[#141413]">
            {comment.displayName?.charAt(0).toUpperCase() || "A"}
          </span>
        )}
      </div>

      {/* Content: Name and faded relative time on same line, comment directly below */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-[#141413] tracking-tight">
            {comment.displayName}
          </span>
          <span className="text-[#6B6862]/40 text-xs">•</span>
          <span className="text-xs text-[#6B6862] font-sans">
            {formatTimeAgo(comment.createdAt)}
          </span>
        </div>
        <p className="font-sans text-sm text-[#141413]/90 leading-relaxed mt-1 whitespace-pre-wrap break-words">
          {comment.comment}
        </p>
      </div>
    </div>
  );
};

const BlogComments: React.FC<{ blogId: string }> = ({ blogId }) => {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const { data: comments = [], isLoading: loading } = useQuery<CommentItem[]>({
    queryKey: ["blogComments", blogId],
    queryFn: () => fetchComments(blogId),
    enabled: Boolean(blogId),
  });

  const postMutation = useMutation({
    mutationFn: ({ email, comment }: { email: string; comment: string }) =>
      postComment(blogId, email, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogComments", blogId] });
      setCommentText("");
      setEmail("");
      setSuccessMsg("Comment posted successfully!");
      setTimeout(() => setSuccessMsg(""), 5000);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Failed to submit comment. Please check your email and try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const trimmedEmail = email.trim();
    const trimmedComment = commentText.trim();

    // Frontend Instant Validation
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!trimmedComment || trimmedComment.length < 2) {
      setErrorMsg("Comment must be at least 2 characters long.");
      return;
    }
    if (trimmedComment.length > 1000) {
      setErrorMsg("Comment cannot exceed 1000 characters.");
      return;
    }

    postMutation.mutate({ email: trimmedEmail, comment: trimmedComment });
  };

  const isSubmitting = postMutation.isPending;

  const sortedComments = [...comments].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return sortBy === "latest" ? timeB - timeA : timeA - timeB;
  });

  return (
    <div className="pt-4 space-y-6 bg-transparent">
      {/* Comment Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 font-sans text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-[#D4F050]/30 border border-[#141413]/15 text-[#141413] font-sans text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#141413]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Compact Email Input */}
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email..."
            required
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#141413]/15 font-sans text-sm text-[#141413] placeholder:text-[#6B6862]/60 focus:outline-none focus:border-[#141413] transition-colors"
          />
        </div>

        {/* Textarea */}
        <div>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your thoughts ..."
            rows={3}
            maxLength={1000}
            required
            className="w-full p-4 rounded-xl bg-white border border-[#141413]/15 font-sans text-sm text-[#141413] placeholder:text-[#6B6862]/60 focus:outline-none focus:border-[#141413] transition-colors resize-y"
          />
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-1">
          <span className="font-mono text-[11px] text-[#6B6862]/70">
            {commentText.length}/1000
          </span>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#141413] text-[#D4F050] font-mono text-xs uppercase tracking-wider font-bold hover:bg-[#232320] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-[#D4F050] border-t-transparent animate-spin" />
                <span>SUBMITTING...</span>
              </>
            ) : (
              <>
                <span>SUBMIT COMMENT</span>
                <Send className="w-3.5 h-3.5 text-[#D4F050]" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Subtle Divider */}
      <hr className="border-[#141413]/10 my-6" />

      {/* Header with count and sorting */}
      <div className="flex items-center justify-between py-1">
        <h3 className="font-display font-bold text-xl sm:text-2xl text-[#141413] tracking-tight">
          {sortedComments.length} {sortedComments.length === 1 ? "Comment" : "Comments"}
        </h3>
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortDropdownOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 font-sans text-sm text-[#6B6862] hover:text-[#141413] transition-colors cursor-pointer"
          >
            <span>{sortBy === "latest" ? "Latest First" : "Oldest First"}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${sortDropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {sortDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 py-1 bg-white rounded-xl border border-[#141413]/15 shadow-lg z-20">
              <button
                type="button"
                onClick={() => { setSortBy("latest"); setSortDropdownOpen(false); }}
                className={`w-full text-left px-3.5 py-1.5 text-xs font-medium cursor-pointer ${
                  sortBy === "latest" ? "text-[#141413] font-bold bg-[#FAF8F2]" : "text-[#6B6862] hover:bg-[#FAF8F2]"
                }`}
              >
                Latest First
              </button>
              <button
                type="button"
                onClick={() => { setSortBy("oldest"); setSortDropdownOpen(false); }}
                className={`w-full text-left px-3.5 py-1.5 text-xs font-medium cursor-pointer ${
                  sortBy === "oldest" ? "text-[#141413] font-bold bg-[#FAF8F2]" : "text-[#6B6862] hover:bg-[#FAF8F2]"
                }`}
              >
                Oldest First
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Subtle Divider */}
      <hr className="border-[#141413]/10 my-2" />

      {/* Comments List */}
      <div>
        {loading ? (
          <div className="py-8 text-center font-mono text-xs text-[#6B6862]">Loading comments...</div>
        ) : sortedComments.length === 0 ? (
          <div className="py-8 text-center font-sans text-sm text-[#6B6862]">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          <div>
            {sortedComments.map((c) => (
              <CommentItemRow key={c._id} comment={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface BlogPostPageProps {
  postId: string;
  onNavigate: (page: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ postId, onNavigate }) => {
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const { scrollYProgress } = useScroll();

  const { data: remoteData, isLoading: loadingRemote } = useQuery({
    queryKey: ["blogPost", postId],
    queryFn: () => fetchBlogPostBySlug(postId),
    enabled: Boolean(postId),
  });

  const post = useMemo<BlogPostItem | null>(() => {
    if (remoteData && remoteData.post) {
      const apiPost = remoteData.post;
      return {
        id: apiPost.slug || apiPost._id || postId,
        title: apiPost.title,
        status: apiPost.status || "published",
        category: apiPost.category || "Engineering",
        readTime: apiPost.readTime || calculateReadingTime(apiPost.content),
        excerpt: apiPost.excerpt || apiPost.content?.slice(0, 140) || "",
        tags: Array.isArray(apiPost.tags) && apiPost.tags.length > 0 ? apiPost.tags : [apiPost.category || "Full-Stack"],
        content: apiPost.content,
        imageUrl: apiPost.featuredImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      };
    }
    return null;
  }, [remoteData, postId]);

  const loading = loadingRemote;

  // Real reading time calculated accurately based on word count, images, and tables
  const realReadingTime = calculateReadingTime(
    post?.content || (post?.sections ? post.sections.map((s) => s.content || s.title || "").join(" ") : "")
  );

  // Sync document SEO & OpenGraph / Twitter card metadata
  useEffect(() => {
    if (post) {
      const canonicalUrl = `${window.location.origin}/blog/${post.id}`;
      const postImg =
        post.imageUrl ||
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80";

      updateDocumentSEO({
        title: `${post.title} — Avdhesh Kumar Journal`,
        description: post.excerpt || "Read full software engineering writeup by Avdhesh Kumar.",
        image: postImg,
        url: canonicalUrl,
        type: "article",
        category: post.category,
        publishedTime: new Date().toISOString(),
        schema: {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "image": [postImg],
          "author": {
            "@type": "Person",
            "name": "Avdhesh Kumar",
            "url": window.location.origin
          },
          "publisher": {
            "@type": "Person",
            "name": "Avdhesh Kumar"
          },
          "datePublished": new Date().toISOString(),
          "url": canonicalUrl
        }
      });
    }
  }, [post]);

  const handleShare = () => {
    if (!post) return;
    const shareUrl = `${window.location.origin}/blog/${post.id}`;

    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 3000);
    }
  };

  if (loading) {
    return <BlogPostDetailSkeleton />;
  }

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center pt-28">
        <h1 className="font-display font-bold text-3xl text-[#141413] mb-4">Article Not Found</h1>
        <p className="font-mono text-sm text-[#6B6862] mb-6">The blog post you requested could not be located or may have been unpublished.</p>
        <button
          onClick={() => onNavigate("blogs")}
          className="px-6 py-3 rounded-2xl bg-[#141413] text-[#D4F050] font-mono text-xs uppercase font-bold tracking-wider cursor-pointer shadow-[3px_3px_0px_#141413]"
        >
          ← Return to Journal
        </button>
      </div>
    );
  }

  return (
    <article className="pt-24 sm:pt-36 pb-24 min-h-screen bg-transparent relative outline-none">
      {/* Toast Notification when link copied */}
      {showCopiedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#141413] text-[#F5F2EA] font-mono text-xs font-bold border-2 border-[#D4F050] shadow-[4px_4px_0px_#141413] animate-bounce">
          <Check className="w-4 h-4 text-[#D4F050]" />
          <span>Article link copied to clipboard!</span>
        </div>
      )}

      {/* Reading Progress Bar - Borderless on mobile */}
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#D4F050] z-50 border-b-0 sm:border-b sm:border-[#141413]/20 outline-none"
      />

      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => onNavigate("blogs")}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#6B6862] hover:text-[#141413] transition-colors cursor-pointer outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Journal</span>
          </button>
        </div>

        {/* Header Metadata */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-xs">
            <span className="px-3 py-1 rounded-full bg-[#D4F050] text-[#141413] font-bold uppercase tracking-wider border-0 sm:border sm:border-[#141413]/10">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-[#141413] font-medium bg-[#FAF8F2] px-3 py-1 rounded-full border border-[#141413]/15">
              <Clock className="w-3.5 h-3.5 text-[#141413]" />
              <span>{realReadingTime}</span>
            </span>
            <span className="text-[#6B6862]">• Written by Avdhesh Kumar</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold text-[#141413] tracking-tight leading-[1.12]">
            {post.title}
          </h1>

          <p className="font-sans text-base sm:text-xl text-[#6B6862] leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-0 sm:border-t sm:border-[#141413]/15">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 font-mono text-xs px-3 py-1 rounded-full bg-[#FAF8F2] text-[#141413] border-0 sm:border sm:border-[#141413]/15 outline-none"
                >
                  <Tag className="w-3 h-3 text-[#A5C418]" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 ml-auto">
              <LikeButton
                itemId={post.id}
                type="blog"
                size="md"
              />

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF8F2] border border-[#141413]/20 font-mono text-xs uppercase tracking-wider text-[#141413] hover:bg-[#141413] hover:text-[#F5F2EA] transition-colors cursor-pointer outline-none"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Article</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Featured Photo - Framed with theme border radius and clean presentation */}
        {post.imageUrl && (
          <div className="w-full mb-8 sm:mb-12 overflow-hidden rounded-2xl sm:rounded-3xl border border-[#141413]/15 shadow-[3px_3px_0px_rgba(20,20,19,0.08)] bg-white">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-auto rounded-2xl sm:rounded-3xl border-0 outline-none"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Full Article Content - Clean & Borderless without outline or shadow */}
        <div className="bg-[#FAF8F2] rounded-2xl sm:rounded-3xl border-0 p-4 sm:p-12 space-y-6 sm:space-y-8 font-sans text-base sm:text-lg text-[#141413]/90 leading-relaxed shadow-none outline-none ring-0">
          {/* Main article content - fully expanded without truncation or show more */}
          {post.content && (
            <RichContentRenderer
              content={post.content}
              collapsible={false}
              readTime={realReadingTime}
            />
          )}

          {/* Render Rich Sections if available */}
          {post.sections && post.sections.length > 0 ? (
            <div className="space-y-6 sm:space-y-8 border-0 outline-none mt-8 pt-8 border-t border-[#141413]/10">
              {post.sections.map((sec, idx) => {
                if (sec.type === "heading") {
                  return (
                    <h2
                      key={idx}
                      className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#141413] pt-6 sm:pt-8 border-0 outline-none tracking-tight"
                    >
                      {sec.title}
                    </h2>
                  );
                }

                if (sec.type === "subheading") {
                  return (
                    <h3
                      key={idx}
                      className="font-display text-xl sm:text-2xl font-bold text-[#141413] pt-4 border-0 outline-none tracking-tight"
                    >
                      {sec.title}
                    </h3>
                  );
                }

                if (sec.type === "text") {
                  return (
                    <p
                      key={idx}
                      className="text-base sm:text-lg text-[#141413]/90 leading-relaxed border-0 outline-none"
                    >
                      {sec.content}
                    </p>
                  );
                }

                if (sec.type === "image") {
                  return (
                    <figure
                      key={idx}
                      className="my-6 sm:my-10 rounded-none overflow-hidden border-0 outline-none bg-transparent"
                    >
                      <img
                        src={sec.src}
                        alt={sec.alt || post.title}
                        className="w-full h-auto rounded-none border-0 outline-none"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      {sec.caption && (
                        <figcaption className="p-3 sm:p-4 text-center font-mono text-xs text-[#6B6862] bg-[#FAF8F2] border-0 outline-none">
                          {sec.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                }

                if (sec.type === "quote") {
                  return (
                    <blockquote
                      key={idx}
                      className="my-6 sm:my-10 p-5 sm:p-8 rounded-xl sm:rounded-2xl bg-[#F5F2EA] border-0 sm:border-l-4 sm:border-[#141413] outline-none shadow-none"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#A5C418] shrink-0 mt-1 opacity-80" />
                        <div className="space-y-3">
                          <p className="font-display italic text-lg sm:text-2xl text-[#141413] leading-snug">
                            "{sec.content}"
                          </p>
                          {(sec.author || sec.source) && (
                            <footer className="font-mono text-xs text-[#6B6862] flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 border-0 outline-none">
                              <span className="font-bold text-[#141413]">{sec.author}</span>
                              {sec.source && <span className="text-[#6B6862]">• {sec.source}</span>}
                            </footer>
                          )}
                        </div>
                      </div>
                    </blockquote>
                  );
                }

                if (sec.type === "callout") {
                  return (
                    <div
                      key={idx}
                      className="my-6 sm:my-8 p-5 sm:p-7 rounded-2xl bg-[#EFECE3] border-0 sm:border-2 sm:border-[#141413] shadow-none sm:shadow-[4px_4px_0px_#D4F050] outline-none space-y-2"
                    >
                      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#141413] font-bold">
                        <Sparkles className="w-4 h-4 text-[#A5C418]" />
                        <span>{sec.calloutTitle || "Key Architecture Takeaway"}</span>
                      </div>
                      <p className="text-sm sm:text-base font-medium text-[#141413] leading-relaxed">
                        {sec.content}
                      </p>
                    </div>
                  );
                }

                if (sec.type === "list") {
                  return (
                    <div
                      key={idx}
                      className="my-6 sm:my-8 p-5 sm:p-7 rounded-2xl bg-[#F5F2EA] border-0 sm:border sm:border-[#141413]/15 outline-none space-y-4"
                    >
                      {sec.title && (
                        <h4 className="font-display font-bold text-lg text-[#141413]">
                          {sec.title}
                        </h4>
                      )}
                      <ul className="space-y-2">
                        {sec.items?.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-[#141413]/90">
                            <span className="w-5 h-5 rounded-full bg-[#D4F050] text-[#141413] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border-0 sm:border sm:border-[#141413]/30">
                              0{i + 1}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          ) : null}

          {/* Article Appreciation & Like Bar */}
          <div className="my-8 p-6 sm:p-8 rounded-3xl bg-[#FAF8F2] border-2 border-[#141413] shadow-[4px_4px_0px_#141413] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-display font-bold text-xl text-[#141413]">
                Enjoyed this article?
              </h4>
              <p className="font-sans text-sm text-[#6B6862] mt-1">
                Drop a like to support the research and open-source writeups.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <LikeButton
                itemId={post.id}
                type="blog"
                size="lg"
              />
            </div>
          </div>

          {/* About Author Section: Left Circular Image, Right About Text */}
          <div className="pt-8 border-t border-[#141413]/10 flex flex-col sm:flex-row items-center sm:items-start gap-6 outline-none">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 border-2 border-[#141413] shadow-[3px_3px_0px_#141413] bg-[#141413]/10">
              <img
                src={PORTFOLIO_DATA.personal.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"}
                alt="Avdhesh Kumar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-3 text-center sm:text-left flex-1">
              <h3 className="font-display text-xl font-bold text-[#141413]">
                About the Author
              </h3>
              <p className="text-sm text-[#6B6862] leading-relaxed">
                Avdhesh Kumar is a Full-Stack & Frontend Developer based in Gurgaon, India, specializing in React, Next.js, and Node.js. 3-time College Chess Champion applying tactical foresight to software architecture.
              </p>
              <div>
                <button
                  onClick={() => onNavigate("contact")}
                  className="px-5 py-2 rounded-full bg-[#141413] text-[#F5F2EA] font-mono text-xs uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-colors cursor-pointer border-0 sm:border sm:border-[#141413] outline-none"
                >
                  Discuss this article ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Comments Section: Placed completely AFTER the blog end with zero borders */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 mt-16 pt-8">
        <BlogComments blogId={post.id} />
      </div>
    </article>
  );
};

