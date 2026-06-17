import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CourseClassMembersShortcut from "./CourseClassMembersShortcut";

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
    <MemoryRouter initialEntries={["/campus/course"]}>
      <div>
        <button>Course Book</button>
        <button>Class Members</button>
        <CourseClassMembersShortcut />
      </div>
    </MemoryRouter>,
  );

  const oldTab = screen.getByRole("button", { name: "Class Members" });
  await waitFor(() => expect(oldTab).toHaveStyle({ display: "none" }));
  expect(screen.getByRole("button", { name: "View classmates" })).toBeInTheDocument();
});
