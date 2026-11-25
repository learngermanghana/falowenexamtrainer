import {isSwahiliClass,belongsToSwahiliClass,selectSwahiliSessions} from "./swahiliClassDashboard";
jest.mock("../firebase",()=>({}));
jest.mock("./attendanceServiceBase",()=>({}));
const klass={id:"sw-class",program:"swahili",classId:"legacy-sw"};
const session={id:"s1",classRecordId:"sw-class",startsAt:"2026-12-01T18:00:00Z",endsAt:"2026-12-01T20:00:00Z"};
test("only explicitly Kiswahili classes qualify",()=>{
 expect(isSwahiliClass(klass)).toBe(true);
 expect(isSwahiliClass({program:"german"})).toBe(false);
 expect(isSwahiliClass({name:"Kiswahili"})).toBe(false);
});
test("canonical owner wins over a matching legacy alias",()=>{
 expect(belongsToSwahiliClass({...session,classRecordId:"other",classId:"legacy-sw"},klass)).toBe(false);
 expect(belongsToSwahiliClass({...session,program:"german"},klass)).toBe(false);
 expect(belongsToSwahiliClass(session,klass)).toBe(true);
});
test("deduplicates sessions and excludes cancelled and completed sessions from next class",()=>{
 const result=selectSwahiliSessions([session,session,{...session,id:"cancelled",status:"cancelled"},{...session,id:"done",status:"completed"},{...session,id:"other",classRecordId:"other"}],klass,new Date("2026-11-25"));
 expect(result.sessions).toHaveLength(3);
 expect(result.next.id).toBe("s1");
 expect(result.completed.map(s=>s.id)).toEqual(["done"]);
});
