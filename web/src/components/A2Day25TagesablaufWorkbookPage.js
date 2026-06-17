import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen (Group Practice No assignment)" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Lesen" },
  { key: "references", label: "5. Ref" },
];

const card = { ...styles.card, display: "grid", gap: 12 };
const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listSpacing = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };
const questionCardStyle = { border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#fff", display: "grid", gap: 6 };
const calloutStyle = { ...questionCardStyle, background: "#f8fafc" };

const phraseGridStyle = { display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" };

const lesenQuestions = [
  { stem: "Wann steht Anna auf?", options: ["a) kurz vor 7 Uhr", "b) nie vor 7 Uhr", "c) immer nach 7 Uhr", "d) kurz nach 7 Uhr"] },
  { stem: "Was isst Anna zum Frühstück?", options: ["a) Cornflakes und Toast mit Butter", "b) nichts", "c) Brot mit Käse oder Wurst", "d) Müsli oder Toast mit Marmelade"] },
  { stem: "Was macht sie nicht morgens, bevor sie zur Schule geht?", options: ["a) zur Toilette gehen", "b) Hausaufgaben", "c) das Bett machen", "d) duschen"] },
  { stem: "Wann kommt sie nach Hause?", options: ["a) am Nachmittag", "b) nachdem sie die Hausaufgaben gemacht hat", "c) nach dem Abendessen", "d) kurz vor dem Abendessen"] },
  { stem: "Was macht sie nach den Hausaufgaben?", options: ["a) schlafen", "b) Freunde treffen", "c) Sport", "d) lernen"] },
];

const teil4Questions = [
  { stem: "Welches Reiseziel wählt Familie Meyer in diesem Jahr?", options: ["a) Österreich", "b) Deutschland", "c) die Schweiz", "d) Italien"] },
  { stem: "Womit fährt Familie Meyer in den Urlaub?", options: ["a) mit dem Taxi", "b) mit dem Bus", "c) mit dem Auto", "d) mit dem Zug"] },
  { stem: "Wo steigen Herr und Frau Meyer aus dem Zug?", options: ["a) an einem kleinen Bahnhof", "b) an einem großen Hotel", "c) am Flughafen", "d) an einer kleinen Raststätte"] },
  { stem: "Was erhalten sie an der Rezeption des Hotels?", options: ["a) einen schönen Blumenstrauß", "b) eine Fahrkarte", "c) einen Brief", "d) einen Zimmerschlüssel"] },
  { stem: "Warum ist Herr Meyer unzufrieden?", options: ["a) es gibt kein freies Zimmer", "b) das Zimmer ist zu klein", "c) das Zimmer ist zu groß", "d) das Hotel ist zu klein"] },
];

function TabButton({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{ ...styles.secondaryButton, borderColor: active ? "#2563eb" : "#d1d5db", background: active ? "#eff6ff" : "#fff", color: active ? "#1d4ed8" : "#111827" }}>
      {children}
    </button>
  );
}

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

export default function A2Day25TagesablaufWorkbookPage() {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);
  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return <div style={{ ...styles.container, display: "grid", gap: 16 }}>
    <div style={card}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 25 Workbook · Tagesablauf 9.25</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>4-part workbook: speaking, writing, reading, and listening practice about daily routines.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{tabs.map((tab) => <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>{tab.label}</TabButton>)}</div>
      <p style={{ margin: 0, color: "#4b5563" }}>Tab {activeIndex + 1} of {tabs.length}</p>
    </div>

    <A2B1WorkbookGuidance />

    {activeTab === "sprechen" && <div style={card}><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80" alt="Students discussing their day in class" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
      <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>In this chapter, we&apos;ll engage in group exercises discussing these topics.</p>
      <h3 style={{ ...sectionTitle, fontSize: "1rem" }}>Instructions</h3>
      <ol style={listSpacing}>
        <li><strong>Central Topic:</strong> Write <strong>„Tagesablauf“</strong> in the center of your brain map.</li>
        <li><strong>Main Branches:</strong> Create six main branches:
          <ul style={listSpacing}>
            <li>Morgenroutine (Morning Routine)</li>
            <li>Arbeit/Schule (Work/School)</li>
            <li>Mittagspause (Lunch Break)</li>
            <li>Nachmittag (Afternoon)</li>
            <li>Abendroutine (Evening Routine)</li>
            <li>Freizeit und Hobbys (Free Time and Hobbies)</li>
          </ul>
        </li>
        <li><strong>Sub-Branches:</strong> Expand each branch with examples and phrases.</li>
      </ol>
      <h3 style={{ ...sectionTitle, fontSize: "1rem" }}>Example Brain Map</h3>
      <ol style={listSpacing}>
        <li><strong>Morgenroutine (Morning Routine)</strong>
          <ul style={listSpacing}><li>Aufstehen (getting up)</li><li>Zähne putzen (brushing teeth)</li><li>Duschen (showering)</li><li>Frühstücken (having breakfast)</li><li>Anziehen (getting dressed)</li><li>Zur Arbeit oder zur Schule gehen (going to work or school)</li></ul>
        </li>
        <li><strong>Arbeit/Schule (Work/School)</strong>
          <ul style={listSpacing}><li>Arbeiten (working)</li><li>E-Mails schreiben (writing emails)</li><li>An Meetings teilnehmen (attending meetings)</li><li>Unterricht haben (having lessons)</li><li>Hausaufgaben machen (doing homework)</li><li>Pause machen (taking a break)</li></ul>
        </li>
        <li><strong>Mittagspause (Lunch Break)</strong>
          <ul style={listSpacing}><li>Mittagessen essen (eating lunch)</li><li>Mit Kollegen oder Freunden sprechen (talking with colleagues or friends)</li><li>Einkaufen gehen (going shopping)</li><li>Spazieren gehen (taking a walk)</li></ul>
        </li>
        <li><strong>Nachmittag (Afternoon)</strong>
          <ul style={listSpacing}><li>Weiterarbeiten (continuing work)</li><li>Sport treiben (doing sports)</li><li>Termine haben (having appointments)</li><li>Kaffee trinken (having coffee)</li></ul>
        </li>
        <li><strong>Abendroutine (Evening Routine)</strong>
          <ul style={listSpacing}><li>Abendessen kochen (cooking dinner)</li><li>Nachrichten schauen (watching the news)</li><li>Entspannen (relaxing)</li><li>Duschen oder baden (taking a shower or bath)</li><li>Ins Bett gehen (going to bed)</li></ul>
        </li>
        <li><strong>Freizeit und Hobbys (Free Time and Hobbies)</strong>
          <ul style={listSpacing}><li>Bücher lesen (reading books)</li><li>Musik hören (listening to music)</li><li>Filme oder Serien schauen (watching movies or series)</li><li>Spazieren gehen (going for a walk)</li><li>Freunde treffen (meeting friends)</li><li>Ein Instrument spielen (playing an instrument)</li></ul>
        </li>
      </ol>
      <h3 style={{ ...sectionTitle, fontSize: "1rem" }}>Topic for Discussion</h3>
      <p style={{ margin: 0 }}>Wie sieht dein Tagesablauf aus?</p>
      <p style={{ margin: 0 }}><strong>Keywords:</strong> aufstehen, arbeiten/lernen, essen, Freizeit</p>

      <h3 style={sectionTitle}>Sprechen wie bei einer Mini-Präsentation</h3>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Nutze diese einfache Struktur: <strong>Einleitung → Hauptteil mit Verbindungswörtern → Beispiel → Schluss</strong>.
        So wird aus kurzen Wörtern eine klare Antwort mit guten Sätzen.
      </p>
      <div style={{ ...questionCardStyle, background: "#ecfeff" }}>
        <strong>Schnelle Struktur für 30–45 Sekunden</strong>
        <ol style={listSpacing}>
          <li><strong>Einleitung:</strong> Thema nennen und einen ersten Satz sagen.</li>
          <li><strong>Hauptteil:</strong> zwei oder drei Punkte mit einfachen Connectors verbinden.</li>
          <li><strong>Beispiel:</strong> ein kurzes Beispiel aus deinem Leben geben.</li>
          <li><strong>Schluss:</strong> deine Meinung kurz zusammenfassen.</li>
        </ol>
      </div>
      <div style={phraseGridStyle}>
        <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
          <strong>Gute Einleitungen</strong>
          <ul style={listSpacing}>
            <li>„Heute spreche ich über …“</li>
            <li>„Ich möchte kurz etwas über … sagen.“</li>
            <li>„Mein Thema ist …“</li>
          </ul>
        </div>
        <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
          <strong>Verbindungswörter / Connectors</strong>
          <ul style={listSpacing}>
            <li><strong>und</strong> · „Ich lerne Deutsch und ich übe jeden Tag.“</li>
            <li><strong>oder</strong> · „Ich mache Sport oder ich treffe Freunde.“</li>
            <li><strong>weil</strong> · „Das ist gut, weil es einfach ist.“</li>
            <li><strong>deshalb</strong> · „Ich habe wenig Zeit, deshalb plane ich gut.“</li>
          </ul>
        </div>
        <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
          <strong>Eigene Meinung ausdrücken</strong>
          <ul style={listSpacing}>
            <li>„Ich finde … gut, weil …“</li>
            <li>„Für mich ist … wichtig.“</li>
            <li>„Meiner Meinung nach ist … praktisch.“</li>
          </ul>
        </div>
        <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
          <strong>Gute Schlüsse</strong>
          <ul style={listSpacing}>
            <li>„Zum Schluss kann ich sagen: …“</li>
            <li>„Deshalb finde ich … gut.“</li>
            <li>„Das ist meine Meinung. Danke fürs Zuhören.“</li>
          </ul>
        </div>
      </div>

      <SpeakingPracticeTimerCard />

      <div style={{ ...questionCardStyle, background: "#ecfeff" }}>
        <strong>Modellantwort (ca. 30–45 Sekunden)</strong>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          „Heute spreche ich über meinen Tagesablauf. Zuerst stehe ich um sieben Uhr auf und frühstücke. Dann gehe ich zur Arbeit oder zum Deutschkurs, weil ich lernen und arbeiten muss. Am Nachmittag mache ich Hausaufgaben und kaufe ein. Am Abend koche ich, sehe eine Serie oder telefoniere mit meiner Familie. Zum Schluss finde ich: Ein klarer Tagesablauf hilft mir, weil ich weniger Stress habe.“
        </p>
      </div>
      <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for group practice only and has no assignment submission.</p>
            <CourseInlinePracticePanel
        type="speaking"
      />
      <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
    </div>}

    {activeTab === "schreiben" && <div style={card}><img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80" alt="Learner writing about a daily schedule" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
      <h2 style={sectionTitle}>Teil 2 · Schreiben</h2>
      <p style={{ margin: 0 }}>Schreibe eine E-Mail an deine Freundin oder deinen Freund über deinen Tagesablauf.</p>
      <ol style={listSpacing}><li>Beschreibe deinen Morgen und deinen Arbeits- oder Schultag.</li><li>Erzähle, was du am Abend machst.</li><li>Frage nach dem Tagesablauf deiner Freundin oder deines Freundes.</li></ol>
      <div style={calloutStyle}><strong>Writing practice guidance</strong><p style={{ margin: 0 }}>Write a first draft, improve structure and connectors, and submit your final answer in the assignment submission area — not directly on this page.</p></div>
            <CourseInlinePracticePanel
        type="writing"
      />
      <WorkbookSubmissionReminder />
      <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
    </div>}

    {activeTab === "lesen" && <div style={card}><img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80" alt="Reading comprehension exercise on a desk" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
      <h2 style={sectionTitle}>Teil 3 · Lesen</h2><p style={{ margin: 0 }}>Lies den Text und beantworte die Fragen im Submission-Bereich.</p>
      <p style={{ margin: 0, lineHeight: 1.7 }}>Ich bin Anna, 16 Jahre alt und Schülerin. Morgens stehe ich kurz vor 7 Uhr auf. Aufwachen kann ich nicht von allein. Ein Wecker klingelt mich aus dem Schlaf. Ich stehe auf und muss als Erstes meistens auf die Toilette gehen. Danach wasche ich mir das Gesicht und dusche – zuerst ganz warm und am Schluss mit kaltem Wasser. So werde ich richtig wach. Zähne putzen muss auch sein, anschließend ziehe ich mich an. Meine Kleider habe ich mir schon am Abend davor zurechtgelegt, damit ich morgens keine Zeit verliere. So kann ich ein bisschen später aufstehen.</p>
      <p style={{ margin: 0, lineHeight: 1.7 }}>Das Frühstück lasse ich nie aus, weil ich am Morgen Hunger habe. Meistens esse ich Müsli oder Toast mit Marmelade. Dazu trinke ich Tee oder Kaffee. Bevor ich in die Schule gehe, muss ich noch mein Bett machen. Das dauert aber selten länger als eine oder zwei Minuten. Dann renne ich schon los, um meinen Schulbus zu erreichen.</p>
      <p style={{ margin: 0, lineHeight: 1.7 }}>Nach der Schule esse ich zu Mittag und komme am Nachmittag nach Hause. Dann muss ich meistens noch Hausaufgaben machen. Vor dem Abendessen habe ich noch Zeit, um zu spielen oder Freunde zu treffen. Dann essen wir gemeinsam zu Abend. Bevor ich ins Bett gehe, schaue ich ein bisschen fern. Danach gehe ich schlafen und schlafe von 22 Uhr bis morgens um 7.</p>
      {lesenQuestions.map((q, i) => <div key={q.stem} style={questionCardStyle}><strong>{i + 1}. {q.stem}</strong>{q.options.map((opt) => <span key={opt}>{opt}</span>)}</div>)}
      <WorkbookSubmissionReminder />
      <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
    </div>}

    {activeTab === "hoeren" && <div style={card}><img src="https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=1600&q=80" alt="Reading travel text in a workbook" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
      <h2 style={sectionTitle}>Teil 4 · Lesen</h2>
      <p style={{ margin: 0 }}>Lies den Text und beantworte die Fragen im Submission-Bereich.</p>
      <p style={{ margin: 0, lineHeight: 1.7 }}>Herr und Frau Meyer fahren oft in die Berge. Berge gibt es in Deutschland, Österreich, Italien und der Schweiz. Ihr Reiseziel ist in diesem Jahr die Schweiz. Dort kann man viel wandern. In einem Berghotel haben sie ein Zimmer gebucht.</p>
      <p style={{ margin: 0, lineHeight: 1.7 }}>&quot;Wie wollen wir hinfahren? Mit dem Auto oder mit dem Zug&quot;, fragt Herr Meyer seine Frau. &quot;Ein Flugzeug kommt ja nicht in Frage. Dort ist kein Flughafen.&quot; &quot;Mit dem Auto ist es sehr bequem&quot;, antwortet Frau Meyer. &quot;Aber es gibt auf der Autobahn sicher einen langen Stau. Dann wird die Anreise sehr anstrengend. Ich denke, wir sollten den Zug nehmen.&quot;</p>
      <p style={{ margin: 0, lineHeight: 1.7 }}>Eine Woche später steigen Herr und Frau Meyer an einem kleinen Bahnhof in der Schweiz aus dem Zug. Ein Taxi wartet bereits und bringt das Ehepaar zum Berghotel. An der Rezeption werden ihnen die Zimmerschlüssel überreicht. Ein Bediensteter zeigt dem Ehepaar Meyer ihr Zimmer. Darin befindet sich ein Doppelbett und ein Schrank.</p>
      <p style={{ margin: 0, lineHeight: 1.7 }}>Herr Meyer ist unzufrieden mit dem Hotelzimmer. Es ist viel zu klein. &quot;Wir haben ein großes Zimmer gebucht. Dieser Raum gefällt uns nicht. Wir möchten ein anderes Zimmer haben.&quot; Durch seine Beschwerde erhält das Ehepaar sofort ein anderes Zimmer. Herr und Frau Meyer freuen sich. Sie haben ein großes Zimmer mit einem schönen Ausblick auf die schneebedeckten Berge.</p>
      {teil4Questions.map((q, i) => <div key={q.stem} style={questionCardStyle}><strong>{i + 1}. {q.stem}</strong>{q.options.map((opt) => <span key={opt}>{opt}</span>)}</div>)}
      <WorkbookSubmissionReminder />
      <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
    </div>}
  </div>;
}
