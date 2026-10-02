import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ExternalLink, X, Check, Filter } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { ProjectCard } from "./ProjectCard";
import { Project, PORTFOLIO_DATA } from "../data/portfolio";
import { MagneticButton } from "./MagneticButton";
import { fetchProjects } from "../lib/apiClient";
import { ProjectsGridSkeleton } from "./Skeleton";

interface ProjectsProps {
  onNavigate?: (page: string) => void;
  isPage?: boolean;
}

const DEFAULT_CATEGORIES = ["All", "E-Commerce", "Landing Page", "Mobile Apps", "Task Management", "Community"];

export const Projects: React.FC<ProjectsProps> = ({ onNavigate, isPage = false }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const { data: rawProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchProjects(),
    initialData: PORTFOLIO_DATA.projects,
    staleTime: 5 * 60 * 1000, // 5 min cache - instant instant initial load
  });

  const loading = !rawProjects || rawProjects.length === 0;

  const { projectsList, categories } = useMemo(() => {
    if (rawProjects && Array.isArray(rawProjects) && rawProjects.length > 0) {
      const styles: Array<'dark' | 'cream' | 'lavender'> = ['dark', 'cream', 'lavender'];
      const mapped: Project[] = rawProjects.map((item: any, idx: number) => {
        const style = styles[idx % styles.length];
        const tech = Array.isArray(item.techStack) && item.techStack.length > 0
          ? item.techStack.join(" · ")
          : (Array.isArray(item.tags) ? item.tags.join(" · ") : (item.technology || "React · Node.js"));
        
        const rawDesc = item.description || "";
        const features = typeof rawDesc === "string" && rawDesc.length < 2000 && rawDesc.includes("\n")
          ? rawDesc.split("\n").filter((s: string) => s.trim().length > 0)
          : (Array.isArray(item.features) && item.features.length > 0
              ? item.features
              : [item.shortDescription || (typeof rawDesc === "string" ? rawDesc.slice(0, 140) : "") || "Scalable modern architecture"]);

        return {
          id: item._id || item.slug || String(idx),
          _id: item._id,
          slug: item.slug,
          number: String(idx + 1).padStart(2, "0"),
          title: item.title,
          category: item.category || "Full-Stack",
          technology: tech,
          description: item.shortDescription || (typeof rawDesc === "string" ? rawDesc.slice(0, 200) : "") || "",
          shortDescription: item.shortDescription || (typeof rawDesc === "string" ? rawDesc.slice(0, 160) : ""),
          features: features.length > 0 ? features : ["Modern responsive architecture"],
          style: style,
          ctaText: "Explore Case Study ↗",
          url: item.liveUrl || item.url || "#",
          githubUrl: item.githubUrl || "",
          imageUrl: item.imageUrl || item.featuredImage || "/projects/taskmaster.png",
          featuredImage: item.featuredImage || item.imageUrl,
          likes: item.likes || 0,
        };
      });

      const uniqueCats = Array.from(new Set(["All", ...mapped.map((p) => p.category).filter(Boolean)]));
      return {
        projectsList: mapped,
        categories: uniqueCats.length > 1 ? uniqueCats : DEFAULT_CATEGORIES,
      };
    }

    return {
      projectsList: [],
      categories: DEFAULT_CATEGORIES,
    };
  }, [rawProjects]);

  const projectsToDisplay = isPage
    ? projectsList
    : projectsList.slice(0, 6); // show max 6 on home section

  const filteredProjects = projectsToDisplay.filter((p) => {
    if (selectedCategory === "All") return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <section id="projects" className="py-24 sm:py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            label={isPage ? "02 / PORTFOLIO DIRECTORY" : "02 / SELECTED WORK"}
            title="Things I've built."
            subtitle={
              isPage
                ? "Full catalog of web applications, commerce stores, and responsive mobile interfaces."
                : "From task management to communities and commerce — engineered with Next.js, React, and Tailwind."
            }
          />

          {!isPage && onNavigate && (
            <MagneticButton strength={0.3}>
              <button
                onClick={() => onNavigate("projects")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141413] text-[#F5F2EA] font-mono text-xs uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-colors border border-[#141413] cursor-pointer shrink-0"
              >
                <span>Explore more projects ↗</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </MagneticButton>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar mb-12">
          <div className="flex items-center gap-1.5 text-[#6B6862] font-mono text-xs uppercase tracking-wider mr-2 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer border ${
                  isActive
                    ? "bg-[#141413] text-[#F5F2EA] border-[#141413] shadow-xs"
                    : "bg-[#FAF8F2] text-[#6B6862] border-[#141413]/15 hover:border-[#141413] hover:text-[#141413]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Projects Grid / Skeleton */}
        {loading ? (
          <ProjectsGridSkeleton count={isPage ? 6 : 3} />
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#FAF8F2] border-2 border-[#141413] text-center shadow-[4px_4px_0px_#141413]">
            <p className="font-mono text-sm text-[#6B6862]">No projects found in category "{selectedCategory}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProjectCard
                    project={project}
                    index={idx}
                    onNavigate={onNavigate}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!isPage && onNavigate && (
          <div className="mt-16 text-center">
            <MagneticButton strength={0.3}>
              <button
                onClick={() => onNavigate("projects")}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#141413] text-[#F5F2EA] font-mono text-xs uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-colors border border-[#141413] shadow-md cursor-pointer"
              >
                <span>Explore more projects (Full Catalog) ↗</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </MagneticButton>
          </div>
        )}

        {/* Full-Screen Modal Inspector */}
        <AnimatePresence>
          {activeProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#141413]/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="w-full max-w-7xl h-[92vh] sm:h-[88vh] rounded-3xl bg-[#FAF8F2] border-2 border-[#141413] shadow-[12px_12px_0px_#141413] relative overflow-hidden flex flex-col lg:flex-row"
              >
                <button
                  onClick={() => setActiveProject(null)}
                  className="absolute top-6 right-6 z-20 p-2.5 rounded-full bg-[#FAF8F2] border-2 border-[#141413] hover:bg-[#141413] hover:text-[#F5F2EA] transition-colors cursor-pointer shadow-md"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Left Side: Images Gallery */}
                <div className="lg:w-1/2 bg-[#141413] p-6 sm:p-10 flex flex-col justify-between overflow-y-auto border-b lg:border-b-0 lg:border-r-2 border-[#141413]">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-[#D4F050] text-[#141413] font-bold">
                        {activeProject.technology}
                      </span>
                      <span className="font-mono text-xs text-[#9E9A91]">
                        Visual Showcase
                      </span>
                    </div>

                    {/* Main Image Display */}
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/20 bg-black/40 mb-4 shadow-xl">
                      <img
                        src={activeProject.imageUrl || (activeProject.imageUrls && activeProject.imageUrls[0])}
                        alt={activeProject.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Thumbnail Switcher if multiple images */}
                    {activeProject.imageUrls && activeProject.imageUrls.length > 1 && (
                      <div className="grid grid-cols-3 gap-3">
                        {activeProject.imageUrls.map((img, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              // We can allow switching main image if we want or keep it simple
                            }}
                            className="relative aspect-video rounded-xl overflow-hidden border border-white/20 cursor-pointer hover:border-[#D4F050] transition-colors"
                          >
                            <img
                              src={img}
                              alt={`${activeProject.title} ${idx}`}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 hidden lg:block">
                    <div className="font-mono text-xs text-[#9E9A91]">
                      Project ID: <span className="text-[#D4F050] font-bold">{activeProject.id}</span> • Fully Responsive Build
                    </div>
                  </div>
                </div>

                {/* Right Side: Content & Highlights */}
                <div className="lg:w-1/2 p-6 sm:p-12 overflow-y-auto flex flex-col justify-between bg-[#FAF8F2]">
                  <div>
                    <div className="font-mono text-xs text-[#6B6862] tracking-wider uppercase mb-2">
                      {activeProject.category} • {activeProject.number}
                    </div>

                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#141413] mb-4">
                      {activeProject.title}
                    </h2>

                    <p className="text-base text-[#6B6862] leading-relaxed mb-8">
                      {activeProject.description}
                    </p>

                    <div className="space-y-4 mb-8">
                      <div className="font-mono text-xs uppercase tracking-wider text-[#141413] font-bold pb-2 border-b border-[#141413]/10">
                        Key Technical Implementations & Architecture:
                      </div>
                      <ul className="space-y-3">
                        {activeProject.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-[#141413]">
                            <span className="w-5 h-5 rounded-full bg-[#D4F050] border border-[#141413] flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                            <span className="font-sans leading-relaxed">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#141413]/15 flex items-center justify-between gap-4">
                    <a
                      href={activeProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#141413] text-[#F5F2EA] font-mono text-xs uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-colors border border-[#141413] shadow-md"
                    >
                      <span>Launch Live Website ↗</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => setActiveProject(null)}
                      className="font-mono text-xs text-[#6B6862] hover:text-[#141413] cursor-pointer px-4 py-2"
                    >
                      Close Modal
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
