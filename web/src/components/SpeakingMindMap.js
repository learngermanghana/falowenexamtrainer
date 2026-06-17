import React, { useMemo, useState } from "react";
import { styles } from "../styles";

const emptyConfig = {
  title: "Speaking mind map",
  centralQuestion: "Prepare a short answer.",
  branches: [],
  speakingRoute: [],
  targetDurationSeconds: 45,
};

const normalizeConfig = (config) => ({ ...emptyConfig, ...(config || {}), branches: Array.isArray(config?.branches) ? config.branches : [], speakingRoute: Array.isArray(config?.speakingRoute) ? config.speakingRoute : [] });

const SpeakingMindMap = ({ config }) => {
  const safeConfig = useMemo(() => normalizeConfig(config), [config]);
  const firstBranchId = safeConfig.speakingRoute[0] || safeConfig.branches[0]?.id || "";
  const [selectedBranchId, setSelectedBranchId] = useState(firstBranchId);
  const selectedBranch = safeConfig.branches.find((branch) => branch.id === selectedBranchId) || safeConfig.branches[0];
  const selectedRouteIndex = Math.max(0, safeConfig.speakingRoute.indexOf(selectedBranch?.id));

  const selectRouteOffset = (offset) => {
    if (!safeConfig.speakingRoute.length) return;
    const nextIndex = Math.min(safeConfig.speakingRoute.length - 1, Math.max(0, selectedRouteIndex + offset));
    setSelectedBranchId(safeConfig.speakingRoute[nextIndex]);
  };

  if (!safeConfig.branches.length) {
    return <section aria-label="Interactive brain map unavailable" style={{ border: "1px solid #fecaca", borderRadius: 12, padding: 14, background: "#fff1f2" }}><strong>Interactive brain map</strong><p style={{ margin: "6px 0 0" }}>This lesson is missing a complete speaking map. Use the task question and speaking coach below.</p></section>;
  }

  return (
    <section aria-label={`${safeConfig.title} interactive brain map`} style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 14, background: "#eff6ff", display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div><h3 style={{ margin: 0 }}>Interactive brain map</h3><p style={{ margin: "4px 0 0", fontWeight: 700 }}>{safeConfig.centralQuestion}</p></div>
        <strong style={{ color: "#1d4ed8" }}>Speaking goal: {safeConfig.targetDurationSeconds} seconds</strong>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
        {safeConfig.branches.map((branch) => (
          <button key={branch.id} type="button" onClick={() => setSelectedBranchId(branch.id)} style={{ ...styles.secondaryButton, whiteSpace: "normal", minHeight: 72, background: selectedBranch?.id === branch.id ? "#dbeafe" : "#fff", borderColor: selectedBranch?.id === branch.id ? "#2563eb" : "#d1d5db" }} aria-pressed={selectedBranch?.id === branch.id}>
            <strong>{branch.label}</strong><br /><span>{branch.keywords.join(" · ")}</span>
          </button>
        ))}
      </div>
      <article aria-label="Selected branch details" style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fff", display: "grid", gap: 8 }}>
        <strong>Selected branch: {selectedBranch.label}</strong>
        <span><strong>Guiding question:</strong> {selectedBranch.guidingQuestion}</span>
        <span><strong>Sentence starter:</strong> {selectedBranch.sentenceStarter}</span>
        <span><strong>Model sentence:</strong> {selectedBranch.modelSentence}</span>
      </article>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <button type="button" style={styles.secondaryButton} onClick={() => selectRouteOffset(-1)} disabled={selectedRouteIndex === 0}>Previous branch</button>
        <span>Route {selectedRouteIndex + 1} / {safeConfig.speakingRoute.length}: {safeConfig.speakingRoute.map((id) => safeConfig.branches.find((branch) => branch.id === id)?.label).filter(Boolean).join(" → ")}</span>
        <button type="button" style={styles.secondaryButton} onClick={() => selectRouteOffset(1)} disabled={selectedRouteIndex >= safeConfig.speakingRoute.length - 1}>Next branch</button>
      </div>
    </section>
  );
};

export default SpeakingMindMap;
