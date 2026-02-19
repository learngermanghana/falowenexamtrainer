import React from "react";

export const RESOURCE_ACTION_LABELS = {
  video: "Video ansehen",
  grammarbookZoom: "Grammarbook · Zoom in app",
  workbookZoom: "Workbook · Zoom in app",
  guideOpenInApp: "Guide · Open in app",
};

const buildViewerHref = (label, url) =>
  `/campus/course/resource-viewer?label=${encodeURIComponent(label)}&url=${encodeURIComponent(url)}`;

const ResourceLinkRow = ({ label, url }) => {
  if (!url) return null;

  return (
    <li>
      <a href={url} target="_blank" rel="noreferrer">
        {label}
      </a>{" "}
      ·{" "}
      <a href={buildViewerHref(label, url)}>
        Zoom in app
      </a>
    </li>
  );
};

export default ResourceLinkRow;
