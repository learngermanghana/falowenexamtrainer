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

function VideoCard({ resource }) {
  const embedUrl = getYouTubeEmbedUrl(resource.url);
  if (!embedUrl) return null;

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
    </article>
  );
}

function LearnUpgrade() {
  const { learn } = c1Day2LearningSpeakingGuide;
  const availableVideos = learn.videos.filter((resource) => getYouTubeEmbedUrl(resource.url));

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

      {availableVideos.length ? (
        <div style={{ display: "grid", gap: 10 }}>
          <h3 style={{ margin: 0 }}>Watch before the grammar notes</h3>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            Watch the grammar explanation, then continue with the complete grammar notes below.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            {availableVideos.map((resource) => <VideoCard key={resource.key} resource={resource} />)}
          </div>
        </div>
      ) : null}
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

  useEffect(() => {
    if (!enabled) return undefined;

    let learnMount = null;
    let learnCleanup = null;

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

    const sync = () => {
      mountLearn();
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      learnCleanup?.();
    };
  }, [enabled, location.pathname]);

  if (!enabled) return null;

  return learnTarget?.isConnected ? createPortal(<LearnUpgrade />, learnTarget) : null;
}

export default C1Day2LearningSpeakingAutoMount;
