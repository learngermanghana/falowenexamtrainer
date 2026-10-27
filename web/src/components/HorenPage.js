import React from "react";
import { useNavigate } from "react-router-dom";
import { announceExamSuccess } from "../services/interactionFeedback";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";
import ListeningPracticeSamplePage from "./ListeningPracticeSamplePage";
import A1MockHoerenPractice from "./A1MockHoerenPractice";

const HorenPage = ({ practiceLevel = "", sampleId = "" }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const openListeningSample = (route, message = "Hören practice opened successfully.") => {
    announceExamSuccess(message);
    navigate(route);
  };
  const { level } = useExam();
  const profileLevel = String(level || "A1").toUpperCase();
  const routeLevel = String(practiceLevel || "").toUpperCase();
  const normalizedLevel = ["A1", "A2", "B1", "B2", "C1"].includes(routeLevel) ? routeLevel : profileLevel;

  if (["A1", "A2", "B1", "B2", "C1"].includes(normalizedLevel)) {
    if (sampleId) {
      const sampleExists =
        sampleId === "sample-1" ||
        (normalizedLevel === "A1" && ["sample-2", "sample-3", "sample-4", "sample-5", "sample-6", "sample-7", "sample-8"].includes(sampleId)) ||
        (normalizedLevel === "A2" && sampleId === "sample-2");

      if (!sampleExists) {
        return (
          <section style={{ ...styles.card, display: "grid", gap: 10 }}>
            <h2 style={{ margin: 0 }}>{normalizedLevel} Hören sample not found</h2>
            <button type="button" style={styles.secondaryButton} onClick={() => openListeningSample("/exams/horen", "Hören samples opened successfully.")}>
              Back to Hören samples
            </button>
          </section>
        );
      }

      if (normalizedLevel === "A1" && /^sample-[4-8]$/.test(sampleId)) {
        return <A1MockHoerenPractice sampleId={sampleId} />;
      }

      return <ListeningPracticeSamplePage level={normalizedLevel} sampleId={sampleId} />;
    }

    return (
      <section style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>{normalizedLevel} Hören practice</h2>
          <p style={{ margin: "6px 0 0", color: "#4b5563" }}>
            Choose a listening sample to practise.
          </p>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <button
            type="button"
            onClick={() => openListeningSample(`/exams/horen/${normalizedLevel.toLowerCase()}/sample-1`, "Hören Sample 1 opened successfully.")}
            style={{
              ...styles.secondaryButton,
              width: "100%",
              textAlign: "left",
              display: "grid",
              gap: 4,
              padding: "14px 16px",
            }}
          >
            <strong>Hören Sample 1</strong>
            <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.8 }}>
              {normalizedLevel === "A1"
                ? "15 questions · Teil 1–3"
                : normalizedLevel === "A2"
                  ? "20 questions · Teil 1–4"
                  : "30 questions · Teil 1–4"}
            </span>
          </button>

          {normalizedLevel === "B1" ? (
            <button
              type="button"
              onClick={() => openListeningSample("/campus/course/b1-mock-2-hoeren", "B1 Hören Sample 2 opened successfully.")}
              style={{
                ...styles.secondaryButton,
                width: "100%",
                textAlign: "left",
                display: "grid",
                gap: 4,
                padding: "14px 16px",
              }}
            >
              <strong>Hören Sample 2</strong>
              <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.8 }}>
                30 questions · Teil 1–4 · From B1 Mock 2 · server-graded
              </span>
            </button>
          ) : null}

          {normalizedLevel === "A2" ? (
            <button
              type="button"
              onClick={() => openListeningSample("/exams/horen/a2/sample-2", "Hören Sample 2 opened successfully.")}
              style={{
                ...styles.secondaryButton,
                width: "100%",
                textAlign: "left",
                display: "grid",
                gap: 4,
                padding: "14px 16px",
              }}
            >
              <strong>Hören Sample 2</strong>
              <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.8 }}>
                20 questions · Teil 1–4 · From A2 Mock 2
              </span>
            </button>
          ) : null}

          {normalizedLevel === "A1" ? (
            <>
              <button
                type="button"
                onClick={() => openListeningSample("/exams/horen/a1/sample-2", "Hören Sample 2 opened successfully.")}
                style={{
                  ...styles.secondaryButton,
                  width: "100%",
                  textAlign: "left",
                  display: "grid",
                  gap: 4,
                  padding: "14px 16px",
                }}
              >
                <strong>Hören Sample 2</strong>
                <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.8 }}>
                  15 questions · Teil 1–3
                </span>
              </button>

              <button
                type="button"
                onClick={() => openListeningSample("/exams/horen/a1/sample-3", "Hören Sample 3 opened successfully.")}
                style={{
                  ...styles.secondaryButton,
                  width: "100%",
                  textAlign: "left",
                  display: "grid",
                  gap: 4,
                  padding: "14px 16px",
                }}
              >
                <strong>Hören Sample 3</strong>
                <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.8 }}>
                  15 questions · Teil 1–3
                </span>
              </button>
              {[4, 5, 6, 7, 8].map(number => (
                <button
                  key={number}
                  type="button"
                  onClick={() => openListeningSample(`/exams/horen/a1/sample-${number}`, `Hören Sample ${number} opened successfully.`)}
                  style={{
                    ...styles.secondaryButton,
                    width: "100%",
                    textAlign: "left",
                    display: "grid",
                    gap: 4,
                    padding: "14px 16px",
                  }}
                >
                  <strong>Hören Sample {number}</strong>
                  <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.8 }}>
                    15 questions · Teil 1–3 · From A1 Mock {number} · server-graded
                  </span>
                </button>
              ))}
            </>
          ) : null}
        </div>
      </section>
    );
  }

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
