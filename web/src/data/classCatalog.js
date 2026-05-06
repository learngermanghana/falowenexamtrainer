export const ZOOM_DETAILS = {
  url: "https://us06web.zoom.us/j/6886900916?pwd=bEdtR3RLQ2dGTytvYzNrMUV3eFJwUT09",
  meetingId: "688 690 0916",
  passcode: "german",
};

const CLASS_DOC_BASE_URL = "https://drive.google.com/file/d";

const buildClassDocUrl = (docId) =>
  docId ? `${CLASS_DOC_BASE_URL}/${docId}/view?usp=sharing` : "";

const classCatalogDictionary = {
  "A1 Stuttgart Klasse": {
    startDate: "2026-01-14",
    endDate: "2026-03-26",
    schedule: [
      { day: "Wednesday", startTime: "14:00", endTime: "15:00" },
      { day: "Thursday", startTime: "11:00", endTime: "12:00" },
      { day: "Friday", startTime: "11:00", endTime: "12:00" },
    ],
    docId: "1Bzb1-cHO10m_KsrTHfbhaZAfQcmbssFt",
  },
  "A1 Berlin Klasse": {
    startDate: "2026-02-18",
    endDate: "2026-04-14",
    schedule: [
      { day: "Monday", startTime: "11:00", endTime: "12:00" },
      { day: "Tuesday", startTime: "11:00", endTime: "12:00" },
      { day: "Wednesday", startTime: "14:00", endTime: "15:00" },
    ],
    docId: "1H87C3y6Xj09PY-giD1N73Mv8qbzCb8zk",
  },
  "A1 Hamburg Klasse": {
    startDate: "2026-01-30",
    endDate: "2026-03-27",
    schedule: [
      { day: "Thursday", startTime: "18:00", endTime: "19:00" },
      { day: "Friday", startTime: "18:00", endTime: "19:00" },
      { day: "Saturday", startTime: "8:00", endTime: "9:00" },
    ],
    docId: "1eYBFqrJdlTtCdV9ZPg2gc-a0zZxCiXJS",
  },
  "A1 Dortmund Klasse": {
    startDate: "2026-03-09",
    endDate: "2026-04-29",
    schedule: [
      { day: "Monday", startTime: "18:00", endTime: "19:00" },
      { day: "Tuesday", startTime: "18:00", endTime: "19:00" },
      { day: "Wednesday", startTime: "18:00", endTime: "19:00" },
    ],
    docUrl:
      "https://admin.falowen.app/course-schedule/public?level=A1&startDate=2026-03-09&defaultWeekdays=Monday%2CTuesday%2CWednesday&holidayDates=&useAdvancedWeekdays=false&weekDaysMap=%7B%7D",
  },
  "A1 Koln Klasse": {
    startDate: "2026-05-12",
    orientationDate: "2026-05-12",
    endDate: "2026-06-10",
    schedule: [
      { day: "Monday", startTime: "18:00", endTime: "19:00" },
      { day: "Tuesday", startTime: "18:00", endTime: "19:00" },
      { day: "Wednesday", startTime: "18:00", endTime: "19:00" },
    ],
    docUrl:
      "https://admin.falowen.app/course-schedule/public?level=A1&startDate=2026-05-12&defaultWeekdays=Monday%2CTuesday%2CWednesday&holidayDates=&useAdvancedWeekdays=false&weekDaysMap=%7B%7D",
  },
  "A1 Leipzig Klasse": {
    startDate: "2026-04-04",
    orientationDate: "2026-04-04",
    endDate: "2026-05-29",
    schedule: [
      { day: "Friday", startTime: "18:00", endTime: "19:00" },
      { day: "Saturday", startTime: "08:00", endTime: "09:00" },
    ],
    docUrl:
      "https://admin.falowen.app/course-schedule/public?level=A1&startDate=2026-04-04&defaultWeekdays=Thursday%2CFriday%2CSaturday&holidayDates=&useAdvancedWeekdays=false&weekDaysMap=%7B%7D",
  },
  "A2 Freiburg Klasse": {
    orientationDate: "2026-05-07",
    startDate: "2026-05-08",
    endDate: "2026-06-25",
    schedule: [
      { day: "Wednesday", startTime: "11:00", endTime: "12:00" },
      { day: "Thursday", startTime: "11:00", endTime: "12:00" },
      { day: "Friday", startTime: "11:00", endTime: "12:00" },
    ],
    docUrl:
      "https://admin.falowen.app/course-schedule/public?level=A2&startDate=2026-05-08&defaultWeekdays=Wednesday%2CThursday%2CFriday&holidayDates=&useAdvancedWeekdays=false&weekDaysMap=%7B%7D",
  },
  "B1 Stuttgart Klasse": {
    startDate: "2026-03-12",
    endDate: "2026-06-12",
    schedule: [
      { day: "Thursday", startTime: "19:30", endTime: "21:00" },
      { day: "Friday", startTime: "19:30", endTime: "21:00" },
    ],
    docId: "1QcKorNLQtveE-NYbZajDlAijrWhgknwp",
  },
  "B2 Munich Klasse": {
    isSelfLearning: true,
    availability: "always",
    startDate: "2025-08-08",
    endDate: "2025-10-08",
    schedule: [
      { day: "Friday", startTime: "14:00", endTime: "15:30" },
      { day: "Saturday", startTime: "09:30", endTime: "10:00" },
    ],
    docId: "1gn6vYBbRyHSvKgqvpj5rr8OfUOYRL09W",
  },
  "C1 Self-learning": {
    isSelfLearning: true,
    availability: "always",
    startDate: "",
    endDate: "",
    schedule: [],
    docId: "",
  },
};

export const classCatalog = Object.fromEntries(
  Object.entries(classCatalogDictionary).map(([className, details]) => [
    className,
    {
      ...details,
      docUrl: details.docUrl || buildClassDocUrl(details.docId),
    },
  ])
);
