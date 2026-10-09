import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { ExamProvider, useExam } from "./ExamContext";
import { loadPreferredLevel } from "../services/levelStorage";

let mockUser = { uid: "student-b1" };
let mockStudentProfile = { id: "student-b1", level: "B1", className: "B1" };
const mockSaveStudentProfile = jest.fn();

jest.mock("./AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
    studentProfile: mockStudentProfile,
    saveStudentProfile: mockSaveStudentProfile,
  }),
}));

function PracticeLevelControls() {
  const { level, setLevel, accessibleLevels } = useExam();
  return (
    <div>
      <output data-testid="exam-level">{level}</output>
      <output data-testid="allowed-levels">{accessibleLevels.join(",")}</output>
      <button type="button" onClick={() => setLevel("A1")}>Choose A1</button>
      <button type="button" onClick={() => setLevel("A2")}>Choose A2</button>
      <button type="button" onClick={() => setLevel("B1")}>Choose B1</button>
      <button type="button" onClick={() => setLevel("B2")}>Choose B2</button>
    </div>
  );
}

const mount = () => render(
  <ExamProvider><PracticeLevelControls /></ExamProvider>,
);

describe("Exams Room practice level never changes course enrollment", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockUser = { uid: "student-b1" };
    mockStudentProfile = { id: "student-b1", level: "B1", className: "B1" };
    mockSaveStudentProfile.mockClear();
  });

  it("B1 switches among B1, A2 and A1 without saving student profile", () => {
    mount();
    expect(screen.getByTestId("allowed-levels")).toHaveTextContent("A1,A2,B1");
    expect(screen.getByTestId("exam-level")).toHaveTextContent("B1");

    fireEvent.click(screen.getByText("Choose A2"));
    expect(screen.getByTestId("exam-level")).toHaveTextContent("A2");

    fireEvent.click(screen.getByText("Choose A1"));
    expect(screen.getByTestId("exam-level")).toHaveTextContent("A1");
    expect(loadPreferredLevel("student-b1")).toBe("A1");

    fireEvent.click(screen.getByText("Choose B2"));
    expect(screen.getByTestId("exam-level")).toHaveTextContent("A1");
    expect(mockSaveStudentProfile).not.toHaveBeenCalled();
    expect(mockStudentProfile.level).toBe("B1");
  });

  it("A2 may practise A1 but cannot select B1", () => {
    mockStudentProfile = { id: "student-a2", level: "A2" };
    mockUser = { uid: "student-a2" };
    mount();
    expect(screen.getByTestId("allowed-levels")).toHaveTextContent("A1,A2");
    fireEvent.click(screen.getByText("Choose A1"));
    expect(screen.getByTestId("exam-level")).toHaveTextContent("A1");
    fireEvent.click(screen.getByText("Choose B1"));
    expect(screen.getByTestId("exam-level")).toHaveTextContent("A1");
    expect(mockSaveStudentProfile).not.toHaveBeenCalled();
  });

  it("restores each account's own lower preference, not another account's", () => {
    const first = mount();
    fireEvent.click(screen.getByText("Choose A1"));
    first.unmount();

    mount();
    expect(screen.getByTestId("exam-level")).toHaveTextContent("A1");
    expect(loadPreferredLevel("student-b1")).toBe("A1");
  });

  it("shows only A1 to an A1 student", () => {
    mockStudentProfile = { id: "student-a1", level: "A1", className: "A1" };
    mockUser = { uid: "student-a1" };
    mount();
    expect(screen.getByTestId("allowed-levels")).toHaveTextContent("A1");
    fireEvent.click(screen.getByText("Choose A2"));
    expect(screen.getByTestId("exam-level")).toHaveTextContent("A1");
  });

  it("uses the same permitted levels in the exam screen on every section", () => {
    const fs = require("fs");
    const app = fs.readFileSync(require.resolve("../App.js"), "utf8");
    expect(app).toContain('role="group" aria-label="Choose exam practice level"');
    expect(app).toContain("accessibleLevels.map((option)");
    expect(app).toContain("aria-pressed={level === option}");
    expect(app).toContain("if (sampleId) navigate(`/exams/${examSection}`)");
    expect(app).not.toContain('{!sampleId ? (\n          <div\n            className="exam-room-level-picker"');
  });

  it("clamps a stored higher level to the registered student level", () => {
    window.localStorage.setItem("exam-coach-level:student-b1", "C2");
    mount();
    expect(screen.getByTestId("exam-level")).toHaveTextContent("B1");
  });
});
