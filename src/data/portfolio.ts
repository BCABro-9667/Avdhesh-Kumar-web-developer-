export interface Project {
  id: string;
  _id?: string;
  number: string;
  title: string;
  category: string;
  technology: string;
  description: string;
  features: string[];
  style: 'dark' | 'cream' | 'lavender';
  ctaText: string;
  url: string;
  slug?: string;
  githubUrl?: string;
  highlightMetric?: string;
  imageUrl?: string;
  imageUrls?: string[];
  likes?: number;
}

export interface ExperienceItem {
  id: string;
  company: string;
  companyUrl?: string;
  role: string;
  duration: string;
  periodLabel: string;
  location: string;
  responsibilities: string[];
  skillsUsed: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  statusOrGrade: string;
  notes?: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  description: string;
}

export interface AchievementItem {
  title: string;
  subtitle: string;
  year: string;
  iconType: 'chess' | 'sports' | 'scholarship' | 'award';
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  techStack: string[];
  iconType: "web" | "uiux" | "fullstack" | "ecommerce" | "seo" | "support";
  badge?: string;
}

export interface BlogSection {
  type: "heading" | "subheading" | "text" | "quote" | "image" | "callout" | "list";
  title?: string;
  content?: string;
  author?: string;
  source?: string;
  src?: string;
  caption?: string;
  alt?: string;
  items?: string[];
  calloutTitle?: string;
}

