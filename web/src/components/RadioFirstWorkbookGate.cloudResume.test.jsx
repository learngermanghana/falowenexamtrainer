import React from "react";
import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate";
import { subscribeLessonResume } from "../services/lessonResumeService";

let mockRemoteChange = null;

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "student-1" } }),
}));

jest.mock("../services/lessonResumeService", () => ({
  subscribeLessonResume: jest.fn(({ onChange }) => {
    mockRemoteChange = onChange;
    return () => {};
  }),
}));

jest.mock("./FalowenRadioTabContent", () => () => (
  <div data-testid="falowen-radio">Falowen Radio</div>
));

const playableRadio = {
  key: "test-radio",
  title: "Test Radio",
  url: "https://example.com/audio",
};

describe("RadioFirstWorkbookGate cloud resume", () => {
  beforeEach(() => {
    mockRemoteChange = null;
    subscribeLessonResume.mockClear();
  });

  test("skips Radio when another device already completed it", () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/lesson/A2/6"]}>
        <RadioFirstWorkbookGate level="A2" day={6} resource={playableRadio}>
          <div>Workbook body</div>
        </RadioFirstWorkbookGate>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("falowen-radio")).toBeInTheDocument();
    expect(subscribeLessonResume).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "student-1",
        level: "A2",
        day: 6,
      }),
    );

    act(() => {
      mockRemoteChange?.({ radioDone: true });
    });

    expect(screen.getByText("Workbook body")).toBeInTheDocument();
    expect(screen.queryByTestId("falowen-radio")).not.toBeInTheDocument();
  });

  test("an explicit view=radio request can still reopen Radio", () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/lesson/A2/6?view=radio&radio=done"]}>
        <RadioFirstWorkbookGate level="A2" day={6} resource={playableRadio}>
          <div>Workbook body</div>
        </RadioFirstWorkbookGate>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("falowen-radio")).toBeInTheDocument();
    expect(screen.queryByText("Workbook body")).not.toBeInTheDocument();
    expect(subscribeLessonResume).not.toHaveBeenCalled();
  });
});
