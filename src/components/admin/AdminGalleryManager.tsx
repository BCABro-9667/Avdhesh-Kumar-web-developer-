import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit3, X, Upload, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";
import { AdminCardsSkeletonGrid } from "../Skeleton";
import { useImageUpload } from "../../lib/useImageUpload";

interface AdminGalleryManagerProps {
  token: string;
}

export const AdminGalleryManager: React.FC<AdminGalleryManagerProps> = ({ token }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    title: "",
    imageAlt: "",
    category: "Portfolio Work",
    status: "published",
  });

  const imageUploader = useImageUpload(token, "");

  // TanStack Queries
  const { data: gallery = [], isLoading: loading } = useQuery<any[]>({
    queryKey: ["adminGallery"],
    queryFn: async () => {
      const res = await fetch("/api/admin/gallery", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to fetch gallery");
      return res.json();
    },
  });

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["categories", "gallery"],
    queryFn: async () => {
      const res = await fetch("/api/categories?type=gallery");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  // Mutations
  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      const url = editingId ? `/api/admin/gallery/${editingId}` : "/api/admin/gallery";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save gallery item");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminGallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      setMessage({ type: "success", text: editingId ? "Gallery item updated!" : "Gallery item added!" });
      setIsModalOpen(false);
      imageUploader.removeImage();
    },
    onError: (err: any) => {
      setMessage({ type: "error", text: err.message || "Failed to save gallery item" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminGallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      setMessage({ type: "success", text: "Gallery image deleted successfully." });
    },
    onError: (err: any) => {
      setMessage({ type: "error", text: err.message || "Error deleting" });
    },
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: "",
      imageAlt: "",
      category: categories[0]?.name || "Portfolio Work",
      status: "published",
    });
    imageUploader.removeImage();
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item._id);
    setFormData({
      title: item.title || "",
      imageAlt: item.imageAlt || "",
      category: item.category || (categories[0]?.name || "Portfolio Work"),
      status: item.status || "published",
    });
    imageUploader.setManualUrl(item.image || "");
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      imageUploader.selectFile(file);
      if (!formData.imageAlt && formData.title) {
        setFormData((prev) => ({ ...prev, imageAlt: formData.title }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (imageUploader.isUploading) {
      alert("Image is still uploading in the background. Please wait a brief moment for it to complete.");
      return;
    }

    const finalImageUrl = imageUploader.remoteUrl || imageUploader.previewUrl;
    if (!finalImageUrl) {
      alert("Please upload or provide an image for the gallery asset.");
      return;
    }

    saveMutation.mutate({
      ...formData,
      image: finalImageUrl,
      public_id: imageUploader.publicId || "",
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this gallery image? This will also remove the asset from Cloudinary.")) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#141413]">Gallery Management</h1>
          <p className="font-mono text-xs sm:text-sm text-[#6B6862] mt-1">Upload and manage visual assets with instant preview and background Cloudinary storage.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#141413] text-[#D4F050] hover:bg-[#D4F050] hover:text-[#141413] border border-[#141413] font-mono text-xs uppercase tracking-wider font-bold shadow-[4px_4px_0px_#141413] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Upload Image
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl border font-mono text-xs flex items-center justify-between shadow-[2px_2px_0px_#141413] ${message.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
          <div className="flex items-center gap-2">
            {message.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage({ type: "", text: "" })}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Gallery Grid / Skeleton */}
      {loading ? (
        <AdminCardsSkeletonGrid count={6} />
      ) : gallery.length === 0 ? (
        <div className="p-12 text-center bg-[#FAF8F2] border-2 border-[#141413]/15 rounded-3xl font-mono text-sm text-[#6B6862]">
          No gallery images uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item: any) => (
            <div key={item._id} className="bg-[#FAF8F2] border-2 border-[#141413]/15 rounded-3xl overflow-hidden shadow-[4px_4px_0px_rgba(20,20,19,0.06)] flex flex-col">
              <div className="relative aspect-video bg-[#F5F2EA] overflow-hidden group">
                <img src={item.image} alt={item.imageAlt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button onClick={() => openEditModal(item)} className="p-2 rounded-xl bg-[#FAF8F2] border border-[#141413]/20 hover:border-[#141413] text-[#141413] shadow cursor-pointer">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 shadow cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-[#141413]">{item.title}</h3>
                  <p className="font-mono text-xs text-[#6B6862] mt-1">{item.category}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#141413]/10 flex items-center justify-between font-mono text-[11px] text-[#6B6862]">
                  <span>Alt: {item.imageAlt}</span>
                  <span className="uppercase text-emerald-700 font-bold">{item.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF8F2] border-2 border-[#141413] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-[10px_10px_0px_#141413]">
            <div className="flex items-center justify-between pb-4 border-b border-[#141413]/10 mb-6">
              <h2 className="font-display font-bold text-xl text-[#141413]">
                {editingId ? "Edit Gallery Item" : "Upload Gallery Asset"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-[#F5F2EA] cursor-pointer">
                <X className="w-5 h-5 text-[#141413]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-[#141413] mb-1.5">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F2EA] border border-[#141413]/20 font-sans text-sm text-[#141413] focus:outline-none focus:border-[#141413]"
                  placeholder="e.g. System Architecture Diagram"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-[#141413] mb-1.5">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F2EA] border border-[#141413]/20 font-sans text-sm text-[#141413] focus:outline-none focus:border-[#141413]"
                >
                  {categories.map((cat: any) => (
                    <option key={cat._id || cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Asynchronous Non-blocking Image Upload with Instant Preview */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-[#141413] mb-1.5">
                  Gallery Image *
                </label>

                {imageUploader.previewUrl ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-[#141413] bg-white group mb-3">
                    <img src={imageUploader.previewUrl} alt="Preview" className="w-full h-full object-cover" />

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      {imageUploader.isUploading ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141413]/80 text-[#D4F050] font-mono text-[11px] backdrop-blur-xs">
                          <span className="w-2 h-2 rounded-full border-2 border-[#D4F050] border-t-transparent animate-spin" />
                          Uploading in background...
                        </span>
                      ) : imageUploader.status === "error" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-mono text-[11px]">
                          Upload failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-mono text-[11px]">
                          ✓ Cloudinary ready
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      {imageUploader.status === "error" && (
                        <button
                          type="button"
                          onClick={imageUploader.retry}
                          className="p-2 rounded-xl bg-white text-[#141413] border border-[#141413] hover:bg-[#D4F050] shadow-sm cursor-pointer"
                          title="Retry upload"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={imageUploader.removeImage}
                        className="p-2 rounded-xl bg-white text-red-600 border border-red-200 hover:bg-red-50 shadow-sm cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <input
                      type="url"
                      placeholder="Paste image URL or choose file..."
                      value={imageUploader.remoteUrl}
                      onChange={(e) => imageUploader.setManualUrl(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#F5F2EA] border border-[#141413]/20 font-sans text-sm text-[#141413] focus:outline-none focus:border-[#141413]"
                    />
                    <label className="px-4 py-2.5 rounded-xl bg-[#141413] text-[#D4F050] hover:bg-[#D4F050] hover:text-[#141413] font-mono text-xs uppercase font-bold flex items-center gap-2 cursor-pointer shrink-0 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Choose File</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                )}

                {imageUploader.error && (
                  <p className="font-mono text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{imageUploader.error}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-[#141413] mb-1.5">Image Alt Text (SEO) *</label>
                <input
                  type="text"
                  required
                  value={formData.imageAlt}
                  onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F2EA] border border-[#141413]/20 font-sans text-sm text-[#141413] focus:outline-none focus:border-[#141413]"
                  placeholder="Detailed description of the image"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#141413]/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#F5F2EA] border border-[#141413]/20 font-mono text-xs uppercase font-bold text-[#141413] cursor-pointer hover:bg-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-6 py-2.5 rounded-xl bg-[#141413] text-[#D4F050] hover:bg-[#D4F050] hover:text-[#141413] border border-[#141413] font-mono text-xs uppercase tracking-wider font-bold shadow-[3px_3px_0px_#141413] cursor-pointer disabled:opacity-50"
                >
                  {saveMutation.isPending ? "Saving..." : editingId ? "Update Asset" : "Save Asset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