export interface BlogPostItem {
  id: string;
  title: string;
  status: string;
  category: string;
  readTime: string;
  excerpt: string;
  tags: string[];
  date?: string;
  content?: string;
  imageUrl?: string;
  sections?: BlogSection[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: "Chess" | "Certificates" | "Hackathons" | "Inventions" | string;
  date: string;
  description: string;
  imageUrl: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  relation: string;
  status: string;
  note: string;
  avatarUrl?: string;
}

export interface SkillItem {
  name: string;
  shortName?: string;
  category: string;
  top?: boolean;
}

export const PORTFOLIO_DATA = {
  personal: {
    name: "Avdhesh Kumar",
    monogram: "AK",
    avatarUrl: "/avdhesh-kumar.png",
    role: "Full-Stack / Frontend Web Developer",
    location: "Gurgaon, Haryana, India",
    email: "avdeshrajput925064@gmail.com",
    phone: "+91 96673 46203",
    linkedin: "https://linkedin.com/in/avdhesh-bca-/",
    github: "https://github.com/BCABro-9667",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    youtube: "https://youtube.com/@BCABRO",
    portfolioUrl: "https://avdheshh-portfolio.netlify.app",
    statusText: "AVAILABLE FOR OPPORTUNITIES",
    heroHeadline: {
      pre: "I build",
      emphasized1: "digital",
      middle: "experiences that feel",
      emphasized2: "alive.",
    },
    heroSubtext: "Full-stack & frontend web developer crafting responsive, user-focused products with React, Next.js and Node.js.",
    aboutHeadline: "Developer.\nProblem solver.\nAlways learning.",
    aboutBio1: "I'm Avdhesh Kumar, an MCA student and web developer focused on building clean, fast and useful digital products.",
    aboutBio2: "My experience spans frontend development, full-stack applications, WordPress and SEO. I've worked with React.js, Next.js, Node.js, Express.js, MongoDB and SQL to turn ideas into responsive web experiences.",
  },

  strengths: [
    {
      title: "Multitasking",
      tagline: "Efficient Parallel Execution",
      description: "Managing multiple project modules, parallel technical assignments, and shifting priorities without losing composure or code quality.",
    },
    {
      title: "Team Work",
      tagline: "Collaborative Synergy",
      description: "Contributing effectively in cross-functional teams, actively coordinating via Git workflows, supporting peers, and aligning with group goals.",
    },
    {
      title: "Fast Learner",
      tagline: "High Adaptability",
      description: "Quickly mastering new languages, modern libraries, APIs, and engineering practices to rapidly resolve real-world software challenges.",
    },
  ],

  weaknesses: [
    {
      title: "Weak Communication",
      tagline: "Active Focus Area",
      description: "Occasionally reserved during verbal explanations; proactively improving through daily team discussions, clear presentations, and articulate technical documentation.",
    },
    {
      title: "Overthinking",
      tagline: "Balancing Perfection with Speed",
      description: "A tendency to excessively analyze scenarios and edge cases; actively practicing lean iteration, trusting intuition, and shipping early.",
    },
  ],

  stats: [
    { label: "Internships", value: "2+", detail: "Tech & web development roles" },
    { label: "Featured Projects", value: "6", detail: "Full-stack, e-com & community" },
    { label: "BCA CGPA", value: "8.0", detail: "Academic excellence in CS" },
    { label: "College Chess Champion", value: "4×", detail: "Strategic thinking & focus" },
  ],

  services: [
    {
      id: "web-dev",
      number: "01",
      title: "Web Development",
      tagline: "Modern, responsive websites and web applications.",
      description: "Crafting blazing fast, responsive, and standards-compliant web applications built with Next.js, React, and modern TypeScript tailored for seamless user experiences.",
      deliverables: [
        "Responsive & mobile-first layouts",
        "Single-Page & Multi-Page web applications",
        "Cross-browser & cross-device compatibility",
        "Component-driven modular architecture",
      ],
      techStack: ["React.js", "Next.js", "TypeScript", "Tailwind CSS"],
      iconType: "web" as const,
      badge: "Core Service",
    },
    {
      id: "uiux-dev",
      number: "02",
      title: "UI/UX Development",
      tagline: "Clean, user-friendly, and interactive interfaces.",
      description: "Transforming ideas into visually refined, intuitive interfaces with micro-interactions, accessible typography, and frictionless digital journeys.",
      deliverables: [
        "Interactive prototypes & design systems",
        "Intuitive navigation & user journeys",
        "Micro-animations & tactile transitions",
        "WCAG accessibility & typography hierarchy",
      ],
      techStack: ["Figma to Code", "Motion", "Tailwind CSS", "Responsive UX"],
      iconType: "uiux" as const,
      badge: "User Centered",
    },
    {
      id: "fullstack-dev",
      number: "03",
      title: "Full-Stack Development",
      tagline: "Frontend + backend + database integration.",
      description: "Engineering cohesive end-to-end architectures connecting dynamic client interfaces with robust Node.js APIs, serverless handlers, and scalable database schemas.",
      deliverables: [
        "RESTful & GraphQL API integration",
        "Database modeling (MongoDB & SQL)",
        "Secure authentication & JWT session management",
        "Server-side rendering & state workflows",
      ],
      techStack: ["Node.js", "Express.js", "MongoDB", "MySQL / SQL"],
      iconType: "fullstack" as const,
      badge: "End-to-End",
    },
    {
      id: "ecommerce-dev",
      number: "04",
      title: "E-Commerce Development",
      tagline: "Online stores, payments, products, orders, and dashboards.",
      description: "Building high-converting digital storefronts equipped with secure checkout funnels, product catalog management, order tracking, and custom admin portals.",
      deliverables: [
        "Product catalogs & instant filter systems",
        "Cart workflows & secure payment gateways",
        "Order lifecycle & customer management",
        "Merchant back-office admin dashboards",
      ],
      techStack: ["Next.js", "Payment Gateways", "MongoDB", "Shopify / WooCommerce"],
      iconType: "ecommerce" as const,
      badge: "High Conversion",
    },
    {
      id: "seo-optimization",
      number: "05",
      title: "Website Optimization & SEO",
      tagline: "Speed, Core Web Vitals, technical SEO, and search visibility.",
      description: "Auditing and elevating performance benchmarks, eliminating rendering bottlenecks, and implementing structured Schema metadata for prominent search discoverability.",
      deliverables: [
        "90+ Google Lighthouse & Core Web Vitals",
        "Technical SEO & OpenGraph / Schema metadata",
        "Asset minification & image optimization",
        "Search engine indexing & crawl speed",
      ],
      techStack: ["Lighthouse", "Schema.org", "Next.js SEO", "Web Vitals"],
      iconType: "seo" as const,
      badge: "High Performance",
    },
    {
      id: "maintenance-support",
      number: "06",
      title: "Website Maintenance & Support",
      tagline: "Bug fixes, updates, security, backups, and ongoing improvements.",
      description: "Delivering dependable technical support, continuous security auditing, regular dependency updates, automated backups, and proactive enhancements.",
      deliverables: [
        "Routine dependency & security updates",
        "Emergency bug resolution & hotfixes",
        "Automated backups & disaster recovery",
        "Performance monitoring & continuous QA",
      ],
      techStack: ["Git Workflow", "Security Audits", "Monitoring", "Continuous QA"],
      iconType: "support" as const,
      badge: "24/7 Reliability",
    },
  ],

  marqueeItems: [
    "REACT.JS",
    "NEXT.JS",
    "NODE.JS",
    "MONGODB",
    "TAILWIND",
    "WORDPRESS",
    "REST APIs",
    "GIT / GITHUB",
  ],

  skills: [
    { name: "Java", shortName: "Java", category: "Languages" },
    { name: "Python", shortName: "Python", category: "Languages" },
    { name: "C++", shortName: "C++", category: "Languages" },
    { name: "JavaScript ES6+", shortName: "JavaScript", category: "Languages", top: true },
    { name: "React.js", shortName: "React", category: "Frontend", top: true },
    { name: "Next.js", shortName: "Next.js", category: "Frontend", top: true },
    { name: "HTML5", shortName: "HTML5", category: "Frontend" },
    { name: "CSS3", shortName: "CSS3", category: "Frontend" },
    { name: "Bootstrap", shortName: "Bootstrap", category: "Frontend" },
    { name: "Tailwind CSS", shortName: "Tailwind", category: "Frontend", top: true },
    { name: "Node.js", shortName: "Node.js", category: "Backend", top: true },
    { name: "Express.js", shortName: "Express", category: "Backend" },
    { name: "REST APIs", shortName: "REST APIs", category: "Backend", top: true },
    { name: "MongoDB", shortName: "MongoDB", category: "Database", top: true },
    { name: "MySQL", shortName: "MySQL", category: "Database" },
    { name: "SQL", shortName: "SQL", category: "Database" },
    { name: "WordPress", shortName: "WordPress", category: "CMS", top: true },
    { name: "Shopify", shortName: "Shopify", category: "CMS" },
    { name: "Wix", shortName: "Wix", category: "CMS" },
    { name: "Git", shortName: "Git", category: "Tools", top: true },
    { name: "GitHub", shortName: "GitHub", category: "Tools", top: true },
    { name: "Netlify", shortName: "Netlify", category: "Tools" },
    { name: "Microsoft Azure", shortName: "Azure", category: "Cloud" },
    { name: "Google Cloud", shortName: "GCP", category: "Cloud" },
    { name: "VS Code", shortName: "VS Code", category: "Tools" },
    { name: "SEO", shortName: "SEO", category: "Marketing & Strategy", top: true },
    { name: "Photoshop", shortName: "Photoshop", category: "Design" },
    { name: "Canva", shortName: "Canva", category: "Design" },
    { name: "Tally ERP", shortName: "Tally", category: "Productivity" },
    { name: "Microsoft Office", shortName: "MS Office", category: "Productivity" },
    { name: "Google Workspace", shortName: "Workspace", category: "Productivity" },
  ] as SkillItem[],

  projects: [
    {
      id: "taskmaster",
      number: "01",
      title: "TaskMaster",
      category: "Task Management",
      technology: "NEXT.JS",
      description: "Task management web application with task creation, assignee assignment, note taking and status tracking.",
      features: [
        "CRUD operations for tasks & sub-tasks",
        "Role / assignee assignment workflow",
        "Responsive UI with state persistence",
        "Structured API documentation",
        "Netlify deployment pipeline",
      ],
      style: "dark",
      ctaText: "View project ↗",
      url: "https://avdheshh-portfolio.netlify.app",
      highlightMetric: "Production Ready",
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      imageUrls: [
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80"
      ],
    },
    {
      id: "commerce-experience",
      number: "02",
      title: "Commerce Experience",
      category: "E-Commerce",
      technology: "WORDPRESS + SEO",
      description: "WordPress e-commerce website with product pages, categories and payment integrations.",
      features: [
        "Product catalog and dynamic categories",
        "Seamless payment gateway integration",
        "Engineered meta tags & OpenGraph metadata",
        "XML sitemap & clean search-friendly URLs",
        "Core Web Vitals & performance optimization",
      ],
      style: "cream",
      ctaText: "View project ↗",
      url: "https://avdheshh-portfolio.netlify.app",
      highlightMetric: "SEO Optimized",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      imageUrls: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
      ],
    },
    {
      id: "chessmatecentral",
      number: "03",
      title: "ChessmateCentral",
      category: "Community",
      technology: "NEXT.JS",
      description: "Chess community platform for publishing blogs and organizing online/offline tournaments.",
      features: [
        "Interactive blog CMS and editorial publishing",
        "Tournament registration and participant lists",
        "Event schedules and physical/online fixture pages",
        "Backend REST APIs for real-time fixtures",
      ],
      style: "lavender",
      ctaText: "View project ↗",
      url: "https://avdheshh-portfolio.netlify.app",
      highlightMetric: "Community Hub",
      imageUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80",
      imageUrls: [
        "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1560174038-da42f77f0f89?auto=format&fit=crop&w=1200&q=80"
      ],
    },
    {
      id: "creative-devstudio",
      number: "04",
      title: "Agency Landing Page",
      category: "Landing Page",
      technology: "REACT + TAILWIND",
      description: "Editorial minimalist digital agency showcase featuring Swiss typography, kinetic animations, and responsive micro-interactions.",
      features: [
        "Editorial grid system with Space Grotesk typography",
        "Spring physics magnetic buttons & custom cursor",
        "Responsive fluid layout across mobile & ultra-wide",
        "Lighthouse performance 95+ score",
      ],
      style: "cream",
      ctaText: "View project ↗",
      url: "https://avdheshh-portfolio.netlify.app",
      highlightMetric: "Agency Aesthetic",
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
      imageUrls: [
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80"
      ],
    },
    {
      id: "quicktask-pwa",
      number: "05",
      title: "Pulse Mobile Web App",
      category: "Mobile Apps",
      technology: "REACT + PWA",
      description: "Progressive mobile web application optimized for touch interactions, gesture navigation, and offline productivity.",
      features: [
        "Touch-first swipe gestures & haptic-like animations",
        "Offline caching with Service Worker protocols",
        "Instant mobile app-like installation capability",
        "Lightweight sub-50kb client bundle footprint",
      ],
      style: "dark",
      ctaText: "View project ↗",
      url: "https://avdheshh-portfolio.netlify.app",
      highlightMetric: "PWA Mobile",
      imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
      imageUrls: [
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80"
      ],
    },
  ] as Project[],

