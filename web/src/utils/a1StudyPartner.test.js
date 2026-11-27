import { buildVoiceTeacherPrompt, VOICE_TEACHER_LEVELS, STUDY_START_SECTIONS } from "./a1StudyPartner";
import { A1_VOICE_MODES, buildA1VoiceTeacherPrompt } from "./a1StudyPartner";
import { buildStudyPrompt, isStudyPartnerLesson, A1_STUDY_MODES, buildA1StudyPrompt, buildA1ChatGPTUrl, isA1StudyPartnerLesson } from "./a1StudyPartner";

const teacher = { kind: "assignment", day: 17, chapter: "11", title: "Instructions", assignmentKey: "A1-11", uid: "private-user", answers: "private-answer", token: "private-token" };
const independent = { kind: "practice", day: 6, chapter: "2.3", title: "Family and Hobbies" };

test("teacher prompt identifies exact assignment and active section without private data", () => {
  const prompt = buildA1StudyPrompt(teacher, "speaking", "Teil 1 · Sprechen");
  expect(prompt).toContain("Day 17, Kapitel 11");
  expect(prompt).toContain("A1-11");
  expect(prompt).toContain("Teil 1 · Sprechen");
  expect(prompt).toContain("Role-play");
  expect(prompt).toContain("Do not provide official assignment answers");
  expect(prompt).not.toContain("private-");
});

test("self-learning uses independent context and no official assignment reference", () => {
  const prompt = buildA1StudyPrompt(independent, "grammar");
  expect(prompt).toContain("Day 6, Kapitel 2.3");
  expect(prompt).toContain("self-learning material independently");
  expect(prompt).not.toContain("Official assignment reference");
  expect(prompt).toContain("Teach the retrieved grammar");
});

test("all five study modes build different prompts and URLs round trip", () => {
  const prompts = A1_STUDY_MODES.map(({ key }) => buildA1StudyPrompt(independent, key));
  expect(new Set(prompts).size).toBe(5);
  for (const prompt of prompts) {
    const url = new URL(buildA1ChatGPTUrl(prompt));
    expect(url.origin).toBe("https://chatgpt.com");
    expect(url.searchParams.get("q")).toBe(prompt);
  }
});

test("final mock and invalid lesson metadata are excluded", () => {
  expect(isA1StudyPartnerLesson({ ...teacher, title: "A1 Final Mock Exam" })).toBe(false);
  expect(isA1StudyPartnerLesson({ ...teacher, destination: "/campus/course/a1-final-mock-exam" })).toBe(false);
  expect(buildA1StudyPrompt({})).toBe("");
});

test("A2 uses its own level, exact chapter and assignment instead of A1", () => {
  const prompt = buildStudyPrompt({ kind: "assignment", day: 6, chapter: "3.6", title: "Möbel und Räume", assignmentKey: "A2-3.6", uid: "private-record" }, "speaking", "Speaking practice", "A2");
  expect(prompt).toContain("German A2 study partner");
  expect(prompt).toContain("Kapitel 3.6");
  expect(prompt).toContain("A2-3.6");
  expect(prompt).toContain("realistic A2 conversation");
  expect(prompt).not.toContain("A1");
  expect(prompt).not.toContain("private-record");
});

test("A2 self-study and assessment exclusion remain distinct", () => {
  const lesson = { kind: "practice", day: 22, chapter: "8.22", title: "Die Woche Planung", assignmentKey: "A2-8.22" };
  const prompt = buildStudyPrompt(lesson, "grammar", "Self-learning grammar notes", "A2");
  expect(prompt).toContain("self-learning material independently");
  expect(prompt).not.toContain("Official assignment reference");
  expect(isStudyPartnerLesson({ ...lesson, title: "Goethe A2 Speaking Mock" }, "A2")).toBe(false);
  expect(buildStudyPrompt(lesson, "grammar", "", "C2")).toContain("German C2 study partner");
});

test("B1 prompt uses the actual chapter and encourages connected language", () => {
  const prompt = buildStudyPrompt({ kind: "assignment", day: 27, chapter: "10.27", title: "Umweltfreundlich im Alltag", assignmentKey: "B1-10.27", uid: "private-record" }, "speaking", "Speaking practice", "B1");
  expect(prompt).toContain("German B1 study partner");
  expect(prompt).toContain("B1-10.27");
  expect(prompt).toContain("realistic B1 conversation");
  expect(prompt).toContain("connected sentences");
  expect(prompt).not.toContain("A1");
  expect(prompt).not.toContain("private-record");
});

