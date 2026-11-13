import { canonicalSwahiliSubmission } from "./swahiliReviewQueue";

const makeEntry=(path,overrides={})=>({
  ref:{path},
  data:()=>({program:"swahili",lessonId:"swahili-day-1",status:"submitted",studentId:"owner-1",userId:"owner-1",...overrides}),
});

describe("Kiswahili review ownership",()=>{
  it("uses the canonical user document owner, not display fields",()=>{
    const item=canonicalSwahiliSubmission(makeEntry("users/owner-1/swahiliLessons/day-1"));
    expect(item).toEqual(expect.objectContaining({studentId:"owner-1",userId:"owner-1",path:"users/owner-1/swahiliLessons/day-1"}));
  });
  it("rejects spoofed studentId or userId on another learner's path",()=>{
    expect(canonicalSwahiliSubmission(makeEntry("users/owner-1/swahiliLessons/day-1",{studentId:"victim"}))).toBeNull();
    expect(canonicalSwahiliSubmission(makeEntry("users/owner-1/swahiliLessons/day-1",{userId:"victim"}))).toBeNull();
  });
  it("rejects noncanonical paths and unrelated submission records",()=>{
    expect(canonicalSwahiliSubmission(makeEntry("users/owner-1/swahiliLessons/day-2"))).toBeNull();
    expect(canonicalSwahiliSubmission(makeEntry("other/owner-1/swahiliLessons/day-1"))).toBeNull();
    expect(canonicalSwahiliSubmission(makeEntry("users/owner-1/swahiliLessons/day-1",{program:"german"}))).toBeNull();
    expect(canonicalSwahiliSubmission(makeEntry("users/owner-1/swahiliLessons/day-1",{status:"draft"}))).toBeNull();
  });
  it("supports legacy submissions without studentId by deriving owner from path",()=>{
    const item=canonicalSwahiliSubmission(makeEntry("users/owner-1/swahiliLessons/day-1",{studentId:"",userId:""}));
    expect(item.studentId).toBe("owner-1");
  });
});

describe("Day 6 restaurant review queue", () => {
  it("accepts only canonical owner submissions under day-6", () => {
    const entry = makeEntry("users/owner-1/swahiliLessons/day-6", { lessonId: "swahili-day-6" });
    expect(canonicalSwahiliSubmission(entry, 6)).toEqual(expect.objectContaining({
      studentId: "owner-1", path: "users/owner-1/swahiliLessons/day-6", lessonId: "swahili-day-6",
    }));
    expect(canonicalSwahiliSubmission(entry, 1)).toBeNull();
  });
  it("rejects cross-lesson identities and forged recipient fields", () => {
    expect(canonicalSwahiliSubmission(makeEntry("users/owner-1/swahiliLessons/day-6", { lessonId: "swahili-day-1" }), 6)).toBeNull();
    expect(canonicalSwahiliSubmission(makeEntry("users/owner-1/swahiliLessons/day-6", { lessonId: "swahili-day-6", studentId: "victim" }), 6)).toBeNull();
    expect(canonicalSwahiliSubmission(makeEntry("users/owner-1/swahiliLessons/day-6", { lessonId: "swahili-day-6", userId: "victim" }), 6)).toBeNull();
    expect(canonicalSwahiliSubmission(makeEntry("users/owner-1/swahiliLessons/day-6", { lessonId: "swahili-day-6" }), 2)).toBeNull();
  });
});
