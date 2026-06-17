import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import {
  readSpeakingProgress,
  resolveSpeakingProgressScope,
  writeSpeakingProgress,
} from "../services/speakingProgressStorage";
import "./SpeakingMindMap.css";

const emptyConfig = {
  level: "A2",
  title: "Speaking mind map",
  centralQuestion: "Prepare a short answer.",
  branches: [],
  speakingRoute: [],
  targetDurationSeconds: 45,
};

const positionSets = {
  3: [
    { x: 20, y: 20 },
    { x: 80, y: 20 },
    { x: 50, y: 84 },
  ],
  4: [
    { x: 20, y: 18 },
    { x: 80, y: 18 },
    { x: 20, y: 80 },
    { x: 80, y: 80 },
  ],
  5: [
    { x: 20, y: 16 },
    { x: 80, y: 16 },
    { x: 13, y: 52 },
    { x: 87, y: 52 },
    { x: 50, y: 86 },
  ],
  6: [
    { x: 18, y: 16 },
    { x: 50, y: 9 },
    { x: 82, y: 16 },
    { x: 14, y: 62 },
    { x: 86, y: 62 },
    { x: 50, y: 87 },
  ],
  7: [
    { x: 18, y: 15 },
    { x: 50, y: 8 },
    { x: 82, y: 15 },
    { x: 12, y: 52 },
    { x: 88, y: 52 },
    { x: 28, y: 87 },
    { x: 72, y: 87 },
  ],
};

const normalizeConfig = (config) => {
  const safe = config && typeof config === "object" ? config : {};
  const branches = Array.isArray(safe.branches)
    ? safe.branches
        .filter((branch) => branch && branch.id && (branch.label || branch.title))
        .map((branch) => ({
          ...branch,
          label: branch.label || branch.title,
          keywords: Array.isArray(branch.keywords)
            ? branch.keywords.filter(Boolean)
            : [],
        }))
    : [];
  const knownIds = new Set(branches.map((branch) => branch.id));
  const configuredRoute = Array.isArray(safe.speakingRoute)
    ? safe.speakingRoute.filter((id) => knownIds.has(id))
    : [];

  return {
    ...emptyConfig,
    ...safe,
    branches,
    speakingRoute:
      configuredRoute.length > 0
        ? configuredRoute
        : branches.map((branch) => branch.id),
  };
};

const getPositions = (count) =>
  positionSets[count] ||
  Array.from({ length: count }, (_, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(count, 1) - Math.PI / 2;
    return {
      x: 50 + Math.cos(angle) * 36,
      y: 50 + Math.sin(angle) * 39,
    };
  });

const getRestoredBranchId = (config, memory, fallbackId) => {
  const knownIds = new Set(config.branches.map((branch) => branch.id));
  if (knownIds.has(memory.selectedBranchId)) return memory.selectedBranchId;
  const routeIndex = Number(memory.routeIndex);
  if (
    Number.isInteger(routeIndex) &&
    routeIndex >= 0 &&
    routeIndex < config.speakingRoute.length
  ) {
    return config.speakingRoute[routeIndex];
  }
  return fallbackId;
};

