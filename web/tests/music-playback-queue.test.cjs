const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const tracks = [
  { id: 'a', title: 'Song A' },
  { id: 'b', title: 'Song B' },
  { id: 'c', title: 'Song C' },
];

async function queueModule() {
  return import('../public/music/playback-queue.js');
}

test('all-song queue preserves all tracks and does not mutate catalog on shuffle', async () => {
  const { buildPlaybackQueue } = await queueModule();
  const before = [...tracks];
  const queue = buildPlaybackQueue(tracks, 'a', true, () => 0);
  assert.equal(queue.length, 3);
  assert.deepEqual(queue.map(track => track.id).sort(), ['a', 'b', 'c']);
  assert.equal(queue[0].id, 'a');
  assert.deepEqual(tracks, before);
});

test('shuffle cycle never immediately replays the finished last song', async () => {
  const { advancePlaybackQueue } = await queueModule();
  const advanced = advancePlaybackQueue(tracks, 'c', 1, true, () => 0);
  assert.equal(advanced.queue.length, 3);
  assert.equal(advanced.queue[0].id, 'c');
  assert.notEqual(advanced.track.id, 'c');
});

test('non-shuffled next/previous controls wrap across all songs', async () => {
  const { advancePlaybackQueue } = await queueModule();
  assert.equal(advancePlaybackQueue(tracks, 'c', 1).track.id, 'a');
  assert.equal(advancePlaybackQueue(tracks, 'a', -1).track.id, 'c');
});

test('a one-song playlist can replay after ended rather than stop', async () => {
  const { advancePlaybackQueue } = await queueModule();
  assert.equal(advancePlaybackQueue([tracks[0]], 'a', 1, true).track.id, 'a');
});

test('a stale current track ID does not break playback after library refresh', async () => {
  const { advancePlaybackQueue } = await queueModule();
  assert.equal(advancePlaybackQueue(tracks, 'retired-id', 1).track.id, 'a');
  assert.equal(advancePlaybackQueue(tracks, 'retired-id', -1).track.id, 'c');
});

test('the music page wires all-song shuffle and platform media controls', () => {
  const app = fs.readFileSync(path.join(root, 'public/music/app.js'), 'utf8');
  const html = fs.readFileSync(path.join(root, 'public/music/index.html'), 'utf8');
  assert.match(app, /queueScope = "all"/);
  assert.match(app, /advancePlaybackQueue\(playbackQueue/);
  assert.match(app, /session\.setActionHandler\(action, handler\)/);
  assert.match(app, /audio\.addEventListener\("ended"/);
  assert.match(app, /audio\.addEventListener\("error", \(\) => handlePlaybackFailure/);
  assert.match(html, /id="queue-scope"/);
  assert.match(html, /id="play-all"/);
  assert.match(html, /app\.js\?v=20261101-lockscreen-playback/);
});
