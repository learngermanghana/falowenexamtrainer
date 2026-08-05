import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { courseSchedules } from "../src/data/courseSchedule.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../public");
const coursesDir = path.join(publicDir, "courses");
const baseUrl = "https://www.falowen.app";

const LEVELS = [
  { key: "A1", slug: "german-a1", language: "German", label: "German A1" },
  { key: "A2", slug: "german-a2", language: "German", label: "German A2" },
  { key: "B1", slug: "german-b1", language: "German", label: "German B1" },
  { key: "B2", slug: "german-b2", language: "German", label: "German B2" },
  { key: "C1", slug: "german-c1", language: "German", label: "German C1" },
  { key: "FRENCH_A1", aliases: ["FR_A1", "French A1", "FRENCH-A1"], slug: "french-a1", language: "French", label: "French A1" },
];

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const compact = (value = "") => String(value || "").replace(/\s+/g, " ").trim();

const findSchedule = (level) => {
  const candidates = [level.key, ...(level.aliases || [])];
  for (const candidate of candidates) {
    if (Array.isArray(courseSchedules[candidate])) return courseSchedules[candidate];
  }
  if (level.key === "FRENCH_A1") {
    const matchingKey = Object.keys(courseSchedules).find((key) => /french.*a1|fr.*a1/i.test(key));
    if (matchingKey && Array.isArray(courseSchedules[matchingKey])) return courseSchedules[matchingKey];
  }
  return [];
};

const sanitizeLesson = (lesson, level) => ({
  level: level.label,
  language: level.language,
  day: Number.isFinite(Number(lesson?.day)) ? Number(lesson.day) : null,
  chapter: compact(lesson?.chapter),
  title: compact(lesson?.topic || lesson?.title || lesson?.assignmentTitle || `Day ${lesson?.day ?? ""}`),
  grammarTopic: compact(lesson?.grammar_topic || lesson?.grammarTopic),
});

const style = `
:root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#172033;background:#f5f8ff}*{box-sizing:border-box}body{margin:0}a{color:#164fd6}.wrap{max-width:1080px;margin:auto;padding:28px 18px 56px}.hero{background:linear-gradient(135deg,#0c43c7,#2d83ff);color:white;border-radius:22px;padding:30px;box-shadow:0 18px 45px rgba(18,67,170,.2)}.hero h1{margin:0 0 8px;font-size:clamp(2rem,5vw,3.5rem)}.hero p{max-width:780px;line-height:1.65;margin:0}.nav{display:flex;gap:9px;flex-wrap:wrap;margin:18px 0}.nav a,.cta{display:inline-block;text-decoration:none;background:#fff;border:1px solid #c9d8fb;border-radius:999px;padding:10px 14px;font-weight:800}.cta{background:#1454dc;color:#fff;border-color:#1454dc}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:14px}.card{background:#fff;border:1px solid #dce5f7;border-radius:16px;padding:17px;box-shadow:0 8px 22px rgba(30,64,175,.06)}.card h2,.card h3{margin:0 0 8px}.meta{display:flex;gap:7px;flex-wrap:wrap;margin:8px 0}.tag{background:#edf4ff;color:#1747a5;border-radius:999px;padding:4px 8px;font-size:.82rem;font-weight:750}.lesson{display:grid;grid-template-columns:72px minmax(0,1fr);gap:12px;align-items:start}.day{font-weight:900;color:#164fd6}.muted{color:#5d6678;line-height:1.55}.footer{margin-top:30px;color:#687083;font-size:.92rem}.count{font-weight:800}.levels{margin-top:20px}.lessons{display:grid;gap:11px;margin-top:18px}@media(max-width:560px){.hero{padding:22px}.lesson{grid-template-columns:1fr}.day{margin-bottom:-5px}}
`;

