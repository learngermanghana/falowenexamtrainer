import React from "react";
import { useTranslation } from "react-i18next";
import HomeActions from "./HomeActions";
import { styles } from "../styles";
import ClassCalendarCard from "./ClassCalendarCard";

const PlanPage = ({ onSelect, classCalendarRef }) => {
  const { t } = useTranslation();
  const coursePoints = t("planPage.courseCard.points", { returnObjects: true });
  const examPoints = t("planPage.examCard.points", { returnObjects: true });

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div ref={classCalendarRef}>
        <ClassCalendarCard />
      </div>

      <HomeActions onSelect={onSelect} />

      <div style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <h2 style={styles.sectionTitle}>{t("planPage.title")}</h2>
          <span style={styles.badge}>{t("planPage.badge")}</span>
        </div>
        <p style={styles.helperText}>{t("planPage.intro")}</p>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <div style={{ ...styles.card, marginBottom: 0, background: "#f9fafb" }}>
            <h3 style={{ margin: "0 0 6px 0" }}>{t("planPage.courseCard.title")}</h3>
            <p style={{ ...styles.helperText, marginBottom: 10 }}>{t("planPage.courseCard.description")}</p>
            <ul style={styles.checklist}>
              {coursePoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button style={styles.secondaryButton} onClick={() => onSelect("course")}>
                {t("planPage.courseCard.cta")}
              </button>
            </div>
          </div>

          <div style={{ ...styles.card, marginBottom: 0, background: "#fef3c7", border: "1px solid #f59e0b" }}>
            <h3 style={{ margin: "0 0 6px 0" }}>{t("planPage.examCard.title")}</h3>
            <p style={{ ...styles.helperText, marginBottom: 10 }}>{t("planPage.examCard.description")}</p>
            <ul style={styles.checklist}>
              {examPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button style={styles.primaryButton} onClick={() => onSelect("exam")}>
                {t("planPage.examCard.cta")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanPage;
