import B2Day1IdentityPilotLessonPage, { speakingTopics } from "./B2Day1IdentityPilotLessonPage";
import builder from "../data/writingQuestionBuilders/b2Day1PersoenlicheIdentitaet";
test("B2 Day 1 provides five practical speaking groups with questions and examples", () => { expect(typeof B2Day1IdentityPilotLessonPage).toBe("function"); expect(speakingTopics).toHaveLength(5); speakingTopics.forEach((topic) => expect(topic).toHaveLength(5)); });
test("B2 Day 1 uses five guided writing questions", () => expect(builder.questions).toHaveLength(5));
