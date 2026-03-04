import React from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles";

const heroSrc =
  "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1400&q=80";

const boxStyle = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 14,
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
      <li key={`${item}-${index}`}>{item}</li>
    ))}
  </ul>
);

const NumberedList = ({ items, marginBottom = 0 }) => (
  <ol style={{ paddingLeft: 20, marginTop: 6, marginBottom }}>
    {items.map((item, index) => (
      <li key={`${item}-${index}`}>{item}</li>
    ))}
  </ol>
);

const HeroImage = ({ src, alt }) => (
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
          height: 220,
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
        Photo from Unsplash
      </div>
    </div>
  </div>
);

const bodyParts = [
  "der Kopf → die Köpfe (head → heads)",
  "die Hand → die Hände (hand → hands)",
  "das Bein → die Beine (leg → legs)",
  "der Arm → die Arme (arm → arms)",
  "der Bauch → die Bäuche (stomach/belly → stomachs/bellies)",
  "der Rücken → die Rücken (back → backs)",
  "der Hals → die Hälse (throat/neck → throats/necks)",
];

const schmerzenExamples = [
  "Ich habe Kopfschmerzen.",
  "Ich habe Bauchschmerzen.",
  "Ich habe Rückenschmerzen.",
  "Ich habe Halsschmerzen.",
];

const wehExamplesSingular = [
  "Mein Kopf tut mir weh.",
  "Mein Rücken tut mir weh.",
  "Mein Bauch tut mir weh.",
  "Mein Hals tut mir weh.",
];

