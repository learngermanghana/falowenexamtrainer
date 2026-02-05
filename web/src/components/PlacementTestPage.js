import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { updatePageMeta } from "../lib/pageMeta";

const placementTest = {
  title: "Placement check (paraphrased exam-style tasks)",
  subtitle:
    "Not sure about your level yet? Answer the questions below. Once you finish, you will see the answer key and a suggested level.",
  sections: [
    {
      id: "ticket",
      title: "Kurztext: 29-Euro-Ticket",
      passage: [
        "Mit dem neuen 29-Euro-Ticket können Fahrgäste mit Bussen, Straßenbahnen und Regionalzügen in ganz Deutschland fahren.",
        "Das Ticket gilt von Anfang Oktober bis Ende Dezember. Es ist für beliebig viele Fahrten im Nahverkehr gültig.",
      ],
      questions: [
        {
          id: "pt1",
          number: 1,
          text: "Wo dürfen Sie mit dem Ticket unterwegs sein?",
          options: ["In Deutschland und im Ausland.", "Nur in Deutschland.", "Nur in der näheren Umgebung."],
          correct: "Nur in Deutschland.",
        },
        {
          id: "pt2",
          number: 2,
          text: "Bis wann gilt das Ticket?",
          options: ["Bis Mitte November.", "Bis Mitte Dezember.", "Bis Ende Dezember."],
          correct: "Bis Ende Dezember.",
        },
        {
          id: "pt3",
          number: 3,
          text: "Die 29 Euro zahlt man für …",
          options: [
            "eine einfache Hin- und Rückfahrt.",
            "eine Fahrt in der zweiten Klasse.",
            "beliebig viele Fahrten an einem Tag.",
          ],
          correct: "beliebig viele Fahrten an einem Tag.",
        },
      ],
    },
    {
      id: "store",
      title: "Kaufhaus-Übersicht",
      passage: [
        "3. Stock: Smartphones, TV, Computer, Drucker, Spiele, Sport- und Arbeitskleidung.",
        "2. Stock: Herrenmode, Wäsche, Möbel für Wohnzimmer/Bad/Küche, Teppiche, Lampen, Deko.",
        "1. Stock: Damen- und Kindermode, Schuhe, Haushaltswaren, Töpfe und Pfannen.",
        "EG: Information, Uhren, Schmuck, Parfüm, Kosmetik, Schreibwaren, Karten, Souvenirs.",
        "UG: Bäckerei, Supermarkt, Reinigungsmittel, Fotoservice, Zeitungen, Reisebüro, Geldautomat.",
      ],
      questions: [
        {
          id: "pt7",
          number: 7,
          text: "Sie möchten Urlaubsfotos ausdrucken lassen. Wohin gehen Sie?",
          options: ["3. Stock", "UG", "anderer Stock"],
          correct: "UG",
        },
        {
          id: "pt8",
          number: 8,
          text: "Sie suchen eine Hose zum Joggen. Wohin gehen Sie?",
          options: ["3. Stock", "2. Stock", "anderer Stock"],
          correct: "3. Stock",
        },
      ],
    },
    {
      id: "ads",
      title: "Welche Anzeige passt?",
      passage: [
        "A: Schweizer Autoren – leicht gelesen. Vereinfachte Literaturtexte für Deutschlernende.",
        "B: Deutsch-Training online. Zehn kostenlose Lektionen, Grammatik-Erklärungen, alle Übungen im Internet.",
        "C: Deutsch erLesen. Monatsmagazin mit aktuellen Artikeln aus der deutschen Presse für Leser im In- und Ausland.",
        "D: Verlag sucht Lektorin/Lektor für neue Romane und Gedichtbände.",
      ],
      questions: [
        {
          id: "pt11",
          number: 11,
          text: "Mirjeta hat keine Zeit für einen Kurs, möchte sich aber regelmäßig über Neuigkeiten aus Deutschland informieren.",
          options: ["A", "B", "C", "D"],
          correct: "C",
        },
      ],
    },
    {
      id: "phones",
      title: "Meinungen zu Handyverboten in der Schule",
      passage: [
        "Corinne (37): Handys sind oft nur zum Angeben. In der Schule sollten Kinder sich auf den Unterricht konzentrieren.",
        "Rüdiger (47): Ich musste lange auf meine Tochter warten, weil sie ihr Handy nicht einschalten durfte. Das geht so nicht.",
        "Max (15): Wir gehen zur Schule, um zu lernen. Aber wenn man Handys verbietet, lernt man keinen vernünftigen Umgang.",
      ],
      questions: [
        {
          id: "pt12",
          number: 12,
          text: "Corinne ist für ein Handyverbot.",
          options: ["Ja", "Nein"],
          correct: "Ja",
        },
        {
          id: "pt13",
          number: 13,
          text: "Rüdiger ist für ein Handyverbot.",
          options: ["Ja", "Nein"],
          correct: "Nein",
        },
        {
          id: "pt14",
          number: 14,
          text: "Max ist für ein Handyverbot.",
          options: ["Ja", "Nein"],
          correct: "Nein",
        },
      ],
    },
    {
      id: "murten",
      title: "Zeitreise per Velo",
      passage: [
        "Mit der Radtour „Zeitreise per Velo“ entdecken Besucherinnen und Besucher Murten aktiv.",
        "Treffpunkt ist der Bahnhof. Wer möchte, bringt das eigene Fahrrad mit oder leiht eines dort aus.",
        "Für alle, die es entspannter mögen, gibt es auch E-Bikes zum Mieten.",
      ],
      questions: [
        {
          id: "pt15",
          number: 15,
          text: "Für die Rundfahrt …",
          options: ["braucht man ein eigenes Velo.", "muss man nicht sportlich sein.", "sollte man mit der Bahn anreisen."],
          correct: "muss man nicht sportlich sein.",
        },
      ],
    },
    {
      id: "digital",
      title: "Digitales Lernen",
      passage: [
        "DIGITALES LERNEN – UNABHÄNGIG VON ZEIT UND ORT",
        "Alles online: Internetfähige Geräte werden beim E-Learning eingesetzt. In der Praxis (21) das,",
        "dass Teilnehmende von zu Hause oder unterwegs lernen können.",
        "Online-Lernen (22) immer mehr Möglichkeiten und Freiheiten.",
        "Grundkenntnisse sind (23), doch auch Einsteiger werden zu Kursbeginn von Tutor*innen begleitet.",
      ],
      questions: [
        {
          id: "pt21",
          number: 21,
          text: "In der Praxis (21) das,",
          options: ["verheißt", "bedeutet", "befindet", "vermittelt"],
          correct: "bedeutet",
        },
        {
          id: "pt22",
          number: 22,
          text: "Online-Lernen (22) immer mehr Möglichkeiten und Freiheiten.",
          options: ["macht auf", "öffnet", "eröffnet", "beginnt"],
          correct: "eröffnet",
        },
        {
          id: "pt23",
          number: 23,
          text: "Grundkenntnisse sind (23),",
          options: ["im Vorteil", "von Vorteil", "eine Bedeutung", "von Sinnen"],
          correct: "von Vorteil",
        },
      ],
    },
  ],
};

