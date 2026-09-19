import React from "react";
import { getB2LessonContentAlignment } from "../data/b2LessonContentAlignment";
import { styles } from "../styles";

const B2_TOPIC_FOUNDATIONS = Object.freeze({
  1: { intro: "Im Alltag entsteht viel Abfall durch Verpackungen, Einwegprodukte und spontane Käufe. Müllvermeidung beginnt deshalb vor dem Wegwerfen: Produkte länger nutzen, Mehrweg wählen, reparieren und nur kaufen, was wirklich gebraucht wird.", example: "Eine Familie nimmt eigene Behälter zum Einkaufen mit und kauft Getränke in Mehrwegflaschen.", tension: "Bequemlichkeit und niedriger Preis ↔ weniger Abfall und längere Nutzung", question: "Welche Maßnahme reduziert Müll im Alltag wirklich dauerhaft?" },
  2: { intro: "Mülltrennung ist nur ein Teil von Recycling. Entscheidend ist, ob Materialien gesammelt, sortiert, wiederverwendet oder zu neuen Produkten verarbeitet werden können. Kreislaufwirtschaft versucht, Rohstoffe möglichst lange im Umlauf zu halten.", example: "Ein altes Glas wird gesammelt, eingeschmolzen und als neues Glas wieder genutzt.", tension: "einfach wegwerfen ↔ Rohstoffe zurückgewinnen und Produkte weiterverwenden", question: "Wann ist Wiederverwendung sinnvoller als Recycling?" },
  3: { intro: "Lebensmittelverschwendung entsteht in Haushalten, Handel und Gastronomie. Häufig werden Produkte weggeworfen, obwohl sie noch essbar sind. Bessere Planung, passende Portionsgrößen und eine sinnvolle Weitergabe können Verschwendung reduzieren.", example: "Ein Supermarkt verkauft Produkte kurz vor dem Mindesthaltbarkeitsdatum günstiger statt sie wegzuwerfen.", tension: "große Auswahl und volle Regale ↔ weniger Verschwendung und bessere Planung", question: "Wer trägt mehr Verantwortung: Verbraucher oder Handel?" },
  4: { intro: "Verpackungen schützen Produkte, verursachen aber auch viel Abfall. Beim bewussten Einkauf geht es deshalb um Einweg und Mehrweg, unnötige Verpackungen, Materialwahl und die Frage, welche Alternative im Alltag wirklich praktikabel ist.", example: "Ein Geschäft bietet Nachfüllstationen an, damit Kunden Shampoo oder Reinigungsmittel ohne neue Plastikflasche kaufen können.", tension: "Hygiene und Bequemlichkeit ↔ weniger Verpackungsmüll", question: "Welche Verpackungen könnten leicht vermieden werden?" },
  5: { intro: "Nachhaltige Mobilität bedeutet nicht, dass ein Verkehrsmittel immer die beste Lösung ist. Entscheidend sind Strecke, Infrastruktur, Kosten, Zeit und Emissionen. Gute Verkehrspolitik verbindet mehrere Möglichkeiten.", example: "Eine Pendlerin fährt mit dem Fahrrad zum Bahnhof und danach mit der Bahn zur Arbeit.", tension: "Flexibilität des Autos ↔ weniger Emissionen und weniger Verkehr", question: "Was müsste passieren, damit mehr Menschen Bus und Bahn nutzen?" },
  6: { intro: "Energie sparen betrifft Haushalte, Unternehmen und Politik. Gleichzeitig geht es um den Ausbau erneuerbarer Energien wie Sonne und Wind. Weniger Verbrauch und sauberere Energiequellen ergänzen sich, lösen aber unterschiedliche Teile des Problems.", example: "Ein Wohnhaus wird besser gedämmt und erhält zusätzlich Solarmodule auf dem Dach.", tension: "Investitionskosten ↔ langfristig geringerer Verbrauch und Klimaschutz", question: "Was ist wichtiger: weniger Energie verbrauchen oder mehr erneuerbare Energie erzeugen?" },
  7: { intro: "Klimafreundliches Wohnen betrifft Gebäude, Energieverbrauch und die Gestaltung von Städten. Gute Dämmung, Grünflächen, kurze Wege und weniger versiegelte Flächen können Lebensqualität und Klimaschutz miteinander verbinden.", example: "Eine Stadt pflanzt Bäume, saniert alte Gebäude und schafft sichere Wege für Fußgänger und Fahrräder.", tension: "Baukosten und knapper Platz ↔ Energieeffizienz und Lebensqualität", question: "Welche Stadtmaßnahme bringt im Alltag den größten Nutzen?" },
  8: { intro: "Bildungsgerechtigkeit bedeutet nicht, dass alle Lernenden exakt dasselbe bekommen. Manche brauchen zusätzliche Förderung, technische Ausstattung oder finanzielle Unterstützung, damit unterschiedliche Startbedingungen nicht zu dauerhaften Nachteilen werden.", example: "Eine Schule stellt Tablets und kostenlose Lernförderung für Schüler bereit, die zu Hause wenig Unterstützung haben.", tension: "gleiche Regeln für alle ↔ zusätzliche Förderung bei ungleichen Voraussetzungen", question: "Was braucht ein Bildungssystem, damit Chancen tatsächlich fairer werden?" },
  9: { intro: "Schulpflicht sichert einen gemeinsamen Bildungsrahmen. Gleichzeitig muss Schule Leistungen bewerten, Schwächere fördern und klare Verantwortung übernehmen. Die Diskussion dreht sich oft darum, wie viel Druck sinnvoll ist und wie Unterstützung aussehen sollte.", example: "Ein Schüler hat schlechte Noten, erhält aber zusätzliche Beratung und Förderunterricht statt nur weitere Tests.", tension: "Leistungsanforderungen ↔ individuelle Förderung", question: "Wie kann Schule Leistung fordern, ohne schwächere Lernende zurückzulassen?" },
  10: { intro: "Kindergarten ist Betreuung und zugleich ein Ort früher Bildung. Kinder lernen Sprache, soziale Regeln und Selbstständigkeit, während Eltern Beruf und Familie besser organisieren können. Qualität hängt stark von Personal, Gruppen und pädagogischem Angebot ab.", example: "Eine Kita bietet Sprachförderung an und hat flexible Öffnungszeiten für berufstätige Eltern.", tension: "mehr Betreuungsplätze ↔ ausreichend Personal und gute pädagogische Qualität", question: "Was ist bei Kinderbetreuung wichtiger: Verfügbarkeit oder Qualität?" },
  11: { intro: "Digitale Bildung kann Unterricht ergänzen, aber Technik allein verbessert Lernen nicht automatisch. Lernplattformen, Videos und digitale Übungen sind besonders sinnvoll, wenn Lehrkräfte sie gezielt einsetzen und Lernende Medienkompetenz entwickeln.", example: "Eine Klasse arbeitet im Unterricht gemeinsam und nutzt eine Online-Plattform für zusätzliche Übungen zu Hause.", tension: "Flexibilität und digitale Möglichkeiten ↔ direkter Kontakt und Konzentration", question: "Wann verbessert Technologie den Unterricht wirklich?" },
  12: { intro: "Studium und Weiterbildung eröffnen Chancen, verursachen aber Kosten für Lernende und Gesellschaft. Bei Studiengebühren geht es deshalb um Finanzierung, Zugang und die Frage, wer wie viel beitragen sollte. Lebenslanges Lernen wird zusätzlich wichtiger, wenn Berufe sich verändern.", example: "Eine Berufstätige besucht berufsbegleitend einen Weiterbildungskurs, weil neue digitale Kompetenzen verlangt werden.", tension: "individuelle Finanzierung ↔ möglichst breiter Zugang zu Bildung", question: "Wie sollte Weiterbildung finanziert werden, damit sie zugänglich bleibt?" },
  13: { intro: "Wissenschaft und Forschung beeinflussen Medizin, Technik, Umwelt und Alltag. Wichtig ist, Ergebnisse nicht nur zu nennen, sondern zu verstehen, wie sie entstanden sind, welche Grenzen sie haben und welchen praktischen Nutzen sie tatsächlich zeigen.", example: "Eine medizinische Studie untersucht, ob eine neue Behandlung bei einer bestimmten Patientengruppe wirkt.", tension: "schnelle praktische Anwendung ↔ sorgfältige Prüfung und verlässliche Evidenz", question: "Wann kann man einem Forschungsergebnis vertrauen?" },
  14: { intro: "Desinformation wirkt oft überzeugend, weil echte Fakten mit falschen Schlussfolgerungen oder unklaren Quellen vermischt werden. Verlässliche Informationen erkennt man eher an nachvollziehbaren Quellen, überprüfbaren Daten und transparenter Einordnung.", example: "Ein viraler Beitrag behauptet eine medizinische Wirkung, verlinkt aber weder eine Studie noch eine seriöse Institution.", tension: "schnelle und einfache Aussagen ↔ gründliche Quellenprüfung", question: "Welche zwei Dinge würdest du zuerst prüfen, bevor du eine Behauptung weitergibst?" },
  15: { intro: "Wohnraummangel und hohe Mieten entstehen besonders dort, wo viele Menschen wohnen möchten und zu wenig bezahlbarer Wohnraum vorhanden ist. Lösungen können Neubau, Förderung, bessere Nutzung bestehender Wohnungen oder Regeln für den Mietmarkt betreffen.", example: "Eine Stadt fördert neue Wohnungen, verlangt aber, dass ein Teil davon langfristig bezahlbar bleibt.", tension: "Rendite und Baukosten ↔ bezahlbarer Wohnraum", question: "Welche Maßnahme könnte hohe Mieten am wirksamsten begrenzen?" },
  16: { intro: "Stadt und Land bieten unterschiedliche Formen von Lebensqualität. Städte haben oft bessere Infrastruktur und kurze Wege, während ländliche Regionen mehr Ruhe und Raum bieten können. Entscheidend ist, welche Angebote tatsächlich erreichbar sind.", example: "Eine Familie zieht aufs Land, braucht aber für Arbeit, Schule und Arzttermine weiterhin gute Verkehrsverbindungen.", tension: "Ruhe und Platz ↔ kurze Wege und gute Infrastruktur", question: "Welche Infrastruktur entscheidet besonders darüber, ob das Landleben attraktiv bleibt?" },
  17: { intro: "Familie und Beruf lassen sich leichter vereinbaren, wenn Betreuung, Arbeitszeiten und Verantwortung gut zusammenpassen. Probleme entstehen besonders dann, wenn Öffnungszeiten von Kitas und Arbeitszeiten nicht miteinander vereinbar sind.", example: "Ein Unternehmen bietet Gleitzeit an, damit Eltern ihre Kinder zuverlässig abholen können.", tension: "betriebliche Flexibilität ↔ verlässliche Familienzeit und Betreuung", question: "Welche Unterstützung hilft Familien im Arbeitsalltag am meisten?" },
  18: { intro: "Fachkräftemangel bedeutet, dass Unternehmen offene Stellen nicht ausreichend mit qualifizierten Personen besetzen können. Weiterbildung, Ausbildung, Anerkennung ausländischer Abschlüsse und bessere Arbeitsbedingungen können Teil der Lösung sein.", example: "Ein Betrieb finanziert Schulungen, damit Beschäftigte neue technische Aufgaben übernehmen können.", tension: "kurzfristige Personalkosten ↔ langfristige Qualifizierung und Personalbindung", question: "Welche Maßnahme hilft nachhaltiger gegen Fachkräftemangel?" },
  19: { intro: "Homeoffice kann Wege sparen und Arbeit flexibler machen. Gleichzeitig kann ständige digitale Erreichbarkeit dazu führen, dass Arbeit und Freizeit ineinander übergehen. Deshalb sind klare Regeln und echte Erholungszeiten wichtig.", example: "Ein Team vereinbart, dass nach 18 Uhr keine normalen Arbeitsnachrichten mehr beantwortet werden müssen.", tension: "Flexibilität und Erreichbarkeit ↔ Schutz der Freizeit und Erholung", question: "Welche Grenze sollte im Homeoffice verbindlich sein?" },
  20: { intro: "Soziale Medien verbinden private Selbstdarstellung mit öffentlicher Sichtbarkeit. Fotos, Meinungen und persönliche Daten können weitergeleitet, gespeichert und später anders bewertet werden als ursprünglich gedacht.", example: "Ein privates Foto wird von jemand anderem geteilt und erreicht dadurch Personen außerhalb des ursprünglichen Freundeskreises.", tension: "Selbstdarstellung und Reichweite ↔ Privatsphäre und Kontrolle", question: "Welche Informationen sollten besser nicht öffentlich geteilt werden?" },
  21: { intro: "KI kann beim Lernen erklären, strukturieren und Ideen liefern. In Schule und Universität bleibt aber wichtig, dass Lernende Quellen prüfen, eigene Leistungen kennzeichnen und verstehen, was sie abgeben.", example: "Eine Studentin nutzt KI für eine Gliederung, überprüft aber alle Fakten selbst und nennt die Nutzung transparent.", tension: "effiziente Unterstützung ↔ Eigenleistung und akademische Verantwortung", question: "Welche KI-Nutzung sollte in Schule oder Universität erlaubt sein?" },
  22: { intro: "Automatisierung verändert eher einzelne Tätigkeiten als ganze Berufe auf einmal. Routineaufgaben können wegfallen, während neue Aufgaben und Kompetenzen entstehen. Entscheidend ist, ob Beschäftigte rechtzeitig auf den Wandel vorbereitet werden.", example: "Eine Software übernimmt Dateneingaben, während Mitarbeitende stärker Qualitätskontrolle und Beratung übernehmen.", tension: "höhere Effizienz ↔ Arbeitsplatzunsicherheit und Weiterbildungsbedarf", question: "Wie kann Automatisierung fair gestaltet werden?" },
  23: { intro: "Personalisierte Werbung basiert häufig auf Nutzungsdaten, Suchverhalten und Interessenprofilen. Sie kann relevanter wirken, bedeutet aber auch, dass Plattformen viele Informationen über einzelne Personen sammeln und auswerten.", example: "Nach der Suche nach Laufschuhen sieht eine Person auf mehreren Plattformen ähnliche Werbung.", tension: "passendere Werbung ↔ Datenschutz und digitale Selbstbestimmung", question: "Wo sollte die Grenze bei der Nutzung persönlicher Daten für Werbung liegen?" },
  24: { intro: "Telemedizin kann Wege verkürzen und Versorgung erleichtern, besonders bei Beratung oder Nachfragen. Sie ersetzt aber nicht jede Untersuchung. Zusätzlich müssen sensible Gesundheitsdaten besonders gut geschützt werden.", example: "Eine Patientin bespricht einen Laborbefund per Videosprechstunde, muss für eine körperliche Untersuchung aber in die Praxis kommen.", tension: "leichter Zugang und Zeitersparnis ↔ medizinische Grenzen und Datenschutz", question: "Welche medizinischen Termine eignen sich gut für Telemedizin?" },
  25: { intro: "Tourismus schafft Einkommen und Arbeitsplätze, kann aber Orte durch Verkehr, hohe Preise und große Besucherzahlen belasten. Nachhaltiger Tourismus versucht, wirtschaftlichen Nutzen mit Umwelt- und Lebensqualität vor Ort zu verbinden.", example: "Eine Stadt begrenzt große Reisebusse im Zentrum und fördert längere Aufenthalte bei lokalen Anbietern.", tension: "Tourismuseinnahmen ↔ Umweltbelastung und Lebensqualität der Bevölkerung", question: "Wie kann ein beliebter Urlaubsort Besucher aufnehmen, ohne überlastet zu werden?" },
  26: { intro: "Integration ist ein längerfristiger Prozess. Sprache erleichtert Zugang zu Arbeit, Bildung, Behörden und sozialen Kontakten, ist aber nicht der einzige Faktor. Auch Anerkennung von Qualifikationen und faire Teilhabe sind wichtig.", example: "Eine Fachkraft besucht einen Sprachkurs, lässt ihren Abschluss anerkennen und findet dadurch leichter eine passende Stelle.", tension: "Eigeninitiative der Zugewanderten ↔ Unterstützung und offene Strukturen der Gesellschaft", question: "Welche Rolle spielt Sprache für erfolgreiche Integration?" },
  27: { intro: "Gleichstellung bedeutet, dass Menschen faire Chancen und Rechte haben sollen. Diskriminierung kann offen auftreten oder durch Verfahren entstehen, die bestimmte Gruppen systematisch benachteiligen. Deshalb braucht es sowohl Regeln als auch praktische Maßnahmen.", example: "Ein Unternehmen prüft Bewerbungen zunächst ohne Foto und Namen, um unbewusste Vorurteile zu reduzieren.", tension: "gleiche Behandlung ↔ gezielte Maßnahmen gegen bestehende Nachteile", question: "Welche Maßnahme kann Diskriminierung im Alltag konkret reduzieren?" },
  28: { intro: "Die B2-Prüfung verlangt, bekannte Themen flexibel miteinander zu verbinden. Entscheidend ist nicht, möglichst kompliziert zu klingen, sondern klare Argumente, passende Beispiele und sichere Strukturen zu verwenden.", example: "Bei einem Thema über KI im Beruf verbindet eine gute Antwort Ursache, Folge, Gegenargument, Beispiel und eine realistische Lösung.", tension: "sprachliche Komplexität ↔ Klarheit und kontrollierte Argumentation", question: "Welche B2-Strukturen kannst du sicher genug einsetzen, ohne den Satz zu verlieren?" },
});

