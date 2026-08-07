const STANDARD_TITLE = "Suggested answer structure";
const STANDARD_ITEMS = [
  ["Thema vorstellen", "„Heute möchte ich über [Thema] sprechen.“"],
  ["Vorteile", "„Ein Vorteil ist, dass ...“ / „Außerdem ...“"],
  ["Nachteile", "„Ein Nachteil ist, dass ...“ / „Andererseits ...“"],
  ["Situation in deinem Land", "„In meinem Land ist die Situation so, dass ...“"],
  ["Eigene Meinung", "„Meiner Meinung nach ...“ / „Ich bin der Meinung, dass ...“"],
  ["Schluss", "„Zusammenfassend lässt sich sagen, dass ...“ / „Vielen Dank fürs Zuhören.“"],
];

const isB1WorkbookRoute = () => {
  const pathname = String(window.location?.pathname || "").toLowerCase();
  return pathname.includes("/campus/course/lesson/b1/") || (pathname.includes("/campus/course/") && pathname.includes("b1"));
};

const headingMatches = (element) =>
  /^suggested answer structure$/i.test(String(element?.textContent || "").trim());

const buildStandardList = (sourceList) => {
  const list = document.createElement(sourceList?.tagName?.toLowerCase() === "ul" ? "ul" : "ol");
  if (sourceList?.getAttribute("style")) list.setAttribute("style", sourceList.getAttribute("style"));
  list.setAttribute("data-b1-standard-speaking-structure-list", "true");

  STANDARD_ITEMS.forEach(([label, example]) => {
    const item = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = `${label}:`;
    item.append(strong, document.createTextNode(` ${example}`));
    list.appendChild(item);
  });
  return list;
};

const findSpeakingSection = (heading) => {
  const section = heading.closest("section");
  if (!section) return null;
  const text = String(section.textContent || "");
  return /Sprechen|Speaking|Question of the Day/i.test(text) ? section : null;
};

const findTopAnchor = (section) => {
  const children = Array.from(section.children || []);
  // Keep the speaking title/question first, then show the reusable exam structure
  // before images, brain maps, examples and AI practice.
  const taskIndex = children.findIndex((child) =>
    /Question of the Day|Speaking|Sprechen/i.test(String(child.textContent || "")) &&
    child.querySelector?.("strong, h2, h3, p"),
  );
  if (taskIndex >= 0) return children[taskIndex];
  return children[0] || null;
};

export const standardizeB1SpeakingStructures = (root = document) => {
  if (typeof window === "undefined" || !isB1WorkbookRoute()) return 0;
  const headings = Array.from(root.querySelectorAll("h2, h3, h4, strong")).filter(headingMatches);
  let changed = 0;

  headings.forEach((heading) => {
    const section = findSpeakingSection(heading);
    const oldList = heading.nextElementSibling;
    if (!section || !oldList || !["OL", "UL"].includes(oldList.tagName)) return;

    if (heading.dataset.b1StandardSpeakingStructure !== "true") {
      const standardList = buildStandardList(oldList);
      oldList.replaceWith(standardList);
      heading.dataset.b1StandardSpeakingStructure = "true";
      heading.textContent = STANDARD_TITLE;
      changed += 1;
    }

    const list = heading.nextElementSibling;
    const anchor = findTopAnchor(section);
    if (anchor && heading.previousElementSibling !== anchor) {
      anchor.insertAdjacentElement("afterend", heading);
      heading.insertAdjacentElement("afterend", list);
      changed += 1;
    }
  });

  return changed;
};

let scheduled = false;
const schedule = () => {
  if (scheduled) return;
  scheduled = true;
  window.setTimeout(() => {
    scheduled = false;
    standardizeB1SpeakingStructures(document);
  }, 60);
};

if (process.env.NODE_ENV !== "test" && typeof window !== "undefined" && typeof document !== "undefined") {
  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("popstate", schedule);
  [0, 150, 500, 1200].forEach((delay) => window.setTimeout(schedule, delay));
}
