import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import { styles } from "../styles";

const AUDIO_FILE_ID = "1zLP6fMwvZNYaw_Vb0sHTMhy8-2GeRNca";

const tabs = [
  { key: "sprechen", label: "Teil 1" },
  { key: "schreiben", label: "Teil 2" },
  { key: "lesen", label: "Teil 3" },
  { key: "hoeren", label: "Teil 4" },
  { key: "references", label: "5. Ref" },
  { key: "submit", label: "6. Submit" },
];

const card = { ...styles.card, display: "grid", gap: 14 };
const sectionTitle = { margin: 0, fontSize: "1.15rem" };
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const questionCard = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 13,
  background: "#fff",
  display: "grid",
  gap: 7,
};

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: { border: "#bfdbfe", background: "#eff6ff", color: "#1e3a8a" },
    green: { border: "#bbf7d0", background: "#f0fdf4", color: "#166534" },
    amber: { border: "#fde68a", background: "#fffbeb", color: "#92400e" },
  };
  const selected = tones[tone] || tones.blue;
  return (
    <div style={{ border: `1px solid ${selected.border}`, background: selected.background, color: selected.color, borderRadius: 13, padding: 13, lineHeight: 1.7 }}>
      {children}
    </div>
  );
};

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

const cityAdvantages = [
  "Viele Arbeitsmöglichkeiten – viele Jobs und Karrierechancen",
  "Gute Infrastruktur – öffentliche Verkehrsmittel, Straßen und Geschäfte",
  "Mehr Freizeitangebote – Kinos, Theater, Restaurants und Museen",
  "Bessere Bildungseinrichtungen – Universitäten, Schulen und Sprachkurse",
  "Gute medizinische Versorgung – viele Ärzte, Krankenhäuser und Spezialisten",
];

const cityDisadvantages = [
  "Lärm und Hektik – hoher Geräuschpegel und stressiger Alltag",
  "Hohe Mieten und teure Lebenshaltungskosten",
  "Umweltverschmutzung – verschmutzte Luft und wenig Grünflächen",
  "Wenig Platz – kleine Wohnungen und viele Menschen auf engem Raum",
  "Verkehr und Staus – lange Fahrzeiten und überfüllte Verkehrsmittel",
];

const countryAdvantages = [
  "Ruhe und Natur – frische Luft, viele Grünflächen und weniger Stress",
  "Größere und günstigere Wohnmöglichkeiten – mehr Platz und oft ein eigenes Haus",
  "Bessere Lebensqualität – gesünderes Leben und weniger Hektik",
  "Engere Gemeinschaft – freundliche Nachbarschaft und weniger Anonymität",
  "Sicherer für Familien – weniger Kriminalität und eine ruhige Umgebung",
];

const countryDisadvantages = [
  "Weniger Arbeitsplätze – Pendeln ist oft notwendig",
  "Wenige Freizeitmöglichkeiten – weniger Kinos, Restaurants und Geschäfte",
  "Schlechte Infrastruktur – wenige Busse und lange Wege zu Ärzten und Schulen",
  "Für junge Leute manchmal langweilig – wenige Clubs und Kulturangebote",
  "Abhängigkeit vom Auto – kaum öffentlicher Verkehr und lange Fahrtwege",
];

const readingQuestions = [
  { stem: "1. Welche Wohnart ist besonders bei Familien beliebt?", options: ["A) WG", "B) Einfamilienhaus", "C) Wohnung in einem Mehrfamilienhaus"] },
  { stem: "2. Welche Vorteile hat das Leben in einer Wohnung in einem Mehrfamilienhaus?", options: ["A) Günstiger Preis", "B) Viel Platz", "C) Balance zwischen Privatsphäre und Gemeinschaftsgefühl"] },
  { stem: "3. Warum sind WGs bei jungen Leuten beliebt?", options: ["A) Weil sie viel Privatsphäre bieten", "B) Weil sie günstig sind", "C) Weil man dort alleine wohnt"] },
  { stem: "4. Was ist ein Passivhaus?", options: ["A) Ein Haus, das viel Energie verbraucht", "B) Ein energieeffizientes Haus, oft mit umweltfreundlicher Technik", "C) Ein Haus, das billig gebaut wurde"] },
  { stem: "5. Welche Rolle spielt die Lage einer Wohnung für viele Menschen?", options: ["A) Sie ist unwichtig", "B) Sie spielt eine wichtige Rolle", "C) Sie spielt keine Rolle"] },
  { stem: "6. Was bevorzugen Menschen, die in der Stadt leben?", options: ["A) Mehr Platz", "B) Kurze Wege zu Geschäften und Restaurants", "C) Engere Verbindung zur Natur"] },
  { stem: "7. Welche Wohnart wäre für jemanden mit einem geringen Budget am besten geeignet?", options: ["A) Einfamilienhaus", "B) Wohnung in einem Mehrfamilienhaus", "C) WG"] },
];

