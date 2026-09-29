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

  projects: [] as Project[],

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

  blogs: [] as BlogPostItem[],

  gallery: [] as GalleryItem[],

  socialLinks: [
    { label: "LinkedIn", url: "https://linkedin.com/in/avdhesh-bca-/" },
    { label: "GitHub", url: "https://github.com/BCABro-9667" },
    { label: "Instagram", url: "https://www.instagram.com/" },
    { label: "Chess.com", url: "https://www.chess.com/member/prankmaster5" },
    { label: "Portfolio", url: "https://avdheshh-portfolio.netlify.app" },
    { label: "Email", url: "mailto:avdeshrajput925064@gmail.com" },
  ],
};
