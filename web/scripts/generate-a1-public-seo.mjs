import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const webDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.resolve(process.argv[2] || path.join(webDir, "dist"));
const content = JSON.parse(fs.readFileSync(path.join(webDir, "src/data/a1SeoPracticeContent.json"), "utf8"));
const otherLevels = JSON.parse(fs.readFileSync(path.join(webDir, "src/data/otherLevelSeoPracticeContent.json"), "utf8"));
const indexFile = path.join(distDir, "index.html");
const template = fs.readFileSync(indexFile, "utf8");
const BASE = "https://www.falowen.app";

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function replaceOnce(html, pattern, replacement, name) {
  const matched = html.match(pattern);
  if (!matched) throw new Error("A1 SEO prerender: missing " + name + " in dist/index.html");
  return html.replace(pattern, replacement);
}

function meta(html, attribute, key, value) {
  const regex = new RegExp('(<meta\\s+' + attribute + '="' + key + '"\\s+content=")[^"]*("\\s*\\/?>)', "i");
  return replaceOnce(html, regex, (_, before, after) => before + escapeHtml(value) + after, key);
}

function card(title, body) {
  return '<section class="a1-seo-card"><h2>' + escapeHtml(title) + '</h2>' + body + '</section>';
}

function practiceSamples() {
  const r = content.reading, w = content.writing, s = content.speaking;
  return [
    card("Quick A1 Lesen exercise with answer",
      '<p lang="de">' + escapeHtml(r.text) + '</p><p lang="de"><strong>' + escapeHtml(r.question) + '</strong></p>' +
      '<ol type="A">' + r.options.map(x => '<li lang="de">' + escapeHtml(x) + '</li>').join("") + '</ol>' +
      '<details><summary>Show the correct answer and explanation</summary><p><strong>' + escapeHtml(r.answer) +
      '</strong>. ' + escapeHtml(r.explanation) + '</p></details>'),
    card("A1 Schreiben · Sample task and answer",
      '<p lang="de">' + escapeHtml(w.task) + '</p><details><summary>Show a model message</summary><p lang="de" class="a1-seo-lines">' +
      escapeHtml(w.answer) + '</p><p>' + escapeHtml(w.tip) + '</p></details>'),
    card("A1 Sprechen · Introduction practice",
      '<p lang="de">' + escapeHtml(s.task) + '</p><details><summary>Show a model introduction</summary><p lang="de">' +
      escapeHtml(s.answer) + '</p><p>' + escapeHtml(s.tip) + '</p></details>')
  ].join("\n");
}

const routes = [
  {
    file: "goethe-a1-preparation.html",
    path: "/goethe-a1-preparation",
    title: "Goethe A1 Practice Materials with Answers | Falowen",
    description: "Goethe A1 practice materials with answers: free Lesen sample, writing and speaking model answers, and student mock exams on Falowen.",
    heading: "Goethe A1 Practice Materials with Answers",
    lead: content.intro,
    content: '<section class="a1-seo-card"><h2>Choose an A1 practice section</h2><div class="a1-seo-links">' +
      '<a href="/exam-practice/a1">Free interactive A1 Lesen practice</a>' +
      '<a href="/exam-practice">Browse Goethe-style mock exams</a>' +
      '<a href="/login/">Sign in for A1 Hören and full mock exams</a></div>' +
      '<p>Lesen (reading): practise short notices and messages. Hören (listening): use the signed-in Exam Room. ' +
      'Schreiben (writing) and Sprechen (speaking): try the examples and review the model answers below.</p></section>' + practiceSamples()
  },
  {
    file: "exam-practice-a1.html",
    path: "/exam-practice/a1",
    title: "Free Goethe A1 Exam Practice – Lesen | Falowen",
    description: "Practise free Goethe-style A1 exam Lesen tasks with Falowen. No login required. Work through realistic reading questions and get an instant score.",
    heading: "Free Goethe A1 Lesen Practice",
    lead: "Start a free interactive German A1 reading sample without logging in. Read everyday notices and messages, choose answers, and see your score.",
    content: '<section class="a1-seo-card"><h2>Start your free reading test</h2>' +
      '<p>This page opens an interactive A1 Lesen practice task when JavaScript loads. You can also use the short question and answer below.</p>' +
      '<a href="/goethe-a1-preparation">See A1 practice materials, writing and speaking models</a></section>' + practiceSamples()
  }
];

