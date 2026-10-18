import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import A1TranslationTask from "./A1TranslationTask";
import A1Day8ListeningPractice from "./A1Day8ListeningPractice";
import A1WorkbookSpeakingCheckpoint from "./A1WorkbookSpeakingCheckpoint";

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

const imageStyle = {
  width: "100%",
  maxHeight: 320,
  objectFit: "cover",
  borderRadius: 12,
};

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
        <img
          src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1600&q=80"
          alt="World map with highlighted countries and language connections"
          loading="lazy"
          style={imageStyle}
        />
        <A1TranslationTask
          sectionKey="teil-1"
          title="Herkunft und Sprache"
          instruction="Translate each sentence into German. Pay attention to the subject, verb form, country and language."
          questions={[
            { number: 1, text: "I come from Germany. I speak German.", cue: "kommen aus · sprechen" },
            { number: 2, text: "She comes from France. She speaks French.", cue: "sie · kommt · spricht" },
            { number: 3, text: "They come from Russia. They speak Russian.", cue: "sie (Plural) · kommen · sprechen" },
            { number: 4, text: "We come from Japan. We speak Japanese.", cue: "wir · kommen · sprechen" },
            { number: 5, text: "He comes from England. He speaks English.", cue: "er · kommt · spricht" },
          ]}
        />
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Teil 2 · Sprechen: Sich vorstellen</h2>
        <A1WorkbookSpeakingCheckpoint assignmentKey="A1-4" />
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Teil 3 · Freunde sprechen über Herkunft und Sprachen (Hören)</h2>
        <A1Day8ListeningPractice />
      </section>
    </A1TutorMarkedWorkbookShell>
  );
};

export default A1Day8CountriesAndLanguagesWorkbookPage;
