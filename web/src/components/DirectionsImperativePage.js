import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 12 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const Callout = ({ children }) => (
  <div
    style={{
      background: "#f0f9ff",
      borderLeft: "4px solid #38bdf8",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 14,
      display: "grid",
      gap: 6,
    }}
  >
    {children}
  </div>
);

const quizQuestions = [
  {
    prompt: "Choose the best imperative for a formal stranger: gehen (straight ahead)",
    options: ["Geh geradeaus.", "Geht geradeaus.", "Gehen Sie geradeaus."],
    answer: "Gehen Sie geradeaus.",
    note: "Use infinitive + Sie for formal commands.",
  },
  {
    prompt: "Choose the best imperative for du: biegen (right)",
    options: ["Bieg rechts ab.", "Biegen Sie rechts ab.", "Biegt rechts ab."],
    answer: "Bieg rechts ab.",
    note: "For du, use the stem without du.",
  },
  {
    prompt: "Choose the best imperative for ihr: nehmen (first street left)",
    options: ["Nehmt die erste Straße links.", "Nimm die erste Straße links.", "Nehmen Sie die erste Straße links."],
    answer: "Nehmt die erste Straße links.",
    note: "For ihr, use stem + -t.",
  },
  {
    prompt: "Transform to du imperative: überqueren (die Straße)",
    options: ["Überquere die Straße.", "Überquert die Straße.", "Überqueren Sie die Straße."],
    answer: "Überquere die Straße.",
    note: "Du imperative drops du and keeps the singular stem form.",
  },
  {
    prompt: "Transform to ihr imperative: gehen (to the station)",
    options: ["Geht zum Bahnhof.", "Geh zum Bahnhof.", "Gehen Sie zum Bahnhof."],
    answer: "Geht zum Bahnhof.",
    note: "Ihr imperative ends in -t.",
  },
  {
    prompt: "Which sentence means 'Turn left' to one friend?",
    options: ["Biegen Sie links ab.", "Bieg links ab.", "Biegt links ab."],
    answer: "Bieg links ab.",
    note: "One friend = du form.",
  },
];

const mapSteps = [
  {
    prompt: "You are at the Bahnhof. Step 1: reach the Kreuzung.",
    options: ["Geh geradeaus.", "Bieg links ab.", "Überquere die Straße."],
    answer: "Geh geradeaus.",
  },
  {
    prompt: "Step 2: At the Kreuzung, continue toward the Schule.",
    options: ["Bieg rechts ab.", "Geh geradeaus.", "Nimm die zweite Straße links."],
    answer: "Bieg rechts ab.",
  },
  {
    prompt: "Step 3: The hospital is across from you.",
    options: ["Überquere die Straße.", "Bieg links ab.", "Geh zurück."],
    answer: "Überquere die Straße.",
  },
  {
    prompt: "Step 4: Final move to get to the Schule entrance.",
    options: ["Nimm die erste Straße links.", "Nimm die erste Straße rechts.", "Bieg rechts ab."],
    answer: "Nimm die erste Straße links.",
  },
];

const mistakes = [
  {
    wrong: "Bieg Sie rechts ab.",
    correct: "Biegen Sie rechts ab.",
    reason: "Do not mix du stem with Sie. Formal uses infinitive + Sie.",
  },
  {
    wrong: "Du geh geradeaus.",
    correct: "Geh geradeaus.",
    reason: "In imperative commands, du is normally omitted.",
  },
  {
    wrong: "Nehmt die Straße erste links.",
    correct: "Nehmt die erste Straße links.",
    reason: "Word order: article + adjective + noun.",
  },
  {
    wrong: "Bieg rechts links ab.",
    correct: "Bieg rechts ab. / Bieg links ab.",
    reason: "rechts and links are not combined in one simple turn command.",
  },
];

const speakingCards = [
  "Ask for the hospital politely (Sie).",
  "Give directions to a friend using du.",
  "Tell two friends how to get to the station (ihr).",
  "Politely explain that you do not know the way.",
  "Guide someone from the school to the supermarket in 4 steps.",
  "Role-play: one person asks, one person gives directions using at least two imperative verbs.",
];

