import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";
import {
  activateWorkbookNativeTab,
  getWorkbookPageRoot,
  hideWorkbookNativeTabs,
  restoreWorkbookDom,
  setWorkbookPageVisible,
} from "../utils/courseWorkbookDom";
import {
  buildCanonicalAssignmentLockId,
  buildLegacyAssignmentLockId,
  buildLegacyChapterKey,
  buildWorkbookStudentScopeKey,
  getWorkbookNavigationTabs,
} from "../utils/courseWorkbookSubmission";

const normalize = (value) => String(value || "").trim().toLowerCase();

const selectAssignment = (items, resource) => {
  if (!items.length) return null;
  const chapter = normalize(resource?.chapter);
  return items.find((item) => normalize(item.chapter) === chapter) || items[0];
};

const isSelfPractice = (resource = {}) => {
  const role = `${resource?.resourceRole || ""} ${resource?.mode || ""} ${resource?.title || ""}`.toLowerCase();
  return resource?.assignment === false || resource?.progressionEligible === false || role.includes("self-practice");
};

const useCourseWorkbookTabsV2 = ({ hostRef, match }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, studentProfile } = useAuth();
  const level = String(match?.level || "").toUpperCase();
  const day = Number(match?.day);
  const tabs = useMemo(() => getWorkbookNavigationTabs(level), [level]);
  const assignment = useMemo(
    () => selectAssignment(getInlineCourseAssignments(level, day), match?.resource),
    [day, level, match?.resource]
  );
  const assignmentKey = assignment?.assignmentKey || "";
  const [activeTab, setActiveTab] = useState(level === "A1" ? "assignment" : "teil1");
  const lastActivated = useRef("");

  const studentCode = studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || "";
  const studentScopeKey = useMemo(
    () => buildWorkbookStudentScopeKey({ userId: user?.uid, studentCode, studentEmail: user?.email }),
    [studentCode, user?.email, user?.uid]
  );
  const legacyChapterKey = buildLegacyChapterKey({ chapter: assignment?.chapter || match?.resource?.chapter, day });
  const canonicalLockId = buildCanonicalAssignmentLockId({ studentScopeKey, assignmentKey });
  const legacyLockId = buildLegacyAssignmentLockId({ studentScopeKey, level, chapterKey: legacyChapterKey });
  const enabled = Boolean(tabs.length && assignmentKey && !isSelfPractice(match?.resource));

  useEffect(() => {
    setActiveTab(level === "A1" ? "assignment" : "teil1");
    lastActivated.current = "";
  }, [level, location.pathname]);

  useEffect(() => {
    if (!enabled) return undefined;
    const pageRoot = getWorkbookPageRoot(hostRef);
    if (!pageRoot) return undefined;

    if (activeTab === "submit") {
      setWorkbookPageVisible(pageRoot, false);
      const search = new URLSearchParams(location.search || "");
      search.set("assignmentKey", assignmentKey);
      search.set("assignmentId", assignmentKey);
      search.set("level", level);
      navigate(
        { pathname: location.pathname, search: `?${search.toString()}`, hash: location.hash },
        {
          replace: true,
          state: { ...(location.state || {}), assignmentKey, canonicalAssignmentKey: assignmentKey, level, day, inlineCourseSubmission: true },
        }
      );
    } else {
      setWorkbookPageVisible(pageRoot, true);
      if (["A2", "B1"].includes(level)) {
        hideWorkbookNativeTabs(pageRoot);
        if (lastActivated.current !== activeTab) {
          lastActivated.current = activeTab;
          window.setTimeout(() => activateWorkbookNativeTab(pageRoot, activeTab), 0);
        }
      }
    }

    return () => {
      if (activeTab === "submit") setWorkbookPageVisible(pageRoot, true);
    };
  }, [activeTab, assignmentKey, day, enabled, hostRef, level, location.hash, location.pathname, location.search, location.state, navigate]);

  useEffect(() => () => restoreWorkbookDom(getWorkbookPageRoot(hostRef)), [hostRef]);

  return {
    activeTab,
    assignment,
    assignmentKey,
    canonicalLockId,
    day,
    enabled,
    legacyChapterKey,
    legacyLockId,
    level,
    setActiveTab,
    studentScopeKey,
    tabs,
  };
};

export default useCourseWorkbookTabsV2;
