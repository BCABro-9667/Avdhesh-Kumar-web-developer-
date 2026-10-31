import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  FileText,
  UploadCloud,
  Download,
  Share2,
  Check,
  Trash2,
  Edit3,
  Search,
  Eye,
  X,
  FileSpreadsheet,
  Image as ImageIcon,
  FileArchive,
  File,
  RefreshCw,
  FolderOpen,
  ArrowUpDown,
  ExternalLink,
  AlertCircle,
  LogIn,
} from "lucide-react";

export interface StoredDocument {
  _id: string;
  id?: string;
  title: string;
  originalName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  category: string;
  notes?: string;
  cloudinaryPublicId?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface AdminDocumentManagerProps {
  token: string;
}

const PRESET_CATEGORIES = [
  "Identity Card",
  "UP Police Homeguard",
  "Academic",
  "Certificates",
  "Resume",
  "Experience",
  "General",
];

export const AdminDocumentManager: React.FC<AdminDocumentManagerProps> = ({ token }) => {
  // Ensure token is always resolved from prop or localStorage
  const activeToken = useMemo(() => {
    return token || localStorage.getItem("admin_token") || localStorage.getItem("portfolio_admin_token") || "";
  }, [token]);

  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search, Filter, Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name_asc" | "name_desc" | "size_desc" | "size_asc">("newest");

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("General");
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [uploadNotes, setUploadNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Modal State
  const [editingDoc, setEditingDoc] = useState<StoredDocument | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete Confirmation Modal State
  const [docToDelete, setDocToDelete] = useState<StoredDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<StoredDocument | null>(null);

  // Clipboard Copied feedback map
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSessionExpired = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("portfolio_admin_token");
    localStorage.removeItem("admin_user");
    window.location.hash = "#admin";
    window.location.reload();
  };

  // Fetch Documents
  const fetchDocuments = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/documents", {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setIsAuthError(true);
          throw new Error("Your session has expired. Please sign in again.");
        }
        throw new Error("Failed to load documents");
      }

      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err: any) {
      console.error("Error fetching documents:", err);
      setError(err.message || "Failed to load documents");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [activeToken]);

  // Handle File Selection from device
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setSelectedFile(file);

    // Derive a clean default title from file name (strip extension for neatness)
    const originalName = file.name;
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    const cleanDefaultTitle = nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1);

    setUploadTitle(cleanDefaultTitle);
    setUploadCategory("General");
    setCustomCategoryInput("");
    setUploadNotes("");
    setUploadError(null);
    setIsAuthError(false);
    setIsUploadModalOpen(true);

    // Reset input value so re-selecting same file triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit Upload Modal
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const finalCategory = customCategoryInput.trim() || uploadCategory.trim() || "General";
    const finalTitle = uploadTitle.trim() || selectedFile.name;

    setIsUploading(true);
    setUploadError(null);
    setIsAuthError(false);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", finalTitle);
      formData.append("category", finalCategory);
      formData.append("notes", uploadNotes.trim());

      const res = await fetch("/api/admin/documents/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401 || res.status === 403 || data.error?.toLowerCase().includes("token")) {
          setIsAuthError(true);
          throw new Error(data.error || "Your admin session has expired. Please sign in again.");
        }
        throw new Error(data.error || "Failed to upload document");
      }

      // Add to list and close modal
      if (data.document) {
        setDocuments((prev) => [data.document, ...prev]);
      } else {
        await fetchDocuments();
      }

      setIsUploadModalOpen(false);
      setSelectedFile(null);
      showToast("Document uploaded successfully!");
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;

    setIsSavingEdit(true);
    setEditError(null);
    const docId = String(editingDoc._id || editingDoc.id || "");

    try {
      const res = await fetch(`/api/admin/documents/${docId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          category: editCategory.trim() || "General",
          notes: editNotes.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401 || res.status === 403 || data.error?.toLowerCase().includes("token")) {
          throw new Error("Your session has expired. Please sign in again.");
        }
        throw new Error(data.error || "Failed to update document");
      }

      setDocuments((prev) =>
        prev.map((d) => (String(d._id || d.id) === docId ? { ...d, ...data.document } : d))
      );
      setEditingDoc(null);
      showToast("Document updated successfully!");
    } catch (err: any) {
      setEditError(err.message || "Failed to update document");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!docToDelete) return;
    const docId = String(docToDelete._id || docToDelete.id || "");

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/documents/${docId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete document");

      setDocuments((prev) => prev.filter((d) => String(d._id || d.id) !== docId));
      if (previewDoc && String(previewDoc._id || previewDoc.id) === docId) {
        setPreviewDoc(null);
      }
      setDocToDelete(null);
      showToast("Document deleted successfully");
    } catch (err: any) {
      showToast(err.message || "Failed to delete document");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Share Link Copy
  const handleCopyLink = async (doc: StoredDocument) => {
    const docId = String(doc._id || doc.id || "");
    const url = doc.fileUrl.startsWith("http")
      ? doc.fileUrl
      : `${window.location.origin}${doc.fileUrl.startsWith("/") ? "" : "/"}${doc.fileUrl}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(docId);
      showToast("Link copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // Inline toast fallback instead of blocking prompt
      showToast("Link: " + url);
    }
  };

  // Handle Direct Download
  const handleDownload = (doc: StoredDocument) => {
    const link = document.createElement("a");
    link.href = doc.fileUrl;
    link.download = doc.originalName || `${doc.title}.pdf`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Download started");
  };

  // Helper: File Size Formatter
  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return "0 KB";
    const k = 1024;
    if (bytes < k) return `${bytes} B`;
    if (bytes < k * k) return `${(bytes / k).toFixed(1)} KB`;
    return `${(bytes / (k * k)).toFixed(2)} MB`;
  };

  // Helper: File Type Icon
  const getFileIcon = (fileType?: string, fileName?: string) => {
    const type = (fileType || "").toLowerCase();
    const name = (fileName || "").toLowerCase();

    if (type.includes("pdf") || name.endsWith(".pdf")) {
      return <FileText className="w-5 h-5 text-rose-500" />;
    }
    if (type.includes("image") || /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(name)) {
      return <ImageIcon className="w-5 h-5 text-amber-500" />;
    }
    if (type.includes("sheet") || type.includes("excel") || /\.(xlsx|xls|csv)$/i.test(name)) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
    }
    if (type.includes("zip") || type.includes("tar") || type.includes("compressed") || /\.(zip|rar|7z|tar|gz)$/i.test(name)) {
      return <FileArchive className="w-5 h-5 text-purple-500" />;
    }
    return <File className="w-5 h-5 text-stone-500" />;
  };

  // Compute Categories from documents list + preset list
  const allCategories = useMemo(() => {
    const set = new Set<string>(PRESET_CATEGORIES);
    documents.forEach((d) => {
      if (d.category) set.add(d.category);
    });
    return Array.from(set);
  }, [documents]);

  // Filtered & Sorted Documents
  const filteredDocuments = useMemo(() => {
    let result = [...documents];

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (d) => (d.category || "General").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.originalName.toLowerCase().includes(q) ||
          (d.category && d.category.toLowerCase().includes(q)) ||
          (d.notes && d.notes.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "name_asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "name_desc") {
        return b.title.localeCompare(a.title);
      }
      if (sortBy === "size_desc") {
        return (b.fileSize || 0) - (a.fileSize || 0);
      }
      if (sortBy === "size_asc") {
        return (a.fileSize || 0) - (b.fileSize || 0);
      }
      // default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [documents, selectedCategory, searchQuery, sortBy]);

  // Calculate quick stats
  const totalStorage = useMemo(() => {
    return documents.reduce((acc, d) => acc + (d.fileSize || 0), 0);
  }, [documents]);

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden file input triggered by Upload button */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png,.webp,.svg,.zip"
      />

      {/* Auth Error Banner if session was expired */}
      {isAuthError && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Your admin session has expired or requires renewal. Please re-authenticate.</span>
          </div>
          <button
            type="button"
            onClick={handleSessionExpired}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors cursor-pointer shrink-0"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In Again</span>
          </button>
        </div>
      )}

      {/* Top Banner & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200">
        <div>
          <h1 className="text-xl font-semibold text-stone-900 tracking-tight flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-stone-700" />
            Documents & Storage
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Store, view, download, and copy links to your official certificates, identity documents, and resumes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchDocuments(true)}
            disabled={refreshing}
            className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium cursor-pointer transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-stone-900" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Quick Overview Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">Total Documents</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{documents.length}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">Storage Utilized</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{formatFileSize(totalStorage)}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">Active Categories</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{allCategories.length}</div>
        </div>
      </div>

      {/* Search, Filter & Sort Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, original file name, or notes..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:border-stone-400 bg-stone-50/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-2.5 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:border-stone-400 bg-white text-stone-700 cursor-pointer"
            >
              <option value="newest">Newest Uploaded</option>
              <option value="oldest">Oldest First</option>
              <option value="name_asc">Name (A → Z)</option>
              <option value="name_desc">Name (Z → A)</option>
              <option value="size_desc">File Size (Largest)</option>
              <option value="size_asc">File Size (Smallest)</option>
            </select>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === "all"
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            All ({documents.length})
          </button>
          {allCategories.map((cat) => {
            const count = documents.filter((d) => (d.category || "General").toLowerCase() === cat.toLowerCase()).length;
            if (count === 0 && selectedCategory !== cat) return null;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Document List / Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl border border-stone-200 text-center">
          <RefreshCw className="w-5 h-5 text-stone-400 animate-spin mx-auto mb-2" />
          <div className="text-xs text-stone-500">Loading stored documents...</div>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-stone-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div className="text-sm font-semibold text-stone-800">No documents found</div>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== "all"
              ? "Try clearing your search query or choosing another category filter."
              : "Upload your first document (PDF, Image, Certificate, Resume) to store it securely."}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => {
            const docId = String(doc._id || doc.id || "");
            const isCopied = copiedId === docId;

            return (
              <div
                key={docId}
                className="bg-white rounded-xl border border-stone-200 p-4.5 flex flex-col justify-between hover:border-stone-300 transition-colors shadow-2xs"
              >
                <div className="space-y-3">
                  {/* Top Bar: Icon, Category Pill, Date */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                      {getFileIcon(doc.fileType, doc.originalName)}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                        {doc.category || "General"}
                      </span>
                    </div>
                  </div>

                  {/* Document Title & Original Name */}
                  <div>
                    <h3
                      className="text-sm font-semibold text-stone-900 line-clamp-2 hover:text-stone-700 cursor-pointer"
                      onClick={() => setPreviewDoc(doc)}
                      title={doc.title}
                    >
                      {doc.title}
                    </h3>
                    <div className="text-[11px] text-stone-400 font-mono truncate mt-0.5" title={doc.originalName}>
                      {doc.originalName}
                    </div>
                  </div>

                  {/* Notes / Remarks if present */}
                  {doc.notes && (
                    <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg border border-stone-150 line-clamp-2">
                      {doc.notes}
                    </p>
                  )}

                  {/* File Metadata Info */}
                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-100">
                    <span>{formatFileSize(doc.fileSize)}</span>
                    <span>
                      {new Date(doc.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3.5 mt-3 border-t border-stone-100 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    {/* 1. View / Preview */}
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="p-1.5 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                      title="View Document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* 2. Download */}
                    <button
                      type="button"
                      onClick={() => handleDownload(doc)}
                      className="p-1.5 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Download Document"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    {/* 3. Share Link / Copy */}
                    <button
                      type="button"
                      onClick={() => handleCopyLink(doc)}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                        isCopied
                          ? "bg-emerald-50 text-emerald-600"
                          : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                      }`}
                      title="Copy Public Link"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* 4. Edit Metadata */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDoc(doc);
                        setEditTitle(doc.title);
                        setEditCategory(doc.category || "General");
                        setEditNotes(doc.notes || "");
                        setEditError(null);
                      }}
                      className="p-1.5 rounded-md text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Edit Document Info"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* 5. Delete */}
                    <button
                      type="button"
                      onClick={() => setDocToDelete(doc)}
                      className="p-1.5 rounded-md text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. UPLOAD MODAL (Shown immediately after selecting file) */}
      {/* ======================================================== */}
      {isUploadModalOpen && selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-stone-200 w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">Upload & Save Document</h3>
                  <div className="text-[11px] text-stone-500">Edit name and assign category before saving</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isUploading) {
                    setIsUploadModalOpen(false);
                    setSelectedFile(null);
                  }
                }}
                className="p-1 rounded-md text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4">
              {/* Selected File Details Badge */}
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-md bg-white border border-stone-200 flex items-center justify-center shrink-0">
                    {getFileIcon(selectedFile.type, selectedFile.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-stone-800 truncate" title={selectedFile.name}>
                      {selectedFile.name}
                    </div>
                    <div className="text-[11px] text-stone-400">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type || "Document"}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] text-stone-600 font-medium hover:underline shrink-0 pl-2 cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* Document Title / Name (User can change) */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-700 block">
                  Document Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. BCA Degree Certificate or Aadhaar Card"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:border-stone-400"
                />
                <div className="text-[10px] text-stone-400">
                  Original file: <span className="font-mono">{selectedFile.name}</span>
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-700 block">
                  Category
                </label>

                {/* Quick Selection Buttons */}
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {PRESET_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setUploadCategory(cat);
                        setCustomCategoryInput("");
                      }}
                      className={`px-2.5 py-1 text-[11px] rounded-md transition-colors cursor-pointer border ${
                        uploadCategory === cat && !customCategoryInput
                          ? "bg-stone-900 text-white border-stone-900 font-medium"
                          : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Or Custom Category Input */}
                <input
                  type="text"
                  value={customCategoryInput}
                  onChange={(e) => {
                    setCustomCategoryInput(e.target.value);
                    if (e.target.value) setUploadCategory(e.target.value);
                  }}
                  placeholder="Or enter a custom category..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:border-stone-400 bg-stone-50/50"
                />
              </div>

              {/* Optional Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-700 block">
                  Notes / Description <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="e.g. Issued on 18 Nov, 2026. Required for official records."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:border-stone-400 resize-none"
                />
              </div>

              {/* Inline Upload Error / Auth Error Banner */}
              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{uploadError}</span>
                  </div>
                  {isAuthError && (
                    <button
                      type="button"
                      onClick={handleSessionExpired}
                      className="self-start px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Sign In Again
                    </button>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setSelectedFile(null);
                  }}
                  className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !uploadTitle.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-50 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Save & Upload</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. EDIT METADATA MODAL */}
      {/* ======================================================== */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-stone-200 w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-900">Edit Document Information</h3>
              <button
                type="button"
                onClick={() => setEditingDoc(null)}
                className="p-1 rounded-md text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-700 block">Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:border-stone-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-700 block">Category</label>
                <div className="flex flex-wrap gap-1 pb-1">
                  {PRESET_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setEditCategory(cat)}
                      className={`px-2 py-0.5 text-[11px] rounded-md border transition-colors cursor-pointer ${
                        editCategory === cat
                          ? "bg-stone-900 text-white border-stone-900 font-medium"
                          : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  placeholder="Category"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:border-stone-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-700 block">Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:border-stone-400 resize-none"
                />
              </div>

              {editError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{editError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit || !editTitle.trim()}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                >
                  {isSavingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. IN-APP DELETE CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {docToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-stone-200 w-full max-w-sm shadow-xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900">Delete Document?</h3>
                <p className="text-xs text-stone-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-xs text-stone-700 truncate">
              {docToDelete.title}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDocToDelete(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. DOCUMENT PREVIEW MODAL */}
      {/* ======================================================== */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-stone-200 w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between shrink-0 bg-stone-50">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-md bg-white border border-stone-200 flex items-center justify-center shrink-0">
                  {getFileIcon(previewDoc.fileType, previewDoc.originalName)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold text-stone-900 truncate" title={previewDoc.title}>
                    {previewDoc.title}
                  </h3>
                  <div className="text-[10px] text-stone-400 font-mono truncate">
                    {previewDoc.originalName} • {formatFileSize(previewDoc.fileSize)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopyLink(previewDoc)}
                  className="p-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  title="Copy Direct Link"
                >
                  {copiedId === (previewDoc._id || previewDoc.id) ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline text-[11px]">
                    {copiedId === (previewDoc._id || previewDoc.id) ? "Copied" : "Share"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload(previewDoc)}
                  className="p-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Download</span>
                </button>

                <a
                  href={previewDoc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs flex items-center gap-1 transition-colors"
                  title="Open in new window"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body Preview Viewer */}
            <div className="flex-1 bg-stone-100/70 p-2 sm:p-4 overflow-hidden flex items-center justify-center">
              {previewDoc.fileType.includes("image") || /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(previewDoc.originalName) ? (
                <div className="w-full h-full flex items-center justify-center overflow-auto p-2">
                  <img
                    src={previewDoc.fileUrl}
                    alt={previewDoc.title}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                  />
                </div>
              ) : previewDoc.fileType.includes("pdf") || previewDoc.originalName.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={`${previewDoc.fileUrl}#toolbar=1`}
                  title={previewDoc.title}
                  className="w-full h-full rounded-lg border border-stone-200 bg-white"
                />
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-stone-200 max-w-md text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-500">
                    {getFileIcon(previewDoc.fileType, previewDoc.originalName)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900">{previewDoc.title}</h4>
                    <p className="text-xs text-stone-500 mt-1">
                      Direct in-browser preview is not available for this file type. You can download or open it in a new tab.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownload(previewDoc)}
                      className="px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      Download File
                    </button>
                    <a
                      href={previewDoc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-50 transition-colors"
                    >
                      Open in New Tab
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
