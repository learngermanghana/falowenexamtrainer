import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A1ExamObjectPicture from "./A1ExamObjectPicture";
import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
  border: "1px solid #e2e8f0",
  borderRadius: 18,
};

const Section = ({ eyebrow, title, children }) => (
  <section style={card}>
    <div style={{ display: "grid", gap: 4 }}>
      {eyebrow ? (
        <span style={{ color: "#475569", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6 }}>
          {eyebrow}
        </span>
      ) : null}
      <h2 style={{ margin: 0 }}>{title}</h2>
    </div>
    {children}
  </section>
);

const examParts = [
  ["Teil 1", "Sich vorstellen", "Introduce yourself and answer simple personal questions."],
  ["Teil 2", "Um Informationen bitten und Informationen geben", "Ask and answer a simple question using a topic card."],
  ["Teil 3", "Bitten formulieren und darauf reagieren", "Make a polite request from a picture/card and react to another person’s request."],
];

const examCardVerbs = [
  ["Flasche", "bottle", "öffnen", "open", "Können Sie bitte die Flasche öffnen?", "Öffnen Sie bitte die Flasche.", "Ja, gern."],
  ["Tür", "door", "schließen", "close", "Können Sie bitte die Tür schließen?", "Schließen Sie bitte die Tür.", "Ja, natürlich."],
  ["Bleistift", "pencil", "geben", "give", "Können Sie mir bitte den Bleistift geben?", "Geben Sie mir bitte den Bleistift.", "Natürlich, hier bitte."],
  ["Glas Wasser", "glass of water", "bringen", "bring", "Können Sie mir bitte ein Glas Wasser bringen?", "Bringen Sie mir bitte ein Glas Wasser.", "Ja, gern. Hier bitte."],
  ["Stadtplan", "city map", "zeigen", "show", "Können Sie mir bitte den Stadtplan zeigen?", "Zeigen Sie mir bitte den Stadtplan.", "Ja, natürlich."],
  ["Bleistift", "pencil", "leihen", "lend", "Können Sie mir bitte einen Bleistift leihen?", "Leihen Sie mir bitte einen Bleistift.", "Ja, gern."],
  ["Radio", "radio", "anmachen", "turn on", "Können Sie bitte das Radio anmachen?", "Machen Sie bitte das Radio an.", "Ja, natürlich."],
  ["Radio", "radio", "ausmachen", "turn off", "Können Sie bitte das Radio ausmachen?", "Machen Sie bitte das Radio aus.", "Ja, gern."],
  ["Stuhl", "chair", "holen", "fetch", "Können Sie bitte einen Stuhl holen?", "Holen Sie bitte einen Stuhl.", "Ja, natürlich."],
  ["Formular", "form", "unterschreiben", "sign", "Können Sie bitte das Formular unterschreiben?", "Unterschreiben Sie bitte das Formular.", "Ja, gern."],
];

