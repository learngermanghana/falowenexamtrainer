import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";

const heroSrc =
  "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1400&q=80";

const boxStyle = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 14,
};

const tagStyle = {
  display: "inline-block",
  width: "fit-content",
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.2,
  background: "#eef2ff",
  color: "#3730a3",
  border: "1px solid #c7d2fe",
};

const mutedText = {
  margin: 0,
  color: "#4b5563",
  lineHeight: 1.6,
};

const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 12 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const InfoBox = ({ title, children }) => (
  <div style={boxStyle}>
    <strong>{title}</strong>
    <div style={{ marginTop: 8 }}>{children}</div>
  </div>
);

const BulletList = ({ items, marginBottom = 0 }) => (
  <ul style={{ paddingLeft: 20, marginTop: 6, marginBottom }}>
    {items.map((item, index) => (
      <li key={`${item}-${index}`} style={{ marginBottom: 4 }}>
        {item}
      </li>
    ))}
  </ul>
);

const NumberedList = ({ items, marginBottom = 0 }) => (
  <ol style={{ paddingLeft: 20, marginTop: 6, marginBottom }}>
    {items.map((item, index) => (
      <li key={`${item}-${index}`} style={{ marginBottom: 4 }}>
        {item}
      </li>
    ))}
  </ol>
);

const HeroImage = ({ src, alt, label = "Photo from Unsplash", height = 220 }) => (
  <div
    style={{
      borderRadius: 16,
      overflow: "hidden",
      border: "1px solid #e5e7eb",
      background: "#fff",
    }}
  >
    <div style={{ position: "relative" }}>
      <img
        src={src}
        alt={alt}
        loading="eager"
        fetchPriority="high"
        style={{
          width: "100%",
          height,
          objectFit: "cover",
          display: "block",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 10,
          bottom: 10,
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(229,231,235,0.9)",
          borderRadius: 999,
          padding: "6px 10px",
          fontSize: 12,
          color: "#374151",
        }}
      >
        {label}
      </div>
    </div>
  </div>
);

const TopicLabel = ({ children }) => <div style={tagStyle}>{children}</div>;

const bodyParts = [
  "der Kopf → die Köpfe (head → heads)",
  "das Gesicht → die Gesichter (face → faces)",
  "das Auge → die Augen (eye → eyes)",
  "das Ohr → die Ohren (ear → ears)",
  "die Nase → die Nasen (nose → noses)",
  "der Mund → die Münder (mouth → mouths)",
  "der Zahn → die Zähne (tooth → teeth)",
  "der Hals → die Hälse (neck/throat → necks/throats)",
  "der Arm → die Arme (arm → arms)",
  "die Hand → die Hände (hand → hands)",
  "der Finger → die Finger (finger → fingers)",
  "der Bauch → die Bäuche (stomach/belly → stomachs/bellies)",
  "der Rücken → die Rücken (back → backs)",
  "das Bein → die Beine (leg → legs)",
  "der Fuß → die Füße (foot → feet)",
];

const schmerzenExamples = [
  "Ich habe Kopfschmerzen. (I have a headache.)",
  "Ich habe Bauchschmerzen. (I have a stomachache.)",
  "Ich habe Rückenschmerzen. (I have back pain.)",
  "Ich habe Halsschmerzen. (I have a sore throat.)",
];

const wehExamplesSingular = [
  "Mein Kopf tut mir weh. (My head hurts / My head hurts me.)",
  "Mein Rücken tut mir weh. (My back hurts / My back hurts me.)",
  "Mein Bauch tut mir weh. (My stomach hurts / My stomach hurts me.)",
  "Mein Hals tut mir weh. (My throat hurts / My throat hurts me.)",
];

const wehExamplesPlural = [
  "Meine Hände tun mir weh. (My hands hurt me.)",
  "Meine Beine tun mir weh. (My legs hurt me.)",
];

const healthQuestions = [
  "Wie geht es dir? (How are you?)",
  "Wie geht es Ihnen? (How are you? - formal)",
  "Geht es dir gut? (Are you okay?)",
  "Geht es Ihnen gut? (Are you okay? - formal)",
  "Was ist los? (What’s wrong?)",
  "Was tut dir weh? (What hurts?)",
  "Fehlt dir etwas? (Is something wrong?)",
];

const healthAnswers = [
  "Mir geht es nicht gut. (I am not feeling well.)",
  "Ich bin krank. (I am sick.)",
  "Ich habe Kopfschmerzen. (I have a headache.)",
  "Mein Kopf tut mir weh. (My head hurts.)",
];