  experience: [
     {
      id: "chessmate-labs",
      company: "VMD CAD and Graphic Technologies Pvt. Ltd.",
      companyUrl: "https://www.vmdcadconversion.com/",
      role: "Administrative Executive",
      duration: "Currently",
      periodLabel: "Job",
      location: "Gurugram, India",
      responsibilities: [
        "Managing administrative operations and documentation workflows",
        "Coordinating corporate records, project schedules, and client communications",
        "Streamlining office digital records and data management hygiene",
      ],
      skillsUsed: ["Administration", "Operations", "Documentation", "Workflow Management"],
    },
    {
      id: "estovir",
      company: "ESTOVIR TECHNOLOGIES",
      companyUrl: "https://smtems.com",
      role: "IT Engineer & Web Developer Intern",
      duration: "6 months",
      periodLabel: "6 Months Internship",
      location: "Gurugram, India",
      responsibilities: [
        "Website development and continuous maintenance using WordPress",
        "Crafting bespoke and modular frontend components",
        "Executing thorough on-page SEO strategies to enhance search visibility",
        "Auditing performance and driving foundational site speed optimization",
        "Managing system networking, periodic backups, and security hygiene",
        "Version control via Git/GitHub and cross-functional design collaboration",
      ],
      skillsUsed: ["WordPress", "Frontend UI", "SEO", "Site Optimization", "Git", "Security Backups"],
    },
    {
      id: "reachcure",
      company: "REACHCURE HEALTHCARE",
      companyUrl: "https://reachcure.com",
      role: "Frontend Web Developer Intern",
      duration: "3 months",
      periodLabel: "3 Months Internship",
      location: "Gurugram, India",
      responsibilities: [
        "Building responsive React.js and Next.js view architectures",
        "Integrating WordPress headless layers and external RESTful APIs",
        "Coordinating with Node.js and Express.js backend services",
        "Querying and structuring data with MongoDB and SQL",
        "Managing feature branching, code reviews, and Git/GitHub deployments",
        "Visual design asset creation with Adobe Photoshop and Canva",
      ],
      skillsUsed: ["React.js", "Next.js", "RESTful APIs", "Node.js", "Express.js", "MongoDB", "SQL", "Photoshop"],
    }
  ] as ExperienceItem[],

