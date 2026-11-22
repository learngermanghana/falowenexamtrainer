import bundles from "./index";

const REQUIRED = {
  accountOverview: [
    "title", "courseAccount", "studentCode", "notifications", "deleteAccount",
    "learningRecords", "billingIntro", "tuition", "paid", "balance",
  ],
  enrollmentRequest: [
    "title", "description", "action", "pending", "notice", "signupBoth",
    "signupNotice", "placementPending", "secondaryBillingTitle",
    "secondaryBillingNotice",
  ],
  resultsOverview: [
    "title", "readiness", "loading", "error", "count", "average", "latest",
    "belowPass", "allPassed", "leaderboardPosition", "rankExplanation",
    "swSummary", "swAverage", "revisionNeeded", "revise",
  ],
  notificationUi: [
    "title", "description", "enabled", "enableError", "sendTest",
    "scheduled", "iosTip", "androidTip", "status.granted.label",
    "status.blocked.detail", "status.idle.label",
  ],
};

const vars = value => [...String(value).matchAll(/{{\s*([\w]+)\s*}}/g)].map(entry => entry[1]).sort();

describe("core student interface languages", () => {
  for (const language of ["en", "de", "fr", "sw"]) {
    test(`${language}: account, enrollment, results and notification controls are translated`, () => {
      for (const [section, keys] of Object.entries(REQUIRED)) {
        for (const key of keys) {
          const path = `${section}.${key}`;
          const text = bundles.getResource(language, "translation", path);
          const english = bundles.getResource("en", "translation", path);
          expect(typeof text).toBe("string");
          expect(text.length).toBeGreaterThan(0);
          expect(vars(text)).toEqual(vars(english));
        }
      }
    });
  }
});
