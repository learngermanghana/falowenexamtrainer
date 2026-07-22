(function () {
  if (window.__falowenCourseSpeakingChatCleanupInstalled) return;
  window.__falowenCourseSpeakingChatCleanupInstalled = true;

  // The Goethe speaking coach is part of the working Learn/Speak/Write lesson
  // structure for every course level. This runtime now only reverses stale
  // hiding left by older cached cleanup scripts; it never hides course UI.
  const COURSE_LEVELS = "a1|a2|b1|b2|c1";
  const HIDDEN_ATTRIBUTE = "data-course-free-chat-hidden";
  let scheduled = false;
  let lastLocationHref = window.location.href;

  const normalizePath = (value = "") =>
    String(value || "")
      .toLowerCase()
      .replace(/\/+$/, "") || "/";

  const isCourseLesson = (pathname = window.location.pathname) => {
    const path = normalizePath(pathname);
    return (
      new RegExp(`^/campus/course/lesson/(?:${COURSE_LEVELS})/\\d+(?:/|$)`).test(path) ||
      new RegExp(`^/campus/course/(?:${COURSE_LEVELS})-day-\\d+-`).test(path)
    );
  };

  const restoreElement = (element) => {
    if (!element) return false;
    const wasManaged = element.getAttribute(HIDDEN_ATTRIBUTE) === "true";
    if (wasManaged) element.removeAttribute(HIDDEN_ATTRIBUTE);
    if (element.hidden) element.hidden = false;
    if (element.style.getPropertyValue("display") === "none") {
      element.style.removeProperty("display");
    }
    return wasManaged;
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

  // Do not replace pushState or replaceState. Firefox can reject patched History
  // methods during rapid React Router navigation. Watching the URL plus DOM
  // mutations is enough and leaves the lesson navigation untouched.
  const watchLocation = () => {
    const currentHref = window.location.href;
    if (currentHref === lastLocationHref) return;
    lastLocationHref = currentHref;
    scheduleCleanup();
  };

  const observer = new MutationObserver(scheduleCleanup);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.setInterval(watchLocation, 250);
  window.addEventListener("popstate", scheduleCleanup);
  document.addEventListener("DOMContentLoaded", scheduleCleanup);
  window.addEventListener("load", scheduleCleanup);
  [100, 350, 800, 1500, 2600].forEach((delay) => window.setTimeout(scheduleCleanup, delay));

  window.cleanCourseSpeakingChat = cleanCourseSpeakingChat;
})();
