import React, { useEffect, useRef } from "react";
import A1Day3SchreibenSprechenKapitel11WorkbookPageLegacy from "./A1Day3SchreibenSprechenKapitel11WorkbookPageLegacy";

export const A1_DAY3_PRACTICE_VIDEOS = Object.freeze([
  Object.freeze({
    key: "ai-lesson-video",
    label: "AI lesson video",
    title: "Kapitel 1.1 AI lesson",
    description:
      "Review the Kapitel 1.1 language and speaking practice before continuing with the workbook activities.",
    youtubeId: "DnfWKdi6DsA",
    url: "https://youtu.be/DnfWKdi6DsA",
  }),
  Object.freeze({
    key: "teacher-lecture-video",
    label: "Teacher lecture video",
    title: "Kapitel 1.1 teacher lecture",
    description:
      "Watch the recorded teacher explanation for additional examples, pronunciation support and guided practice.",
    youtubeId: "LdCVsY-SFTg",
    url: "https://youtu.be/LdCVsY-SFTg",
  }),
]);

const answerClues = [
  "Das ist ein Ball.",
  "Martin ist in Ghana.",
  "Der Ball ist klein.",
  "Das ist Martin.",
  "Martin spielt mit dem Ball.",
  "Ich heiße Felix.",
  "Meine Mutter wohnt in Accra.",
  "Ich bin Lehrer.",
  "Sie heißt Anna.",
];

const replaceText = (element, label, value) => {
  if (!element) return;
  const strong = document.createElement("strong");
  strong.textContent = label;
  element.replaceChildren(strong, document.createTextNode(` ${value}`));
};

const removeSectionByText = (root, selector, text) => {
  const marker = Array.from(root?.querySelectorAll(selector) || []).find(
    (element) => element.textContent?.trim() === text
  );
  const section = marker?.closest("section") || marker?.parentElement;
  if (section) section.remove();
};

const removeExcludedSections = (root) => {
  removeSectionByText(root, "h1, h2, h3, h4", "Teil 1 · Reading / Writing");
  removeSectionByText(root, "p", "Class activity");
};

const updateWWordExercise = (root) => {
  const heading = Array.from(root?.querySelectorAll("h1, h2, h3, h4") || []).find(
    (element) => element.textContent?.trim() === "Lückentext mit W-Wörtern"
  );
  const section = heading?.closest("section") || heading?.parentElement;
  if (!section) return;

  const instruction = Array.from(section.querySelectorAll("p")).find((element) =>
    element.textContent?.includes("Below are questions that use the German")
  );
  if (instruction) {
    instruction.textContent =
      "Read the answer first. Then complete the matching question with the correct German W-word (Was, Wer, Wie, Wo). The answer tells you what information the question is asking for.";
  }

  const boxes = Array.from(section.querySelectorAll("div")).filter((element) =>
    element.textContent?.trim().startsWith("Example:")
  );
  boxes.slice(0, answerClues.length).forEach((element, index) =>
    replaceText(element, "Antwort:", answerClues[index])
  );
};

const updateWorkbook = (root) => {
  removeExcludedSections(root);
  updateWWordExercise(root);
};

const videoSectionStyle = {
  width: "min(1120px, calc(100% - 24px))",
  margin: "16px auto 0",
  padding: 16,
  boxSizing: "border-box",
  border: "1px solid #bfdbfe",
  borderRadius: 18,
  background: "linear-gradient(135deg, #eff6ff, #ffffff)",
  boxShadow: "0 14px 30px rgba(37, 99, 235, 0.1)",
  display: "grid",
  gap: 14,
};

const videoGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 14,
};

const videoCardStyle = {
  border: "1px solid #dbeafe",
  borderRadius: 16,
  background: "#ffffff",
  padding: 12,
  display: "grid",
  gap: 10,
  minWidth: 0,
};

const videoShellStyle = {
  aspectRatio: "16 / 9",
  background: "#000000",
  borderRadius: 12,
  overflow: "hidden",
  position: "relative",
  width: "100%",
};

const LessonVideoCard = ({ video }) => (
  <article style={videoCardStyle} data-a1-day3-video={video.key}>
    <div style={{ display: "grid", gap: 4 }}>
      <span
        style={{
          color: video.key === "ai-lesson-video" ? "#1d4ed8" : "#7c3aed",
          fontSize: 12,
          fontWeight: 900,
          letterSpacing: ".04em",
          textTransform: "uppercase",
        }}
      >
        {video.label}
      </span>
      <strong style={{ color: "#0f172a", fontSize: 18 }}>{video.title}</strong>
      <p style={{ color: "#475569", lineHeight: 1.55, margin: 0 }}>{video.description}</p>
    </div>

    <div style={videoShellStyle}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
        title={video.title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ border: 0, height: "100%", inset: 0, position: "absolute", width: "100%" }}
      />
    </div>

    <a
      href={video.url}
      target="_blank"
      rel="noreferrer"
      style={{ color: "#1d4ed8", fontWeight: 800, width: "fit-content" }}
    >
      Open {video.label.toLowerCase()} on YouTube
    </a>
  </article>
);

export default function A1Day3SchreibenSprechenKapitel11WorkbookPage() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    updateWorkbook(root);
    const observer = new MutationObserver(() => updateWorkbook(root));
    observer.observe(root, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef}>
      <section
        data-a1-workbook-owned-media="true"
        data-radio-first-workbook-gate="true"
        aria-labelledby="a1-day3-practice-videos-title"
        style={videoSectionStyle}
      >
        <div style={{ display: "grid", gap: 4 }}>
          <h2 id="a1-day3-practice-videos-title" style={{ color: "#0f172a", margin: 0 }}>
            Lesson videos
          </h2>
          <p style={{ color: "#475569", lineHeight: 1.55, margin: 0 }}>
            Watch the AI lesson and the teacher lecture, then continue with the Kapitel 1.1 practice book.
          </p>
        </div>
        <div style={videoGridStyle}>
          {A1_DAY3_PRACTICE_VIDEOS.map((video) => (
            <LessonVideoCard key={video.key} video={video} />
          ))}
        </div>
      </section>
      <A1Day3SchreibenSprechenKapitel11WorkbookPageLegacy />
    </div>
  );
}
