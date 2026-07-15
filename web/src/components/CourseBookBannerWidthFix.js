import { useEffect } from "react";

const COMPACT_BANNER_ATTRIBUTE = "data-course-book-compact-banner";
const PREVIOUS_STYLE_ATTRIBUTE = "data-course-book-banner-previous-style";

const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

export const findCourseBookHero = (root = document) => {
  if (!root?.querySelectorAll) return null;
  const heading = Array.from(root.querySelectorAll("h1, h2, h3")).find(
    (element) => normalizeText(element.textContent) === "course book"
  );
  return heading?.closest("section") || null;
};

export const applyCompactCourseBookBanner = (root = document) => {
  const hero = findCourseBookHero(root);
  if (!hero) return null;

  if (!hero.hasAttribute(PREVIOUS_STYLE_ATTRIBUTE)) {
    hero.setAttribute(
      PREVIOUS_STYLE_ATTRIBUTE,
      JSON.stringify({
        width: hero.style.width || "",
        maxWidth: hero.style.maxWidth || "",
        marginLeft: hero.style.marginLeft || "",
        marginRight: hero.style.marginRight || "",
        justifySelf: hero.style.justifySelf || "",
        boxSizing: hero.style.boxSizing || "",
      })
    );
  }

  hero.setAttribute(COMPACT_BANNER_ATTRIBUTE, "true");
  hero.style.width = "100%";
  hero.style.maxWidth = "920px";
  hero.style.marginLeft = "auto";
  hero.style.marginRight = "auto";
  hero.style.justifySelf = "center";
  hero.style.boxSizing = "border-box";
  return hero;
};

export const restoreCourseBookBanner = (root = document) => {
  Array.from(root?.querySelectorAll?.(`[${COMPACT_BANNER_ATTRIBUTE}]`) || []).forEach((hero) => {
    let previous = {};
    try {
      previous = JSON.parse(hero.getAttribute(PREVIOUS_STYLE_ATTRIBUTE) || "{}");
    } catch (_error) {
      previous = {};
    }

    hero.style.width = previous.width || "";
    hero.style.maxWidth = previous.maxWidth || "";
    hero.style.marginLeft = previous.marginLeft || "";
    hero.style.marginRight = previous.marginRight || "";
    hero.style.justifySelf = previous.justifySelf || "";
    hero.style.boxSizing = previous.boxSizing || "";
    hero.removeAttribute(COMPACT_BANNER_ATTRIBUTE);
    hero.removeAttribute(PREVIOUS_STYLE_ATTRIBUTE);
  });
};

export default function CourseBookBannerWidthFix() {
  useEffect(() => {
    let scheduled = false;
    const apply = () => {
      scheduled = false;
      applyCompactCourseBookBanner(document);
    };
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      const frame = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
      frame(apply);
    };

    schedule();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      restoreCourseBookBanner(document);
    };
  }, []);

  return null;
}
