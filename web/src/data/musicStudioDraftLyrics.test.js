import fs from "fs";
import path from "path";
import { createRequire } from "module";

const requireNode = createRequire(import.meta.url);
const { validateLyrics } = requireNode("../../../server/musicLyrics.cjs");
const read = file => fs.readFileSync(path.resolve(process.cwd(),file),"utf8");

describe("Falowen Music studio lyrics for published R2 tracks", () => {
  test("shares all 84 original Admin drafts as visibly unverified reference texts", () => {
    const drafts=JSON.parse(read("public/music/studio-drafts.json"));
    expect(drafts.tracks).toHaveLength(84);
    const day13=drafts.tracks.filter(entry=>entry.level==="A1"&&entry.day===13);
    expect(day13).toHaveLength(1);
    expect(day13[0]).toMatchObject({assignmentKey:"A1-3.5",title:"Die Rechnung im Café"});
    expect(day13[0].lyrics).toContain("Zwei Tees, vier Euro");
    expect(drafts.source).toMatch(/NOT verified/);
  });
  test("public player prefers exact published lyrics and labels fallback as draft", () => {
    const app=read("public/music/app.js");
    expect(app).toContain("studio-drafts.json");
    expect(app).toContain("referenceLyricsFor(track)");
    expect(app).toContain("publishedLyrics.get(track.id) ||");
    expect(app).toContain("COURSE DRAFT");
    expect(app).toContain("not verified against this MP3");
    expect(app).toContain("renderLyrics");
  });
  test("reviewed untimed song sidecars can display text without false cue highlighting", () => {
    const key="music/a1/day-13/zwei-tees-vier-euro.mp3";
    const untimed={objectKey:key,lyrics:"[Verse]\nZwei Tees, vier Euro\nDanke schön",cues:[]};
    expect(validateLyrics(untimed,key)).toEqual(untimed);
    expect(validateLyrics({...untimed,objectKey:"music/a1/day-14/wrong.mp3"},key)).toBeNull();
    expect(validateLyrics({...untimed,cues:[{start:1,text:"wrong"}]},key)).toBeNull();
    expect(validateLyrics({...untimed,lyrics:""},key)).toBeNull();
  });
});
