const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const importHandoff = () => import("../public/music/loop-handoff.js");

class FakeAudio extends EventTarget {
  constructor() {
    super();
    this.loop = true;
    this.paused = false;
    this.currentTime = 0;
    this.duration = 180;
  }
  update(time, event = "timeupdate") {
    this.currentTime = time;
    this.dispatchEvent(new Event(event));
  }
}

test("locked iPhone simulation advances at native loop wrap even without an ended event", async () => {
  const { installLoopHandoff } = await importHandoff();
  const audio = new FakeAudio();
  let playing = true, completed = 0, advanced = 0;
  const handoff = installLoopHandoff(audio, {
    isActive: () => playing,
    shouldAdvance: () => true,
    onComplete: () => { completed += 1; },
    onAdvance: () => { advanced += 1; handoff.reset(); },
  });
  audio.update(1);
  audio.update(90);
  audio.update(175);
  audio.update(179.4);
  // WebKit's native loop seeks to 0.1 while staying in the playing state:
  // there is no ended event and no foreground timer to rescue the handoff.
  audio.update(0.1, "seeking");
  audio.update(0.1, "seeked");
  audio.update(0.1, "timeupdate");
  assert.equal(completed, 1);
  assert.equal(advanced, 1);
  playing = false;
});

test("same track repeats while Repeat is checked, without stopping the session", async () => {
  const { installLoopHandoff } = await importHandoff();
  const audio = new FakeAudio();
  let complete = 0, advance = 0, repeatOne = true;
  installLoopHandoff(audio, {
    isActive: () => true,
    shouldAdvance: () => !repeatOne,
    onComplete: () => { complete += 1; },
    onAdvance: () => { advance += 1; },
  });
  for (let cycle = 0; cycle < 2; cycle++) {
    audio.update(5);
    audio.update(176);
    audio.update(179.7);
    audio.update(0.2, "seeking");
  }
  assert.equal(complete, 2);
  assert.equal(advance, 0);
});

test("manual scrubbing from the end to 0 is not mistaken for a completed song", async () => {
  const { installLoopHandoff } = await importHandoff();
  const audio = new FakeAudio();
  let now = 2000, completed = 0;
  installLoopHandoff(audio, {
    isActive: () => true, shouldAdvance: () => true,
    onComplete: () => { completed += 1; }, onAdvance: () => {},
    clock: () => now,
  });
  audio.update(10); audio.update(178);
  audio.dispatchEvent(new Event("pointerdown")); // Native media control interaction.
  audio.update(0, "seeking");
  now += 2000;
  audio.update(0, "seeked");
  assert.equal(completed, 0);
  // Genuine completion on a later listen still works.
  audio.update(10); audio.update(178);
  audio.update(0.15, "timeupdate");
  assert.equal(completed, 1);
});

test("a background time jump without visiting the last seconds must not skip a song", async () => {
  const { installLoopHandoff } = await importHandoff();
  const audio = new FakeAudio();
  let skipped = 0;
  installLoopHandoff(audio, {
    isActive: () => true, shouldAdvance: () => true,
    onComplete: () => {}, onAdvance: () => { skipped += 1; },
  });
  audio.update(60);
  audio.update(0.2, "seeking");
  audio.update(178);
  audio.paused = true; // User deliberately paused on the lock screen.
  audio.update(0.1, "seeking");
  assert.equal(skipped, 0);
});

test("one short or invalid audio duration cannot falsely transition", async () => {
  const { createLoopBoundaryDetector } = await importHandoff();
  const detector = createLoopBoundaryDetector();
  assert.equal(detector.observe(4, NaN), false);
  assert.equal(detector.observe(7, 7), false);
  assert.equal(detector.observe(0, 7), false);
});

test("music player never disables the native loop and rebinds iOS media buttons on playing", () => {
  const app = fs.readFileSync(path.join(root, "public/music/app.js"), "utf8");
  const html = fs.readFileSync(path.join(root, "public/music/index.html"), "utf8");
  assert.match(app, /installLoopHandoff\(audio,/);
  assert.match(app, /syncAudioLoop\(\)/);
  assert.match(app, /iosLoopMode/);
  assert.doesNotMatch(app, /audio\.loop = false/);
  assert.match(app, /audio\.addEventListener\("playing", \(\) => \{[\s\S]*?setupLockScreenControls\(\)/);
  assert.match(app, /audioSession\.type = "playback"/);
  assert.match(app, /onComplete: \(\) => audio\.dispatchEvent\(new Event\("falowen:music-complete"\)\)/);
  assert.match(html, /app\.js\?v=20261102-ios-loop-handoff/);
});
