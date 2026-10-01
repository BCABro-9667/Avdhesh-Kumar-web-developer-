import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import multer from "multer";
import compression from "compression";
import { createServer as createViteServer } from "vite";
import { connectDB, isMongoDBConnected } from "./src/server/db";
import { User, Project, BlogPost, Gallery, Category, SEOPageSettings, Donation, SiteSettings, Inquiry, Comment } from "./src/server/models";
import { generateToken, verifyAdminToken, AdminAuthRequest } from "./src/server/auth";
import { uploadToCloudinary, deleteFromCloudinary } from "./src/server/cloudinary";
import { authenticateAdmin, getAdminEnvCredentials, maskEmail } from "./src/server/adminAuthUtil";
import { getRazorpayInstance, verifyRazorpaySignature } from "./src/server/razorpay";

dotenv.config();

const app = express();
const PORT = 3000;

// High-performance gzip compression middleware
app.use(compression());

// Security & Production HTTP Headers
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  // Prevent MIME-sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Strict Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  // Strict Transport Security (HSTS)
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  // Permissions Policy
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(self 'https://checkout.razorpay.com')"
  );
  // Cross-Origin-Opener-Policy
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");

  // Content-Security-Policy (Allow self, Razorpay, Google Fonts, Cloudinary, Abstract API)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://api.razorpay.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://emailreputation.abstractapi.com https://*.cloudinary.com https://api.cloudinary.com",
    "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
  res.setHeader("Content-Security-Policy", csp);

  next();
});

// Dynamic API caching control
app.use("/api", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Multer memory storage for Cloudinary image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Connect to MongoDB on startup
connectDB();

// Ensure DB connection and route compatibility on serverless API calls (Vercel)
app.use(async (req, _res, next) => {
  // Normalize URL if stripped by serverless rewrites
  if (!req.url.startsWith("/api") && !req.url.startsWith("/google-site-verification")) {
    const originalUrl = req.originalUrl || req.url;
    if (originalUrl && originalUrl.startsWith("/api")) {
      req.url = originalUrl;
    }
  }

  if (process.env.MONGODB_URI && !isMongoDBConnected()) {
    try {
      await connectDB();
    } catch (e) {
      console.warn("DB connection attempt failed:", e);
    }
  }
  next();
});

// ==========================================
// PUBLIC API ROUTES
// ==========================================

// Auth Login
app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
        diagnostic: {
          timestamp: new Date().toISOString(),
          emailProvided: email || "",
          reason: "Email or password payload was missing.",
        },
      });
    }

    const result = await authenticateAdmin(email, password);
    if (!result.success) {
      return res.status(401).json({
        error: result.error || "Invalid email or password.",
        diagnostic: result.diagnostic,
      });
    }

    return res.json({
      token: result.token,
      admin: result.admin,
      diagnostic: result.diagnostic,
    });
  } catch (err: any) {
    console.error("Login route error:", err);
    return res.status(500).json({
      error: "Internal server error during login.",
      details: err.message,
    });
  }
});

// Auth Diagnostic Status (safe metadata for troubleshooting)
app.get("/api/auth/diagnostic", (req: Request, res: Response) => {
  const { email } = getAdminEnvCredentials();
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    configuredAdminEmailMasked: maskEmail(email),
    configuredEmailDomain: email.includes("@") ? email.split("@")[1] : "unknown",
    hasConfiguredPassword: Boolean(process.env.ADMIN_PASSWORD),
    hasJwtSecret: Boolean(process.env.JWT_SECRET),
    mongoStatus: isMongoDBConnected() ? "connected" : "disconnected",
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

// Verify Token
app.get("/api/auth/verify", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  return res.json({ valid: true, admin: req.admin });
});

// Public Projects
// Google Site Verification Endpoint
app.get("/google-site-verification", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/plain");
  res.send("google-site-verification=eMPcsVOqyxxvAQQyebO4Y_aftynI-HfKtB5eh9AqXow");
});

app.get("/api/projects", async (req: Request, res: Response) => {
  try {
    const { category, search, tag } = req.query;
    let projects: any[] = [];

    if (isMongoDBConnected()) {
      try {
        const query: any = { status: "published" };
        if (category && category !== "All") {
          query.category = category;
        }
        if (tag) {
          query.tags = tag;
        }
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: "i" } },
            { shortDescription: { $regex: search, $options: "i" } },
            { techStack: { $regex: search, $options: "i" } },
          ];
        }
        projects = await Project.find(query).sort({ publishedAt: -1, createdAt: -1 });
      } catch (dbErr) {
        console.warn("MongoDB query failed for projects:", dbErr);
      }
      return res.json(projects || []);
    }

    if (!projects || projects.length === 0) {
      projects = inMemoryProjects.filter((p) => p.status === "published");
      if (category && category !== "All") {
        projects = projects.filter((p) => p.category?.toLowerCase() === String(category).toLowerCase());
      }
      if (tag) {
        projects = projects.filter((p) => Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase() === String(tag).toLowerCase()));
      }
      if (search) {
        const s = String(search).toLowerCase();
        projects = projects.filter((p) =>
          p.title?.toLowerCase().includes(s) ||
          p.shortDescription?.toLowerCase().includes(s) ||
          (Array.isArray(p.techStack) && p.techStack.some((t: string) => t.toLowerCase().includes(s)))
        );
      }
    }

    return res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    return res.json(inMemoryProjects.filter((p) => p.status === "published"));
  }
});

app.get("/api/projects/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    let project: any = null;
    let relatedProjects: any[] = [];
    let relatedBlogs: any[] = [];

    if (isMongoDBConnected()) {
      try {
        if (slug.match(/^[0-9a-fA-F]{24}$/)) {
          project = await Project.findById(slug);
        }
        if (!project) {
          project = await Project.findOne({ slug, status: "published" });
        }
        if (!project) {
          project = await Project.findOne({ slug });
        }

        if (project) {
          relatedProjects = await Project.find({
            status: "published",
            _id: { $ne: project._id },
            $or: [{ category: project.category }, { techStack: { $in: project.techStack || [] } }]
          }).limit(2);

          relatedBlogs = await BlogPost.find({
            status: "published",
            $or: [{ category: project.category }, { tags: { $in: project.tags || [] } }]
          }).limit(2);
        }
      } catch (dbErr) {
        console.warn("MongoDB findOne failed for project:", dbErr);
      }
    }

    if (!project) {
      project = inMemoryProjects.find((p) => p.slug === slug || p._id === slug || p.id === slug);
      if (project) {
        relatedProjects = inMemoryProjects.filter((p) => p._id !== project._id && p.status === "published").slice(0, 2);
        relatedBlogs = inMemoryBlogs.filter((b) => b.status === "published").slice(0, 2);
      }
    }

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.json({ project, relatedProjects, relatedBlogs });
  } catch (err) {
    console.error("Error fetching project by slug:", err);
    const fallback = inMemoryProjects.find((p) => p.slug === req.params.slug || p._id === req.params.slug);
    if (fallback) return res.json({ project: fallback, relatedProjects: [], relatedBlogs: [] });
    return res.status(500).json({ error: "Server error" });
  }
});

// Public Blog
const handleGetBlogs = async (req: Request, res: Response) => {
  try {
    const { category, search, tag } = req.query;
    let posts: any[] = [];

    if (isMongoDBConnected()) {
      try {
        const query: any = { status: "published" };
        if (category && category !== "All") {
          query.category = category;
        }
        if (tag) {
          query.tags = tag;
        }
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: "i" } },
            { excerpt: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
          ];
        }
        posts = await BlogPost.find(query).sort({ publishedAt: -1, createdAt: -1 });
      } catch (dbErr) {
        console.warn("MongoDB query failed for blogs:", dbErr);
      }
      return res.json(posts || []);
    }

    if (!posts || posts.length === 0) {
      posts = inMemoryBlogs.filter((b) => b.status === "published");
      if (category && category !== "All") {
        posts = posts.filter((b) => b.category?.toLowerCase() === String(category).toLowerCase());
      }
      if (tag) {
        posts = posts.filter((b) => Array.isArray(b.tags) && b.tags.some((t: string) => t.toLowerCase() === String(tag).toLowerCase()));
      }
      if (search) {
        const s = String(search).toLowerCase();
        posts = posts.filter((b) =>
          b.title?.toLowerCase().includes(s) ||
          b.excerpt?.toLowerCase().includes(s) ||
          b.content?.toLowerCase().includes(s)
        );
      }
    }

    return res.json(posts);
  } catch (err) {
    console.error("Error fetching blog posts:", err);
    return res.json(inMemoryBlogs.filter((b) => b.status === "published"));
  }
};

app.get("/api/blog", handleGetBlogs);
app.get("/api/blogs", handleGetBlogs);

