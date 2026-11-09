import {B1_MOCK4_SPEAKING as source,buildB1Mock4SpeakingTasks} from "./b1Mock4SpeakingContent";

describe("B1 Mock 04 Sprechen: user-supplied three-part source",()=>{
  test("keeps three parts, 15-minute preparation and pair-exam timing",()=>{
    expect(source.mockId).toBe("b1-mock-04");
    expect(source.preparationMinutes).toBe(15);
    expect(source.durationMinutes).toBe(15);
    expect(source.assessment.status).toBe("practice-only");
  });
  test("Teil 1 preserves the hospital and four joint-planning points",()=>{
    expect(source.teil1.situation).toContain("Krankenhaus");
    expect(source.teil1.situation).toContain("Unfall");
    expect(source.teil1.situation).toContain("allein lebt");
    expect(source.teil1.points).toHaveLength(4);
    expect(source.teil1.points.join(" ")).toMatch(/Wann besuchen/);
    expect(source.teil1.points.join(" ")).toMatch(/Wie hinkommen/);
    expect(source.teil1.points.join(" ")).toMatch(/Was mitnehmen/);
    expect(source.teil1.points.join(" ")).toMatch(/Wie kann man helfen/);
  });
  test("Teil 2 is exactly the provided television topic and five-slide plan",()=>{
    expect(source.teil2.topics).toHaveLength(1);
    expect(source.teil2.topics[0].title).toBe("Sehen Kinder zu viel fern?");
    expect(source.teil2.topics[0].quote).toContain("nur noch 5 Minuten");
    expect(source.teil2.slides.map(x=>x.number)).toEqual([1,2,3,4,5]);
    expect(buildB1Mock4SpeakingTasks()[1].prompt).toContain("Folie 5");
  });
  test("Teil 3 responds to partner mobile-phone talk with only two supplied steps",()=>{
    expect(source.teil3.steps.map(x=>x.label)).toEqual(["Feedback geben","Frage stellen"]);
    const parts=buildB1Mock4SpeakingTasks();
    expect(parts.map(x=>x.teil)).toEqual(["1","2","3"]);
    expect(parts[2].prompt).toContain("Brauchen Kinder Mobiltelefone?");
    expect(parts[2].prompt).toContain("12 Jahren");
    expect(parts[2].keywords).toBe("Brauchen Kinder Mobiltelefone?");
    expect(parts[2].hint).not.toContain("answer the partner");
  });
});
