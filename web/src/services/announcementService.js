const BLOG_FEED_URLS = ["https://blog.falowen.app/feed", "https://blog.falowen.app/feed.xml"];
const FALLBACK_ANNOUNCEMENT_LIMIT = 8;
const BLOG_PROXY_URL = "/api/blog-feed";

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

const getNodeText = (node, selector) => node.querySelector(selector)?.textContent?.trim() || "";

const parseRssItems = (xmlDoc) =>
  Array.from(xmlDoc.querySelectorAll("item")).map((item, index) => {
    const title = getNodeText(item, "title") || "Blog update";
    const linkUrl = getNodeText(item, "link");
    const pubDate = getNodeText(item, "pubDate");
    const guid = getNodeText(item, "guid");

    return {
      id: `blog-${guid || linkUrl || index}`,
      title,
      linkUrl,
      linkLabel: "Read on blog",
      timestamp: parseTimestamp(pubDate) || Date.now(),
    };
  });

const parseAtomEntries = (xmlDoc) =>
  Array.from(xmlDoc.querySelectorAll("entry")).map((entry, index) => {
    const title = getNodeText(entry, "title") || "Blog update";
    const linkNode =
      entry.querySelector('link[rel="alternate"][href]') ||
      entry.querySelector("link[href]") ||
      entry.querySelector("link");
    const linkUrl = linkNode?.getAttribute?.("href") || linkNode?.textContent?.trim() || "";
    const updated = getNodeText(entry, "updated");
    const published = getNodeText(entry, "published");
    const entryId = getNodeText(entry, "id");

    return {
      id: `blog-${entryId || linkUrl || index}`,
      title,
      linkUrl,
      linkLabel: "Read on blog",
      timestamp: parseTimestamp(updated || published) || Date.now(),
    };
  });

const parseBlogFeed = (xmlText = "") => {
  if (!xmlText || typeof DOMParser === "undefined") return [];

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  if (xmlDoc.querySelector("parsererror")) return [];

  const atomEntries = parseAtomEntries(xmlDoc);
  if (atomEntries.length) return atomEntries;
  return parseRssItems(xmlDoc);
};

const fetchBlogAnnouncements = async () => {
  try {
    const proxyResponse = await fetch(BLOG_PROXY_URL);
    if (proxyResponse.ok) {
      const proxyPayload = await proxyResponse.json();
      if (Array.isArray(proxyPayload?.items) && proxyPayload.items.length) {
        return proxyPayload.items;
      }
    }
  } catch (error) {
    console.warn("Failed to load blog announcements from proxy", { error });
  }

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
    .filter((item) => item.linkUrl)
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, limitCount);
};
