import React, { useState, useEffect } from "react";
import {
  StickyNote,
  Plus,
  Trash2,
  Edit3,
  Pin,
  Search,
  Tag,
  FolderTree,
  Calendar,
  CheckCircle2,
  RefreshCw,
  X,
  FileText,
  Sparkles,
  Maximize2,
  Clock,
  Palette,
  ExternalLink
} from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";

export interface NoteItem {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  isPinned: boolean;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AdminNotesManagerProps {
  token: string;
}

const NOTE_COLORS = [
  { name: "Cream", hex: "#FFFDF5", border: "#141413" },
  { name: "Post-it Yellow", hex: "#FEF9C3", border: "#CA8A04" },
  { name: "Soft Lime", hex: "#F7FEE7", border: "#65A30D" },
  { name: "Sky Blue", hex: "#EFF6FF", border: "#2563EB" },
  { name: "Lavender", hex: "#FAF5FF", border: "#9333EA" },
  { name: "Peach Rose", hex: "#FFF1F2", border: "#E11D48" },
];

const NOTE_CATEGORIES = [
  "General",
  "Engineering Ideas",
  "UP Police Homeguard Duties",
  "Research & Architecture",
  "MCA College Notes",
  "Cheat Sheets & Snippets",
];

export const AdminNotesManager: React.FC<AdminNotesManagerProps> = ({ token }) => {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [onlyPinned, setOnlyPinned] = useState(false);

  // Editor View Mode: "list" | "create" | "edit"
  const [viewMode, setViewMode] = useState<"list" | "create" | "edit">("list");
  const [activeNote, setActiveNote] = useState<NoteItem | null>(null);

  // Form states for creating / editing
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [tagsInput, setTagsInput] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [color, setColor] = useState("#FFFDF5");
  const [isSaving, setIsSaving] = useState(false);

  // Read preview modal
  const [previewNote, setPreviewNote] = useState<NoteItem | null>(null);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to load notes");
      const data = await res.json();
      setNotes(data || []);
    } catch (err: any) {
      console.error("Fetch notes error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const openCreateNote = () => {
    setActiveNote(null);
    setTitle("");
    setContent("");
    setCategory("General");
    setTagsInput("");
    setIsPinned(false);
    setColor("#FFFDF5");
    setViewMode("create");
  };

  const openEditNote = (note: NoteItem) => {
    setActiveNote(note);
    setTitle(note.title || "");
    setContent(note.content || "");
    setCategory(note.category || "General");
    setTagsInput(Array.isArray(note.tags) ? note.tags.join(", ") : "");
    setIsPinned(Boolean(note.isPinned));
    setColor(note.color || "#FFFDF5");
    setViewMode("edit");
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) {
      alert("Please enter either a title or note content.");
      return;
    }

    setIsSaving(true);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim() || "Untitled Note",
      content,
      category,
      tags,
      isPinned,
      color,
    };

