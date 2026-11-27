"use strict";

const fs = require("fs");
const path = require("path");
const {
  oauthParameters, safeStudentAccess, scoreRowsForStudent,
  summarizeStudentAssignments, lessonContentResponse, practiceGuideResponse, constants,
} = require("../chatgptCompanion");

const validRequest = {
  response_type: "code",
  client_id: constants.CLIENT_ID,
  redirect_uri: constants.CALLBACK,
  code_challenge: "a".repeat(43),
  code_challenge_method: "S256",
  scope: "falowen:read",
  resource: constants.RESOURCE,
  state: "state-token",
};

describe("Falowen ChatGPT authorization", () => {
  test("accepts exact ChatGPT public client and S256 PKCE", () => {
    expect(oauthParameters(validRequest)).toMatchObject({ client_id: constants.CLIENT_ID });
  });

  test.each([
    { client_id: "https://attacker.example/client.json" },
    { redirect_uri: "https://attacker.example/callback" },
    { redirect_uri: "https://chatgpt.com.evil.example/connector_platform_oauth_redirect" },
    { code_challenge_method: "plain" },
    { code_challenge: "short" },
    { scope: "profile" },
    { resource: "https://attacker.example/mcp" },
    { state: "" },
  ])("rejects modified parameters: %j", (change) => {
    expect(oauthParameters({ ...validRequest, ...change })).toBeNull();
  });

  test("blocks non-student and exam-only accounts but permits Campus-eligible expired trials", () => {
    expect(safeStudentAccess({ role: "admin", level: "A2" })).toBe(false);
    expect(safeStudentAccess({ role: "student", accountType: "exam_only" })).toBe(false);
    expect(safeStudentAccess({ role: "student", trialStatus: "expired", paymentStatus: "pending" })).toBe(true);
    expect(safeStudentAccess({ role: "student", trialStatus: "active" })).toBe(true);
  });
});

describe("Falowen ChatGPT read-only records", () => {
  const student = { id: "AB123", data: { studentCode: "AB123", level: "A2", name: "Test Learner" } };

  test("normalizes only score fields needed by the student", () => {
    const rows = scoreRowsForStudent([
      { studentcode: "AB123", name: "Test Learner", level: "A2", assignment_id: "A2-1.2", score: "75", comments: "Gut", date: "2026-10-31", secret: "never" },
      { level: "B1", score: 100, assignment_id: "B1-4.5" },
    ], "A2");
    expect(rows).toEqual([{
      assignmentId: "A2-1.2", assignment: "", score: 75, feedback: "Gut", date: "2026-10-31",
    }]);
  });

  test("distinguishes no grade from a confirmed unsubmitted assignment", () => {
    const progress = summarizeStudentAssignments(student, []);
    expect(progress.level).toBe("A2");
    expect(progress.totalTutorAssignments).toBeGreaterThan(0);
    expect(progress.noGradeRecorded).toBe(progress.totalTutorAssignments);
    expect(progress.clarification).toMatch(/does not prove/);
    expect(progress.assignments[0].submissionUrl).toContain("/campus/course/lesson/A2/");
  });

  test("B2 self-study student sees 28 lesson days, not missing grades", () => {
    const b2 = { id: "B2-001", data: { studentCode: "B2-001", level: "B2", name: "B2 Learner" } };
    const result = summarizeStudentAssignments(b2, []);
    expect(result.level).toBe("B2");
    expect(result.courseMode).toBe("self_study");
    expect(result.totalSelfStudyLessons).toBe(28);
    expect(result.totalTutorAssignments).toBe(0);
    expect(result.completedCount).toBeNull();
    expect(result.completionAvailable).toBe(false);
    expect(result.assignments[0]).toMatchObject({
      day: 1, status: "self_study", completionVerified: false,
      lessonUrl: expect.stringContaining("/campus/course/lesson/B2/1"),
    });
    expect(result.assignments[0].title).toMatch(/Umweltschutz/);
    expect(result.assignments.every((row) => !("bestRecordedScore" in row))).toBe(true);
  });

  test("C1 self-study is recognised and C2 is not incorrectly relabelled A1", () => {
    const c1 = summarizeStudentAssignments({ id: "C1", data: { level: "C1" } }, []);
    expect(c1.level).toBe("C1");
    expect(c1.courseMode).toBe("self_study");
    expect(c1.totalSelfStudyLessons).toBeGreaterThan(0);
    const c2 = summarizeStudentAssignments({ id: "C2", data: { level: "C2" } }, []);
    expect(c2.level).toBe("C2");
    expect(c2.totalTutorAssignments).toBe(0);
    expect(c2.totalSelfStudyLessons).toBe(28);
    expect(c2.assignments).toHaveLength(28);
    expect(c2.assignments[4].day).toBe(5);
    expect(c2.assignments[4].title).toMatch(/Vertrauen|Politik|Legitimität/);
    expect(c2.clarification).toMatch(/self-study/);
  });

  test("reports a score when a canonical tutor assignment has been marked", () => {
    const original = summarizeStudentAssignments(student, []);
    const first = original.assignments[0];
    const progress = summarizeStudentAssignments(student, [
      { level: "A2", assignment_id: first.assignmentId, score: 92, comments: "Weiter so" },
    ]);
    expect(progress.assignments[0].status).toBe("passed");
    expect(progress.assignments[0].bestRecordedScore).toBe(92);
    expect(progress.passed).toBe(1);
  });
});

