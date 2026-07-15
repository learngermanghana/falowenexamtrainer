import {
  __private__,
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

  test("extracts approved YouTube IDs and rejects placeholder values", () => {
    expect(extractYouTubeVideoId("https://youtu.be/ZE24QSbGaSo")).toBe("ZE24QSbGaSo");
    expect(extractYouTubeVideoId("https://www.youtube.com/watch?v=ZE24QSbGaSo&feature=share"))
      .toBe("ZE24QSbGaSo");
    expect(extractYouTubeVideoId("https://www.youtube.com/embed/ZE24QSbGaSo"))
      .toBe("ZE24QSbGaSo");
    expect(extractYouTubeVideoId("https://youtu.be/a1-day0-tutorial")).toBe("");
  });

  test("resolves every registered A1 workbook route in workbook context", () => {
    const registeredLessons = __private__.alignedA1Lessons.filter((lesson) => lesson.workbookRoute);
    expect(registeredLessons.length).toBeGreaterThan(20);

    registeredLessons.forEach((lesson) => {
      const route = new URL(lesson.workbookRoute, "https://www.falowen.app");
      if (/^\/campus\/course\/lesson\/A1\/\d+$/i.test(route.pathname)) {
        route.searchParams.set("view", "workbook");
      }
      route.searchParams.set("chapter", lesson.chapter);
      if (lesson.assignmentId) route.searchParams.set("assignmentKey", lesson.assignmentId);

      expect(
        resolveA1WorkbookVideoLesson({
          pathname: route.pathname,
          search: route.search,
        })?.id,
      ).toBe(lesson.id);
    });
  });

  test("uses the dedicated Day 1 AI video instead of the teacher lecture", () => {
    const model = buildA1WorkbookVideoModel({
      pathname: "/campus/course/a1-day-1-greetings-workbook",
      search: "?assignmentKey=A1-0.1&assignmentId=A1-0.1&level=A1&radio=done",
    });

    expect(model).toEqual(
      expect.objectContaining({
        lessonId: "A1-0.1",
        day: 1,
        chapter: "0.1",
        youtubeId: "5WIMkENgdGE",
        sourceUrl: "https://youtu.be/5WIMkENgdGE",
      }),
    );
    expect(model.youtubeId).not.toBe("CqFbBQG9M3U");
  });

  test("resolves a tutor-marked named workbook with its dedicated AI video", () => {
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
        youtubeId: "ZE24QSbGaSo",
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
        youtubeId: "Wkj1-TnNUxY",
      }),
    );
  });

  test("does not embed on the dynamic A1 lesson hub unless view=workbook is explicit", () => {
    expect(
      resolveA1WorkbookVideoLesson({
        pathname: "/campus/course/lesson/A1/1",
        search: "?chapter=0.1",
      }),
    ).toBeNull();

    expect(
      resolveA1WorkbookVideoLesson({
        pathname: "/campus/course/lesson/A1/2",
        search: "?view=workbook&chapter=1.1&assignmentKey=A1-1.1",
      })?.id,
    ).toBe("A1-1.1");

    expect(
      resolveA1WorkbookVideoLesson({
        pathname: "/campus/course/lesson/A1/2",
        search: "?view=grammar&chapter=1.1",
      }),
    ).toBeNull();
  });

  test("removes an existing AI header when navigating from a workbook to the lesson hub", () => {
    buildWorkbookDom();
    expect(
      applyA1WorkbookVideoHeader({
        pathname: "/campus/course/a1-day-1-greetings-workbook",
        search: "?assignmentKey=A1-0.1&radio=done",
      }),
    ).toBe(1);

    expect(
      applyA1WorkbookVideoHeader({
        pathname: "/campus/course/lesson/A1/1",
        search: "?chapter=0.1",
      }),
    ).toBe(0);
    expect(document.querySelector('[data-a1-workbook-video-header="true"]')).toBeNull();
  });

  test("shows a coming-soon card when the workbook has no approved AI video", () => {
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

  test("places the AI video after Back and before the workbook hero without repeating the chapter title", () => {
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
    expect(card).toHaveTextContent("AI lesson video");
    expect(card).not.toHaveTextContent("Kapitel 8");
    expect(card).not.toHaveTextContent("24 Hour Clock");
    expect(card.querySelector("iframe")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/ZE24QSbGaSo",
    );

    expect(
      applyA1WorkbookVideoHeader({
        pathname: "/campus/course/a1-day-12-24-hour-clock-and-dates-workbook",
      }),
    ).toBe(1);
    expect(document.querySelectorAll('[data-a1-workbook-video-header="true"]')).toHaveLength(1);
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

  test("shows only Falowen Radio before Day 1 Continue and the AI video afterwards", () => {
    buildWorkbookDom();
    const gate = document.createElement("div");
    gate.setAttribute("data-radio-first-workbook-gate", "true");
    document.body.appendChild(gate);

    expect(
      applyA1WorkbookVideoHeader({
        pathname: "/campus/course/a1-day-1-greetings-workbook",
        search: "?assignmentKey=A1-0.1&assignmentId=A1-0.1&level=A1",
      }),
    ).toBe(0);
    expect(document.querySelector('[data-a1-workbook-video-header="true"]')).toBeNull();

    gate.remove();
    expect(
      applyA1WorkbookVideoHeader({
        pathname: "/campus/course/a1-day-1-greetings-workbook",
        search: "?assignmentKey=A1-0.1&assignmentId=A1-0.1&level=A1&radio=done",
      }),
    ).toBe(1);
    expect(document.querySelector("iframe")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/5WIMkENgdGE",
    );
  });

  test("still waits for route-scoped Falowen Radio gates", () => {
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
  });
});
