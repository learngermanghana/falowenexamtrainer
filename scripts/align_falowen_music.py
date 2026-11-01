#!/usr/bin/env python3
"""Offline Falowen Music MP3-to-lyric alignment; never runs in Vercel or student browsers.

Example:
  python -m pip install faster-whisper
  python scripts/align_falowen_music.py --level B1 --day 4 --include-drafts
  python scripts/align_falowen_music.py --all --limit 60
  python scripts/align_falowen_music.py --apply-report /tmp/falowen-music-timing-review/SONG.json --reviewed

Dry runs write JSON review reports only. Applying requires explicit listening review
and updates only the exact approved recording in approved-recording-lyrics.json.
"""
import argparse
import difflib
import hashlib
import json
import re
import tempfile
import unicodedata
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
MUSIC = ROOT / "web" / "public" / "music"
API = "https://www.falowen.app"
MAX_AUDIO_BYTES = 32 * 1024 * 1024
TOKEN_PATTERN = re.compile(r"[a-z0-9]+", re.I)


def read_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def sung_lines(lyrics):
    return [line.strip() for line in lyrics.replace("\\n", "\n").splitlines()
            if line.strip() and not (line.strip().startswith("[") and line.strip().endswith("]"))]


def tokens(text):
    value = unicodedata.normalize("NFKD", text.casefold().replace("ß", "ss"))
    value = "".join(c for c in value if not unicodedata.combining(c))
    return TOKEN_PATTERN.findall(value)


def monotone_word_matching(expected, observed):
    """Needleman-Wunsch word alignment, preserving repeated choruses in order.
    A matched word must be text-identical and its audio position monotonic;
    substitutions/insertions/deletions do not generate timestamps.
    """
    n=len(expected)
    m=len(observed)
    if n*m>1500000:
        raise ValueError("Transcript too large to align safely")
    previous=[-j for j in range(m+1)]
    back=[bytearray(m+1) for _ in range(n+1)]
    for i in range(1,n+1):
        current=[-i]+[0]*m
        for j in range(1,m+1):
            equal=expected[i-1][1]==observed[j-1][0]
            diagonal=previous[j-1]+(4 if equal else -3)
            delete=previous[j]-1
            insert=current[j-1]-1
            best=max(diagonal,delete,insert)
            current[j]=best
            back[i][j]=1 if equal and best==diagonal else (2 if best==delete else 3)
        previous=current
    matched=[[] for _ in range(max(line_i for line_i,_ in expected)+1)]
    i,j=n,m
    while i>0 and j>0:
        direction=back[i][j]
        if direction==1:
            line_i=expected[i-1][0]
            matched[line_i].append((observed[j-1][1],observed[j-1][2]))
            i-=1
            j-=1
        elif direction==2:
            i-=1
        else:
            j-=1
    for line in matched:
        line.reverse()
    return matched


