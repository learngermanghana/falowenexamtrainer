import React from "react";
import { styles, vocabPrompts } from "../styles";
import { vocabLists } from "../data/vocabLists";

const VocabPage = () => (
  <>
    <section style={styles.card}>
      <h2 style={styles.sectionTitle}>Vokabel-Booster</h2>
      <p style={styles.helperText}>
        🧠 Nutze diese Mini-Listen als Schnellhilfe für deine Antworten. Lies sie laut vor und bau sie in deine Beispiele ein.
      </p>
      <div style={styles.vocabGrid}>
        {vocabLists.map((block) => (
          <div key={block.title} style={styles.vocabCard}>
            <h4 style={styles.vocabTitle}>{block.title}</h4>
            <ul style={styles.vocabList}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>

    <section style={styles.card}>
      <h3 style={styles.sectionTitle}>Mini-Übung</h3>
      <p style={styles.helperText}>
        Wähle zwei Ausdrücke aus den Listen oben und schreibe oder spreche einen kurzen Dialog. Kombiniere mindestens eine Frage und eine Bitte.
      </p>
      <ul style={styles.promptList}>
        {vocabPrompts.map((prompt) => (
          <li key={prompt}>{prompt}</li>
        ))}
      </ul>
    </section>
  </>
);

export default VocabPage;
