import {
  applyA1WorkbookVideoHeader,
  buildA1WorkbookVideoModel,
  extractYouTubeVideoId,
  resolveA1WorkbookVideoLesson,
} from "./A1WorkbookVideoHeader";

const buildWorkbookDom = () => {
  document.body.innerHTML = `
    <main class="layout-main">
      <div data-page-root>
        <div data-back-card><a href="/campus/course">Back to Course Book</a></div>
        <section data-hero><h1>Workbook title</h1></section>
        <section><h2>Teil 1</h2><input /></section>
      </div>
    </main>
  `;
};

describe("A1 workbook AI video header", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("extracts approved YouTube IDs from common URL formats", () => {
    expect(extractYouTubeVideoId("https://youtu.be/hLpPFOthVkU")).toBe("hLpPFOthVkU");
    expect(extractYouTubeVideoId("https://www.youtube.com/watch?v=hLpPFOthVkU&feature=share"))
      .toBe("hLpPFOthVkU");
    expect(extractYouTubeVideoId("https://www.youtube.com/embed/hLpPFOthVkU"))
      .toBe("hLpPFOthVkU");
  });

  test("resolves a tutor-marked named workbook from the aligned A1 catalogue", () => {
    const model = buildA1WorkbookVideoModel({
      pathname: "/campus/course/a1-day-12-24-hour-clock-and-dates-workbook",
      search: "?assignmentKey=A1-8&level=A1",
    });

    expect(model).toEqual(
      expect.objectContaining({
        lessonId: "A1-8",
        day: 12,
        chapter: "8",
        title: "24 Hour Clock",
        assessmentLabel: "Tutor-marked assignment",
        youtubeId: "hLpPFOthVkU",
      }),
    );
  });

  test("covers A1 self-practice workbook routes that do not end in workbook", () => {
    const model = buildA1WorkbookVideoModel({
      pathname: "/campus/course/modal-verbs-day-14-3-6",
    });

    expect(model).toEqual(
      expect.objectContaining({
        lessonId: "A1-3.6",
        assessmentLabel: "Self-practice",
        youtubeId: "vMfOb_nPRNc",
      }),
    );
  });

  test("uses chapter and assignment identity on dynamic A1 lesson routes", () => {
    expect(
      resolveA1WorkbookVideoLesson({
        pathname: "/campus/course/lesson/A1/2",
        search: "?chapter=1.1&assignmentKey=A1-1.1",
      })?.id,
    ).toBe("A1-1.1");

    expect(
      resolveA1WorkbookVideoLesson({
        pathname: "/campus/course/lesson/A1/2",
        search: "?view=grammar&chapter=1.1",
      }),
    ).toBeNull();
  });

  test("shows a coming-soon card when the workbook has no approved video", () => {
    buildWorkbookDom();

    expect(
      applyA1WorkbookVideoHeader({
        pathname: "/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook",
        search: "?assignmentKey=A1-10&level=A1",
      }),
    ).toBe(1);

    const card = document.querySelector('[data-a1-workbook-video-header="true"]');
    expect(card).toHaveTextContent("AI lesson video coming soon");
    expect(card.querySelector("iframe")).toBeNull();
  });

  test("places the video after Back and before the workbook hero", () => {
    buildWorkbookDom();

    expect(
      applyA1WorkbookVideoHeader({
        pathname: "/campus/course/a1-day-12-24-hour-clock-and-dates-workbook",
      }),
    ).toBe(1);

    const pageRoot = document.querySelector("[data-page-root]");
    const children = Array.from(pageRoot.children);
    const card = document.querySelector('[data-a1-workbook-video-header="true"]');
    expect(children.indexOf(card)).toBe(1);
    expect(card.nextElementSibling).toHaveAttribute("data-hero");
    expect(card.querySelector("iframe")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/hLpPFOthVkU",
    );
  });

  test("allows the learner to collapse and reopen the video", () => {
    buildWorkbookDom();
    applyA1WorkbookVideoHeader({
      pathname: "/campus/course/a1-day-12-24-hour-clock-and-dates-workbook",
    });

    const card = document.querySelector('[data-a1-workbook-video-header="true"]');
    const button = card.querySelector("button");
    const body = button.parentElement.nextElementSibling;

    button.click();
    expect(button).toHaveTextContent("Show video");
    expect(body.hidden).toBe(true);

    button.click();
    expect(button).toHaveTextContent("Hide video");
    expect(body.hidden).toBe(false);
  });

  test("waits until the Falowen Radio gate is finished", () => {
    buildWorkbookDom();
    const gate = document.createElement("div");
    gate.setAttribute("data-a1-radio-first-workbook-route", "true");
    document.body.appendChild(gate);

    expect(
      applyA1WorkbookVideoHeader({
        pathname: "/campus/course/a1-day-13-revision-numbers-time-and-prices-workbook",
      }),
    ).toBe(0);
    expect(document.querySelector('[data-a1-workbook-video-header="true"]')).toBeNull();

    gate.remove();
    expect(
      applyA1WorkbookVideoHeader({
        pathname: "/campus/course/a1-day-13-revision-numbers-time-and-prices-workbook",
        search: "?radio=done",
      }),
    ).toBe(1);
  });
});
