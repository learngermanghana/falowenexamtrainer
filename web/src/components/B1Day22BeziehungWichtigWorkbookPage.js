import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen (Group Practice No assignment)" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Lesen" },
];

const speakingBranches = [
  "Kommunikation (Communication)",
  "Vertrauen und Ehrlichkeit (Trust and honesty)",
  "Gemeinsame Interessen (Shared interests)",
  "Respekt und Unterstützung (Respect and support)",
  "Zukunftspläne (Future plans)",
];

const speakingSubBranches = [
  {
    title: "Kommunikation",
    items: [
      "Offen reden können (Being able to speak openly)",
      "Zuhören (Listening)",
      "Probleme gemeinsam lösen (Solving problems together)",
      "Regelmäßiger Austausch (Regular conversations)",
    ],
  },
  {
    title: "Vertrauen und Ehrlichkeit",
    items: [
      "Treue (Loyalty)",
      "Keine Geheimnisse (No secrets)",
      "Ehrliche Meinungen teilen (Sharing honest opinions)",
      "Verlässlichkeit (Reliability)",
    ],
  },
  {
    title: "Gemeinsame Interessen",
    items: [
      "Hobbys teilen (Sharing hobbies)",
      "Gemeinsame Unternehmungen (Doing things together)",
      "Gemeinsamer Humor (Shared sense of humor)",
      "Musik, Filme oder Sport (Music, movies, or sports)",
    ],
  },
  {
    title: "Respekt und Unterstützung",
    items: [
      "Den anderen akzeptieren (Accepting the other person)",
      "Unterstützung im Alltag (Support in daily life)",
      "Verständnis zeigen (Showing understanding)",
      "Keine Kontrolle oder Eifersucht (No control or jealousy)",
    ],
  },
  {
    title: "Zukunftspläne",
    items: [
      "Zusammenleben (Living together)",
      "Familie planen (Planning a family)",
      "Gemeinsame Ziele (Common goals)",
      "Vertrauen in die gemeinsame Zukunft (Trust in a shared future)",
    ],
  },
];

const profileQuestions = [
  "Wie heißen Sie? (Geben Sie einen fiktiven Namen an, den Sie in Ihrem Profil verwenden möchten.)",
  "Wie alt sind Sie? (Wählen Sie ein Alter, das Sie in Ihrem Profil angeben möchten.)",
  "Wo wohnen Sie? (Geben Sie eine Stadt oder Region an, in der Sie leben.)",
  "Welche Hobbys und Interessen haben Sie? (Nennen Sie mindestens drei Hobbys oder Interessen, die Sie in Ihrem Profil erwähnen möchten.)",
  "Was suchen Sie in einer Beziehung? (Beschreiben Sie, was Ihnen in einer Beziehung wichtig ist, z.B. Ehrlichkeit, gemeinsame Interessen, Humor.)",
  "Welche Eigenschaften schätzen Sie an einem Partner? (Nennen Sie mindestens drei Eigenschaften, die Ihnen bei einem potenziellen Partner wichtig sind.)",
  "Was möchten Sie über sich selbst mitteilen? (Schreiben Sie einen kurzen Absatz über Ihre Persönlichkeit oder was Sie einzigartig macht.)",
  "Gibt es etwas, das Ihr idealer Partner unbedingt haben sollte? (Z.B. Vorlieben, Lebensstil oder Werte, die Ihnen wichtig sind.)",
  "Wie würden Sie Ihre Persönlichkeit in drei Worten beschreiben?",
  "Was sind Ihre Lieblingsaktivitäten am Wochenende? (Nennen Sie mindestens zwei Aktivitäten, die Sie gerne in Ihrer Freizeit machen.)",
  "Wie wichtig ist Ihnen die Kommunikation in einer Beziehung? Warum?",
  "Haben Sie Haustiere? Möchten Sie, dass Ihr Partner auch Haustiere hat?",
  "Welche Musik hören Sie gerne? (Nennen Sie ein oder zwei Musikrichtungen oder Lieblingskünstler.)",
  "Wie stehen Sie zu Reisen? (Reisen Sie gerne? Welche Orte möchten Sie besuchen?)",
  "Was sind Ihre Lebensziele oder Träume für die Zukunft? (Nennen Sie mindestens ein Ziel oder einen Traum, den Sie verwirklichen möchten.)",
];

const lesenQuestions = [
  {
    stem: "Wie alt ist der Große Tiergarten?",
    options: ["a) wenige Minuten", "b) wenige Jahre", "c) Das steht nicht im Text.", "d) 500 Jahre"],
  },
  {
    stem: "In der Nähe welches Platzes befinden sich Weltzeituhr und Fernsehturm?",
    options: ["a) Siegessäule", "b) Alexanderplatz", "c) Brandenburger Tor", "d) Kurfürstendamm"],
  },
  {
    stem: "Was ist der Kurfürstendamm?",
    options: ["a) Ein Restaurant", "b) Ein Hotel", "c) Eine Hauptstadt", "d) Eine Einkaufsstraße"],
  },
  {
    stem: "Wo arbeitet die Erzählerin?",
    options: ["a) in einem Geschäft", "b) in einem Restaurant", "c) am Alexanderplatz", "d) in einem Hotel"],
  },
  {
    stem: "Was bietet das Hotel als besonderen Service für seine Gäste?",
    options: ["a) Fahrkarten für die U-Bahn", "b) eine Weltzeituhr", "c) Stadtrundfahrten", "d) Kostenloses Frühstück"],
  },
];

