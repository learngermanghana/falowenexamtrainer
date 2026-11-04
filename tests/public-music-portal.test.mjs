import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const config = JSON.parse(read("vercel.json"));
const catalog = JSON.parse(read("web/public/music/catalog.json"));

test("verified music.falowen.app host opens public music site before ordinary student SPA", () => {
  const music = config.routes.findIndex(row => row.src === "/" && row.has?.some(x => x.type === "host" && x.value === "music.falowen.app"));
  const ordinary = config.routes.findIndex(row => row.src === "/" && row.dest === "/index.html");
  assert.ok(music >= 0 && music < ordinary);
  assert.equal(config.routes[music].dest, "/music/index.html");
  assert.ok(!config.routes[music].dest.includes("/api/"));
});

test("music catalog only contains actual approved public URLs, not private course audio", () => {
  assert.ok(Number.isInteger(catalog.version) && catalog.version >= 1);
  assert.ok(catalog.tracks.length > 0);
  for (const track of catalog.tracks) {
    assert.ok(track.id && track.title && track.topic);
    const url = new URL(track.audioUrl);
    assert.equal(url.protocol, "https:");
    assert.doesNotMatch(url.hostname, /r2\.cloudflarestorage\.com/);
    assert.doesNotMatch(url.pathname, /course-media|hoeren|hör|private/i);
    assert.ok(["ALL","A1","A2","B1","B2","C1","C2"].includes(track.level));
  }
});

test("public site has accessible filters, real audio controls, no automatic generation or auth", () => {
  const page = read("web/public/music/index.html");
  const app = read("web/public/music/app.js");
  assert.match(page, /id="search"/);
  assert.match(page, /id="level"/);
  assert.match(page, /id="day"/);
  assert.match(page, /<audio id="audio" controls/);
  assert.match(app, /fetch\("\/music\/catalog.json"/);
  assert.match(app, /Never autoplay on initial load/);
  assert.doesNotMatch(app, /firebase|idToken|generateMusic|innerHTML/);
  assert.match(read("web/public/music/embed.html"), /coursebook/);
});

test("A1 health coursebook can show an optional published song without exposing Hören", () => {
  const page = read("web/src/components/HealthBodyPartsPage.js");
  const component = read("web/src/components/FalowenLessonMusic.jsx");
  assert.match(page, /<FalowenLessonMusic level="A1" day=\{22\} assignmentKey="A1-14.1"/);
  assert.match(component, /if \(!track\) return null/);
  assert.match(component, /song\.coursebook !== false/);
  assert.match(component, /fetch\("\/music\/catalog.json"/);
});

test("selected songs hide the landing hero, and Browse all songs restores it", () => {
  const page = read("web/public/music/index.html");
  const app = read("web/public/music/app.js");
  const styles = read("web/public/music/style.css");
  // The promotional area remains available to visitors browsing the homepage.
  assert.match(page, /class="hero" aria-labelledby="hero-title"/);
  // Opening a song, including a direct shared link or history navigation, hides it.
  assert.match(app, /function showSong\([\s\S]*?document\.body\.classList\.add\("song-detail-open"\)/);
  // Going back to the library puts the promotional homepage back.
  assert.match(app, /function closeDetail\([\s\S]*?document\.body\.classList\.remove\("song-detail-open"\)/);
  assert.match(styles, /body\.song-detail-open \.hero \{ display: none; \}/);
});
