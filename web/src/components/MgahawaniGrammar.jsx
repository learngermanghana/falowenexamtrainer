import React, { useState } from "react";
import { MGAHAWANI_GRAMMAR } from "../data/swahili/mgahawaniGrammarAndSong";
import { SWAHILI_DAY_SIX } from "../data/swahili/daySix";
import SwahiliDictionary from "./SwahiliDictionary";
import { MGAHAWANI_GRAMMAR_CHECKS } from "../data/swahili/mgahawaniGrammarPractice";
import MgahawaniRestaurantChallenge, { GrammarSelfCheck } from "./MgahawaniGrammarPractice";

function GrammarTable({ columns, rows, colorCode = false }) {
  if (!columns?.length || !rows?.length) return null;
  return <div className="mgahawani-grammar__table-wrap">
    <table className="mgahawani-grammar__table">
      <thead><tr>{columns.map((column, index) => <th key={column + index} scope="col">{column}</th>)}</tr></thead>
      <tbody>{rows.map((cells, index) => <tr key={index}>{cells.map((cell, col) => <td key={col} className={colorCode && col === 1 ? "mgahawani-grammar__affirmative" : colorCode && col === 2 ? "mgahawani-grammar__negative" : ""}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

function Subtopic({ title, explanation, example, columns, rows }) {
  if (!title) return null;
  return <div className="mgahawani-grammar__subtopic">
    <h4>{title}</h4>
    {explanation && <p>{explanation}</p>}
    {example && <p className="mgahawani-grammar__formula">{example}</p>}
    <GrammarTable columns={columns} rows={rows} />
  </div>;
}


// These English study guides restate the examples already present in the
// teacher's seven grammar topics; they do not replace any source material.
const STUDY_GUIDES = {
  polite: { rule:"Use Naomba or Ninaomba to make a polite request at the restaurant.", example:"Naomba wali na samaki.", translation:"Rice and fish, please.", explanation:"Naomba introduces what you would like. Add tafadhali for extra politeness." },
  persons: { rule:"The pronoun identifies who is speaking or being discussed.", example:"Mimi ninataka wali.", translation:"I want rice.", explanation:"Mimi = I, wewe = you, yeye = he/she, sisi = we, ninyi = you (plural), wao = they. The verb prefix also identifies the person." },
  present: { rule:"Affirmative: subject prefix + -na- + -taka. Negative: use the negative person prefix and -taki.", example:"Mimi ninataka wali. / Mimi sitaki wali.", translation:"I want rice. / I do not want rice.", explanation:"The -na- present marker disappears in this regular present-tense negative, and final -a changes to -i." },
  questions: { rule:"Use Mna…? to ask restaurant staff what they have, and ngapi to ask the amount.", example:"Jumla ni shilingi ngapi?", translation:"How much is the total?", explanation:"Jumla = total, shilingi = shillings, ngapi = how much/how many." },
  numbers: { rule:"Elfu means thousand, mia means hundred; the price follows shilingi.", example:"Jumla ni shilingi elfu tano.", translation:"The total is five thousand shillings.", explanation:"This is a practice price from the notes, not a real restaurant price." },
  agreement: { rule:"For numerals such as two, agree with the noun class and place the number after the noun.", example:"Naomba vikombe viwili vya chai.", translation:"Two cups of tea, please.", explanation:"Vikombe, viwili, and vya all carry the VI-class agreement." },
  locative: { rule:"Add -ni to a suitable common noun to describe a place or destination.", example:"Ninakula mgahawani.", translation:"I am eating at the restaurant.", explanation:"Mgahawa means restaurant. Mgahawani expresses being at or going to the restaurant, depending on the verb." },
};

function VerbBreakdown() {
  return <div className="mgahawani-grammar__verb-breakdown" aria-label="Colour-coded present-tense verb formation">
    <h4>Build the verb · Tengeneza kitenzi</h4>
    <div className="mgahawani-grammar__morphemes">
      <span className="mgahawani-grammar__morpheme is-subject"><strong>ni-</strong><small>Subject · I</small></span>
      <span className="mgahawani-grammar__morpheme-plus" aria-hidden="true">+</span>
      <span className="mgahawani-grammar__morpheme is-tense"><strong>-na-</strong><small>Present tense</small></span>
      <span className="mgahawani-grammar__morpheme-plus" aria-hidden="true">+</span>
      <span className="mgahawani-grammar__morpheme is-stem"><strong>-taka</strong><small>Want</small></span>
    </div>
    <p className="mgahawani-grammar__verb-result"><strong>ninataka</strong> — I want</p>
    <div className="mgahawani-grammar__negative-example">
      <span className="mgahawani-grammar__morpheme is-negative"><strong>si-</strong><small>Negative · I</small></span>
      <span className="mgahawani-grammar__morpheme-plus" aria-hidden="true">+</span>
      <span className="mgahawani-grammar__morpheme is-stem"><strong>-taki</strong><small>Want · negative</small></span>
      <p><strong>sitaki</strong> — I do not want</p>
    </div>
    <p className="swahili-book__small">Colours identify the person prefix, present marker and stem. This breakdown illustrates the regular verb <em>kutaka</em> from the teacher's notes.</p>
  </div>;
}

export default function MgahawaniGrammar({ uid = null, allowSave = false }) {
  const [openChapter, setOpenChapter] = useState("polite");
  const chooseChapter = (id) => setOpenChapter(current => current === id ? null : id);
  return <section className="swahili-book__card swahili-book__activity mgahawani-grammar" aria-label="Grammar">
    <div className="mgahawani-grammar__intro">
      <p className="mgahawani-grammar__eyebrow">Somo la 6 · Sarufi</p>
      <h2>Grammar · Mgahawani</h2>
      <p>{MGAHAWANI_GRAMMAR.introduction}</p>
      <nav className="mgahawani-grammar__outcomes" aria-label="Lesson grammar topics">
        {MGAHAWANI_GRAMMAR.chapters.map(section =>
          <button key={section.id} type="button"
            aria-controls={"mgahawani-grammar-" + section.id}
            aria-expanded={openChapter === section.id}
            className={openChapter === section.id ? "is-current" : ""}
            onClick={() => chooseChapter(section.id)}>{section.number}. {section.title}</button>
        )}
      </nav>
    </div>
    <div className="mgahawani-grammar__spotlight">
      <span className="mgahawani-grammar__eyebrow">Say it politely</span>
      <strong>Naomba wali na samaki, tafadhali.</strong>
      <span lang="en">Rice and fish, please.</span>
    </div>
    <p className="swahili-book__small">Choose a topic to see its rule, example, explanation and one quick practice question. Only one topic stays open at a time. All original teacher notes and tables remain available.</p>
    {MGAHAWANI_GRAMMAR.chapters.map((chapter, index) =>
      <details className="mgahawani-grammar__chapter" id={"mgahawani-grammar-" + chapter.id} key={chapter.id} open={openChapter === chapter.id}>
        <summary onClick={event => { event.preventDefault(); chooseChapter(chapter.id); }}>
          <span className="mgahawani-grammar__number">{chapter.number}</span>
          <span className="mgahawani-grammar__chapter-label"><strong>{chapter.title}</strong><small>{chapter.sw}</small></span>
          <span className="mgahawani-grammar__toggle" aria-hidden="true">⌄</span>
        </summary>
        <div className="mgahawani-grammar__chapter-body">
          <div className="mgahawani-grammar__rule-example">
            <div><span className="mgahawani-grammar__eyebrow">Rule</span><p>{STUDY_GUIDES[chapter.id].rule}</p></div>
            <div><span className="mgahawani-grammar__eyebrow">Example</span><p className="mgahawani-grammar__model">{STUDY_GUIDES[chapter.id].example}</p><p lang="en" className="mgahawani-grammar__translation">{STUDY_GUIDES[chapter.id].translation}</p></div>
            <div><span className="mgahawani-grammar__eyebrow">English explanation</span><p>{STUDY_GUIDES[chapter.id].explanation}</p></div>
          </div>
          <div className="mgahawani-grammar__source-explanation"><strong>Detailed grammar note</strong><p>{chapter.explanation}</p></div>
          {chapter.id === "present" && <VerbBreakdown />}
          <GrammarTable columns={chapter.columns} rows={chapter.rows} colorCode={chapter.id === "present"} />
          <Subtopic title={chapter.partsTitle} explanation={chapter.partsExplanation}
            columns={chapter.partsColumns} rows={chapter.partsRows} />
          <Subtopic title={chapter.negativeTitle} explanation={chapter.negativeExplanation}
            example={chapter.negativeExamples} columns={chapter.negativeColumns} rows={chapter.negativeRows} />
          {chapter.note && <p className="mgahawani-grammar__tip"><strong>Remember:</strong> {chapter.note}</p>}
          <GrammarSelfCheck questionId={"mgahawani-check-" + chapter.id} item={MGAHAWANI_GRAMMAR_CHECKS[chapter.id]} />
          <div className="mgahawani-grammar__chapter-footer">
            <span>Topic {chapter.number} of {MGAHAWANI_GRAMMAR.chapters.length}</span>
            {index + 1 < MGAHAWANI_GRAMMAR.chapters.length
              ? <button type="button" className="swahili-book__button swahili-book__button--soft"
                  onClick={() => setOpenChapter(MGAHAWANI_GRAMMAR.chapters[index + 1].id)}>Next grammar topic</button>
              : <button type="button" className="swahili-book__button swahili-book__button--soft"
                  onClick={() => setOpenChapter(null)}>Finish grammar topics</button>}
          </div>
        </div>
      </details>
    )}
    <MgahawaniRestaurantChallenge />
    <section className="mgahawani-grammar__dialogue" aria-labelledby="mgahawani-model-dialogue">
      <p className="mgahawani-grammar__eyebrow">Use it in context</p>
      <h3 id="mgahawani-model-dialogue">A restaurant conversation</h3>
      {MGAHAWANI_GRAMMAR.conversation.map(([speaker, line], index) =>
        <div key={index} className="mgahawani-grammar__dialogue-line">
          <strong>{speaker}</strong><span>{line}</span>
        </div>
      )}
      <p className="swahili-book__small">Practice with a partner, then move to Teil 1 · Kuzungumza.</p>
    </section>
    <details className="mgahawani-grammar__extras">
      <summary>Chakula na vinywaji · Food & drink vocabulary</summary>
      <h3>Chakula · Food</h3>
      <div className="swahili-book__grid">{SWAHILI_DAY_SIX.food.map(item =>
        <div className="swahili-book__tile" key={item.sw}><strong>{item.sw}</strong><p className="swahili-book__small">{item.en}</p></div>
      )}</div>
      <h3>Vinywaji · Drinks</h3>
      <div className="swahili-book__grid">{SWAHILI_DAY_SIX.drinks.map(item =>
        <div className="swahili-book__tile" key={item.sw}><strong>{item.sw}</strong><p className="swahili-book__small">{item.en}</p></div>
      )}</div>
      <h3>Ninapenda / Sipendi · Likes & dislikes</h3>
      <div className="swahili-book__phrase-list">{SWAHILI_DAY_SIX.phrases.map(item =>
        <div className="swahili-book__tile" key={item.sw}><strong>{item.sw}</strong><p className="swahili-book__small">{item.en}</p></div>
      )}</div>
    </details>
    <details className="mgahawani-grammar__extras">
      <summary>Kamusi · Search the Swahili dictionary</summary>
      <SwahiliDictionary uid={uid} allowSave={allowSave} />
    </details>
  </section>;
}