export const getB2TopicFoundation = (day) => {
  const content = B2_TOPIC_FOUNDATIONS[Number(day)] || null;
  const lesson = getB2LessonContentAlignment(day);
  return content && lesson ? { ...content, day: Number(day), chapter: lesson.chapter, title: lesson.title } : null;
};

const box = {
  border: "1px solid #dbeafe",
  borderRadius: 12,
  padding: 12,
  background: "#ffffff",
  lineHeight: 1.7,
  display: "grid",
  gap: 4,
};

export default function B2TopicIntroduction({ day }) {
  const topic = getB2TopicFoundation(day);
  if (!topic) return null;

  return (
    <section
      style={{ ...styles.card, display: "grid", gap: 12, border: "1px solid #bfdbfe", borderRadius: 18, background: "#f8fbff" }}
      data-b2-topic-intro={topic.day}
    >
      <div>
        <div style={{ fontWeight: 900, color: "#1d4ed8" }}>B2 · Thema kurz verstehen</div>
        <h2 style={{ margin: "4px 0 0", fontSize: "1.2rem" }}>{topic.title}</h2>
      </div>

      <p style={{ margin: 0, lineHeight: 1.75 }}>{topic.intro}</p>

      <div style={box}>
        <strong>Konkretes Beispiel</strong>
        <span>{topic.example}</span>
      </div>

      <div style={{ ...box, background: "#fffbeb", borderColor: "#fde68a" }}>
        <strong>Abwägung</strong>
        <span>{topic.tension}</span>
      </div>

      <div style={{ ...box, background: "#eff6ff" }}>
        <strong>Leitfrage</strong>
        <span>{topic.question}</span>
      </div>
    </section>
  );
}

export { B2_TOPIC_FOUNDATIONS };
