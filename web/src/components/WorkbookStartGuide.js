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
  borderRadius: 16,
  padding: 16,
  display: "grid",
  gap: 14,
};

const actionButtonStyle = {
  ...styles.secondaryButton,
  display: "inline-flex",
  width: "fit-content",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
};

const stepStyle = {
  border: "1px solid #dbeafe",
  background: "#ffffff",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
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
  if (title.includes("teacher")) return "Watch teacher explanation";
  if (title.includes("ai")) return "Watch AI grammar video";
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
      <div style={{ display: "grid", gap: 4 }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Before you start</h2>
        <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>
          Follow these steps before you complete this workbook{chapterText}. Watch, review the grammar, then answer the workbook tasks.
        </p>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <article style={stepStyle}>
          <strong>Step 1: Watch the lesson videos</strong>
          {videos.length ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {videos.map((resource) => (
                <a key={resource.key || resource.url} href={resource.url} {...getExternalProps(resource.url)} style={actionButtonStyle}>
                  🎬 {getVideoLabel(resource)}
                </a>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, color: "#6b7280" }}>No lesson video has been added yet.</p>
          )}
        </article>

        <article style={stepStyle}>
          <strong>Step 2: Review the grammar notes</strong>
          {derivedGrammarUrl ? (
            <a href={derivedGrammarUrl} {...getExternalProps(derivedGrammarUrl)} style={actionButtonStyle}>
              📘 Open grammar notes
            </a>
          ) : (
            <p style={{ margin: 0, color: "#6b7280" }}>Grammar notes will appear here when they are added.</p>
          )}
        </article>

        <article style={stepStyle}>
          <strong>Step 3: Complete this workbook</strong>
          <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>
            Work through the tasks on this page. Submit your final answers in the submission area when you finish.
          </p>
        </article>
      </div>
    </section>
  );
};

export default WorkbookStartGuide;
