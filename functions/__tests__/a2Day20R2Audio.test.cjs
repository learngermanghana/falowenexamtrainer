"use strict";

const { validateA2AudioKey } = require("../functionz/r2CourseAudio");

describe("A2 Day 20 listening audio authorization", () => {
  test("signs the uploaded pullover complaint recording only for Day 20", () => {
    expect(validateA2AudioKey({ day: 20, key: "a2/day-20/day-20.mp3" })).toEqual({
      day: 20,
      key: "a2/day-20/day-20.mp3",
    });
  });

  test("does not allow the replaced recording or arbitrary objects", () => {
    expect(validateA2AudioKey({ day: 20, key: "a2/day-20/reklamation-falsches-hemd.mp3" })).toBeNull();
    expect(validateA2AudioKey({ day: 20, key: "a2/day-20/private.mp3" })).toBeNull();
    expect(validateA2AudioKey({ day: 19, key: "a2/day-20/day-20.mp3" })).toBeNull();
  });
});
