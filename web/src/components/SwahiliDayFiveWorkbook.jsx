import React from "react";
import WorkbookDayMusic from "./WorkbookDayMusic";
import { Link } from "react-router-dom";
import { SWAHILI_DAY_FIVE as lesson } from "../data/swahili/dayFive";
import { A2_B1_WORKBOOK_TABS_WITH_GRAMMAR as tabs, WorkbookTabNav } from "./StandardWorkbookComponents";
import { useSwahiliWorkbookTab, SwahiliWorkbookNavigation } from "./SwahiliWorkbookNavigation";
import "./SwahiliCourseBook.css";

const practice = {
  sprechen: ["Kuzungumza · Speaking", "Ask a partner: Una ndugu wangapi? (How many siblings do you have?)"],
  schreiben: ["Kuandika · Writing", "Introduce three members of your family. Give each person’s name and say what one person does or likes to do."],
  lesen: ["Kusoma · Reading", "Huyu ni Asha. Ana kaka mmoja na dada wawili. Kaka yake anaitwa Juma. Answer: Asha ana dada wangapi? Kaka yake anaitwa nani?"],
  hoeren: ["Kusikiliza · Listening", "Listen to the song in Music. Which family members do you hear? Listen again and write down one name and one job."],
  submit: ["Wasilisha · Submit", "The assignment will appear here when your tutor publishes it."],
};

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
        {activeTab === "references" && <WorkbookDayMusic level="A1" day={lesson.day} program="swahili" compact />}
        {activeTab === "grammar" && <>
          <h2>Sarufi · Grammar</h2>
          <p>Use <strong>huyu ni</strong> to introduce a person and <strong>nina</strong> to say what you have.</p>
          <p><strong>Huyu ni mama yangu.</strong> This is my mother. <strong>Nina kaka mmoja.</strong> I have one brother.</p>
          <h3>Msamiati · Family words</h3>
          <ul><li>mama · mother</li><li>baba · father</li><li>kaka · brother</li><li>dada · sister</li><li>wazazi · parents</li></ul>
          <h3>Maswali · Questions</h3>
          <p><strong>Huyu ni nani?</strong> Who is this? <strong>Anaitwa nani?</strong> What is their name?</p>
          <p><strong>Anafanya kazi gani?</strong> What do they do for work?</p>
          {lesson.aiLecture ? <a href={lesson.aiLecture}>Watch AI lecture</a> : <p>The video lecture will appear here after upload.</p>}
        </>}
        {activity && <><h2>{activity[0]}</h2><p>{activity[1]}</p></>}
      </section>
      <SwahiliWorkbookNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
    </main>
  );
}
