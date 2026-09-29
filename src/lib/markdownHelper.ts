/**
 * Converts Markdown and plain formatted text into clean semantic HTML tags.
 * Preserves existing HTML, and handles headings, lists, bold/italic, code, blockquotes, and links.
 */
export function convertMarkdownToHtml(input: string): string {
  if (!input || typeof input !== "string") return "";

  // If it's already structured HTML (contains standard block tags), return as is
  const hasBlockHtml = /<(p|h[1-6]|ul|ol|table|blockquote|pre)\b[^>]*>/i.test(input);
  if (hasBlockHtml) {
    return input;
  }

  let text = input.trim();

  // 1. Code blocks: ```lang ... ```
  text = text.replace(/```([a-z0-9_-]*)\r?\n([\s\S]*?)```/gim, (_, lang, code) => {
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `\n<pre><code class="language-${lang || 'plaintext'}">${escaped}</code></pre>\n`;
  });

  // 2. Inline code: `code`
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");

  // 3. Headings: #, ##, ###, ####, #####, ######
  text = text.replace(/^######\s+(.*$)/gim, "<h6>$1</h6>");
  text = text.replace(/^#####\s+(.*$)/gim, "<h5>$1</h5>");
  text = text.replace(/^####\s+(.*$)/gim, "<h4>$1</h4>");
  text = text.replace(/^###\s+(.*$)/gim, "<h3>$1</h3>");
  text = text.replace(/^##\s+(.*$)/gim, "<h2>$1</h2>");
  text = text.replace(/^#\s+(.*$)/gim, "<h1>$1</h1>");

  // 4. Horizontal Rules: --- or ***
  text = text.replace(/^(\s*[-*_]\s*){3,}$/gim, "<hr />");

  // 5. Blockquotes: > text
  text = text.replace(/^>\s+(.*$)/gim, "<blockquote>$1</blockquote>");

  // 6. Bold and Italic
  text = text.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>");
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  text = text.replace(/_([^_]+)_/g, "<em>$1</em>");
  text = text.replace(/~~([^~]+)~~/g, "<del>$1</del>");

  // 7. Links: [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // 8. Images: ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // 9. Unordered Lists (- item, * item)
  text = text.replace(/^[-*+]\s+(.*$)/gim, "§UL_LI§$1§/UL_LI§");

  // 10. Numbered Lists (1. item)
  text = text.replace(/^\d+\.\s+(.*$)/gim, "§OL_LI§$1§/OL_LI§");

  // Group adjacent list items
  text = text.replace(/(§UL_LI§[\s\S]*?§\/UL_LI§\s*)+/gim, (match) => {
    const items = match.replace(/§UL_LI§/g, "<li>").replace(/§\/UL_LI§/g, "</li>");
    return `<ul>${items}</ul>`;
  });

  text = text.replace(/(§OL_LI§[\s\S]*?§\/OL_LI§\s*)+/gim, (match) => {
    const items = match.replace(/§OL_LI§/g, "<li>").replace(/§\/OL_LI§/g, "</li>");
    return `<ol>${items}</ol>`;
  });

  // 11. Paragraphs: split by double line breaks and wrap bare text in <p>
  const blocks = text.split(/\n\s*\n/);
  const result = blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (/^<(h[1-6]|ul|ol|pre|blockquote|hr|img|div|table)/i.test(trimmed)) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .filter(Boolean)
    .join("\n");

  return result;
}