const SpeakingExamIntroPage = () => (
  <main style={{ ...styles.container, display: "grid", gap: 16, maxWidth: 1080 }}>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <span style={{ borderRadius: 999, padding: "6px 10px", background: "#e0e7ff", color: "#3730a3", fontWeight: 800, fontSize: 12 }}>
        A1.2 · Day 15 · Chapter 4.7
      </span>
    </div>

    <header style={{ ...card, padding: "clamp(20px, 4vw, 34px)", background: "linear-gradient(135deg, #f8fafc, #eef2ff)" }}>
      <h1 style={{ ...styles.title, margin: 0 }}>Introduction to the Goethe A1 Speaking Exam</h1>
      <p style={{ margin: 0, lineHeight: 1.7, color: "#334155", maxWidth: 850 }}>
        First understand the complete speaking exam. Then practise today’s main skill in detail: <strong>Teil 3</strong>, where you make a polite request and react to a request.
      </p>
    </header>

    <Section eyebrow="Teacher lecture" title="Introduction to the speaking exam">
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Watch the teacher lecture first. It introduces the speaking exam before you work through the notes and illustrated picture-card examples below.
      </p>
      <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 14, overflow: "hidden", background: "#0f172a" }}>
        <iframe
          src="https://www.youtube-nocookie.com/embed/MPDY2x3suW8?rel=0"
          title="Teacher lecture: Introduction to the Goethe A1 Speaking Exam"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
      </div>
      <a
        href="https://youtu.be/MPDY2x3suW8"
        target="_blank"
        rel="noreferrer"
        style={{ color: "#3730a3", fontWeight: 800, width: "fit-content" }}
      >
        Open teacher lecture on YouTube
      </a>
    </Section>

    <Section eyebrow="Big picture" title="The three speaking parts">
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {['Part', 'What it is called', 'What you do'].map((heading) => (
                <th key={heading} style={{ border: "1px solid #e2e8f0", padding: 10, textAlign: "left" }}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {examParts.map((row) => (
              <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`} style={{ border: "1px solid #e2e8f0", padding: 10 }}>{index === 0 ? <strong>{cell}</strong> : cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ borderLeft: "4px solid #4f46e5", background: "#eef2ff", borderRadius: 10, padding: 12, lineHeight: 1.65 }}>
        <strong>Today’s focus:</strong> Teil 3. You are not expected to master every speaking part in one lesson; this page gives you the map first, then trains one part properly.
      </div>
    </Section>

    <Section eyebrow="Today's targets" title="By the end of this lesson, you should be able to">
      <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8, lineHeight: 1.65 }}>
        <li>name the three parts of the Goethe A1 speaking exam;</li>
        <li>choose a useful action verb for an everyday-object card, such as <strong>öffnen, geben</strong> or <strong>bringen</strong>;</li>
        <li>make a polite formal request using <strong>Können Sie bitte ...?</strong> or the Sie-imperative;</li>
        <li>accept or refuse a simple request politely.</li>
      </ol>
    </Section>

    <Section eyebrow="Teil 3 core" title="Picture-card verbs you really need">
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Goethe A1 Sprechen Teil 3 uses everyday objects, such as a bottle, pencil, chair,
        glass of water or radio. Look at the object, choose a suitable action, make
        a polite request, and react to the other person's request.
      </p>
      <div style={{ border: "1px solid #bfdbfe", background: "#eff6ff", borderRadius: 14, padding: 14, display: "grid", gap: 8 }}>
        <strong style={{ fontSize: 20 }}>Können Sie (mir) bitte + object + Infinitiv?</strong>
        <span><strong>Können</strong> comes first, then <strong>Sie</strong>. The main verb goes at the end. Use <strong>mir</strong> when asking someone to give, bring, show or lend something to you.</span>
        <span><strong>Examples:</strong> Können Sie bitte die Flasche öffnen? / Können Sie mir bitte den Bleistift geben?</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
        {examCardVerbs.map(([picture, meaning, verb, translation, request, , reaction], index) => (
          <div key={verb} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, display: "grid", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <A1ExamObjectPicture label={picture} />
              <div style={{ display: "grid", gap: 3, minWidth: 0 }}>
                <strong>{index + 1}. {picture} <span style={{ fontWeight: 400, color: "#64748b" }}>({meaning})</span></strong>
                <span style={{ color: "#3730a3", fontSize: 14, fontWeight: 800 }}>{verb} <span style={{ fontWeight: 400 }}>· {translation}</span></span>
              </div>
            </div>
            <strong>{request}</strong>
            <span style={{ color: "#475569", fontSize: 13 }}><strong>Reaction:</strong> {reaction}</span>
          </div>
        ))}
      </div>
      <p style={{ margin: 0, color: "#475569", fontSize: 13, lineHeight: 1.6 }}>
        Extra useful verbs: <strong>benutzen</strong> (Kann ich bitte Ihr Telefon benutzen?),
        <strong> nehmen</strong> (Nehmen Sie bitte Platz.) and <strong>rauchen</strong>
        (Rauchen Sie hier bitte nicht.). Save <em>helfen, warten, wiederholen</em>
        and <em>langsamer sprechen</em> for other classroom situations.
      </p>
    </Section>

    <Section eyebrow="Alternative" title="Sie-Imperativ with the same exam verbs">
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        You can also use a formal imperative: <strong>Verb + Sie + bitte</strong>.
        For separable verbs such as <em>anmachen</em> and <em>ausmachen</em>,
        the prefix goes to the end. <strong>Können Sie bitte ...?</strong> is a
        reliable beginner-friendly alternative.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Verb", "Sie-Imperativ", "Question with können"].map((heading) => (
                <th key={heading} style={{ border: "1px solid #e2e8f0", padding: 10, textAlign: "left" }}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {examCardVerbs.map(([, , verb, translation, request, imperative]) => (
              <tr key={verb}>
                <td style={{ border: "1px solid #e2e8f0", padding: 10, verticalAlign: "top" }}>
                  <strong>{verb}</strong><span style={{ display: "block", color: "#475569", fontSize: 13 }}>{translation}</span>
                </td>
                <td style={{ border: "1px solid #e2e8f0", padding: 10, verticalAlign: "top" }}>{imperative}</td>
                <td style={{ border: "1px solid #e2e8f0", padding: 10, verticalAlign: "top" }}>{request}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>

    <Section eyebrow="Reacting" title="Accept or refuse politely">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
        <div style={{ border: "1px solid #bbf7d0", background: "#f0fdf4", borderRadius: 14, padding: 14, display: "grid", gap: 6 }}>
          <strong>Accept</strong>
          {[
            ["Ja, natürlich.", "Yes, of course."],
            ["Ja, gern.", "Yes, I'd be happy to."],
            ["Natürlich, hier bitte.", "Of course, here you go."],
          ].map(([german, english]) => (
            <div key={german} style={{ display: "grid", gap: 2 }}>
              <span style={{ fontWeight: 600 }}>{german}</span>
              <span lang="en" style={{ color: "#475569", fontSize: 13 }}>{english}</span>
            </div>
          ))}
        </div>
        <div style={{ border: "1px solid #fecdd3", background: "#fff1f2", borderRadius: 14, padding: 14, display: "grid", gap: 6 }}>
          <strong>Refuse</strong>
          {[
            ["Tut mir leid, das geht leider nicht.", "I'm sorry, that's not possible."],
            ["Leider kann ich nicht.", "Unfortunately, I can't."],
            ["Entschuldigung, das ist leider nicht möglich.", "I'm sorry, unfortunately that's not possible."],
          ].map(([german, english]) => (
            <div key={german} style={{ display: "grid", gap: 2 }}>
              <span style={{ fontWeight: 600 }}>{german}</span>
              <span lang="en" style={{ color: "#475569", fontSize: 13 }}>{english}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>

    <Section eyebrow="Official practice" title="Continue with Goethe material">
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Use the official Goethe A1 speaking practice to try the picture prompts independently, without copying the model sentences above.
      </p>
      <a href="https://bfu.goethe.de/a1_sd1/sprechen.php" target="_blank" rel="noreferrer" style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none" }}>
        Open official Goethe A1 speaking practice
      </a>
    </Section>

    <Section eyebrow="Self-check" title="You are ready when you can do these three things">
      <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8, lineHeight: 1.65 }}>
        <li>Explain what happens in Teil 1, Teil 2 and Teil 3.</li>
        <li>Choose the correct verb for a picture card (for example <strong>öffnen</strong> for <strong>Flasche</strong>).</li>
        <li>Make a request with <strong>Können Sie bitte ...?</strong> without copying a model.</li>
        <li>Respond naturally with a short acceptance or refusal.</li>
      </ul>
    </Section>
  </main>
);

export default SpeakingExamIntroPage;
