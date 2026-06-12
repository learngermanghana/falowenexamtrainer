import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import c1Day2LearningSpeakingGuide from "../data/selfLearningLessons/c1/day2LearningSpeakingGuide";

const isC1Day2Path = (pathname = "") => {
  const normalized = String(pathname || "").toLowerCase();
  return /\/campus\/course\/lesson\/c1\/2(?:\/|$)/.test(normalized) || normalized.includes("c1-day-2");
};

const getYouTubeEmbedUrl = (url = "") => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = parsed.pathname.replace(/^\//, "");
    } else if (host.includes("youtube.com")) {
      videoId = parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  } catch (error) {
    return "";
  }
};

const card = {
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 14,
  background: "#ffffff",
  display: "grid",
  gap: 10,
};

function VideoCard({ resource }) {
  const embedUrl = getYouTubeEmbedUrl(resource.url);
  const available = Boolean(resource.url);

  return (
    <article style={{ ...card, alignContent: "start" }}>
      <span
        style={{
          width: "fit-content",
          padding: "5px 9px",
          borderRadius: 999,
          background: resource.type === "AI video" ? "#f3e8ff" : "#e0f2fe",
          color: resource.type === "AI video" ? "#7e22ce" : "#075985",
          fontSize: 12,
          fontWeight: 800,
        }}
      >
        {resource.type}
      </span>
      <strong style={{ fontSize: "1rem" }}>{resource.title}</strong>
      <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{resource.description}</p>

      {embedUrl ? (
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%",
            borderRadius: 14,
            overflow: "hidden",
            background: "#0f172a",
          }}
        >
          <iframe
            title={resource.title}
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
      ) : (
        <div
          style={{
            minHeight: 120,
            borderRadius: 14,
            border: "1px dashed #cbd5e1",
            background: "#f8fafc",
            display: "grid",
            placeItems: "center",
            padding: 16,
            color: "#64748b",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          AI video slot ready. Add the C1 Day 2 AI video URL to activate it.
        </div>
      )}

      {available ? (
        <a
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          style={{
            width: "fit-content",
            padding: "9px 12px",
            borderRadius: 10,
            background: "#2563eb",
            color: "#fff",
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          Open video
        </a>
      ) : null}
    </article>
  );
}

function LearnUpgrade() {
  const { learn } = c1Day2LearningSpeakingGuide;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div
        style={{
          border: "1px solid #bfdbfe",
          borderRadius: 14,
          padding: 14,
          background: "linear-gradient(135deg, #eff6ff, #ffffff)",
          lineHeight: 1.7,
        }}
      >
        <strong>What you will learn</strong>
        <p style={{ margin: "6px 0 0", color: "#334155" }}>{learn.intro}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 }}>
        {learn.outcomes.map((item, index) => (
          <article key={item.title} style={card}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: "#eef2ff",
                color: "#3730a3",
                fontWeight: 900,
              }}
            >
              {index + 1}
            </span>
            <strong>{item.title}</strong>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{item.description}</p>
          </article>
        ))}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <h3 style={{ margin: 0 }}>Watch before the grammar notes</h3>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
          Start with the grammar video, then use the AI video for a second explanation and revision. The complete grammar notes are directly below.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
          {learn.videos.map((resource) => <VideoCard key={resource.key} resource={resource} />)}
        </div>
      </div>
    </div>
  );
}

