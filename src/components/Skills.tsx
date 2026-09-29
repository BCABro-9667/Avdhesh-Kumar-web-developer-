import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { PORTFOLIO_DATA } from "../data/portfolio";

const skillSlugs: Record<string, string> = {
  "Java": "openjdk",
  "Python": "python",
  "C++": "cplusplus",
  "JavaScript ES6+": "javascript",
  "JavaScript": "javascript",
  "React.js": "react",
  "React": "react",
  "Next.js": "nextdotjs",
  "HTML5": "html5",
  "CSS3": "css3",
  "Bootstrap": "bootstrap",
  "Tailwind CSS": "tailwindcss",
  "Tailwind": "tailwindcss",
  "Node.js": "nodedotjs",
  "Express.js": "express",
  "Express": "express",
  "REST APIs": "postman",
  "MongoDB": "mongodb",
  "MySQL": "mysql",
  "SQL": "postgresql",
  "WordPress": "wordpress",
  "Shopify": "shopify",
  "Wix": "wix",
  "Git": "git",
  "GitHub": "github",
  "Netlify": "netlify",
  "Microsoft Azure": "microsoftazure",
  "Azure": "microsoftazure",
  "Google Cloud": "googlecloud",
  "GCP": "googlecloud",
  "VS Code": "visualstudiocode",
  "SEO": "google",
  "Photoshop": "adobephotoshop",
  "Canva": "canva",
  "Tally ERP": "tally",
  "Tally": "tally",
  "Microsoft Office": "microsoftoffice",
  "MS Office": "microsoftoffice",
  "Google Workspace": "google",
  "Workspace": "google",
};

export const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "All",
    "Frontend",
    "Backend",
    "Database",
    "Languages",
    "CMS",
    "Tools",
    "Cloud",
  ];

  const filteredSkills = PORTFOLIO_DATA.skills.filter((skill) => {
    const matchesCategory =
      activeCategory === "All" ||
      skill.category.toLowerCase().includes(activeCategory.toLowerCase());
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      skill.name.toLowerCase().includes(query) ||
      (skill.shortName && skill.shortName.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="skills" className="py-24 sm:py-32 relative bg-[#FAF8F2]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <SectionHeading
            label="TECH STACK"
            title="Skills & technologies"
            subtitle="An extensive computational and web engineering toolkit."
            className="mb-0!"
          />

          {/* Search Filter Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6862]" />
            <input
              type="text"
              placeholder="Search skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#FAF8F2] border border-[#141413]/20 text-xs font-mono text-[#141413] focus:outline-none focus:border-[#141413] focus:ring-1 focus:ring-[#141413] placeholder:text-[#6B6862]/60 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#6B6862] hover:text-[#141413] cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap border cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#141413] text-[#F5F2EA] border-[#141413] shadow-[2px_2px_0px_#D4F050]"
                  : "bg-[#FAF8F2] text-[#6B6862] border-[#141413]/15 hover:text-[#141413] hover:border-[#141413]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid - Same length, 2 cols mobile, 4 cols tablet, 6 cols desktop */}
        <div className="p-4 sm:p-6 md:p-8 rounded-3xl bg-[#F5F2EA] border-2 border-[#141413]/15 shadow-[6px_6px_0px_rgba(20,20,19,0.06)] min-h-[320px]">
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3.5"
          >
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill) => {
                const displayName = skill.shortName || skill.name;
                const slug = skillSlugs[displayName] || skillSlugs[skill.name] || "code";
                const logoUrl = `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${slug}.svg`;

                return (
                  <motion.div
                    key={skill.name}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="group flex items-center gap-2 sm:gap-2.5 w-full h-[52px] sm:h-[56px] px-3 sm:px-3.5 rounded-2xl bg-[#FAF8F2] border-2 border-[#141413]/20 hover:border-[#141413] shadow-[3px_3px_0px_#141413] transition-all duration-200 cursor-default select-none overflow-hidden"
                  >
                    {/* Official Logo on Left */}
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      <img
                        src={logoUrl}
                        alt={displayName}
                        className="w-4 h-4 sm:w-4.5 sm:h-4.5 object-contain filter group-hover:brightness-110 transition-all"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // Fallback if svg fails
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>

                    {/* Short Skill Name on Right */}
                    <span className="font-display font-semibold text-xs sm:text-sm text-[#141413] tracking-tight truncate">
                      {displayName}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {filteredSkills.length === 0 && (
            <div className="py-12 text-center text-[#6B6862] font-mono text-sm">
              No matching technologies found for "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </section>
  );
};


