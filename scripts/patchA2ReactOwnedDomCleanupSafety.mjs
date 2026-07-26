import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/a2GoetheListeningOnlyCleanup.js");
const guidancePath = path.join(root, "web/src/components/A2B1WorkbookGuidance.js");
const regressionPath = path.join(root, "web/src/components/A2SharedWorkbookRegression.test.js");
let source = fs.readFileSync(targetPath, "utf8");
let guidanceSource = fs.readFileSync(guidancePath, "utf8");
let regressionSource = fs.readFileSync(regressionPath, "utf8");

const helperMarker = "const hideReactOwnedNode = (element) =>";
const helperAnchor = `const findByText = (root, selector, phrase) => {
  const normalizedPhrase = normalizeText(phrase);
  return (
    Array.from(root?.querySelectorAll?.(selector) || []).find((element) =>
      normalizeText(element.textContent).includes(normalizedPhrase),
    ) || null
  );
};`;
const helperReplacement = `${helperAnchor}

// These workbook pages are rendered by React. Presentation cleanup must never
// detach or inject children inside React-owned trees, otherwise a later render
// can try to insert before a node React still believes exists and throw
// Node.insertBefore / NotFoundError. Hide obsolete UI in place instead.
const hideReactOwnedNode = (element) => {
  if (!element) return false;
  const alreadyHidden = element.hidden && element.style.display === "none";
  element.hidden = true;
  element.style.display = "none";
  element.setAttribute("aria-hidden", "true");
  element.setAttribute("data-a2-react-owned-hidden", "true");
  return !alreadyHidden;
};

// Replacing element.textContent can itself replace React-owned child nodes.
// Only update an existing single text node in place. Nested React markup is
// intentionally left alone and should be rendered correctly by React itself.
const setReactOwnedPlainText = (element, text) => {
  if (!element || element.children?.length) return false;
  if (element.childNodes?.length !== 1 || element.firstChild?.nodeType !== 3) return false;
  if (element.firstChild.nodeValue === text) return false;
  element.firstChild.nodeValue = text;
  return true;
};

const reusableListeningNotePhrases = [
  "this is a goethe standard horen test",
  "please be aware that this is a goethe standard horverstehen test",
  "the only parts that will be officially evaluated",
  "you must mark your own horen results",
  "goethe standard listening practice",
  "teil 4 is for self check listening practice",
];

const findReusableListeningNote = (parent) =>
  Array.from(parent?.querySelectorAll?.("p") || []).find((paragraph) => {
    const text = normalizeText(paragraph.textContent);
    return reusableListeningNotePhrases.some((phrase) => text.includes(phrase));
  }) || null;`;

if (!source.includes(helperMarker)) {
  if (!source.includes(helperAnchor)) {
    throw new Error("Could not find A2 cleanup helper insertion point.");
  }
  source = source.replace(helperAnchor, helperReplacement);
}

const unsafeRemoveDirectChild = `  if (!child) return false;
  child.remove();
  return true;`;
const safeRemoveDirectChild = `  if (!child) return false;
  return hideReactOwnedNode(child);`;
if (source.includes(unsafeRemoveDirectChild)) {
  source = source.replace(unsafeRemoveDirectChild, safeRemoveDirectChild);
}

const oldEnsureListeningNote = `const ensureListeningNote = (root, heading, text) => {
  if (!heading?.parentElement) return false;
  let note = heading.parentElement.querySelector('[data-a2-goethe-listening-note="true"]');
  if (!note) {
    note = root.createElement("p");
    note.setAttribute("data-a2-goethe-listening-note", "true");
    note.style.margin = "0";
    note.style.lineHeight = "1.7";
    note.style.fontWeight = "700";
    note.style.color = "#1e3a8a";
    note.style.background = "#eff6ff";
    note.style.border = "1px solid #bfdbfe";
    note.style.borderRadius = "10px";
    note.style.padding = "10px 12px";
    heading.insertAdjacentElement("afterend", note);
  }
  if (note.textContent === text) return false;
  note.textContent = text;
  return true;
};`;
const safeEnsureListeningNote = `const ensureListeningNote = (_root, heading, text) => {
  if (!heading?.parentElement) return false;
  let note = heading.parentElement.querySelector('[data-a2-goethe-listening-note="true"]');
  if (!note) note = findReusableListeningNote(heading.parentElement);
  if (!note) return false;

  note.hidden = false;
  note.style.display = "block";
  note.removeAttribute("aria-hidden");
  note.removeAttribute("data-a2-react-owned-hidden");
  note.setAttribute("data-a2-goethe-listening-note", "true");
  note.style.margin = "0";
  note.style.lineHeight = "1.7";
  note.style.fontWeight = "700";
  note.style.color = "#1e3a8a";
  note.style.background = "#eff6ff";
  note.style.border = "1px solid #bfdbfe";
  note.style.borderRadius = "10px";
  note.style.padding = "10px 12px";

  return setReactOwnedPlainText(note, text);
};`;
if (source.includes(oldEnsureListeningNote)) {
  source = source.replace(oldEnsureListeningNote, safeEnsureListeningNote);
}

