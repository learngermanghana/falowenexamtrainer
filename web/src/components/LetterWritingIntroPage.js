import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { styles } from "../styles";

const Section = ({ id, title, accentColor, accentBackground, children }) => (
  <section
    id={id}
    style={{
      ...styles.card,
      display: "grid",
      gap: 12,
      borderLeft: accentColor ? `6px solid ${accentColor}` : styles.card.border,
      background: accentBackground || styles.card.background,
    }}
  >
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const Checklist = ({ items }) => {
  const [checkedItems, setCheckedItems] = useState(() => items.map(() => false));

  useEffect(() => {
    setCheckedItems(items.map(() => false));
  }, [items]);

  return (
    <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
      {items.map((item, index) => (
        <li key={item}>
          <label style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <input
              type="checkbox"
              checked={checkedItems[index] || false}
              onChange={() =>
                setCheckedItems((prev) => prev.map((value, idx) => (idx === index ? !value : value)))
              }
            />
            <span>{item}</span>
          </label>
        </li>
      ))}
    </ol>
  );
};

const AnnotatedSample = ({ title, items, accentColor, accentBackground }) => (
  <div
    style={{
      borderRadius: 12,
      border: `1px solid ${accentColor}`,
      background: accentBackground,
      padding: 16,
      display: "grid",
      gap: 12,
    }}
  >
    <h3 style={{ margin: 0 }}>{title}</h3>
    <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
      {items.map((item) => (
        <li key={item.label}>
          <strong>{item.label}:</strong> {item.text}
        </li>
      ))}
    </ul>
  </div>
);

const LetterWritingIntroPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const formalSalutations = t("letterWritingIntro.formal.salutations", { returnObjects: true });
  const formalOpeningExamples = t("letterWritingIntro.formal.openingExamples", { returnObjects: true });
  const informalSalutations = t("letterWritingIntro.informal.salutations", { returnObjects: true });
  const informalOpeningExamples = t("letterWritingIntro.informal.openingExamples", { returnObjects: true });
  const informalSteps = t("letterWritingIntro.informalAssignment.steps", { returnObjects: true });
  const formalSteps = t("letterWritingIntro.formalAssignment.steps", { returnObjects: true });
  const formalSample = t("letterWritingIntro.annotatedSamples.formal.items", { returnObjects: true });
  const informalSample = t("letterWritingIntro.annotatedSamples.informal.items", { returnObjects: true });

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          {t("letterWritingIntro.backToCourse")}
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>{t("letterWritingIntro.title")}</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>{t("letterWritingIntro.subtitle")}</p>
        <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>{t("letterWritingIntro.languageNote")}</p>
        <nav style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 13, color: "#4b5563", fontWeight: 600 }}>
            {t("letterWritingIntro.toc.label")}
          </span>
          <a href="#formal" style={{ fontSize: 13, color: "#2563eb", fontWeight: 600 }}>
            {t("letterWritingIntro.toc.formal")}
          </a>
          <a href="#informal" style={{ fontSize: 13, color: "#059669", fontWeight: 600 }}>
            {t("letterWritingIntro.toc.informal")}
          </a>
          <a href="#informal-assignment" style={{ fontSize: 13, color: "#059669", fontWeight: 600 }}>
            {t("letterWritingIntro.toc.informalAssignment")}
          </a>
          <a href="#formal-assignment" style={{ fontSize: 13, color: "#2563eb", fontWeight: 600 }}>
            {t("letterWritingIntro.toc.formalAssignment")}
          </a>
        </nav>
      </div>

      <Section
        id="formal"
        title={t("letterWritingIntro.formalTitle")}
        accentColor="#2563eb"
        accentBackground="#eff6ff"
      >
        <BulletList items={formalSalutations} />
        <p style={{ margin: 0 }}>
          <Trans i18nKey="letterWritingIntro.formal.openingLine" components={{ strong: <strong />, em: <em /> }} />
        </p>
        <BulletList items={formalOpeningExamples} />
        <p style={{ margin: 0 }}>
          <Trans i18nKey="letterWritingIntro.formal.mainBody" components={{ strong: <strong />, em: <em /> }} />
        </p>
        <p style={{ margin: 0 }}>
          <Trans i18nKey="letterWritingIntro.formal.conclusion" components={{ strong: <strong />, em: <em /> }} />
        </p>
      </Section>

      <Section
        id="informal"
        title={t("letterWritingIntro.informalTitle")}
        accentColor="#059669"
        accentBackground="#ecfdf3"
      >
        <BulletList items={informalSalutations} />
        <p style={{ margin: 0 }}>
          <Trans i18nKey="letterWritingIntro.informal.openingLine" components={{ strong: <strong />, em: <em /> }} />
        </p>
        <BulletList items={informalOpeningExamples} />
        <p style={{ margin: 0 }}>
          <Trans i18nKey="letterWritingIntro.informal.mainBody" components={{ strong: <strong />, em: <em /> }} />
        </p>
        <p style={{ margin: 0 }}>
          <Trans i18nKey="letterWritingIntro.informal.conclusion" components={{ strong: <strong />, em: <em /> }} />
        </p>
      </Section>

      <Section
        id="annotated-samples"
        title={t("letterWritingIntro.annotatedSamplesTitle")}
        accentColor="#7c3aed"
        accentBackground="#f5f3ff"
      >
        <AnnotatedSample
          title={t("letterWritingIntro.annotatedSamples.formal.title")}
          items={formalSample}
          accentColor="#93c5fd"
          accentBackground="#eff6ff"
        />
        <AnnotatedSample
          title={t("letterWritingIntro.annotatedSamples.informal.title")}
          items={informalSample}
          accentColor="#6ee7b7"
          accentBackground="#ecfdf3"
        />
      </Section>

      <Section
        id="informal-assignment"
        title={t("letterWritingIntro.informalAssignmentTitle")}
        accentColor="#059669"
        accentBackground="#ecfdf3"
      >
        <p style={{ margin: 0 }}>{t("letterWritingIntro.informalAssignment.intro")}</p>
        <Checklist items={informalSteps} />
        <p style={{ margin: 0 }}>
          <Trans i18nKey="letterWritingIntro.informalAssignment.sampleQuestion" components={{ strong: <strong /> }} />
        </p>
        <p style={{ margin: 0 }}>{t("letterWritingIntro.informalAssignment.afterWriting")}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button style={styles.primaryButton} onClick={() => navigate("/campus/writing")}>
            {t("letterWritingIntro.cta.startWriting")}
          </button>
          <button style={styles.secondaryButton} onClick={() => navigate("/campus/writing?tab=ideas")}>
            {t("letterWritingIntro.cta.openIdeas")}
          </button>
        </div>
      </Section>

      <Section
        id="formal-assignment"
        title={t("letterWritingIntro.formalAssignmentTitle")}
        accentColor="#2563eb"
        accentBackground="#eff6ff"
      >
        <p style={{ margin: 0 }}>{t("letterWritingIntro.formalAssignment.intro")}</p>
        <Checklist items={formalSteps} />
        <p style={{ margin: 0 }}>
          <Trans i18nKey="letterWritingIntro.formalAssignment.sampleQuestion" components={{ strong: <strong /> }} />
        </p>
        <p style={{ margin: 0 }}>{t("letterWritingIntro.formalAssignment.afterWriting")}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button style={styles.primaryButton} onClick={() => navigate("/campus/writing")}>
            {t("letterWritingIntro.cta.startWriting")}
          </button>
          <button style={styles.secondaryButton} onClick={() => navigate("/campus/writing?tab=ideas")}>
            {t("letterWritingIntro.cta.openIdeas")}
          </button>
        </div>
      </Section>
    </div>
  );
};

export default LetterWritingIntroPage;