    try {
      if (viewMode === "create") {
        const res = await fetch("/api/admin/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to save new note");
        const data = await res.json();
        if (data.note) {
          setNotes((prev) => [data.note, ...prev]);
        }
      } else if (viewMode === "edit" && activeNote) {
        const id = activeNote._id || activeNote.id;
        const res = await fetch(`/api/admin/notes/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update note");
        const data = await res.json();
        if (data.note) {
          setNotes((prev) => prev.map((n) => (n._id === id || n.id === id ? data.note : n)));
        }
      }
      setViewMode("list");
      setActiveNote(null);
    } catch (err: any) {
      alert(err.message || "Could not save note");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    setNotes((prev) => prev.filter((n) => n._id !== id && n.id !== id));
    if (previewNote && (previewNote._id === id || previewNote.id === id)) {
      setPreviewNote(null);
    }
    if (activeNote && (activeNote._id === id || activeNote.id === id)) {
      setViewMode("list");
      setActiveNote(null);
    }

    try {
      await fetch(`/api/admin/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      fetchNotes();
    }
  };

  const handleTogglePin = async (note: NoteItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const id = note._id || note.id;
    const nextPinned = !note.isPinned;

    setNotes((prev) =>
      prev.map((n) => (n._id === id || n.id === id ? { ...n, isPinned: nextPinned } : n))
    );

    try {
      await fetch(`/api/admin/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPinned: nextPinned }),
      });
    } catch (err) {
      fetchNotes();
    }
  };

  const filteredNotes = notes.filter((n) => {
    if (onlyPinned && !n.isPinned) return false;
    if (selectedCategory !== "all" && (n.category || "General").toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (n.title || "").toLowerCase().includes(q);
      const matchContent = (n.content || "").toLowerCase().includes(q);
      const matchTags = Array.isArray(n.tags) && n.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTags) return false;
    }
    return true;
  });

  // Strip html tags for card snippet preview
  const getExcerpt = (html: string, maxLength: number = 160) => {
    const text = html.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#FAF8F2] border-2 border-[#141413] shadow-[4px_4px_0px_#141413] rounded-2xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#D4F050] border-2 border-[#141413] shadow-[2px_2px_0px_#141413] flex items-center justify-center text-[#141413]">
            <StickyNote className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl text-[#141413] tracking-tight">
              Rich Notes & Knowledge Base
            </h1>
            <p className="font-mono text-xs text-[#6B6862]">
              Full rich-text editor with bold, italic, bullets, numbering, images, code & tables
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === "list" ? (
            <button
              onClick={openCreateNote}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#D4F050] border-2 border-[#141413] rounded-xl font-mono text-xs font-bold text-[#141413] shadow-[2px_2px_0px_#141413] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>
          ) : (
            <button
              onClick={() => setViewMode("list")}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border-2 border-[#141413] rounded-xl font-mono text-xs font-bold text-[#141413] shadow-[2px_2px_0px_#141413] hover:bg-[#FAF8F2] cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Back to Notes</span>
            </button>
          )}

          <button
            onClick={fetchNotes}
            className="p-2 bg-white border-2 border-[#141413] rounded-xl text-[#141413] shadow-[2px_2px_0px_#141413] hover:bg-[#D4F050] transition-colors cursor-pointer"
            title="Refresh notes"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* VIEW: CREATE / EDIT NOTE */}
      {viewMode !== "list" ? (
        <form onSubmit={handleSaveNote} className="space-y-6">
          <div className="p-6 bg-white border-2 border-[#141413] rounded-2xl shadow-[5px_5px_0px_#141413] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#141413]/10 pb-4">
              <div className="flex items-center gap-2 font-display font-bold text-lg text-[#141413]">
                <Edit3 className="w-5 h-5 text-[#141413]" />
                <span>{viewMode === "create" ? "Compose New Note" : "Edit Note"}</span>
              </div>

              {/* Pin toggle & Color selection */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPinned(!isPinned)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[#141413] font-mono text-xs font-bold transition-all cursor-pointer ${
                    isPinned ? "bg-[#D4F050] text-[#141413] shadow-[2px_2px_0px_#141413]" : "bg-white text-[#6B6862]"
                  }`}
                >
                  <Pin className={`w-3.5 h-3.5 ${isPinned ? "fill-current" : ""}`} />
                  <span>{isPinned ? "Pinned to Top" : "Pin Note"}</span>
                </button>

                {/* Color swatches */}
                <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F2] border-2 border-[#141413] rounded-xl">
                  {NOTE_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setColor(c.hex)}
                      className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer ${
                        color === c.hex ? "scale-110 ring-2 ring-[#141413]" : "opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c.hex, borderColor: c.border }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Title input */}
            <div>
              <label className="block font-mono text-xs font-bold text-[#141413] uppercase mb-1.5">
                Note Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your note a title (e.g., UP Police Homeguard Duty Checklist, React Performance Notes)..."
                className="w-full px-4 py-3 bg-[#FAF8F2] border-2 border-[#141413] rounded-xl font-display font-bold text-lg text-[#141413] placeholder-[#9E9A91] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4F050]"
              />
            </div>

            {/* Category & Tags Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs font-bold text-[#141413] uppercase mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  list="notes-categories-list"
                  placeholder="Select or type a category..."
                  className="w-full px-3.5 py-2 bg-[#FAF8F2] border-2 border-[#141413] rounded-xl font-body text-sm text-[#141413] focus:outline-none focus:bg-white"
                />
                <datalist id="notes-categories-list">
                  {NOTE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block font-mono text-xs font-bold text-[#141413] uppercase mb-1.5">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g., police, routine, react, algorithm"
                  className="w-full px-3.5 py-2 bg-[#FAF8F2] border-2 border-[#141413] rounded-xl font-body text-sm text-[#141413] focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            {/* Rich Text Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-mono text-xs font-bold text-[#141413] uppercase">
                  Note Content & Formatting
                </label>
                <span className="font-mono text-[11px] text-[#6B6862]">
                  Toolbar includes Bold, Italic, Bullets, Numbering, Images, Links, Tables & Headings
                </span>
              </div>
              <div className="border-2 border-[#141413] rounded-2xl overflow-hidden shadow-[2px_2px_0px_#141413]">
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your detailed note here with bold formatting, bullet points, numbers, embedded images or tables..."
                  height={450}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#141413]/10">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="px-5 py-2.5 bg-[#FAF8F2] border-2 border-[#141413] rounded-xl font-mono text-xs font-bold text-[#141413] hover:bg-black/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#D4F050] border-2 border-[#141413] rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-[#141413] shadow-[2px_2px_0px_#141413] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? "Saving Note..." : "Save Note"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* VIEW: LIST OF NOTES */
        <>
          {/* Filter & Search Bar */}
          <div className="p-4 bg-[#FAF8F2] border-2 border-[#141413] rounded-2xl shadow-[3px_3px_0px_#141413] flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9A91]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by title, text, or tag..."
                className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#141413] rounded-xl font-body text-xs text-[#141413] placeholder-[#9E9A91] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-white border-2 border-[#141413] rounded-xl font-mono text-xs text-[#141413] focus:outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {NOTE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setOnlyPinned(!onlyPinned)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-[#141413] font-mono text-xs font-bold transition-all cursor-pointer ${
                  onlyPinned
                    ? "bg-[#D4F050] text-[#141413] shadow-[2px_2px_0px_#141413]"
                    : "bg-white text-[#6B6862]"
                }`}
              >
                <Pin className={`w-3.5 h-3.5 ${onlyPinned ? "fill-current" : ""}`} />
                <span>Pinned Only</span>
              </button>
            </div>
          </div>

          {/* Notes Grid */}
          {loading ? (
            <div className="text-center py-16 p-8 bg-white border-2 border-[#141413] rounded-2xl shadow-[4px_4px_0px_#141413]">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#6B6862] mb-3" />
              <p className="font-mono text-sm text-[#6B6862]">Loading notes from server...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-16 p-8 bg-white border-2 border-[#141413] rounded-2xl shadow-[4px_4px_0px_#141413]">
              <StickyNote className="w-12 h-12 text-[#D4F050] mx-auto mb-3" />
              <h3 className="font-display font-bold text-lg text-[#141413]">No notes found</h3>
              <p className="font-mono text-xs text-[#6B6862] mt-1 mb-4">
                Capture thoughts, guidelines, codes, or task notes with rich formatting.
              </p>
              <button
                onClick={openCreateNote}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#D4F050] border-2 border-[#141413] rounded-xl font-mono text-xs font-bold text-[#141413] shadow-[2px_2px_0px_#141413] hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Note</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredNotes.map((note) => {
                const id = note._id || note.id || "";
                const noteBg = note.color || "#FFFDF5";

                return (
                  <div
                    key={id}
                    onClick={() => setPreviewNote(note)}
                    className="p-5 rounded-2xl border-2 border-[#141413] shadow-[4px_4px_0px_#141413] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between cursor-pointer group relative"
                    style={{ backgroundColor: noteBg }}
                  >
                    <div>
                      {/* Top Bar with Pin & Category */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded-full bg-white/80 border border-[#141413]/30 font-mono text-[10px] font-bold text-[#141413] uppercase tracking-wider">
                          {note.category || "General"}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => handleTogglePin(note, e)}
                            className={`p-1 rounded-lg border border-[#141413]/30 transition-colors cursor-pointer ${
                              note.isPinned
                                ? "bg-[#D4F050] text-[#141413]"
                                : "bg-white/70 text-[#6B6862] hover:bg-white"
                            }`}
                            title={note.isPinned ? "Unpin note" : "Pin note"}
                          >
                            <Pin className={`w-3.5 h-3.5 ${note.isPinned ? "fill-current" : ""}`} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditNote(note);
                            }}
                            className="p-1 rounded-lg bg-white/70 border border-[#141413]/30 text-[#141413] hover:bg-white transition-colors cursor-pointer"
                            title="Edit note"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteNote(id, e)}
                            className="p-1 rounded-lg bg-white/70 border border-[#141413]/30 text-[#EF4444] hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-bold text-base text-[#141413] group-hover:text-[#047857] transition-colors line-clamp-2">
                        {note.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="font-body text-xs text-[#6B6862] mt-2 line-clamp-4 leading-relaxed">
                        {getExcerpt(note.content, 180)}
                      </p>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="pt-4 mt-4 border-t border-[#141413]/10 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1">
                        {Array.isArray(note.tags) &&
                          note.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 rounded bg-black/5 font-mono text-[9px] text-[#141413]"
                            >
                              #{tag}
                            </span>
                          ))}
                      </div>

                      <div className="font-mono text-[10px] text-[#6B6862] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {note.updatedAt
                            ? new Date(note.updatedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "Recent"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* READ PREVIEW MODAL */}
      {previewNote && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div
            className="border-2 border-[#141413] rounded-2xl shadow-[6px_6px_0px_#141413] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
            style={{ backgroundColor: previewNote.color || "#FFFDF5" }}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-[#141413]/15 flex items-center justify-between gap-3 shrink-0 bg-white/60">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#141413] text-[#F5F2EA] font-mono text-[10px] font-bold uppercase tracking-wider">
                    {previewNote.category || "General"}
                  </span>
                  {previewNote.isPinned && (
                    <span className="px-2 py-0.5 rounded-full bg-[#D4F050] text-[#141413] font-mono text-[10px] font-bold flex items-center gap-1">
                      <Pin className="w-3 h-3 fill-current" />
                      Pinned
                    </span>
                  )}
                </div>
                <h2 className="font-display font-black text-xl text-[#141413] truncate">
                  {previewNote.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const n = previewNote;
                    setPreviewNote(null);
                    openEditNote(n);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border-2 border-[#141413] font-mono text-xs font-bold text-[#141413] hover:bg-[#D4F050] transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewNote(null)}
                  className="p-1.5 rounded-xl bg-white border-2 border-[#141413] text-[#6B6862] hover:text-[#141413] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Formatted Content */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 font-body text-base text-[#141413] leading-relaxed bg-white">
              <div
                className="rich-theme-content prose max-w-none text-[#141413]"
                dangerouslySetInnerHTML={{ __html: previewNote.content || "<em>No content provided</em>" }}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#141413]/15 flex items-center justify-between text-[#6B6862] font-mono text-xs bg-white/80 shrink-0">
              <div className="flex items-center gap-1.5">
                {Array.isArray(previewNote.tags) && previewNote.tags.length > 0 && (
                  <span>Tags: {previewNote.tags.join(", ")}</span>
                )}
              </div>
              <div>
                Last edited:{" "}
                {previewNote.updatedAt
                  ? new Date(previewNote.updatedAt).toLocaleString()
                  : "Recently"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