const style = String.raw`
<style>
  .falowen-startup { display: block; width: 100%; min-height: 100vh; padding: 20px; background: #f8fbff; }
  .falowen-startup__card { display: none; }
  .a1-seo-fallback { width: min(100%, 980px); margin: 0 auto; display: grid; gap: 16px; color: #0f172a; }
  .a1-seo-fallback header { background: #143b89; padding: clamp(20px,4vw,42px); color: #fff; border-radius: 20px; }
  .a1-seo-fallback h1 { font-size: clamp(27px,4vw,44px); line-height: 1.15; margin: 12px 0; }
  .a1-seo-fallback header p { color: #e0edff; line-height: 1.7; max-width: 800px; }
  .a1-seo-fallback a { color: #1d4ed8; }
  .a1-seo-fallback header a { color: #fff; }
  .a1-seo-card { background: #fff; padding: clamp(16px,3vw,24px); border: 1px solid #dbeafe; border-radius: 16px; line-height: 1.7; }
  .a1-seo-card h2 { font-size: 21px; margin: 0 0 9px; }
  .a1-seo-card ol { padding-left: 24px; }
  .a1-seo-card details { margin-top: 12px; }
  .a1-seo-card summary { cursor: pointer; font-weight: 700; }
  .a1-seo-links { display: flex; flex-wrap: wrap; gap: 14px; margin: 12px 0; }
  .a1-seo-lines { white-space: pre-line; }
</style>
`;

function render(route) {
  const canonical = BASE + route.path;
  let html = replaceOnce(template, /<title>[^<]*<\/title>/, "<title>" + escapeHtml(route.title) + "</title>", "title");
  html = replaceOnce(html, /(<link rel="canonical" href=")[^"]*("\s*\/>)/,
    (_, before, after) => before + canonical + after, "canonical");
  html = meta(html, "name", "description", route.description);
  html = meta(html, "property", "og:title", route.title);
  html = meta(html, "property", "og:description", route.description);
  html = meta(html, "property", "og:url", canonical);
  html = meta(html, "name", "twitter:title", route.title);
  html = meta(html, "name", "twitter:description", route.description);
  const schema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: route.heading,
    description: route.description,
    url: canonical,
    educationalLevel: route.level || "A1",
    learningResourceType: "German language examination practice",
    isAccessibleForFree: true,
    inLanguage: ["de", "en"],
    provider: { "@type": "EducationalOrganization", name: "Falowen", url: BASE + "/" }
  };
  const structuredData = '<script type="application/ld+json">' +
    JSON.stringify(schema).replace(/</g, "\\u003c") + '</script>';
  html = replaceOnce(html, /<\/head>/, style + structuredData + "\n</head>", "closing head");
  html = replaceOnce(html, /<noscript>[^<]*<\/noscript>/,
    "<noscript>The public exercises and examples below are readable without JavaScript. Enable it for interactive practice.</noscript>", "noscript");
  html = replaceOnce(html, /<main id="falowen-startup" class="falowen-startup" role="status" aria-live="polite">/,
    '<main id="falowen-startup" class="falowen-startup">', "startup main");
  html = replaceOnce(html, /<h1 id="falowen-startup-title">([^<]*)<\/h1>/,
    (_, message) => '<p id="falowen-startup-title">' + message + '</p>', "startup heading");
  const pageLevel = (route.level || 'A1').toLowerCase();
  const seoMarkup = '<div class="a1-seo-fallback"><header><nav><a href="/">Falowen</a> · ' +
    '<a href="/exam-practice">Exam practice</a></nav><h1>' + escapeHtml(route.heading) + '</h1><p>' +
    escapeHtml(route.lead) + '</p></header>' + route.content +
    '<footer><p>Falowen provides independent Goethe-style practice and is not affiliated with or endorsed by Goethe-Institut.</p>' +
    '<p><a href="/goethe-' + pageLevel + '-preparation">Goethe ' + pageLevel.toUpperCase() + ' preparation</a> · <a href="/exam-practice/' + pageLevel + '">' + pageLevel.toUpperCase() + ' practice</a>' +
    ' · <a href="/login/">Student sign in</a></p></footer></div>';
  html = replaceOnce(html, /<\/main>\s*<\/div>\s*<script>/,
    seoMarkup + "</main></div><script>", "startup main closing marker");
  const output = path.join(distDir, "__seo", route.file);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, html, "utf8");
}


