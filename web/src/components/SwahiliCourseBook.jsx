import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SWAHILI_DAY_ONE } from "../data/swahili/dayOne";
import "./SwahiliCourseBook.css";

const TABS = [
  ["intro", "Somo"],
  ["music", "Muziki"],
  ["grammar", "Sarufi"],
  ["speaking", "Sehemu ya 1"],
  ["reading", "Sehemu ya 2"],
  ["writing", "Sehemu ya 3"],
  ["listening", "Sehemu ya 4"],
];
const LETTERS = ["A", "E", "I", "O", "U"];

export const scoreListeningAnswers = (answers) =>
  SWAHILI_DAY_ONE.listening.reduce(
    (total, item, index) => total + (answers[index] === item.answer ? 1 : 0),
    0
  );

function DayOneContent({ activeTab }) {
  const [writing, setWriting] = useState("");
  const [responses, setResponses] = useState({});
  const [checked, setChecked] = useState(false);
  const lesson = SWAHILI_DAY_ONE;

  if (activeTab === "intro") return (
    <section className="swahili-book__card" aria-label="Muhtasari wa somo">
      <h2>Lengo la somo</h2>
      <p>{lesson.objective}</p>
      <h2 className="swahili-book__spaced">Vokali tano</h2>
      <div className="swahili-book__grid">
        {lesson.vowels.map((item) => (
          <div className="swahili-book__tile" key={item.letter}>
            <div className="swahili-book__letter">{item.letter}</div>
            <strong>{item.word}</strong>
            <div className="swahili-book__small">{item.meaning}</div>
          </div>
        ))}
      </div>
      <p className="swahili-book__note swahili-book__spaced">Sikiliza mwalimu, rudia kila vokali mara tatu, kisha sema U · O · I · E · A.</p>
    </section>
  );

  if (activeTab === "music") return (
    <section className="swahili-book__card" aria-label="Muziki wa somo">
      <h2>Muziki · Sauti za vokali</h2>
      <p>Imba na darasa huku ukitamka vokali kwa uwazi.</p>
      <div className="swahili-book__song">A, E, I, O, U{"\n"}Sauti zetu, A, E, I, O, U{"\n"}Mama, kiti, mtoto, kuku{"\n"}Sema tena, A, E, I, O, U</div>
      <p className="swahili-book__note">Rekodi ya wimbo bado haijaongezwa. Haya ni maneno ya mazoezi tu; hakuna sauti bandia au kiungo kisichofanya kazi.</p>
    </section>
  );

  if (activeTab === "grammar") return (
    <section className="swahili-book__card" aria-label="Sarufi na matamshi">
      <h2>Sarufi · Silabi na mkazo</h2>
      <p>Silabi nyingi zinaweza kujengwa kwa konsonanti na vokali. Soma mstari kwa sauti.</p>
      <div className="swahili-book__grid">
        {lesson.syllables.map((item) => (
          <div className="swahili-book__tile" key={item.stem}>
            <strong>{item.stem}</strong><p>{item.forms}</p>
          </div>
        ))}
      </div>
      <h2 className="swahili-book__spaced">Mkazo wa neno</h2>
      <p>Kwa kawaida, mkazo huangukia silabi ya pili kutoka mwisho.</p>
      <p><strong>{lesson.stress.join(" · ")}</strong></p>
      <h2 className="swahili-book__spaced">Miunganiko ya herufi</h2>
      <div className="swahili-book__grid">
        {lesson.combinations.map((item) => (
          <div className="swahili-book__tile" key={item.letters}>
            <strong>{item.letters}</strong> · {item.word}
            <div className="swahili-book__small">{item.meaning}</div>
          </div>
        ))}
      </div>
      <p className="swahili-book__note swahili-book__spaced">Linganisha: ng / ng’ · s / sh · t / th. Tofauti za sauti zisomwe na mwalimu.</p>
    </section>
  );

  if (activeTab === "speaking") return (
    <section className="swahili-book__card" aria-label="Sehemu ya 1 Kuzungumza">
      <h2>Sehemu ya 1 · Kuzungumza</h2>
      <p><strong>Rudia baada ya mwalimu.</strong> Tamka kwa sauti, kisha jaribu bila kusoma.</p>
      <ol>
        <li>A · E · I · O · U</li>
        <li>ba · be · bi · bo · bu</li>
        <li>cha · che · chi · cho · chu</li>
        <li>ma-ma · ra-fi-ki · mwa-li-mu</li>
      </ol>
      <p className="swahili-book__note">Fanya mazoezi na mwanafunzi mwenzako. Mwalimu asikilize na kusaidia matamshi.</p>
    </section>
  );

  if (activeTab === "reading") return (
    <section className="swahili-book__card" aria-label="Sehemu ya 2 Kusoma">
      <h2>Sehemu ya 2 · Kusoma</h2>
      <p>Soma maneno haya na utambue vokali zinazosikika. Maneno haya ndiyo msamiati mdogo wa Somo la 1.</p>
      <div className="swahili-book__grid">
        {lesson.vowels.map((item) => (
          <div className="swahili-book__tile" key={item.word}>
            <strong>{item.word}</strong>
            <div className="swahili-book__small">{item.meaning} · {item.letter}</div>
          </div>
        ))}
      </div>
      <p className="swahili-book__muted swahili-book__spaced">Kamusi kubwa na maneno zaidi vitaongezwa kwenye masomo yajayo.</p>
    </section>
  );

  if (activeTab === "writing") return (
    <section className="swahili-book__card" aria-label="Sehemu ya 3 Kuandika">
      <h2>Sehemu ya 3 · Kuandika</h2>
      <p>Andika vokali tano, silabi tano za B na maneno matatu kutoka somo hili.</p>
      <div className="swahili-book__fields">
        <label htmlFor="swahili-writing">Mazoezi yako
          <textarea id="swahili-writing" rows={6} value={writing} onChange={(event) => setWriting(event.target.value)}
            placeholder="A, E, I, O, U&#10;ba, be, bi, bo, bu&#10;mama, ..." />
        </label>
      </div>
      <p className="swahili-book__note swahili-book__spaced">Hii ni nafasi ya mazoezi tu. Majibu hayajatumwa wala kuhifadhiwa kwenye akaunti.</p>
    </section>
  );

  return (
    <section className="swahili-book__card" aria-label="Sehemu ya 4 Kusikiliza">
      <h2>Sehemu ya 4 · Kusikiliza</h2>
      <p>Mwalimu aseme neno moja moja. Chagua vokali inayojirudia katika kila neno. Kisha kagua majibu yako.</p>
      <p className="swahili-book__note">Sauti iliyorekodiwa bado haijapatikana. Zoezi hili linafanywa kwa sauti ya mwalimu darasani, si kwa kicheza sauti.</p>
      <div className="swahili-book__quiz">
        {lesson.listening.map((item, index) => (
          <div className="swahili-book__quizItem" key={item.word}>
            <label htmlFor={"swahili-listen-" + index}>Neno la {index + 1}</label>
            <select id={"swahili-listen-" + index} value={responses[index] || ""}
              onChange={(event) => { setResponses((prior) => ({ ...prior, [index]: event.target.value })); setChecked(false); }}>
              <option value="">Chagua vokali</option>
              {LETTERS.map((vowel) => <option key={vowel} value={vowel}>{vowel}</option>)}
            </select>
            {checked ? <span className="swahili-book__small">{responses[index] === item.answer ? "Sahihi ✓" : "Jaribu tena"}</span> : null}
          </div>
        ))}
      </div>
      <div className="swahili-book__row swahili-book__spaced">
        <button type="button" className="swahili-book__button" disabled={Object.keys(responses).length !== lesson.listening.length}
          onClick={() => setChecked(true)}>Kagua majibu</button>
        {checked ? <p className="swahili-book__result" role="status">{scoreListeningAnswers(responses)} / {lesson.listening.length} sahihi · mazoezi tu</p> : null}
      </div>
      <details className="swahili-book__spaced">
        <summary>Kwa mwalimu: maneno ya kusoma</summary>
        <p>{lesson.listening.map((item) => item.word).join(" · ")}</p>
      </details>
    </section>
  );
}

