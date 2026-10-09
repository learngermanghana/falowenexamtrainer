import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A2Day2PersonenBeschreibenWorkbookPage from "./A2Day2PersonenBeschreibenWorkbookPage";

describe("A2 Day 2 grammar notes remain reachable", () => {
  it("loads the original adjective-ending lesson on a direct Grammar link", async () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/a2-day-2-personen-beschreiben-workbook?assignmentKey=A2-1.2&assignmentId=A2-1.2&level=A2&radio=done&view=grammar"]}>
        <A2Day2PersonenBeschreibenWorkbookPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole("tab", { name: /Grammar/ })).toBeInTheDocument();
    expect(await screen.findByText(/Adjektivendungen nach ein\/eine/)).toBeInTheDocument();
    expect(screen.getByText(/Das ist ein großer Mann/)).toBeInTheDocument();
  });
});
