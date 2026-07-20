(function () {
  // A2 and B1 use the Goethe free chat as part of Teil 1 speaking practice.
  // Only the larger B2/C1 coursebook integration should be suppressed here.
  const HIDDEN_COURSE_LEVELS = "b2|c1";
  const RESTORED_COURSE_LEVELS = "a2|b1";
  const INLINE_PANEL_SELECTOR = '[data-course-inline-practice="speaking"]';
  const HIDDEN_ATTRIBUTE = "data-course-free-chat-hidden";
  let scheduled = false;

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

  const isHiddenCourseLesson = (pathname = window.location.pathname) =>
    matchesCourseLevel(HIDDEN_COURSE_LEVELS, pathname);

  const isRestoredCourseLesson = (pathname = window.location.pathname) =>
    matchesCourseLevel(RESTORED_COURSE_LEVELS, pathname);

  const hideElement = (element) => {
    if (!element || element.getAttribute(HIDDEN_ATTRIBUTE) === "true") return false;
    element.setAttribute(HIDDEN_ATTRIBUTE, "true");
    element.hidden = true;
    element.style.setProperty("display", "none", "important");
    return true;
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
    for (let depth = 0; depth < 4 && node; depth += 1) {
      node = node.parentElement;
    }

    if (!node) return null;
    const wrapper = node.parentElement;
    return wrapper && wrapper.children.length === 1 ? wrapper : node;
  };

  const hideQuickStartersFallback = () => {
    Array.from(document.querySelectorAll("label")).forEach((label) => {
      if (String(label.textContent || "").trim().toLowerCase() !== "quick starters") return;
      hideElement(label.parentElement);
    });
  };

  const restoreCourseSpeakingChat = () => {
    let changed = false;
    document.querySelectorAll(`[${HIDDEN_ATTRIBUTE}="true"]`).forEach((element) => {
      changed = restoreElement(element) || changed;
    });
    return changed;
  };

  const cleanCourseSpeakingChat = () => {
    if (isRestoredCourseLesson()) {
      return restoreCourseSpeakingChat();
    }
    if (!isHiddenCourseLesson()) return false;

    let changed = false;
    document.querySelectorAll(INLINE_PANEL_SELECTOR).forEach((panel) => {
      changed = hideElement(panel) || changed;
    });

    Array.from(document.querySelectorAll("h1")).forEach((heading) => {
      if (String(heading.textContent || "").trim() !== "Goethe Speaking Exam Coach") return;
      changed = hideElement(findEmbeddedFreeChatRoot(heading)) || changed;
    });

    hideQuickStartersFallback();
    return changed;
  };

  const scheduleCleanup = () => {
    if (scheduled) return;
    scheduled = true;
    window.setTimeout(() => {
      scheduled = false;
      cleanCourseSpeakingChat();
    }, 0);
  };

  const wrapHistoryMethod = (methodName) => {
    const original = window.history?.[methodName];
    if (typeof original !== "function") return;
    window.history[methodName] = function patchedHistoryMethod(...args) {
      const result = original.apply(this, args);
      scheduleCleanup();
      return result;
    };
  };

  wrapHistoryMethod("pushState");
  wrapHistoryMethod("replaceState");

  const observer = new MutationObserver(scheduleCleanup);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener("popstate", scheduleCleanup);
  document.addEventListener("DOMContentLoaded", scheduleCleanup);
  window.addEventListener("load", scheduleCleanup);
  [100, 350, 800, 1500, 2600].forEach((delay) => window.setTimeout(scheduleCleanup, delay));

  window.cleanCourseSpeakingChat = cleanCourseSpeakingChat;
})();