import React, { useMemo, useState, useEffect } from "react";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";

const lesenLevels = [
  {
    level: "A1",
    description: "In-app A1 reading practice is available below.",
    url: null,
  },
  {
    level: "A2",
    description: "Lesen sample PDF.",
    url: "https://drive.google.com/file/d/1YMjpi2aJ6o3TkLOR3ld81SfNzdZQxMQB/view?usp=sharing",
    actionLabel: "Open A2 Lesen sample",
  },
  {
    level: "B1",
    description: "Lesen sample PDF.",
    url: "https://drive.google.com/file/d/1Iqho5cIe_2RJKz66JMfA22LGHoYwurfy/view?usp=sharing",
    actionLabel: "Open B1 Lesen sample",
  },
  {
    level: "B2",
    description: "PDF coming soon.",
    url: null,
  },
  {
    level: "C1",
    description: "PDF coming soon.",
    url: null,
  },
];

const a1Reading = {
  sections: [
    {
      id: "teil-1",
      title: "Teil 1: E-Mails und Notizen",
      tasks: [
        {
          id: "t1",
          heading: "Nachricht 1",
          text: [
            "Hallo Erik,",
            "danke für deine Einladung zum Geburtstag. Am Samstagabend klappt es leider nicht, weil ich am Wochenende arbeiten muss.",
            "Ich fahre zu einem Kongress nach Köln und komme erst am Sonntagmittag zurück. Vielleicht sehen wir uns nächste Woche.",
            "Ein Geschenk habe ich schon. Feier schön!",
            "Peter",
          ],
          questions: [
            {
              id: "q1",
              text: "Eriks Geburtstag ist nächste Woche.",
              options: ["Richtig", "Falsch"],
              correct: "Falsch",
              explanation:
                "Peter sagt, dass er am Samstagabend nicht kann. Der Geburtstag ist also dieses Wochenende, nicht nächste Woche.",
            },
            {
              id: "q2",
              text: "Peter hat am Samstag keine Zeit.",
              options: ["Richtig", "Falsch"],
              correct: "Richtig",
              explanation: "Er schreibt, dass er am Samstagabend nicht kommen kann.",
            },
          ],
        },
        {
          id: "t2",
          heading: "Nachricht 2",
          text: [
            "Hallo Jasmin,",
            "ich habe morgen frei und kann schon mittags nach Berlin kommen – nicht erst spät am Abend.",
            "Mein Zug kommt um 12.30 Uhr an. Kannst du mich abholen?",
            "Wir treffen uns am besten vor dem Bahnhof, ich warte dort auf dich.",
            "Bitte schreib mir schnell oder ruf mich an. Bis morgen, ich freue mich.",
            "Roberto",
          ],
          questions: [
            {
              id: "q3",
              text: "Roberto will Jasmin noch anrufen.",
              options: ["Richtig", "Falsch"],
              correct: "Falsch",
              explanation: "Er bittet Jasmin, ihn anzurufen oder zu schreiben.",
            },
            {
              id: "q4",
              text: "Roberto kommt am Abend nach Berlin.",
              options: ["Richtig", "Falsch"],
              correct: "Falsch",
              explanation: "Er sagt, dass er schon mittags ankommt.",
            },
          ],
        },
        {
          id: "t3",
          heading: "Nachricht 3",
          text: [
            "Liebe Claudia, lieber Holger,",
            "wir wohnen seit zwei Wochen in einer neuen Wohnung – sehr hell, 85 m², mit schönem Südbalkon.",
            "Am nächsten Samstag möchten wir eine kleine Party machen, ab 18 Uhr. Viele Leute kommen, auch Nachbarn aus dem Haus.",
            "Habt ihr Zeit? Dann könnt ihr die Wohnung ansehen. Wir machen etwas zu essen.",
            "Bringt gern etwas zu trinken mit und vielleicht Musik, unsere CDs sind noch in der alten Wohnung.",
            "Die Adresse ist Sandweg 12, 3. Stock. Schreibt uns bitte kurz.",
            "Viele Grüße",
            "Karin + Tom",
          ],
          questions: [
            {
              id: "q5",
              text: "Karin und Tom wohnen jetzt im Sandweg.",
              options: ["Richtig", "Falsch"],
              correct: "Richtig",
              explanation: "Sie nennen ihre neue Adresse: Sandweg 12.",
            },
            {
              id: "q6",
              text: "Sie kennen die Nachbarn noch nicht.",
              options: ["Richtig", "Falsch"],
              correct: "Falsch",
              explanation: "Sie schreiben, dass die Nachbarn sehr nett sind – also kennen sie sie schon.",
            },
            {
              id: "q7",
              text: "Die Gäste sollen Musik mitbringen.",
              options: ["Richtig", "Falsch"],
              correct: "Richtig",
              explanation: "Sie bitten, Musik mitzubringen, weil ihre CDs noch in der alten Wohnung sind.",
            },
          ],
        },
      ],
    },
    {
      id: "teil-2",
      title: "Teil 2: Informationen finden",
      tasks: [
        {
          id: "t4",
          heading: "Frage 8",
          text: [
            "Situation: Sie wollen wissen: Scheint am Wochenende die Sonne?",
            "Anzeige A: Sonnentours – günstige Reisen und Superangebote. Jetzt buchen.",
            "Anzeige B: Wetter jetzt – geben Sie eine Stadt ein und sehen Sie den Wetterbericht.",
          ],
          questions: [
            {
              id: "q8",
              text: "Wo finden Sie die Information?",
              options: ["Anzeige A", "Anzeige B"],
              correct: "Anzeige B",
              explanation: "Nur Anzeige B liefert einen Wetterbericht.",
            },
          ],
        },
        {
          id: "t5",
          heading: "Frage 9",
          text: [
            "Situation: Sie suchen ein billiges Fahrrad.",
            "Anzeige A: Fahrrad, rot, 2 Jahre alt, 3 Gänge, nur 60 Euro.",
            "Anzeige B: Verkaufe Motorroller für 200 Euro und Fahrradtaschen für 30 Euro.",
          ],
          questions: [
            {
              id: "q9",
              text: "Wo finden Sie die Information?",
              options: ["Anzeige A", "Anzeige B"],
              correct: "Anzeige A",
              explanation: "In Anzeige A wird ein günstiges Fahrrad angeboten.",
            },
          ],
        },
        {
          id: "t6",
          heading: "Frage 10",
          text: [
            "Situation: Sie wollen in Deutschland Urlaub machen und weiter Deutsch lernen.",
            "Anzeige A: Urlaub in Deutschland – Familienangebote und Ferien auf dem Bauernhof.",
            "Anzeige B: Feriensprachkurse in Berlin im Sommer und Herbst, alle Stufen.",
          ],
          questions: [
            {
              id: "q10",
              text: "Wo finden Sie die Information?",
              options: ["Anzeige A", "Anzeige B"],
              correct: "Anzeige B",
              explanation: "Anzeige B kombiniert Urlaub und Deutschlernen.",
            },
          ],
        },
        {
          id: "t7",
          heading: "Frage 11",
          text: [
            "Situation: Sie möchten eine Schiffsreise auf dem Rhein machen und Rüdesheim besuchen.",
            "Anzeige A: Tagesfahrten mit dem Zug nach Rüdesheim, 49 Euro pro Person.",
            "Anzeige B: Rhein-Schiffsparty mit Buffet, Stadtbesuch in Rüdesheim und Abendprogramm.",
          ],
          questions: [
            {
              id: "q11",
              text: "Wo finden Sie die Information?",
              options: ["Anzeige A", "Anzeige B"],
              correct: "Anzeige B",
              explanation: "Anzeige B bietet eine Schiffsreise und den Besuch von Rüdesheim.",
            },
          ],
        },
        {
          id: "t8",
          heading: "Frage 12",
          text: [
            "Situation: Sie möchten am Sonntagmittag mit Freunden chinesisch essen gehen.",
            "Anzeige A: Asia-Land – chinesische und indonesische Küche, geöffnet 11.30–22 Uhr, Montag Ruhetag.",
            "Anzeige B: China-Restaurant – täglich von 18–23 Uhr geöffnet.",
          ],
          questions: [
            {
              id: "q12",
              text: "Wo gehen Sie hin?",
              options: ["Anzeige A", "Anzeige B"],
              correct: "Anzeige A",
              explanation: "Nur Anzeige A ist mittags geöffnet.",
            },
          ],
        },
      ],
    },
    {
      id: "teil-3",
      title: "Teil 3: Situationen und Hinweise",
      tasks: [
        {
          id: "t9",
          heading: "Frage 13",
          text: [
            "Situation: Sie müssen am 12. Oktober in Ihrer Wohnung sein.",
            "Hinweis: Heizung wird repariert! Am Freitag, dem 12. Oktober, muss die Firma in alle Wohnungen.",
            "Bitte seien Sie zu Hause oder geben Sie Ihren Schlüssel bei Frau Dorn ab.",
          ],
          questions: [
            {
              id: "q13",
              text: "Die Aussage ist richtig oder falsch?",
              options: ["Richtig", "Falsch"],
              correct: "Richtig",
              explanation: "Am 12. Oktober muss jemand in die Wohnung kommen.",
            },
          ],
        },
        {
          id: "t10",
          heading: "Frage 14",
          text: [
            "Situation: Am Mittwochabend können Sie bis 23 Uhr im Garten sitzen.",
            "Hinweis: Garten geöffnet – wochentags bis 22 Uhr, freitags und samstags bis 23 Uhr.",
            "Das Restaurant schließt um 24 Uhr.",
          ],
          questions: [
            {
              id: "q14",
              text: "Die Aussage ist richtig oder falsch?",
              options: ["Richtig", "Falsch"],
              correct: "Falsch",
              explanation: "Mittwoch ist ein Wochentag, da gilt 22 Uhr.",
            },
          ],
        },
        {
          id: "t11",
          heading: "Frage 15",
          text: [
            "Situation: Sie dürfen hier nicht parken.",
            "Hinweis: Schild auf der Straße: \"Parken verboten\".",
          ],
          questions: [
            {
              id: "q15",
              text: "Die Aussage ist richtig oder falsch?",
              options: ["Richtig", "Falsch"],
              correct: "Richtig",
              explanation: "\"Parken verboten\" bedeutet: Sie dürfen nicht parken.",
            },
          ],
        },
        {
          id: "t12",
          heading: "Frage 16",
          text: [
            "Situation: Heute fahren die Straßenbahnen und Busse nur bis zum Hauptbahnhof.",
            "Hinweis: Die Straßenbahnen fahren heute nur bis zur Kaiserstraße.",
            "Zum Hauptbahnhof fahren Sie bitte mit Buslinie 103 weiter.",
          ],
          questions: [
            {
              id: "q16",
              text: "Die Aussage ist richtig oder falsch?",
              options: ["Richtig", "Falsch"],
              correct: "Falsch",
              explanation: "Die Straßenbahn fährt nur bis Kaiserstraße, nicht bis zum Hauptbahnhof.",
            },
          ],
        },
        {
          id: "t13",
          heading: "Frage 17",
          text: [
            "Situation: Ab morgen können Sie billiger einkaufen.",
            "Hinweis im Schaufenster: Sonderaktion – 50 % weniger zahlen!",
            "Ab morgen kostet alles nur die Hälfte.",
          ],
          questions: [
            {
              id: "q17",
              text: "Die Aussage ist richtig oder falsch?",
              options: ["Richtig", "Falsch"],
              correct: "Richtig",
              explanation: "Ab morgen ist alles halb so teuer.",
            },
          ],
        },
      ],
    },
  ],
};