const documentShell = ({ title, description, canonical, body, jsonLd }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<meta name="robots" content="index,follow,max-image-preview:large" />
<link rel="canonical" href="${canonical}" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:type" content="website" />
<style>${style}</style>
<script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll("<", "\\u003c")}</script>
</head>
<body>${body}</body>
</html>`;

await fs.mkdir(coursesDir, { recursive: true });

const catalogue = LEVELS.map((level) => ({
  ...level,
  lessons: findSchedule(level).map((lesson) => sanitizeLesson(lesson, level)).filter((lesson) => lesson.title),
})).filter((level) => level.lessons.length);

const levelLinks = catalogue.map((level) => `<a href="/courses/${level.slug}.html">${escapeHtml(level.label)}</a>`).join("");

for (const level of catalogue) {
  const canonical = `${baseUrl}/courses/${level.slug}.html`;
  const description = `Public ${level.label} course schedule from Falowen, showing lesson titles, days, chapters and grammar topics without protected lesson content.`;
  const itemList = level.lessons.map((lesson, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: `${lesson.day === null ? "Lesson" : `Day ${lesson.day}`} – ${lesson.title}`,
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        name: `Falowen ${level.label} Course`,
        description,
        provider: { "@type": "Organization", name: "Falowen", url: baseUrl },
        inLanguage: level.language === "German" ? "de" : "fr",
        educationalLevel: level.label,
        url: canonical,
      },
      {
        "@type": "ItemList",
        name: `${level.label} course schedule`,
        numberOfItems: level.lessons.length,
        itemListElement: itemList,
      },
    ],
  };
  const lessonHtml = level.lessons.map((lesson) => `
    <article class="card lesson">
      <div class="day">${lesson.day === null ? "Lesson" : `Day ${lesson.day}`}</div>
      <div>
        <h3>${escapeHtml(lesson.title)}</h3>
        <div class="meta">
          ${lesson.chapter ? `<span class="tag">Chapter ${escapeHtml(lesson.chapter)}</span>` : ""}
          ${lesson.grammarTopic ? `<span class="tag">Grammar: ${escapeHtml(lesson.grammarTopic)}</span>` : ""}
        </div>
      </div>
    </article>`).join("");
  const body = `<main class="wrap">
    <section class="hero">
      <p>Falowen public curriculum catalogue</p>
      <h1>${escapeHtml(level.label)} Course Schedule</h1>
      <p>${escapeHtml(description)}</p>
    </section>
    <nav class="nav"><a href="/courses/">All levels</a>${levelLinks}<a class="cta" href="/signup?program=${level.language === "French" ? "french" : "german"}">Join Falowen</a></nav>
    <p class="count">${level.lessons.length} public lesson titles</p>
    <section class="lessons" aria-label="${escapeHtml(level.label)} lesson titles">${lessonHtml}</section>
    <footer class="footer">Only course titles, chapters and grammar themes are public. Workbooks, answers, videos, assignments and student information remain protected inside Falowen.</footer>
  </main>`;
  await fs.writeFile(path.join(coursesDir, `${level.slug}.html`), documentShell({ title: `${level.label} Course Schedule | Falowen`, description, canonical, body, jsonLd }), "utf8");
}

const indexDescription = "Explore Falowen public German A1–C1 and French A1 course schedules. View lesson titles, chapters and grammar themes without accessing protected course content.";
const indexJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Falowen public course catalogue",
  numberOfItems: catalogue.length,
  itemListElement: catalogue.map((level, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: `${level.label} Course Schedule`,
    url: `${baseUrl}/courses/${level.slug}.html`,
  })),
};
const levelCards = catalogue.map((level) => `<article class="card"><h2>${escapeHtml(level.label)}</h2><p class="muted">${level.lessons.length} lesson titles with public chapter and grammar-topic information.</p><a class="cta" href="/courses/${level.slug}.html">View ${escapeHtml(level.label)} schedule</a></article>`).join("");
const indexBody = `<main class="wrap"><section class="hero"><p>Falowen Learning Hub</p><h1>Public Course Catalogue</h1><p>${escapeHtml(indexDescription)}</p></section><nav class="nav">${levelLinks}<a class="cta" href="/signup?program=german">Join Falowen</a></nav><section class="grid levels">${levelCards}</section><footer class="footer">This catalogue intentionally publishes only curriculum names and structure. Protected learning content is not included.</footer></main>`;
await fs.writeFile(path.join(coursesDir, "index.html"), documentShell({ title: "German and French Course Schedules | Falowen", description: indexDescription, canonical: `${baseUrl}/courses/`, body: indexBody, jsonLd: indexJsonLd }), "utf8");

const publicJson = {
  provider: "Falowen",
  website: baseUrl,
  generatedAt: new Date().toISOString(),
  notice: "Public course titles and structure only. Protected lesson content is excluded.",
  courses: catalogue.map(({ key, aliases, ...level }) => level),
};
await fs.writeFile(path.join(publicDir, "course-catalogue.json"), `${JSON.stringify(publicJson, null, 2)}\n`, "utf8");

const urls = [`${baseUrl}/courses/`, ...catalogue.map((level) => `${baseUrl}/courses/${level.slug}.html`), `${baseUrl}/course-catalogue.json`];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc><changefreq>weekly</changefreq><priority>${url.endsWith("/courses/") ? "0.9" : "0.8"}</priority></url>`).join("\n")}\n</urlset>\n`;
await fs.writeFile(path.join(publicDir, "sitemap-courses.xml"), sitemap, "utf8");

const robotsPath = path.join(publicDir, "robots.txt");
let robots = "";
try { robots = await fs.readFile(robotsPath, "utf8"); } catch {}
const block = `\n# Public Falowen course catalogue\nUser-agent: *\nAllow: /courses/\nAllow: /course-catalogue.json\n\nUser-agent: OAI-SearchBot\nAllow: /courses/\nAllow: /course-catalogue.json\n\nSitemap: ${baseUrl}/sitemap-courses.xml\n`;
if (!robots.includes("sitemap-courses.xml")) await fs.writeFile(robotsPath, `${robots.trimEnd()}${block}`, "utf8");

console.log(`Generated public catalogue for ${catalogue.length} levels and ${catalogue.reduce((sum, level) => sum + level.lessons.length, 0)} lesson titles.`);
