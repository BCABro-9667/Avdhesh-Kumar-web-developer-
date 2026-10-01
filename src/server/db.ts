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
          title: "Avdhesh Kumar | Full-Stack Developer, MCA Student & Chess Player",
          description: "Avdhesh Kumar is a full-stack and frontend web developer building modern applications with React, Next.js, Node.js, and MongoDB. MCA student & BCA graduate from DPG Degree College.",
          canonical: "https://avdheshkumar.me/",
          ogTitle: "Avdhesh Kumar | Full-Stack Developer, MCA Student & Chess Player",
          ogDescription: "Official website of Avdhesh Kumar — Full-Stack & Frontend Web Developer, MCA student at DPG Degree College & 4× Chess Champion.",
          robots: "index, follow"
        },
        {
          page: "about",
          title: "About Avdhesh Kumar | Full-Stack Developer & MCA Student",
          description: "Learn more about Avdhesh Kumar, MCA student, BCA graduate from DPG Degree College (MDU), web developer, and 4-time chess champion based in Gurgaon, India.",
          canonical: "https://avdheshkumar.me/about",
          robots: "index, follow"
        },
        {
          page: "projects",
          title: "Projects by Avdhesh Kumar | Web Development Portfolio",
          description: "Explore web development projects, full-stack applications, e-commerce systems, and responsive frontend applications built by Avdhesh Kumar.",
          canonical: "https://avdheshkumar.me/projects",
          robots: "index, follow"
        },
        {
          page: "education",
          title: "Avdhesh Kumar | BCA & MCA Education at DPG Degree College",
          description: "Academic education of Avdhesh Kumar: Master of Computer Applications (MCA) and Bachelor of Computer Applications (BCA, 8.0 CGPA) at DPG Degree College, MDU.",
          canonical: "https://avdheshkumar.me/education",
          robots: "index, follow"
        },
        {
          page: "chess",
          title: "Avdhesh Kumar Chess | Chess Journey & Competitive Achievements",
          description: "Chess journey and competitive milestones of Avdhesh Kumar: 4-time College Chess Champion, National Sports Day winner, and tactical thinking in software engineering.",
          canonical: "https://avdheshkumar.me/chess",
          robots: "index, follow"
        },
        {
          page: "blog",
          title: "Engineering Journal & Articles | Avdhesh Kumar",
          description: "Technical articles, thoughts on React, Next.js, Node.js, full-stack engineering, and web development insights by Avdhesh Kumar.",
          canonical: "https://avdheshkumar.me/blogs",
          robots: "index, follow"
        },
        {
          page: "gallery",
          title: "Visual Archive & Milestones | Avdhesh Kumar",
          description: "Certifications, chess championship awards, project snapshots, and career milestones of Avdhesh Kumar.",
          canonical: "https://avdheshkumar.me/gallery",
          robots: "index, follow"
        },
        {
          page: "contact",
          title: "Contact Avdhesh Kumar | Web Developer",
          description: "Get in touch with Avdhesh Kumar for full-stack development, frontend engineering, freelance contracts, or technical collaborations.",
          canonical: "https://avdheshkumar.me/contact",
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
