import React, { useState } from "react";
import A1TutorMarkedWorkbookShell, { WorkbookSection } from "./A1TutorMarkedWorkbookShell";
import { A1ReadingSourceCard, A1ReadingSourceGrid } from "./A1TutorMarkedReadingLayout";
import { useAuth } from "../context/AuthContext";
import { fetchA1AudioPlaybackUrl } from "../services/a1AudioService";
import { styles } from "../styles";

const DAY22_ASSIGNMENT_KEY = "A1-14.1";

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const imageStyle = {
  width: "100%",
  borderRadius: 12,
  maxHeight: 320,
  objectFit: "cover",
};

const infoBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 14,
  background: "#f9fafb",
  display: "grid",
  gap: 8,
};

const questionBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 14,
  background: "#fff",
  display: "grid",
  gap: 8,
};

const teil1Questions = [
  {
    "title": "Situation 1",
    "prompt": "Sie sind krank. Sie haben Bauchschmerzen und müssen heute sofort zum Arzt. Sie haben keinen Termin.",
    "adA": [
      "Praxis Dr. Weber",
      "Sprechzeiten: Mo–Fr 8:00 – 12:00 Uhr.",
      "Wichtig: Bitte nur mit Termin kommen!",
      "Telefon: 030 / 123456"
    ],
    "adB": [
      "Praxis Dr. Klein",
      "Sprechzeiten: Mo–Fr 8:00 – 12:00 Uhr.",
      "Ohne Termin: Kommen Sie einfach vorbei."
    ]
  },
  {
    "title": "Situation 2",
    "prompt": "Es ist Samstagabend. Ihr Zahn tut sehr weh. Sie suchen heute einen Zahnarzt.",
    "adA": [
      "Zahnarzt Dr. Lang",
      "Montag bis Freitag: 8:00 – 18:00 Uhr.",
      "Samstag und Sonntag: Geschlossen."
    ],
    "adB": [
      "Notfall-Zahnarzt Berlin",
      "Samstag und Sonntag: 24 Stunden geöffnet.",
      "Ohne Termin."
    ]
  },
  {
    "title": "Situation 3",
    "prompt": "Ihr Sohn (4 Jahre alt) ist krank. Sie suchen einen Arzt für Ihr Kind.",
    "adA": [
      "Dr. Becker – Kinderarzt",
      "Hilfe für Babys und Kinder.",
      "Mo–Fr: 9:00 – 15:00 Uhr."
    ],
    "adB": [
      "Dr. Fischer – Augenarzt",
      "Brillen und Sehtests für Kinder und Erwachsene.",
      "Termine online."
    ]
  },
  {
    "title": "Situation 4",
    "prompt": "Sie haben am Donnerstag einen Termin beim Arzt. Sie können nicht kommen und möchten den Termin absagen.",
    "adA": [
      "Praxis Dr. Kurz",
      "Termin absagen?",
      "Bitte 24 Stunden vorher anrufen oder eine E-Mail schreiben."
    ],
    "adB": [
      "Praxis Dr. Kurz – Online-Service",
      "Hier können Sie neue Termine buchen.",
      "Achtung: Absagen sind online nicht möglich."
    ],
    "question": "Wie können Sie den Termin absagen?",
    "options": [
      "a) Per Anruf oder E-Mail (Anzeige A)",
      "b) Im Online-Service (Anzeige B)"
    ]
  },
  {
    "title": "Situation 5",
    "prompt": "Sie haben eine normale Krankenkasse (z. B. AOK oder TK). Sie suchen einen Arzt und möchten nicht viel Geld selbst bezahlen.",
    "adA": [
      "Privatpraxis Dr. Meier",
      "Nur für Privatpatienten (Sie bezahlen die Rechnung selbst)."
    ],
    "adB": [
      "Praxis Dr. Schulze",
      "Für alle Krankenkassen und Privatpatienten."
    ]
  }
];

const appointmentStatements = [
  "Der Termin ist am Dienstag, 12. Oktober.",
  "Frau Perez soll um 10:15 Uhr da sein.",
  "Frau Perez muss ihre Karte mitbringen.",
  "Frau Perez soll anrufen, wenn sie nicht kommen kann.",
  "Es gibt keinen Fahrstuhl im Haus.",
];

const DAY22_AUDIO_KEY = "a1/day-22/day-22.mp3";

