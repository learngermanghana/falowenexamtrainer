const byId = id => document.getElementById(id);
const tracksRoot = byId("tracks");
const levelInput = byId("level");
const dayInput = byId("day");
const searchInput = byId("search");
const audio = byId("audio");
const player = byId("player");
let catalog = [];
let current = null;
const params = new URLSearchParams(location.search);

function safeAudioUrl(value) {
  try {
    const url = new URL(String(value || ""), location.origin);
    // Only public HTTPS media or a same-origin static /music/ file; never
    // private R2 S3 endpoints, auth APIs, or untrusted URL schemes.
    if (url.protocol !== "https:" && !(url.origin === location.origin && location.protocol === "http:")) return "";
    if (url.username || url.password) return "";
    if (url.origin === location.origin && !url.pathname.startsWith("/music/")) return "";
    if (/(^|\.)r2\.cloudflarestorage\.com$/i.test(url.hostname)) return "";
    return url.href;
  } catch { return ""; }
}
function safeTrack(row) {
  if (!row || typeof row !== "object") return null;
  const audioUrl = safeAudioUrl(row.audioUrl);
  if (!audioUrl || !row.id || !row.title) return null;
  const level = String(row.level || "ALL").toUpperCase();
  const day = Number(row.day);
  return {
    id: String(row.id).slice(0, 90), title: String(row.title).slice(0, 150),
    level: ["ALL","A1","A2","B1","B2","C1","C2"].includes(level) ? level : "ALL",
    day: Number.isInteger(day) && day >= 1 && day <= 99 ? day : null,
    topic: String(row.topic || "German learning").slice(0, 100),
    type: String(row.type || "Lesson song").slice(0, 100),
    language: String(row.language || "German").slice(0, 100),
    audioUrl, assignmentKey: String(row.assignmentKey || "").slice(0, 70),
  };
}
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function play(track) {
  current = track;
  audio.pause();
  audio.src = track.audioUrl;
  byId("now-title").textContent = track.title;
  byId("now-meta").textContent = [track.level === "ALL" ? "All levels" : track.level, track.day ? `Day ${track.day}` : track.type].join(" · ");
  byId("player-error").textContent = "";
  player.hidden = false;
  audio.play().catch(() => { byId("player-error").textContent = "Tap Play in the audio controls to start listening."; });
  const url = new URL(location.href);
  url.searchParams.set("track", track.id);
  history.replaceState(null, "", url);
}
function card(track) {
  const article = el("article", "track-card");
  const art = el("div", "track-art");
  const badge = el("span", "track-badge", track.level === "ALL" ? "ALL LEVELS" : track.level + (track.day ? ` · DAY ${track.day}` : ""));
  const circle = el("span", "art-circle", "♫");
  circle.setAttribute("aria-hidden", "true");
  art.append(badge, circle);
  const body = el("div", "track-body");
  body.append(el("span", "track-topic", track.topic), el("h3", "", track.title),
    el("p", "track-meta", [track.type, track.language].join(" · ")));
  const actions = el("div", "track-actions");
  const button = el("button", "play-button", "▶  Listen");
  button.type = "button";
  button.setAttribute("aria-label", "Play " + track.title);
  button.addEventListener("click", () => play(track));
  const link = el("a", "track-link", "Song link ↗");
  link.href = `/?track=${encodeURIComponent(track.id)}`;
  link.setAttribute("aria-label", "Open link for " + track.title);
  actions.append(button, link);
  body.append(actions);
  article.append(art, body);
  return article;
}
function render() {
  const q = searchInput.value.trim().toLocaleLowerCase();
  const level = levelInput.value;
  const day = dayInput.value ? Number(dayInput.value) : null;
  const filtered = catalog.filter(track => {
    if (level && track.level !== level && track.level !== "ALL") return false;
    if (day && track.day !== day) return false;
    if (q && ![track.title,track.topic,track.type,track.level,track.assignmentKey].join(" ").toLocaleLowerCase().includes(q)) return false;
    return true;
  });
  tracksRoot.replaceChildren();
  byId("song-count").textContent = `${filtered.length} ${filtered.length === 1 ? "song" : "songs"}`;
  if (!filtered.length) {
    const empty = el("div", "empty");
    empty.append(el("strong", "", "No songs published for this selection yet."),
      el("span", "", "Try another day or clear the filters. New lesson songs appear here once approved."));
    tracksRoot.append(empty);
  } else filtered.forEach(track => tracksRoot.append(card(track)));
}
for (let n=1; n<=31; n++) {
  const option = document.createElement("option");
  option.value = String(n);
  option.textContent = "Day " + n;
  dayInput.append(option);
}
if (["A1","A2","B1","B2","C1","C2"].includes((params.get("level")||"").toUpperCase())) levelInput.value = params.get("level").toUpperCase();
if (/^\d{1,2}$/.test(params.get("day")||"") && Number(params.get("day"))>=1 && Number(params.get("day"))<=31) dayInput.value = String(Number(params.get("day")));
for (const control of [searchInput,levelInput,dayInput]) control.addEventListener(control===searchInput?"input":"change", render);
byId("clear").addEventListener("click", () => { searchInput.value="";levelInput.value="";dayInput.value="";history.replaceState(null,"",location.pathname);render(); });
byId("share").addEventListener("click", async () => {
  if (!current) return;
  const link = new URL("/", location.origin);
  link.searchParams.set("track", current.id);
  try { await navigator.clipboard.writeText(link.href); byId("share").textContent="Copied!"; }
  catch { byId("share").textContent="Copy the page URL"; }
});
audio.addEventListener("error", () => { byId("player-error").textContent = "This song could not be loaded. Please try another track."; });
fetch("/music/catalog.json", { cache: "no-cache" }).then(response => {
  if (!response.ok) throw new Error("The music library is temporarily unavailable.");
  return response.json();
}).then(data => {
  catalog = (Array.isArray(data.tracks) ? data.tracks : []).map(safeTrack).filter(Boolean);
  render();
  const selected = catalog.find(t => t.id === params.get("track"));
  if (selected) {
    // Never autoplay on initial load; only select the requested track.
    current = selected;
    player.hidden = false;
    audio.src = selected.audioUrl;
    byId("now-title").textContent = selected.title;
    byId("now-meta").textContent = selected.topic;
  }
}).catch(error => { byId("library-status").textContent = error.message; byId("song-count").textContent = "Unavailable"; });