describe("ChatGPT OAuth static discovery", () => {
  test("the Vercel well-known discovery documents match the backend issuer and resource", () => {
    const root = path.resolve(__dirname, "../../..");
    const load = (name) => JSON.parse(fs.readFileSync(path.join(root, "web/public/.well-known", name), "utf8"));
    const server = load("oauth-authorization-server/api/chatgpt");
    const protectedResource = load("oauth-protected-resource/api/chatgpt/mcp");
    expect(server.issuer).toBe(constants.ISSUER);
    expect(server.authorization_endpoint).toBe(constants.ISSUER + "/authorize");
    expect(server.token_endpoint).toBe(constants.ISSUER + "/token");
    expect(server.client_id_metadata_document_supported).toBe(true);
    expect(server.scopes_supported).toContain(constants.PRACTICE_WRITE_SCOPE);
    expect(server.scopes_supported).toContain(constants.ASSIGNMENT_WRITE_SCOPE);
    expect(protectedResource.resource).toBe(constants.RESOURCE);
    expect(protectedResource.authorization_servers).toEqual([constants.ISSUER]);
    expect(protectedResource.scopes_supported).toContain(constants.PRACTICE_WRITE_SCOPE);
    expect(protectedResource.scopes_supported).toContain(constants.ASSIGNMENT_WRITE_SCOPE);
  });
});


describe("C1 reading coverage and bilingual exam guidance", () => {
  test("all 28 new Falowen-authored passages are present with four open-ended text questions", () => {
    for (let day = 1; day <= 28; day += 1) {
      const reading = lessonContentResponse("C1", day, "reading");
      expect(reading.available).toBe(true);
      expect(reading.material.passageIncluded).toBe(true);
      expect(reading.material.paragraphs.length).toBeGreaterThan(0);
      expect(reading.material.questions.length).toBeGreaterThan(0);
      expect(reading.material.questions.every((q) => !("answerIndex" in q))).toBe(true);
      expect(reading.material.source).toMatch(/Falowen-authored/);
    }
  });

  test("practice examiner enforces source level and never invents a missing C2 skill day", () => {
    const guide = practiceGuideResponse("C1", 20, "reading", "study", "en");
    expect(guide.available).toBe(true);
    expect(guide.level).toBe("C1");
    expect(guide.interaction.method).toBe("one_question_at_a_time");
    expect(guide.interaction.estimatedScoreIsPracticeOnly).toBe(true);
    const miss = practiceGuideResponse("C2", 20, "reading", "exam", "de");
    expect(miss.available).toBe(false);
    expect(practiceGuideResponse("C2", 20, "writing", "exam", "de").available).toBe(true);
  });
});

describe("Canonical B2 Course Book material in ChatGPT", () => {
  test("B2 day 1 contains the actual reading text, vocabulary, grammar exercise and review", () => {
    const overview = lessonContentResponse("B2", 1, "overview");
    expect(overview.available).toBe(true);
    expect(overview.readingTitle).toBe("Müll vermeiden statt nur besser entsorgen");
    expect(overview.grammarExercise).toMatch(/drei Sätzen/);
    expect(overview.skillFocus).toBe("lesen");
    expect(overview.availableSections).toContain("reading");

    const vocabulary = lessonContentResponse("B2", 1, "vocabulary");
    expect(vocabulary.material).toEqual(expect.arrayContaining([
      expect.objectContaining({ expression: "Abfall vermeiden", meaning: "to prevent waste" }),
    ]));
    const grammar = lessonContentResponse("B2", 1, "grammar");
    expect(grammar.material.introduction).toMatch(/Stoffbeutel/);
    expect(grammar.material.sections[0].title).toMatch(/indem/);
    const reading = lessonContentResponse("B2", 1, "reading");
    expect(reading.material.paragraphs[0]).toMatch(/Papiertonne/);
    expect(reading.material.questions.length).toBeGreaterThan(2);
    const review = lessonContentResponse("B2", 1, "review");
    expect(review.material.length).toBeGreaterThan(1);
  });

  test("publishes 28 real B2 lessons; avoids inventing unavailable sections", () => {
    for (let day = 1; day <= 28; day += 1) {
      expect(lessonContentResponse("B2", day, "overview").available).toBe(true);
    }
    expect(lessonContentResponse("B2", 1, "writing").available).toBe(false);
    expect(lessonContentResponse("B2", 4, "writing").material.instructions.length).toBe(4);
    expect(lessonContentResponse("B2", 2, "listening").material.audioAvailableInCampus).toBe(true);
    expect(lessonContentResponse("C1", 1, "reading").material.passageIncluded).toBe(true);
  });

  test("never exports graded answers, model solutions, teacher feedback or audio transcript", () => {
    const root = path.resolve(__dirname, "../../..");
    const raw = fs.readFileSync(path.join(root, "functions/data/chatgptLessonContent.generated.json"), "utf8");
    for (const forbidden of ['"answerIndex"', '"answer"', '"sampleAnswer"',
      '"starterTemplate"', '"transcript"', '"correctOption"', '"teacherNotes"']) {
      expect(raw).not.toContain(forbidden);
    }
    const reading = lessonContentResponse("B2", 1, "reading");
    expect(reading.material.questions[0]).toHaveProperty("options");
    expect(reading.material.questions[0]).not.toHaveProperty("answerIndex");
    expect(reading.material.questions[0]).not.toHaveProperty("explanation");
    expect(lessonContentResponse("B2", 2, "listening").material).not.toHaveProperty("transcript");
  });
});


