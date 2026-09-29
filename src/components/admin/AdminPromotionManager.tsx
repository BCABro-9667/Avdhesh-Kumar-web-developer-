import React, { useState, useEffect } from "react";
import { Sparkles, Save, CheckCircle2, Megaphone, Link2, Type, ExternalLink } from "lucide-react";
import { useSiteSettings } from "../../context/SiteSettingsContext";

interface AdminPromotionManagerProps {
  token: string;
}

export const AdminPromotionManager: React.FC<AdminPromotionManagerProps> = ({ token }) => {
  const { updatePromotionBar } = useSiteSettings();
  const [promoData, setPromoData] = useState({
    active: true,
    text: "Building a polished Next.js project from scratch",
    link: "blog/building-polished-nextjs-project",
    badgeText: "Announcement",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // 1. Try reading from localStorage first
    const saved = localStorage.getItem("portfolio_promo_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPromoData((prev) => ({
          active: parsed.active !== undefined ? Boolean(parsed.active) : prev.active,
          text: parsed.text || parsed.reasonText || prev.text,
          link: parsed.link || (parsed.blogId ? `blog/${parsed.blogId}` : prev.link),
          badgeText: parsed.badgeText || parsed.reasonText || "Announcement",
        }));
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Fetch latest promotion from backend
    fetch("/api/promotion")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.promotionBar) {
          const pb = data.promotionBar;
          setPromoData((prev) => ({
            active: pb.active !== undefined ? Boolean(pb.active) : prev.active,
            text: pb.text || prev.text,
            link: pb.link || prev.link,
            badgeText: pb.badgeText || prev.badgeText || "Announcement",
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      // Save via API
      const res = await fetch("/api/admin/promotion", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(promoData),
      });

      // Update context and localStorage
      localStorage.setItem("portfolio_promo_settings", JSON.stringify(promoData));
      sessionStorage.removeItem("portfolio_promo_bar_dismissed"); // Reset dismissal so visitors see the updated promotion
      
      if (updatePromotionBar) {
        await updatePromotionBar(promoData);
      }

      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("promo_settings_updated", { detail: promoData }));

      setMessage({ type: "success", text: "Promotion bar updated and published successfully!" });
    } catch (err: any) {
      // Fallback to localStorage if offline
      localStorage.setItem("portfolio_promo_settings", JSON.stringify(promoData));
      window.dispatchEvent(new Event("storage"));
      setMessage({ type: "success", text: "Promotion bar saved locally!" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#141413]">Promotion Bar Manager</h2>
          <p className="font-sans text-xs text-[#6B6862]">
            Easily write announcement text and provide any destination link to show at the top of your website.
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#D4F050] border-2 border-[#141413] flex items-center justify-center text-[#141413] shadow-[2px_2px_0px_#141413]">
          <Megaphone className="w-5 h-5" />
        </div>
      </div>

      {message.text && (
        <div className="p-4 rounded-2xl bg-[#DCFCE7] border-2 border-[#16A34A] text-[#14532D] font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F2] border-2 border-[#141413] shadow-[6px_6px_0px_#141413] space-y-6">
        {/* Active Toggle */}
        <div className="flex items-center justify-between pb-4 border-b border-[#141413]/10">
          <div>
            <label className="font-display font-bold text-base text-[#141413]">Enable Promotion Bar</label>
            <p className="font-sans text-xs text-[#6B6862]">Show or hide the announcement banner across the site.</p>
          </div>
          <button
            type="button"
            onClick={() => setPromoData((prev) => ({ ...prev, active: !prev.active }))}
            className={`w-14 h-8 rounded-full border-2 border-[#141413] transition-colors relative cursor-pointer ${
              promoData.active ? "bg-[#D4F050]" : "bg-[#E5E2D9]"
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-[#141413] transition-transform ${
                promoData.active ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* 1. Field for Text Write */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#141413] flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#141413]" />
              <span>Announcement Text</span>
            </label>
            <span className="font-mono text-[10px] text-[#6B6862]">Field 1 (Text)</span>
          </div>
          <input
            type="text"
            value={promoData.text}
            onChange={(e) => setPromoData((prev) => ({ ...prev, text: e.target.value }))}
            placeholder="e.g. Building a polished Next.js project from scratch"
            className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#141413] text-[#141413] font-display font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#D4F050] shadow-[2px_2px_0px_#141413]"
            required
          />
          <p className="font-sans text-[11px] text-[#6B6862]">
            Write the message or title to be displayed in the announcement banner.
          </p>
        </div>

        {/* 2. Field for Link */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#141413] flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-[#141413]" />
              <span>Destination Link</span>
            </label>
            <span className="font-mono text-[10px] text-[#6B6862]">Field 2 (Link)</span>
          </div>
          <input
            type="text"
            value={promoData.link}
            onChange={(e) => setPromoData((prev) => ({ ...prev, link: e.target.value }))}
            placeholder="e.g. blog/building-polished-nextjs-project or /projects/devfolio-pro"
            className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#141413] text-[#141413] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#D4F050] shadow-[2px_2px_0px_#141413]"
            required
          />
          <p className="font-sans text-[11px] text-[#6B6862]">
            Internal path (e.g. <code className="bg-[#141413]/5 px-1 py-0.5 rounded">blog/my-post</code>, <code className="bg-[#141413]/5 px-1 py-0.5 rounded">projects/my-app</code>, <code className="bg-[#141413]/5 px-1 py-0.5 rounded">#contact</code>) or external URL (<code className="bg-[#141413]/5 px-1 py-0.5 rounded">https://...</code>).
          </p>
        </div>

        {/* Badge Label (Optional) */}
        <div className="space-y-2">
          <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#141413]">
            Badge Tag (Optional)
          </label>
          <input
            type="text"
            value={promoData.badgeText}
            onChange={(e) => setPromoData((prev) => ({ ...prev, badgeText: e.target.value }))}
            placeholder="e.g. Announcement, New Blog, Featured"
            className="w-full px-4 py-2.5 rounded-2xl bg-white border-2 border-[#141413] text-[#141413] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#D4F050] shadow-[2px_2px_0px_#141413]"
          />
        </div>

        {/* Live Banner Preview */}
        <div className="space-y-2 pt-2">
          <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#141413]">
            Live Banner Preview
          </label>
          <div className="bg-[#D4F050] text-[#141413] border-2 border-[#141413] p-3 rounded-2xl shadow-[3px_3px_0px_#141413] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="px-2.5 py-0.5 rounded-full bg-[#141413] text-[#D4F050] font-mono text-[10px] font-black uppercase tracking-wider shrink-0">
                {promoData.badgeText || "Announcement"}
              </span>
              <span className="font-display font-bold text-xs truncate underline">
                {promoData.text || "Write your promo text here..."}
              </span>
            </div>
            <span className="font-mono text-[10px] font-bold bg-[#141413]/10 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
              <span>Read Now</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#141413] text-[#D4F050] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#D4F050] hover:text-[#141413] transition-colors border-2 border-[#141413] shadow-[4px_4px_0px_#141413] cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Publishing Changes..." : "Save & Publish Promotion Bar"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
