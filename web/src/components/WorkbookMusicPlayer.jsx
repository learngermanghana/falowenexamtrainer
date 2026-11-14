import React, { useEffect, useRef, useState } from 'react';
import { sungGermanLines } from '../utils/musicEnglishTranslations';
import './WorkbookMusicPlayer.css';
import useWorkbookMusicPractice from './useWorkbookMusicPractice';

export function workbookLyricCues(pack, lyrics) {
  const lines = sungGermanLines(lyrics), cues = pack?.cues;
  if (!lines.length || !Array.isArray(cues) || cues.length !== lines.length) return [];
  let previous = -1;
  for (let i=0;i<lines.length;i++) {
    const cue=cues[i];
    if (cue?.text !== lines[i] || !Number.isFinite(cue.start) || cue.start < 0 || cue.start <= previous ||
      (cue.end !== undefined && (!Number.isFinite(cue.end) || cue.end <= cue.start))) return [];
    previous=cue.start;
  }
  return cues;
}
export default function WorkbookMusicPlayer({ song, artwork, story, recording, lyrics, english, showEnglish, level = 'ALL', day = null, onActiveLine }) {
  const audio=useRef(null);
  const practice = useWorkbookMusicPractice({ trackId: song.id, title: song.title, level, day });
  const [playing,setPlaying]=useState(false),[video,setVideo]=useState(false),[time,setTime]=useState(0),[error,setError]=useState('');
  useEffect(()=>{setPlaying(false);setTime(0);setVideo(false);setError('');},[song.id]);
  const lines=sungGermanLines(lyrics);
  const cues=recording?.objectKey===song.objectKey ? workbookLyricCues(recording,lyrics) : [];
  let active=-1;
  for(let i=cues.length-1;i>=0;i--) {
    if(time>=cues[i].start) {if(cues[i].end===undefined || time<cues[i].end)active=i;break;}
  }
  useEffect(() => { onActiveLine?.(active); }, [active, onActiveLine]);
  async function togglePlay() {
    if(!audio.current)return;
    if(!audio.current.paused){audio.current.pause();return;}
    try {await audio.current.play();setError('');} catch {setError('Playback could not start. Use the audio controls to try again.');}
  }
  return <div className="workbook-music-player">
    <div className="workbook-music-hero">
      <div className="workbook-music-art"><img src={artwork} alt={'Song artwork for '+song.title} loading="lazy"
        onError={event=>{event.currentTarget.hidden=true;}}/><span aria-hidden="true">♫</span></div>
      <div className="workbook-music-info"><span className="workbook-music-eyebrow">FALOWEN MUSIC · LISTEN & LEARN</span>
        <h3>{song.title}</h3><p>{story?.storyEn || song.topic || 'Start with a song. Listen for familiar words, then explore the lyrics.'}</p>
        {story?.focusEn && <p className="workbook-music-focus"><strong>Practise:</strong> {story.focusEn}</p>}
        <div className="workbook-music-actions"><button type="button" onClick={togglePlay} aria-label={playing?'Pause song':'Play song'}>{playing?'Ⅱ Pause':'▶ Play song'}</button>
          <button type="button" onClick={()=>setVideo(value=>!value)} aria-pressed={video}>{video?'Hide lyric video':'Watch lyric video'}</button></div>
        <div className={'workbook-music-wave'+(playing?' is-playing':'')} aria-hidden="true">{Array.from({length:18},(_,i)=><i key={i} style={{'--bar':(i%5)+1}}/>)}</div>
      </div>
    </div>
    <audio key={song.id} ref={audio} data-music-audio="true" controls preload="none" src={song.audioUrl}
      aria-label={'Play '+song.title} style={{display:'block',width:'100%',height:50,colorScheme:'dark'}}
      onPlay={event=>{setPlaying(true);setError('');practice.play(event.currentTarget.currentTime);}}
      onPause={event=>{setPlaying(false);if(!event.currentTarget.ended) practice.pause(event.currentTarget.currentTime);}}
      onEnded={event=>{setPlaying(false);setTime(-1);practice.ended(event.currentTarget.currentTime,event.currentTarget.duration);}}
      onTimeUpdate={event=>{setTime(event.currentTarget.currentTime);practice.timeUpdate(event.currentTarget.currentTime);}}
      onSeeked={event=>{setTime(event.currentTarget.currentTime);practice.seeked(event.currentTarget.currentTime);}}
      onError={()=>{setPlaying(false);setError('This song could not load. Check your connection and try again.');}} />
    {error && <p role="alert">{error}</p>}
    <a className="workbook-music-credits" href="/music/covers/credits.html" target="_blank" rel="noopener noreferrer">Artwork credits ↗</a>
    {(recording?.transcriptionStatus==='automatic' || recording?.referenceOnly) && !video && <small>{recording?.transcriptionStatus==='automatic'?'Automatic transcript draft':'Lyric draft'} · words need teacher review.</small>}
    {recording?.timingStatus==='estimated' && !video && <small>Estimated line timing · listen and check.</small>}
    {video && <div className="workbook-music-video" aria-label="Lyric video" style={{backgroundImage:`linear-gradient(180deg,rgba(9,20,30,.65),rgba(9,20,30,.92)),url("${artwork}")`}}>
      <span className="workbook-music-eyebrow">{song.title}</span>
      {cues.length ? <><p className="workbook-music-video-line" lang={song.language === "Swahili" ? "sw" : "de"}>{active>=0?lines[active]:time===0?'Press Play to follow the lyrics':'♫'}</p>
        {showEnglish && active>=0 && english?.lines?.[active]?.en && <p lang="en">{english.lines[active].en}</p>}</>
        : <><p className="workbook-music-video-line">Listen and explore the lyrics below.</p><p>Line highlighting is unavailable for this recording. Open the lyrics to read along at your own pace.</p></>}
      {(recording?.transcriptionStatus==='automatic' || recording?.referenceOnly) && <small>{recording?.transcriptionStatus==='automatic'?'Automatic transcript draft':'Lyric draft'} · words need teacher review.</small>}
      {recording?.timingStatus==='estimated' && <small>Estimated line timing · listen and check.</small>}
    </div>}
  </div>;
}
