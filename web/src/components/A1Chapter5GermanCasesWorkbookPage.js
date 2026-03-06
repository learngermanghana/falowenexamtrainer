import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const tabs = [
  { key: "vocabulary", label: "Teil 1 · Vocabulary Review" },
  { key: "nominative", label: "Teil 2 · Nominative Case" },
  { key: "accusative", label: "Teil 3 · Accusative Case" },
];

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
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

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.secondaryButton,
        borderColor: active ? "#2563eb" : "#d1d5db",
        background: active ? "#eff6ff" : "#fff",
        color: active ? "#1d4ed8" : "#111827",
      }}
    >
      {children}
    </button>
  );
}

const vocabularyPairs = [
  "1. der Tisch → j. the table",
  "2. die Lampe → c. the lamp",
  "3. das Buch → g. the book",
  "4. der Stuhl → e. the chair",
  "5. die Katze → f. the cat",
  "6. das Auto → h. the car",
  "7. der Hund → a. the dog",
  "8. die Blume → b. the flower",
  "9. das Fenster → d. the window",
  "10. der Computer → i. the computer",
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("vocabulary");

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · Chapter 5 Workbook · Nominative & Akkusative, Definite & Indefinite Articles</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          German Cases · Chapter 5. Prepare all answers in your notebook first, then submit them in the assignment submission tab.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => (
            <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </TabButton>
          ))}
        </div>

        <p style={{ margin: 0, color: "#4b5563" }}>
          Tab {activeIndex + 1} of {tabs.length}
        </p>
      </div>

      {activeTab === "vocabulary" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1600&q=80"
            alt="German workbook and vocabulary study materials on a desk"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1: Vocabulary Review</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Match the German nouns with their English meanings.</strong> Ordne die deutschen Nomen den englischen Bedeutungen zu.
          </p>
          <ol style={listSpacing}>
            {vocabularyPairs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <p style={{ margin: 0, background: "#fef3c7", borderRadius: 8, padding: "10px 12px", fontWeight: 700 }}>
            Read-only workbook: prepare your answers here, then submit them in the assignment submission area.
          </p>
        </div>
      )}

      {activeTab === "nominative" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Notebook open to German grammar notes for nominative case"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2: Nominative Case</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Fill in each blank with the correct nominative article: <strong>der, die, das</strong>.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Ergänze die Sätze mit dem richtigen Nominativartikel: <strong>der, die, das</strong>.
          </p>
          <ol style={listSpacing}>
            {nominativePractice.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#fff" }}>
            <h3 style={{ ...sectionTitle, marginBottom: 8 }}>Quick Rule / Kurzregel</h3>
            <ul style={listSpacing}>
              <li>
                <strong>Nominative Articles:</strong> der (masculine), die (feminine), das (neuter)
              </li>
              <li>
                Der Nominativ zeigt das Subjekt im Satz (wer oder was etwas tut).
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === "accusative" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1600&q=80"
            alt="Learner reviewing German accusative exercises in a workbook"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3: Accusative Case</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Fill in each blank with the correct accusative article: <strong>den, die, das</strong>.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Ergänze die Sätze mit dem richtigen Akkusativartikel: <strong>den, die, das</strong>.
          </p>
          <ol style={listSpacing}>
            {accusativePractice.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>

          <h3 style={sectionTitle}>Vocabulary List: Nominative and Accusative Articles</h3>
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
            <strong>Nominative Articles</strong>: der (masculine), die (feminine), das (neuter)
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Accusative Articles</strong>: den (masculine), die (feminine), das (neuter)
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
            Kein Texteingabefeld hier: Write your final responses in your notebook and submit through the assignment submission tab.
          </p>
        </div>
      )}
    </div>
  );
};

export default A1Chapter5GermanCasesWorkbookPage;
