/**
 * Utility for dynamically updating head meta tags and OpenGraph / Twitter card metadata
 * when navigating pages client-side, ensuring link previews and browsers are consistent.
 */

export interface SEOUpdateOptions {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  category?: string;
  publishedTime?: string;
  modifiedTime?: string;
  schema?: Record<string, any>;
}

export function updateDocumentSEO(options: SEOUpdateOptions) {
  const {
    title,
    description,
    image = "https://avdheshkumar.me/og-image.png",
    url = window.location.href,
    type = "website",
    category,
    publishedTime,
    modifiedTime,
    schema,
  } = options;

  // 1. Update Document Title
  document.title = title;

  // Helper to get or create a meta tag
  const setMeta = (attribute: string, attrValue: string, content: string) => {
    let el = document.querySelector(`meta[${attribute}="${attrValue}"]`) as HTMLMetaElement;
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attribute, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };

  // Helper to set link tags (e.g. canonical)
  const setLink = (rel: string, href: string) => {
    let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", rel);
      document.head.appendChild(el);
    }
    el.setAttribute("href", href);
  };

  // 2. Standard Meta Tags
  setMeta("name", "description", description);

  // 3. OpenGraph Tags
  setMeta("property", "og:type", type);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:image", image);
  setMeta("property", "og:image:alt", title);
  setMeta("property", "og:url", url);
  setMeta("property", "og:site_name", "Avdhesh Kumar — Portfolio & Journal");

  // 4. Twitter / X Card Tags
  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
  setMeta("name", "twitter:image", image);
  setMeta("name", "twitter:image:alt", title);

  // 5. Canonical Link
  setLink("canonical", url);

  // 6. Article Metadata if applicable
  if (type === "article") {
    if (publishedTime) setMeta("property", "article:published_time", publishedTime);
    if (modifiedTime) setMeta("property", "article:modified_time", modifiedTime);
    if (category) setMeta("property", "article:section", category);
    setMeta("property", "article:author", "Avdhesh Kumar");
  }

  // 7. Schema.org JSON-LD Script
  if (schema) {
    let scriptEl = document.querySelector(`script[data-dynamic-seo="true"]`) as HTMLScriptElement;
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.setAttribute("type", "application/ld+json");
      scriptEl.setAttribute("data-dynamic-seo", "true");
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schema, null, 2);
  }
}
