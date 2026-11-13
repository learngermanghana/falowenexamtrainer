import React from "react";
import { MGAHAWANI_SONG } from "../data/swahili/mgahawaniGrammarAndSong";

export default function MgahawaniSong() {
  return <section className="swahili-book__card swahili-book__activity mgahawani-song" aria-label="Music">
    <div className="mgahawani-song__heading">
      <div className="mgahawani-song__symbol" aria-hidden="true">♫</div>
      <div>
        <p className="mgahawani-grammar__eyebrow">Somo la 6 · Muziki</p>
        <h2>{MGAHAWANI_SONG.title}</h2>
        <p>Song lyrics · Learn to order food politely, ask prices and pay.</p>
      </div>
    </div>
    <p className="swahili-book__note">The teacher has supplied the lyrics, but no song recording or synced lyric timings have been uploaded. Read or sing these words with your teacher for now.</p>
    <nav className="mgahawani-song__index" aria-label="Song sections">
      {MGAHAWANI_SONG.sections.map((section,i)=><a key={i} href={"#mgahawani-song-" + i}>{i+1}. {section.title}</a>)}
    </nav>
    <div className="mgahawani-song__sections">
      {MGAHAWANI_SONG.sections.map((section,index) => <article className="mgahawani-song__verse" id={"mgahawani-song-"+index} key={index}>
        <div className="mgahawani-song__verse-head"><span>{String(index+1).padStart(2,"0")}</span><h3>{section.title}</h3></div>
        <div className="mgahawani-song__lines" lang="sw">
          {section.lines.map((line,i) => <p key={i}>{line}</p>)}
        </div>
      </article>)}
    </div>
    <p className="swahili-book__small">From “22MGAHAWANI GRAMMAR AND SONG LYRICS.docx”. Recording and line-by-line synchronization can be added when the approved track is supplied.</p>
  </section>;
}