const wehExamplesPlural = [
  "Meine Hände tun mir weh.",
  "Meine Beine tun mir weh.",
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

const nominativeArticles = [
  "Masculine: der / ein → der Hund, ein Hund",
  "Feminine: die / eine → die Blume, eine Blume",
  "Neuter: das / ein → das Auto, ein Auto",
  "Plural: die / keine → die Bücher, keine Bücher",
];

const accusativeArticles = [
  "Masculine: den / einen → den Hund, einen Hund",
  "Feminine: die / eine → die Blume, eine Blume",
  "Neuter: das / ein → das Auto, ein Auto",
  "Plural: die / keine → die Bücher, keine Bücher",
];

const endingRules = [
  "der → -er",
  "die → -e",
  "das → -es",
  "den → -en",
  "plural (die / keine) → -en",
];

const nominativeExamples = [
  "Masculine: ein + -er → ein großer Mann",
  "Feminine: eine + -e → eine schöne Frau",
  "Neuter: ein + -es → ein kleines Auto",
  "Plural: keine + -en → keine kleinen Kinder",
];

const accusativeExamples = [
  "Masculine: einen + -en → einen kleinen Hund",
  "Feminine: eine + -e → eine rote Blume",
  "Neuter: ein + -es → ein grünes Auto",
  "Plural: keine + -en → keine alten Bücher",
];

const correctedNominativeSentences = [
  "Er ist ein großer Mann.",
  "Sie ist eine schöne Frau.",
  "Das ist ein neues Auto.",
  "Das sind keine kleinen Kinder.",
];

const correctedAccusativeSentences = [
  "Ich habe einen kleinen Hund.",
  "Er sieht eine schöne Blume.",
  "Wir kaufen ein gelbes Buch.",
  "Du liest keine langen Texte.",
];

const adjectiveTest = [
  "Ich habe einen ___ Hund. (klein)",
  "Das ist ein ___ Auto. (neu)",
  "Sie ist eine ___ Frau. (schön)",
  "Ich sehe eine ___ Blume. (rot)",
  "Er ist ein ___ Mann. (groß)",
];

const adjectiveAnswers = [
  "einen kleinen Hund",
  "ein neues Auto",
  "eine schöne Frau",
  "eine rote Blume",
  "ein großer Mann",
];

const summaryPoints = [
  "Ich habe Kopfschmerzen. = I have a headache.",
  "Mein Kopf tut mir weh. = My head hurts.",
  "Wie geht es dir? = How are you?",
  "Ich möchte den Termin absagen. = I would like to cancel the appointment.",
];

const HealthBodyPartsPage = () => {
  return (
    <main style={{ ...styles.container, display: "grid", gap: 18 }}>
      <header style={{ ...styles.card, display: "grid", gap: 12 }}>
        <Link
          to="/campus/course"
          style={{
            ...styles.secondaryButton,
            width: "fit-content",
            display: "inline-block",
            textDecoration: "none",
          }}
        >
          Back to Course
        </Link>

        <div style={{ display: "grid", gap: 8 }}>
          <h1 style={{ ...styles.title, marginBottom: 0 }}>
            Day 22: Health and Body Parts
          </h1>

          <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 14.1</p>

          <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>
            Today you will learn how to talk about health problems, ask about
            someone’s health, and write a formal cancellation message. You will
            also learn a simple A1 trick for adjective endings with indefinite
            articles (ein / eine / einen / kein / keine).
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
          <BulletList items={wehExamplesSingular} marginBottom={10} />

          <p style={{ margin: "0 0 8px" }}>
            For more than one body part, use <strong>tun mir weh</strong>:
          </p>
          <BulletList items={wehExamplesPlural} />
          <p style={{ marginTop: 8, marginBottom: 0 }}>
            <strong>Question:</strong> Was tut dir weh?
          </p>
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
      </Section>

      <Section title="Part 4: Adjective Endings with ein, eine, einen, kein / keine">
        <InfoBox title="How to Describe People and Things">
          <p style={{ marginTop: 0, marginBottom: 0, lineHeight: 1.7 }}>
            Learn a simple way to choose adjective endings in nominative and
            accusative with <strong>ein / eine / einen</strong> and{" "}
            <strong>kein / keine</strong>.
          </p>
        </InfoBox>

        <InfoBox title="Step 1: Review the Articles">
          <p style={{ marginTop: 0, marginBottom: 8 }}>
            Nouns in German have gender and use different articles.
          </p>

          <p style={{ margin: "8px 0 4px" }}>
            <strong>Nominative Case</strong> (subject = who / what does
            something)
          </p>
          <BulletList items={nominativeArticles} marginBottom={12} />

          <p style={{ margin: "0 0 4px" }}>
            <strong>Accusative Case</strong> (object = who / what receives the
            action)
          </p>
          <BulletList items={accusativeArticles} />
        </InfoBox>

        <InfoBox title="Step 2: How to Get the Adjective Ending">
          <p style={{ marginTop: 0, marginBottom: 8 }}>
            Simple trick: look at the article meaning behind the form and use
            the matching ending.
          </p>
          <BulletList items={endingRules} />
        </InfoBox>

        <InfoBox title="Step 3: Combine Article + Adjective + Noun">
          <p style={{ marginTop: 0, marginBottom: 8 }}>
            Common adjectives: groß, klein, rot, blau, grün, schön, neu, alt.
          </p>

          <p style={{ margin: "10px 0 4px" }}>
            <strong>Nominative Case</strong>
          </p>
          <BulletList items={nominativeExamples} marginBottom={12} />

          <p style={{ margin: "0 0 4px" }}>
            <strong>Accusative Case</strong>
          </p>
          <BulletList items={accusativeExamples} />
        </InfoBox>

        <InfoBox title="Example Sentences">
          <p style={{ margin: "0 0 4px" }}>
            <strong>Nominative:</strong>
          </p>
          <BulletList items={correctedNominativeSentences} marginBottom={12} />

          <p style={{ margin: "0 0 4px" }}>
            <strong>Accusative:</strong>
          </p>
          <BulletList items={correctedAccusativeSentences} />
        </InfoBox>

        <InfoBox title="Mini Adjective Ending Test (A1)">
          <p style={{ marginTop: 0, marginBottom: 8 }}>
            Complete with the correct adjective endings (groß, klein, rot,
            schön, neu):
          </p>
          <NumberedList items={adjectiveTest} marginBottom={10} />

          <p style={{ margin: "0 0 4px" }}>
            <strong>Answers</strong>
          </p>
          <NumberedList items={adjectiveAnswers} />
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
