import React from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { vocabLists } from "../data/vocabLists";

const VocabPage = () => {
  const { t } = useTranslation();
  const prompts = t("vocabPage.prompts", { returnObjects: true });

  return (
    <>
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>{t("vocabPage.title")}</h2>
        <p style={styles.helperText}>{t("vocabPage.intro")}</p>
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
        <h3 style={styles.sectionTitle}>{t("vocabPage.exerciseTitle")}</h3>
        <p style={styles.helperText}>{t("vocabPage.exerciseIntro")}</p>
        <ul style={styles.promptList}>
          {prompts.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default VocabPage;
