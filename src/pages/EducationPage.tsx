import React, { useEffect } from "react";
import { motion } from "motion/react";
import { GraduationCap, ArrowRight, ExternalLink, Calendar, MapPin, Check, BookOpen, Trophy, ShieldCheck, ArrowUpRight } from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { updateDocumentSEO } from "../utils/seo";
import { Services } from "../components/Services";

interface EducationPageProps {
  onNavigate: (page: string) => void;
}

export const EducationPage: React.FC<EducationPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    updateDocumentSEO({
      title: "Avdhesh Kumar | BCA & MCA Education at DPG Degree College",
      description: "Academic education of Avdhesh Kumar: Master of Computer Applications (MCA) and Bachelor of Computer Applications (BCA, 8.0 CGPA) at DPG Degree College, MDU.",
      url: "https://avdheshkumar.me/education",
      image: "https://avdheshkumar.me/og-image.png",
      schema: {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": "https://avdheshkumar.me/education#profilepage",
        "url": "https://avdheshkumar.me/education",
        "name": "Avdhesh Kumar | BCA & MCA Education at DPG Degree College",
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
          "jobTitle": "Full-Stack Web Developer",
          "alumniOf": [
            {
              "@type": "CollegeOrUniversity",
              "name": "DPG Degree College, Maharshi Dayanand University (MDU)",
              "url": "https://www.dpgdegreecollege.com/"
            },
            {
              "@type": "EducationalOrganization",
              "name": "Board of School Education Haryana (HBSE)",
              "url": "https://bseh.org.in/home"
            }
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
                onClick={() => onNavigate("home")}
                className="hover:text-[#141413] transition-colors underline cursor-pointer"
              >
                Home
              </button>
            </li>
            <li>/</li>
            <li>
              <button
                onClick={() => onNavigate("about")}
                className="hover:text-[#141413] transition-colors underline cursor-pointer"
              >
                About
              </button>
            </li>
            <li>/</li>
            <li className="text-[#141413] font-semibold" aria-current="page">
              Education
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <header className="max-w-4xl mb-14 sm:mb-16">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#6B6862] mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4F050] border border-[#141413]/30" />
            <span>ACADEMIC FOUNDATION • AVDHESH KUMAR</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#141413] leading-[1.12] mb-6">
            Education & Academic Credentials
          </h1>

          <p className="font-sans text-lg sm:text-xl text-[#6B6862] leading-relaxed">
            A comprehensive overview of Avdhesh Kumar's computer applications education, including MCA studies, BCA graduation distinction (8.0 CGPA) at DPG Degree College (MDU), foundational schooling with HBSE, and verified government sector certifications.
          </p>
        </header>

        {/* Main Education Grid */}
        <div className="space-y-10 sm:space-y-12 mb-20 max-w-5xl mx-auto">
          {PORTFOLIO_DATA.education.map((edu, idx) => {
            const isDpg =
              edu.institution.includes("DPG") ||
              edu.degree.includes("MCA") ||
              edu.degree.includes("BCA");
            const isSchool =
              edu.degree.includes("10th") ||
              edu.degree.includes("12th") ||
              edu.institution.includes("HBSE");
            const officialUrl =
              edu.institutionUrl ||
              (isDpg ? "https://www.dpgdegreecollege.com/" : "https://bseh.org.in/home");

            return (
              <motion.article
                key={edu.degree}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-[28px] sm:rounded-[32px] bg-white border-2 border-[#141413] shadow-[6px_6px_0px_#141413] p-6 sm:p-8 transition-all hover:shadow-[10px_10px_0px_#141413]"
              >
                <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8">
                  {/* Left Column (Content) */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF8F2] border-2 border-[#141413] flex items-center justify-center shrink-0 text-[#141413]">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="font-display font-bold text-2xl sm:text-[26px] text-[#141413] tracking-tight">
                          {edu.degree}
                        </h2>
                        <span className="px-3 py-0.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider bg-[#D4F050] text-[#141413] border border-black/10">
                          {edu.statusOrGrade}
                        </span>
                      </div>
                    </div>

                    <div className="font-sans font-medium text-sm sm:text-base text-[#141413]/85 mb-3">
                      <a
                        href={officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 hover:underline decoration-2 hover:text-[#141413]"
                      >
                        <span>{edu.institution}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#141413] shrink-0" />
                      </a>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs sm:text-sm text-[#6B6862] mb-4">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#141413]" />
                        <span>{edu.location}</span>
                      </span>
                      <span>|</span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#141413]" />
                        <span>{edu.period}</span>
                      </span>
                      <span>|</span>
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#141413]">
                        <span className="w-2 h-2 rounded-full bg-[#D4F050]" />
                        <span>{edu.statusType === "pursuing" ? "Currently Pursuing" : "Completed Distinction"}</span>
                      </span>
                    </div>

                    <p className="font-sans text-sm sm:text-base text-[#4A4742] leading-relaxed mb-4">
                      {edu.notes}
                    </p>

                    {edu.coursework && edu.coursework.length > 0 && (
                      <div className="pt-4 border-t border-gray-100 mb-4">
                        <div className="flex items-center gap-2 font-display font-bold text-sm text-[#141413] mb-2.5">
                          <BookOpen className="w-4 h-4 text-[#141413]" />
                          <span>Core Coursework & Specialized Subjects</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {edu.coursework.map((c) => (
                            <span
                              key={c}
                              className="px-3 py-1 rounded-full font-mono text-xs bg-[#FAF8F2] text-[#141413] border border-gray-200"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {edu.achievements && edu.achievements.length > 0 && (
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 font-display font-bold text-sm text-[#141413] mb-2.5">
                          <Trophy className="w-4 h-4 text-[#A5C418]" />
                          <span>Key Honors & Distinctions</span>
                        </div>
                        <div className="space-y-1.5">
                          {edu.achievements.map((ach, aIdx) => (
                            <div key={aIdx} className="flex items-start gap-2 text-xs sm:text-sm text-[#2D2B28]">
                              <Check className="w-3.5 h-3.5 text-[#141413] mt-0.5 shrink-0" />
                              <span>{ach}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column (Branding & Verified Link) */}
                  <div className="lg:w-[280px] xl:w-[320px] shrink-0 bg-[#F3F7EC] rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-black/5">
                    <div className="w-full h-32 sm:h-36 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <img
                        src={
                          edu.logoUrl ||
                          (isDpg
                            ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg-v5OJk6g687QayRDoOpvZTyxlK0eSc1SMcFeYNon73MjMg72yo2rShxK&s=10"
                            : "https://upload.wikimedia.org/wikipedia/en/3/3d/Haryana_Board_of_School_Education_logo.png")
                        }
                        alt={`${edu.institution} logo`}
                        className="max-h-28 sm:max-h-32 max-w-[240px] sm:max-w-[260px] w-auto object-contain mix-blend-multiply transition-transform duration-300"
                        loading="lazy"
                        crossOrigin="anonymous"
                      />
                    </div>

                    <a
                      href={officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-1.5 font-display font-bold text-base text-[#141413] hover:underline underline-offset-4"
                    >
                      <span className="truncate">{edu.institution.split(",")[0]}</span>
                      <ExternalLink className="w-4 h-4 text-[#141413] shrink-0" />
                    </a>

                    <span className="font-mono text-xs text-[#6B6862] mt-1">
                      {isSchool ? "Official Board Portal" : "Official College Portal"}
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Government & Sector Certifications Section */}
        <section aria-labelledby="certifications-heading" className="max-w-5xl mx-auto mb-16">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#6B6862] mb-6">
            <ShieldCheck className="w-4 h-4 text-[#141413]" />
            <h2 id="certifications-heading" className="font-bold text-xs uppercase tracking-widest text-[#141413]">
              Government & Sector Certifications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PORTFOLIO_DATA.certifications.map((cert, idx) => (
              <div
                key={cert.title}
                className="p-6 sm:p-7 rounded-2xl bg-[#FAF8F2] border-2 border-[#141413] shadow-[4px_4px_0px_#141413] flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#141413] text-[#D4F050] flex items-center justify-center shrink-0 border border-[#141413] font-bold">
                  ✓
                </div>
                <div className="space-y-1.5">
                  <div className="font-mono text-[11px] text-[#A5C418] uppercase tracking-wider font-bold">
                    {cert.issuer}
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#141413]">
                    {cert.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#6B6862] leading-relaxed">
                    {cert.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES & EXPERTISE Section (Immediately after Government & Sector Certifications) */}
        <section aria-label="Services & Expertise" className="max-w-5xl mx-auto mb-20">
          <Services onNavigate={onNavigate} isPageSection={true} />
        </section>

        {/* Contextual Internal Linking */}
        <section className="p-8 sm:p-10 rounded-3xl bg-[#141413] text-[#F5F2EA] max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-2 border-[#141413] shadow-[8px_8px_0px_#D4F050]">
          <div>
            <div className="font-mono text-xs text-[#D4F050] uppercase tracking-widest mb-1.5 font-bold">
              EXPLORE MORE OF AVDHESH KUMAR
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold">
              Connect academics with production software.
            </h3>
            <p className="font-sans text-sm text-[#9E9A91] mt-1 max-w-xl">
              Discover how Avdhesh Kumar applies computer science rigor and strategic chess thinking to production web applications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate("projects")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#D4F050] text-[#141413] font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("chess")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 text-white border border-white/20 font-mono text-xs uppercase tracking-wider hover:bg-white hover:text-[#141413] transition-colors cursor-pointer"
            >
              <span>Chess Achievements</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
