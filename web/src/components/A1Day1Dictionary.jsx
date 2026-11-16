import React from "react";

// A1 Day 1 (Kapitel 0.1): classroom vocabulary drawn from the Greetings
// reading text, greeting questions and introductory grammar.
export const A1_DAY_1_DICTIONARY = Object.freeze([
  ["Guten Morgen!", "Good morning"],
  ["Guten Tag!", "Good day / Hello"],
  ["Guten Abend!", "Good evening"],
  ["Gute Nacht!", "Good night"],
  ["Hallo!", "Hello (informal)"],
  ["Tschüss!", "Bye (informal)"],
  ["Auf Wiedersehen!", "Goodbye (formal)"],
  ["Wie geht es dir?", "How are you? (informal)"],
  ["Wie geht es Ihnen?", "How are you? (formal)"],
  ["Mir geht es gut.", "I am fine."],
  ["Danke.", "Thank you."],
  ["Ich bin ein bisschen müde.", "I am a little tired."],
  ["Ich bin glücklich, dich zu sehen.", "I'm happy to see you."],
  ["Schlaf gut!", "Sleep well!"],
]);

export default function A1Day1Dictionary() {
  return (
    <section data-a1-day1-dictionary="true" aria-label="A1 Day 1 dictionary"
      style={{ background: "#f8fbff", border: "1px solid #bfdbfe", borderRadius: 14, padding: 18 }}>
      <div style={{ display: "grid", gap: 6, marginBottom: 16 }}>
        <span style={{ color: "#1d4ed8", fontWeight: 800, fontSize: 12 }}>A1 · DAY 1 · KAPITEL 0.1</span>
        <h2 style={{ margin: 0, color: "#173b76" }}>Dictionary · Begrüßungen &amp; Wohlbefinden</h2>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.5 }}>
          Greetings and well-being. Learn these German expressions and their English meanings before the reading questions.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))", gap: 10 }}>
        {A1_DAY_1_DICTIONARY.map(([german, english]) => (
          <div key={german} style={{ background: "#fff", border: "1px solid #dbeafe", borderRadius: 10, padding: 12, display: "grid", gap: 5 }}>
            <strong lang="de" style={{ color: "#1e40af", fontSize: 15 }}>{german}</strong>
            <span lang="en" style={{ color: "#334155", fontSize: 13 }}>{english}</span>
          </div>
        ))}
      </div>
      <p style={{ color: "#64748b", fontSize: 12, margin: "14px 0 0" }}>
        You can also click underlined expressions in the reading text to see their meanings.
      </p>
    </section>
  );
}
