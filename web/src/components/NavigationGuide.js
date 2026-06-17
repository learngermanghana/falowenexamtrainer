import React from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import HomeClassMembersPortal from "./HomeClassMembersPortal";

const NavigationGuide = () => {
  const { t } = useTranslation();

  return (
    <>
      <HomeClassMembersPortal />
      <section style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div>
          <p style={{ ...styles.helperText, margin: 0 }}>
            {t("navigationGuide.message")}
          </p>
        </div>
      </section>
    </>
  );
};

export default NavigationGuide;