const cancellationLines = [
  "Ich schreibe Ihnen, weil ich den Termin absagen möchte.",
  "Ich bin krank.",
  "Ich habe Kopfschmerzen.",
  "Können wir einen anderen Termin vereinbaren?",
];

const bodyPartsQuiz = [
  {
    prompt: "I have a stomachache.",
    options: ["Ich habe Bauchschmerzen.", "Mein Bauch tun mir weh.", "Ich bin Bauchschmerz."],
    answer: "Ich habe Bauchschmerzen.",
  },
  {
    prompt: "My head hurts.",
    options: ["Mein Kopf tut mir weh.", "Ich habe Kopf.", "Meine Kopf tut weh."],
    answer: "Mein Kopf tut mir weh.",
  },
  {
    prompt: "ear",
    options: ["die Ohr", "das Ohr", "der Ohr"],
    answer: "das Ohr",
  },
  {
    prompt: "nose",
    options: ["die Nase", "der Nase", "das Nase"],
    answer: "die Nase",
  },
  {
    prompt: "hand",
    options: ["das Hand", "die Hand", "der Hand"],
    answer: "die Hand",
  },
];

const doctorConsultationQuiz = [
  {
    prompt: 'Complete: "Was tut dir weh?" means...',
    options: ["Where are you?", "What hurts?", "Who is sick?"],
    answer: "What hurts?",
  },
  {
    prompt: 'Choose the correct formal question: "Are you okay?"',
    options: ["Geht es Ihnen gut?", "Geht es dir gut?", "Bist du krank?"],
    answer: "Geht es Ihnen gut?",
  },
  {
    prompt: 'Choose the best sentence for "My legs hurt."',
    options: ["Mein Beine tut mir weh.", "Meine Beine tun mir weh.", "Meine Beine tut weh."],
    answer: "Meine Beine tun mir weh.",
  },
];

const letterTopics = [
  "Invite a friend to your birthday.",
  "Cancel an appointment with a teacher or doctor.",
  "Write about your daily routine.",
  "Plan a weekend with a classmate.",
  "Thank someone for help.",
  "Ask for information about a course.",
];

const shortSentencePatterns = [
  "Ich habe Zeit heute.",
  "Ich kaufe Brot morgen.",
  "Ich esse gern Pizza.",
  "Ich trinke viel Wasser.",
  "Meine Hobbys sind Lesen.",
  "Ich habe zwei Brüder.",
];

const wQuestionPatterns = [
  "Wie heißt du?",
  "Was kaufst du heute?",
  "Wo wohnst du jetzt?",
  "Wann kommst du nach Hause?",
];

const modalVerbExamples = [
  "Ich kann heute kommen.",
  "Wir müssen Deutsch lernen.",
  "Darf ich später anrufen?",
  "Kannst du mir helfen?",
];

const weilExamples = [
  "Ich bleibe zu Hause, weil ich krank bin.",
  "Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.",
  "Ich komme später, weil der Bus zu spät ist.",
];

const letterWritingQuiz = [
  {
    prompt: 'Choose the best introduction for a formal letter.',
    options: ["Hallo Anna!", "Sehr geehrte Frau Keller,", "Hey du,"],
    answer: "Sehr geehrte Frau Keller,",
  },
  {
    prompt: 'Choose the correct weil sentence.',
    options: [
      "Ich lerne, weil ich habe eine Prüfung.",
      "Ich lerne, weil ich eine Prüfung habe.",
      "Ich lerne weil habe ich eine Prüfung.",
    ],
    answer: "Ich lerne, weil ich eine Prüfung habe.",
  },
  {
    prompt: 'Choose the correct modal verb question.',
    options: ["Kannst du morgen kommen?", "Du kannst morgen kommen?", "Kommen kannst du morgen?"],
    answer: "Kannst du morgen kommen?",
  },
  {
    prompt: "Which sentence is short and clear (good for A1 writing)?",
    options: ["Ich gehe jetzt nach Hause.", "Ich gehe jetzt nach Hause und danach werde ich vielleicht noch einkaufen gehen."],
    answer: "Ich gehe jetzt nach Hause.",
  },
];

const summaryPoints = [
  "Ich habe Kopfschmerzen. = I have a headache.",
  "Mein Kopf tut mir weh. = My head hurts.",
  "Wie geht es dir? = How are you?",
  "Ich möchte den Termin absagen. = I would like to cancel the appointment.",
  "Short A1 writing is better than long unclear sentences.",
  "Use weil, modal verbs, and W-questions to improve letters.",
];

