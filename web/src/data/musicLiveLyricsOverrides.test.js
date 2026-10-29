import fs from "fs";
import path from "path";
const read = file => fs.readFileSync(path.resolve(process.cwd(),file),"utf8");

describe("Music Studio live lyric overwrites",()=>{
  test("public music fetches only the selected lesson override, never scans all lyrics",()=>{
    const app=read("public/music/app.js");
    expect(app).toContain("music-studio/public-lyrics");
    expect(app).toContain("assignmentKey=");
    expect(app).toContain("studioLyricsRequests.has(key)");
    expect(app).toContain("loadSavedStudioLyrics(track)");
    expect(app).not.toContain("music-studio/lyrics?"); // owner-only route must not be used
  });
  test("published recording sidecars remain the highest-priority source and drafts are labeled",()=>{
    const app=read("public/music/app.js");
    expect(app).toContain("publishedLyrics.get(track.id)");
    expect(app).toContain("savedStudioLyrics.get(");
    expect(app).toContain("referenceOnly:true");
    expect(app).toContain("COURSE DRAFT");
    expect(app).toContain("currentLyricPack(track)");
  });
  test("the static songbook remains available when no saved override exists",()=>{
    const app=read("public/music/app.js");
    const data=JSON.parse(read("public/music/studio-drafts.json"));
    expect(data.tracks).toHaveLength(84);
    expect(app).toContain('learning[track.id] || referenceLyricsFor(track)');
  });
});
