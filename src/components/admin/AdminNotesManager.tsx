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
  Clock,
  Copy,
  Check,
  Maximize2
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
  { name: "White", hex: "#FFFFFF", border: "#E7E5E4" },
  { name: "Yellow", hex: "#FEFCE8", border: "#FEF08A" },
  { name: "Lime", hex: "#F7FEE7", border: "#D9F99D" },
  { name: "Sky", hex: "#F0F9FF", border: "#BAE6FD" },
  { name: "Purple", hex: "#FAF5FF", border: "#E9D5FF" },
  { name: "Rose", hex: "#FFF1F2", border: "#FECDD3" },
];

const NOTE_CATEGORIES = [
  "General",
  "Engineering Ideas",
  "UP Police Homeguard",
  "Research",
  "MCA Studies",
  "Snippets",
];

function htmlToPlainText(html: string): string {
  if (!html) return "";
  try {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  } catch {
    return html.replace(/<[^>]+>/g, "");
  }
}

export const AdminNotesManager: React.FC<AdminNotesManagerProps> = ({ token }) => {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [onlyPinned, setOnlyPinned] = useState(false);

  // View Mode: "list" | "create" | "edit"
  const [viewMode, setViewMode] = useState<"list" | "create" | "edit">("list");
  const [activeNote, setActiveNote] = useState<NoteItem | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [tagsInput, setTagsInput] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [color, setColor] = useState("#FFFFFF");
  const [isSaving, setIsSaving] = useState(false);

  // Preview Modal
  const [previewNote, setPreviewNote] = useState<NoteItem | null>(null);

  // Copied state for feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const handleCopyNote = async (note: NoteItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const id = note._id || note.id || "note";
    const bodyText = htmlToPlainText(note.content || "");
    const header = note.title || "Untitled Note";
    const meta = [
      note.category ? `Category: ${note.category}` : null,
      note.tags && note.tags.length > 0 ? `Tags: ${note.tags.join(", ")}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    const text = `${header}\n${meta ? meta + "\n" : ""}----------------------------------------\n\n${bodyText}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy note:", err);
    }
  };

  const openCreateNote = () => {
    setActiveNote(null);
    setTitle("");
    setContent("");
    setCategory("General");
    setTagsInput("");
    setIsPinned(false);
    setColor("#FFFFFF");
    setViewMode("create");
  };

  const openEditNote = (note: NoteItem) => {
    setActiveNote(note);
    setTitle(note.title || "");
    setContent(note.content || "");
    setCategory(note.category || "General");
    setTagsInput(Array.isArray(note.tags) ? note.tags.join(", ") : "");
    setIsPinned(Boolean(note.isPinned));
    setColor(note.color || "#FFFFFF");
    setViewMode("edit");
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) {
      alert("Please enter a title or note content.");
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
        if (!res.ok) throw new Error("Failed to save note");
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
    } catch (err: any) {
      alert(err.message || "Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePin = async (note: NoteItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const id = note._id || note.id;
    const nextPin = !note.isPinned;

    setNotes((prev) =>
      prev.map((n) => (n._id === id || n.id === id ? { ...n, isPinned: nextPin } : n))
    );

    try {
      await fetch(`/api/admin/notes/${id}/pin`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPinned: nextPin }),
      });
    } catch {
      fetchNotes();
    }
  };

  const handleDeleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this note?")) return;

    setNotes((prev) => prev.filter((n) => n._id !== id && n.id !== id));
    if (previewNote && (previewNote._id === id || previewNote.id === id)) {
      setPreviewNote(null);
    }

    try {
      await fetch(`/api/admin/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      fetchNotes();
    }
  };

  const filteredNotes = notes.filter((n) => {
    if (onlyPinned && !n.isPinned) return false;
    if (selectedCategory !== "all" && n.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (n.title || "").toLowerCase().includes(q);
      const matchContent = (n.content || "").toLowerCase().includes(q);
      const matchCat = (n.category || "").toLowerCase().includes(q);
      const matchTags = Array.isArray(n.tags) && n.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchCat && !matchTags) return false;
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">Notes & Docs</h1>
          <p className="text-xs text-stone-500 mt-0.5">Rich formatted notes, snippets, and documentation</p>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === "list" ? (
            <button
              onClick={openCreateNote}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Note</span>
            </button>
          ) : (
            <button
              onClick={() => setViewMode("list")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <button
            onClick={fetchNotes}
            className="p-1.5 bg-white border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 cursor-pointer shadow-xs"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-stone-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* VIEW: CREATE / EDIT NOTE */}
      {viewMode !== "list" ? (
        <form onSubmit={handleSaveNote} className="space-y-4">
          <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2 font-semibold text-sm text-stone-900">
                <Edit3 className="w-4 h-4 text-stone-700" />
                <span>{viewMode === "create" ? "New Note" : "Edit Note"}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPinned(!isPinned)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                    isPinned ? "bg-amber-50 border-amber-300 text-amber-800" : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <Pin className={`w-3 h-3 ${isPinned ? "fill-current" : ""}`} />
                  <span>{isPinned ? "Pinned" : "Pin"}</span>
                </button>

                {/* Color swatches */}
                <div className="flex items-center gap-1 p-1 bg-stone-50 border border-stone-200 rounded-lg">
                  {NOTE_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setColor(c.hex)}
                      className={`w-4 h-4 rounded-full border transition-transform cursor-pointer ${
                        color === c.hex ? "scale-125 ring-2 ring-stone-900" : "opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c.hex, borderColor: c.border }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-base font-semibold text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-stone-400"
              />
            </div>

            {/* Category & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  list="notes-categories-list"
                  placeholder="Category..."
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:bg-white"
                />
                <datalist id="notes-categories-list">
                  {NOTE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Tags (comma separated)..."
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            {/* Editor */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">Content</label>
              <div className="border border-stone-200 rounded-lg overflow-hidden">
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write note..."
                  height={380}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="px-3.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Note"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* VIEW: LIST OF NOTES */
        <>
          {/* Filter Bar */}
          <div className="p-3 bg-white border border-stone-200 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {NOTE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setOnlyPinned(!onlyPinned)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  onlyPinned
                    ? "bg-amber-50 border-amber-300 text-amber-800"
                    : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                }`}
              >
                <Pin className="w-3 h-3" />
                <span>Pinned</span>
              </button>
            </div>
          </div>

          {/* Notes Grid */}
          {loading ? (
            <div className="text-center py-12 p-6 bg-white border border-stone-200 rounded-xl shadow-xs">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-stone-400 mb-2" />
              <p className="text-xs text-stone-500">Loading notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-12 p-6 bg-white border border-stone-200 rounded-xl shadow-xs">
              <StickyNote className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-stone-800">No notes found</h3>
              <p className="text-xs text-stone-500 mt-0.5">Click "New Note" above to write one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredNotes.map((note) => {
                const id = note._id || note.id || "";
                const noteBg = note.color || "#FFFFFF";
                const isCopied = copiedId === id;
                const plainText = htmlToPlainText(note.content || "");

                return (
                  <div
                    key={id}
                    onClick={() => setPreviewNote(note)}
                    className="p-4 rounded-xl border border-stone-200/90 hover:border-stone-300 transition-all flex flex-col justify-between cursor-pointer group shadow-xs relative"
                    style={{ backgroundColor: noteBg }}
                  >
                    <div>
                      {/* Top Bar with Pin, Category, Copy & Actions */}
                      <div className="flex items-center justify-between gap-1.5 mb-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-stone-100/90 border border-stone-200 text-[10px] font-medium text-stone-700">
                          {note.category || "General"}
                        </span>

                        <div className="flex items-center gap-1">
                          {/* COPY WHOLE NOTE BUTTON */}
                          <button
                            type="button"
                            onClick={(e) => handleCopyNote(note, e)}
                            className={`p-1 rounded-md border text-xs transition-colors cursor-pointer ${
                              isCopied
                                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                                : "bg-white/80 border-stone-200 text-stone-600 hover:bg-white hover:text-stone-900"
                            }`}
                            title="Copy whole note"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleTogglePin(note, e)}
                            className={`p-1 rounded-md border transition-colors cursor-pointer ${
                              note.isPinned
                                ? "bg-amber-50 border-amber-300 text-amber-700"
                                : "bg-white/80 border-stone-200 text-stone-400 hover:text-stone-700"
                            }`}
                            title={note.isPinned ? "Unpin" : "Pin"}
                          >
                            <Pin className={`w-3.5 h-3.5 ${note.isPinned ? "fill-current" : ""}`} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditNote(note);
                            }}
                            className="p-1 rounded-md bg-white/80 border border-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteNote(id, e)}
                            className="p-1 rounded-md bg-white/80 border border-stone-200 text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-sm text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1">
                        {note.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs text-stone-600 mt-1.5 line-clamp-3 leading-relaxed">
                        {plainText || "Empty note"}
                      </p>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="pt-3 mt-3 border-t border-stone-200/70 flex items-center justify-between gap-2 text-[10px] text-stone-400">
                      <div className="flex flex-wrap items-center gap-1">
                        {Array.isArray(note.tags) &&
                          note.tags.slice(0, 2).map((t) => (
                            <span key={t} className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                              #{t}
                            </span>
                          ))}
                      </div>

                      <div className="flex items-center gap-1">
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

      {/* Read Preview Modal - Clean Flat */}
      {previewNote && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div
            className="border border-stone-200 rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden bg-white"
            style={{ backgroundColor: previewNote.color || "#FFFFFF" }}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between gap-3 shrink-0 bg-white/80">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-stone-100 text-[10px] font-medium text-stone-700">
                  {previewNote.category || "General"}
                </span>
                {previewNote.isPinned && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-[10px] font-medium text-amber-700 flex items-center gap-1 border border-amber-200">
                    <Pin className="w-2.5 h-2.5 fill-current" />
                    Pinned
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Copy whole note button inside modal */}
                <button
                  type="button"
                  onClick={() => handleCopyNote(previewNote)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-stone-700 bg-stone-50 border border-stone-200 rounded-lg hover:bg-stone-100 cursor-pointer"
                  title="Copy whole note"
                >
                  {copiedId === (previewNote._id || previewNote.id) ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Note</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const noteToEdit = previewNote;
                    setPreviewNote(null);
                    openEditNote(noteToEdit);
                  }}
                  className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 cursor-pointer"
                  title="Edit note"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewNote(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <h2 className="text-lg font-bold text-stone-900">{previewNote.title}</h2>

              {previewNote.content ? (
                <div
                  className="text-sm text-stone-700 leading-relaxed space-y-2 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewNote.content }}
                />
              ) : (
                <p className="text-xs text-stone-400 italic">No content in this note.</p>
              )}

              {Array.isArray(previewNote.tags) && previewNote.tags.length > 0 && (
                <div className="pt-3 border-t border-stone-200 flex flex-wrap gap-1">
                  {previewNote.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-stone-100 text-xs text-stone-600">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
