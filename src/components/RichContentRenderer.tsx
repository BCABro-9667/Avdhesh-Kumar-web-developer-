import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface RichContentRendererProps {
  content: string;
  className?: string;
  collapsible?: boolean;
  maxCollapsedHeight?: number; // in pixels, e.g. 500
  readTime?: string;
}

export const RichContentRenderer: React.FC<RichContentRendererProps> = ({
  content,
  className = "",
  collapsible = false,
  maxCollapsedHeight = 520,
  readTime,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Normalize and transform HTML content for optimal theme styling and mobile responsiveness
  const processedHtml = useMemo(() => {
    if (!content || typeof content !== "string") return "";

    let html = content;

    // Decode double-encoded HTML entities if present (e.g. from some editors)
    if (html.includes("&lt;p&gt;") || html.includes("&lt;div&gt;") || html.includes("&lt;h")) {
      const txt = document.createElement("textarea");
      txt.innerHTML = html;
      html = txt.value;
    }

    // Wrap bare tables in a responsive scroll container so they never break layouts on mobile
    html = html.replace(
      /(<table\b[^>]*>[\s\S]*?<\/table>)/gi,
      '<div class="rich-table-wrapper overflow-x-auto my-6 rounded-2xl border-2 border-[#141413] shadow-[4px_4px_0px_#141413] bg-[#FAF8F2]">$1</div>'
    );

    // Ensure all images inside rich content have lazy loading, clean referrer policy, 100% width, actual height, and no border radius
    html = html.replace(
      /<img\b([^>]*)>/gi,
      (match, attrs) => {
        if (!attrs.includes("referrerpolicy")) {
          attrs += ' referrerpolicy="no-referrer"';
        }
        if (!attrs.includes("loading")) {
          attrs += ' loading="lazy"';
        }
        if (!attrs.includes("class=")) {
          attrs += ' class="w-full h-auto rounded-none my-4"';
        } else {
          attrs = attrs.replace(/class="([^"]*)"/, 'class="$1 w-full h-auto rounded-none my-4"');
        }
        return `<img ${attrs}>`;
      }
    );

    return html;
  }, [content]);

  // Determine if content is long enough to warrant a collapsible "Read More"
  const isContentLong = useMemo(() => {
    if (!collapsible || !content) return false;
    // Strip tags to get raw length
    const rawText = content.replace(/<[^>]*>/g, "").trim();
    return rawText.length > 950 || (content.match(/<p\b/gi) || []).length > 4;
  }, [collapsible, content]);

  return (
    <div className={`relative ${className}`}>
      <div
        className={`rich-theme-content transition-all duration-500 ease-in-out ${
          collapsible && isContentLong && !isExpanded
            ? "max-h-[520px] overflow-hidden"
            : ""
        }`}
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />

      {/* "Read More" gradient overlay & button when collapsed */}
      {collapsible && isContentLong && !isExpanded && (
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#FAF8F2] via-[#FAF8F2]/95 to-transparent flex items-end justify-center pb-4 z-20 pointer-events-none">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="pointer-events-auto inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#141413] text-[#D4F050] hover:bg-[#D4F050] hover:text-[#141413] font-mono text-xs uppercase tracking-wider font-bold border-2 border-[#141413] shadow-[4px_4px_0px_#141413] hover:shadow-[2px_2px_0px_#141413] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
          >
            <span>Read More {readTime ? `(${readTime})` : ""}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* "Show Less" button when expanded */}
      {collapsible && isContentLong && isExpanded && (
        <div className="pt-6 mt-8 flex justify-center border-t border-[#141413]/10">
          <button
            type="button"
            onClick={() => {
              setIsExpanded(false);
              // Smooth scroll back up to content area
              window.scrollTo({ top: Math.max(0, window.scrollY - 400), behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FAF8F2] text-[#141413] hover:bg-[#141413] hover:text-[#F5F2EA] font-mono text-xs uppercase tracking-wider font-bold border-2 border-[#141413] transition-all cursor-pointer shadow-[2px_2px_0px_#141413]"
          >
            <span>Show Less</span>
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