const healthListeningQuestions = Object.freeze([
  {
    stem: "Welche Beschwerden hat Herr Braun?",
    options: [
      "A. Fieber, Kopfschmerzen und Halsschmerzen",
      "B. Bauchschmerzen und Rückenschmerzen",
      "C. Zahnschmerzen und Husten",
    ],
  },
  {
    stem: "Was soll Herr Braun machen?",
    options: [
      "A. Zur Arbeit gehen und Sport machen",
      "B. Zu Hause bleiben und viel Tee trinken",
      "C. Sofort ins Krankenhaus fahren",
    ],
  },
  {
    stem: "Wann ist der Termin bei Doktor Weber?",
    options: [
      "A. Am Freitag um 9:30 Uhr",
      "B. Am Donnerstag um 9:30 Uhr",
      "C. Am Freitag um 10:30 Uhr",
    ],
  },
  {
    stem: "Wo ist die Praxis?",
    options: [
      "A. Bahnhofstraße 12",
      "B. Gartenstraße 20",
      "C. Marktstraße 15",
    ],
  },
  {
    stem: "Was soll Herr Braun mitbringen?",
    options: [
      "A. Einen Reisepass",
      "B. Seine Versichertenkarte",
      "C. Eine Flasche Wasser",
    ],
  },
  {
    stem: "Was soll Herr Braun tun, wenn er am Freitag nicht kommen kann?",
    options: [
      "A. Die Praxis anrufen",
      "B. Einfach am Montag kommen",
      "C. Eine E-Mail an Doktor Weber schreiben",
    ],
  },
]);

const HealthOverview = () => (
  <section style={sectionStyle} data-a1-day22-health-overview="true">
    <div style={{ border: "1px solid #f59e0b", background: "#fffbeb", borderRadius: 12, padding: 12, lineHeight: 1.65 }}>
      <strong>Finish Strong · Final Independent Challenge · 30 minutes</strong>
      <p style={{ margin: "6px 0 0" }}>
        Use what you know from the whole A1 course. Read the five advertisement situations and the appointment email, then finish the six listening questions independently.
      </p>
    </div>
    <h2 style={{ margin: 0 }}>A1 Day 22 · Kapitel 14.1 Assignment Overview</h2>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Complete Teil 1 Anzeigen, Teil 2 Lesen: Ihr Termin and Teil 3 Hören, then open Submit Assignment.
    </p>
  </section>
);

const Teil1Content = () => (
      <section style={sectionStyle} data-a1-day22-health-teil="1">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80"
          alt="Doctor speaking with a patient in a clinic about health and appointments"
          loading="lazy"
          style={imageStyle}
        />

        <h2 style={{ margin: 0 }}>Teil 1 · Lesen: Anzeigen und Termine</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Aufgabe:</strong> Read each advertisement pair and choose the correct option.
        </p>

        {teil1Questions.map((question, index) => (
          <div key={question.title} style={questionBoxStyle}>
            <h3 style={{ margin: 0, lineHeight: 1.6 }}>{question.title}</h3>
            <p style={{ margin: 0, lineHeight: 1.7 }}><strong>{index + 1}. {question.prompt}</strong></p>

            <A1ReadingSourceGrid minWidth={220}>
              <A1ReadingSourceCard label="Anzeige A" title={question.adA[0]}>
                {question.adA.slice(1).map((line) => (
                  <span key={`${question.title}-a-${line}`}>{line}</span>
                ))}
              </A1ReadingSourceCard>

              <A1ReadingSourceCard label="Anzeige B" title={question.adB[0]}>
                {question.adB.slice(1).map((line) => (
                  <span key={`${question.title}-b-${line}`}>{line}</span>
                ))}
              </A1ReadingSourceCard>
            </A1ReadingSourceGrid>

            <p style={{ margin: 0 }}>
              <strong>{question.question || "Welche Anzeige passt?"}</strong>
            </p>
            {(question.options || ["a) Anzeige A", "b) Anzeige B"]).map((option) => (
              <p key={option} style={{ margin: 0 }}>{option}</p>
            ))}
          </div>
        ))}

      </section>
);

