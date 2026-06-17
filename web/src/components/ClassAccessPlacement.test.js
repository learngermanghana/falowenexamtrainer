import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import HomeClassPreviewCard from "./HomeClassPreviewCard";
import ClassMembersTab from "./ClassMembersTab";

const mockGetDocs = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock("../firebase", () => ({
  collection: jest.fn(() => ({ path: "students" })),
  db: {},
  getDocs: (...args) => mockGetDocs(...args),
  isFirebaseConfigured: true,
  query: jest.fn((...args) => args),
  where: jest.fn((...args) => args),
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    studentProfile: {
      id: "student-1",
      level: "A2",
      className: "A2 Stuttgart Klasse",
      biography: "",
    },
    saveStudentProfile: jest.fn(() => Promise.resolve()),
  }),
}));

beforeEach(() => {
  mockNavigate.mockReset();
  mockGetDocs.mockReset();
  window.history.pushState({}, "", "/");
});

test("home class card shows a member preview without email addresses", async () => {
  mockGetDocs.mockResolvedValue({
    docs: [
      { id: "1", data: () => ({ name: "Ama Mensah", email: "ama@example.com", biography: "I enjoy speaking practice." }) },
      { id: "2", data: () => ({ name: "Kojo Asare", email: "kojo@example.com", biography: "I am preparing for A2." }) },
    ],
  });

  render(
    <MemoryRouter>
      <HomeClassPreviewCard studentProfile={{ level: "A2", className: "A2 Stuttgart Klasse" }} />
    </MemoryRouter>,
  );

  expect(await screen.findByText("2 members")).toBeInTheDocument();
  expect(screen.getByLabelText("Ama Mensah")).toBeInTheDocument();
  expect(screen.queryByText("ama@example.com")).not.toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "View classmates" }));
  expect(mockNavigate).toHaveBeenCalledWith("/campus/discussion");
});

test("self-learning students do not see a live-class preview", () => {
  const { container } = render(
    <MemoryRouter>
      <HomeClassPreviewCard studentProfile={{ level: "B2", className: "B2 Self-learning" }} />
    </MemoryRouter>,
  );

  expect(container).toBeEmptyDOMElement();
  expect(mockGetDocs).not.toHaveBeenCalled();
});

test("Course Book class members area is replaced by a small class link", async () => {
  window.history.pushState({}, "", "/campus/course");

  render(
    <MemoryRouter initialEntries={["/campus/course"]}>
      <ClassMembersTab />
    </MemoryRouter>,
  );

  expect(screen.getByText("Class members have moved")).toBeInTheDocument();
  expect(screen.queryByText("Your class biography")).not.toBeInTheDocument();
  expect(mockGetDocs).not.toHaveBeenCalled();

  await userEvent.click(screen.getByRole("button", { name: "View classmates" }));
  expect(mockNavigate).toHaveBeenCalledWith("/campus/discussion");
});
