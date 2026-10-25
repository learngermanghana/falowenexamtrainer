import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { sync, parseFeed, channelIdFromHtml } from './syncPublicYouTubeVideos.mjs';

const id = 'UC' + 'a'.repeat(22);
const feed = '<?xml version="1.0"?>' +
  '<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015"><yt:channelId>' + id + '</yt:channelId>' +
  '<entry><yt:videoId>AbCdEfGhI12</yt:videoId>' +
  '<title>German A1: Time &amp; Dates</title><published>2026-10-23T10:00:00+00:00</published>' +
  '<media:group><media:description>Learn to say &quot;hello&quot; &amp; tell the time.</media:description></media:group></entry>' +
  '<entry><yt:videoId>Qwerty12345</yt:videoId>' +
  '<title>Welcome to our class</title><published>2026-10-22T10:00:00+00:00</published></entry>' +
  '</feed>';

test('resolves public YouTube channel id from handle HTML', () => {
  assert.equal(channelIdFromHtml('<script>{"channelId":"' + id + '"}</script>'), id);
  assert.equal(channelIdFromHtml('<a href="https://www.youtube.com/channel/' + id + '">Channel</a>'), id);
});

test('parses the public feed and rejects a different channel', () => {
  assert.equal(parseFeed(feed, id).length, 2);
  assert.equal(parseFeed(feed, id)[0].title, 'German A1: Time & Dates');
  assert.throws(() => parseFeed(feed, 'UC' + 'b'.repeat(22)), /mismatch/);
});

test('generates safe indexable static watch pages, video sitemap and makes no-op updates idempotent', async (t) => {
  const outputRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'falowen-videos-'));
  t.after(() => fs.rmSync(outputRoot, { recursive: true, force: true }));
  const first = await sync({ feedXml: feed, channelId: id, outputRoot });
  assert.equal(first.count, 1, 'Only educational uploads are featured');
  assert.ok(first.changed >= 4);
  const page = fs.readFileSync(path.join(outputRoot, 'videos', 'AbCdEfGhI12.html'), 'utf8');
  assert.match(page, /<iframe[^>]+src="https:\/\/www.youtube.com\/embed\/AbCdEfGhI12"/);
  assert.match(page, /"@type":"VideoObject"/);
  assert.match(page, /<link rel="canonical" href="https:\/\/www.falowen.app\/videos\/AbCdEfGhI12.html"/);
  assert.match(page, /Time &amp; Dates/);
  const sitemap = fs.readFileSync(path.join(outputRoot, 'sitemap-videos.xml'), 'utf8');
  assert.match(sitemap, /<video:player_loc>https:\/\/www.youtube.com\/embed\/AbCdEfGhI12/);
  assert.doesNotMatch(sitemap, /Qwerty12345/);
  const again = await sync({ feedXml: feed, channelId: id, outputRoot });
  assert.equal(again.changed, 0, 'Identical feed must not trigger a new deployment');
});

test('does not erase previously published pages when YouTube fails', async (t) => {
  const outputRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'falowen-videos-failure-'));
  t.after(() => fs.rmSync(outputRoot, { recursive: true, force: true }));
  await sync({ feedXml: feed, channelId: id, outputRoot });
  const before = fs.readFileSync(path.join(outputRoot, 'videos', 'catalog.json'), 'utf8');
  await assert.rejects(sync({
    channelId: id, outputRoot,
    fetchImpl: async () => ({ ok: false, status: 503, text: async () => '' })
  }), /503/);
  assert.equal(fs.readFileSync(path.join(outputRoot, 'videos', 'catalog.json'), 'utf8'), before);
});

test('unpublishes a cached lesson renamed as paid or unrelated while keeping older entries outside the RSS window', async (t) => {
  const outputRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'falowen-videos-title-filter-'));
  t.after(() => fs.rmSync(outputRoot, { recursive: true, force: true }));

  const olderId = 'LmNoPqRsT12';
  const olderEntry = '<entry><yt:videoId>' + olderId + '</yt:videoId>' +
    '<title>German B1: Grammar Practice</title><published>2026-01-01T10:00:00+00:00</published></entry>';
  const initialFeed = feed.replace('</feed>', olderEntry + '</feed>');
  const initial = await sync({ feedXml: initialFeed, channelId: id, outputRoot });
  assert.equal(initial.count, 2, 'The initial catalogue has both educational videos');

  const watchPath = path.join(outputRoot, 'videos', 'AbCdEfGhI12.html');
  const oldWatchPath = path.join(outputRoot, 'videos', olderId + '.html');
  assert.ok(fs.existsSync(watchPath));
  assert.ok(fs.existsSync(oldWatchPath));

  // Latest feed no longer includes the older video, and renames the newer one to paid content.
  const paidFeed = feed.replace('German A1: Time &amp; Dates', 'German A1 paid class recording');
  const paid = await sync({ feedXml: paidFeed, channelId: id, outputRoot });
  assert.equal(paid.count, 1);
  assert.ok(paid.changed > 0, 'Unpublishing the video must commit changed output');
  assert.equal(fs.existsSync(watchPath), false, 'Formerly public watch page must be deleted');
  assert.ok(fs.existsSync(oldWatchPath), 'Videos beyond the limited RSS window must be preserved');

  const library = fs.readFileSync(path.join(outputRoot, 'videos', 'index.html'), 'utf8');
  const catalog = fs.readFileSync(path.join(outputRoot, 'videos', 'catalog.json'), 'utf8');
  const sitemap = fs.readFileSync(path.join(outputRoot, 'sitemap-videos.xml'), 'utf8');
  for (const text of [library, catalog, sitemap]) {
    assert.doesNotMatch(text, /AbCdEfGhI12/, 'Ineligible video must be removed everywhere');
    assert.match(text, new RegExp(olderId), 'Older eligible video must remain available');
  }

  const noChange = await sync({ feedXml: paidFeed, channelId: id, outputRoot });
  assert.equal(noChange.changed, 0, 'Repeated ineligible title must not trigger another deployment');

  // Reappearing educational videos can be imported, but must be removed again
  // if renamed to a non-educational title without an explicit paid keyword.
  const revived = await sync({ feedXml: feed, channelId: id, outputRoot });
  assert.equal(revived.count, 2);
  assert.ok(fs.existsSync(watchPath));
  const unrelatedFeed = feed.replace('German A1: Time &amp; Dates', 'Weekend event highlights');
  const unrelated = await sync({ feedXml: unrelatedFeed, channelId: id, outputRoot });
  assert.equal(unrelated.count, 1);
  assert.equal(fs.existsSync(watchPath), false);
  assert.doesNotMatch(fs.readFileSync(path.join(outputRoot, 'sitemap-videos.xml'), 'utf8'), /AbCdEfGhI12/);
});
