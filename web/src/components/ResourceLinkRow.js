import React from "react";

export const RESOURCE_ACTION_LABELS = {
  video: "Video ansehen",
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

  return (
    <li>
      <a
        href={resolveHref(label, url)}
        aria-label={`${label} (${RESOURCE_ACTION_LABELS.openInApp})`}
        className="coursebook-resource-link"
        style={{ color: "#2563eb", textDecoration: "none" }}
      >
        {label}
      </a>
    </li>
  );
};

export default ResourceLinkRow;
