import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const normalizeText = (value = "") =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim();

const normalizeLower = (value = "") => normalizeText(value).toLowerCase();
const GUIDANCE_VERSION = "2";

const EXAM_TAB_GUIDANCE = [
  {
    name: "Question of the day",
    description: "practise one level-appropriate question at a time.",
  },
  {
    name: "Reading",
    description: "practise reading questions for your current exam level.",
  },
  {
    name: "Speaking",
    description: "practise speaking prompts and review your answers.",
  },
  {
    name: "Writing",
    description: "practise writing tasks and improve your corrections.",
  },
  {
    name: "Vocab",
    description: "review and strengthen vocabulary for your current level.",
  },
  {
    name: "Listening",
    description: "practise listening questions for your current exam level.",
  },
  {
    name: "Resources",
    description: "open official Goethe exam information and practice materials.",
  },
  {
    name: "Exam File",
    description: "check your progress, results, feedback and exam readiness.",
  },
];

const readLevel = (value = "") => {
  const text = normalizeText(value).toUpperCase();
  return text.match(/\b(A1|A2|B1|B2|C1)\b/)?.[1] || "";
};

const findGuidanceCards = (root = document) => {
  if (!root?.querySelectorAll) return [];

  const cards = new Set();

  root.querySelectorAll("h1, h2, h3, h4, strong").forEach((heading) => {
    const text = normalizeLower(heading.textContent);
    if (!/^after\s+(a1|a2|b1|b2|c1):\s*prepare\s+for\s+the\s+goethe\s+(a1|a2|b1|b2|c1)\s+exam$/i.test(text)) {
      return;
    }
    const card = heading.closest("section, article") || heading.parentElement;
    if (card) cards.add(card);
  });

  root.querySelectorAll("p, li").forEach((element) => {
    const text = normalizeLower(element.textContent);
    if (
      !text.includes("the course book builds your language skills") &&
      !text.includes("open the exams room and choose your current level")
    ) {
      return;
    }
    const card = element.closest("section, article") || element.parentElement;
    if (card) cards.add(card);
  });

  return [...cards];
};

const buildListItem = ({ name, description }) => {
  const item = document.createElement("li");
  const label = document.createElement("strong");
  label.textContent = name;
  item.append(label, document.createTextNode(` — ${description}`));
  return item;
};

export const applyCourseCompletionExamGuidance = (root = document) => {
  if (!root?.querySelectorAll || typeof document === "undefined") return 0;

  let updated = 0;

  findGuidanceCards(root).forEach((card) => {
    const heading = card.querySelector("h1, h2, h3, h4, strong");
    const level = readLevel(heading?.textContent || card.textContent);
    if (!level) return;

    const expectedHeading = `After ${level}: prepare for the Goethe ${level} exam`;
    if (heading && normalizeText(heading.textContent) !== expectedHeading) {
      heading.textContent = expectedHeading;
    }

    const introText = `Your ${level} exam level is selected automatically from your student profile. Use the current Exams Room tabs to practise for the Goethe ${level} exam.`;
    let intro = card.querySelector('[data-course-completion-exam-intro="true"]');
    if (!intro) {
      intro = Array.from(card.querySelectorAll("p")).find((paragraph) => {
        const text = normalizeLower(paragraph.textContent);
        return (
          text.includes("the course book builds your language skills") ||
          text.includes("the exams room") ||
          text.includes("exam structure")
        );
      });
    }
    if (!intro) {
      intro = document.createElement("p");
      heading?.insertAdjacentElement("afterend", intro);
    }
    intro.setAttribute("data-course-completion-exam-intro", "true");
    if (normalizeText(intro.textContent) !== introText) intro.textContent = introText;

    let list = card.querySelector('[data-course-completion-exam-tabs="true"]');
    if (!list) list = card.querySelector("ul, ol");
    if (!list) {
      list = document.createElement("ul");
      intro.insertAdjacentElement("afterend", list);
    }
    list.setAttribute("data-course-completion-exam-tabs", "true");
    if (list.getAttribute("data-course-completion-exam-tabs-version") !== GUIDANCE_VERSION) {
      list.replaceChildren(...EXAM_TAB_GUIDANCE.map(buildListItem));
      list.setAttribute("data-course-completion-exam-tabs-version", GUIDANCE_VERSION);
    }

    const closingText = `Use Exam File to monitor your ${level} progress. Repeat the areas where you are weakest until your results and confidence show that you are ready.`;
    let closing = card.querySelector('[data-course-completion-exam-closing="true"]');
    if (!closing) {
      closing = document.createElement("p");
      list.insertAdjacentElement("afterend", closing);
    }
    closing.setAttribute("data-course-completion-exam-closing", "true");
    if (normalizeText(closing.textContent) !== closingText) closing.textContent = closingText;

    card.setAttribute("data-course-completion-exam-guidance", level);
    updated += 1;
  });

  return updated;
};

export default function CourseCompletionExamGuidanceInjector() {
  const location = useLocation();

  useEffect(() => {
    applyCourseCompletionExamGuidance(document);

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        scheduled = false;
        applyCourseCompletionExamGuidance(document);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [location.pathname, location.search]);

  return null;
}

export const __private__ = {
  EXAM_TAB_GUIDANCE,
  findGuidanceCards,
  readLevel,
};
