import React, { useEffect, useState, useCallback } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminDashboardHome } from "./AdminDashboardHome";
import { AdminProjectsManager } from "./AdminProjectsManager";
import { AdminBlogManager } from "./AdminBlogManager";
import { AdminGalleryManager } from "./AdminGalleryManager";
import { AdminCategoriesManager } from "./AdminCategoriesManager";
import { AdminSEOManager } from "./AdminSEOManager";
import { AdminPromotionManager } from "./AdminPromotionManager";
import { AdminInquiriesManager } from "./AdminInquiriesManager";
import { AdminSettingsManager } from "./AdminSettingsManager";
import { AdminTodoListManager } from "./AdminTodoListManager";
import { AdminNotesManager } from "./AdminNotesManager";
import { AdminDocumentManager } from "./AdminDocumentManager";
import { Menu, Plus, ArrowLeft, ShieldCheck, ChevronRight } from "lucide-react";

export type AdminTab = "dashboard" | "todos" | "notes" | "documents" | "projects" | "blog" | "gallery" | "categories" | "seo" | "promotion" | "inquiries" | "settings";
export type AdminAction = "list" | "create" | "edit";

export interface AdminNavState {
  tab: AdminTab;
  action: AdminAction;
  targetId?: string | null;
}

interface AdminLayoutProps {
  token: string;
  adminUser: any;
  onLogout: () => void;
}

