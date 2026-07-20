import React, { useEffect, useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import RouteSpeakingMindMap from "./RouteSpeakingMindMap";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1600&q=80";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
];

const card = { ...styles.card, display: "grid", gap: 12 };
const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listSpacing = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };
const questionCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 8,
};
const tabImageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 260,
  objectFit: "cover",
};

const readingParagraphs = [
  "Ehrenamtliches Engagement ist für viele Gemeinden unverzichtbar. Freiwillige begleiten ältere Menschen, trainieren Jugendmannschaften, unterstützen Geflüchtete oder organisieren kulturelle Veranstaltungen. Dadurch entstehen Begegnungsräume, in denen Vertrauen, Zugehörigkeit und demokratische Beteiligung wachsen können.",
  "Gleichzeitig darf der gesellschaftliche Nutzen des Ehrenamts nicht darüber hinwegtäuschen, dass freiwillige Arbeit verlässliche öffentliche Strukturen nur ergänzen kann. Werden soziale Aufgaben dauerhaft an unbezahlte Helferinnen und Helfer übertragen, besteht die Gefahr, dass staatliche Verantwortung schleichend zurückgenommen wird. Professionelle Dienstleistungen müssen deshalb dort gesichert bleiben, wo Fachwissen, Kontinuität und rechtliche Verantwortung erforderlich sind.",
  "Eine weitere Herausforderung besteht darin, dass nicht alle Menschen unter denselben Bedingungen teilnehmen können. Schichtarbeit, Betreuungspflichten, Fahrtkosten und komplizierte Vereinsstrukturen erschweren den Zugang. Organisationen, die neue Freiwillige gewinnen möchten, sollten daher flexible Einsatzzeiten, kurze Einstiegsprojekte, Fortbildungen, Versicherungsschutz und die Erstattung notwendiger Ausgaben anbieten. Anerkennung ist ebenfalls wichtig, sie sollte sich jedoch nicht auf symbolische Urkunden beschränken, sondern in einer respektvollen Zusammenarbeit und klaren Aufgabenverteilung sichtbar werden.",
  "Langfristig erfolgreich ist Ehrenamt somit weder durch moralischen Druck noch durch kurzfristige Kampagnen. Entscheidend sind niedrigschwellige Angebote, gute Begleitung und politische Rahmenbedingungen, die freiwilliges Engagement ermöglichen, ohne es als kostenlosen Ersatz für öffentliche Leistungen zu behandeln.",
];

const listeningText =
  "In einem Stadtteilzentrum berichtet die Koordinatorin Mara von ihren Erfahrungen mit freiwilligem Engagement. Früher hätten sich zwar viele Interessierte gemeldet, doch nur wenige seien länger geblieben. Die Aufgaben seien häufig unklar gewesen, und Menschen mit wechselnden Arbeitszeiten hätten kaum passende Einsatzmöglichkeiten gefunden. Daraufhin habe das Zentrum kurze Projekte, einen digitalen Dienstplan und ein Mentoring für neue Freiwillige eingeführt. Außerdem würden Fahrtkosten erstattet und regelmäßige Fortbildungen angeboten. Seitdem sei die Beteiligung gestiegen. Mara betont jedoch, Ehrenamtliche dürften nicht Aufgaben übernehmen, für die dauerhaft ausgebildetes Personal nötig sei. Freiwilliges Engagement funktioniere besonders gut, wenn Verantwortlichkeiten transparent seien, Rückmeldungen ernst genommen würden und Helfende ihre zeitlichen Grenzen offen angeben könnten.";

const readingQuestions = [
  {
    stem: "Welche Hauptaussage vertritt der Text?",
    options: [
      "A) Ehrenamt kann öffentliche Dienstleistungen vollständig ersetzen.",
      "B) Ehrenamt ist gesellschaftlich wertvoll, braucht aber verlässliche Rahmenbedingungen.",
      "C) Freiwilliges Engagement sollte ausschließlich von jungen Menschen übernommen werden.",
      "D) Symbolische Auszeichnungen sind die wichtigste Form der Unterstützung.",
    ],
  },
  {
    stem: "Welches Risiko wird im zweiten Absatz beschrieben?",
    options: [
      "A) Vereine könnten zu viele Fortbildungen anbieten.",
      "B) Freiwillige könnten ausschließlich kulturelle Aufgaben wählen.",
      "C) Staatliche Verantwortung könnte auf unbezahlte Helfende verlagert werden.",
      "D) Gemeinden könnten professionelle Stellen zu schnell ausbauen.",
    ],
  },
  {
    stem: "Warum können sich nicht alle Menschen gleichermaßen engagieren?",
    options: [
      "A) Weil gesetzlich nur Vollzeitbeschäftigte zugelassen sind.",
      "B) Weil Zeit, Betreuungspflichten, Kosten und komplizierte Strukturen Hindernisse darstellen.",
      "C) Weil Vereine grundsätzlich keine neuen Mitglieder aufnehmen.",
      "D) Weil freiwillige Arbeit immer eine berufliche Ausbildung voraussetzt.",
    ],
  },
  {
    stem: "Welche Maßnahme entspricht den Empfehlungen des Textes?",
    options: [
      "A) Flexible Einsatzzeiten und niedrigschwellige Einstiegsangebote schaffen.",
      "B) Ehrenamtliche zu langfristigen Einsätzen verpflichten.",
      "C) Öffentliche Finanzierung vollständig beenden.",
      "D) Aufgaben ohne Begleitung und Rückmeldung verteilen.",
    ],
  },
];

