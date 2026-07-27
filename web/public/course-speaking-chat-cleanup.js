(function () {
  if (window.__falowenCourseSpeakingChatCleanupInstalled) return;
  window.__falowenCourseSpeakingChatCleanupInstalled = true;

  // Keep the Goethe speaking coach available in the lesson's speaking practice,
  // but never let it leak into an A2/B1 Grammar view. Legacy A2 workbooks can
  // portal Grammar above a still-mounted Teil 1 panel, so this small route-aware
  // guard owns that cross-layout cleanup without changing the workbook content.
  const COURSE_LEVELS = "a1|a2|b1|b2|c1";
  const A2_B1_LEVELS = "a2|b1";
  const INLINE_PANEL_SELECTOR = '[data-course-inline-practice="speaking"]';
  const HIDDEN_ATTRIBUTE = "data-course-free-chat-hidden";
  let scheduled = false;
  let lastLocationHref = window.location.href;

  const normalizePath = (value = "") =>
    String(value || "")
      .toLowerCase()
      .replace(/\/+$/, "") || "/";

  const matchesCourseLevel = (levels, pathname = window.location.pathname) => {
    const path = normalizePath(pathname);
    return (
      new RegExp(`^/campus/course/lesson/(?:${levels})/\\d+(?:/|$)`).test(path) ||
      new RegExp(`^/campus/course/(?:${levels})-day-\\d+-`).test(path)
    );
  };

  const isCourseLesson = (pathname = window.location.pathname) =>
    matchesCourseLevel(COURSE_LEVELS, pathname);

  const isA2B1CourseLesson = (pathname = window.location.pathname) =>
    matchesCourseLevel(A2_B1_LEVELS, pathname);

  const isGrammarViewActive = (pathname = window.location.pathname) => {
    if (!isA2B1CourseLesson(pathname)) return false;
    const path = normalizePath(pathname);

    // Dedicated grammar-note routes should never carry a speaking coach.
    if (/(?:grammar|grammatik)(?:-notes)?(?:\/|$)/.test(path)) return true;

    // Shared A2/B1 workbook navigation exposes the active tab accessibly.
    const selectedGrammarTab = Array.from(
      document.querySelectorAll('[role="tab"][aria-selected="true"]'),
    ).some((tab) => String(tab.getAttribute("aria-label") || tab.textContent || "").trim().toLowerCase() === "grammar");
    if (selectedGrammarTab) return true;

    // Legacy A2 adapters portal Grammar while the old Teil 1 DOM stays mounted.
    if (document.querySelector('[data-a2-standard-legacy-panel="grammar"]')) return true;
    if (document.querySelector('[data-a2-b1-legacy-grammar-panel="true"]')) return true;

    return false;
  };

  const hideElement = (element) => {
    if (!element) return false;
    const alreadyManaged = element.getAttribute(HIDDEN_ATTRIBUTE) === "true";
    if (!alreadyManaged) element.setAttribute(HIDDEN_ATTRIBUTE, "true");
    element.hidden = true;
    element.style.setProperty("display", "none", "important");
    return !alreadyManaged;
  };

  const restoreElement = (element) => {
    if (!element || element.getAttribute(HIDDEN_ATTRIBUTE) !== "true") return false;
    element.removeAttribute(HIDDEN_ATTRIBUTE);
    element.hidden = false;
    element.style.removeProperty("display");
    return true;
  };

  const findEmbeddedFreeChatRoot = (heading) => {
    let node = heading;
    for (let depth = 0; depth < 5 && node; depth += 1) {
      if (node.hasAttribute?.("data-goethe-free-chat")) return node;
      if (node.hasAttribute?.("data-course-inline-practice")) return node;
      node = node.parentElement;
    }

    node = heading;
    for (let depth = 0; depth < 4 && node?.parentElement; depth += 1) {
      node = node.parentElement;
    }
    return node || heading;
  };

  const hideA2B1GrammarSpeakingChat = () => {
    let changed = false;
    document.querySelectorAll(INLINE_PANEL_SELECTOR).forEach((panel) => {
      changed = hideElement(panel) || changed;
    });

    Array.from(document.querySelectorAll("h1, h2, h3, h4")).forEach((heading) => {
      if (!/goethe\s+(speaking|sprechen)/i.test(String(heading.textContent || ""))) return;
      changed = hideElement(findEmbeddedFreeChatRoot(heading)) || changed;
    });

    Array.from(document.querySelectorAll("label")).forEach((label) => {
      if (String(label.textContent || "").trim().toLowerCase() !== "quick starters") return;
      changed = hideElement(label.parentElement) || changed;
    });

    return changed;
  };

  const restoreCourseSpeakingChat = () => {
    let changed = false;
    document.querySelectorAll(`[${HIDDEN_ATTRIBUTE}="true"]`).forEach((element) => {
      changed = restoreElement(element) || changed;
    });
    return changed;
  };

  const cleanCourseSpeakingChat = () => {
    if (!isCourseLesson()) return false;
    if (isGrammarViewActive()) return hideA2B1GrammarSpeakingChat();
    return restoreCourseSpeakingChat();
  };

  const scheduleCleanup = () => {
    if (scheduled) return;
    scheduled = true;
    window.setTimeout(() => {
      scheduled = false;
      cleanCourseSpeakingChat();
    }, 0);
  };

  // Do not replace pushState or replaceState. Watching the URL, tab selection and
  // DOM mutations is enough and leaves React Router navigation untouched.
  const watchLocation = () => {
    const currentHref = window.location.href;
    if (currentHref === lastLocationHref) return;
    lastLocationHref = currentHref;
    scheduleCleanup();
  };

  const observer = new MutationObserver(scheduleCleanup);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["aria-selected"],
  });

  window.setInterval(watchLocation, 250);
  window.addEventListener("popstate", scheduleCleanup);
  document.addEventListener("DOMContentLoaded", scheduleCleanup);
  window.addEventListener("load", scheduleCleanup);
  [100, 350, 800, 1500, 2600].forEach((delay) => window.setTimeout(scheduleCleanup, delay));

  window.cleanCourseSpeakingChat = cleanCourseSpeakingChat;
  window.isA2B1GrammarViewActive = isGrammarViewActive;
})();
