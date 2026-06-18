import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  db,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "../firebase";
import { styles } from "../styles";
import { getInlineCourseAssignments, normalizeCourseAssignmentKey } from "../utils/courseLessonAssignments";
import {
  buildCanonicalAssignmentLockId,
  buildLegacyAssignmentLockId,
  buildLegacyChapterKey,
  buildWorkbookStudentScopeKey,
  getWorkbookNativeTabKey,
  getWorkbookNavigationTabs,
} from "../utils/courseWorkbookSubmission";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";

const LOCK_COLLECTION = "submissionLocks";
const TAB_COUNTER_REGEX = /^tab\s+\d+\s+of\s+\d+/i;
const HIDDEN_ROW_ATTRIBUTE = "data-falowen-workbook-native-tabs-hidden";
const HIDDEN_COUNTER_ATTRIBUTE = "data-falowen-workbook-tab-counter-hidden";
const PAGE_DISPLAY_ATTRIBUTE = "data-falowen-workbook-page-display";

const normalizeChapter = (value) => String(value || "").trim().toLowerCase();

const getWorkbookPageRoot = (hostRef) => hostRef?.current?.nextElementSibling || null;

const rememberDisplay = (element, attribute) => {
  if (!element || element.hasAttribute(attribute)) return;
  element.setAttribute(attribute, element.style.display || "");
};

const restoreDisplay = (element, attribute) => {
  if (!element || !element.hasAttribute(attribute)) return;
  element.style.display = element.getAttribute(attribute) || "";
  element.removeAttribute(attribute);
};

const findNativeTabButton = (pageRoot, tabKey) =>
  Array.from(pageRoot?.querySelectorAll("button") || []).find(
    (button) => getWorkbookNativeTabKey(button.textContent) === tabKey
  ) || null;

const hideNativeWorkbookNavigation = (pageRoot) => {
  if (!pageRoot) return;

  const nativeButtons = Array.from(pageRoot.querySelectorAll("button")).filter((button) =>
    getWorkbookNativeTabKey(button.textContent)
  );
  const buttonsByParent = new Map();

  nativeButtons.forEach((button) => {
    const parent = button.parentElement;
    if (!parent) return;
    buttonsByParent.set(parent, (buttonsByParent.get(parent) || 0) + 1);
  });

  const nativeRow = [...buttonsByParent.entries()]
    .sort((left, right) => right[1] - left[1])
    .find(([, count]) => count >= 3)?.[0];

  if (nativeRow) {
    rememberDisplay(nativeRow, HIDDEN_ROW_ATTRIBUTE);
    nativeRow.style.display = "none";
  }

  Array.from(pageRoot.querySelectorAll("p")).forEach((paragraph) => {
    if (!TAB_COUNTER_REGEX.test(String(paragraph.textContent || "").trim())) return;
    rememberDisplay(paragraph, HIDDEN_COUNTER_ATTRIBUTE);
    paragraph.style.display = "none";
  });
};

const restoreNativeWorkbookNavigation = (pageRoot) => {
  if (!pageRoot) return;
  Array.from(pageRoot.querySelectorAll(`[${HIDDEN_ROW_ATTRIBUTE}]`)).forEach((element) =>
    restoreDisplay(element, HIDDEN_ROW_ATTRIBUTE)
  );
  Array.from(pageRoot.querySelectorAll(`[${HIDDEN_COUNTER_ATTRIBUTE}]`)).forEach((element) =>
    restoreDisplay(element, HIDDEN_COUNTER_ATTRIBUTE)
  );
};

export const isSelfPracticeWorkbookResource = (resource = {}) => {
  const role = `${resource?.resourceRole || ""} ${resource?.mode || ""} ${resource?.title || ""}`.toLowerCase();
  return resource?.assignment === false || resource?.progressionEligible === false || role.includes("self-practice");
};

export const chooseAssignmentForWorkbook = (assignments, resource) => {
  if (!assignments.length) return null;
  const resourceChapter = normalizeChapter(resource?.chapter);
  if (!resourceChapter) return assignments[0];
  return assignments.find((assignment) => normalizeChapter(assignment.chapter) === resourceChapter) || assignments[0];
};

