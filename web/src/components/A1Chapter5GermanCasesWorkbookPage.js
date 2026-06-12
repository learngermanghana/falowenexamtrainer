import React from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionCard = {
  ...card,
  border: "1px solid #e5e7eb",
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.1rem",
};

const listSpacing = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.7,
};

const vocabularyGerman = [
  "1. der Tisch",
  "2. die Lampe",
  "3. das Buch",
  "4. der Stuhl",
  "5. die Katze",
  "6. das Auto",
  "7. der Hund",
  "8. die Blume",
  "9. das Fenster",
  "10. der Computer",
];

const vocabularyEnglish = [
  "a. the dog",
  "b. the flower",
  "c. the lamp",
  "d. the window",
  "e. the chair",
  "f. the cat",
  "g. the book",
  "h. the car",
  "i. the computer",
  "j. the table",
];

const nominativePractice = [
  "1. __________ Tisch ist groß.",
  "2. __________ Lampe ist neu.",
  "3. __________ Buch ist interessant.",
  "4. __________ Stuhl ist bequem.",
  "5. __________ Katze ist süß.",
  "6. __________ Auto ist schnell.",
  "7. __________ Hund ist freundlich.",
  "8. __________ Blume ist schön.",
  "9. __________ Fenster ist offen.",
  "10. __________ Computer ist teuer.",
];

const accusativePractice = [
  "1. Ich sehe __________ Tisch.",
  "2. Sie kauft __________ Lampe.",
  "3. Er liest __________ Buch.",
  "4. Wir brauchen __________ Stuhl.",
  "5. Du fütterst __________ Katze.",
  "6. Ich fahre __________ Auto.",
  "7. Sie streichelt __________ Hund.",
  "8. Er pflückt __________ Blume.",
  "9. Wir putzen __________ Fenster.",
  "10. Sie benutzen __________ Computer.",
];