const listeningQuestions = [
  { stem: "1. Was ist ein Vorteil des Lebens in einer WG?", options: ["A) Viel Privatsphäre", "B) Gemeinsame Nutzung von Haushaltsgeräten", "C) Keine gemeinsamen Regeln"] },
  { stem: "2. Warum bevorzugen viele Familien Einfamilienhäuser?", options: ["A) Weil sie günstig sind", "B) Wegen der Privatsphäre und des Platzes", "C) Weil sie in der Stadt liegen"] },
  { stem: "3. Was ist eine häufige Wohnform in Städten?", options: ["A) Tiny Houses", "B) Einfamilienhäuser", "C) Wohnungen in Mehrfamilienhäusern"] },
  { stem: "4. Welche Wohnform wird immer beliebter, weil sie umweltfreundlich ist?", options: ["A) WG", "B) Mehrfamilienhäuser", "C) Passivhäuser"] },
  { stem: "5. Was macht das Leben in einem Mehrfamilienhaus attraktiv?", options: ["A) Hohe Kosten", "B) Mischung aus Privatsphäre und sozialer Interaktion", "C) Viel Platz"] },
];

const QuestionList = ({ questions }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {questions.map((question) => (
      <div key={question.stem} style={questionCard}>
        <strong>{question.stem}</strong>
        {question.options.map((option) => <span key={option}>{option}</span>)}
      </div>
    ))}
  </div>
);

const TopicCard = ({ title, advantages, disadvantages }) => (
  <article style={{ ...questionCard, background: "#f8fafc" }}>
    <h3 style={{ margin: 0 }}>{title}</h3>
    <strong>Vorteile</strong>
    <ul style={listStyle}>{advantages.map((item) => <li key={item}>{item}</li>)}</ul>
    <strong>Nachteile</strong>
    <ul style={listStyle}>{disadvantages.map((item) => <li key={item}>{item}</li>)}</ul>
  </article>
);

