import { buildPlaybackQueue } from "./playback-queue.js?v=20261028-shuffle";
import { lyricLines, validateCues, activeLyricIndex } from "./lyrics-timing.js?v=20261028-recordings";
// Never autoplay on initial load; continue only after a listener starts a song.
// Falowen Music's static listening room. No authentication, tracking, AI calls,
// Firestore writes or generated media. Only catalog-approved recordings play.
const byId = id => document.getElementById(id);
const embedded = new URLSearchParams(location.search).get("embedded") === "1";
// Embedded pages run on www.falowen.app, same-origin with the student's session.
if (embedded) {
  document.body.classList.add("music-embedded");
  document.querySelectorAll('a[href^="https://www.falowen.app/"]').forEach(link => {
    link.target = "_top";
  });
}
const audio = byId("audio");
const player = byId("player");
const tracksRoot = byId("tracks");
const levelInput = byId("level");
const dayInput = byId("day");
const genreInput = byId("genre");
const searchInput = byId("search");
let catalog = [];
let pinnedTracks = [];
let learning = {};
let studioDrafts = [];
const normalizedTitle = value => String(value || "").toLocaleLowerCase("de-DE")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
function referenceLyricsFor(track) {
  if (!track || !track.autoDiscovered) return null;
  const candidates = studioDrafts.filter(item => item.level === track.level && item.day === track.day);
  const exact = candidates.find(item => normalizedTitle(item.title) === normalizedTitle(track.title));
  const byKey = track.assignmentKey && candidates.find(item => item.assignmentKey === track.assignmentKey);
  const draft = exact || byKey || (candidates.length === 1 ? candidates[0] : null);
  return draft && typeof draft.lyrics === "string" && draft.lyrics.trim()
    ? {lyrics:draft.lyrics, cues:[], referenceOnly:true, assignmentKey:draft.assignmentKey} : null;
}
function lyricsFor(track) {
  return publishedLyrics.get(track.id) || learning[track.id] || referenceLyricsFor(track);
}
let current = null;
let selected = null;
let category = "all";
let featured = null;
const publishedLyrics = new Map();
const lyricsRequests = new Set();
let renderedCues = [];
let highlightedLine = -1;
let playbackQueue = [];
let playbackTracks = [];
let shuffleEnabled = false;
try { shuffleEnabled = localStorage.getItem("falowen_music_shuffle") === "1"; } catch {}
byId("shuffle").checked = shuffleEnabled;
byId("shuffle").addEventListener("change", () => {
  shuffleEnabled = byId("shuffle").checked;
  playbackQueue = buildPlaybackQueue(playbackTracks, current?.id, shuffleEnabled);
  if (shuffleEnabled) { byId("repeat").checked = false; audio.loop = false; }
  try { localStorage.setItem("falowen_music_shuffle", shuffleEnabled ? "1" : "0"); } catch {}
});
let visibleTracks = [];
const initialParams = new URLSearchParams(location.search);
const initialId = (document.body.dataset.track || initialParams.get("track") || "").trim();