  education: [
    {
      degree: "MASTER OF COMPUTER APPLICATIONS (MCA)",
      institution: "DPG Degree College, Gurugram",
      location: "Gurugram, Haryana",
      period: "Aug 2025 – Aug 2027",
      statusOrGrade: "Pursuing",
      notes: "Advanced studies in distributed systems, modern web frameworks, cloud architectures, and algorithmic problem solving.",
    },
    {
      degree: "BACHELOR OF COMPUTER APPLICATIONS (BCA)",
      institution: "DPG Degree College, Gurugram",
      location: "Gurugram, Haryana",
      period: "Aug 2022 – Aug 2025",
      statusOrGrade: "CGPA: 8.0",
      notes: "Graduated with distinction. Core coursework in Data Structures, Database Systems, Web Engineering, and Computer Networks.",
    },
    {
      degree: "SENIOR SECONDARY (12TH GRADE)",
      institution: "HBSE Board",
      location: "Gurugram, Haryana",
      period: "2021-2022",
      statusOrGrade: "Completed",
      notes: "Core focus on Science & Mathematics, foundational programming logic, and analytical problem solving.",
    },
    {
      degree: "SECONDARY SCHOOL (10TH GRADE)",
      institution: "State Board / Central Board",
      location: "Gurugram, Haryana",
      period: "2019-2020",
      statusOrGrade: "Completed",
      notes: "Completed foundational secondary education with distinction across core academic subjects.",
    },
  ] as EducationItem[],

