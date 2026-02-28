import React, { useMemo, useState } from "react";

const sectionStyle = {
  background: "#fff",
  border: "1px solid #dbe7ff",
  borderRadius: 12,
  padding: 16,
  boxShadow: "0 4px 14px rgba(15, 23, 42, 0.05)",
};

const pillStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 10px",
  borderRadius: 999,
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  color: "#1e3a8a",
  fontWeight: 700,
  fontSize: 12,
};

const muted = { color: "#475569" };

const SmallTalkWorkbookPage = () => {
  // ✅ Replace the old "Recommended Video" section with an in-app YouTube embed
  const videoId = "r-DuOo0vrqc";

  // ✅ In-app workbook: MCQs with selectable answers + reveal keys (optional)
  const lesenQuestions = useMemo(
    () => [
      {
        id: "L1",
        q: "1. Wo arbeitet Lisa?",
        options: { A: "In einem Büro", B: "In einem Café", C: "In einer Schule", D: "In einem Krankenhaus" },
        answer: "C",
      },
      {
        id: "L2",
        q: "2. Warum liebt Lisa ihren Beruf?",
        options: {
          A: "Weil sie gerne reist",
          B: "Weil sie gerne mit Kindern arbeitet",
          C: "Weil sie Tennis mag",
          D: "Weil sie gerne im Büro arbeitet",
        },
        answer: "B",
      },
      {
        id: "L3",
        q: "3. Wo arbeitet die erzählende Person?",
        options: { A: "In einem Büro", B: "In einer Schule", C: "In einem Café", D: "In einem Krankenhaus" },
        answer: "A",
      },
      {
        id: "L4",
        q: "4. Welchen Sport mag Lisa?",
        options: { A: "Fußball", B: "Tennis", C: "Schwimmen", D: "Volleyball" },
        answer: "B",
      },
      {
        id: "L5",
        q: "5. Wie war das Wetter gestern?",
        options: { A: "Es war regnerisch", B: "Es war sonnig und warm", C: "Es war kalt", D: "Es war windig" },
        answer: "B",
      },
      {
        id: "L6",
        q: "6. In welchen Ländern war Lisa schon?",
        options: { A: "Frankreich und Deutschland", B: "Italien und Spanien", C: "Österreich und Schweiz", D: "Griechenland und Kroatien" },
        answer: "B",
      },
      {
        id: "L7",
        q: "7. Warum mag die erzählende Person den Herbst?",
        options: {
          A: "Weil es sonnig ist",
          B: "Weil es warm ist",
          C: "Weil die Bäume so schön bunt sind",
          D: "Weil sie gerne Tennis spielt",
        },
        answer: "C",
      },
    ],
    []
  );

  const horenQuestions = useMemo(
    () => [
      {
        id: "H1",
        q: "1. Was hat Lena am Samstag vor?",
        options: {
          A: "Mit ihrer Freundin spazieren gehen",
          B: "Ins Kino gehen",
          C: "Tennis spielen",
          D: "Einen Spaziergang im Park machen",
        },
        answer: "B",
      },
      {
        id: "H2",
        q: "2. Warum freut sich Lena auf den Actionfilm?",
        options: {
          A: "Weil sie spannende Geschichten liebt",
          B: "Weil sie Comedy-Filme mag",
          C: "Weil sie den Film schon gesehen hat",
          D: "Weil sie Horrorfilme liebt",
        },
        answer: "A",
      },
      {
        id: "H3",
        q: "3. Welche Sportart betreibt Lena regelmäßig?",
        options: { A: "Tennis", B: "Schwimmen", C: "Laufen", D: "Yoga" },
        answer: "D",
      },
      {
        id: "H4",
        q: "4. Wie war das Wetter am letzten Wochenende?",
        options: {
          A: "Es war regnerisch und kühl",
          B: "Es war sonnig und warm",
          C: "Es war bewölkt und windig",
          D: "Es war kalt und frostig",
        },
        answer: "B",
      },
      {
        id: "H5",
        q: "5. Was schlägt Lena für das nächste Treffen vor?",
        options: { A: "Ins Kino gehen", B: "Gemeinsam Tennis spielen", C: "Einen Spaziergang machen", D: "Kaffee trinken gehen" },
        answer: "D",
      },
    ],
    []
  );

  const [lesen, setLesen] = useState(() => Object.fromEntries(lesenQuestions.map((q) => [q.id, ""])));
  const [horen, setHoren] = useState(() => Object.fromEntries(horenQuestions.map((q) => [q.id, ""])));
  const [showKeys, setShowKeys] = useState(false);

  const scoreLesen = useMemo(() => {
    let s = 0;
    for (const q of lesenQuestions) if (lesen[q.id] && lesen[q.id] === q.answer) s += 1;
    return s;
  }, [lesen, lesenQuestions]);

  const scoreHoren = useMemo(() => {
    let s = 0;
    for (const q of horenQuestions) if (horen[q.id] && horen[q.id] === q.answer) s += 1;
    return s;
  }, [horen, horenQuestions]);

  const AudioLinkCard = () => (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <span style={pillStyle}>Audio</span>
        <a
          href="https://drive.google.com/file/d/1UXO1nHeBxOt8TS8dpp68xXr4Txjzu-NZ/view?usp=sharing"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#2563eb", fontWeight: 700 }}
        >
          Open Audio (Google Drive)
        </a>
      </div>
      <p style={{ margin: 0, ...muted, lineHeight: 1.6 }}>
        Open the audio in a new tab, listen 2–3 times, then answer the questions below.
      </p>
    </div>
  );

  const QuestionBlock = ({ item, value, onChange, showAnswer }) => (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#ffffff" }}>
      <p style={{ margin: "0 0 8px", fontWeight: 800 }}>{item.q}</p>
      <div style={{ display: "grid", gap: 8 }}>
        {Object.entries(item.options).map(([key, text]) => (
          <label
            key={key}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              background: value === key ? "#eff6ff" : "#fff",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name={item.id}
              value={key}
              checked={value === key}
              onChange={() => onChange(key)}
              style={{ marginTop: 3 }}
            />
            <div style={{ lineHeight: 1.5 }}>
              <strong>{key}.</strong> {text}
            </div>
          </label>
        ))}
      </div>
      {showAnswer && (
        <p style={{ margin: "10px 0 0", ...muted }}>
          Correct answer: <strong>{item.answer}</strong>
        </p>
      )}
    </div>
  );

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "20px 16px 32px", color: "#0f172a" }}>
      <header style={{ marginBottom: 16 }}>
        <p style={{ margin: "0 0 8px", color: "#2563eb", fontWeight: 900 }}>A2 Workbook • Chapter 1.1</p>
        <h1 style={{ margin: "0 0 6px" }}>Small Talk 1.1 (Exercise)</h1>
        <p style={{ margin: 0, lineHeight: 1.5, ...muted }}>
          Practice basic greetings and small talk. Work through each Teil in order.
        </p>
      </header>

      {/* ✅ Teil 1 — Brain Map (Sprechen) */}
      <section style={{ ...sectionStyle, marginBottom: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Teil 1 (Sprechen) — Brain Map + Group Practice</h2>
          <span style={pillStyle}>Group Practice</span>
        </div>

        <p style={{ marginTop: 10 }}>
          In this chapter, we'll engage in group exercises discussing these topics. Following this, I'll revise the
          questions and invite you to write a brief essay about yourself.
        </p>

        <p style={{ margin: "12px 0 8px" }}>
          <strong>1. Zentrales Thema:</strong> Small Talk
        </p>

        <div style={{ display: "grid", gap: 10 }}>
          <div>
            <p style={{ margin: "0 0 6px", fontWeight: 800 }}>Begrüßung und Einstieg</p>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Hallo, wie geht es dir?</li>
              <li>Woher kommst du?</li>
              <li>Schön, dich kennenzulernen.</li>
            </ul>
          </div>

          <div>
            <p style={{ margin: "0 0 6px", fontWeight: 800 }}>Themen für Small Talk</p>
            <ol style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
              <li>
                <strong>Arbeit</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                  <li>Wo arbeitest du? — Ich arbeite in einem Büro.</li>
                  <li>Was machst du beruflich? — Ich bin Lehrer.</li>
                </ul>
              </li>
              <li>
                <strong>Sport und Hobbys</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                  <li>Machst du gerne Sport? — Ja, ich spiele gern Fußball.</li>
                  <li>Hast du ein Hobby? — Ich lese gern Bücher.</li>
                </ul>
              </li>
              <li>
                <strong>Familie</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                  <li>Hast du Geschwister? — Ja, ich habe eine Schwester.</li>
                  <li>Wie heißt dein Bruder? — Er heißt Max.</li>
                </ul>
              </li>
              <li>
                <strong>Wetter</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                  <li>Wie ist das Wetter heute? — Es ist sonnig und warm.</li>
                  <li>Magst du den Sommer? — Ja, ich liebe den Sommer.</li>
                </ul>
              </li>
              <li>
                <strong>Reisen</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                  <li>Warst du schon mal im Ausland? — Ja, ich war in Italien.</li>
                  <li>Wohin möchtest du reisen? — Ich möchte nach Spanien reisen.</li>
                </ul>
              </li>
            </ol>
          </div>

          <div>
            <p style={{ margin: "0 0 6px", fontWeight: 800 }}>Höfliche Ausdrücke</p>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Könntest du das bitte wiederholen?</li>
              <li>Das klingt interessant!</li>
              <li>Entschuldigung, ich habe dich nicht verstanden.</li>
            </ul>
          </div>

          <div>
            <p style={{ margin: "0 0 6px", fontWeight: 800 }}>Gespräch beenden</p>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Es war schön, mit dir zu sprechen.</li>
              <li>Ich wünsche dir einen schönen Tag!</li>
              <li>Bis bald!</li>
            </ul>
          </div>

          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12 }}>
            <p style={{ margin: "0 0 6px", fontWeight: 900 }}>Sprachliche Hilfen</p>
            <div style={{ display: "grid", gap: 8 }}>
              <p style={{ margin: 0 }}>
                <strong>Einleitung:</strong> Small Talk ist eine gute Möglichkeit, um neue Leute kennenzulernen.
              </p>
              <p style={{ margin: 0 }}>
                <strong>Hauptteil:</strong> Ein gutes Thema für Small Talk ist die Arbeit, weil ...
              </p>
              <p style={{ margin: 0 }}>
                <strong>Beispiele:</strong> Man kann auch über das Wetter oder Hobbys sprechen, zum Beispiel ...
              </p>
              <p style={{ margin: 0 }}>
                <strong>Schluss:</strong> Zusammenfassend kann man sagen, dass Small Talk einfach und nützlich ist.
              </p>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12 }}>
            <p style={{ margin: "0 0 6px", fontWeight: 900 }}>Diskussionsfragen (A2)</p>
            <p style={{ margin: 0, ...muted }}>
              Kannst du dich vorstellen? Erzähl uns etwas über dich: <strong>Familie</strong>, <strong>Sprachen</strong>,
              <strong> Beruf/Studium</strong>, <strong>Hobbys</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* ✅ Teil 2 — Schreiben */}
      <section style={{ ...sectionStyle, marginBottom: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Teil 2 (Schreiben) — Exercise</h2>
          <span style={pillStyle}>Write</span>
        </div>

        <p style={{ marginTop: 10 }}>
          <strong>Aufgabe:</strong> Schreibe einen Brief an deinen Freund Felix. In deinem Brief möchtest du über deine
          Arbeit und Familie sprechen.
        </p>

        <ol style={{ marginBottom: 10 }}>
          <li>Warum schreibst du?</li>
          <li>Erzähle Felix etwas über deine Arbeit und deine Familie.</li>
          <li>Frage Felix, wie es ihm geht und was bei ihm neu ist.</li>
        </ol>

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12, display: "grid", gap: 8 }}>
          <p style={{ margin: 0, fontWeight: 900 }}>Struktur des Briefes</p>
          <p style={{ margin: 0 }}>
            <strong>Einleitung:</strong> „Lieber Felix,“ • „Wie geht es dir? Ich hoffe, es geht dir gut.“
          </p>
          <p style={{ margin: 0 }}>
            <strong>Hauptteil:</strong> „Ich schreibe dir, weil ...“ • Arbeit • Familie • Konjunktionen: <em>weil</em>,{" "}
            <em>denn</em>, <em>deshalb</em>
          </p>
          <p style={{ margin: 0 }}>
            <strong>Schluss:</strong> „Wie geht es dir? Was hast du zuletzt gemacht?“ • „Ich freue mich auf deine
            Antwort.“ • „Viele Grüße, …“
          </p>
          <p style={{ margin: 0, ...muted }}>
            Write your answer in your course writing area (you already have the typing space there).
          </p>
        </div>
      </section>

      {/* ✅ Teil 3 — Lesen (in-app MCQ) */}
      <section style={{ ...sectionStyle, marginBottom: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Teil 3 (Lesen) — Multiple Choice</h2>
          <span style={pillStyle}>Read</span>
        </div>

        <p style={{ marginTop: 10, lineHeight: 1.6 }}>
          <strong>Text: Mein Gespräch mit Lisa</strong>
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

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 10 }}>
          <span style={pillStyle}>
            Score: {scoreLesen}/{lesenQuestions.length}
          </span>
          <button
            onClick={() => setShowKeys((s) => !s)}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 800,
            }}
            type="button"
          >
            {showKeys ? "Hide Answer Keys" : "Show Answer Keys"}
          </button>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {lesenQuestions.map((item) => (
            <QuestionBlock
              key={item.id}
              item={item}
              value={lesen[item.id]}
              onChange={(key) => setLesen((prev) => ({ ...prev, [item.id]: key }))}
              showAnswer={showKeys}
            />
          ))}
        </div>

        <p style={{ margin: "12px 0 0", ...muted }}>
          Note: Students already have the typing space in the course, so we only show questions + answers here.
        </p>
      </section>

      {/* ✅ Teil 4 — Hören (open link + in-app MCQ) */}
      <section style={{ ...sectionStyle, marginBottom: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Teil 4 (Hören) — Listen & Answer</h2>
          <span style={pillStyle}>Listen</span>
        </div>

        <div style={{ marginTop: 10 }}>
          <AudioLinkCard />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", margin: "12px 0 10px" }}>
          <span style={pillStyle}>
            Score: {scoreHoren}/{horenQuestions.length}
          </span>
          <button
            onClick={() => setShowKeys((s) => !s)}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 800,
            }}
            type="button"
          >
            {showKeys ? "Hide Answer Keys" : "Show Answer Keys"}
          </button>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {horenQuestions.map((item) => (
            <QuestionBlock
              key={item.id}
              item={item}
              value={horen[item.id]}
              onChange={(key) => setHoren((prev) => ({ ...prev, [item.id]: key }))}
              showAnswer={showKeys}
            />
          ))}
        </div>
      </section>

      {/* ✅ Replace URL-only video with in-app embed */}
      <section style={sectionStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Recommended Video</h2>
          <span style={pillStyle}>Watch</span>
        </div>

        <p style={{ marginTop: 10, ...muted }}>How do you make SMALL TALK in German?</p>

        <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0" }}>
          <iframe
            title="Small Talk in German"
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>

        <p style={{ margin: "10px 0 0", ...muted }}>
          If the video doesn’t load, open it on YouTube:{" "}
          <a href={`https://youtu.be/${videoId}`} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontWeight: 800 }}>
            https://youtu.be/{videoId}
          </a>
        </p>
      </section>
    </main>
  );
};

export default SmallTalkWorkbookPage;
