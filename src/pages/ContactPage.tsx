import React, { useEffect } from "react";
import { Contact } from "../components/Contact";
import { updateDocumentSEO } from "../utils/seo";

export const ContactPage: React.FC = () => {
  useEffect(() => {
    updateDocumentSEO({
      title: "Contact & Collaboration — Avdhesh Kumar",
      description: "Get in touch with Avdhesh Kumar for freelance projects, full-stack engineering roles, or consulting in Gurgaon, India.",
      url: "https://avdheshkumar.me/contact",
      image: "https://avdheshkumar.me/og-image.png",
    });
  }, []);
  return (
    <div className="pt-16 sm:pt-20 pb-20">
      <Contact />
    </div>
  );
};
