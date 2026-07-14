import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  hideDuplicateFloatingCourseSubmitButton,
  resolveProtectedA2WorkbookRedirect,
} from "../utils/a2ProtectedWorkbookRoutes";

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";

export default function A2ProtectedWorkbookRouteGuard() {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTarget = useMemo(
    () => resolveProtectedA2WorkbookRedirect({ pathname: location.pathname, search: location.search }),
    [location.pathname, location.search],
  );
  const isCourseBook = normalizePath(location.pathname) === "/campus/course";

  useEffect(() => {
    if (!redirectTarget) return;
    const current = `${normalizePath(location.pathname)}${location.search || ""}`;
    if (current === redirectTarget) return;

    navigate(redirectTarget, {
      replace: true,
      state: location.state || null,
    });
  }, [location.pathname, location.search, location.state, navigate, redirectTarget]);

  useEffect(() => {
    if (!isCourseBook || typeof document === "undefined") return undefined;

    let scheduled = false;
    const hideDuplicate = () => {
      scheduled = false;
      hideDuplicateFloatingCourseSubmitButton(document);
    };
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      const enqueue = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
      enqueue(hideDuplicate);
    };

    schedule();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isCourseBook]);

  return null;
}
