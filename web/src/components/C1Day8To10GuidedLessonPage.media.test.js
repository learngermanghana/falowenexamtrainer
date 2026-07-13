import {
  C1_DAY9_FALOWEN_RADIO,
  resolveC1Day8To10Radio,
} from "./C1Day8To10GuidedLessonPage";

describe("C1 Day 8 to 10 requested media", () => {
  it("uses the requested C1 Day 9 Falowen Radio video", () => {
    expect(C1_DAY9_FALOWEN_RADIO).toEqual(
      expect.objectContaining({
        title: "Konsum und Werbung 2.4",
        youtubeId: "VpL14EhvvEM",
      }),
    );
    expect(resolveC1Day8To10Radio(9)).toEqual(C1_DAY9_FALOWEN_RADIO);
  });

  it("keeps canonical radio resources as the first choice", () => {
    const canonicalRadio = { title: "Canonical", youtubeId: "canonical-id" };
    expect(
      resolveC1Day8To10Radio(9, {
        resources: { falowenRadio: canonicalRadio },
      }),
    ).toBe(canonicalRadio);
  });

  it("does not add the Day 9 radio to other C1 days", () => {
    expect(resolveC1Day8To10Radio(8)).toBeNull();
    expect(resolveC1Day8To10Radio(10)).toBeNull();
  });
});
