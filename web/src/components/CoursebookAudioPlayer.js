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

const isDirectAudioUrl = (url) => /\.(mp3|wav|m4a|ogg|webm)(\?|$)/i.test(String(url || ""));

const CoursebookAudioPlayer = ({ url, linkLabel = "Open audio in a new tab", linkStyle }) => {
  const source = String(url || "").trim();
  const fileId = useMemo(() => extractGoogleDriveFileId(source), [source]);
  const drivePreviewUrl = fileId ? `https://drive.google.com/file/d/${fileId}/preview` : "";
  const audioUrl = !fileId && isDirectAudioUrl(source) ? source : "";

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {drivePreviewUrl ? (
        <iframe
          title="Coursebook audio player"
          src={drivePreviewUrl}
          style={{ width: "100%", minHeight: 96, border: 0, borderRadius: 8 }}
          allow="autoplay"
        />
      ) : null}

      {audioUrl ? (
        <audio controls preload="none" style={{ width: "100%" }} src={audioUrl}>
          Your browser does not support the audio element.
        </audio>
      ) : null}

      <a href={source} target="_blank" rel="noreferrer" style={linkStyle}>
        {linkLabel}
      </a>
    </div>
  );
};

export default CoursebookAudioPlayer;
