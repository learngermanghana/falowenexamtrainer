import React from "react";

// Learner notes follow the approved A1 Day 22 classroom stages. These are
// explanatory study notes, not an additional graded writing assignment.
const sections = [
  {
    title: "1. Gesundheit · Talking about health",
    lines: [
      ["Ich bin krank.", "I am sick."],
      ["Ich habe Fieber.", "I have a fever."],
      ["Ich habe Kopfschmerzen.", "I have a headache."],
      ["Mein Bauch tut weh.", "My stomach hurts."],
    ],
    tip: "Use sein + adjective (ich bin krank), but haben + symptom noun (ich habe Fieber).",
  },
  {
    title: "2. Körperteile · Body parts",
    lines: [
      ["der Kopf", "head"], ["der Hals", "neck / throat"],
      ["der Bauch", "stomach"], ["der Rücken", "back"],
      ["der Arm", "arm"], ["die Hand", "hand"],
      ["das Bein", "leg"], ["der Fuß", "foot"],
    ],
    tip: "Learn each noun together with its article: der, die or das.",
  },
  {
    title: "3. tut weh / tun weh · Describing pain",
    lines: [
      ["Mein Kopf tut weh.", "My head hurts."],
      ["Mein Arm tut weh.", "My arm hurts."],
      ["Meine Beine tun weh.", "My legs hurt."],
      ["Meine Hände tun weh.", "My hands hurt."],
      ["Was tut dir weh?", "What hurts?"],
    ],
    tip: "One body part: tut weh. Several body parts: tun weh.",
  },
  {
    title: "4. Einen Termin absagen und verschieben",
    lines: [
      ["Ich muss meinen Termin absagen.", "I have to cancel my appointment."],
      ["Ich kann heute nicht kommen.", "I cannot come today."],
      ["Hast du am Montag Zeit?", "Are you free on Monday?"],
      ["Passt es dir um 15 Uhr?", "Does 3 p.m. work for you?"],
      ["Könnten wir einen anderen Termin vereinbaren?", "Could we arrange another appointment?"],
    ],
    tip: "Könnten sounds more polite than können. In questions: Könnten + subject + ... + infinitive?",
  },
  {
    title: "5. Höfliche Fragen mit könnten",
    lines: [
      ["Könnten Sie mir bitte helfen?", "Could you please help me? (formal)"],
      ["Könntest du mir bitte helfen?", "Could you please help me? (informal)"],
      ["Könnten Sie mir die Uhrzeit sagen?", "Could you tell me the time?"],
    ],
    tip: "The second verb stays at the end in its infinitive form: helfen, sagen, vereinbaren.",
  },
  {
    title: "6. Gründe erklären mit weil",
    lines: [
      ["Ich kann nicht kommen, weil ich krank bin.", "I cannot come because I am sick."],
      ["Ich muss absagen, weil ich Fieber habe.", "I must cancel because I have a fever."],
      ["Ich kann nicht kommen, weil es stark regnet.", "I cannot come because it is raining heavily."],
      ["Ich muss absagen, weil meine Beine wehtun.", "I must cancel because my legs hurt."],
    ],
    tip: "Use a comma before weil. The conjugated verb goes to the end of the weil-clause.",
  },
];

export default function A1Day22HealthLessonNotes() {
  return (
    <section aria-label="A1 Kapitel 14.1 lesson notes" data-a1-day22-slide-aligned-notes="true"
      style={{ background: "#fffaf3", border: "1px solid #eadfd0", borderRadius: 16, padding: 16, display: "grid", gap: 14 }}>
      <header>
        <h2 style={{ margin: "0 0 6px" }}>Kapitel 14.1 · Gesundheit und Körperteile</h2>
        <p style={{ margin: 0 }}>Learn to describe symptoms, name body parts, cancel an appointment and politely request a new time.</p>
      </header>
      {sections.map(({ title, lines, tip }) => (
        <section key={title} style={{ borderTop: "1px solid #eadfd0", paddingTop: 12 }}>
          <h3 style={{ margin: "0 0 8px" }}>{title}</h3>
          <div style={{ display: "grid", gap: 6 }}>
            {lines.map(([de, en]) => (
              <p key={de} style={{ margin: 0, lineHeight: 1.6 }}><strong lang="de">{de}</strong> <span>— {en}</span></p>
            ))}
          </div>
          <p style={{ margin: "8px 0 0", background: "#fff7ed", borderRadius: 8, padding: 9 }}><strong>Merke:</strong> {tip}</p>
        </section>
      ))}
      <section style={{ borderTop: "1px solid #eadfd0", paddingTop: 12 }}>
        <h3 style={{ margin: "0 0 8px" }}>7. Schreiben · Eine kurze Absage</h3>
        <p>Include three points: cancel the appointment, explain why and suggest another time.</p>
        <blockquote style={{ margin: 0, padding: 12, borderLeft: "3px solid #d97706", background: "#fff" }}>
          Liebe Anna,<br />
          ich muss unseren Termin am Samstag leider absagen, weil ich krank bin.<br />
          Könnten wir einen anderen Termin vereinbaren? Hast du am Montag Zeit?<br />
          Viele Grüße<br />
          Bina
        </blockquote>
        <p>This is a classroom writing example, not a new graded Course Book task.</p>
      </section>
      <section style={{ borderTop: "1px solid #eadfd0", paddingTop: 12 }}>
        <h3 style={{ margin: "0 0 8px" }}>8. Falowen Music · Arzttermin</h3>
        <p>Listen to the song in the existing music section. Which body parts and symptoms can you hear?</p>
        <h3>9. Jetzt bist du dran!</h3>
        <p>You have an appointment on Saturday at 15:00, but you are sick. Write a short cancellation using <strong>weil</strong> and politely ask for another appointment using <strong>Könnten wir …?</strong></p>
        <h3>10. Course Book</h3>
        <p>Complete the existing Teil 1 Lesen (Anzeigen), Teil 2 Lesen (Ihr Termin) and Teil 3 Hören in the workbook. These are the published assessed activities; the example writing exercise above is ungraded.</p>
      </section>
    </section>
  );
}