  certifications: [
    {
      title: "4 Years IT-ITeS Sector Conforming Certificate",
      issuer: "NSDC (National Skill Development Corporation)",
      description: "Rigorous industry alignment program covering information technology and enabled services competency standards.",
    },
    {
      title: "CCC (Course on Computer Concepts)",
      issuer: "NIELIT",
      description: "Nationally recognized certification covering digital literacy, system architecture, networking, and programming fundamentals.",
    },
  ] as CertificationItem[],

  achievements: [
    {
      title: "3-Time College Chess Champion",
      subtitle: "Undefeated inter-college competitive chess champion demonstrating strategy, pattern recognition, and focus.",
      year: "Multi-Year Winner",
      iconType: "chess",
    },
    {
      title: "Winner — National Sports Day 2025",
      subtitle: "Awarded top honor at the annual collegiate National Sports Day competitive event series.",
      year: "2025",
      iconType: "sports",
    },
    {
      title: "Selected for HDFC Badhte Kadam",
      subtitle: "Prestigious merit-based Professional Graduation recognition program.",
      year: "2022 – 2023",
      iconType: "scholarship",
    },
    {
      title: "Selected for LIFE'S GOOD Scholarship Program",
      subtitle: "Honored scholarship award for academic consistency, leadership, and technological promise.",
      year: "2024",
      iconType: "award",
    },
  ] as AchievementItem[],

  testimonials: [
    {
      id: "t1",
      name: "Engineering Mentor",
      role: "Lead Developer / Estovir Technologies",
      // relation: "Direct Internship Supervisor",
      // status: "Testimonial coming soon",
      note: "Endorsement in preparation. Observed Avdhesh's reliability in WordPress maintenance, SEO delivery, and component architecture.",
      avatarUrl: "https://media.licdn.com/dms/image/v2/D5603AQFwKY8RnsJ8tw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1713893172085?e=1791417600&v=beta&t=cD0kTPZ7JhYjH7xa3E0o855gXrXZzZwLoquvOULukdk",
    },
    {
      id: "t2",
      name: "Product Colleague",
      role: "Frontend Team / Reachcure Healthcare",
      relation: "Collaborator",
      status: "Testimonial coming soon",
      note: "Endorsement in preparation. Observed Avdhesh's dedication to responsive Next.js views and REST API coordination.",
      avatarUrl: "https://media.licdn.com/dms/image/v2/D4D03AQFWVSs5yAIDYg/profile-displayphoto-crop_800_800/B4DZnrnoYCHwAI-/0/1760594666080?e=1791417600&v=beta&t=JQBbeAPiXkX_lWZmNGnav3QK9JKWWfpjS8KGfs0pnJo",
    },
    {
      id: "t3",
      name: "Academic Faculty",
      role: "Department of Computer Applications / DPG",
      relation: "BCA Faculty Mentor",
      status: "Testimonial coming soon",
      note: "Endorsement in preparation. Commended 8.0 CGPA performance and disciplined championship chess problem solving.",
      avatarUrl: "https://media.licdn.com/dms/image/v2/D5603AQGRQmYMOgM-lQ/profile-displayphoto-scale_200_200/B56Z7A5hQtHIAg-/0/1781352766211?e=1791417600&v=beta&t=3JF_sKLKhy83PK5UUNvZkk4Uq5ZD-f-2Z3z-P7Cjgug",
    },
  ] as TestimonialItem[],

