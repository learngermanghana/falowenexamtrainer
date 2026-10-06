import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import A1ProtectedAudioPlayer from "./A1ProtectedAudioPlayer";
import { fetchA1AudioPlaybackUrl } from "../services/a1AudioService";

jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ idToken: "test-token" }) }));
jest.mock("../services/a1AudioService", () => ({ fetchA1AudioPlaybackUrl: jest.fn() }));
beforeEach(() => { jest.clearAllMocks(); });

test.each([12, 17, 21, 22])("Day %i shows the player and loads its signed URL without a click", async (day) => {
  fetchA1AudioPlaybackUrl.mockResolvedValue({ url: `https://audio.example/day-${day}.mp3` });
  render(<A1ProtectedAudioPlayer day={day} audioKey={`a1/day-${day}/day-${day}.mp3`} />);
  const player = screen.getByLabelText(`A1 Day ${day} Hören`);
  expect(player).toHaveAttribute("controls");
  expect(player).not.toHaveAttribute("autoplay");
  await waitFor(() => expect(player).toHaveAttribute("src", `https://audio.example/day-${day}.mp3`));
  expect(fetchA1AudioPlaybackUrl).toHaveBeenCalledWith({ day, key: `a1/day-${day}/day-${day}.mp3`, idToken: "test-token" });
});

test("a failed URL request offers a working retry", async () => {
  fetchA1AudioPlaybackUrl.mockRejectedValueOnce(new Error("Storage unavailable")).mockResolvedValueOnce({ url: "https://audio.example/retry.mp3" });
  render(<A1ProtectedAudioPlayer day={22} audioKey="a1/day-22/day-22.mp3" />);
  expect(await screen.findByRole("alert")).toHaveTextContent("Storage unavailable");
  fireEvent.click(screen.getByRole("button", { name: "Audio erneut laden" }));
  await waitFor(() => expect(screen.getByLabelText("A1 Day 22 Hören")).toHaveAttribute("src", "https://audio.example/retry.mp3"));
});

test("a playback failure refreshes an expired URL once", async () => {
  fetchA1AudioPlaybackUrl.mockResolvedValueOnce({ url: "https://audio.example/expired.mp3" }).mockResolvedValueOnce({ url: "https://audio.example/fresh.mp3" });
  render(<A1ProtectedAudioPlayer day={22} audioKey="a1/day-22/day-22.mp3" />);
  const player = screen.getByLabelText("A1 Day 22 Hören");
  await waitFor(() => expect(player).toHaveAttribute("src", "https://audio.example/expired.mp3"));
  fireEvent.error(player);
  await waitFor(() => expect(player).toHaveAttribute("src", "https://audio.example/fresh.mp3"));
  fireEvent.error(player);
  expect(screen.getByRole("alert")).toHaveTextContent("Bitte laden Sie es erneut");
  expect(fetchA1AudioPlaybackUrl).toHaveBeenCalledTimes(2);
});
