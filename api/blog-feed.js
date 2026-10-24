const BLOG_FEED_URLS = ["https://blog.falowen.app/feed", "https://blog.falowen.app/feed.xml"];
const DEFAULT_LIMIT = 8;

const decodeEntities = (value = "") =>
  value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

const getTagValue = (block, tagName) => {
  const match = block.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? decodeEntities(match[1]) : "";
};

const getAtomLinkHref = (block) => {
  const linkTag = block.match(/<link\b[^>]*>/i)?.[0] || "";
  if (!linkTag) return "";

  const rel = linkTag.match(/\brel=["']([^"']+)["']/i)?.[1]?.toLowerCase();
  if (rel && rel !== "alternate") return "";

  return decodeEntities(linkTag.match(/\bhref=["']([^"']+)["']/i)?.[1] || "");
};

const parseTimestamp = (value) => {
  if (!value) return Date.now();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? Date.now() : parsed.getTime();
};

const parseRssItems = (xmlText = "") => {
  const matches = xmlText.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  return matches.map((block, index) => {
    const title = getTagValue(block, "title") || "Blog update";
    const linkUrl = getTagValue(block, "link");
    const pubDate = getTagValue(block, "pubDate");
    const guid = getTagValue(block, "guid");

    return {
      id: `blog-${guid || linkUrl || index}`,
      title,
      linkUrl,
      linkLabel: "Read on blog",
      timestamp: parseTimestamp(pubDate),
    };
  });
};

const parseAtomEntries = (xmlText = "") => {
  const matches = xmlText.match(/<entry\b[\s\S]*?<\/entry>/gi) || [];
  return matches.map((block, index) => {
    const title = getTagValue(block, "title") || "Blog update";
    const linkUrl = getAtomLinkHref(block) || getTagValue(block, "link");
    const updated = getTagValue(block, "updated");
    const published = getTagValue(block, "published");
    const id = getTagValue(block, "id");

    return {
      id: `blog-${id || linkUrl || index}`,
      title,
      linkUrl,
      linkLabel: "Read on blog",
      timestamp: parseTimestamp(updated || published),
    };
  });
};

const parseFeed = (xmlText = "") => {
  const atomEntries = parseAtomEntries(xmlText);
  if (atomEntries.length) return atomEntries;
  return parseRssItems(xmlText);
};

module.exports = async (req, res) => {
  const limitRaw = Number(req.query?.limit);
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 20) : DEFAULT_LIMIT;

  for (const feedUrl of BLOG_FEED_URLS) {
    try {
      const response = await fetch(feedUrl, {
        headers: {
          "user-agent": "falowen-app/1.0 (+https://www.falowen.app)",
          accept: "application/atom+xml, application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
        },
      });

      if (!response.ok) continue;

      const xmlText = await response.text();
      const items = parseFeed(xmlText)
        .filter((item) => item.linkUrl)
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, limit);

      if (items.length) {
        return res.status(200).json({ items, source: feedUrl });
      }
    } catch (error) {
      console.warn("Failed to load blog feed", { feedUrl, error: error?.message || error });
    }
  }

  return res.status(200).json({ items: [] });
};