  blogs: [
    {
      id: "building-polished-nextjs-project",
      title: "Building a polished Next.js project from scratch",
      status: "Published Draft",
      category: "Architecture & Frontend",
      readTime: "6 min read",
      date: "May 18, 2026",
      excerpt: "Deep dive into project layout, Swiss typography systems, server/client boundary choices, and production optimization.",
      tags: ["Next.js", "React", "Architecture", "Performance"],
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      content: `Building a production-grade web application with Next.js requires deliberate architectural choices right from the first commit. In this case study, we examine how to structure clean folder hierarchies, combine Framer Motion with Tailwind CSS utility classes, and maintain optimal Core Web Vitals.`,
      sections: [
        {
          type: "heading",
          title: "1. The Component & Domain Boundary Strategy",
        },
        {
          type: "text",
          content: "The single most common pitfall in modern Next.js development is blurring the line between presentation and domain state. When components handle their own data mutations, API calls, and styling all at once, refactoring becomes treacherous.",
        },
        {
          type: "text",
          content: "By enforcing a strict boundary—keeping pure TypeScript types in isolated files, building atomic UI primitives, and abstracting data transformations—we keep our render tree lightweight, testable, and lightning-fast.",
        },
        {
          type: "quote",
          content: "Simplicity is prerequisite for reliability. Complex state management is almost always a symptom of poorly defined architectural boundaries.",
          author: "Edsger W. Dijkstra",
          source: "Pioneer in Software Engineering",
        },
        {
          type: "heading",
          title: "2. The Visual Craft: Swiss Typography & Micro-Interactions",
        },
        {
          type: "image",
          src: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
          alt: "Minimalist web typography and user experience design layout",
          caption: "Fig 2.1 — Swiss design principles applied to digital interfaces: deliberate white space, high-contrast typography, and purposeful motion.",
        },
        {
          type: "text",
          content: "Polished software feels different the moment you touch it. By setting mathematical scales for typography (step ratios of 1.25+), maintaining consistent padding ratios, and applying magnetic micro-interactions that respond to user intent, an application shifts from feeling like an amateur prototype to an enterprise-grade digital product.",
        },
        {
          type: "callout",
          calloutTitle: "Performance Rule of Thumb",
          content: "Never sacrifice Core Web Vitals for decorative visual effects. Ensure your Largest Contentful Paint (LCP) clocks in below 1.2 seconds before introducing complex animations.",
        },
        {
          type: "heading",
          title: "3. Production Checklist for Modern Next.js",
        },
        {
          type: "list",
          title: "Essential Best Practices for Every Launch:",
          items: [
            "Strict Server/Client Separation: Mark only genuinely interactive leaf nodes with 'use client'.",
            "Asset Optimization: Serve responsive modern formats (WebP/AVIF) with explicit aspect-ratio containers.",
            "Dynamic Metadata: Generate OpenGraph social cards and canonical URLs dynamically for search engine spiders.",
            "Bundle Auditing: Keep first-load JS under 85kb per route by code-splitting heavy third-party packages.",
          ],
        },
      ],
    },
    {
      id: "mastering-rest-apis-node-express",
      title: "What I learned from building with REST APIs",
      status: "Published Draft",
      category: "Backend & Data",
      readTime: "8 min read",
      excerpt: "Structuring robust contracts, error handling, caching patterns, and smooth client-side synchronization.",
      tags: ["REST APIs", "Node.js", "Express"],
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
      content: `Working on backend integrations at Reachcure Healthcare and personal projects taught me that API design is fundamentally about predictability and developer experience.\n\nKey principles for robust REST APIs:\n- Consistent HTTP status code mapping (200, 201, 400, 401, 404, 500).\n- Graceful error responses with clear descriptive messages.\n- Efficient query parameter filtering, sorting, and pagination.\n- Secure CORS and environment configuration management.`,
    },
    {
      id: "seo-basics-every-developer-should-know",
      title: "SEO basics every developer should know",
      status: "Published Draft",
      category: "Performance & Growth",
      readTime: "5 min read",
      date: "Apr 22, 2026",
      excerpt: "Semantic HTML, meta-tags, OpenGraph protocols, sitemaps, and Core Web Vitals that directly influence search rankings.",
      tags: ["SEO", "Web Vitals", "Optimization"],
      imageUrl: "https://images.unsplash.com/photo-1432888622747-4eb9a1efeb07?auto=format&fit=crop&w=800&q=80",
      content: `Search engine optimization is not just for marketers—it is an engineering discipline. Every frontend developer should be intimately familiar with the technical foundations of discoverability.\n\nEssential checklist:\n- Semantic markup: Use proper header tags (H1, H2, H3), <nav>, <main>, <article>, and <footer />.\n- Open Graph and Twitter card meta tags for rich social sharing previews.\n- Fast initial page load times and minimal layout shifts (CLS).\n- Structured JSON-LD schemas for Person, Organization, and CreativeWork.`,
    },
    {
      id: "chess-strategy-in-software-engineering",
      title: "What competitive chess taught me about writing clean code",
      status: "Published Draft",
      category: "Mindset & Strategy",
      readTime: "7 min read",
      date: "Mar 10, 2026",
      excerpt: "How calculating three moves ahead on the chessboard translates to anticipating edge cases, eliminating code smells, and designing resilient full-stack systems.",
      tags: ["Chess", "Problem Solving", "Clean Code", "Architecture"],
      imageUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80",
      content: `As a 3-time College Chess Champion, people often ask how competitive chess relates to writing modern software. The relationship is not merely metaphorical—it is deeply cognitive. Both disciplines demand intense pattern recognition, tactical calculation under clock pressure, and rigorous prophylaxis: the art of neutralizing your opponent's threats before they materialize.`,
      sections: [
        {
          type: "heading",
          title: "1. The Opening: Establishing Principled Foundations",
        },
        {
          type: "text",
          content: "In classical chess, every opening move aims to control the central squares, develop minor pieces with tempo, and secure king safety. If you rush an attack before developing your pieces, your position collapses under the first counter-strike. In modern software engineering, your repository setup, directory architecture, TypeScript types, and continuous integration pipeline constitute your opening book.",
        },
        {
          type: "text",
          content: "When building applications with Next.js and React, skipping modular component boundaries or hardcoding environment dependencies is the software equivalent of launching an unsupported pawn thrust on move four. You may gain fleeting momentum, but technical debt mounts exponentially until your system is paralyzed.",
        },
        {
          type: "quote",
          content: "Tactics is knowing what to do when there is something to do; strategy is knowing what to do when there is nothing to do.",
          author: "Garry Kasparov",
          source: "13th World Chess Champion & Grandmaster",
        },
        {
          type: "heading",
          title: "2. Prophylaxis: Anticipating Edge Cases Before They Strike",
        },
        {
          type: "text",
          content: "The concept of prophylaxis, popularized by Aron Nimzowitsch, describes actions taken not to advance one's own immediate plan, but to prevent the opponent's counterplay. In full-stack engineering, our 'opponent' is the unpredictable nature of real-world networks: slow connections, dropped database transactions, corrupted payloads, and concurrent race conditions.",
        },
        {
          type: "image",
          src: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80",
          alt: "Chess board position requiring deep tactical calculation",
          caption: "Fig 1.1 — Tactical board calculation: evaluating candidate moves and verifying prophylaxis before committing.",
        },
        {
          type: "text",
          content: "When designing an API endpoint or a state transition in React, prophylactic thinking means asking: 'What if the user clicks twice in 100 milliseconds? What if the auth token expires during this multi-step checkout? What if the downstream service returns a 504 Gateway Timeout?' By insulating against failure states at the perimeter, our applications remain unflappable.",
        },
        {
          type: "callout",
          calloutTitle: "Avdhesh's Core Engineering Rule",
          content: "Never commit a state transition until you have calculated the three worst-case counter-moves: high latency, duplicate submissions, and unexpected null states.",
        },
        {
          type: "heading",
          title: "3. Positional Sacrifices vs. Tactical Traps",
        },
        {
          type: "text",
          content: "Amateur players fall into tactical traps because they greedily grab free pawns without inspecting the board geometry. In programming, 'free pawns' take the form of quick-and-dirty copy-paste solutions, skipping unit tests, or bundling bloated third-party dependencies just to use a single helper function.",
        },
        {
          type: "text",
          content: "Conversely, a grandmaster happily makes a positional sacrifice—giving up material now to acquire persistent control over an open file or create an outpost for a knight. In engineering, refactoring a legacy controller into pure functions, writing thorough TypeScript interfaces, and optimizing database indices are our positional sacrifices: upfront investments that guarantee long-term development velocity.",
        },
        {
          type: "image",
          src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
          alt: "Clean code workstation showing TypeScript code architecture",
          caption: "Fig 1.2 — Clean architecture in practice: structured TypeScript types, decoupled logic, and transparent data flow.",
        },
        {
          type: "quote",
          content: "In chess, an unprotected pawn loses the endgame. In software, an unhandled edge case crashes production. Clean code is the armor that protects both.",
          author: "Avdhesh Kumar",
          source: "Software Engineer & 3x College Chess Champion",
        },
        {
          type: "heading",
          title: "4. The Endgame: Precision, Simplicity & Craftsmanship",
        },
        {
          type: "text",
          content: "The endgame is unforgiving. With fewer pieces remaining, a single inaccurate king move can transform a winning advantage into an immediate stalemate or loss. Similarly, in the final stages of shipping software—production build optimization, Core Web Vitals profiling, bundle-size trimming, and accessibility compliance—sloppiness cannot be concealed.",
        },
        {
          type: "list",
          title: "The Master Checklist for Resilient Engineering:",
          items: [
            "Prophylactic State Management: Always handle loading, error, empty, and stale states before rendering data.",
            "Single Responsibility Principle: Ensure components and backend controllers perform exactly one well-defined responsibility.",
            "Minimal Cognitive Overhead: Write code so transparently that another developer can reconstruct your reasoning in seconds.",
            "Speed & Grace Under Pressure: Profile runtime performance and prevent needless re-renders using stabilized memoization.",
          ],
        },
        {
          type: "text",
          content: "Whether facing a master across 64 squares or deploying code to millions of users, the ethos remains identical: cultivate discipline, respect the constraints of the system, and play each move with intentional craft.",
        },
      ],
    },
  ] as BlogPostItem[],

