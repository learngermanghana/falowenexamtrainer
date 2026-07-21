import React from "react";
import { styles } from "../../styles";

const toResource = (resource, fallbackTitle) => {
  if (!resource) return null;
  if (typeof resource === "string") {
    const url = String(resource || "").trim();
    return url ? { url, title: fallbackTitle } : null;
  }
  const url = String(resource.url || resource.href || "").trim();
  return url ? { ...resource, url, title: resource.title || fallbackTitle } : null;
};

const resourceButtonStyle = {
  ...styles.secondaryButton,
  display: "inline-flex",
  width: "fit-content",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  padding: "7px 10px",
  fontSize: 12,
  fontWeight: 800,
};

const resourceCardStyle = {
  border: "1px solid #dbeafe",
  background: "#ffffff",
  borderRadius: 10,
  padding: 9,
  display: "grid",
  gridTemplateColumns: "28px minmax(0, 1fr)",
  gap: 8,
  alignItems: "start",
};

const ResourceItem = ({ number, icon, title, actionLabel, resource, type }) => {
  if (!resource?.url) return null;
  return (
    <article style={resourceCardStyle} data-self-learning-media-resource={type}>
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#eff6ff",
          color: "#1d4ed8",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: 12,
        }}
      >
        {number}
      </span>
      <div style={{ display: "grid", gap: 6, minWidth: 0 }}>
        <strong style={{ fontSize: 13, lineHeight: 1.25 }}>
          {icon} {title}
        </strong>
        {resource.description ? (
          <span style={{ color: "#64748b", fontSize: 12, lineHeight: 1.45 }}>
            {resource.description}
          </span>
        ) : null}
        <a
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          style={resourceButtonStyle}
        >
          {actionLabel}
        </a>
      </div>
    </article>
  );
};

export default function SelfLearningSupportingMaterials({
  aiVideo = null,
  teacherVideo = null,
  description = "Open the lesson videos before continuing with the self-learning activities.",
}) {
  const teacher = toResource(teacherVideo, "Teacher lecture video");
  const ai = toResource(aiVideo, "AI lecture / grammar video");
  const resources = [teacher, ai].filter(Boolean);
  if (!resources.length) return null;

  let number = 0;
  return (
    <section
      data-self-learning-supporting-materials="true"
      style={{
        border: "1px solid #bfdbfe",
        background: "#eff6ff",
        borderRadius: 12,
        padding: 10,
        display: "grid",
        gap: 8,
      }}
    >
      <div style={{ display: "grid", gap: 3 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Supporting materials</h2>
        <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.45, fontSize: 12 }}>
          {description}
        </p>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        {teacher ? (
          <ResourceItem
            number={String(++number)}
            icon="🎬"
            title="Teacher lecture video"
            actionLabel="Watch teacher video"
            resource={teacher}
            type="teacher"
          />
        ) : null}
        {ai ? (
          <ResourceItem
            number={String(++number)}
            icon="🤖"
            title="AI lecture / grammar video"
            actionLabel="Watch AI video"
            resource={ai}
            type="ai"
          />
        ) : null}
      </div>
    </section>
  );
}
