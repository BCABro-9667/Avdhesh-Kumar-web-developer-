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
  ListTodo
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
        body: JSON.stringify(editingTodo),
      });

      if (!res.ok) throw new Error("Failed to update task");
      const data = await res.json();
      if (data.todo) {
        setTodos((prev) => prev.map((t) => (t._id === id || t.id === id ? data.todo : t)));
        setEditingTodo(null);
      }
    } catch (err: any) {
      alert(err.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete task
  const handleDeleteTodo = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

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
    if (filterCategory !== "all" && (todo.category || "General").toLowerCase() !== filterCategory.toLowerCase())
      return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (todo.title || "").toLowerCase().includes(q);
      const matchDesc = (todo.description || "").toLowerCase().includes(q);
      const matchCat = (todo.category || "").toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }
    return true;
  });

  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.status === "completed").length;
  const pendingCount = todos.filter((t) => t.status === "pending").length;
  const inProgressCount = todos.filter((t) => t.status === "in-progress").length;

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-[#EF4444] text-white border-[#141413]";
      case "high":
        return "bg-[#F97316] text-white border-[#141413]";
      case "medium":
        return "bg-[#FBBF24] text-[#141413] border-[#141413]";
      case "low":
      default:
        return "bg-[#E5E7EB] text-[#374151] border-[#141413]/30";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#FAF8F2] border-2 border-[#141413] shadow-[4px_4px_0px_#141413] rounded-2xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#D4F050] border-2 border-[#141413] shadow-[2px_2px_0px_#141413] flex items-center justify-center text-[#141413]">
            <ListTodo className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl text-[#141413] tracking-tight">
              Action Tasks & Todo Manager
            </h1>
            <p className="font-mono text-xs text-[#6B6862]">
              Track development sprint, UP Police Homeguard duties, MCA studies & personal goals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchTodos}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-[#141413] rounded-xl font-mono text-xs font-bold text-[#141413] shadow-[2px_2px_0px_#141413] hover:bg-[#D4F050] transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Stats overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border-2 border-[#141413] rounded-xl shadow-[3px_3px_0px_#141413]">
          <div className="font-mono text-[11px] text-[#6B6862] uppercase tracking-wider">Total Tasks</div>
          <div className="font-display font-black text-2xl text-[#141413] mt-1">{totalCount}</div>
        </div>
        <div className="p-4 bg-[#FFF4E5] border-2 border-[#141413] rounded-xl shadow-[3px_3px_0px_#141413]">
          <div className="font-mono text-[11px] text-[#B45309] uppercase tracking-wider">Pending</div>
          <div className="font-display font-black text-2xl text-[#B45309] mt-1">{pendingCount}</div>
        </div>
        <div className="p-4 bg-[#EFF6FF] border-2 border-[#141413] rounded-xl shadow-[3px_3px_0px_#141413]">
          <div className="font-mono text-[11px] text-[#1D4ED8] uppercase tracking-wider">In Progress</div>
          <div className="font-display font-black text-2xl text-[#1D4ED8] mt-1">{inProgressCount}</div>
        </div>
        <div className="p-4 bg-[#ECFDF5] border-2 border-[#141413] rounded-xl shadow-[3px_3px_0px_#141413]">
          <div className="font-mono text-[11px] text-[#047857] uppercase tracking-wider">Completed</div>
          <div className="font-display font-black text-2xl text-[#047857] mt-1">{completedCount}</div>
        </div>
      </div>

      {/* Quick Add Form */}
      <div className="p-5 bg-white border-2 border-[#141413] rounded-2xl shadow-[4px_4px_0px_#141413]">
        <h2 className="font-display font-bold text-base text-[#141413] mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#141413]" />
          <span>Quick Create Task</span>
        </h2>
        <form onSubmit={handleAddTodo} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="What needs to get done today? e.g., Prepare duty report or deploy app update..."
              required
              className="flex-1 px-4 py-2.5 bg-[#FAF8F2] border-2 border-[#141413] rounded-xl font-body text-sm text-[#141413] placeholder-[#9E9A91] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4F050]"
            />
            <button
              type="submit"
              disabled={isSubmitting || !quickTitle.trim()}
              className="px-5 py-2.5 bg-[#D4F050] border-2 border-[#141413] font-mono text-xs font-bold uppercase tracking-wider text-[#141413] rounded-xl shadow-[2px_2px_0px_#141413] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-[#6B6862]">Priority:</span>
              <select
                value={quickPriority}
                onChange={(e: any) => setQuickPriority(e.target.value)}
                className="px-2.5 py-1.5 bg-[#FAF8F2] border-2 border-[#141413] rounded-lg font-mono text-xs text-[#141413] focus:outline-none cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-[#6B6862]">Category:</span>
              <select
                value={quickCategory}
                onChange={(e) => setQuickCategory(e.target.value)}
                className="px-2.5 py-1.5 bg-[#FAF8F2] border-2 border-[#141413] rounded-lg font-mono text-xs text-[#141413] focus:outline-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-[#6B6862]">Due Date:</span>
              <input
                type="date"
                value={quickDueDate}
                onChange={(e) => setQuickDueDate(e.target.value)}
                className="px-2.5 py-1 bg-[#FAF8F2] border-2 border-[#141413] rounded-lg font-mono text-xs text-[#141413] focus:outline-none"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Filter and search bar */}
      <div className="p-4 bg-[#FAF8F2] border-2 border-[#141413] rounded-2xl shadow-[3px_3px_0px_#141413] flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9A91]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title, category, or note..."
            className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#141413] rounded-xl font-body text-xs text-[#141413] placeholder-[#9E9A91] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter tabs */}
          <div className="flex items-center gap-1 bg-white p-1 border-2 border-[#141413] rounded-xl">
            {(["all", "pending", "in-progress", "completed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs capitalize transition-colors cursor-pointer ${
                  filterStatus === s
                    ? "bg-[#141413] text-[#F5F2EA] font-bold"
                    : "text-[#6B6862] hover:bg-black/5"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1.5 bg-white border-2 border-[#141413] rounded-xl font-mono text-xs text-[#141413] focus:outline-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-white border-2 border-[#141413] rounded-xl font-mono text-xs text-[#141413] focus:outline-none cursor-pointer"
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

      {/* Task list container */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-16 p-8 bg-white border-2 border-[#141413] rounded-2xl shadow-[4px_4px_0px_#141413]">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#6B6862] mb-3" />
            <p className="font-mono text-sm text-[#6B6862]">Loading tasks from server...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="text-center py-16 p-8 bg-white border-2 border-[#141413] rounded-2xl shadow-[4px_4px_0px_#141413]">
            <CheckCircle2 className="w-12 h-12 text-[#D4F050] mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-[#141413]">No tasks match this filter</h3>
            <p className="font-mono text-xs text-[#6B6862] mt-1">
              Add your next assignment or adjust your filter selection above.
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

            return (
              <div
                key={id}
                className={`p-4 sm:p-5 rounded-2xl border-2 border-[#141413] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? "bg-[#FAF8F2]/70 opacity-75 shadow-[2px_2px_0px_#141413]"
                    : "bg-white shadow-[4px_4px_0px_#141413] hover:translate-x-0.5"
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(todo)}
                    className="mt-0.5 shrink-0 text-[#141413] hover:text-[#047857] transition-colors cursor-pointer"
                    title={isCompleted ? "Mark pending" : "Mark completed"}
                  >
                    {isCompleted ? (
                      <div className="w-6 h-6 rounded-lg bg-[#D4F050] border-2 border-[#141413] flex items-center justify-center text-[#141413] shadow-[1px_1px_0px_#141413]">
                        <CheckSquare className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-lg bg-white border-2 border-[#141413] flex items-center justify-center text-[#141413] hover:bg-[#FAF8F2] shadow-[1px_1px_0px_#141413]">
                        <Square className="w-4 h-4 opacity-40" />
                      </div>
                    )}
                  </button>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`font-body font-bold text-base text-[#141413] break-words ${
                          isCompleted ? "line-through text-[#6B6862]" : ""
                        }`}
                      >
                        {todo.title}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-full border font-mono text-[10px] font-bold uppercase tracking-wider ${getPriorityBadge(
                          todo.priority
                        )}`}
                      >
                        {todo.priority}
                      </span>

                      {todo.category && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FAF8F2] border border-[#141413]/30 font-mono text-[10px] text-[#141413]">
                          {todo.category}
                        </span>
                      )}

                      {todo.status === "in-progress" && (
                        <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] border border-[#1D4ED8] font-mono text-[10px] font-bold text-[#1D4ED8]">
                          In Progress
                        </span>
                      )}
                    </div>

                    {todo.description && (
                      <p className="font-body text-xs text-[#6B6862] line-clamp-2">
                        {todo.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[#6B6862] font-mono text-[11px]">
                      {todo.dueDate && (
                        <div
                          className={`flex items-center gap-1 ${
                            isOverdue ? "text-[#EF4444] font-bold" : ""
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            Due {new Date(todo.dueDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          {isOverdue && <span className="text-[10px] bg-red-100 px-1.5 py-0.2 rounded border border-red-300">Overdue</span>}
                        </div>
                      )}

                      {isCompleted && todo.completedAt && (
                        <div className="flex items-center gap-1 text-[#047857]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Done {new Date(todo.completedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Status cycle button */}
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
                    className="px-2 py-1 bg-[#FAF8F2] border border-[#141413] rounded-lg font-mono text-xs text-[#141413] cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>

                  <button
                    onClick={() => setEditingTodo(todo)}
                    className="p-1.5 bg-[#FAF8F2] border border-[#141413] rounded-lg text-[#141413] hover:bg-[#D4F050] transition-colors cursor-pointer"
                    title="Edit task"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteTodo(id)}
                    className="p-1.5 bg-[#FAF8F2] border border-[#141413] rounded-lg text-[#EF4444] hover:bg-red-100 transition-colors cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Modal */}
      {editingTodo && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border-2 border-[#141413] rounded-2xl shadow-[6px_6px_0px_#141413] w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#141413]/10 pb-3">
              <h3 className="font-display font-bold text-lg text-[#141413] flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                <span>Edit Task</span>
              </h3>
              <button
                onClick={() => setEditingTodo(null)}
                className="p-1 text-[#6B6862] hover:text-[#141413] rounded-lg hover:bg-[#FAF8F2] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTodo} className="space-y-4">
              <div>
                <label className="block font-mono text-xs font-bold text-[#141413] uppercase mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={editingTodo.title}
                  onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 bg-[#FAF8F2] border-2 border-[#141413] rounded-xl font-body text-sm focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold text-[#141413] uppercase mb-1">
                  Description / Subtasks
                </label>
                <textarea
                  rows={3}
                  value={editingTodo.description || ""}
                  onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                  placeholder="Additional context, subtasks, links or details..."
                  className="w-full px-3.5 py-2 bg-[#FAF8F2] border-2 border-[#141413] rounded-xl font-body text-sm focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs font-bold text-[#141413] uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={editingTodo.status}
                    onChange={(e: any) => setEditingTodo({ ...editingTodo, status: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F2] border-2 border-[#141413] rounded-xl font-mono text-xs"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-[#141413] uppercase mb-1">
                    Priority
                  </label>
                  <select
                    value={editingTodo.priority}
                    onChange={(e: any) => setEditingTodo({ ...editingTodo, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F2] border-2 border-[#141413] rounded-xl font-mono text-xs"
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
                  <label className="block font-mono text-xs font-bold text-[#141413] uppercase mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingTodo.category || ""}
                    onChange={(e) => setEditingTodo({ ...editingTodo, category: e.target.value })}
                    list="cat-options"
                    className="w-full px-3 py-2 bg-[#FAF8F2] border-2 border-[#141413] rounded-xl font-body text-xs"
                  />
                  <datalist id="cat-options">
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-[#141413] uppercase mb-1">
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
                    className="w-full px-3 py-2 bg-[#FAF8F2] border-2 border-[#141413] rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#141413]/10">
                <button
                  type="button"
                  onClick={() => setEditingTodo(null)}
                  className="px-4 py-2 bg-[#FAF8F2] border-2 border-[#141413] font-mono text-xs font-bold rounded-xl hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#D4F050] border-2 border-[#141413] font-mono text-xs font-bold rounded-xl shadow-[2px_2px_0px_#141413] hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
