// One source for the four public marketing promises shown on the homepage
// and on the admissions visitor guide. Links are actual public Falowen routes.
export const PUBLIC_MARKETING_FEATURES = Object.freeze([
  {
    key: "placement",
    icon: "🧭",
    title: "Find your German level",
    description: "Take a free placement test and discover where to begin.",
    action: "Take free placement test",
    href: "/placement-test",
  },
  {
    key: "exams",
    icon: "🎯",
    title: "Prepare for Goethe-style exams",
    description: "Practise sample tests and full mocks in Lesen, Hören, Schreiben and Sprechen, with AI-supported feedback.",
    action: "Explore exam practice",
    href: "/exam-practice",
  },
  {
    key: "class",
    icon: "🎥",
    title: "Learn with a live class",
    description: "Join guided lessons with a tutor, get feedback and revisit recorded lectures.",
    action: "View live classes",
    href: "/classes/",
    scheduleAction: "View full class schedule",
    scheduleHref: "/learn-german-ghana/upcoming-classes",
  },
  {
    key: "self",
    icon: "✨",
    title: "Learn at your own pace",
    description: "Study with structured workbooks, recorded lectures, AI practice and available tutor support.",
    action: "Start self-learning",
    href: "/signup?program=german",
  },
]);
