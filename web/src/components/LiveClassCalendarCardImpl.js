import React from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { useLiveClassCalendarCard } from "../services/useLiveClassCalendarCard";
import LiveClassOverview from "./LiveClassOverview";
import LiveClassSessionCards from "./LiveClassSessionCards";

const LiveClassCalendarCardImpl = ({ id, initialClassName, classId, program }) => {
  const { i18n, t } = useTranslation();
  const model = useLiveClassCalendarCard({ initialClassName, classId, program, locale: i18n.language, translate: t });
  if (!model.details) return null;
  const joinLabel = t("classCalendar.actions.joinLiveClass", { defaultValue: "Join live class" });
  const calendarLabel = t("classCalendar.actions.downloadClassCalendar", { defaultValue: "Download class calendar" });

  return (
    <div id={id} style={{ ...styles.card, display: "grid", gap: 12 }}>
      <LiveClassOverview
        id={id}
        translate={t}
        live={model.live}
        locked={model.locked}
        selectedClass={model.selectedClass}
        names={model.names}
        onClassChange={model.changeClass}
        details={model.details}
        formatDate={model.formatDate}
        zoom={model.zoom}
        joinLabel={joinLabel}
        timeline={model.timeline}
        locale={i18n.language}
        formatTimeUnit={model.formatTimeUnit}
      />
      <LiveClassSessionCards
        cancelled={model.cancelled}
        today={model.today}
        completed={model.completed}
        next={model.next}
        locale={i18n.language}
        formatDate={model.formatDate}
        translate={t}
        zoomUrl={model.zoom.url}
        joinLabel={joinLabel}
        canJoinNext={model.canJoinNext}
        showCalendarCta={model.showCalendarCta}
        onCalendar={model.openCalendar}
        timeUntil={model.timeUntil}
      />
      {!model.hasNext ? <p style={{ ...styles.helperText, margin: 0 }}>{t("classCalendar.empty")}</p> : null}
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" style={styles.primaryButton} onClick={model.openCalendar}>{calendarLabel}</button>
          {model.details.docUrl ? (
            <a href={model.details.docUrl} target="_blank" rel="noreferrer" style={{ ...styles.secondaryButton, textDecoration: "none" }}>
              {t("classCalendar.actions.openMaterials")}
            </a>
          ) : null}
        </div>
        <span style={{ ...styles.helperText, margin: 0 }}>
          {model.live
            ? "Connected to Falowen Admin. Cancellations and rescheduling update automatically."
            : "This class is using the catalogue fallback until it is created in Falowen Admin."}
        </span>
      </div>
    </div>
  );
};

export default LiveClassCalendarCardImpl;
