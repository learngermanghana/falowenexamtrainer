import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A1Day2Kapitel11WorkbookPage from "./A1Day2Kapitel11WorkbookPage";

const KAPITEL_1_1_HOREN_GOOGLE_DRIVE_URL =
  "https://drive.google.com/file/d/1GfxXLlzz_MWKtY1MgbYaVw3F3mZvW7xx/view?usp=sharing";

test("uses the Kapitel 1.1 Google Drive Hören material", () => {
  render(
    <MemoryRouter>
      <A1Day2Kapitel11WorkbookPage />
    </MemoryRouter>,
  );

  expect(screen.getByText(/Listen to the audio and answer the questions below/i)).toBeInTheDocument();
  expect(
    screen.getByRole("link", {
      name: "Open Hören Material (Google Drive)",
    }),
  ).toHaveAttribute("href", KAPITEL_1_1_HOREN_GOOGLE_DRIVE_URL);

  expect(screen.queryByTitle("Day 2 German Alphabet Hören video")).not.toBeInTheDocument();
});
