import {
  getStudyBuddyLessonContext,
  parseLessonRoute,
} from "./studyBuddyLessonContext";

describe("Study Buddy structured lesson context", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("resolves exact B2 Day 6 Hören context without exposing answer keys", () => {
    window.localStorage.setItem(
      "falowen:b2:day6:standard-journey:progress-v2",
      JSON.stringify({
        learnDone: true,
        hoerenDone: false,
        listeningAnswers: { 0: 1, 1: 0 },
      }),
    );

    const context = getStudyBuddyLessonContext({
      pathname: "/campus/course/lesson/B2/6",
      search: "?chapter=2.1&view=hoeren",
    });

    expect(context).toEqual(expect.objectContaining({
      source: "structured-course-context",
      level: "B2",
      day: 6,
      chapter: "2.1",
      activeView: "hoeren",
      title: "Energie sparen und erneuerbare Energien",
      mainSkill: "Hören",
      mainSkillKey: "hoeren",
    }));
    expect(context.grammarFocus).toContain("Passiv");
    expect(context.topic).toContain("Energieverbrauch");
    expect(context.vocabulary.join(" ")).toContain("Energieeffizienz");
    expect(context.currentTask.title).toBe("Energie sparen und erneuerbare Energien");
    expect(context.currentTask.items).toHaveLength(5);
    expect(context.currentTask.items[2].question).toContain("Speicherkapazität");
    expect(JSON.stringify(context.currentTask.items)).not.toContain("answerIndex");
    expect(JSON.stringify(context.currentTask.items)).not.toContain("explanation");
    expect(context.progress).toEqual(expect.objectContaining({
      learnDone: true,
      hoerenDone: false,
      listeningAnswered: 2,
    }));
  });

  test("resolves C2 reading context from the current day and skill cycle", () => {
    const context = getStudyBuddyLessonContext({
      pathname: "/campus/course/lesson/C2/1",
      search: "?view=lesen",
    });

    expect(context.level).toBe("C2");
    expect(context.day).toBe(1);
    expect(context.mainSkill).toBe("Lesen");
    expect(context.activeView).toBe("lesen");
    expect(context.grammarFocus).toBeTruthy();
    expect(context.currentTask.items).toHaveLength(5);
    expect(JSON.stringify(context.currentTask.items)).not.toContain("answerIndex");
  });

  test("keeps a structured fallback for A1-B1 lesson routes", () => {
    const context = getStudyBuddyLessonContext({
      pathname: "/campus/course/lesson/A2/1",
      search: "?chapter=1",
    });

    expect(context.source).toBe("structured-course-context");
    expect(context.level).toBe("A2");
    expect(context.day).toBe(1);
    expect(context.activeView).toBe("learn");
    expect(context.title).toBeTruthy();
  });

  test("recognizes standard and workbook lesson routes", () => {
    expect(parseLessonRoute({
      pathname: "/campus/course/lesson/B2/6",
      search: "?chapter=2.1&view=hoeren",
    })).toEqual({
      level: "B2",
      day: 6,
      chapter: "2.1",
      view: "hoeren",
    });

    expect(parseLessonRoute({
      pathname: "/campus/course/A1-day-6-family-and-hobbies-workbook",
      search: "",
    })).toEqual({
      level: "A1",
      day: 6,
      chapter: "",
      view: "learn",
    });
  });
});
