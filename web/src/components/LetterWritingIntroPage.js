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

const FillInTemplateExercise = ({ title, instructions, templateLines, optionsLabel, options, completionNote }) => {
  const [filledSlots, setFilledSlots] = useState({});
  const [draggedOption, setDraggedOption] = useState(null);

  useEffect(() => {
    setFilledSlots({});
  }, [templateLines, options]);

  const allSlots = templateLines
    .flatMap((line) => line.parts)
    .filter((part) => typeof part === "object" && part.slotId);

  const usedOptionIds = new Set(Object.values(filledSlots));
  const availableOptions = options.filter((option) => !usedOptionIds.has(option.id));

  const assignOptionToSlot = (slotId, optionId) => {
    setFilledSlots((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((existingSlotId) => {
        if (next[existingSlotId] === optionId) {
          delete next[existingSlotId];
        }
      });
      next[slotId] = optionId;
      return next;
    });
  };

  const clearSlot = (slotId) => {
    setFilledSlots((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
  };

  const isComplete = allSlots.length > 0 && allSlots.every((slot) => filledSlots[slot.slotId]);

  return (
    <div style={{ ...styles.card, display: "grid", gap: 12, border: "1px solid #cbd5e1" }}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ margin: 0 }}>{instructions}</p>

      <div style={{ display: "grid", gap: 10, background: "#f8fafc", borderRadius: 12, padding: 14 }}>
        {templateLines.map((line) => (
          <p key={line.id} style={{ margin: 0, lineHeight: 1.7 }}>
            {line.parts.map((part, index) => {
              if (typeof part === "string") {
                return <span key={`${line.id}-${index}`}>{part}</span>;
              }

              const filledOptionId = filledSlots[part.slotId];
              const filledOption = options.find((option) => option.id === filledOptionId);

              return (
                <button
                  key={part.slotId}
                  type="button"
                  onDrop={(event) => {
                    event.preventDefault();
                    const droppedId = event.dataTransfer.getData("text/plain") || draggedOption;
                    if (droppedId) {
                      assignOptionToSlot(part.slotId, droppedId);
                    }
                    setDraggedOption(null);
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  onClick={() => clearSlot(part.slotId)}
                  style={{
                    margin: "0 4px",
                    minWidth: 150,
                    borderRadius: 8,
                    border: `2px dashed ${filledOption ? "#0ea5e9" : "#94a3b8"}`,
                    background: filledOption ? "#e0f2fe" : "#ffffff",
                    color: "#0f172a",
                    padding: "6px 10px",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  {filledOption ? filledOption.label : part.placeholder}
                </button>
              );
            })}
          </p>
        ))}
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <strong style={{ fontSize: 14, color: "#334155" }}>{optionsLabel}</strong>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {availableOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData("text/plain", option.id);
                setDraggedOption(option.id);
              }}
              onClick={() => {
                const firstEmptySlot = allSlots.find((slot) => !filledSlots[slot.slotId]);
                if (firstEmptySlot) {
                  assignOptionToSlot(firstEmptySlot.slotId, option.id);
                }
              }}
              style={{
                border: "1px solid #94a3b8",
                borderRadius: 999,
                padding: "6px 12px",
                background: "#ffffff",
                color: "#0f172a",
                cursor: "grab",
                fontSize: 14,
              }}
              title={option.helpText}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {isComplete && (
        <div style={{ borderRadius: 10, background: "#ecfdf5", border: "1px solid #86efac", padding: 10 }}>
          {completionNote}
        </div>
      )}
    </div>
  );
};

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
  const additionalTips = t("letterWritingIntro.additionalTips.items", { returnObjects: true });
  const firstLetterTemplate = t("letterWritingIntro.firstLetterTemplate", { returnObjects: true });

  const firstLetterTemplateData = {
    exerciseTitle: firstLetterTemplate?.exerciseTitle || "Build your first letter",
    instructions: firstLetterTemplate?.instructions || "Drag each phrase into the correct blank.",
    templateLines: Array.isArray(firstLetterTemplate?.templateLines) ? firstLetterTemplate.templateLines : [],
    optionsLabel: firstLetterTemplate?.optionsLabel || "Drag options:",
    options: Array.isArray(firstLetterTemplate?.options) ? firstLetterTemplate.options : [],
    completionNote:
      firstLetterTemplate?.completionNote || "Great. Now copy your completed letter and submit it as your assignment.",
    afterTemplate:
      firstLetterTemplate?.afterTemplate ||
      "After completing the template, copy the full letter in your notebook and submit it through your normal assignment flow.",
  };

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
          <a href="#first-letter-template" style={{ fontSize: 13, color: "#d97706", fontWeight: 600 }}>
            {t("letterWritingIntro.toc.firstLetterTemplate")}
          </a>
          <a href="#additional-tips" style={{ fontSize: 13, color: "#7c3aed", fontWeight: 600 }}>
            {t("letterWritingIntro.toc.additionalTips")}
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
        id="first-letter-template"
        title={t("letterWritingIntro.firstLetterTemplateTitle")}
        accentColor="#f59e0b"
        accentBackground="#fffbeb"
      >
        <FillInTemplateExercise
          title={firstLetterTemplateData.exerciseTitle}
          instructions={firstLetterTemplateData.instructions}
          templateLines={firstLetterTemplateData.templateLines}
          optionsLabel={firstLetterTemplateData.optionsLabel}
          options={firstLetterTemplateData.options}
          completionNote={firstLetterTemplateData.completionNote}
        />
        <p style={{ margin: 0 }}>{firstLetterTemplateData.afterTemplate}</p>
      </Section>

      <Section
        id="additional-tips"
        title={t("letterWritingIntro.additionalTipsTitle")}
        accentColor="#7c3aed"
        accentBackground="#f5f3ff"
      >
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 12 }}>
          {additionalTips.map((tip) => (
            <li key={tip.title} style={{ display: "grid", gap: 6 }}>
              <strong>{tip.title}</strong>
              <div style={{ display: "grid", gap: 4 }}>
                {tip.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
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
