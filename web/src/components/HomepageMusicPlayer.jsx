import React, { useEffect, useRef, useState } from "react";
import { loadHomepageSongs, PUBLIC_MUSIC_ORIGIN } from "../lib/homepageMusic";
import "./HomepageMusicPlayer.css";

const COPY = {
  en: { kicker: "FALOWEN MUSIC", title: "A little German. A good beat.", intro: "Listen to original German songs. Find new words, familiar stories and a rhythm that stays with you.", free: "Free to listen · No account needed", explore: "Explore all German music", choose: "Find your next favourite", now: "ON THE PLAYER", play: "Play", pause: "Pause", loading: "Loading songs…", buffering: "Loading audio…", error: "This song couldn’t play. Try again or listen on Falowen Music.", unavailable: "Discover the songs on Falowen Music.", open: "Lyrics & more", all: "All levels", credits: "Photo credits" },
  de: { kicker: "FALOWEN MUSIK", title: "Ein bisschen Deutsch. Ein guter Beat.", intro: "Höre eigene deutsche Songs. Entdecke neue Wörter, vertraute Geschichten und Musik, die im Kopf bleibt.", free: "Kostenlos hören · Ohne Anmeldung", explore: "Alle deutschen Songs entdecken", choose: "Finde deinen nächsten Lieblingssong", now: "IM PLAYER", play: "Abspielen", pause: "Pausieren", loading: "Songs werden geladen…", buffering: "Audio wird geladen…", error: "Dieser Song konnte nicht abgespielt werden. Versuche es erneut oder höre ihn bei Falowen Musik.", unavailable: "Entdecke die Songs bei Falowen Musik.", open: "Songtext & mehr", all: "Alle Niveaus", credits: "Bildnachweise" },
  fr: { kicker: "FALOWEN MUSIQUE", title: "Un peu d’allemand. Un bon rythme.", intro: "Écoutez nos chansons en allemand. Découvrez des mots, des histoires et un rythme qui reste en tête.", free: "Écoute gratuite · Sans compte", explore: "Découvrir toutes les chansons", choose: "Trouvez votre prochain coup de cœur", now: "À L’ÉCOUTE", play: "Écouter", pause: "Pause", loading: "Chargement des chansons…", buffering: "Chargement audio…", error: "Impossible de lire cette chanson. Réessayez ou écoutez-la sur Falowen Music.", unavailable: "Découvrez les chansons sur Falowen Music.", open: "Paroles et plus", all: "Tous niveaux", credits: "Crédits photo" },
};

function Cover({ track, className = "" }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [track?.cover]);
  return <div className={`home-music-cover ${className}`}>
    {track?.cover && !failed ? <img src={track.cover} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} /> : <span aria-hidden="true">♫</span>}
  </div>;
}

export default function HomepageMusicPlayer({ language = "en" }) {
  const copy = COPY[language] || COPY.en;
  const sectionRef = useRef(null);
  const audioRef = useRef(null);
  const requestRef = useRef(0);
  const [nearby, setNearby] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [failed, setFailed] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") { setNearby(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearby(true); observer.disconnect(); }
    }, { rootMargin: "250px" });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!nearby) return undefined;
    const controller = new AbortController();
    loadHomepageSongs(controller.signal).then((songs) => {
      if (controller.signal.aborted) return;
      setTracks(songs); setSelected(songs[0]);
    }).catch(() => { if (!controller.signal.aborted) setUnavailable(true); });
    return () => controller.abort();
  }, [nearby]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => { requestRef.current += 1; audio?.pause(); audio?.removeAttribute("src"); };
  }, []);

  const play = async (track) => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    const request = ++requestRef.current;
    setFailed(false);
    if (audio.getAttribute("src") === track.audioUrl && !audio.paused) {
      audio.pause(); setBuffering(false); return;
    }
    if (audio.getAttribute("src") !== track.audioUrl || audio.error) {
      audio.pause(); audio.src = track.audioUrl;
    }
    setSelected(track); setBuffering(true);
    try {
      await audio.play();
      if (request === requestRef.current) setBuffering(false);
    } catch (error) {
      if (request === requestRef.current) { setBuffering(false); setPlaying(false); setFailed(true); }
    }
  };

  return <section ref={sectionRef} className="home-music" aria-labelledby="homepage-music-title">
    <div className="home-music-intro">
      <span className="home-music-kicker">{copy.kicker}</span>
      <h2 id="homepage-music-title">{copy.title}</h2>
      <p>{copy.intro}</p>
      <span className="home-music-free"><span aria-hidden="true">●</span> {copy.free}</span>
      <a className="home-music-explore" href={PUBLIC_MUSIC_ORIGIN + "/"}>{copy.explore} <span aria-hidden="true">↗</span></a>
    </div>
    <div className="home-music-listening-room">
      <div className="home-music-player">
        <Cover track={selected} className="home-music-main-cover" />
        <div className="home-music-now">
          <span className="home-music-kicker">{copy.now}</span>
          <h3>{selected?.title || (unavailable ? "Falowen Music" : copy.loading)}</h3>
          {selected && <p className="home-music-genre">{selected.level === "ALL" ? copy.all : selected.level} · {selected.genre}</p>}
          <button className="home-music-play" type="button" disabled={!selected} aria-label={`${playing ? copy.pause : copy.play}${selected ? ` ${selected.title}` : ""}`} onClick={() => play(selected)}>
            <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span> {playing ? copy.pause : copy.play}
          </button>
          {selected && <a className="home-music-song-link" href={selected.songUrl}>{copy.open} ↗</a>}
        </div>
      </div>
      <audio ref={audioRef} className="home-music-audio" controls preload="none" aria-label={selected?.title || "Falowen Music"}
        onPlay={() => { setPlaying(true); setFailed(false); }} onPause={() => { setPlaying(false); setBuffering(false); }} onEnded={() => { setPlaying(false); setBuffering(false); }}
        onWaiting={() => setBuffering(true)} onPlaying={() => setBuffering(false)}
        onError={() => { setFailed(true); setPlaying(false); setBuffering(false); }} />
      <div className="home-music-status" role="status">{failed ? copy.error : unavailable ? copy.unavailable : buffering ? copy.buffering : ""}</div>
      {tracks.length > 0 && <div className="home-music-picks">
        <h3>{copy.choose}</h3>
        <div className="home-music-track-list">
          {tracks.map((track) => <button key={track.id} className={`home-music-track${selected?.id === track.id ? " is-selected" : ""}`} type="button" aria-label={`${copy.play} ${track.title}`} aria-pressed={selected?.id === track.id} onClick={() => play(track)}>
            <Cover track={track} />
            <span className="home-music-track-copy"><strong>{track.title}</strong><small>{track.level === "ALL" ? copy.all : track.level} · Falowen Music</small></span>
            <span className="home-music-track-arrow" aria-hidden="true">{selected?.id === track.id && playing ? "♫" : "↗"}</span>
          </button>)}
        </div>
      </div>}
      <a className="home-music-credits" href={PUBLIC_MUSIC_ORIGIN + "/music/covers/credits.html"}>{copy.credits}</a>
    </div>
  </section>;
}
