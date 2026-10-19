// Public marketplace settings are display-only. Server-side prices and access grants are authoritative.
export const EXAMS_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const EXAMS_LEVEL_LABELS = {
  A1: "Beginner", A2: "Elementary", B1: "Intermediate",
  B2: "Upper intermediate", C1: "Advanced", C2: "Proficiency",
};

export const EXAMS_READY_FULL_MOCKS = {
  A1: "/campus/course/a1-final-mock-exam",
  A2: "/campus/course/a2-final-mock-exam",
  B1: "/campus/course/b1-final-mock-exam",
  B2: "/campus/course/b2-final-mock-exam",
};

export const EXAMS_PACKAGES = [
  { id: "free", title: "Free Sample", price: 0, duration: "Free preview", details: "Try an original sample reading question.", perks: ["One sample reading task", "Check your answer", "No payment required"] },
  { id: "teil", title: "Teil Practice", price: 25, duration: "14-day access", details: "Individual Lesen and Hören Teil practice.", perks: ["10 individual Teil attempts", "Focused practice", "Explanations"], comingSoon: true },
  { id: "single", title: "Single Full Mock", price: 49, duration: "14-day access", details: "One unique four-skill mock exam.", perks: ["Lesen, Hören, Schreiben and Sprechen", "Saved progress", "Your results"], availableLevels: ["A1", "A2", "B1", "B2"] },
  { id: "ready", title: "Exam Ready Pack", price: 119, duration: "30-day access", details: "Three different full mock exams.", perks: ["3 unique complete mocks", "Results and feedback", "Progress tracking"], comingSoon: true },
];

export const isExamMarketplaceHost = () =>
  typeof window !== "undefined" && window.location.hostname.toLowerCase() === "exams.falowen.app";

export const canOpenExamOnlyPath = (path, level = "") => {
  const pathname = String(path || "").replace(/\/+$/, "") || "/";
  if (pathname === "/exams" || pathname.startsWith("/exams/")) {
    const explicitLevel = pathname.match(/^\/exams\/(?:lesen|hoeren|schreiben|sprechen)\/(a1|a2|b1|b2|c1|c2)(?:\/|$)/i);
    return !explicitLevel || explicitLevel[1].toUpperCase() === String(level).toUpperCase();
  }
  return EXAMS_READY_FULL_MOCKS[String(level).toUpperCase()] === pathname;
};
