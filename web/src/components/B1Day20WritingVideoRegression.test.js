import { __TESTING__ } from "./B1WorkbookWritingCheatSheetInjector";

const buildWritingRoot = () => {
  const root = document.createElement("div");
  root.innerHTML = `
    <section>
      <h2>Teil 2 · Schreiben (Assignment)</h2>
      <div data-writing-task>Writing task</div>
      <div data-course-inline-practice="writing">Writing workspace</div>
    </section>
  `;
  return root;
};

describe("B1 Day 20 Teil 2 Schreiben video", () => {
  test("injects only the requested video into the Schreiben section", () => {
    const root = buildWritingRoot();
    const result = __TESTING__.ensureWritingVideoCard(root, 20);

    expect(result).toEqual(
      expect.objectContaining({
        mounted: true,
        reason: "inserted",
        key: "b1-day20-beruf-qualifikationen-writing-video",
      }),
    );

    const card = root.querySelector(`[${__TESTING__.WRITING_VIDEO_CARD_ATTRIBUTE}]`);
    const writingWorkspace = root.querySelector('[data-course-inline-practice="writing"]');

    expect(card).not.toBeNull();
    expect(card.nextElementSibling).toBe(writingWorkspace);
    expect(card).toHaveTextContent("B1 Day 20 · Ausbildung und Qualifikationen · Schreiben explanation");
    expect(card.querySelector("iframe")).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/og1iVBKnIb0",
    );
  });
});
