import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";
import {
  DAY14_MODALS,
  DAY14_MODAL_FORMS,
  DAY14_TRAIN_WORDS,
  DAY14_HOTEL_WORDS,
  DAY14_WRITTEN_TASKS,
  DAY14_DEPARTURES,
  DAY14_HOTEL_CONFIRMATION,
  DAY14_HOTEL_DIALOGUE,
  DAY14_KNOWLEDGE_QUESTIONS,
  normalizeDay14Sentence,
} from "../data/a1Day14TravelHotelWorkbook";
import "./A1Day14TravelHotelWorkbookPage.css";

function Section({ id, eyebrow, title, children }) {
  return <section id={id} className="a1d14w-section">
    {eyebrow ? <span className="a1d14w-eyebrow">{eyebrow}</span> : null}
    <h2>{title}</h2>
    {children}
  </section>;
}

function Pattern({ label, words }) {
  return <div className="a1d14w-pattern" aria-label={label}>
    <span className="a1d14w-eyebrow">{label}</span>
    <div className="a1d14w-pattern-words">
      {words.map(({ text, role }, index) => <span key={index} className={"a1d14w-token " + (role || "")}>{text}</span>)}
    </div>
  </div>;
}

function Vocabulary({ title, entries, separableNote = "" }) {
  const [open, setOpen] = useState({});
  const cards = (items) => items.map((entry) => <article className="a1d14w-vocab-card" key={entry.word}>
    <span className="a1d14w-vocab-icon" aria-hidden="true">{entry.icon}</span>
    <strong lang="de">{entry.word}</strong>
    <small>{entry.en}</small>
    <button type="button" aria-expanded={Boolean(open[entry.word])}
      onClick={() => setOpen(current => ({ ...current, [entry.word]: !current[entry.word] }))}>
      {open[entry.word] ? "Hide example" : "Show example"}
    </button>
    {open[entry.word] ? <p className="a1d14w-vocab-model" lang="de">{entry.example}</p> : null}
  </article>);
  return <div className="a1d14w-vocab">
    <h3>{title}</h3>
    <div className="a1d14w-vocab-grid">{cards(entries.slice(0, 4))}</div>
    {entries.length > 4 ? <details className="a1d14w-details a1d14w-extra-vocab">
      <summary>More vocabulary ({entries.length - 4} words)</summary>
      <div className="a1d14w-vocab-grid">{cards(entries.slice(4))}</div>
    </details> : null}
    {separableNote ? <p className="a1d14w-hint">{separableNote}</p> : null}
  </div>;
}

function ModalPractice() {
  const [activeModal, setActiveModal] = useState("können");
  return <>
    <p className="a1d14w-lead">These are the four modal verbs for this chapter. Focus on choosing the right meaning and building a whole sentence.</p>
    <div className="a1d14w-modal-grid">
      {DAY14_MODALS.map(item => <div className="a1d14w-modal-card" key={item.verb}>
        <span className="a1d14w-vocab-icon" aria-hidden="true">{item.picture}</span>
        <strong>{item.verb}</strong>
        <span>{item.translation}</span>
        <small>{item.function}</small>
        <p lang="de">{item.sample}</p>
      </div>)}
    </div>
    <div className="a1d14w-conjugation">
      <h3>Konjugation · choose a modal verb</h3>
      <label className="a1d14w-label" htmlFor="a1d14w-modal-select">Modal verb</label>
      <select id="a1d14w-modal-select" aria-label="Choose modal verb to review"
        value={activeModal} onChange={(event) => setActiveModal(event.target.value)}>
        {DAY14_MODALS.map(item => <option key={item.verb} value={item.verb}>{item.verb}</option>)}
      </select>
      <div data-a1-modal-conjugation-cards="true" className="a1d14w-form-grid">
        {DAY14_MODAL_FORMS.map(form => <div key={form.subject} className="a1d14w-form-card">
          <small>{form.subject}</small><strong>{form[activeModal]}</strong>
        </div>)}
      </div>
      <details className="a1d14w-details">
        <summary>Show complete conjugation table (optional)</summary>
        <div className="a1d14w-table-scroll">
          <table aria-label="Modal verb conjugation table">
            <thead><tr>{["Person", ...DAY14_MODALS.map(item => item.verb)].map(head =>
              <th scope="col" key={head}>{head}</th>)}</tr></thead>
            <tbody>{DAY14_MODAL_FORMS.map(form => <tr key={form.subject}>
              <th scope="row">{form.subject}</th>
              {DAY14_MODALS.map(item => <td key={item.verb}>{form[item.verb]}</td>)}
            </tr>)}</tbody>
          </table>
        </div>
      </details>
    </div>
  </>;
}