  gallery: [
    {
      id: "g1",
      title: "Inter-College Chess Championship Victory",
      category: "Chess",
      date: "2024 - 2025",
      description: "Captured the 3-time college chess champion trophy after intense tournament matches.",
      imageUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "g2",
      title: "NIELIT CCC Certification",
      category: "Certificates",
      date: "Verified Credential",
      description: "Official Course on Computer Concepts government certification from NIELIT.",
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "g3",
      title: "NSDC IT-ITeS Sector Conforming Award",
      category: "Certificates",
      date: "4-Year Program",
      description: "National Skill Development Corporation professional training and IT industry conformity award.",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "g4",
      title: "National Sports Day 2025 Winner Trophy",
      category: "Hackathons",
      date: "August 2025",
      description: "Secured top victory at the annual collegiate National Sports Day competitive event.",
      imageUrl: "https://images.unsplash.com/photo-1567427017947-545c5f2d16ad?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "g5",
      title: "HDFC Badhte Kadam Fellowship",
      category: "Certificates",
      date: "2022 - 2023",
      description: "Selected for prestigious merit-based professional graduation support.",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "g6",
      title: "Full-Stack Web Architecture Lab",
      category: "Inventions",
      date: "2025",
      description: "Experimental local development lab prototyping microservices, React hooks, and Next.js routers.",
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    },
  ] as GalleryItem[],

  socialLinks: [
    { label: "LinkedIn", url: "https://linkedin.com/in/avdhesh-bca-/" },
    { label: "GitHub", url: "https://github.com/BCABro-9667" },
    { label: "Instagram", url: "https://www.instagram.com/" },
    { label: "Chess.com", url: "https://www.chess.com/member/prankmaster5" },
    { label: "Portfolio", url: "https://avdheshh-portfolio.netlify.app" },
    { label: "Email", url: "mailto:avdeshrajput925064@gmail.com" },
  ],
};
