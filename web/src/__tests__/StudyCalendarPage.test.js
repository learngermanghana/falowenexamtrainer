import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "../i18n";
import StudyCalendarPage from "../components/StudyCalendarPage";

const mockDownloadStudyCalendar = jest.fn();

jest.mock("../services/examCalendar", () => ({
  downloadStudyCalendar: (...args) => mockDownloadStudyCalendar(...args),
}));

jest.mock("../context/ExamContext", () => ({
  useExam: () => ({
    level: "B1",
    setLevel: jest.fn(),
  }),
}));

describe("StudyCalendarPage", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("auto-downloads when opened with force=1 even if a prior download is recorded", async () => {
    localStorage.setItem("falowen_study_calendar_downloaded", "true");

    render(
      <MemoryRouter initialEntries={["/exams/study?force=1"]}>
        <Routes>
          <Route path="/exams/study" element={<StudyCalendarPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockDownloadStudyCalendar).toHaveBeenCalledTimes(1);
    });

    expect(mockDownloadStudyCalendar).toHaveBeenCalledWith(
      expect.objectContaining({
        level: "B1",
        daysOfWeek: [1, 2, 3, 4, 5],
      })
    );
  });
});