const flattenPlacementQuestions = (sections) =>
  sections.flatMap((section) => section.questions.map((question) => ({ ...question, sectionId: section.id })));

const getPlacementLevel = (score, total) => {
  if (total === 0) return "A1";
  const ratio = score / total;
  if (ratio >= 0.92) return "C1";
  if (ratio >= 0.8) return "B2";
  if (ratio >= 0.65) return "B1";
  if (ratio >= 0.45) return "A2";
  return "A1";
};

const PlacementTestPage = () => {
  const { i18n } = useTranslation();
  const [placementAnswers, setPlacementAnswers] = useState({});
  const placementQuestions = useMemo(
    () => flattenPlacementQuestions(placementTest.sections),
    []
  );
  const placementAnsweredCount = Object.keys(placementAnswers).length;
  const placementComplete =
    placementAnsweredCount === placementQuestions.length && placementQuestions.length > 0;
  const placementScore = placementQuestions.filter(
    (question) => placementAnswers[question.id] === question.correct
  ).length;
  const placementLevel = getPlacementLevel(placementScore, placementQuestions.length);

  React.useEffect(() => {
    updatePageMeta({
      title: placementTest.title,
      description: placementTest.subtitle,
      lang: i18n.language,
    });
  }, [i18n.language]);

  const handlePlacementAnswer = (questionId, option) => {
    setPlacementAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const renderPlacementOptionButton = (question, option) => {
    const selected = placementAnswers[question.id] === option;
    const isCorrect = placementComplete && option === question.correct;
    const isIncorrect = placementComplete && selected && option !== question.correct;

    return (
      <button
        key={option}
        type="button"
        onClick={() => handlePlacementAnswer(question.id, option)}
        style={{
          ...styles.buttonSecondary,
          ...(selected ? styles.buttonSecondaryActive : {}),
          ...(isCorrect
            ? {
                borderColor: "#16a34a",
                background: "#ecfdf3",
                color: "#14532d",
              }
            : {}),
          ...(isIncorrect
            ? {
                borderColor: "#dc2626",
                background: "#fef2f2",
                color: "#991b1b",
              }
            : {}),
          textAlign: "left",
        }}
      >
        {option}
      </button>
    );
  };

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <section style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <p style={{ ...styles.helperText, margin: 0 }}>New here?</p>
          <h1 style={{ ...styles.sectionTitle, margin: 0 }}>{placementTest.title}</h1>
          <p style={{ ...styles.helperText, margin: 0 }}>{placementTest.subtitle}</p>
        </div>
        <div>
          <a href="/" style={{ ...styles.secondaryButton, textDecoration: "none" }}>
            Back to homepage
          </a>
        </div>
      </section>

      <section style={{ ...styles.card, display: "grid", gap: 16 }}>
        <div style={{ display: "grid", gap: 16 }}>
          {placementTest.sections.map((section) => (
            <div key={section.id} style={{ display: "grid", gap: 12 }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>{section.title}</h3>
              <div style={{ display: "grid", gap: 6, color: "#374151", fontSize: 14 }}>
                {section.passage.map((line, idx) => (
                  <p key={`${section.id}-line-${idx}`} style={{ margin: 0 }}>
                    {line}
                  </p>
                ))}
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {section.questions.map((question) => (
                  <div key={question.id} style={{ display: "grid", gap: 8 }}>
                    <div style={{ fontWeight: 600 }}>
                      {question.number}. {question.text}
                    </div>
                    <div style={{ display: "grid", gap: 8 }}>
                      {question.options.map((option) => renderPlacementOptionButton(question, option))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontSize: 14, color: "#4b5563" }}>
            Answered {placementAnsweredCount} / {placementQuestions.length}
          </div>
          {placementComplete ? (
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ ...styles.focusNotice, margin: 0 }}>
                Score: <strong>{placementScore}</strong> / {placementQuestions.length} · Suggested level:{" "}
                <strong>{placementLevel}</strong>
              </div>
              <div style={{ ...styles.card, margin: 0, background: "#f8fafc" }}>
                <h4 style={{ marginTop: 0 }}>Answer key</h4>
                <ol style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
                  {placementQuestions.map((question) => (
                    <li key={`key-${question.id}`}>
                      <strong>{question.number}.</strong> {question.correct}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <div style={{ color: "#6b7280", fontSize: 14 }}>
              Finish all questions to see your suggested level and the answer key.
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default PlacementTestPage;