const teil4LesenQuestions = [
  {
    stem: "Wo findet man Stellenanzeigen nicht?",
    options: ["a) auf Webseiten", "b) in Zeitungen", "c) im Internet", "d) im Supermarkt"],
  },
  {
    stem: "Was steht zu Beginn einer Bewerbung?",
    options: ["a) Schule, Ausbildung, Kurse", "b) Name, Alter, Wohnort", "c) Berufserfahrung", "d) Interessen"],
  },
  {
    stem: "Was gehört noch zu einer Bewerbung?",
    options: ["a) Kopie des Reisepasses", "b) Brief der Eltern", "c) Absage der letzten Bewerbung", "d) Zeugnisse und Anschreiben"],
  },
  {
    stem: "Was passiert bei einem Bewerbungsgespräch?",
    options: [
      "a) Man lernt den Arbeitgeber kennen.",
      "b) Man muss eine Zeit lang zur Probe arbeiten.",
      "c) Man lernt die Kollegen kennen.",
      "d) Man bekommt Hilfe und Unterstützung bei der Arbeitssuche.",
    ],
  },
  {
    stem: "Was passiert, wenn man eine Absage bekommt?",
    options: [
      "a) Man muss eine Stellenanzeige schreiben.",
      "b) Man muss eine neue Ausbildung machen.",
      "c) Man kann sich bei der nächsten offenen Stelle bewerben.",
      "d) Man bekommt ein Zeugnis für das Bewerbungsgespräch.",
    ],
  },
];

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.1rem",
};

const listSpacing = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.7,
};

const questionCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 6,
};

const tabImageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 260,
  objectFit: "cover",
};

