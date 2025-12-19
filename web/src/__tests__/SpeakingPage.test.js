import { render, screen, waitFor } from "@testing-library/react";
import SpeakingPage from "../components/SpeakingPage";

jest.mock("../services/sheetContentService", () => ({
  fetchExamEntries: jest.fn(),
}));

const { fetchExamEntries } = require("../services/sheetContentService");

describe("SpeakingPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows a loading state while fetching exams", () => {
    fetchExamEntries.mockReturnValue(new Promise(() => {}));

    render(<SpeakingPage />);

    expect(screen.getByText(/exams werden geladen/i)).toBeInTheDocument();
  });

  it("renders an error message when fetching exams fails", async () => {
    fetchExamEntries.mockRejectedValue(new Error("API offline"));

    render(<SpeakingPage />);

    await waitFor(() =>
      expect(screen.getByText(/exams konnten nicht geladen werden/i)).toBeInTheDocument()
    );
  });
});
