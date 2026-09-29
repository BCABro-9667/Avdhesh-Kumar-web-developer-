import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User, Category, SEOPageSettings, SiteSettings, Project, BlogPost, Gallery } from "./models";

let isConnected = false;

export function isMongoDBConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

export async function connectDB() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes("username:password")) {
    console.warn("⚠️ MONGODB_URI is not configured or is using default placeholder. Database features will be simulated or require a valid connection string.");
    return;
  }

  try {
    const db = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("📦 Connected to MongoDB successfully.");
    
    // Seed or update default admin, projects, blogs, categories, gallery, settings
    await seedDefaults();
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    isConnected = false;
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

    // Seed default projects if none exist
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany([
        {
          title: "BCA Point – BCA Notes, Syllabus & Study Portal",
          slug: "bca-point",
          shortDescription: "A modern web portal for BCA students offering semester-wise notes, previous year question papers, syllabus, and study resources.",
          description: "A comprehensive academic portal engineered specifically for BCA students. Features an organized directory structure covering all 6 semesters, live search, instant PDF previews, and question paper archives.\nIntegrated clean UI built with React and Tailwind CSS.\nResponsive on all devices with dark/cream theme contrast.",
          featuredImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
          imageAlt: "BCA Point preview",
          category: "E-Commerce",
          keywords: ["Education", "React", "Tailwind", "Full-Stack", "BCA"],
          tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
          techStack: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
          liveUrl: "https://bcapoint.in",
          githubUrl: "https://github.com/BCABro-9667",
          status: "published",
          likes: 42,
          publishedAt: new Date(),
        },
        {
          title: "BiteFlow – Modern Food Delivery & Ordering System",
          slug: "biteflow",
          shortDescription: "A full-featured food delivery web application with real-time cart, interactive menu, order tracking, and clean checkout flow.",
          description: "Designed and engineered an end-to-end food ordering platform with real-time state management.\nIncludes categorised restaurant menus, customizable dish addons, live subtotal computation, and simulated delivery courier tracking.",
          featuredImage: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=80",
          imageAlt: "BiteFlow preview",
          category: "Landing Page",
          keywords: ["Food Delivery", "React", "TypeScript", "Tailwind CSS"],
          tags: ["React", "TypeScript", "Tailwind CSS", "Express", "MongoDB"],
          techStack: ["React", "TypeScript", "Tailwind CSS", "Express", "MongoDB"],
          liveUrl: "https://biteflow-preview.netlify.app",
          githubUrl: "https://github.com/BCABro-9667",
          status: "published",
          likes: 37,
          publishedAt: new Date(),
        },
        {
          title: "DevHire – Developer Job & Talent Board",
          slug: "devhire",
          shortDescription: "A curated job board connecting startups with top frontend, backend, and full-stack developers globally.",
          description: "Created a scalable developer talent platform featuring robust filtering by experience level, remote availability, tech stack, and compensation.\nIntegrated company profiles and applicant submission flows.",
          featuredImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
          imageAlt: "DevHire preview",
          category: "Task Management",
          keywords: ["Job Board", "Next.js", "MongoDB", "Tailwind CSS"],
          tags: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB", "Express"],
          techStack: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB", "Express"],
          liveUrl: "https://devhire-jobs.netlify.app",
          githubUrl: "https://github.com/BCABro-9667",
          status: "published",
          likes: 29,
          publishedAt: new Date(),
        },
        {
          title: "CryptoTrack – Real-Time Crypto Analytics Dashboard",
          slug: "cryptotrack",
          shortDescription: "Live cryptocurrency pricing dashboard with interactive price charts, portfolio tracking, and market analytics.",
          description: "High-performance financial dashboard rendering real-time candlestick charts, 24-hour volume changes, and responsive coin comparisons using public cryptocurrency APIs.",
          featuredImage: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80",
          imageAlt: "CryptoTrack preview",
          category: "Mobile Apps",
          keywords: ["Crypto", "Analytics", "React", "Chart.js"],
          tags: ["React", "Chart.js", "Tailwind CSS", "REST API"],
          techStack: ["React", "Chart.js", "Tailwind CSS", "REST API"],
          liveUrl: "https://cryptotrack-live.netlify.app",
          githubUrl: "https://github.com/BCABro-9667",
          status: "published",
          likes: 31,
          publishedAt: new Date(),
        },
        {
          title: "CloudDrop – Drag & Drop Secure File Sharing",
          slug: "clouddrop",
          shortDescription: "Fast, minimal file sharing tool allowing users to upload documents, generate expiring links, and share files securely.",
          description: "Secure file transfer platform with drag-and-drop file upload, size verification, MIME-type protection, and link generation with customizable expiration times.",
          featuredImage: "https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=1200&q=80",
          imageAlt: "CloudDrop preview",
          category: "Community",
          keywords: ["File Sharing", "Node.js", "Express", "Multer"],
          tags: ["Node.js", "Express", "Multer", "React", "Tailwind CSS"],
          techStack: ["Node.js", "Express", "Multer", "React", "Tailwind CSS"],
          liveUrl: "https://clouddrop-share.netlify.app",
          githubUrl: "https://github.com/BCABro-9667",
          status: "published",
          likes: 19,
          publishedAt: new Date(),
        },
      ]);
      console.log("🚀 Default portfolio projects seeded in MongoDB.");
    }

    // Seed default blog posts if none exist
    const blogCount = await BlogPost.countDocuments();
    if (blogCount === 0) {
      await BlogPost.insertMany([
        {
          title: "Mastering Full-Stack React & Node Architecture in 2025",
          slug: "mastering-full-stack-react-node",
          excerpt: "Deep dive into building robust web applications using React on the frontend and Node.js/Express with MongoDB on the backend.",
          featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
          imageAlt: "React and Node.js code illustration",
          category: "Architecture",
          keywords: ["React", "Node.js", "Full-Stack", "Web Architecture"],
          tags: ["React", "Node.js", "Architecture", "Express", "TypeScript"],
          author: "Avdhesh Kumar",
          content: `Building modern web applications requires a holistic view of the entire stack. In 2025, the boundary between client and server continues to evolve, yet the core principles of speed, maintainability, and clean code remain paramount.\n\n### 1. The Core Architecture\nA solid full-stack project starts with clear separation of concerns: declarative user interfaces on the frontend paired with predictable, stateless REST APIs on the backend.\n\n### 2. State & Data Flow\nManaging server state with real-time optimistic updates ensures that users perceive instant responsiveness without waiting on network roundtrips.\n\n### 3. Conclusion\nBy focusing on clean component hierarchies, robust error handling, and scalable database queries, full-stack developers can build experiences that scale seamlessly.`,
          status: "published",
          likes: 84,
          publishedAt: new Date(),
        },
        {
          title: "Why Tailwind CSS with Next.js is the Ultimate DX Combo",
          slug: "why-tailwind-css-nextjs-dx-combo",
          excerpt: "How utility-first styling combined with server-rendered React components supercharges frontend engineering velocity and design consistency.",
          featuredImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
          imageAlt: "Tailwind CSS with Next.js code editor",
          category: "Frontend",
          keywords: ["Tailwind CSS", "Next.js", "Developer Experience", "Design Systems"],
          tags: ["Tailwind CSS", "Next.js", "Frontend", "CSS"],
          author: "Avdhesh Kumar",
          content: `Developer experience (DX) is often the defining factor in shipping high-quality software on time. In this article, we explore why pairing utility-first CSS with modern React workflows drastically reduces context-switching and eliminates dead CSS.\n\n### Instant Feedback Loops\nWith utility classes colocated right next to markup, styling is predictable, reusable, and optimized at build time.\n\n### Consistency Across Design Tokens\nTailwind enforces disciplined scales for typography, color palettes, and spacing, ensuring that visual polish stays coherent across every page.`,
          status: "published",
          likes: 67,
          publishedAt: new Date(),
        },
        {
          title: "Demystifying Asynchronous Programming & Event Loops in Node.js",
          slug: "demystifying-async-programming-nodejs",
          excerpt: "A practical guide to the Node.js event loop, microtask queues, non-blocking I/O, and writing high-throughput backend services.",
          featuredImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
          imageAlt: "Node.js code and servers",
          category: "Backend",
          keywords: ["Node.js", "Event Loop", "Asynchronous", "JavaScript", "Backend"],
          tags: ["Node.js", "Async", "JavaScript", "Backend", "Performance"],
          author: "Avdhesh Kumar",
          content: `Node.js has powered millions of concurrent servers thanks to its single-threaded, non-blocking event-driven runtime.\n\nUnderstanding how libuv manages phases—timers, pending callbacks, poll, check, and close callbacks—empowers developers to write backends that never starve the thread and handle thousands of concurrent queries smoothly.`,
          status: "published",
          likes: 53,
          publishedAt: new Date(),
        },
        {
          title: "From Zero to Production: Deploying Scalable Web Applications",
          slug: "zero-to-production-deploying-scalable-web-apps",
          excerpt: "Step-by-step checklist for building, optimizing, and deploying production-ready applications with zero downtime.",
          featuredImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
          imageAlt: "DevOps and deployment pipeline",
          category: "DevOps",
          keywords: ["DevOps", "Deployment", "CI/CD", "Production", "Cloud"],
          tags: ["DevOps", "Deployment", "Cloud", "Full-Stack"],
          author: "Avdhesh Kumar",
          content: `Shipping to production is where software meets reality. Beyond writing clean code, engineering production readiness requires bundle optimization, asset hashing, security headers, and smooth fallback handling for client-side routing.\n\nThis guide covers the automated pipelines that take code from local development all the way to high-availability deployment.`,
          status: "published",
          likes: 49,
          publishedAt: new Date(),
        },
      ]);
      console.log("📝 Default blog posts seeded in MongoDB.");
    }

    // Seed default gallery items if none exist
    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      await Gallery.insertMany([
        {
          title: "College Chess Championship Trophy",
          image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80",
          imageAlt: "Chess championship trophy and tournament board",
          category: "Chess",
          status: "published",
        },
        {
          title: "Inter-College Rapid Chess Tournament 1st Place",
          image: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=1200&q=80",
          imageAlt: "Rapid chess championship",
          category: "Chess",
          status: "published",
        },
        {
          title: "Reachcure Frontend Internship Completion",
          image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
          imageAlt: "Frontend internship certificate",
          category: "Certificates",
          status: "published",
        },
        {
          title: "Estovir Technologies Internship Excellence",
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
          imageAlt: "Estovir internship certificate",
          category: "Certificates",
          status: "published",
        },
      ]);
      console.log("🖼️ Default gallery items seeded in MongoDB.");
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
