import React, { useEffect, useMemo, useRef, useState } from "react";
import { splitReadingGlossaryText } from "../data/a2B1ReadingGlosses";
import "./ReadingTranslationText.css";

/**
 * A small, tap-friendly English vocabulary aid for the German reading passages.
 * No external translator, network request, answer key or raw HTML is involved.
 */
export default function ReadingTranslationText({ text, children, level = "", day = 0, contextText }) {
  const source = typeof text === "string" ? text : (typeof children === "string" ? children : "");
  const root = useRef(null);
  const [openIndex, setOpenIndex] = useState(-1);
  const [alignRight, setAlignRight] = useState(false);
  const segments = useMemo(
    () => splitReadingGlossaryText(source, level, day, contextText ?? source),
    [source, level, day, contextText],
  );

  useEffect(() => {
    setOpenIndex(-1);
  }, [source, level, day]);

  useEffect(() => {
    if (openIndex < 0) return undefined;
    const closeOutside = (event) => {
      if (!root.current?.contains(event.target)) setOpenIndex(-1);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpenIndex(-1);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openIndex]);

  return (
    <span ref={root} className="reading-glossary-text" data-reading-glossary={String(level).toUpperCase()}>
      {segments.map((segment, index) => segment.meaning ? (
        <span className="reading-glossary-anchor" key={index}>
          <button
            type="button"
            className="reading-glossary-trigger"
            aria-label={`English meaning for ${segment.text}`}
            aria-expanded={openIndex === index}
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              setAlignRight(window.innerWidth - rect.left < 270);
              setOpenIndex((previous) => previous === index ? -1 : index);
            }}
          >
            {segment.text}
          </button>
          {openIndex === index && (
            <span className={`reading-glossary-popover reading-glossary-popover--${alignRight ? "right" : "left"}`} role="note">
              <span className="reading-glossary-label">English meaning</span>
              <span className="reading-glossary-definition">{segment.meaning}</span>
              <button type="button" className="reading-glossary-close" aria-label="Close meaning" onClick={() => setOpenIndex(-1)}>×</button>
            </span>
          )}
        </span>
      ) : <React.Fragment key={index}>{segment.text}</React.Fragment>)}
    </span>
  );
}

export function ReadingTranslationHint() {
  return (
    <p className="reading-glossary-hint">
      <span aria-hidden="true">ⓘ</span> Tap an underlined German word or phrase to see its English meaning.
    </p>
  );
}
