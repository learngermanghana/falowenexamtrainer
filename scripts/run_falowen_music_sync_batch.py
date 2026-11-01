#!/usr/bin/env python3
"""Produce audio-backed timing candidates for existing Falowen recordings.
Every output remains a review report, NOT a verified/published lyric pack.
The GitHub Actions runner never accesses private R2 keys.
"""
import importlib.util
import json
import os
import sys
import tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("align_falowen_music",ROOT/"scripts"/"align_falowen_music.py")
align=importlib.util.module_from_spec(spec)
spec.loader.exec_module(align)

TARGETS=[
 ("A1",2),("A1",3),("A1",4),("A1",21),("A1",22),
 ("A2",8),("A2",23),("A2",24),
 ("B1",4),
]

def main():
    library=align.fetch_json(align.API+"/api/music-library")
    tracks=library.get("tracks") or []
    approved=align.read_json(align.MUSIC/"approved-recording-lyrics.json")
    studio=align.read_json(align.MUSIC/"studio-drafts.json")
    output=ROOT/"docs"/"music-timing-candidates"
    output.mkdir(parents=True,exist_ok=True)
    selected=[]
    for level,day in TARGETS:
        matches=[r for r in tracks if r.get("level")==level and r.get("day")==day and r.get("coursebook")]
        if len(matches)!=1:
            print(f"SKIP {level} day {day}: {len(matches)} public songs",flush=True)
            continue
        selected.append(matches[0])
    if not selected:
        raise RuntimeError("No public MP3s could be resolved from Falowen music-library")
    from faster_whisper import WhisperModel
    print("Loading CPU Whisper small (once for batch)",flush=True)
    model=WhisperModel("small",device="cpu",compute_type="int8",cpu_threads=4,num_workers=1)
    tally={"candidate":0,"review-only":0,"needs-review":0}
    for track in selected:
        source,kind=align.known_lyrics(track,approved,studio,True)
        print(f"SONG {track['level']} Day {track['day']}: {track['objectKey']}; source={kind}",flush=True)
        if not source:
            print("  No candidate German lyrics: skip",flush=True)
            continue
        report={"trackId":track["id"],"objectKey":track["objectKey"],
                "level":track["level"],"day":track["day"],"source":kind,
                "lyrics":source["lyrics"],"status":"needs-review"}
        try:
            with tempfile.TemporaryDirectory(prefix="falowen-music-") as temp:
                file=Path(temp)/"song.mp3"
                sha,size=align.download_public_music(track,file)
                report["recordingSha256"]=sha
                report["audioBytes"]=size
                if source.get("recordingSha256") and source["recordingSha256"]!=sha:
                    raise ValueError("MP3 changed since published lyrics were approved")
                segments,info=model.transcribe(str(file),language="de",word_timestamps=True,
                                               beam_size=5,vad_filter=False,condition_on_previous_text=False)
                words=[(w.word,w.start,w.end) for seg in segments for w in (seg.words or [])]
                result=align.match_transcript(source["lyrics"],words,info.duration)
                report.update(result)
                report["duration"]=round(info.duration,3)
                report["status"]="candidate" if kind=="approved" else "review-only"
        except Exception as error:
            report["reason"]=str(error)[:500]
            print("  NEEDS REVIEW:",report["reason"],flush=True)
        tally[report["status"]]+=1
        out=output/("falowen-"+track["level"].lower()+"-day-"+str(track["day"]).zfill(2)+".json")
        align.write_review(report,output)
        out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
        print("  RESULT",json.dumps({k:report.get(k) for k in ("status","totalLines","matchCoverage","weakestLineCoverage","reason")},ensure_ascii=False),flush=True)
    print("SUMMARY",json.dumps(tally),flush=True)
    if tally["candidate"]+tally["review-only"]==0:
        raise SystemExit("No usable timing candidates generated; see reports for why.")

if __name__=="__main__":
    main()
