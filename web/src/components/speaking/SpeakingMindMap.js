import React, { useMemo, useState } from "react";
import "./SpeakingMindMap.css";

const BRANCH_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#0891b2",
  "#ea580c",
  "#16a34a",
  "#db2777",
];

const POSITION_SETS = {
  3: ["north-west", "north-east", "south"],
  4: ["north-west", "north-east", "south-west", "south-east"],
  5: ["north-west", "north-east", "west", "east", "south"],
  6: ["north-west", "north-east", "west", "east", "south-west", "south-east"],
};

const CONNECTIONS = {
  "north-west": "M500 330 C420 250 340 185 245 145",
  "north-east": "M500 330 C580 250 660 185 755 145",
  west: "M500 330 C390 330 300 330 190 345",
  east: "M500 330 C610 330 700 330 810 345",
  south: "M500 330 C500 430 500 500 500 575",
  "south-west": "M500 330 C420 430 350 500 260 565",
  "south-east": "M500 330 C580 430 650 500 740 565",
};

const LEVEL_COPY = {
  A2: {
    eyebrow: "A2 · Sprechvorbereitung",
    instruction:
      "Beginne in der Mitte. Öffne die Äste und bilde aus den Wörtern kurze, klare Sätze.",
    starterLabel: "Satzanfang",
  },
  B1: {
    eyebrow: "B1 · Sprechvorbereitung",
    instruction:
      "Beginne in der Mitte. Öffne die Äste und verbinde Gründe, Beispiele und deine Meinung.",
    starterLabel: "Satzanfang",
  },
  B2: {
    eyebrow: "B2 · Sprechvorbereitung",
    instruction:
      "Beginne in der Mitte. Öffne die Äste und verbinde Argumente, Beispiele und einen Gegenpunkt.",
    starterLabel: "B2-Satzanfang",
  },
  C1: {
    eyebrow: "C1 · Sprechvorbereitung",
    instruction:
      "Beginne in der Mitte. Öffne die Äste und verknüpfe mehrere Perspektiven zu einer differenzierten Antwort.",
    starterLabel: "C1-Satzanfang",
  },
};

const normalizeBranches = (branches = []) =>
  (Array.isArray(branches) ? branches : [])
    .filter((branch) => branch && branch.title)
    .slice(0, 6)
    .map((branch, index) => ({
      ...branch,
      id: branch.id || `branch-${index + 1}`,
      keywords: Array.isArray(branch.keywords) ? branch.keywords.filter(Boolean) : [],
    }));

const routeText = (route = []) =>
  (Array.isArray(route) ? route : [])
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .join(" → ");

export default function SpeakingMindMap({ config = {} }) {
  const level = String(config.level || "B1").toUpperCase();
  const copy = LEVEL_COPY[level] || LEVEL_COPY.B1;
  const branches = useMemo(
    () => normalizeBranches(config.branches),
    [config.branches],
  );
  const [activeId, setActiveId] = useState(branches[0]?.id || "");
  const activeBranch =
    branches.find((branch) => branch.id === activeId) || branches[0] || null;
  const positions = POSITION_SETS[branches.length] || POSITION_SETS[6];
  const speakingRoute = routeText(config.speakingRoute);
  const titleId = `speaking-mind-map-${String(config.id || config.title || "lesson")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`;

  if (!branches.length) return null;

  return (
    <section
      className="speaking-mind-map"
      data-level={level}
      aria-labelledby={titleId}
    >
      <header className="speaking-mind-map__intro">
        <div>
          <span className="speaking-mind-map__eyebrow">
            {config.eyebrow || copy.eyebrow}
          </span>
          <h3 id={titleId}>{config.heading || "Baue deine Antwort als Mindmap auf"}</h3>
          <p>{config.instruction || copy.instruction}</p>
        </div>
        <div className="speaking-mind-map__legend" aria-label="Mindmap-Anleitung">
          <span>1. Mitte lesen</span>
          <span>2. Äste öffnen</span>
          <span>3. Sprechen</span>
          {Number(config.targetSeconds) > 0 ? (
            <span>
              Ziel: {Number(config.targetSeconds) < 60
                ? `${Number(config.targetSeconds)} Sek.`
                : `${Math.round(Number(config.targetSeconds) / 60)} Min.`}
            </span>
          ) : null}
        </div>
      </header>

      <div className="speaking-mind-map__viewport">
        <div className="speaking-mind-map__canvas">
          <svg
            className="speaking-mind-map__connections"
            viewBox="0 0 1000 680"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            {positions.map((position) => (
              <path key={position} d={CONNECTIONS[position]} />
            ))}
          </svg>

          <div className="speaking-mind-map__centre">
            <span>{config.centerLabel || "Sprechfrage"}</span>
            <strong>{config.question || config.title}</strong>
          </div>

          {branches.map((branch, index) => {
            const selected = branch.id === activeBranch?.id;
            const color = branch.color || BRANCH_COLORS[index % BRANCH_COLORS.length];
            const position = positions[index] || positions[positions.length - 1];

            return (
              <button
                key={branch.id}
                type="button"
                className={`speaking-mind-map__branch speaking-mind-map__branch--${position}${selected ? " is-active" : ""}`}
                style={{
                  "--branch-color": color,
                  borderColor: selected ? color : `${color}66`,
                }}
                onClick={() => setActiveId(branch.id)}
                aria-pressed={selected}
                aria-controls={`${titleId}-details`}
              >
                <span className="speaking-mind-map__number">{index + 1}</span>
                <span className="speaking-mind-map__branch-copy">
                  <strong>{branch.title}</strong>
                  {branch.keywords.length ? (
                    <span>{branch.keywords.slice(0, 3).join(" · ")}</span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {activeBranch ? (
        <div id={`${titleId}-details`} className="speaking-mind-map__details">
          <div className="speaking-mind-map__details-heading">
            <span
              className="speaking-mind-map__details-number"
              style={{
                background:
                  activeBranch.color ||
                  BRANCH_COLORS[branches.indexOf(activeBranch) % BRANCH_COLORS.length],
              }}
            >
              {branches.indexOf(activeBranch) + 1}
            </span>
            <div>
              <span className="speaking-mind-map__eyebrow">Geöffneter Ast</span>
              <h4>{activeBranch.title}</h4>
            </div>
          </div>

          <div className="speaking-mind-map__details-grid">
            {activeBranch.prompt ? (
              <div>
                <span className="speaking-mind-map__label">Leitfrage</span>
                <p>{activeBranch.prompt}</p>
              </div>
            ) : null}
            {activeBranch.example ? (
              <div>
                <span className="speaking-mind-map__label">Beispiel</span>
                <p>{activeBranch.example}</p>
              </div>
            ) : null}
            {activeBranch.starter ? (
              <div className="speaking-mind-map__starter">
                <span className="speaking-mind-map__label">
                  {config.starterLabel || copy.starterLabel}
                </span>
                <p>{activeBranch.starter}</p>
              </div>
            ) : null}
          </div>

          {activeBranch.keywords.length ? (
            <div className="speaking-mind-map__keywords" aria-label="Schlüsselbegriffe">
              {activeBranch.keywords.map((keyword) => (
                <span key={keyword}>{keyword}</span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {speakingRoute ? (
        <div className="speaking-mind-map__route">
          <strong>Empfohlener Sprechweg:</strong>
          <span>{speakingRoute}</span>
        </div>
      ) : null}
    </section>
  );
}
