import {B1_MOCK2_READING,B1_MOCK2_WRITING_TASKS,B1_MOCK2_SPEAKING} from "./b1Mock2ExamContent";
test("B1 Mock 2 reading has all five exam parts and numbered tasks 1 to 30",()=>{
 const r=B1_MOCK2_READING;
 const questions=[...r.teil1.questions,...r.teil2.questions,...r.teil2.text2.questions,
 ...r.teil3.situations,...r.teil4.comments,...r.teil5.questions];
 expect(questions.map(q=>q.number)).toEqual(Array.from({length:30},(_,i)=>i+1));
 expect(r.teil3.ads).toHaveLength(6);
 expect(r.teil3.ads.map(([letter])=>letter)).toEqual(["A","B","C","D","E","F"]);
 expect(r.teil3.ads.find(a=>a[0]==="E")[1]).toContain("Tischlein");
 expect(r.teil3.noMatchValue).toBe("x");
 expect(questions.every(q=>!Object.prototype.hasOwnProperty.call(q,"answer"))).toBe(true);
});
test("B1 Mock 2 writing and speaking use the latest teacher prompts",()=>{
 expect(B1_MOCK2_WRITING_TASKS.map(q=>q.target)).toEqual([80,80,40]);
 expect(B1_MOCK2_WRITING_TASKS[0].prompt).toContain("Geburtstag gefeiert");
 expect(B1_MOCK2_WRITING_TASKS[1].prompt).toContain("Persönliche Kontakte und Internet");
 expect(B1_MOCK2_WRITING_TASKS[2].prompt).toContain("Frau Müller");
 expect(B1_MOCK2_SPEAKING.teil1.situation).toContain("interkulturelles Nachbarschaftsfest");
 expect(B1_MOCK2_SPEAKING.teil1.points).toHaveLength(5);
 expect(B1_MOCK2_SPEAKING.teil1.points.join(" ")).toContain("Mitbring-Buffet");
 expect(B1_MOCK2_SPEAKING.teil1.maxRecordingSeconds).toBe(180);
 expect(B1_MOCK2_SPEAKING.teil2.topic).toContain("Sprach- und Integrationskurse");
 expect(B1_MOCK2_SPEAKING.teil2.points).toHaveLength(5);
 expect(B1_MOCK2_SPEAKING.teil2.maxRecordingSeconds).toBe(180);
 expect(B1_MOCK2_SPEAKING.teil3.maxRecordingSeconds).toBe(120);
 expect(B1_MOCK2_SPEAKING.teil3.prompt).toContain("Ergänzungsfrage");
 expect(B1_MOCK2_SPEAKING.teil2.alternativeTopic).toContain("Sport- und Kulturvereine");
 expect(B1_MOCK2_SPEAKING.teil3.prompt).toContain("Feedback");
});

test("B1 Mock 2 Lesen Teil 1 and 2 use the November teacher source without browser answers",()=>{
 const r=B1_MOCK2_READING;
 expect(r.teil1.time).toBe("10 Minuten");
 expect(r.teil1.heading).toBe("Gemeinsam leben – Integration in unserer Gesellschaft");
 expect(r.teil1.paragraphs.join(" ")).toContain("Integration eine gemeinsame Aufgabe");
 expect(r.teil1.questions.map(q=>q.number)).toEqual([1,2,3,4,5,6]);
 expect(r.teil1.questions[0].question).toContain("Sprachkenntnisse");
 expect(r.teil1.questions[5].question).toContain("sowohl der Staat");
 expect(r.teil1.accommodationNote).toContain("spezifischem Bedarf");
 expect(r.teil2.intro).toContain("Aufgaben 7 bis 12");
 expect(r.teil2.heading).toContain("SprachPaten");
 expect(r.teil2.questions.map(q=>q.number)).toEqual([7,8,9]);
 expect(r.teil2.text2.heading).toBe("Begegnungsstätten in Wohnvierteln");
 expect(r.teil2.text2.questions.map(q=>q.number)).toEqual([10,11,12]);
 expect([...r.teil2.questions,...r.teil2.text2.questions].every(q=>
   q.options.map(([id])=>id).join("")==="abc")).toBe(true);
 expect(JSON.stringify([r.teil1,r.teil2])).not.toMatch(/"answer"|"solution"|"correct"/i);
});

