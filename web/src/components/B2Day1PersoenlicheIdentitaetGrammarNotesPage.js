import React from "react";
import AppBackButton from "./navigation/AppBackButton";

const card = { background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 8px 24px rgba(15,23,42,0.08)", marginBottom: 16 };

export default function B2Day1PersoenlicheIdentitaetGrammarNotesPage() {

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1>B2 · Day 1.1 Grammar Notes · Persönliche Identität und Selbstverständnis</h1>
        <p><strong>Grammatikfokus:</strong> Adjektivdeklination</p>
      </div>

      <section style={card}><h2>Einführung</h2><p>Adjektive stehen im Deutschen oft vor Nomen und bekommen dann eine Endung. Diese Endung zeigt Kasus, Genus und Numerus an und macht Aussagen präzise.</p></section>
      <section style={card}><h2>Funktion</h2><p>Mit Adjektivdeklination beschreiben wir Personen, Eigenschaften und Selbstbilder genauer, z. B. „ein selbstbewusster Mensch“ oder „mit einer klaren persönlichen Haltung“.</p></section>
      <section style={card}><h2>Formen/Muster</h2><ul><li><strong>Bestimmter Artikel:</strong> der kluge Student, die offene Diskussion, das neue Profil, die sozialen Medien</li><li><strong>Unbestimmter Artikel:</strong> ein kluger Student, eine offene Diskussion, ein neues Profil</li><li><strong>Ohne Artikel:</strong> kluger Ausdruck, offene Fragen, neues Denken</li></ul></section>
      <section style={card}><h2>Beispiele</h2><ul><li>Ich möchte ein authentisches Bild von mir zeigen.</li><li>In sozialen Netzwerken sieht man oft nur einen kleinen Teil der Identität.</li><li>Mit klarer Sprache kann man ein starkes Selbstverständnis ausdrücken.</li></ul></section>
      <section style={card}><h2>Häufige Fehler</h2><ul><li>❌ ein authentisch Bild → ✅ ein authentisches Bild</li><li>❌ mit eine klaren Haltung → ✅ mit einer klaren Haltung</li><li>❌ soziale Medien sind ein wichtiges Teil → ✅ soziale Medien sind ein wichtiger Teil</li></ul></section>
      <section style={card}><h2>Mini-Übung (MCQ)</h2><p>Wählen Sie die richtige Form: „Sie hat ___ Meinung über ihre Zukunft.“</p><ul><li>A) ein klar</li><li>B) eine klare ✅</li><li>C) einer klaren</li></ul></section>
      <section style={card}><h2>Takeaway</h2><p>Merken Sie sich: Die Adjektivendung hängt vom Artikel ab. Prüfen Sie immer zuerst Artikel + Kasus, dann die Endung.</p></section>
    </div>
  );
}