app.get("/api/blog/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    let post: any = null;
    let relatedArticles: any[] = [];
    let relatedProjects: any[] = [];

    if (isMongoDBConnected()) {
      try {
        if (slug.match(/^[0-9a-fA-F]{24}$/)) {
          post = await BlogPost.findById(slug);
        }
        if (!post) {
          post = await BlogPost.findOne({ slug, status: "published" });
        }
        if (!post) {
          post = await BlogPost.findOne({ slug });
        }

        if (post) {
          relatedArticles = await BlogPost.find({
            status: "published",
            _id: { $ne: post._id },
            $or: [{ category: post.category }, { tags: { $in: post.tags || [] } }]
          }).limit(2);

          relatedProjects = await Project.find({
            status: "published",
            $or: [{ category: post.category }, { tags: { $in: post.tags || [] } }]
          }).limit(2);
        }
      } catch (dbErr) {
        console.warn("MongoDB findOne failed for blog:", dbErr);
      }
    }

    if (!post) {
      post = inMemoryBlogs.find((b) => b.slug === slug || b._id === slug || b.id === slug);
      if (post) {
        relatedArticles = inMemoryBlogs.filter((b) => b._id !== post._id && b.status === "published").slice(0, 2);
        relatedProjects = inMemoryProjects.filter((p) => p.status === "published").slice(0, 2);
      }
    }

    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    return res.json({ post, relatedArticles, relatedProjects });
  } catch (err) {
    console.error("Error fetching blog post by slug:", err);
    const fallback = inMemoryBlogs.find((b) => b.slug === req.params.slug || b._id === req.params.slug);
    if (fallback) return res.json({ post: fallback, relatedArticles: [], relatedProjects: [] });
    return res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// BLOG COMMENTS & ABSTRACT API VERIFICATION
// ==========================================
const inMemoryComments: any[] = [];

// Load avatars from avtars.json
let AVATARS: { id: string; imageUrl: string }[] = [];
try {
  const avatarsPath = path.resolve(process.cwd(), "./src/data/avtars.json");
  if (fs.existsSync(avatarsPath)) {
    AVATARS = JSON.parse(fs.readFileSync(avatarsPath, "utf-8"));
    console.log(`Loaded ${AVATARS.length} avatars from avtars.json`);
  } else {
    console.warn("avtars.json file not found at", avatarsPath);
  }
} catch (e) {
  console.warn("Could not read avtars.json:", e);
}

function getConsistentFallbackAvatar(displayName: string): string {
  if (!AVATARS || AVATARS.length === 0) return "";
  let hash = 0;
  for (let i = 0; i < displayName.length; i++) {
    hash = (hash << 5) - hash + displayName.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % AVATARS.length;
  return AVATARS[index]?.imageUrl || "";
}

async function getAvatarForUser(displayName: string, email: string): Promise<string> {
  const cleanName = displayName.trim().toLowerCase();
  const cleanEmail = email.trim().toLowerCase();

  // 1. If multiple comments have the same user/display name, they MUST use the same avatar.
  if (isMongoDBConnected()) {
    try {
      const existing = await Comment.findOne({
        $or: [
          { displayName: { $regex: new RegExp(`^${cleanName}$`, "i") } },
          { email: cleanEmail },
        ],
        avatarUrl: { $exists: true, $ne: "" },
      });
      if (existing?.avatarUrl) {
        return existing.avatarUrl;
      }
    } catch (e) {
      console.warn("Error finding existing avatar in DB:", e);
    }
  }

  const memExisting = inMemoryComments.find(
    (c) =>
      (c.displayName?.toLowerCase() === cleanName || c.email?.toLowerCase() === cleanEmail) &&
      c.avatarUrl
  );
  if (memExisting?.avatarUrl) {
    return memExisting.avatarUrl;
  }

  // 2. For a new user/display name, randomly select one avatar from avtars.json
  if (AVATARS.length > 0) {
    const randomIndex = Math.floor(Math.random() * AVATARS.length);
    return AVATARS[randomIndex]?.imageUrl || "";
  }

  return "";
}

function generateDisplayName(email: string): string {
  try {
    const username = email.split('@')[0] || '';
    const parts = username.split(/[^a-zA-Z]+/);
    const firstPart = parts.find(p => p.length > 0) || '';
    if (!firstPart) {
      const clean = username.replace(/[^a-zA-Z]/g, '');
      if (clean.length > 0) {
        return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
      }
      return "Guest";
    }
    return firstPart.charAt(0).toUpperCase() + firstPart.slice(1).toLowerCase();
  } catch {
    return "Guest";
  }
}

async function verifyEmailWithAbstract(
  email: string,
  context: "comment" | "contact" = "contact"
): Promise<{ valid: boolean; error?: string; suggestedCorrection?: string | null }> {
  const apiKey = process.env.ABSTRACT_EMAIL_API_KEY || "4125aaaf2b0f475bbd9dcdb87986bf64";
  if (!apiKey) {
    console.warn("ABSTRACT_EMAIL_API_KEY is not configured in environment variables.");
    return { valid: true };
  }

  // Basic regex check first
  const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!basicEmailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email format (e.g. name@example.com)." };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const url = `https://emailreputation.abstractapi.com/v1/?api_key=${encodeURIComponent(apiKey)}&email=${encodeURIComponent(email)}`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error(`Abstract API HTTP error ${response.status}:`, errText);
      return { valid: true };
    }

    const data = await response.json();

    if (data.error) {
      console.warn("Abstract API returned error object:", data.error);
      return { valid: true };
    }

    const deliverability = (data.email_deliverability?.status || data.deliverability || "").toLowerCase();
    const isFormatValid = data.email_deliverability?.is_format_valid !== false && data.is_valid_format?.value !== false;
    const isSmtpValid = data.email_deliverability?.is_smtp_valid;
    const isMxValid = data.email_deliverability?.is_mx_valid;
    const isDisposable = data.email_quality?.is_disposable === true || data.is_disposable_email?.value === true;
    const suggestedCorrection = data.suggested_correction || null;

    if (!isFormatValid) {
      return {
        valid: false,
        error: "Invalid email format. Please check your email spelling.",
        suggestedCorrection,
      };
    }

    if (deliverability === "undeliverable" || (isSmtpValid === false && isMxValid === false)) {
      const reason = data.email_deliverability?.status_detail === "dns_record_not_found"
        ? "The email domain does not exist or has no active mail servers."
        : "This email address is undeliverable and cannot receive messages.";
      return {
        valid: false,
        error: `${reason} Please enter an active, valid email address so Avdhesh can reply.`,
        suggestedCorrection,
      };
    }

    if (isDisposable) {
      return {
        valid: false,
        error: "Disposable or temporary email addresses are not accepted. Please use your real email.",
        suggestedCorrection,
      };
    }

    return { valid: true, suggestedCorrection };
  } catch (err: any) {
    console.error("Abstract API verification error:", err);
    return { valid: true };
  }
}

// Endpoint for frontend live email verification with Abstract API
app.post("/api/verify-email", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ valid: false, error: "Email address is required." });
    }
    const result = await verifyEmailWithAbstract(email.trim(), "contact");
    return res.json(result);
  } catch (err: any) {
    console.error("Email verification route error:", err);
    return res.status(500).json({ valid: true, error: "Verification unavailable" });
  }
});

// Get comments for a blog post
app.get("/api/blogs/:id/comments", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let comments: any[] = [];

    if (isMongoDBConnected()) {
      try {
        comments = await Comment.find({ blogId: id, status: "published" }).sort({ createdAt: -1 });
      } catch (dbErr) {
        console.warn("MongoDB query failed for comments, falling back to memory:", dbErr);
      }
    }

    if (!comments || comments.length === 0) {
      comments = inMemoryComments
        .filter((c) => c.blogId === id && c.status === "published")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Build map of displayName -> avatarUrl from comments that already have an avatarUrl
    const nameToAvatarMap = new Map<string, string>();
    for (const c of comments) {
      if (c.displayName && c.avatarUrl && !nameToAvatarMap.has(c.displayName.toLowerCase())) {
        nameToAvatarMap.set(c.displayName.toLowerCase(), c.avatarUrl);
      }
    }

    // Sanitize - NEVER expose email
    const sanitized = comments.map((c) => {
      const nameKey = (c.displayName || "Guest").toLowerCase();
      const resolvedAvatar = c.avatarUrl || nameToAvatarMap.get(nameKey) || getConsistentFallbackAvatar(c.displayName || "Guest");
      return {
        _id: c._id || c.id,
        blogId: c.blogId,
        displayName: c.displayName || "Guest",
        avatarUrl: resolvedAvatar,
        comment: c.comment,
        createdAt: c.createdAt || new Date(),
      };
    });

    return res.json(sanitized);
  } catch (err) {
    console.error("Error fetching comments:", err);
    return res.status(500).json({ error: "Internal server error fetching comments." });
  }
});