describe("B1 original Falowen Course Book reading", () => {
  test("B1 Day 1 exposes the exact existing five-paragraph Lesen with seven questions", () => {
    const overview = lessonContentResponse("B1", 1, "overview");
    expect(overview.available).toBe(true);
    expect(overview.readingTitle).toBe("Traumdeutung und ihre Bedeutung");
    expect(overview.availableSections).toContain("reading");
    expect(overview.studySequence[0]).toMatch(/original Falowen Lesen/);

    const lesen = lessonContentResponse("B1", 1, "reading");
    expect(lesen.available).toBe(true);
    expect(lesen.source).toMatch(/Falowen Course Book/);
    expect(lesen.material.paragraphs).toHaveLength(5);
    expect(lesen.material.paragraphs[0]).toMatch(/^Träume faszinieren die Menschheit seit Jahrtausenden/);
    expect(lesen.material.questions).toHaveLength(7);
    expect(lesen.material.questions[0].question).toBe("Was glaubten die Menschen in der Antike über Träume?");
    expect(lesen.material.questions[0].options[0]).toMatch(/Göttern gesendet wurden/);
    expect(lesen.material.questions[6].question).toMatch(/wissenschaftlichen Fortschritte/);
  });

  test("uses real registered B1 reading for other days and reports missing text honestly", () => {
    const reading9 = lessonContentResponse("B1", 9, "reading");
    expect(reading9.available).toBe(true);
    expect(reading9.material.title).toMatch(/Stress im Alltag/);
    expect(reading9.material.questions.length).toBeGreaterThan(0);
    const b1Day2 = lessonContentResponse("B1", 2, "reading");
    expect(b1Day2.available).toBe(true);
    expect(b1Day2.material.title).toMatch(/wahrer Freund/);
    expect(b1Day2.material.paragraphs).toHaveLength(7);
    expect(b1Day2.material.questions).toHaveLength(7);
    expect(b1Day2.material.questions[0]).not.toHaveProperty("answerIndex");
  });

  test("keeps submission in Campus and never leaks private answer keys", () => {
    const lesen = lessonContentResponse("B1", 1, "reading");
    const q = lesen.material.questions[0];
    expect(q).toEqual({ question: expect.any(String), options: expect.any(Array) });
    expect(q).not.toHaveProperty("answer");
    expect(q).not.toHaveProperty("answerIndex");
    expect(lesen.lessonUrl).toContain("/campus/course/lesson/B1/1");
    const raw = fs.readFileSync(path.resolve(__dirname, "../../data/chatgptLessonContent.generated.json"), "utf8");
    for (const forbidden of ['"answerIndex"', '"sampleAnswer"', '"transcript"', '"teacherNotes"']) {
      expect(raw).not.toContain(forbidden);
    }
  });
});


describe("A1 and A2 canonical Course Book exports for ChatGPT", () => {
  test("A1 Day 1 contains the real greeting text and all ten original unanswered questions", () => {
    const overview = lessonContentResponse("A1", 1, "overview");
    expect(overview.available).toBe(true);
    expect(overview.availableSections).toContain("reading");
    expect(overview.availableSections).toContain("workbook");
    expect(overview.workbookChapters).toEqual(expect.arrayContaining([
      expect.objectContaining({ chapter: "0.1", assignmentId: "A1-0.1" }),
    ]));
    const reading = lessonContentResponse("A1", 1, "reading");
    expect(reading.material.paragraphs[0]).toMatch(/^Guten Morgen! Wie geht es dir\?/);
    expect(reading.material.questions).toHaveLength(10);
    expect(reading.material.questions[0].question).toMatch(/7:00 Uhr/);
    expect(reading.material.questions[0].options).toHaveLength(4);
    expect(reading.material.questions[0]).not.toHaveProperty("answer");
    const grammar = lessonContentResponse("A1", 1, "grammar");
    expect(grammar.material.fullExplanationIncluded).toBe(true);
    expect(grammar.material.noteLinks[0].url).toContain("/campus/course/");
  });

  test("A1 exposes the single active Day 2 assessment without reviving old chapter assignments", () => {
    const day2 = lessonContentResponse("A1", 2, "workbook");
    expect(day2.available).toBe(true);
    expect(day2.material.chapters.map(x => x.assignmentId)).toEqual(["A1-0.2_1.1"]);
    expect(day2.material.chapters[0].route).toBe("/campus/course/a1-day-2-foundations-workbook");
    expect(day2.material.chapters[0].sections).toHaveLength(5);
    const day3 = lessonContentResponse("A1", 3, "workbook");
    expect(day3.material.chapters.map(x => x.assignmentId)).toEqual(["A1-1.2"]);
    const day22 = lessonContentResponse("A1", 22, "workbook");
    expect(day22.material.chapters.some(x => x.assignmentId === "A1-14.1")).toBe(true);
    expect(day22.material.chapters.every(x => x.route.startsWith("/campus/"))).toBe(true);
    const day5 = lessonContentResponse("A1", 5, "reading");
    expect(day5.available).toBe(false); // Do not invent unexported JSX text.
  });

  test("A2 has original reading passage and questions for all 28 Course Book days", () => {
    for (let day = 1; day <= 28; day += 1) {
      const reading = lessonContentResponse("A2", day, "reading");
      expect(reading.available).toBe(true);
      expect(reading.material.text.length).toBeGreaterThan(45);
      expect(reading.material.questions.length).toBeGreaterThan(0);
      expect(reading.material.questions[0]).not.toHaveProperty("answerIndex");
      expect(lessonContentResponse("A2", day, "grammar").material.orderedNotes.length).toBeGreaterThan(0);
    }
    const first = lessonContentResponse("A2", 1, "reading");
    expect(first.material.title).toBe("Neu im Büro");
    expect(first.material.text).toMatch(/seit Montag neu bei der Firma Keller/);
    expect(first.material.questions[0].question).toMatch(/Seit wann/);
    const listening = lessonContentResponse("A2", 1, "listening");
    expect(listening.material.task).toMatch(/Höre den Text zweimal/);
    expect(listening.material.questions).toHaveLength(5);
    expect(listening.material).not.toHaveProperty("transcript");
  });
});


