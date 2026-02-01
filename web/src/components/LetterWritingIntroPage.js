import React from "react";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { styles } from "../styles";

const Section = ({ title, children }) => (
  <div style={{ ...styles.card, display: "grid", gap: 12 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </div>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
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

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          {t("letterWritingIntro.backToCourse")}
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>{t("letterWritingIntro.title")}</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>{t("letterWritingIntro.subtitle")}</p>
      </div>

      <Section title={t("letterWritingIntro.formalTitle")}>
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

      <Section title={t("letterWritingIntro.informalTitle")}>
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

      <Section title={t("letterWritingIntro.informalAssignmentTitle")}>
        <p style={{ margin: 0 }}>{t("letterWritingIntro.informalAssignment.intro")}</p>
        <BulletList items={informalSteps} />
        <p style={{ margin: 0 }}>
          <Trans i18nKey="letterWritingIntro.informalAssignment.sampleQuestion" components={{ strong: <strong /> }} />
        </p>
        <p style={{ margin: 0 }}>{t("letterWritingIntro.informalAssignment.afterWriting")}</p>
      </Section>

      <Section title={t("letterWritingIntro.formalAssignmentTitle")}>
        <p style={{ margin: 0 }}>{t("letterWritingIntro.formalAssignment.intro")}</p>
        <BulletList items={formalSteps} />
        <p style={{ margin: 0 }}>
          <Trans i18nKey="letterWritingIntro.formalAssignment.sampleQuestion" components={{ strong: <strong /> }} />
        </p>
        <p style={{ margin: 0 }}>{t("letterWritingIntro.formalAssignment.afterWriting")}</p>
      </Section>
    </div>
  );
};

export default LetterWritingIntroPage;