// Post a comment with Abstract API email verification
app.post("/api/blogs/:id/comments", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, comment } = req.body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    if (!comment || typeof comment !== "string" || comment.trim().length < 2) {
      return res.status(400).json({ error: "Comment must be at least 2 characters long." });
    }

    if (comment.trim().length > 1000) {
      return res.status(400).json({ error: "Comment cannot exceed 1000 characters." });
    }

    const trimmedComment = comment.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Prevent duplicate spam submissions within 60 seconds
    if (isMongoDBConnected()) {
      try {
        const recentDuplicate = await Comment.findOne({
          blogId: id,
          email: cleanEmail,
          comment: trimmedComment,
          createdAt: { $gte: new Date(Date.now() - 60000) },
        });
        if (recentDuplicate) {
          return res.status(429).json({ error: "Duplicate comment detected. Please wait before posting again." });
        }
      } catch (e) {
        // ignore
      }
    } else {
      const duplicateInMemory = inMemoryComments.find(
        (c) => c.blogId === id && c.email === cleanEmail && c.comment === trimmedComment && new Date().getTime() - new Date(c.createdAt).getTime() < 60000
      );
      if (duplicateInMemory) {
        return res.status(429).json({ error: "Duplicate comment detected. Please wait before posting again." });
      }
    }

    // Verify email using Abstract API server-side
    const verification = await verifyEmailWithAbstract(cleanEmail);
    if (!verification.valid) {
      return res.status(400).json({ error: verification.error || "This email address cannot be used for comments." });
    }

    const displayName = generateDisplayName(cleanEmail);
    const avatarUrl = await getAvatarForUser(displayName, cleanEmail);

    let savedComment: any = null;
    if (isMongoDBConnected()) {
      try {
        savedComment = await Comment.create({
          blogId: id,
          email: cleanEmail,
          comment: trimmedComment,
          displayName,
          avatarUrl,
          status: "published",
        });
      } catch (dbErr) {
        console.warn("MongoDB save failed for comment, falling back to memory:", dbErr);
      }
    }

    if (!savedComment) {
      savedComment = {
        _id: "mem_" + Date.now() + Math.random().toString(36).substring(2, 7),
        blogId: id,
        email: cleanEmail,
        comment: trimmedComment,
        displayName,
        avatarUrl,
        status: "published",
        createdAt: new Date(),
      };
      inMemoryComments.push(savedComment);
    }

    return res.status(201).json({
      success: true,
      comment: {
        _id: savedComment._id || savedComment.id,
        blogId: savedComment.blogId,
        displayName: savedComment.displayName,
        avatarUrl: savedComment.avatarUrl || avatarUrl,
        comment: savedComment.comment,
        createdAt: savedComment.createdAt || new Date(),
      },
    });
  } catch (err: any) {
    console.error("Error posting comment:", err);
    return res.status(500).json({ error: "Internal server error posting comment. Please try again later." });
  }
});

// Public Gallery
app.get("/api/gallery", async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let galleryItems: any[] = [];

    if (isMongoDBConnected()) {
      try {
        const query: any = { status: "published" };
        if (category && category !== "All") {
          query.category = category;
        }
        galleryItems = await Gallery.find(query).sort({ createdAt: -1 });
      } catch (dbErr) {
        console.warn("MongoDB find failed for gallery:", dbErr);
      }
      return res.json(galleryItems || []);
    }

    if (!galleryItems || galleryItems.length === 0) {
      galleryItems = inMemoryGallery.filter((g) => g.status === "published");
      if (category && category !== "All") {
        galleryItems = galleryItems.filter((g) => g.category?.toLowerCase() === String(category).toLowerCase());
      }
    }

    return res.json(galleryItems);
  } catch (err) {
    console.error("Error fetching gallery:", err);
    return res.json(inMemoryGallery.filter((g) => g.status === "published"));
  }
});

// Public Categories
app.get("/api/categories", async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    let categories: any[] = [];

    if (isMongoDBConnected()) {
      try {
        const query: any = {};
        if (type) query.type = type;
        categories = await Category.find(query).sort({ name: 1 });
      } catch (dbErr) {
        console.warn("MongoDB categories query failed:", dbErr);
      }
    }

    if (!categories || categories.length === 0) {
      // Gather unique categories from in-memory content
      const projectCats = Array.from(new Set(inMemoryProjects.map((p) => p.category).filter(Boolean)));
      const blogCats = Array.from(new Set(inMemoryBlogs.map((b) => b.category).filter(Boolean)));
      const set = type === "project" ? projectCats : (type === "blog" ? blogCats : [...projectCats, ...blogCats]);
      categories = set.map((cat, idx) => ({
        _id: `cat-${idx}`,
        name: cat,
        slug: cat.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        type: type || "blog",
      }));
    }

    return res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Public SEO Settings
app.get("/api/seo", async (req: Request, res: Response) => {
  try {
    const seoSettings = await SEOPageSettings.find({});
    return res.json(seoSettings);
  } catch (err) {
    console.error("Error fetching SEO settings:", err);
    return res.status(500).json({ error: "Failed to fetch SEO settings" });
  }
});

app.get("/api/seo/:page", async (req: Request, res: Response) => {
  try {
    const setting = await SEOPageSettings.findOne({ page: req.params.page });
    if (!setting) {
      return res.status(404).json({ error: "SEO settings not found for page" });
    }
    return res.json(setting);
  } catch (err) {
    console.error("Error fetching page SEO:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// SITE SETTINGS, INQUIRIES & LIKES IN-MEMORY FALLBACKS
// ==========================================
const defaultSocialLinks = {
  github: "https://github.com/BCABro-9667",
  linkedin: "https://www.linkedin.com/in/avdhesh-kumar-72b9a72b8/",
  twitter: "https://x.com/Avdheshkumar00",
  instagram: "https://www.instagram.com/avdhesh_kumar__9667",
  youtube: "https://youtube.com/@BCABRO",
  facebook: "https://facebook.com",
  email: "avdhesh6968@gmail.com",
  phone: "+91 9667086968",
  location: "Gurugram, Haryana, India",
  statusText: "Open to Full-Time & Freelance Roles",
};

let inMemorySiteSettings = {
  key: "portfolio_settings",
  themeBg: "white",
  showFeedbackButton: false,
  promotionBar: {
    active: true,
    text: "Building a polished Next.js project from scratch",
    link: "blog/building-polished-nextjs-project",
    badgeText: "My New Blog",
  },
  resumeUrl: "",
  resumeFileName: "Avdhesh_Kumar_Resume.pdf",
  resumeUpdatedAt: new Date(),
  updatedAt: new Date(),
  socialLinks: { ...defaultSocialLinks },
};

const inMemoryInquiries: any[] = [
  {
    _id: "inq_sample_1",
    type: "contact",
    name: "Vikram Malhotra",
    email: "vikram.m@techcorp.io",
    subject: "Full-Stack Web App Development Project",
    message: "Hi Avdhesh, I came across your portfolio and was thoroughly impressed by your BCA Point and BiteFlow projects. We have an upcoming client portal project and would love to discuss your availability for a contract or full-time role.",
    status: "unread",
    metadata: { source: "Contact Page Form" },
    createdAt: new Date(Date.now() - 2 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000),
  },
  {
    _id: "lead_sample_2",
    type: "popup",
    name: "Ananya Sharma",
    email: "ananya.sharma@designlabs.co",
    subject: "Stay in Touch Popup Subscription",
    message: "Subscribed via Stay Connected popup modal to receive new engineering essays and tech case studies.",
    status: "unread",
    metadata: { source: "Stay Connected Popup" },
    createdAt: new Date(Date.now() - 6 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000),
  },
  {
    _id: "fb_sample_3",
    type: "feedback",
    name: "Rohan Verma",
    email: "rohan.v@devcommunity.org",
    subject: "Feedback: Portfolio UI (5★)",
    message: "The neo-brutalist aesthetic with #D4F050 accent and mascot interactions is exceptional! Super fast loading speed as well.",
    rating: 5,
    category: "Design & UX",
    status: "read",
    metadata: { source: "Feedback Modal" },
    createdAt: new Date(Date.now() - 24 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000),
  },
];
const inMemoryLikes: Record<string, number> = {
  "1": 42,
  "2": 37,
  "3": 29,
  "4": 31,
  "5": 19,
  "blog-1": 84,
  "blog-2": 67,
  "blog-3": 53,
  "blog-4": 49,
};

const inMemoryProjects: any[] = [];
const inMemoryBlogs: any[] = [];
const inMemoryGallery: any[] = [];

// --- Public Site Settings (Resume & Social Links) ---
app.get("/api/settings", async (req: Request, res: Response) => {
  try {
    let settings = null;
    if (isMongoDBConnected()) {
      settings = await SiteSettings.findOne({ key: "portfolio_settings" });
    }
    if (!settings) {
      settings = inMemorySiteSettings;
    }
    return res.json({ success: true, settings });
  } catch (err) {
    console.error("Error fetching site settings:", err);
    return res.json({ success: true, settings: inMemorySiteSettings });
  }
});

// --- Public Contact Form Submission ---
app.post("/api/contact", async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message, metadata } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Verify email with Abstract API to reject wrong / fake / undeliverable addresses
    const emailVerification = await verifyEmailWithAbstract(email.trim(), "contact");
    if (!emailVerification.valid) {
      return res.status(400).json({
        error: emailVerification.error || "Please enter a valid, deliverable email address.",
        suggestedCorrection: emailVerification.suggestedCorrection || null,
      });
    }

    const newInquiry = {
      type: "contact",
      name: (name || "Anonymous").trim(),
      email: email.trim().toLowerCase(),
      subject: (subject || "General Inquiry").trim(),
      message: message.trim(),
      status: "unread",
      metadata: metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let savedItem: any = null;

    if (isMongoDBConnected()) {
      try {
        const dbItem = await Inquiry.create(newInquiry);
        savedItem = dbItem;
      } catch (dbErr) {
        console.warn("MongoDB save for contact inquiry failed, kept in memory:", dbErr);
      }
    }

    // Only fallback to in-memory storage if MongoDB is not connected or failed
    if (!savedItem) {
      savedItem = {
        ...newInquiry,
        _id: "inq_" + Date.now(),
      };
      inMemoryInquiries.unshift(savedItem);
    }

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully! Avdhesh will get back to you soon.",
      data: savedItem,
    });
  } catch (err: any) {
    console.error("Error submitting contact form:", err);
    return res.status(500).json({ error: "Failed to submit message", details: err.message });
  }
});

// --- Public Popup Lead (Stay Connected) ---
app.post("/api/popup-lead", async (req: Request, res: Response) => {
  try {
    const { email, name, metadata } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }

    const newLead = {
      type: "popup",
      name: (name || "Newsletter Subscriber").trim(),
      email: email.trim().toLowerCase(),
      subject: "Stay in Touch Popup Subscription",
      message: "Subscribed via Stay Connected popup modal",
      status: "unread",
      metadata: metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let savedItem: any = null;

    if (isMongoDBConnected()) {
      try {
        const dbItem = await Inquiry.create(newLead);
        savedItem = dbItem;
      } catch (dbErr) {
        console.warn("MongoDB save for popup lead failed, kept in memory:", dbErr);
      }
    }

    if (!savedItem) {
      savedItem = {
        ...newLead,
        _id: "lead_" + Date.now(),
      };
      inMemoryInquiries.unshift(savedItem);
    }

    return res.status(201).json({
      success: true,
      message: "Thank you for subscribing!",
      data: savedItem,
    });
  } catch (err: any) {
    console.error("Error saving popup lead:", err);
    return res.status(500).json({ error: "Failed to save subscription" });
  }
});

// --- Public Feedback Submission ---
app.post("/api/feedback", async (req: Request, res: Response) => {
  try {
    const { name, email, rating, category, message, metadata } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Feedback comment is required" });
    }

    const newFeedback = {
      type: "feedback",
      name: (name || "Portfolio Visitor").trim(),
      email: (email || "visitor@feedback.com").trim().toLowerCase(),
      subject: `Feedback: ${category || "General"} (${rating || 5}★)`,
      message: message.trim(),
      rating: Number(rating) || 5,
      category: category || "General",
      status: "unread",
      metadata: metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let savedItem: any = null;

    if (isMongoDBConnected()) {
      try {
        const dbItem = await Inquiry.create(newFeedback);
        savedItem = dbItem;
      } catch (dbErr) {
        console.warn("MongoDB save for feedback failed, kept in memory:", dbErr);
      }
    }

    if (!savedItem) {
      savedItem = {
        ...newFeedback,
        _id: "fb_" + Date.now(),
      };
      inMemoryInquiries.unshift(savedItem);
    }

    return res.status(201).json({
      success: true,
      message: "Thank you for your valuable feedback!",
      data: savedItem,
    });
  } catch (err: any) {
    console.error("Error saving feedback:", err);
    return res.status(500).json({ error: "Failed to submit feedback" });
  }
});

// --- Public Likes API (Project & Blog) ---
app.get("/api/likes", async (req: Request, res: Response) => {
  try {
    const likesMap: Record<string, number> = { ...inMemoryLikes };

    if (isMongoDBConnected()) {
      const [projects, blogs] = await Promise.all([
        Project.find().select("_id slug likes"),
        BlogPost.find().select("_id slug likes"),
      ]);
      projects.forEach((p: any) => {
        if (p.likes !== undefined) {
          likesMap[p._id.toString()] = p.likes;
          if (p.slug) likesMap[p.slug] = p.likes;
        }
      });
      blogs.forEach((b: any) => {
        if (b.likes !== undefined) {
          likesMap[b._id.toString()] = b.likes;
          if (b.slug) likesMap[b.slug] = b.likes;
        }
      });
    }

    return res.json({ success: true, likes: likesMap });
  } catch (err) {
    console.error("Error fetching likes:", err);
    return res.json({ success: true, likes: inMemoryLikes });
  }
});

app.post("/api/projects/:id/like", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const action = req.body?.action || "like";
    const delta = action === "unlike" ? -1 : 1;

    let current = inMemoryLikes[id] !== undefined ? inMemoryLikes[id] : 0;
    let newLikes = Math.max(0, current + delta);
    inMemoryLikes[id] = newLikes;

    if (isMongoDBConnected()) {
      let doc: any = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        doc = await Project.findByIdAndUpdate(id, { $inc: { likes: delta } }, { new: true });
      }
      if (!doc) {
        doc = await Project.findOneAndUpdate({ slug: id }, { $inc: { likes: delta } }, { new: true });
      }
      if (doc) {
        if (doc.likes < 0) {
          doc.likes = 0;
          await doc.save();
        }
        newLikes = Math.max(0, doc.likes);
        inMemoryLikes[id] = newLikes;
        if (doc.slug) inMemoryLikes[doc.slug] = newLikes;
      }
    }

    return res.json({ success: true, likes: newLikes });
  } catch (err) {
    console.error("Error toggling project like:", err);
    const id = req.params.id;
    const action = req.body?.action || "like";
    const delta = action === "unlike" ? -1 : 1;
    const current = inMemoryLikes[id] !== undefined ? inMemoryLikes[id] : 0;
    inMemoryLikes[id] = Math.max(0, current + delta);
    return res.json({ success: true, likes: inMemoryLikes[id] });
  }
});

