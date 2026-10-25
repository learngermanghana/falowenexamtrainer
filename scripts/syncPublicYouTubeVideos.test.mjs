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
