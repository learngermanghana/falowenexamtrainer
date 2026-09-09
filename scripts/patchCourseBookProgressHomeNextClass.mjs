import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const servicesPath = path.join(root, "web/src/components/RouteScopedAppServices.js");
const homePath = path.join(root, "web/src/components/GeneralHome.js");
const courseTabPath = path.join(root, "web/src/components/CourseTab.js");

let services = fs.readFileSync(servicesPath, "utf8");
let home = fs.readFileSync(homePath, "utf8");
const courseTab = fs.readFileSync(courseTabPath, "utf8");

services = services
  .replace(
    'import CourseBookNextClassIndicator from "./CourseBookNextClassIndicator";',
    'import CourseBookPriorityLayoutService from "./CourseBookPriorityLayoutService";',
  )
  .replace(
    '{isCourseBook ? <CourseBookNextClassIndicator /> : null}',
    '{isCourseBook ? <CourseBookPriorityLayoutService /> : null}',
  );

home = home
  .replace(
    'import HomeClassAccess from "./HomeClassAccess";',
    'import HomeNextClassCard from "./HomeNextClassCard";',
  )
  .replace(
    '<HomeClassAccess className={preferredClass} program={studentProfile?.program} />',
    '<HomeNextClassCard className={preferredClass} program={studentProfile?.program} />',
  );

if (services.includes("CourseBookNextClassIndicator")) {
  throw new Error("Course Book still mounts the Next live class indicator.");
}
if (!services.includes("<CourseBookPriorityLayoutService />")) {
  throw new Error("Course Book layout-only priority service is missing.");
}
if (!home.includes("<HomeNextClassCard className={preferredClass}")) {
  throw new Error("Homepage next-class card is missing.");
}
if (home.includes("<HomeClassAccess className={preferredClass}")) {
  throw new Error("Homepage is still using the Zoom-only class card.");
}
if (!courseTab.includes("Course progress")) {
  throw new Error("Course Book course-progress UI is missing.");
}

fs.writeFileSync(servicesPath, services, "utf8");
fs.writeFileSync(homePath, home, "utf8");
console.log("Course Book shows course progress without Next live class; Home owns the next-class card.");