app.post("/api/blog/:id/like", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const action = req.body?.action || "like";
    const delta = action === "unlike" ? -1 : 1;

    let current = inMemoryLikes[id] !== undefined ? inMemoryLikes[id] : 0;
    let newLikes = Math.max(0, current + delta);
    inMemoryLikes[id] = newLikes;

    if (isMongoDBConnected()) {
      let doc: any = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        doc = await BlogPost.findByIdAndUpdate(id, { $inc: { likes: delta } }, { new: true });
      }
      if (!doc) {
        doc = await BlogPost.findOneAndUpdate({ slug: id }, { $inc: { likes: delta } }, { new: true });
      }
      if (doc) {
        if (doc.likes < 0) {
          doc.likes = 0;
          await doc.save();
        }
        newLikes = Math.max(0, doc.likes);
        inMemoryLikes[id] = newLikes;
        if (doc.slug) inMemoryLikes[doc.slug] = newLikes;
      }
    }

    return res.json({ success: true, likes: newLikes });
  } catch (err) {
    console.error("Error toggling blog like:", err);
    const id = req.params.id;
    const action = req.body?.action || "like";
    const delta = action === "unlike" ? -1 : 1;
    const current = inMemoryLikes[id] !== undefined ? inMemoryLikes[id] : 0;
    inMemoryLikes[id] = Math.max(0, current + delta);
    return res.json({ success: true, likes: inMemoryLikes[id] });
  }
});

// ==========================================
// BUY ME A CHAI & PHONEPE PAYMENT ROUTES
// ==========================================

// In-memory fallback in case MongoDB is temporarily disconnected or using initial session
const inMemoryDonations: any[] = [];

// Helper to determine base URL
function getAppBaseUrl(req: Request): string {
  if (process.env.APP_URL && !process.env.APP_URL.includes("localhost")) {
    return process.env.APP_URL.replace(/\/$/, "");
  }
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
  const host = req.headers["x-forwarded-host"] || req.get("host") || "localhost:3000";
  return `${protocol}://${host}`;
}