const CourseWorkbookSubmissionTabs = ({ hostRef, match }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, studentProfile } = useAuth();
  const level = String(match?.level || "").trim().toUpperCase();
  const day = Number(match?.day);
  const navigationTabs = useMemo(() => getWorkbookNavigationTabs(level), [level]);
  const assignments = useMemo(() => getInlineCourseAssignments(level, day), [day, level]);
  const selectedAssignment = useMemo(
    () => chooseAssignmentForWorkbook(assignments, match?.resource),
    [assignments, match?.resource]
  );
  const assignmentKey = selectedAssignment?.assignmentKey || "";
  const defaultTab = level === "A1" ? "assignment" : "teil1";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [lockReady, setLockReady] = useState(false);
  const syncInFlightRef = useRef(false);
  const lastClickedRef = useRef({ key: "", button: null });

  const studentCode = studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || "";
  const studentScopeKey = useMemo(
    () =>
      buildWorkbookStudentScopeKey({
        userId: user?.uid,
        studentCode,
        studentEmail: user?.email,
      }),
    [studentCode, user?.email, user?.uid]
  );
  const legacyChapterKey = useMemo(
    () =>
      buildLegacyChapterKey({
        chapter: selectedAssignment?.chapter || match?.resource?.chapter,
        day,
      }),
    [day, match?.resource?.chapter, selectedAssignment?.chapter]
  );
  const canonicalLockId = useMemo(
    () => buildCanonicalAssignmentLockId({ studentScopeKey, assignmentKey }),
    [assignmentKey, studentScopeKey]
  );
  const legacyLockId = useMemo(
    () =>
      buildLegacyAssignmentLockId({
        studentScopeKey,
        level,
        chapterKey: legacyChapterKey,
      }),
    [legacyChapterKey, level, studentScopeKey]
  );

  const submissionEnabled =
    navigationTabs.length > 0 &&
    Boolean(selectedAssignment && assignmentKey) &&
    !isSelfPracticeWorkbookResource(match?.resource);

  const ensureSubmissionContext = useCallback(() => {
    if (!assignmentKey) return;

    const search = new URLSearchParams(location.search || "");
    const currentSearchKey = normalizeCourseAssignmentKey(search.get("assignmentKey"));
    const currentSearchId = normalizeCourseAssignmentKey(search.get("assignmentId"));
    const currentSearchLevel = String(search.get("level") || "").trim().toUpperCase();
    const currentStateKey = normalizeCourseAssignmentKey(
      location.state?.assignmentKey || location.state?.canonicalAssignmentKey
    );
    const currentStateLevel = String(location.state?.level || "").trim().toUpperCase();
    const currentStateDay = Number(location.state?.day);
    const normalizedAssignmentKey = normalizeCourseAssignmentKey(assignmentKey);

    if (
      currentSearchKey === normalizedAssignmentKey &&
      currentSearchId === normalizedAssignmentKey &&
      currentSearchLevel === level &&
      currentStateKey === normalizedAssignmentKey &&
      currentStateLevel === level &&
      currentStateDay === day
    ) {
      return;
    }

    search.set("assignmentKey", assignmentKey);
    search.set("assignmentId", assignmentKey);
    search.set("level", level);

    navigate(
      {
        pathname: location.pathname,
        search: `?${search.toString()}`,
        hash: location.hash,
      },
      {
        replace: true,
        state: {
          ...(location.state || {}),
          assignmentKey,
          assignmentId: assignmentKey,
          canonicalAssignmentKey: assignmentKey,
          level,
          day,
          inlineCourseSubmission: true,
        },
      }
    );
  }, [assignmentKey, day, level, location.hash, location.pathname, location.search, location.state, navigate]);

  const syncCanonicalLockAliases = useCallback(async () => {
    if (!db || !user?.uid || !assignmentKey || !canonicalLockId || !legacyLockId || syncInFlightRef.current) {
      return;
    }

    syncInFlightRef.current = true;
    try {
      const canonicalRef = doc(db, LOCK_COLLECTION, canonicalLockId);
      const legacyRef = doc(db, LOCK_COLLECTION, legacyLockId);
      const [canonicalSnapshot, legacySnapshot] = await Promise.all([getDoc(canonicalRef), getDoc(legacyRef)]);
      const canonicalData = canonicalSnapshot.exists() ? canonicalSnapshot.data() || {} : null;
      const legacyData = legacySnapshot.exists() ? legacySnapshot.data() || {} : null;
      const sharedIdentity = {
        studentId: user.uid,
        studentEmail: user?.email || "",
        studentCode,
        studentScopeKey,
        level,
        day,
        chapter: selectedAssignment?.chapter || match?.resource?.chapter || "",
        chapterKey: legacyChapterKey,
        assignmentTitle: selectedAssignment?.title || selectedAssignment?.label || `Day ${day} assignment`,
        assignmentKey,
        canonicalAssignmentKey: assignmentKey,
        canonicalLockId,
        legacyLockId,
      };

      if (legacyData && !canonicalData) {
        await setDoc(
          canonicalRef,
          {
            ...legacyData,
            ...sharedIdentity,
            lockIdentity: "canonical_assignment",
            migratedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } else if (legacyData && canonicalData && (!canonicalData.assignmentKey || !canonicalData.canonicalAssignmentKey)) {
        await setDoc(canonicalRef, { ...sharedIdentity, lockIdentity: "canonical_assignment" }, { merge: true });
      }

      if (canonicalData && !legacyData) {
        await setDoc(
          legacyRef,
          {
            ...canonicalData,
            ...sharedIdentity,
            lockIdentity: "legacy_alias",
            migratedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } else if (canonicalData && legacyData && (!legacyData.assignmentKey || !legacyData.canonicalAssignmentKey)) {
        await setDoc(legacyRef, { ...sharedIdentity, lockIdentity: "legacy_alias" }, { merge: true });
      }
    } catch (error) {
      console.error("Failed to synchronize canonical assignment lock", error);
    } finally {
      syncInFlightRef.current = false;
    }
  }, [
    assignmentKey,
    canonicalLockId,
    day,
    legacyChapterKey,
    legacyLockId,
    level,
    match?.resource?.chapter,
    selectedAssignment?.chapter,
    selectedAssignment?.label,
    selectedAssignment?.title,
    studentCode,
    studentScopeKey,
    user?.email,
    user?.uid,
  ]);

  useEffect(() => {
    setActiveTab(defaultTab);
    setLockReady(false);
    lastClickedRef.current = { key: "", button: null };
  }, [defaultTab, location.pathname]);

  useEffect(() => {
    if (!submissionEnabled) {
      setLockReady(true);
      return undefined;
    }

    let mounted = true;
    syncCanonicalLockAliases().finally(() => {
      if (mounted) setLockReady(true);
    });

    if (!db || !user?.uid || !canonicalLockId || !legacyLockId) {
      return () => {
        mounted = false;
      };
    }

    const scheduleSync = () => {
      window.setTimeout(() => syncCanonicalLockAliases(), 40);
    };
    const unsubscribeCanonical = onSnapshot(doc(db, LOCK_COLLECTION, canonicalLockId), scheduleSync, () => {});
    const unsubscribeLegacy = onSnapshot(doc(db, LOCK_COLLECTION, legacyLockId), scheduleSync, () => {});

    return () => {
      mounted = false;
      unsubscribeCanonical();
      unsubscribeLegacy();
    };
  }, [canonicalLockId, legacyLockId, submissionEnabled, syncCanonicalLockAliases, user?.uid]);

  const activateNativeWorkbookTab = useCallback(
    (tabKey) => {
      const pageRoot = getWorkbookPageRoot(hostRef);
      if (!pageRoot) return;
      const button = findNativeTabButton(pageRoot, tabKey);
      if (!button || (lastClickedRef.current.key === tabKey && lastClickedRef.current.button === button)) return;
      lastClickedRef.current = { key: tabKey, button };
      button.click();
    },
    [hostRef]
  );

  useEffect(() => {
    if (!submissionEnabled) return undefined;
    const pageRoot = getWorkbookPageRoot(hostRef);
    if (!pageRoot) return undefined;

    if (activeTab === "submit") {
      rememberDisplay(pageRoot, PAGE_DISPLAY_ATTRIBUTE);
      pageRoot.style.display = "none";
      ensureSubmissionContext();
    } else {
      restoreDisplay(pageRoot, PAGE_DISPLAY_ATTRIBUTE);
      if (["A2", "B1"].includes(level)) {
        hideNativeWorkbookNavigation(pageRoot);
        window.setTimeout(() => activateNativeWorkbookTab(activeTab), 0);
      }
    }

    const observer = new MutationObserver(() => {
      if (activeTab === "submit") return;
      if (["A2", "B1"].includes(level)) {
        hideNativeWorkbookNavigation(pageRoot);
        activateNativeWorkbookTab(activeTab);
      }
    });
    observer.observe(pageRoot, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [activeTab, activateNativeWorkbookTab, ensureSubmissionContext, hostRef, level, submissionEnabled]);

  useEffect(
    () => () => {
      const pageRoot = getWorkbookPageRoot(hostRef);
      restoreDisplay(pageRoot, PAGE_DISPLAY_ATTRIBUTE);
      restoreNativeWorkbookNavigation(pageRoot);
    },
    [hostRef]
  );

  if (!submissionEnabled) return null;

  return (
    <section
      aria-label="Workbook assignment navigation"
      style={{
        ...styles.card,
        border: "1px solid #bfdbfe",
        background: "#eff6ff",
        display: "grid",
        gap: 10,
        margin: "12px 0 0",
        padding: 12,
      }}
    >
      <div
        style={{
          background: "#eff6ff",
          borderRadius: 12,
          display: "grid",
          gap: 10,
          position: "sticky",
          top: 8,
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div>
            <strong style={{ color: "#0f172a" }}>{level} · Day {day} workbook</strong>
            <p style={{ color: "#475569", fontSize: 12, margin: "2px 0 0" }}>
              {selectedAssignment?.chapter ? `Chapter ${selectedAssignment.chapter} · ` : ""}{assignmentKey}
            </p>
          </div>
          <span style={{ color: "#1d4ed8", fontSize: 12, fontWeight: 800 }}>Assignment and submission</span>
        </div>

        <div
          role="tablist"
          aria-label={`${level} workbook sections`}
          style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}
        >
          {navigationTabs.map((tab) => {
            const selected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => {
                  lastClickedRef.current = { key: "", button: null };
                  setActiveTab(tab.key);
                }}
                style={{
                  ...styles.secondaryButton,
                  background: selected ? "#2563eb" : "#ffffff",
                  borderColor: selected ? "#2563eb" : "#93c5fd",
                  color: selected ? "#ffffff" : "#1d4ed8",
                  flex: "0 0 auto",
                  fontWeight: 800,
                  minWidth: level === "A1" ? 120 : 74,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "submit" ? (
        <div style={{ background: "#ffffff", border: "1px solid #bfdbfe", borderRadius: 14, padding: 8 }}>
          {!lockReady ? (
            <p style={{ color: "#475569", margin: 8 }}>Preparing the correct assignment submission…</p>
          ) : (
            <div className="course-book-tab-submission-page">
              <style>{`.course-book-tab-submission-page > div > section:first-child { display: none !important; }
              .course-book-tab-submission-page select { display: none !important; }`}</style>
              <AssignmentSubmissionPage
                key={`${level}-${normalizeCourseAssignmentKey(assignmentKey)}`}
                submissionContext={{
                  level,
                  day,
                  assignmentKey,
                  canonicalAssignmentKey: assignmentKey,
                }}
              />
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
};

export default CourseWorkbookSubmissionTabs;
