import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISEOFields {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robots?: string;
}

export interface IProject extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  featuredImage: string;
  imageAlt: string;
  category: string;
  keywords: string[];
  tags: string[];
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  status: "draft" | "published";
  likes?: number;
  seo: ISEOFields;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  imageAlt: string;
  category: string;
  keywords: string[];
  tags: string[];
  author: string;
  content: string;
  status: "draft" | "published";
  likes?: number;
  seo: ISEOFields;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGallery extends Document {
  title: string;
  image: string;
  public_id?: string;
  width?: number;
  height?: number;
  format?: string;
  imageAlt: string;
  category: string;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory extends Document {
  name: string;
  slug: string;
  type: "project" | "blog" | "gallery";
  createdAt: Date;
  updatedAt: Date;
}

export interface ISEOPageSettings extends Document {
  page: string;
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robots?: string;
  updatedAt: Date;
}

const seoSubSchema = new Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  canonical: { type: String, default: "" },
  ogTitle: { type: String, default: "" },
  ogDescription: { type: String, default: "" },
  ogImage: { type: String, default: "" },
  robots: { type: String, default: "index, follow" },
}, { _id: false });

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
}, { timestamps: true });

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  featuredImage: { type: String, default: "" },
  imageAlt: { type: String, default: "" },
  category: { type: String, required: true, index: true },
  keywords: [String],
  tags: [String],
  techStack: [String],
  liveUrl: { type: String, default: "" },
  githubUrl: { type: String, default: "" },
  status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
  likes: { type: Number, default: 0 },
  seo: { type: seoSubSchema, default: () => ({}) },
  publishedAt: { type: Date },
}, { timestamps: true });

const BlogPostSchema = new Schema<IBlogPost>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  excerpt: { type: String, required: true },
  featuredImage: { type: String, default: "" },
  imageAlt: { type: String, default: "" },
  category: { type: String, required: true, index: true },
  keywords: [String],
  tags: [String],
  author: { type: String, default: "Avdhesh Kumar" },
  content: { type: String, required: true },
  status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
  likes: { type: Number, default: 0 },
  seo: { type: seoSubSchema, default: () => ({}) },
  publishedAt: { type: Date },
}, { timestamps: true });

const GallerySchema = new Schema<IGallery>({
  title: { type: String, required: true },
  image: { type: String, required: true },
  public_id: { type: String },
  width: { type: Number },
  height: { type: Number },
  format: { type: String },
  imageAlt: { type: String, required: true },
  category: { type: String, required: true, index: true },
  status: { type: String, enum: ["draft", "published"], default: "published", index: true },
}, { timestamps: true });

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, lowercase: true },
  type: { type: String, enum: ["project", "blog", "gallery"], required: true, index: true },
}, { timestamps: true });

CategorySchema.index({ slug: 1, type: 1 }, { unique: true });