def match_transcript(lyrics, recognized, duration, minimum_coverage=0.70, minimum_line=0.45):
    """Match Whisper words to ALL written lines in chronological order.

    SequenceMatcher matches repeated choruses in order. Confidence checks fail
    closed rather than inventing timestamps for words Whisper did not recognize.
    recognized: list of (word, start_seconds, end_seconds).
    """
    lines = sung_lines(lyrics)
    expected = [(i, word) for i, line in enumerate(lines) for word in tokens(line)]
    observed = []
    for word, start, end in recognized:
        if start is None or end is None or end <= start:
            continue
        for token in tokens(word):
            observed.append((token, float(start), float(end)))
    if not expected or not observed or not duration:
        raise ValueError("Missing lyrics, word timestamps or recording duration")
    matcher = difflib.SequenceMatcher(a=[x[1] for x in expected],
                                      b=[x[0] for x in observed], autojunk=False)
    matched = [[] for _ in lines]
    for a, b, n in matcher.get_matching_blocks():
        for k in range(n):
            line_index = expected[a+k][0]
            matched[line_index].append((observed[b+k][1], observed[b+k][2]))
    total_ratio = sum(len(row) for row in matched) / len(expected)
    line_counts = [sum(1 for idx, _ in expected if idx == line_i) for line_i in range(len(lines))]
    fractions = [len(row)/count if count else 0 for row, count in zip(matched,line_counts)]
    if total_ratio < minimum_coverage or min(fractions) < minimum_line:
        alternative=monotone_word_matching(expected,observed)
        alt_fraction=[len(row)/count if count else 0 for row,count in zip(alternative,line_counts)]
        alt_total=sum(len(row) for row in alternative)/len(expected)
        # The global alignment may recover repeated chorus words that
        # SequenceMatcher skipped. Never replace a result if its weakest line
        # or total coverage would be worse.
        if (min(alt_fraction)>min(fractions) and
                alt_total>=minimum_coverage and
                min(alt_fraction)>=minimum_line):
            matched=alternative
            total_ratio=alt_total
            fractions=alt_fraction
    if total_ratio < minimum_coverage or min(fractions) < minimum_line:
        raise ValueError("Low acoustic match: total=%.1f%%, weakest line=%.1f%%" %
                         (100*total_ratio, 100*min(fractions)))
    cues = []
    for i, (line, row) in enumerate(zip(lines, matched)):
        start = max(0, row[0][0]-0.12)
        end = min(float(duration), row[-1][1]+0.16)
        if i+1 < len(matched):
            end = min(end, matched[i+1][0][0]-0.06)
        if cues and start <= cues[-1]["start"]:
            raise ValueError("Non-increasing line timing at line %d" % (i+1))
        if end <= start:
            raise ValueError("Non-positive vocal interval at line %d" % (i+1))
        cues.append({"start": round(start,2), "end":round(end,2), "text":line})
    return {"cues":cues, "matchCoverage":round(total_ratio,3),
            "weakestLineCoverage":round(min(fractions),3),
            "totalLines":len(lines)}


def fetch_json(url):
    with urllib.request.urlopen(urllib.request.Request(url,headers={
            "User-Agent":"FalowenMusicOfflineAlignment/1.0"}),timeout=35) as res:
        if res.status != 200:
            raise ValueError("Music library unavailable")
        return json.load(res)


def download_public_music(track, dest):
    """Only fetch the exact, public music track; follow signed R2 media redirects."""
    track_id = track["id"]
    if not re.fullmatch(r"[A-Za-z0-9_-]{3,240}", track_id):
        raise ValueError("Unsafe public music track ID")
    if not re.fullmatch(r"music/(a1|a2|b1)/day-(0[1-9]|1[0-9]|2[0-8])/.+\.mp3",
                        track.get("objectKey",""),flags=re.I):
        raise ValueError("Not an approved public music-folder MP3")
    url = API + "/api/music?track=" + track_id
    request = urllib.request.Request(url,headers={"User-Agent":"FalowenMusicOfflineAlignment/1.0"})
    with urllib.request.urlopen(request,timeout=50) as response:
        final = urlparse(response.geturl())
        host = (final.hostname or "").lower()
        if final.scheme != "https" or not (
                host == "www.falowen.app" or host.endswith(".r2.cloudflarestorage.com")):
            raise ValueError("Unexpected media redirect destination")
        digest = hashlib.sha256()
        size = 0
        with open(dest,"wb") as file:
            while True:
                buf = response.read(1024*256)
                if not buf:
                    break
                size += len(buf)
                if size > MAX_AUDIO_BYTES:
                    raise ValueError("MP3 exceeds 32 MB safety limit")
                digest.update(buf)
                file.write(buf)
        if size < 2048:
            raise ValueError("Received no playable MP3 audio")
    return digest.hexdigest(), size


