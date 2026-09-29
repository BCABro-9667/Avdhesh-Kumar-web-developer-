import { PORTFOLIO_DATA } from "../data/portfolio";

const API_BASE = "/api";

export async function fetchProjects(category?: string, search?: string) {
  try {
    const params = new URLSearchParams();
    if (category && category !== "All") params.append("category", category);
    if (search) params.append("search", search);
    const res = await fetch(`${API_BASE}/projects?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch from backend");
    const data = await res.json();
    if (Array.isArray(data)) {
      return data;
    }
  } catch (err) {
    console.warn("Error fetching projects from backend:", err);
  }
  return [];
}

export async function fetchProjectBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/projects/${slug}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("API project fetch error:", err);
  }
  return null;
}

export async function fetchBlogPosts(category?: string, search?: string) {
  try {
    const params = new URLSearchParams();
    if (category && category !== "All") params.append("category", category);
    if (search) params.append("search", search);
    const res = await fetch(`${API_BASE}/blog?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch blog posts");
    const data = await res.json();
    if (Array.isArray(data)) {
      return data;
    }
  } catch (err) {
    console.warn("Error fetching blog posts:", err);
  }
  return [];
}

export async function fetchBlogPostBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/blog/${slug}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Error fetching blog post by slug:", err);
  }
  return null;
}

export async function fetchGallery(category?: string) {
  try {
    const params = new URLSearchParams();
    if (category && category !== "All") params.append("category", category);
    const res = await fetch(`${API_BASE}/gallery?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.warn("Error fetching gallery:", err);
  }
  return [];
}

// ==========================================
// SITE SETTINGS & RESUME
// ==========================================

export async function fetchSiteSettings() {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.settings) return data.settings;
    }
  } catch (e) {
    console.warn("Failed to fetch settings from server, using fallback");
  }
  return {
    key: "portfolio_settings",
    resumeUrl: "",
    resumeFileName: "Avdhesh_Kumar_Resume.pdf",
    resumeUpdatedAt: new Date(),
    socialLinks: {
      github: PORTFOLIO_DATA.personal.github,
      linkedin: PORTFOLIO_DATA.personal.linkedin,
      twitter: PORTFOLIO_DATA.personal.twitter,
      instagram: PORTFOLIO_DATA.personal.instagram,
      youtube: "https://youtube.com/@BCABRO",
      facebook: "https://facebook.com",
      email: PORTFOLIO_DATA.personal.email,
      phone: PORTFOLIO_DATA.personal.phone,
      location: PORTFOLIO_DATA.personal.location,
      statusText: PORTFOLIO_DATA.personal.statusText,
    },
  };
}

export async function updateSiteSettings(payload: any, token: string) {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update site settings");
  }
  return await res.json();
}

export async function uploadResumeFile(file: File, token: string) {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch(`${API_BASE}/admin/resume/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to upload resume");
  }
  return await res.json();
}

// ==========================================
// INQUIRIES, CONTACT, POPUP & FEEDBACK
// ==========================================

export async function verifyEmailAddress(email: string): Promise<{
  valid: boolean;
  error?: string;
  suggestedCorrection?: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE}/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({ valid: true }));
    return data;
  } catch (err) {
    console.warn("verifyEmailAddress client error:", err);
    return { valid: true };
  }
}

export async function submitContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  metadata?: any;
}) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to send message");
  }
  return await res.json();
}

export async function submitPopupSubscription(data: { email: string; name?: string; metadata?: any }) {
  const res = await fetch(`${API_BASE}/popup-lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to submit subscription");
  }
  return await res.json();
}

export async function submitFeedbackMessage(data: {
  name?: string;
  email?: string;
  rating: number;
  category?: string;
  message: string;
}) {
  const res = await fetch(`${API_BASE}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to submit feedback");
  }
  return await res.json();
}

export async function fetchInquiries(
  token: string,
  params?: { type?: string; status?: string; search?: string }
) {
  const query = new URLSearchParams();
  if (params?.type && params.type !== "all") query.append("type", params.type);
  if (params?.status && params.status !== "all") query.append("status", params.status);
  if (params?.search) query.append("search", params.search);

  const res = await fetch(`${API_BASE}/admin/inquiries?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch inquiries");
  return await res.json();
}

export async function updateInquiryStatus(id: string, status: string, token: string) {
  const res = await fetch(`${API_BASE}/admin/inquiries/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return await res.json();
}

export async function deleteInquiry(id: string, token: string) {
  const res = await fetch(`${API_BASE}/admin/inquiries/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete inquiry");
  return await res.json();
}

// ==========================================
// LIKES API
// ==========================================

export async function fetchAllLikes(): Promise<Record<string, number>> {
  try {
    const res = await fetch(`${API_BASE}/likes`);
    if (res.ok) {
      const data = await res.json();
      return data.likes || {};
    }
  } catch (e) {}
  return {};
}

export async function likeProjectItem(idOrSlug: string, action: "like" | "unlike" = "like"): Promise<number> {
  try {
    const res = await fetch(`${API_BASE}/projects/${encodeURIComponent(idOrSlug)}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      const data = await res.json();
      return typeof data.likes === "number" ? data.likes : 0;
    }
  } catch (e) {}
  return 0;
}

export async function likeBlogItem(idOrSlug: string, action: "like" | "unlike" = "like"): Promise<number> {
  try {
    const res = await fetch(`${API_BASE}/blog/${encodeURIComponent(idOrSlug)}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      const data = await res.json();
      return typeof data.likes === "number" ? data.likes : 0;
    }
  } catch (e) {}
  return 0;
}

export async function fetchComments(blogId: string) {
  try {
    const res = await fetch(`${API_BASE}/blogs/${encodeURIComponent(blogId)}/comments`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Failed to fetch comments");
  }
  return [];
}

export async function postComment(blogId: string, email: string, comment: string) {
  const res = await fetch(`${API_BASE}/blogs/${encodeURIComponent(blogId)}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, comment }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Failed to post comment");
  }
  return data;
}

