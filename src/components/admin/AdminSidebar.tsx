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
  ListTodo,
  StickyNote,
  FolderArchive,
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
    { id: "todos", label: "Todo Tasks", icon: ListTodo },
    { id: "notes", label: "Notes & Docs", icon: StickyNote },
    { id: "documents", label: "Documents", icon: FolderArchive },
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
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-64 h-screen bg-[#141413] text-[#F5F2EA] flex flex-col border-r border-stone-800 shrink-0 transition-transform duration-300 ease-in-out ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Area */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick("dashboard")}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 group-hover:border-white/40 transition-colors bg-stone-900 shrink-0">
              <img
                src="/avdhesh-kumar.png"
                alt="Avdhesh Kumar"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="font-semibold text-sm tracking-tight text-white">
                Admin Panel
              </div>
              <div className="text-[11px] text-stone-400">Avdhesh Kumar</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setIsOpenMobile(false)}
            className="md:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isTabActive = navState.tab === item.id;

            return (
              <div key={item.id} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => handleNavClick(item.id, "list")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    isTabActive
                      ? "bg-stone-800 text-white font-medium shadow-xs"
                      : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0 text-stone-400" />
                    <span>{item.label}</span>
                  </div>
                </button>

                {/* Sub-menu actions for Projects and Blog */}
                {item.hasSubmenu && isTabActive && (
                  <div className="ml-4 pl-3 border-l border-stone-800 space-y-0.5 py-1">
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.id, "list")}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] transition-colors cursor-pointer ${
                        navState.action === "list"
                          ? "text-white font-medium bg-white/5"
                          : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
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
