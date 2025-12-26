import React from "react";

const toneTokens = {
  neutral: { background: "#f8fafc", border: "#e5e7eb", color: "#0f172a" },
  info: { background: "#ecfeff", border: "#67e8f9", color: "#0e7490" },
  success: { background: "#ecfdf3", border: "#bbf7d0", color: "#166534" },
  warning: { background: "#fef9c3", border: "#fcd34d", color: "#a16207" },
  error: { background: "#fef2f2", border: "#fecdd3", color: "#b91c1c" },
};

const getTone = (tone = "neutral") => toneTokens[tone] || toneTokens.neutral;

export const PillBadge = ({ tone = "neutral", children }) => {
  const token = getTone(tone);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 999,
        background: token.background,
        color: token.color,
        fontWeight: 700,
        fontSize: 12,
        border: `1px solid ${token.border}`,
      }}
    >
      {children}
    </span>
  );
};

export const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  actions,
  align = "left",
  spacing = 6,
}) => {
  const alignment = align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";
  return (
    <div style={{ display: "grid", gap: spacing }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "grid", gap: 4, textAlign: align === "center" ? "center" : "left" }}>
          {eyebrow ? (
            <p style={{ margin: 0, fontSize: 13, color: "#4b5563", fontWeight: 600 }}>{eyebrow}</p>
          ) : null}
          <h2
            style={{
              margin: 0,
              fontSize: 22,
              color: "#0f172a",
              letterSpacing: -0.2,
              textAlign: align === "center" ? "center" : "left",
            }}
          >
            {title}
          </h2>
        </div>
        {actions ? <div style={{ display: "flex", justifyContent: "flex-end" }}>{actions}</div> : null}
      </div>
      {subtitle ? (
        <p style={{ margin: 0, fontSize: 14, color: "#4b5563", textAlign: alignment }}>{subtitle}</p>
      ) : null}
    </div>
  );
};

export const StatCard = ({ label, value, helper, tone = "neutral", footer, align = "left" }) => {
  const token = getTone(tone);
  return (
    <div
      style={{
        border: `1px solid ${token.border}`,
        borderRadius: 12,
        padding: 14,
        background: token.background,
        display: "grid",
        gap: 6,
        alignContent: "flex-start",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.04)",
      }}
    >
      {label ? (
        <p style={{ margin: 0, fontSize: 13, color: token.color, fontWeight: 700, textAlign: align }}>{label}</p>
      ) : null}
      <h4 style={{ margin: "2px 0", fontSize: 18, textAlign: align, color: "#0f172a" }}>{value}</h4>
      {helper ? (
        <p style={{ margin: 0, fontSize: 13, color: "#4b5563", textAlign: align }}>{helper}</p>
      ) : null}
      {footer ? <div style={{ fontSize: 13, color: "#374151", textAlign: align }}>{footer}</div> : null}
    </div>
  );
};

export const InfoBox = ({ tone = "info", title, children, inline = false }) => {
  const token = getTone(tone === "warn" ? "warning" : tone);
  const content = (
    <div
      style={{
        padding: inline ? "6px 10px" : 12,
        borderRadius: inline ? 999 : 10,
        background: token.background,
        color: token.color,
        border: `1px solid ${token.border}`,
        fontSize: 14,
        display: "grid",
        gap: 4,
      }}
    >
      {title ? <strong style={{ fontSize: 14 }}>{title}</strong> : null}
      {children}
    </div>
  );

  return inline ? <span style={{ display: "inline-block" }}>{content}</span> : content;
};

export const EmptyState = ({ title, description, action, tone = "neutral" }) => {
  const token = getTone(tone);
  return (
    <div
      style={{
        border: `1px dashed ${token.border}`,
        background: token.background,
        color: token.color,
        padding: 16,
        borderRadius: 12,
        display: "grid",
        gap: 6,
      }}
    >
      {title ? <h3 style={{ margin: 0, fontSize: 16 }}>{title}</h3> : null}
      {description ? <p style={{ margin: 0, color: "#374151" }}>{description}</p> : null}
      {action ? <div>{action}</div> : null}
    </div>
  );
};

export const SkeletonRow = ({ lines = 3, widths = [] }) => {
  const count = Math.max(1, lines);
  const items = Array.from({ length: count }).map((_, idx) => widths[idx] || "100%");

  return (
    <div className="skeleton-row">
      {items.map((width, idx) => (
        <div key={idx} className="skeleton-line" style={{ width }} />
      ))}
    </div>
  );
};

export const PrimaryActionBar = ({ children, align = "space-between", wrap = true }) => {
  const justifyMap = {
    left: "flex-start",
    start: "flex-start",
    center: "center",
    right: "flex-end",
    end: "flex-end",
    "flex-end": "flex-end",
  };
  const justify = justifyMap[align] || "space-between";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: justify,
        gap: 10,
        flexWrap: wrap ? "wrap" : "nowrap",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
};
