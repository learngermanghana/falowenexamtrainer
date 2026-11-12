import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { WorkbookTabNav } from "./StandardWorkbookComponents";
import BookPdfDownloadInjector, {
  getA2B1WorkbookExperienceContext,
  getA2B1WorkbookNavigationDestination,
  getPrintableBookKind,
  isPrintableBookRoute,
  needsInlineA1PdfAction,
  SCHOOL_PRINT_STAMP,
} from "./BookPdfDownloadInjector";

jest.mock("./WorkbookSubmissionCaptureRuntime", () => () => null);

describe("BookPdfDownloadInjector helpers", () => {
  it("treats the dedicated A1 Day 15 workbook as printable", () => {
    const pathname = "/campus/course/speaking-exams-intro-4-7";

    expect(getPrintableBookKind(pathname)).toBe("combined");
    expect(needsInlineA1PdfAction(pathname)).toBe(true);
  });

  it.each([
    "/campus/course/two-case-prepositions-wechselpraepositionen-day-18",
    "/campus/course/a1-12-2-dative-articles-mit-bei-zu",
    "/campus/course/letter-writing-intro-german-a1-day-12-3",
  ])("shows the PDF action on special A1 workbook route %s", (pathname) => {
    expect(getPrintableBookKind(pathname, "?view=workbook")).toBe("combined");
    expect(isPrintableBookRoute(pathname, "?view=workbook")).toBe(true);
    expect(needsInlineA1PdfAction(pathname)).toBe(true);
    expect(needsInlineA1PdfAction(`${pathname}/`)).toBe(true);
  });

  it("targets grammar notes and workbook pages only", () => {
    expect(isPrintableBookRoute("/campus/course/a2-day-9-urlaub-workbook")).toBe(true);
    expect(isPrintableBookRoute("/campus/course/a2-day-9-perfekt-grammar-notes")).toBe(true);
    expect(isPrintableBookRoute("/campus/course/german-alphabet-grammar-notes-day-2")).toBe(true);
    expect(isPrintableBookRoute("/campus/course/a2-day-9-urlaub-radio")).toBe(false);
  });

  it.each([
    ["A1", "combined", false],
    ["A2", "combined", false],
    ["B1", "workbook", false],
    ["B2", "combined", true],
    ["C1", "combined", true],
    ["C2", "combined", true],
  ])(
    "supports the printable %s lesson workbook route",
    (level, workbookKind, printsCompleteLesson) => {
      const pathname = `/campus/course/lesson/${level}/12`;
      expect(isPrintableBookRoute(pathname, "?view=workbook")).toBe(true);
      expect(getPrintableBookKind(pathname, "?view=workbook")).toBe(workbookKind);
      expect(getPrintableBookKind(pathname, "?view=grammar")).toBe("grammar");
      expect(isPrintableBookRoute(pathname)).toBe(printsCompleteLesson);
    }
  );

  it("resolves A2 Day 14 from the registered legacy workbook path", () => {
    expect(getA2B1WorkbookExperienceContext("/campus/course/a2-day-14-beruf-und-karriere-workbook")).toMatchObject({
      level: "A2",
      day: 14,
      chapter: "5.14",
    });
  });

  it("resolves canonical B1 workbook routes from the course schedule", () => {
    expect(getA2B1WorkbookExperienceContext("/campus/course/lesson/B1/8", "?view=workbook")).toMatchObject({
      level: "B1",
      day: 8,
    });
    expect(getA2B1WorkbookExperienceContext("/campus/course/lesson/B1/8", "?view=grammar")).toMatchObject({ level: "B1", day: 8 });
    expect(getA2B1WorkbookExperienceContext("/campus/course/lesson/B1/8", "?view=radio")).toBeNull();
  });

  it("opens adjacent A2 workbooks directly and skips the repeated Radio gate", () => {
    expect(getA2B1WorkbookNavigationDestination("A2", 5)).toBe(
      "/campus/course/a2-day-5-freizeit-workbook?radio=done",
    );
  });

  it("keeps B1 on its workbook route while skipping the repeated Radio gate", () => {
    expect(getA2B1WorkbookNavigationDestination("B1", 5)).toBe(
      "/campus/course/lesson/B1/5?view=workbook&radio=done",
    );
  });

  it("keeps A2 Day 14 teacher and AI videos plus navigation, without an individual PDF export", () => {

    render(
      <MemoryRouter initialEntries={["/campus/course/a2-day-14-beruf-und-karriere-workbook"]}>
        <BookPdfDownloadInjector />
      </MemoryRouter>
    );

    expect(screen.getByLabelText("A2 workbook tools")).toBeInTheDocument();
    const overview = screen.getByRole("region", { name: "How to use this lesson" });
    const teacherVideo = screen.getByRole("link", { name: /Watch lesson.*Teacher lecture video/i });
    expect(overview).toHaveTextContent("Music is optional listening practice.");
    expect(overview).toHaveTextContent("Teil 3 · Lesen through the Submit tab");
    expect(overview).not.toHaveTextContent(/Teil 2|Teil 4/);
    expect(overview).toHaveTextContent("Teil 1 · Sprechen is group practice we do together in class.");
    expect(overview.compareDocumentPosition(teacherVideo) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(teacherVideo).toHaveAttribute("href", expect.stringContaining("peuEAMRsFKI"));
    expect(screen.getByRole("link", { name: /Watch grammar explanation.*AI grammar video/i })).toHaveAttribute(
      "href",
      expect.stringContaining("qWy7yMgwmvQ")
    );
    expect(screen.getByRole("progressbar", { name: "Course progress" })).toHaveAttribute("aria-valuenow", "50");
    expect(screen.getByRole("button", { name: "← Previous lesson" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Next lesson →" })).toBeEnabled();

    expect(screen.queryByRole("button", { name: "Download or print workbook PDF" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /View complete A2 book/ })).not.toBeInTheDocument();
  });

  it("preserves the B1 workbook PDF action while the B1 textbook is being prepared", () => {
    const printSpy = jest.spyOn(window, "print").mockImplementation(() => {});
    render(
      <MemoryRouter initialEntries={["/campus/course/lesson/B1/8?view=workbook"]}>
        <BookPdfDownloadInjector />
      </MemoryRouter>
    );
    expect(screen.getByLabelText("B1 workbook tools")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "How to use this lesson" })).toHaveTextContent("Submit");
    fireEvent.click(screen.getByRole("button", { name: "Download or print workbook PDF" }));
    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });

  it("keeps printable lesson metadata without covering Study Buddy with a floating download", () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/lesson/C1/12?view=workbook"]}>
        <BookPdfDownloadInjector />
      </MemoryRouter>
    );

    expect(screen.queryByRole("complementary", { name: "PDF download" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Download PDF" })).not.toBeInTheDocument();
    expect(screen.getByText(SCHOOL_PRINT_STAMP)).toBeInTheDocument();
  });

  it("removes the redundant top PDF action on legacy A1 workbook routes", () => {

    render(
      <MemoryRouter initialEntries={["/campus/course/a1-day-1-greetings-workbook"]}>
        <BookPdfDownloadInjector />
      </MemoryRouter>
    );

    expect(needsInlineA1PdfAction("/campus/course/a1-day-1-greetings-workbook")).toBe(true);
    expect(needsInlineA1PdfAction("/campus/course/a2-day-1-greetings-workbook")).toBe(false);

    expect(screen.queryByRole("button", { name: "Download or print PDF" })).not.toBeInTheDocument();
  });

  it("hides A2 per-section Save PDF actions without hiding B1 section printing", () => {
    const a2 = render(
      <MemoryRouter initialEntries={["/campus/course/a2-day-14-beruf-und-karriere-workbook"]}>
        <WorkbookTabNav activeTab="sprechen" onChange={() => {}} ariaLabel="A2 Day 14 workbook sections" />
      </MemoryRouter>
    );
    expect(screen.getByRole("tablist", { name: "A2 Day 14 workbook sections" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Save .* as PDF/ })).not.toBeInTheDocument();
    a2.unmount();
    render(
      <MemoryRouter initialEntries={["/campus/course/lesson/B1/8?view=workbook"]}>
        <WorkbookTabNav activeTab="sprechen" onChange={() => {}} ariaLabel="B1 Day 8 workbook sections" />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: /Save .* as PDF/ })).toBeInTheDocument();
  });

  it("exposes the school print stamp", () => {
    expect(SCHOOL_PRINT_STAMP).toBe("learn Language Education Academy");
  });
});

  it.each([
    "/campus/course/a2-day-1-small-talk-workbook",
    "/campus/course/a2-day-2-small-talk-workbook",
  ])("uses Day 1 Small Talk metadata and AI video on %s", pathname => {
    const search = "?radio=done&view=submit&level=A2&assignmentKey=A2-1.1&assignmentId=A2-1.1";
    expect(getA2B1WorkbookExperienceContext(pathname, search)).toMatchObject({ level: "A2", day: 1 });
    render(<MemoryRouter initialEntries={[pathname + search]}><BookPdfDownloadInjector /></MemoryRouter>);
    expect(document.querySelector('a[href*="HMEs3mEKdrk"]')).not.toBeNull();
    expect(document.querySelector('a[href*="AxSh8t71Jlo"]')).toBeNull();
  });