describe("Original Falowen grammar teaching and remaining workbook gaps", () => {
  test("makes the actual A2 grammar teaching readable for every day", () => {
    for (let day = 1; day <= 28; day += 1) {
      const grammar = lessonContentResponse("A2", day, "grammar");
      expect(grammar.available).toBe(true);
      expect(grammar.material.orderedNotes.length).toBeGreaterThan(0);
      expect(grammar.material.sections.length).toBeGreaterThan(0);
      expect(grammar.material.sections[0]).toHaveProperty("explanation");
      expect(grammar.material.sections[0].explanation.length).toBeGreaterThan(25);
    }
    const day1 = lessonContentResponse("A2", 1, "grammar");
    expect(JSON.stringify(day1.material.sections)).toMatch(/weil|deshalb/i);
    expect(JSON.stringify(day1.material)).not.toContain('"answer"');
  });

  test("makes the actual B1 grammar notes readable across all 28 days", () => {
    for (let day = 1; day <= 28; day += 1) {
      const grammar = lessonContentResponse("B1", day, "grammar");
      expect(grammar.available).toBe(true);
      expect(grammar.material.orderedNotes.length).toBeGreaterThan(20);
      expect(grammar.material.sections.length).toBeGreaterThan(0);
    }
    const day1 = lessonContentResponse("B1", 1, "grammar");
    expect(JSON.stringify(day1.material.sections)).toMatch(/Präsens|Perfekt/);
  });

  test("A1 Day 2 never exposes archived Hören/video; writing refers to new combined workbook", () => {
    const listening = lessonContentResponse("A1", 2, "listening");
    expect(listening.available).toBe(false);
    const writing = lessonContentResponse("A1", 2, "writing");
    expect(writing.available).toBe(true);
    expect(writing.material.chapter).toBe("0.2");
    expect(writing.material.prompt).toMatch(/four short German sentences/);
    expect(JSON.stringify(writing.material)).toContain("A1-0.2_1.1");
    const overview = lessonContentResponse("A1", 3, "overview");
    expect(overview.grammarFocus).toMatch(/wie, wo, woher/);
  });

  test("shows source-literal A1 Day 3 Lesen and Hören while preserving blanks", () => {
    const reading = lessonContentResponse("A1", 3, "reading");
    expect(reading.available).toBe(true);
    expect(reading.material.paragraphs[0]).toMatch(/Hallo! Ich heiße Anna/);
    expect(reading.material.questions).toHaveLength(9);
    expect(reading.material.questions[0].question).toMatch(/Ich ___ Anna/);
    const listening = lessonContentResponse("A1", 3, "listening");
    expect(listening.material.questions).toHaveLength(5);
    expect(listening.material.chapter).toBe("1.2");
  });
});


describe("C2 original unified workbook grammar", () => {
  const grammar=day=>lessonContentResponse("C2",day,"grammar").material;
  const notes=day=>grammar(day).orderedNotes;
  test("all 28 days preserve the original four-stage lesson and topic checks",()=>{
    for(let day=1;day<=28;day++){
      const g=grammar(day),b=g.orderedNotes;
      expect(g.fullExplanationIncluded).toBe(true);
      expect(b.length).toBeGreaterThan(30);
      expect(b.map(x=>x.number)).toEqual(b.map((_,i)=>i+1));
      const labels=["1. Verstehen · Was bedeutet das?","2. Satz bauen · Schritt für Schritt","3. Gemeinsam prüfen","4. Jetzt selbst anwenden · nach dem gemeinsamen Check"];
      const indices=labels.map(title=>b.findIndex(x=>x.type==="heading"&&x.text===title));
      expect(indices.every((x,i)=>x>=0&&(i===0||x>indices[i-1]))).toBe(true);
      const checks=b.filter(x=>x.type==="multipleChoice");
      expect(checks).toHaveLength(4);
      for(const q of checks){
        expect(Object.keys(q).sort()).toEqual(["number","options","question","type"]);
        expect(q.options.length).toBeGreaterThan(1);
      }
      expect(g.task).toBe(b[indices[3]+1].text);
      expect(b.some(x=>x.text==="Umformung · kurzes Grammatiktraining")).toBe(day%4===2);
      expect(b.some(x=>x.text==="Argumentation · Schreiben vorbereiten")).toBe(day%4===0);
    }
  });
  test("Day 1 uses exact grammar wording and original learner-facing check",()=>{
    const b=notes(1);
    expect(b.some(x=>x.text==="Eine nuancierte Bewertung nennt Bedingungen statt alles gut oder schlecht zu nennen.")).toBe(true);
    expect(b.some(x=>x.text==="Recycling ist sinnvoll, sofern Produkte nicht repariert werden können.")).toBe(true);
    expect(b.find(x=>x.type==="multipleChoice")).toEqual(expect.objectContaining({
      question:"Welche Aussage nennt eine Bedingung?",
      options:["Recycling ist immer die beste Lösung.","Recycling ist sinnvoll, sofern Reparatur nicht möglich ist."]
    }));
    expect(b.some(x=>x.text==="Bewerte Reparatur und Recycling. Nenne mit sofern eine Bedingung, unter der deine Bewertung gilt.")).toBe(true);
    expect(JSON.stringify(b)).not.toContain('"answerIndex"');
    expect(JSON.stringify(b)).not.toContain('"explanation"');
  });
  test("transformation teaching examples are included but exam model answers are not exported",()=>{
    expect(notes(2).some(x=>x.text==="obwohl → trotz")).toBe(true);
    expect(notes(2).some(x=>x.text==="Obwohl die Umsetzung teuer ist, ... → Trotz der hohen Umsetzungskosten ...")).toBe(true);
    expect(JSON.stringify(grammar(2))).not.toMatch(/"(modelAnswer|sampleAnswer|answerIndex|reformulations)"\s*:/);
    expect(notes(28).some(x=>x.text==="Formuliere eine vorsichtige Aussage um. Vergleiche danach Bedeutung, Evidenzgrad und Register beider Versionen.")).toBe(true);
  });
});