const answerButtonStyle = (selected, correct) => ({
  textAlign: "left",
  borderRadius: 8,
  border: `1px solid ${
    selected ? (correct ? "#16a34a" : "#dc2626") : "#d1d5db"
  }`,
  background: selected ? (correct ? "#f0fdf4" : "#fef2f2") : "#fff",
  padding: "8px 10px",
  cursor: "pointer",
});

const MultipleChoiceQuestion = ({ item, index, answerMap, setAnswerMap }) => {
  const selected = answerMap[index];

  return (
    <div style={{ ...boxStyle, background: "#fff" }}>
      <p style={{ marginTop: 0, marginBottom: 8 }}>
        <strong>{index + 1}.</strong> {item.prompt}
      </p>
      <div style={{ display: "grid", gap: 8 }}>
        {item.options.map((option) => (
          <button
            key={option}
            type="button"
            style={answerButtonStyle(selected === option, option === item.answer)}
            onClick={() => setAnswerMap((prev) => ({ ...prev, [index]: option }))}
          >
            {option}
          </button>
        ))}
      </div>
      {selected && (
        <p style={{ margin: "10px 0 0", color: selected === item.answer ? "#166534" : "#991b1b" }}>
          {selected === item.answer ? "✅ Correct" : `❌ Correct answer: ${item.answer}`}
        </p>
      )}
    </div>
  );
};

