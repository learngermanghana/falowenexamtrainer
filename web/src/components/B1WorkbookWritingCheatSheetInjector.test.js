import { __TESTING__ } from "./B1WorkbookWritingCheatSheetInjector";
import { getWritingCheatSheet } from "../data/writingCheatSheets";

const buildWritingRoot = () => {
  const root = document.createElement("div");
  root.innerHTML = `
    <section>
      <h2>Teil 2 · Schreiben (Assignment)</h2>
      <div data-writing-task>Writing task</div>
      <div data-writing-tabs>
        <button type="button">Schreiben</button>
        <button type="button">Cheat sheet</button>
      </div>
    </section>
  `;
  return root;
};

describe("B1 workbook writing cheat sheet injector", () => {
  test("activates on B1 lesson workbook views only", () => {
    expect(
      __TESTING__.isB1WorkbookRoute(
        "/campus/course/lesson/B1/1",
        "?view=workbook"
      )
    ).toBe(true);
    expect(
      __TESTING__.isB1WorkbookRoute(
        "/campus/course/lesson/B1/2",
        "?view=workbook&assignmentKey=B1-1.2&radio=done"
      )
    ).toBe(true);
    expect(
      __TESTING__.isB1WorkbookRoute(
        "/campus/course/lesson/B1/1",
        "?view=grammar"
      )
    ).toBe(false);
    expect(
      __TESTING__.isB1WorkbookRoute(
        "/campus/course/lesson/B1/1",
        ""
      )
    ).toBe(false);
    expect(
      __TESTING__.isB1WorkbookRoute(
        "/campus/course/lesson/B1/21",
        "?view=workbook"
      )
    ).toBe(false);
  });

  test("does not activate on removed standalone B1 Day 21 workbook routes", () => {
    expect(
      __TESTING__.isB1WorkbookRoute(
        "/campus/course/b1-day-21-lebensformen-heute-workbook",
        ""
      )
    ).toBe(false);
  });

  test("B1 cheat sheet content exists for workbook days", () => {
    expect(getWritingCheatSheet("B1", 1).length).toBeGreaterThan(0);
    expect(getWritingCheatSheet("B1", 1)[0].items.length).toBeGreaterThan(0);
  });

  test("injects the mapped B1 Day 1 writing video before the writing workspace", () => {
    const root = buildWritingRoot();

    expect(__TESTING__.findWritingSection(root)).not.toBeNull();
    const result = __TESTING__.ensureWritingVideoCard(root, 1);

    expect(result).toEqual(expect.objectContaining({
      mounted: true,
      reason: "inserted",
      key: "b1-day1-traumwelt-writing-video",
    }));

    const card = root.querySelector(
      `[${__TESTING__.WRITING_VIDEO_CARD_ATTRIBUTE}]`
    );
    const writingTabs = root.querySelector("[data-writing-tabs]");

    expect(card).not.toBeNull();
    expect(card.nextElementSibling).toBe(writingTabs);
    expect(card).toHaveTextContent("Writing Video · Essay Ideas");
    expect(card).toHaveTextContent("B1 Day 1 · Traumwelt · Writing explanation");
    expect(card.querySelector("iframe")).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/nG1PUrvrS_s"
    );
  });

  test("injects the B1 Day 2 clip only as Teil 2 Schreiben support", () => {
    const root = buildWritingRoot();
    const result = __TESTING__.ensureWritingVideoCard(root, 2);

    expect(result).toEqual(expect.objectContaining({
      mounted: true,
      reason: "inserted",
      key: "b1-day2-freunde-fuers-leben-writing-video",
    }));

    const card = root.querySelector(
      `[${__TESTING__.WRITING_VIDEO_CARD_ATTRIBUTE}]`
    );
    expect(card).toHaveAttribute("aria-label", "B1 writing explanation video");
    expect(card).toHaveAttribute(
      "data-writing-video-key",
      "b1-day2-freunde-fuers-leben-writing-video"
    );
    expect(card).not.toHaveAttribute("data-a1-radio-first-workbook-route");
    expect(card).not.toHaveAttribute("data-requested-lesson-ai-video");
    expect(card).toHaveTextContent("B1 Day 2 · Freunde fürs Leben · Schreiben explanation");
    expect(card.querySelector("iframe")).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/94IXPx5dTNY"
    );
  });

  test("does not duplicate the writing video when React updates the workbook", () => {
    const root = buildWritingRoot();

    __TESTING__.ensureWritingVideoCard(root, 2);
    const result = __TESTING__.ensureWritingVideoCard(root, 2);

    expect(result.reason).toBe("already-mounted");
    expect(
      root.querySelectorAll(`[${__TESTING__.WRITING_VIDEO_CARD_ATTRIBUTE}]`)
    ).toHaveLength(1);
  });

  test("does not inject a card for an unmapped B1 writing assignment", () => {
    const root = buildWritingRoot();

    const result = __TESTING__.ensureWritingVideoCard(root, 3);

    expect(result).toEqual(expect.objectContaining({
      mounted: false,
      reason: "unmapped",
    }));
    expect(
      root.querySelector(`[${__TESTING__.WRITING_VIDEO_CARD_ATTRIBUTE}]`)
    ).toBeNull();
  });
});