test("November teacher B1 Mock 2 Lesen Teile 3–5 have exact numbering and content",()=>{
 const r=B1_MOCK2_READING;
 expect(r.teil3.time).toBe("10 Minuten");
 expect(r.teil3.context).toContain("13 bis 17");
 expect(r.teil3.context).toContain("ein x");
 expect(r.teil3.situations.map(q=>q.number)).toEqual([13,14,15,16,17]);
 expect(r.teil3.situations[0].text).toContain("Markus (28)");
 expect(r.teil3.situations[4].text).toContain("Fatima (24)");
 expect(r.teil3.ads[0][1]).toContain("Plauderecke");
 expect(r.teil3.ads[3][1]).toContain("Veritas");
 expect(r.teil3.ads[4][2]).toContain("Einmal im Monat");
 expect(r.teil4.time).toBe("15 Minuten");
 expect(r.teil4.context).toContain("verpflichtend");
 expect(r.teil4.comments.map(q=>q.number)).toEqual([18,19,20,21,22,23,24]);
 expect(r.teil4.comments.map(q=>q.person.split(" (")[0])).toEqual(["Jonas","Maria","Hasan","Claudia","Tim","Elena","Markus"]);
 expect(r.teil5.time).toBe("10 Minuten");
 expect(r.teil5.heading).toBe("Haus- und Nutzungsordnung: Bürgerzentrum „Vielfalt“");
 expect(r.teil5.sections).toHaveLength(5);
 expect(r.teil5.questions.map(q=>q.number)).toEqual([25,26,27,28,29,30]);
 expect(r.teil5.questions.every(q=>q.options.map(([id])=>id).join("")==="abc")).toBe(true);
 expect(JSON.stringify([r.teil3,r.teil4,r.teil5])).not.toMatch(/"answer"|"solution"|"correct"/i);
});

test("November B1 Mock 2 Schreiben uses all three new teacher tasks and 60-minute timing",()=>{
 const tasks=B1_MOCK2_WRITING_TASKS;
 expect(tasks.map(t=>t.id)).toEqual(["teil1","teil2","teil3"]);
 expect(tasks.map(t=>t.target)).toEqual([80,80,40]);
 expect(tasks.map(t=>t.points.length)).toEqual([3,3,3]);
 expect(tasks.map(t=>Number(t.meta.match(/\\d+/)[0]))).toEqual([20,25,15]);
 expect(tasks[0].prompt).toContain("krank");
 expect(tasks[0].points[0]).toContain("Feier");
 expect(tasks[0].points[1]).toContain("Geschenk");
 expect(tasks[0].points[2]).toContain("Treffen");
 expect(tasks[1].prompt).toContain("Tanja");
 expect(tasks[1].prompt).toContain("persönliche Treffen");
 expect(tasks[1].points[1]).toContain("persönlichen Beispiel");
 expect(tasks[2].prompt).toContain("Lernziele");
 expect(tasks[2].points[0]).toContain("Entschuldigen");
 expect(tasks[2].points[1]).toContain("warum");
 expect(tasks[2].points[2]).toContain("Sie-Form");
 expect(tasks[2].rubric.maxScore).toBe(20);
 expect(tasks[2].rubric.criteria.map(c=>c.maxScore)).toEqual([4,4,6,6]);
 expect(JSON.stringify(tasks)).not.toContain("Frau Sommer");
 expect(JSON.stringify(tasks)).not.toContain("bargeldloses");
});
