import fs from "fs";
import path from "path";
const read = file => fs.readFileSync(path.resolve(__dirname,"../../..",file),"utf8");
const app = read("web/src/App.js");
const patch = read("scripts/patchCompactStudentNavigation.mjs");
test("source Campus sections use the current shared order",()=>{
 const source=app.slice(app.indexOf("const getTabStructure ="),app.indexOf("const getMainTabForSection"));
 expect(Array.from(source.matchAll(/section: "([^"]+)"/g),m=>m[1])).toEqual(["course","music","books","attendance","results","vocab","classMembers","account"]);
 expect(app).toContain('onClick={() => navigate("/")}>Falowen Home</button>');
});
test("the deployment patch preserves the exact desktop menu",()=>{
 const source=patch.slice(patch.indexOf("const getCampusNavigationItems ="),patch.indexOf("const isCampusNavigationItemActive ="));
 expect(Array.from(source.matchAll(/label: "([^"]+)"/g),m=>m[1])).toEqual(["Course Book","Music","Books","Attendance","Results","Vocab","Class Members","Account","Falowen Home"]);
});
test("current Exams Room menu stays separate",()=>{
 const exam=app.slice(app.indexOf("const ExamArea ="));
 const tabs=exam.slice(exam.indexOf("const tabs ="),exam.indexOf("const examHeroConfig"));
 expect(Array.from(tabs.matchAll(/key: "([^"]+)"/g),m=>m[1])).toEqual(["overview","mocks","lesen","horen","writing","speaking","file"]);
});
