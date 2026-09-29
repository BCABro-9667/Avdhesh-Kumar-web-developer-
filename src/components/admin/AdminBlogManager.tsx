import React, { useEffect, useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  X,
  Upload,
  ArrowLeft,
  Save,
  CheckCircle2,
  FolderPlus,
  RotateCcw,
  Clock,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";
import { AdminCardsSkeletonGrid } from "../Skeleton";
import { useImageUpload } from "../../lib/useImageUpload";

interface AdminBlogManagerProps {
  token: string;
  action?: "list" | "create" | "edit";
  targetId?: string | null;
  onNavigate?: (action: "list" | "create" | "edit", targetId?: string | null) => void;
}

const AUTOSAVE_STORAGE_KEY = "portfolio_admin_blog_autosave_v2";

export const AdminBlogManager: React.FC<AdminBlogManagerProps> = ({
  token,
  action = "list",
  targetId = null,
  onNavigate,
}) => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [viewMode, setViewMode] = useState<"list" | "form">(action === "create" || action === "edit" ? "form" : "list");
  const [editingId, setEditingId] = useState<string | null>(targetId);

  const [draftRecovered, setDraftRecovered] = useState<string | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const initialFormState = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    imageAlt: "",
    category: "",
    keywords: "",
    tags: "",
    author: "Avdhesh Kumar",
    status: "published",
  };

  const [formData, setFormData] = useState(() => {
    if (action === "create") {
      const saved = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.data) return parsed.data;
        } catch (e) {}
      }
    }
    return initialFormState;
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  // Hook for zero-latency preview and background Cloudinary upload
  const imageUploader = useImageUpload(token, formData.featuredImage || "");

  // Category Modal & Quick Create State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  // TanStack Queries for Server State
  const { data: posts = [], isLoading: loading } = useQuery<any[]>({
    queryKey: ["adminBlogs"],
    queryFn: async () => {
      const res = await fetch("/api/admin/blog", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load blog posts");
      return res.json();
    },
  });

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["categories", "blog"],
    queryFn: async () => {
      const res = await fetch("/api/categories?type=blog");
      if (!res.ok) throw new Error("Failed to load categories");
      return res.json();
    },
  });

  // TanStack Mutations
  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      const url = editingId ? `/api/admin/blog/${editingId}` : "/api/admin/blog";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save blog post");
      return data;
    },
    onSuccess: (savedPost) => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
      setMessage({
        type: "success",
        text: editingId ? "✓ Blog updated successfully!" : "✓ Blog post published immediately!",
      });
      setEditingId(null);
      setDraftRecovered(null);
      imageUploader.removeImage();
      triggerBackToList();
    },
    onError: (err: any) => {
      setMessage({ type: "error", text: err.message || "Failed to save blog post" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      setMessage({ type: "success", text: "Blog post deleted." });
    },
    onError: (err: any) => {
      setMessage({ type: "error", text: err.message || "Failed to delete" });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (trimmed: string) => {
      const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: trimmed, slug, type: "blog" }),
      });
      const data = await res.json();
      return data.name ? data : { name: trimmed, slug, type: "blog" };
    },
    onSuccess: (createdCat) => {
      queryClient.invalidateQueries({ queryKey: ["categories", "blog"] });
      setFormData((prev: any) => ({ ...prev, category: createdCat.name }));
      setNewCatName("");
      setShowCategoryModal(false);
      setQuickAddOpen(false);
      setMessage({ type: "success", text: `Category "${createdCat.name}" created and auto-selected!` });
    },
    onError: (err: any) => {
      setMessage({ type: "error", text: err.message || "Failed to create category" });
    },
  });

  // Sync internal state when props action/targetId changes
  useEffect(() => {
    if (action === "create") {
      setViewMode("form");
      setEditingId(null);
      const saved = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed?.data) {
            setFormData(parsed.data);
            imageUploader.setManualUrl(parsed.data.featuredImage || "");
            return;
          }
        } catch (e) {}
      }
      setFormData({
        ...initialFormState,
        category: categories[0]?.name || "Web Development",
      });
      imageUploader.removeImage();
    } else if (action === "edit" && targetId) {
      setViewMode("form");
      setEditingId(targetId);
      const existing = posts.find((p) => p._id === targetId);
      if (existing) {
        populateForm(existing);
      }
    } else {
      setViewMode("list");
      setEditingId(null);
    }
  }, [action, targetId, posts]);

  const populateForm = (post: any) => {
    const postImage = post.featuredImage || "";
    setFormData({
      title: post.title || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      featuredImage: postImage,
      imageAlt: post.imageAlt || post.title || "",
      category: post.category || categories[0]?.name || "Web Development",
      keywords: Array.isArray(post.keywords) ? post.keywords.join(", ") : post.keywords || "",
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : post.tags || "",
      author: post.author || "Avdhesh Kumar",
      status: post.status || "published",
    });
    imageUploader.setManualUrl(postImage);
  };

  // Check on mount if draft exists with actual content
  useEffect(() => {
    const saved = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.timestamp && (parsed.data?.title || parsed.data?.content || parsed.data?.excerpt)) {
          const dateStr = new Date(parsed.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          setDraftRecovered(dateStr);
          setLastSavedTime(dateStr);
        }
      } catch (e) {}
    }
  }, []);

  // Debounced Autosave to localStorage on changes in form mode
  // Debouncing avoids executing re-renders or storage writes on every keystroke
  const autosaveTimerRef = useRef<any>(null);
  useEffect(() => {
    if (viewMode === "form") {
      const hasContent = Boolean(
        formData.title?.trim() ||
        formData.content?.trim() ||
        formData.excerpt?.trim() ||
        formData.featuredImage?.trim() ||
        imageUploader.remoteUrl
      );

      if (hasContent) {
        clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = setTimeout(() => {
          const now = Date.now();
          const payload = {
            data: {
              ...formData,
              featuredImage: imageUploader.remoteUrl || formData.featuredImage,
            },
            editingId: editingId || null,
            timestamp: now,
          };
          localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(payload));
          const timeFormatted = new Date(now).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          setLastSavedTime(timeFormatted);
        }, 1200);
      }
    }
    return () => clearTimeout(autosaveTimerRef.current);
  }, [formData, viewMode, editingId, imageUploader.remoteUrl]);

  // Protect against accidental browser unload/refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (viewMode === "form" && (formData.title || formData.content || formData.excerpt)) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [viewMode, formData]);

  const handleTitleChange = (val: string) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setFormData((prev: any) => ({ ...prev, title: val, slug }));
  };

  const handleContentChange = useCallback((html: string) => {
    setFormData((prev: any) => ({ ...prev, content: html }));
  }, []);

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Instant local preview and non-blocking background upload
    imageUploader.selectFile(file);

    // Auto-fill alt text if blank
    if (!formData.imageAlt && formData.title) {
      setFormData((prev: any) => ({ ...prev, imageAlt: prev.title }));
    }
  };

  const discardDraft = () => {
    localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
    setFormData({
      ...initialFormState,
      category: categories[0]?.name || "Web Development",
    });
    imageUploader.removeImage();
    setEditingId(null);
    setDraftRecovered(null);
    setLastSavedTime(null);
    setMessage({ type: "success", text: "Draft cleared. Started fresh form." });
  };

  const triggerOpenCreate = () => {
    if (onNavigate) {
      onNavigate("create");
    } else {
      setEditingId(null);
      setViewMode("form");
      imageUploader.removeImage();
    }
    const scrollEl = document.getElementById("admin-content-scroll");
    if (scrollEl) scrollEl.scrollTo({ top: 0, behavior: "smooth" });
  };

  const triggerOpenEdit = (post: any) => {
    if (onNavigate) {
      onNavigate("edit", post._id);
    } else {
      setEditingId(post._id);
      populateForm(post);
      setViewMode("form");
    }
    const scrollEl = document.getElementById("admin-content-scroll");
    if (scrollEl) scrollEl.scrollTo({ top: 0, behavior: "smooth" });
  };

  const triggerBackToList = () => {
    if (onNavigate) {
      onNavigate("list");
    } else {
      setViewMode("list");
      setEditingId(null);
    }
    const scrollEl = document.getElementById("admin-content-scroll");
    if (scrollEl) scrollEl.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategorySelectChange = (val: string) => {
    if (val === "__create_new__") {
      setShowCategoryModal(true);
    } else {
      setFormData((prev: any) => ({ ...prev, category: val }));
    }
  };

  const executeCreateCategory = (nameToCreate: string) => {
    const trimmed = nameToCreate.trim();
    if (!trimmed) return;
    createCategoryMutation.mutate(trimmed);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (saveMutation.isPending) return;

    if (!formData.title?.trim()) {
      setMessage({ type: "error", text: "Please enter a blog title." });
      return;
    }
    if (!formData.excerpt?.trim()) {
      setMessage({ type: "error", text: "Please enter an excerpt / summary." });
      return;
    }
    if (!formData.content?.trim()) {
      setMessage({ type: "error", text: "Please write article content in the editor." });
      return;
    }

    // Verify background image upload readiness
    if (imageUploader.isUploading) {
      setMessage({
        type: "error",
        text: "Cover image is still uploading to Cloudinary in the background. Please wait a brief moment for it to complete.",
      });
      return;
    }

    if (imageUploader.isError) {
      setMessage({
        type: "error",
        text: "Image upload failed. Please click 'Retry Upload' or remove the image before publishing.",
      });
      return;
    }

    const finalImage = imageUploader.remoteUrl || formData.featuredImage || "";
    const finalSlug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const finalImageAlt = formData.imageAlt?.trim() || formData.title.trim();
    const finalCategory = formData.category || categories[0]?.name || "Web Development";

    const payload = {
      ...formData,
      slug: finalSlug,
      imageAlt: finalImageAlt,
      category: finalCategory,
      featuredImage: finalImage,
      keywords: typeof formData.keywords === "string" ? formData.keywords.split(",").map((s: string) => s.trim()).filter(Boolean) : formData.keywords,
      tags: typeof formData.tags === "string" ? formData.tags.split(",").map((s: string) => s.trim()).filter(Boolean) : formData.tags,
    };

    saveMutation.mutate(payload);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    deleteMutation.mutate(id);
  };

  const filteredPosts = posts.filter((post) => {
    const matchSearch = (post.title || "").toLowerCase().includes(search.toLowerCase()) ||
                        (post.excerpt || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || post.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeImageDisplay = imageUploader.previewUrl || formData.featuredImage;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Category Creation Modal Popup */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#FAF8F2] border-2 border-[#141413] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[8px_8px_0px_#141413] space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D4F050] text-[#141413] flex items-center justify-center border-2 border-[#141413]">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-xl text-[#141413]">Create New Blog Category</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="p-2 rounded-xl text-[#141413] hover:bg-black/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-[#6B6862] uppercase mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      executeCreateCategory(newCatName);
                    }
                  }}
                  placeholder="e.g. Artificial Intelligence, Cloud Architecture..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#141413] bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#D4F050]"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-5 py-2.5 rounded-xl border-2 border-[#141413] font-mono text-xs uppercase tracking-wider font-bold hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => executeCreateCategory(newCatName)}
                  disabled={createCategoryMutation.isPending || !newCatName.trim()}
                  className="px-6 py-2.5 rounded-xl bg-[#D4F050] border-2 border-[#141413] font-mono text-xs uppercase tracking-wider font-bold text-[#141413] shadow-[3px_3px_0px_#141413] hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer disabled:opacity-50"
                >
                  {createCategoryMutation.isPending ? "Creating..." : "Save & Select"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF8F2] border-2 border-[#141413] p-6 rounded-3xl shadow-[4px_4px_0px_#141413]">
        <div>
          <div className="font-mono text-xs text-[#6B6862] uppercase tracking-wider">Content Management</div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#141413]">
            {viewMode === "list" ? `Blog Posts (${posts.length})` : (editingId ? "Edit Blog Article" : "Write New Blog Article")}
          </h2>
        </div>
        {viewMode === "list" ? (
          <button
            type="button"
            onClick={triggerOpenCreate}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#D4F050] border-2 border-[#141413] font-mono text-xs font-bold uppercase tracking-wider text-[#141413] shadow-[4px_4px_0px_#141413] hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Blog Post</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={triggerBackToList}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#FAF8F2] border-2 border-[#141413] font-mono text-xs font-bold uppercase tracking-wider text-[#141413] shadow-[4px_4px_0px_#141413] cursor-pointer hover:bg-black/5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to List</span>
            </button>
          </div>
        )}
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl border-2 border-[#141413] font-mono text-xs flex items-center justify-between shadow-[2px_2px_0px_#141413] ${
          message.type === "success" ? "bg-[#D4F050]/20 text-[#141413]" : "bg-red-500/20 text-red-900"
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage({ type: "", text: "" })} className="p-1 hover:bg-black/5 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6862]" />
              <input
                type="text"
                placeholder="Search blog posts by title or summary..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-[#141413] bg-[#FAF8F2] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#D4F050] shadow-[2px_2px_0px_#141413]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-2xl border-2 border-[#141413] bg-[#FAF8F2] font-mono text-xs uppercase tracking-wider shadow-[2px_2px_0px_#141413] focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {loading ? (
            <AdminCardsSkeletonGrid count={6} />
          ) : filteredPosts.length === 0 ? (
            <div className="bg-[#FAF8F2] border-2 border-[#141413] rounded-3xl p-12 text-center shadow-[4px_4px_0px_#141413]">
              <p className="font-mono text-sm text-[#6B6862] mb-4">No blog posts found.</p>
              <button
                type="button"
                onClick={triggerOpenCreate}
                className="px-6 py-3 rounded-2xl bg-[#D4F050] border-2 border-[#141413] font-mono text-xs font-bold uppercase text-[#141413] shadow-[3px_3px_0px_#141413] cursor-pointer"
              >
                Write Your First Post
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div key={post._id} className="bg-[#FAF8F2] border-2 border-[#141413] rounded-3xl p-6 shadow-[4px_4px_0px_#141413] flex flex-col justify-between hover:shadow-[6px_6px_0px_#141413] transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider font-bold border border-[#141413] ${
                        post.status === "published" ? "bg-[#D4F050] text-[#141413]" : "bg-neutral-200 text-[#141413]"
                      }`}>
                        {post.status}
                      </span>
                      <span className="font-mono text-[10px] text-[#6B6862]">{post.category || "General"}</span>
                    </div>

                    {post.featuredImage && (
                      <div className="mb-4 aspect-[16/9] rounded-xl overflow-hidden border border-[#141413]/20 bg-white">
                        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <h3 className="font-display font-bold text-xl text-[#141413] mb-2 line-clamp-2">{post.title}</h3>
                    <p className="font-sans text-xs text-[#6B6862] line-clamp-3 mb-4">{post.excerpt}</p>
                  </div>

                  <div className="pt-4 border-t border-[#141413]/10 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#6B6862]">
                      {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => triggerOpenEdit(post)}
                        className="p-2 rounded-xl bg-[#FAF8F2] border-2 border-[#141413] text-[#141413] hover:bg-[#D4F050] shadow-[2px_2px_0px_#141413] cursor-pointer"
                        title="Edit Post"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(post._id)}
                        className="p-2 rounded-xl bg-red-100 border-2 border-[#141413] text-red-700 hover:bg-red-200 shadow-[2px_2px_0px_#141413] cursor-pointer"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FORM VIEW (Create / Edit Blog) */}
      {viewMode === "form" && (
        <form onSubmit={handleSubmit} className="bg-[#FAF8F2] border-2 border-[#141413] rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_#141413] space-y-6">
          {/* Recovery and Auto-save Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#141413]/10 gap-3">
            <div>
              <h3 className="font-display font-bold text-2xl text-[#141413]">
                {editingId ? "Edit Blog Article" : "Write New Blog Article"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-mono text-xs text-[#6B6862]">
                  {lastSavedTime ? (
                    <>Auto-saved locally in browser at <strong className="text-[#141413]">{lastSavedTime}</strong></>
                  ) : (
                    "Auto-saving locally to protect work from page refresh"
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={discardDraft}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#141413]/30 bg-white font-mono text-[11px] text-[#6B6862] hover:text-[#141413] hover:border-[#141413] cursor-pointer"
                title="Discard cached browser draft"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset / Discard Draft</span>
              </button>
            </div>
          </div>

          {draftRecovered && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 font-mono text-xs flex items-center justify-between shadow-[2px_2px_0px_rgba(217,119,6,0.2)]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Unsaved draft restored from your browser cache ({draftRecovered}). Your progress was protected from page refresh.</span>
              </div>
              <button
                type="button"
                onClick={() => setDraftRecovered(null)}
                className="text-amber-800 hover:text-black font-bold text-xs underline cursor-pointer ml-3 shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block font-mono text-xs text-[#6B6862] uppercase mb-2">Blog Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Mahatma Gandhi: The Life, Ideas and Legacy of a Leader of Non-Violence"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#141413] bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#D4F050] shadow-[2px_2px_0px_#141413]"
              />
              <p className="mt-1 font-mono text-[10px] text-[#6B6862]">URL slug: /blog/{formData.slug || "auto-generated-slug"}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-mono text-xs text-[#6B6862] uppercase">Category *</label>
                <button
                  type="button"
                  onClick={() => setQuickAddOpen(!quickAddOpen)}
                  className="font-mono text-[11px] text-[#141413] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>{quickAddOpen ? "Hide Input" : "Add New Category"}</span>
                </button>
              </div>

              {quickAddOpen && (
                <div className="mb-3 p-3 bg-white border-2 border-[#141413] rounded-2xl shadow-[2px_2px_0px_#141413] space-y-2">
                  <div className="font-mono text-[10px] text-[#6B6862] uppercase">Quick Create Category</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          executeCreateCategory(newCatName);
                        }
                      }}
                      placeholder="Category name..."
                      className="flex-1 px-3 py-1.5 rounded-xl border border-[#141413] font-sans text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={createCategoryMutation.isPending || !newCatName.trim()}
                      onClick={() => executeCreateCategory(newCatName)}
                      className="px-3 py-1.5 bg-[#D4F050] border border-[#141413] rounded-xl font-mono text-[10px] font-bold uppercase cursor-pointer disabled:opacity-50"
                    >
                      {createCategoryMutation.isPending ? "Adding..." : "Add & Select"}
                    </button>
                  </div>
                </div>
              )}

              <select
                value={formData.category}
                onChange={(e) => handleCategorySelectChange(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#141413] bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#D4F050] shadow-[2px_2px_0px_#141413]"
              >
                <option value="" disabled>Select Category</option>
                {categories.map((cat: any) => (
                  <option key={cat._id || cat.name} value={cat.name}>{cat.name}</option>
                ))}
                <option value="__create_new__" className="font-bold text-[#141413] bg-[#D4F050]">
                  + Create New Category...
                </option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs text-[#6B6862] uppercase mb-2">Author Name</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#141413] bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#D4F050] shadow-[2px_2px_0px_#141413]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-mono text-xs text-[#6B6862] uppercase mb-2">Excerpt / Summary *</label>
              <textarea
                rows={3}
                required
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary shown on blog cards and previews..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#141413] bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#D4F050] shadow-[2px_2px_0px_#141413]"
              />
            </div>

            {/* FEATURED COVER IMAGE WITH ZERO-LATENCY PREVIEW & BACKGROUND UPLOAD */}
            <div className="md:col-span-2">
              <label className="block font-mono text-xs text-[#6B6862] uppercase mb-2">Featured Cover Image (Optional)</label>

              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="url"
                  value={formData.featuredImage}
                  onChange={(e) => {
                    const url = e.target.value;
                    setFormData({ ...formData, featuredImage: url });
                    imageUploader.setManualUrl(url);
                  }}
                  placeholder="Paste image URL (https://...) or choose file to upload"
                  className="flex-1 px-4 py-3 rounded-2xl border-2 border-[#141413] bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#D4F050] shadow-[2px_2px_0px_#141413]"
                />
                <label className="px-5 py-3 rounded-2xl bg-[#FAF8F2] border-2 border-[#141413] font-mono text-xs font-bold uppercase tracking-wider text-[#141413] shadow-[2px_2px_0px_#141413] hover:bg-[#D4F050] cursor-pointer shrink-0 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>{imageUploader.isUploading ? "Uploading..." : "Select File"}</span>
                  <input type="file" accept="image/*" onChange={handleImageFileSelect} className="hidden" />
                </label>
              </div>

              {/* Status and Progress Bar for Image Upload */}
              {imageUploader.isUploading && (
                <div className="mt-2.5 p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-blue-900 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
                    <span>Uploading image in background... You can continue filling other fields.</span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">Background Sync</span>
                </div>
              )}

              {imageUploader.isSuccess && imageUploader.remoteUrl && (
                <div className="mt-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-900 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>✓ Image uploaded & saved to Cloudinary cloud storage.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      imageUploader.removeImage();
                      setFormData((prev: any) => ({ ...prev, featuredImage: "" }));
                    }}
                    className="text-red-600 hover:text-red-800 text-[11px] font-bold underline cursor-pointer"
                  >
                    Remove Image
                  </button>
                </div>
              )}

              {imageUploader.isError && (
                <div className="mt-2.5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-red-900 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Upload failed: {imageUploader.error}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={imageUploader.retry}
                      className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg font-bold text-[11px] cursor-pointer"
                    >
                      Retry
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        imageUploader.removeImage();
                        setFormData((prev: any) => ({ ...prev, featuredImage: "" }));
                      }}
                      className="text-red-700 hover:text-black text-[11px] underline cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Instant Image Preview */}
              {activeImageDisplay && (
                <div className="mt-3 relative group">
                  <div className="aspect-[16/9] max-h-48 rounded-xl overflow-hidden border-2 border-[#141413] bg-white">
                    <img src={activeImageDisplay} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        imageUploader.removeImage();
                        setFormData((prev: any) => ({ ...prev, featuredImage: "" }));
                      }}
                      className="p-1.5 rounded-lg bg-black/80 hover:bg-red-600 text-white font-mono text-xs cursor-pointer shadow-md transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-3">
                <label className="block font-mono text-[11px] text-[#6B6862] uppercase mb-1">Image Alt Text (Optional - defaults to article title)</label>
                <input
                  type="text"
                  value={formData.imageAlt}
                  onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                  placeholder={formData.title ? `e.g. ${formData.title}` : "Descriptive alt text for SEO"}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#141413]/30 bg-white font-sans text-xs focus:outline-none focus:border-[#141413]"
                />
              </div>
            </div>

            {/* STABLE RICH TEXT EDITOR */}
            <div className="md:col-span-2">
              <label className="block font-mono text-xs text-[#6B6862] uppercase mb-2">Full Article Content (WYSIWYG Rich Text Editor) *</label>
              <RichTextEditor
                key={editingId ? `edit-${editingId}` : "new-blog"}
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Write your rich blog article content here..."
                height={400}
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-[#6B6862] uppercase mb-2">Keywords (comma separated)</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="history, non-violence, peace, leadership"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#141413] bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#D4F050] shadow-[2px_2px_0px_#141413]"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-[#6B6862] uppercase mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Inspiration, History, Philosophy"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#141413] bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#D4F050] shadow-[2px_2px_0px_#141413]"
              />
            </div>

            {/* Publication Status placed at the very end of the form */}
            <div className="md:col-span-2 pt-4 border-t border-[#141413]/10">
              <label className="block font-mono text-xs text-[#141413] font-bold uppercase mb-2">Publication Status *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-[#141413] bg-white cursor-pointer hover:bg-black/5">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={formData.status === "draft"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="accent-[#141413]"
                  />
                  <span className="font-mono text-xs uppercase font-bold">Save as Draft</span>
                </label>
                <label className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-[#141413] bg-[#D4F050] cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={formData.status === "published"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="accent-[#141413]"
                  />
                  <span className="font-mono text-xs uppercase font-bold">Publish Immediately</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#141413]/10">
            <button
              type="button"
              onClick={triggerBackToList}
              className="px-6 py-3 rounded-2xl border-2 border-[#141413] font-mono text-xs uppercase tracking-wider font-bold hover:bg-black/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending || imageUploader.isUploading}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#D4F050] border-2 border-[#141413] font-mono text-xs uppercase tracking-wider font-bold text-[#141413] shadow-[4px_4px_0px_#141413] hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saveMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#141413] border-t-transparent rounded-full animate-spin" />
                  <span>Publishing Now...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{editingId ? "Update Blog Post" : "Submit / Save Blog Post"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
