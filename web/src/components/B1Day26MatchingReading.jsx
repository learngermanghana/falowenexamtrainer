import React from "react";
import "./B1Day26MatchingReading.css";

/**
 * Presenter-friendly and mobile-safe Anzeigen layout. The answer key is
 * intentionally not rendered: students submit letters A–H or X separately.
 */
export default function B1Day26MatchingReading({ task = {} }) {
  const situations = Array.isArray(task.text?.situations) ? task.text.situations : [];
  const advertisements = Array.isArray(task.text?.advertisements) ? task.text.advertisements : [];
  if (!situations.length || !advertisements.length) return null;

  return (
    <section className="b1-day26-matching" data-b1-day26-matching="true" aria-label="B1 Lesen Teil 3 Anzeigen zuordnen">
      <header className="b1-day26-matching-header">
        <span className="b1-day26-matching-kicker">B1 · LESEN · TEIL 3</span>
        <h3>Situationen und Anzeigen</h3>
        <p>Lesen Sie die Situationen 1–7 und die Anzeigen a–h. Wählen Sie die passende Anzeige. Eine Person hat keine passende Anzeige: <strong>X</strong>.</p>
        <span className="b1-day26-matching-meta">Ca. 10 Minuten · 7 Aufgaben · Antworten über Submit abgeben</span>
      </header>
      <div className="b1-day26-matching-columns">
        <section className="b1-day26-matching-group" aria-label="Situationen 1 bis 7">
          <h4>1. Personen und Situationen</h4>
          <ol className="b1-day26-situations">
            {situations.map(({ number, person, description }) => (
              <li key={number}>
                <span className="b1-day26-number" aria-hidden="true">{number}</span>
                <div><strong>{person}</strong><p>{description}</p></div>
              </li>
            ))}
          </ol>
        </section>
        <section className="b1-day26-matching-group" aria-label="Anzeigen a bis h">
          <h4>2. Anzeigen a–h</h4>
          <div className="b1-day26-ads">
            {advertisements.map(({ letter, title, description, contact }) => (
              <article className="b1-day26-ad" key={letter}>
                <div className="b1-day26-ad-heading">
                  <span className="b1-day26-ad-letter">{letter})</span>
                  <strong>{title}</strong>
                </div>
                <p>{description}</p>
                {contact && <small>{contact}</small>}
              </article>
            ))}
          </div>
        </section>
      </div>
      <footer className="b1-day26-matching-footer">
        Tragen Sie Ihre sieben Antworten im <strong>Submit</strong>-Tab ein (A–H oder X).
        Die Lösungen werden erst bei der Bewertung angezeigt.
      </footer>
    </section>
  );
}