const SEOPageSettingsSchema = new Schema<ISEOPageSettings>({
  page: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  canonical: { type: String },
  ogTitle: { type: String },
  ogDescription: { type: String },
  ogImage: { type: String },
  robots: { type: String, default: "index, follow" },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export const Project = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
export const BlogPost = mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
export const Gallery = mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", GallerySchema);
export const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
export const SEOPageSettings = mongoose.models.SEOPageSettings || mongoose.model<ISEOPageSettings>("SEOPageSettings", SEOPageSettingsSchema);

export interface IDonation extends Document {
  supporterName: string;
  message: string;
  amount: number;
  avatar: string;
  merchantTransactionId: string;
  phonepeTransactionId?: string;
  paymentInstrument?: any;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema = new Schema<IDonation>({
  supporterName: { type: String, default: "Anonymous", trim: true },
  message: { type: String, default: "Keep building great stuff! ☕", trim: true },
  amount: { type: Number, required: true, min: 1 },
  avatar: { type: String, default: "chai-cup" },
  merchantTransactionId: { type: String, required: true, unique: true, index: true },
  phonepeTransactionId: { type: String },
  paymentInstrument: { type: Schema.Types.Mixed },
  status: {
    type: String,
    enum: ["PENDING", "COMPLETED", "FAILED", "CANCELLED"],
    default: "PENDING",
    index: true,
  },
  paymentMethod: { type: String, default: "PHONEPE" },
}, { timestamps: true });

export const Donation = mongoose.models.Donation || mongoose.model<IDonation>("Donation", DonationSchema);

export interface ISiteSettings extends Document {
  key: string; // "portfolio_settings"
  themeBg: "white" | "grey";
  showFeedbackButton?: boolean;
  promotionBar: {
    active: boolean;
    text: string;
    link: string;
    badgeText?: string;
  };
  resumeUrl: string;
  resumeFileName: string;
  resumeUpdatedAt?: Date;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
    youtube: string;
    facebook: string;
    email: string;
    phone: string;
    location: string;
    statusText: string;
  };
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>({
  key: { type: String, required: true, unique: true, default: "portfolio_settings" },
  themeBg: { type: String, enum: ["white", "grey"], default: "white" },
  showFeedbackButton: { type: Boolean, default: false },
  promotionBar: {
    active: { type: Boolean, default: true },
    text: { type: String, default: "Building a polished Next.js project from scratch" },
    link: { type: String, default: "blog/building-polished-nextjs-project" },
    badgeText: { type: String, default: "My New Blog" },
  },
  resumeUrl: { type: String, default: "" },
  resumeFileName: { type: String, default: "Avdhesh_Kumar_Resume.pdf" },
  resumeUpdatedAt: { type: Date, default: Date.now },
  socialLinks: {
    github: { type: String, default: "https://github.com/BCABro-9667" },
    linkedin: { type: String, default: "https://www.linkedin.com/in/avdhesh-kumar-72b9a72b8/" },
    twitter: { type: String, default: "https://x.com/Avdheshkumar00" },
    instagram: { type: String, default: "https://www.instagram.com/avdhesh_kumar__9667" },
    youtube: { type: String, default: "https://youtube.com/@BCABRO" },
    facebook: { type: String, default: "https://facebook.com" },
    email: { type: String, default: "avdhesh6968@gmail.com" },
    phone: { type: String, default: "+91 9667086968" },
    location: { type: String, default: "Gurugram, Haryana, India" },
    statusText: { type: String, default: "Open to Full-Time & Freelance Roles" },
  },
}, { timestamps: true });

export const SiteSettings = mongoose.models.SiteSettings || mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export interface IInquiry extends Document {
  type: "contact" | "popup" | "feedback";
  name: string;
  email: string;
  subject?: string;
  message?: string;
  rating?: number; // 1-5 for feedback
  category?: string; // feedback category e.g. "Portfolio Design", "Job Proposal", "Feedback"
  status: "unread" | "read" | "replied" | "archived";
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>({
  type: { type: String, enum: ["contact", "popup", "feedback"], required: true, index: true },
  name: { type: String, default: "Anonymous" },
  email: { type: String, required: true, trim: true, lowercase: true, index: true },
  subject: { type: String, default: "" },
  message: { type: String, default: "" },
  rating: { type: Number, min: 1, max: 5 },
  category: { type: String, default: "General" },
  status: { type: String, enum: ["unread", "read", "replied", "archived"], default: "unread", index: true },
  metadata: { type: Schema.Types.Mixed },
}, { timestamps: true });

export const Inquiry = mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);

export interface IComment extends Document {
  blogId: string;
  email: string; // private, never returned publicly
  comment: string;
  displayName: string;
  avatarUrl?: string;
  status: "published" | "pending" | "spam";
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  blogId: { type: String, required: true, index: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  comment: { type: String, required: true, trim: true, maxlength: 1000 },
  displayName: { type: String, required: true },
  avatarUrl: { type: String, default: "" },
  status: { type: String, enum: ["published", "pending", "spam"], default: "published", index: true },
}, { timestamps: true });

export const Comment = mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);



