/**
 * Build static watch pages from the public uploads feed for @LLEAGhana.
 * No YouTube API key, Firebase, serverless functions or video uploads.
 *
 * Run: node scripts/syncPublicYouTubeVideos.mjs
 * Optional: YOUTUBE_CHANNEL_ID=UC... or VIDEO_FEED_FIXTURE=/path/feed.xml (tests).
 * A failed fetch leaves the published catalogue untouched.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(repoRoot, 'web', 'public');
const videosDir = path.join(publicRoot, 'videos');
const cataloguePath = path.join(videosDir, 'catalog.json');
const sitemapPath = path.join(publicRoot, 'sitemap-videos.xml');
const channelUrl = 'https://www.youtube.com/@LLEAGhana';
const siteUrl = 'https://www.falowen.app';
const educationWords = /\b(german|deutsch|deutsche|deutschen|germany|goethe|grammatik|grammar|vocabulary|vokabel|wortschatz|sprechen|hoeren|hören|lesen|schreiben|pronunciation|a1|a2|b1|b2|c1|c2)\b/i;
const validId = /^[A-Za-z0-9_-]{11}$/;
const validChannelId = /^UC[A-Za-z0-9_-]{22}$/;

export function decodeXml(value) {
  return String(value || '')
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&#([0-9]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&(?:amp|lt|gt|quot|apos);/g, token => ({
      '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'"
    })[token]);
}

export function html(value) {
  return String(value || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

function jsonForHtml(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

function tag(fragment, name) {
  const match = String(fragment).match(new RegExp('<' + name.replace(':','\\:') + '\\b[^>]*>([\\s\\S]*?)<\\/' + name.replace(':','\\:') + '>', 'i'));
  return match ? decodeXml(match[1].trim()) : '';
}

export function channelIdFromHtml(markup) {
  const match = String(markup).match(/["']channelId["']\s*:\s*["'](UC[A-Za-z0-9_-]{22})["']/)
    || String(markup).match(/youtube\.com\/channel\/(UC[A-Za-z0-9_-]{22})/);
  return match ? match[1] : '';
}

export function parseFeed(feed, channelId = '') {
  const feedChannelId = tag(feed, 'yt:channelId');
  if (channelId && feedChannelId && feedChannelId !== channelId) throw new Error('YouTube feed channel ID mismatch');
  const entries = String(feed).match(/<entry\b[^>]*>[\s\S]*?<\/entry>/gi) || [];
  if (!entries.length) throw new Error('YouTube feed has no video entries; refusing to overwrite the catalogue');
  return entries.map(xml => {
    const id = tag(xml, 'yt:videoId');
    const title = tag(xml, 'title').replace(/\s+/g, ' ').trim().slice(0, 180);
    const published = tag(xml, 'published');
    const description = tag(xml, 'media:description').replace(/\s+/g, ' ').trim().slice(0, 280);
    return { id, title, published, description };
  }).filter(v => validId.test(v.id) && v.title && Number.isFinite(Date.parse(v.published)));
}

function isEducational(video) {
  return educationWords.test(video.title) && !/(\bprivate\b|\bpaid class recording\b)/i.test(video.title);
}

function getExisting() {
  if (!fs.existsSync(cataloguePath)) return { channelId: '', videos: [] };
  const data = JSON.parse(fs.readFileSync(cataloguePath, 'utf8'));
  return { channelId: String(data.channelId || ''), videos: Array.isArray(data.videos) ? data.videos : [] };
}

function exclusions() {
  const file = path.join(repoRoot, 'web', 'video-library-exclusions.json');
  return new Set(fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : []);
}

function saveIfChanged(file, content) {
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
  return true;
}

const css = '*,*:before,*:after{box-sizing:border-box}body{margin:0;background:#f3f7ff;color:#17233b;font:16px/1.55 system-ui,-apple-system,Segoe UI,sans-serif}a{color:#1454bc}header{background:#103d85;color:#fff;padding:16px max(18px,calc((100% - 1060px)/2))}header a{color:#fff;text-decoration:none;font-weight:750}.wrap{max-width:1060px;padding:28px 18px;margin:auto}.eyebrow{color:#2462a9;font-size:13px;font-weight:750;letter-spacing:.09em;text-transform:uppercase}h1{font-size:clamp(27px,4.2vw,40px);line-height:1.18;margin:9px 0 18px}.lead{color:#465878;max-width:760px}.player{width:100%;aspect-ratio:16/9;background:#0e1a31;border-radius:18px;overflow:hidden;margin:18px 0 22px}.player iframe{border:0;width:100%;height:100%}.card{background:#fff;border:1px solid #dde6f4;border-radius:16px;padding:19px;margin:16px 0}.cta{display:inline-block;padding:11px 17px;background:#1257c6;color:white;border-radius:9px;text-decoration:none;font-weight:700}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr));gap:18px;margin:22px 0}.tile{display:block;background:#fff;border-radius:15px;border:1px solid #dce6f5;overflow:hidden;color:inherit;text-decoration:none}.tile img{width:100%;aspect-ratio:16/9;display:block;object-fit:cover}.tile div{padding:14px}.tile strong{display:block;font-size:17px}.muted{color:#596987;font-size:14px}footer{margin-top:44px;border-top:1px solid #dbe6f5;padding:22px 0;color:#596987}';

function documentHead(title, description, canonical, image, video = null) {
  const meta = [
    '<!doctype html><html lang="en"><head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<title>' + html(title) + '</title>',
    '<meta name="description" content="' + html(description) + '">',
    '<link rel="canonical" href="' + html(canonical) + '">',
    '<meta property="og:type" content="' + (video ? 'video.other' : 'website') + '">',
    '<meta property="og:title" content="' + html(title) + '">',
    '<meta property="og:description" content="' + html(description) + '">',
    '<meta property="og:url" content="' + html(canonical) + '">',
    '<meta property="og:image" content="' + html(image) + '">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<style>' + css + '</style>'
  ];
  if (video) {
    meta.push('<script type="application/ld+json">' + jsonForHtml({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: video.title,
      description: video.description || video.title + ' — a public German learning video from Learn Language Education Academy.',
      thumbnailUrl: 'https://i.ytimg.com/vi/' + video.id + '/hqdefault.jpg',
      uploadDate: video.published,
      embedUrl: 'https://www.youtube.com/embed/' + video.id,
      url: canonical,
      publisher: {
        '@type': 'Organization',
        name: 'Learn Language Education Academy',
        url: siteUrl
      }
    }) + '</script>');
  }
  meta.push('</head><body><header><a href="/">Falowen</a> &nbsp; / &nbsp; <a href="/videos/">Free German Video Lessons</a></header>');
  return meta.join('\n');
}

function videoPage(video) {
  const canonical = siteUrl + '/videos/' + video.id + '.html';
  const description = video.description || 'Watch ' + video.title + ' by Learn Language Education Academy on Falowen.';
  return documentHead(video.title + ' | Falowen Video Lessons', description, canonical,
    'https://i.ytimg.com/vi/' + video.id + '/hqdefault.jpg', video) +
    '<main class="wrap"><div class="eyebrow">Free German video lesson</div><h1>' + html(video.title) + '</h1>' +
    '<section aria-label="Watch ' + html(video.title) + '" class="player">' +
    '<iframe title="' + html(video.title) + '" loading="eager" src="https://www.youtube.com/embed/' + video.id +
    '" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share" allowfullscreen></iframe></section>' +
    '<p class="lead">' + html(description) + '</p><div class="card"><p>Practise German with guided lessons, language exercises and tutor support on Falowen.</p>' +
    '<a class="cta" href="/classes/">Explore German classes</a> &nbsp; <a href="/exam-practice">Free Goethe-style practice</a></div>' +
    '<p class="muted">Video hosted on <a href="https://www.youtube.com/watch?v=' + video.id +
    '">YouTube</a>. Only public educational videos are featured here.</p>' +
    '<footer><a href="/videos/">Browse all free video lessons</a> · <a href="' + channelUrl + '">LLEA Ghana on YouTube</a></footer></main></body></html>\n';
}

function libraryPage(videos) {
  const title = 'Free German Video Lessons | Learn German with Falowen';
  const description = 'Watch free public German video lessons from Learn Language Education Academy. Grammar, vocabulary, pronunciation and exam preparation.';
  const cards = videos.map(v => '<a class="tile" href="/videos/' + v.id + '.html">' +
    '<img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg">' +
    '<div><strong>' + html(v.title) + '</strong><span class="muted">' + html(v.published.slice(0, 10)) + '</span></div></a>').join('');
  return documentHead(title, description, siteUrl + '/videos/', siteUrl + '/falo.png') +
    '<main class="wrap"><div class="eyebrow">LLEA Ghana · Falowen</div><h1>Free German video lessons</h1>' +
    '<p class="lead">Learn German with our public YouTube lessons, then put what you learn into practice on Falowen.</p>' +
    (videos.length ? '<section class="grid" aria-label="Video lessons">' + cards + '</section>' :
      '<div class="card"><p>Our video lesson collection is being prepared.</p>' +
      '<a href="' + channelUrl + '">Watch our videos on YouTube</a></div>') +
    '<footer><a href="/classes/">German classes</a> · <a href="/exam-practice">Goethe practice</a> · <a href="' +
    channelUrl + '">YouTube channel</a></footer></main></body></html>\n';
}

function videoSitemap(videos) {
  const nodes = videos.map(v => {
    const link = siteUrl + '/videos/' + v.id + '.html';
    const title = html(v.title);
    const description = html(v.description || v.title + ' — a free German language video.');
    return '  <url><loc>' + link + '</loc><video:video>' +
      '<video:thumbnail_loc>https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg</video:thumbnail_loc>' +
      '<video:title>' + title + '</video:title><video:description>' + description + '</video:description>' +
      '<video:player_loc>https://www.youtube.com/embed/' + v.id + '</video:player_loc>' +
      '<video:publication_date>' + html(v.published) + '</video:publication_date>' +
      '</video:video></url>';
  });
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n' +
    '  <url><loc>' + siteUrl + '/videos/</loc></url>\n' + nodes.join('\n') + '\n</urlset>\n';
}

async function requestText(url, fetchImpl) {
  const response = await fetchImpl(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FalowenVideoSync/1.0)' },
    signal: AbortSignal.timeout(20000)
  });
  if (!response.ok) throw new Error('YouTube request failed (' + response.status + ') for ' + url);
  return await response.text();
}

export async function sync({ feedXml, channelHtml, channelId, fetchImpl = fetch, outputRoot = publicRoot } = {}) {
  const dir = path.join(outputRoot, 'videos');
  const priorPath = path.join(dir, 'catalog.json');
  const old = fs.existsSync(priorPath) ? JSON.parse(fs.readFileSync(priorPath, 'utf8')) : { videos: [], channelId: '' };
  const id = channelId || process.env.YOUTUBE_CHANNEL_ID || old.channelId ||
    channelIdFromHtml(channelHtml || await requestText(channelUrl, fetchImpl));
  if (!validChannelId.test(id)) throw new Error('Could not resolve @LLEAGhana channel ID; set YOUTUBE_CHANNEL_ID to its UC... ID');
  const source = feedXml || await requestText('https://www.youtube.com/feeds/videos.xml?channel_id=' + id, fetchImpl);
  const entries = parseFeed(source, id);
  const excludedFile = path.join(repoRoot, 'web', 'video-library-exclusions.json');
  const excluded = new Set(fs.existsSync(excludedFile) ? JSON.parse(fs.readFileSync(excludedFile, 'utf8')) : []);
  const merged = new Map((old.videos || []).filter(v => validId.test(v.id) && !excluded.has(v.id)).map(v => [v.id, v]));
  for (const video of entries) {
    if (isEducational(video) && !excluded.has(video.id)) merged.set(video.id, video);
  }
  const videos = [...merged.values()].sort((a, b) => b.published.localeCompare(a.published) || a.id.localeCompare(b.id));
  const data = { channelId: id, channelUrl, videos };
  let changed = 0;
  if (saveIfChanged(path.join(dir, 'catalog.json'), JSON.stringify(data, null, 2) + '\n')) changed++;
  if (saveIfChanged(path.join(dir, 'index.html'), libraryPage(videos))) changed++;
  if (saveIfChanged(path.join(outputRoot, 'sitemap-videos.xml'), videoSitemap(videos))) changed++;
  for (const video of videos) if (saveIfChanged(path.join(dir, video.id + '.html'), videoPage(video))) changed++;
  // Only remove previously generated individual watch pages; never touch other pages.
  for (const filename of fs.readdirSync(dir)) {
    if (/^[A-Za-z0-9_-]{11}\.html$/.test(filename) && !merged.has(filename.slice(0, 11))) {
      fs.unlinkSync(path.join(dir, filename));
      changed++;
    }
  }
  return { channelId: id, count: videos.length, newFromFeed: entries.filter(isEducational).length, changed };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  sync().then(result => console.log('Falowen YouTube sync:', JSON.stringify(result)))
    .catch(err => { console.error('Falowen YouTube sync failed:', err.message); process.exitCode = 1; });
}