// 1. GET /api/donations/supporters - List of verified supporters
app.get("/api/donations/supporters", async (req: Request, res: Response) => {
  try {
    let completedDonations: any[] = [];

    if (isMongoDBConnected()) {
      completedDonations = await Donation.find({ status: "COMPLETED" })
        .sort({ createdAt: -1 })
        .lean();
    } else {
      completedDonations = inMemoryDonations
        .filter((d) => d.status === "COMPLETED")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const totalSupporters = completedDonations.length;
    const totalAmount = completedDonations.reduce((acc, d) => acc + (d.amount || 0), 0);
    
    // Find absolute top supporter by highest amount
    let topSupporter = null;
    if (completedDonations.length > 0) {
      topSupporter = [...completedDonations].sort((a, b) => b.amount - a.amount)[0];
    }

    return res.json({
      success: true,
      supporters: completedDonations,
      stats: {
        totalSupporters,
        totalAmount,
        topSupporter,
      },
    });
  } catch (err: any) {
    console.error("Error fetching supporters:", err);
    return res.status(500).json({ error: "Failed to fetch supporters list" });
  }
});

// 2. POST /api/razorpay/create-order - Create Razorpay Order
app.post("/api/razorpay/create-order", async (req: Request, res: Response) => {
  try {
    const { supporterName, message, amount, avatar } = req.body;
    const parsedAmount = Number(amount);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount < 1) {
      return res.status(400).json({ error: "Please enter a valid donation amount of at least ₹1." });
    }

    const cleanName = (supporterName || "Anonymous").toString().trim().slice(0, 50);
    const cleanMessage = (message || "Keep building great stuff! ☕").toString().trim().slice(0, 300);
    const cleanAvatar = (avatar || "chai-cup").toString().trim().slice(0, 40);

    const razorpay = getRazorpayInstance();
    const amountInPaise = Math.round(parsedAmount * 100);

    const orderOptions = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      notes: {
        supporterName: cleanName,
        message: cleanMessage,
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    const merchantTransactionId = order.id; // use Razorpay order id as transaction reference

    const newDonationData = {
      supporterName: cleanName,
      message: cleanMessage,
      amount: parsedAmount,
      avatar: cleanAvatar,
      merchantTransactionId,
      status: "PENDING",
      paymentMethod: "RAZORPAY",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isMongoDBConnected()) {
      await Donation.create(newDonationData);
    } else {
      inMemoryDonations.push(newDonationData);
    }

    return res.json({
      success: true,
      orderId: order.id,
      amount: amountInPaise,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_TfKwgALCzFrTl9",
      supporterName: cleanName,
      merchantTransactionId,
    });
  } catch (err: any) {
    console.error("Error creating Razorpay order:", err);
    return res.status(500).json({ error: "Failed to create Razorpay order", details: err.message });
  }
});

// 3. POST /api/razorpay/verify - Verify Razorpay payment signature
app.post("/api/razorpay/verify", async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment verification parameters." });
    }

    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      return res.status(400).json({ success: false, error: "Invalid payment signature verification." });
    }

    let donation: any = null;
    if (isMongoDBConnected()) {
      donation = await Donation.findOneAndUpdate(
        { merchantTransactionId: razorpay_order_id },
        { status: "COMPLETED", phonepeTransactionId: razorpay_payment_id, updatedAt: new Date() },
        { new: true }
      );
    } else {
      const inMem = inMemoryDonations.find((d) => d.merchantTransactionId === razorpay_order_id);
      if (inMem) {
        inMem.status = "COMPLETED";
        inMem.phonepeTransactionId = razorpay_payment_id;
        donation = inMem;
      }
    }

    return res.json({
      success: true,
      donation,
      message: "Payment verified successfully via Razorpay!",
    });
  } catch (err: any) {
    console.error("Error verifying Razorpay payment:", err);
    return res.status(500).json({ error: "Payment verification failed", details: err.message });
  }
});

// 4. GET /api/donations/verify/:txId - Explicit status verification
app.get("/api/donations/verify/:txId", async (req: Request, res: Response) => {
  try {
    const { txId } = req.params;
    let donation: any = null;

    if (isMongoDBConnected()) {
      donation = await Donation.findOne({ merchantTransactionId: txId });
    } else {
      donation = inMemoryDonations.find((d) => d.merchantTransactionId === txId);
    }

    if (!donation) {
      return res.status(404).json({ error: "Donation record not found." });
    }

    return res.json({
      success: true,
      donation,
      status: donation.status,
    });
  } catch (err: any) {
    console.error("Error verifying donation:", err);
    return res.status(500).json({ error: "Verification check failed" });
  }
});

// 5. POST /api/donations/simulate-success - Sandbox test payment simulation
app.post("/api/donations/simulate-success", async (req: Request, res: Response) => {
  try {
    const { txId } = req.body;
    if (!txId) return res.status(400).json({ error: "Transaction ID is required." });

    let updatedDonation: any = null;
    const rzpPayId = `pay_rzp_${Date.now()}`;

    if (isMongoDBConnected()) {
      updatedDonation = await Donation.findOneAndUpdate(
        { merchantTransactionId: txId },
        { status: "COMPLETED", phonepeTransactionId: rzpPayId, updatedAt: new Date() },
        { new: true }
      );
    } else {
      const inMem = inMemoryDonations.find((d) => d.merchantTransactionId === txId);
      if (inMem) {
        inMem.status = "COMPLETED";
        inMem.phonepeTransactionId = rzpPayId;
        updatedDonation = inMem;
      }
    }

    return res.json({
      success: true,
      donation: updatedDonation,
      message: "Test Razorpay payment successfully verified!",
    });
  } catch (err: any) {
    console.error("Simulation error:", err);
    return res.status(500).json({ error: "Failed to simulate verification" });
  }
});


// ==========================================
// ADMIN CMS API ROUTES (Protected)
// ==========================================

// Dashboard Stats
app.get("/api/admin/stats", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    const [
      totalProjects,
      publishedProjects,
      draftProjects,
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalGallery,
      recentProjects,
      recentBlogs,
      totalInquiries,
      unreadInquiries,
      contactCount,
      popupCount,
      feedbackCount
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: "published" }),
      Project.countDocuments({ status: "draft" }),
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ status: "published" }),
      BlogPost.countDocuments({ status: "draft" }),
      Gallery.countDocuments(),
      Project.find().sort({ createdAt: -1 }).limit(5),
      BlogPost.find().sort({ createdAt: -1 }).limit(5),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: "unread" }),
      Inquiry.countDocuments({ type: "contact" }),
      Inquiry.countDocuments({ type: "popup" }),
      Inquiry.countDocuments({ type: "feedback" }),
    ]);

    return res.json({
      stats: {
        totalProjects,
        publishedProjects,
        draftProjects,
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        totalGallery,
        totalInquiries,
        unreadInquiries,
        contactCount,
        popupCount,
        feedbackCount,
      },
      recentContent: {
        projects: recentProjects,
        blogs: recentBlogs,
      }
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    return res.status(500).json({ error: "Failed to load dashboard stats" });
  }
});

// Media Upload to Cloudinary
app.post("/api/admin/upload", verifyAdminToken, upload.single("image"), async (req: AdminAuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }
    const uploadResult = await uploadToCloudinary(req.file.buffer, "portfolio_cms");
    return res.json({
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: err.message || "Failed to upload image to Cloudinary." });
  }
});

// --- Projects Admin CRUD ---
app.get("/api/admin/projects", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.json(projects);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch projects" });
  }
});

app.post("/api/admin/projects", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    const data = req.body;
    let baseSlug = data.slug || (data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : "project");
    if (!baseSlug) baseSlug = "project";
    let candidateSlug = baseSlug;
    let counter = 1;
    while (await Project.findOne({ slug: candidateSlug })) {
      counter++;
      candidateSlug = `${baseSlug}-${counter}`;
    }
    data.slug = candidateSlug;

    if (!data.imageAlt) {
      data.imageAlt = data.title || "Project preview";
    }
    if (!data.featuredImage) {
      data.featuredImage = "";
    }
    if (data.status === "published" && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    const project = await Project.create(data);
    return res.status(201).json(project);
  } catch (err: any) {
    console.error("Create project error:", err);
    return res.status(400).json({ error: err.message || "Failed to create project" });
  }
});

app.put("/api/admin/projects/:id", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    const data = req.body;
    let baseSlug = data.slug || (data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : "project");
    if (!baseSlug) baseSlug = "project";
    let candidateSlug = baseSlug;
    let counter = 1;
    while (await Project.findOne({ slug: candidateSlug, _id: { $ne: req.params.id } })) {
      counter++;
      candidateSlug = `${baseSlug}-${counter}`;
    }
    data.slug = candidateSlug;

    if (!data.imageAlt && data.title) {
      data.imageAlt = data.title || "Project preview";
    }
    if (data.status === "published" && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    data.updatedAt = new Date();
    const updated = await Project.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updated) return res.status(404).json({ error: "Project not found" });
    return res.json(updated);
  } catch (err: any) {
    console.error("Update project error:", err);
    return res.status(400).json({ error: err.message || "Failed to update project" });
  }
});

app.delete("/api/admin/projects/:id", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Project not found" });
    return res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete project" });
  }
});

// --- Blog Admin CRUD ---
app.get("/api/admin/blog", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    let posts: any[] = [];
    if (isMongoDBConnected()) {
      try {
        posts = await BlogPost.find().sort({ createdAt: -1 });
      } catch (dbErr) {
        console.warn("MongoDB blog find failed:", dbErr);
      }
    }
    if (!posts || posts.length === 0) {
      posts = inMemoryBlogs;
    } else {
      const dbSlugs = new Set(posts.map(p => p.slug));
      inMemoryBlogs.forEach(b => {
        if (!dbSlugs.has(b.slug)) {
          posts.push(b);
        }
      });
    }
    return res.json(posts);
  } catch (err) {
    return res.json(inMemoryBlogs);
  }
});

