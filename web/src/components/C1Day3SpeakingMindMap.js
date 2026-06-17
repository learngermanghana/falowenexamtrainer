import React, { useMemo, useState } from "react";
import "./C1Day3SpeakingMindMap.css";

const branchPositions = ["north-west", "north-east", "west", "east", "south"];
const branchColors = ["#2563eb", "#7c3aed", "#0891b2", "#ea580c", "#16a34a"];

const cleanSpeakingQuestion = (value = "") =>
  String(value)
    .replace(/^Sprechen:\s*/i, "")
    .trim();

export default function C1Day3SpeakingMindMap({ lesson }) {
  const branches = useMemo(
    () => (Array.isArray(lesson?.speakingBuilder?.branches) ? lesson.speakingBuilder.branches : []),
    [lesson],
  );
  const [activeId, setActiveId] = useState(branches[0]?.id || "");
  const activeBranch =
    branches.find((branch) => branch.id === activeId) || branches[0] || null;

  if (!branches.length) return null;

  return (
    <section className="c1-day3-mind-map" aria-labelledby="c1-day3-mind-map-title">
      <header className="c1-day3-mind-map__intro">
        <div>
          <span className="c1-day3-mind-map__eyebrow">C1 · Sprechvorbereitung</span>
          <h3 id="c1-day3-mind-map-title">Baue deine Antwort als Mindmap auf</h3>
          <p>
            Beginne in der Mitte. Öffne danach die Äste und verbinde mindestens drei
            Perspektiven zu einer differenzierten Antwort.
          </p>
        </div>
        <div className="c1-day3-mind-map__legend" aria-label="Mindmap-Anleitung">
          <span>1. Mitte lesen</span>
          <span>2. Äste öffnen</span>
          <span>3. Sprechen</span>
        </div>
      </header>

      <div className="c1-day3-mind-map__viewport">
        <div className="c1-day3-mind-map__canvas">
          <svg
            className="c1-day3-mind-map__connections"
            viewBox="0 0 1000 680"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            <path d="M500 330 C420 250 340 185 245 145" />
            <path d="M500 330 C580 250 660 185 755 145" />
            <path d="M500 330 C390 330 300 330 190 345" />
            <path d="M500 330 C610 330 700 330 810 345" />
            <path d="M500 330 C500 430 500 500 500 575" />
          </svg>

          <div className="c1-day3-mind-map__centre">
            <span>Hauptfrage</span>
            <strong>
              {cleanSpeakingQuestion(lesson?.speakingTopic) || lesson?.title}
            </strong>
          </div>

          {branches.map((branch, index) => {
            const selected = branch.id === activeBranch?.id;
            return (
              <button
                key={branch.id || branch.title}
                type="button"
                className={`c1-day3-mind-map__branch c1-day3-mind-map__branch--${branchPositions[index] || "south"}${selected ? " is-active" : ""}`}
                style={{ "--branch-color": branchColors[index % branchColors.length] }}
                onClick={() => setActiveId(branch.id)}
                aria-pressed={selected}
                aria-controls="c1-day3-mind-map-details"
              >
                <span className="c1-day3-mind-map__number">{index + 1}</span>
                <span className="c1-day3-mind-map__branch-copy">
                  <strong>{branch.title}</strong>
                  <span>{(branch.keywords || []).slice(0, 3).join(" · ")}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {activeBranch ? (
        <div id="c1-day3-mind-map-details" className="c1-day3-mind-map__details">
          <div className="c1-day3-mind-map__details-heading">
            <span
              className="c1-day3-mind-map__details-number"
              style={{ background: branchColors[branches.indexOf(activeBranch) % branchColors.length] }}
            >
              {branches.indexOf(activeBranch) + 1}
            </span>
            <div>
              <span className="c1-day3-mind-map__eyebrow">Geöffneter Ast</span>
              <h4>{activeBranch.title}</h4>
            </div>
          </div>

          <div className="c1-day3-mind-map__details-grid">
            <div>
              <span className="c1-day3-mind-map__label">Leitfrage</span>
              <p>{activeBranch.prompt}</p>
            </div>
            <div>
              <span className="c1-day3-mind-map__label">Beispiel</span>
              <p>{activeBranch.example}</p>
            </div>
            {activeBranch.starter ? (
              <div className="c1-day3-mind-map__starter">
                <span className="c1-day3-mind-map__label">C1-Satzanfang</span>
                <p>{activeBranch.starter}</p>
              </div>
            ) : null}
          </div>

          <div className="c1-day3-mind-map__keywords" aria-label="Schlüsselbegriffe">
            {(activeBranch.keywords || []).map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="c1-day3-mind-map__route">
        <strong>Empfohlener Sprechweg:</strong>
        <span>
          Quellen prüfen → Desinformation erklären → Verantwortung abwägen →
          Freiheit schützen → Medienbildung als Lösung nennen
        </span>
      </div>
    </section>
  );
}
