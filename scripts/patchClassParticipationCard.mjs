import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const homePath = path.join(root, "web/src/components/GeneralHome.js");
const accountPath = path.join(root, "web/src/components/AccountSettings.js");
let home = fs.readFileSync(homePath, "utf8");
let account = fs.readFileSync(accountPath, "utf8");

// Remove the previous Home injection if this patch has already run in the
// current worktree. Class Participation belongs under Account now.
home = home
  .replace('\nimport ClassParticipationCard from "./ClassParticipationCard";', "")
  .replace("\n\n      <ClassParticipationCard />", "");

const replaceAccountOnce = (before, after, label) => {
  if (account.includes(after)) return;
  if (!account.includes(before)) throw new Error(`Could not patch ${label}: source anchor was not found.`);
  account = account.replace(before, after);
};

replaceAccountOnce(
  'import NotificationSettingsCard from "./NotificationSettingsCard";',
  'import NotificationSettingsCard from "./NotificationSettingsCard";\nimport ClassParticipationCard from "./ClassParticipationCard";',
  "Account Class Participation import",
);

replaceAccountOnce(
  '      {activeTab === "notifications" ? <NotificationSettingsCard /> : null}',
  '      {activeTab === "studentData" ? <ClassParticipationCard /> : null}\n\n      {activeTab === "notifications" ? <NotificationSettingsCard /> : null}',
  "Account Class Participation card",
);

if (home.includes("<ClassParticipationCard />")) {
  throw new Error("Class Participation is still mounted on the Falowen homepage.");
}
if (!account.includes('import ClassParticipationCard from "./ClassParticipationCard";')) {
  throw new Error("Class Participation import is missing from Account.");
}
if (!account.includes('{activeTab === "studentData" ? <ClassParticipationCard /> : null}')) {
  throw new Error("Class Participation is missing from the Account Student Data tab.");
}

fs.writeFileSync(homePath, home, "utf8");
fs.writeFileSync(accountPath, account, "utf8");
console.log("Student Class Participation moved from Falowen Home to Account > Student Data.");
