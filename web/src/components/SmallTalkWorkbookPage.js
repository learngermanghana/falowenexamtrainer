import React from "react";

const sectionStyle = {
  background: "#fff",
  border: "1px solid #dbe7ff",
  borderRadius: 12,
  padding: 16,
  boxShadow: "0 4px 14px rgba(15, 23, 42, 0.05)",
};

const SmallTalkWorkbookPage = () => {
  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "20px 16px 32px", color: "#0f172a" }}>
      <header style={{ marginBottom: 16 }}>
        <p style={{ margin: "0 0 8px", color: "#2563eb", fontWeight: 700 }}>A2 Workbook • Chapter 1.1</p>
        <h1 style={{ margin: "0 0 8px" }}>Small Talk 1.1 (Exercise)</h1>
        <p style={{ margin: 0, lineHeight: 1.5 }}>
          Practice basic greetings and everyday conversations. Work through each Teil in order.
        </p>
      </header>

      <section style={{ ...sectionStyle, marginBottom: 12 }}>
        <h2 style={{ marginTop: 0 }}>Teil 1 (Sprechen) — Brain Map + Group Practice</h2>
        <p style={{ marginTop: 0 }}>Zentrales Thema: <strong>Small Talk</strong></p>
        <ul>
          <li>Begrüßung und Einstieg: Hallo, wie geht es dir? • Woher kommst du? • Schön, dich kennenzulernen.</li>
          <li>Themen: Arbeit, Sport/Hobbys, Familie, Wetter, Reisen.</li>
          <li>Höfliche Ausdrücke: Könntest du das bitte wiederholen? • Das klingt interessant!</li>
          <li>Gespräch beenden: Es war schön, mit dir zu sprechen. • Bis bald!</li>
        </ul>
        <p style={{ marginBottom: 0 }}>
          <strong>Diskussionsfragen:</strong> Kannst du dich vorstellen? Erzähl uns etwas über dich (Familie, Sprachen,
          Beruf/Studium, Hobbys).
        </p>
      </section>

      <section style={{ ...sectionStyle, marginBottom: 12 }}>
        <h2 style={{ marginTop: 0 }}>Teil 2 (Schreiben)</h2>
        <p>
          <strong>Aufgabe:</strong> Schreibe einen Brief an deinen Freund Felix über deine Arbeit und Familie.
        </p>
        <ol style={{ marginBottom: 0 }}>
          <li>Warum schreibst du?</li>
          <li>Erzähle etwas über deine Arbeit und deine Familie.</li>
          <li>Frage Felix, wie es ihm geht und was bei ihm neu ist.</li>
        </ol>
        <p style={{ marginBottom: 0 }}>
          Nutze die Briefstruktur mit <em>Einleitung, Hauptteil, Schluss</em> und Konjunktionen wie <em>weil, denn,
          deshalb</em>. Du hast bereits den Schreibbereich im Kurs — tippe deine Antwort dort ein.
        </p>
      </section>

      <section style={{ ...sectionStyle, marginBottom: 12 }}>
        <h2 style={{ marginTop: 0 }}>Teil 3 (Lesen)</h2>
        <p style={{ marginTop: 0 }}>
          Text: <strong>Mein Gespräch mit Lisa</strong>. Lies den Text und beantworte die Fragen mit den passenden
          Antworten (A–D).
        </p>
        <ol style={{ marginBottom: 0 }}>
          <li>Wo arbeitet Lisa?</li>
          <li>Warum liebt Lisa ihren Beruf?</li>
          <li>Wo arbeitet die erzählende Person?</li>
          <li>Welchen Sport mag Lisa?</li>
          <li>Wie war das Wetter gestern?</li>
          <li>In welchen Ländern war Lisa schon?</li>
          <li>Warum mag die erzählende Person den Herbst?</li>
        </ol>
      </section>

      <section style={{ ...sectionStyle, marginBottom: 12 }}>
        <h2 style={{ marginTop: 0 }}>Teil 4 (Hören)</h2>
        <p>Öffne den Audiolink und beantworte danach die Multiple-Choice-Fragen.</p>
        <p style={{ marginBottom: 0 }}>
          <a href="https://drive.google.com/file/d/1UXO1nHeBxOt8TS8dpp68xXr4Txjzu-NZ/view?usp=sharing" target="_blank" rel="noreferrer">
            Audio öffnen (Google Drive)
          </a>
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ marginTop: 0 }}>Recommended Video</h2>
        <p style={{ marginBottom: 0 }}>
          <a href="https://youtu.be/r-DuOo0vrqc" target="_blank" rel="noreferrer">
            How do you make SMALL TALK in German?
          </a>
        </p>
      </section>
    </main>
  );
};

export default SmallTalkWorkbookPage;
