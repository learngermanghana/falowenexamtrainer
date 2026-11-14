import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SWAHILI_DAY_FIVE as lesson } from "../data/swahili/dayFive";
import { A2_B1_WORKBOOK_TABS_WITH_GRAMMAR as tabs, WorkbookTabNav } from "./StandardWorkbookComponents";
import { useSwahiliWorkbookTab, SwahiliWorkbookNavigation } from "./SwahiliWorkbookNavigation";
import "./SwahiliCourseBook.css";

const practice = {
  sprechen: ["Kuzungumza · Speaking", "Ask a partner: Unaamka saa ngapi? (What time do you wake up?)"],
  schreiben: ["Kuandika · Writing", "Write three short sentences about what you do in the morning."],
  lesen: ["Kusoma · Reading", "Read: Asha anaamka mapema. Anakunywa chai. What does Asha drink?"],
  hoeren: ["Kusikiliza · Listening", "Listen to the song in Music and write down one word you recognize."],
  submit: ["Wasilisha · Submit", "The assignment will appear here when your tutor publishes it."],
};

function DayFiveMusic() {
  const [pack, setPack] = useState(null);
  const [time, setTime] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/music-lyrics?track=" + lesson.trackId, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((value) => {
        if (!controller.signal.aborted && value?.objectKey === lesson.audioKey && Array.isArray(value.cues)) setPack(value);
      }).catch(() => {});
    return () => controller.abort();
  }, []);
  return <>
    <h2>Muziki · Music</h2>
    <audio controls preload="none" src={"/api/music?track=" + lesson.trackId}
      onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)} />
    {pack?.cues?.length > 0 && pack.cues.map((cue, index) => (
      <p key={index} style={time >= cue.start && time < Math.min(cue.end ?? Infinity, pack.cues[index + 1]?.start ?? Infinity)
        ? { fontWeight: "bold", color: "#1d4ed8" } : undefined}>{cue.text}</p>
    ))}
  </>;
}

export default function SwahiliDayFiveWorkbook({ preview = false }) {
  const [activeTab, setActiveTab] = useSwahiliWorkbookTab(tabs);
  const activity = practice[activeTab];
  return (
    <main className="swahili-book swahili-book--workbook">
      <div className="swahili-book__top">
        <span className="swahili-book__brand">Falowen · Kiswahili</span>
        <Link to={preview ? "/swahili" : "/campus/course"}>← Course Book</Link>
      </div>
      <header className="swahili-book__hero">
        <p className="swahili-book__eyebrow">KISWAHILI · A1</p>
        <h1>{lesson.chapter} · {lesson.title}</h1>
        <p>{lesson.objective}</p>
      </header>
      <WorkbookTabNav activeTab={activeTab} onChange={setActiveTab}
        tabs={tabs} ariaLabel="Kiswahili Day 5 workbook sections" renderLegacyGrammarPanel={false} />
      <section className="swahili-book__card swahili-book__activity" role="tabpanel" tabIndex={-1}>
        {activeTab === "references" && <DayFiveMusic />}
        {activeTab === "grammar" && <>
          <h2>Sarufi · Grammar</h2>
          <p>Use <strong>ni-na-</strong> for “I” in the present tense and <strong>a-na-</strong> for “he/she”.</p>
          <p><strong>Ninaamka mapema.</strong> I wake up early. <strong>Anaenda shuleni.</strong> He or she goes to school.</p>
          {lesson.aiLecture ? <a href={lesson.aiLecture}>Watch AI lecture</a> : <p>The video lecture will appear here after upload.</p>}
        </>}
        {activity && <><h2>{activity[0]}</h2><p>{activity[1]}</p></>}
      </section>
      <SwahiliWorkbookNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
    </main>
  );
}