def known_lyrics(track, approved, studio, allow_drafts):
    exact = next((r for r in approved.get("recordings", [])
                  if r.get("objectKey")==track["objectKey"]), None)
    if exact:
        return exact, "approved"
    if not allow_drafts:
        return None, "no-approved-lyrics"
    options = [r for r in studio.get("tracks", [])
               if r.get("level")==track.get("level") and r.get("day")==track.get("day")]
    match = next((r for r in options if r.get("title","").casefold()==str(track.get("title","")).casefold()),None)
    match = match or (options[0] if len(options)==1 else None)
    if match and match.get("lyrics"):
        return match,"draft-review-only"
    return None,"no-draft-lyrics"


def select_tracks(rows, level, day, track_id, all_tracks, limit):
    rows = [r for r in rows if r.get("level") in ("A1","A2","B1") and r.get("coursebook")]
    if level:
        rows = [r for r in rows if r["level"]==level]
    if day:
        rows = [r for r in rows if int(r["day"])==day]
    if track_id:
        rows = [r for r in rows if r["id"]==track_id or r["objectKey"]==track_id]
    if not all_tracks and not track_id and not (level and day):
        raise ValueError("Specify --track, --level and --day, or --all")
    if not rows:
        raise ValueError("No published public music recordings match those filters")
    if len(rows)>limit:
        raise ValueError("%d songs matched, raise --limit explicitly to align more than %d" %
                         (len(rows),limit))
    return rows


def write_review(report, dest):
    dest.mkdir(parents=True,exist_ok=True)
    safe = re.sub(r"[^a-zA-Z0-9_-]+","-",report["trackId"])[:120]
    (dest / (safe + ".json")).write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",
                                           encoding="utf-8")