export default function SwahiliCourseBook({ day = null, basePath = "/swahili", preview = false }) {
  const [activeTab, setActiveTab] = useState("intro");
  const lesson = SWAHILI_DAY_ONE;
  return (
    <main className="swahili-book" lang="sw" data-swahili-course-book="true">
      <div className="swahili-book__top">
        <div className="swahili-book__brand">Falowen · Swale Swaps Swahili Hub</div>
        <Link className="swahili-book__link" to={basePath}>{day ? "← Rudi kwenye kitabu cha kozi" : "Kitabu cha kozi"}</Link>
      </div>
      <header className="swahili-book__hero">
        <p className="swahili-book__eyebrow">KISWAHILI · KIWANGO CHA MWANZO</p>
        <h1>{day ? lesson.chapter + " · " + lesson.title : "Kitabu cha Kozi ya Kiswahili"}</h1>
        <p>{day ? lesson.objective : "Jifunze Kiswahili kwa masomo mafupi, matamshi, sarufi, muziki na mazoezi ya darasani."}</p>
        <div className="swahili-book__meta">
          <span>Somo 1 pekee</span><span>Alfabeti na matamshi</span><span>Mazoezi ya darasani</span>
        </div>
      </header>
      {day === 1 ? (
        <>
          <nav aria-label="Sehemu za somo" className="swahili-book__tabs" role="tablist">
            {TABS.map(([key, label]) => (
              <button key={key} type="button" role="tab" aria-selected={activeTab === key} className="swahili-book__tab"
                onClick={() => setActiveTab(key)}>{label}</button>
            ))}
          </nav>
          <div role="tabpanel" aria-label={TABS.find(([key]) => key === activeTab)[1]}>
            <DayOneContent activeTab={activeTab} />
          </div>
          <p className="swahili-book__muted swahili-book__spaced">Mazoezi haya ni ya kujifunza, si mtihani uliowekewa alama. {preview ? "Huu ni mfano wa kitabu cha kozi." : ""}</p>
        </>
      ) : (
        <section className="swahili-book__card swahili-book__section">
          <div className="swahili-book__lesson">
            <div className="swahili-book__lessonInfo">
              <p className="swahili-book__caption">SOMO LA 1 · LINAPATIKANA</p>
              <h2>{lesson.title}</h2>
              <p>{lesson.objective}</p>
              <p className="swahili-book__small">Muziki · Sarufi · Kuzungumza · Kusoma · Kuandika · Kusikiliza</p>
            </div>
            <Link to={basePath + "/day-1"} className="swahili-book__button">Fungua Somo la 1</Link>
          </div>
          <p className="swahili-book__note swahili-book__spaced">Masomo mengine na kamusi pana vitaongezwa baadaye. Masomo ya Kijerumani hayajabadilishwa.</p>
        </section>
      )}
    </main>
  );
}
