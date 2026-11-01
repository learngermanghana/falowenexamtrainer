import React, { useEffect, useState } from "react";
import { recordMusicPractice, flushMusicPractice } from "../services/musicPracticeService";

// Optional lesson song: the coursebook never waits for music to render and
// never reads private Hören audio. Only approved public catalog entries appear.
export default function FalowenLessonMusic({ level, day, assignmentKey = "" }) {
  const [track, setTrack] = useState(null);
  useEffect(() => () => { void flushMusicPractice(); }, []);
  useEffect(() => {
    const controller = new AbortController();
    setTrack(null);
    fetch("/music/catalog.json", { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error("Music catalog unavailable");
      return response.json();
    }).then(data => {
      const matching = (Array.isArray(data.tracks) ? data.tracks : []).find(song =>
        song.level === String(level).toUpperCase()
        && Number(song.day) === Number(day)
        && song.coursebook !== false
        && (!assignmentKey || !song.assignmentKey || String(song.assignmentKey).toUpperCase() === String(assignmentKey).toUpperCase())
        && typeof song.audioUrl === "string" && /^https:\/\//i.test(song.audioUrl)
        && !/(^|\.)r2\.cloudflarestorage\.com$/i.test(new URL(song.audioUrl).hostname)
      );
      if (!controller.signal.aborted) setTrack(matching || null);
    }).catch(() => {}); // Optional public music must not block or break lessons.
    return () => controller.abort();
  }, [level, day, assignmentKey]);
  if (!track) return null;
  const libraryUrl = new URL("https://music.falowen.app/");
  libraryUrl.searchParams.set("track", track.id);
  return (
    <section aria-label="Music for this lesson" data-falowen-lesson-music="true" style={{ padding: 18, borderRadius: 14, border: "1px solid #b5d7ba", background: "#f2f8e9", display: "grid", gap: 10 }}>
      <strong style={{ color: "#204a3d", fontSize: 16 }}>♫ Listen & learn · {track.title}</strong>
      <p style={{ margin: 0, fontSize: 13, color: "#496d5a" }}>Practise this lesson with a German song. Listen, repeat, and sing along.</p>
      <audio controls preload="none" src={track.audioUrl} aria-label={`Listen to ${track.title}`}
        onPlay={() => { void recordMusicPractice({ event: "play", trackId: track.id, title: track.title, level: track.level, day: track.day }); }}
        onEnded={() => { void recordMusicPractice({ event: "complete", trackId: track.id, title: track.title, level: track.level, day: track.day }); }}
        style={{ width: "100%" }} />
      <a href={libraryUrl.href} target="_blank" rel="noopener noreferrer" style={{ color: "#245d43", fontWeight: 700, fontSize: 13 }}>Open in Falowen Music ↗</a>
    </section>
  );
}
