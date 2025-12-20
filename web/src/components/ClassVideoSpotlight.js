import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { getPlaylistIdsForLevel } from "../data/youtubePlaylists";

const deriveLevel = (studentProfile) => {
  const profileLevel = studentProfile?.level;
  if (profileLevel) return String(profileLevel).toUpperCase();

  const classMatch = studentProfile?.className?.match(/\b(A1|A2|B1|B2)\b/i);
  return classMatch ? classMatch[1].toUpperCase() : "A1";
};

const PlaylistSelector = ({ playlistIds, activeId, onSelect }) => {
  if (!playlistIds.length) return null;

  if (playlistIds.length === 1) {
    return (
      <p style={{ ...styles.helperText, margin: "4px 0 0" }}>
        Playing your level playlist. Tap below to open the full playlist on YouTube.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {playlistIds.map((id, index) => (
        <button
          key={id}
          style={activeId === id ? styles.navButtonActive : styles.navButton}
          onClick={() => onSelect(id)}
        >
          Playlist {index + 1}
        </button>
      ))}
    </div>
  );
};

const ClassVideoSpotlight = ({ studentProfile }) => {
  const level = useMemo(() => deriveLevel(studentProfile), [studentProfile]);
  const playlistIds = useMemo(() => getPlaylistIdsForLevel(level), [level]);
  const [activePlaylistId, setActivePlaylistId] = useState(playlistIds[0]);

  useEffect(() => {
    if (playlistIds.length === 0) return;
    if (!activePlaylistId || !playlistIds.includes(activePlaylistId)) {
      setActivePlaylistId(playlistIds[0]);
    }
  }, [activePlaylistId, playlistIds]);

  if (!playlistIds.length) {
    return (
      <section style={{ ...styles.card, display: "grid", gap: 8 }}>
        <p style={{ ...styles.helperText, margin: 0 }}>Video practice</p>
        <h3 style={{ ...styles.sectionTitle, margin: "4px 0" }}>YouTube lessons coming soon</h3>
        <p style={{ ...styles.helperText, margin: 0 }}>
          We could not find a playlist for your level ({level}). Your admin can set YOUTUBE_PLAYLIST_IDS in the environment
          to connect the right videos.
        </p>
      </section>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/videoseries?list=${activePlaylistId}`;

  return (
    <section style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <p style={{ ...styles.helperText, margin: 0 }}>Video practice</p>
          <h3 style={{ ...styles.sectionTitle, margin: "4px 0" }}>Watch your class videos</h3>
          <p style={{ ...styles.helperText, margin: 0 }}>Level {level} · Streamed from YouTube</p>
        </div>
        <a
          href={`https://www.youtube.com/playlist?list=${activePlaylistId}`}
          target="_blank"
          rel="noreferrer"
          style={styles.secondaryButton}
        >
          Open playlist on YouTube
        </a>
      </div>

      <div
        style={{
          position: "relative",
          paddingTop: "56.25%",
          borderRadius: 12,
          overflow: "hidden",
          background: "#000",
        }}
      >
        <iframe
          title="Class video playlist"
          src={embedUrl}
          style={{ position: "absolute", inset: 0, border: 0, width: "100%", height: "100%" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <strong style={{ fontSize: 14 }}>Pick another playlist</strong>
        <PlaylistSelector
          playlistIds={playlistIds}
          activeId={activePlaylistId}
          onSelect={(id) => setActivePlaylistId(id)}
        />
      </div>
    </section>
  );
};

export default ClassVideoSpotlight;
