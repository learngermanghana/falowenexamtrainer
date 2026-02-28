import React, { useMemo, useState } from "react";

const page = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "22px 16px 40px",
  color: "#0f172a",
};

const card = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 18,
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
  fontWeight: 900,
  fontSize: 12,
};

const divider = { height: 1, background: "#e2e8f0", margin: "14px 0" };

const chipRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  alignItems: "center",
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
  fontWeight: 900,
  textDecoration: "none",
  width: "fit-content",
};

const solidBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #0f172a",
  background: "#0f172a",
  color: "#fff",
  fontWeight: 900,
  textDecoration: "none",
  width: "fit-content",
};

const callout = {
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  borderRadius: 16,
  padding: 12,
};

const imgWrap = {
  borderRadius: 16,
  overflow: "hidden",
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
};

const imgStyle = {
  width: "100%",
  height: 200,
  objectFit: "cover",
  display: "block",
};

const keywordPill = {
  display: "inline-flex",
  alignItems: "center",
  padding: "6px 10px",
  borderRadius: 999,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  color: "#0f172a",
  fontWeight: 900,
  fontSize: 12,
};

const qBox = {
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 12,
  background: "#fff",
};

const sectionHeader = (title, tag) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {tag ? <span style={badge}>{tag}</span> : null}
  </div>
);

// Some networks block certain hotlinks.
// We use a proxy fallback if needed.
const proxy = (url) => `https://images.weserv.nl/?url=${encodeURIComponent(url.replace(/^https?:\/\//, ""))}`;

const PracticeLink =
  "https://script.google.com/macros/s/AKfycbzMIhHuWKqM2ODaOCgtS7uZCikiZJRBhpqv2p6OyBmK1yAVba8HlmVC1zgTcGWSTfrsHA/exec";

// Stable Unsplash image URLs (not source.unsplash.com random queries)
const rawImages = {
  hero: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1800&q=70",
  teil1: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=70",
  teil2: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1800&q=70",
  teil3: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=70",
  teil4: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1800&q=70",
};

