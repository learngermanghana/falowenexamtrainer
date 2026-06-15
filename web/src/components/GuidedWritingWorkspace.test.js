import { migrateGuidedWritingState } from "./GuidedWritingWorkspace";
import b2 from "../data/writingQuestionBuilders/b2Day1PersoenlicheIdentitaet";
import c1 from "../data/writingQuestionBuilders/c1Day2KulturUndIdentitaet";
test("B2 and C1 guided routes use exactly five existing questions", () => { expect(b2.questions).toHaveLength(5); expect(c1.questions).toHaveLength(5); });
test("old final-view drafts migrate to protected manual combined text", () => { expect(migrateGuidedWritingState({ answers: { a: "one" }, finalEssay: "edited", view: "final", updatedAt: "date" })).toMatchObject({ answers: { a: "one" }, finalEssay: "edited", combinedDraftMode: "manual", updatedAt: "date" }); });
test("old question-only drafts remain automatic", () => { expect(migrateGuidedWritingState({ answers: { a: "one" }, view: "questions" }).combinedDraftMode).toBe("auto"); });
