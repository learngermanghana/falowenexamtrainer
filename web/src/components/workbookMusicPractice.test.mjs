import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorkbookMusicPracticeTracker } from './workbookMusicPractice.js';

const makeTracker = () => {
  let clock = 0;
  const events = [];
  const tracker = createWorkbookMusicPracticeTracker({
    trackId: 'r2-a2-day-11', title: 'Mit dem Rad', level: 'A2', day: 11,
    now: () => clock,
    send: event => { events.push(event); },
  });
  return { tracker, events, advance: ms => { clock += ms; } };
};

test('playback creates a start, one pause summary and a completion, never a heartbeat', () => {
  const { tracker, events, advance } = makeTracker();
  assert.deepEqual(events, []);
  tracker.timeUpdate(10); // merely rendering a player is not practice
  assert.deepEqual(events, []);
  tracker.play(0);
  advance(22000); tracker.timeUpdate(22);
  tracker.pause(22);
  advance(1000); tracker.play(22);
  advance(70000); tracker.timeUpdate(92);
  tracker.ended(92, 100);
  assert.deepEqual(events.map(event => event.kind), ['start', 'progress', 'complete']);
  assert.equal(events[0].source, 'workbook');
  assert.equal(events[0].day, 11);
  assert.equal(events[1].seconds, 22);
  assert.equal(events[2].seconds, 70); // never double-count pause time
  tracker.play(0);
  assert.equal(events.at(-1).kind, 'start'); // replay is a new session
});

test('repeated pauses do not generate continuous Firestore writes', () => {
  const { tracker, events, advance } = makeTracker();
  tracker.play(0);
  for (let i = 1; i <= 10; i++) {
    advance(20000);
    tracker.timeUpdate(i * 20);
    tracker.pause(i * 20);
    tracker.play(i * 20);
  }
  tracker.ended(200, 210);
  assert.deepEqual(events.map(x => x.kind), ['start', 'progress', 'complete']);
  assert.equal(events.reduce((sum, x) => sum + x.seconds, 0), 200);
});

test('scrubbing to the end does not fabricate listening time or a full listen', () => {
  const { tracker, events, advance } = makeTracker();
  tracker.play(0);
  advance(5000); tracker.seeked(95);
  advance(5000); tracker.timeUpdate(100);
  tracker.ended(100, 100);
  assert.deepEqual(events.map(x => x.kind), ['start']);
});

test('short or invalid music activity does not create progress writes', () => {
  const { tracker, events, advance } = makeTracker();
  tracker.play(0);
  advance(10000); tracker.timeUpdate(10);
  tracker.stop();
  assert.deepEqual(events.map(x => x.kind), ['start']);
  const rejected = [];
  const invalid = createWorkbookMusicPracticeTracker({
    trackId: '../private', title: 'private', send: event => rejected.push(event),
  });
  invalid.play(0); invalid.ended(30, 30);
  assert.deepEqual(rejected, []);
});
