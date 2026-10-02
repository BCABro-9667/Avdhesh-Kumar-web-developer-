import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Trophy, ArrowRight, ExternalLink, Shield, Target, Brain, Cpu, Sparkles, Award } from "lucide-react";
import { updateDocumentSEO } from "../utils/seo";

interface ChessPageProps {
  onNavigate: (page: string) => void;
}

const CHESS_PRINCIPLES = [
  {
    icon: Target,
    title: "Proactive Calculation (3-5 Moves Ahead)",
    description:
      "In chess, a tactical blunder occurs when you only react to immediate threats. In software architecture, I design distributed schemas and component state trees anticipating scale bottlenecks and race conditions before writing a line of code.",
    badge: "Anticipation",
  },
  {
    icon: Shield,
    title: "Resilient Defense & King Safety",
    description:
      "A grandmaster never launches an offensive without fortifying their own position. In full-stack engineering, king safety translates directly to strict input sanitization, database rate limiting, zero-trust authentication, and secure headers.",
    badge: "Security & Stability",
  },
  {
    icon: Cpu,
    title: "Endgame Precision & Minimalist Efficiency",
    description:
      "When the board clears, every pawn move counts. Similarly, in high-performance web applications, endgame execution means shaving bytes, pruning unused dependencies, caching aggressively, and delivering sub-second LCP.",
    badge: "Performance",
  },
  {
    icon: Brain,
    title: "Acute Pattern Recognition Under Clock Pressure",
    description:
      "Competitive blitz chess trains the brain to spot tactical motifs in milliseconds. During live production incidents and complex algorithmic challenges, this intuitive pattern matching enables rapid, surgical debugging.",
    badge: "Problem Solving",
  },
];

const ACHIEVEMENTS = [
  {
    title: "4-Time Inter-College Chess Champion",
    event: "DPG Degree College Annual Sports Fest & Inter-University Tournaments",
    period: "2021 – 2025",
    description: "Undefeated champion across collegiate blitz and classical tournament brackets, demonstrating strategic discipline and mental resilience.",
    highlight: "Gold Medalist",
  },
  {
    title: "Winner — National Sports Day 2025 (Chess)",
    event: "National Sports Day Collegiate Championship",
    period: "August 2025",
    description: "Secured first place in the collegiate open championship with a flawless tactical run through Swiss-system tournament rounds.",
    highlight: "1st Place",
  },
  {
    title: "Active Competitive Player on Chess.com",
    event: "Global Rapid & Blitz Matchmaking",
    period: "Current",
    description: "Regularly competing against global opponents, studying grandmaster games, analyzing classical openings (Sicilian Defense, Queen's Gambit, King's Indian), and sharpening tactical intuition.",
    highlight: "@prankmaster5",
  },
];

