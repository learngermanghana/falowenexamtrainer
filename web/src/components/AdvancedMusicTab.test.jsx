import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AdvancedSelfLearningTabNav } from "./StandardWorkbookComponents";
import { normalizeAdvancedSectionView } from "../utils/lessonSectionDeepLinks";
import catalog from "../../public/music/catalog.json";

jest.mock("./C1StudyPartner", () => () => null);
const song = catalog.tracks.find(track => track.objectKey === "music/c1/day-01/Lernen mit Verstand.mp3");
const mockJson = data => ({ ok: true, json: async () => data });
afterEach(() => jest.restoreAllMocks());

test.each(["B2", "C1", "C2"])("%s offers optional lesson music and retains reference notes", async level => {
  global.fetch = jest.fn(url => Promise.resolve(mockJson(
    String(url).includes("catalog.json") ? { tracks: [song] } :
    String(url).includes("music-library") ? { ok: true, tracks: [] } :
    String(url).includes("english-translations") ? { recordings: [] } : { lessons: {} }
  )));
  const onChange = jest.fn();
  render(<MemoryRouter><AdvancedSelfLearningTabNav level={level} day={1} activeTab="music" onChange={onChange} /></MemoryRouter>);
  expect(screen.getByRole("tab", { name: /Music · Optional/ })).toBeTruthy();
  expect(screen.getByRole("tab", { name: /Ref · Notes/ })).toBeTruthy();
  expect(screen.getByText(/NOT AN ASSIGNMENT/)).toBeTruthy();
  fireEvent.click(screen.getByRole("tab", { name: /Music · Optional/ }));
  expect(onChange).toHaveBeenCalledWith("music");
  if (level === "C1") await waitFor(() => expect(screen.getByRole("heading", { name: "Lernen mit Verstand" })).toBeTruthy());
  else await waitFor(() => expect(screen.getByText(/No song published/)).toBeTruthy());
});

test("advanced music deep links open the music tab", () => {
  expect(normalizeAdvancedSectionView("music")).toBe("music");
  expect(normalizeAdvancedSectionView("ref")).toBe("references");
});