const removals = [
  ["    note.remove();\n    changed = true;", "    changed = hideReactOwnedNode(note) || changed;"],
  ["    panel.remove();\n    changed = true;", "    changed = hideReactOwnedNode(panel) || changed;"],
  ["    paragraph.remove();\n    changed = true;", "    changed = hideReactOwnedNode(paragraph) || changed;"],
  ["        element.remove();\n        changed = true;", "        changed = hideReactOwnedNode(element) || changed;"],
  ["      listeningItem.remove();\n      changed = true;", "      changed = hideReactOwnedNode(listeningItem) || changed;"],
  ["        sibling.remove();\n        sibling = next;", "        hideReactOwnedNode(sibling);\n        changed = true;\n        sibling = next;"],
  ["      questionHeading.remove();\n      changed = true;", "      changed = hideReactOwnedNode(questionHeading) || changed;"],
];

for (const [unsafe, safe] of removals) {
  source = source.replaceAll(unsafe, safe);
}

const textMutations = [
  [
    `  guidance.textContent =
    "Teil 2 · Schreiben and Teil 3 · Lesen: complete the tasks and send only your final answers through the Submit tab. Teil 4 · Hören is Goethe self-check practice in the video and is not submitted.";
  return true;`,
    `  return setReactOwnedPlainText(
    guidance,
    "Teil 2 · Schreiben and Teil 3 · Lesen: complete the tasks and send only your final answers through the Submit tab. Teil 4 · Hören is Goethe self-check practice in the video and is not submitted.",
  );`,
  ],
  [
    `    submitCopy.textContent =
      "Submit your final writing text and reading answer letters. Teil 4 · Hören is checked inside the Goethe video and is not submitted.";
    changed = true;`,
    `    changed =
      setReactOwnedPlainText(
        submitCopy,
        "Submit your final writing text and reading answer letters. Teil 4 · Hören is checked inside the Goethe video and is not submitted.",
      ) || changed;`,
  ],
  [
    `    description.textContent = "Lesen";
    changed = true;`,
    `    changed = setReactOwnedPlainText(description, "Lesen") || changed;`,
  ],
  [
    `    guidance.textContent =
      "Teil 2 · Schreiben, Teil 3 · Lesen and Teil 4 · Lesen: complete the tasks and submit your final answers through the Submit tab. This workbook has no Hören assignment.";
    changed = true;`,
    `    changed =
      setReactOwnedPlainText(
        guidance,
        "Teil 2 · Schreiben, Teil 3 · Lesen and Teil 4 · Lesen: complete the tasks and submit your final answers through the Submit tab. This workbook has no Hören assignment.",
      ) || changed;`,
  ],
  [
    `      heading.textContent = "Teil 4 · Hören · Goethe Self-Check";
      changed = true;`,
    `      changed = setReactOwnedPlainText(heading, "Teil 4 · Hören · Goethe Self-Check") || changed;`,
  ],
  [
    `    headerCopy.textContent =
      "Select Teil 1–4, Ref or Submit. Teil 1 is group practice; submit only Teil 2 and Teil 3.";
    changed = true;`,
    `    changed =
      setReactOwnedPlainText(
        headerCopy,
        "Select Teil 1–4, Ref or Submit. Teil 1 is group practice; submit only Teil 2 and Teil 3.",
      ) || changed;`,
  ],
  [
    `      submitTitle.textContent = "Submit Teil 2 and Teil 3.";
      changed = true;`,
    `      changed = setReactOwnedPlainText(submitTitle, "Submit Teil 2 and Teil 3.") || changed;`,
  ],
  [
    `    submitCopy.textContent =
      "Submit your required answers for A2 Day 28 here. Include your final writing text and your reading answer letters. Teil 4 · Hören is checked inside the Goethe video and is not submitted.";
    changed = true;`,
    `    changed =
      setReactOwnedPlainText(
        submitCopy,
        "Submit your required answers for A2 Day 28 here. Include your final writing text and your reading answer letters. Teil 4 · Hören is checked inside the Goethe video and is not submitted.",
      ) || changed;`,
  ],
];

