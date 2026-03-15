import React from "react";
import { triggerInteractionFeedback } from "../services/interactionFeedback";

export const RESOURCE_ACTION_LABELS = {
  video: "🎬 Video ansehen",
  grammarbook: "📘 Grammar",
  workbook: "📝 Workbook",
  openInApp: "View in app",
  guideOpenInApp: "Guide · View in app",
};

const buildViewerHref = (label, url) =>
  `/campus/course/resource-viewer?label=${encodeURIComponent(label)}&url=${encodeURIComponent(url)}`;

const isInternalCourseRoute = (url) => {
  if (!url) return false;

  if (url.startsWith("/campus/course/")) return true;

  try {
    const parsed = new URL(url);
    const isFalowenHost = parsed.hostname === "www.falowen.app" || parsed.hostname === "falowen.app";
    return isFalowenHost && parsed.pathname.startsWith("/campus/course/");
  } catch (error) {
    return false;
  }
};

const resolveHref = (label, url) => {
  if (!url) return "";

  if (isInternalCourseRoute(url)) {
    try {
      const parsed = new URL(url);
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch (error) {
      return url;
    }
  }

  return buildViewerHref(label, url);
};

const ResourceLinkRow = ({ label, url }) => {
  if (!url) return null;

  const handleResourceOpen = () => {
    triggerInteractionFeedback({
      sound: "open",
      notificationTitle: "Course resource opened",
      notificationBody: `Now opening ${label}.`,
      notificationTag: "course-resource-open",
      vibratePattern: [40],
    });
  };

  return (
    <li>
      <a
        href={resolveHref(label, url)}
        aria-label={`${label} (${RESOURCE_ACTION_LABELS.openInApp})`}
        onClick={handleResourceOpen}
      >
        {label}
      </a>
    </li>
  );
};

export default ResourceLinkRow;
