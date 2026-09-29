import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Filter, Award, Maximize2, X, ExternalLink, Sparkles } from "lucide-react";
import { GalleryItem } from "../data/portfolio";
import { SectionHeading } from "./SectionHeading";
import { MagneticButton } from "./MagneticButton";
import { fetchGallery } from "../lib/apiClient";

const DEFAULT_CATEGORIES = ["All", "Chess", "Certificates", "Hackathons", "Inventions"];

interface GalleryProps {
  onNavigate?: (page: string) => void;
  isPage?: boolean;
  hideHeader?: boolean;
}

export const Gallery: React.FC<GalleryProps> = ({ onNavigate, isPage = false, hideHeader = false }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const { data: rawGallery, isLoading: loading } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => fetchGallery(),
  });

  const { items, categories } = useMemo(() => {
    if (rawGallery && Array.isArray(rawGallery) && rawGallery.length > 0) {
      const mapped: GalleryItem[] = rawGallery.map((item: any, idx: number) => ({
        id: item._id || String(idx),
        title: item.title,
        category: item.category || "Milestones",
        date: item.date || "Recent",
        description: item.description || item.title,
        imageUrl: item.image || item.imageUrl || "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80",
      }));
      const uniqueCats = Array.from(new Set(["All", ...mapped.map((m) => m.category).filter(Boolean)]));
      return {
        items: mapped,
        categories: uniqueCats.length > 1 ? uniqueCats : DEFAULT_CATEGORIES,
      };
    }
    return {
      items: [],
      categories: DEFAULT_CATEGORIES,
    };
  }, [rawGallery]);

  const filteredItems = isPage
    ? activeCategory === "All"
      ? items
      : items.filter((item) => item.category.toLowerCase() === activeCategory.toLowerCase())
    : items.slice(0, 8);

  return (
    <section id="gallery" className={`py-16 sm:py-24 ${isPage ? "bg-transparent" : "bg-transparent border-t border-[#141413]/10"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {!hideHeader && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionHeading
              label={isPage ? "04 / VISUAL ARCHIVE" : "04 / GALLERY & ARCHIVE"}
              title={isPage ? "Certificates, Trophies & Milestones." : "Chess, Trophies & Milestones."}
              subtitle={
                isPage
                  ? "Explore high-resolution visual documents of chess championships, government IT certificates, and collegiate hackathons."
                  : "A visual documentation of competitive chess championships, professional certificates, hackathon triumphs, and software engineering labs."
              }
            />

            {!isPage && onNavigate && (
              <MagneticButton strength={0.3}>
                <button
                  type="button"
                  onClick={() => onNavigate("gallery")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141413] text-[#F5F2EA] font-mono text-xs uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-colors border border-[#141413] cursor-pointer shrink-0 shadow-[2px_2px_0px_#141413]"
                >
                  <span>Explore more gallery ↗</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </MagneticButton>
            )}
          </div>
        )}

        {/* Category Filters (Always available on full page) */}
        {isPage && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-10">
            <div className="flex items-center gap-1.5 text-[#6B6862] font-mono text-xs uppercase tracking-wider mr-2 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </div>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer border-2 ${
                    isActive
                      ? "bg-[#141413] text-[#D4F050] border-[#141413] shadow-[2px_2px_0px_#141413]"
                      : "bg-white text-[#6B6862] border-[#141413]/20 hover:border-[#141413] hover:text-[#141413]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Masonry Layout Area */}
        {loading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-8 [column-fill:_balance]">
            {Array.from({ length: isPage ? 6 : 4 }).map((_, i) => (
              <div
                key={i}
                className="break-inside-avoid mb-6 sm:mb-8 rounded-3xl bg-white border-2 border-[#141413]/15 overflow-hidden shadow-[4px_4px_0px_#141413]/10 animate-pulse relative"
              >
                <div className={`w-full ${i % 2 === 0 ? "h-72 sm:h-96" : "h-56 sm:h-72"} bg-[#141413]/10`} />
                <div className="absolute top-3.5 left-3.5 w-20 h-6 bg-[#141413]/20 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white border-2 border-[#141413]/15 rounded-3xl font-mono text-sm text-[#6B6862] shadow-[4px_4px_0px_#141413]/10">
            No gallery items found in category "{activeCategory}".
          </div>
        ) : (
          /* True Masonry with columns-1 sm:columns-2 lg:columns-3 */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-8 [column-fill:_balance]">
            {filteredItems.map((item, idx) => (
              <div key={item.id} className="break-inside-avoid mb-6 sm:mb-8 group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  onClick={() => setSelectedPhoto(item)}
                  className="rounded-3xl overflow-hidden border border-[#141413]/20 bg-white shadow-sm hover:shadow-md hover:border-[#141413]/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative"
                  title="Click to view details"
                >
                  {/* Whole Uncropped Image Display */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-auto block object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* ONLY Show Category Badge */}
                  <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#141413]/90 backdrop-blur-md text-[#D4F050] font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border border-white/20 shadow-md">
                    {item.category}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}

        {!isPage && onNavigate && (
          <div className="mt-12 text-center sm:hidden">
            <button
              type="button"
              onClick={() => onNavigate("gallery")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141413] text-[#F5F2EA] font-mono text-xs uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-colors border border-[#141413] shadow-[2px_2px_0px_#141413]"
            >
              <span>Explore more gallery ↗</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Photo Lightbox Modal - Entire Image Visible in Full Resolution */}
        <AnimatePresence>
          {selectedPhoto && (
            <div
              onClick={() => setSelectedPhoto(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#141413]/85 backdrop-blur-md overflow-y-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl rounded-3xl bg-white border-2 border-[#141413] overflow-hidden shadow-[8px_8px_0px_#141413] relative my-auto flex flex-col"
              >
                {/* Full Uncropped Image Preview */}
                <div className="relative bg-[#141413] p-4 sm:p-6 flex items-center justify-center min-h-[300px] max-h-[72vh] overflow-hidden">
                  <img
                    src={selectedPhoto.imageUrl}
                    alt={selectedPhoto.title}
                    className="max-h-[66vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(null)}
                    className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-[#141413]/90 text-[#F5F2EA] font-mono text-xs uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-colors cursor-pointer border border-white/20 shadow-md flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Close</span>
                  </button>
                </div>

                {/* Details Section */}
                <div className="p-6 sm:p-8 bg-white border-t-2 border-[#141413]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#D4F050] text-[#141413] font-bold uppercase tracking-wider border border-[#141413]/20">
                      {selectedPhoto.category}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#6B6862]">{selectedPhoto.date}</span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#141413] mb-3 leading-snug">
                    {selectedPhoto.title}
                  </h3>

                  <p className="font-sans text-sm sm:text-base text-[#6B6862] leading-relaxed mb-6">
                    {selectedPhoto.description}
                  </p>

                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#141413]/10">
                    <a
                      href={selectedPhoto.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#141413] hover:underline"
                    >
                      <span>Open original full resolution</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setSelectedPhoto(null)}
                      className="px-6 py-2.5 rounded-full bg-[#141413] text-[#D4F050] font-mono text-xs uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-colors cursor-pointer border border-[#141413] font-bold"
                    >
                      Done viewing
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