function WrittenPractice() {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const completed = DAY14_WRITTEN_TASKS.filter(task => String(answers[task.id] || "").trim()).length;
  const matched = DAY14_WRITTEN_TASKS.filter(task =>
    normalizeDay14Sentence(answers[task.id]) === normalizeDay14Sentence(task.answer)).length;
  return <div className="a1d14w-exercises" data-a1-day14-written="true">
    <p className="a1d14w-lead">Write complete statements and a question. Do not copy the examples above. The models stay hidden until you check all answers.</p>
    {DAY14_WRITTEN_TASKS.map((task, i) => <div key={task.id} className="a1d14w-task">
      <label className="a1d14w-label" htmlFor={"a1d14w-written-" + task.id}>
        <span>Aufgabe {i + 1} · {task.instruction}</span>
        <strong>{task.prompt}</strong>
      </label>
      <textarea id={"a1d14w-written-" + task.id} rows={2}
        aria-label={"Rewrite sentence " + (i + 1)}
        placeholder="Schreibe einen ganzen Satz auf Deutsch ..."
        value={answers[task.id] || ""}
        onChange={e => {setAnswers(current => ({ ...current, [task.id]: e.target.value }));setChecked(false);}} />
      {checked ? <div className={normalizeDay14Sentence(answers[task.id]) === normalizeDay14Sentence(task.answer)
        ? "a1d14w-result success" : "a1d14w-result"}>
        <strong>{task.answer}</strong>
        <small>{task.hint}</small>
      </div> : null}
    </div>)}
    <p className="a1d14w-progress" role="status">{completed} of {DAY14_WRITTEN_TASKS.length} sentences written</p>
    <div className="a1d14w-actions">
      <button type="button" className="a1d14w-primary" disabled={completed !== DAY14_WRITTEN_TASKS.length}
        onClick={() => setChecked(true)}>Check my sentences</button>
      <button type="button" onClick={() => {setAnswers({});setChecked(false);}}>Try again</button>
    </div>
    {checked ? <div className="a1d14w-result" role="status">
      <strong>{matched} of {DAY14_WRITTEN_TASKS.length} example answers matched.</strong>
      <p>This local checker accepts different capitalisation and final punctuation. Other natural A1 wordings may be correct; compare with the models rather than treating a different wording as automatically wrong.</p>
    </div> : null}
  </div>;
}

