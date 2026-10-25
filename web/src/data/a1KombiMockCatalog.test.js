import { getMockExam, getMockExamsForLevel } from "./mockExamCatalog";
import { buildA1KombiAttemptContract, A1_KOMBI_MOCKS } from "./a1KombiMocks04to08";

test.each([4,5,6,7,8])("A1 Mock %s is registered but safely unpublished", number => {
 const id = `a1-final-${String(number).padStart(2,"0")}`;
 const exam = getMockExam(id);
 expect(exam).toMatchObject({id,level:"A1",status:"planned",mode:"practice",
    sections:["Lesen","Schreiben","Sprechen"],showInMockLibrary:false});
 expect(buildA1KombiAttemptContract(number).mockId).toBe(id);
 expect(getMockExamsForLevel("A1").some(item=>item.id===id)).toBe(false);
});
test("historical A1 mock 1–3 remain published",()=>{
 expect(getMockExamsForLevel("A1").filter(e=>e.status==="ready").map(e=>e.id))
  .toEqual(expect.arrayContaining(["a1-final-01","a1-final-02","a1-final-03"]));
 expect(A1_KOMBI_MOCKS).toHaveLength(5);
});
