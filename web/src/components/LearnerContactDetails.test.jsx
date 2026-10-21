import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LearnerContactDetails from "./LearnerContactDetails";
const mockSave = jest.fn();
const mockProfile = { name: "Test Learner" };
jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ studentProfile: mockProfile, saveStudentProfile: mockSave }) }));
beforeEach(() => { mockSave.mockReset().mockResolvedValue({}); });
it("lets a learner defer details without writing a profile", () => {
  render(<LearnerContactDetails reminder />);
  fireEvent.click(screen.getByRole("button", { name: "Add later" }));
  expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  expect(mockSave).not.toHaveBeenCalled();
});
it("saves emergency contact details without requiring an address", async () => {
  render(<LearnerContactDetails />);
  fireEvent.change(screen.getByLabelText("Emergency contact name"), { target: { value: " Ama Mensah " } });
  fireEvent.change(screen.getByLabelText("Emergency contact phone"), { target: { value: "+233 24 123 4567" } });
  fireEvent.click(screen.getByRole("button", { name: "Save contact details" }));
  await waitFor(() => expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({ emergencyContactName: "Ama Mensah", emergencyContactPhone: "+233241234567", address: "" })));
  expect(await screen.findByRole("status")).toHaveTextContent("Contact details saved");
});
it("keeps the form available when saving fails", async () => {
  mockSave.mockRejectedValueOnce(new Error("offline"));
  render(<LearnerContactDetails />);
  fireEvent.click(screen.getByRole("button", { name: "Save contact details" }));
  expect(await screen.findByRole("status")).toHaveTextContent("Could not save");
  expect(screen.getByRole("button", { name: "Save contact details" })).toBeEnabled();
});
