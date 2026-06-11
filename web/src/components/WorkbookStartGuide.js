import React, { useMemo } from "react";
import { styles } from "../styles";
import { courseSchedules } from "../data/courseSchedule";
import { getLessonVideoResources } from "../data/lessonVideoDictionary";

const normalizeLevel = (level = "") => String(level || "").trim().toUpperCase();
const isInternalLink = (url = "") => String(url || "").startsWith("/");
const getExternalProps = (url = "") => (isInternalLink(url) ? {} : { target: "_blank", rel: "noreferrer" });
const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const guideStyle = {
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  borderRadius: 12,
  padding: 10,
  display: "grid",
  gap: 8,
};

const actionButtonStyle = {
  ...styles.secondaryButton,
  display: "inline-flex",
  width: "fit-content",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  padding: "7px 10px",
  fontSize: 12,
};

const stepStyle = {
  border: "1px solid #dbeafe",
  background: "#ffffff",
  borderRadius: 10,
  padding: 9,
  display: "grid",
  gap: 6,
};

const findEntry = (level, day) => {
  const normalizedLevel = normalizeLevel(level);
  return (courseSchedules[normalizedLevel] || []).find((lesson) => String(lesson.day) === String(day)) || null;
};

const firstResource = (entry = {}) => {
  const lesenHoeren = toArray(entry.lesen_hören).filter(Boolean);
  const schreibenSprechen = toArray(entry.schreiben_sprechen).filter(Boolean);
  return lesenHoeren[0] || schreibenSprechen[0] || {};
};

const findResourceUrl = (entry = {}, key) => {
  const direct = entry?.[key];
  if (direct) return direct;

  const nested = [...toArray(entry?.lesen_hören), ...toArray(entry?.schreiben_sprechen)].find((resource) => resource?.[key]);
  return nested?.[key] || "";
};

const getVideoLabel = (resource = {}) => {
  const title = String(resource.title || "").toLowerCase();
  if (title.includes("teacher")) return "Teacher video";
  if (title.includes("ai")) return "AI grammar video";
  return "Watch video";
};

const WorkbookStartGuide = ({ level, day, grammarUrl, entry: suppliedEntry }) => {
  const entry = useMemo(() => suppliedEntry || findEntry(level, day), [day, level, suppliedEntry]);
  const videos = useMemo(() => getLessonVideoResources(level, day, entry || {}), [day, entry, level]);
  const derivedGrammarUrl = grammarUrl || findResourceUrl(entry, "grammarbook_link");
  const primaryResource = firstResource(entry);
  const chapterText = primaryResource?.chapter ? ` Kapitel ${primaryResource.chapter}` : "";

  return (
    <section style={guideStyle}>
      <div style={{ display: "grid", gap: 3 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Before you start</h2>
        <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.45, fontSize: 12 }}>
          Watch, review the grammar, then complete this workbook{chapterText}.
        </p>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <article style={stepStyle}>
          <strong style={{ fontSize: 12 }}>Step 1: Watch the lesson videos</strong>
          {videos.length ? (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {videos.map((resource) => (
                <a key={resource.key || resource.url} href={resource.url} {...getExternalProps(resource.url)} style={actionButtonStyle}>
                  🎬 {getVideoLabel(resource)}
                </a>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, color: "#6b7280", fontSize: 12 }}>No lesson video has been added yet.</p>
          )}
        </article>

        <article style={stepStyle}>
          <strong style={{ fontSize: 12 }}>Step 2: Review the grammar notes</strong>
          {derivedGrammarUrl ? (
            <a href={derivedGrammarUrl} {...getExternalProps(derivedGrammarUrl)} style={actionButtonStyle}>
              📘 Open grammar notes
            </a>
          ) : (
            <p style={{ margin: 0, color: "#6b7280", fontSize: 12 }}>Grammar notes will appear here when they are added.</p>
          )}
        </article>

        <article style={stepStyle}>
          <strong style={{ fontSize: 12 }}>Step 3: Complete this workbook</strong>
          <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.45, fontSize: 12 }}>
            Answer the tasks, then submit your final answers in the submission area.
          </p>
        </article>
      </div>
    </section>
  );
};

export default WorkbookStartGuide;