const listeningQuestions = [
  {
    stem: "Warum blieben früher nur wenige Interessierte langfristig im Stadtteilzentrum?",
    options: [
      "A) Die Aufgaben waren unklar und die Einsatzzeiten zu unflexibel.",
      "B) Das Zentrum nahm ausschließlich Fachkräfte auf.",
      "C) Die Freiwilligen mussten ihre Fahrtkosten nicht selbst bezahlen.",
      "D) Es gab zu viele Mentoren für neue Mitglieder.",
    ],
  },
  {
    stem: "Welche Veränderung wurde eingeführt?",
    options: [
      "A) Eine verpflichtende Vollzeittätigkeit.",
      "B) Ein digitaler Dienstplan und kurze Projekte.",
      "C) Die Abschaffung aller Fortbildungen.",
      "D) Eine Begrenzung auf einen einzigen Einsatzbereich.",
    ],
  },
  {
    stem: "Welche Grenze des Ehrenamts nennt Mara?",
    options: [
      "A) Freiwillige sollten keine digitalen Werkzeuge verwenden.",
      "B) Ehrenamtliche dürften nur am Wochenende arbeiten.",
      "C) Dauerhafte Fachaufgaben sollten nicht auf Freiwillige übertragen werden.",
      "D) Freiwillige sollten keine Rückmeldung geben.",
    ],
  },
  {
    stem: "Unter welcher Bedingung funktioniert Engagement laut Mara besonders gut?",
    options: [
      "A) Wenn zeitliche Grenzen verschwiegen werden.",
      "B) Wenn Verantwortlichkeiten klar sind und Rückmeldungen ernst genommen werden.",
      "C) Wenn alle Aufgaben spontan verteilt werden.",
      "D) Wenn Anerkennung ausschließlich durch Urkunden erfolgt.",
    ],
  },
];

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.secondaryButton,
        borderColor: active ? "#2563eb" : "#d1d5db",
        background: active ? "#eff6ff" : "#fff",
        color: active ? "#1d4ed8" : "#111827",
      }}
    >
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

function QuestionList({ questions, namePrefix }) {
  return questions.map((question, index) => (
    <div key={question.stem} style={questionCardStyle}>
      <strong>
        {index + 1}. {question.stem}
      </strong>
      {question.options.map((option) => (
        <label key={option} style={{ display: "block" }}>
          <input type="radio" name={`${namePrefix}-${index}`} /> {option}
        </label>
      ))}
    </div>
  ));
}

const C1Day11EngagementUndEhrenamtWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });
  const [isSpeaking, setIsSpeaking] = useState(false);

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);
  const setPreparedFor = (tabKey) => (event) =>
    setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  useEffect(
    () => () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    },
    [],
  );

  const playListeningText = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(listeningText);
    utterance.lang = "de-DE";
    utterance.rate = 0.88;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopListeningText = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <img
          src={HERO_IMAGE}
          alt="Volunteers taking part in a community project"
          loading="lazy"
          style={tabImageStyle}
        />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          C1 · Day 11 Workbook · Engagement und Ehrenamt
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter: 3.1</p>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          4-part workbook with speaking, writing, reading and listening activities.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              active={tab.key === activeTab}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </TabButton>
          ))}
        </div>

        <p style={{ margin: 0, color: "#4b5563" }}>
          Tab {activeIndex + 1} of {tabs.length}
        </p>
      </div>

      {activeTab === "sprechen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80"
            alt="Volunteers planning a social initiative"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Self-Practice</h2>
          <RouteSpeakingMindMap />
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Thema:{" "}
            <strong>
              Warum ist ehrenamtliches Engagement für eine Gesellschaft wichtig, und wie kann man mehr
              Menschen langfristig dazu motivieren?
            </strong>
          </p>
          <h3 style={sectionTitle}>Punkte für deine Antwort</h3>
          <ul style={listSpacing}>
            <li>gesellschaftlicher Zusammenhalt und demokratische Teilhabe</li>
            <li>persönliche Motive und Vorteile für Engagierte</li>
            <li>Zeitmangel, Bürokratie, Kosten und fehlende Anerkennung</li>
            <li>Grenzen freiwilliger Arbeit und staatliche Verantwortung</li>
            <li>flexible Angebote, Fortbildungen und verlässliche Finanzierung</li>
          </ul>
          <h3 style={sectionTitle}>C1-Aufbau</h3>
          <ol style={listSpacing}>
            <li>Formuliere eine klare Position.</li>
            <li>Begründe sie mit mindestens zwei Argumenten und einem Beispiel.</li>
            <li>Berücksichtige eine Gegenposition.</li>
            <li>Entwickle einen realistischen Lösungsvorschlag.</li>
          </ol>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Speaking self-practice confidence check</strong>
            <p style={{ margin: 0 }}>Use the speech trainer to practise before marking this part as prepared.</p>
            <a href="https://www.falowen.app/campus/speech" target="_blank" rel="noreferrer">
              Open speaking self-practice
            </a>
          </div>

          <SpeakingPracticeTimerCard />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Learner preparing a C1 discussion text"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) · Exercise</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>C1 writing task:</strong> Verfassen Sie einen Diskussionsbeitrag mit 200–240 Wörtern
            zum Thema „Engagement und Ehrenamt: Warum werden freiwillige Tätigkeiten für unsere Gesellschaft
            immer wichtiger?“
          </p>
          <p style={{ margin: 0 }}>Gehen Sie auf folgende Punkte ein:</p>
          <ol style={listSpacing}>
            <li>Erklären Sie die gesellschaftliche Bedeutung des Ehrenamts.</li>
            <li>Beschreiben Sie Vorteile für Engagierte und Gemeinschaft.</li>
            <li>Analysieren Sie zentrale Hindernisse und geben Sie eine fremde Position sachlich wieder.</li>
            <li>Diskutieren Sie den Einwand, staatliche Aufgaben könnten auf Freiwillige verlagert werden.</li>
            <li>Entwickeln Sie konkrete und realistische Fördermaßnahmen.</li>
          </ol>
          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Sprachliche Checkliste</strong>
            <ul style={listSpacing}>
              <li>Nutze passende additive, kausale, kontrastive und finale Konnektoren.</li>
              <li>Verknüpfe jeden Hauptgedanken mit einer Begründung oder einem Beispiel.</li>
              <li>Formuliere Einwand und Schlussfolgerung klar und sachlich.</li>
              <li>Prüfe Wortstellung, Register und Absatzstruktur.</li>
            </ul>
          </div>
          <p style={{ margin: 0 }}>
            Practice your draft before submission on the writing page:{" "}
            <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">
              Open Writing Practice
            </a>
          </p>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit the revised final text in the normal assignment submission area.
          </p>
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80"
            alt="Person reading about volunteer engagement"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen)</h2>
          <p style={{ margin: 0 }}>
            <strong>Lies den Text zuerst vollständig. Beantworte danach die vier Fragen.</strong>
          </p>
          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <h3 style={{ ...sectionTitle, fontSize: "1.05rem" }}>
              Ehrenamt zwischen Gemeinsinn und struktureller Verantwortung
            </h3>
            {readingParagraphs.map((paragraph) => (
              <p key={paragraph} style={{ margin: 0, lineHeight: 1.75 }}>
                {paragraph}
              </p>
            ))}
          </div>

          <h3 style={sectionTitle}>Leseverstehen</h3>
          <QuestionList questions={readingQuestions} namePrefix="lesen" />

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Optionale Vertiefung</strong>
            <a
              href="https://www.bpb.de/themen/deutschlandarchiv/315014/ehrenamt-in-deutschland-viele-engagieren-sich-aber-nicht-alle-gleich/"
              target="_blank"
              rel="noreferrer"
            >
              bpb: Ehrenamt in Deutschland
            </a>
          </div>
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80"
            alt="Person listening to a report about volunteering"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören)</h2>
          <p style={{ margin: 0 }}>
            Höre den Beitrag möglichst zweimal. Beantworte die Fragen zunächst ohne den Hörtext zu lesen.
          </p>
          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Hörtext abspielen</strong>
            <p style={{ margin: 0, color: "#4b5563" }}>
              The browser reads the German listening text aloud. On unsupported devices, use the transcript below.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button
                type="button"
                style={styles.primaryButton}
                onClick={playListeningText}
                disabled={isSpeaking}
              >
                {isSpeaking ? "Audio läuft …" : "Hörtext starten"}
              </button>
              <button type="button" style={styles.secondaryButton} onClick={stopListeningText}>
                Stoppen
              </button>
            </div>
          </div>

          <h3 style={sectionTitle}>Hörverstehen</h3>
          <QuestionList questions={listeningQuestions} namePrefix="hoeren" />

          <details style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <summary style={{ cursor: "pointer", fontWeight: 700 }}>Hörtext nach der Übung anzeigen</summary>
            <p style={{ margin: 0, lineHeight: 1.75 }}>{listeningText}</p>
          </details>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Optionale Vertiefung</strong>
            <a href="https://www.ndr.de/nachrichten/info/podcast4684.html" target="_blank" rel="noreferrer">
              NDR Info: Beiträge zum Ehrenamt
            </a>
          </div>
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default C1Day11EngagementUndEhrenamtWorkbookPage;