const DirectionsImperativePage = () => {
  const navigate = useNavigate();
  const [quizAnswers, setQuizAnswers] = useState({});
  const [mapProgress, setMapProgress] = useState(0);
  const [mapChoice, setMapChoice] = useState("");
  const [mapFeedback, setMapFeedback] = useState("");

  const quizScore = useMemo(
    () =>
      quizQuestions.reduce((score, question, index) => {
        if (quizAnswers[index] === question.answer) {
          return score + 1;
        }
        return score;
      }, 0),
    [quizAnswers]
  );

  const currentMapStep = mapSteps[mapProgress];

  const checkMapAnswer = () => {
    if (!mapChoice) {
      setMapFeedback("Pick a step first.");
      return;
    }
    if (mapChoice === currentMapStep.answer) {
      if (mapProgress === mapSteps.length - 1) {
        setMapFeedback("Excellent! You completed the route.");
      } else {
        setMapFeedback("Correct! Continue to the next step.");
        setMapProgress((prev) => prev + 1);
      }
      setMapChoice("");
      return;
    }
    setMapFeedback("Not quite. Try another direction command.");
  };

  const restartMap = () => {
    setMapProgress(0);
    setMapChoice("");
    setMapFeedback("");
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 17: Directions + Imperative (Chapter 11)</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Understand instructions and requests in German with useful direction phrases and imperative forms.
        </p>
      </div>

      <Section title="1) Basic direction vocabulary">
        <BulletList
          items={[
            "rechts — right",
            "links — left",
            "geradeaus — straight ahead",
            "die Straße — street",
            "die Kreuzung — intersection",
            "die Ampel — traffic light",
            "die Ecke — corner",
            "die Brücke — bridge",
            "der Platz — square",
            "der Bahnhof — train station",
            "das Krankenhaus — hospital",
            "die Schule — school",
            "der Supermarkt — supermarket",
            "überqueren — to cross",
            "erste Straße — first street",
            "zweite Straße — second street",
            "auf der rechten Seite — on the right side",
            "auf der linken Seite — on the left side",
          ]}
        />
      </Section>

      <Section title="2) Asking for directions">
        <BulletList
          items={[
            "Wo ist ...? (Where is ...?)",
            "Wo finde ich ...? (Where can I find ...?)",
            "Wie komme ich zu ...? (How do I get to ...?)",
            "Ich suche ... (I'm looking for ...)",
          ]}
        />
      </Section>

      <Section title="3) Giving directions (formal examples)">
        <BulletList
          items={[
            "Gehen Sie geradeaus. (Go straight ahead.)",
            "Biegen Sie rechts ab. (Turn right.)",
            "Biegen Sie links ab. (Turn left.)",
            "Nehmen Sie die erste Straße rechts. (Take the first street on the right.)",
            "Nehmen Sie die zweite Straße links. (Take the second street on the left.)",
            "Überqueren Sie die Straße. (Cross the street.)",
            "Der Supermarkt ist auf der rechten Seite. (The supermarket is on the right side.)",
            "Das Krankenhaus ist auf der linken Seite. (The hospital is on the left side.)",
          ]}
        />
      </Section>

      <Section title="4) If you don't know the way">
        <BulletList
          items={[
            "Entschuldigung, ich weiß es nicht. (Sorry, I don't know.)",
            "Tut mir leid, ich bin nicht von hier. (I'm sorry, I'm not from here.)",
            "Ich kenne den Weg nicht. (I don't know the way.)",
            "Vielleicht fragen Sie jemanden anderen. (Maybe you should ask someone else.)",
            "Entschuldigung, ich kann Ihnen nicht helfen. (Sorry, I can't help you.)",
            "Ich bin auch ein Besucher hier. (I'm also a visitor here.)",
          ]}
        />
      </Section>

      <Section title="5) Imperative for directions (Sie / du / ihr)">
        <Callout>
          <strong>Formal (Sie)</strong>
          <p style={{ margin: 0 }}>Use infinitive + Sie.</p>
          <BulletList
            items={[
              "Gehen Sie geradeaus.",
              "Biegen Sie rechts ab.",
              "Nehmen Sie die erste Straße links.",
            ]}
          />
        </Callout>
        <Callout>
          <strong>Informal singular (du)</strong>
          <p style={{ margin: 0 }}>Use verb stem (drop -en/-n, no du).</p>
          <BulletList items={["Geh geradeaus.", "Bieg rechts ab.", "Nimm die erste Straße links."]} />
        </Callout>
        <Callout>
          <strong>Informal plural (ihr)</strong>
          <p style={{ margin: 0 }}>Use verb stem + -t (no ihr).</p>
          <BulletList items={["Geht geradeaus.", "Biegt rechts ab.", "Nehmt die erste Straße links."]} />
        </Callout>
      </Section>

      <Section title="6) Example: How to get to the train station">
        <h3 style={{ margin: 0 }}>Formal (Sie)</h3>
        <BulletList
          items={[
            "Gehen Sie geradeaus bis zur Kreuzung.",
            "Biegen Sie links ab.",
            "Überqueren Sie die Brücke.",
            "Der Bahnhof ist auf der rechten Seite.",
          ]}
        />
        <h3 style={{ margin: "8px 0 0" }}>Informal singular (du)</h3>
        <BulletList
          items={[
            "Geh geradeaus bis zur Kreuzung.",
            "Bieg links ab.",
            "Überquere die Brücke.",
            "Der Bahnhof ist auf der rechten Seite.",
          ]}
        />
        <h3 style={{ margin: "8px 0 0" }}>Informal plural (ihr)</h3>
        <BulletList
          items={[
            "Geht geradeaus bis zur Kreuzung.",
            "Biegt links ab.",
            "Überquert die Brücke.",
            "Der Bahnhof ist auf der rechten Seite.",
          ]}
        />
      </Section>

      <Section title="7) Video lesson">
        <p style={{ margin: 0 }}>Watch this explanation and practice with your tutor afterwards.</p>
        <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", borderRadius: 12, overflow: "hidden" }}>
          <iframe
            title="Directions and imperative in German"
            src="https://www.youtube.com/embed/V9WNhHEkrkU?feature=oembed"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Section>

      <Section title="8) Quick Check quiz (instant feedback)">
        <p style={{ margin: 0 }}>
          Test your imperative control for <strong>Sie / du / ihr</strong>. Score: {quizScore}/{quizQuestions.length}
        </p>
        {quizQuestions.map((question, index) => {
          const selected = quizAnswers[index];
          const isCorrect = selected === question.answer;
          return (
            <div key={question.prompt} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 12, display: "grid", gap: 8 }}>
              <strong>
                {index + 1}. {question.prompt}
              </strong>
              <div style={{ display: "grid", gap: 6 }}>
                {question.options.map((option) => (
                  <label key={option} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="radio"
                      name={`quiz-${index}`}
                      value={option}
                      checked={selected === option}
                      onChange={(event) => setQuizAnswers((prev) => ({ ...prev, [index]: event.target.value }))}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {selected ? (
                <p style={{ margin: 0, color: isCorrect ? "#166534" : "#b91c1c", fontSize: 14 }}>
                  {isCorrect ? "✅ Correct." : `❌ Try again. Correct answer: ${question.answer}`} {question.note}
                </p>
              ) : null}
            </div>
          );
        })}
      </Section>

      <Section title="9) Interactive map scenario">
        <p style={{ margin: 0 }}>
          Follow the route from <strong>Bahnhof</strong> to <strong>Schule</strong> and pass the <strong>Krankenhaus</strong>.
        </p>
        <pre
          style={{
            margin: 0,
            background: "#0f172a",
            color: "#e2e8f0",
            padding: 12,
            borderRadius: 10,
            fontSize: 13,
            overflowX: "auto",
          }}
        >
{`[Bahnhof] --- geradeaus ---> [Kreuzung] --- rechts ---> [Straße]
                                        |
                                   überqueren
                                        |
                                [Krankenhaus]
                                        |
                               erste Straße links
                                        |
                                    [Schule]`}
        </pre>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 12, display: "grid", gap: 8 }}>
          <strong>
            Step {mapProgress + 1}/{mapSteps.length}: {currentMapStep.prompt}
          </strong>
          {currentMapStep.options.map((option) => (
            <label key={option} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="radio" name="map-step" value={option} checked={mapChoice === option} onChange={(event) => setMapChoice(event.target.value)} />
              <span>{option}</span>
            </label>
          ))}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button style={styles.secondaryButton} onClick={checkMapAnswer}>
              Check step
            </button>
            <button style={styles.secondaryButton} onClick={restartMap}>
              Restart route
            </button>
          </div>
          {mapFeedback ? <p style={{ margin: 0, fontSize: 14 }}>{mapFeedback}</p> : null}
        </div>
      </Section>

      <Section title="10) Common mistakes (wrong → corrected)">
        <div style={{ display: "grid", gap: 8 }}>
          {mistakes.map((item) => (
            <Callout key={item.wrong}>
              <p style={{ margin: 0 }}>
                <strong>Wrong:</strong> {item.wrong}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Correct:</strong> {item.correct}
              </p>
              <p style={{ margin: 0, fontSize: 14 }}>{item.reason}</p>
            </Callout>
          ))}
        </div>
      </Section>

      <Section title="11) Role-play prompts for tutor session">
        <p style={{ margin: 0 }}>Use these cards in speaking practice after the lesson:</p>
        <div style={{ display: "grid", gap: 8 }}>
          {speakingCards.map((prompt, index) => (
            <div key={prompt} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 12 }}>
              <strong>Card {index + 1}:</strong> {prompt}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default DirectionsImperativePage;