const Teil2Content = () => (
      <section style={sectionStyle} data-a1-day22-health-teil="2">
        <h2 style={{ margin: 0 }}>Teil 2 · Lesen: Ihr Termin</h2>
        <A1ReadingSourceCard label="E-Mail" title="Betreff: Ihr Termin">
          <p style={{ margin: 0 }}>Hallo Frau Perez,</p>
          <p style={{ margin: 0 }}>Ihr Termin bei Dr. Schmidt ist am Dienstag, 12. Oktober um 10:30 Uhr.</p>
          <p style={{ margin: 0 }}>Bitte beachten Sie:</p>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Kommen Sie bitte um 10:15 Uhr.</li>
            <li>Bringen Sie Ihre Arztkarte / Krankenkarte mit.</li>
            <li>Sie können nicht kommen? Bitte rufen Sie uns an: 040 / 555 444.</li>
            <li>Ein Fahrstuhl ist im Haus.</li>
          </ul>
          <p style={{ margin: 0 }}>Viele Grüße<br />Praxis Dr. Schmidt</p>
        </A1ReadingSourceCard>
        <p style={{ margin: 0 }}>Lesen Sie die Nachricht. Sind die Aussagen richtig (R) oder falsch (F)?</p>
        {appointmentStatements.map((statement, index) => (
          <div key={statement} style={questionBoxStyle}>
            <p style={{ margin: 0 }}><strong>{index + 1}. {statement}</strong></p>
            <p style={{ margin: 0 }}>Richtig</p>
            <p style={{ margin: 0 }}>Falsch</p>
          </div>
        ))}
      </section>
);

const Teil3Content = () => {
  const { idToken } = useAuth();
  const [audioUrl, setAudioUrl] = useState("");
  const [audioError, setAudioError] = useState("");
  const [loadingAudio, setLoadingAudio] = useState(false);

  const loadAudio = async () => {
    if (audioUrl || loadingAudio) return;
    setLoadingAudio(true);
    setAudioError("");
    try {
      const playback = await fetchA1AudioPlaybackUrl({
        day: 22,
        key: DAY22_AUDIO_KEY,
        idToken,
      });
      setAudioUrl(playback.url);
    } catch (error) {
      setAudioError(error?.response?.data?.error || error?.message || "Audio could not be loaded.");
    } finally {
      setLoadingAudio(false);
    }
  };

  return (
    <section style={sectionStyle} data-a1-day22-health-teil="3">
      <h2 style={{ margin: 0 }}>Teil 3 · Hören</h2>
      <div style={infoBoxStyle}>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Aufgabe:</strong> Hören Sie die Nachricht aus der Arztpraxis zweimal. Wählen Sie bei jeder Frage A, B oder C.
        </p>
        {!audioUrl ? (
          <button type="button" onClick={loadAudio} disabled={loadingAudio} style={{ justifySelf: "start" }}>
            {loadingAudio ? "Audio wird geladen …" : "Hören starten"}
          </button>
        ) : (
          <audio controls preload="metadata" src={audioUrl} style={{ width: "100%" }}>
            Ihr Browser unterstützt dieses Audio nicht.
          </audio>
        )}
        {audioError ? <p style={{ margin: 0, color: "#b91c1c" }}>{audioError}</p> : null}
      </div>

      {healthListeningQuestions.map((item, index) => (
        <div key={item.stem} style={questionBoxStyle}>
          <strong>{index + 1}. {item.stem}</strong>
          {item.options.map((option) => <span key={option}>{option}</span>)}
        </div>
      ))}
    </section>
  );
};

const A1Day22HealthBodyPartsWorkbookPage = () => (
  <A1TutorMarkedWorkbookShell
    fallbackAssignmentKey={DAY22_ASSIGNMENT_KEY}
    title="A1 · Day 22 Workbook · Health and Body Parts"
    subtitle="Kapitel 14.1 · Tutor-marked Lesen & Hören assignment"
    assignmentIntro="Use Overview, then complete the five advertisement questions in Teil 1, the five Richtig/Falsch questions in Teil 2 and the six listening questions in Teil 3 inside the 30-minute final challenge."
    submitTitle="Submit A1 · Day 22 · Kapitel 14.1"
    submitDescription="Submit both sets of reading answers and your listening answers together for tutor marking."
  >
    <HealthOverview />
    <WorkbookSection sectionKey="teil-1"><Teil1Content /></WorkbookSection>
    <WorkbookSection sectionKey="teil-2"><Teil2Content /></WorkbookSection>
    <WorkbookSection sectionKey="teil-3"><Teil3Content /></WorkbookSection>
  </A1TutorMarkedWorkbookShell>
);

export default A1Day22HealthBodyPartsWorkbookPage;