function TravelReading() {
  return <div className="a1d14w-reading-grid">
    <article className="a1d14w-reading-panel">
      <h3>Am Bahnhof · Abfahrtstafel</h3>
      <p>Read the departure board. Which platform does ICE 593 use?</p>
      <div className="a1d14w-table-scroll">
        <table aria-label="German train departure board">
          <thead><tr><th>Zug</th><th>Nach</th><th>Abfahrt</th><th>Gleis</th></tr></thead>
          <tbody>{DAY14_DEPARTURES.map(row => <tr key={row.train}>
            <td>{row.train}</td><td>{row.to}</td><td>{row.time}</td><td>{row.platform}</td>
          </tr>)}</tbody>
        </table>
      </div>
      <small>Practice timetable: fictional examples for learning German, not live train times.</small>
    </article>
    <article className="a1d14w-reading-panel">
      <h3>Im Hotel · Reservierungsbestätigung</h3>
      <p>Read the hotel confirmation. How many nights has Alex booked?</p>
      <dl className="a1d14w-confirmation">
        {[
          ["Gast", DAY14_HOTEL_CONFIRMATION.guest],
          ["Zimmer", DAY14_HOTEL_CONFIRMATION.room],
          ["Anreise", DAY14_HOTEL_CONFIRMATION.arrival],
          ["Abreise", DAY14_HOTEL_CONFIRMATION.departure],
          ["Aufenthalt", DAY14_HOTEL_CONFIRMATION.nights],
        ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      <small>Practice booking only; no reservation is made.</small>
    </article>
  </div>;
}

function HotelDialogue() {
  const [reveal, setReveal] = useState(false);
  return <div className="a1d14w-dialogue">
    <p className="a1d14w-lead">Role-play with a partner. One person is the guest, the other is the receptionist. Ask for a room and say how many nights.</p>
    <div className="a1d14w-role-cards">
      <div className="a1d14w-role-card"><strong>Person A · Gast</strong>
        <p>Greet the receptionist. Use möchten to reserve an Einzelzimmer. Say you want two nights and say thank you.</p>
      </div>
      <div className="a1d14w-role-card"><strong>Person B · Rezeption</strong>
        <p>Ask: Für wie viele Nächte? Then answer that a room is available.</p>
      </div>
    </div>
    <button type="button" aria-expanded={reveal}
      onClick={() => setReveal(value => !value)}>{reveal ? "Hide model conversation" : "Show model conversation after speaking"}</button>
    {reveal ? <div className="a1d14w-dialogue-lines" lang="de">
      {DAY14_HOTEL_DIALOGUE.map((line, i) => <p key={i}><strong>{line.speaker}:</strong> {line.text}</p>)}
    </div> : null}
    <p className="a1d14w-hint"><b>Extra question:</b> Haben Sie ein Zimmer frei? · <b>Grammar:</b> Kann ich hier zwei Nächte übernachten?</p>
  </div>;
}

function KnowledgeCheck() {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const total = DAY14_KNOWLEDGE_QUESTIONS.length;
  const answered = DAY14_KNOWLEDGE_QUESTIONS.filter(q => Boolean(answers[q.id])).length;
  const correct = DAY14_KNOWLEDGE_QUESTIONS.filter(q => answers[q.id] === q.answer).length;
  const grammarQuestions = DAY14_KNOWLEDGE_QUESTIONS.filter(q => q.category === "Grammar");
  const readingQuestions = DAY14_KNOWLEDGE_QUESTIONS.filter(q => q.category === "Reading");
  const grammar = grammarQuestions.filter(q => answers[q.id] === q.answer).length;
  const reading = readingQuestions.filter(q => answers[q.id] === q.answer).length;
  const passed = correct >= 4;
  return <div className="a1d14w-exercises" data-a1-day14-knowledge-check="true">
    <p>Five short questions: three on grammar and two on the train timetable and hotel confirmation. Answer all five before checking.</p>
    <p className="a1d14w-progress" role="status">{answered} of {total} questions answered</p>
    <progress aria-label="Knowledge test completion" max={total} value={answered} />
    {DAY14_KNOWLEDGE_QUESTIONS.map((q, i) => <fieldset key={q.id} className="a1d14w-task">
      <legend>{i + 1}. {q.prompt}</legend>
      <small>{q.category}</small>
      <div className="a1d14w-options">
        {q.options.map(option => <label key={option} className={answers[q.id] === option ? "selected" : ""}>
          <input type="radio" name={"a1d14w-" + q.id} checked={answers[q.id] === option}
            onChange={() => {setAnswers(old => ({ ...old, [q.id]: option }));setChecked(false);}} />
          <span>{option}</span>
        </label>)}
      </div>
      {checked ? <div role="status" className={answers[q.id] === q.answer ? "a1d14w-result success" : "a1d14w-result"}>
        <strong>{answers[q.id] === q.answer ? "Richtig!" : "Correct answer: " + q.answer}</strong>
        <small>{q.explanation}</small>
      </div> : null}
    </fieldset>)}
    <div className="a1d14w-actions" data-a1-pdf-hide-ui="knowledge-actions">
      <button type="button" className="a1d14w-primary" disabled={answered !== total}
        onClick={() => setChecked(true)}>Check knowledge test</button>
      <button type="button" onClick={() => {setAnswers({});setChecked(false);}}>Reset test</button>
    </div>
    {checked ? <div className={"a1d14w-result " + (passed ? "success" : "")} role="status">
      <strong>Score: {correct} / {total}</strong>
      <p>Grammar: {grammar} / {grammarQuestions.length} · Reading: {reading} / {readingQuestions.length}</p>
      <p>{passed
        ? "Good work. Review any mistakes before the hotel conversation."
        : "Revise modal position two, complete infinitives and hotel phrases, then reset and try again."}</p>
      <small>This is an unscored local self-check. It does not submit an official Falowen assignment.</small>
    </div> : null}
  </div>;
}

export default function A1Day14TravelHotelWorkbookPage() {
  const learningLinks = useMemo(() => [
    ["Wortschatz", "#a1d14w-vocab"],
    ["Modalverben", "#a1d14w-modals"],
    ["Satzbau", "#a1d14w-satzbau"],
    ["Übungen", "#a1d14w-practice"],
    ["Hotel", "#a1d14w-hotel"],
    ["Kurztest", "#a1d14w-test"],
  ], []);
  return <main className="a1d14w" style={styles.container} data-a1-day14-travel-hotel-workbook="true">
    <header className="a1d14w-hero">
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <span className="a1d14w-eyebrow">Deutsch A1 · Tag 14 · Kapitel 3.6</span>
      <h1>A1 · Day 14 Workbook · Modal Verbs with Separable Verbs</h1>
      <p>Mit dem Zug fahren und ein Hotelzimmer reservieren · Travel, hotels and sentence formation</p>
      <div className="a1d14w-goals">
        <span>🚆 Trennbare Verben</span><span>🛏️ Hotel reservieren</span>
        <span>💬 können · möchten · wollen · müssen</span>
      </div>
      <p className="a1d14w-notice">This is a <b>self-practice workbook</b>. Your answers stay on this page, and no tutor-marked assignment is submitted.</p>
    </header>
    <nav className="a1d14w-nav" aria-label="Day 14 workbook sections">
      {learningLinks.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
    </nav>

    <Section id="a1d14w-vocab" eyebrow="Teil 1 · Wortschatz" title="Travel and hotel vocabulary">
      <Vocabulary title="Am Bahnhof · At the station" entries={DAY14_TRAIN_WORDS}
        separableNote="einsteigen, aussteigen and umsteigen are separable. For example: Ich steige in Berlin aus." />
      <Vocabulary title="Im Hotel · At the hotel" entries={DAY14_HOTEL_WORDS}
        separableNote="übernachten, buchen and reservieren are not separable. Example: Ich möchte im Hotel übernachten." />
    </Section>

    <Section id="a1d14w-modals" eyebrow="Teil 2 · Grammatik" title="Four modal verbs for A1">
      <ModalPractice />
    </Section>

    <Section id="a1d14w-satzbau" eyebrow="Teil 3 · Satzbau" title="Modal verb + complete infinitive">
      <p className="a1d14w-lead">The modal verb is conjugated and takes position two. The action verb goes to the end in the infinitive without zu. A separable infinitive stays together.</p>
      <Pattern label="No modal · separable verb" words={[
        { text: "Ich", role: "subject" }, { text: "steige", role: "finite" },
        { text: "in den Zug", role: "detail" }, { text: "ein.", role: "infinitive" },
      ]} />
      <Pattern label="With modal · complete infinitive" words={[
        { text: "Ich", role: "subject" }, { text: "möchte", role: "finite" },
        { text: "in den Zug", role: "detail" }, { text: "einsteigen.", role: "infinitive" },
      ]} />
      <Pattern label="Time first · the conjugated modal remains second" words={[
        { text: "Morgen", role: "detail" }, { text: "will", role: "finite" },
        { text: "ich nach Berlin", role: "subject" }, { text: "fahren.", role: "infinitive" },
      ]} />
      <div className="a1d14w-rule-grid">
        <div><strong>Reise</strong><p>Ich <b>muss</b> in Hamburg <b>umsteigen</b>.</p></div>
        <div><strong>Hotel</strong><p>Ich <b>möchte</b> ein Einzelzimmer <b>buchen</b>.</p></div>
        <div><strong>Ja/Nein-Frage</strong><p><b>Kannst</b> du morgen <b>fahren</b>?</p></div>
        <div><strong>W-Frage</strong><p>Was <b>möchtest</b> du <b>buchen</b>?</p></div>
      </div>
      <p className="a1d14w-hint">Compare: <s>Ich kann steige ein.</s> → <b>Ich kann einsteigen.</b> · <s>Heute ich muss umsteigen.</s> → <b>Heute muss ich umsteigen.</b></p>
    </Section>

    <Section id="a1d14w-practice" eyebrow="Teil 4 · Übung" title="Train and hotel sentence practice">
      <WrittenPractice />
    </Section>

    <Section id="a1d14w-hotel" eyebrow="Teil 5 · Alltag" title="A train journey and hotel reservation">
      <TravelReading />
      <h3>Ein Zimmer reservieren · Speaking with a hotel receptionist</h3>
      <HotelDialogue />
    </Section>

    <Section id="a1d14w-test" eyebrow="Teil 6 · Kurztest" title="Quick check: 5 questions">
      <KnowledgeCheck />
    </Section>

  </main>;
}
