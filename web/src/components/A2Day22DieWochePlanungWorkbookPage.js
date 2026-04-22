import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

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

const A2Day22DieWochePlanungWorkbookPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, margin: 0 }}>A2 · Day 22 Workbook · Die Woche Planung</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 8.22</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Complete all Teile below, then submit your final answers in the submission area (not on this page).
        </p>
      </div>

      <section style={sectionStyle}>
        <img
          src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1600&q=80"
          alt="Weekly planner with notes and calendar items on a desk"
          loading="lazy"
          style={imageStyle}
        />
        <h2 style={{ margin: 0 }}>Teil 1 (Group Practice)</h2>
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
            <li>Montag: Unterricht / Arbeit beginnt</li>
            <li>Dienstag: Sportkurs, Einkäufe erledigen</li>
            <li>Mittwoch: Zeit für Hobbys, Freunde treffen</li>
            <li>Donnerstag: Termine (Arzt, Bank)</li>
            <li>Freitag: letzte Arbeitstage, Pläne für Wochenende machen</li>
          </ul>
        </div>

        <div style={questionBoxStyle}>
          <strong>2. Arbeits- und Schulzeiten (Work and School Times)</strong>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Bürozeiten: 9-17 Uhr</li>
            <li>Pausenzeiten: Mittagspause, Kaffeepause</li>
            <li>Schulstunden: 8-13 Uhr, Hausaufgaben am Nachmittag</li>
            <li>Überstunden / Nachhilfe</li>
          </ul>
        </div>

        <div style={questionBoxStyle}>
          <strong>3. Freizeitaktivitäten (Leisure Activities)</strong>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Sport: Joggen, Schwimmen, Fitnessstudio</li>
            <li>Unterhaltung: Serien schauen, Videospiele, Lesen</li>
            <li>Treffen mit Freunden: Café, Kino, Spieleabend</li>
            <li>Vereine / Kurse: Sprachkurs, Tanzkurs, Musikprobe</li>
          </ul>
        </div>

        <div style={questionBoxStyle}>
          <strong>4. Hausarbeiten (Household Chores)</strong>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Putzen: Staubsaugen, Staub wischen, Bad putzen</li>
            <li>Wäsche waschen: Waschmaschine, Wäsche aufhängen</li>
            <li>Kochen: Essensplanung, Rezepte, Einkaufsliste</li>
            <li>Gartenarbeit: Rasen mähen, Blumen gießen</li>
          </ul>
        </div>

        <div style={questionBoxStyle}>
          <strong>5. Termine und Erledigungen (Appointments and Errands)</strong>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Arzttermine: Zahnarzt, Hausarzt</li>
            <li>Behörden: Ausweis verlängern, Formulare ausfüllen</li>
            <li>Bank / Post: Überweisungen, Pakete abholen</li>
            <li>Einkäufe: Lebensmittel, Kleidung, Drogerie</li>
          </ul>
        </div>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Wie planst du deine Woche?</strong> Erzähle davon! Montag bis Sonntag: Arbeit/Schule, Freizeit,
          Einkaufen.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 2 (Schreiben) · Assignment</h2>
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
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 3 (Lesen) · Exercise</h2>
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
          </div>
        ))}
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 4 (Hören)</h2>
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
        </div>
      </section>

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
    </div>
  );
};

export default A2Day22DieWochePlanungWorkbookPage;
