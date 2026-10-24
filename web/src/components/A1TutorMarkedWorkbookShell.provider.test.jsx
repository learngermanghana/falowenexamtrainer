import React from "react";
import { render, screen } from "@testing-library/react";
jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock("./navigation/AppBackButton", () => () => null);
jest.mock("./A1CanonicalSubmissionPanel", () => () => null);
jest.mock("./A1TutorMarkedOverviewGuidance", () => () => null);
jest.mock("./A1TutorDraftSectionCapture", () => () => null);
jest.mock("./A1WorkbookGrammarNotes", () => () => null);
jest.mock("./A1WorkbookMediaPanel", () => () => null);

jest.mock("./A1SharedAssignmentWorkbookLayout", () => {
  const React = require("react");
  const { useA1TutorWorkbookDraft } = require("./A1TutorWorkbookDraftContext");

  const MockLayout = ({ assignmentKey }) => {
    const draft = useA1TutorWorkbookDraft();
    return (
      <div data-testid="draft-provider-probe">
        {assignmentKey}:{draft?.assignmentKey || "NO_PROVIDER"}
      </div>
    );
  };

  const WorkbookSection = ({ children }) => <>{children}</>;

  return {
    __esModule: true,
    default: MockLayout,
    WorkbookSection,
  };
});

import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";

test("page-owned A1-3 still mounts the shared draft provider for Review & Submit", () => {
  render(
    <A1TutorMarkedWorkbookShell fallbackAssignmentKey="A1-3">
      <section><h2>Teil 1 · Preise</h2><p>One</p></section>
      <section><h2>Teil 2 · Familie</h2><p>Two</p></section>
      <section><h2>Teil 3 · Hobbys</h2><p>Three</p></section>
    </A1TutorMarkedWorkbookShell>,
  );

  expect(screen.getByTestId("draft-provider-probe")).toHaveTextContent("A1-3:A1-3");
});
