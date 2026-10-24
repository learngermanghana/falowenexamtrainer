import B2Day1RadioGatePage, {
  shouldShowB2Day1RadioIntro,
} from "./B2Day1RadioGatePage";

test("B2 Day 1 shows the radio entrance before the main lesson when radio exists", () => {
  expect(typeof B2Day1RadioGatePage).toBe("function");
  expect(shouldShowB2Day1RadioIntro({ youtubeId: "0lTNin1NTgc" })).toBe(true);
  expect(shouldShowB2Day1RadioIntro(null)).toBe(false);
});