describe("C1 and C2 canonical student Course Book in ChatGPT", () => {
  test("shows 28 real C1/C2 day overviews with their own levels", () => {
    for (const level of ["C1", "C2"]) {
      for (let day = 1; day <= 28; day += 1) {
        const overview = lessonContentResponse(level, day, "overview");
        expect(overview.available).toBe(true);
        expect(overview.level).toBe(level);
        expect(overview.title.length).toBeGreaterThan(3);
        expect(overview.lessonUrl).toContain("/lesson/" + level + "/" + day);
      }
    }
    expect(lessonContentResponse("C1", 20, "overview").title).toBe("KI im Gesundheitswesen und Telemedizin");
  });

  test("returns new Falowen-authored C1 reading passages and preserves original reading tasks", () => {
    const reading = lessonContentResponse("C1", 1, "reading");
    expect(reading.available).toBe(true);
    expect(reading.material.task).toBeTruthy();
    expect(reading.material.passageIncluded).toBe(true);
    expect(reading.material.paragraphs.length).toBeGreaterThan(0);
    expect(reading.material.questions.length).toBeGreaterThan(0);
    expect(lessonContentResponse("C1", 20, "reading").available).toBe(true);
    expect(lessonContentResponse("C1", 20, "writing").material.instructions.length).toBeGreaterThan(2);
    expect(lessonContentResponse("C1", 20, "grammar").material.fullExplanationIncluded).toBe(true);
  });

  test("C2 returns original Lesen only on actual reading days, with no answer keys", () => {
    for (const day of [1, 5, 9, 13, 17, 21, 25]) {
      const reading = lessonContentResponse("C2", day, "reading");
      expect(reading.available).toBe(true);
      expect(reading.material.paragraphs.length).toBeGreaterThan(2);
      expect(reading.material.questions.length).toBeGreaterThan(2);
      expect(reading.material.questions[0].options.length).toBeGreaterThan(2);
      expect(reading.material.questions[0]).not.toHaveProperty("answerIndex");
      expect(reading.material.questions[0]).not.toHaveProperty("explanation");
    }
    const day20 = lessonContentResponse("C2", 20, "overview");
    expect(day20.skillFocus).toBe("write");
    expect(day20.availableSections).not.toContain("reading");
    expect(lessonContentResponse("C2", 20, "reading").available).toBe(false);
    expect(lessonContentResponse("C2", 20, "writing").material.targetWords).toBe(350);
    expect(lessonContentResponse("C2", 3, "speaking").material.prompt.length).toBeGreaterThan(30);
  });

  test("keeps all advanced-course solutions, audio transcripts and models out of the snapshot", () => {
    const raw = fs.readFileSync(path.resolve(__dirname, "../../data/chatgptLessonContent.generated.json"), "utf8");
    for (const forbidden of ['"answerIndex"', '"answer"', '"modelAnswer"', '"sampleAnswer"',
      '"transcript"', '"teacherNotes"', '"correctOption"']) {
      expect(raw).not.toContain(forbidden);
    }
    expect(lessonContentResponse("C2", 2, "listening").material).not.toHaveProperty("transcript");
  });
});


describe("Companion multilingual revision", () => {
  const { companionPrograms, swahiliLessonResponse, revisionEvidence } = require("../chatgptCompanion");
  const german = { id: "g", data: { program: "german", level: "A1" } };
  const swahili = { id: "s", data: { program: "swahili", level: "A1" } };
  test("requires explicit secondary enrolment and never substitutes German", () => {
    const retained = { id: "g", data: { ...german.data, coursePlacements: { swahili: { level: "A1" } } } };
    expect(companionPrograms(retained)).toEqual([{ program: "german", level: "A1" }]);
    expect(swahiliLessonResponse(retained, 2).available).toBe(false);
    const dual = { ...retained, data: { ...retained.data, secondaryProgram: "swahili" } };
    expect(companionPrograms(dual)).toHaveLength(2);
    expect(swahiliLessonResponse(dual, 2, "reading").available).toBe(true);
    expect(revisionEvidence(dual, []).available).toBe(false);
  });
  test("returns original Kiswahili workbook passage without key or invented audio", () => {
    const lesson = swahiliLessonResponse(swahili, 2, "reading");
    expect(lesson.available).toBe(true);
    expect(lesson.material.passage).toContain("salamu");
    expect(lesson.material.questions.length).toBeGreaterThan(0);
    expect(JSON.stringify(lesson)).not.toMatch(/"(answer|answerIndex|correctOption|transcript|why)"\s*:/);
    const listening = swahiliLessonResponse(swahili, 2, "listening");
    expect(listening.available).toBe(true);
    expect(listening.material.audioAvailableInCampus).toBe(true);
    expect(JSON.stringify(listening)).not.toMatch(/"(transcript|answer|audioUrlEndpoint)"\s*:/);
    expect(swahiliLessonResponse(swahili, 50).available).toBe(false);
    expect(swahiliLessonResponse(german, 2).available).toBe(false);
  });
  test("does not infer weaknesses from unlabelled or other-level records", () => {
    expect(revisionEvidence(german, [{ level: "B1", score: 0 }, { score: 0 }]).available).toBe(false);
    expect(revisionEvidence(swahili, []).available).toBe(false);
  });
});

 test("upgraded C1 exports 28 topic-aligned skill exercises and 560 vocabulary pairs without keys",()=>{const map={lesen:"reading",hoeren:"listening",speak:"speaking",write:"writing"};const counts={};for(let day=1;day<=28;day++){const o=lessonContentResponse("C1",day,"overview");counts[o.skillFocus]=(counts[o.skillFocus]||0)+1;const v=lessonContentResponse("C1",day,"vocabulary");expect(v.material.terms).toHaveLength(20);const section=lessonContentResponse("C1",day,map[o.skillFocus]);expect(section.available).toBe(true);expect(section.material.part).toBe(o.examPart);expect(JSON.stringify(section.material)).not.toMatch(/"(answerIndex|correctIndex|model|transcript|grammarChecks)"/);expect(lessonContentResponse("C1",day,"grammar").material.exercises).toHaveLength(3);}expect(counts).toEqual({lesen:7,hoeren:7,speak:7,write:7});});


