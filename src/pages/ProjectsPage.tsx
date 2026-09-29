import React from "react";
import { Projects } from "../components/Projects";

interface ProjectsPageProps {
  onNavigate?: (page: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="max-w-3xl mb-4">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#6B6862] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#D4F050] border border-[#141413]/30" />
            <span>FULL PORTFOLIO DIRECTORY</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-[#141413] tracking-tight mb-4">
            Things I've built & engineered.
          </h1>
          <p className="font-sans text-lg text-[#6B6862]">
            Comprehensive index of all production apps, eCommerce platforms, task managers, and community web applications.
          </p>
        </div>
      </div>
      <Projects isPage={true} onNavigate={onNavigate} />
    </div>
  );
};
