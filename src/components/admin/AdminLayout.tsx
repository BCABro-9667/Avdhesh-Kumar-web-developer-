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
import { Menu, Plus, ArrowLeft, ShieldCheck, ChevronRight } from "lucide-react";

export type AdminTab = "dashboard" | "projects" | "blog" | "gallery" | "categories" | "seo" | "promotion" | "inquiries" | "settings";
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
    const validTabs: AdminTab[] = ["dashboard", "inquiries", "settings", "projects", "blog", "gallery", "categories", "seo", "promotion"];
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
    <div className="h-screen w-screen overflow-hidden bg-[#F5F2EA] flex flex-col md:flex-row">
      {/* 1. FIXED LEFT SIDEBAR (Always fixed, never scrolls with page) */}
      <AdminSidebar
        navState={navState}
        navigateAdmin={navigateAdmin}
        onLogout={onLogout}
        isOpenMobile={sidebarOpenMobile}
        setIsOpenMobile={setSidebarOpenMobile}
      />

      {/* 2. RIGHT WORKSPACE AREA: Fixed Top Header + Scrollable Main Content */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* FIXED TOP HEADER (Pinned permanently at top of the right panel) */}
        <header className="shrink-0 h-18 bg-[#FAF8F2] border-b-2 border-[#141413] px-6 sm:px-10 flex items-center justify-between z-30 shadow-xs">
          {/* Left: Mobile Toggle & Dynamic Interactive Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpenMobile(true)}
              className="md:hidden p-2 rounded-xl bg-[#FAF8F2] border-2 border-[#141413] text-[#141413] shadow-[2px_2px_0px_#141413] cursor-pointer shrink-0"
              aria-label="Open Admin Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* State-based Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-mono text-xs text-[#6B6862] truncate">
              <button
                type="button"
                onClick={() => navigateAdmin("dashboard")}
                className="hover:text-[#141413] hover:underline cursor-pointer font-bold shrink-0"
              >
                Admin
              </button>

              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[#141413]/40" />

              <button
                type="button"
                onClick={() => navigateAdmin(navState.tab, "list")}
                className={`truncate hover:text-[#141413] cursor-pointer ${
                  navState.action === "list" ? "text-[#141413] font-bold" : "hover:underline text-[#6B6862]"
                }`}
              >
                {getTabLabel(navState.tab)}
              </button>

              {navState.action !== "list" && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[#141413]/40" />
                  <span className="text-[#141413] font-bold truncate">
                    {navState.action === "create" ? "Create New" : "Edit"}
                  </span>
                </>
              )}
            </nav>
          </div>

          {/* Right: Quick Action Buttons & Status */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Quick Header Actions based on Active View */}
            {navState.tab === "blog" && navState.action === "list" && (
              <button
                type="button"
                onClick={() => navigateAdmin("blog", "create")}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#D4F050] border-2 border-[#141413] font-mono text-xs font-bold uppercase text-[#141413] shadow-[2px_2px_0px_#141413] hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Blog</span>
              </button>
            )}

            {navState.tab === "projects" && navState.action === "list" && (
              <button
                type="button"
                onClick={() => navigateAdmin("projects", "create")}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#D4F050] border-2 border-[#141413] font-mono text-xs font-bold uppercase text-[#141413] shadow-[2px_2px_0px_#141413] hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </button>
            )}

            {(navState.action === "create" || navState.action === "edit") && (
              <button
                type="button"
                onClick={() => navigateAdmin(navState.tab, "list")}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF8F2] border-2 border-[#141413] font-mono text-xs font-bold uppercase text-[#141413] shadow-[2px_2px_0px_#141413] hover:bg-black/5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back to List</span>
              </button>
            )}

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#141413] shadow-[1px_1px_0px_#141413] shrink-0 bg-[#D4F050]">
                <img
                  src="/avdhesh-kumar.png"
                  alt="Avdhesh Kumar"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-right hidden lg:block">
                <div className="font-mono text-[10px] text-[#6B6862] uppercase tracking-wider">Logged in as</div>
                <div className="font-display font-bold text-xs text-[#141413] truncate max-w-[180px]">
                  {adminUser?.email || "Avdhesh Kumar"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141413] text-[#D4F050] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider shrink-0 border border-[#141413]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin CMS</span>
            </div>
          </div>
        </header>

        {/* 3. SCROLLABLE MAIN CONTENT AREA (ONLY this container scrolls!) */}
        <main
          id="admin-content-scroll"
          className="flex-1 overflow-y-auto p-6 sm:p-10 relative scroll-smooth focus:outline-none"
          tabIndex={-1}
        >
          {navState.tab === "dashboard" && (
            <AdminDashboardHome token={token} navigateAdmin={navigateAdmin} />
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
