import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { fetchSiteSettings, updateSiteSettings, fetchAllLikes, likeProjectItem, likeBlogItem } from "../lib/apiClient";
import { PORTFOLIO_DATA } from "../data/portfolio";

export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  youtube: string;
  facebook: string;
  email: string;
  phone: string;
  location: string;
  statusText: string;
}

export interface PromotionBarSettings {
  active: boolean;
  text: string;
  link: string;
  badgeText?: string;
}

export interface SiteSettingsData {
  resumeUrl: string;
  resumeFileName: string;
  resumeUpdatedAt?: Date | string;
  themeBg: "white" | "grey";
  showFeedbackButton: boolean;
  promotionBar: PromotionBarSettings;
  socialLinks: SocialLinks;
}

interface SiteSettingsContextType {
  settings: SiteSettingsData;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  downloadResume: () => void;
  updateThemeBg: (theme: "white" | "grey") => Promise<void>;
  updateFeedbackButton: (enabled: boolean) => Promise<void>;
  updatePromotionBar: (promo: Partial<PromotionBarSettings>) => Promise<void>;
  likes: Record<string, number>;
  hasLiked: (id: string) => boolean;
  likeItem: (id: string, type: "project" | "blog") => Promise<void>;
}

const defaultSettings: SiteSettingsData = {
  resumeUrl: "",
  resumeFileName: "Avdhesh_Kumar_Resume.pdf",
  themeBg: "white",
  showFeedbackButton: false,
  promotionBar: {
    active: true,
    text: "Building a polished Next.js project from scratch",
    link: "blog/building-polished-nextjs-project",
    badgeText: "My New Blog",
  },
  socialLinks: {
    github: PORTFOLIO_DATA.personal.github,
    linkedin: PORTFOLIO_DATA.personal.linkedin,
    twitter: PORTFOLIO_DATA.personal.twitter,
    instagram: PORTFOLIO_DATA.personal.instagram,
    youtube: "https://youtube.com/@BCABRO",
    facebook: "https://facebook.com",
    email: PORTFOLIO_DATA.personal.email,
    phone: PORTFOLIO_DATA.personal.phone,
    location: PORTFOLIO_DATA.personal.location,
    statusText: PORTFOLIO_DATA.personal.statusText,
  },
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSettings,
  isLoading: false,
  refreshSettings: async () => {},
  downloadResume: () => {},
  updateThemeBg: async () => {},
  updateFeedbackButton: async () => {},
  updatePromotionBar: async () => {},
  likes: {},
  hasLiked: () => false,
  likeItem: async () => {},
});

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettingsData>(() => {
    // Check localStorage fallback for themeBg
    const savedTheme = localStorage.getItem("portfolio_theme_bg") as "white" | "grey" | null;
    let savedPromo: PromotionBarSettings | null = null;
    try {
      const p = localStorage.getItem("portfolio_promo_settings");
      if (p) savedPromo = JSON.parse(p);
    } catch {}

    return {
      ...defaultSettings,
      themeBg: savedTheme === "grey" ? "grey" : "white",
      promotionBar: savedPromo || defaultSettings.promotionBar,
    };
  });
  const [isLoading, setIsLoading] = useState(true);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [likedIds, setLikedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("portfolio_user_likes");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Apply theme background class and data attribute immediately
  useEffect(() => {
    const bg = settings.themeBg === "grey" ? "grey" : "white";
    document.documentElement.setAttribute("data-theme-bg", bg);
    document.body.setAttribute("data-theme-bg", bg);
    if (bg === "white") {
      document.body.classList.remove("bg-[#F5F2EA]");
      document.body.classList.add("bg-white");
    } else {
      document.body.classList.remove("bg-white");
      document.body.classList.add("bg-[#F5F2EA]");
    }
    localStorage.setItem("portfolio_theme_bg", bg);
  }, [settings.themeBg]);

  const loadData = useCallback(async () => {
    try {
      const [fetchedSettings, fetchedLikes] = await Promise.all([
        fetchSiteSettings(),
        fetchAllLikes(),
      ]);
      if (fetchedSettings) {
        setSettings((prev) => ({
          resumeUrl: fetchedSettings.resumeUrl || "",
          resumeFileName: fetchedSettings.resumeFileName || "Avdhesh_Kumar_Resume.pdf",
          resumeUpdatedAt: fetchedSettings.resumeUpdatedAt,
          themeBg: fetchedSettings.themeBg === "grey" ? "grey" : "white",
          showFeedbackButton: fetchedSettings.showFeedbackButton === true,
          promotionBar: fetchedSettings.promotionBar || prev.promotionBar,
          socialLinks: {
            ...defaultSettings.socialLinks,
            ...(fetchedSettings.socialLinks || {}),
          },
        }));

        if (fetchedSettings.promotionBar) {
          localStorage.setItem("portfolio_promo_settings", JSON.stringify(fetchedSettings.promotionBar));
        }
      }
      if (fetchedLikes) {
        setLikes(fetchedLikes);
      }
    } catch (err) {
      console.warn("Could not load dynamic settings, using fallback defaults:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const downloadResume = useCallback(() => {
    if (settings.resumeUrl && settings.resumeUrl.trim()) {
      // Direct download or open URL configured by Admin
      const link = document.createElement("a");
      link.href = settings.resumeUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.download = settings.resumeFileName || "Avdhesh_Kumar_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // High fidelity fallback text resume
    const resumeText = `AVDHESH KUMAR - RESUME
Full-Stack & Frontend Web Developer
${settings.socialLinks.location} | ${settings.socialLinks.email} | ${settings.socialLinks.phone}
Portfolio: https://avdheshkumar.me
GitHub: ${settings.socialLinks.github} | LinkedIn: ${settings.socialLinks.linkedin}

SUMMARY:
Full-Stack Web Developer and Computer Applications student with over 9 months of intensive frontend and IT web engineering experience building scalable React, Next.js, and Node.js solutions.

EDUCATION:
- Master of Computer Applications (MCA) - DPG Degree College (2025-2027) [ACTIVE DEGREE]
- Bachelor of Computer Applications (BCA) - DPG Degree College (CGPA: 8.0, 2022-2025)
- Senior Secondary (12th Grade) - 2022
- Secondary School (10th Grade) - 2020

EXPERIENCE:
- Frontend & IT Engineering Intern at Estovir Technologies (6 months)
- Frontend Web Development Intern at Reachcure Healthcare (3 months)

TECHNICAL SKILLS:
React, Next.js, TypeScript, JavaScript, Node.js, Express, MongoDB, MySQL, Tailwind CSS, REST APIs, Git, SEO.

HONORS & ACHIEVEMENTS:
- 4x College Chess Champion`;

    const blob = new Blob([resumeText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = settings.resumeFileName ? settings.resumeFileName.replace(/\.pdf$/, ".txt") : "Avdhesh_Kumar_Resume.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [settings]);

  const updateThemeBg = useCallback(async (newTheme: "white" | "grey") => {
    setSettings((prev) => ({ ...prev, themeBg: newTheme }));
    localStorage.setItem("portfolio_theme_bg", newTheme);

    document.documentElement.setAttribute("data-theme-bg", newTheme);
    document.body.setAttribute("data-theme-bg", newTheme);
    if (newTheme === "white") {
      document.body.classList.remove("bg-[#F5F2EA]");
      document.body.classList.add("bg-white");
    } else {
      document.body.classList.remove("bg-white");
      document.body.classList.add("bg-[#F5F2EA]");
    }

    try {
      const token = localStorage.getItem("portfolio_admin_token") || localStorage.getItem("admin_token") || "";
      if (token) {
        await updateSiteSettings({ themeBg: newTheme }, token);
      }
    } catch (e) {
      console.warn("Could not persist themeBg to server:", e);
    }
  }, []);

  const updateFeedbackButton = useCallback(async (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, showFeedbackButton: enabled }));

    try {
      const token = localStorage.getItem("portfolio_admin_token") || localStorage.getItem("admin_token") || "";
      if (token) {
        await updateSiteSettings({ showFeedbackButton: enabled }, token);
      }
    } catch (e) {
      console.warn("Could not persist showFeedbackButton to server:", e);
    }
  }, []);

  const updatePromotionBar = useCallback(async (promo: Partial<PromotionBarSettings>) => {
    setSettings((prev) => {
      const updatedPromo: PromotionBarSettings = {
        ...prev.promotionBar,
        ...promo,
      };
      localStorage.setItem("portfolio_promo_settings", JSON.stringify(updatedPromo));
      return { ...prev, promotionBar: updatedPromo };
    });

    try {
      const token = localStorage.getItem("portfolio_admin_token") || localStorage.getItem("admin_token") || "";
      if (token) {
        await fetch("/api/admin/promotion", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(promo),
        });
      }
    } catch (e) {
      console.warn("Could not persist promo to server:", e);
    }
  }, []);

  const hasLiked = useCallback((id: string) => {
    return likedIds.has(id);
  }, [likedIds]);

  const likeItem = useCallback(async (id: string, type: "project" | "blog") => {
    const isAlreadyLiked = likedIds.has(id);
    const action = isAlreadyLiked ? "unlike" : "like";
    const current = likes[id] !== undefined ? likes[id] : 0;
    const newCount = isAlreadyLiked ? Math.max(0, current - 1) : current + 1;

    // Optimistically update
    setLikes((prev) => ({ ...prev, [id]: newCount }));

    const updatedSet = new Set(likedIds);
    if (isAlreadyLiked) {
      updatedSet.delete(id);
    } else {
      updatedSet.add(id);
    }
    setLikedIds(updatedSet);
    try {
      localStorage.setItem("portfolio_user_likes", JSON.stringify(Array.from(updatedSet)));
    } catch {}

    // Call server to increment or decrement like count
    try {
      if (type === "project") {
        const apiLikes = await likeProjectItem(id, action);
        if (typeof apiLikes === "number") {
          setLikes((prev) => ({ ...prev, [id]: apiLikes }));
        }
      } else {
        const apiLikes = await likeBlogItem(id, action);
        if (typeof apiLikes === "number") {
          setLikes((prev) => ({ ...prev, [id]: apiLikes }));
        }
      }
    } catch (e) {
      console.warn("Failed to persist like toggle to server:", e);
    }
  }, [likes, likedIds]);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        isLoading,
        refreshSettings: loadData,
        downloadResume,
        updateThemeBg,
        updateFeedbackButton,
        updatePromotionBar,
        likes,
        hasLiked,
        likeItem,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