const flattenQuestions = (sections) =>
  sections.flatMap((section) => section.tasks.flatMap((task) => task.questions));

const LesenPage = () => {
  const { level } = useExam();
  const { studentProfile, user } = useAuth();
  const normalizedLevel = String(level || "A1").toUpperCase();
  const [answers, setAnswers] = useState({});
  const A1_EXAM_SECONDS = 25 * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(A1_EXAM_SECONDS);
  const [timerRunning, setTimerRunning] = useState(false);

  const visibleLevels = useMemo(() => {
    const match = lesenLevels.find((item) => item.level === normalizedLevel);
    return match ? [match] : lesenLevels;
  }, [normalizedLevel]);

  const allQuestions = useMemo(() => flattenQuestions(a1Reading.sections), []);
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === allQuestions.length && allQuestions.length > 0;
  const score = allQuestions.filter((question) => answers[question.id] === question.correct).length;
  const studentName = studentProfile?.name || studentProfile?.displayName || user?.displayName || "Student";

  useEffect(() => {
    if (!timerRunning) return;
    if (remainingSeconds <= 0) {
      setTimerRunning(false);
      return;
    }

    const timerId = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [timerRunning, remainingSeconds]);

  useEffect(() => {
    if (normalizedLevel !== "A1") return;
    setRemainingSeconds(A1_EXAM_SECONDS);
    setTimerRunning(false);
  }, [normalizedLevel, A1_EXAM_SECONDS]);

  const handleTimerToggle = () => {
    if (remainingSeconds <= 0) {
      setRemainingSeconds(A1_EXAM_SECONDS);
      setTimerRunning(true);
      return;
    }
    setTimerRunning((prev) => !prev);
  };

  const handleTimerReset = () => {
    setRemainingSeconds(A1_EXAM_SECONDS);
    setTimerRunning(false);
  };

  const formatCountdown = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleAnswer = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const renderOptionButton = (question, option) => {
    const selected = answers[question.id] === option;
    const isCorrect = isComplete && option === question.correct;
    const isIncorrect = isComplete && selected && option !== question.correct;

    return (
      <button
        key={option}
        type="button"
        onClick={() => handleAnswer(question.id, option)}
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
    <section style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div>
        <h2 style={{ margin: 0 }}>Lesen samples</h2>
        <p style={{ margin: "6px 0 0", color: "#4b5563" }}>
          Download the official PDFs and practice with a timer just like the exam day.
        </p>
      </div>
      <div style={{ ...styles.focusNotice, marginTop: 0 }}>
        Showing resources for level <strong>{normalizedLevel}</strong> so you can stay focused.
      </div>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {visibleLevels.map((levelItem) => (
          <div key={levelItem.level} style={{ ...styles.card, margin: 0, display: "grid", gap: 10 }}>
            <div>
              <h3 style={{ margin: 0 }}>{levelItem.level}</h3>
              <p style={{ margin: "6px 0 0", color: "#4b5563" }}>{levelItem.description}</p>
            </div>
            {levelItem.url ? (
              <a
                href={levelItem.url}
                target="_blank"
                rel="noreferrer"
                style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none" }}
              >
                {levelItem.actionLabel}
              </a>
            ) : (
              <span style={{ fontSize: 14, color: "#9ca3af" }}>
                {levelItem.level === "A1" ? "Practice below" : "Available soon"}
              </span>
            )}
          </div>
        ))}
      </div>

      {normalizedLevel === "A1" ? (
        <div style={{ ...styles.card, margin: 0, display: "grid", gap: 16 }}>
          <div>
            {a1Reading.title ? <h3 style={{ margin: 0 }}>{a1Reading.title}</h3> : null}
            {a1Reading.subtitle ? (
              <p style={{ margin: "6px 0 0", color: "#4b5563" }}>{a1Reading.subtitle}</p>
            ) : null}
          </div>
          <div
            style={{
              ...styles.card,
              margin: 0,
              borderColor: timerRunning ? "#2563eb" : "#e2e8f0",
              background: "#f8fafc",
              display: "grid",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700 }}>A1 Lesen Exam Timer</div>
                <div style={{ fontSize: 13, color: "#475569" }}>
                  Student: <strong>{studentName}</strong> · Target time: 25 minutes
                </div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: remainingSeconds === 0 ? "#b91c1c" : "#0f172a" }}>
                {formatCountdown(remainingSeconds)}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleTimerToggle}
                style={{
                  ...styles.primaryButton,
                  background: timerRunning ? "#f97316" : styles.primaryButton?.background || "#2563eb",
                }}
              >
                {timerRunning ? "Pause timer" : remainingSeconds === A1_EXAM_SECONDS ? "Start timer" : "Resume timer"}
              </button>
              <button type="button" onClick={handleTimerReset} style={styles.buttonSecondary}>
                Reset to 25:00
              </button>
            </div>
            <div style={{ fontSize: 13, color: "#64748b" }}>
              Keep the pace steady and aim to finish all questions before time runs out.
            </div>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {a1Reading.sections.map((section) => (
              <div key={section.id} style={{ display: "grid", gap: 12 }}>
                <h4 style={{ margin: 0 }}>{section.title}</h4>
                {section.tasks.map((task) => (
                  <div key={task.id} style={{ ...styles.card, margin: 0, display: "grid", gap: 10 }}>
                    <div>
                      <strong>{task.heading}</strong>
                      {task.text.map((line, index) => (
                        <p key={`${task.id}-line-${index}`} style={{ margin: "6px 0", color: "#111827" }}>
                          {line}
                        </p>
                      ))}
                    </div>
                    <div style={{ display: "grid", gap: 10 }}>
                      {task.questions.map((question) => (
                        <div key={question.id} style={{ display: "grid", gap: 8 }}>
                          <div style={{ fontWeight: 600 }}>{question.text}</div>
                          <div style={{ display: "grid", gap: 6 }}>
                            {question.options.map((option) => renderOptionButton(question, option))}
                          </div>
                          {isComplete ? (
                            <div
                              style={{
                                fontSize: 13,
                                color:
                                  answers[question.id] === question.correct ? "#166534" : "#991b1b",
                              }}
                            >
                              {answers[question.id] === question.correct ? "Correct." : "Not correct."} {question.explanation}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div
            style={{
              ...styles.card,
              margin: 0,
              background: "#f8fafc",
              borderColor: "#e2e8f0",
              display: "grid",
              gap: 6,
            }}
          >
            <div style={{ fontWeight: 700 }}>Progress</div>
            <div style={{ fontSize: 14, color: "#475569" }}>
              Answered {answeredCount} of {allQuestions.length} questions.
            </div>
            {isComplete ? (
              <div style={{ fontWeight: 700, color: "#0f172a" }}>
                Score: {score} / {allQuestions.length}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default LesenPage;
