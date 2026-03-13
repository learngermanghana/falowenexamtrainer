import React, { useEffect, useMemo, useState } from "react";

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

const buildAudioSources = (url) => {
  const source = String(url || "").trim();
  if (!source) return [];

  const fileId = extractGoogleDriveFileId(source);
  if (!fileId) return [source];

  return [
    `https://docs.google.com/uc?export=download&id=${fileId}`,
    `https://drive.google.com/uc?export=download&id=${fileId}`,
    `https://docs.google.com/uc?export=open&id=${fileId}`,
    source,
  ];
};

const CoursebookAudioPlayer = ({ url, linkLabel = "Open audio in a new tab" }) => {
  const sources = useMemo(() => buildAudioSources(url), [url]);
  const [sourceIndex, setSourceIndex] = useState(0);

  useEffect(() => {
    setSourceIndex(0);
  }, [url]);

  const streamUrl = sources[sourceIndex] || "";
  const hasFallbackSource = sourceIndex < sources.length - 1;

  const handleAudioError = () => {
    if (!hasFallbackSource) return;
    setSourceIndex((currentIndex) => Math.min(currentIndex + 1, sources.length - 1));
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {streamUrl ? (
        <audio controls preload="none" style={{ width: "100%" }} src={streamUrl} onError={handleAudioError}>
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
