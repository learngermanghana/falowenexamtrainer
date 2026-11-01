import React, { useEffect, useMemo, useState } from "react";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { styles } from "../styles";
import { matchingEnglishTranslation } from "../utils/musicEnglishTranslations";

// Only approved public music playback IDs; private Hören assets are never read.
// Uploads to music/<level>/day-XX/ are discovered through the existing
// bounded server-side R2 music-list endpoint, not direct browser R2 access.
const SONG_ID = /^[a-zA-Z0-9_-]{1,245}$/;
const LEVELS = new Set(["A1", "A2", "B1"]);

export const normalizeWorkbookSong = (track, level, day) => {
  if (!track || !SONG_ID.test(String(track.id || ""))) return null;
  if (track.level !== level || Number(track.day) !== day || track.coursebook !== true) return null;
  if (!track.autoDiscovered && track.approved !== true) return null;
  const objectKey = String(track.objectKey || "");
  // A course Hören recording must never be mistaken for optional public music.
  const prefix = `music/${level.toLowerCase()}/day-${String(day).padStart(2, "0")}/`;
  if (!objectKey.startsWith(prefix) || !/^[^/]+\.mp3$/.test(objectKey.slice(prefix.length))) return null;
  const url = new URL("https://www.falowen.app/api/music?track=" + encodeURIComponent(track.id));
  if (track.audioUrl !== url.href) return null;
  return {
    id: track.id,
    title: String(track.title || "Lesson music").slice(0, 120),
    topic: String(track.topic || "").slice(0, 120),
    objectKey: String(track.objectKey || ""),
    assignmentKey: String(track.assignmentKey || ""),
    audioUrl: url.href,
    autoDiscovered: track.autoDiscovered === true,
  };
};

const listenLinkFor = (song) => song.autoDiscovered
  ? `https://music.falowen.app/?track=${encodeURIComponent(song.id)}`
  : `https://music.falowen.app/music/songs/${song.id}.html`;

