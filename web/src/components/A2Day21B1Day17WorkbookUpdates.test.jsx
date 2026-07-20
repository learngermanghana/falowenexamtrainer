import React from "react";
import { render, screen } from "@testing-library/react";
import A2Day21EinWochenendePlanenWorkbookPage from "./A2Day21EinWochenendePlanenWorkbookPage";
import { B1_DAY17_WIE_LERNT_MAN_AM_BESTEN_WORKBOOK_CONFIG } from "./B1Day17WieLerntManAmBestenWorkbookPage";

jest.mock("./A2StandardTabbedWorkbookPage", () => function MockA2Workbook({ sprechenContent }) {
  return <main>{sprechenContent}</main>;
});

describe("A2 Day 21 and B1 Day 17 workbook updates", () => {
  test("shows a discussion question and the existing Day 21 interactive brain map", () => {
    render(<A2Day21EinWochenendePlanenWorkbookPage />);

    expect(screen.getByText("Frage für die Diskussion")).toBeInTheDocument();
    expect(
      screen.getByText(/Wie planst du dein ideales Wochenende\?/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Ein Wochenende planen interactive brain map" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Was planst du für das Wochenende?")).toBeInTheDocument();
  });

  test("uses only the approved YouTube video for B1 Day 17 Teil 4 Hören", () => {
    const config = B1_DAY17_WIE_LERNT_MAN_AM_BESTEN_WORKBOOK_CONFIG;
    const { listening, ...nonListeningConfig } = config;

    expect(listening).toEqual(
      expect.objectContaining({
        embedUrl: "https://www.youtube-nocookie.com/embed/NCfwHzAHoJI?rel=0&playsinline=1",
        externalUrl: "https://youtu.be/NCfwHzAHoJI",
      }),
    );
    expect(JSON.stringify(listening)).not.toContain("1p0C0Gz_8d_0y9GHF-4RzqDFTQ89fvpDi");
    expect(JSON.stringify(nonListeningConfig)).not.toContain("NCfwHzAHoJI");
  });
});
