import React from "react";
import {
  LayoutDashboard,
  FolderGit2,
  BookOpen,
  Image as ImageIcon,
  FolderTree,
  Globe,
  Megaphone,
  LogOut,
  ExternalLink,
  X,
  Plus,
  List,
  Inbox,
  Settings,
} from "lucide-react";
import { AdminNavState, AdminTab } from "./AdminLayout";

interface AdminSidebarProps {
  navState: AdminNavState;
  navigateAdmin: (tab: AdminTab, action?: "list" | "create" | "edit", targetId?: string | null) => void;
  onLogout: () => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  navState,
  navigateAdmin,
  onLogout,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const navItems: { id: AdminTab; label: string; icon: any; hasSubmenu?: boolean }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inquiries", label: "Inbox & Submissions", icon: Inbox },
    { id: "settings", label: "Resume & Socials", icon: Settings },
    { id: "projects", label: "Projects", icon: FolderGit2, hasSubmenu: true },
    { id: "blog", label: "Blog CMS", icon: BookOpen, hasSubmenu: true },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "categories", label: "Categories", icon: FolderTree },
    { id: "seo", label: "SEO Settings", icon: Globe },
    { id: "promotion", label: "Promotion Bar", icon: Megaphone },
  ];

  const handleNavClick = (tab: AdminTab, action: "list" | "create" = "list") => {
    navigateAdmin(tab, action);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-72 md:w-64 h-screen bg-[#141413] text-[#F5F2EA] flex flex-col border-r-2 border-[#141413] shrink-0 transition-transform duration-300 ease-in-out ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand / Logo Area */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick("dashboard")}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-[#D4F050] shadow-[2px_2px_0px_rgba(212,240,80,0.4)] group-hover:scale-105 transition-transform bg-[#141413] shrink-0">
              <img
                src="/avdhesh-kumar.png"
                alt="Avdhesh Kumar"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="font-display font-bold text-base tracking-tight text-white group-hover:text-[#D4F050] transition-colors">
                Admin CMS
              </div>
              <div className="font-mono text-[10px] text-[#9E9A91]">Portfolio Control</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setIsOpenMobile(false)}
            className="md:hidden p-2 rounded-xl text-[#9E9A91] hover:text-white hover:bg-white/10 cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isTabActive = navState.tab === item.id;

            return (
              <div key={item.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleNavClick(item.id, "list")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isTabActive
                      ? "bg-[#D4F050] text-[#141413] font-bold shadow-[2px_2px_0px_rgba(255,255,255,0.2)]"
                      : "text-[#9E9A91] hover:text-[#F5F2EA] hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                </button>

                {/* Sub-menu actions for Projects and Blog */}
                {item.hasSubmenu && isTabActive && (
                  <div className="ml-5 pl-3 border-l-2 border-[#D4F050]/40 space-y-1 py-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.id, "list")}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-mono text-[11px] transition-colors cursor-pointer ${
                        navState.action === "list"
                          ? "text-[#D4F050] font-bold bg-white/5"
                          : "text-[#9E9A91] hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <List className="w-3 h-3 shrink-0" />
                      <span>All {item.label === "Blog CMS" ? "Posts" : "Projects"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.id, "create")}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-mono text-[11px] transition-colors cursor-pointer ${
                        navState.action === "create"
                          ? "text-[#D4F050] font-bold bg-white/5"
                          : "text-[#9E9A91] hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Plus className="w-3 h-3 shrink-0" />
                      <span>+ New {item.label === "Blog CMS" ? "Blog" : "Project"}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer Area: Open Live Site (New Tab) + Sign Out */}
        <div className="p-4 border-t border-white/10 space-y-2 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-[#9E9A91] hover:text-[#F5F2EA] hover:bg-white/5 transition-colors group"
            title="Open Live Portfolio in new tab"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-3.5 h-3.5 group-hover:text-[#D4F050]" />
              <span>Live Site</span>
            </div>
            <span className="font-mono text-[9px] text-[#9E9A91] bg-white/10 px-1.5 py-0.5 rounded">New tab</span>
          </a>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