function otherSamples(level, sample, onPracticePage) {
  const { reading, writing, speaking } = sample;
  const escape = escapeHtml;
  const details = (label, answer, explanation) =>
    '<details><summary>' + escape(label) + '</summary><p lang="de" class="a1-seo-lines"><strong>' +
    escape(answer) + '</strong></p><p>' + escape(explanation) + '</p></details>';
  const actions = level === "a2" ? '<a href="/exam-practice/a2">Try free interactive A2 Lesen</a>'
    : onPracticePage ? '<a href="/goethe-' + level + '-preparation">Go to preparation guide</a>'
      : '<a href="/exam-practice/' + level + '">Try free ' + level.toUpperCase() + ' questions</a>';
  return [
    card("Goethe " + level.toUpperCase() + " practice materials and availability",
      '<p>' + escape(sample.status) + '</p><div class="a1-seo-links">' + actions +
      '<a href="/exam-practice">Browse all levels</a><a href="/login/">Sign in for student mocks</a></div>'),
    card("Lesen · " + level.toUpperCase() + " reading question",
      '<p lang="de">' + escape(reading.text) + '</p><p lang="de"><strong>' + escape(reading.question) +
      '</strong></p><ol type="A">' + reading.options.map(x=>'<li lang="de">'+escape(x)+'</li>').join("") +
      '</ol>' + details("Show reading answer and explanation",reading.answer,reading.explanation)),
    card("Schreiben · " + level.toUpperCase() + " sample writing task",
      '<p lang="de">' + escape(writing.task) + '</p>' +
      details("Show writing model answer",writing.answer,writing.tip)),
    card("Sprechen · " + level.toUpperCase() + " speaking practice",
      '<p lang="de">' + escape(speaking.task) + '</p>' +
      details("Show speaking model answer",speaking.answer,speaking.tip))
  ].join("\n");
}

for (const [level, sample] of Object.entries(otherLevels)) {
  const slug = level.toLowerCase();
  routes.push({
    level,
    file: "goethe-" + slug + "-preparation.html",
    path: "/goethe-" + slug + "-preparation",
    title: sample.titles.landing,
    description: sample.titles.landingDescription,
    heading: "Goethe " + level + " Practice Materials with Answers",
    lead: sample.intro,
    content: otherSamples(slug, sample, false)
  });
  routes.push({
    level,
    file: "exam-practice-" + slug + ".html",
    path: "/exam-practice/" + slug,
    title: sample.titles.practice,
    description: sample.titles.practiceDescription,
    heading: level === "A2" ? "Free Goethe A2 Lesen Practice" : "Goethe " + level + " Practice Questions and Answers",
    lead: sample.intro,
    content: otherSamples(slug, sample, true)
  });
}

routes.forEach(render);
process.stdout.write("Generated A1 public SEO HTML for " + routes.map(x => x.path).join(", ") + "\n");
