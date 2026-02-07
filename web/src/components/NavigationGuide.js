import React from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";

const NavigationGuide = () => {
  const { t } = useTranslation();

  return (
    <section style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div>
        <p style={{ ...styles.helperText, margin: 0 }}>
          {t("navigationGuide.message")}
        </p>
      </div>
    </section>
  );
};

export default NavigationGuide;
