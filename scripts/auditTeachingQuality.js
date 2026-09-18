const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const canonicalPath = path.join(repoRoot, "shared", "curriculumCanonical.json");
const componentRoot = path.join(repoRoot, "web", "src", "components");
const dataRoot = path.join(repoRoot, "web", "src", "data");
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const args = new Map(process.argv.slice(2).map((arg) => {
  const parts = String(arg).split("=");
  return [parts[0].replace(/^--/, ""), parts.length > 1 ? parts.slice(1).join("=") : true];
}));
const mode = String(args.get("mode") || "quick").toLowerCase();
const strict = Boolean(args.get("strict"));
const reportPath = args.get("report") ? path.resolve(repoRoot, String(args.get("report"))) : null;
const githubSummary = Boolean(args.get("github-summary"));

const clean = (value = "") => String(value || "").trim();
const lower = (value = "") => clean(value).toLowerCase();
const token = (value = "") => lower(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const isLocalCourseRoute = (value = "") => {
  const raw = clean(value);
  if (raw.startsWith("/campus/course/")) return true;
  if (!isExternalUrl(raw)) return false;
  try {
    const url = new URL(raw);
    return ["falowen.app", "www.falowen.app"].includes(url.hostname.toLowerCase()) &&
      url.pathname.startsWith("/campus/course/");
  } catch (_) {
    return false;
  }
};
const isExternalUrl = (value = "") => { const v = lower(value); return v.startsWith("http://") || v.startsWith("https://"); };

function walkFiles(root) {
  if (!fs.existsSync(root)) return [];
  const files = [];
  function visit(current) {
    fs.readdirSync(current, { withFileTypes: true }).forEach((entry) => {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!["node_modules", "dist", "build"].includes(entry.name)) visit(full);
        return;
      }
      if ([".js", ".jsx", ".mjs"].includes(path.extname(entry.name))) files.push(full);
    });
  }
  visit(root);
  return files;
}

function readDoc(file) {
  const text = fs.readFileSync(file, "utf8");
  return {
    file,
    rel: path.relative(repoRoot, file).split(path.sep).join("/"),
    text,
    lower: text.toLowerCase(),
  };
}

const componentDocs = walkFiles(componentRoot).map(readDoc);
const advancedDataNames = [
  "b2ExamDomainTeaching.js",
  "b2GrammarExplanations.js",
  "b2TopicCollocations.js",
  "c1ContentRefresh.js",
  "advancedWritingProgression.js",
  "c2CourseBookEntries.js",
  "c2ExamStandardContent.js",
  "c2LessonContentAlignment.js",
];
const advancedDocs = advancedDataNames
  .map((name) => path.join(dataRoot, name))
  .filter((file) => fs.existsSync(file))
  .map(readDoc);

const lessons = JSON.parse(fs.readFileSync(canonicalPath, "utf8"));
const inAppRouteConfigPath = path.join(dataRoot, "inAppWorkbookRoutes.json");
const inAppRouteConfig = fs.existsSync(inAppRouteConfigPath)
  ? JSON.parse(fs.readFileSync(inAppRouteConfigPath, "utf8"))
  : {};

function effectiveWorkbookRoute(lesson = {}) {
  const level = clean(lesson.level).toUpperCase();
  const day = String(Number(lesson.day));
  const chapter = clean(lesson.chapter);
  const configured = inAppRouteConfig?.[level]?.[day];
  if (configured) {
    const route = configured[chapter] || configured["*"];
    if (route) return route;
  }
  if (level === "B1" && Number(day) >= 1 && Number(day) <= 28) {
    return "/campus/course/lesson/B1/" + day + "?view=workbook";
  }
  return clean(lesson.workbookRoute);
}

function routeSlug(value = "") {
  let raw = clean(value);
  if (isExternalUrl(raw)) {
    try { raw = new URL(raw).pathname; } catch (_) {}
  }
  return raw.split("?")[0].split("/").filter(Boolean).pop() || "";
}

function titleKeywords(title = "") {
  return token(title).split(/\\s+/)
    .filter((word) => word.length >= 5 && !["german", "reviewing", "lesson", "workbook"].includes(word))
    .slice(0, 4);
}