const A1Chapter5GermanCasesWorkbookPage = () => {

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A1 · Chapter 5 Workbook · Nominative & Akkusative, Definite & Indefinite Articles
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          German Cases · Chapter 5. This workbook is now organized on one page,
          so complete Teil 1, Teil 2, and Teil 3 from top to bottom.
        </p>
      </div>

      <div style={sectionCard}>
        <img
          src="https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1600&q=80"
          alt="German workbook and vocabulary study materials on a desk"
          loading="lazy"
          style={{
            width: "100%",
            borderRadius: 10,
            maxHeight: 260,
            objectFit: "cover",
          }}
        />

        <h2 style={sectionTitle}>Teil 1: Vocabulary Review</h2>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Match the German nouns with their English meanings.</strong>{" "}
          Ordne die deutschen Nomen den englischen Bedeutungen zu.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          <div>
            <h3 style={{ ...sectionTitle, marginBottom: 8 }}>German Nouns</h3>
            <ol style={listSpacing}>
              {vocabularyGerman.map((item) => (
                <li key={item}>{item.replace(/^\d+\.\s*/, "")}</li>
              ))}
            </ol>
          </div>

          <div>
            <h3 style={{ ...sectionTitle, marginBottom: 8 }}>
              English Meanings
            </h3>
            <ol style={listSpacing} type="a">
              {vocabularyEnglish.map((item) => (
                <li key={item}>{item.replace(/^[a-j]\.\s*/, "")}</li>
              ))}
            </ol>
          </div>
        </div>

        <p
          style={{
            margin: 0,
            background: "#fef3c7",
            borderRadius: 8,
            padding: "10px 12px",
            fontWeight: 700,
            lineHeight: 1.6,
          }}
        >
          Important: Do not write only a, b, c, etc. as your answers. Write the
          full English meaning for each German noun, for example: der Tisch =
          the table.
        </p>
      </div>

      <div style={sectionCard}>
        <img
          src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
          alt="Notebook open to German grammar notes for nominative case"
          loading="lazy"
          style={{
            width: "100%",
            borderRadius: 10,
            maxHeight: 260,
            objectFit: "cover",
          }}
        />

        <h2 style={sectionTitle}>Teil 2: Nominative Case</h2>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Fill in each blank with the correct nominative article:{" "}
          <strong>der, die, das</strong>.
        </p>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Ergänze die Sätze mit dem richtigen Nominativartikel:{" "}
          <strong>der, die, das</strong>.
        </p>

        <ol style={listSpacing}>
          {nominativePractice.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: 12,
            background: "#fff",
          }}
        >
          <h3 style={{ ...sectionTitle, marginBottom: 8 }}>
            Quick Rule / Kurzregel
          </h3>
          <ul style={listSpacing}>
            <li>
              <strong>Nominative Articles:</strong> der (masculine), die
              (feminine), das (neuter)
            </li>
            <li>
              Der Nominativ zeigt das Subjekt im Satz (wer oder was etwas tut).
            </li>
          </ul>
        </div>
      </div>

      <div style={sectionCard}>
        <img
          src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1600&q=80"
          alt="Learner reviewing German accusative exercises in a workbook"
          loading="lazy"
          style={{
            width: "100%",
            borderRadius: 10,
            maxHeight: 260,
            objectFit: "cover",
          }}
        />

        <h2 style={sectionTitle}>Teil 3: Accusative Case</h2>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Fill in each blank with the correct accusative article:{" "}
          <strong>den, die, das</strong>.
        </p>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Ergänze die Sätze mit dem richtigen Akkusativartikel:{" "}
          <strong>den, die, das</strong>.
        </p>

        <ol style={listSpacing}>
          {accusativePractice.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>

        <h3 style={sectionTitle}>
          Vocabulary List: Nominative and Accusative Articles
        </h3>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Nouns and Articles</strong>
        </p>

        <ol style={listSpacing}>
          <li>der Tisch - the table</li>
          <li>die Lampe - the lamp</li>
          <li>das Buch - the book</li>
          <li>der Stuhl - the chair</li>
          <li>die Katze - the cat</li>
          <li>das Auto - the car</li>
          <li>der Hund - the dog</li>
          <li>die Blume - the flower</li>
          <li>das Fenster - the window</li>
          <li>der Computer - the computer</li>
          <li>der Schrank - the wardrobe</li>
          <li>das Sofa - the sofa</li>
          <li>der Fernseher - the television</li>
          <li>das Bett - the bed</li>
          <li>der Kleiderschrank - the wardrobe</li>
          <li>der Couchtisch - the coffee table</li>
          <li>das Bücherregal - the bookshelf</li>
          <li>die Küche - the kitchen</li>
          <li>das Badezimmer - the bathroom</li>
          <li>das Wohnzimmer - the living room</li>
        </ol>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Nominative Articles</strong>: der (masculine), die (feminine),
          das (neuter)
        </p>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Accusative Articles</strong>: den (masculine), die (feminine),
          das (neuter)
        </p>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Adjectives and Descriptions</strong>
        </p>

        <ol style={listSpacing}>
          <li>groß - big</li>
          <li>klein - small</li>
          <li>neu - new</li>
          <li>alt - old</li>
          <li>schnell - fast</li>
          <li>langsam - slow</li>
          <li>schön - beautiful</li>
          <li>hässlich - ugly</li>
          <li>bequem - comfortable</li>
          <li>unbequem - uncomfortable</li>
          <li>praktisch - practical</li>
          <li>teuer - expensive</li>
          <li>billig - cheap</li>
          <li>freundlich - friendly</li>
          <li>süß - cute</li>
        </ol>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Verbs</strong>
        </p>

        <ol style={listSpacing}>
          <li>sehen - to see</li>
          <li>kaufen - to buy</li>
          <li>lesen - to read</li>
          <li>brauchen - to need</li>
          <li>füttern - to feed</li>
          <li>fahren - to drive</li>
          <li>streicheln - to pet</li>
          <li>pflücken - to pick (flowers)</li>
          <li>putzen - to clean</li>
          <li>benutzen - to use</li>
        </ol>

        <p style={{ margin: 0, color: "#4b5563" }}>
          Kein Texteingabefeld hier: Write your final responses in your notebook
          and submit through the assignment submission tab.
        </p>
      </div>
    </div>
  );
};

export default A1Chapter5GermanCasesWorkbookPage;
