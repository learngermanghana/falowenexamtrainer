import React from "react";

export const RESOURCE_ACTION_LABELS = {
  video: "Video ansehen",
  openInApp: "View in app",
  openExternal: "View externally",
  guideOpenInApp: "Guide · View in app",
};

const buildViewerHref = (label, url) =>
  `/campus/course/resource-viewer?label=${encodeURIComponent(label)}&url=${encodeURIComponent(url)}`;

const IN_APP_HOSTS = new Set(["falowen.app", "www.falowen.app", "app.falowen.app"]);

const isInAppLink = (url) => {
  if (!url) return false;

  if (url.startsWith("/")) return true;

  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.origin === window.location.origin) return true;

    const hostname = parsed.hostname.toLowerCase();
    return IN_APP_HOSTS.has(hostname) && parsed.pathname.startsWith("/campus/");
  } catch (error) {
    return false;
  }
};

const ResourceLinkRow = ({ label, url }) => {
  if (!url) return null;

  if (isInAppLink(url)) {
    return (
      <li>
        <a href={url} aria-label={`${label} (${RESOURCE_ACTION_LABELS.openInApp})`}>
          {label}
        </a>
      </li>
    );
  }

  return (
    <li>
      <a href={buildViewerHref(label, url)} aria-label={`${label} (${RESOURCE_ACTION_LABELS.openInApp})`}>
        {label}
      </a>{" "}
      ·{" "}
      <a href={url} target="_blank" rel="noreferrer" aria-label={`${label} (${RESOURCE_ACTION_LABELS.openExternal})`}>
        {RESOURCE_ACTION_LABELS.openExternal}
      </a>
    </li>
  );
};

export default ResourceLinkRow;
