import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import A1Day3SchreibenSprechenKapitel11WorkbookPageLegacy from "./A1Day3SchreibenSprechenKapitel11WorkbookPageLegacy";
import LiveClassResponsePanel from "./LiveClassResponsePanel";
import PersonalInformationContributionBox from "./PersonalInformationContributionBox";
import SelfLearningSupportingMaterials from "./selfLearning/SelfLearningSupportingMaterials";
import { getCanonicalA1TeacherVideoResource } from "../data/a1TeacherVideoResources";

export const A1_DAY3_PRACTICE_VIDEOS = Object.freeze([
  Object.freeze({
    key: "ai-lesson-video",
    label: "AI lesson video",
    title: "Kapitel 1.1 AI lesson",
    description:
      "Review the Kapitel 1.1 language and speaking practice before continuing with the workbook activities.",
    youtubeId: "LdCVsY-SFTg",
    url: "https://youtu.be/LdCVsY-SFTg",
  }),
]);

export const A1_DAY3_KAPITEL_11_TEACHER_VIDEO = getCanonicalA1TeacherVideoResource(3, "1.1");

const LIVE_CLASS_LESSON_ID = "A1-day-3-kapitel-1.1-w-words";
const liveQuestions = [
  { id: "1", stem: "1. ___ ist das?", options: ["Was", "Wer", "Wie", "Wo"] },
  { id: "2", stem: "2. ___ ist Martin?", options: ["Was", "Wer", "Wie", "Wo"] },
  { id: "3", stem: "3. ___ ist der Ball?", options: ["Was", "Wer", "Wie", "Wo"] },
  { id: "4", stem: "4. ___ ist das?", options: ["Was", "Wer", "Wie", "Wo"] },
  { id: "5", stem: "5. ___ spielt mit dem Ball?", options: ["Was", "Wer", "Wie", "Wo"] },
  { id: "6", stem: "6. ___ heißt du?", options: ["Was", "Wer", "Wie", "Wo"] },
  { id: "7", stem: "7. ___ wohnt deine Mutter?", options: ["Was", "Wer", "Wie", "Wo"] },
  { id: "8", stem: "8. ___ ist dein Job?", options: ["Was", "Wer", "Wie", "Wo"] },
  { id: "9", stem: "9. ___ heißt deine Mutter?", options: ["Was", "Wer", "Wie", "Wo"] },
];

const answerClues = [
  "Das ist ein Ball.",
  "Martin ist in Ghana.",
  "Der Ball ist klein.",
  "Das ist Martin.",
  "Martin spielt mit dem Ball.",
  "Ich heiße Felix.",
  "Meine Mutter wohnt in Accra.",
  "Ich bin Lehrer.",
  "Sie heißt Anna.",
];

const focusCardStyle = {
  border: "1px solid #bfdbfe",
  background: "#f8fbff",
  borderRadius: 14,
  padding: 14,
  display: "grid",
  gap: 12,
};

const miniGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: 10,
};

const miniCardStyle = {
  border: "1px solid #dbeafe",
  background: "#fff",
  borderRadius: 10,
  padding: 11,
  display: "grid",
  gap: 5,
  lineHeight: 1.55,
};

const replaceText = (element, label, value) => {
  if (!element) return;
  const strong = document.createElement("strong");
  strong.textContent = label;
  element.replaceChildren(strong, document.createTextNode(` ${value}`));
};

const removeSectionByText = (root, selector, text) => {
  const marker = Array.from(root?.querySelectorAll(selector) || []).find(
    (element) => element.textContent?.trim() === text
  );
  const section = marker?.closest("section") || marker?.parentElement;
  if (section) section.remove();
};

const removeExcludedSections = (root) => {
  // These blocks repeat Day 1/Day 2 content and distract from the canonical
  // Day 3 · Kapitel 1.1 focus: personal information, articles, adjectives and W-questions.
  removeSectionByText(root, "h1, h2, h3, h4", "Teil 1 · Reading / Writing");
  removeSectionByText(root, "h1, h2, h3, h4", "Spelling Practice");
  removeSectionByText(root, "h1, h2, h3, h4", "Basic Vocabulary for A1 German Class");
  removeSectionByText(root, "p", "Class activity");
  removeSectionByText(root, "h1, h2, h3, h4, strong", "Save your class contribution");
};

const updateWWordExercise = (root) => {
  const heading = Array.from(root?.querySelectorAll("h1, h2, h3, h4") || []).find(
    (element) => element.textContent?.trim() === "Lückentext mit W-Wörtern"
  );
  const section = heading?.closest("section") || heading?.parentElement;
  if (!section) return;

  const instruction = Array.from(section.querySelectorAll("p")).find((element) =>
    element.textContent?.includes("Below are questions that use the German")
  );
  if (instruction) {
    instruction.textContent =
      "Read the answer first. Then complete the matching question with the correct German W-word (Was, Wer, Wie, Wo). The answer tells you what information the question is asking for.";
  }

  const boxes = Array.from(section.querySelectorAll("div")).filter((element) =>
    element.textContent?.trim().startsWith("Example:")
  );
  boxes.slice(0, answerClues.length).forEach((element, index) =>
    replaceText(element, "Antwort:", answerClues[index])
  );
};

