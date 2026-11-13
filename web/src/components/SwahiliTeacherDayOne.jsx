import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collectionGroup, db, doc, getDoc, getDocs, limit, query, serverTimestamp, setDoc } from "../firebase";
import { SWAHILI_DAY_ONE } from "../data/swahili/dayOne";

// Instructor-only companion to Day 1. It does not add a workbook tab or publish new lessons.
// Student submissions remain in their original user-owned Firestore documents.
const SLIDES = [
  { title: "Somo la 1 · Alfabeti, sauti na matamshi", prompt: "Leo tunajifunza vokali, silabi na matamshi.", hint: "Introduce the learning goal; model each sound before asking students to repeat." },
  { title: "Vokali tano", prompt: "A · E · I · O · U", hint: "Students repeat forward and backward. Ask: Ni vokali gani unayosikia?" },
  { title: "Vokali katika maneno", prompt: SWAHILI_DAY_ONE.vowels.map(({ letter, word }) => letter + " — " + word).join("  |  "), hint: "Say one word at a time and ask students which vowel they hear." },
  { title: "Silabi za B", prompt: "ba · be · bi · bo · bu", hint: "Model slowly, then ask learners to read without your help." },
  { title: "Silabi za CH", prompt: "cha · che · chi · cho · chu", hint: "Compare CH with plain consonant combinations and repeat." },
  { title: "Miunganiko ya herufi", prompt: SWAHILI_DAY_ONE.combinations.map(({ letters, word }) => letters + " — " + word).join("  |  "), hint: "Focus on ng / ng’, s / sh and t / th. Correct pronunciation gently." },
  { title: "Mkazo wa neno", prompt: SWAHILI_DAY_ONE.stress.join("  |  "), hint: "Explain that stress usually falls on the penultimate syllable." },
  { title: "Mazoezi ya kuzungumza", prompt: "A · E · I · O · U\nba · be · bi · bo · bu\nchai · shule · nyanya · ng’ombe", hint: "Pair work: one student reads, the other repeats. Switch roles." },
  { title: "Kusikiliza · mazoezi ya mwalimu", prompt: "Sikiliza neno, kisha chagua vokali.", hint: "Teacher reads: " + SWAHILI_DAY_ONE.listening.map(x => x.word).join(", ") + ". Recorded audio is not yet available." },
  { title: "Kazi ya nyumbani", prompt: "Teil 2 · Kuandika\nTeil 3 · Kusoma\nSubmit · Wasilisha", hint: "Students complete writing and reading in the course book, then submit." },
];

