const BLOG_FEED_URLS = ["https://blog.falowen.app/feed", "https://blog.falowen.app/feed.xml"];
const FALLBACK_ANNOUNCEMENT_LIMIT = 8;

const parseTimestamp = (value) => {
  if (!value) return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
  }
  if (value?.toMillis) return value.toMillis();
  if (value?.seconds) return value.seconds * 1000;
  if (value instanceof Date) return value.getTime();
  return null;
};

const parseBlogFeed = (xmlText = "") => {
  if (!xmlText || typeof DOMParser === "undefined") return [];

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  if (xmlDoc.querySelector("parsererror")) return [];

  return Array.from(xmlDoc.querySelectorAll("item")).map((item, index) => {
    const title = item.querySelector("title")?.textContent?.trim() || "Blog update";
    const linkUrl = item.querySelector("link")?.textContent?.trim() || "";
    const pubDate = item.querySelector("pubDate")?.textContent?.trim();
    const guid = item.querySelector("guid")?.textContent?.trim();

    return {
      id: `blog-${guid || linkUrl || index}`,
      title,
      linkUrl,
      linkLabel: "Read on blog",
      timestamp: parseTimestamp(pubDate) || Date.now(),
    };
  });
};

const fetchBlogAnnouncements = async () => {
  for (const feedUrl of BLOG_FEED_URLS) {
    try {
      const response = await fetch(feedUrl);
      if (!response.ok) continue;
      const xmlText = await response.text();
      const parsed = parseBlogFeed(xmlText);
      if (parsed.length) return parsed;
    } catch (error) {
      console.warn("Failed to load blog announcements", { feedUrl, error });
    }
  }
  return [];
};

export const fetchAnnouncements = async ({
  limitCount = FALLBACK_ANNOUNCEMENT_LIMIT,
} = {}) => {
  const blogAnnouncements = await fetchBlogAnnouncements();
  return blogAnnouncements
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, limitCount);
};
