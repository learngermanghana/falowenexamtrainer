import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";

import { styles } from "../styles";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "1.1rem",
};

const subSectionTitleStyle = {
  margin: 0,
  fontSize: "1rem",
};

const listStyle = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.7,
};

const questionCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 8,
};

const imageStyle = {
  width: "100%",
  maxHeight: 320,
  objectFit: "cover",
  borderRadius: 12,
};

const listeningVideoStyle = {
  width: "100%",
  aspectRatio: "16 / 9",
  minHeight: 260,
  border: 0,
  borderRadius: 12,
};

const essayText = [
  "Deutschland liegt in Europa. Es hat neun Nachbarländer. Diese sind: Dänemark, Polen, Tschechien, Österreich, die Schweiz, Frankreich, Luxemburg, Belgien und die Niederlande.",
  "In Deutschland spricht man Deutsch. In Polen spricht man Polnisch. In Frankreich spricht man Französisch. In den Niederlanden spricht man Niederländisch. In Österreich und der Schweiz spricht man Deutsch. In der Schweiz spricht man auch Französisch und Italienisch.",
  "Die Nachbarländer haben viele interessante Städte. Paris ist in Frankreich. Es ist eine sehr schöne Stadt. Amsterdam ist in den Niederlanden. Es hat viele Kanäle. In der Schweiz gibt es die Alpen. Sie sind sehr hoch.",
];

const A1Day8CountriesAndLanguagesWorkbookPage = () => {
  return (
    <A1TutorMarkedWorkbookShell
      day={8}
      chapter="4"
      fallbackAssignmentKey="A1-4"
      title="A1 · Day 8 Workbook · Countries and Languages"
      subtitle="Chapter 4 · Tutor-marked assignment"
      submitTitle="Submit A1 · Day 8 · Chapter 4"
    >
      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Teil 1 · Countries and Languages Part 1: Translation</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>Translate the following sentences into German.</p>
        <img
          src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1600&q=80"
          alt="World map with highlighted countries and language connections"
          loading="lazy"
          style={imageStyle}
        />
        <ol style={listStyle}>
          <li>I come from Germany. I speak German.</li>
          <li>She comes from France. She speaks French.</li>
          <li>They come from Russia. They speak Russian.</li>
          <li>We come from Japan. We speak Japanese.</li>
          <li>He comes from England. He speaks English.</li>
        </ol>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Teil 2 · Essay: Germany&apos;s Neighbors</h2>
        {essayText.map((paragraph) => (
          <p key={paragraph} style={{ margin: 0, lineHeight: 1.7 }}>
            {paragraph}
          </p>
        ))}

        <h3 style={subSectionTitleStyle}>Questions</h3>
        <ol style={listStyle}>
          <li>
            Wie viele Nachbarländer hat Deutschland?
            <ul style={listStyle}>
              <li>a) Sieben</li>
              <li>b) Acht</li>
              <li>c) Neun</li>
              <li>d) Zehn</li>
            </ul>
          </li>
          <li>
            Welche Sprache spricht man in Polen?
            <ul style={listStyle}>
              <li>a) Deutsch</li>
              <li>b) Polnisch</li>
              <li>c) Französisch</li>
              <li>d) Niederländisch</li>
            </ul>
          </li>
          <li>
            Welche Sprache spricht man in den Niederlanden?
            <ul style={listStyle}>
              <li>a) Deutsch</li>
              <li>b) Polnisch</li>
              <li>c) Französisch</li>
              <li>d) Niederländisch</li>
            </ul>
          </li>
          <li>
            Welche Sprache spricht man in Österreich?
            <ul style={listStyle}>
              <li>a) Deutsch</li>
              <li>b) Polnisch</li>
              <li>c) Französisch</li>
              <li>d) Niederländisch</li>
            </ul>
          </li>
          <li>
            Welche Stadt ist in Frankreich?
            <ul style={listStyle}>
              <li>a) Berlin</li>
              <li>b) Amsterdam</li>
              <li>c) Paris</li>
              <li>d) Wien</li>
            </ul>
          </li>
          <li>
            Welche Stadt hat viele Kanäle?
            <ul style={listStyle}>
              <li>a) Berlin</li>
              <li>b) Amsterdam</li>
              <li>c) Paris</li>
              <li>d) Wien</li>
            </ul>
          </li>
          <li>
            Wo sind die Alpen?
            <ul style={listStyle}>
              <li>a) In Polen</li>
              <li>b) In Frankreich</li>
              <li>c) In der Schweiz</li>
              <li>d) In Deutschland</li>
            </ul>
          </li>
        </ol>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Teil 3 · Germany&apos;s Neighbors (Hören)</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>Listen to the video below and choose one correct answer.</p>
        <iframe
          title="A1 Day 8 Hören: Annas Reisepläne"
          src="https://www.youtube.com/embed/nqTYvpXFGfQ"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={listeningVideoStyle}
        />

        <div style={questionCardStyle}>
          <strong>Fragen:</strong>
          <ol style={listStyle}>
            <li>
              Wo war Anna letztes Jahr?
              <ul style={listStyle}>
                <li>a) In Spanien und Italien</li>
                <li>b) In Frankreich und Deutschland</li>
                <li>c) In Italien und Frankreich</li>
                <li>d) In Italien und Spanien</li>
              </ul>
            </li>
            <li>
              Welche Stadt hat Anna in Italien besucht?
              <ul style={listStyle}>
                <li>a) Paris</li>
                <li>b) Madrid</li>
                <li>c) Rom</li>
                <li>d) Berlin</li>
              </ul>
            </li>
            <li>
              Was hat Anna in Italien gefallen?
              <ul style={listStyle}>
                <li>a) Das Wetter</li>
                <li>b) Das Essen</li>
                <li>c) Der Eiffelturm</li>
                <li>d) Das Meer</li>
              </ul>
            </li>
            <li>
              Wo war Anna in Frankreich?
              <ul style={listStyle}>
                <li>a) Rom</li>
                <li>b) Paris</li>
                <li>c) Barcelona</li>
                <li>d) London</li>
              </ul>
            </li>
            <li>
              Wohin möchte Anna nächstes Jahr?
              <ul style={listStyle}>
                <li>a) Nach Spanien</li>
                <li>b) Nach Deutschland</li>
                <li>c) Nach Italien</li>
                <li>d) Nach Frankreich</li>
              </ul>
            </li>
          </ol>
        </div>
      </section>
    </A1TutorMarkedWorkbookShell>
  );
};

export default A1Day8CountriesAndLanguagesWorkbookPage;