const Img = ({ src, alt }) => {
  const [failed, setFailed] = useState(false);
  return (
    <div style={imgWrap}>
      <img
        src={failed ? proxy(src) : src}
        alt={alt}
        style={imgStyle}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
};

const MCQBlock = ({ title, options }) => (
  <div style={qBox}>
    <p style={{ margin: "0 0 8px", fontWeight: 900 }}>{title}</p>
    <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
      {options.map((opt, idx) => (
        <li key={idx} style={subtle}>
          {opt}
        </li>
      ))}
    </ul>
  </div>
);

/**
 * ✅ Real Mind Map UI (no external libs)
 * - Center node: "Small Talk"
 * - Branch cards: Arbeit, Hobbys, Familie, Wetter, Reisen
 * - Each card: keywords + example questions
 */
const MindMap = ({ title, subtitle, branches, centerKeywords = [] }) => {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 18,
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        padding: 14,
      }}
    >
      <div style={{ display: "grid", gap: 10 }}>
        {/* Top header line in mind map */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "baseline" }}>
          <p style={{ margin: 0, fontWeight: 900, fontSize: 16 }}>{title}</p>
          {subtitle ? <p style={{ margin: 0, ...subtle }}>{subtitle}</p> : null}
        </div>

        {/* Map */}
        <div
          style={{
            display: "grid",
            gap: 14,
            gridTemplateColumns: "1fr",
          }}
        >
          {/* Center */}
          <div style={{ display: "grid", placeItems: "center" }}>
            <div
              style={{
                borderRadius: 999,
                padding: "12px 16px",
                border: "2px solid #bfdbfe",
                background: "#eff6ff",
                fontWeight: 1000,
                color: "#1e3a8a",
                textAlign: "center",
                minWidth: 220,
              }}
            >
              {title}
              {centerKeywords.length ? (
                <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                  {centerKeywords.map((k) => (
                    <span key={k} style={keywordPill}>
                      {k}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* Branch grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: 12,
            }}
          >
            {branches.map((b) => (
              <div
                key={b.key}
                style={{
                  gridColumn: "span 12",
                  border: "1px solid #e2e8f0",
                  borderRadius: 16,
                  padding: 12,
                  background: "#fff",
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 12,
                      display: "grid",
                      placeItems: "center",
                      border: "1px solid #e2e8f0",
                      background: "#f8fafc",
                      fontSize: 18,
                    }}
                    aria-hidden="true"
                  >
                    {b.icon}
                  </span>
                  <p style={{ margin: 0, fontWeight: 1000 }}>{b.title}</p>
                </div>

                {b.keywords?.length ? (
                  <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {b.keywords.map((k) => (
                      <span key={k} style={keywordPill}>
                        {k}
                      </span>
                    ))}
                  </div>
                ) : null}

                {b.questions?.length ? (
                  <div style={{ marginTop: 10 }}>
                    <p style={{ margin: "0 0 8px", fontWeight: 900 }}>Beispielfragen</p>
                    <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
                      {b.questions.map((q) => (
                        <li key={q} style={{ ...subtle, lineHeight: 1.6 }}>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {/* Responsive: on wide screens, make it 2 columns */}
          <style>{`
            @media (min-width: 860px) {
              .mind-branches {
                grid-template-columns: repeat(12, 1fr);
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

const SmallTalkWorkbookPage = () => {
  const mindBranches = useMemo(
    () => [
      {
        key: "arbeit",
        title: "Arbeit",
        icon: "💼",
        keywords: ["Job", "Büro", "Kollege", "Chef", "Pause"],
        questions: ["Wo arbeitest du?", "Was machst du beruflich?", "Gefällt dir deine Arbeit? Warum?"],
      },
      {
        key: "hobbys",
        title: "Sport & Hobbys",
        icon: "⚽",
        keywords: ["Sport", "Training", "Freizeit", "Spaziergang", "lesen"],
        questions: ["Machst du gerne Sport?", "Was machst du in deiner Freizeit?", "Hast du ein Hobby?"],
      },
      {
        key: "familie",
        title: "Familie",
        icon: "👨‍👩‍👧‍👦",
        keywords: ["Eltern", "Bruder", "Schwester", "Kinder", "Großeltern"],
        questions: ["Hast du Geschwister?", "Wie heißt dein Bruder/deine Schwester?", "Wohnst du mit deiner Familie?"],
      },
      {
        key: "wetter",
        title: "Wetter",
        icon: "☀️",
        keywords: ["sonnig", "kalt", "warm", "regnerisch", "windig"],
        questions: ["Wie ist das Wetter heute?", "Magst du den Sommer?", "Was machst du bei Regen?"],
      },
      {
        key: "reisen",
        title: "Reisen",
        icon: "✈️",
        keywords: ["Urlaub", "Ausland", "Hotel", "Flug", "Reisepass"],
        questions: ["Warst du schon mal im Ausland?", "Wohin möchtest du reisen?", "Was ist dein Lieblingsland?"],
      },
    ],
    []
  );

  return (
    <main style={page}>
      {/* HERO */}
      <section style={{ ...card, padding: 0, overflow: "hidden", borderRadius: 18, marginBottom: 14 }}>
        <div style={{ position: "relative" }}>
          <img src={rawImages.hero} alt="Small talk in German" style={{ ...imgStyle, height: 240 }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(2,6,23,0.60) 0%, rgba(2,6,23,0.18) 60%, rgba(255,255,255,0.0) 100%)",
            }}
          />
          <div style={{ position: "absolute", left: 16, right: 16, top: 16, display: "grid", gap: 8 }}>
            <div style={chipRow}>
              <span style={badge}>A2 Workbook</span>
              <span style={badge}>Chapter 1.1</span>
              <span style={{ ...badge, background: "#f8fafc", borderColor: "#e2e8f0", color: "#0f172a" }}>
                Assignment
              </span>
            </div>

            <h1 style={{ margin: 0, color: "#fff", letterSpacing: -0.2 }}>Small Talk 1.1 (Exercise)</h1>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.92)", maxWidth: 860, lineHeight: 1.55 }}>
              Practice basic greetings and small talk. Read and practice. Answer in your course typing area.
            </p>
          </div>
        </div>

        <div style={{ padding: 16, display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 12 }}>
            <div style={{ ...card, boxShadow: "none", borderRadius: 16 }}>
              <div style={chipRow}>
                <span style={badge}>Objectives</span>
              </div>
              <ul style={{ margin: "10px 0 0", paddingLeft: 18, display: "grid", gap: 8 }}>
                <li>Start a conversation with simple A2 questions.</li>
                <li>Talk about work, hobbies, family, weather, and travel.</li>
                <li>Use polite expressions and end a conversation naturally.</li>
              </ul>
            </div>

            <div style={{ ...card, boxShadow: "none", borderRadius: 16, display: "grid", gap: 10 }}>
              <div style={chipRow}>
                <span style={badge}>Practice</span>
              </div>
              <p style={{ margin: 0, ...subtle, lineHeight: 1.6 }}>
                You can also use this link to practice (Question for the Day).
              </p>
              <a href={PracticeLink} target="_blank" rel="noreferrer" style={solidBtn}>
                Open Practice Link
              </a>
            </div>
          </div>

          <div style={{ ...card, boxShadow: "none", borderRadius: 16 }}>
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
        <div style={divider} />

        <Img src={rawImages.teil1} alt="Group conversation" />

        <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
          {/* Main discussion box */}
          <div style={callout}>
            <p style={{ margin: "0 0 8px", fontWeight: 1000 }}>Diskussionsthema</p>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              <strong>Hauptfrage:</strong> Kannst du dich vorstellen? Erzähl uns etwas über dich!
            </p>
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
              <span style={keywordPill}>Familie</span>
              <span style={keywordPill}>Sprachen</span>
              <span style={keywordPill}>Beruf/Studium</span>
              <span style={keywordPill}>Hobbys</span>
              <span style={keywordPill}>Wetter</span>
              <span style={keywordPill}>Reisen</span>
            </div>

            <div style={{ marginTop: 10 }}>
              <p style={{ margin: "0 0 6px", fontWeight: 900 }}>Practice link</p>
              <a href={PracticeLink} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontWeight: 1000 }}>
                {PracticeLink}
              </a>
            </div>
          </div>

          {/* Real mind map */}
          <MindMap
            title="Small Talk"
            subtitle="Brain Map (keywords + example questions)"
            centerKeywords={["Begrüßung", "Themen", "Höflich", "Ende"]}
            branches={mindBranches}
          />

          {/* Greeting + polite + ending boxes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            <div style={{ ...qBox, background: "#f8fafc" }}>
              <p style={{ margin: "0 0 8px", fontWeight: 1000 }}>Begrüßung und Einstieg</p>
              <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
                <li>Hallo, wie geht es dir?</li>
                <li>Woher kommst du?</li>
                <li>Schön, dich kennenzulernen.</li>
              </ul>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ ...qBox, background: "#f8fafc" }}>
                <p style={{ margin: "0 0 8px", fontWeight: 1000 }}>Höfliche Ausdrücke</p>
                <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
                  <li>Könntest du das bitte wiederholen?</li>
                  <li>Das klingt interessant!</li>
                  <li>Entschuldigung, ich habe dich nicht verstanden.</li>
                </ul>
              </div>

              <div style={{ ...qBox, background: "#f8fafc" }}>
                <p style={{ margin: "0 0 8px", fontWeight: 1000 }}>Gespräch beenden</p>
                <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
                  <li>Es war schön, mit dir zu sprechen.</li>
                  <li>Ich wünsche dir einen schönen Tag!</li>
                  <li>Bis bald!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEIL 2 */}
      <section id="teil2" style={{ ...card, marginBottom: 12 }}>
        {sectionHeader("Teil 2 (Schreiben)", "Exercise")}
        <div style={divider} />
        <Img src={rawImages.teil2} alt="Writing a letter" />

        <p style={{ marginTop: 12 }}>
          <strong>Aufgabe:</strong> Schreibe einen Brief an deinen Freund Felix. In deinem Brief möchtest du über deine
          Arbeit und Familie sprechen.
        </p>

        <ol style={{ marginTop: 8 }}>
          <li>Warum schreibst du?</li>
          <li>Erzähle Felix etwas über deine Arbeit und deine Familie.</li>
          <li>Frage Felix, wie es ihm geht und was bei ihm neu ist.</li>
        </ol>

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12, display: "grid", gap: 10 }}>
          <p style={{ margin: 0, fontWeight: 1000 }}>Struktur des Briefes</p>

          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ ...qBox, background: "#f8fafc" }}>
              <p style={{ margin: "0 0 6px", fontWeight: 1000 }}>Einleitung</p>
              <p style={{ margin: 0, ...subtle }}>
                „Lieber Felix,“ <br />
                „Wie geht es dir? Ich hoffe, es geht dir gut.“
              </p>
            </div>

            <div style={{ ...qBox, background: "#f8fafc" }}>
              <p style={{ margin: "0 0 6px", fontWeight: 1000 }}>Hauptteil</p>
              <p style={{ margin: 0, ...subtle, lineHeight: 1.65 }}>
                „Ich schreibe dir, weil …“ <br />
                Erzähle über deine Arbeit. <br />
                Erzähle etwas Neues über deine Familie. <br />
                Verwende: <strong>weil</strong>, <strong>denn</strong>, <strong>deshalb</strong>.
              </p>
            </div>

            <div style={{ ...qBox, background: "#f8fafc" }}>
              <p style={{ margin: "0 0 6px", fontWeight: 1000 }}>Schluss</p>
              <p style={{ margin: 0, ...subtle, lineHeight: 1.65 }}>
                „Wie geht es dir? Was hast du zuletzt gemacht?“ <br />
                „Ich freue mich auf deine Antwort.“ <br />
                „Viele Grüße, Dein Vorname“
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12, ...callout }}>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            You can also use this link to practice:
            <br />
            <a href={PracticeLink} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontWeight: 1000 }}>
              {PracticeLink}
            </a>
          </p>
        </div>
      </section>

      {/* TEIL 3 */}
      <section id="teil3" style={{ ...card, marginBottom: 12 }}>
        {sectionHeader("Teil 3 (Lesen)", "Multiple Choice")}
        <div style={divider} />
        <Img src={rawImages.teil3} alt="Reading in a cafe" />

        <p style={{ marginTop: 12, lineHeight: 1.7 }}>
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
          <p style={{ margin: 0, fontWeight: 1000 }}>Fragen und mögliche Antworten (no keys)</p>

          <MCQBlock
            title="1. Wo arbeitet Lisa?"
            options={["A. In einem Büro", "B. In einem Café", "C. In einer Schule", "D. In einem Krankenhaus"]}
          />
          <MCQBlock
            title="2. Warum liebt Lisa ihren Beruf?"
            options={[
              "A. Weil sie gerne reist",
              "B. Weil sie gerne mit Kindern arbeitet",
              "C. Weil sie Tennis mag",
              "D. Weil sie gerne im Büro arbeitet",
            ]}
          />
          <MCQBlock
            title="3. Wo arbeitet die erzählende Person?"
            options={["A. In einem Büro", "B. In einer Schule", "C. In einem Café", "D. In einem Krankenhaus"]}
          />
          <MCQBlock title="4. Welchen Sport mag Lisa?" options={["A. Fußball", "B. Tennis", "C. Schwimmen", "D. Volleyball"]} />
          <MCQBlock
            title="5. Wie war das Wetter gestern?"
            options={["A. Es war regnerisch", "B. Es war sonnig und warm", "C. Es war kalt", "D. Es war windig"]}
          />
          <MCQBlock
            title="6. In welchen Ländern war Lisa schon?"
            options={[
              "A. Frankreich und Deutschland",
              "B. Italien und Spanien",
              "C. Österreich und Schweiz",
              "D. Griechenland und Kroatien",
            ]}
          />
          <MCQBlock
            title="7. Warum mag die erzählende Person den Herbst?"
            options={[
              "A. Weil es sonnig ist",
              "B. Weil es warm ist",
              "C. Weil die Bäume so schön bunt sind",
              "D. Weil sie gerne Tennis spielt",
            ]}
          />
        </div>

        <div style={{ marginTop: 12, ...callout }}>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            You can also use this link to practice:
            <br />
            <a href={PracticeLink} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontWeight: 1000 }}>
              {PracticeLink}
            </a>
          </p>
        </div>
      </section>

      {/* TEIL 4 */}
      <section id="teil4" style={{ ...card }}>
        {sectionHeader("Teil 4 (Hören)", "Audio • Multiple Choice")}
        <div style={divider} />
        <Img src={rawImages.teil4} alt="Listening with headphones" />

        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          <div style={chipRow}>
            <span style={badge}>Audio link</span>
            <a
              href="https://drive.google.com/file/d/1UXO1nHeBxOt8TS8dpp68xXr4Txjzu-NZ/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              style={outlineBtn}
            >
              Open Audio (Google Drive)
            </a>
          </div>
          <p style={{ margin: 0, ...subtle, lineHeight: 1.6 }}>
            Listen 2–3 times, then choose the best answer (A–D) in your course typing area.
          </p>
        </div>

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12, display: "grid", gap: 12 }}>
          <p style={{ margin: 0, fontWeight: 1000 }}>Fragen und mögliche Antworten (no keys)</p>

          <MCQBlock
            title="1. Was hat Lena am Samstag vor?"
            options={[
              "A. Mit ihrer Freundin spazieren gehen",
              "B. Ins Kino gehen",
              "C. Tennis spielen",
              "D. Einen Spaziergang im Park machen",
            ]}
          />
          <MCQBlock
            title="2. Warum freut sich Lena auf den Actionfilm?"
            options={[
              "A. Weil sie spannende Geschichten liebt",
              "B. Weil sie Comedy-Filme mag",
              "C. Weil sie den Film schon gesehen hat",
              "D. Weil sie Horrorfilme liebt",
            ]}
          />
          <MCQBlock title="3. Welche Sportart betreibt Lena regelmäßig?" options={["A. Tennis", "B. Schwimmen", "C. Laufen", "D. Yoga"]} />
          <MCQBlock
            title="4. Wie war das Wetter am letzten Wochenende?"
            options={[
              "A. Es war regnerisch und kühl",
              "B. Es war sonnig und warm",
              "C. Es war bewölkt und windig",
              "D. Es war kalt und frostig",
            ]}
          />
          <MCQBlock
            title="5. Was schlägt Lena für das nächste Treffen vor?"
            options={["A. Ins Kino gehen", "B. Gemeinsam Tennis spielen", "C. Einen Spaziergang machen", "D. Kaffee trinken gehen"]}
          />
        </div>

        <div style={{ marginTop: 12, ...callout }}>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            You can also use this link to practice:
            <br />
            <a href={PracticeLink} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontWeight: 1000 }}>
              {PracticeLink}
            </a>
          </p>
        </div>
      </section>

      <footer style={{ marginTop: 16, textAlign: "center", ...subtle }}>
        Tip: Practice in pairs. Ask one question, answer briefly, then ask back: “Und du?”
      </footer>
    </main>
  );
};

export default SmallTalkWorkbookPage;
