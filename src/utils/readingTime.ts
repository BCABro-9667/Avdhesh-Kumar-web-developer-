/**
 * Calculates accurate reading time based on rich text content (HTML, Markdown, or plain text).
 * Follows industry-standard publishing metrics:
 * - 200 words per minute average reading speed
 * - 10-12 seconds per embedded image
 * - 20 seconds per embedded data table
 * - Minimum 1 min read
 */
export function calculateReadingTime(content: string | undefined | null): string {
  if (!content || typeof content !== "string") {
    return "1 min read";
  }

  // Count embedded images (<img ...>)
  const imageMatches = content.match(/<img\s+[^>]*>/gi);
  const imageCount = imageMatches ? imageMatches.length : 0;

  // Count embedded data tables (<table ...>)
  const tableMatches = content.match(/<table\s+[^>]*>/gi);
  const tableCount = tableMatches ? tableMatches.length : 0;

  // Strip all HTML tags, decode common HTML entities, and normalize whitespace
  const cleanText = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleanText.length > 0 ? cleanText.split(/\s+/).filter(Boolean).length : 0;

  // Time calculations:
  // 200 words per minute
  // 10 seconds per image (10/60 minute)
  // 20 seconds per table (20/60 minute)
  const minutesFromWords = words / 200;
  const minutesFromImages = (imageCount * 10) / 60;
  const minutesFromTables = (tableCount * 20) / 60;

  const totalMinutes = Math.max(1, Math.ceil(minutesFromWords + minutesFromImages + minutesFromTables));
  return `${totalMinutes} min read`;
}
