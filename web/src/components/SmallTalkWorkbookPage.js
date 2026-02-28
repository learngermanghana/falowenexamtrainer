import React from "react";

const page = {
  maxWidth: 1040,
  margin: "0 auto",
  padding: "22px 16px 36px",
  color: "#0f172a",
};

const card = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 16,
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
};

const subtle = { color: "#475569" };

const badge = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 10px",
  borderRadius: 999,
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  color: "#1e3a8a",
  fontWeight: 800,
  fontSize: 12,
};

const divider = { height: 1, background: "#e2e8f0", margin: "14px 0" };

const imgWrap = {
  borderRadius: 14,
  overflow: "hidden",
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
};

const imgStyle = {
  width: "100%",
  height: 190,
  objectFit: "cover",
  display: "block",
};

const chipRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  alignItems: "center",
};

const linkBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  background: "#0f172a",
  color: "#fff",
  fontWeight: 800,
  textDecoration: "none",
  width: "fit-content",
};

const outlineBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#0f172a",
  fontWeight: 800,
  textDecoration: "none",
  width: "fit-content",
};

const sectionHeader = (title, tag) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {tag ? <span style={badge}>{tag}</span> : null}
  </div>
);

// Free images from Unsplash (hotlinking public images). You can swap queries anytime.
const images = {
  hero: "https://source.unsplash.com/1600x800/?german,conversation,coffee",
  teil1: "https://source.unsplash.com/1600x900/?friends,conversation",
  teil2: "https://source.unsplash.com/1600x900/?writing,letter,notebook",
  teil3: "https://source.unsplash.com/1600x900/?reading,book,cafe",
  teil4: "https://source.unsplash.com/1600x900/?headphones,listening,audio",
};