const updateLessonSummary = (root) => {
  const heading = Array.from(root?.querySelectorAll("h1, h2, h3, h4") || []).find(
    (element) => element.textContent?.trim() === "Key Things You Learned Today"
  );
  const section = heading?.closest("section") || heading?.parentElement;
  const summaryBox = section?.querySelector("div");
  if (!summaryBox) return;

  const items = [
    "✔ Asking for personal information with Was, Wer, Wie and Wo",
    "✔ Using der, die and das with common nouns",
    "✔ Describing people and things with simple adjectives",
    "✔ Introducing yourself with name, origin, residence and occupation",
  ];
  summaryBox.replaceChildren(
    ...items.map((text) => {
      const span = document.createElement("span");
      span.textContent = text;
      return span;
    })
  );
};

const ensureBiographyMount = (root) => {
  if (!root) return null;

  const existing = root.querySelector("[data-a1-day3-class-biography]");
  if (existing) return existing;

  const marker = Array.from(root.querySelectorAll("strong")).find(
    (element) => element.textContent?.trim() === "Next step: Save your biography"
  );
  const oldBox = marker?.parentElement;
  const section = marker?.closest("section");
  if (!oldBox || !section) return null;

  const mount = document.createElement("div");
  mount.dataset.a1Day3ClassBiography = "true";
  section.replaceChild(mount, oldBox);
  return mount;
};

const ensureLiveResponseMounts = (root) => {
  const mounts = {};
  if (!root) return mounts;

  liveQuestions.forEach((question) => {
    const stem = Array.from(root.querySelectorAll("strong")).find(
      (element) => element.textContent?.trim() === question.stem
    );
    const questionBox = stem?.parentElement;
    if (!questionBox) return;

    questionBox.dataset.liveClassQuestionId = question.id;
    let mount = questionBox.querySelector(":scope > [data-live-class-response-mount]");
    if (!mount) {
      mount = document.createElement("div");
      mount.dataset.liveClassResponseMount = question.id;
      questionBox.appendChild(mount);
    }
    mounts[question.id] = mount;
  });

  return mounts;
};

const updateWorkbook = (root) => {
  removeExcludedSections(root);
  updateWWordExercise(root);
  updateLessonSummary(root);
  return {
    biographyMount: ensureBiographyMount(root),
    liveResponseMounts: ensureLiveResponseMounts(root),
  };
};

const getClickedQuestionAnswer = (root, target) => {
  const button = target?.closest?.("button");
  if (!button || !root?.contains(button)) return null;

  const questionBox = button.closest("[data-live-class-question-id]");
  const questionId = questionBox?.dataset.liveClassQuestionId;
  const question = liveQuestions.find((item) => item.id === questionId);
  if (!question) return null;

  const buttonText = button.textContent || "";
  const option = question.options.find((item) => buttonText.includes(item));
  if (!option) return null;

  return { questionId, option };
};

