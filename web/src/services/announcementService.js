import { collection, db, getDocs, isFirebaseConfigured, limit, orderBy, query } from "../firebase";

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

export const fetchAnnouncements = async ({
  className,
  program,
  locale,
  limitCount = 18,
} = {}) => {
  if (!isFirebaseConfigured || !db) return [];

  const studentLanguage = resolveStudentLanguage({ program, locale });
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
      };
    })
    .filter((announcement) =>
      matchesLanguage(announcement, studentLanguage) && matchesClass(announcement, className)
    );
};
