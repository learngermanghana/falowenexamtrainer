import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppBackButton from "../navigation/AppBackButton";
import RadioFirstWorkbookGate from "../RadioFirstWorkbookGate";
import { styles } from "../../styles";

const MATERIALS_PARAM = "materials";
const MATERIALS_DONE = "done";

const toResource = (resource, fallbackTitle) => {
  if (!resource) return null;
  if (typeof resource === "string") {
    const url = String(resource || "").trim();
    return url ? { url, title: fallbackTitle } : null;
  }
  const url = String(resource.url || resource.href || "").trim();
  return url ? { ...resource, url, title: resource.title || fallbackTitle } : null;
};

const isInternalUrl = (url = "") => String(url || "").startsWith("/");

export const hasCompletedSelfLearningMaterials = (search = "") => {
  try {
    return new URLSearchParams(search).get(MATERIALS_PARAM) === MATERIALS_DONE;
  } catch (_error) {
    return false;
  }
};

export const buildCompletedMaterialsSearch = (search = "") => {
  const params = new URLSearchParams(search || "");
  params.set(MATERIALS_PARAM, MATERIALS_DONE);
  const query = params.toString();
  return query ? `?${query}` : "";
};

const ResourceCard = ({ number, icon, title, description, actionLabel, resource }) => {
  if (!resource?.url) return null;
  const externalProps = isInternalUrl(resource.url)
    ? {}
    : { target: "_blank", rel: "noreferrer" };

  return (
    <article
      data-self-learning-material-card={title.toLowerCase().replace(/\s+/g, "-")}
      style={{
        ...styles.card,
        border: "1px solid #dbeafe",
        borderRadius: 16,
        display: "grid",
        gridTemplateColumns: "38px minmax(0, 1fr)",
        gap: 10,
        padding: 12,
        boxShadow: "none",
      }}
    >
      <span
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          background: "#eff6ff",
          color: "#1d4ed8",
          fontWeight: 900,
        }}
      >
        {number}
      </span>
      <div style={{ display: "grid", gap: 7, minWidth: 0 }}>
        <strong style={{ fontSize: 15 }}>{icon} {title}</strong>
        {description ? (
          <span style={{ color: "#64748b", lineHeight: 1.5, fontSize: 13 }}>{description}</span>
        ) : null}
        <a
          href={resource.url}
          {...externalProps}
          style={{ ...styles.secondaryButton, width: "fit-content", textDecoration: "none" }}
        >
          {actionLabel}
        </a>
      </div>
    </article>
  );
};

export const SelfLearningMaterialsSelector = ({
  level,
  day,
  title = "",
  teacherVideo = null,
  aiVideo = null,
  grammarBook = null,
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const completedFromUrl = hasCompletedSelfLearningMaterials(location.search);
  const [enteredLearningContent, setEnteredLearningContent] = useState(completedFromUrl);

  useEffect(() => {
    if (completedFromUrl && !enteredLearningContent) setEnteredLearningContent(true);
  }, [completedFromUrl, enteredLearningContent]);

  const teacher = useMemo(
    () => toResource(teacherVideo, "Teacher lecture video"),
    [teacherVideo],
  );
  const ai = useMemo(
    () => toResource(aiVideo, "AI lecture / grammar video"),
    [aiVideo],
  );
  const grammar = useMemo(
    () => toResource(grammarBook, "Grammar book"),
    [grammarBook],
  );

  if (enteredLearningContent) return children;

  const enterWorkbook = () => {
    const nextSearch = buildCompletedMaterialsSearch(location.search);
    setEnteredLearningContent(true);
    navigate(
      { pathname: location.pathname, search: nextSearch, hash: location.hash || "" },
      { replace: true },
    );
  };

  let number = 0;
  return (
    <div
      data-self-learning-materials-selector="true"
      style={{ ...styles.container, display: "grid", gap: 16, maxWidth: 980 }}
    >
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <header
        style={{
          ...styles.card,
          border: "1px solid #bfdbfe",
          borderRadius: 20,
          background: "linear-gradient(135deg, #eff6ff, #ffffff)",
          display: "grid",
          gap: 9,
        }}
      >
        <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1d4ed8" }}>
          Self-learning
        </span>
        <h1 style={{ margin: 0 }}>
          {String(level || "").toUpperCase()} · Day {day} · Choose your learning material
        </h1>
        {title ? <strong style={{ color: "#334155" }}>{title}</strong> : null}
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
          Open any available explanation you need. When you are ready, open the self-learning workbook below. This lesson is not submitted for tutor marking.
        </p>
      </header>

      <section
        style={{
          border: "1px solid #bfdbfe",
          background: "#eff6ff",
          borderRadius: 16,
          padding: 12,
          display: "grid",
          gap: 9,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20 }}>Learning materials</h2>
        <div style={{ display: "grid", gap: 8 }}>
          {teacher ? (
            <ResourceCard
              number={String(++number)}
              icon="🎬"
              title="Teacher lecture video"
              description={teacher.description || "Watch the recorded teacher explanation when it is available."}
              actionLabel="Watch teacher video"
              resource={teacher}
            />
          ) : null}
          {ai ? (
            <ResourceCard
              number={String(++number)}
              icon="🤖"
              title="AI lecture / grammar video"
              description={ai.description || "Use the AI explanation to review the lesson topic and grammar."}
              actionLabel="Watch AI video"
              resource={ai}
            />
          ) : null}
          {grammar ? (
            <ResourceCard
              number={String(++number)}
              icon="📘"
              title="Grammar book"
              description={grammar.description || "Read the grammar notes and examples before or after the videos."}
              actionLabel="Open grammar book"
              resource={grammar}
            />
          ) : null}

          <article
            data-self-learning-material-card="workbook"
            style={{
              ...styles.card,
              border: "1px solid #93c5fd",
              borderRadius: 16,
              display: "grid",
              gridTemplateColumns: "38px minmax(0, 1fr)",
              gap: 10,
              padding: 12,
              boxShadow: "none",
            }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: "#dbeafe",
                color: "#1d4ed8",
                fontWeight: 900,
              }}
            >
              {String(++number)}
            </span>
            <div style={{ display: "grid", gap: 7 }}>
              <strong style={{ fontSize: 15 }}>📝 Self-learning workbook</strong>
              <span style={{ color: "#64748b", lineHeight: 1.5, fontSize: 13 }}>
                Continue to the lesson activities, Goethe speaking practice, writing practice and self-check tasks.
              </span>
              <button type="button" onClick={enterWorkbook} style={{ ...styles.primaryButton, width: "fit-content" }}>
                Open self-learning workbook
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

const SelfLearningJourneyGate = ({
  level,
  day,
  title = "",
  radio = null,
  teacherVideo = null,
  aiVideo = null,
  grammarBook = null,
  children,
}) => {
  const materials = (
    <SelfLearningMaterialsSelector
      level={level}
      day={day}
      title={title}
      teacherVideo={teacherVideo}
      aiVideo={aiVideo}
      grammarBook={grammarBook}
    >
      {children}
    </SelfLearningMaterialsSelector>
  );

  if (!radio) return materials;

  return (
    <RadioFirstWorkbookGate level={level} day={day} resource={radio}>
      {materials}
    </RadioFirstWorkbookGate>
  );
};

export default SelfLearningJourneyGate;