export default function WorkbookDayMusic({ level, day, title = "", workbookId = "", learningMode = "tutor", hideLegacyNotes = false, compact = false }) {
  const courseLevel = String(level || "").trim().toUpperCase();
  const lessonDay = Number(day);
  const valid = LEVELS.has(courseLevel) && Number.isInteger(lessonDay) && lessonDay >= 1 && lessonDay <= 28;
  const [songs, setSongs] = useState([]);
  const [packs, setPacks] = useState({});
  const [selectedId, setSelectedId] = useState("");
  const [state, setState] = useState("loading");
  const [recordingLyrics, setRecordingLyrics] = useState(null);
  const [translations, setTranslations] = useState({recordings:[]});
  const [showEnglish, setShowEnglish] = useState(courseLevel === "A1");
  useEffect(() => { setShowEnglish(courseLevel === "A1"); }, [courseLevel]);

  useEffect(() => {
    if (!valid) return undefined;
    const controller = new AbortController();
    const getJson = async (url) => {
      const response = await fetch(url, { signal: controller.signal, cache: "no-cache" });
      if (!response.ok) throw new Error("Music temporarily unavailable");
      return response.json();
    };
    setState("loading");
    Promise.allSettled([
      getJson("/music/catalog.json"),
      getJson("/api/music-library"),
      getJson("/music/learning.json"),
      getJson("/music/english-translations.json"),
    ]).then(([curated, discovered, lessons, english]) => {
      if (controller.signal.aborted) return;
      const pinned = curated.status === "fulfilled"
        ? (Array.isArray(curated.value?.tracks) ? curated.value.tracks : []) : [];
      const dynamic = discovered.status === "fulfilled" && discovered.value?.ok
        ? (Array.isArray(discovered.value.tracks) ? discovered.value.tracks : []) : [];
      const combined = new Map();
      const paths = new Set();
      for (const track of [...pinned, ...dynamic]) {
        const song = normalizeWorkbookSong(track, courseLevel, lessonDay);
        if (!song || combined.has(song.id)) continue;
        if (song.objectKey && paths.has(song.objectKey)) continue;
        combined.set(song.id, song);
        if (song.objectKey) paths.add(song.objectKey);
      }
      const sorted = [...combined.values()];
      setSongs(sorted);
      setSelectedId(previous => sorted.some(song => song.id === previous) ? previous : sorted[0]?.id || "");
      setPacks(lessons.status === "fulfilled" && typeof lessons.value?.lessons === "object"
        ? lessons.value.lessons : {});
      setTranslations(english.status === "fulfilled" && Array.isArray(english.value?.recordings)
        ? english.value : {recordings:[]});
      setState(curated.status === "rejected" && discovered.status === "rejected" ? "error" : "ready");
    }).catch(() => { if (!controller.signal.aborted) setState("error"); });
    return () => controller.abort();
  }, [courseLevel, lessonDay, valid]);

  const chosen = useMemo(() => songs.find(song => song.id === selectedId) || null, [songs, selectedId]);

  // The existing music-lyrics API verifies the EXACT R2 MP3 key and excludes
  // stale or mismatched sidecars. New recordings should not need a workbook
  // code release before their owner-approved lyrics can be displayed.
  useEffect(() => {
    if (!chosen) return undefined;
    const controller = new AbortController();
    setRecordingLyrics(null);
    fetch("/api/music-lyrics?track=" + encodeURIComponent(chosen.id), {
      signal: controller.signal,
      cache: "no-cache",
    }).then(response => response.ok ? response.json() : null).then(data => {
      if (controller.signal.aborted) return;
      if (data?.objectKey === chosen.objectKey && typeof data.lyrics === "string" && data.lyrics.trim()) {
        setRecordingLyrics({ id: chosen.id, objectKey: chosen.objectKey, lyrics: data.lyrics.trim() });
      }
    }).catch(() => {
      // Missing lyric sidecars are normal for newly uploaded MP3s.
      // Playback always remains available, and a different song's text
      // must never appear in this lesson.
    });
    return () => controller.abort();
  }, [chosen?.id, chosen?.objectKey]);

  // Keep the older approved learning packs as a fallback for curated songs.
  // Never display unapproved studio drafts as recording-matched lyric sheets.
  const legacyLyrics = chosen && !chosen.autoDiscovered && chosen.assignmentKey
    && packs[chosen.id]?.assignmentKey === chosen.assignmentKey
    ? String(packs[chosen.id]?.lyrics || "").trim() : "";
  const approvedLyrics = recordingLyrics && chosen &&
    recordingLyrics.id === chosen.id && recordingLyrics.objectKey === chosen.objectKey
    ? recordingLyrics.lyrics : legacyLyrics;
  const englishPack = chosen && approvedLyrics ? matchingEnglishTranslation(
    translations, chosen.objectKey, approvedLyrics) : null;

  if (!valid) return null;

  return (
    <section data-workbook-music="true" data-music-level={courseLevel} data-music-day={lessonDay}
      style={{ ...(compact ? {} : styles.card), display: "grid", gap: 14, alignContent: "start", gridAutoRows: "max-content", padding: compact ? "18px 14px" : undefined, minWidth: 0,
        border: "1px solid #9bcdb8", borderRadius: 20,
        background: "radial-gradient(circle at 94% 7%, rgba(194,244,176,.42), transparent 44%), linear-gradient(145deg,#f0fcf4,#f0f6ff 64%,#fffdf1)" }}>
      <div style={{ display: "grid", gap: 5 }}>
        <span style={{ width: "fit-content", borderRadius: 999, background: "#e3f5e7",
          color: "#1c6641", padding: "5px 11px", fontWeight: 800, fontSize: 12 }}>
          OPTIONAL LISTENING · NOT AN ASSIGNMENT
        </span>
        <h2 style={{ margin: 0, fontSize: compact ? "1.12rem" : "1.45rem", color: "#164e36" }}>
          <span aria-hidden="true" style={{ display: "inline-grid", placeItems: "center", marginRight: 8, width: 32, height: 32, borderRadius: "50%", color: "#eafcf3", background: "#205b4a" }}>♫</span>
          Music · {courseLevel} Day {lessonDay}
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.7, margin: 0 }}>
          Enjoy the song for this lesson and follow the German lyrics when available.
          No answers, submission, AI marking, score or music-specific deadline are required.
          {courseLevel === "A1"
            ? (learningMode === "self"
              ? " Self-learning exercises and Radio are separate from Music."
              : " Tutor-marked assignments and their submission remain separate from Music.")
            : " Assessed Teil 4 · Hören remains separate."}
        </p>
      </div>

      {state === "loading" ? <p role="status">Checking today's music…</p> : null}
      {state === "error" ? (
        <p role="alert">Music could not be checked right now. Please try this tab again later.</p>
      ) : null}
      {state === "ready" && songs.length === 0 ? (
        <p data-no-day-song="true" style={{ margin: 0, padding: 16, color: "#475569",
          border: "1px dashed #b9d2c0", background: "#f6faf7", borderRadius: 12 }}>
          No song published for {courseLevel} Day {lessonDay} yet. This listening is optional;
          you can continue your workbook normally.
        </p>
      ) : null}
      {chosen ? (
        <div data-workbook-song-card="true" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start",
          alignItems: "stretch", gap: 12, padding: 16, minWidth: 0, width: "100%", height: "auto",
          background: "rgba(255,255,255,.94)", border: "1px solid #c4e0d4",
          borderRadius: 16, boxShadow: "0 12px 28px rgba(18,74,61,.07)" }}>
          {songs.length > 1 ? (
            <label style={{ display: "grid", gap: 5, fontWeight: 700, color: "#164e36" }}>
              Choose a song for this day
              <select aria-label="Choose lesson song" value={chosen.id}
                onChange={event => setSelectedId(event.target.value)}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #9ac6a7" }}>
                {songs.map(song => <option key={song.id} value={song.id}>{song.title}</option>)}
              </select>
            </label>
          ) : null}
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <span aria-hidden="true" style={{ display: "grid", placeItems: "center", flex: "0 0 48px",
              width: 48, height: 48, fontSize: 23, borderRadius: 12, color: "#f1fff3",
              background: "linear-gradient(145deg,#235d4c,#173a52)" }}>♫</span>
            <div style={{ minWidth: 0 }}>
              <span style={{ color: "#567768", fontWeight: 800, fontSize: 11, letterSpacing: ".05em" }}>
                {courseLevel} · DAY {lessonDay} · LISTEN
              </span>
              <h3 style={{ margin: "3px 0 0", fontSize: "1.14rem", lineHeight: 1.4, color: "#163f35" }}>{chosen.title}</h3>
            </div>
          </div>
          <audio key={chosen.id} data-music-audio="true" controls preload="none"
            src={chosen.audioUrl} style={{ display: "block", width: "100%", maxWidth: "100%",
              height: 50, minHeight: 50, maxHeight: 50, alignSelf: "stretch", flex: "0 0 50px" }}>
            Your browser does not support this audio player.
          </audio>
          <a href={listenLinkFor(chosen)} target="_blank" rel="noopener noreferrer"
            style={{ color: "#166534", fontWeight: 700, fontSize: 13 }}>
            Open this song on Falowen Music ↗
          </a>
          {approvedLyrics ? (
            <details data-music-lyrics="true">
              <summary style={{ cursor: "pointer", fontWeight: 800, color: "#164e36" }}>
                German lyrics · Mitlesen
              </summary>
              <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 9, color: "#245745",
                  fontSize: 14, fontWeight: 750, opacity: englishPack ? 1 : .6 }}>
                  <input aria-label="Show English" type="checkbox" checked={Boolean(englishPack && showEnglish)}
                    disabled={!englishPack} onChange={event => setShowEnglish(event.target.checked)}
                    style={{ accentColor: "#21694c", width: 18, height: 18 }} />
                  Show English
                </label>
                {!englishPack ? <p data-english-unavailable="true" style={{ margin: 0, fontSize: 12, color: "#62766b" }}>
                  English translation is not available for this recording yet.
                </p> : null}
                <div style={{ display: "grid", gap: 5, padding: "4px 0" }}>
                  {String(approvedLyrics).replace(/\\n/g, "\n").split(/\r?\n/).map((line, rawIndex) => {
                    const de = line.trim();
                    if (!de) return null;
                    if (/^\[.*\]$/.test(de)) return (
                      <h4 key={rawIndex} style={{ margin: "13px 0 5px", color: "#45675a", fontSize: 13,
                        textTransform: "uppercase", letterSpacing: ".07em" }}>{de.slice(1,-1)}</h4>
                    );
                    const sourceLines = String(approvedLyrics).replace(/\\n/g, "\n")
                      .split(/\r?\n/).slice(0,rawIndex).filter(item => item.trim() && !/^\[.*\]$/.test(item.trim()));
                    const translation = englishPack?.lines?.[sourceLines.length]?.en;
                    return <div key={rawIndex} data-lyric-pair="true" style={{
                        padding: "8px 10px", borderBottom: "1px solid #e2efe5",
                        borderRadius: 7, background: rawIndex % 2 ? "#fbfdfb" : "transparent",
                      }}>
                      <div lang="de" style={{ fontSize: 16, lineHeight: 1.6, color: "#203c31", fontWeight: 650 }}>{de}</div>
                      {showEnglish && translation ? <div data-english-line="true" lang="en"
                        style={{ fontSize: 14, lineHeight: 1.55, color: "#5b7667", marginTop: 3 }}>
                        {translation}
                      </div> : null}
                    </div>;
                  })}
                </div>
                {englishPack?.vocabulary?.length ? (
                  <details data-music-vocabulary="true">
                    <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 800, color: "#205c44" }}>
                      Useful German · Vocabulary
                    </summary>
                    <div style={{ display: "grid", gap: 7, padding: "10px 0" }}>
                      {englishPack.vocabulary.map((item, index) => (
                        <p key={index} style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>
                          <strong lang="de">{item.de}</strong> — <span lang="en">{item.en}</span>
                        </p>
                      ))}
                    </div>
                  </details>
                ) : null}
              </div>
            </details>
          ) : (
            <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
              Reviewed lyrics have not been published for this recording yet. You can still listen; line highlighting will be available after the matching lyrics and timings are added.
            </p>
          )}
        </div>
      ) : null}
      {!hideLegacyNotes ? <details data-preserved-workbook-notes="true">
        <summary style={{ cursor: "pointer", color: "#475569", fontWeight: 700, fontSize: 13 }}>
          My saved notes (from the previous Ref tab)
        </summary>
        <div style={{ marginTop: 12 }}>
          <WorkbookReferenceAnswers level={courseLevel}
            lesson={{ level: courseLevel, day: lessonDay, title, workbookId }}
            workbookId={workbookId} />
        </div>
      </details> : null}
    </section>
  );
}
