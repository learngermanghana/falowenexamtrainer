import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const homePath = path.join(root, "web/src/components/GeneralHome.js");
const accountPath = path.join(root, "web/src/components/AccountSettings.js");
let home = fs.readFileSync(homePath, "utf8");
let account = fs.readFileSync(accountPath, "utf8");

// Class Participation should not become another permanent Home or Campus nav
// destination. Home owns the short summary, while Account can deep-link into a
// dedicated participation view.
home = home
  .replace('\nimport ClassParticipationCard from "./ClassParticipationCard";', "")
  .replace("\n\n      <ClassParticipationCard />", "");

// Remove the previous Student Data injection when this patch is re-run in an
// already-patched worktree, then rebuild the intended dedicated view.
account = account
  .replace('\nimport ClassParticipationCard from "./ClassParticipationCard";', "")
  .replace('\n\n      {activeTab === "studentData" ? <ClassParticipationCard /> : null}', "");

const replaceAccountOnce = (before, after, label) => {
  if (account.includes(after)) return;
  if (!account.includes(before)) throw new Error(`Could not patch ${label}: source anchor was not found.`);
  account = account.replace(before, after);
};

replaceAccountOnce(
  'import { useTranslation } from "react-i18next";',
  'import { useTranslation } from "react-i18next";\nimport { useLocation, useNavigate } from "react-router-dom";',
  "Account Router location import",
);

replaceAccountOnce(
  'import NotificationSettingsCard from "./NotificationSettingsCard";',
  'import NotificationSettingsCard from "./NotificationSettingsCard";\nimport ClassParticipationCard from "./ClassParticipationCard";',
  "Account Class Participation import",
);

const activeTabBefore = `  const [activeTab, setActiveTab] = useState(() =>
    new URLSearchParams(window.location.search).get("tab") === "billing" ? "billing" : "studentData"
  );`;
const previousActiveTabAfter = `  const [activeTab, setActiveTab] = useState(() => {
    const requestedTab = new URLSearchParams(window.location.search).get("tab");
    return ["studentData", "participation", "notifications", "billing", "upgrade"].includes(requestedTab)
      ? requestedTab
      : "studentData";
  });

  const selectAccountTab = (tabKey) => {
    setActiveTab(tabKey);
    const params = new URLSearchParams(window.location.search);
    if (tabKey === "studentData") params.delete("tab");
    else params.set("tab", tabKey);
    const nextSearch = params.toString();
    const nextUrl =
      window.location.pathname +
      (nextSearch ? "?" + nextSearch : "") +
      (window.location.hash || "");
    window.history.replaceState(window.history.state, "", nextUrl);
  };`;
const activeTabAfter = `  const location = useLocation();
  const navigate = useNavigate();
  const requestedTab = new URLSearchParams(location.search).get("tab");
  const activeTab = ["studentData", "participation", "notifications", "billing", "upgrade"].includes(requestedTab)
    ? requestedTab
    : "studentData";

  const selectAccountTab = (tabKey) => {
    const params = new URLSearchParams(location.search);
    if (tabKey === "studentData") params.delete("tab");
    else params.set("tab", tabKey);
    const nextSearch = params.toString();
    const nextUrl =
      location.pathname +
      (nextSearch ? "?" + nextSearch : "") +
      (location.hash || "");
    navigate(nextUrl, { replace: true });
  };`;

if (account.includes(previousActiveTabAfter)) {
  account = account.replace(previousActiveTabAfter, activeTabAfter);
} else {
  replaceAccountOnce(activeTabBefore, activeTabAfter, "Account participation deep-link state");
}

replaceAccountOnce(
  '            onClick={() => setActiveTab(tab.key)}',
  '            onClick={() => selectAccountTab(tab.key)}',
  "Account tab URL state",
);

const studentDataFooterBefore = `        <p style={{ ...styles.helperText, margin: 0 }}>
          Biography editing has moved to the Class Members tab so it is easier to find.
        </p>
      </section>`;
const studentDataFooterAfter = `        <p style={{ ...styles.helperText, margin: 0 }}>
          Biography editing has moved to the Class Members tab so it is easier to find.
        </p>

        <div style={{ ...styles.card, margin: "14px 0 0", background: "#f8fafc", border: "1px solid #c7d2fe" }}>
          <h3 style={{ margin: "0 0 4px" }}>Class Participation</h3>
          <p style={{ ...styles.helperText, margin: "0 0 10px" }}>
            Review your teacher-recorded class responses, correct answers and areas that need revision.
          </p>
          <button type="button" style={styles.secondaryButton} onClick={() => selectAccountTab("participation")}>
            View class participation
          </button>
        </div>
      </section>`;
replaceAccountOnce(studentDataFooterBefore, studentDataFooterAfter, "Student Data participation entry point");

replaceAccountOnce(
  '      {activeTab === "notifications" ? <NotificationSettingsCard /> : null}',
  `      {activeTab === "participation" ? (
        <section style={{ display: "grid", gap: 12 }} aria-label="Class Participation details">
          <div>
            <button type="button" style={styles.backTextLink} onClick={() => selectAccountTab("studentData")}>
              <span aria-hidden="true">←</span> Back to Student Data
            </button>
          </div>
          <ClassParticipationCard />
        </section>
      ) : null}

      {activeTab === "notifications" ? <NotificationSettingsCard /> : null}`,
  "Dedicated Account Class Participation view",
);

const requiredMarkers = [
  'import { useLocation, useNavigate } from "react-router-dom";',
  'import ClassParticipationCard from "./ClassParticipationCard";',
  'new URLSearchParams(location.search)',
  'navigate(nextUrl, { replace: true })',
  '"participation"',
  'View class participation',
  'activeTab === "participation"',
  'Back to Student Data',
];
requiredMarkers.forEach((marker) => {
  if (!account.includes(marker)) throw new Error(`Class Participation Account marker missing: ${marker}`);
});
if (home.includes("<ClassParticipationCard />")) {
  throw new Error("Class Participation detail card is still mounted on the Falowen homepage.");
}
if (account.includes('{activeTab === "studentData" ? <ClassParticipationCard /> : null}')) {
  throw new Error("Class Participation detail card is still embedded directly in Student Data.");
}
if (account.includes('{ key: "participation", label:')) {
  throw new Error("Class Participation must not consume an Account tab slot.");
}
if (account.includes("window.history.replaceState") || account.includes("setActiveTab(tabKey)")) {
  throw new Error("Account tab state must be derived from React Router location changes.");
}

fs.writeFileSync(homePath, home, "utf8");
fs.writeFileSync(accountPath, account, "utf8");
console.log("Class Participation now follows the Account query-string state through React Router.");