describe("A2 original classroom speaking and writing export",()=>{
 test("Day 9 has the original five vacation prompts and no model answers",()=>{const result=lessonContentResponse("A2",9,"speaking");expect(result.available).toBe(true);expect(result.material.prompt).toBe("Wie war dein letzter Urlaub?");expect(result.material.guidingQuestions).toEqual(["Reiseziel und Zeit?","Reise und Begleitung?","Aktivitäten und Wetter?","Deine Meinung?","Besonderes Erlebnis?"]);expect(result.material.practiceOnly).toBe(true);expect(JSON.stringify(result.material)).not.toMatch(/modelSentence|modelAnswer|Cape Coast/);const guide=practiceGuideResponse("A2",9,"speaking","study","en");expect(guide.available).toBe(true);expect(guide.interaction.method).toBe("one_question_at_a_time");});
 test("ordinary A2 days have source speaking prompts; the dedicated mock is not substituted",()=>{for(let day=1;day<=28;day++){const speaking=lessonContentResponse("A2",day,"speaking");if(day===22){expect(speaking.available).toBe(false);continue;}expect(speaking.available).toBe(true);expect(speaking.material.guidingQuestions).toHaveLength(5);expect(speaking.material.prompt.length).toBeGreaterThan(3);}});
 test("Day 9 has original hotel writing prompt; non-writing days remain unavailable",()=>{const writing=lessonContentResponse("A2",9,"writing");expect(writing.available).toBe(true);expect(writing.material.title).toBe("E-Mail an ein Hotel");expect(writing.material.instructions).toHaveLength(3);expect(lessonContentResponse("A2",2,"writing").available).toBe(false);});
});

 test("switching sections preserves verified course context and exposes actual A2 Day 9 part mapping",()=>{const grammar=lessonContentResponse("A2",9,"grammar");const speak=lessonContentResponse("A2",9,"speaking");const write=lessonContentResponse("A2",9,"writing");for(const result of [grammar,speak,write]){expect(result.available).toBe(true);expect(result.level).toBe("A2");expect(result.day).toBe(9);expect(result.workbookPartSections["1"]).toBe("speaking");expect(result.workbookPartSections["2"]).toBe("writing");expect(result.availableSections).toContain("speaking");expect(result.guidance).toContain("starting point");}expect(lessonContentResponse("C2",20,"reading").available).toBe(false);});

describe("C1 original guided grammar notes", () => {
  test("Day 1 exports real headings, exact text and structured tables in page order", () => {
    const result = lessonContentResponse("C1", 1, "grammar");
    const notes = result.material.orderedNotes;
    expect(result.material.fullExplanationIncluded).toBe(true);
    expect(notes[0]).toEqual({ number: 1, type: "heading", text: "Relativsätze mit Präpositionen" });
    expect(notes[1].text).toBe("Lernwege, Personen, Methoden und Ziele präzise miteinander verbinden");
    expect(notes.find(b => b.type === "heading" && b.text === "1. Die Präposition gehört zum Verb")).toBeDefined();
    expect(notes.find(b => b.type === "table" && b.headers)).toMatchObject({
      headers: ["Struktur / Bedeutung", "Form / Beispiel"],
      rows: expect.arrayContaining([["arbeiten mit + Dativ", "der Tutor, mit dem ich arbeite"]]),
    });
    expect(notes.find(b => b.type === "heading" && b.text === "C1-Grammatik im Kontext").number)
      .toBeLessThan(notes.find(b => b.type === "heading" && b.text === "1. Die Präposition gehört zum Verb").number);
    expect(result.guidance).toContain("material.orderedNotes");
  });
  test("All 28 days expose numbered source blocks, not collapsed answers", () => {
    for (let day = 1; day <= 28; day++) {
      const grammar = lessonContentResponse("C1", day, "grammar").material;
      expect(grammar.fullExplanationIncluded).toBe(true);
      expect(grammar.orderedNotes.map(b => b.number)).toEqual(grammar.orderedNotes.map((_, i) => i + 1));
      expect(grammar.orderedNotes.some(b => b.type === "questions")).toBe(true);
      expect(grammar.orderedNotes.some(b => b.type === "table")).toBe(true);
      for (const block of grammar.orderedNotes.filter(b => b.type === "questions")) expect(block.items.every(q => typeof q === "string")).toBe(true);
      expect(JSON.stringify(grammar.orderedNotes)).not.toMatch(/"(answer|answerIndex|correctIndex|reason|checks|grammarChecks)"\s*:/);
    }
    expect(lessonContentResponse("C1", 7, "grammar").material.orderedNotes.some(b => b.text === "1. Direkte Vergleiche")).toBe(true);
    expect(lessonContentResponse("C1", 8, "grammar").material.orderedNotes.some(b => b.text === "1. Von verbal zu nominal")).toBe(true);
    expect(lessonContentResponse("C1", 20, "grammar").material.orderedNotes.some(b => b.text === "So baust du die Grammatik auf")).toBe(true);
    expect(lessonContentResponse("C1", 22, "grammar").material.orderedNotes.some(b => b.type === "multipleChoice" && b.options.length === 4)).toBe(true);
    expect(lessonContentResponse("C1", 25, "grammar").material.orderedNotes.some(b => b.text === "Grammar notes")).toBe(true);
  });
});

