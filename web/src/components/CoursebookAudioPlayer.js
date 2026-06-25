import React, { useEffect, useRef } from "react";

const A2_DAY_2_AUDIO_URL =
  "https://drive.google.com/file/d/1SIFA08DquWp-dU86pi7pHC6eElF_39I9/view?usp=sharing";

const a2Day2Questions = [
  {
    stem: "Wie alt ist Maria?",
    options: ["A) 26 Jahre", "B) 28 Jahre", "C) 30 Jahre", "D) 32 Jahre"],
  },
  {
    stem: "Welche Haare hat Maria?",
    options: [
      "A) Kurze, blonde Haare",
      "B) Lange, schwarze Haare",
      "C) Lange, braune Haare",
      "D) Kurze, braune Haare",
    ],
  },
  {
    stem: "Was trägt Maria oft?",
    options: ["A) Einen Hut", "B) Eine schwarze Brille", "C) Eine blaue Jacke", "D) Einen Rock"],
  },
  {
    stem: "Wie sieht Jonas aus?",
    options: [
      "A) Er ist klein und schlank",
      "B) Er ist groß und sportlich",
      "C) Er ist mittelgroß und ruhig",
      "D) Er ist groß und kräftig",
    ],
  },
  {
    stem: "Wie ist Jonas?",
    options: [
      "A) Ruhig und schüchtern",
      "B) Ernst und unfreundlich",
      "C) Offen und lustig",
      "D) Müde und nervös",
    ],
  },
];

const questionCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 6,
};

const A2Day2ListeningReplacement = () => {
  const replacementRef = useRef(null);

  useEffect(() => {
    const replacement = replacementRef.current;
    const parent = replacement?.parentElement;

    if (!replacement || !parent) return undefined;

    const hiddenElements = [];
    const hide = (element) => {
      if (!element) return;
      hiddenElements.push({ element, display: element.style.display });
      element.style.display = "none";
    };

    const parentChildren = Array.from(parent.children);
    const listeningImage = parentChildren.find((element) => element.tagName === "IMG");
    const listeningHeading = parentChildren.find(
      (element) => element.tagName === "H2" && element.textContent?.includes("Teil 4 (Hören)")
    );
    const audioNote = listeningHeading?.nextElementSibling;

    hide(listeningImage);
    if (audioNote?.tagName === "P") hide(audioNote);

    let sibling = replacement.nextElementSibling;
    while (sibling) {
      if (
        sibling.tagName === "P" &&
        sibling.textContent?.includes("Please submit your listening answers")
      ) {
        break;
      }

      const nextSibling = sibling.nextElementSibling;
      hide(sibling);
      sibling = nextSibling;
    }

    return () => {
      hiddenElements.forEach(({ element, display }) => {
        element.style.display = display;
      });
    };
  }, []);

  return (
    <div ref={replacementRef} style={{ display: "grid", gap: 12 }}>
      <iframe
        style={{ width: "100%", aspectRatio: "16 / 9", border: 0, borderRadius: 10 }}
        src="https://www.youtube.com/embed/Roc2DONWKzI"
        title="Personen beschreiben – Hörverstehen"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />

      <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Fragen und mögliche Antworten</h3>

      {a2Day2Questions.map((question, index) => (
        <div key={question.stem} style={questionCardStyle}>
          <strong>
            {index + 1}. {question.stem}
          </strong>
          {question.options.map((option) => (
            <span key={option}>{option}</span>
          ))}
        </div>
      ))}
    </div>
  );
};

const CoursebookAudioPlayer = ({ url, linkLabel = "Open audio in a new tab" }) => {
  if (url === A2_DAY_2_AUDIO_URL) {
    return <A2Day2ListeningReplacement />;
  }

  return (
    <a href={url} target="_blank" rel="noreferrer">
      {linkLabel}
    </a>
  );
};

export default CoursebookAudioPlayer;
