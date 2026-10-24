import { resolveA1WorkbookServiceScope } from "./a1WorkbookServiceScope";

describe("A1 workbook service scope", () => {
  it.each([
    ["/campus/course/lesson/A1/20", "?chapter=12.3"],
    ["/campus/course/lesson/A1/21", "?chapter=13"],
  ])("keeps plain lesson resource hubs free from workbook overlays: %s%s", (pathname, search) => {
    expect(resolveA1WorkbookServiceScope({ pathname, search })).toEqual(
      expect.objectContaining({
        isDynamicLesson: true,
        isWorkbookView: false,
        shouldMountWorkbookServices: false,
      }),
    );
  });

  it("allows an explicitly requested dynamic workbook view", () => {
    expect(
      resolveA1WorkbookServiceScope({
        pathname: "/campus/course/lesson/A1/21",
        search: "?chapter=13&view=workbook",
      }),
    ).toEqual(
      expect.objectContaining({
        isDynamicLesson: true,
        isWorkbookView: true,
        shouldMountWorkbookServices: true,
      }),
    );
  });

  it("keeps named and special workbook routes eligible for their existing services", () => {
    expect(
      resolveA1WorkbookServiceScope({ pathname: "/campus/course/a1-day-21-weather-workbook" }),
    ).toEqual(expect.objectContaining({ isWorkbookView: true, shouldMountWorkbookServices: true }));

    expect(
      resolveA1WorkbookServiceScope({ pathname: "/campus/course/letter-writing-intro-german-a1-day-12-3" }),
    ).toEqual(expect.objectContaining({ shouldMountWorkbookServices: true }));
  });
});