describe("Original A1 grammar page retrieval", () => {
  test("Days 1–4 contain numbered original teaching, tables and safe knowledge checks", () => {
    for (let day = 1; day <= 4; day++) {
      const g = lessonContentResponse("A1", day, "grammar").material;
      expect(g.fullExplanationIncluded).toBe(true);
      expect(g.orderedNotes.map(b => b.number)).toEqual(g.orderedNotes.map((_, i) => i + 1));
      expect(JSON.stringify(g.orderedNotes)).not.toMatch(/"(answer|answerIndex|correctIndex|explanation)"\s*:/);
    }
    const one = lessonContentResponse("A1", 1, "grammar").material.orderedNotes;
    expect(one.some(b => b.text === "1. Formal and Informal Greetings")).toBe(true);
    expect(one.filter(b => b.type === "multipleChoice")).toHaveLength(10);
    const two = lessonContentResponse("A1", 2, "grammar").material.orderedNotes;
    expect(two.find(b => b.type === "table" && b.headers?.includes("Pronoun")).rows[0])
      .toEqual(["ich", "I", "lerne", "heiße", "bin"]);
    const three = lessonContentResponse("A1", 3, "grammar").material.orderedNotes;
    expect(three.filter(b => b.type === "multipleChoice")).toHaveLength(8);
    expect(three.some(b => b.text === "3) Three W-words for simple questions")).toBe(true);
    const four = lessonContentResponse("A1", 4, "grammar").material.orderedNotes;
    expect(four.find(b => b.type === "table" && b.headers?.includes("Pronunciation")).rows).toHaveLength(21);
  });
});

describe("Remaining original A1 grammar routes", () => {
  test("published grammar routes expose ordered teaching and no hidden quiz answers", () => {
    for (const day of [7,8,9,10,11,12,16,17,18,20,21,22]) {
      const g = lessonContentResponse("A1", day, "grammar").material;
      expect(g.orderedNotes.length).toBeGreaterThan(5);
      expect(g.orderedNotes.map(b => b.number)).toEqual(g.orderedNotes.map((_,i)=>i+1));
      for (const q of g.orderedNotes.filter(b=>b.type==="multipleChoice")) {
        expect(Object.keys(q).sort()).toEqual(["number","options","question","type"]);
        expect(q.options.length).toBeGreaterThan(1);
      }
      if (!g.fullExplanationIncluded) expect(g.omittedTeaching.length).toBeGreaterThan(0);
    }
  });
  test("time, negation, directions and health return real teaching", () => {
    const notes = day => lessonContentResponse("A1",day,"grammar").material.orderedNotes;
    expect(notes(11).find(b=>b.type==="table"&&b.headers.includes("Time")).rows)
      .toEqual(expect.arrayContaining([["06:30","Es ist halb sieben."]]));
    expect(notes(12).filter(b=>b.type==="multipleChoice")).toHaveLength(6);
    expect(notes(16).filter(b=>b.type==="multipleChoice")).toHaveLength(6);
    expect(notes(17).some(b=>b.type==="multipleChoice"&&b.question.includes("Bahnhof"))).toBe(true);
    expect(notes(22).some(b=>b.type==="list"&&b.items.some(x=>x.includes("der Kopf")))).toBe(true);
  });
});

describe("A2 original ordered grammar pages", () => {
  const notes = day => lessonContentResponse("A2",day,"grammar").material.orderedNotes;
  test("all 28 canonical A2 days have ordered teaching and honest completeness metadata", () => {
    for (let day=1;day<=28;day++) {
      const g=lessonContentResponse("A2",day,"grammar").material;
      expect(g.orderedNotes.length).toBeGreaterThan(0);
      expect(g.orderedNotes.map(b=>b.number)).toEqual(g.orderedNotes.map((_,i)=>i+1));
      expect(JSON.stringify(g.orderedNotes)).not.toMatch(/"(answer|answerIndex|correctIndex|explanation|sampleAnswer)"\s*:/);
      if(!g.fullExplanationIncluded)expect(g.omittedTeaching.length).toBeGreaterThan(0);
      for(const q of g.orderedNotes.filter(b=>b.type==="multipleChoice"))expect(q.options.length).toBeGreaterThan(1);
    }
  });
  test("original Day 1 wording, Day 2 declension table and Day 28 visible mini lesson", () => {
    expect(notes(1).some(b=>b.text==="1. First understand the meaning: reason or result?")).toBe(true);
    expect(notes(2).some(b=>b.type==="table"&&b.rows.some(r=>r.includes("ein großer Hund")))).toBe(true);
    expect(notes(2).some(b=>b.text?.startsWith("Correct answer:"))).toBe(false);
    expect(notes(28).some(b=>b.text==="Über Zukunftspläne sprechen")).toBe(true);
    expect(notes(28).filter(b=>b.type==="multipleChoice")).toHaveLength(4);
    expect(notes(7).some(b=>b.text==="Knowledge Test · Relativsätze")).toBe(false);
  });
});

