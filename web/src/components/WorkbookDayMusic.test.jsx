import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import WorkbookDayMusic, { normalizeWorkbookSong } from "./WorkbookDayMusic";
import { A2_B1_WORKBOOK_TABS, B2_C1_WORKBOOK_TABS } from "./StandardWorkbookComponents";
import { getA2B1LessonProfile } from "../data/a2B1LessonProfile";
import { normalizeA2B1SectionView } from "../utils/lessonSectionDeepLinks";

const day18 = {
  id: "a2-day-18-bank", title: "Die Bank anrufen", level: "A2", day: 18,
  assignmentKey: "A2-7.18", coursebook: true, approved: true,
  objectKey: "music/a2/day-18/bank.mp3",
  audioUrl: "https://www.falowen.app/api/music?track=a2-day-18-bank",
};
const day19 = {
  id: "r2-a2-day-19-shopping", title: "Shopping", level: "A2", day: 19,
  coursebook: true, autoDiscovered: true,
  objectKey: "music/a2/day-19/shopping.mp3",
  audioUrl: "https://www.falowen.app/api/music?track=r2-a2-day-19-shopping",
};

const jsonResponse = payload => ({ ok: true, json: async () => payload });
const setFetch = ({ catalog = [day18], discovered = [day18, day19], packs = {},
  translations = [], sidecars = {} } = {}) => {
  global.fetch = jest.fn(url => Promise.resolve(
    jsonResponse(url.includes("catalog.json") ? { tracks: catalog }
      : url.includes("music-library") ? { ok: true, tracks: discovered }
      : url.includes("english-translations") ? { recordings: translations }
      : url.includes("/api/music-lyrics") ? sidecars[new URL(url, "https://www.falowen.app").searchParams.get("track")] || {}
      : { lessons: packs }),
  ));
};

