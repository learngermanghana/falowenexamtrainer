#!/usr/bin/env node
// Register one manually approved song in the public catalog. Never scan R2,
// publish private Hören assets, or assume an R2 upload has been approved.
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const catalogPath = join(root, 'web/public/music/catalog.json');
const learningPath = join(root, 'web/public/music/learning.json');
const templatePath = join(root, 'web/public/music/index.html');
const songsDir = join(root, 'web/public/music/songs');

export function validateApprovedTrack(input) {
  const track = input && typeof input === 'object' ? input : {};
  const { id, title, level, day, assignmentKey, topic, objectKey } = track;
  if (!/^[a-z0-9-]{3,90}$/.test(id || '')) throw Error('Track id must be a unique lower-case URL slug.');
  if (!/^(A1|A2|B1|B2|C1|C2)$/.test(level || '') || !Number.isInteger(day) || day < 1 || day > 31)
    throw Error('Level A1–C2 and an integer day between 1 and 31 are required.');
  if (!new RegExp('^' + level + '-[0-9]+(?:[._][0-9]+)*$').test(assignmentKey || ''))
    throw Error('Use the canonical assignment key, such as A2-7.19.');
  if (![title, topic].every(value => typeof value === 'string' && value.trim().length >= 3 && value.length <= 150))
    throw Error('Title and topic must be meaningful and under 150 characters.');
  const allowedPrefix = 'music/' + level.toLowerCase() + '/day-' + String(day).padStart(2, '0') + '/';
  if (typeof objectKey !== 'string' || !objectKey.startsWith(allowedPrefix)
    || !/^[a-z0-9][a-z0-9-]*\.mp3$/.test(objectKey.slice(allowedPrefix.length)))
    throw Error('The exact approved MP3 object must be under ' + allowedPrefix + ' with a lowercase slug filename.');
  return {
    id, title: title.trim(), level, day, assignmentKey,
    topic: topic.trim(), type: 'Learning story',
    genre: String(track.genre || 'German learning music').slice(0, 70),
    language: String(track.language || 'German').slice(0, 70),
    audioUrl: 'https://www.falowen.app/api/music?track=' + id,
    featured: false, attendance: track.attendance === true,
    coursebook: true, slides: track.slides === true, objectKey, approved: true,
  };
}
const escapeHtml = text => String(text).replace(/[&<>"']/g, ch => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;',
}[ch]));
export function generateSongPage(template, song) {
  const url = 'https://music.falowen.app/music/songs/' + song.id + '.html';
  const description = 'Learn German through ' + song.title + ': '
    + song.level + ' Day ' + song.day + ', ' + song.topic + '. Listen to the approved original song.';
  return template.replace('<body>', '<body data-track="' + song.id + '">')
    .replace('<title>Falowen Music · Learn German through songs</title>',
      '<title>' + escapeHtml(song.title) + ' · Falowen Music</title>')
    .replace(/<meta name="description" content="[^"]*">/,
      '<meta name="description" content="' + escapeHtml(description) + '">')
    .replace('<link rel="canonical" href="https://music.falowen.app/">',
      '<link rel="canonical" href="' + url + '">')
    .replace('<meta property="og:type" content="website">',
      '<meta property="og:type" content="music.song">')
    .replace(/<meta property="og:title" content="[^"]*">/,
      '<meta property="og:title" content="' + escapeHtml(song.title) + ' · Falowen Music">')
    .replace(/<meta property="og:description" content="[^"]*">/,
      '<meta property="og:description" content="' + escapeHtml(description) + '">')
    .replace('<meta property="og:url" content="https://music.falowen.app/">',
      '<meta property="og:url" content="' + url + '">');
}
export function publishApprovedTrack({ catalog, template, input, learning, apply = false }) {
  const track = validateApprovedTrack(input);
  if ((catalog.tracks || []).some(row => row.id === track.id || (row.assignmentKey === track.assignmentKey && row.objectKey === track.objectKey)))
    throw Error('This song is already registered. Do not duplicate existing IDs or audio objects.');
  const ready = learning?.lessons?.[track.id]?.assignmentKey === track.assignmentKey;
  const updated = { ...catalog, version: Math.max(4, Number(catalog.version) + 1 || 4),
    updated: new Date().toISOString().slice(0, 10), tracks: [...catalog.tracks, track] };
  return { track, catalog: updated, html: generateSongPage(template, track), hasReviewedLearningPack: ready, apply };
}
async function main() {
  const args = process.argv.slice(2);
  const fileIndex = args.indexOf('--file');
  if (fileIndex < 0 || !args[fileIndex + 1]) {
    console.error('Usage: node scripts/publishApprovedMusic.mjs --file ./approved-track.json [--apply --audio-reviewed]');
    process.exitCode = 2;
    return;
  }
  const apply = args.includes('--apply');
  if (apply && !args.includes('--audio-reviewed')) {
    console.error('Publishing requires --audio-reviewed: confirm R2 MP3 filename, audio quality, pronunciation, rights and approval first.');
    process.exitCode = 2;
    return;
  }
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
  const learning = JSON.parse(readFileSync(learningPath, 'utf8'));
  const template = readFileSync(templatePath, 'utf8');
  const input = JSON.parse(readFileSync(resolve(args[fileIndex + 1]), 'utf8'));
  const result = publishApprovedTrack({ catalog, learning, template, input, apply });
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', id: result.track.id, 
    objectKey: result.track.objectKey, page: 'https://music.falowen.app/music/songs/' + result.track.id + '.html',
    hasReviewedLearningPack: result.hasReviewedLearningPack,
    note: result.hasReviewedLearningPack
      ? 'Verified lesson pack already exists.'
      : 'Listen-only until final audio and lyrics are compared and learning.json is reviewed.' }, null, 2));
  if (!apply) return;
  mkdirSync(songsDir, { recursive: true });
  const destination = join(songsDir, result.track.id + '.html');
  if (existsSync(destination)) throw Error('A song detail page with this ID already exists.');
  writeFileSync(destination, result.html);
  writeFileSync(catalogPath, JSON.stringify(result.catalog, null, 2) + '\n');
  console.log('Registration written. Review the diff, test the URL, then merge and deploy the learner website. No R2 upload performed.');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
