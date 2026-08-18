import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import A1Day3SchreibenSprechenKapitel11WorkbookPageLegacy from "./A1Day3SchreibenSprechenKapitel11WorkbookPageLegacy";
import PersonalInformationContributionBox from "./PersonalInformationContributionBox";
import SelfLearningSupportingMaterials from "./selfLearning/SelfLearningSupportingMaterials";

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
  removeSectionByText(root, "h1, h2, h3, h4", "Teil 1 · Reading / Writing");
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

const updateWorkbook = (root) => {
  removeExcludedSections(root);
  updateWWordExercise(root);
  return ensureBiographyMount(root);
};

export default function A1Day3SchreibenSprechenKapitel11WorkbookPage() {
  const rootRef = useRef(null);
  const [biographyMount, setBiographyMount] = useState(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const syncWorkbook = () => {
      const mount = updateWorkbook(root);
      if (mount) {
        setBiographyMount((current) => (current === mount ? current : mount));
      }
    };

    syncWorkbook();
    const observer = new MutationObserver(syncWorkbook);
    observer.observe(root, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef}>
      <div
        data-a1-workbook-owned-media="true"
        data-radio-first-workbook-gate="true"
        style={{ width: "min(1120px, calc(100% - 24px))", margin: "16px auto 0" }}
      >
        <SelfLearningSupportingMaterials
          aiVideo={A1_DAY3_PRACTICE_VIDEOS[0]}
          description="Watch the AI lesson, then continue with the Kapitel 1.1 self-learning practice book. No teacher lecture is currently configured for this page."
        />
      </div>

      <A1Day3SchreibenSprechenKapitel11WorkbookPageLegacy />

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