function TabButton({ active, onClick, children }) {
  return (
    <button
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

const B1Day22BeziehungWichtigWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);
  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 · Day 22 Workbook · Was ist dir in einer Beziehung wichtig?</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Chapter 7.22 · Beziehung und Werte, Partnersuche, Stadtleben und Bewerbungskompetenz.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => (
            <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </TabButton>
          ))}
        </div>

        <p style={{ margin: 0, color: "#4b5563" }}>
          Tab {activeIndex + 1} of {tabs.length}
        </p>
      </div>

      <A2B1WorkbookGuidance />

      {activeTab === "sprechen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80"
            alt="Group conversation about relationships and values"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we&apos;ll engage in group exercises discussing these topics.
          </p>

          <h3 style={sectionTitle}>Zentrales Thema (Central Topic)</h3>
          <p style={{ margin: 0 }}>
            <strong>Beziehung und Werte</strong> (Relationship and values)
          </p>

          <h3 style={sectionTitle}>🌿 Hauptäste (Main Branches)</h3>
          <ol style={listSpacing}>
            {speakingBranches.map((branch) => (
              <li key={branch}>{branch}</li>
            ))}
          </ol>

          <h3 style={sectionTitle}>🌟 Unteräste (Sub-Branches)</h3>
          <ol style={listSpacing}>
            {speakingSubBranches.map((branch) => (
              <li key={branch.title}>
                <strong>{branch.title}</strong>
                <ul style={listSpacing}>
                  {branch.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <h3 style={sectionTitle}>Sprechthemen zur Partnersuche und Beziehung</h3>
          <p style={{ margin: 0 }}>
            Use these profile-building prompts for pair or group practice. You may answer as yourself or create a fictional
            profile for speaking practice.
          </p>
          <ol style={listSpacing}>
            {profileQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ol>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Teil 1 is only for group discussion and has no assignment submission. Assignments start from Teil 2, Teil 3,
            and Teil 4.
          </p>

          <CourseInlinePracticePanel
            type="speaking"
          />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Writing practice about online dating and relationships"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Diskussion über Partnersuche und Beziehung</strong>
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Meinung von Maria:</strong> "Ich finde, dass die Partnersuche heutzutage durch das Internet viel einfacher
            geworden ist. Man hat die Möglichkeit, viele verschiedene Menschen kennenzulernen und schnell herauszufinden,
            ob man gemeinsame Interessen hat. Allerdings denke ich, dass es auch schwierig sein kann, weil viele Leute sich
            online anders präsentieren als sie wirklich sind. Manchmal vermisse ich die Zeiten, als man sich noch
            persönlich kennenlernen musste, um eine Beziehung aufzubauen."
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Frage an den Schüler:</strong> "Was denken Sie über Partnersuche im Internet? Teilen Sie ihre Ansichten oder
            haben Sie eine andere Meinung? Bitte begründen Sie Ihre Antwort."
          </p>
          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Writing guidance before submission</strong>
            <p style={{ margin: 0 }}>
              Draft your response first, organize your arguments clearly, and support your opinion with reasons and examples.
              You can use the Ideas Generator for support before you submit.
            </p>
          </div>
          <p style={{ margin: 0 }}>
            Submit your final writing in the assignment submission area, not directly on this page.
          </p>

          <CourseInlinePracticePanel
            type="writing"
          />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
            alt="Berlin city landmarks for reading comprehension"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen)</h2>
          <p style={{ margin: 0 }}>
            Read the text carefully, then complete the multiple-choice task in the assignment submission area. <strong>Do
            not answer directly on this page.</strong>
          </p>
          <h3 style={sectionTitle}>Berlin</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Berlin ist nicht nur Weltmetropole und die Hauptstadt Deutschlands, sondern auch meine Heimatstadt. Jeden
            Morgen auf dem Weg zur Arbeit komme ich an vielen berühmten Sehenswürdigkeiten vorbei. Da ist zunächst der
            Große Tiergarten, welcher schon über 500 Jahre alt ist. Von hier ist es nicht weit bis zum Brandenburger Tor
            und der Siegessäule. Hier steige ich in die U-Bahn und fahre einige Stationen bis zum Alexanderplatz, wo sich
            die Weltzeituhr und das Wahrzeichen der Stadt, der Fernsehturm, befinden.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Von dort sind es nur wenige Minuten Fußweg bis zum Kurfürstendamm, der riesigen Einkaufsstraße mit zahlreichen
            Restaurants, Geschäften und Hotels.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Hier arbeite ich als Hotelfachfrau und betreue die zahlreichen Gäste des Hotels, welche als Touristen Berlin
            besichtigen. Als echte Berlinerin kann ich ihnen dabei gute Tipps geben, welche Sehenswürdigkeiten sich
            wirklich lohnen und wie sie auf dem besten Wege dorthin gelangen. Sehr oft kommt man so mit den Gästen
            unserer Stadt ins Gespräch und erfährt, aus welchen Ländern sie angereist sind und ob es ihnen in Berlin
            gefällt. Als besonderen Service bietet unser Hotel auch eigene Stadtrundfahrten an, die immer sehr gern
            gebucht werden.
          </p>

          <h3 style={sectionTitle}>Fragen zum Text</h3>
          {lesenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>
                Frage {index + 1}: {question.stem}
              </strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80"
            alt="Reading task about job applications and Bewerbung"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 4 (Lesen)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Read the text carefully, then complete the multiple-choice task in the assignment submission area. <strong>Do
            not answer directly on this page.</strong>
          </p>

          <h3 style={sectionTitle}>Bewerbung</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Der erste Schritt bei der Jobsuche: eine passende Stellenanzeige finden. Sehr viele offene Stellen kann man im
            Internet finden. Es gibt viele Webseiten, die diese Stellen sammeln. Dort kann man sich meistens direkt
            bewerben. Viele dieser Seiten sind auch für bestimmte Gruppen: Studierende zum Beispiel oder für Leute, die
            eine bestimmte Ausbildung haben, zum Beispiel Journalisten oder Handwerker. Stellenanzeigen findet man aber
            auch in Zeitungen. Dort gibt es eigene Seiten mit Stellenanzeigen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Bei der Bewerbung gibt es einiges zu beachten. Zu Beginn stehen die wichtigsten Daten: Name, Alter, Wohnort,
            Nationalität und oft auch ein Bewerbungsfoto. Darunter schreibt man die Ausbildung: Welche Schulen hat man
            besucht, welche Berufsausbildung, welche Universität. Sehr wichtig sind auch die Berufserfahrung oder die
            eigenen Interessen. Wer besondere Fähigkeiten hat, sollte die auch angeben: Zum Beispiel, welche Sprachen man
            spricht, welche Kurse man schon besucht hat oder welche Computerkenntnisse man hat. Zu dem
            Bewerbungsschreiben gehört neben dem Lebenslauf auch ein Anschreiben. Das spricht die Firma direkt an, die
            einen neuen Arbeitnehmer sucht. Hier sollte stehen, warum man diese Stelle gerne hätte und warum man sich
            dafür eignet. Außerdem gehören auch Zeugnisse dazu von Schulen oder Ausbildungen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Wer Glück hat, bekommt dann eine Einladung zu einem Vorstellungsgespräch. Dort lernt man den Arbeitgeber
            kennen, erfährt mehr über die Arbeit und kann sich selbst präsentieren. Wer eine Absage bekommt, versucht es
            mit der nächsten offenen Stelle.
          </p>

          <h3 style={sectionTitle}>Fragen zum Text</h3>
          {teil4LesenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>
                Frage {index + 1}: {question.stem}
              </strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default B1Day22BeziehungWichtigWorkbookPage;
