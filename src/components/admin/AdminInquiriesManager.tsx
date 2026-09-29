import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Inbox,
  Mail,
  Send,
  Star,
  Trash2,
  CheckCircle,
  Eye,
  RefreshCw,
  Search,
  Filter,
  ExternalLink,
  MessageSquare,
  Sparkles,
  User,
  Clock,
  Tag,
  AlertCircle
} from "lucide-react";
import { fetchInquiries, updateInquiryStatus, deleteInquiry } from "../../lib/apiClient";
import { AdminListSkeleton } from "../Skeleton";

interface InquiryItem {
  _id: string;
  type: "contact" | "popup" | "feedback";
  name: string;
  email: string;
  subject?: string;
  message?: string;
  rating?: number;
  category?: string;
  status: "unread" | "read" | "replied" | "archived";
  createdAt: string;
}

interface InquiryStats {
  total: number;
  unread: number;
  contacts: number;
  popups: number;
  feedbacks: number;
}

interface AdminInquiriesManagerProps {
  token?: string;
}

export const AdminInquiriesManager: React.FC<AdminInquiriesManagerProps> = ({ token: propToken }) => {
  const queryClient = useQueryClient();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [actionMessage, setActionMessage] = useState<string>("");

  const token = propToken || localStorage.getItem("portfolio_admin_token") || localStorage.getItem("admin_token") || "";

  const { data: resData, isLoading, refetch } = useQuery({
    queryKey: ["adminInquiries", typeFilter, statusFilter, search],
    queryFn: () =>
      fetchInquiries(token, {
        type: typeFilter !== "all" ? typeFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: search.trim() || undefined,
      }),
    enabled: Boolean(token),
  });

  const inquiries: InquiryItem[] = resData?.inquiries || [];
  const stats: InquiryStats = resData?.stats || {
    total: 0,
    unread: 0,
    contacts: 0,
    popups: 0,
    feedbacks: 0,
  };

  const statusMutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: string }) =>
      updateInquiryStatus(id, newStatus, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminInquiries"] });
      if (selectedInquiry && selectedInquiry._id === variables.id) {
        setSelectedInquiry((prev) => (prev ? { ...prev, status: variables.newStatus as any } : null));
      }
      setActionMessage(`Status updated to ${variables.newStatus}`);
      setTimeout(() => setActionMessage(""), 2500);
    },
    onError: (err: any) => {
      alert(err.message || "Failed to update status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInquiry(id, token),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["adminInquiries"] });
      if (selectedInquiry && selectedInquiry._id === id) {
        setSelectedInquiry(null);
      }
      setActionMessage("Submission deleted");
      setTimeout(() => setActionMessage(""), 2500);
    },
    onError: (err: any) => {
      alert(err.message || "Failed to delete submission");
    },
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    statusMutation.mutate({ id, newStatus });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this submission?")) return;
    deleteMutation.mutate(id);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "contact":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#E6F4EA] text-[#137333] border border-[#137333]/30">
            <Mail className="w-3 h-3" />
            Contact Form
          </span>
        );
      case "popup":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#E8F0FE] text-[#1A73E8] border border-[#1A73E8]/30">
            <Sparkles className="w-3 h-3" />
            Popup Lead
          </span>
        );
      case "feedback":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#FEF7E0] text-[#B06000] border border-[#B06000]/30">
            <Star className="w-3 h-3 fill-[#B06000]" />
            Feedback
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unread":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
            Unread
          </span>
        );
      case "read":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-gray-100 text-gray-700 border border-gray-300">
            Read
          </span>
        );
      case "replied":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            Replied
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-neutral-100 text-neutral-600 border border-neutral-300">
            Archived
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#141413]/10 pb-5">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#141413] tracking-tight">
            Inbox & Submissions
          </h2>
          <p className="text-sm text-[#6B6862] mt-1">
            Manage contact form messages, popup email subscribers, and visitor feedback testimonials.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F5F2EA] text-[#141413] border-2 border-[#141413] text-xs font-mono font-bold shadow-[2px_2px_0px_#141413] transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-mono font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => {
            setTypeFilter("all");
            setStatusFilter("all");
          }}
          className={`p-4 rounded-2xl border-2 border-[#141413] cursor-pointer transition-all ${
            typeFilter === "all"
              ? "bg-[#D4F050] shadow-[4px_4px_0px_#141413]"
              : "bg-white hover:bg-[#FAF8F2] shadow-[2px_2px_0px_#141413]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[#141413] uppercase">All Items</span>
            <Inbox className="w-4 h-4 text-[#141413]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#141413]">{stats.total}</div>
          <span className="text-[11px] font-mono text-[#141413]/70">{stats.unread} unread</span>
        </div>

        <div
          onClick={() => setTypeFilter("contact")}
          className={`p-4 rounded-2xl border-2 border-[#141413] cursor-pointer transition-all ${
            typeFilter === "contact"
              ? "bg-[#D4F050] shadow-[4px_4px_0px_#141413]"
              : "bg-white hover:bg-[#FAF8F2] shadow-[2px_2px_0px_#141413]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[#141413] uppercase">Contact Msgs</span>
            <Mail className="w-4 h-4 text-[#141413]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#141413]">{stats.contacts}</div>
          <span className="text-[11px] font-mono text-[#141413]/70">Inquiries sent</span>
        </div>

        <div
          onClick={() => setTypeFilter("popup")}
          className={`p-4 rounded-2xl border-2 border-[#141413] cursor-pointer transition-all ${
            typeFilter === "popup"
              ? "bg-[#D4F050] shadow-[4px_4px_0px_#141413]"
              : "bg-white hover:bg-[#FAF8F2] shadow-[2px_2px_0px_#141413]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[#141413] uppercase">Popup Leads</span>
            <Sparkles className="w-4 h-4 text-[#141413]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#141413]">{stats.popups}</div>
          <span className="text-[11px] font-mono text-[#141413]/70">Subscribers</span>
        </div>

        <div
          onClick={() => setTypeFilter("feedback")}
          className={`p-4 rounded-2xl border-2 border-[#141413] cursor-pointer transition-all ${
            typeFilter === "feedback"
              ? "bg-[#D4F050] shadow-[4px_4px_0px_#141413]"
              : "bg-white hover:bg-[#FAF8F2] shadow-[2px_2px_0px_#141413]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[#141413] uppercase">Feedback</span>
            <Star className="w-4 h-4 text-[#141413]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#141413]">{stats.feedbacks}</div>
          <span className="text-[11px] font-mono text-[#141413]/70">Visitor reviews</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border-2 border-[#141413] shadow-[3px_3px_0px_#141413]">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-[#6B6862] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF8F2] border border-[#141413]/20 text-xs font-mono text-[#141413] focus:outline-none focus:border-[#141413]"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#141413]">
            <Filter className="w-3.5 h-3.5" />
            <span>Type:</span>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#FAF8F2] border border-[#141413]/30 text-xs font-mono text-[#141413] focus:outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="contact">Contact Messages</option>
            <option value="popup">Popup Leads</option>
            <option value="feedback">Feedback Reviews</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#141413] ml-2">
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#FAF8F2] border border-[#141413]/30 text-xs font-mono text-[#141413] focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Main List & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table / List */}
        <div className={`space-y-3 ${selectedInquiry ? "lg:col-span-7" : "lg:col-span-12"}`}>
          {isLoading ? (
            <div className="bg-white rounded-2xl border-2 border-[#141413] shadow-[4px_4px_0px_#141413] overflow-hidden">
              <AdminListSkeleton rows={5} />
            </div>
          ) : inquiries.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border-2 border-[#141413]">
              <Inbox className="w-10 h-10 text-[#6B6862]/40 mx-auto mb-3" />
              <h4 className="font-display font-bold text-lg text-[#141413]">No submissions found</h4>
              <p className="font-mono text-xs text-[#6B6862] mt-1">
                Submissions from the Contact form, Stay Connected popup, or Feedback modal will appear here.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-[#141413] shadow-[4px_4px_0px_#141413] overflow-hidden divide-y divide-[#141413]/10">
              {inquiries.map((item) => {
                const isSelected = selectedInquiry?._id === item._id;
                const isUnread = item.status === "unread";
                return (
                  <div
                    key={item._id}
                    onClick={() => {
                      setSelectedInquiry(item);
                      if (item.status === "unread") {
                        handleStatusChange(item._id, "read");
                      }
                    }}
                    className={`p-4 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-[#FAF8F2] border-l-4 border-l-[#141413]"
                        : isUnread
                        ? "bg-[#FAF8F2]/60 hover:bg-[#FAF8F2]"
                        : "hover:bg-[#FAF8F2]"
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getTypeBadge(item.type)}
                        {getStatusBadge(item.status)}
                        {item.rating && (
                          <span className="inline-flex items-center gap-0.5 text-xs font-mono font-bold text-amber-600">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {item.rating}/5
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-[#6B6862] ml-auto">
                          {new Date(item.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-sm text-[#141413] truncate ${isUnread ? "font-bold" : "font-semibold"}`}>
                          {item.name || "Anonymous"}
                        </span>
                        <span className="text-xs text-[#6B6862] truncate">({item.email})</span>
                      </div>

                      {item.subject && (
                        <p className="text-xs font-mono text-[#141413]/80 truncate">
                          {item.subject}
                        </p>
                      )}

                      {item.message && (
                        <p className="text-xs text-[#6B6862] line-clamp-1">
                          {item.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInquiry(item);
                        }}
                        className="p-1.5 rounded-lg hover:bg-white text-[#141413] border border-[#141413]/20 cursor-pointer"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item._id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 border border-red-200 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Item Detail Panel */}
        {selectedInquiry && (
          <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-[#141413] shadow-[6px_6px_0px_#141413] p-5 sm:p-6 space-y-5 sticky top-24 self-start">
            <div className="flex items-center justify-between border-b border-[#141413]/10 pb-4">
              <div className="flex items-center gap-2">
                {getTypeBadge(selectedInquiry.type)}
                {getStatusBadge(selectedInquiry.status)}
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-xs font-mono text-[#6B6862] hover:text-[#141413] cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            {/* Sender info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#D4F050] border border-[#141413] flex items-center justify-center font-bold font-mono text-sm text-[#141413]">
                  {selectedInquiry.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-[#141413] text-base leading-tight">
                    {selectedInquiry.name}
                  </h4>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-xs font-mono text-[#141413] hover:underline flex items-center gap-1"
                  >
                    <span>{selectedInquiry.email}</span>
                    <ExternalLink className="w-3 h-3 text-[#6B6862]" />
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#6B6862]">
                <Clock className="w-3 h-3" />
                <span>
                  {new Date(selectedInquiry.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </div>

            {/* If rating */}
            {selectedInquiry.rating && (
              <div className="p-3 bg-[#FEF7E0] border border-[#B06000]/30 rounded-xl space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-[#B06000]">
                  Rating & Category
                </span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= (selectedInquiry.rating || 0)
                            ? "fill-[#B06000] text-[#B06000]"
                            : "text-[#B06000]/30"
                        }`}
                      />
                    ))}
                    <span className="font-mono text-xs font-bold text-[#B06000] ml-1">
                      {selectedInquiry.rating}/5
                    </span>
                  </div>
                  {selectedInquiry.category && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white border border-[#B06000]/20 text-[#B06000]">
                      {selectedInquiry.category}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Subject */}
            {selectedInquiry.subject && (
              <div>
                <span className="block font-mono text-[11px] font-bold uppercase text-[#6B6862] mb-1">
                  Subject
                </span>
                <p className="text-sm font-semibold text-[#141413] bg-[#FAF8F2] p-2.5 rounded-xl border border-[#141413]/10">
                  {selectedInquiry.subject}
                </p>
              </div>
            )}

            {/* Message Body */}
            <div>
              <span className="block font-mono text-[11px] font-bold uppercase text-[#6B6862] mb-1">
                Message Content
              </span>
              <div className="text-xs sm:text-sm text-[#141413] bg-[#FAF8F2] p-3.5 rounded-xl border border-[#141413]/10 whitespace-pre-wrap leading-relaxed">
                {selectedInquiry.message || "(No message body provided)"}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2 border-t border-[#141413]/10">
              <a
                href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(
                  `Re: ${selectedInquiry.subject || "Your submission on Avdhesh's portfolio"}`
                )}`}
                onClick={() => handleStatusChange(selectedInquiry._id, "replied")}
                className="w-full py-2.5 rounded-xl bg-[#141413] hover:bg-[#D4F050] text-[#FAF8F2] hover:text-[#141413] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-[#141413] transition-all cursor-pointer shadow-[2px_2px_0px_#141413]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply via Email</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                {selectedInquiry.status === "unread" ? (
                  <button
                    onClick={() => handleStatusChange(selectedInquiry._id, "read")}
                    className="py-2 rounded-xl bg-white hover:bg-gray-100 text-[#141413] font-mono text-xs font-bold border border-[#141413]/30 cursor-pointer"
                  >
                    Mark as Read
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(selectedInquiry._id, "unread")}
                    className="py-2 rounded-xl bg-white hover:bg-gray-100 text-[#141413] font-mono text-xs font-bold border border-[#141413]/30 cursor-pointer"
                  >
                    Mark as Unread
                  </button>
                )}

                <button
                  onClick={() => handleDelete(selectedInquiry._id)}
                  className="py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-mono text-xs font-bold border border-red-200 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
