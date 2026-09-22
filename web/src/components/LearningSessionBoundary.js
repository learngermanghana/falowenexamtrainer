import React, { useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  canResumeLearningLaunch,
  clearLearningSession,
  isStandaloneApp,
  readLearningSession,
  saveLearningSession,
} from "../services/learningSession";

export default function LearningSessionBoundary({ children }) {
  const location = useLocation();
  const { user, loading } = useAuth();
  const uid = user?.uid || null;
  const href = `${location.pathname}${location.search}${location.hash}`;
  const initialLocation = useRef({ key: location.key, href });
  const initialized = useRef(false);
  const previousUid = useRef(null);
  const startupDecision = useRef(null);
  const [startup, setStartup] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (!uid) {
      if (previousUid.current) {
        clearLearningSession(previousUid.current);
        startupDecision.current = null;
        setStartup(null);
      }
      previousUid.current = null;
      return;
    }
    previousUid.current = uid;
    if (startupDecision.current?.uid !== uid) {
      const standalone = isStandaloneApp();
      const atInitialLocation = initialLocation.current.key === location.key &&
        initialLocation.current.href === href;
      const saved = !initialized.current && atInitialLocation &&
        canResumeLearningLaunch(href, standalone)
        ? readLearningSession(uid, { standalone }) : null;
      initialized.current = true;
      startupDecision.current = { uid, key: location.key, href: saved?.href || href };
    }
    setStartup(startupDecision.current);
  }, [href, loading, location.key, uid]);

  const ready = !loading && uid && startup?.uid === uid;
  const resumeHref = ready && location.key === startup.key && startup.href !== href
    ? startup.href : null;

  useEffect(() => {
    if (!ready || resumeHref) return undefined;
    const save = () => saveLearningSession(uid, href);
    const saveWhenHidden = () => {
      if (document.visibilityState === "hidden") save();
    };
    save();
    document.addEventListener("visibilitychange", saveWhenHidden);
    window.addEventListener("pagehide", save);
    return () => {
      document.removeEventListener("visibilitychange", saveWhenHidden);
      window.removeEventListener("pagehide", save);
    };
  }, [href, ready, resumeHref, uid]);

  // Wait for the startup decision before child redirects can replace it. Existing
  // authentication, onboarding, and payment gates still run at the destination.
  if (!loading && uid && !ready) return null;
  if (resumeHref) return <Navigate to={resumeHref} replace />;
  return children;
}