app.post("/api/admin/blog", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    const data = req.body;
    let baseSlug = data.slug || (data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : "blog-post");
    if (!baseSlug) baseSlug = "blog-post";
    let candidateSlug = baseSlug;
    let counter = 1;

    if (isMongoDBConnected()) {
      try {
        while (await BlogPost.findOne({ slug: candidateSlug })) {
          counter++;
          candidateSlug = `${baseSlug}-${counter}`;
        }
      } catch (e) {}
    } else {
      while (inMemoryBlogs.some(b => b.slug === candidateSlug)) {
        counter++;
        candidateSlug = `${baseSlug}-${counter}`;
      }
    }
    data.slug = candidateSlug;

    if (!data.imageAlt) {
      data.imageAlt = data.title || "Blog cover";
    }
    if (!data.featuredImage) {
      data.featuredImage = "";
    }
    if (data.status === "published" && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    let post: any = null;
    if (isMongoDBConnected()) {
      try {
        post = await BlogPost.create(data);
      } catch (dbErr) {
        console.warn("MongoDB create blog failed, storing in memory:", dbErr);
      }
    }

    if (!post) {
      post = {
        _id: "blog_" + Date.now(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    inMemoryBlogs.unshift(post);

    return res.status(201).json(post);
  } catch (err: any) {
    console.error("Create blog error:", err);
    const data = req.body;
    const post = {
      _id: "blog_" + Date.now(),
      ...data,
      slug: data.slug || "blog-" + Date.now(),
      status: data.status || "published",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryBlogs.unshift(post);
    return res.status(201).json(post);
  }
});

app.put("/api/admin/blog/:id", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    const data = req.body;
    let baseSlug = data.slug || (data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : "blog-post");
    if (!baseSlug) baseSlug = "blog-post";
    let candidateSlug = baseSlug;
    let counter = 1;

    if (isMongoDBConnected()) {
      try {
        while (await BlogPost.findOne({ slug: candidateSlug, _id: { $ne: req.params.id } })) {
          counter++;
          candidateSlug = `${baseSlug}-${counter}`;
        }
      } catch (e) {}
    }
    data.slug = candidateSlug;

    if (!data.imageAlt && data.title) {
      data.imageAlt = data.title || "Blog cover";
    }
    if (data.status === "published" && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    data.updatedAt = new Date();

    let updated: any = null;
    if (isMongoDBConnected()) {
      try {
        updated = await BlogPost.findByIdAndUpdate(req.params.id, data, { new: true });
      } catch (dbErr) {
        console.warn("MongoDB update blog failed:", dbErr);
      }
    }

    const idx = inMemoryBlogs.findIndex(b => b._id === req.params.id || b.id === req.params.id);
    if (idx !== -1) {
      inMemoryBlogs[idx] = { ...inMemoryBlogs[idx], ...data, updatedAt: new Date() };
      if (!updated) updated = inMemoryBlogs[idx];
    } else if (!updated) {
      updated = { _id: req.params.id, ...data, createdAt: new Date() };
      inMemoryBlogs.unshift(updated);
    }

    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "Failed to update blog post" });
  }
});

app.delete("/api/admin/blog/:id", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    if (isMongoDBConnected()) {
      try {
        await BlogPost.findByIdAndDelete(req.params.id);
      } catch (e) {}
    }
    const idx = inMemoryBlogs.findIndex(b => b._id === req.params.id || b.id === req.params.id);
    if (idx !== -1) {
      inMemoryBlogs.splice(idx, 1);
    }
    return res.json({ success: true, message: "Blog post deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete blog post" });
  }
});

// --- Gallery Admin CRUD ---
app.get("/api/admin/gallery", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch gallery items" });
  }
});

app.post("/api/admin/gallery", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    const item = await Gallery.create(req.body);
    return res.status(201).json(item);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "Failed to create gallery item" });
  }
});

app.put("/api/admin/gallery/:id", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    const updated = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Gallery item not found" });
    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "Failed to update gallery item" });
  }
});

app.delete("/api/admin/gallery/:id", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Gallery item not found" });

    if (item.public_id) {
      await deleteFromCloudinary(item.public_id);
    }
    await Gallery.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Gallery item deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete gallery item" });
  }
});

// --- Categories Admin CRUD ---
app.get("/api/admin/categories", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.json(categories);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.post("/api/admin/categories", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    let { name, slug, type } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Category name is required." });
    }
    name = name.trim();
    if (!slug || !slug.trim()) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    } else {
      slug = slug.trim().toLowerCase();
    }
    type = type || "blog";

    const safeName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let existing = await Category.findOne({
      $or: [
        { slug, type },
        { name: new RegExp(`^${safeName}$`, "i"), type }
      ]
    });
    if (existing) {
      return res.status(200).json(existing);
    }
    const cat = await Category.create({ name, slug, type });
    return res.status(201).json(cat);
  } catch (err: any) {
    console.error("Create category error:", err);
    return res.status(400).json({ error: err.message || "Failed to create category" });
  }
});

app.put("/api/admin/categories/:id", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Category not found" });
    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "Failed to update category" });
  }
});

app.delete("/api/admin/categories/:id", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Category not found" });
    return res.json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete category" });
  }
});

// --- SEO Settings Admin ---
app.put("/api/admin/seo/:page", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    const page = req.params.page;
    const data = req.body;
    data.updatedAt = new Date();
    const updated = await SEOPageSettings.findOneAndUpdate({ page }, data, { new: true, upsert: true });
    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "Failed to update SEO settings" });
  }
});

// --- Site Settings Admin (Resume & Social Links) ---
app.get("/api/admin/settings", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    let settings = null;
    if (isMongoDBConnected()) {
      settings = await SiteSettings.findOne({ key: "portfolio_settings" });
    }
    if (!settings) {
      settings = inMemorySiteSettings;
    }
    return res.json({ success: true, settings });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to fetch settings" });
  }
});

app.put("/api/admin/settings", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    const { resumeUrl, resumeFileName, socialLinks, themeBg, promotionBar, showFeedbackButton } = req.body;
    const updateData: any = { updatedAt: new Date() };
    if (resumeUrl !== undefined) updateData.resumeUrl = resumeUrl;
    if (resumeFileName !== undefined) updateData.resumeFileName = resumeFileName;
    if (resumeUrl) updateData.resumeUpdatedAt = new Date();
    if (socialLinks) updateData.socialLinks = socialLinks;
    if (themeBg !== undefined) updateData.themeBg = themeBg;
    if (showFeedbackButton !== undefined) updateData.showFeedbackButton = Boolean(showFeedbackButton);
    if (promotionBar !== undefined) updateData.promotionBar = promotionBar;

    let updated = null;
    if (isMongoDBConnected()) {
      updated = await SiteSettings.findOneAndUpdate(
        { key: "portfolio_settings" },
        { $set: updateData },
        { new: true, upsert: true }
      );
    } else {
      inMemorySiteSettings = {
        ...inMemorySiteSettings,
        ...updateData,
        socialLinks: {
          ...inMemorySiteSettings.socialLinks,
          ...(socialLinks || {}),
        },
        promotionBar: {
          ...inMemorySiteSettings.promotionBar,
          ...(promotionBar || {}),
        },
      };
      updated = inMemorySiteSettings;
    }

    return res.json({ success: true, settings: updated });
  } catch (err: any) {
    console.error("Error updating site settings:", err);
    return res.status(500).json({ error: "Failed to update settings" });
  }
});

// Dedicated Public Promotion Bar endpoint
app.get("/api/promotion", async (req: Request, res: Response) => {
  try {
    let settings = null;
    if (isMongoDBConnected()) {
      settings = await SiteSettings.findOne({ key: "portfolio_settings" });
    }
    const promo = settings?.promotionBar || inMemorySiteSettings.promotionBar;
    return res.json({ success: true, promotionBar: promo });
  } catch (err) {
    return res.json({ success: true, promotionBar: inMemorySiteSettings.promotionBar });
  }
});

// Dedicated Admin Promotion Bar endpoint
app.put("/api/admin/promotion", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    const { active, text, link, badgeText } = req.body;
    const promoData = {
      active: active !== undefined ? Boolean(active) : true,
      text: text || "",
      link: link || "",
      badgeText: badgeText || "Announcement",
    };

    let updated = null;
    if (isMongoDBConnected()) {
      updated = await SiteSettings.findOneAndUpdate(
        { key: "portfolio_settings" },
        { $set: { promotionBar: promoData, updatedAt: new Date() } },
        { new: true, upsert: true }
      );
    } else {
      inMemorySiteSettings = {
        ...inMemorySiteSettings,
        promotionBar: promoData,
        updatedAt: new Date(),
      };
      updated = inMemorySiteSettings;
    }

    return res.json({ success: true, promotionBar: updated?.promotionBar || promoData });
  } catch (err: any) {
    console.error("Error updating promotion bar:", err);
    return res.status(500).json({ error: "Failed to update promotion bar" });
  }
});

// Resume File Upload (PDF / Document)
app.post("/api/admin/resume/upload", verifyAdminToken, upload.single("resume"), async (req: AdminAuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume file provided." });
    }

    let fileUrl = "";
    const originalName = req.file.originalname || "Avdhesh_Kumar_Resume.pdf";

    // Attempt Cloudinary upload with auto/raw type for PDF
    try {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "portfolio_resume", "auto");
      fileUrl = uploadResult.secure_url;
    } catch (cloudErr) {
      console.warn("Cloudinary upload failed for resume, falling back to base64 data URI storage:", cloudErr);
      const mime = req.file.mimetype || "application/pdf";
      fileUrl = `data:${mime};base64,${req.file.buffer.toString("base64")}`;
    }

    // Update settings in database
    const updatePayload = {
      resumeUrl: fileUrl,
      resumeFileName: originalName,
      resumeUpdatedAt: new Date(),
    };

    if (isMongoDBConnected()) {
      await SiteSettings.findOneAndUpdate(
        { key: "portfolio_settings" },
        { $set: updatePayload },
        { upsert: true, new: true }
      );
    } else {
      inMemorySiteSettings = {
        ...inMemorySiteSettings,
        ...updatePayload,
      };
    }

    return res.json({
      success: true,
      resumeUrl: fileUrl,
      resumeFileName: originalName,
      message: "Resume updated successfully!",
    });
  } catch (err: any) {
    console.error("Resume upload error:", err);
    return res.status(500).json({ error: err.message || "Failed to upload resume file" });
  }
});

