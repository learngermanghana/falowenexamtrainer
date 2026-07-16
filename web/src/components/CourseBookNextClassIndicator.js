import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NextLiveClassCard from "./NextLiveClassCard";
import { findNextClassSession } from "../services/classCalendar";
import { subscribeCanonicalLiveClass } from "../services/canonicalLiveClassService";
import {
  COURSE_BOOK_NEXT_CLASS_SLOT_ATTRIBUTE,
  findCourseBookStatGrid,
  findCurrentOrNextSession,
  findOrCreateCourseBookNextClassMount,
  formatClassCountdown,
  resolveLevel,
} from "../utils/courseBookNextClassLogic";
import {
  loadLiveClassSummaryCache,
  saveLiveClassSummaryCache,
} from "../utils/liveClassCardPresentation";

export {
  findCourseBookStatGrid,
  findCurrentOrNextSession,
  findOrCreateCourseBookNextClassMount,
  formatClassCountdown,
  resolveLevel,
} from "../utils/courseBookNextClassLogic";

const COURSE_BOOK_PATH = "/campus/course";
const SELF_LEARNING_LEVELS = new Set(["B2", "C1"]);
const PRIORITY_COMPACTED_ATTRIBUTE = "data-falowen-priority-compacted";
const NEXT_ACTION_ATTRIBUTE = "data-falowen-course-next-action";
const YOUTUBE_MOVED_ATTRIBUTE = "data-falowen-youtube-moved";

const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

const normalizeLegacySession = (session) => session
  ? {
      ...session,
      startsAt: session.startDateTime,
      endsAt: session.endDateTime,
      topic: session.titles?.join("; ") || "Live class",
    }
  : null;

const findNextCourseCard = (root = document) => {
  if (!root?.querySelectorAll) return null;
  return Array.from(root.querySelectorAll("section")).find((section) =>
    Array.from(section.querySelectorAll("p")).some((paragraph) => {
      const label = normalizeText(paragraph.textContent);
      return label === "next self-study lesson" || label === "next assignment";
    })
  ) || null;
};

const findYouTubeWrapper = (root = document) => {
  if (!root?.querySelectorAll) return null;
  const subscribeLink = Array.from(root.querySelectorAll("a")).find(
    (anchor) => normalizeText(anchor.textContent) === "subscribe on youtube"
  );
  return subscribeLink?.parentElement || null;
};

const compactLiveClassCard = (mount) => {
  const liveCard = mount?.querySelector?.('[data-next-live-class-card="true"]');
  if (!liveCard) return false;

  liveCard.setAttribute(PRIORITY_COMPACTED_ATTRIBUTE, "true");
  Object.assign(liveCard.style, {
    borderWidth: "1px",
    borderRadius: "14px",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.10)",
    gap: "7px",
    padding: "10px 12px",
  });

  const title = liveCard.querySelector("h3");
  if (title) Object.assign(title.style, { fontSize: "18px", lineHeight: "1.2" });

  const datePanel = Array.from(liveCard.querySelectorAll(":scope > div")).find((element) =>
    Array.from(element.querySelectorAll("strong")).some((strong) => normalizeText(strong.textContent).includes("ghana time"))
  );
  if (datePanel) Object.assign(datePanel.style, { padding: "7px 9px", borderRadius: "10px", gap: "2px" });

  const buttonRow = Array.from(liveCard.querySelectorAll(":scope > div")).find((element) =>
    Array.from(element.querySelectorAll("a")).some((anchor) => normalizeText(anchor.textContent) === "open lesson")
  );
  if (buttonRow) {
    Object.assign(buttonRow.style, { gap: "6px" });
    buttonRow.querySelectorAll("a, button").forEach((control) => {
      Object.assign(control.style, { padding: "7px 9px", fontSize: "12px" });
    });
    buttonRow.querySelectorAll("button:disabled").forEach((button) => {
      button.style.display = "none";
      button.setAttribute("aria-hidden", "true");
    });
  }

  const afterThis = Array.from(liveCard.querySelectorAll(":scope > div")).find((element) =>
    normalizeText(element.querySelector("strong")?.textContent) === "after this"
  );
  if (afterThis) {
    afterThis.style.display = "none";
    afterThis.setAttribute("aria-hidden", "true");
  }

  return true;
};

