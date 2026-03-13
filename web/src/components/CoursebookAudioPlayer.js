import React, { useMemo } from "react";

const extractGoogleDriveFileId = (url) => {
  const source = String(url || "").trim();
  if (!source) return "";

  const match = source.match(/\/file\/d\/([^/]+)/i);
  if (match?.[1]) return match[1];

  try {
    const parsed = new URL(source);
    return parsed.searchParams.get("id") || "";
  } catch (_error) {
    return "";
  }
};

const CoursebookAudioPlayer = ({ url, linkLabel = "Open audio in a new tab" }) => {
  const fileId = useMemo(() => extractGoogleDriveFileId(url), [url]);
  const streamUrl = fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : "";

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {streamUrl ? (
        <audio controls preload="none" style={{ width: "100%" }} src={streamUrl}>
          Your browser does not support the audio element.
        </audio>
      ) : null}
      <a href={url} target="_blank" rel="noreferrer">
        {linkLabel}
      </a>
    </div>
  );
};

export default CoursebookAudioPlayer;
