import React, { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import {
  A2_B1_WORKBOOK_TABS_WITH_GRAMMAR,
  AdvancedSelfLearningTabNav,
  STANDARD_WORKBOOK_TABS,
  WorkbookTabNav,
} from "./StandardWorkbookComponents";
import {
  mergeLessonSearchIntoRoute,
  normalizeA1SectionView,
  normalizeA2B1SectionView,
  normalizeAdvancedSectionView,
} from "../utils/lessonSectionDeepLinks";

const LocationProbe = () => {
  const location = useLocation();
  return <output data-testid="location-search">{location.search}</output>;
};

const StatefulWorkbookNav = ({ ariaLabel, tabs = A2_B1_WORKBOOK_TABS_WITH_GRAMMAR, initial = "sprechen" }) => {
  const [active, setActive] = useState(initial);
  return (
    <>
      <WorkbookTabNav
        activeTab={active}
        onChange={setActive}
        tabs={tabs}
        ariaLabel={ariaLabel}
        renderLegacyGrammarPanel={false}
      />
      <output data-testid="active-workbook-tab">{active}</output>
      <LocationProbe />
    </>
  );
};

const StatefulAdvancedNav = ({ day = 16 }) => {
  const [active, setActive] = useState("learn");
  return (
    <>
      <AdvancedSelfLearningTabNav level="C1" day={day} activeTab={active} onChange={setActive} />
      <output data-testid="active-advanced-tab">{active}</output>
      <LocationProbe />
    </>
  );
};

describe("universal lesson section deep links", () => {
  test("normalizes common learner wording into canonical section keys", () => {
    expect(normalizeA2B1SectionView("Hören")).toBe("hoeren");
    expect(normalizeA2B1SectionView("writing")).toBe("schreiben");
    expect(normalizeAdvancedSectionView("grammar")).toBe("learn");
    expect(normalizeAdvancedSectionView("speaking")).toBe("speak");
    expect(normalizeA1SectionView("Review & Submit")).toBe("submit");
  });

  test("merges a requested section into a configured workbook route without losing Radio state", () => {
    expect(
      mergeLessonSearchIntoRoute(
        "/campus/course/a2-day-6-moebel-und-raeume-workbook",
        "?chapter=3.6&view=hoeren&radio=done",
        { dropKeys: ["chapter"] },
      ),
    ).toBe("/campus/course/a2-day-6-moebel-und-raeume-workbook?view=hoeren&radio=done");
  });

  test("opens an A2 Hören deep link in Teil 4", async () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/a2-day-6-moebel-und-raeume-workbook?view=hoeren&radio=done"]}>
        <StatefulWorkbookNav ariaLabel="A2 Day 6 workbook sections" />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByTestId("active-workbook-tab")).toHaveTextContent("hoeren"));
    expect(screen.getByRole("tab", { name: "Teil 4" })).toHaveAttribute("aria-selected", "true");
  });

  test("does not expose a Hören deep link on A2 Day 14", () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/a2-day-14-beruf-und-karriere-workbook?view=hoeren&radio=done"]}>
        <StatefulWorkbookNav ariaLabel="A2 Day 14 workbook sections" tabs={STANDARD_WORKBOOK_TABS} />
      </MemoryRouter>,
    );

    expect(screen.queryByRole("tab", { name: "Teil 4" })).not.toBeInTheDocument();
  });

  test("opens C1 Write from view=write and keeps clicked tabs in the URL", async () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/lesson/C1/16?view=write&radio=done"]}>
        <StatefulAdvancedNav day={16} />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByTestId("active-advanced-tab")).toHaveTextContent("write"));
    expect(screen.getByRole("tab", { name: "Write" })).toHaveAttribute("aria-selected", "true");

    fireEvent.click(screen.getByRole("tab", { name: "Speak" }));

    await waitFor(() => {
      expect(screen.getByTestId("active-advanced-tab")).toHaveTextContent("speak");
      expect(screen.getByTestId("location-search")).toHaveTextContent("view=speak");
      expect(screen.getByTestId("location-search")).toHaveTextContent("radio=done");
    });
  });
});