for (const [unsafe, safe] of textMutations) {
  source = source.replaceAll(unsafe, safe);
}

// Render the lesson-specific submission rule inside React so the cleanup layer
// never needs to replace nested <strong> children in the shared guide.
const guidanceDayAnchor = `  const workbookLabel = workbookLevel ? \`${"${workbookLevel}"} workbook\` : "workbook";
  const levelPrefix = workbookLevel || "A2/B1";`;
const guidanceDayReplacement = `${guidanceDayAnchor}
  const workbookDay = useMemo(() => {
    if (typeof window === "undefined") return null;
    return resolveA2B1WorkbookDayFromLocation(
      workbookLevel,
      \`${"${window.location.pathname || \"\"}"}${"${window.location.search || \"\"}"}\`,
    );
  }, [workbookLevel]);
  const isGoetheSelfCheckDay =
    workbookLevel === "A2" && [21, 22, 23, 24, 26, 27, 28].includes(Number(workbookDay));
  const isDay25ReadingOnly = workbookLevel === "A2" && Number(workbookDay) === 25;`;
if (!guidanceSource.includes("const isGoetheSelfCheckDay =")) {
  if (!guidanceSource.includes(guidanceDayAnchor)) {
    throw new Error("Could not add route-aware A2 workbook guidance.");
  }
  guidanceSource = guidanceSource.replace(guidanceDayAnchor, guidanceDayReplacement);
}

const genericGuidanceParagraph = `          <p style={{ margin: 0 }}>
            <strong>Teil 2 · Schreiben, Teil 3 · Lesen and Teil 4 · Hören:</strong> complete the tasks and send only your final answers through the <strong>Submit</strong> tab.
          </p>`;
const routeAwareGuidanceParagraph = `          <p style={{ margin: 0 }}>
            {isDay25ReadingOnly ? (
              <><strong>Teil 2 · Schreiben, Teil 3 · Lesen and Teil 4 · Lesen:</strong> complete the tasks and send only your final answers through the <strong>Submit</strong> tab. This workbook has no Hören assignment.</>
            ) : isGoetheSelfCheckDay ? (
              <><strong>Teil 2 · Schreiben and Teil 3 · Lesen:</strong> complete the tasks and send only your final answers through the <strong>Submit</strong> tab. <strong>Teil 4 · Hören</strong> is Goethe self-check practice in the video and is not submitted.</>
            ) : (
              <><strong>Teil 2 · Schreiben, Teil 3 · Lesen and Teil 4 · Hören:</strong> complete the tasks and send only your final answers through the <strong>Submit</strong> tab.</>
            )}
          </p>`;
if (!guidanceSource.includes("isDay25ReadingOnly ? (")) {
  if (!guidanceSource.includes(genericGuidanceParagraph)) {
    throw new Error("Could not replace generic A2 workbook submission guidance.");
  }
  guidanceSource = guidanceSource.replace(genericGuidanceParagraph, routeAwareGuidanceParagraph);
}

// Day 25 has reading in Teil 4. Keep the universal fallback's standard key so
// it can proxy-click the existing Teil 4 button, but render the correct label.
const fallbackTabsAnchor = `  const [showSubmit, setShowSubmit] = useState(false);
  const submitRef = useRef(null);`;
const fallbackTabsReplacement = `${fallbackTabsAnchor}
  const fallbackTabs = useMemo(
    () =>
      workbookDay === 25
        ? STANDARD_WORKBOOK_TABS.map((tab) =>
            tab.key === "hoeren" ? { ...tab, description: "Lesen" } : tab,
          )
        : STANDARD_WORKBOOK_TABS,
    [workbookDay],
  );`;
if (!guidanceSource.includes("const fallbackTabs = useMemo(")) {
  if (!guidanceSource.includes(fallbackTabsAnchor)) {
    throw new Error("Could not add Day 25 fallback tab labeling.");
  }
  guidanceSource = guidanceSource.replace(fallbackTabsAnchor, fallbackTabsReplacement);
}
guidanceSource = guidanceSource.replace(
  `        tabs={STANDARD_WORKBOOK_TABS}
        ariaLabel={workbookDay ? \`A2 Day ${"${workbookDay}"} workbook sections\` : "A2 workbook sections"}`,
  `        tabs={fallbackTabs}
        ariaLabel={workbookDay ? \`A2 Day ${"${workbookDay}"} workbook sections\` : "A2 workbook sections"}`,
);

