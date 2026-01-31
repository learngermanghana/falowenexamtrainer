import React from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";

const HomeActions = ({ onSelect }) => {
  const { t } = useTranslation();
  return (
    <div style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h2 style={styles.sectionTitle}>{t("homeActions.title")}</h2>
        <span style={styles.levelPill}>{t("homeActions.badge")}</span>
      </div>
      <p style={styles.helperText}>{t("homeActions.description")}</p>
      <div style={{ display: "grid", gap: 10 }}>
        <button
          style={{ ...styles.primaryButton, padding: "14px 16px", fontSize: 16 }}
          onClick={() => onSelect("course")}
        >
          {t("homeActions.buttons.course")}
        </button>
        <button
          style={{ ...styles.secondaryButton, padding: "14px 16px", fontSize: 16 }}
          onClick={() => onSelect("exam")}
        >
          {t("homeActions.buttons.exam")}
        </button>
        <button
          style={{ ...styles.secondaryButton, padding: "14px 16px", fontSize: 16 }}
          onClick={() => onSelect("discussion")}
        >
          {t("homeActions.buttons.discussion")}
        </button>
        <button
          style={{ ...styles.secondaryButton, padding: "14px 16px", fontSize: 16 }}
          onClick={() => onSelect("account")}
        >
          {t("homeActions.buttons.account")}
        </button>
      </div>
    </div>
  );
};

export default HomeActions;