describe("A2/B1 optional Music tab", () => {
  const originalFetch = global.fetch;
  afterEach(() => { global.fetch = originalFetch; jest.restoreAllMocks(); });

  test("replaces Ref label on A2/B1 only and preserves legacy navigation keys", () => {
    expect(A2_B1_WORKBOOK_TABS.find(tab => tab.key === "references")).toEqual({
      key: "references", label: "Music", description: "Optional",
    });
    expect(B2_C1_WORKBOOK_TABS.find(tab => tab.key === "references").label).toBe("Ref");
    expect(normalizeA2B1SectionView("ref")).toBe("references");
    expect(normalizeA2B1SectionView("music")).toBe("references");
    expect(getA2B1LessonProfile("A2", 18).requiredSubmissionParts.every(p => p.sectionKey !== "references")).toBe(true);
    expect(getA2B1LessonProfile("B1", 18).requiredSubmissionParts.every(p => p.sectionKey !== "references")).toBe(true);
  });

  test("A2 day 18 loads exactly its song and approved lyrics, not day 19's song", async () => {
    setFetch({
      catalog: [day18], discovered: [day18, day19],
      packs: { [day18.id]: { assignmentKey: "A2-7.18", lyrics: "[Verse 1]\nIch rufe bei der Bank an." } },
    });
    render(<WorkbookDayMusic level="A2" day={18} workbookId="A2Day18Workbook" />);
    expect(screen.getByText(/NOT AN ASSIGNMENT/)).toBeTruthy();
    expect(screen.getByText(/No answers, submission, AI marking, score/)).toBeTruthy();
    await waitFor(() => expect(screen.getByRole("heading", { name: "Die Bank anrufen" })).toBeTruthy());
    expect(screen.queryByText("Shopping")).toBeNull();
    const audio = document.querySelector("[data-music-audio]");
    expect(audio?.getAttribute("src")).toBe(day18.audioUrl);
    fireEvent.click(screen.getByText("German lyrics · Mitlesen"));
    expect(screen.getByText(/Ich rufe bei der Bank an/)).toBeTruthy();
    expect(screen.getByRole("link", { name: /Open this song/ }).getAttribute("href"))
      .toBe("https://music.falowen.app/music/songs/a2-day-18-bank.html");
    expect(screen.queryByText(/Check answers/)).toBeNull();
  });

  test("B1 day 19 shows only a matching discovered song, without inventing lyrics", async () => {
    const b1 = { ...day19, id: "r2-b1-day-19-speaking", title: "B1 Learning song",
      level: "B1", objectKey: "music/b1/day-19/speaking.mp3",
      audioUrl: "https://www.falowen.app/api/music?track=r2-b1-day-19-speaking" };
    setFetch({ catalog: [], discovered: [day19, b1] });
    render(<WorkbookDayMusic level="B1" day={19} />);
    await waitFor(() => expect(screen.getByRole("heading", { name: "B1 Learning song" })).toBeTruthy());
    expect(screen.getByText(/Reviewed lyrics have not been published/)).toBeTruthy();
    expect(screen.queryByText("Shopping")).toBeNull();
    expect(screen.getByRole("link", { name: /Open this song/ }).getAttribute("href"))
      .toBe("https://music.falowen.app/?track=r2-b1-day-19-speaking");
  });

  test("new R2 Day 9 song keeps native audio compact and reads exact published lyrics", async () => {
    const day9 = {
      id: "r2-a1-day-09-b64_RGVyIGtsZWluZSBIdW5kLm1wMw",
      title: "Der kleine Hund", level: "A1", day: 9, coursebook: true,
      autoDiscovered: true, objectKey: "music/a1/day-09/Der kleine Hund.mp3",
      audioUrl: "https://www.falowen.app/api/music?track=r2-a1-day-09-b64_RGVyIGtsZWluZSBIdW5kLm1wMw",
    };
    setFetch({catalog:[],discovered:[day9]});
    const original = global.fetch;
    global.fetch = jest.fn(url => String(url).includes("/api/music-lyrics")
      ? Promise.resolve(jsonResponse({
          objectKey: day9.objectKey,
          lyrics: "[Verse 1]\\nDer Hund ist hier.\\nIch sehe den Hund.",
          cues: [],
        }))
      : original(url));
    render(<WorkbookDayMusic level="A1" day={9} hideLegacyNotes />);
    await waitFor(() => expect(screen.getByRole("heading", {name:"Der kleine Hund"})).toBeTruthy());
    await waitFor(() => expect(screen.getByText("German lyrics · Mitlesen")).toBeTruthy());
    const card = document.querySelector('[data-workbook-song-card="true"]');
    const audio = document.querySelector('[data-music-audio="true"]');
    expect(card.style.display).toBe("flex");
    expect(card.style.flexDirection).toBe("column");
    expect(audio.style.height).toBe("50px");
    expect(audio.getAttribute("src")).toBe(day9.audioUrl);
    fireEvent.click(screen.getByText("German lyrics · Mitlesen"));
    expect(screen.getByText(/Ich sehe den Hund/)).toBeTruthy();
    expect(document.querySelector('[data-workbook-submission]')).toBeNull();
  });

  test("wrong-object lyric sidecars never appear with an R2 recording", async () => {
    const day9 = {
      id: "r2-a1-day-09-test",title:"Der kleine Hund",level:"A1",day:9,
      coursebook:true,autoDiscovered:true,objectKey:"music/a1/day-09/Der kleine Hund.mp3",
      audioUrl:"https://www.falowen.app/api/music?track=r2-a1-day-09-test",
    };
    setFetch({catalog:[],discovered:[day9]});
    const original=global.fetch;
    global.fetch=jest.fn(url => String(url).includes("/api/music-lyrics")
      ? Promise.resolve(jsonResponse({objectKey:"music/a1/day-08/Other.mp3",lyrics:"Incorrect private words"}))
      : original(url));
    render(<WorkbookDayMusic level="A1" day={9} hideLegacyNotes />);
    await waitFor(() => expect(screen.getByRole("heading", {name:"Der kleine Hund"})).toBeTruthy());
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/music-lyrics?track="), expect.any(Object)));
    expect(screen.queryByText("Incorrect private words")).toBeNull();
    expect(screen.getByText(/Reviewed lyrics have not been published/)).toBeTruthy();
  });


  test.each([["A1",true],["A2",false],["B1",false]])("%s defaults English to the right setting and lets students toggle it", async (level, enabled) => {
    const song={id:"test-song-"+level.toLowerCase(),title:"Learning song",level,day:13,
      assignmentKey:level+"-13",coursebook:true,approved:true,
      objectKey:"music/"+level.toLowerCase()+"/day-13/test.mp3",
      audioUrl:"https://www.falowen.app/api/music?track=test-song-"+level.toLowerCase()};
    const lyrics="[Verse 1]\\nDer Hund ist da.\\nIch sehe den Hund.";
    const pack={objectKey:song.objectKey,lines:[
      {de:"Der Hund ist da.",en:"The dog is here."},
      {de:"Ich sehe den Hund.",en:"I see the dog."},
    ],vocabulary:[{de:"der Hund",en:"the dog"}]};
    setFetch({catalog:[song],discovered:[],translations:[pack],
      sidecars:{[song.id]:{objectKey:song.objectKey,lyrics,cues:[]}}});
    const {container}=render(<WorkbookDayMusic level={level} day={13} hideLegacyNotes />);
    await waitFor(()=>expect(container.querySelectorAll('[data-english-line="true"]').length).toBe(enabled?2:0));
    const input=screen.getByRole("checkbox",{name:"Show English"});
    expect(input.disabled).toBe(false);
    expect(input.checked).toBe(enabled);
    fireEvent.click(input);
    expect(input.checked).toBe(!enabled);
    expect(container.querySelectorAll('[data-english-line="true"]').length).toBe(enabled?0:2);
    expect(screen.getByText("der Hund")).toBeTruthy();
  });

  test("revised MP3 lyrics cannot borrow translation from an older recording",async()=>{
    const song={id:"r2-a1-day-13-test",title:"German song",level:"A1",day:13,
      coursebook:true,autoDiscovered:true,
      objectKey:"music/a1/day-13/new.mp3",
      audioUrl:"https://www.falowen.app/api/music?track=r2-a1-day-13-test"};
    setFetch({catalog:[],discovered:[song],
      translations:[{objectKey:song.objectKey,lines:[{de:"Old German",en:"Old English"}]}],
      sidecars:{[song.id]:{objectKey:song.objectKey,lyrics:"New German",cues:[]}}});
    const {container}=render(<WorkbookDayMusic level="A1" day={13} hideLegacyNotes />);
    await waitFor(()=>expect(screen.getByText("New German")).toBeTruthy());
    expect(screen.getByRole("checkbox",{name:"Show English"}).disabled).toBe(true);
    expect(container.querySelector('[data-english-line]')).toBeNull();
    expect(screen.getByText(/English translation is not available/)).toBeTruthy();
  });

  test("no recording means a gentle empty state, not a full music library", async () => {
    setFetch({ catalog: [day18], discovered: [day19] });
    render(<WorkbookDayMusic level="B1" day={28} />);
    await waitFor(() => expect(screen.getByText(/No song published for B1 Day 28 yet/)).toBeTruthy());
    expect(document.querySelector("[data-music-audio]")).toBeNull();
    expect(document.querySelector("[data-preserved-workbook-notes]")).toBeTruthy();
    expect(screen.queryByText(/Music for every lesson day/)).toBeNull();
  });

  test("private Hören paths and mismatching levels/assignments never appear", () => {
    expect(normalizeWorkbookSong(day19, "A2", 18)).toBeNull();
    expect(normalizeWorkbookSong({ ...day18, objectKey: "a2/day-18/hoeren.mp3", audioUrl: "https://r2.cloudflarestorage.com/x" }, "A2", 18)).toBeNull();
    expect(normalizeWorkbookSong({ ...day18, audioUrl: "https://evil.invalid/test" }, "A2", 18)).toBeNull();
    expect(normalizeWorkbookSong(day18, "A2", 18)).not.toBeNull();
  });
});