const HealthBodyPartsPage = () => {
  const [bodyPartAnswers, setBodyPartAnswers] = useState({});
  const [doctorQuizAnswers, setDoctorQuizAnswers] = useState({});
  const [letterQuizAnswers, setLetterQuizAnswers] = useState({});

  return (
    <main style={{ ...styles.container, display: "grid", gap: 18 }}>
      <header style={{ ...styles.card, display: "grid", gap: 12 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <div style={{ display: "grid", gap: 8 }}>
          <TopicLabel>Health Vocabulary</TopicLabel>

          <h1 style={{ ...styles.title, marginBottom: 0 }}>
            Day 22: Health and Body Parts
          </h1>

          <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 14.1</p>

          <p style={mutedText}>
            Today you will learn how to talk about health problems, ask about
            someone’s health, and write a formal cancellation message. You will
            then build confidence for A1 letter writing with short structures,
            weil, modal verbs, and W-questions.
          </p>
        </div>

        <HeroImage src={heroSrc} alt="Doctor consultation in clinic" />
      </header>

      <Section title="Part 1: Two Ways to Say You Are Not Feeling Well">
        <InfoBox title="Body Parts Vocabulary (Singular + Plural)">
          <BulletList items={bodyParts} />
        </InfoBox>

        <InfoBox title='1) Using "Ich habe ... Schmerzen"'>
          <p style={{ marginTop: 0 }}>
            Use: <strong>Ich habe + body part + Schmerzen.</strong>
          </p>
          <p style={{ marginTop: 0 }}>
            <strong>Schmerzen</strong> means <strong>"pain"</strong>.
          </p>
          <BulletList items={schmerzenExamples} />
          <p style={{ marginBottom: 0 }}>
            Note: <strong>Schmerzen</strong> is plural.
          </p>
        </InfoBox>

        <InfoBox title='2) Using "... tut mir weh"'>
          <p style={{ marginTop: 0, marginBottom: 8 }}>
            Use this pattern when one body part hurts:
          </p>
          <p style={{ margin: "0 0 8px" }}>
            <strong>Singular:</strong> Mein / Meine + body part +{" "}
            <strong>tut mir weh</strong>
          </p>
          <p style={{ margin: "0 0 8px" }}>
            <strong>tut weh</strong> = <strong>"it hurts"</strong>, and{" "}
            <strong>tut mir weh</strong> = <strong>"it hurts me"</strong>.
          </p>
          <BulletList items={wehExamplesSingular} marginBottom={10} />

          <p style={{ margin: "0 0 8px" }}>
            For more than one body part, use <strong>tun mir weh</strong>:
          </p>
          <BulletList items={wehExamplesPlural} />
          <p style={{ marginTop: 8, marginBottom: 0 }}>
            <strong>Question:</strong> Was tut dir weh?
          </p>
        </InfoBox>

        <InfoBox title="Mini Practice: Body Parts">
          <p style={{ marginTop: 0, marginBottom: 8 }}>
            Select the best answer:
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {bodyPartsQuiz.map((item, index) => (
              <MultipleChoiceQuestion
                key={`${item.prompt}-${index}`}
                item={item}
                index={index}
                answerMap={bodyPartAnswers}
                setAnswerMap={setBodyPartAnswers}
              />
            ))}
          </div>
        </InfoBox>
      </Section>

      <Section title="Part 2: How to Ask About Someone’s Health">
        <InfoBox title="Questions">
          <BulletList items={healthQuestions} />
        </InfoBox>

        <InfoBox title="Possible Answers">
          <BulletList items={healthAnswers} />
        </InfoBox>
      </Section>

      <Section title="Part 3: Writing – Cancel an Appointment">
        <InfoBox title="Model Sentences">
          <div style={{ lineHeight: 1.8 }}>
            {cancellationLines.map((line, index) => (
              <div key={`${line}-${index}`}>{line}</div>
            ))}
          </div>
        </InfoBox>

        <InfoBox title="Knowledge Test: Doctor Consultation in Clinic">
          <p style={{ marginTop: 0, marginBottom: 8 }}>
            Test your understanding by selecting the correct option:
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {doctorConsultationQuiz.map((item, index) => (
              <MultipleChoiceQuestion
                key={`${item.prompt}-${index}`}
                item={item}
                index={index}
                answerMap={doctorQuizAnswers}
                setAnswerMap={setDoctorQuizAnswers}
              />
            ))}
          </div>
        </InfoBox>
      </Section>

      <Section title="Part 4: Notes for Student Confidence in Letter Writing">
        <InfoBox title="A1 Letter Topics You Can Get in Exams">
          <BulletList items={letterTopics} />
        </InfoBox>

        <InfoBox title="Simple Structure to Pass: Introduction + Body + Conclusion">
          <p style={{ marginTop: 0, marginBottom: 6 }}>
            <strong>Introduction:</strong> greet and state your reason in one short sentence.
          </p>
          <p style={{ margin: "0 0 6px" }}>
            Example: <strong>Sehr geehrte Frau Keller, ich schreibe Ihnen, weil ich den Termin absagen möchte.</strong>
          </p>
          <p style={{ margin: "0 0 6px" }}>
            <strong>Body:</strong> write 2–3 short points (5–6 words each if possible).
          </p>
          <p style={{ margin: "0 0 6px" }}>
            Example: <strong>Ich bin krank. Ich kann nicht kommen.</strong>
          </p>
          <p style={{ margin: 0 }}>
            <strong>Conclusion:</strong> polite closing + name. Example:{" "}
            <strong>Mit freundlichen Grüßen, Ali.</strong>
          </p>
        </InfoBox>

        <InfoBox title="How to Build Confidence (and avoid translator mistakes)">
          <BulletList
            items={[
              "Use words you understand, not long translated sentences.",
              "Keep each sentence short and clear.",
              "Use one idea per sentence.",
              "Memorize 10 useful sentence patterns and reuse them.",
              "Check verb position before submitting.",
            ]}
          />
        </InfoBox>

        <InfoBox title="Useful Short Statements (A1)">
          <BulletList items={shortSentencePatterns} />
        </InfoBox>

        <InfoBox title="W-Questions: wie, was, wo, wann">
          <BulletList items={wQuestionPatterns} />
        </InfoBox>

        <InfoBox title="Modal Verbs (Statements + Questions)">
          <BulletList items={modalVerbExamples} />
        </InfoBox>

        <InfoBox title="Using weil (because)">
          <BulletList items={weilExamples} />
        </InfoBox>

        <InfoBox title="Knowledge Test: Improve Your Writing">
          <p style={{ marginTop: 0, marginBottom: 8 }}>
            Select the correct answer to check your writing skills:
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {letterWritingQuiz.map((item, index) => (
              <MultipleChoiceQuestion
                key={`${item.prompt}-${index}`}
                item={item}
                index={index}
                answerMap={letterQuizAnswers}
                setAnswerMap={setLetterQuizAnswers}
              />
            ))}
          </div>
        </InfoBox>
      </Section>

      <Section title="Part 5: Pass Strategy for Students">
        <InfoBox title="Checklist Before You Submit Your Letter">
          <NumberedList
            items={[
              "Did I write an introduction?",
              "Did I answer all task points?",
              "Did I use short clear sentences?",
              "Did I use one weil sentence correctly?",
              "Did I include one modal verb sentence or question?",
              "Did I write a conclusion and my name?",
            ]}
          />
        </InfoBox>

        <InfoBox title="One Safe Exam Formula">
          <p style={{ marginTop: 0, marginBottom: 0, lineHeight: 1.7 }}>
            Greeting + reason + 2 short details + one <strong>weil</strong>{" "}
            sentence + polite closing. If you keep this structure, you can pass
            with clear writing even at basic level.
          </p>
        </InfoBox>
      </Section>

      <Section title="Quick Summary">
        <InfoBox title="Remember">
          <BulletList items={summaryPoints} />
        </InfoBox>
      </Section>
    </main>
  );
};

export default HealthBodyPartsPage;