def apply_reviewed(approved, report, path):
    if report["source"]!="approved" or report["status"]!="candidate" or not report.get("cues"):
        raise ValueError("Only full owner-approved, acoustically matched recordings can be published")
    rows=approved["recordings"]
    row=next((r for r in rows if r.get("objectKey")==report["objectKey"]),None)
    if not row or row["lyrics"]!=report["lyrics"]:
        raise ValueError("Approved lyric text or song identity changed; regenerate candidate")
    prior=row.get("recordingSha256")
    if prior and prior!=report["recordingSha256"]:
        raise ValueError("MP3 fingerprint changed; cannot apply stale owner-approved lyrics")
    lines=sung_lines(report["lyrics"])
    cues=report["cues"]
    if len(cues)!=len(lines) or any(cue.get("text")!=line for cue,line in zip(cues,lines)):
        raise ValueError("Report does not have one matching cue for every approved lyric line")
    if any(not isinstance(c["start"],(int,float)) or not isinstance(c["end"],(int,float)) or
           c["start"]<0 or c["end"]<=c["start"] or c["end"]>report["duration"]
           for c in cues):
        raise ValueError("Invalid timing boundaries")
    if any(cues[i]["start"]<=cues[i-1]["start"] or cues[i]["start"]<=cues[i-1]["end"]
           for i in range(1,len(cues))):
        raise ValueError("Overlapping or unsorted lyrics")
    if report.get("matchCoverage",0)<.70 or report.get("weakestLineCoverage",0)<.45:
        raise ValueError("Report below alignment confidence gates")
    if not re.fullmatch(r"[0-9a-f]{64}",report.get("recordingSha256","")):
        raise ValueError("Missing recording fingerprint")
    row["cues"]=report["cues"]
    row["recordingSha256"]=report["recordingSha256"]
    row["duration"]=report["duration"]
    row["timingStatus"]="estimated"
    row["timingMethod"]="Locally generated Whisper small word timestamps, monotonic lyrics alignment; teacher listening review required"
    path.write_text(json.dumps(approved,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")


def run(args):
    approved_path=MUSIC / "approved-recording-lyrics.json"
    approved=read_json(approved_path)
    built_in=read_json(MUSIC/"timings.json")
    studio=read_json(MUSIC/"studio-drafts.json")
    tracks=select_tracks(fetch_json(API+"/api/music-library")["tracks"],
                         args.level,args.day,args.track,args.all,args.limit)
    existing={r.get("objectKey") for r in built_in["recordings"] if r.get("cues")}
    existing.update(r.get("objectKey") for r in approved["recordings"] if r.get("cues"))
    whisper=None
    counts={"candidate":0,"skipped":0,"review":0}
    for track in tracks:
        key=track["objectKey"]
        if key in existing and not args.force:
            print("Already timed:",key,"(use --force to realign)")
            counts["skipped"]+=1
            continue
        source, kind=known_lyrics(track,approved,studio,args.include_drafts)
        if not source:
            print("No reviewed lyrics:",key,"(add --include-drafts to inspect studio text)")
            counts["skipped"]+=1
            continue
        report={"trackId":track["id"],"objectKey":key,"level":track["level"],
                "day":track["day"],"source":kind,"status":"review-only",
                "lyrics":source["lyrics"]}
        with tempfile.TemporaryDirectory(prefix="falowen-alignment-") as tmp:
            mp3=Path(tmp)/"song.mp3"
            try:
                sha,size=download_public_music(track,mp3)
                report.update({"recordingSha256":sha,"audioBytes":size})
                if source.get("recordingSha256") and sha!=source["recordingSha256"]:
                    raise ValueError("Recording changed since approved lyrics were checked")
                if whisper is None:
                    try:
                        from faster_whisper import WhisperModel
                    except ImportError as error:
                        raise RuntimeError("Install faster-whisper locally first: python -m pip install faster-whisper") from error
                    whisper=WhisperModel(args.model,device="cpu",compute_type="int8")
                segments,info=whisper.transcribe(str(mp3),language="de",word_timestamps=True,
                                               vad_filter=False,beam_size=5,condition_on_previous_text=False)
                words=[(w.word,w.start,w.end) for segment in segments for w in segment.words or []]
                duration=info.duration
                result=match_transcript(source["lyrics"],words,duration)
                report.update(result)
                report["duration"]=round(duration,3)
                report["status"]="candidate" if kind=="approved" else "review-only"
                # Timing generation is never publication. Review JSON against
                # the final audio, then use --apply-report separately.
                print("Review:",key,"coverage",result["matchCoverage"],
                      "lines",result["totalLines"],"status",report["status"])
                counts["candidate"]+=1
            except Exception as error:
                report["status"]="needs-review"
                report["reason"]=str(error)
                counts["review"]+=1
                print("Needs review:",key,str(error))
            write_review(report,Path(args.output))
    print(json.dumps(counts))
    if counts["review"]:
        raise SystemExit(1)


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--track",help="Public song ID or exact music/...mp3 key")
    parser.add_argument("--level",choices=["A1","A2","B1"])
    parser.add_argument("--day",type=int)
    parser.add_argument("--all",action="store_true")
    parser.add_argument("--limit",type=int,default=3,help="Explicit max tracks per run (default 3)")
    parser.add_argument("--include-drafts",action="store_true",
                        help="Generate review-only candidates for studio lyrics; never publish them")
    parser.add_argument("--force",action="store_true",help="Reprocess existing timed recording")
    parser.add_argument("--model",default="small",help="Locally installed or downloaded Whisper model")
    parser.add_argument("--output",default="/tmp/falowen-music-timing-review")
    parser.add_argument("--apply-report",help="Path to a saved, listened-to candidate JSON report")
    parser.add_argument("--reviewed",action="store_true",help="Teacher confirms listening review of saved report")
    args=parser.parse_args()
    if args.limit<1 or args.limit>200: parser.error("--limit must be between 1 and 200")
    if args.day and not 1<=args.day<=28: parser.error("Day must be 1–28")
    if args.apply_report:
        if not args.reviewed:
            parser.error("--apply-report needs --reviewed (listen before publishing)")
        approved_path=MUSIC/"approved-recording-lyrics.json"
        apply_reviewed(read_json(approved_path),read_json(args.apply_report),approved_path)
        print("Published estimated timing into approved-recording-lyrics.json; review diff and run tests before merging.")
    else:
        run(args)


if __name__=="__main__":
    main()
