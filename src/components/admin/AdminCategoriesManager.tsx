import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit3, X, FolderTree, AlertCircle, CheckCircle2 } from "lucide-react";
import { AdminListSkeleton } from "../Skeleton";

interface AdminCategoriesManagerProps {
  token: string;
}

export const AdminCategoriesManager: React.FC<AdminCategoriesManagerProps> = ({ token }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    type: "project",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const { data: categories = [], isLoading: loading } = useQuery<any[]>({
    queryKey: ["adminCategories"],
    queryFn: async () => {
      const res = await fetch("/api/admin/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load categories");
      return res.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save category");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setMessage({ type: "success", text: editingId ? "✓ Category updated successfully!" : "✓ Category created successfully!" });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      setMessage({ type: "error", text: err.message || "Error saving category" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete category");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setMessage({ type: "success", text: "Category deleted." });
    },
    onError: (err: any) => {
      setMessage({ type: "error", text: err.message || "Error deleting category" });
    },
  });

  const handleNameChange = (val: string) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setFormData((prev) => ({ ...prev, name: val, slug: prev.slug || slug }));
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ name: "", slug: "", type: "project" });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingId(cat._id);
    setFormData({ name: cat.name, slug: cat.slug, type: cat.type });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#141413]">Category & Tag System</h1>
          <p className="font-mono text-xs sm:text-sm text-[#6B6862] mt-1">Organize projects, blog posts, and gallery items cleanly.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#141413] text-[#D4F050] hover:bg-[#D4F050] hover:text-[#141413] border border-[#141413] font-mono text-xs uppercase tracking-wider font-bold shadow-[4px_4px_0px_#141413] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl border font-mono text-xs flex items-center justify-between shadow-[2px_2px_0px_#141413] ${
          message.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"
        }`}>
          <div className="flex items-center gap-2">
            {message.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage({ type: "", text: "" })} className="p-1 hover:bg-black/5 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Categories table */}
      <div className="bg-[#FAF8F2] border-2 border-[#141413]/15 rounded-3xl shadow-[4px_4px_0px_rgba(20,20,19,0.06)] overflow-hidden">
        {loading ? (
          <AdminListSkeleton rows={5} />
        ) : categories.length === 0 ? (
          <div className="p-12 text-center font-mono text-sm text-[#6B6862]">No categories defined.</div>
        ) : (
          <div className="divide-y divide-[#141413]/10">
            {categories.map((cat: any) => (
              <div key={cat._id} className="p-5 flex items-center justify-between hover:bg-[#F5F2EA]/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#141413] text-[#D4F050] flex items-center justify-center font-display font-bold">
                    <FolderTree className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#141413]">{cat.name}</h3>
                    <p className="font-mono text-xs text-[#6B6862]">Slug: {cat.slug} • Type: <span className="uppercase text-[#141413] font-bold">{cat.type}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => openEditModal(cat)} className="p-2.5 rounded-xl bg-[#F5F2EA] border border-[#141413]/20 hover:border-[#141413] text-[#141413] cursor-pointer">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(cat._id)} className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F2] border-2 border-[#141413] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-[10px_10px_0px_#141413]">
            <div className="flex items-center justify-between pb-4 border-b border-[#141413]/10 mb-6">
              <h2 className="font-display font-bold text-xl text-[#141413]">
                {editingId ? "Edit Category" : "Create Category"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-[#F5F2EA] cursor-pointer">
                <X className="w-5 h-5 text-[#141413]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-[#141413] mb-1.5">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F2EA] border border-[#141413]/20 font-sans text-sm text-[#141413]"
                  placeholder="e.g. Full-Stack"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-[#141413] mb-1.5">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F2EA] border border-[#141413]/20 font-sans text-sm text-[#141413]"
                  placeholder="full-stack"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-[#141413] mb-1.5">Applies To (Type) *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F2EA] border border-[#141413]/20 font-sans text-sm text-[#141413]"
                >
                  <option value="project">Project</option>
                  <option value="blog">Blog</option>
                  <option value="gallery">Gallery</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#141413]/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl bg-[#F5F2EA] border border-[#141413]/20 font-mono text-xs uppercase font-bold text-[#141413] cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-6 py-2.5 rounded-xl bg-[#141413] text-[#D4F050] hover:bg-[#D4F050] hover:text-[#141413] border border-[#141413] font-mono text-xs uppercase tracking-wider font-bold shadow-[3px_3px_0px_#141413] cursor-pointer disabled:opacity-50"
                >
                  {saveMutation.isPending ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