export default function A1Day3SchreibenSprechenKapitel11WorkbookPage() {
  const rootRef = useRef(null);
  const [biographyMount, setBiographyMount] = useState(null);
  const [liveResponseMounts, setLiveResponseMounts] = useState({});
  const [classSelections, setClassSelections] = useState({});

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const syncWorkbook = () => {
      const next = updateWorkbook(root);
      if (next.biographyMount) {
        setBiographyMount((current) => (current === next.biographyMount ? current : next.biographyMount));
      }
      setLiveResponseMounts((current) => {
        const ids = Object.keys(next.liveResponseMounts);
        const unchanged =
          ids.length === Object.keys(current).length &&
          ids.every((id) => current[id] === next.liveResponseMounts[id]);
        return unchanged ? current : next.liveResponseMounts;
      });
    };

    const handleClick = (event) => {
      const response = getClickedQuestionAnswer(root, event.target);
      if (!response) return;
      setClassSelections((current) => ({
        ...current,
        [response.questionId]: response.option,
      }));
    };

    syncWorkbook();
    root.addEventListener("click", handleClick);
    const observer = new MutationObserver(syncWorkbook);
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      root.removeEventListener("click", handleClick);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef}>
      <div
        data-a1-workbook-owned-media="true"
        data-radio-first-workbook-gate="true"
        style={{ width: "min(1120px, calc(100% - 24px))", margin: "16px auto 0" }}
      >
        <SelfLearningSupportingMaterials
          teacherVideo={A1_DAY3_KAPITEL_11_TEACHER_VIDEO}
          aiVideo={A1_DAY3_PRACTICE_VIDEOS[0]}
          description="Watch the teacher lecture and AI lesson, then use the Kapitel 1.1 practice book for personal information, articles, adjectives and W-questions."
        />

        <section style={{ ...focusCardStyle, marginTop: 12 }} data-a1-day3-kapitel11-core-notes="true">
          <div>
            <h2 style={{ margin: 0 }}>Kapitel 1.1 core language</h2>
            <p style={{ margin: "6px 0 0", lineHeight: 1.6, color: "#475569" }}>
              Use these patterns before the W-question, speaking and introduction exercises below.
            </p>
          </div>
          <div style={miniGridStyle}>
            <div style={miniCardStyle}>
              <strong>Personal information</strong>
              <span>Wie heißt du? – Ich heiße Ama.</span>
              <span>Woher kommst du? – Ich komme aus Ghana.</span>
              <span>Wo wohnst du? – Ich wohne in Accra.</span>
            </div>

            <div style={{ ...miniCardStyle, gridColumn: "1 / -1", gap: 10 }}>
              <div>
                <strong>Articles: der · die · das</strong>
                <p style={{ margin: "5px 0 0" }}>
                  An article comes before a noun. In German, every noun has a grammatical gender, so learn the noun and its article together.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
                <div style={{ border: "1px solid #dbeafe", borderRadius: 9, padding: 9, background: "#eff6ff" }}>
                  <strong>der · masculine</strong><br />
                  der Mann<br />der Tisch<br />der Stift
                </div>
                <div style={{ border: "1px solid #fbcfe8", borderRadius: 9, padding: 9, background: "#fdf2f8" }}>
                  <strong>die · feminine</strong><br />
                  die Frau<br />die Schule<br />die Tasche
                </div>
                <div style={{ border: "1px solid #ddd6fe", borderRadius: 9, padding: 9, background: "#f5f3ff" }}>
                  <strong>das · neuter</strong><br />
                  das Kind<br />das Buch<br />das Auto
                </div>
                <div style={{ border: "1px solid #bbf7d0", borderRadius: 9, padding: 9, background: "#f0fdf4" }}>
                  <strong>die · plural</strong><br />
                  die Bücher<br />die Autos<br />die Taschen
                </div>
              </div>
              <div style={{ borderLeft: "4px solid #2563eb", paddingLeft: 10 }}>
                <strong>When you mean “a / an”:</strong> <strong>ein</strong> Mann · <strong>eine</strong> Frau · <strong>ein</strong> Kind.
              </div>
              <span><strong>Best habit:</strong> do not learn only “Tisch”. Learn <strong>der Tisch</strong>. Do not learn only “Tasche”. Learn <strong>die Tasche</strong>.</span>
            </div>

            <div style={miniCardStyle}>
              <strong>Simple adjectives</strong>
              <span>Der Ball ist <strong>klein</strong>.</span>
              <span>Die Frau ist <strong>freundlich</strong>.</span>
              <span>Das Haus ist <strong>groß</strong>.</span>
            </div>
            <div style={miniCardStyle}>
              <strong>W-questions</strong>
              <span><strong>Was</strong> = what · <strong>Wer</strong> = who</span>
              <span><strong>Wie</strong> = how / what … called · <strong>Wo</strong> = where</span>
            </div>
          </div>
        </section>
      </div>

      <A1Day3SchreibenSprechenKapitel11WorkbookPageLegacy />

      {liveQuestions.map((question) =>
        liveResponseMounts[question.id]
          ? createPortal(
              <LiveClassResponsePanel
                lessonId={LIVE_CLASS_LESSON_ID}
                questionId={question.id}
                questionLabel={question.stem}
                options={question.options}
                selectedOption={classSelections[question.id] || ""}
              />,
              liveResponseMounts[question.id],
              `live-class-${question.id}`
            )
          : null
      )}

      {biographyMount
        ? createPortal(
            <div
              style={{
                border: "1px solid #bfdbfe",
                borderRadius: 14,
                background: "#eff6ff",
                padding: 14,
                display: "grid",
                gap: 12,
              }}
            >
              <div style={{ display: "grid", gap: 5 }}>
                <strong>Write your introduction</strong>
                <p style={{ margin: 0, lineHeight: 1.7, color: "#475569" }}>
                  Type your German introduction below. Your work saves automatically to the same biography used on the Class Members page, and classmates&apos; introductions appear here too.
                </p>
              </div>
              <PersonalInformationContributionBox
                autoSave
                showReference={false}
                placeholder="Hallo! Ich heiße Ama. Ich komme aus Ghana. Ich bin 25 Jahre alt und ich wohne in Accra."
              />
            </div>,
            biographyMount
          )
        : null}
    </div>
  );
}