const compactNextCourseCard = (card) => {
  if (!card) return false;

  card.setAttribute(PRIORITY_COMPACTED_ATTRIBUTE, "true");
  Object.assign(card.style, {
    alignItems: "center",
    borderRadius: "14px",
    gap: "8px",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    padding: "11px 12px",
  });

  const heading = card.querySelector("h3");
  if (heading) Object.assign(heading.style, { fontSize: "17px", lineHeight: "1.25" });

  Array.from(card.querySelectorAll("p")).forEach((paragraph) => {
    const text = normalizeText(paragraph.textContent);
    if (text.startsWith("complete this lesson") || text.startsWith("open this assignment")) {
      paragraph.style.display = "none";
      paragraph.setAttribute("aria-hidden", "true");
    }
  });

  const completionLabel = card.querySelector("label");
  if (completionLabel) completionLabel.style.fontSize = "12px";

  const action = card.querySelector(`[${NEXT_ACTION_ATTRIBUTE}="true"]`) || Array.from(card.querySelectorAll("a")).find(
    (anchor) => normalizeText(anchor.textContent).startsWith("open:")
  );
  if (action) {
    if (!action.hasAttribute(NEXT_ACTION_ATTRIBUTE)) {
      action.setAttribute(NEXT_ACTION_ATTRIBUTE, "true");
      action.setAttribute("data-original-label", String(action.textContent || "").trim());
      action.title = String(action.textContent || "").trim();
    }
    if (normalizeText(action.textContent) !== "continue") action.textContent = "Continue";
    Object.assign(action.style, {
      justifySelf: "end",
      padding: "8px 12px",
      whiteSpace: "nowrap",
    });
  }

  return true;
};

export const compactCourseBookPriorityArea = (root = document) => {
  if (!root?.querySelectorAll) return { liveClass: false, nextLesson: false, youtubeMoved: false };

  const statGrid = findCourseBookStatGrid(root);
  const hero = statGrid?.closest?.("section") || null;
  const courseRoot = hero?.parentElement || null;
  if (!hero || !courseRoot) return { liveClass: false, nextLesson: false, youtubeMoved: false };

  const standaloneMount = courseRoot.querySelector(`[${COURSE_BOOK_NEXT_CLASS_SLOT_ATTRIBUTE}="true"]`);
  const liveMount = standaloneMount || statGrid;
  if (standaloneMount) {
    Object.assign(standaloneMount.style, {
      justifySelf: "stretch",
      marginInline: "auto",
      maxWidth: "1120px",
      width: "100%",
    });
  }

  const liveClass = compactLiveClassCard(liveMount);
  const nextCard = findNextCourseCard(courseRoot);
  const nextLesson = compactNextCourseCard(nextCard);

  if (nextCard) {
    if (standaloneMount && standaloneMount.nextElementSibling !== nextCard) {
      standaloneMount.insertAdjacentElement("afterend", nextCard);
    } else if (!standaloneMount && hero.nextElementSibling !== nextCard) {
      hero.insertAdjacentElement("afterend", nextCard);
    }
  }

  const youtubeWrapper = findYouTubeWrapper(courseRoot);
  const handoffHost = courseRoot.querySelector('[data-course-completion-handoff-host="true"]');
  let youtubeMoved = false;
  if (youtubeWrapper) {
    youtubeWrapper.setAttribute(YOUTUBE_MOVED_ATTRIBUTE, "true");
    Object.assign(youtubeWrapper.style, { justifyContent: "flex-end", marginTop: "6px" });
    const isAtBottom = handoffHost
      ? youtubeWrapper.nextElementSibling === handoffHost
      : youtubeWrapper === courseRoot.lastElementChild;
    if (!isAtBottom) {
      courseRoot.insertBefore(youtubeWrapper, handoffHost || null);
      youtubeMoved = true;
    }
  }

  return { liveClass, nextLesson, youtubeMoved };
};

