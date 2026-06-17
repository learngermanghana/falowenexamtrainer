import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
  { key: "references", label: "Teil 5 · Reference Answers" },
];

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 10,
};

const imageStyle = {
  width: "100%",
  borderRadius: 12,
  maxHeight: 320,
  objectFit: "cover",
};

const infoBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#f9fafb",
  display: "grid",
  gap: 8,
};

const phraseGridStyle = { display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" };

const questionBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 8,
};

const lesenQuestions = [
  {
    prompt: "Aufgabe 1",
    options: [
      "a) das Studium wie in ihrem Heimatland ist.",
      "b) im Alltag einiges wie zu Hause ist.",
      "c) im Moment vieles neu für sie ist.",
    ],
  },
  {
    prompt: "Aufgabe 2",
    options: [
      "a) den Neuen die Hochschule gezeigt.",
      "b) für neue Studenten eine Stadtführung gemacht.",
      "c) Gülcan anderen ausländischen Studenten vorgestellt.",
    ],
  },
  {
    prompt: "Aufgabe 3",
    options: [
      "a) kochen alle zusammen.",
      "b) kocht Gülcan immer für alle.",
      "c) kocht jeder einmal für die anderen.",
    ],
  },
  {
    prompt: "Aufgabe 4",
    options: [
      "a) auch Englisch zu üben.",
      "b) Deutsch zu sprechen.",
      "c) Herrn Hahn kennenzulernen.",
    ],
  },
  {
    prompt: "Aufgabe 5",
    options: [
      "a) besuchen sie Mario zu Hause.",
      "b) machen Sonja und Gülcan Urlaub am Meer.",
      "c) übernachtet Sonja in Marios Zimmer.",
    ],
  },
];

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