// --- Admin Inquiries & Submissions CRUD ---
app.get("/api/admin/inquiries", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    const { type, status, search } = req.query;
    let list: any[] = [];

    if (isMongoDBConnected()) {
      try {
        const query: any = {};
        if (type && type !== "all") query.type = type;
        if (status && status !== "all") query.status = status;
        if (search) {
          query.$or = [
            { name: { $regex: String(search), $options: "i" } },
            { email: { $regex: String(search), $options: "i" } },
            { message: { $regex: String(search), $options: "i" } },
            { subject: { $regex: String(search), $options: "i" } },
          ];
        }
        list = await Inquiry.find(query).sort({ createdAt: -1 });
      } catch (dbErr) {
        console.warn("MongoDB find inquiries failed, falling back to memory:", dbErr);
      }
    }

    // Merge any memory inquiries that aren't already represented in the DB list
    for (const mem of inMemoryInquiries) {
      // Check if already in list by ID or by matching type, email, message and timestamp within 2 minutes
      const isDuplicate = list.some(
        (i: any) =>
          String(i._id) === String(mem._id) ||
          (i.type === mem.type &&
            i.email?.toLowerCase() === mem.email?.toLowerCase() &&
            i.message?.trim() === mem.message?.trim() &&
            Math.abs(new Date(i.createdAt).getTime() - new Date(mem.createdAt).getTime()) < 120000)
      );

      if (!isDuplicate) {
        let match = true;
        if (type && type !== "all" && mem.type !== type) match = false;
        if (status && status !== "all" && mem.status !== status) match = false;
        if (search) {
          const s = String(search).toLowerCase();
          const matches =
            (mem.name && mem.name.toLowerCase().includes(s)) ||
            (mem.email && mem.email.toLowerCase().includes(s)) ||
            (mem.message && mem.message.toLowerCase().includes(s)) ||
            (mem.subject && mem.subject.toLowerCase().includes(s));
          if (!matches) match = false;
        }
        if (match) {
          list.push(mem);
        }
      }
    }

    // Deduplicate any pre-existing duplicate entries that were previously saved in the DB
    const uniqueList: any[] = [];
    for (const item of list) {
      const alreadyPresent = uniqueList.some(
        (u) =>
          u.type === item.type &&
          u.email?.toLowerCase() === item.email?.toLowerCase() &&
          u.message?.trim() === item.message?.trim() &&
          Math.abs(new Date(u.createdAt).getTime() - new Date(item.createdAt).getTime()) < 60000
      );
      if (!alreadyPresent) {
        uniqueList.push(item);
      }
    }
    list = uniqueList;

    // Sort descending by createdAt
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    // Compute stats from all available records
    const allRecords = [...list];
    for (const mem of inMemoryInquiries) {
      if (!allRecords.some((r) => String(r._id) === String(mem._id))) {
        allRecords.push(mem);
      }
    }

    const total = allRecords.length;
    const unread = allRecords.filter((i) => i.status === "unread").length;
    const contacts = allRecords.filter((i) => i.type === "contact").length;
    const popups = allRecords.filter((i) => i.type === "popup").length;
    const feedbacks = allRecords.filter((i) => i.type === "feedback").length;

    return res.json({
      inquiries: list,
      stats: { total, unread, contacts, popups, feedbacks },
    });
  } catch (err: any) {
    console.error("Error fetching inquiries:", err);
    return res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

app.put("/api/admin/inquiries/:id/status", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ["unread", "read", "replied", "archived"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    let updated: any = null;
    if (isMongoDBConnected()) {
      try {
        updated = await Inquiry.findByIdAndUpdate(
          req.params.id,
          { status, updatedAt: new Date() },
          { new: true }
        );
      } catch (dbErr) {
        console.warn("MongoDB update inquiry failed:", dbErr);
      }
    }

    const memItem = inMemoryInquiries.find((i) => String(i._id) === String(req.params.id));
    if (memItem) {
      memItem.status = status;
      memItem.updatedAt = new Date();
      if (!updated) updated = memItem;
    }

    if (!updated && !memItem) {
      return res.status(404).json({ error: "Inquiry not found" });
    }

    return res.json({ success: true, inquiry: updated || memItem });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to update inquiry status" });
  }
});

app.delete("/api/admin/inquiries/:id", verifyAdminToken, async (req: AdminAuthRequest, res: Response) => {
  try {
    if (isMongoDBConnected()) {
      try {
        await Inquiry.findByIdAndDelete(req.params.id);
      } catch (dbErr) {
        console.warn("MongoDB delete inquiry failed:", dbErr);
      }
    }
    const idx = inMemoryInquiries.findIndex((i) => String(i._id) === String(req.params.id));
    if (idx !== -1) inMemoryInquiries.splice(idx, 1);

    return res.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to delete inquiry" });
  }
});


// ==========================================
// DYNAMIC SITEMAP & ROBOTS.TXT
// ==========================================

