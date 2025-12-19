import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PlacementCheck from "../components/PlacementCheck";

jest.mock("../services/coachService", () => ({
  startPlacement: jest.fn(),
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "user-123" }, idToken: "token-abc" }),
}));

const { startPlacement } = require("../services/coachService");

describe("PlacementCheck", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state while submitting answers", () => {
    startPlacement.mockReturnValue(new Promise(() => {}));

    render(<PlacementCheck />);

    const submitButton = screen.getByRole("button", { name: /check level/i });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/checking/i)).toBeInTheDocument();
  });

  it("renders an error banner when the request fails", async () => {
    startPlacement.mockRejectedValue(new Error("Network failed"));

    render(<PlacementCheck />);

    fireEvent.click(screen.getByRole("button", { name: /check level/i }));

    await waitFor(() =>
      expect(screen.getByText(/could not run placement\./i)).toBeInTheDocument()
    );
  });
});
