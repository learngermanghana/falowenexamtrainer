import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A1Day2Kapitel11WorkbookPage, {
  DAY_2_GERMAN_ALPHABET_YOUTUBE_URL,
} from "./A1Day2Kapitel11WorkbookPage";

test("uses the Day 2 German Alphabet YouTube lesson for Hören", () => {
  render(
    <MemoryRouter>
      <A1Day2Kapitel11WorkbookPage />
    </MemoryRouter>,
  );

  expect(
    screen.getByRole("link", {
      name: "Open Day 2 German Alphabet Hören on YouTube",
    }),
  ).toHaveAttribute("href", DAY_2_GERMAN_ALPHABET_YOUTUBE_URL);

  expect(screen.queryByText(/Google Drive/i)).not.toBeInTheDocument();
});
