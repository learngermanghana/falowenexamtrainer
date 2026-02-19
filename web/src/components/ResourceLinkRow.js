import React from "react";

export const RESOURCE_ACTION_LABELS = {
  video: "Video ansehen",
  openInApp: "View in app",
  guideOpenInApp: "Guide · View in app",
};

const buildViewerHref = (label, url) =>
  `/campus/course/resource-viewer?label=${encodeURIComponent(label)}&url=${encodeURIComponent(url)}`;

const ResourceLinkRow = ({ label, url }) => {
  if (!url) return null;

  return (
    <li>
      <a href={buildViewerHref(label, url)} aria-label={`${label} (${RESOURCE_ACTION_LABELS.openInApp})`}>
        {label}
      </a>
    </li>
  );
};

export default ResourceLinkRow;