test("B1 Day 23 grammar remains practice-only and speaking mock is excluded", () => {
  const lesson = { kind: "practice", day: 23, chapter: "7.23", title: "Erstes Date", assignmentKey: "B1-7.23" };
  expect(buildStudyPrompt(lesson, "grammar", "Self-learning grammar notes", "B1")).not.toContain("Official assignment reference");
  expect(isStudyPartnerLesson({ ...lesson, title: "Goethe B1 Speaking Mock" }, "B1")).toBe(false);
});

test("B2 uses public grammar and skill metadata and excludes final mock", () => {
  const lesson = { kind: "practice", day: 1, chapter: "1.1", title: "Müll vermeiden", grammarFocus: "indem / dadurch, dass", skillFocus: "Lesen", uid: "private-record", answers: "private-answer" };
  const prompt = buildStudyPrompt(lesson, "grammar", "learn", "B2");
  expect(prompt).toContain("German B2 study partner");
  expect(prompt).toContain("Grammar focus: indem / dadurch, dass");
  expect(prompt).toContain("Today's exam skill: Lesen");
  expect(prompt).not.toContain("private-");
  expect(buildStudyPrompt({ ...lesson, day: 29, title: "B2 Final Mock Exam" }, "grammar", "", "B2")).toBe("");
});

test("A1 voice teacher retrieves authorised exact lesson and never transfers student fields", () => {
  const prompt = buildA1VoiceTeacherPrompt(teacher);
  expect(prompt).toContain("Day 17, Kapitel 11");
  expect(prompt).toContain("A1-11");
  expect(prompt).toContain("authorised revision levels");
  expect(prompt).toContain("section overview");
  expect(prompt).toContain("one original block or small related group at a time");
  expect(prompt).toContain("wait for my spoken answer");
  expect(prompt).toContain("Never fetch protected exam material");
  expect(prompt).not.toContain("private-");
});
test("voice modes are distinct, practice-only and limited to A1 pilot", () => {
  const prompts = A1_VOICE_MODES.map(item => buildA1VoiceTeacherPrompt(independent,item.key));
  expect(new Set(prompts).size).toBe(2);
  expect(prompts[1]).toContain("patient speaking partner");
  expect(buildA1VoiceTeacherPrompt(independent,"voice-teacher","A2")).toBe("");
  expect(buildA1VoiceTeacherPrompt({...teacher,title:"A1 Final Mock Exam"})).toBe("");
  expect(buildA1VoiceTeacherPrompt(independent,"unknown")).toBe("");
});

test.each(VOICE_TEACHER_LEVELS)("voice teacher uses authorized %s lesson and both voice modes", level => {
  const lesson = {kind:"practice",day:8,chapter:"2.3",title:"Lesson topic",grammarFocus:"Public grammar",guidingQuestion:"Public question",uid:"private-id"};
  const teacher = buildVoiceTeacherPrompt(lesson,"voice-teacher",level);
  const speaking = buildVoiceTeacherPrompt(lesson,"voice-speaking",level);
  expect(teacher).toContain("original German " + level + " lesson for Day 8");
  expect(teacher).toContain("level " + level + " and section grammar");
  expect(teacher).toContain("one original block or small related group at a time");
  expect(speaking).toContain("patient speaking partner");
  expect(teacher).not.toContain("private-id");
  expect(teacher).not.toBe(speaking);
});
test("C1 voice uses canonical grammar and guiding question; orientation and mocks excluded; C2 supported", () => {
  const lesson={kind:"practice",day:8,chapter:"2.3",title:"Wohnen und Stadtentwicklung",grammarFocus:"Nominalisierung",guidingQuestion:"Wie wollen wir wohnen?"};
  const prompt=buildVoiceTeacherPrompt(lesson,"voice-teacher","C1");
  expect(prompt).toContain("Grammar focus: Nominalisierung");
  expect(prompt).toContain("Guiding question: Wie wollen wir wohnen?");
  expect(prompt).toContain("counterarguments");
  expect(buildVoiceTeacherPrompt({...lesson,day:0},"voice-teacher","C1")).toBe("");
  expect(buildVoiceTeacherPrompt({...lesson,day:29,title:"C1 Final Mock Exam"},"voice-teacher","C1")).toBe("");
  expect(buildVoiceTeacherPrompt(lesson,"voice-teacher","C2")).toContain("German C2 study partner");
});

