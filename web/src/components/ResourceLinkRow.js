import React from "react";

export const RESOURCE_ACTION_LABELS = {
  video: "Video ansehen",
  openInApp: "Open in app",
  guideOpenInApp: "Guide · Open in app",
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
        <a href={url}>{label}</a>
      </li>
    );
  }

  return (
    <li>
      <a href={url} target="_blank" rel="noreferrer">
        {label}
      </a>{" "}
      ·{" "}
      <a href={buildViewerHref(label, url)}>
        {RESOURCE_ACTION_LABELS.openInApp}
      </a>
    </li>
  );
};

export default ResourceLinkRow;