function SpeakingIdeaMap() {
  const { speaking } = c1Day2LearningSpeakingGuide;
  const [selected, setSelected] = useState([]);

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const toggleBranch = (id) => {
    setSelected((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]
    );
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div
        style={{
          border: "1px solid #c7d2fe",
          borderRadius: 16,
          padding: 14,
          background: "linear-gradient(135deg, #eef2ff, #ffffff)",
          display: "grid",
          gap: 8,
        }}
      >
        <span style={{ color: "#4338ca", fontWeight: 800, fontSize: 12 }}>IDEA MAP BEFORE SPEAKING</span>
        <h3 style={{ margin: 0 }}>{speaking.title}</h3>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>{speaking.instruction}</p>
        <div
          style={{
            justifySelf: "start",
            padding: "10px 16px",
            borderRadius: 999,
            background: "#312e81",
            color: "#fff",
            fontWeight: 900,
          }}
        >
          {speaking.center}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        {speaking.branches.map((branch) => {
          const active = selectedSet.has(branch.id);
          return (
            <button
              key={branch.id}
              type="button"
              onClick={() => toggleBranch(branch.id)}
              style={{
                ...card,
                textAlign: "left",
                cursor: "pointer",
                borderColor: active ? "#6366f1" : "#e2e8f0",
                background: active ? "#eef2ff" : "#ffffff",
                font: "inherit",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                <strong>{branch.title}</strong>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: 999,
                    background: active ? "#4f46e5" : "#f1f5f9",
                    color: active ? "#fff" : "#475569",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {active ? "Selected ✓" : "Select"}
                </span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {branch.keywords.map((word) => (
                  <span
                    key={word}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 999,
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      color: "#334155",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
              <p style={{ margin: 0, color: "#475569", lineHeight: 1.55 }}><strong>Think:</strong> {branch.prompt}</p>
              <p style={{ margin: 0, color: "#334155", lineHeight: 1.55 }}><strong>Example:</strong> {branch.example}</p>
            </button>
          );
        })}
      </div>

      <div
        style={{
          border: `1px solid ${selected.length >= 3 ? "#86efac" : "#fde68a"}`,
          borderRadius: 12,
          padding: 12,
          background: selected.length >= 3 ? "#f0fdf4" : "#fffbeb",
          color: selected.length >= 3 ? "#166534" : "#92400e",
          fontWeight: 800,
        }}
      >
        {selected.length >= 3
          ? `${selected.length} branches selected. You are ready to answer the speaking question below.`
          : `Select at least 3 branches. Selected: ${selected.length}/3.`}
      </div>
    </div>
  );
}

function findSectionByTitle(title) {
  return Array.from(document.querySelectorAll("section")).find((section) => {
    const heading = section.querySelector(":scope > h2");
    return heading?.textContent?.trim() === title;
  });
}

function C1Day2LearningSpeakingAutoMount() {
  const location = useLocation();
  const enabled = isC1Day2Path(location.pathname);
  const [learnTarget, setLearnTarget] = useState(null);
  const [speakingTarget, setSpeakingTarget] = useState(null);

  useEffect(() => {
    if (!enabled) return undefined;

    let learnCleanup = null;
    let speakingCleanup = null;

    const mountLearn = () => {
      if (learnTarget) return;
      const overviewSection = findSectionByTitle("Lesson overview");
      const grammarSection = findSectionByTitle("Grammar and useful language");
      if (!overviewSection || !grammarSection) return;

      const overviewHeading = overviewSection.querySelector(":scope > h2");
      const oldOverviewTitle = overviewHeading?.textContent || "Lesson overview";
      if (overviewHeading) overviewHeading.textContent = "What you will learn in this chapter";

      const mount = document.createElement("div");
      mount.setAttribute("data-c1-day2-learn-upgrade", "true");
      overviewSection.appendChild(mount);

      const hiddenOverviewChildren = Array.from(overviewSection.children).filter(
        (child) => child !== overviewHeading && child !== mount
      );
      const previousOverviewDisplays = hiddenOverviewChildren.map((child) => child.style.display);
      hiddenOverviewChildren.forEach((child) => { child.style.display = "none"; });

      const grammarHeading = grammarSection.querySelector(":scope > h2");
      const oldGrammarTitle = grammarHeading?.textContent || "Grammar and useful language";
      if (grammarHeading) grammarHeading.textContent = "Grammar notes";

      const videoBox = Array.from(grammarSection.querySelectorAll("div")).find((element) =>
        Array.from(element.children || []).some(
          (child) => child.tagName === "STRONG" && child.textContent?.trim() === "Video explanation"
        )
      );
      const previousVideoDisplay = videoBox?.style.display || "";
      if (videoBox) videoBox.style.display = "none";

      setLearnTarget(mount);
      learnCleanup = () => {
        hiddenOverviewChildren.forEach((child, index) => {
          child.style.display = previousOverviewDisplays[index] || "";
        });
        if (overviewHeading) overviewHeading.textContent = oldOverviewTitle;
        if (grammarHeading) grammarHeading.textContent = oldGrammarTitle;
        if (videoBox) videoBox.style.display = previousVideoDisplay;
        mount.remove();
        setLearnTarget(null);
      };
    };

    const mountSpeaking = () => {
      if (speakingTarget) return;
      const speakingSection = findSectionByTitle("Speaking builder");
      if (!speakingSection) return;

      const heading = speakingSection.querySelector(":scope > h2");
      const firstContent = Array.from(speakingSection.children).find((child) => child !== heading);
      const mount = document.createElement("div");
      mount.setAttribute("data-c1-day2-speaking-map", "true");
      speakingSection.insertBefore(mount, firstContent || null);
      setSpeakingTarget(mount);

      speakingCleanup = () => {
        mount.remove();
        setSpeakingTarget(null);
      };
    };

    const sync = () => {
      mountLearn();
      mountSpeaking();
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      learnCleanup?.();
      speakingCleanup?.();
    };
  }, [enabled, learnTarget, speakingTarget]);

  if (!enabled) return null;

  return (
    <>
      {learnTarget ? createPortal(<LearnUpgrade />, learnTarget) : null}
      {speakingTarget ? createPortal(<SpeakingIdeaMap />, speakingTarget) : null}
    </>
  );
}

export default C1Day2LearningSpeakingAutoMount;
