import { collection, db, getDocs, isFirebaseConfigured, limit, orderBy, query } from "../firebase";

const BLOG_FEED_URL = "https://blog.falowen.app/feed.xml";
const FALLBACK_ANNOUNCEMENT_LIMIT = 18;
const BLOG_FETCH_TIMEOUT_MS = 6000;

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

const normalizeValue = (value) => String(value || "").trim().toLowerCase();

const resolveStudentLanguage = ({ program, locale }) => {
  if (program) return normalizeValue(program);
  const normalizedLocale = normalizeValue(locale);
  if (normalizedLocale.startsWith("fr")) return "french";
  if (normalizedLocale.startsWith("de")) return "german";
  return "";
};

const matchesLanguage = (announcement = {}, studentLanguage) => {
  if (!studentLanguage) return true;

  const language = normalizeValue(announcement.language || announcement.program || announcement.lang);
  if (language) {
    return language === "all" || language === studentLanguage;
  }

  const languages = Array.isArray(announcement.languages)
    ? announcement.languages.map(normalizeValue)
    : [];
  if (!languages.length) return true;
  return languages.includes("all") || languages.includes(studentLanguage);
};

const matchesClass = (announcement = {}, className) => {
  const normalizedClass = normalizeValue(className);
  if (!normalizedClass) return true;

  const targetClass = normalizeValue(
    announcement.className || announcement.class || announcement.classname
  );
  if (targetClass) {
    return targetClass === normalizedClass;
  }

  const audience = normalizeValue(
    announcement.audience || announcement.scope || announcement.target || ""
  );
  if (!audience) return true;
  return ["all", "global", "everyone"].includes(audience);
};

const parseBlogFeed = (xmlText = "") => {
  if (!xmlText || typeof DOMParser === "undefined") return [];

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  if (xmlDoc.querySelector("parsererror")) return [];

  return Array.from(xmlDoc.querySelectorAll("item")).map((item, index) => {
    const title = item.querySelector("title")?.textContent?.trim() || "Blog update";
    const body = item.querySelector("description")?.textContent?.trim() || "";
    const linkUrl = item.querySelector("link")?.textContent?.trim() || "";
    const pubDate = item.querySelector("pubDate")?.textContent?.trim();
    const guid = item.querySelector("guid")?.textContent?.trim();

    return {
      id: `blog-${guid || linkUrl || index}`,
      title,
      body,
      linkUrl,
      linkLabel: "Read on blog",
      className: "",
      language: "",
      audience: "all",
      timestamp: parseTimestamp(pubDate) || Date.now(),
      source: "blog",
    };
  });
};

const fetchBlogAnnouncements = async () => {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), BLOG_FETCH_TIMEOUT_MS)
    : null;

  try {
    const response = await fetch(BLOG_FEED_URL, controller ? { signal: controller.signal } : undefined);
    if (!response.ok) return [];
    const xmlText = await response.text();
    return parseBlogFeed(xmlText);
  } catch (error) {
    console.warn("Failed to load blog announcements", error);
    return [];
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

const fetchFirestoreAnnouncements = async ({ className, studentLanguage, limitCount }) => {
  if (!isFirebaseConfigured || !db) return [];

  const ref = collection(db, "announcements");
  const snapshot = await getDocs(query(ref, orderBy("createdAt", "desc"), limit(limitCount)));

  return snapshot.docs
    .map((docSnapshot) => {
      const data = docSnapshot.data() || {};
      return {
        id: docSnapshot.id,
        title: data.title || data.headline || "Announcement",
        body: data.message || data.body || data.description || "",
        linkUrl: data.linkUrl || data.link || data.url || "",
        linkLabel: data.linkLabel || data.linkText || "",
        className: data.className || data.class || "",
        language: data.language || data.program || "",
        audience: data.audience || data.scope || "",
        timestamp: parseTimestamp(data.createdAt) || Date.now(),
        source: "firestore",
      };
    })
    .filter((announcement) =>
      matchesLanguage(announcement, studentLanguage) && matchesClass(announcement, className)
    );
};

export const fetchAnnouncements = async ({
  className,
  program,
  locale,
  limitCount = FALLBACK_ANNOUNCEMENT_LIMIT,
} = {}) => {
  const studentLanguage = resolveStudentLanguage({ program, locale });

  const [firestoreResult, blogResult] = await Promise.allSettled([
    fetchFirestoreAnnouncements({ className, studentLanguage, limitCount }),
    fetchBlogAnnouncements(),
  ]);

  const firestoreAnnouncements = firestoreResult.status === "fulfilled" ? firestoreResult.value : [];
  const blogAnnouncements = blogResult.status === "fulfilled" ? blogResult.value : [];

  return [...firestoreAnnouncements, ...blogAnnouncements]
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, limitCount);
};
