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
        "/campus/course/b1-day-4-wohnung-suchen-workbook",
        "?assignmentKey=B1-2.4&assignmentId=B1-2.4&level=B1&radio=done"
      )
    ).toBe(true);
    expect(
      __TESTING__.getB1WorkbookDay(
        "/campus/course/b1-day-4-wohnung-suchen-workbook"
      )
    ).toBe(4);
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
    ).toBe(true);
  });

  test("supports standalone B1 Day 21 workbook routes when they are rendered", () => {
    expect(
      __TESTING__.isB1WorkbookRoute(
        "/campus/course/b1-day-21-lebensformen-heute-workbook",
        ""
      )
    ).toBe(true);
  });

  test("B1 cheat sheet content exists for workbook days", () => {
    expect(getWritingCheatSheet("B1", 1).length).toBeGreaterThan(0);
    expect(getWritingCheatSheet("B1", 1)[0].items.length).toBeGreaterThan(0);
  });

  test("adds an always-visible fallback cheat sheet and inserts all three template types", () => {
    const root = buildWritingRoot();
    const textarea = document.createElement("textarea");
    root.querySelector("section").appendChild(textarea);

    expect(__TESTING__.ensureWritingCheatSheet(root)).toEqual({ mounted: true, reason: "inserted" });
    const card = root.querySelector(`[${__TESTING__.WRITING_CHEAT_SHEET_ATTRIBUTE}]`);
    expect(card).toHaveTextContent("B1 Writing Cheat Sheet");

    const buttons = Array.from(card.querySelectorAll("button"));
    expect(buttons.map((button) => button.textContent)).toEqual([
      "Insert Opinion Essay Template",
      "Insert Formal Letter Template",
      "Insert Informal Letter Template",
    ]);
    buttons.forEach((button) => button.click());
    expect(textarea.value).toContain("Heutzutage ist das Thema");
    expect(textarea.value).toContain("Sehr geehrte Damen und Herren");
    expect(textarea.value).toContain("Liebe/r [Name]");
  });

  test("does not duplicate the React-owned B1 cheat sheet", () => {
    const root = buildWritingRoot();
    const owned = document.createElement("div");
    owned.setAttribute("data-b1-writing-cheat-sheet", "always-visible");
    root.querySelector("section").appendChild(owned);

    expect(__TESTING__.ensureWritingCheatSheet(root)).toEqual({ mounted: true, reason: "react-owned" });
    expect(root.querySelector(`[${__TESTING__.WRITING_CHEAT_SHEET_ATTRIBUTE}]`)).toBeNull();
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

  test("injects the requested B1 Day 3 Schreiben video", () => {
    const root = buildWritingRoot();
    const result = __TESTING__.ensureWritingVideoCard(root, 3);

    expect(result).toEqual(expect.objectContaining({
      mounted: true,
      reason: "inserted",
      key: "b1-day3-erfolgsgeschichten-writing-video",
    }));

    const card = root.querySelector(
      `[${__TESTING__.WRITING_VIDEO_CARD_ATTRIBUTE}]`
    );
    expect(card).toHaveTextContent("B1 Day 3 · Erfolgsgeschichten · Schreiben explanation");
    expect(card.querySelector("iframe")).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/8uAMihJTzvo"
    );
  });

  test("injects the requested B1 Day 4 Wohnung suchen Schreiben video", () => {
    const root = buildWritingRoot();
    const result = __TESTING__.ensureWritingVideoCard(root, 4);

    expect(result).toEqual(expect.objectContaining({
      mounted: true,
      reason: "inserted",
      key: "b1-day4-wohnung-suchen-writing-video",
    }));

    const card = root.querySelector(
      `[${__TESTING__.WRITING_VIDEO_CARD_ATTRIBUTE}]`
    );
    expect(card).toHaveTextContent("B1 Day 4 · Wohnung suchen · Schreiben explanation");
    expect(card.querySelector("iframe")).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/mHQiEdVVRSQ"
    );
  });

  test("injects the requested B1 Day 5 Besichtigungstermin Schreiben video", () => {
    const root = buildWritingRoot();
    const result = __TESTING__.ensureWritingVideoCard(root, 5);

    expect(result).toEqual(expect.objectContaining({
      mounted: true,
      reason: "inserted",
      key: "b1-day5-besichtigungstermin-writing-video",
    }));

    const card = root.querySelector(
      `[${__TESTING__.WRITING_VIDEO_CARD_ATTRIBUTE}]`
    );
    expect(card).toHaveTextContent("B1 Day 5 · Der Besichtigungstermin · Schreiben explanation");
    expect(card.querySelector("iframe")).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/n1whPCP2KzA"
    );
  });

  test("keeps the requested B1 Day 7 mapping as a legacy fallback", () => {
    const root = buildWritingRoot();
    const result = __TESTING__.ensureWritingVideoCard(root, 7);

    expect(result).toEqual(expect.objectContaining({
      mounted: true,
      reason: "inserted",
      key: "b1-day7-fast-food-hausmannskost-writing-video",
    }));
    expect(root.querySelector("iframe")).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/oGOn3zKpNjo"
    );
  });

  test("does not duplicate a video owned by the restored React B1 writing workspace", () => {
    const root = buildWritingRoot();
    const writingSection = __TESTING__.findWritingSection(root);
    const reactOwnedCard = document.createElement("section");
    reactOwnedCard.setAttribute("data-writing-video-support", "true");
    reactOwnedCard.textContent = "React-owned B1 Day 7 writing video";
    writingSection.appendChild(reactOwnedCard);

    const result = __TESTING__.ensureWritingVideoCard(root, 7);

    expect(result).toEqual(expect.objectContaining({
      mounted: true,
      reason: "react-owned",
      key: "b1-day7-fast-food-hausmannskost-writing-video",
    }));
    expect(
      root.querySelector(`[${__TESTING__.WRITING_VIDEO_CARD_ATTRIBUTE}]`)
    ).toBeNull();
    expect(root.querySelectorAll(__TESTING__.REACT_WRITING_VIDEO_SELECTOR)).toHaveLength(1);
  });

  test("removes a legacy injected card after the React writing workspace takes ownership", () => {
    const root = buildWritingRoot();
    __TESTING__.ensureWritingVideoCard(root, 7);
    expect(root.querySelector(`[${__TESTING__.WRITING_VIDEO_CARD_ATTRIBUTE}]`)).not.toBeNull();

    const writingSection = __TESTING__.findWritingSection(root);
    const reactOwnedCard = document.createElement("section");
    reactOwnedCard.setAttribute("data-writing-video-support", "true");
    writingSection.appendChild(reactOwnedCard);

    const result = __TESTING__.ensureWritingVideoCard(root, 7);
    expect(result.reason).toBe("react-owned");
    expect(root.querySelector(`[${__TESTING__.WRITING_VIDEO_CARD_ATTRIBUTE}]`)).toBeNull();
  });

  test("does not duplicate the legacy writing video when React updates an older workbook", () => {
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

    const result = __TESTING__.ensureWritingVideoCard(root, 9);

    expect(result).toEqual(expect.objectContaining({
      mounted: false,
      reason: "unmapped",
    }));
    expect(
      root.querySelector(`[${__TESTING__.WRITING_VIDEO_CARD_ATTRIBUTE}]`)
    ).toBeNull();
  });
});