function findComponentEvidence(lesson) {
  const assignmentId = lower(lesson.assignmentId || lesson.id);
  const day = Number(lesson.day);
  const workbookSlug = lower(routeSlug(effectiveWorkbookRoute(lesson)));
  const grammarSlug = lower(routeSlug(lesson.grammarPage));
  const keywords = titleKeywords(lesson.title);
  const compactKeywords = keywords.map((word) => word.replace(/\s+/g, ""));

  return componentDocs.map((doc) => {
    let score = 0;
    const relLower = doc.rel.toLowerCase();
    const relCompact = relLower.replace(/[^a-z0-9]+/g, "");
    const dayTokens = [
      "a1day" + day,
      "day" + day,
      "day-" + day,
      "day_" + day,
      "day " + day,
    ];

    if (assignmentId && doc.lower.includes(assignmentId)) score += 6;
    if (workbookSlug && workbookSlug.length > 8 && doc.lower.includes(workbookSlug)) score += 5;
    if (grammarSlug && grammarSlug.length > 8 && doc.lower.includes(grammarSlug)) score += 4;

    if (Number.isFinite(day)) {
      if (dayTokens.some((value) => relLower.includes(value) || relCompact.includes(value.replace(/[^a-z0-9]/g, "")))) {
        score += 4;
      }
      if (doc.lower.includes("a1 day " + day) || doc.lower.includes("day " + day + " ·") || doc.lower.includes("day " + day + " ")) {
        score += 3;
      }
    }

    keywords.forEach((word, index) => {
      const compact = compactKeywords[index];
      if (compact && relCompact.includes(compact)) score += 4;
      else if (doc.lower.includes(word)) score += 2;
    });

    return Object.assign({}, doc, { score });
  }).filter((doc) => doc.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

function hasAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function lessonSignals(lesson) {
  const evidenceDocs = findComponentEvidence(lesson);
  const corpus = evidenceDocs.map((doc) => doc.lower).join("\\n");
  const kind = lower(lesson.kind);
  const tutorMarked = Boolean(lesson.submissionRequired);
  const workbookRoute = effectiveWorkbookRoute(lesson);

  const teach =
    Boolean(clean(lesson.grammarPage)) ||
    Boolean(clean(lesson.teacherVideo || lesson.video)) ||
    hasAny(corpus, [/grammar/, /grammatik/, /regel/, /erklaer/, /erklär/, /beispiel/, /teacher note/]);

  const checkTerms = [
    "check",
    "self-check",
    "self check",
    "knowledge test",
    "quiz",
    "question",
    "fragen",
    "wahr",
    "falsch",
    "correct answer",
    "feedback",
    "understanding",
    "score",
    "iscorrect",
    "correctly",
    "show answer",
    "reveal answer",
    "selectedcorrectly",
    "submitted",
  ];
  const check = checkTerms.some((term) => corpus.includes(term));

  const produce =
    kind === "schreiben_sprechen" ||
    hasAny(corpus, [
      /\\bschreiben\\b/, /\\bsprechen\\b/, /speaking/, /writing/, /textarea/,
      /production/, /record/, /presentation/, /studentquestionsde/, /wrapuptaskde/
    ]);

  const transfer =
    Boolean(clean(workbookRoute)) &&
    (teach || hasAny(corpus, [/workbookconnection/, /workbook bridge/, /transfer/, /guided practice/, /lesson objective/, /instruction/]));

  const assess = tutorMarked
    ? Boolean(clean(lesson.assignmentId)) && Boolean(clean(workbookRoute))
    : Boolean(clean(workbookRoute)) && (check || produce);

  return {
    teach,
    check,
    produce,
    transfer,
    assess,
    score: [teach, check, produce, transfer, assess].filter(Boolean).length,
    evidence: evidenceDocs.map((doc) => doc.rel),
  };
}

function structuralIssues(lesson) {
  const issues = [];
  const id = clean(lesson.id || lesson.assignmentId || "(unknown)");
  if (!clean(lesson.title)) issues.push({ severity: "error", id, message: "missing lesson title" });
  if (!clean(lesson.chapter)) issues.push({ severity: "error", id, message: "missing chapter" });
  const status = lower(lesson.contentStatus);
  const published = status === "published" || status === "";
  const workbookRoute = effectiveWorkbookRoute(lesson);
  if (!clean(workbookRoute)) {
    if (published) issues.push({ severity: "error", id, message: "published lesson is missing effective workbook route" });
  } else if (isExternalUrl(workbookRoute) && !isLocalCourseRoute(workbookRoute)) {
    issues.push({ severity: "warning", id, message: "effective workbook uses external URL: " + workbookRoute });
  }
  if (lesson.submissionRequired && !clean(lesson.assignmentId)) {
    issues.push({ severity: "error", id, message: "tutor-marked lesson has no assignmentId" });
  }
  if (lesson.submissionRequired && !lesson.progressionEligible) {
    issues.push({ severity: "warning", id, message: "tutor-marked lesson is not progression eligible" });
  }
  if (!["published", "planned", "draft", ""].includes(lower(lesson.contentStatus))) {
    issues.push({ severity: "warning", id, message: "unrecognised contentStatus: " + lesson.contentStatus });
  }
  return issues;
}

function duplicateIssues(scopeLessons) {
  const issues = [];
  const seenId = new Map();
  const seenAssignment = new Map();
  scopeLessons.forEach((lesson) => {
    const id = clean(lesson.id);
    const assignmentId = clean(lesson.assignmentId);
    if (id) {
      if (seenId.has(id)) issues.push({ severity: "error", id, message: "duplicate lesson id also used by " + seenId.get(id) });
      else seenId.set(id, lesson.level + " day " + lesson.day);
    }
    if (lesson.submissionRequired && assignmentId) {
      if (seenAssignment.has(assignmentId)) {
        issues.push({ severity: "error", id: assignmentId, message: "duplicate tutor-marked assignment identity also used by " + seenAssignment.get(assignmentId) });
      } else {
        seenAssignment.set(assignmentId, lesson.level + " day " + lesson.day);
      }
    }
  });
  return issues;
}

function quickAudit() {
  const issues = duplicateIssues(lessons);
  const rows = LEVELS.map((level) => {
    const scoped = lessons.filter((lesson) => clean(lesson.level).toUpperCase() === level);
    scoped.forEach((lesson) => issues.push(...structuralIssues(lesson)));
    return {
      level,
      lessons: scoped.length,
      published: scoped.filter((lesson) => ["published", ""].includes(lower(lesson.contentStatus))).length,
      planned: scoped.filter((lesson) => lower(lesson.contentStatus) === "planned").length,
      tutorMarked: scoped.filter((lesson) => lesson.submissionRequired).length,
      localWorkbooks: scoped.filter((lesson) => isLocalCourseRoute(effectiveWorkbookRoute(lesson))).length,
      externalWorkbooks: scoped.filter((lesson) => isExternalUrl(effectiveWorkbookRoute(lesson)) && !isLocalCourseRoute(effectiveWorkbookRoute(lesson))).length,
      grammarRoutes: scoped.filter((lesson) => clean(lesson.grammarPage)).length,
      videos: scoped.filter((lesson) => clean(lesson.teacherVideo || lesson.video)).length,
    };
  });

  const advancedCorpus = advancedDocs.map((doc) => doc.lower).join("\\n");
  ["B2", "C1"].forEach((level) => {
    if (!advancedCorpus.includes(level.toLowerCase())) {
      issues.push({ severity: "warning", id: level, message: "no advanced teaching data marker found in audit corpus" });
    }
  });

  const c2AlignmentPath = path.join(dataRoot, "c2LessonContentAlignment.js");
  const c2RuntimeSource = fs.existsSync(c2AlignmentPath) ? fs.readFileSync(c2AlignmentPath, "utf8") : "";
  const c2RuntimeDays = new Set(
    Array.from(c2RuntimeSource.matchAll(/^\s{2}(\d+):\s*\[\[/gm)).map((match) => Number(match[1]))
  );
  const c2Row = rows.find((row) => row.level === "C2");
  if (c2Row && c2Row.lessons === 0 && c2RuntimeDays.size) {
    c2Row.lessons = c2RuntimeDays.size;
    c2Row.published = c2RuntimeDays.size;
    c2Row.runtimeGenerated = true;
  }
  if (!c2RuntimeDays.size) {
    issues.push({ severity: "error", id: "C2", message: "runtime-generated C2 curriculum could not be detected" });
  }

  return { rows, issues };
}

function detailedA1Audit() {
  const scoped = lessons.filter((lesson) => clean(lesson.level).toUpperCase() === "A1");
  const issues = [];
  const rows = scoped.map((lesson) => {
    issues.push(...structuralIssues(lesson));
    const signals = lessonSignals(lesson);
    if (signals.score < 5) {
      const missing = ["teach", "check", "produce", "transfer", "assess"].filter((key) => !signals[key]);
      issues.push({
        severity: signals.score <= 2 ? "error" : "warning",
        id: clean(lesson.id || lesson.assignmentId),
        message: "Teach→Check→Produce→Transfer→Assess coverage " + signals.score + "/5; missing " + missing.join(", "),
      });
    }
    return Object.assign({
      id: clean(lesson.id),
      day: Number(lesson.day),
      chapter: clean(lesson.chapter),
      title: clean(lesson.title),
      kind: clean(lesson.kind),
      tutorMarked: Boolean(lesson.submissionRequired),
    }, signals);
  });
  issues.push(...duplicateIssues(scoped));
  return { rows, issues };
}

const icon = (value) => value ? "✓" : "—";

function quickMarkdown(audit) {
  return [
    "# Falowen teaching quality audit",
    "",
    "## Stage 0 · A1–C2 platform scan",
    "",
    "| Level | Lessons | Published | Planned | Tutor-marked | Local workbooks | External workbooks | Grammar routes | Video/teacher media |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...audit.rows.map((row) =>
      "| " + row.level + " | " + row.lessons + " | " + (row.published || 0) + " | " + (row.planned || 0) +
      " | " + row.tutorMarked + " | " + row.localWorkbooks + " | " + row.externalWorkbooks +
      " | " + row.grammarRoutes + " | " + row.videos + (row.runtimeGenerated ? " (runtime)" : "") + " |"
    ),
    "",
  ];
}

function a1Markdown(audit) {
  return [
    "## Stage 1 · Detailed A1 audit",
    "",
    "Rubric: **Teach → Check → Produce → Transfer → Assess**. Missing signals are review prompts, not automatic judgments that a lesson is pedagogically bad.",
    "",
    "| Day | Lesson | Teach | Check | Produce | Transfer | Assess | Coverage |",
    "| ---: | --- | :---: | :---: | :---: | :---: | :---: | ---: |",
    ...audit.rows.map((row) =>
      "| " + row.day + " | " + row.id + " · " + row.title.split("|").join("\\|") +
      " | " + icon(row.teach) + " | " + icon(row.check) + " | " + icon(row.produce) +
      " | " + icon(row.transfer) + " | " + icon(row.assess) + " | " + row.score + "/5 |"
    ),
    "",
  ];
}

function issueMarkdown(issues) {
  if (!issues.length) return ["## Findings", "", "No structural findings.", ""];
  return [
    "## Findings",
    "",
    ...issues.map((issue) => "- **" + issue.severity.toUpperCase() + " · " + issue.id + "** — " + issue.message),
    "",
  ];
}

function stagePlanMarkdown() {
  return [
    "## Audit stages",
    "",
    "1. **Stage 0:** quick A1–C2 structural scan.",
    "2. **Stage 1:** detailed A1 Teach → Check → Produce → Transfer → Assess audit and fixes.",
    "3. **Stage 2:** A2 detailed audit and fixes.",
    "4. **Stage 3:** B1 detailed audit and fixes.",
    "5. **Stage 4:** B2 detailed audit and fixes.",
    "6. **Stage 5:** C1 detailed audit and fixes.",
    "7. **Stage 6:** C2 detailed audit and fixes.",
    "",
    "The quick scan blocks only structural errors. Pedagogical coverage gaps are warnings unless --strict is used.",
    "",
  ];
}

const quick = quickAudit();
const a1 = mode === "a1" || mode === "all" ? detailedA1Audit() : null;
const allIssues = quick.issues.concat(a1 ? a1.issues : []);

const markdown = [
  ...quickMarkdown(quick),
  ...(a1 ? a1Markdown(a1) : []),
  ...issueMarkdown(allIssues),
  ...stagePlanMarkdown(),
].join("\\n");

if (reportPath) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, markdown);
}
if (githubSummary && process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown + "\\n");
}

console.log(markdown);
const errors = allIssues.filter((issue) => issue.severity === "error");
const warnings = allIssues.filter((issue) => issue.severity === "warning");
console.log("Audit result: " + errors.length + " error(s), " + warnings.length + " warning(s).");
if (errors.length || (strict && warnings.length)) process.exit(1);
