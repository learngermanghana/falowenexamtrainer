const flow = require("../goetheExaminerFlow");

const speakingTask = (teil, prompt, keywords = "") => ({
  id: `b1-mock-03-speaking-teil-${teil}`,
  teil: `Teil ${teil}`,
  prompt,
  keywords,
});

describe("B1 Mock 3 live Goethe Sprechen dialogue", () => {
  test("Teil 1 negotiates all four source Leitpunkte, not a party scenario", () => {
    const task = speakingTask("1",
      "Ein Teilnehmer hatte einen Unfall und liegt im Krankenhaus. Nächste Woche braucht er Hilfe zu Hause.");
    const sessionFlow = flow.createExaminerFlow("B1", task, "simulation");
    expect(sessionFlow.key).toBe("B1-1");
    expect(sessionFlow.planningPoints.map(item => item.id)).toEqual([
      "visit", "transport", "gift", "help",
    ]);
    expect(sessionFlow.planningPoints.map(item => item.text).join(" ")).toContain("Krankenhaus");
    expect(sessionFlow.planningPoints.map(item => item.text).join(" ")).toContain("nächste Woche");
    expect(flow.currentStep(sessionFlow,0).action).toBe("negotiate");
    const publicCard = flow.publicFlow({examFlow:sessionFlow,answeredTurns:0});
    expect(publicCard.points).toHaveLength(4);
  });

  test.each([
    ["Brauchen Kinder Mobiltelefone?"],
    ["Sehen Kinder zu viel fern?"],
  ])("Teil 2 presents the chosen topic %s without interruption", topic => {
    const task = speakingTask("2",`Thema: ${topic} Folie 1 ... Folie 5 ...`,topic);
    const sessionFlow = flow.createExaminerFlow("B1", task, "simulation");
    expect(sessionFlow.contextTopic).toBe(topic);
    expect(flow.currentStep(sessionFlow,0).action).toBe("presentation");
    expect(flow.currentStep(sessionFlow,1)).toBeNull();
  });

  test.each([
    ["Brauchen Kinder Mobiltelefone?","Sehen Kinder zu viel fern?"],
    ["Sehen Kinder zu viel fern?","Brauchen Kinder Mobiltelefone?"],
  ])("Teil 3 plays opposite-topic partner presentation and asks one own-topic question", (own, partner) => {
    const task = speakingTask("3", `Feedback zur Präsentation über ${own}`,own);
    const sessionFlow = flow.createExaminerFlow("B1", task, "simulation");
    expect(sessionFlow.contextTopic).toBe(own);
    expect(sessionFlow.discussion.topic).toBe(partner);
    expect(sessionFlow.discussion.presentation).toContain(partner);
    expect(sessionFlow.mockPresentationFeedback).toBe(true);
    expect(flow.currentStep(sessionFlow,0).action).toBe("feedback-and-question");
    expect(flow.currentStep(sessionFlow,1).action).toBe("answer-examiner");
  });
});