test.each(VOICE_TEACHER_LEVELS)("all %s lesson study and voice modes require source retrieval before teaching", level => {
  const lesson={kind:"practice",day:6,chapter:"2.3",title:"Public lesson"};
  const prompts=[...A1_STUDY_MODES.map(m=>buildStudyPrompt(lesson,m.key,"",level)),...A1_VOICE_MODES.map(m=>buildVoiceTeacherPrompt(lesson,m.key,level))];
  prompts.forEach(prompt=>{
    expect(prompt.startsWith("IMPORTANT — CONNECTION FIRST")).toBe(true);
    expect(prompt).toContain("select Connect");
    expect(prompt).toContain("Do not generate random questions");
    expect(prompt).toContain("before successful source retrieval");
    expect(prompt).toContain("Respond in English");
    expect(prompt).not.toContain("continue with original topic-based practice");
  });
});

 test.each(VOICE_TEACHER_LEVELS)("all %s modes allow switching sections and chapters in one conversation",level=>{const lesson={kind:"practice",day:9,chapter:"4.9",title:"Public lesson"};for(const prompt of [buildStudyPrompt(lesson,"grammar","Grammar",level),buildVoiceTeacherPrompt(lesson,"voice-teacher",level,"Grammar")]){expect(prompt).toContain("STARTING POINT only");expect(prompt).toContain("Current workbook section: Grammar");expect(prompt).toContain("Teil 1");expect(prompt).toContain("verify the new returned level, day and chapter");expect(prompt).toContain("switch to text in this same conversation");expect(prompt).toContain("No need to reopen Falowen");}});

test.each(VOICE_TEACHER_LEVELS)("all %s modes retrieve their actual starting section and preserve source", level => {
  const lesson={kind:"practice",day:1,chapter:"1.1",title:"Public lesson",uid:"private-id"};
  for(const mode of [...A1_STUDY_MODES,...A1_VOICE_MODES]){
    const prompt=mode.key.startsWith("voice-")?buildVoiceTeacherPrompt(lesson,mode.key,level,"Learn"):buildStudyPrompt(lesson,mode.key,"Learn",level);
    expect(prompt).toContain("START HERE: retrieve section "+STUDY_START_SECTIONS[mode.key]+".");
    expect(prompt).toContain("Make a fresh tool call");
    expect(prompt).toContain("material.orderedNotes");
    expect(prompt).toContain("fullExplanationIncluded is false");
    expect(prompt).toContain("do not paraphrase, skip, silently correct or translate");
    expect(prompt).toContain("verify the new returned level, day and chapter");
    expect(prompt).not.toContain("private-id");
    expect(prompt).not.toContain("71 blocks");
    expect(prompt).not.toContain("approximately 20-minute lesson");
    expect(prompt).not.toMatch(/START HERE: retrieve section (learn|quiz|overview)/);
  }
});
test("guided C1 Voice starts from the first source block; grammar and quizzes target the original headings",()=>{
  const lesson={kind:"practice",day:1,chapter:"1.1",title:"Wissenschaftliches Lernen und Lernstrategien"};
  const voice=buildVoiceTeacherPrompt(lesson,"voice-teacher","C1","Learn");
  expect(voice).toContain("Start from the first available ordered Learn block");
  expect(voice).toContain("Track the current heading and block number");
  expect(voice).toContain("retrieve the starting material here before asking me to activate Voice");
  expect(buildStudyPrompt(lesson,"grammar","Learn","C1")).toContain("Grammar lesson heading if present");
  expect(buildStudyPrompt(lesson,"quiz","Learn","C1")).toContain("Prefer the final knowledge questions");
  expect(buildStudyPrompt(lesson,"speaking","Learn","C1")).toContain("START HERE: retrieve section speaking");
  expect(buildStudyPrompt(lesson,"writing","Learn","C1")).toContain("START HERE: retrieve section writing");
});