describe("B1 original ordered grammar pages", () => {
  const grammar=day=>lessonContentResponse("B1",day,"grammar").material;
  const notes=day=>grammar(day).orderedNotes;
  test("all 28 days have original introductions, English support and numbered teaching",()=>{
    for(let day=1;day<=28;day++){
      const g=grammar(day),b=g.orderedNotes;
      expect(b.length).toBeGreaterThan(20);
      expect(b.map(x=>x.number)).toEqual(b.map((_,i)=>i+1));
      expect(b[0].text).toBe("B1 · Thema kurz verstehen");
      expect(b.some(x=>x.text==="English support · Read this before the German grammar notes")).toBe(true);
      expect(b.some(x=>x.text==="Sentence structure")).toBe(true);
      expect(JSON.stringify(b)).not.toMatch(/"(answer|answerIndex|correctIndex|sampleAnswer)"\s*:/);
      if(!g.fullExplanationIncluded)expect(g.omittedTeaching.length).toBeGreaterThan(0);
    }
  });
  test("Day 1 keeps original tables and exercises; Day 28 keeps the climate lesson",()=>{
    expect(notes(1).some(b=>b.text==="Warum lernen wir Präsens und Perfekt?")).toBe(true);
    expect(notes(1).some(b=>b.type==="table"&&b.headers?.includes("Präsens")&&b.headers?.includes("Perfekt"))).toBe(true);
    expect(notes(1).some(b=>b.type==="orderedList"&&b.items.some(x=>x.includes("Konjugiere das Verb träumen")))).toBe(true);
    expect(notes(28).some(b=>b.text==="1. Zwei Entwicklungen verbinden – je … desto")).toBe(true);
  });
  test("solution boxes and collapsed exercise answers are excluded even from compatibility sections",()=>{
    for(const day of [2,3,4,5,6,15,18]){
      const b=JSON.stringify(grammar(day));
      expect(b).not.toMatch(/Lösungen anzeigen|Mögliche Lösungen:|"text":"Lösungen"/);
    }
    expect(JSON.stringify(grammar(15))).not.toContain("1. Viele E-Mails werden verschickt.");
    expect(notes(18).some(b=>b.text==="Think first · Erst verstehen, dann anwenden")).toBe(true);
    expect(notes(18).some(b=>b.text==="Wege zum Wunschberuf: Ziele mit um ... zu")).toBe(false);
  });
});

describe("B2 original unified workbook grammar",()=>{
  const grammar=day=>lessonContentResponse("B2",day,"grammar").material;
  const notes=day=>grammar(day).orderedNotes;
  test("all 28 days have original topic context and complete ordered grammar teaching",()=>{
    for(let day=1;day<=28;day++){
      const g=grammar(day),b=g.orderedNotes;
      expect(g.fullExplanationIncluded).toBe(true);
      expect(b.length).toBeGreaterThan(20);
      expect(b.map(x=>x.number)).toEqual(b.map((_,i)=>i+1));
      for(const title of ["In simple English","Auf Deutsch","Grammar / Learn","Regeln","Beispiele","Modellsatz für heute","Mini-Übung"])
        expect(b.some(x=>x.type==="heading"&&x.text===title)).toBe(true);
      expect(b.some(x=>x.text?.startsWith("Warum diese Grammatik?"))).toBe(true);
      expect(b.some(x=>x.text==="Satztraining · Vom B1- zum B2-Satz")).toBe(day<=25);
      expect(JSON.stringify(b)).not.toMatch(/"(answer|answerIndex|correctIndex|sampleAnswer|explanation)"\s*:/);
    }
  });
  test("Day 1 matches the current unified grammar source rather than the old identity notes",()=>{
    const b=notes(1);
    expect(b.some(x=>x.text==="indem / dadurch, dass")).toBe(true);
    expect(b.some(x=>x.text==="Mit indem und dadurch, dass erklärst du die Methode, durch die ein Ergebnis erreicht wird. Beide Strukturen beantworten sinngemäß die Frage: Wie wird das erreicht?")).toBe(true);
    expect(b.find(x=>x.type==="table").rows).toContainEqual(["Abfall vermeiden","avoid waste"]);
    expect(b.at(-1).items[0]).toBe("1. Wir verwenden Mehrwegflaschen. So reduzieren wir Abfall. (indem)");
    expect(JSON.stringify(b)).not.toContain("Wir reduzieren Abfall, indem wir Mehrwegflaschen verwenden.");
    expect(JSON.stringify(b)).not.toContain("Methode: Das konjugierte Verb steht am Ende.");
    expect(b.some(x=>x.text==="Adjektivdeklination")).toBe(false);
  });
  test("Days 26–28 retain real grammar tasks without invented chapter transformations",()=>{
    for(const day of [26,27,28]){
      expect(notes(day).some(x=>x.text==="Mini-Übung")).toBe(true);
      expect(notes(day).some(x=>x.text==="Satztraining · Vom B1- zum B2-Satz")).toBe(false);
    }
  });
});
