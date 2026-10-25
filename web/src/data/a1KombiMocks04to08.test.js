import { A1_KOMBI_MOCKS,buildA1KombiAttemptContract,calculateA1KombiResult } from "./a1KombiMocks04to08";
test("five additional mocks map to uploaded source tests",()=>{
 expect(A1_KOMBI_MOCKS.map(x=>x.mockNumber)).toEqual([4,5,6,7,8]);
 expect(A1_KOMBI_MOCKS.map(x=>x.sourceTestNumber)).toEqual([1,2,3,4,5]);
 expect(A1_KOMBI_MOCKS.every(x=>x.status==="staged")).toBe(true);
});
test("3 module scoring excludes Hören",()=>{
 const a=buildA1KombiAttemptContract(4);
 expect(a.sections).toEqual(["lesen","schreiben","sprechen"]);
 expect(calculateA1KombiResult(a,{lesen:20,schreiben:15,sprechen:25})).toMatchObject({earned:60,maximum:75,percentage:80});
});
test("4 module upgrade preserves historical contract",()=>{
 const old=buildA1KombiAttemptContract(8),next=buildA1KombiAttemptContract(8,{hoerenPublished:true});
 expect(old.maxScore).toBe(75);expect(next.maxScore).toBe(100);
 expect(old.sections).not.toContain("hoeren");expect(next.sections).toContain("hoeren");
});
test("unverified sections cannot produce final score",()=>{
 expect(()=>calculateA1KombiResult(buildA1KombiAttemptContract(5),{lesen:20,schreiben:12})).toThrow(/sprechen/);
});
