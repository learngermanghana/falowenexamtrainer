import React from "react";

export const YOUTUBE_SUBSCRIBE_URL = "https://www.youtube.com/@LLEAGhana?sub_confirmation=1";

const baseStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  borderRadius: 999,
  border: "1px solid #b91c1c",
  background: "#dc2626",
  color: "#ffffff",
  fontWeight: 800,
  textDecoration: "none",
  boxShadow: "0 12px 22px rgba(220,38,38,0.3)",
};

const SubscribeOnYouTubeButton = ({ floating = false, style = {}, children }) => {
  const resolvedStyle = floating
    ? {
      ...baseStyle,
      position: "fixed",
      right: 16,
      bottom: 16,
      zIndex: 1200,
      padding: "11px 16px",
      fontSize: 14,
      maxWidth: "calc(100vw - 32px)",
      ...style,
    }
    : {
      ...baseStyle,
      padding: "10px 14px",
      fontSize: 14,
      ...style,
    };

  return (
    <a href={YOUTUBE_SUBSCRIBE_URL} target="_blank" rel="noopener noreferrer" style={resolvedStyle}>
      <span aria-hidden>▶️</span>
      {children || "Subscribe on YouTube"}
    </a>
  );
};

export default SubscribeOnYouTubeButton;
