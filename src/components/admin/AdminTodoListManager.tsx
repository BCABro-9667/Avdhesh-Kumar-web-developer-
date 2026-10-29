import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  AlertCircle,
  Tag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  FolderPlus,
  X,
  ListTodo,
  Copy,
  Check
} from "lucide-react";

export interface TodoItem {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: string | null;
  category: string;
  completedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface AdminTodoListManagerProps {
  token: string;
}

const CATEGORIES = ["General", "Development", "UP Police Homeguard", "MCA Studies", "Portfolio", "Personal"];

export const AdminTodoListManager: React.FC<AdminTodoListManagerProps> = ({ token }) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Quick add input
  const [quickTitle, setQuickTitle] = useState("");
  const [quickPriority, setQuickPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [quickCategory, setQuickCategory] = useState("General");
  const [quickDueDate, setQuickDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit modal state
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);

  // Copied state for feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch todos
  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to load tasks");
      const data = await res.json();
      setTodos(data.todos || []);
    } catch (err: any) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Copy whole task content to clipboard
  const handleCopyTodo = async (todo: TodoItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const id = todo._id || todo.id || "todo";
    const lines = [
      `Task: ${todo.title}`,
      `Status: ${todo.status.replace("-", " ")}`,
      `Priority: ${todo.priority}`,
      `Category: ${todo.category || "General"}`,
    ];
    if (todo.dueDate) {
      lines.push(`Due Date: ${new Date(todo.dueDate).toLocaleDateString()}`);
    }
    if (todo.description?.trim()) {
      lines.push(`\nDescription:\n${todo.description.trim()}`);
    }
    const textToCopy = lines.join("\n");
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy todo:", err);
    }
  };

  // Create new task
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: quickTitle.trim(),
          priority: quickPriority,
          category: quickCategory,
          dueDate: quickDueDate || null,
          status: "pending",
        }),
      });

      if (!res.ok) throw new Error("Failed to add task");
      const data = await res.json();
      if (data.todo) {
        setTodos((prev) => [data.todo, ...prev]);
        setQuickTitle("");
        setQuickDueDate("");
      }
    } catch (err: any) {
      alert(err.message || "Could not save task");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle status
  const handleToggleStatus = async (todo: TodoItem) => {
    const nextStatus = todo.status === "completed" ? "pending" : "completed";
    const id = todo._id || todo.id;

    // Optimistic UI update
    setTodos((prev) =>
      prev.map((t) => (t._id === id || t.id === id ? { ...t, status: nextStatus } : t))
    );

    try {
      await fetch(`/api/admin/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });
    } catch (e) {
      fetchTodos();
    }
  };

  // Update existing task
  const handleUpdateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTodo) return;
    const id = editingTodo._id || editingTodo.id;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editingTodo.title.trim(),
          description: editingTodo.description || "",
          status: editingTodo.status,
          priority: editingTodo.priority,
          category: editingTodo.category || "General",
          dueDate: editingTodo.dueDate || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to update task");
      const data = await res.json();
      if (data.todo) {
        setTodos((prev) => prev.map((t) => (t._id === id || t.id === id ? data.todo : t)));
        setEditingTodo(null);
      }
    } catch (err: any) {
      alert(err.message || "Could not update task");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete task
  const handleDeleteTodo = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Delete this task?")) return;

    // Optimistic removal
    setTodos((prev) => prev.filter((t) => t._id !== id && t.id !== id));

    try {
      await fetch(`/api/admin/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      fetchTodos();
    }
  };

  // Filtered todos
  const filteredTodos = todos.filter((todo) => {
    if (filterStatus !== "all" && todo.status !== filterStatus) return false;
    if (filterPriority !== "all" && todo.priority !== filterPriority) return false;
    if (filterCategory !== "all" && todo.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = todo.title.toLowerCase().includes(q);
      const matchDesc = (todo.description || "").toLowerCase().includes(q);
      const matchCat = (todo.category || "").toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }
    return true;
  });

  const totalCount = todos.length;
  const pendingCount = todos.filter((t) => t.status === "pending").length;
  const inProgressCount = todos.filter((t) => t.status === "in-progress").length;
  const completedCount = todos.filter((t) => t.status === "completed").length;

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "high":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "medium":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "low":
        return "bg-stone-50 text-stone-600 border-stone-200";
      default:
        return "bg-stone-50 text-stone-600 border-stone-200";
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">Todo Tasks</h1>
          <p className="text-xs text-stone-500 mt-0.5">Organize and track your daily work and assignments</p>
        </div>

        <button
          onClick={fetchTodos}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer shadow-xs"
          title="Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-stone-400" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Flat Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white border border-stone-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-medium text-stone-500 uppercase">Total</div>
          <div className="text-xl font-bold text-stone-900 mt-0.5">{totalCount}</div>
        </div>
        <div className="p-3.5 bg-white border border-stone-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-medium text-amber-600 uppercase">Pending</div>
          <div className="text-xl font-bold text-amber-700 mt-0.5">{pendingCount}</div>
        </div>
        <div className="p-3.5 bg-white border border-stone-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-medium text-sky-600 uppercase">In Progress</div>
          <div className="text-xl font-bold text-sky-700 mt-0.5">{inProgressCount}</div>
        </div>
        <div className="p-3.5 bg-white border border-stone-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-medium text-emerald-600 uppercase">Completed</div>
          <div className="text-xl font-bold text-emerald-700 mt-0.5">{completedCount}</div>
        </div>
      </div>

      {/* Quick Add Form - Minimalistic & Flat */}
      <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
        <form onSubmit={handleAddTodo} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="Add a task..."
              required
              className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:border-stone-400 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isSubmitting || !quickTitle.trim()}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 disabled:opacity-40 transition-colors cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-0.5 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500">Priority:</span>
              <select
                value={quickPriority}
                onChange={(e: any) => setQuickPriority(e.target.value)}
                className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-700 focus:outline-none cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-stone-500">Category:</span>
              <select
                value={quickCategory}
                onChange={(e) => setQuickCategory(e.target.value)}
                className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-700 focus:outline-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-stone-500">Due:</span>
              <input
                type="date"
                value={quickDueDate}
                onChange={(e) => setQuickDueDate(e.target.value)}
                className="px-2 py-0.5 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-700 focus:outline-none"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Filter and Search Bar - Clean & Compact */}
      <div className="p-3 bg-white border border-stone-200 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter tabs */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
            {(["all", "pending", "in-progress", "completed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 rounded-md text-xs capitalize transition-colors cursor-pointer ${
                  filterStatus === s
                    ? "bg-white text-stone-900 font-semibold shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {s.replace("-", " ")}
              </button>
            ))}
          </div>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List Container */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-12 p-6 bg-white border border-stone-200 rounded-xl shadow-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-stone-400 mb-2" />
            <p className="text-xs text-stone-500">Loading tasks...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="text-center py-12 p-6 bg-white border border-stone-200 rounded-xl shadow-xs">
            <CheckCircle2 className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-stone-800">No tasks found</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Create a new task above or adjust your search filter.
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => {
            const isCompleted = todo.status === "completed";
            const id = todo._id || todo.id || "";
            const isOverdue =
              todo.dueDate &&
              !isCompleted &&
              new Date(todo.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);
            const isCopied = copiedId === id;

            return (
              <div
                key={id}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCompleted
                    ? "bg-stone-50/70 border-stone-200 opacity-70"
                    : "bg-white border-stone-200 hover:border-stone-300 shadow-xs"
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(todo)}
                    className="mt-0.5 shrink-0 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
                    title={isCompleted ? "Mark pending" : "Mark completed"}
                  >
                    {isCompleted ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-stone-400 hover:text-stone-700" />
                    )}
                  </button>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`text-sm font-medium text-stone-900 break-words ${
                          isCompleted ? "line-through text-stone-400" : ""
                        }`}
                      >
                        {todo.title}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-md border text-[10px] font-medium uppercase tracking-wider ${getPriorityBadge(
                          todo.priority
                        )}`}
                      >
                        {todo.priority}
                      </span>

                      {todo.category && (
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-[10px] text-stone-600">
                          {todo.category}
                        </span>
                      )}

                      {todo.status === "in-progress" && (
                        <span className="px-2 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-[10px] font-medium text-sky-700">
                          In Progress
                        </span>
                      )}
                    </div>

                    {todo.description && (
                      <p className="text-xs text-stone-500 line-clamp-2">
                        {todo.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-0.5 text-stone-500 text-[11px]">
                      {todo.dueDate && (
                        <div
                          className={`flex items-center gap-1 ${
                            isOverdue ? "text-rose-600 font-medium" : ""
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          <span>
                            Due {new Date(todo.dueDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          {isOverdue && (
                            <span className="text-[10px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded border border-rose-200">
                              Overdue
                            </span>
                          )}
                        </div>
                      )}

                      {isCompleted && todo.completedAt && (
                        <div className="flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Done {new Date(todo.completedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions: Copy icon, Status select, Edit, Delete */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  {/* COPY WHOLE TASK BUTTON */}
                  <button
                    type="button"
                    onClick={(e) => handleCopyTodo(todo, e)}
                    className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                      isCopied
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                        : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                    title="Copy whole task"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {isCopied && <span className="text-[10px] font-medium">Copied!</span>}
                  </button>

                  {/* Status select */}
                  <select
                    value={todo.status}
                    onChange={async (e) => {
                      const newSt = e.target.value as any;
                      setTodos((prev) =>
                        prev.map((t) => (t._id === id || t.id === id ? { ...t, status: newSt } : t))
                      );
                      await fetch(`/api/admin/todos/${id}`, {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ status: newSt }),
                      });
                    }}
                    className="px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 cursor-pointer focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>

                  <button
                    onClick={() => setEditingTodo(todo)}
                    className="p-1.5 bg-white border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors cursor-pointer"
                    title="Edit task"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => handleDeleteTodo(id, e)}
                    className="p-1.5 bg-white border border-stone-200 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Task Modal - Clean Flat Minimal */}
      {editingTodo && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-stone-200 rounded-2xl shadow-xl w-full max-w-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-stone-700" />
                <h3 className="text-base font-semibold text-stone-900">Edit Task</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyTodo(editingTodo)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-stone-600 bg-stone-50 border border-stone-200 rounded-lg hover:bg-stone-100 cursor-pointer"
                  title="Copy task details"
                >
                  {copiedId === (editingTodo._id || editingTodo.id) ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setEditingTodo(null)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateTodo} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingTodo.title}
                  onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                  placeholder="Task title..."
                  required
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Details / Notes
                </label>
                <textarea
                  rows={3}
                  value={editingTodo.description || ""}
                  onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                  placeholder="Optional details..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-stone-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingTodo.status}
                    onChange={(e: any) => setEditingTodo({ ...editingTodo, status: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 focus:outline-none cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={editingTodo.priority}
                    onChange={(e: any) => setEditingTodo({ ...editingTodo, priority: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 focus:outline-none cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingTodo.category || ""}
                    onChange={(e) => setEditingTodo({ ...editingTodo, category: e.target.value })}
                    placeholder="Category..."
                    list="cat-options"
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 focus:outline-none"
                  />
                  <datalist id="cat-options">
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={
                      editingTodo.dueDate
                        ? new Date(editingTodo.dueDate).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEditingTodo({
                        ...editingTodo,
                        dueDate: e.target.value || null,
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingTodo(null)}
                  className="px-3.5 py-1.5 text-xs text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-stone-900 text-white text-xs font-medium rounded-lg hover:bg-stone-800 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
