"use strict";
const {revisionAccess,permitted,pairsFromVocabulary,parseDictionary,selectPairs,buildPlan}=require("../chatgptPersonalRevision");
const now=Date.parse("2026-11-25T12:00:00Z");
const profile={program:"german",level:"A2",role:"student",paymentStatus:"paid"};
const ledger=(level,extra={})=>({program:"german",level,status:"active",contractStart:"2026-10-01",contractEnd:"2027-01-01",tuitionFee:3000,paid:3000,balanceDue:0,...extra});
describe("Personal revision access",()=>{
  test("paid higher course inherits earlier revision, including fully paid naturally expired lower course",()=>{
    const rows=[ledger("A2"),ledger("A1",{status:"expired",contractStart:"2026-07-01",contractEnd:"2026-09-30"})];
    const result=revisionAccess(profile,rows,{},now);
    expect(result.german.full).toEqual(expect.arrayContaining(["A1","A2"]));
    expect(permitted(result,"german","A1",12)).toBe(true);
    expect(permitted(result,"german","B1",1)).toBe(false);
  });
  test("cancelled and unpaid earlier levels remain blocked",()=>{
    for(const lower of [ledger("A1",{status:"cancelled"}),ledger("A1",{status:"expired",contractEnd:"2026-10-31",paid:1000,balanceDue:2000})]){
      expect(permitted(revisionAccess(profile,[ledger("A2"),lower],{},now),"german","A1",1)).toBe(false);
    }
  });
  test("trial, legacy and exam-only permissions are distinct",()=>{
    expect(revisionAccess(profile,[],{},now).german.full).toEqual(["A2"]);
    const trial=revisionAccess({...profile,paymentStatus:"pending",trialStatus:"active",trialEndsAt:new Date(now+86400000)},[],{},now);
    expect(permitted(trial,"german","A2",1)).toBe(true);
    expect(permitted(trial,"german","A2",2)).toBe(false);
    expect(permitted(trial,"german","A1",1)).toBe(false);
    expect(revisionAccess({...profile,accountType:"exam_only"},[ledger("A2")],{},now)).toEqual({});
    expect(revisionAccess(profile,[ledger("A2")],{examOnly:true},now)).toEqual({});
    expect(revisionAccess({...profile,paymentStatus:"pending"},[],{},now)).toEqual({});
  });
  test("Kiswahili placement does not unlock German by itself",()=>{
    const sw={program:"swahili",level:"A1",coursePlacements:{german:{level:"B1"}}};
    expect(revisionAccess(sw,[],{},now).swahili.full).toEqual(["A1"]);
    expect(revisionAccess(sw,[],{},now).german).toBeUndefined();
  });
});
describe("Revision planning and dictionary",()=>{
  test("only real bilingual pairs, bounded search, duplicates removed",()=>{
    const items=pairsFromVocabulary({terms:[{term:"soko",meaning:"market"},{term:"bad"}],phrases:[{term:"soko",meaning:"market"}]});
    expect(selectPairs(items,"market",10)).toEqual([{term:"soko",meaning:"market"}]);
    const rows=parseDictionary('Level,German,English,Audio\r\nA1,"Guten Tag","Good day, hello",private\r\nB1,Anliegen,concern,private\r\n');
    expect(rows).toEqual([{level:"A1",term:"Guten Tag",meaning:"Good day, hello"},{level:"B1",term:"Anliegen",meaning:"concern"}]);
    expect(()=>parseDictionary("Unknown,Other\nx,y")).toThrow();
  });
  test("time budget exact, priorities grounded only in verified mock scores",()=>{
    const lesson={title:"Termine",reading:{},grammar:{}};
    const plan=buildPlan({minutes:47,lesson,day:3,level:"A2",program:"german",mockReview:{attempt:{id:"attempt",sectionScores:{lesen:21,hoeren:9,schreiben:15}},practiceUrl:"https://www.falowen.app/exams/mocks"}});
    expect(plan.activities.reduce((n,a)=>n+a.minutes,0)).toBe(47);
    expect(plan.activities[0].skill).toBe("listening");
    expect(plan.verifiedMock.sectionScores).not.toHaveProperty("sprechen");
    expect(plan.guidance).toContain("not a verified deadline or readiness prediction");
  });
});
