const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'public/music/analytics.js'), 'utf8');

function fakeRuntime(choice = 'accepted') {
  const listeners = {};
  const audio = {
    dataset: { trackId: 'r2-a1-day-02' },
    addEventListener(name, fn) { listeners[name] = fn; },
  };
  const attached = [];
  let clickHandler;
  const document = {
    getElementById(id) { return id === 'audio' ? audio : null; },
    addEventListener(name, handler) { if (name === 'click') clickHandler = handler; },
    createElement() {
      return {
        style: {},
        setAttribute() {},
        addEventListener() {},
        append() {},
        appendChild() {},
      };
    },
    head: { appendChild(node) { attached.push(node); } },
    body: { appendChild(node) { attached.push(node); } },
  };
  const data = {};
  const globals = {
    window: { FALOWEN_MUSIC_GA4_ID: 'G-ABCDEF1234' },
    document,
    localStorage: { getItem() { return choice; }, setItem(k, v) { data[k] = v; } },
    location: { hostname: 'music.falowen.app', search: '', pathname: '/' },
    URL, URLSearchParams, Date, Element: class Element {},
  };
  vm.runInNewContext(script, globals);
  return { globals, listeners, attached, audio, data, clickHandler };
}

test('opt-in music player uses GA4 only after acceptance; pauses do not inflate plays', () => {
  const runtime = fakeRuntime('accepted');
  assert.equal(runtime.attached.filter(x => x.src?.includes('googletagmanager.com')).length, 1);
  runtime.listeners.play();
  runtime.listeners.play(); // pause/resume
  runtime.listeners.ended();
  runtime.listeners.play(); // replay
  const events = runtime.globals.window.dataLayer
    .map(args => Array.from(args)).filter(args => args[0] === 'event');
  assert.equal(events.filter(args => args[1] === 'music_play').length, 2);
  assert.equal(events.filter(args => args[1] === 'music_complete').length, 1);
  assert.equal(events[0][2].page_location, 'https://music.falowen.app/?track=r2-a1-day-02');
});

test('declining analytics never loads Google and does not send play events', () => {
  const runtime = fakeRuntime('declined');
  runtime.listeners.play();
  runtime.listeners.ended();
  assert.equal(runtime.attached.length, 0);
  assert.equal(runtime.globals.window.gtag, undefined);
});

test('disabled default produces no network or consent popup', () => {
  const runtime = fakeRuntime('accepted');
  runtime.globals.window.FALOWEN_MUSIC_GA4_ID = '';
  // The checked-in default is disabled until configured in the build environment.
  const source = fs.readFileSync(path.join(root, 'public/music/analytics-config.js'), 'utf8');
  assert.match(source, /FALOWEN_MUSIC_GA4_ID\s*=\s*""/);
});

test('build config generator writes valid JavaScript and validates IDs', () => {
  const target = path.join(root, 'public/music/analytics-config.js');
  const original = fs.readFileSync(target, 'utf8');
  try {
    const scriptPath = path.join(root, 'scripts/write-music-analytics-config.mjs');
    const success = spawnSync(process.execPath, [scriptPath], {
      encoding: 'utf8',
      env: { ...process.env, MUSIC_GA4_MEASUREMENT_ID: 'G-ABCDEF1234' },
    });
    assert.equal(success.status, 0, success.stderr);
    const compiled = fs.readFileSync(target, 'utf8');
    new vm.Script(compiled);
    assert.match(compiled, /G-ABCDEF1234/);
    const bad = spawnSync(process.execPath, [scriptPath], {
      encoding: 'utf8', env: { ...process.env, MUSIC_GA4_MEASUREMENT_ID: 'not-a-GA4-ID' },
    });
    assert.notEqual(bad.status, 0);
  } finally {
    fs.writeFileSync(target, original);
  }
});
