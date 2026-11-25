import React from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";

const copy = {
  en: "Important updates are sent by email. You can also check your notifications and results in Falowen. Device push notifications are no longer available.",
  de: "Wichtige Mitteilungen erhalten Sie per E-Mail. Benachrichtigungen und Ergebnisse finden Sie auch in Falowen. Push-Benachrichtigungen sind nicht mehr verfügbar.",
  fr: "Les informations importantes sont envoyées par e-mail. Vous pouvez aussi consulter vos notifications et vos résultats dans Falowen. Les notifications push ne sont plus disponibles.",
  sw: "Taarifa muhimu hutumwa kwa barua pepe. Unaweza pia kuona arifa na matokeo yako ndani ya Falowen. Arifa za push hazipatikani tena.",
};

const NotificationSettingsCard = () => {
  const { t, i18n } = useTranslation();
  const language = (i18n.resolvedLanguage || i18n.language || "en").split("-")[0];
  return (
    <section style={styles.card}>
      <h2 style={styles.sectionTitle}>{t("notificationUi.title")}</h2>
      <p style={styles.helperText}>{copy[language] || copy.en}</p>
    </section>
  );
};

export default NotificationSettingsCard;
