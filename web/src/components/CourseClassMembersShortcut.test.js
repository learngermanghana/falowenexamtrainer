import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CourseClassMembersShortcut from "./CourseClassMembersShortcut";

const mockNavigate = jest.fn();

jest.mock(
  "react-router-dom",
  () => ({
    useLocation: () => ({ pathname: "/campus/course", search: "" }),
    useNavigate: () => mockNavigate,
  }),
  { virtual: true },
);

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    studentProfile: {
      level: "A2",
      className: "A2 Stuttgart Klasse",
    },
  }),
}));

test("hides the old Course Book class tab and shows a compact shortcut", async () => {
  render(
    <div>
      <button>Course Book</button>
      <button>Class Members</button>
      <CourseClassMembersShortcut />
    </div>,
  );

  const oldTab = screen.getByRole("button", { name: "Class Members" });
  await waitFor(() => expect(oldTab).toHaveStyle({ display: "none" }));
  expect(screen.getByRole("button", { name: "View classmates" })).toBeInTheDocument();
});