const CourseBookNextClassIndicator = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const { studentProfile } = useAuth();

  const className = String(studentProfile?.className || "").trim();
  const classId = String(
    studentProfile?.classId || studentProfile?.classRecordId || studentProfile?.assignedClassId || ""
  ).trim();
  const level = resolveLevel(studentProfile);
  const isSelfLearning = SELF_LEARNING_LEVELS.has(level);
  const isCourseBook = location.pathname.replace(/\/+$/, "") === COURSE_BOOK_PATH;
  const cacheIdentity = useMemo(() => ({ classId, className }), [classId, className]);

  const [portalTarget, setPortalTarget] = useState(null);
  const [canonicalStatus, setCanonicalStatus] = useState("idle");
  const [canonicalSummary, setCanonicalSummary] = useState(() => loadLiveClassSummaryCache(cacheIdentity));
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!isCourseBook) {
      setPortalTarget(null);
      return undefined;
    }

    let standaloneMount = null;
    const resolveTarget = () => {
      const target = findOrCreateCourseBookNextClassMount(document, level);
      if (target?.getAttribute?.(COURSE_BOOK_NEXT_CLASS_SLOT_ATTRIBUTE) === "true") {
        standaloneMount = target;
      }
      setPortalTarget(target);
    };
    resolveTarget();
    const observer = new MutationObserver(resolveTarget);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (standaloneMount?.parentNode) standaloneMount.parentNode.removeChild(standaloneMount);
    };
  }, [isCourseBook, level]);

  useEffect(() => {
    if (!isCourseBook) return undefined;

    let scheduled = false;
    const applyCompactLayout = () => compactCourseBookPriorityArea(document);
    const scheduleCompactLayout = () => {
      if (scheduled) return;
      scheduled = true;
      const run = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
      run(() => {
        scheduled = false;
        applyCompactLayout();
      });
    };

    applyCompactLayout();
    const timers = [60, 220, 700].map((delay) => window.setTimeout(scheduleCompactLayout, delay));
    const observer = new MutationObserver(scheduleCompactLayout);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
    };
  }, [isCourseBook, portalTarget]);

  useEffect(() => {
    if (!isCourseBook) return undefined;

    const refreshNow = () => setNow(new Date());
    const refreshWhenVisible = () => {
      if (!document.hidden) refreshNow();
    };

    refreshNow();
    const timer = window.setInterval(refreshNow, 30000);
    window.addEventListener("focus", refreshNow);
    window.addEventListener("pageshow", refreshNow);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshNow);
      window.removeEventListener("pageshow", refreshNow);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [isCourseBook]);

  useEffect(() => {
    if (!isCourseBook || isSelfLearning || (!className && !classId)) {
      setCanonicalStatus("unavailable");
      return undefined;
    }

    const cached = loadLiveClassSummaryCache(cacheIdentity);
    if (cached) setCanonicalSummary(cached);
    setCanonicalStatus("loading");
    return subscribeCanonicalLiveClass({
      classId,
      className,
      onChange: (summary) => {
        setCanonicalSummary(summary);
        saveLiveClassSummaryCache(cacheIdentity, summary);
        setCanonicalStatus("ready");
      },
      onUnavailable: () => setCanonicalStatus(cached ? "cached" : "unavailable"),
      onError: (error) => {
        console.warn("Course Book next-class indicator could not load the live schedule", error);
        setCanonicalStatus(cached ? "cached" : "unavailable");
      },
    });
  }, [cacheIdentity, classId, className, isCourseBook, isSelfLearning]);

  const nextSession = useMemo(() => {
    if (isSelfLearning) return null;
    const canonicalSessions = canonicalSummary?.sessions || [];
    const canonicalNext = findCurrentOrNextSession(canonicalSessions, now)
      || (!canonicalSessions.length ? canonicalSummary?.nextSession : null)
      || null;
    if (canonicalNext) return canonicalNext;
    return normalizeLegacySession(findNextClassSession(className, now));
  }, [canonicalSummary, className, isSelfLearning, now]);

  if (!isCourseBook || !portalTarget) return null;

  const locale = i18n.language || "en";
  const fullCalendarLink = `/campus/course/full-class-calendar/${encodeURIComponent(className)}`;
  const displaySummary = canonicalSummary || {
    klass: { name: className || "Your class", levelId: level },
    sessions: nextSession ? [nextSession] : [],
  };
  const standalone = portalTarget.getAttribute?.(COURSE_BOOK_NEXT_CLASS_SLOT_ATTRIBUTE) === "true";

  return createPortal(
    nextSession ? (
      <NextLiveClassCard
        summary={displaySummary}
        session={nextSession}
        zoom={canonicalSummary?.zoom || {}}
        now={now}
        locale={locale}
        fullCalendarLink={fullCalendarLink}
        compact={!standalone}
        updating={canonicalStatus === "loading" || canonicalStatus === "cached"}
      />
    ) : (
      <div
        data-falowen-next-class-indicator="true"
        style={{
          border: standalone ? "1px solid #bfdbfe" : "1px solid rgba(255,255,255,0.28)",
          background: standalone
            ? "linear-gradient(145deg, #eff6ff 0%, #ffffff 62%, #eef2ff 100%)"
            : "rgba(255,255,255,0.16)",
          borderRadius: 16,
          padding: 12,
          backdropFilter: "blur(8px)",
          boxShadow: standalone ? "0 12px 28px rgba(37,99,235,0.10)" : undefined,
          order: standalone ? undefined : -1,
          display: "grid",
          gap: 4,
          minWidth: 0,
        }}
      >
        <p style={{ margin: 0, color: standalone ? "#1d4ed8" : "#bfdbfe", fontSize: 12, fontWeight: 700 }}>Next class</p>
        <p style={{ margin: "4px 0 0", color: standalone ? "#0f172a" : "#ffffff", fontSize: 17, fontWeight: 900, lineHeight: 1.2 }}>
          {isSelfLearning
            ? "Self-learning course"
            : canonicalStatus === "loading"
              ? "Checking schedule…"
              : className
                ? "No upcoming class"
                : "No class assigned"}
        </p>
        <p style={{ margin: 0, color: standalone ? "#475569" : "#dbeafe", fontSize: 12, lineHeight: 1.4 }}>
          {isSelfLearning ? "No live class is required" : className || "Ask the school to assign your class"}
        </p>
        {!isSelfLearning && className ? <a href={fullCalendarLink} style={{ color: standalone ? "#1d4ed8" : "#ffffff", width: "fit-content", marginTop: 3, fontSize: 12 }}>View class calendar</a> : null}
      </div>
    ),
    portalTarget,
  );
};

export default CourseBookNextClassIndicator;
