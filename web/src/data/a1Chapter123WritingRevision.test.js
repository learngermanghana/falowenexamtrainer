import { getA1TutorDraftProfile } from "./a1TutorDraftProfiles";
import { saveA1WorkbookDraft, readA1WorkbookDraft, buildA1WorkbookDraftStorageKey } from "../utils/a1WorkbookDraft";
it("captures five form answers and the email without reusing old letter drafts", () => {
 const profile = getA1TutorDraftProfile("A1-12.3");
 expect(profile.sections["teil-1"].items).toHaveLength(5);
 expect(profile.sections["teil-2"].embeddedWriting).toBe(true);
 window.localStorage.setItem(buildA1WorkbookDraftStorageKey("A1-12.3"), JSON.stringify({assignmentKey:"A1-12.3",sections:{"teil-1":{text:"old birthday letter"},"teil-2":{text:"old school email"}}}));
 expect(readA1WorkbookDraft("A1-12.3").sections).toEqual({});
 saveA1WorkbookDraft({assignmentKey:"A1-12.3",sections:{"teil-1":{answers:{1:"Intensivkurs",2:"August",3:"vier",4:"Einzelzimmer",5:"Kreditkarte"}},"teil-2":{text:"Liebe Julia, ich lade dich ein."}}});
 expect(readA1WorkbookDraft("A1-12.3").sections["teil-1"].answers["5"]).toBe("Kreditkarte");
 expect(readA1WorkbookDraft("A1-12.3").sections["teil-2"].text).toContain("Julia");
});

it("serializes form fields and the invitation as separate submission parts", () => {
 const { buildA1WorkbookSubmissionText } = require("../utils/a1WorkbookDraft");
 const draft = readA1WorkbookDraft("A1-12.3");
 const text = buildA1WorkbookSubmissionText({assignment:{assignmentKey:"A1-12.3",sections:[{key:"teil-1",number:1},{key:"teil-2",number:2}]},draft});
 expect(text).toContain("TEIL 1\n1. Intensivkurs");
 expect(text).toContain("5. Kreditkarte");
 expect(text).toContain("TEIL 2\nLiebe Julia");
 expect(text).not.toContain("old school email");
});