// The historical regression used DOM absence as its presentation contract.
// Preserve the same visible result while explicitly protecting React ownership.
const regressionReplacements = [
  [
    `    expect(document.querySelectorAll('[role="note"]')).toHaveLength(0);
    expect(document.querySelector("#old-final-submission")).toBeNull();`,
    `    const day22Notes = Array.from(document.querySelectorAll('[role="note"]'));
    expect(day22Notes.length).toBeGreaterThan(0);
    day22Notes.forEach((note) => {
      expect(note.isConnected).toBe(true);
      expect(note.hidden).toBe(true);
    });
    const oldFinalSubmission = document.querySelector("#old-final-submission");
    expect(oldFinalSubmission).not.toBeNull();
    expect(oldFinalSubmission.isConnected).toBe(true);
    expect(oldFinalSubmission.hidden).toBe(true);`,
  ],
  [
    `    expect(document.querySelectorAll('[role="note"]')).toHaveLength(0);
  });

  it("leaves Days 27 and 28 on their native working standard navigation"`,
    `    const day25Reminder = document.querySelector('[role="note"]');
    expect(day25Reminder).not.toBeNull();
    expect(day25Reminder.isConnected).toBe(true);
    expect(day25Reminder.hidden).toBe(true);
  });

  it("leaves Days 27 and 28 on their native working standard navigation"`,
  ],
  [
    `    expect(document.querySelector("#day27-task")).toBeNull();
    expect(document.querySelector("#day27-questions")).toBeNull();
    expect(document.querySelector("#day27-hoeren [role='note']")).toBeNull();`,
    `    ["#day27-task", "#day27-questions", "#day27-hoeren [role='note']"].forEach((selector) => {
      const element = document.querySelector(selector);
      expect(element).not.toBeNull();
      expect(element.isConnected).toBe(true);
      expect(element.hidden).toBe(true);
    });`,
  ],
  [
    `    expect(document.querySelector("#day27-submit").textContent).not.toContain("four listening answer letters");`,
    `    const day27ListeningItem = document.querySelector("#day27-submit li");
    expect(day27ListeningItem).not.toBeNull();
    expect(day27ListeningItem.isConnected).toBe(true);
    expect(day27ListeningItem.hidden).toBe(true);`,
  ],
  [
    `    expect(document.querySelector("#day28-hoeren").textContent).not.toContain("Fragen zum Hören");
    expect(document.querySelector("#day28-hoeren").textContent).not.toContain("Welche Zeitform passt");`,
    `    const day28QuestionHeading = Array.from(document.querySelectorAll("#day28-hoeren h3")).find((element) =>
      element.textContent.includes("Fragen zum Hören"),
    );
    expect(day28QuestionHeading).not.toBeNull();
    expect(day28QuestionHeading.isConnected).toBe(true);
    expect(day28QuestionHeading.hidden).toBe(true);
    const day28Question = Array.from(document.querySelectorAll("#day28-hoeren div")).find((element) =>
      element.textContent.includes("Welche Zeitform passt"),
    );
    expect(day28Question).not.toBeNull();
    expect(day28Question.isConnected).toBe(true);
    expect(day28Question.hidden).toBe(true);`,
  ],
];

for (const [oldText, newText] of regressionReplacements) {
  if (regressionSource.includes(oldText)) regressionSource = regressionSource.replace(oldText, newText);
}

if (!source.includes(helperMarker) || !source.includes("const setReactOwnedPlainText =")) {
  throw new Error("A2 React-owned cleanup safety helpers are missing.");
}
if (source.includes('heading.insertAdjacentElement("afterend", note)')) {
  throw new Error("A2 cleanup still injects a listening note into React-owned DOM.");
}
if (/\b(?:child|note|panel|paragraph|element|listeningItem|sibling|questionHeading)\.remove\(\)/.test(source)) {
  throw new Error("A2 cleanup still detaches a React-owned workbook node.");
}
if (/\b(?:guidance|submitCopy|description|heading|headerCopy|submitTitle|note)\.textContent\s*=/.test(source)) {
  throw new Error("A2 cleanup still replaces React-owned text content structurally.");
}
if (!guidanceSource.includes("const isGoetheSelfCheckDay =") || !guidanceSource.includes("isDay25ReadingOnly ? (")) {
  throw new Error("A2 workbook guidance is not route-aware for self-check lessons.");
}
if (!regressionSource.includes("expect(oldFinalSubmission.isConnected).toBe(true)")) {
  throw new Error("A2 shared regression still expects cleanup to detach React-owned nodes.");
}

fs.writeFileSync(targetPath, source, "utf8");
fs.writeFileSync(guidancePath, guidanceSource, "utf8");
fs.writeFileSync(regressionPath, regressionSource, "utf8");
console.log("Patched A2 workbook cleanup and guidance to preserve React-owned DOM nodes.");
