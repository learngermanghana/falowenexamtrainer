import React from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";

const HorenPage = () => {
  const { t } = useTranslation();
  const day2GermanAlphabetUrl = "https://youtu.be/pCQVdJGsvtk";
  const horenPlaylistUrl =
    "https://www.youtube.com/watch?list=PLg78ckjpHfZy5lkbq8bw26rLXkZ8jLRUN&v=H2eUgxXfkS4&feature=youtu.be";
  const horenThumbnailUrl = "https://i.ytimg.com/vi/H2eUgxXfkS4/hqdefault.jpg";

  return (
    <section style={{ ...styles.card, display: "grid", gap: 12 }}>
      <h2 style={{ margin: 0 }}>{t("horenPage.title")}</h2>
      <p style={{ margin: 0, color: "#4b5563" }}>
        {t("horenPage.subtitle")}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <a
          href={day2GermanAlphabetUrl}
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none" }}
        >
          {t("horenPage.actions.day2GermanAlphabet", {
            defaultValue: "Open Day 2 German Alphabet Hören on YouTube",
          })}
        </a>
        <a
          href={horenPlaylistUrl}
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.secondaryButton, width: "fit-content", textDecoration: "none" }}
        >
          {t("horenPage.actions.playlist")}
        </a>
      </div>
      <a
        href={horenPlaylistUrl}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "grid",
          gap: 8,
          textDecoration: "none",
          color: "inherit",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #dbeafe",
          background: "#ffffff",
          maxWidth: 440,
        }}
      >
        <img
          src={horenThumbnailUrl}
          alt="Hören practice playlist thumbnail"
          style={{ width: "100%", height: "auto", display: "block" }}
          loading="lazy"
        />
        <div style={{ padding: "0 10px 10px", color: "#1f2937", fontWeight: 600 }}>
          {t("horenPage.actions.playlist")}
        </div>
      </a>
    </section>
  );
};

export default HorenPage;
