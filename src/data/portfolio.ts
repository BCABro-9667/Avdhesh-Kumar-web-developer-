export interface Project {
  id: string;
  _id?: string;
  number: string;
  title: string;
  category: string;
  technology: string;
  description: string;
  shortDescription?: string;
  features: string[];
  style: 'dark' | 'cream' | 'lavender';
  ctaText: string;
  url: string;
  slug?: string;
  githubUrl?: string;
  highlightMetric?: string;
  imageUrl?: string;
  featuredImage?: string;
  imageUrls?: string[];
  likes?: number;
}

export interface ExperienceProject {
  name: string;
  url?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  companyUrl?: string;
  logoUrl?: string;
  role: string;
  duration: string;
  periodLabel: string;
  location: string;
  employmentType?: string;
  durationYears?: string;
  summary?: string;
  responsibilities: string[];
  skillsUsed: string[];
  projectsWorkedOn?: ExperienceProject[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  institutionUrl?: string;
  logoUrl?: string;
  location: string;
  period: string;
  statusOrGrade: string;
  statusType?: "pursuing" | "completed";
  notes?: string;
  coursework?: string[];
  achievements?: string[];
  activities?: ExperienceProject[];
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
  featuredImage?: string;
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
    portfolioUrl: "https://avdheshkumar.me",
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
    { label: "Experience", value: "2 Years", detail: "Tech & web development roles" },
    { label: "Featured Projects", value: "20+", detail: "Full-stack, e-com & community" },
    { label: "Clients", value: "5+", detail: "Worldwide satisfied clients" },
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
      id: "taskmaster-personal-productivity-work-management-workspace",
      _id: "6aba9d7e9d61a6ca95078621",
      slug: "taskmaster-personal-productivity-work-management-workspace",
      number: "01",
      title: "TaskMaster — Personal Productivity & Work Management Workspace",
      category: "Productivity & Workspace",
      technology: "Next.js · React.js · Node.js · Express.js · MongoDB · Tailwind CSS · REST API",
      description: "TaskMaster helps you organize, track, and complete your projects efficiently. Say goodbye to chaos and hello to streamlined productivity.",
      features: [
        "Interactive Kanban boards and deadline tracking",
        "Secure user authentication and workspace segregation",
        "Real-time task state transitions and activity feeds",
      ],
      style: "dark",
      ctaText: "Explore Case Study ↗",
      url: "https://taskmaster-by-avdhesh.netlify.app/",
      githubUrl: "https://github.com/BCABro-9667/taskmaster-workspace",
      imageUrl: "/projects/taskmaster.png",
      featuredImage: "/projects/taskmaster.png",
      likes: 12,
    },
    {
      id: "shortly-free-url-shortener",
      _id: "6aba8b7a0f7be522bb352f20",
      slug: "shortly-free-url-shortener",
      number: "02",
      title: "Shortly – Free URL Shortener",
      category: "Web Utilities & Tools",
      technology: "React.js · Node.js · Express.js · MongoDB · Tailwind CSS · REST APIs · Vercel",
      description: "Shortly is a clean, minimal, and lightning-fast URL shortening web service built with modern full-stack technologies.",
      features: [
        "Instant URL shortening with custom slug generation",
        "Click analytics and real-time redirection metrics",
        "Clean, responsive interface with QR code generation",
      ],
      style: "cream",
      ctaText: "Explore Case Study ↗",
      url: "https://shortly-by-avdhesh.netlify.app/",
      githubUrl: "https://github.com/BCABro-9667/shortly-url-shortener",
      imageUrl: "/projects/shortly.png",
      featuredImage: "/projects/shortly.png",
      likes: 8,
    },
    {
      id: "love4u-musics-romantic-online-music-player-html-css-javascript",
      _id: "6aba7c9fe1fa2207908c6a0c",
      slug: "love4u-musics-romantic-online-music-player-html-css-javascript",
      number: "03",
      title: "Love4U Musics – Romantic Online Music Player | HTML, CSS & JavaScript",
      category: "Frontend Web Apps",
      technology: "HTML5 · CSS3 · Modern JavaScript ES6+ · Web Audio API · Responsive Design",
      description: "Love4U Musics is a lightweight, responsive online music player website designed with a romantic aesthetic and modern audio playback features.",
      features: [
        "Web Audio API stream player with playlist support",
        "Custom audio visualizer and responsive playback controls",
        "Zero-dependency lightweight vanilla JavaScript architecture",
      ],
      style: "lavender",
      ctaText: "Explore Case Study ↗",
      url: "https://love4u-musics.netlify.app/",
      githubUrl: "https://github.com/BCABro-9667/love4u-musics",
      imageUrl: "/projects/love4u.jpg",
      featuredImage: "/projects/love4u.jpg",
      likes: 6,
    },
    {
      id: "chess-tournament-registration-form",
      _id: "6ab69a8bb2f9543dddc98244",
      slug: "chess-tournament-registration-form",
      number: "04",
      title: "Chess Tournament Registration Form",
      category: "Featured Projects",
      technology: "HTML5 · CSS3 · JavaScript · Google Sheets API",
      description: "Simple chess tournament registration form designed to collect participant data directly into Google Sheets with real-time validation.",
      features: [
        "Instant registration validation and data capture",
        "Direct Google Sheets API synchronization",
        "Chess-themed responsive interface",
      ],
      style: "dark",
      ctaText: "Explore Case Study ↗",
      url: "https://chess-tournament-registration-form.netlify.app/",
      githubUrl: "https://chess-tournament-registration-form.netlify.app/",
      imageUrl: "/projects/chess-form.jpg",
      featuredImage: "/projects/chess-form.jpg",
      likes: 2,
    },
    {
      id: "smtems-industrial-smt-electronics-manufacturing-solutions-website",
      _id: "6ab56528cb05f7e53339e886",
      slug: "smtems-industrial-smt-electronics-manufacturing-solutions-website",
      number: "05",
      title: "SMTEMS – Industrial SMT & Electronics Manufacturing Solutions Website",
      category: "Industrial Manufacturing",
      technology: "WordPress · PHP · WooCommerce · Responsive Web Design · SEO",
      description: "SMTEMS is a professional corporate website for an industrial manufacturing company specializing in Surface Mount Technology equipment.",
      features: [
        "Comprehensive industrial product catalog",
        "Technical specification sheets and inquiry funnels",
        "Optimized on-page technical SEO and responsive design",
      ],
      style: "cream",
      ctaText: "Explore Case Study ↗",
      url: "https://smtems.com/",
      githubUrl: "https://smtems.com/",
      imageUrl: "/projects/smtems.png",
      featuredImage: "/projects/smtems.png",
      likes: 3,
    },
  ] as Project[],

  experience: [
    {
      id: "vmd-cad",
      company: "VMD CAD & Graphic Technologies Pvt. Ltd.",
      companyUrl: "https://www.vmdcadconversion.com/about.html",
      logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCoB2s2G7AkNoLeGWMhql8bK2GcNHZfVFrgpGwRqnw27khaaV2BFg5Oa4&s=10",
      role: "Administrative Executive",
      duration: "Aug 2026 – Present",
      durationYears: "Ongoing",
      periodLabel: "Job",
      employmentType: "Full-time",
      location: "Gurugram, India",
      summary: "Managing administrative operations, digital documentation workflows, client communications, and corporate operational hygiene.",
      responsibilities: [
        "Managing administrative operations and documentation workflows",
        "Coordinating corporate records, project schedules, and client communications",
        "Streamlining office digital records and data management hygiene",
        "Collaborating with cross-functional technical and creative design teams",
      ],
      skillsUsed: ["Administration", "Operations", "Documentation", "Workflow Management", "MS Office"],
      projectsWorkedOn: [
        { name: "Corporate Portal", url: "https://www.vmdcadconversion.com/about.html" },
        { name: "Workflow Management", url: "https://www.vmdcadconversion.com/about.html" },
      ],
    },
    {
      id: "estovir",
      company: "Estovir Technologies",
      companyUrl: "https://smtems.com/",
      logoUrl: "https://fplogoimages.withfloats.com/new-mobile/63b3e90ca4c3440001407fbd.png",
      role: "Web Developer & IT Engineer",
      duration: "Jan 2024 – Present",
      durationYears: "1 Year",
      periodLabel: "Full-time",
      employmentType: "Full-time",
      location: "Faridabad, India",
      summary: "Working as a Web Developer at Estovir Technologies, focusing on building modern, scalable and user-centric web applications. Handling end-to-end development, client requirements, deployment and ongoing maintenance.",
      responsibilities: [
        "Website development and continuous maintenance using WordPress",
        "Crafting responsive and modular frontend components",
        "Executing on-page SEO strategies to improve search visibility",
        "Auditing performance and optimizing site speed",
        "Managing server, backups and security hygiene",
        "Version control using Git/GitHub and collaborating with cross-functional teams",
      ],
      skillsUsed: ["WordPress", "HTML", "CSS", "JavaScript", "React.js", "PHP", "MySQL", "Git", "GitHub", "Figma"],
      projectsWorkedOn: [
        { name: "Company Website", url: "https://smtems.com/" },
        { name: "Client Projects (5+)", url: "https://smtems.com/" },
        { name: "SEO Optimization", url: "https://smtems.com/" },
      ],
    },
    {
      id: "reachcure",
      company: "ReachCure",
      companyUrl: "https://www.reachcure.in/",
      logoUrl: "https://media.licdn.com/dms/image/v2/D563DAQFGo0pMfGAt1Q/image-scale_191_1128/B56ZYAogYsGcAk-/0/1743767341037/reachcure_cover?e=1791349200&v=beta&t=2Q0DILMaDG94XNFohLEeyhi-rdQ4BkHiM9rQA1rMqSo",
      role: "Frontend Web Developer Intern",
      duration: "Oct 2023 – Dec 2023",
      durationYears: "3 mos",
      periodLabel: "Internship",
      employmentType: "Internship",
      location: "Gurgaon, India",
      summary: "Architecting responsive React.js and Next.js view architectures, integrating RESTful APIs, and developing scalable healthcare user experiences.",
      responsibilities: [
        "Building responsive React.js and Next.js view architectures",
        "Integrating WordPress headless layers and external RESTful APIs",
        "Coordinating with Node.js and Express.js backend services",
        "Querying and structuring data with MongoDB and SQL",
        "Managing feature branching, code reviews, and Git/GitHub deployments",
        "Visual design asset creation with Adobe Photoshop and Canva",
      ],
      skillsUsed: ["React.js", "Next.js", "RESTful APIs", "Node.js", "Express.js", "MongoDB", "SQL", "Photoshop"],
      projectsWorkedOn: [
        { name: "Healthcare Platform", url: "https://www.reachcure.in/" },
        { name: "Patient Portal UI", url: "https://www.reachcure.in/" },
        { name: "API Integration Hub", url: "https://www.reachcure.in/" },
      ],
    },
  ] as ExperienceItem[],

  education: [
    {
      degree: "MCA – Master of Computer Applications",
      institution: "DPG Degree College, Maharshi Dayanand University (MDU)",
      institutionUrl: "https://www.dpgdegreecollege.com/",
      logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg-v5OJk6g687QayRDoOpvZTyxlK0eSc1SMcFeYNon73MjMg72yo2rShxK&s=10",
      location: "Gurgaon, India",
      period: "2024 – 2026",
      statusOrGrade: "Pursuing",
      statusType: "pursuing",
      notes: "Currently pursuing MCA with a focus on computer science, web development, cloud computing, and software engineering.",
      coursework: [
        "Advanced Data Structures",
        "Distributed Systems",
        "Cloud Computing",
        "Web Engineering",
        "Database Architecture",
        "Software Engineering",
      ],
      achievements: [
        "Pursuing MCA with focus on computer science, web development and software engineering",
        "Active technical participant in collegiate engineering circles and hackathons",
      ],
      activities: [
        { name: "Official College Portal", url: "https://www.dpgdegreecollege.com/" },
        { name: "MCA Research Lab", url: "https://www.dpgdegreecollege.com/" },
      ],
    },
    {
      degree: "BCA – Bachelor of Computer Applications",
      institution: "DPG Degree College, Maharshi Dayanand University (MDU)",
      institutionUrl: "https://www.dpgdegreecollege.com/",
      logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg-v5OJk6g687QayRDoOpvZTyxlK0eSc1SMcFeYNon73MjMg72yo2rShxK&s=10",
      location: "Gurgaon, India",
      period: "2021 – 2024",
      statusOrGrade: "CGPA: 8.0",
      statusType: "completed",
      notes: "Graduated with 8.0 CGPA distinction. Comprehensive study across programming paradigms, algorithmic analysis, DBMS, and web technologies.",
      coursework: [
        "Data Structures & Algorithms",
        "Database Management Systems (DBMS)",
        "OOPs (Java & C++)",
        "Computer Networks",
        "Web Technologies",
        "Operating Systems",
      ],
      achievements: [
        "Graduated with distinction (8.0 CGPA)",
        "4-Time College Chess Champion in inter-college competitive tournament series",
        "Winner — National Sports Day 2025 competitive series",
        "Selected for HDFC Badhte Kadam Professional Graduation recognition scholarship",
      ],
      activities: [
        { name: "Collegiate Chess Team", url: "https://www.dpgdegreecollege.com/" },
        { name: "Capstone Web Project", url: "https://www.dpgdegreecollege.com/" },
      ],
    },
    {
      degree: "Senior Secondary (12th Grade)",
      institution: "Govt. Sr. Sec. School Bhangrola [Gurgaon] - HBSE Board",
      institutionUrl: "https://bseh.org.in/home",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/3/3d/Haryana_Board_of_School_Education_logo.png",
      location: "Gurugram, Haryana",
      period: "2021 – 2022",
      statusOrGrade: "88%",
      statusType: "completed",
      notes: "Core focus on Science & Mathematics, foundational programming logic, and analytical problem solving.",
      coursework: ["Mathematics", "Physics", "Chemistry", "Computer Science", "Analytical Logic"],
      achievements: [
        "Completed Senior Secondary examination with focus on Science and Mathematics",
      ],
      activities: [
        { name: "Official Board Portal", url: "https://bseh.org.in/home" },
      ],
    },
    {
      degree: "Secondary School (10th Grade)",
      institution: "Govt. Sr. Sec. School Bhangrola [Gurgaon] - HBSE Board",
      institutionUrl: "https://bseh.org.in/home",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/3/3d/Haryana_Board_of_School_Education_logo.png",
      location: "Gurugram, Haryana",
      period: "2019-2020",
      statusOrGrade: "78%",
      statusType: "completed",
      notes: "Completed foundational secondary education with distinction across core academic subjects.",
      coursework: ["Mathematics", "Science", "Social Studies", "English", "Hindi"],
      achievements: [
        "Completed Secondary education with strong distinction in STEM subjects",
      ],
      activities: [
        { name: "Official Board Portal", url: "https://bseh.org.in/home" },
      ],
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
      year: "4 Times Champion",
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
      id: "ai-tools-people-use-every-day-how-artificial-intelligence-is-changing-our-daily-lives",
      title: "AI Tools People Use Every Day: How Artificial Intelligence Is Changing Our Daily Lives",
      status: "published",
      category: "Artificial Intelligence",
      readTime: "5 min read",
      excerpt: "Discover the AI tools and technologies people use every day, their benefits and limitations, privacy concerns, and how AI is changing the way we live and work.",
      tags: ["Artificial Intelligence", "AI Tools", "Technology", "Digital Transformation", "Future of Technology"],
      date: "Sep 28, 2026",
      imageUrl: "/blogs/ai-tools.jpg",
      featuredImage: "/blogs/ai-tools.jpg",
    },
    {
      id: "the-night-that-made-a-mahatma",
      title: "The Night That Made a Mahatma",
      status: "published",
      category: "History",
      readTime: "4 min read",
      excerpt: "The Story of Gandhi's Transformation at Pietermaritzburg Station — how a single defining moment ignited the philosophy of Satyagraha.",
      tags: ["#Gandhi", "#MahatmaGandhi", "#Satyagraha", "#NonViolence"],
      date: "Sep 24, 2026",
      imageUrl: "/blogs/mahatma.jpg",
      featuredImage: "/blogs/mahatma.jpg",
    },
    {
      id: "putin-s-biggest-battlefield-shock-of-the-year-just-happened",
      title: "Putin’s Biggest Battlefield Shock of the Year Just Happened",
      status: "published",
      category: "Politics",
      readTime: "3 min read",
      excerpt: "An in-depth analysis of geopolitical developments and tactical shifts observed across modern international conflicts.",
      tags: ["Ukraine", "War", "Politics", "Geopolitics", "World"],
      date: "Sep 24, 2026",
      imageUrl: "/blogs/putin.webp",
      featuredImage: "/blogs/putin.webp",
    },
  ] as BlogPostItem[],

  gallery: [
    {
      id: "6abaf8afb2c29385048cba35",
      title: "DPG Degree College Sports & Chess Championship",
      category: "Chess",
      date: "Feb 2025",
      description: "Avdhesh Kumar, BCA student at DPG Degree College, won the DPG 2025 Chess Championship and secured 2nd place at ATHLEEMA 2025.",
      imageUrl: "https://res.cloudinary.com/dlkc5p27/image/upload/v1790638203/portfolio_cms/a57j36qf4l4pbgqxpnj1.jpg",
    },
    {
      id: "6ab9dbcebe34565f2cdc168e",
      title: "1st Position in Inter-College Chess | DPG College BCA",
      category: "Certificates",
      date: "Feb 2025",
      description: "Securing 1st position in competitive collegiate chess tournament series.",
      imageUrl: "https://res.cloudinary.com/dlkc5p27/image/upload/v1790565309/portfolio_cms/h7uszisdunegk8ll0zr7.jpg",
    },
    {
      id: "6ab9db7dbe34565f2cdc168c",
      title: "1st Position in Chess | DPG College MCA",
      category: "Certificates",
      date: "2025–26",
      description: "Securing 1st position in the boys' collegiate chess championship during MCA studies.",
      imageUrl: "https://res.cloudinary.com/dlkc5p27/image/upload/v1790565233/portfolio_cms/uvgmlbq2o7747xfyl4yh.jpg",
    },
    {
      id: "6ab9db32be34565f2cdc168a",
      title: "1st Position in Chess | Momentum Festival",
      category: "Chess",
      date: "2025",
      description: "1st position in open competitive chess championship at Momentum festival, The NorthCap University.",
      imageUrl: "https://res.cloudinary.com/dlkc5p27/image/upload/v1790565168/portfolio_cms/hum6wvgmuts6e2z4omn7.jpg",
    },
    {
      id: "6ab9db5bbe34565f2cdc168b",
      title: "3rd Position in Chess | DPG Degree College",
      category: "Certificates",
      date: "2023–24",
      description: "Securing podium position in collegiate championship tournament series.",
      imageUrl: "https://res.cloudinary.com/dlkc5p27/image/upload/v1790565207/portfolio_cms/ywkugp2f4opuh1iwbutn.jpg",
    },
    {
      id: "6ab9dba4be34565f2cdc168d",
      title: "2nd Position in Chess Competition | DPG College",
      category: "Certificates",
      date: "2024",
      description: "Securing 2nd position in annual college competitive series.",
      imageUrl: "https://res.cloudinary.com/dlkc5p27/image/upload/v1790565273/portfolio_cms/nd6yxliji68w0vbcxy3e.jpg",
    },
  ] as GalleryItem[],

  socialLinks: [
    { label: "LinkedIn", url: "https://linkedin.com/in/avdhesh-bca-/" },
    { label: "GitHub", url: "https://github.com/BCABro-9667" },
    { label: "Instagram", url: "https://www.instagram.com/avdhgz" },
    { label: "Chess.com", url: "https://www.chess.com/member/prankmaster5" },
    { label: "Portfolio", url: "https://avdheshkumar.me" },
    { label: "Email", url: "mailto:avdeshrajput925064@gmail.com" },
  ],
};