const A2Day22DieWochePlanungWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, margin: 0 }}>A2 · Day 22 Workbook · Die Woche Planung</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 8.22</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          4-part workbook: Sprechen, Schreiben, Lesen und Hören. Complete each Teil and submit your final answers in the
          submission area (not on this page).
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
        <section style={sectionStyle}>
          <img
            src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1600&q=80"
            alt="Weekly planner with notes and calendar items on a desk"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={{ margin: 0 }}>Teil 1 · Sprechen (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we&apos;ll engage in group exercises discussing these topics. Following this, I&apos;ll revise the
            questions and invite you to write a brief essay about yourself.
          </p>
          <h3 style={{ margin: 0 }}>Instructions</h3>
          <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>
              <strong>Central Topic:</strong> Write <em>„In die Woche“</em> (or <em>„Meine Woche“</em>) in the center of your
              brain map.
            </li>
            <li>
              <strong>Main Branches:</strong> Create five main branches from the central topic.
            </li>
            <li>
              <strong>Sub-Branches:</strong> Expand each branch with examples and phrases in German.
            </li>
          </ol>

          <div style={questionBoxStyle}>
            <strong>1. Wochentage (Days of the Week)</strong>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              <li>Montag: Unterricht / Arbeit beginnt (Monday: class/work begins)</li>
              <li>Dienstag: Sportkurs, Einkäufe erledigen (Tuesday: sports class, do shopping)</li>
              <li>Mittwoch: Zeit für Hobbys, Freunde treffen (Wednesday: time for hobbies, meet friends)</li>
              <li>Donnerstag: Termine (Arzt, Bank) (Thursday: appointments, for example doctor or bank)</li>
              <li>Freitag: letzte Arbeitstage, Pläne für Wochenende machen (Friday: last workdays, make weekend plans)</li>
            </ul>
          </div>

          <div style={questionBoxStyle}>
            <strong>2. Arbeits- und Schulzeiten (Work and School Times)</strong>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              <li>Bürozeiten: 9-17 Uhr (office hours: 9 a.m.–5 p.m.)</li>
              <li>Pausenzeiten: Mittagspause, Kaffeepause (break times: lunch break, coffee break)</li>
              <li>Schulstunden: 8-13 Uhr, Hausaufgaben am Nachmittag (school lessons: 8 a.m.–1 p.m., homework in the afternoon)</li>
              <li>Überstunden / Nachhilfe (overtime / tutoring)</li>
            </ul>
          </div>

          <div style={questionBoxStyle}>
            <strong>3. Freizeitaktivitäten (Leisure Activities)</strong>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              <li>Sport: Joggen, Schwimmen, Fitnessstudio (sports: jogging, swimming, gym)</li>
              <li>Unterhaltung: Serien schauen, Videospiele, Lesen (entertainment: watching series, video games, reading)</li>
              <li>Treffen mit Freunden: Café, Kino, Spieleabend (meeting friends: café, cinema, game night)</li>
              <li>Vereine / Kurse: Sprachkurs, Tanzkurs, Musikprobe (clubs/courses: language course, dance course, music rehearsal)</li>
            </ul>
          </div>

          <div style={questionBoxStyle}>
            <strong>4. Hausarbeiten (Household Chores)</strong>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              <li>Putzen: Staubsaugen, Staub wischen, Bad putzen (cleaning: vacuuming, dusting, cleaning the bathroom)</li>
              <li>Wäsche waschen: Waschmaschine, Wäsche aufhängen (doing laundry: washing machine, hanging laundry)</li>
              <li>Kochen: Essensplanung, Rezepte, Einkaufsliste (cooking: meal planning, recipes, shopping list)</li>
              <li>Gartenarbeit: Rasen mähen, Blumen gießen (gardening: mowing the lawn, watering flowers)</li>
            </ul>
          </div>

          <div style={questionBoxStyle}>
            <strong>5. Termine und Erledigungen (Appointments and Errands)</strong>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              <li>Arzttermine: Zahnarzt, Hausarzt (doctor appointments: dentist, family doctor/GP)</li>
              <li>Behörden: Ausweis verlängern, Formulare ausfüllen (authorities/offices: renew ID, fill out forms)</li>
              <li>Bank / Post: Überweisungen, Pakete abholen (bank/post office: transfers, pick up parcels)</li>
              <li>Einkäufe: Lebensmittel, Kleidung, Drogerie (shopping/errands: groceries, clothes, drugstore)</li>
            </ul>
          </div>

          <h3 style={{ margin: 0 }}>Sprechen wie bei einer Mini-Präsentation</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Nutze diese einfache Struktur: <strong>Einleitung → Hauptteil mit Verbindungswörtern → Beispiel → Schluss</strong>.
            So wird aus kurzen Wörtern eine klare Antwort mit guten Sätzen.
          </p>
          <div style={{ ...questionBoxStyle, background: "#ecfeff" }}>
            <strong>Schnelle Struktur für 30–45 Sekunden</strong>
            <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              <li><strong>Einleitung:</strong> Thema nennen und einen ersten Satz sagen.</li>
              <li><strong>Hauptteil:</strong> zwei oder drei Punkte mit einfachen Connectors verbinden.</li>
              <li><strong>Beispiel:</strong> ein kurzes Beispiel aus deinem Leben geben.</li>
              <li><strong>Schluss:</strong> deine Meinung kurz zusammenfassen.</li>
            </ol>
          </div>
          <div style={phraseGridStyle}>
            <div style={{ ...questionBoxStyle, background: "#f8fafc" }}>
              <strong>Gute Einleitungen</strong>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                <li>„Heute spreche ich über …“</li>
                <li>„Ich möchte kurz etwas über … sagen.“</li>
                <li>„Mein Thema ist …“</li>
              </ul>
            </div>
            <div style={{ ...questionBoxStyle, background: "#f8fafc" }}>
              <strong>Verbindungswörter / Connectors</strong>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                <li><strong>und</strong> · „Ich lerne Deutsch und ich übe jeden Tag.“</li>
                <li><strong>oder</strong> · „Ich mache Sport oder ich treffe Freunde.“</li>
                <li><strong>weil</strong> · „Das ist gut, weil es einfach ist.“</li>
                <li><strong>deshalb</strong> · „Ich habe wenig Zeit, deshalb plane ich gut.“</li>
              </ul>
            </div>
            <div style={{ ...questionBoxStyle, background: "#f8fafc" }}>
              <strong>Eigene Meinung ausdrücken</strong>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                <li>„Ich finde … gut, weil …“</li>
                <li>„Für mich ist … wichtig.“</li>
                <li>„Meiner Meinung nach ist … praktisch.“</li>
              </ul>
            </div>
            <div style={{ ...questionBoxStyle, background: "#f8fafc" }}>
              <strong>Gute Schlüsse</strong>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                <li>„Zum Schluss kann ich sagen: …“</li>
                <li>„Deshalb finde ich … gut.“</li>
                <li>„Das ist meine Meinung. Danke fürs Zuhören.“</li>
              </ul>
            </div>
          </div>
          <div style={{ ...questionBoxStyle, background: "#ecfeff" }}>
            <strong>Modellantwort (ca. 30–45 Sekunden)</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Heute spreche ich über meine Woche. Am Montag arbeite ich und am Dienstag habe ich Deutschkurs. Am Mittwoch mache ich Sport, weil Bewegung gesund ist. Am Freitag treffe ich Freunde oder ich bleibe zu Hause. Am Wochenende kaufe ich ein und entspanne mich, deshalb starte ich gut in die neue Woche. Zum Schluss finde ich: Eine gute Wochenplanung hilft mir sehr.“
            </p>
          </div>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Wie planst du deine Woche?</strong> Erzähle davon! Montag bis Sonntag: Arbeit/Schule, Freizeit,
            Einkaufen.
          </p>
          <CourseInlinePracticePanel
            type="speaking"
          />
        </section>
      )}

      {activeTab === "schreiben" && (
        <section style={sectionStyle}>
          <h2 style={{ margin: 0 }}>Teil 2 · Schreiben (Assignment)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Schreiben Sie einen Brief an einen Freund oder eine Freundin, in dem Sie ihn oder sie zum Mittagessen
            einladen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>In Ihrem Brief sollten Sie folgende Punkte ansprechen:</p>
          <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Erklären Sie, warum Sie die Person zum Mittagessen einladen.</li>
            <li>Nennen Sie Datum, Uhrzeit und Ort des Treffens.</li>
            <li>Erklären Sie, was die Person mitbringen sollte oder was sie erwarten kann.</li>
          </ol>
          <CourseInlinePracticePanel
            type="writing"
          />
          <WorkbookSubmissionReminder />
        </section>
      )}

      {activeTab === "lesen" && (
        <section style={sectionStyle}>
          <h2 style={{ margin: 0 }}>Teil 3 · Lesen (Exercise)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Liebe Sonja,</strong>
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            ich bin jetzt schon vier Wochen in Hamburg und bin noch dabei, mich hier einzuleben. An der Universität ist
            vieles ganz anders organisiert als zu Hause. Und auch im täglichen Leben musste ich erst einmal lernen, wie
            einige Dinge hier gemacht werden. Zum Beispiel, wie ich ein Zimmer finde und wo ich was einkaufen kann.
          </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          In der ersten Woche haben ein paar Studenten eine Willkommensführung für uns ausländische Studierende gemacht.
          Sie haben uns die Uni gezeigt: die Bibliothek, die Cafeteria und die Multimedia-Räume. Hamburg hab ich dann
          alleine mit dem Stadtplan kennengelernt.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Ich wohne mit drei anderen Studenten aus Italien, Japan und Mexiko zusammen. Immer freitags kocht einer von
          uns etwas aus seinem Land und wir essen zusammen, obwohl wir nur eine winzig kleine Küche haben! Ich finde das
          super, du weißt ja, wie gerne ich koche!
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Wir sprechen in der Wohnung nicht nur Deutsch, sondern oft auch Englisch miteinander. Manchmal ist das
          einfacher, aber mich stört das ein bisschen. Ich möchte dieses Jahr möglichst viel Deutsch lernen.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Und weißt du, was mir am meisten Spaß macht? Der Literaturkurs. Der Dozent, Herr Hahn, ist ein total witziger
          Typ. Den müsstest du mal erleben. :-)
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Ich freue mich auf deinen Besuch im März. Dann zeige ich dir die Stadt und an einem Nachmittag fahren wir an
          die Ostsee. Da ist es total schön. Du kannst dann bei Mario schlafen. Das ist der Italiener, der neben mir
          wohnt. Er ist einverstanden, denn er fährt in den Ferien nach Hause, nach Genua.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Schreib mir bald!<br />
          Bis dann<br />
          Gülcan
        </p>

          <h3 style={{ margin: 0 }}>Aufgaben - Teil 3</h3>
          {lesenQuestions.map((question) => (
            <div key={question.prompt} style={questionBoxStyle}>
              <strong>{question.prompt}</strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            <WorkbookSubmissionReminder />
            </div>
          ))}
        </section>
      )}

      {activeTab === "hoeren" && (
        <section style={sectionStyle}>
          <h2 style={{ margin: 0 }}>Teil 4 · Hören (Exercise)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Please be aware that this is a Goethe-standard Hörverstehen (listening) test, and the answers are already
            provided in the YouTube video. You are responsible for checking your own answers.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            The only parts that will be officially evaluated by the school are Lesen (reading) and Schreiben (writing).
            You must mark your own Hören (listening) results.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            This process will require significant motivation and self-discipline on your part to be effective. Thank you,
            and good luck!
          </p>
          <div style={infoBoxStyle}>
            <strong>Hören Link</strong>
            <a href="https://youtu.be/wK9JOG5lhdc?list=PLtjMpIkGWMzD1BkOt9Jx9RhUk2e439CNZ" target="_blank" rel="noreferrer">
              Click the link to begin the listening exercise
            </a>
          <WorkbookSubmissionReminder />
          </div>
        </section>
      )}

      <section style={{ ...cardStyle, border: "1px solid #bfdbfe", background: "#eff6ff" }}>
        <h2 style={{ margin: 0 }}>Final Submission</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          After you complete all Teile, submit your final answers in the submission area. Do not submit answers directly
          on this workbook page.
        </p>
        <a href="https://www.falowen.app/campus/submit" target="_blank" rel="noreferrer" style={{ ...styles.button, width: "fit-content" }}>
          Go to Submission Area
        </a>
      </section>

      {activeTab === "references" && (
        <WorkbookReferenceAnswers level="A2" lesson={{ title: "A2Day22DieWochePlanung", level: "A2", workbookId: "A2Day22DieWochePlanung" }} workbookId="A2Day22DieWochePlanung" />
      )}

    </div>
  );
};

export default A2Day22DieWochePlanungWorkbookPage;
