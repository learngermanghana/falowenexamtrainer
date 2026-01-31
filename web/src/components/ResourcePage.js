import React from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";

const ResourcePage = () => {
  const { t } = useTranslation();
  const sections = t("resourcePage.sections", { returnObjects: true });

  return (
    <div style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h2 style={styles.sectionTitle}>{t("resourcePage.title")}</h2>
          <p style={styles.helperText}>{t("resourcePage.subtitle")}</p>
        </div>
        <span style={styles.badge}>{t("resourcePage.badge")}</span>
      </div>
      <div style={styles.gridTwo}>
        {sections.map((section) => (
          <div key={section.title} style={{ ...styles.card, marginBottom: 0 }}>
            <h3 style={{ margin: "0 0 6px 0" }}>{section.title}</h3>
            <ul style={styles.checklist}>
              {section.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcePage;