function safeAudioUrl(value) {
  try {
    const url = new URL(String(value || ""), location.origin);
    if (url.protocol !== "https:" && !(url.origin === location.origin && location.protocol === "http:")) return "";
    if (url.username || url.password) return "";
    // Inside /campus/music, the same public /api/music?track=... playback
    // URL becomes SAME-ORIGIN. Allow only this exact owned media endpoint.
    // Keep rejecting arbitrary same-origin paths or private R2 URLs.
    const trackIds = url.searchParams.getAll("track");
    const isOwnedPlayback = url.pathname === "/api/music"
      && trackIds.length === 1
      && /^[a-zA-Z0-9_-]{1,245}$/.test(trackIds[0])
      && [...url.searchParams.keys()].every(key => key === "track");
    if (url.origin === location.origin && !url.pathname.startsWith("/music/") && !isOwnedPlayback) return "";
    if (/(^|\.)r2\.cloudflarestorage\.com$/i.test(url.hostname)) return "";
    return url.href;
  } catch { return ""; }
}
function safeTrack(row) {
  if (!row || typeof row !== "object" || !/^[a-zA-Z0-9_-]{1,245}$/.test(String(row.id || ""))) return null;
  const audioUrl = safeAudioUrl(row.audioUrl);
  if (!audioUrl || !row.title) return null;
  const level = String(row.level || "ALL").toUpperCase();
  const day = Number(row.day);
  return {
    id: row.id, title: String(row.title).slice(0, 150),
    level: ["ALL", "A1", "A2", "B1", "B2", "C1", "C2"].includes(level) ? level : "ALL",
    day: Number.isInteger(day) && day >= 1 && day <= 99 ? day : null,
    topic: String(row.topic || "German learning").slice(0, 100),
    type: String(row.type || "Lesson song").slice(0, 100),
    language: String(row.language || "German").slice(0, 100),
    genre: String(row.genre || "").slice(0, 70),
    audioUrl, assignmentKey: String(row.assignmentKey || "").slice(0, 70),
    featured: row.featured === true,
    autoDiscovered: row.autoDiscovered === true,
    objectKey: String(row.objectKey || ""),
    category: row.coursebook === true ? "lesson" : "motivation",
  };
}
function el(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}
function publicSongUrl(track) {
  // Share the public music website even when the player is inside the campus.
  const path = track.autoDiscovered
    ? "/?track=" + encodeURIComponent(track.id)
    : "/music/songs/" + encodeURIComponent(track.id) + ".html";
  return new URL(path, "https://music.falowen.app");
}
function songUrl(track) {
  const publicPath = publicSongUrl(track);
  if (!embedded) return new URL(publicPath.pathname + publicPath.search, location.origin);
  // Never send the embedded player to '/' on www.falowen.app:
  // '/' is the learner homepage, not the music app.
  const url = track.autoDiscovered
    ? new URL("/music/index.html?track=" + encodeURIComponent(track.id), location.origin)
    : new URL("/music/songs/" + encodeURIComponent(track.id) + ".html", location.origin);
  url.searchParams.set("embedded", "1");
  return url;
}
function setShareText(label) {
  byId("share").textContent = label;
  byId("detail-share").textContent = label === "Link copied!" ? "Link copied!" : "Copy song link";
}
async function shareCurrent() {
  if (!current && !selected) return;
  const url = publicSongUrl(selected || current).href;
  try {
    await navigator.clipboard.writeText(url);
    setShareText("Link copied!");
  } catch {
    byId("player-error").textContent = "Copy this song URL: " + url;
    setShareText("Copy page URL");
  }
}
function setPlayer(track, start = false) {
  if (!track) return;
  if (!current || current.id !== track.id) {
    audio.pause();
    audio.src = track.audioUrl;
    audio.load();
  }
  current = track;
  byId("now-title").textContent = track.title;
  byId("now-meta").textContent = [track.level === "ALL" ? "All levels" : track.level, track.day ? "Day " + track.day : track.type].join(" · ");
  byId("player-error").textContent = "";
  audio.playbackRate = Number(byId("speed").value) || 1;
  audio.loop = byId("repeat").checked;
  player.hidden = false;
  document.body.classList.add("has-player");
  if (start) {
    try { localStorage.setItem("falowen_music_recent", track.id); } catch {}
    audio.play().catch(() => { byId("player-error").textContent = "Tap Play in the audio controls to start listening."; });
  }
}
function populateFeatured() {
  featured = catalog.find(track => track.featured && track.category === "lesson") || catalog.find(track => track.category === "lesson") || catalog[0] || null;
  const prompt = byId("featured-description");
  if (featured) {
    prompt.textContent = "Featured: " + featured.title + " · " + (featured.level === "ALL" ? featured.type : featured.level + " · Day " + featured.day) + ". Learn through the recording and a short activity.";
    byId("featured-play").disabled = false;
  } else {
    prompt.textContent = "New approved songs will appear here.";
    byId("featured-play").disabled = true;
  }
  try {
    const recentId = localStorage.getItem("falowen_music_recent");
    const recent = catalog.find(track => track.id === recentId);
    if (recent) {
      const resume = el("button", "hero-secondary", "Continue: " + recent.title + " ↗");
      resume.type = "button";
      resume.addEventListener("click", () => showSong(recent, false, true));
      byId("featured-play").after(resume);
    }
  } catch {}
}
function populateFilters() {
  const available = ["A1","A2","B1","B2","C1","C2"];
  const oldLevel = levelInput.value, oldDay = dayInput.value, oldGenre = genreInput.value;
  levelInput.replaceChildren(new Option("All levels", ""));
  available.forEach(level => levelInput.add(new Option(level, level)));
  const queryLevel=(initialParams.get("level") || "").toUpperCase();
  levelInput.value = available.includes(oldLevel) ? oldLevel : available.includes(queryLevel) ? queryLevel : "";
  dayInput.replaceChildren(new Option("Available days", ""));
  const days = [...new Set(catalog.filter(track => track.category === "lesson" && (!levelInput.value || track.level === levelInput.value)).map(track => track.day).filter(Boolean))].sort((a,b) => a-b);
  for(const day of days) dayInput.add(new Option("Day "+day,String(day)));
  const queryDay=String(Number(initialParams.get("day")));
  dayInput.value = Number(oldDay)>=1 && Number(oldDay)<=28 ? oldDay
    : Number(queryDay)>=1 && Number(queryDay)<=28 ? queryDay : "";
  const genres = [...new Set(catalog.map(track => track.genre).filter(Boolean))].sort();
  genreInput.replaceChildren(new Option("All genres", ""));
  genres.forEach(genre => genreInput.add(new Option(genre, genre)));
  if(genres.includes(oldGenre)) genreInput.value=oldGenre;
}
function card(track) {
  const article = el("article", "track-card");
  const art = el("div", "track-art " + (track.category === "lesson" ? "art-lesson" : "art-motivation"));
  const badge = el("span", "track-badge", track.level === "ALL" ? "CLASS MUSIC" : track.level + " · DAY " + track.day);
  const circle = el("span", "art-circle", track.category === "lesson" ? "♫" : "♪");
  circle.setAttribute("aria-hidden", "true");
  art.append(badge, circle);
  const body = el("div", "track-body");
  body.append(el("span", "track-topic", track.topic), el("h3", "", track.title),
    el("p", "track-meta", [track.genre || track.type, track.language].join(" · ")));
  const actions = el("div", "track-actions");
  const listen = el("button", "play-button", "▶ Listen");
  listen.type = "button";
  listen.setAttribute("aria-label", "Play " + track.title);
  listen.addEventListener("click", () => showSong(track, true, true));
  const explore = el("a", "track-link", track.category === "lesson" ? "Lyrics & questions ↗" : "Open song ↗");
  explore.href = songUrl(track).pathname + songUrl(track).search;
  if (!learning[track.id] || learning[track.id].assignmentKey !== track.assignmentKey) explore.textContent = "Open song ↗";
  explore.addEventListener("click", event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    showSong(track, false, true);
  });
  actions.append(listen, explore);
  body.append(actions);
  article.append(art, body);
  return article;
}
function renderCatalog() {
  const previousDay = dayInput.value;
  const days = [...new Set(catalog.filter(track => track.category === "lesson" && (!levelInput.value || track.level === levelInput.value)).map(track => track.day).filter(Boolean))].sort((a,b) => a-b);
  dayInput.replaceChildren(new Option("Available days", ""));
  for (const day of days) dayInput.add(new Option("Day " + day, String(day)));
  dayInput.value = days.includes(Number(previousDay)) ? previousDay : "";
  const q = searchInput.value.trim().toLocaleLowerCase();
  const level = levelInput.value;
  const day = Number(dayInput.value);
  const genre = genreInput.value;
  visibleTracks = catalog.filter(track => (!level || track.level === level)
    && (!day || track.day === day) && (!genre || track.genre === genre)
    && (category === "all" || track.category === category)
    && (!q || [track.title, track.topic, track.level, track.genre, track.assignmentKey].join(" ").toLocaleLowerCase().includes(q)));
  tracksRoot.replaceChildren();
  for (const groupLevel of ["A1", "A2", "B1", "B2", "C1", "C2", "ALL"]) {
    const songs = visibleTracks.filter(track => track.level === groupLevel);
    if (!songs.length) continue;
    const section = el("section", "level-section");
    const heading = el("div", "level-heading");
    const title = groupLevel === "ALL" ? "Classroom motivation" : groupLevel + " · German songs";
    heading.append(el("h3", "", title));
    const view = el("button", "clear-button", level ? "All levels ←" : "View all " + songs.length + " →");
    view.type = "button";
    view.addEventListener("click", () => {
      levelInput.value = level ? "" : groupLevel === "ALL" ? "" : groupLevel;
      category = !level && groupLevel === "ALL" ? "motivation" : "all";
      document.querySelectorAll("[data-category]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.category === category)));
      renderCatalog();
    });
    heading.append(view);
    const grid = el("div", "level-grid");
    (level || q || day || genre || category === "motivation" ? songs : songs.slice(0, 4)).forEach(track => grid.append(card(track)));
    section.append(heading, grid);
    tracksRoot.append(section);
  }
  if (!visibleTracks.length) tracksRoot.append(el("p", "empty", "No songs here yet. Try another level or clear your filters."));
  byId("song-count").textContent = visibleTracks.length + (visibleTracks.length === 1 ? " song" : " songs");
}
function moveTrack(direction = 1) {
  if (!playbackQueue.length) return;
  let index = playbackQueue.findIndex(track => track.id === current?.id);
  if (shuffleEnabled && direction > 0 && index === playbackQueue.length - 1 && playbackQueue.length > 1) {
    playbackQueue = buildPlaybackQueue(playbackQueue, current.id, true);
    index = 0;
  }
  const track = playbackQueue[(index + direction + playbackQueue.length) % playbackQueue.length];
  selected = track;
  setPlayer(track, true);
  if (!byId("song-detail").hidden) renderDetail(track);
  history.replaceState({trackId: track.id}, "", songUrl(track).pathname + songUrl(track).search);
}
audio.addEventListener("ended", () => { if (!audio.loop) moveTrack(1); });
byId("next-track")?.addEventListener("click", () => moveTrack(1));
byId("previous-track")?.addEventListener("click", () => moveTrack(-1));
function setTab(name) {
  if (!["listen", "lyrics", "practice"].includes(name)) return;
  const lesson = selected && lyricsFor(selected);
  if (!lesson && name !== "listen") return;
  if (name !== "listen" && document.querySelector('[data-tab="' + name + '"]').hidden) return;
  if (name === "practice" && !learning[selected?.id]?.questions) return;
  document.querySelectorAll(".lesson-tabs button").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.tab === name));
  });
  for (const id of ["listen", "lyrics", "practice"]) byId("detail-" + id).hidden = id !== name;
  if (name === "lyrics") highlightedLine = -2;
  updateLyricHighlight();
}
function renderLyrics(lesson) {
  const root = byId("lyrics-text");
  root.replaceChildren();
  renderedCues = validateCues(lesson.cues, lesson.lyrics);
  highlightedLine = -1;
  const note = el("p", "detail-note", lesson.referenceOnly ? "COURSE DRAFT — These are the original Music Studio lyrics for this lesson, not verified against this MP3. Words may differ from the recording. Timed highlighting is unavailable until matching lyrics are published." : renderedCues.length ? "Follow the highlighted line, or tap a line to replay it." : "Lyrics are available. Timed highlighting will appear when reviewed timings are published.");
  root.append(note);
  let index = 0;
  for (const raw of String(lesson.lyrics || "").replace(/\\n/g, "\n").split(/\r?\n/)) {
    const text = raw.trim();
    if (!text) continue;
    if (/^\[.*\]$/.test(text)) { root.append(el("h4", "lyric-heading", text.slice(1,-1))); continue; }
    const line = el("button", "lyric-line", text);
    line.type = "button";
    line.lang = "de";
    line.dataset.line = String(index);
    const cue = renderedCues[index++];
    line.disabled = !cue;
    if (cue) line.addEventListener("click", () => {
      if (!selected) return;
      if (current?.id !== selected.id) setPlayer(selected, false);
      const trackId = selected.id;
      const seek = () => { if (current?.id === trackId) { audio.currentTime = cue.start; updateLyricHighlight(); } };
      if (audio.readyState >= 1) seek(); else audio.addEventListener("loadedmetadata", seek, {once:true});
      audio.play().catch(() => {});
    });
    root.append(line);
  }
  updateLyricHighlight();
  const vocab = byId("vocab-list");
  vocab.replaceChildren();
  for (const item of lesson.vocabulary || []) {
    const details = el("details", "vocab-item");
    const summary = el("summary", "", item.de);
    const meaning = el("p", "", item.en);
    details.append(summary, meaning);
    vocab.append(details);
  }
}
function updateLyricHighlight() {
  const active = selected?.id === current?.id && !audio.ended ? activeLyricIndex(renderedCues, audio.currentTime) : -1;
  if (active === highlightedLine) return;
  highlightedLine = active;
  const root = byId("lyrics-text");
  root.querySelectorAll(".lyric-line").forEach((line, i) => {
    line.classList.toggle("is-active", i === active);
    if (i === active) line.setAttribute("aria-current", "true"); else line.removeAttribute("aria-current");
  });
  const line = root.querySelector('[data-line="' + active + '"]');
  if (line && !byId("detail-lyrics").hidden && byId("follow-lyrics").checked) {
    const top = line.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop;
    if (top < root.scrollTop || top + line.offsetHeight > root.scrollTop + root.clientHeight)
      root.scrollTo({top:Math.max(0, top - root.clientHeight / 3), behavior:matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
  }
}
for (const event of ["timeupdate", "seeked", "loadedmetadata", "ended", "emptied"]) audio.addEventListener(event, updateLyricHighlight);
async function loadPublishedLyrics(track) {
  if (lyricsRequests.has(track.id) || !track.objectKey) return;
  lyricsRequests.add(track.id);
  try {
    const response = await fetch("/api/music-lyrics?track=" + encodeURIComponent(track.id), {cache:"no-cache"});
    if (!response.ok) return;
    const data = await response.json();
    if (data.objectKey !== track.objectKey || typeof data.lyrics !== "string" || !data.lyrics.trim()) return;
    if (Array.isArray(data.cues) && data.cues.length && !validateCues(data.cues, data.lyrics).length) return;
    publishedLyrics.set(track.id, data);
    if (selected?.id === track.id) {
      const tab = document.querySelector('.lesson-tabs button[aria-pressed="true"]')?.dataset.tab || "listen";
      renderDetail(track); setTab(tab);
    }
  } catch { /* Untimed reviewed lyrics remain readable when timing is unavailable. */ }
}
function renderQuestions(lesson) {
  const root = byId("listening-questions");
  root.replaceChildren();
  byId("practice-feedback").textContent = "";
  (lesson.questions || []).filter(q => q.type === "listening").forEach((question, index) => {
    const fieldset = el("fieldset", "quiz-question");
    fieldset.append(el("legend", "", (index + 1) + ". " + question.prompt));
    (question.options || []).forEach((option, choice) => {
      const label = el("label", "quiz-option");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "song-question-" + index;
      radio.value = String(choice);
      label.append(radio, el("span", "", String.fromCharCode(65 + choice) + ". " + option));
      fieldset.append(label);
    });
    fieldset.append(el("p", "question-result", ""));
    root.append(fieldset);
  });
  const speak = (lesson.questions || []).find(q => q.type === "speaking");
  const challenge = byId("speaking-challenge");
  challenge.replaceChildren();
  if (speak) {
    challenge.append(el("h3", "", "Speak aloud"), el("p", "", speak.prompt),
      el("p", "detail-note", speak.hint || "Try answering in your own German words."));
  }
}
function checkAnswers() {
  if (!selected) return;
  const lesson = learning[selected.id];
  if (!lesson) return;
  const questions = (lesson.questions || []).filter(q => q.type === "listening");
  const groups = [...byId("listening-questions").querySelectorAll("fieldset")];
  let correct = 0, answered = 0;
  groups.forEach((group, i) => {
    const question = questions[i];
    const picked = group.querySelector("input:checked");
    const result = group.querySelector(".question-result");
    group.querySelectorAll("label").forEach(label => label.classList.remove("is-correct","is-wrong"));
    if (!picked) {
      result.textContent = "Choose an answer, then check again.";
      return;
    }
    answered++;
    const good = Number(picked.value) === question.correctIndex;
    if (good) correct++;
    picked.closest("label").classList.add(good ? "is-correct" : "is-wrong");
    result.textContent = good ? "Richtig! " + question.answer : "Try listening again. Correct answer: " + question.answer;
  });
  byId("practice-feedback").textContent = answered === questions.length
    ? correct + " of " + questions.length + " correct. Practise again whenever you like."
    : answered + " of " + questions.length + " answered. Finish the remaining question(s).";
}
function renderDetail(track) {
  const lesson = learning[track.id];
  const lyricPack = publishedLyrics.get(track.id) || (lesson?.assignmentKey === track.assignmentKey ? lesson : null) || referenceLyricsFor(track);
  const hasLyrics = Boolean(lyricPack?.lyrics);
  const hasLesson = Boolean(lesson && lesson.assignmentKey === track.assignmentKey && Array.isArray(lesson.questions) && (!lyricPack || JSON.stringify(lyricLines(lyricPack.lyrics)) === JSON.stringify(lyricLines(lesson.lyrics))));
  byId("detail-eyebrow").textContent = track.level === "ALL" ? "FALOWEN · CLASSROOM MUSIC" : "FALOWEN · " + track.level + " · DAY " + track.day;
  byId("detail-title").textContent = track.title;
  byId("detail-meta").textContent = [track.topic, track.genre || track.type, track.language].join(" · ");
  byId("listen-prompt").textContent = hasLesson
    ? "First listen without reading. " + lesson.summary + ". Which key words can you hear?"
    : "Listen, relax and enjoy this Falowen classroom song. You can play it again with the repeat control.";
  byId("course-link").hidden = !hasLesson;
  if (hasLesson) byId("course-link").href = /^https:\/\/www\.falowen\.app\/campus\/course\/[a-z0-9-]+$/.test(lesson.courseUrl || "")
    ? lesson.courseUrl : "https://www.falowen.app/campus"; 
  byId("listen-next").hidden = !hasLyrics;
  for (const tab of ["lyrics","practice"]) {
    document.querySelector('[data-tab="' + tab + '"]').hidden = tab === "lyrics" ? !hasLyrics : !hasLesson;
  }
  if (hasLesson) {
    renderQuestions(lesson);
  } else {
    byId("lyrics-text").replaceChildren();
    byId("vocab-list").replaceChildren();
    byId("listening-questions").replaceChildren();
  }
  renderedCues = []; highlightedLine = -1;
  if (hasLyrics) renderLyrics(hasLesson ? {...lesson, ...lyricPack} : lyricPack);
  loadPublishedLyrics(track);
  byId("song-detail").hidden = false;
  setTab("listen");
  document.title = track.title + " · Falowen Music";
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = "Listen to " + track.title + " on Falowen Music" + (hasLesson ? ", read German lyrics and practise listening." : ".");
}
function showSong(track, autoplay = false, navigate = true) {
  selected = track;
  playbackTracks = [...(visibleTracks.some(song => song.id === track.id) ? visibleTracks : catalog)];
  playbackQueue = buildPlaybackQueue(playbackTracks, track.id, shuffleEnabled);
  setPlayer(track, autoplay);
  renderDetail(track);
  if (navigate && location.pathname + location.search !== songUrl(track).pathname + songUrl(track).search) history.pushState({ trackId: track.id }, "", songUrl(track).pathname + songUrl(track).search);
  byId("song-detail").scrollIntoView({ behavior: "smooth", block: "start" });
}
function closeDetail(navigate = true) {
  selected = null;
  byId("song-detail").hidden = true;
  document.title = "Falowen Music · Learn German through songs";
  if (navigate) history.pushState(null, "", embedded ? "/music/index.html?embedded=1" : "/");
  byId("library").scrollIntoView({ behavior: "smooth", block: "start" });
}
for (const control of [searchInput, levelInput, dayInput, genreInput])
  control.addEventListener(control === searchInput ? "input" : "change", renderCatalog);
document.querySelectorAll("[data-category]").forEach(button => button.addEventListener("click", () => {
  category = button.dataset.category;
  document.querySelectorAll("[data-category]").forEach(b => b.setAttribute("aria-pressed", String(b === button)));
  renderCatalog();
}));
byId("clear").addEventListener("click", () => {
  category = "all";
  document.querySelectorAll("[data-category]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.category === "all")));
  searchInput.value = "";
  levelInput.value = "";
  dayInput.value = "";
  genreInput.value = "";
  renderCatalog();
});
byId("featured-play").addEventListener("click", () => { if (featured) showSong(featured, true); });
byId("detail-play").addEventListener("click", () => { if (selected) setPlayer(selected, true); });
byId("back-library").addEventListener("click", () => closeDetail());
document.querySelectorAll(".lesson-tabs button").forEach(button => button.addEventListener("click", () => setTab(button.dataset.tab)));
byId("listen-next").addEventListener("click", () => setTab("lyrics"));
byId("lyrics-next").addEventListener("click", () => setTab("practice"));
byId("check-answers").addEventListener("click", checkAnswers);
byId("share").addEventListener("click", shareCurrent);
byId("detail-share").addEventListener("click", shareCurrent);
byId("follow-lyrics").addEventListener("change", () => { highlightedLine = -2; updateLyricHighlight(); });
byId("speed").addEventListener("change", () => { audio.playbackRate = Number(byId("speed").value) || 1; });
byId("repeat").addEventListener("change", () => { audio.loop = byId("repeat").checked; });
audio.addEventListener("error", () => { byId("player-error").textContent = "This song could not be loaded. Please try another track."; });
window.addEventListener("popstate", () => {
  const id = location.pathname.match(/\/music\/songs\/([a-z0-9-]+)\.html$/)?.[1] || new URLSearchParams(location.search).get("track");
  const track = catalog.find(song => song.id === id);
  if (track) showSong(track, false, false);
  else closeDetail(false);
});
async function refreshMusic() {
  const button=byId("refresh-music");
  button.disabled=true;
  byId("discovery-status").textContent="Updating songs…";
  try {
    const response=await fetch("/api/music-library",{cache:"no-cache"});
    if(!response.ok) throw Error("R2 music discovery is unavailable.");
    const data=await response.json();
    if(!data?.ok || !Array.isArray(data.tracks)) throw Error("Music discovery returned no valid catalogue.");
    const dynamic=data.tracks.map(safeTrack).filter(Boolean);
    const pinnedKeys=new Set(pinnedTracks.map(track=>track.objectKey).filter(Boolean));
    const pinnedIds=new Set(pinnedTracks.map(track=>track.id));
    catalog=[...pinnedTracks,...dynamic.filter(track=>!pinnedIds.has(track.id)&&!pinnedKeys.has(track.objectKey))];
    populateFilters();
    renderCatalog();
    byId("discovery-status").textContent="";
    const selectedId=initialId || new URLSearchParams(location.search).get("track");
    if(selectedId && !selected) {
      const track=catalog.find(song=>song.id===selectedId);
      if(track) showSong(track,false,false);
    }
  }catch(error){
    byId("discovery-status").textContent="New uploads could not be checked. Existing published songs remain available. "+error.message;
  }finally {button.disabled=false;}
}
byId("refresh-music").addEventListener("click",refreshMusic);

Promise.all([
  fetch("/music/catalog.json", { cache: "no-cache" }).then(res => {
    if (!res.ok) throw new Error("The music library is temporarily unavailable.");
    return res.json();
  }),
  fetch("/music/learning.json", { cache: "no-cache" }).then(res => res.ok ? res.json() : { lessons: {} })
    .catch(() => ({ lessons: {} })),
  fetch("/music/studio-drafts.json", { cache: "no-cache" }).then(res => res.ok ? res.json() : { tracks: [] })
    .catch(() => ({ tracks: [] })),
]).then(([data, lessons, drafts]) => {
  pinnedTracks = (Array.isArray(data.tracks) ? data.tracks : []).map(safeTrack).filter(Boolean);
  catalog = [...pinnedTracks];
  learning = lessons && typeof lessons.lessons === "object" && lessons.lessons ? lessons.lessons : {};
  studioDrafts = Array.isArray(drafts?.tracks) ? drafts.tracks.filter(item =>
    ["A1","A2","B1"].includes(item.level) && Number.isInteger(item.day)
    && typeof item.lyrics === "string" && item.lyrics.length <= 6000
  ) : [];
  populateFeatured();
  populateFilters();
  renderCatalog();
  const id = initialId || location.pathname.match(/\/music\/songs\/([a-z0-9-]+)\.html$/)?.[1];
  const track = catalog.find(song => song.id === id);
  if (track) showSong(track, false, false);
  refreshMusic();
}).catch(error => {
  byId("library-status").textContent = error.message;
  byId("song-count").textContent = "Unavailable";
  byId("featured-play").disabled = true;
});