import {getA2KombiSet,A2_KOMBI_IDS} from "./a2KombiMockSets";
import {getMockExam,getMockExamsForLevel} from "./mockExamCatalog";
import {a2KombiKeys,a2KombiProgress,A2_KOMBI_VERSION} from "../services/a2KombiMockFinalization";
const keySets=require("../../../functions/functionz/a2KombiMarkingSets");

test("all five extracted A2 paper versions have 20 questions, no answer leakage and original teacher topics",()=>{
  expect(A2_KOMBI_IDS).toEqual(["a2-mock-04","a2-mock-05","a2-mock-06","a2-mock-07","a2-mock-08"]);
  const themes=["Beruf, Technologie","Gesundheit, Sport","Wohnen, Nachbarschaft","Reisen, Kultur","Einkaufen, Freizeit"];
  A2_KOMBI_IDS.forEach((id,index)=>{
    const paper=getA2KombiSet(id),library=getMockExam(id);
    expect(paper.sourceTest).toBe(index+1);
    expect(paper.theme).toContain(themes[index]);
    expect(paper.reading).toHaveLength(4);
    expect(paper.reading.map(part=>part.questions.length)).toEqual([5,5,5,5]);
    const questions=paper.reading.flatMap(part=>part.questions);
    expect(questions.map(q=>q.number)).toEqual(Array.from({length:20},(_,i)=>i+1));
    expect(questions.every(q=>!Object.prototype.hasOwnProperty.call(q,"answer"))).toBe(true);
    expect(questions.every(q=>keySets[id].reading[q.number])).toBe(true);
    expect(paper.writing).toHaveLength(2);
    expect(paper.writing.map(part=>part.wordTarget)).toEqual(["20–30","30–40"]);
    expect(paper.writing.every(part=>part.points.length===3)).toBe(true);
    expect(paper.speaking.cards).toHaveLength(4);
    expect(paper.speaking.teil2.points).toHaveLength(4);
    expect(paper.speaking.teil3.points).toHaveLength(4);
    expect(library.status).toBe("ready");
    expect(library.mode).toBe("kombi");
    expect(library.sections).toEqual([0,2].includes(index)?["Lesen","Hören","Schreiben","Sprechen"]:["Lesen","Schreiben","Sprechen"]);
    expect(library.route).toBe(`/campus/course/a2-kombi-mock-${index+4}`);
    if(![0,2].includes(index))expect(library.sections).not.toContain("Hören");
  });
});

test("A2 mock library keeps every three-module paper visible without replacing Mock 01–03",()=>{
  const ids=getMockExamsForLevel("A2",{includeCourse:true}).map(x=>x.id);
  ["a2-final-01","a2-mock-02","a2-mock-03-hoeren",...A2_KOMBI_IDS].forEach(id=>{
    expect(ids).toContain(id);
  });
});

test("each mock and student has private local progress; no audio or answer keys are stored",()=>{
  const a=a2KombiKeys("a2-mock-04","student-a");
  const b=a2KombiKeys("a2-mock-04","student-b");
  const c=a2KombiKeys("a2-mock-05","student-a");
  expect(a.flow).not.toBe(b.flow);
  expect(a.lesen).not.toBe(c.lesen);
  expect(Object.keys(a)).toEqual(["flow","lesen","hoeren","schreiben","sprechen"]);
  expect(a2KombiKeys("a2-mock-06","student-a").hoeren).toContain(":hoeren");
  expect(A2_KOMBI_VERSION).toBe("three-module-v1");
  expect(a2KombiProgress(a).sprechen.done).toBe(false);
});
