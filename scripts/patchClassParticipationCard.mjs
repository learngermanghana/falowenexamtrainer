import fs from "node:fs";

const components = new URL("../web/src/components/", import.meta.url);
const account = fs.readFileSync(new URL("AccountSettings.js", components), "utf8");
const home = fs.readFileSync(new URL("GeneralHome.js", components), "utf8");

// AccountSettings owns the participation deep link. The build must never
// reinsert the retired Learning records section into Student Data.
if (!account.includes('activeTab === "participation"') || !account.includes("<ClassParticipationCard />")) {
  throw new Error("The Account participation detail view is missing.");
}
if (home.includes("<ClassParticipationCard />")) {
  throw new Error("Class Participation detail card is still mounted on the Falowen homepage.");
}
