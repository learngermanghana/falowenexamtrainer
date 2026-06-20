import React from "react";
import { styles } from "../styles";
import { alphabetQuestions } from "../data/a1AlphabetWorkbookData";
import A1AlphabetHoerenSection from "./A1AlphabetHoerenSection";

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 10,
};

const questionBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 6,
  background: "#fff",
};

const A1AlphabetAssignmentContent = () => (
  <>
    <section style={sectionStyle}>
      <img
        src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80"
        alt="Open notebook with alphabet study notes on a classroom desk"
        loading="lazy"
        style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
      />
      <h2 style={{ margin: 0 }}>Teil 1 · Reading and Writing</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        <strong>Instruction:</strong> Read the text carefully and answer the questions below. Each
        question has one correct answer.
      </p>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        <strong>Text:</strong> The German alphabet has 26 letters. There are also some additional
        letters like Ä, Ö, Ü, and ß, which is called "Eszett" or "sharp S." Each letter has a name
        and a sound. The letters of the alphabet are: A, B, C, D, E, F, G, H, I, J, K, L, M, N,
        O, P, Q, R, S, T, U, V, W, X, Y, Z. The additional letters are: Ä, Ö, Ü, and ß. The
        alphabet is often used to spell words, write names, and learn in school. For example: A as
        in Apfel, B as in Ball, C as in Computer, and D as in Deutschland.
      </p>
    </section>

    <section style={sectionStyle}>
      <h2 style={{ margin: 0 }}>Teil 2 · Questions</h2>
      {alphabetQuestions.map((question) => (
        <div key={question.stem} style={questionBoxStyle}>
          <strong>{question.stem}</strong>
          <span style={{ color: "#4b5563" }}>Translation: {question.translation}</span>
          {question.options.map((option) => <span key={option}>{option}</span>)}
        </div>
      ))}
    </section>

    <A1AlphabetHoerenSection sectionStyle={sectionStyle} />

    <section style={sectionStyle}>
      <h2 style={{ margin: 0 }}>Vocabulary Notes · Alphabet in German</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        <strong>Additional Letters:</strong> Ä (A-Umlaut), Ö (O-Umlaut), Ü (U-Umlaut), ß
        (Eszett / scharfes S).
        <br />
        <strong>Example Words:</strong> Apfel, Ball, Computer, Deutschland.
        <br />
        <strong>Useful Phrases:</strong> Wie buchstabiert man...?, Wie viele Buchstaben...?,
        Welche Buchstaben...?, das Alphabet, der Buchstabe, das Wort, lesen, schreiben,
        buchstabieren, richtig, falsch.
      </p>
    </section>

    <div style={{ ...styles.card, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
      <p style={{ margin: 0, fontWeight: 600 }}>
        Finished the workbook? Open the Submit tab above and paste your final answers there.
      </p>
    </div>
  </>
);

export default A1AlphabetAssignmentContent;
