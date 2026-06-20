import { useCallback, useEffect, useMemo, useState } from "react";
import { classCatalog, ZOOM_DETAILS } from "../data/classCatalog";
import { frenchClassCatalog } from "../data/french/classCatalog";
import {
  downloadClassCalendar,
  findArchivedTodayClassSession,
  findNextClassSession,
  findTodayClassSession,
} from "./classCalendar";
import { subscribeToLiveClass } from "./liveClassData";
import { buildTimeline, buildTimeUntil, mergeClassDetails } from "./liveClassCardHelpers";
import { loadPreferredClass, savePreferredClass } from "./classSelectionStorage";

export const useLiveClassCalendarCard = ({
  initialClassName, classId, program, locale, translate,
}) => {
  const catalog = useMemo(
    () => (program === "french" ? frenchClassCatalog : classCatalog),
    [program]
  );
  const names = useMemo(() => Object.keys(catalog), [catalog]);
  const defaultName = useMemo(() => {
    if (initialClassName && names.includes(initialClassName)) return initialClassName;
    const stored = loadPreferredClass();
    return stored && names.includes(stored) ? stored : names[0];
  }, [initialClassName, names]);
  const [selectedClass, setSelectedClass] = useState(defaultName);
  const [now, setNow] = useState(new Date());
  const [live, setLive] = useState(null);
  const numbers = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const formatTimeUnit = useCallback(
    (unit, count) => translate(`common.${unit}`, {
      count, formattedCount: numbers.format(count),
    }),
    [numbers, translate]
  );
  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, {
      year: "numeric", month: "short", day: "numeric",
    }),
    [locale]
  );
  const formatDate = useCallback((value) => {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : dateFormatter.format(parsed);
  }, [dateFormatter]);

  useEffect(() => setSelectedClass(defaultName), [defaultName]);
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (program === "french" || (!selectedClass && !classId)) {
      setLive(null);
      return undefined;
    }
    setLive(null);
    return subscribeToLiveClass({
      classId,
      className: selectedClass,
      onChange: setLive,
      onError: (error) => {
        console.warn("Using class catalogue fallback.", error);
        setLive(null);
      },
    });
  }, [classId, program, selectedClass]);

  const fallback = catalog[selectedClass];
  const details = useMemo(
    () => mergeClassDetails(fallback, live?.classDetails),
    [fallback, live]
  );
  const fallbackNext = useMemo(
    () => findNextClassSession(selectedClass, now), [selectedClass, now]
  );
  const fallbackToday = useMemo(
    () => findTodayClassSession(selectedClass, now), [selectedClass, now]
  );
  const fallbackCompleted = useMemo(
    () => findArchivedTodayClassSession(selectedClass, now), [selectedClass, now]
  );
  const next = live ? live.nextClass : fallbackNext;
  const today = live ? live.todayClass : fallbackToday;
  const completed = live ? live.completedToday : fallbackCompleted;
  const minutes = next?.startDateTime
    ? Math.max(0, Math.round((next.startDateTime - now) / 60000))
    : null;

  const changeClass = (event) => {
    setSelectedClass(event.target.value);
    savePreferredClass(event.target.value);
  };
  const openCalendar = () => {
    if (live?.calendarUrl) window.open(live.calendarUrl, "_blank", "noreferrer");
    else downloadClassCalendar(selectedClass);
  };

  return {
    names,
    selectedClass,
    changeClass,
    details,
    live,
    zoom: live?.zoom?.url ? live.zoom : ZOOM_DETAILS,
    locked: Boolean(classId || (initialClassName && names.includes(initialClassName))),
    timeline: buildTimeline({
      details, now, liveProgress: live?.progress, formatTimeUnit, translate,
    }),
    formatTimeUnit,
    formatDate,
    cancelled: live?.cancelledToday || null,
    today,
    completed,
    next: next && !(today && next.date === today.date) ? next : null,
    hasNext: Boolean(next),
    canJoinNext: minutes != null && minutes <= 15,
    showCalendarCta: minutes != null && minutes > 15,
    timeUntil: buildTimeUntil(minutes, formatTimeUnit, translate),
    openCalendar,
  };
};
