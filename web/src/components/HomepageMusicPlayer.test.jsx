import React from "react";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import HomepageMusicPlayer from "./HomepageMusicPlayer";
import { selectHomepageSongs } from "../lib/homepageMusic";
import catalogue from "../../public/music/catalog.json";
import artwork from "../../public/music/covers/artwork-map.json";
import sources from "../../public/music/covers/photo-sources.json";

let intersect;
let playSpy;
let pauseSpy;
const songs = selectHomepageSongs(catalogue, artwork, sources);

beforeEach(() => {
  global.IntersectionObserver = jest.fn((callback) => {
    intersect = callback;
    return { observe: jest.fn(), disconnect: jest.fn() };
  });
  global.fetch = jest.fn(async (url) => ({ ok: true, json: async () => url.endsWith('catalog.json') ? catalogue : url.endsWith('artwork-map.json') ? artwork : sources }));
  playSpy = jest.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function () {
    Object.defineProperty(this, "paused", { configurable: true, value: false });
    this.dispatchEvent(new Event("play"));
    return Promise.resolve();
  });
  pauseSpy = jest.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(function () {
    Object.defineProperty(this, "paused", { configurable: true, value: true });
    this.dispatchEvent(new Event("pause"));
  });
});
afterEach(() => { cleanup(); jest.restoreAllMocks(); delete global.IntersectionObserver; delete global.fetch; });
async function reveal() {
  act(() => intersect([{ isIntersecting: true }]));
  await screen.findByRole("heading", { name: songs[0].title });
}

test("loads only cached public metadata near the section and leaves audio untouched until a click", async () => {
  const { container } = render(<HomepageMusicPlayer />);
  expect(fetch).not.toHaveBeenCalled();
  expect(container.querySelector("audio")).not.toHaveAttribute("src");
  await reveal();
  expect(fetch).toHaveBeenCalledTimes(3);
  expect(fetch.mock.calls.every(([url]) => url.startsWith("https://music.falowen.app/music/"))).toBe(true);
  expect(container.querySelector("audio")).toHaveAttribute("preload", "none");
  expect(container.querySelector("audio")).not.toHaveAttribute("crossorigin");
  expect(container.querySelector("audio")).not.toHaveAttribute("src");
  expect(playSpy).not.toHaveBeenCalled();
  expect(container.querySelector(".home-music-main-cover img")).toHaveAttribute("src", songs[0].cover);
});

test("plays, pauses and switches songs using a single player, with no additional catalogue requests", async () => {
  const { container } = render(<HomepageMusicPlayer />);
  await reveal();
  const audio = container.querySelector("audio");
  const main = within(container.querySelector(".home-music-now"));
  await act(async () => fireEvent.click(main.getByRole("button", { name: `Play ${songs[0].title}` })));
  expect(audio).toHaveAttribute("src", songs[0].audioUrl);
  expect(main.getByRole("button", { name: `Pause ${songs[0].title}` })).toBeInTheDocument();
  fireEvent.click(main.getByRole("button", { name: `Pause ${songs[0].title}` }));
  expect(main.getByRole("button", { name: `Play ${songs[0].title}` })).toBeInTheDocument();
  await act(async () => fireEvent.click(screen.getByRole("button", { name: `Play ${songs[1].title}` })));
  expect(container.querySelectorAll("audio")).toHaveLength(1);
  expect(audio).toHaveAttribute("src", songs[1].audioUrl);
  expect(fetch).toHaveBeenCalledTimes(3);
  fireEvent.ended(audio);
  expect(main.getByRole("button", { name: `Play ${songs[1].title}` })).toBeInTheDocument();
});

test("keeps a route to listening and lyrics when browser playback fails", async () => {
  render(<HomepageMusicPlayer />);
  await reveal();
  playSpy.mockRejectedValueOnce(new Error("Playback blocked"));
  await act(async () => fireEvent.click(screen.getAllByRole("button", { name: `Play ${songs[0].title}` })[0]));
  expect(screen.getByRole("status")).toHaveTextContent("This song couldn’t play");
  expect(screen.getByRole("link", { name: /Lyrics & more/ })).toHaveAttribute("href", songs[0].songUrl);
});

test("handles metadata failure without breaking the landing section", async () => {
  fetch.mockRejectedValue(new Error("offline"));
  render(<HomepageMusicPlayer />);
  act(() => intersect([{ isIntersecting: true }]));
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Discover the songs"));
  expect(screen.getByRole("link", { name: /Explore all German music/ })).toHaveAttribute("href", "https://music.falowen.app/");
  expect(screen.getByRole("button", { name: "Play" })).toBeDisabled();
});

test.each([["de", "Ein bisschen Deutsch. Ein guter Beat."], ["fr", "Un peu d’allemand. Un bon rythme."]])("localizes the section in %s", (language, title) => {
  render(<HomepageMusicPlayer language={language} />);
  expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
});

test("only selects existing public songs and resolves their art through the music manifests", () => {
  expect(songs).toHaveLength(4);
  expect(selectHomepageSongs({ tracks: [{ ...catalogue.tracks[0], id: songs[0].id, audioUrl: "javascript:alert(1)" }] }, artwork, sources)).toEqual([]);
  expect(selectHomepageSongs({ tracks: [{ ...catalogue.tracks[0], id: songs[0].id, approved: false }] }, artwork, sources)).toEqual([]);
});
