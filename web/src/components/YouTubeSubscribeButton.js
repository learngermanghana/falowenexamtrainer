import React from "react";
import { styles } from "../styles";

const YOUTUBE_SUBSCRIBE_URL = "https://www.youtube.com/@LLEAGhana?sub_confirmation=1";

const YouTubeSubscribeButton = ({ label = "Subscribe on YouTube" }) => (
  <a
    href={YOUTUBE_SUBSCRIBE_URL}
    target="_blank"
    rel="noreferrer"
    style={{
      ...styles.secondaryButton,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      textDecoration: "none",
      background: "#dc2626",
      borderColor: "#dc2626",
      color: "#ffffff",
      fontWeight: 600,
    }}
    aria-label={label}
  >
    {label}
  </a>
);

export default YouTubeSubscribeButton;
