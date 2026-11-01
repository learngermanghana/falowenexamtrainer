import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "align_falowen_music.py"
spec = importlib.util.spec_from_file_location("falowen_align", SCRIPT)
align = importlib.util.module_from_spec(spec)
spec.loader.exec_module(align)


class LocalMusicAlignmentTests(unittest.TestCase):
    def test_german_tokenization_and_verse_headers(self):
        self.assertEqual(align.tokens("Straße, schöne Häuser!"), ["strasse", "schone", "hauser"])
        self.assertEqual(align.sung_lines("[Verse 1]\nHallo!\n\n[Chorus]\nNoch einmal!"),
                         ["Hallo!", "Noch einmal!"])

    def test_repeated_chorus_keeps_distinct_timestamps_and_instrumental_gaps(self):
        lyrics = "[Verse 1]\nEin neuer Tag\n[Chorus]\nWir sind hier\n[Verse 2]\nEin neuer Weg\n[Chorus]\nWir sind hier"
        words = [("Ein",2,2.3),("neuer",2.4,2.8),("Tag",2.9,3.2),
                 ("Wir",5,5.3),("sind",5.4,5.7),("hier",5.8,6.1),
                 ("Ein",22,22.3),("neuer",22.4,22.8),("Weg",22.9,23.2),
                 ("Wir",25,25.3),("sind",25.4,25.7),("hier",25.8,26.1)]
        result = align.match_transcript(lyrics,words,30)
        self.assertEqual(result["totalLines"],4)
        self.assertEqual([x["text"] for x in result["cues"]],
                         ["Ein neuer Tag","Wir sind hier","Ein neuer Weg","Wir sind hier"])
        self.assertGreater(result["cues"][3]["start"],24)
        self.assertLess(result["cues"][1]["end"],8)
        self.assertEqual(result["matchCoverage"],1)

    def test_weak_matches_fail_closed_instead_of_synthetic_time_estimates(self):
        with self.assertRaisesRegex(ValueError,"Low acoustic match"):
            align.match_transcript("Hallo mein Haus\nWir gehen ins Kino",
                                   [("Hallo",1,2),("fremde",2,3),("Wörter",3,4)],10)

    def test_rejects_private_course_audio(self):
        with tempfile.TemporaryDirectory() as d:
            with self.assertRaisesRegex(ValueError,"Not an approved public music"):
                align.download_public_music({"id":"r2-a1-day-04",
                       "objectKey":"a1/day-04/hoeren.mp3"}, Path(d)/"audio.mp3")

    def test_selection_and_draft_never_publish_as_approved(self):
        tracks=[{"id":"a","objectKey":"music/b1/day-04/Ort zum Leben.mp3",
                 "level":"B1","day":4,"coursebook":True}]
        self.assertEqual(len(align.select_tracks(tracks,"B1",4,None,False,3)),1)
        with self.assertRaises(ValueError):
            align.select_tracks(tracks,None,None,None,False,3)
        approved={"recordings":[]}
        studio={"tracks":[{"level":"B1","day":4,"assignmentKey":"B1-2.4",
                            "title":"Ein Zimmer mit Licht","lyrics":"[Verse 1]\nHallo"}]}
        self.assertEqual(align.known_lyrics(tracks[0],approved,studio,False)[1],
                         "no-approved-lyrics")
        draft,kind=align.known_lyrics(tracks[0],approved,studio,True)
        self.assertEqual(kind,"draft-review-only")
        self.assertEqual(draft["assignmentKey"],"B1-2.4")

    def test_review_can_only_apply_full_exact_approved_candidate(self):
        approved={"recordings":[{"objectKey":"music/a1/day-09/test.mp3","lyrics":"[Verse]\nHallo"}]}
        base={"trackId":"test","objectKey":"music/a1/day-09/test.mp3",
              "source":"approved","status":"candidate","lyrics":"[Verse]\nHallo",
              "duration":10.0,"recordingSha256":"a"*64,"matchCoverage":1,
              "weakestLineCoverage":1,
              "cues":[{"text":"Hallo","start":1.0,"end":2.0}]}
        with tempfile.TemporaryDirectory() as d:
            path=Path(d)/"approved.json"
            align.apply_reviewed(approved,dict(base),path)
            self.assertEqual(json.loads(path.read_text())["recordings"][0]["cues"],base["cues"])
            self.assertEqual(approved["recordings"][0]["timingStatus"],"estimated")
            for patch in [{"source":"draft-review-only"},{"lyrics":"Tschüss"},
                          {"cues":[{"text":"Falsch","start":1,"end":2}]},
                          {"matchCoverage":0.1}]:
                with self.assertRaises(ValueError):
                    align.apply_reviewed({"recordings":[{"objectKey":base["objectKey"],
                            "lyrics":base["lyrics"]}]},{**base,**patch},path)


if __name__=="__main__":
    unittest.main()
