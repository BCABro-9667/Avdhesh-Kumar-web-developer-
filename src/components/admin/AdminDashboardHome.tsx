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
  FileText,
  Eye,
  ListTodo,
  StickyNote,
} from "lucide-react";
import { AdminTab } from "./AdminLayout";
import { AdminDashboardSkeleton } from "../Skeleton";
import { AdminLivePreviewModal, PreviewData } from "./AdminLivePreviewModal";

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

  const [previewItem, setPreviewItem] = React.useState<PreviewData | null>(null);
  const [previewType, setPreviewType] = React.useState<"blog" | "project">("blog");
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  const handleOpenPreview = (item: any, type: "blog" | "project") => {
    setPreviewItem(item);
    setPreviewType(type);
    setIsPreviewOpen(true);
  };

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  const statCards: { label: string; value: number; sub: string; icon: any; tab: AdminTab }[] = [
    {
      label: "Todo Tasks",
      value: stats?.totalTodos || 0,
      sub: `${stats?.pendingTodos || 0} Pending Tasks`,
      icon: ListTodo,
      tab: "todos"
    },
    {
      label: "Notes & Docs",
      value: stats?.totalNotes || 0,
      sub: "Rich Knowledge Base",
      icon: StickyNote,
      tab: "notes"
    },
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
      <div className="bg-white border border-stone-200 p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Welcome Back, Avdhesh
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Overview of your portfolio content, inquiries, and daily workflow
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigateAdmin("todos")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>Tasks ({stats?.pendingTodos || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => navigateAdmin("notes")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <StickyNote className="w-3.5 h-3.5 text-stone-500" />
            <span>Write Note</span>
          </button>

          <button
            type="button"
            onClick={() => navigateAdmin("inquiries")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <Inbox className="w-3.5 h-3.5 text-stone-500" />
            <span>Inbox ({stats?.unreadInquiries || 0})</span>
          </button>
        </div>
      </div>

      {/* Stat Cards Grid - Flat & Minimal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => navigateAdmin(card.tab, "list")}
              className="bg-white border border-stone-200 rounded-xl p-4.5 hover:border-stone-300 transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-stone-400 flex items-center gap-1 group-hover:text-stone-900">
                    Open <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
                <div className="text-2xl font-bold text-stone-900">{card.value}</div>
                <div className="text-xs font-medium text-stone-500 uppercase mt-0.5">{card.label}</div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>{card.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Links & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Projects */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-stone-100">
              <div>
                <h2 className="font-semibold text-sm text-stone-900">Recent Projects</h2>
                <span className="text-xs text-stone-400">Click to edit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => navigateAdmin("projects", "create")}
                  className="p-1 rounded-md bg-stone-900 text-white hover:bg-stone-800 cursor-pointer"
                  title="Create Project"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => navigateAdmin("projects", "list")}
                  className="text-xs text-stone-500 hover:text-stone-900 font-medium cursor-pointer"
                >
                  View All →
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {!recent?.projects || recent?.projects?.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-xs text-stone-400 mb-2">No projects found.</p>
                  <button
                    type="button"
                    onClick={() => navigateAdmin("projects", "create")}
                    className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium"
                  >
                    + Add Project
                  </button>
                </div>
              ) : (
                recent?.projects?.map((proj: any) => (
                  <div
                    key={proj._id}
                    onClick={() => navigateAdmin("projects", "edit", proj._id)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 hover:border-stone-300 hover:bg-white transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {proj.featuredImage ? (
                        <img
                          src={proj.featuredImage}
                          alt={proj.title}
                          className="w-9 h-9 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                          PROJ
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-medium text-xs text-stone-900 truncate group-hover:text-stone-700">
                          {proj.title}
                        </div>
                        <div className="text-[10px] text-stone-500">{proj.category || "General"}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        proj.status === "published" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-stone-100 text-stone-600 border border-stone-200"
                      }`}>
                        {proj.status}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPreview(proj, "project");
                        }}
                        className="p-1 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100 cursor-pointer"
                        title="Live Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateAdmin("projects", "edit", proj._id);
                        }}
                        className="p-1 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100 cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-stone-100">
              <div>
                <h2 className="font-semibold text-sm text-stone-900">Recent Blog Posts</h2>
                <span className="text-xs text-stone-400">Click to edit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => navigateAdmin("blog", "create")}
                  className="p-1 rounded-md bg-stone-900 text-white hover:bg-stone-800 cursor-pointer"
                  title="Create Blog Post"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => navigateAdmin("blog", "list")}
                  className="text-xs text-stone-500 hover:text-stone-900 font-medium cursor-pointer"
                >
                  View All →
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {!recent?.blogs || recent?.blogs?.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-xs text-stone-400 mb-2">No blog posts found.</p>
                  <button
                    type="button"
                    onClick={() => navigateAdmin("blog", "create")}
                    className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium"
                  >
                    + Write Post
                  </button>
                </div>
              ) : (
                recent?.blogs?.map((blog: any) => (
                  <div
                    key={blog._id}
                    onClick={() => navigateAdmin("blog", "edit", blog._id)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 hover:border-stone-300 hover:bg-white transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {blog.featuredImage ? (
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="w-9 h-9 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                          BLOG
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-medium text-xs text-stone-900 truncate group-hover:text-stone-700">
                          {blog.title}
                        </div>
                        <div className="text-[10px] text-stone-500">{blog.category || "General"}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        blog.status === "published" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-stone-100 text-stone-600 border border-stone-200"
                      }`}>
                        {blog.status}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPreview(blog, "blog");
                        }}
                        className="p-1 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100 cursor-pointer"
                        title="Live Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateAdmin("blog", "edit", blog._id);
                        }}
                        className="p-1 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100 cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Interactive Live Preview Modal */}
      <AdminLivePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        type={previewType}
        data={previewItem}
      />
    </div>
  );
};
