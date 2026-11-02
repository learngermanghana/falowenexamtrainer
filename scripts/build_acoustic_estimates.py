"""Build separate, explicitly unverified timing drafts from acoustic evidence.

Never modifies approved recording text or source-songbook lyrics. Strong text
matches retain the original wording. Mismatches use the recognizer's own words
and real word windows instead of forcing unrelated draft words onto the audio.
"""
import argparse
import json
import math
from pathlib import Path
from align_falowen_music import match_transcript


def automatic_transcript(words, duration):
    kept=[]
    for text,start,end in words:
        if not isinstance(text,str) or not text.strip():
            continue
        if not all(isinstance(v,(int,float)) and math.isfinite(v) for v in [start,end]):
            raise ValueError('Invalid acoustic word time')
        if end == start:
            # The recognizer supplied no acoustic interval for this token.
            # Do not invent a duration for it or make it a seek target.
            continue
        if not 0 <= start < end <= duration or (kept and start < kept[-1]['start']):
            raise ValueError('Unsorted acoustic word time')
        kept.append({'text':text.strip(),'start':round(start,2),'end':round(end,2)})
    if not kept:
        raise ValueError('No acoustic words')
    groups=[]
    current=[]
    for word in kept:
        if current and current[-1]['end'] <= word['start'] and (
            word['start']-current[-1]['end'] >= .45 or
            len(current) >= 8 or len(' '.join(x['text'] for x in current)) >= 60 or
            current[-1]['text'].endswith(('.', '!', '?'))):
            groups.append(current)
            current=[]
        current.append(word)
    if current:
        groups.append(current)
    cues=[{'text':' '.join(w['text'] for w in group),
           'start':group[0]['start'],'end':group[-1]['end']} for group in groups]
    return {'lyrics':'\n'.join(c['text'] for c in cues),'cues':cues,'wordTimestamps':kept}


def build_pack(report):
    if not report.get('words') or not report.get('recordingSha256'):
        raise ValueError('Missing recording evidence: '+report['objectKey'])
    pack={k:report[k] for k in ['objectKey','recordingSha256','duration']}
    pack['trackId']=report['trackId']
    pack['timingStatus']='estimated'
    pack['timingMethod']='Whisper small German word timestamps; teacher listening review required'
    try:
        matched=match_transcript(report['lyrics'],report['words'],report['duration'])
        pack.update({k:matched[k] for k in ['cues','matchCoverage','weakestLineCoverage']})
        pack['lyrics']=report['lyrics']
        if report['source']!='approved':
            pack.update(referenceOnly=True,assignmentKey=report['assignmentKey'],draftTitle=report['draftTitle'])
    except ValueError:
        pack.update(automatic_transcript(report['words'],report['duration']))
        pack.update(referenceOnly=True,transcriptionStatus='automatic')
    return pack


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('reports')
    parser.add_argument('output')
    args=parser.parse_args()
    reports=[json.loads(p.read_text()) for p in sorted(Path(args.reports).glob('*.json'))]
    packs=[build_pack(report) for report in reports]
    keys=[p['objectKey'] for p in packs]
    if len(set(keys))!=len(keys):
        raise ValueError('Duplicate recording report')
    Path(args.output).write_text(json.dumps({'version':1,
        'description':'Recording-bound acoustic timing drafts. Automatic transcripts and course drafts are unverified; approved source lyrics are preserved separately.',
        'recordings':packs},ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'recordings':len(packs),'matchingSource':sum(p.get('transcriptionStatus')!='automatic' for p in packs),
                      'automaticTranscriptDrafts':sum(p.get('transcriptionStatus')=='automatic' for p in packs)}))


if __name__=='__main__':
    main()
