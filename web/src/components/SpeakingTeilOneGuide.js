import React, { useMemo, useState } from "react";
import { styles } from "../styles";

export const SPEAKING_TEIL_ONE_GUIDES = {
  A1: {
    title: "Introduce yourself clearly",
    target: "30–45 seconds",
    goal: "Give a short, complete introduction without reading every word.",
    plan: [
      "Name and age",
      "Country and city",
      "Work, school, or studies",
      "Languages",
      "One or two hobbies",
      "A friendly closing sentence",
    ],
    starters: [
      "Ich heiße … / Mein Name ist …",
      "Ich bin … Jahre alt.",
      "Ich komme aus … und wohne in …",
      "Ich arbeite als … / Ich lerne …",
      "In meiner Freizeit …",
      "Vielen Dank. Das war meine Vorstellung.",
    ],
    model:
      "Guten Tag. Ich heiße Ama und bin 24 Jahre alt. Ich komme aus Ghana und wohne in Accra. Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte. In meiner Freizeit höre ich Musik und koche gern. Vielen Dank.",
    checks: ["I covered at least five personal points.", "I used full sentences.", "I spoke slowly and clearly."],
  },
  A2: {
    title: "Talk about yourself and one familiar topic",
    target: "60–90 seconds",
    goal: "Connect personal details with a reason, example, feeling, or short opinion.",
    plan: [
      "Introduce the topic",
      "Say what you normally do",
      "Give two useful details",
      "Add one reason with weil",
      "Give a personal example",
      "Finish with a short opinion",
    ],
    starters: [
      "Heute spreche ich über …",
      "Normalerweise …",
      "Besonders wichtig ist für mich …",
      "Ich mache das gern, weil …",
      "Zum Beispiel …",
      "Meiner Meinung nach …",
    ],
    model:
      "Heute spreche ich über meine Freizeit. Normalerweise spiele ich am Wochenende Fußball. Das macht mir Spaß, weil ich Zeit mit meinen Freunden verbringe. Zum Beispiel spielen wir jeden Samstag auf einem Sportplatz. Meiner Meinung nach ist Sport wichtig, denn man bleibt gesund.",
    checks: ["I used weil or denn correctly.", "I added a real example.", "My answer had a beginning and an ending."],
  },
  B1: {
    title: "Give a short, structured presentation",
    target: "2–3 minutes",
    goal: "Present the topic in a clear order and support your opinion with experience and examples.",
    plan: [
      "Introduce the topic and your structure",
      "Describe your personal experience",
      "Explain the situation in your country or community",
      "Present one advantage and one disadvantage",
      "State and justify your opinion",
      "Summarise and invite questions",
    ],
    starters: [
      "Ich möchte heute über … sprechen.",
      "Zuerst berichte ich von meiner Erfahrung.",
      "In meinem Heimatland ist es so, dass …",
      "Ein Vorteil ist …, allerdings …",
      "Ich bin der Meinung, dass …, weil …",
      "Damit bin ich am Ende. Haben Sie Fragen?",
    ],
    model:
      "Ich möchte heute über Online-Lernen sprechen. Zuerst berichte ich von meiner Erfahrung. Ich lerne oft online, weil ich dadurch Zeit spare. In meinem Heimatland nutzen viele junge Menschen Lernapps. Ein Vorteil ist die Flexibilität, allerdings fehlt manchmal der direkte Kontakt. Ich bin der Meinung, dass eine Mischung aus Online- und Präsenzunterricht am besten ist. Damit bin ich am Ende. Haben Sie Fragen?",
    checks: ["I followed a clear structure.", "I used linking words.", "I gave both an example and a justified opinion."],
  },
  B2: {
    title: "Build a convincing argument",
    target: "3–4 minutes",
    goal: "Develop a balanced position with evidence, a counterpoint, and a clear conclusion.",
    plan: [
      "Define the issue",
      "Present your main argument",
      "Support it with an example",
      "Acknowledge an opposing view",
      "Respond to the counterargument",
      "Conclude with a practical recommendation",
    ],
    starters: [
      "Das Thema … wird häufig kontrovers diskutiert.",
      "Ein entscheidendes Argument dafür ist …",
      "Dies lässt sich am Beispiel … zeigen.",
      "Zwar wird oft eingewandt, dass …, jedoch …",
      "Daraus ergibt sich für mich …",
      "Abschließend würde ich empfehlen, …",
    ],
    model:
      "Das Thema Homeoffice wird häufig kontrovers diskutiert. Ein entscheidendes Argument dafür ist die größere Flexibilität. Dies lässt sich am Beispiel von Pendlern zeigen, die täglich viel Zeit sparen. Zwar wird oft eingewandt, dass der persönliche Austausch fehlt, jedoch können feste Präsenztage dieses Problem reduzieren. Abschließend würde ich ein hybrides Modell empfehlen.",
    checks: ["I developed one argument fully.", "I included a counterargument.", "My conclusion followed logically from my points."],
  },
  C1: {
    title: "Present a nuanced position",
    target: "4–5 minutes",
    goal: "Explain a complex issue precisely, compare perspectives, and reach a well-supported conclusion.",
    plan: [
      "Frame the issue and explain why it matters",
      "Clarify important terms",
      "Compare at least two perspectives",
      "Use evidence or a concrete example",
      "Evaluate limitations and consequences",
      "Finish with a nuanced conclusion",
    ],
    starters: [
      "Die Frage, inwiefern …, gewinnt zunehmend an Bedeutung.",
      "Unter … verstehe ich in diesem Zusammenhang …",
      "Während die eine Position betont, dass …, weist die andere darauf hin, dass …",
      "Besonders deutlich wird dies am Beispiel …",
      "Dabei darf jedoch nicht übersehen werden, dass …",
      "Zusammenfassend lässt sich festhalten, dass …",
    ],
    model:
      "Die Frage, inwiefern künstliche Intelligenz den Unterricht verbessern kann, gewinnt zunehmend an Bedeutung. Während Befürworter die individuelle Förderung betonen, weisen Kritiker auf Datenschutz und Abhängigkeit hin. Besonders deutlich wird dies bei automatisiertem Feedback. Dabei darf jedoch nicht übersehen werden, dass pädagogische Entscheidungen weiterhin von Lehrkräften getroffen werden müssen. Zusammenfassend lässt sich festhalten, dass KI sinnvoll ist, sofern sie transparent und verantwortungsvoll eingesetzt wird.",
    checks: ["I compared perspectives instead of listing ideas.", "I used precise connectors.", "My conclusion was balanced and specific."],
  },
};