export default function B1Day6StadtOderLandWorkbookPage() {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });
  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);
  const setPreparedFor = (key) => (event) => setPrepared((old) => ({ ...old, [key]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 6 · Kapitel 2.6</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Leben in der Stadt oder auf dem Land? – Workbook</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Vergleiche Stadt- und Landleben, diskutiere Vor- und Nachteile und formuliere eine klare persönliche Meinung.
        </p>
        <img
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80"
          alt="Stadt und Land als Wohnorte"
          loading="lazy"
          style={{ width: "100%", borderRadius: 14, maxHeight: 290, objectFit: "cover" }}
        />
        <NoteBox>
          <strong>Grammar focus:</strong> Vergleiche mit Komparativ und <em>als</em>, Gründe mit <em>weil/da/denn</em>, Gegensätze mit <em>obwohl/während</em> und Relativsätze zum Thema Wohnen.
        </NoteBox>

        <div
          role="tablist"
          aria-label="B1 Day 6 workbook sections"
          style={{ display: "flex", gap: 8, overflowX: "auto", padding: 8, position: "sticky", top: 8, zIndex: 20, border: "1px solid #bfdbfe", borderRadius: 12, background: "#eff6ff" }}
        >
          {tabs.map((tab) => {
            const selected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(tab.key)}
                style={{ ...styles.secondaryButton, background: selected ? "#2563eb" : "#fff", borderColor: selected ? "#2563eb" : "#93c5fd", color: selected ? "#fff" : "#1d4ed8", fontWeight: 800, flex: "0 0 auto", minWidth: 82 }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <p style={{ margin: 0, color: "#4b5563" }}>Tab {activeIndex + 1} of {tabs.length}</p>
      </div>

      <A2B1WorkbookGuidance />

      {activeTab === "sprechen" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In diesem Kapitel diskutiert ihr die Vorteile und Nachteile des Lebens in der Stadt und auf dem Land.
          </p>
          <NoteBox tone="amber"><strong>Zentrales Thema:</strong> Leben in der Stadt oder auf dem Land?</NoteBox>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            <TopicCard title="1. Leben in der Stadt" advantages={cityAdvantages} disadvantages={cityDisadvantages} />
            <TopicCard title="2. Leben auf dem Land" advantages={countryAdvantages} disadvantages={countryDisadvantages} />
          </div>

          <article style={{ ...questionCard, background: "#eef2ff", borderColor: "#c7d2fe" }}>
            <h3 style={{ margin: 0 }}>3. Persönliche Meinung und Lebensstil</h3>
            <ul style={listStyle}>
              <li>Wo würde ich lieber wohnen: in der Stadt oder auf dem Land?</li>
              <li>Welche Faktoren sind mir wichtig: Arbeit, Freizeit, Natur, Ruhe oder Familie?</li>
              <li>Habe ich schon in beiden Umgebungen gelebt?</li>
              <li>Ist eine Kleinstadt oder der Stadtrand ein guter Kompromiss?</li>
              <li>Wie könnte sich mein Wohnort in Zukunft ändern?</li>
            </ul>
          </article>

          <div style={{ ...questionCard, background: "#f0fdf4", borderColor: "#bbf7d0" }}>
            <strong>Sprechaufgabe: Stadt oder Land – Wo lebt man besser?</strong>
            <ol style={listStyle}>
              <li><strong>Einleitung:</strong> Ich möchte heute über das Thema sprechen: Ist das Leben in der Stadt oder auf dem Land besser?</li>
              <li><strong>Argumente für die Stadt:</strong> Arbeitsmöglichkeiten, Verkehrsmittel, Freizeit und Kultur.</li>
              <li><strong>Argumente für das Land:</strong> Ruhe, saubere Luft und günstigere Wohnungen.</li>
              <li><strong>Eigene Meinung:</strong> Meiner Meinung nach ist das Leben in ... besser, weil ...</li>
              <li><strong>Schluss:</strong> Am Ende hängt es von der Person und ihren Bedürfnissen ab.</li>
            </ol>
          </div>

          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </section>
      ) : null}

      {activeTab === "schreiben" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <div style={{ ...questionCard, background: "#eff6ff", borderColor: "#bfdbfe" }}>
            <strong>Meinungsaufgabe</strong>
            <p style={{ margin: 0, lineHeight: 1.75 }}>
              „Tanja sagt, dass das Leben in der Stadt für sie besser ist, weil dort immer etwas los ist und sie alles schnell erreichen kann. Ich denke anders. Für mich ist das Leben auf dem Land besser, weil es ruhiger ist und ich mehr Kontakt zur Natur habe. Was denken Sie? Leben in der Stadt oder auf dem Land – welches ist Ihrer Meinung nach besser und warum?“
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Schreiben Sie Ihre Meinung zum Thema in ungefähr <strong>80 Wörtern</strong>.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
            <div style={questionCard}>
              <strong>Empfohlene Struktur</strong>
              <ol style={listStyle}>
                <li>Einleitung zum Thema</li>
                <li>Vorteil oder Nachteil der Stadt</li>
                <li>Vorteil oder Nachteil des Landes</li>
                <li>Eigene Meinung mit Begründung</li>
                <li>Kurzer Schluss</li>
              </ol>
            </div>
            <div style={questionCard}>
              <strong>Nützliche Redemittel</strong>
              <ul style={listStyle}>
                <li>Meiner Meinung nach ...</li>
                <li>Einerseits ..., andererseits ...</li>
                <li>Ein wichtiger Vorteil ist, dass ...</li>
                <li>Obwohl ..., finde ich ...</li>
                <li>Zusammenfassend würde ich sagen, dass ...</li>
              </ul>
            </div>
          </div>

          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </section>
      ) : null}

      {activeTab === "lesen" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 3 · Lesen (Exercise)</h2>
          <h3 style={{ margin: 0 }}>Verschiedene Wohnarten in Deutschland</h3>
          <p style={{ margin: 0, lineHeight: 1.75 }}>
            In Deutschland gibt es viele verschiedene Wohnarten, die von Menschen je nach ihren Bedürfnissen und Vorlieben gewählt werden. Besonders beliebt sind Einfamilienhäuser, Wohnungen in Mehrfamilienhäusern und WGs. Jede dieser Wohnformen hat ihre eigenen Vor- und Nachteile.
          </p>
          <p style={{ margin: 0, lineHeight: 1.75 }}>
            Das Einfamilienhaus ist besonders für Familien attraktiv, die viel Platz benötigen und gern einen eigenen Garten haben. Es bietet viel Privatsphäre, ist aber oft teurer als andere Wohnformen. Wohnungen in Mehrfamilienhäusern sind besonders in Städten weit verbreitet. Sie bieten eine gute Balance zwischen Privatsphäre und Gemeinschaftsgefühl, weil man Nachbarn hat, aber trotzdem einen eigenen privaten Bereich besitzt.
          </p>
          <p style={{ margin: 0, lineHeight: 1.75 }}>
            Wohngemeinschaften sind besonders bei jungen Leuten beliebt, die noch in der Ausbildung sind oder gerade ins Berufsleben einsteigen. In einer WG teilt man die Kosten für Miete und Nebenkosten. Das macht diese Wohnform günstig. Allerdings muss man bereit sein, gemeinsame Regeln zu beachten und Kompromisse einzugehen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.75 }}>
            In den letzten Jahren hat nachhaltiges Wohnen an Bedeutung gewonnen. Viele Menschen interessieren sich für ökologische Bauweisen und versuchen, ihren ökologischen Fußabdruck zu verkleinern. Passivhäuser sind sehr energieeffizient, verwenden häufig umweltfreundliche Materialien und können mit Solaranlagen ausgestattet sein.
          </p>
          <p style={{ margin: 0, lineHeight: 1.75 }}>
            Für viele Menschen spielt die Lage der Wohnung oder des Hauses eine wichtige Rolle. Manche leben lieber in der Stadt, weil sie dort schnell Geschäfte, Restaurants und kulturelle Einrichtungen erreichen. Andere bevorzugen das ruhigere Leben auf dem Land. Dort hat man oft mehr Platz und eine engere Verbindung zur Natur, muss aber längere Wege zur Arbeit oder in die Stadt akzeptieren.
          </p>

          <h3 style={sectionTitle}>Fragen zum Text</h3>
          <QuestionList questions={readingQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </section>
      ) : null}

      {activeTab === "hoeren" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 4 · Hören (Exercise)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Lesen Sie zuerst die Fragen. Hören Sie den Beitrag anschließend zweimal und wählen Sie die passende Antwort.
          </p>

          <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 12, overflow: "hidden", background: "#111827" }}>
            <iframe
              src={`https://drive.google.com/file/d/${AUDIO_FILE_ID}/preview`}
              title="B1 Day 6 Stadt oder Land Hören"
              allow="autoplay"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            />
          </div>
          <a
            href={`https://drive.google.com/file/d/${AUDIO_FILE_ID}/view?usp=sharing`}
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.linkButton, width: "fit-content" }}
          >
            Open audio in Google Drive
          </a>

          <h3 style={sectionTitle}>Fragen zum Audio</h3>
          <QuestionList questions={listeningQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </section>
      ) : null}

      {activeTab === "references" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Reference answers</h2>
          <NoteBox tone="amber">Nutze die Referenz erst, nachdem du die Aufgaben selbst bearbeitet hast.</NoteBox>

          <div style={questionCard}>
            <strong>Teil 2 · Beispieltext</strong>
            <p style={{ margin: 0, lineHeight: 1.75 }}>
              Meiner Meinung nach ist das Leben am Stadtrand am besten. Einerseits erreicht man die Innenstadt schnell und hat dort viele Arbeits- und Freizeitmöglichkeiten. Andererseits ist es am Stadtrand ruhiger und die Wohnungen sind oft größer. Auf dem Land ist die Natur näher, aber ohne Auto kann der Alltag schwierig sein. In einer Großstadt würde ich wegen des Lärms und der hohen Mieten nicht gern wohnen. Deshalb ist der Stadtrand für mich ein guter Kompromiss.
            </p>
          </div>

          <div style={questionCard}>
            <strong>Teil 3 · Lesen</strong>
            <p style={{ margin: 0 }}>1. B · 2. C · 3. B · 4. B · 5. B · 6. B · 7. C</p>
          </div>

          <div style={questionCard}>
            <strong>Teil 4 · Hören</strong>
            <p style={{ margin: 0 }}>1. B · 2. B · 3. C · 4. C · 5. B</p>
          </div>
        </section>
      ) : null}

      {activeTab === "submit" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Submit workbook answers</h2>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>
            Submit your final Schreiben, Lesen and Hören answers for B1 Day 6.
          </p>
          <div className="b1-day6-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.b1-day6-submission-page > div > section:first-child { display: none !important; }
            .b1-day6-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level: "B1",
                day: 6,
                assignmentKey: "B1-2.6",
                canonicalAssignmentKey: "B1-2.6",
              }}
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}
