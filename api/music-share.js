// Serve the same listening room with crawler-readable, recording-specific metadata.
// Resolves public music IDs locally: no R2 list, signed URLs, auth or paid calls.
const fs = require('node:fs');
const path = require('node:path');
const catalog = require('../web/public/music/catalog.json');
const swahili = require('../web/public/music/swahili-catalog.json');
const artwork = require('../web/public/music/covers/artwork-map.json');
const sources = require('../web/public/music/covers/photo-sources.json');
const {musicKeyFromAutoId, musicTrackFromKey} = require('../server/musicDiscovery.cjs');
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let template;
module.exports = function musicShare(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).end();
  }
  const id = typeof req.query?.track === 'string' ? req.query.track : '';
  if (!/^[A-Za-z0-9_-]{1,245}$/.test(id)) return res.status(404).end('Song not found');
  const key = musicKeyFromAutoId(id);
  const track = [...catalog.tracks, ...swahili.tracks].find(row => row.id === id && row.retired !== true) || (key && musicTrackFromKey(key));
  if (!track) return res.status(404).end('Song not found');
  const title = escapeHtml(track.title + ' · Falowen Music');
  const description = escapeHtml('Listen to ' + track.title + ' on Falowen Music. ' + (track.language === 'Swahili' ? 'Swahili' : 'German') + ' songs' + (track.level !== 'ALL' ? ' · ' + track.level + ' · Day ' + track.day : ' for every level') + '.');
  const canonical = 'https://music.falowen.app/song/' + encodeURIComponent(id);
  const theme = artwork.byObjectKey[track.objectKey] || artwork.byTrackId[id] || artwork.default;
  const image = 'https://music.falowen.app' + sources[theme].path;
  template ||= fs.readFileSync(path.join(__dirname, '../web/public/music/index.html'), 'utf8');
  const html = template.replace('<body>', '<body data-track="' + escapeHtml(id) + '">')
    .replace(/<title>[^<]*<\/title>/, '<title>' + title + '</title>')
    .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + description + '">')
    .replace(/<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + canonical + '">')
    .replace(/<meta property="og:type" content="[^"]*">/, '<meta property="og:type" content="music.song">')
    .replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + title + '">')
    .replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + description + '">')
    .replace(/<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="' + canonical + '">')
    .replace('</head>', '<meta property="og:image" content="' + image + '"><meta property="og:image:width" content="1000"><meta property="og:image:height" content="1000"><meta property="og:image:alt" content="Song artwork"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="' + title + '"><meta name="twitter:description" content="' + description + '"><meta name="twitter:image" content="' + image + '"></head>');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=3600');
  return res.status(200).end(req.method === 'HEAD' ? undefined : html);
};