function parseHashToNavState(): AdminNavState {
  try {
    const rawHash = window.location.hash.replace(/^#\/?/, "").toLowerCase();
    if (!rawHash.startsWith("admin")) {
      return { tab: "dashboard", action: "list" };
    }
    const parts = rawHash.split("/").filter(Boolean);
    // parts[0] is 'admin'
    const tabPart = (parts[1] || "dashboard") as AdminTab;
    const validTabs: AdminTab[] = ["dashboard", "todos", "notes", "documents", "inquiries", "settings", "projects", "blog", "gallery", "categories", "seo", "promotion"];
    const tab = validTabs.includes(tabPart) ? tabPart : "dashboard";

    let action: AdminAction = "list";
    let targetId: string | null = null;

    if (parts[2] === "create" || parts[2] === "new") {
      action = "create";
    } else if (parts[2] === "edit") {
      action = "edit";
      targetId = parts[3] || null;
    }

    return { tab, action, targetId };
  } catch (e) {
    return { tab: "dashboard", action: "list" };
  }
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ token, adminUser, onLogout }) => {
  const [navState, setNavState] = useState<AdminNavState>(parseHashToNavState);
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  // Synchronize hash with state changes cleanly without triggering page reloads
  const navigateAdmin = useCallback((
    tab: AdminTab,
    action: AdminAction = "list",
    targetId: string | null = null
  ) => {
    setNavState({ tab, action, targetId });

    // Update URL hash smoothly for bookmarkability / browser history without reloading
    let hashUrl = `admin/${tab}`;
    if (action === "create") {
      hashUrl += `/create`;
    } else if (action === "edit" && targetId) {
      hashUrl += `/edit/${targetId}`;
    }

    if (window.location.hash.replace(/^#\/?/, "") !== hashUrl) {
      window.history.replaceState(null, "", `#${hashUrl}`);
    }

    // Scroll only the internal content container back to top smoothly
    const scrollContainer = document.getElementById("admin-content-scroll");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  // Listen to browser forward/back buttons within admin hash
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHashToNavState();
      setNavState(parsed);
      const scrollContainer = document.getElementById("admin-content-scroll");
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: "auto" });
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const getTabLabel = (tab: AdminTab) => {
    switch (tab) {
      case "dashboard": return "Dashboard";
      case "todos": return "Todo Tasks";
      case "notes": return "Notes & Knowledge Base";
      case "documents": return "Documents & Storage";
      case "inquiries": return "Inbox & Submissions";
      case "settings": return "Resume & Socials";
      case "projects": return "Projects";
      case "blog": return "Blog CMS";
      case "gallery": return "Gallery";
      case "categories": return "Categories";
      case "seo": return "SEO Settings";
      case "promotion": return "Promotion Bar";
      default: return "Admin";
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F8F9FA] flex flex-col md:flex-row">
      {/* 1. FIXED LEFT SIDEBAR */}
      <AdminSidebar
        navState={navState}
        navigateAdmin={navigateAdmin}
        onLogout={onLogout}
        isOpenMobile={sidebarOpenMobile}
        setIsOpenMobile={setSidebarOpenMobile}
      />

      {/* 2. RIGHT WORKSPACE AREA */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* FIXED TOP HEADER */}
        <header className="shrink-0 h-16 bg-white border-b border-stone-200 px-5 sm:px-8 flex items-center justify-between z-30">
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpenMobile(true)}
              className="md:hidden p-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 cursor-pointer shrink-0"
              aria-label="Open Admin Navigation"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 truncate">
              <button
                type="button"
                onClick={() => navigateAdmin("dashboard")}
                className="hover:text-stone-900 cursor-pointer font-medium shrink-0"
              >
                Admin
              </button>

              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-stone-400" />

              <button
                type="button"
                onClick={() => navigateAdmin(navState.tab, "list")}
                className={`truncate hover:text-stone-900 cursor-pointer ${
                  navState.action === "list" ? "text-stone-900 font-semibold" : "text-stone-500"
                }`}
              >
                {getTabLabel(navState.tab)}
              </button>

              {navState.action !== "list" && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                  <span className="text-stone-900 font-semibold truncate">
                    {navState.action === "create" ? "Create New" : "Edit"}
                  </span>
                </>
              )}
            </nav>
          </div>

          {/* Right: Quick Action Buttons & Status */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {navState.tab === "blog" && navState.action === "list" && (
              <button
                type="button"
                onClick={() => navigateAdmin("blog", "create")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Blog</span>
              </button>
            )}

            {navState.tab === "projects" && navState.action === "list" && (
              <button
                type="button"
                onClick={() => navigateAdmin("projects", "create")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </button>
            )}

            {(navState.action === "create" || navState.action === "edit") && (
              <button
                type="button"
                onClick={() => navigateAdmin(navState.tab, "list")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-stone-200 shrink-0 bg-stone-100">
                <img
                  src="/avdhesh-kumar.png"
                  alt="Avdhesh Kumar"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-right hidden lg:block">
                <div className="text-xs font-medium text-stone-800 truncate max-w-[150px]">
                  {adminUser?.email || "Avdhesh Kumar"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
              <span>Admin</span>
            </div>
          </div>
        </header>

        {/* 3. SCROLLABLE MAIN CONTENT AREA */}
        <main
          id="admin-content-scroll"
          className="flex-1 overflow-y-auto p-5 sm:p-8 relative scroll-smooth focus:outline-none"
          tabIndex={-1}
        >
          {navState.tab === "dashboard" && (
            <AdminDashboardHome token={token} navigateAdmin={navigateAdmin} />
          )}

          {navState.tab === "todos" && (
            <AdminTodoListManager token={token} />
          )}

          {navState.tab === "notes" && (
            <AdminNotesManager token={token} />
          )}

          {navState.tab === "documents" && (
            <AdminDocumentManager token={token} />
          )}

          {navState.tab === "inquiries" && (
            <AdminInquiriesManager token={token} />
          )}

          {navState.tab === "settings" && (
            <AdminSettingsManager token={token} />
          )}

          {navState.tab === "projects" && (
            <AdminProjectsManager
              token={token}
              action={navState.action}
              targetId={navState.targetId}
              onNavigate={(act, id) => navigateAdmin("projects", act, id)}
            />
          )}

          {navState.tab === "blog" && (
            <AdminBlogManager
              token={token}
              action={navState.action}
              targetId={navState.targetId}
              onNavigate={(act, id) => navigateAdmin("blog", act, id)}
            />
          )}

          {navState.tab === "gallery" && (
            <AdminGalleryManager token={token} />
          )}

          {navState.tab === "categories" && (
            <AdminCategoriesManager token={token} />
          )}

          {navState.tab === "seo" && (
            <AdminSEOManager token={token} />
          )}

          {navState.tab === "promotion" && (
            <AdminPromotionManager token={token} />
          )}
        </main>
      </div>
    </div>
  );
};
