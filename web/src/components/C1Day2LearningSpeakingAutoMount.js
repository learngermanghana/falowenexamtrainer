import React, { useEffect, useState } from "react";
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

const listStyle = {
  margin: 0,
  paddingLeft: 22,
  lineHeight: 1.75,
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

function SpeakingIdeaList() {
  const { speaking } = c1Day2LearningSpeakingGuide;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div
        style={{
          border: "1px solid #c7d2fe",
          borderRadius: 14,
          padding: 14,
          background: "linear-gradient(135deg, #eef2ff, #ffffff)",
          display: "grid",
          gap: 8,
        }}
      >
        <h3 style={{ margin: 0 }}>{speaking.title}</h3>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>{speaking.instruction}</p>
      </div>

      <ol style={{ ...listStyle, display: "grid", gap: 16 }}>
        {speaking.branches.map((branch) => (
          <li key={branch.id} style={{ paddingLeft: 4 }}>
            <strong>{branch.title}</strong>
            <ul style={{ ...listStyle, marginTop: 6 }}>
              <li><strong>Ideen:</strong> {branch.keywords.join(" · ")}</li>
              <li><strong>Frage:</strong> {branch.prompt}</li>
              <li><strong>Beispielsatz:</strong> {branch.example}</li>
            </ul>
          </li>
        ))}
      </ol>

      <div
        style={{
          border: "1px solid #bae6fd",
          borderRadius: 12,
          padding: 12,
          background: "#ecfeff",
          color: "#155e75",
          lineHeight: 1.65,
        }}
      >
        <strong>So bereitest du deine Antwort vor:</strong> Wähle aus der Liste drei oder vier passende Bereiche aus, notiere ein Beispiel und beantworte danach die eigentliche Sprechfrage darunter.
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

    let learnMount = null;
    let speakingMount = null;
    let learnCleanup = null;
    let speakingCleanup = null;

    const mountLearn = () => {
      if (learnMount?.isConnected) return;
      learnCleanup?.();
      learnCleanup = null;
      learnMount = null;

      const overviewSection = findSectionByTitle("Lesson overview");
      const grammarSection = findSectionByTitle("Grammar and useful language");
      if (!overviewSection || !grammarSection) return;

      const overviewHeading = overviewSection.querySelector(":scope > h2");
      const oldOverviewTitle = overviewHeading?.textContent || "Lesson overview";
      if (overviewHeading) overviewHeading.textContent = "What you will learn in this chapter";

      const mount = document.createElement("div");
      mount.setAttribute("data-c1-day2-learn-upgrade", "true");
      overviewSection.appendChild(mount);
      learnMount = mount;

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
        if (overviewHeading?.isConnected) overviewHeading.textContent = oldOverviewTitle;
        if (grammarHeading?.isConnected) grammarHeading.textContent = oldGrammarTitle;
        if (videoBox) videoBox.style.display = previousVideoDisplay;
        if (mount.isConnected) mount.remove();
      };
    };

    const mountSpeaking = () => {
      if (speakingMount?.isConnected) return;
      speakingCleanup?.();
      speakingCleanup = null;
      speakingMount = null;

      const speakingSection = findSectionByTitle("Speaking builder");
      if (!speakingSection) return;

      const heading = speakingSection.querySelector(":scope > h2");
      const firstContent = Array.from(speakingSection.children).find((child) => child !== heading);
      const mount = document.createElement("div");
      mount.setAttribute("data-c1-day2-speaking-ideas", "true");
      speakingSection.insertBefore(mount, firstContent || null);
      speakingMount = mount;
      setSpeakingTarget(mount);

      speakingCleanup = () => {
        if (mount.isConnected) mount.remove();
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
  }, [enabled, location.pathname]);

  if (!enabled) return null;

  return (
    <>
      {learnTarget?.isConnected ? createPortal(<LearnUpgrade />, learnTarget) : null}
      {speakingTarget?.isConnected ? createPortal(<SpeakingIdeaList />, speakingTarget) : null}
    </>
  );
}

export default C1Day2LearningSpeakingAutoMount;
