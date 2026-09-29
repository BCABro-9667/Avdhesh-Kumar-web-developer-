import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User, Category, SEOPageSettings, SiteSettings, Project, BlogPost, Gallery } from "./models";

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export function isMongoDBConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes("username:password")) {
    console.warn("⚠️ MONGODB_URI is not configured or is using default placeholder. Database features will be simulated or require a valid connection string.");
    return;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    }).then(async (m) => {
      console.log("📦 Connected to MongoDB successfully.");
      try {
        await seedDefaults();
      } catch (err) {
        console.warn("Seeding error:", err);
      }
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", error);
    return;
  }
}

async function seedDefaults() {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || "avdhesh6968@gmail.com").trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || "Avdhesh@123").trim();
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (!existingAdmin) {
      await User.create({
        name: "Avdhesh Kumar",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`👤 Default admin user created: ${adminEmail}`);
    } else {
      // Keep existing admin password synchronized with latest ADMIN_PASSWORD env var
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log(`🔄 Admin user password synced from environment: ${adminEmail}`);
    }

    // Seed default categories if none exist
    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      await Category.insertMany([
        { name: "Full-Stack", slug: "full-stack", type: "project" },
        { name: "Frontend", slug: "frontend", type: "project" },
        { name: "React & Next.js", slug: "react-nextjs", type: "blog" },
        { name: "Web Development", slug: "web-development", type: "blog" },
        { name: "Portfolio Work", slug: "portfolio-work", type: "gallery" },
      ]);
      console.log("📂 Default categories seeded.");
    }

    // Seed default SEO settings if none exist
    const seoCount = await SEOPageSettings.countDocuments();
    if (seoCount === 0) {
      await SEOPageSettings.insertMany([
        {
          page: "home",
          title: "Avdhesh Kumar — Full-Stack & Frontend Web Developer",
          description: "Avdhesh Kumar is a frontend and full-stack web developer building responsive digital experiences with React, Next.js and Node.js.",
          canonical: "https://ais-dev-2evl5cli54boiv62bbeocg-271997554173.asia-southeast1.run.app",
          ogTitle: "Avdhesh Kumar — Portfolio & CMS",
          ogDescription: "Full-Stack & Frontend Web Developer crafting responsive web apps.",
          robots: "index, follow"
        },
        {
          page: "about",
          title: "About Me — Avdhesh Kumar",
          description: "Learn more about Avdhesh Kumar, MCA student and full-stack web developer based in Gurgaon, India.",
          robots: "index, follow"
        },
        {
          page: "projects",
          title: "Projects & Works — Avdhesh Kumar",
          description: "Explore web development projects, full-stack applications, and interactive code portfolios.",
          robots: "index, follow"
        },
        {
          page: "blog",
          title: "Journal & Articles — Avdhesh Kumar",
          description: "Read technical articles, thoughts on React, Node.js, full-stack engineering, and web development.",
          robots: "index, follow"
        },
        {
          page: "gallery",
          title: "Gallery & Media — Avdhesh Kumar",
          description: "Visual assets, project screenshots, and design snapshots.",
          robots: "index, follow"
        },
        {
          page: "contact",
          title: "Get in Touch — Avdhesh Kumar",
          description: "Connect with Avdhesh Kumar for freelance projects, full-stack development, and collaborations.",
          robots: "index, follow"
        }
      ]);
      console.log("🔍 Default SEO page settings seeded.");
    }

    // Seed default Site Settings if none exist
    const settingsCount = await SiteSettings.countDocuments({ key: "portfolio_settings" });
    if (settingsCount === 0) {
      await SiteSettings.create({
        key: "portfolio_settings",
        resumeUrl: "",
        resumeFileName: "Avdhesh_Kumar_Resume.pdf",
        resumeUpdatedAt: new Date(),
        socialLinks: {
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
        },
      });
      console.log("⚙️ Default Site Settings seeded.");
    }
  } catch (err) {
    console.error("Error seeding defaults:", err);
  }
}
