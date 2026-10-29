import React, { useEffect, useState } from "react";
import WorkbookDayMusic, { normalizeWorkbookSong } from "./WorkbookDayMusic";
import { getYouTubeVideoId } from "./A1WorkbookMediaPanel";
import { styles } from "../styles";

// This wrapper is for independent A1 practice books only. Do not mount it
// around A1TutorMarkedWorkbookShell or any submission/assessment route.
let musicCatalogPromise;
const loadA1PracticeMusicCatalog = () => {
  if (!musicCatalogPromise) {
    const read = async (path) => {
      const response = await fetch(path, { cache: "no-cache" });
      if (!response.ok) throw new Error("Music catalog unavailable");
      return response.json();
    };
    musicCatalogPromise = Promise.allSettled([
      read("/music/catalog.json"),
      read("/api/music-library"),
    ]).then(([curated, discovered]) => {
      if (curated.status === "rejected" && discovered.status === "rejected") {
        throw new Error("Music catalog unavailable");
      }
      const published = curated.status === "fulfilled" && Array.isArray(curated.value?.tracks)
        ? curated.value.tracks : [];
      const uploaded = discovered.status === "fulfilled" && discovered.value?.ok && Array.isArray(discovered.value?.tracks)
        ? discovered.value.tracks : [];
      return [...published, ...uploaded];
    }).catch((error) => {
      musicCatalogPromise = null; // Allow retry next time the practice book opens.
      throw error;
    });
  }
  return musicCatalogPromise;
};

export const selectPracticeBookVideos = (resources = []) => {
  const seenIds = new Set();
  let aiSelected = false;
  return resources.filter((resource) => {
    const url = String(resource?.url || "").trim();
    if (!url) return false;
    const videoId = getYouTubeVideoId(url);
    const identity = videoId || url;
    if (seenIds.has(identity)) return false;
    if (resource.kind === "ai") {
      if (aiSelected) return false; // At most one AI explanation per practice book.
      aiSelected = true;
    }
    seenIds.add(identity);
    return resource.kind === "teacher" || resource.kind === "ai";
  });
};

export default function A1PracticeBookLayout({ day, chapter, title, overview = "", children }) {
  const [tab, setTab] = useState("overview");
  const [hasMusic, setHasMusic] = useState(false);
  const [musicStatus, setMusicStatus] = useState("loading");
  useEffect(() => {
    let cancelled = false;
    setHasMusic(false);
    setMusicStatus("loading");
    loadA1PracticeMusicCatalog()
      .then((tracks) => {
        if (cancelled) return;
        setHasMusic(tracks.some((track) => normalizeWorkbookSong(track, "A1", Number(day))));
        setMusicStatus("ready");
      })
      .catch(() => { if (!cancelled) setMusicStatus("error"); });
    return () => { cancelled = true; };
  }, [day]);

  useEffect(() => {
    if (musicStatus === "ready" && !hasMusic && tab === "music") setTab("overview");
  }, [hasMusic, musicStatus, tab]);

  const changeTab = (nextTab) => setTab(nextTab);
  // Match the bold, high-contrast tutor-marked A1 navigation.
  const tabStyle = (selected) => ({
    ...styles.secondaryButton,
    background: selected ? "#2563eb" : "#ffffff",
    borderColor: selected ? "#2563eb" : "#93c5fd",
    color: selected ? "#ffffff" : "#1d4ed8",
    borderRadius: 12,
    cursor: "pointer",
    flex: "1 1 112px",
    fontWeight: 900,
    lineHeight: 1.2,
    minHeight: 50,
    minWidth: 0,
    padding: "10px 12px",
    whiteSpace: "normal",
  });

  return (
    <main data-a1-practice-book-layout="true" data-practice-day={day}
      style={{ ...styles.container, display: "grid", gap: 16, paddingBottom: 32 }}>
      <header style={{ ...styles.card, display: "grid", gap: 12, border: "1px solid #dbeafe" }}>
        <div style={{ color: "#475569", fontSize: 12, fontWeight: 800 }}>
          A1 · Day {day}{chapter ? " · Kapitel " + chapter : ""} · PRACTICE BOOK
        </div>
        <h1 style={{ margin: 0, fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)", color: "#0f172a" }}>
          {title}
        </h1>
        {/* Canonical teacher and AI players already appear above this practice
            book. Do not repeat their links or players inside the workbook. */}
      </header>

      <section style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
        <nav aria-label="A1 practice book sections" data-a1-practice-tabs="true"
          style={{
            ...styles.card,
            border: "2px solid #2563eb",
            background: "linear-gradient(135deg, #dbeafe 0%, #ffffff 74%)",
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            padding: 12,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}>
          <button type="button" style={tabStyle(tab === "overview")}
            aria-current={tab === "overview" ? "page" : undefined}
            onClick={() => changeTab("overview")}>Overview</button>
          <button type="button" style={tabStyle(tab === "workbook")}
            aria-current={tab === "workbook" ? "page" : undefined}
            onClick={() => changeTab("workbook")}>Workbook</button>
          {hasMusic ? (
            <button type="button" style={tabStyle(tab === "music")}
              aria-current={tab === "music" ? "page" : undefined}
              onClick={() => changeTab("music")}>♫ Music</button>
          ) : null}
        </nav>

        <div data-a1-practice-panel="overview" hidden={tab !== "overview"} style={{ padding: 18 }}>
          <div style={{ display: "grid", gap: 14, lineHeight: 1.7 }}>
            <h2 style={{ margin: 0, fontSize: 21 }}>Welcome to Day {day}</h2>
            <p style={{ margin: 0 }}>{overview || "Review the lesson and complete the practice activities in the Workbook tab."}</p>
            <div style={{ padding: 14, background: "#f1f5f9", borderRadius: 12 }}>
              Teacher lecture and AI explanation are optional resources above.
              Open <strong>Workbook</strong> for every original exercise.
              {hasMusic ? " You can also listen to the lesson song in Music." : ""}
            </div>
            <button type="button" onClick={() => changeTab("workbook")}
              style={{ ...styles.primaryButton, justifySelf: "start" }}>
              Open Workbook →
            </button>
          </div>
        </div>

        <div data-a1-practice-panel="workbook" hidden={tab !== "workbook"}
          style={{ padding: "12px 0" }}>
          {/* Keep the original component mounted when switching tabs so typed
              answers, controls, class discussion state and exercise order survive. */}
          {children}
        </div>

        {hasMusic && tab === "music" ? (
          <div data-a1-practice-panel="music" style={{ padding: 18 }}>
            <WorkbookDayMusic level="A1" day={day} learningMode="self"
              hideLegacyNotes compact />
          </div>
        ) : null}
      </section>
    </main>
  );
}
