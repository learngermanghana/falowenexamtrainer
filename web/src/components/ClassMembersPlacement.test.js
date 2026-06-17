import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NavigationGuide from "./NavigationGuide";
import ClassMembersTab from "./ClassMembersTab";
import ClassDiscussionPage from "./ClassDiscussionPage";
import { fetchClassDirectoryMembers } from "../services/studentDirectory";

let mockPathname = "/";
let mockSearch = "";
const mockNavigate = jest.fn();
const mockSaveStudentProfile = jest.fn(() => Promise.resolve());

jest.mock(
  "react-router-dom",
  () => ({
    useLocation: () => ({ pathname: mockPathname, search: mockSearch }),
    useNavigate: () => mockNavigate,
  }),
  { virtual: true },
);

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    studentProfile: {
      id: "student-1",
      name: "Ama Mensah",
      level: "A2",
      className: "A2 Stuttgart Klasse",
      biography: "I enjoy speaking practice.",
    },
    saveStudentProfile: mockSaveStudentProfile,
  }),
}));

jest.mock("../services/studentDirectory", () => ({
  fetchClassDirectoryMembers: jest.fn(),
}));

beforeEach(() => {
  mockPathname = "/";
  mockSearch = "";
  mockNavigate.mockClear();
  mockSaveStudentProfile.mockClear();
  fetchClassDirectoryMembers.mockResolvedValue([
    {
      id: "student-1",
      name: "Ama Mensah",
      biography: "I enjoy speaking practice.",
      learningGoal: "Pass A2",
      interests: ["Speaking"],
      level: "A2",
      className: "A2 Stuttgart Klasse",
    },
    {
      id: "student-2",
      name: "Kojo Asare",
      biography: "I want to improve grammar.",
      learningGoal: "Speak confidently",
      interests: ["Grammar"],
      level: "A2",
      className: "A2 Stuttgart Klasse",
    },
  ]);
});

test("places the Your Class preview before the Campus and Exams cards", async () => {
  render(
    <main className="layout-main">
      <div data-testid="home-root">
        <section>Welcome back</section>
        <div data-testid="main-access">
          <button>Enter Campus</button>
          <button>Open Exams Room</button>
        </div>
        <details open>
          <NavigationGuide />
        </details>
      </div>
    </main>,
  );

  await screen.findByRole("region", { name: "Your class" });
  expect(screen.getByText("A2 Stuttgart Klasse")).toBeInTheDocument();
  expect(screen.getByText("2 class members")).toBeInTheDocument();

  const homeRoot = screen.getByTestId("home-root");
  const previewHost = homeRoot.querySelector("[data-home-class-members-host]");
  const mainAccess = screen.getByTestId("main-access");
  expect(previewHost).toBeTruthy();
  expect(
    previewHost.compareDocumentPosition(mainAccess) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
});

test("Course Book directory fallback is only a My Class shortcut", () => {
  mockPathname = "/campus/course";
  render(<ClassMembersTab />);

  expect(screen.getByRole("region", { name: "Class members moved" })).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "View classmates in My Class" }),
  ).toBeInTheDocument();
  expect(screen.queryByText("Your class biography")).not.toBeInTheDocument();
});

test("the My Class members link opens the full directory without emails", async () => {
  mockPathname = "/campus/discussion";
  mockSearch = "?tab=members";
  render(<ClassDiscussionPage />);

  await waitFor(() => expect(fetchClassDirectoryMembers).toHaveBeenCalled());
  expect(screen.getByText("Ama Mensah")).toBeInTheDocument();
  expect(screen.getByText("Kojo Asare")).toBeInTheDocument();
  expect(screen.getByText("Your class biography")).toBeInTheDocument();
  expect(screen.queryByText(/@/)).not.toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "Open class discussion" }));
  expect(mockNavigate).toHaveBeenCalledWith("/campus/discussion");
});
