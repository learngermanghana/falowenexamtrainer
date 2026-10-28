// Falowen Music's static listening room. No authentication, tracking, AI calls,
// Firestore writes or generated media. Only catalog-approved recordings play.
const byId = id => document.getElementById(id);
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
let current = null;
let selected = null;
let category = "all";
let featured = null;
const initialParams = new URLSearchParams(location.search);
const initialId = (document.body.dataset.track || initialParams.get("track") || "").trim();

function safeAudioUrl(value) {
  try {
    const url = new URL(String(value || ""), location.origin);
    if (url.protocol !== "https:" && !(url.origin === location.origin && location.protocol === "http:")) return "";
    if (url.username || url.password) return "";
    if (url.origin === location.origin && !url.pathname.startsWith("/music/")) return "";
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
function songUrl(track) {
  // New R2 uploads have a live dynamic page even before publishing a
  // separate static SEO/share document in GitHub.
  if (track.autoDiscovered) return new URL("/?track=" + encodeURIComponent(track.id), location.origin);
  return new URL("/music/songs/" + encodeURIComponent(track.id) + ".html", location.origin);
}
function setShareText(label) {
  byId("share").textContent = label;
  byId("detail-share").textContent = label === "Link copied!" ? "Link copied!" : "Copy song link";
}
async function shareCurrent() {
  if (!current && !selected) return;
  const url = songUrl(selected || current).href;
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
  levelInput.replaceChildren();
  available.forEach(level => levelInput.add(new Option(level, level)));
  const queryLevel=(initialParams.get("level") || "").toUpperCase();
  levelInput.value = available.includes(oldLevel) ? oldLevel : available.includes(queryLevel) ? queryLevel : "A1";
  dayInput.replaceChildren(new Option("All 28 days", ""));
  for(let day=1;day<=28;day++) dayInput.add(new Option("Day "+day,String(day)));
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
  const q = searchInput.value.trim().toLocaleLowerCase();
  const level = levelInput.value || "A1";
  const day = dayInput.value ? Number(dayInput.value) : null;
  const genre = genreInput.value;
  const matches = track => (!genre || track.genre === genre)
    && (!q || [track.title,track.topic,track.type,track.level,track.assignmentKey,track.genre]
      .join(" ").toLocaleLowerCase().includes(q));
  const lessonTracks = catalog.filter(track => track.category === "lesson"
    && track.level === level && matches(track) && (!day || track.day === day));
  const motivationTracks = catalog.filter(track => track.category === "motivation"
    && matches(track) && !day);
  tracksRoot.replaceChildren();
  const days = day ? [day] : Array.from({length:28},(_,index)=>index+1);
  if(category !== "motivation") {
    for (const dayNumber of days) {
      const group = el("section","day-group");
      group.setAttribute("aria-label",level + " Day " + dayNumber);
      const header = el("div","day-heading");
      header.append(el("strong","",level+" · Day "+dayNumber));
      const dayTracks = lessonTracks.filter(track => track.day === dayNumber);
      header.append(el("small","",dayTracks.length ? dayTracks.length + (dayTracks.length===1?" song":" songs") : "No song yet"));
      group.append(header);
      if(dayTracks.length) dayTracks.forEach(track=>group.append(card(track)));
      else group.append(el("div","empty-day","No song yet · Upload to music/"+level.toLowerCase()+"/day-"+String(dayNumber).padStart(2,"0")+"/"));
      tracksRoot.append(group);
    }
  }
  if((category === "all" || category === "motivation") && motivationTracks.length) {
    const group=el("section","motivation-area");
    group.append(el("h3","","Classroom motivation"));
    const grid=el("div","motivation-grid");
    motivationTracks.forEach(track=>grid.append(card(track)));
    group.append(grid);
    tracksRoot.append(group);
  }
  const count=category==="motivation" ? motivationTracks.length : lessonTracks.length+(category==="all" ? motivationTracks.length : 0);
  byId("song-count").textContent = count + (count===1?" song":" songs") + (category==="motivation"?"":" · 28 days / "+level);
  if(category==="motivation" && !motivationTracks.length)
    tracksRoot.append(el("div","empty","No matching classroom motivation tracks."));
}
function setTab(name) {
  if (!["listen", "lyrics", "practice"].includes(name)) return;
  const lesson = selected && learning[selected.id];
  if (!lesson && name !== "listen") return;
  document.querySelectorAll(".lesson-tabs button").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.tab === name));
  });
  for (const id of ["listen", "lyrics", "practice"]) byId("detail-" + id).hidden = id !== name;
}
function renderLyrics(lesson) {
  const root = byId("lyrics-text");
  root.replaceChildren();
  const parts = String(lesson.lyrics || "").split(/(?=\[(?:Verse \d+|Chorus|Outro|Bridge)\])/).filter(Boolean);
  parts.forEach(part => {
    const lines = part.trim().split("\n");
    const first = lines[0].match(/^\[([^\]]+)\]$/);
    const block = el("div", "lyrics-verse");
    if (first) {
      block.append(el("h4", "", first[1]));
      lines.shift();
    }
    const text = el("p", "", lines.join("\n").trim());
    text.lang = "de";
    block.append(text);
    root.append(block);
  });
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
  const hasLesson = Boolean(lesson && lesson.assignmentKey === track.assignmentKey && Array.isArray(lesson.questions));
  byId("detail-eyebrow").textContent = track.level === "ALL" ? "FALOWEN · CLASSROOM MUSIC" : "FALOWEN · " + track.level + " · DAY " + track.day;
  byId("detail-title").textContent = track.title;
  byId("detail-meta").textContent = [track.topic, track.genre || track.type, track.language].join(" · ");
  byId("listen-prompt").textContent = hasLesson
    ? "First listen without reading. " + lesson.summary + ". Which key words can you hear?"
    : "Listen, relax and enjoy this Falowen classroom song. You can play it again with the repeat control.";
  byId("course-link").hidden = !hasLesson;
  if (hasLesson) byId("course-link").href = /^https:\/\/www\.falowen\.app\/campus\/course\/[a-z0-9-]+$/.test(lesson.courseUrl || "")
    ? lesson.courseUrl : "https://www.falowen.app/campus"; 
  byId("listen-next").hidden = !hasLesson;
  for (const tab of ["lyrics","practice"]) {
    document.querySelector('[data-tab="' + tab + '"]').hidden = !hasLesson;
  }
  if (hasLesson) {
    renderLyrics(lesson);
    renderQuestions(lesson);
  } else {
    byId("lyrics-text").replaceChildren();
    byId("vocab-list").replaceChildren();
    byId("listening-questions").replaceChildren();
  }
  byId("song-detail").hidden = false;
  setTab("listen");
  document.title = track.title + " · Falowen Music";
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = "Listen to " + track.title + " on Falowen Music" + (hasLesson ? ", read German lyrics and practise listening." : ".");
}
function showSong(track, autoplay = false, navigate = true) {
  selected = track;
  setPlayer(track, autoplay);
  renderDetail(track);
  if (navigate && location.pathname + location.search !== songUrl(track).pathname + songUrl(track).search) history.pushState({ trackId: track.id }, "", songUrl(track).pathname + songUrl(track).search);
  byId("song-detail").scrollIntoView({ behavior: "smooth", block: "start" });
}
function closeDetail(navigate = true) {
  selected = null;
  byId("song-detail").hidden = true;
  document.title = "Falowen Music · Learn German through songs";
  if (navigate && (location.pathname !== "/" || location.search)) history.pushState(null, "", "/");
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
  levelInput.value = "A1";
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
  byId("discovery-status").textContent="Checking new music uploads…";
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
    byId("discovery-status").textContent="Music folders checked · "+dynamic.length+" R2 song file(s) found. Refresh again after uploading.";
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
]).then(([data, lessons]) => {
  pinnedTracks = (Array.isArray(data.tracks) ? data.tracks : []).map(safeTrack).filter(Boolean);
  catalog = [...pinnedTracks];
  learning = lessons && typeof lessons.lessons === "object" && lessons.lessons ? lessons.lessons : {};
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