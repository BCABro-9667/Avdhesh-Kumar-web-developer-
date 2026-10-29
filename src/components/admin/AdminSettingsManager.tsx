import React, { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  Github,
  Linkedin,
  Instagram,
  Youtube,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  Sparkles,
  ExternalLink,
  Palette,
  MessageSquareHeart,
} from "lucide-react";
import { XIcon } from "../XIcon";
import { fetchSiteSettings, updateSiteSettings, uploadResumeFile } from "../../lib/apiClient";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { Skeleton } from "../Skeleton";

interface AdminSettingsManagerProps {
  token?: string;
}

export const AdminSettingsManager: React.FC<AdminSettingsManagerProps> = ({ token: propToken }) => {
  const { settings, updateThemeBg, updateFeedbackButton, refreshSettings, downloadResume } = useSiteSettings();
  const token = propToken || localStorage.getItem("portfolio_admin_token") || localStorage.getItem("admin_token") || "";

  // Theme state
  const [themeBg, setThemeBg] = useState<"white" | "grey">(
    ((localStorage.getItem("portfolio_theme_bg") as "white" | "grey") || settings?.themeBg || "white") as "white" | "grey"
  );

  // Feedback button state (default: false)
  const [showFeedbackButton, setShowFeedbackButton] = useState<boolean>(
    settings?.showFeedbackButton ?? false
  );
  const [feedbackUpdating, setFeedbackUpdating] = useState(false);

  // Resume states
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeFileName, setResumeFileName] = useState("Avdhesh_Kumar_Resume.pdf");
  const [resumeUpdatedAt, setResumeUpdatedAt] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  // Social media states
  const [socials, setSocials] = useState({
    github: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    youtube: "",
    facebook: "",
    email: "",
    phone: "",
    location: "",
    statusText: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchSiteSettings();
        if (data) {
          if (data.themeBg) {
            setThemeBg(data.themeBg === "grey" ? "grey" : "white");
          }
          if (data.showFeedbackButton !== undefined) {
            setShowFeedbackButton(Boolean(data.showFeedbackButton));
          }
          setResumeUrl(data.resumeUrl || "");
          setResumeFileName(data.resumeFileName || "Avdhesh_Kumar_Resume.pdf");
          if (data.resumeUpdatedAt) {
            setResumeUpdatedAt(new Date(data.resumeUpdatedAt).toLocaleDateString());
          }
          if (data.socialLinks) {
            setSocials({
              github: data.socialLinks.github || "",
              linkedin: data.socialLinks.linkedin || "",
              twitter: data.socialLinks.twitter || "",
              instagram: data.socialLinks.instagram || "",
              youtube: data.socialLinks.youtube || "",
              facebook: data.socialLinks.facebook || "",
              email: data.socialLinks.email || "",
              phone: data.socialLinks.phone || "",
              location: data.socialLinks.location || "",
              statusText: data.socialLinks.statusText || "",
            });
          }
        }
      } catch (err: any) {
        setErrorMessage("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleThemeChange = async (newTheme: "white" | "grey") => {
    setThemeBg(newTheme);
    if (updateThemeBg) {
      await updateThemeBg(newTheme);
    }
    setSuccessMessage(`Website theme updated to ${newTheme === "white" ? "White (Default)" : "Grey (Optional)"}!`);
    setTimeout(() => setSuccessMessage(""), 3500);
  };

  const handleFeedbackToggle = async () => {
    const nextVal = !showFeedbackButton;
    setShowFeedbackButton(nextVal);
    setFeedbackUpdating(true);
    try {
      if (updateFeedbackButton) {
        await updateFeedbackButton(nextVal);
      }
      setSuccessMessage(
        nextVal
          ? "Floating Feedback button is now ENABLED on live website."
          : "Floating Feedback button is now HIDDEN on live website."
      );
      setTimeout(() => setSuccessMessage(""), 3500);
    } catch (err: any) {
      setErrorMessage("Failed to update feedback button setting.");
      setShowFeedbackButton(!nextVal);
    } finally {
      setFeedbackUpdating(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage("Please select a file to upload.");
      return;
    }
    setIsUploadingResume(true);
    setErrorMessage("");
    try {
      const res = await uploadResumeFile(selectedFile, token);
      if (res && res.resumeUrl) {
        setResumeUrl(res.resumeUrl);
        setResumeFileName(res.resumeFileName);
        setResumeUpdatedAt(new Date().toLocaleDateString());
        setSelectedFile(null);
        setSuccessMessage("Resume uploaded and updated successfully!");
        await refreshSettings();
        setTimeout(() => setSuccessMessage(""), 3500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload resume file.");
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    try {
      await updateSiteSettings(
        {
          themeBg,
          resumeUrl: resumeUrl.trim(),
          resumeFileName: resumeFileName.trim(),
          socialLinks: socials,
        },
        token
      );
      setSuccessMessage("Site settings and social media links saved successfully!");
      await refreshSettings();
      setTimeout(() => setSuccessMessage(""), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="border-b border-[#141413]/10 pb-5">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#141413] tracking-tight">
          Site Settings & Profile
        </h2>
        <p className="text-sm text-[#6B6862] mt-1">
          Upload and manage your Resume, and update live social media handles & contact info across your website.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-2xl text-emerald-900 text-xs sm:text-sm font-mono font-bold flex items-center gap-2.5 shadow-[2px_2px_0px_#10b981]">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border-2 border-red-500 rounded-2xl text-red-900 text-xs sm:text-sm font-mono font-bold flex items-center gap-2.5 shadow-[2px_2px_0px_#ef4444]">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border-2 border-[#141413] shadow-[5px_5px_0px_#141413] p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-[#141413]/10 pb-4">
              <Skeleton className="w-10 h-10 rounded-2xl" />
              <div className="space-y-1">
                <Skeleton className="w-48 h-5 rounded-md" />
                <Skeleton className="w-64 h-3.5 rounded-md" />
              </div>
            </div>
            <Skeleton className="w-full h-32 rounded-2xl" />
          </div>

          <div className="bg-white rounded-3xl border-2 border-[#141413] shadow-[5px_5px_0px_#141413] p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-[#141413]/10 pb-4">
              <Skeleton className="w-10 h-10 rounded-2xl" />
              <div className="space-y-1">
                <Skeleton className="w-48 h-5 rounded-md" />
                <Skeleton className="w-64 h-3.5 rounded-md" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="w-24 h-4 rounded-md" />
                  <Skeleton className="w-full h-10 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* SECTION 0: WEBSITE BACKGROUND THEME */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-stone-900">
                    Website Background Theme
                  </h3>
                  <p className="text-xs text-stone-500">
                    Choose default white or warm editorial grey background
                  </p>
                </div>
              </div>

              <div className="text-xs px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 font-medium border border-stone-200 self-start sm:self-auto">
                Current: {themeBg === "grey" ? "Grey (Warm Beige)" : "White (Default)"}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* White Theme Option (Default) */}
              <button
                type="button"
                onClick={() => handleThemeChange("white")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                  themeBg === "white"
                    ? "border-stone-900 bg-stone-50 shadow-xs"
                    : "border-stone-200 bg-white hover:border-stone-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-stone-400 bg-white" />
                    <span className="font-semibold text-sm text-stone-900">White Theme</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 text-stone-700">
                    Default
                  </span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Clean, modern high-contrast white background (#FFFFFF).
                </p>
                {themeBg === "white" && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Active Theme</span>
                  </div>
                )}
              </button>

              {/* Grey Theme Option (Optional) */}
              <button
                type="button"
                onClick={() => handleThemeChange("grey")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                  themeBg === "grey"
                    ? "border-stone-900 bg-[#F5F2EA]/70 shadow-xs"
                    : "border-stone-200 bg-stone-50/50 hover:border-stone-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-stone-400 bg-[#F5F2EA]" />
                    <span className="font-semibold text-sm text-stone-900">Grey Theme</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 text-stone-700">
                    Editorial
                  </span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Warm editorial beige-grey background (#F5F2EA).
                </p>
                {themeBg === "grey" && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Active Theme</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* SECTION: FLOATING FEEDBACK BUTTON CONTROL */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                  <MessageSquareHeart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-stone-900">
                    Floating Feedback Button
                  </h3>
                  <p className="text-xs text-stone-500">
                    Show or hide the quick visitor feedback button on the live portfolio
                  </p>
                </div>
              </div>

              <div className="text-xs px-2.5 py-1 rounded-md border border-stone-200 text-stone-600 self-start sm:self-auto bg-stone-50">
                Default: Hidden
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-stone-200 bg-stone-50">
              <div className="space-y-0.5 pr-4">
                <div className="font-semibold text-sm text-stone-900">
                  Display Feedback Button on Live Site
                </div>
                <p className="text-xs text-stone-500">
                  {showFeedbackButton
                    ? "Currently visible on live pages."
                    : "Currently hidden from live pages."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleFeedbackToggle}
                disabled={feedbackUpdating}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-stone-300 transition-colors duration-200 ease-in-out focus:outline-none ${
                  showFeedbackButton ? "bg-stone-900" : "bg-stone-200"
                }`}
                role="switch"
                aria-checked={showFeedbackButton}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out mt-[1px] ${
                    showFeedbackButton ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* SECTION 1: RESUME MANAGEMENT */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-stone-900">
                    Resume Management
                  </h3>
                  <p className="text-xs text-stone-500">
                    Visitors clicking "Download Resume" in About/Hero will receive this file.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={downloadResume}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-medium transition-colors cursor-pointer self-start sm:self-center shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Test Download</span>
              </button>
            </div>

        {/* Current Resume Status */}
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-medium uppercase text-stone-500">
              Current Active Resume
            </span>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-stone-700" />
              <span className="text-xs font-medium text-stone-900">
                {resumeFileName || "Avdhesh_Kumar_Resume.pdf"}
              </span>
            </div>
            {resumeUpdatedAt && (
              <span className="text-[10px] text-stone-400">
                Updated on: {resumeUpdatedAt}
              </span>
            )}
          </div>

          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-stone-200 text-xs text-stone-700 hover:bg-stone-50 transition-colors self-start sm:self-center"
            >
              <span>View Online</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>
          ) : (
            <span className="text-xs text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200">
              Built-in Formatted Resume Active
            </span>
          )}
        </div>

        {/* Upload Resume Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Method A: File Upload */}
          <div className="space-y-3 p-4 rounded-xl bg-stone-50 border border-stone-200">
            <h4 className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Option A: Upload PDF / Document</span>
            </h4>
            <p className="text-xs text-stone-500">
              Upload PDF or DOCX file (up to 10MB)
            </p>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
              className="w-full text-xs text-stone-700 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border file:border-stone-200 file:text-xs file:font-medium file:bg-white file:text-stone-700 hover:file:bg-stone-50 cursor-pointer"
            />

            {selectedFile && (
              <div className="text-xs text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
              </div>
            )}

            <button
              type="button"
              onClick={handleFileUpload}
              disabled={!selectedFile || isUploadingResume}
              className="w-full py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              {isUploadingResume ? (
                <span>Uploading...</span>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload & Set Resume</span>
                </>
              )}
            </button>
          </div>

          {/* Method B: Direct URL */}
          <div className="space-y-3 p-4 rounded-xl bg-stone-50 border border-stone-200">
            <h4 className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Option B: Hosted URL Link</span>
            </h4>
            <p className="text-xs text-stone-500">
              Paste a Google Drive or Cloudinary PDF link
            </p>

            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">
                Link URL
              </label>
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">
                Display File Name
              </label>
              <input
                type="text"
                value={resumeFileName}
                onChange={(e) => setResumeFileName(e.target.value)}
                placeholder="Avdhesh_Kumar_Resume.pdf"
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: SOCIAL MEDIA & CONTACT LINKS */}
      <form onSubmit={handleSaveAll} className="bg-white rounded-3xl border-2 border-[#141413] shadow-[5px_5px_0px_#141413] p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-[#141413]/10 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#D4F050] border-2 border-[#141413] flex items-center justify-center text-[#141413] shadow-[2px_2px_0px_#141413]">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-[#141413]">
              Social Media Handles & Profile Links
            </h3>
            <p className="text-xs text-[#6B6862]">
              Update the links that appear in your Navbar, Hero, Contact section, and Footer.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* GitHub */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-[#141413] mb-1.5 flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Profile</span>
            </label>
            <input
              type="url"
              value={socials.github}
              onChange={(e) => setSocials({ ...socials, github: e.target.value })}
              placeholder="https://github.com/username"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F2] border-2 border-[#141413]/20 focus:border-[#141413] text-xs font-mono text-[#141413] focus:outline-none"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-[#141413] mb-1.5 flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn Profile</span>
            </label>
            <input
              type="url"
              value={socials.linkedin}
              onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F2] border-2 border-[#141413]/20 focus:border-[#141413] text-xs font-mono text-[#141413] focus:outline-none"
            />
          </div>

          {/* X */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-[#141413] mb-1.5 flex items-center gap-1.5">
              <XIcon className="w-3.5 h-3.5" />
              <span>X Profile URL</span>
            </label>
            <input
              type="url"
              value={socials.twitter}
              onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
              placeholder="https://x.com/username"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F2] border-2 border-[#141413]/20 focus:border-[#141413] text-xs font-mono text-[#141413] focus:outline-none"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-[#141413] mb-1.5 flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram Profile</span>
            </label>
            <input
              type="url"
              value={socials.instagram}
              onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
              placeholder="https://instagram.com/username"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F2] border-2 border-[#141413]/20 focus:border-[#141413] text-xs font-mono text-[#141413] focus:outline-none"
            />
          </div>

          {/* YouTube */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-[#141413] mb-1.5 flex items-center gap-1.5">
              <Youtube className="w-3.5 h-3.5" />
              <span>YouTube Channel</span>
            </label>
            <input
              type="url"
              value={socials.youtube}
              onChange={(e) => setSocials({ ...socials, youtube: e.target.value })}
              placeholder="https://youtube.com/@channel"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F2] border-2 border-[#141413]/20 focus:border-[#141413] text-xs font-mono text-[#141413] focus:outline-none"
            />
          </div>

          {/* Facebook */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-[#141413] mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Facebook / Extra Website</span>
            </label>
            <input
              type="url"
              value={socials.facebook}
              onChange={(e) => setSocials({ ...socials, facebook: e.target.value })}
              placeholder="https://facebook.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F2] border-2 border-[#141413]/20 focus:border-[#141413] text-xs font-mono text-[#141413] focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-[#141413] mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={socials.email}
              onChange={(e) => setSocials({ ...socials, email: e.target.value })}
              placeholder="yourname@gmail.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F2] border-2 border-[#141413]/20 focus:border-[#141413] text-xs font-mono text-[#141413] focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-[#141413] mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>Phone Number</span>
            </label>
            <input
              type="text"
              value={socials.phone}
              onChange={(e) => setSocials({ ...socials, phone: e.target.value })}
              placeholder="+91 9876543210"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F2] border-2 border-[#141413]/20 focus:border-[#141413] text-xs font-mono text-[#141413] focus:outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-[#141413] mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Location / City</span>
            </label>
            <input
              type="text"
              value={socials.location}
              onChange={(e) => setSocials({ ...socials, location: e.target.value })}
              placeholder="Gurugram, Haryana, India"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F2] border-2 border-[#141413]/20 focus:border-[#141413] text-xs font-mono text-[#141413] focus:outline-none"
            />
          </div>

          {/* Availability / Status */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-[#141413] mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Work Availability Status</span>
            </label>
            <input
              type="text"
              value={socials.statusText}
              onChange={(e) => setSocials({ ...socials, statusText: e.target.value })}
              placeholder="Open to Full-Time & Freelance Roles"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F2] border-2 border-[#141413]/20 focus:border-[#141413] text-xs font-mono text-[#141413] focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#141413]/10 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-2xl bg-[#141413] hover:bg-[#D4F050] text-[#FAF8F2] hover:text-[#141413] font-mono text-xs font-bold uppercase tracking-wider border-2 border-[#141413] shadow-[3px_3px_0px_#141413] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving Settings..." : "Save All Site Settings"}</span>
          </button>
        </div>
      </form>
        </>
      )}
    </div>
  );
};