export default function SwahiliTeacherDayOne({ basePath = "/swahili" }) {
  const [mode, setMode] = useState("slides");
  const [slideIndex, setSlideIndex] = useState(0);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [comments, setComments] = useState("");
  const [decision, setDecision] = useState("reviewed");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const selected = records.find((record) => record.studentId === selectedId);

  const loadSubmissions = async () => {
    if (!db) { setError("Firebase is unavailable."); return; }
    setLoading(true);
    setError("");
    try {
      // Load on demand; no real-time subscriptions or background polling.
      const snapshot = await getDocs(query(collectionGroup(db, "swahiliLessons"), limit(100)));
      const items = snapshot.docs
        .map((entry) => ({ ...entry.data(), path: entry.ref.path }))
        .filter((entry) => entry.program === "swahili" && entry.lessonId === "swahili-day-1" && entry.studentId)
        .sort((a, b) => (b.submittedAt?.seconds || 0) - (a.submittedAt?.seconds || 0));
      setRecords(items);
      if (items.length && !items.some((item) => item.studentId === selectedId)) setSelectedId(items[0].studentId);
    } catch (e) {
      setError("Could not open the review queue. Check staff access and published Firestore rules.");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (mode === "reviews") loadSubmissions();
    // Fetch only when the instructor chooses the review view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (!selectedId || !db || mode !== "reviews") return;
    let alive = true;
    setComments("");
    setDecision("reviewed");
    getDoc(doc(db, "swahiliTeacherReviews", selectedId)).then(snapshot => {
      if (!alive || !snapshot.exists()) return;
      setComments(snapshot.data().feedback || "");
      setDecision(snapshot.data().status || "reviewed");
    }).catch(() => {});
    return () => { alive = false; };
  }, [selectedId, mode]);

  const saveReview = async () => {
    if (!db || !selected) return;
    setSaving(true);
    setNotice("");
    try {
      await setDoc(doc(db, "swahiliTeacherReviews", selected.studentId), {
        studentId: selected.studentId,
        lessonId: "swahili-day-1",
        program: "swahili",
        status: decision,
        feedback: comments.trim().slice(0, 3000),
        reviewedAt: serverTimestamp(),
      }, { merge: true });
      setNotice("Teacher feedback saved.");
    } catch {
      setNotice("Unable to save. Check staff access and Firestore permissions.");
    } finally { setSaving(false); }
  };

  return (
    <main className="swahili-book" lang="sw">
      <div className="swahili-book__top"><strong>Falowen · Kiswahili · Teacher</strong><Link to={basePath + "/day-1"}>← Student workbook</Link></div>
      <header className="swahili-book__hero"><p className="swahili-book__eyebrow">SOMO LA 1 · MWALIMU</p><h1>Teacher presentation and review</h1><p>Uses yesterday’s Day 1 material. No extra student navigation or invented lessons.</p></header>
      <div className="swahili-book__row swahili-book__spaced">
        <button type="button" className="swahili-book__button" onClick={() => setMode("slides")}>Teacher slides</button>
        <button type="button" className="swahili-book__button swahili-book__button--soft" onClick={() => setMode("reviews")}>Student submissions</button>
      </div>
      {mode === "slides" ? (
        <section className="swahili-book__card swahili-book__activity" aria-label="Teacher presentation">
          <p className="swahili-book__small">Slide {slideIndex + 1} / {SLIDES.length}</p>
          <h2>{SLIDES[slideIndex].title}</h2>
          <div className="swahili-book__presentation-text">{SLIDES[slideIndex].prompt}</div>
          <details><summary>Teacher notes</summary><p>{SLIDES[slideIndex].hint}</p></details>
          <div className="swahili-book__row">
            <button type="button" className="swahili-book__button swahili-book__button--soft" disabled={slideIndex === 0} onClick={() => setSlideIndex((x) => x - 1)}>Previous</button>
            <button type="button" className="swahili-book__button" disabled={slideIndex === SLIDES.length - 1} onClick={() => setSlideIndex((x) => x + 1)}>Next</button>
          </div>
        </section>
      ) : (
        <section className="swahili-book__card swahili-book__activity" aria-label="Swahili student submissions">
          <div className="swahili-book__row"><h2>Day 1 review queue</h2><button className="swahili-book__button swahili-book__button--soft" onClick={loadSubmissions} disabled={loading}>Refresh</button></div>
          <p className="swahili-book__small">Manual refresh only. Showing up to 100 recent records; no automatic grading.</p>
          {error && <p role="alert" className="swahili-book__error">{error}</p>}
          {loading && <p>Loading submissions…</p>}
          {!loading && !records.length && !error && <p>No submitted Day 1 work found.</p>}
          {records.length > 0 && (
            <>
              <label htmlFor="swahili-review-student">Choose student
                <select id="swahili-review-student" value={selectedId} onChange={e => { setSelectedId(e.target.value); setNotice(""); }}>
                  {records.map(record => <option value={record.studentId} key={record.studentId}>{record.studentName || record.studentEmail || record.studentId}</option>)}
                </select>
              </label>
              {selected && (
                <>
                  <div className="swahili-book__tile"><strong>Teil 2 · Writing</strong><p>Vokali: {selected.writing?.vowels || "—"}</p><p>Silabi: {selected.writing?.syllables || "—"}</p><p>Maneno: {selected.writing?.words || "—"}</p></div>
                  <div className="swahili-book__tile"><strong>Teil 3 · Reading</strong>{SWAHILI_DAY_ONE.reading.map(item => <p key={item.id}>{item.question} — {selected.readingAnswers?.[item.id] || "—"}</p>)}</div>
                  <div className="swahili-book__tile"><strong>Teil 4 · Teacher-led (optional)</strong><p>{Object.values(selected.listeningAnswers || {}).filter(Boolean).length} / {SWAHILI_DAY_ONE.listening.length} selected</p></div>
                  <div className="swahili-book__form">
                    <label htmlFor="swahili-review-decision">Teacher decision
                      <select id="swahili-review-decision" value={decision} onChange={e=>setDecision(e.target.value)}>
                        <option value="reviewed">Reviewed</option><option value="needs_revision">Needs revision</option>
                      </select>
                    </label>
                    <label htmlFor="swahili-review-feedback">Feedback
                      <textarea id="swahili-review-feedback" value={comments} onChange={e=>setComments(e.target.value)} maxLength={3000} rows={5} placeholder="Write helpful feedback for the student." />
                    </label>
                  </div>
                  <button type="button" className="swahili-book__button" onClick={saveReview} disabled={saving}>{saving ? "Saving…" : "Save teacher feedback"}</button>
                  {notice && <p role="status">{notice}</p>}
                </>
              )}
            </>
          )}
        </section>
      )}
    </main>
  );
}
