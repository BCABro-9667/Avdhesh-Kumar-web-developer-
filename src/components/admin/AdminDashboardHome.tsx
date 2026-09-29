import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FolderGit2,
  BookOpen,
  Image as ImageIcon,
  ArrowRight,
  Plus,
  Edit3,
  Sparkles,
  Inbox,
  Settings,
  FileText
} from "lucide-react";
import { AdminTab } from "./AdminLayout";
import { AdminDashboardSkeleton } from "../Skeleton";

interface AdminDashboardHomeProps {
  token: string;
  navigateAdmin: (tab: AdminTab, action?: "list" | "create" | "edit", targetId?: string | null) => void;
}

export const AdminDashboardHome: React.FC<AdminDashboardHomeProps> = ({ token, navigateAdmin }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load dashboard statistics");
      return res.json();
    },
  });

  const stats = data?.stats;
  const recent = data?.recentContent;

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  const statCards: { label: string; value: number; sub: string; icon: any; tab: AdminTab }[] = [
    {
      label: "Inbox & Submissions",
      value: stats?.totalInquiries || 0,
      sub: `${stats?.unreadInquiries || 0} Unread, ${stats?.popupCount || 0} Leads`,
      icon: Inbox,
      tab: "inquiries"
    },
    {
      label: "Total Projects",
      value: stats?.totalProjects || 0,
      sub: `${stats?.publishedProjects || 0} Live, ${stats?.draftProjects || 0} Draft`,
      icon: FolderGit2,
      tab: "projects"
    },
    {
      label: "Blog Posts",
      value: stats?.totalBlogs || 0,
      sub: `${stats?.publishedBlogs || 0} Published, ${stats?.draftBlogs || 0} Draft`,
      icon: BookOpen,
      tab: "blog"
    },
    {
      label: "Gallery Assets",
      value: stats?.totalGallery || 0,
      sub: "Cloudinary Managed",
      icon: ImageIcon,
      tab: "gallery"
    },
    {
      label: "Resume & Socials",
      value: 1,
      sub: "Live Configured",
      icon: Settings,
      tab: "settings"
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome & Quick Actions */}
      <div className="bg-[#FAF8F2] border-2 border-[#141413] p-6 sm:p-8 rounded-3xl shadow-[4px_4px_0px_#141413] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#6B6862] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#141413]" />
            <span>Control Center</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#141413]">
            Welcome Back, Avdhesh
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#6B6862] mt-1">
            Manage your submissions, resume, social links, projects, and blogs seamlessly.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigateAdmin("inquiries")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4F050] border-2 border-[#141413] font-mono text-xs uppercase tracking-wider font-bold text-[#141413] shadow-[3px_3px_0px_#141413] hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
          >
            <Inbox className="w-4 h-4" />
            <span>View Inbox ({stats?.unreadInquiries || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => navigateAdmin("settings")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF8F2] border-2 border-[#141413] font-mono text-xs uppercase tracking-wider font-bold text-[#141413] shadow-[3px_3px_0px_#141413] hover:bg-black/5 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Update Resume</span>
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => navigateAdmin(card.tab, "list")}
              className="bg-[#FAF8F2] border-2 border-[#141413] rounded-3xl p-6 shadow-[4px_4px_0px_#141413] hover:shadow-[6px_6px_0px_#141413] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#141413] text-[#D4F050] flex items-center justify-center group-hover:scale-105 transition-transform border-2 border-[#141413]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs text-[#6B6862] flex items-center gap-1 group-hover:text-[#141413]">
                    Manage <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="font-display font-bold text-3xl text-[#141413] mb-1">{card.value}</div>
                <div className="font-mono text-xs text-[#6B6862] uppercase tracking-wider">{card.label}</div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#141413]/10 flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#141413] font-semibold">{card.sub}</span>
                <span className="font-mono text-[11px] text-[#6B6862] group-hover:underline">Open view →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Links & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="bg-[#FAF8F2] border-2 border-[#141413] rounded-3xl p-6 shadow-[4px_4px_0px_#141413] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#141413]/10">
              <div>
                <h2 className="font-display font-bold text-lg text-[#141413]">Recent Projects</h2>
                <span className="font-mono text-[11px] text-[#6B6862]">Click any item to edit immediately</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigateAdmin("projects", "create")}
                  className="p-1.5 rounded-lg border border-[#141413] bg-[#D4F050] text-[#141413] hover:translate-x-0.5 cursor-pointer"
                  title="Create New Project"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => navigateAdmin("projects", "list")}
                  className="font-mono text-xs text-[#6B6862] hover:text-[#141413] uppercase tracking-wider font-bold cursor-pointer"
                >
                  View All →
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {!recent?.projects || recent?.projects?.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="font-mono text-xs text-[#6B6862] mb-3">No projects found yet.</p>
                  <button
                    type="button"
                    onClick={() => navigateAdmin("projects", "create")}
                    className="px-4 py-2 rounded-xl bg-[#D4F050] border border-[#141413] font-mono text-xs font-bold"
                  >
                    + Create First Project
                  </button>
                </div>
              ) : (
                recent?.projects?.map((proj: any) => (
                  <div
                    key={proj._id}
                    onClick={() => navigateAdmin("projects", "edit", proj._id)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white border-2 border-[#141413]/20 hover:border-[#141413] shadow-[2px_2px_0px_#141413] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {proj.featuredImage ? (
                        <img
                          src={proj.featuredImage}
                          alt={proj.title}
                          className="w-11 h-11 rounded-xl object-cover border border-[#141413]/20 shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-[#141413] text-[#D4F050] flex items-center justify-center font-mono text-xs font-bold shrink-0">
                          PROJ
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-display font-semibold text-sm text-[#141413] truncate group-hover:text-amber-800 transition-colors">
                          {proj.title}
                        </div>
                        <div className="font-mono text-[10px] text-[#6B6862]">{proj.category || "General"}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider font-bold border border-[#141413] ${
                        proj.status === "published" ? "bg-[#D4F050] text-[#141413]" : "bg-neutral-200 text-[#141413]"
                      }`}>
                        {proj.status}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateAdmin("projects", "edit", proj._id);
                        }}
                        className="p-1.5 rounded-lg border border-[#141413] bg-[#FAF8F2] hover:bg-[#D4F050] cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#141413]" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="bg-[#FAF8F2] border-2 border-[#141413] rounded-3xl p-6 shadow-[4px_4px_0px_#141413] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#141413]/10">
              <div>
                <h2 className="font-display font-bold text-lg text-[#141413]">Recent Blog Articles</h2>
                <span className="font-mono text-[11px] text-[#6B6862]">Click any item to edit immediately</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigateAdmin("blog", "create")}
                  className="p-1.5 rounded-lg border border-[#141413] bg-[#D4F050] text-[#141413] hover:translate-x-0.5 cursor-pointer"
                  title="Create New Blog Post"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => navigateAdmin("blog", "list")}
                  className="font-mono text-xs text-[#6B6862] hover:text-[#141413] uppercase tracking-wider font-bold cursor-pointer"
                >
                  View All →
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {!recent?.blogs || recent?.blogs?.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="font-mono text-xs text-[#6B6862] mb-3">No blog posts found yet.</p>
                  <button
                    type="button"
                    onClick={() => navigateAdmin("blog", "create")}
                    className="px-4 py-2 rounded-xl bg-[#D4F050] border border-[#141413] font-mono text-xs font-bold"
                  >
                    + Write First Blog Post
                  </button>
                </div>
              ) : (
                recent?.blogs?.map((blog: any) => (
                  <div
                    key={blog._id}
                    onClick={() => navigateAdmin("blog", "edit", blog._id)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white border-2 border-[#141413]/20 hover:border-[#141413] shadow-[2px_2px_0px_#141413] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {blog.featuredImage ? (
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="w-11 h-11 rounded-xl object-cover border border-[#141413]/20 shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-[#141413] text-[#D4F050] flex items-center justify-center font-mono text-xs font-bold shrink-0">
                          BLOG
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-display font-semibold text-sm text-[#141413] truncate group-hover:text-amber-800 transition-colors">
                          {blog.title}
                        </div>
                        <div className="font-mono text-[10px] text-[#6B6862]">{blog.category || "General"}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider font-bold border border-[#141413] ${
                        blog.status === "published" ? "bg-[#D4F050] text-[#141413]" : "bg-neutral-200 text-[#141413]"
                      }`}>
                        {blog.status}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateAdmin("blog", "edit", blog._id);
                        }}
                        className="p-1.5 rounded-lg border border-[#141413] bg-[#FAF8F2] hover:bg-[#D4F050] cursor-pointer"
                        title="Edit Blog"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#141413]" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
