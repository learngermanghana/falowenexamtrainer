import React from "react";
import { MGAHAWANI_GRAMMAR } from "../data/swahili/mgahawaniGrammarAndSong";
import { SWAHILI_DAY_SIX } from "../data/swahili/daySix";
import SwahiliDictionary from "./SwahiliDictionary";

function GrammarTable({ columns, rows }) {
  if (!columns?.length || !rows?.length) return null;
  return <div className="mgahawani-grammar__table-wrap">
    <table className="mgahawani-grammar__table">
      <thead><tr>{columns.map((column, index) => <th key={column + index} scope="col">{column}</th>)}</tr></thead>
      <tbody>{rows.map((cells, index) => <tr key={index}>{cells.map((cell, col) => <td key={col}>{cell}</td>)}</tr>)}</tbody>
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

export default function MgahawaniGrammar() {
  return <section className="swahili-book__card swahili-book__activity mgahawani-grammar" aria-label="Grammar">
    <div className="mgahawani-grammar__intro">
      <p className="mgahawani-grammar__eyebrow">Somo la 6 · Sarufi</p>
      <h2>Grammar · Mgahawani</h2>
      <p>{MGAHAWANI_GRAMMAR.introduction}</p>
      <div className="mgahawani-grammar__outcomes" aria-label="Lesson grammar topics">
        {MGAHAWANI_GRAMMAR.chapters.map(section =>
          <a key={section.id} href={"#mgahawani-grammar-" + section.id}>{section.number}. {section.title}</a>
        )}
      </div>
    </div>
    <div className="mgahawani-grammar__spotlight">
      <span className="mgahawani-grammar__eyebrow">Say it politely</span>
      <strong>Naomba wali na samaki, tafadhali.</strong>
      <span lang="en">Rice and fish, please.</span>
    </div>
    <p className="swahili-book__small">Open each grammar topic below. Examples, tables and explanations are from the supplied Mgahawani grammar document.</p>
    {MGAHAWANI_GRAMMAR.chapters.map((chapter, index) =>
      <details className="mgahawani-grammar__chapter" id={"mgahawani-grammar-" + chapter.id} key={chapter.id} open={index === 0 ? true : undefined}>
        <summary>
          <span className="mgahawani-grammar__number">{chapter.number}</span>
          <span className="mgahawani-grammar__chapter-label"><strong>{chapter.title}</strong><small>{chapter.sw}</small></span>
          <span className="mgahawani-grammar__toggle" aria-hidden="true">⌄</span>
        </summary>
        <div className="mgahawani-grammar__chapter-body">
          <p>{chapter.explanation}</p>
          <GrammarTable columns={chapter.columns} rows={chapter.rows} />
          <Subtopic title={chapter.partsTitle} explanation={chapter.partsExplanation}
            columns={chapter.partsColumns} rows={chapter.partsRows} />
          <Subtopic title={chapter.negativeTitle} explanation={chapter.negativeExplanation}
            example={chapter.negativeExamples} columns={chapter.negativeColumns} rows={chapter.negativeRows} />
          {chapter.note && <p className="mgahawani-grammar__tip"><strong>Remember:</strong> {chapter.note}</p>}
        </div>
      </details>
    )}
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
      <SwahiliDictionary />
    </details>
  </section>;
}
