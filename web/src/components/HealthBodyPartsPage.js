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
  "Register for a German course.",
  "Plan a weekend with a classmate.",
  "Thank someone for help.",
  "Ask for information about a course.",
];

const shortSentencePatterns = [
  "Course registration: Ich möchte mich für einen Deutschkurs anmelden. (I would like to register for a German course.)",
  "Course interest: Ich interessiere mich für Ihren Deutschkurs. (I am interested in your German course.)",
  "Birthday wishes: Herzlichen Glückwunsch zum Geburtstag! (Happy birthday!)",
  "Invitation: Ich lade dich zu meiner Geburtstagsfeier ein. (I invite you to my birthday party.)",
  "Thanks: Danke für deine Einladung. (Thank you for your invitation.)",
  "Availability: Ich habe am Montag um 16 Uhr Zeit. (I am free on Monday at 4 p.m.)",
  "Cancellation: Leider kann ich nicht kommen. (Unfortunately, I cannot come.)",
  "Health reason: Ich bin krank. Ich habe Fieber. (I am sick. I have a fever.)",
  "Weather reason: Es regnet sehr stark. (It is raining very heavily.)",
  "Another meeting: Können wir uns nächste Woche treffen? (Can we meet next week?)",
];

const wQuestionPatterns = [
  "Wann hast du Zeit? / Wann haben Sie Zeit? (When are you free? Informal / formal.)",
  "Wann beginnt der Deutschkurs? (When does the German course start?)",
  "Wie viel kostet der Kurs? (How much does the course cost?)",
  "Wo findet der Kurs statt? (Where does the course take place?)",
  "Wo kann ich mich anmelden? (Where can I register?)",
  "Was muss ich mitbringen? (What do I need to bring?)",
  "Wann ist deine Geburtstagsfeier? (When is your birthday party?)",
  "Wo treffen wir uns? (Where are we meeting?)",
];

const modalVerbExamples = [
  "Leider kann ich heute nicht kommen. (Unfortunately, I cannot come today.)",
  "Ich möchte mich für den Kurs anmelden. (I would like to register for the course.)",
  "Können wir uns am Samstag um 15 Uhr treffen? (Can we meet on Saturday at 3 p.m.?)",
  "Kann ich meine Familie mitbringen? (Can I bring my family?)",
];

const weilExamples = [
  "Leider kann ich nicht kommen, weil ich krank bin.",
  "Ich kann nicht zur Feier kommen, weil es stark regnet.",
  "Ich schreibe Ihnen, weil ich mich für den Deutschkurs anmelden möchte.",
];

const letterWritingQuiz = [
  {
    prompt: "How do you register for a German course?",
    options: ["Ich möchte mich für einen Deutschkurs anmelden.", "Ich möchte mich für einen Deutschkurs angemeldet.", "Ich anmelden einen Deutschkurs."],
    answer: "Ich möchte mich für einen Deutschkurs anmelden.",
  },
  {
    prompt: "Choose the correct health reason with weil.",
    options: ["Ich kann nicht kommen, weil ich bin krank.", "Ich kann nicht kommen, weil ich krank bin.", "Ich kann nicht kommen, weil bin ich krank."],
    answer: "Ich kann nicht kommen, weil ich krank bin.",
  },
  {
    prompt: "Choose the correct question to suggest another meeting.",
    options: ["Können wir uns am Samstag treffen?", "Wir können uns am Samstag treffen?", "Treffen können wir uns am Samstag?"],
    answer: "Können wir uns am Samstag treffen?",
  },
  {
    prompt: "Ask a course teacher formally when they are free.",
    options: ["Wann Sie haben Zeit?", "Wann hast du Zeit?", "Wann haben Sie Zeit?"],
    answer: "Wann haben Sie Zeit?",
  },
];

const summaryPoints = [
  "Ich habe Kopfschmerzen. = I have a headache.",
  "Mein Kopf tut mir weh. = My head hurts.",
  "Wie geht es dir? = How are you?",
  "Ich möchte den Termin absagen. = I would like to cancel the appointment.",
  "Short A1 writing is better than long unclear sentences.",
  "Ask about a course, an invitation or a new meeting with a clear W-question.",
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
            someone’s health, and use a health problem as a reason for cancelling.
            Build on chapters 12.3 and 13: write a short message, answer the task
            points, and suggest another meeting. Reuse the phrases below for
            birthdays, course enquiries, and appointments.
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
          <p style={{ marginTop: 0 }}>Use these formal phrases with a doctor or
            course office. For the message to Felix, use the informal model in Part 4.</p>
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
            Example for this chapter: <strong>Lieber Felix, danke für deine Einladung.</strong>
          </p>
          <p style={{ margin: "0 0 6px" }}>
            <strong>Body:</strong> answer exactly the three task points: you cannot
            come, give a health reason, and suggest another meeting.
          </p>
          <p style={{ margin: "0 0 6px" }}>
            Example: <strong>Leider kann ich nicht kommen. Ich habe Fieber.
              Können wir uns am Montag um 16 Uhr treffen?</strong>
          </p>
          <p style={{ margin: 0 }}>
            <strong>Conclusion:</strong> polite closing + name. Example:{" "}
            <strong>Liebe Grüße, Ali.</strong>
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

        <InfoBox title="Useful Short Statements for A1 Letters (12.3–14.1)">
          <p style={{ marginTop: 0 }}>Choose phrases that answer your task. Use
            <strong> du / deine</strong> with a friend and <strong>Sie / Ihren</strong> with a course office.</p>
          <BulletList items={shortSentencePatterns} />
        </InfoBox>

        <InfoBox title="W-Questions for Courses, Invitations and Meetings">
          <p style={{ marginTop: 0 }}>Use <strong>W-word + conjugated verb + subject</strong>:
            Wann <strong>hast du</strong> Zeit? Reply with <strong>am</strong> + day
            and <strong>um</strong> + time: Ich habe am Montag um 16 Uhr Zeit.</p>
          <BulletList items={wQuestionPatterns} />
        </InfoBox>

        <InfoBox title="Modal Verbs (Statements + Questions)">
          <BulletList items={modalVerbExamples} />
        </InfoBox>

        <InfoBox title="Using weil (because)">
          <p style={{ marginTop: 0 }}>Put the conjugated verb at the end after
            <strong> weil</strong>. Two short sentences are also enough:
            Leider kann ich nicht kommen. Ich bin krank.</p>
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
              "Is my reason clear? If I used weil, is the verb at the end?",
              "Is my new meeting suggestion clear, with the correct day and time?",
              "Did I write a conclusion and my name?",
            ]}
          />
        </InfoBox>

        <InfoBox title="One Safe Exam Formula">
          <p style={{ marginTop: 0, marginBottom: 0, lineHeight: 1.7 }}>
            Greeting → cannot come → health reason → another meeting → closing
            and name. For chapter 14.1, these are three content points; the
            greeting, closing and name are letter form. A correct weil sentence
            is optional.
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