const SpeakingMindMap = ({ config, progressScope }) => {
  const safeConfig = useMemo(() => normalizeConfig(config), [config]);
  const storageScope = useMemo(
    () => resolveSpeakingProgressScope(safeConfig, progressScope),
    [progressScope, safeConfig],
  );
  const firstBranchId =
    safeConfig.speakingRoute[0] || safeConfig.branches[0]?.id || "";
  const initialMemory = useMemo(
    () => readSpeakingProgress(storageScope),
    [storageScope],
  );
  const [selectedBranchId, setSelectedBranchId] = useState(() =>
    getRestoredBranchId(safeConfig, initialMemory, firstBranchId),
  );
  const [helpOpen, setHelpOpen] = useState(() =>
    Boolean(initialMemory.helpOpen),
  );
  const rootRef = useRef(null);
  const focusModeEnabled =
    safeConfig.focusMode !== undefined
      ? Boolean(safeConfig.focusMode)
      : ["A2", "B1"].includes(String(safeConfig.level || "").toUpperCase());

  useEffect(() => {
    const memory = readSpeakingProgress(storageScope);
    setSelectedBranchId(
      getRestoredBranchId(safeConfig, memory, firstBranchId),
    );
    setHelpOpen(Boolean(memory.helpOpen));
  }, [firstBranchId, safeConfig, storageScope]);

  const selectedBranch =
    safeConfig.branches.find((branch) => branch.id === selectedBranchId) ||
    safeConfig.branches[0];
  const routeIndex = safeConfig.speakingRoute.indexOf(selectedBranch?.id);
  const selectedRouteIndex = routeIndex >= 0 ? routeIndex : 0;
  const positions = getPositions(safeConfig.branches.length);

  useEffect(() => {
    if (!selectedBranch?.id) return;
    writeSpeakingProgress(storageScope, {
      selectedBranchId: selectedBranch.id,
      routeIndex: selectedRouteIndex,
    });
  }, [selectedBranch?.id, selectedRouteIndex, storageScope]);

  useEffect(() => {
    writeSpeakingProgress(storageScope, { helpOpen });
  }, [helpOpen, storageScope]);

  useEffect(() => {
    const root = rootRef.current;
    const speakingCard = root?.parentElement;
    if (!speakingCard) return undefined;

    const preparedInput = Array.from(
      speakingCard.querySelectorAll('input[type="checkbox"]'),
    ).find((input) =>
      String(input.closest("label")?.textContent || "")
        .toLowerCase()
        .includes("prepared"),
    );
    if (!preparedInput) return undefined;

    const savePrepared = () => {
      writeSpeakingProgress(storageScope, {
        prepared: Boolean(preparedInput.checked),
      });
    };
    preparedInput.addEventListener("change", savePrepared);

    const memory = readSpeakingProgress(storageScope);
    if (
      typeof memory.prepared === "boolean" &&
      preparedInput.checked !== memory.prepared
    ) {
      preparedInput.click();
    }

    return () => preparedInput.removeEventListener("change", savePrepared);
  }, [storageScope]);

  const selectRouteOffset = (offset) => {
    if (!safeConfig.speakingRoute.length) return;
    const nextIndex = Math.min(
      safeConfig.speakingRoute.length - 1,
      Math.max(0, selectedRouteIndex + offset),
    );
    setSelectedBranchId(safeConfig.speakingRoute[nextIndex]);
  };

  if (!safeConfig.branches.length) {
    return (
      <section
        aria-label="Interactive brain map unavailable"
        style={{
          border: "1px solid #fecaca",
          borderRadius: 12,
          padding: 14,
          background: "#fff1f2",
        }}
      >
        <strong>Interactive brain map</strong>
        <p style={{ margin: "6px 0 0" }}>
          This lesson is missing a complete speaking map. Use the task question
          and speaking coach below.
        </p>
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      aria-label={`${safeConfig.title} interactive brain map`}
      className="speaking-mind-map"
      data-speaking-mind-map
      data-level={safeConfig.level}
      data-focus-mode={focusModeEnabled ? "true" : "false"}
      data-help-open={helpOpen ? "true" : "false"}
      data-progress-scope={storageScope}
    >
      <header className="speaking-mind-map__header">
        <div>
          <span className="speaking-mind-map__eyebrow">
            {safeConfig.level} · Sprechvorbereitung
          </span>
          <h3>Baue deine Antwort als Mindmap auf</h3>
          <p>Frage lesen, einen Ast öffnen und die Ideen laut verbinden.</p>
        </div>
        <span className="speaking-mind-map__saved">Saved on this device</span>
      </header>

      <div className="speaking-mind-map__viewport">
        <div
          className="speaking-mind-map__canvas"
          data-testid="mind-map-canvas"
          data-mobile-layout="vertical-connected"
        >
          <svg
            className="speaking-mind-map__connections"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {positions.map((position, index) => (
              <line
                key={`${position.x}-${position.y}-${index}`}
                x1="50"
                y1="50"
                x2={position.x}
                y2={position.y}
                data-testid="mind-map-connection"
              />
            ))}
          </svg>

          <div className="speaking-mind-map__centre" data-testid="mind-map-centre">
            <span>Sprechfrage</span>
            <strong>{safeConfig.centralQuestion}</strong>
          </div>

          <div className="speaking-mind-map__branches">
            {safeConfig.branches.map((branch, index) => {
              const selected = selectedBranch?.id === branch.id;
              const position = positions[index];
              return (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => setSelectedBranchId(branch.id)}
                  className={`speaking-mind-map__branch${selected ? " is-active" : ""}`}
                  style={{
                    ...styles.secondaryButton,
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                  }}
                  aria-pressed={selected}
                  aria-controls="speaking-mind-map-details"
                >
                  <span className="speaking-mind-map__branch-number">
                    {index + 1}
                  </span>
                  <span className="speaking-mind-map__branch-copy">
                    <strong>{branch.label}</strong>
                    {branch.keywords.length ? (
                      <small>{branch.keywords.slice(0, 2).join(" · ")}</small>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <article
        id="speaking-mind-map-details"
        aria-label="Selected branch details"
        className="speaking-mind-map__details"
      >
        <div className="speaking-mind-map__details-heading">
          <span className="speaking-mind-map__details-number">
            {safeConfig.branches.findIndex(
              (branch) => branch.id === selectedBranch.id,
            ) + 1}
          </span>
          <div>
            <span className="speaking-mind-map__eyebrow">Selected branch</span>
            <h4>{selectedBranch.label}</h4>
          </div>
        </div>

        <div className="speaking-mind-map__details-grid">
          <div>
            <strong>Guiding question</strong>
            <p>{selectedBranch.guidingQuestion}</p>
          </div>
          <div className="speaking-mind-map__starter">
            <strong>Sentence starter</strong>
            <p>{selectedBranch.sentenceStarter}</p>
          </div>
        </div>

        <details className="speaking-mind-map__model">
          <summary>Show model sentence</summary>
          <p>{selectedBranch.modelSentence}</p>
        </details>

        {selectedBranch.keywords.length ? (
          <div className="speaking-mind-map__keywords">
            {selectedBranch.keywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
        ) : null}
      </article>

      <div className="speaking-mind-map__route">
        <strong>Route:</strong>
        <span className="speaking-mind-map__route-copy">
          {safeConfig.speakingRoute
            .map(
              (id) =>
                safeConfig.branches.find((branch) => branch.id === id)?.label,
            )
            .filter(Boolean)
            .join(" → ")}
        </span>
        <div className="speaking-mind-map__route-buttons">
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => selectRouteOffset(-1)}
            disabled={selectedRouteIndex === 0}
          >
            Previous
          </button>
          <span>
            {selectedRouteIndex + 1}/{safeConfig.speakingRoute.length}
          </span>
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => selectRouteOffset(1)}
            disabled={
              selectedRouteIndex >= safeConfig.speakingRoute.length - 1
            }
          >
            Next
          </button>
        </div>
      </div>

      {focusModeEnabled ? (
        <div className="speaking-mind-map__help-toggle">
          <button
            type="button"
            className="speaking-mind-map__help-button"
            style={styles.secondaryButton}
            onClick={() => setHelpOpen((current) => !current)}
            aria-expanded={helpOpen}
          >
            {helpOpen ? "Hide extra speaking help" : "More speaking help"}
          </button>
          <span>Phrase bank · vocabulary · model answer · detailed instructions</span>
        </div>
      ) : null}
    </section>
  );
};

export default SpeakingMindMap;