export const getSpeakingTeilOneGuide = (level) =>
  SPEAKING_TEIL_ONE_GUIDES[String(level || "").toUpperCase()] || SPEAKING_TEIL_ONE_GUIDES.B1;

const SpeakingTeilOneGuide = ({ level }) => {
  const [showHelp, setShowHelp] = useState(true);
  const guide = useMemo(() => getSpeakingTeilOneGuide(level), [level]);

  return (
    <section
      aria-label={`Teil 1 speaking help for ${level}`}
      style={{
        ...styles.card,
        display: "grid",
        gap: 14,
        border: "2px solid #818cf8",
        background: "linear-gradient(135deg, #eef2ff, #ffffff 55%, #f5f3ff)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ ...styles.badge, background: "#4338ca", color: "#fff", borderColor: "#4338ca" }}>Start here</span>
            <span style={{ ...styles.badge, background: "#ede9fe", color: "#5b21b6" }}>{level} · Teil 1</span>
            <span style={styles.badge}>{guide.target}</span>
          </div>
          <h2 style={{ ...styles.sectionTitle, margin: "10px 0 4px" }}>More speaking help: {guide.title}</h2>
          <p style={{ ...styles.helperText, margin: 0 }}>{guide.goal}</p>
        </div>
        <button
          type="button"
          style={styles.secondaryButton}
          onClick={() => setShowHelp((current) => !current)}
          aria-expanded={showHelp}
        >
          {showHelp ? "Hide help" : "Show speaking help"}
        </button>
      </div>

      {showHelp ? (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            <div style={{ ...styles.card, margin: 0, padding: 14, background: "#fff" }}>
              <h3 style={{ margin: "0 0 8px" }}>Your speaking plan</h3>
              <ol style={{ margin: 0, paddingLeft: 20, color: "#374151", lineHeight: 1.55 }}>
                {guide.plan.map((item) => <li key={item}>{item}</li>)}
              </ol>
            </div>

            <div style={{ ...styles.card, margin: 0, padding: 14, background: "#fff" }}>
              <h3 style={{ margin: "0 0 8px" }}>Useful sentence starters</h3>
              <div style={{ display: "grid", gap: 7 }}>
                {guide.starters.map((starter) => (
                  <div key={starter} style={{ padding: "8px 10px", borderRadius: 10, background: "#f8fafc", color: "#312e81", fontWeight: 700 }}>
                    {starter}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ ...styles.card, margin: 0, padding: 14, background: "#fffbeb", border: "1px solid #fde68a" }}>
            <h3 style={{ margin: "0 0 8px" }}>Mini model answer</h3>
            <p style={{ margin: 0, color: "#78350f", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{guide.model}</p>
            <p style={{ ...styles.helperText, margin: "8px 0 0" }}>
              Use the structure, but replace the details with your own ideas. Do not memorise every word.
            </p>
          </div>

          <div style={{ ...styles.card, margin: 0, padding: 14, background: "#ecfdf5", border: "1px solid #a7f3d0" }}>
            <h3 style={{ margin: "0 0 8px" }}>Before you record</h3>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {guide.checks.map((check) => (
                <span key={check} style={{ ...styles.badge, background: "#fff", color: "#065f46", borderColor: "#6ee7b7" }}>✓ {check}</span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default SpeakingTeilOneGuide;