app.get("/sitemap.xml", async (req: Request, res: Response) => {
  try {
    const baseUrl = process.env.APP_URL || "https://ais-dev-2evl5cli54boiv62bbeocg-271997554173.asia-southeast1.run.app";
    
    const [publishedProjects, publishedBlogs] = await Promise.all([
      Project.find({ status: "published" }).select("slug updatedAt"),
      BlogPost.find({ status: "published" }).select("slug updatedAt"),
    ]);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    const staticPages = ["", "about", "projects", "blog", "gallery", "contact"];
    staticPages.forEach((page) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/${page}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>${page === "" ? "1.0" : "0.8"}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Project dynamic pages
    publishedProjects.forEach((proj) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/projects/${proj.slug}</loc>\n`;
      xml += `    <lastmod>${proj.updatedAt ? proj.updatedAt.toISOString() : new Date().toISOString()}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    });

    // Blog dynamic pages
    publishedBlogs.forEach((post) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
      xml += `    <lastmod>${post.updatedAt ? post.updatedAt.toISOString() : new Date().toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header("Content-Type", "application/xml");
    return res.send(xml);
  } catch (err) {
    console.error("Error generating sitemap:", err);
    return res.status(500).send("Error generating sitemap");
  }
});

app.get("/robots.txt", (req: Request, res: Response) => {
  const baseUrl = process.env.APP_URL || "https://ais-dev-2evl5cli54boiv62bbeocg-271997554173.asia-southeast1.run.app";
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/admin/

Sitemap: ${baseUrl}/sitemap.xml`;

  res.header("Content-Type", "text/plain");
  return res.send(robots);
});


// ==========================================
// DYNAMIC SEO & SOCIAL SHARING META RESOLVER
// ==========================================

interface PageMeta {
  title: string;
  description: string;
  image: string;
  url: string;
  type: "website" | "article";
  category?: string;
  publishedTime?: string;
  schema?: Record<string, any>;
}

async function resolvePageMeta(reqPath: string, query: any, reqHost: string, proto: string): Promise<PageMeta> {
  const baseUrl = `${proto}://${reqHost}`;
  const defaultImage = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80";

  const cleanPath = reqPath.replace(/^\/+|\/+$/g, "").toLowerCase();

  // 1. Check for Blog Post: /blog/:slug or /blogs/:slug or ?blog=...
  if (cleanPath.startsWith("blog/") || cleanPath.startsWith("blogs/") || query.blog) {
    const slug = (cleanPath.replace(/^blogs?\//, "") || query.blog || "").toLowerCase();
    try {
      const isObjectId = mongoose.Types.ObjectId.isValid(slug);
      const queryCond: any[] = [{ slug }];
      if (isObjectId) {
        queryCond.push({ _id: slug });
      }
      const post = await BlogPost.findOne({ $or: queryCond });
      if (post) {
        const title = `${post.title} — Avdhesh Kumar Journal`;
        const rawContent = post.content ? post.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
        const description = post.excerpt || rawContent.slice(0, 155) || "Read technical writeup and engineering insights by Avdhesh Kumar.";
        const image = post.featuredImage || defaultImage;
        const pageUrl = `${baseUrl}/blog/${post.slug || slug}`;

        return {
          title,
          description,
          image,
          url: pageUrl,
          type: "article",
          category: post.category,
          publishedTime: post.publishedAt ? post.publishedAt.toISOString() : undefined,
          schema: {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": description,
            "image": [image],
            "author": {
              "@type": "Person",
              "name": "Avdhesh Kumar",
              "url": baseUrl
            },
            "publisher": {
              "@type": "Person",
              "name": "Avdhesh Kumar"
            },
            "datePublished": post.publishedAt ? post.publishedAt.toISOString() : post.createdAt?.toISOString(),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": pageUrl
            }
          }
        };
      }
    } catch (err) {
      console.warn("Error resolving blog metadata for SEO:", err);
    }
  }

  // 2. Check for Project: /projects/:slug or /project/:slug or ?project=...
  if (cleanPath.startsWith("projects/") || cleanPath.startsWith("project/") || query.project) {
    const slug = (cleanPath.replace(/^projects?\//, "") || query.project || "").toLowerCase();
    try {
      const isObjectId = mongoose.Types.ObjectId.isValid(slug);
      const queryCond: any[] = [{ slug }];
      if (isObjectId) {
        queryCond.push({ _id: slug });
      }
      const project = await Project.findOne({ $or: queryCond });
      if (project) {
        const title = `${project.title} — Project by Avdhesh Kumar`;
        const rawDesc = project.description ? project.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
        const description = project.shortDescription || rawDesc.slice(0, 155) || "Full-stack project engineered by Avdhesh Kumar.";
        const image = project.featuredImage || project.imageUrl || defaultImage;
        const pageUrl = `${baseUrl}/projects/${project.slug || slug}`;

        return {
          title,
          description,
          image,
          url: pageUrl,
          type: "website",
          category: project.category,
          schema: {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": project.title,
            "description": description,
            "applicationCategory": project.category || "WebApplication",
            "image": [image],
            "author": {
              "@type": "Person",
              "name": "Avdhesh Kumar",
              "url": baseUrl
            },
            "url": pageUrl
          }
        };
      }
    } catch (err) {
      console.warn("Error resolving project metadata for SEO:", err);
    }
  }

  // 3. Static Pages
  if (cleanPath === "projects") {
    return {
      title: "Projects & Engineering Portfolio — Avdhesh Kumar",
      description: "Explore high-performance full-stack web applications, e-commerce architectures, SaaS dashboards, and digital experiences by Avdhesh Kumar.",
      image: defaultImage,
      url: `${baseUrl}/projects`,
      type: "website",
    };
  }

  if (cleanPath === "blogs" || cleanPath === "blog") {
    return {
      title: "Engineering Journal & Articles — Avdhesh Kumar",
      description: "In-depth engineering notes, React patterns, full-stack case studies, and modern web architecture lessons by Avdhesh Kumar.",
      image: defaultImage,
      url: `${baseUrl}/blogs`,
      type: "website",
    };
  }

  if (cleanPath === "about") {
    return {
      title: "About Avdhesh Kumar — Web Developer & Software Engineer",
      description: "Frontend and full-stack web developer and chess champion based in Gurgaon, India, creating responsive digital experiences with React, Next.js, and Node.js.",
      image: defaultImage,
      url: `${baseUrl}/about`,
      type: "website",
    };
  }

  if (cleanPath === "gallery") {
    return {
      title: "Visual Showcase & Milestones — Avdhesh Kumar",
      description: "Certificates, chess championship trophies, hackathon wins, and engineering journey highlights.",
      image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80",
      url: `${baseUrl}/gallery`,
      type: "website",
    };
  }

  if (cleanPath === "chai" || cleanPath === "buy-me-a-chai") {
    return {
      title: "Buy Me a Chai — Support Avdhesh Kumar",
      description: "Fuel open-source contributions, technical deep-dives, and research articles with a cup of warm masala chai.",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80",
      url: `${baseUrl}/chai`,
      type: "website",
    };
  }

  if (cleanPath === "contact") {
    return {
      title: "Contact & Collaboration — Avdhesh Kumar",
      description: "Get in touch with Avdhesh Kumar for freelance projects, full-stack engineering roles, or consulting in Gurgaon, India.",
      image: defaultImage,
      url: `${baseUrl}/contact`,
      type: "website",
    };
  }

  // Default Home
  return {
    title: "Avdhesh Kumar — Web Developer",
    description: "Avdhesh Kumar is a frontend and full-stack web developer building responsive digital experiences with React, Next.js and Node.js.",
    image: defaultImage,
    url: baseUrl,
    type: "website",
  };
}

function injectMetaIntoHtml(html: string, meta: PageMeta): string {
  let result = html;

  // Title
  result = result.replace(/<title>[\s\S]*?<\/title>/i, `<title>${meta.title}</title>`);

  // Meta Description
  result = result.replace(
    /<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="description" content="${meta.description.replace(/"/g, '&quot;')}" />`
  );

  // Open Graph
  result = result.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:title" content="${meta.title.replace(/"/g, '&quot;')}" />`
  );
  result = result.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:description" content="${meta.description.replace(/"/g, '&quot;')}" />`
  );
  result = result.replace(
    /<meta\s+property=["']og:image["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:image" content="${meta.image}" />`
  );
  result = result.replace(
    /<meta\s+property=["']og:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:url" content="${meta.url}" />`
  );
  result = result.replace(
    /<meta\s+property=["']og:type["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:type" content="${meta.type}" />`
  );

  // Twitter Cards
  result = result.replace(
    /<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:title" content="${meta.title.replace(/"/g, '&quot;')}" />`
  );
  result = result.replace(
    /<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:description" content="${meta.description.replace(/"/g, '&quot;')}" />`
  );
  result = result.replace(
    /<meta\s+name=["']twitter:image["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:image" content="${meta.image}" />`
  );

  // Canonical
  result = result.replace(
    /<link\s+rel=["']canonical["']\s+href=["'][\s\S]*?["']\s*\/?>/i,
    `<link rel="canonical" href="${meta.url}" />`
  );

  // Schema.org Structured Data
  if (meta.schema) {
    const schemaTag = `\n    <script type="application/ld+json">\n${JSON.stringify(meta.schema, null, 2)}\n    </script>\n  </head>`;
    result = result.replace(/<\/head>/i, schemaTag);
  }

  return result;
}

// Bot user agents pattern for social sharing previewers
const BOT_USER_AGENTS = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|twitterbot|pinterest|linkedinbot|embedly|quora|outbrain|vkshare|w3c_validator|slackbot|discordbot|applebot/i;

function isPageRequest(req: Request): boolean {
  if (req.method !== "GET") return false;
  if (req.path.startsWith("/api/")) return false;
  if (req.path === "/sitemap.xml" || req.path === "/robots.txt") return false;
  // Ignore static assets with known extensions
  if (/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot|json|map)$/i.test(req.path)) {
    return false;
  }
  return true;
}

// ==========================================
// VITE / STATIC MIDDLEWARE SETUP
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    // Intercept page requests to inject structured metadata for social sharing & bots
    app.use(async (req: Request, res: Response, next) => {
      const isBot = BOT_USER_AGENTS.test(req.headers["user-agent"] || "");
      const isHtml = req.headers.accept?.includes("text/html") || isBot;

      if (isPageRequest(req) && isHtml) {
        try {
          const indexPath = path.join(process.cwd(), "index.html");
          if (fs.existsSync(indexPath)) {
            const rawHtml = fs.readFileSync(indexPath, "utf-8");
            const proto = req.headers["x-forwarded-proto"] || req.protocol || "http";
            const host = req.headers["x-forwarded-host"] || req.get("host") || `localhost:${PORT}`;
            const meta = await resolvePageMeta(req.path, req.query, String(host), String(proto));
            const injectedHtml = injectMetaIntoHtml(rawHtml, meta);
            const transformedHtml = await vite.transformIndexHtml(req.originalUrl, injectedHtml);
            return res.status(200).set({ "Content-Type": "text/html" }).send(transformedHtml);
          }
        } catch (err) {
          console.error("Error injecting dev page metadata:", err);
        }
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    const indexPath = path.join(distPath, "index.html");

    // Serve built static assets from dist with long-lived immutable caching for hashed bundles
    app.use(
      express.static(distPath, {
        index: false,
        setHeaders: (res, filePath) => {
          // Vite hashed bundles (/assets/*) are immutable forever
          if (filePath.includes(`${path.sep}assets${path.sep}`) || filePath.includes("/assets/")) {
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          } else if (/\.(webp|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i.test(filePath)) {
            res.setHeader("Cache-Control", "public, max-age=604800, stale-while-revalidate=86400");
          } else if (
            filePath.endsWith("index.html") ||
            filePath.endsWith("manifest.json") ||
            filePath.endsWith("sitemap.xml") ||
            filePath.endsWith("robots.txt") ||
            filePath.endsWith("llms.txt") ||
            filePath.endsWith("ai-catalog.json")
          ) {
            res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
          }
        },
      })
    );

    // Client-side SPA catch-all with injected structured metadata for social sharing & crawlers
    app.get("*", async (req: Request, res: Response) => {
      if (req.path.startsWith("/api/")) {
        return res.status(404).json({ error: `API route not found: ${req.method} ${req.path}` });
      }

      try {
        if (fs.existsSync(indexPath)) {
          const rawHtml = fs.readFileSync(indexPath, "utf-8");
          const proto = req.headers["x-forwarded-proto"] || req.protocol || "https";
          const host = req.headers["x-forwarded-host"] || req.get("host") || `localhost:${PORT}`;
          const meta = await resolvePageMeta(req.path, req.query, String(host), String(proto));
          const injectedHtml = injectMetaIntoHtml(rawHtml, meta);
          return res.status(200).set({ "Content-Type": "text/html" }).send(injectedHtml);
        }
      } catch (err) {
        console.error("Error injecting prod page metadata:", err);
      }

      res.sendFile(indexPath);
    });

    // Fallback handler for any remaining unhandled request
    app.use((req: Request, res: Response) => {
      if (req.path.startsWith("/api/")) {
        return res.status(404).json({ error: `API route not found: ${req.method} ${req.path}` });
      }
      res.sendFile(indexPath);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// In local dev and container environments, boot the server.
// On Vercel serverless, app is exported and invoked on-demand.
if (!process.env.VERCEL) {
  startServer();
}

export { app };
export default app;