export const ChessPage: React.FC<ChessPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    updateDocumentSEO({
      title: "Avdhesh Kumar | 4-Time College Chess Champion & Strategic Thinker",
      description: "Explore the competitive chess journey, tactical achievements, and strategic parallels of 4-time college chess champion and full-stack software engineer Avdhesh Kumar.",
      url: "https://avdheshkumar.me/chess",
      image: "https://avdheshkumar.me/og-image.png",
      schema: {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": "https://avdheshkumar.me/chess#profilepage",
        "url": "https://avdheshkumar.me/chess",
        "name": "Avdhesh Kumar | 4-Time College Chess Champion",
        "isPartOf": {
          "@id": "https://avdheshkumar.me/#website"
        },
        "about": {
          "@id": "https://avdheshkumar.me/#person"
        },
        "mainEntity": {
          "@type": "Person",
          "@id": "https://avdheshkumar.me/#person",
          "name": "Avdhesh Kumar",
          "jobTitle": "Full-Stack Web Developer & Chess Champion",
          "award": [
            "4-Time College Chess Champion",
            "Winner National Sports Day 2025 Chess Tournament"
          ],
          "sameAs": [
            "https://www.chess.com/member/prankmaster5"
          ]
        }
      }
    });
  }, []);

  return (
    <div className="pt-28 sm:pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 font-mono text-xs text-[#6B6862]">
          <ol className="flex items-center gap-2">
            <li>
              <button
                type="button"
                onClick={() => onNavigate("home")}
                className="hover:text-[#141413] transition-colors underline cursor-pointer"
              >
                Home
              </button>
            </li>
            <li>/</li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate("about")}
                className="hover:text-[#141413] transition-colors underline cursor-pointer"
              >
                About
              </button>
            </li>
            <li>/</li>
            <li className="text-[#141413] font-semibold" aria-current="page">
              Chess
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <header className="max-w-4xl mb-14 sm:mb-16">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#6B6862] mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4F050] border border-[#141413]/30" />
            <span>TACTICAL DISCIPLINE • 4× CHAMPION</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#141413] leading-[1.12] mb-6">
            Competitive Chess & Strategic Thinking
          </h1>

          <p className="font-sans text-lg sm:text-xl text-[#6B6862] leading-relaxed">
            Competitive chess is my ultimate mental gymnasium. As a 4-time College Chess Champion, the 64 squares have forged my deep strategic patience, acute pattern recognition, and methodical anticipation under time pressure — principles that directly elevate every line of production software I architect.
          </p>
        </header>

        {/* Hero Banner Card with Chess Motif */}
        <div className="mb-16 rounded-[28px] sm:rounded-[32px] bg-[#141413] text-[#FAF8F2] border-2 border-[#141413] shadow-[8px_8px_0px_#D4F050] p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-xs font-bold bg-[#D4F050] text-[#141413] mb-6">
              <Trophy className="w-4 h-4" />
              <span>COLLEGIATE CHESS CHAMPION</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 tracking-tight leading-snug">
              "Every move has a consequence. Think three moves ahead."
            </h2>

            <p className="font-sans text-base sm:text-lg text-[#FAF8F2]/80 leading-relaxed mb-8">
              Whether orchestrating a Kingside pawn storm or designing a fault-tolerant microservice API, success comes down to calculating branching trees of possibilities and preserving defensive equilibrium.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://www.chess.com/member/prankmaster5"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4F050] hover:bg-[#c2de44] text-[#141413] font-mono font-bold text-sm border-2 border-[#141413] transition-transform hover:-translate-y-0.5"
              >
                <span>Challenge on Chess.com (@prankmaster5)</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => onNavigate("projects")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF8F2] font-mono text-sm border border-white/20 transition-colors"
              >
                <span>Explore Engineered Systems</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Decorative Chess Motif */}
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none select-none text-[220px] font-serif leading-none">
            ♞
          </div>
        </div>

        {/* Strategic Parallels Section */}
        <section className="mb-20">
          <div className="max-w-3xl mb-10">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#6B6862] mb-2">
              METHODOLOGY & PARALLELS
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#141413] tracking-tight">
              How Chess Strategy Translates to Clean Code
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {CHESS_PRINCIPLES.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="rounded-[24px] bg-white border-2 border-[#141413] shadow-[5px_5px_0px_#141413] p-6 sm:p-8 flex flex-col justify-between hover:shadow-[8px_8px_0px_#141413] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#FAF8F2] border-2 border-[#141413] flex items-center justify-center text-[#141413]">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#FAF8F2] border border-[#141413]/20 text-[#141413]">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-[#141413] mb-3">
                      {item.title}
                    </h3>

                    <p className="font-sans text-sm sm:text-base text-[#6B6862] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Tournament Highlights & Awards */}
        <section className="mb-20">
          <div className="max-w-3xl mb-10">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#6B6862] mb-2">
              RECORD & RECOGNITION
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#141413] tracking-tight">
              Championship Honors & Tournament Record
            </h2>
          </div>

          <div className="space-y-6 max-w-4xl">
            {ACHIEVEMENTS.map((ach, idx) => (
              <motion.div
                key={ach.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="rounded-[24px] bg-white border-2 border-[#141413] shadow-[5px_5px_0px_#141413] p-6 sm:p-8 hover:shadow-[8px_8px_0px_#141413] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Award className="w-5 h-5 text-[#141413]" />
                      <h3 className="font-display text-xl font-bold text-[#141413]">
                        {ach.title}
                      </h3>
                    </div>
                    <div className="font-mono text-xs text-[#6B6862]">
                      {ach.event} • {ach.period}
                    </div>
                  </div>

                  <span className="self-start px-3.5 py-1 rounded-full font-mono text-xs font-bold bg-[#D4F050] text-[#141413] border border-[#141413]/20">
                    {ach.highlight}
                  </span>
                </div>

                <p className="font-sans text-sm sm:text-base text-[#6B6862] leading-relaxed">
                  {ach.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Footer Navigation */}
        <section className="pt-8 border-t border-[#141413]/10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onNavigate("education")}
              className="inline-flex items-center gap-2 font-mono text-sm font-bold text-[#141413] hover:underline cursor-pointer"
            >
              <span>← View Academic Education</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("projects")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141413] hover:bg-[#D4F050] text-[#D4F050] hover:text-[#141413] font-mono text-sm font-bold border-2 border-[#141413] transition-colors cursor-pointer"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
