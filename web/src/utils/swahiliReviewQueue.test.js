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