const SmallTalkWorkbookPage = () => {
  const questionOfTheDayLink =
    "https://script.google.com/macros/s/AKfycbzMIhHuWKqM2ODaOCgtS7uZCikiZJRBhpqv2p6OyBmK1yAVba8HlmVC1zgTcGWSTfrsHA/exec";

  return (
    <main style={page}>
      {/* HERO */}
      <section
        style={{
          ...card,
          padding: 0,
          overflow: "hidden",
          borderRadius: 18,
          marginBottom: 14,
        }}
      >
        <div style={{ position: "relative" }}>
          <img src={images.hero} alt="Small talk in German" style={{ ...imgStyle, height: 220 }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(2,6,23,0.55) 0%, rgba(2,6,23,0.10) 55%, rgba(255,255,255,0.0) 100%)",
            }}
          />
          <div style={{ position: "absolute", left: 16, right: 16, top: 16, display: "grid", gap: 8 }}>
            <div style={chipRow}>
              <span style={badge}>Chapter: 1.1</span>
              <span style={badge}>Assignment</span>
              <span style={{ ...badge, background: "#f8fafc", borderColor: "#e2e8f0", color: "#0f172a" }}>
                A2 Workbook
              </span>
            </div>

            <h1 style={{ margin: 0, color: "#fff", letterSpacing: -0.2 }}>Small Talk 1.1 (Exercise)</h1>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.9)", maxWidth: 820, lineHeight: 1.55 }}>
              Practice basic greetings and small talk. This workbook is for reading and practice. Answer in your course
              typing area.
            </p>
          </div>
        </div>

        <div style={{ padding: 16, display: "grid", gap: 12 }}>
          {/* Objectives + Question of the day */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gap: 12,
            }}
          >
            <div style={{ ...card, boxShadow: "none", borderRadius: 14 }}>
              <div style={chipRow}>
                <span style={badge}>Objectives</span>
              </div>
              <ul style={{ margin: "10px 0 0", paddingLeft: 18, display: "grid", gap: 8 }}>
                <li>Use simple questions to start a conversation (A2).</li>
                <li>Talk about work, hobbies, family, weather, and travel.</li>
                <li>Use polite expressions and end a conversation naturally.</li>
              </ul>
            </div>

            <div style={{ ...card, boxShadow: "none", borderRadius: 14, display: "grid", gap: 10 }}>
              <div style={chipRow}>
                <span style={badge}>Question for the day</span>
              </div>
              <p style={{ margin: 0, ...subtle, lineHeight: 1.6 }}>
                Open the daily question and practice speaking with a partner.
              </p>
              <a href={questionOfTheDayLink} target="_blank" rel="noreferrer" style={linkBtn}>
                Open Question for the Day
              </a>
            </div>
          </div>

          {/* Quick navigation */}
          <div style={{ ...card, boxShadow: "none", borderRadius: 14 }}>
            <div style={chipRow}>
              <span style={badge}>Jump to</span>
              <a href="#teil1" style={outlineBtn}>
                Teil 1
              </a>
              <a href="#teil2" style={outlineBtn}>
                Teil 2
              </a>
              <a href="#teil3" style={outlineBtn}>
                Teil 3
              </a>
              <a href="#teil4" style={outlineBtn}>
                Teil 4
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TEIL 1 */}
      <section id="teil1" style={{ ...card, marginBottom: 12 }}>
        {sectionHeader("Teil 1 (Sprechen)", "Brain Map • Group Practice")}

        <div style={{ ...divider }} />

        <div style={{ ...imgWrap, marginBottom: 12 }}>
          <img src={images.teil1} alt="Group conversation" style={imgStyle} />
        </div>

        <p style={{ marginTop: 0, lineHeight: 1.6 }}>
          In this chapter, we'll engage in group exercises discussing these topics. After this, you can answer the
          question of the day and practice with a partner.
        </p>

        <p style={{ margin: "12px 0 8px" }}>
          <strong>1. Zentrales Thema:</strong> Small Talk
        </p>

        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <p style={{ margin: "0 0 6px", fontWeight: 900 }}>Begrüßung und Einstieg</p>
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
              <li>Hallo, wie geht es dir?</li>
              <li>Woher kommst du?</li>
              <li>Schön, dich kennenzulernen.</li>
            </ul>
          </div>

          <div>
            <p style={{ margin: "0 0 6px", fontWeight: 900 }}>Themen für Small Talk</p>
            <ol style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 10 }}>
              <li>
                <strong>Arbeit</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
                  <li>Wo arbeitest du? — Ich arbeite in einem Büro.</li>
                  <li>Was machst du beruflich? — Ich bin Lehrer.</li>
                </ul>
              </li>

              <li>
                <strong>Sport und Hobbys</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
                  <li>Machst du gerne Sport? — Ja, ich spiele gern Fußball.</li>
                  <li>Hast du ein Hobby? — Ich lese gern Bücher.</li>
                </ul>
              </li>

              <li>
                <strong>Familie</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
                  <li>Hast du Geschwister? — Ja, ich habe eine Schwester.</li>
                  <li>Wie heißt dein Bruder? — Er heißt Max.</li>
                </ul>
              </li>

              <li>
                <strong>Wetter</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
                  <li>Wie ist das Wetter heute? — Es ist sonnig und warm.</li>
                  <li>Magst du den Sommer? — Ja, ich liebe den Sommer.</li>
                </ul>
              </li>

              <li>
                <strong>Reisen</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
                  <li>Warst du schon mal im Ausland? — Ja, ich war in Italien.</li>
                  <li>Wohin möchtest du reisen? — Ich möchte nach Spanien reisen.</li>
                </ul>
              </li>
            </ol>
          </div>

          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, background: "#f8fafc" }}>
              <p style={{ margin: "0 0 6px", fontWeight: 900 }}>Höfliche Ausdrücke</p>
              <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
                <li>Könntest du das bitte wiederholen?</li>
                <li>Das klingt interessant!</li>
                <li>Entschuldigung, ich habe dich nicht verstanden.</li>
              </ul>
            </div>

            <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, background: "#f8fafc" }}>
              <p style={{ margin: "0 0 6px", fontWeight: 900 }}>Gespräch beenden</p>
              <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
                <li>Es war schön, mit dir zu sprechen.</li>
                <li>Ich wünsche dir einen schönen Tag!</li>
                <li>Bis bald!</li>
              </ul>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12 }}>
            <p style={{ margin: "0 0 6px", fontWeight: 900 }}>Diskussionsfragen (A2)</p>
            <p style={{ margin: 0, ...subtle }}>
              Kannst du dich vorstellen? Erzähl uns etwas über dich: Familie, Sprachen, Beruf/Studium, Hobbys.
            </p>
          </div>
        </div>
      </section>

      {/* TEIL 2 */}
      <section id="teil2" style={{ ...card, marginBottom: 12 }}>
        {sectionHeader("Teil 2 (Schreiben)", "Exercise")}

        <div style={{ ...divider }} />

        <div style={{ ...imgWrap, marginBottom: 12 }}>
          <img src={images.teil2} alt="Writing a letter" style={imgStyle} />
        </div>

        <p style={{ marginTop: 0 }}>
          <strong>Aufgabe:</strong> Schreibe einen Brief an deinen Freund Felix. In deinem Brief möchtest du über deine
          Arbeit und Familie sprechen.
        </p>

        <ol style={{ marginTop: 8 }}>
          <li>Warum schreibst du?</li>
          <li>Erzähle Felix etwas über deine Arbeit und deine Familie.</li>
          <li>Frage Felix, wie es ihm geht und was bei ihm neu ist.</li>
        </ol>

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12, display: "grid", gap: 10 }}>
          <p style={{ margin: 0, fontWeight: 900 }}>Struktur des Briefes</p>

          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, background: "#f8fafc" }}>
              <p style={{ margin: "0 0 6px", fontWeight: 900 }}>Einleitung</p>
              <p style={{ margin: 0, ...subtle }}>
                „Lieber Felix,“ <br />
                „Wie geht es dir? Ich hoffe, es geht dir gut.“
              </p>
            </div>

            <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, background: "#f8fafc" }}>
              <p style={{ margin: "0 0 6px", fontWeight: 900 }}>Hauptteil</p>
              <p style={{ margin: 0, ...subtle, lineHeight: 1.65 }}>
                „Ich schreibe dir, weil …“ <br />
                Erzähle über deine Arbeit (was du machst, ob die Arbeit interessant ist). <br />
                Erzähle etwas Neues über deine Familie. <br />
                Verwende Konjunktionen: <strong>weil</strong>, <strong>denn</strong>, <strong>deshalb</strong>.
              </p>
            </div>

            <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, background: "#f8fafc" }}>
              <p style={{ margin: "0 0 6px", fontWeight: 900 }}>Schluss</p>
              <p style={{ margin: 0, ...subtle, lineHeight: 1.65 }}>
                „Wie geht es dir? Was hast du zuletzt gemacht?“ <br />
                „Ich freue mich auf deine Antwort.“ <br />
                „Viele Grüße, Dein Vorname“
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEIL 3 */}
      <section id="teil3" style={{ ...card, marginBottom: 12 }}>
        {sectionHeader("Teil 3 (Lesen)", "Multiple Choice")}

        <div style={{ ...divider }} />

        <div style={{ ...imgWrap, marginBottom: 12 }}>
          <img src={images.teil3} alt="Reading in a cafe" style={imgStyle} />
        </div>

        <p style={{ marginTop: 0, lineHeight: 1.7 }}>
          <strong>Mein Gespräch mit Lisa</strong>
          <br />
          Gestern habe ich Lisa im Café getroffen. Sie arbeitet in einer Schule und unterrichtet Kinder. Wir haben über
          unsere Arbeit gesprochen. Lisa sagt, dass sie ihren Beruf liebt, weil sie gerne mit Kindern arbeitet. Ich habe
          ihr erzählt, dass ich in einem Büro arbeite.
          <br />
          <br />
          Dann haben wir über Sport gesprochen. Lisa spielt gern Tennis, aber ich mag Fußball mehr. Wir haben auch über
          das Wetter geredet. Es war gestern sonnig und warm, und Lisa liebt den Sommer. Ich habe ihr erzählt, dass ich
          lieber den Herbst mag, weil die Bäume so schön bunt sind.
          <br />
          <br />
          Zum Schluss haben wir über Reisen gesprochen. Lisa war schon in Italien und Spanien. Sie möchte nächstes Jahr
          nach Frankreich reisen. Ich war noch nie in Spanien, aber ich würde gerne dorthin reisen.
          <br />
          <br />
          Es war ein sehr nettes Gespräch, und wir haben viel gelacht!
        </p>

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12, display: "grid", gap: 12 }}>
          <p style={{ margin: 0, fontWeight: 900 }}>Fragen und mögliche Antworten</p>

          {[
            {
              q: "1. Wo arbeitet Lisa?",
              a: ["A. In einem Büro", "B. In einem Café", "C. In einer Schule", "D. In einem Krankenhaus"],
            },
            {
              q: "2. Warum liebt Lisa ihren Beruf?",
              a: [
                "A. Weil sie gerne reist",
                "B. Weil sie gerne mit Kindern arbeitet",
                "C. Weil sie Tennis mag",
                "D. Weil sie gerne im Büro arbeitet",
              ],
            },
            {
              q: "3. Wo arbeitet die erzählende Person?",
              a: ["A. In einem Büro", "B. In einer Schule", "C. In einem Café", "D. In einem Krankenhaus"],
            },
            {
              q: "4. Welchen Sport mag Lisa?",
              a: ["A. Fußball", "B. Tennis", "C. Schwimmen", "D. Volleyball"],
            },
            {
              q: "5. Wie war das Wetter gestern?",
              a: ["A. Es war regnerisch", "B. Es war sonnig und warm", "C. Es war kalt", "D. Es war windig"],
            },
            {
              q: "6. In welchen Ländern war Lisa schon?",
              a: ["A. Frankreich und Deutschland", "B. Italien und Spanien", "C. Österreich und Schweiz", "D. Griechenland und Kroatien"],
            },
            {
              q: "7. Warum mag die erzählende Person den Herbst?",
              a: ["A. Weil es sonnig ist", "B. Weil es warm ist", "C. Weil die Bäume so schön bunt sind", "D. Weil sie gerne Tennis spielt"],
            },
          ].map((item, idx) => (
            <div key={idx} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, background: "#fff" }}>
              <p style={{ margin: "0 0 8px", fontWeight: 900 }}>{item.q}</p>
              <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
                {item.a.map((opt, j) => (
                  <li key={j} style={{ ...subtle }}>
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* TEIL 4 */}
      <section id="teil4" style={{ ...card, marginBottom: 12 }}>
        {sectionHeader("Teil 4 (Hören)", "Audio • Multiple Choice")}

        <div style={{ ...divider }} />

        <div style={{ ...imgWrap, marginBottom: 12 }}>
          <img src={images.teil4} alt="Listening with headphones" style={imgStyle} />
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <div style={chipRow}>
            <span style={badge}>Audio link</span>
            <a
              href="https://drive.google.com/file/d/1UXO1nHeBxOt8TS8dpp68xXr4Txjzu-NZ/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              style={{ ...outlineBtn, fontWeight: 900 }}
            >
              Open Audio (Google Drive)
            </a>
          </div>
          <p style={{ margin: 0, ...subtle, lineHeight: 1.6 }}>
            Listen 2–3 times, then choose the best answer (A–D) in your course typing area.
          </p>
        </div>

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12, display: "grid", gap: 12 }}>
          <p style={{ margin: 0, fontWeight: 900 }}>Fragen und mögliche Antworten</p>

          {[
            {
              q: "1. Was hat Lena am Samstag vor?",
              a: ["A. Mit ihrer Freundin spazieren gehen", "B. Ins Kino gehen", "C. Tennis spielen", "D. Einen Spaziergang im Park machen"],
            },
            {
              q: "2. Warum freut sich Lena auf den Actionfilm?",
              a: ["A. Weil sie spannende Geschichten liebt", "B. Weil sie Comedy-Filme mag", "C. Weil sie den Film schon gesehen hat", "D. Weil sie Horrorfilme liebt"],
            },
            {
              q: "3. Welche Sportart betreibt Lena regelmäßig?",
              a: ["A. Tennis", "B. Schwimmen", "C. Laufen", "D. Yoga"],
            },
            {
              q: "4. Wie war das Wetter am letzten Wochenende?",
              a: ["A. Es war regnerisch und kühl", "B. Es war sonnig und warm", "C. Es war bewölkt und windig", "D. Es war kalt und frostig"],
            },
            {
              q: "5. Was schlägt Lena für das nächste Treffen vor?",
              a: ["A. Ins Kino gehen", "B. Gemeinsam Tennis spielen", "C. Einen Spaziergang machen", "D. Kaffee trinken gehen"],
            },
          ].map((item, idx) => (
            <div key={idx} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, background: "#fff" }}>
              <p style={{ margin: "0 0 8px", fontWeight: 900 }}>{item.q}</p>
              <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
                {item.a.map((opt, j) => (
                  <li key={j} style={{ ...subtle }}>
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended video (still nice to keep, embedded) */}
      <section style={card}>
        {sectionHeader("Recommended Video", "Optional")}
        <div style={{ ...divider }} />

        <p style={{ marginTop: 0, ...subtle }}>How do you make SMALL TALK in German?</p>

        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%",
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid #e2e8f0",
            background: "#000",
          }}
        >
          <iframe
            title="Small Talk in German"
            src={`https://www.youtube.com/embed/r-DuOo0vrqc`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
      </section>

      <footer style={{ marginTop: 14, textAlign: "center", ...subtle }}>
        Tip: Practice in pairs. Ask one question, answer briefly, then ask back: “Und du?”
      </footer>
    </main>
  );
};

export default SmallTalkWorkbookPage;
