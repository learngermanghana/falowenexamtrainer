const b2Days26To28SelfTutoring = {
  26: {
    question: "Wie formuliert man ein formelles Anliegen an eine Behörde klar und höflich?",
    branches: [
      { id: "anliegen", title: "Anliegen nennen", prompt: "Wie beginnt man eine formelle Nachricht?", keywords: ["Anliegen", "Termin", "Unterlagen", "Bestätigung"], example: "Zu Beginn sollte man das Anliegen knapp nennen, damit die zuständige Person sofort weiß, worum es geht.", starter: "Ich wende mich an Sie, weil ..." },
      { id: "indirekt", title: "Indirekte Frage", prompt: "Wie fragt man höflich nach einem Termin?", keywords: ["ob", "wann", "könnten", "Termin"], example: "Könnten Sie mir bitte mitteilen, ob nächste Woche ein Termin möglich ist?", starter: "Könnten Sie mir bitte mitteilen, ob ..." },
      { id: "bitte", title: "Konkrete Bitte", prompt: "Wie formuliert man die gewünschte Handlung?", keywords: ["bitte", "zusenden", "bestätigen", "prüfen"], example: "Ich wäre Ihnen dankbar, wenn Sie mir den Termin schriftlich bestätigen könnten.", starter: "Ich wäre Ihnen dankbar, wenn ..." },
      { id: "schluss", title: "Höflicher Schluss", prompt: "Wie beendet man die Nachricht?", keywords: ["Rückmeldung", "Dank", "Gruß"], example: "Vielen Dank im Voraus für Ihre Rückmeldung. Mit freundlichen Grüßen ...", starter: "Vielen Dank im Voraus für ..." },
    ],
    quiz: [
      { question: "Welche indirekte Frage ist korrekt?", options: ["Könnten Sie mir sagen, wann ist der Termin?", "Könnten Sie mir sagen, wann der Termin ist?", "Könnten Sie sagen, wann ist Termin der?", "Wann der Termin ist könnten Sie?"], answer: "Könnten Sie mir sagen, wann der Termin ist?", explanation: "In indirekten Fragen steht das konjugierte Verb am Ende." },
      { question: "Welche Formulierung ist am höflichsten?", options: ["Schicken Sie mir die Unterlagen!", "Sie müssen die Unterlagen schicken.", "Könnten Sie mir die Unterlagen bitte zusenden?", "Unterlagen schicken."], answer: "Könnten Sie mir die Unterlagen bitte zusenden?", explanation: "Konjunktiv II plus bitte ist höflich und formell." },
      { question: "Welches Wort leitet eine indirekte Ja/Nein-Frage ein?", options: ["ob", "weil", "deshalb", "obwohl"], answer: "ob", explanation: "Ob leitet indirekte Ja/Nein-Fragen ein." },
      { question: "Welche Reihenfolge ist sinnvoll?", options: ["Gruß → Bitte → Anliegen", "Anliegen → Details → Bitte → Schluss", "Bitte → Gruß → Problem", "Nur die Bitte"], answer: "Anliegen → Details → Bitte → Schluss", explanation: "Diese Reihenfolge macht formelle Nachrichten klar und nachvollziehbar." },
    ],
  },
  27: {
    question: "Wie baut man in der B2-Prüfung eine starke mündliche Antwort auf und reagiert höflich auf andere Meinungen?",
    branches: [
      { id: "meinung", title: "Meinung", prompt: "Wie beginnt man klar?", keywords: ["meiner Meinung nach", "ich bin der Ansicht", "ich denke"], example: "Meiner Meinung nach sollte Homeoffice möglich sein, wenn die Tätigkeit dafür geeignet ist.", starter: "Meiner Meinung nach ..." },
      { id: "grund", title: "Begründung", prompt: "Wie erklärt man warum?", keywords: ["weil", "da", "ein Grund"], example: "Ein Grund dafür ist, dass Beschäftigte dadurch Zeit beim Pendeln sparen können.", starter: "Ein Grund dafür ist, dass ..." },
      { id: "beispiel", title: "Beispiel", prompt: "Wie macht man das Argument konkret?", keywords: ["zum Beispiel", "ein konkretes Beispiel", "etwa"], example: "Ein konkretes Beispiel wäre ein Unternehmen, das zwei Homeoffice-Tage pro Woche anbietet.", starter: "Ein konkretes Beispiel hierfür ist ..." },
      { id: "reaktion", title: "Reagieren", prompt: "Wie stimmt man zu oder widerspricht höflich?", keywords: ["ich verstehe", "allerdings", "da stimme ich zu", "anders sehen"], example: "Ich verstehe diesen Punkt, allerdings sehe ich die Situation etwas anders, weil persönlicher Austausch ebenfalls wichtig ist.", starter: "Ich verstehe deinen Punkt, allerdings ..." },
    ],
    quiz: [
      { question: "Welche Reihenfolge ist für ein Argument am stärksten?", options: ["Beispiel → Ende", "Meinung → Grund → Beispiel → Folge", "Nur Meinung", "Frage → Gruß"], answer: "Meinung → Grund → Beispiel → Folge", explanation: "Diese Struktur entwickelt ein vollständiges B2-Argument." },
      { question: "Welche Formulierung widerspricht höflich?", options: ["Das ist falsch.", "Unsinn!", "Ich verstehe den Punkt, sehe das aber etwas anders.", "Nein."], answer: "Ich verstehe den Punkt, sehe das aber etwas anders.", explanation: "Die Formulierung bleibt respektvoll und zeigt trotzdem eine andere Position." },
      { question: "Welcher Ausdruck führt ein Beispiel ein?", options: ["Ein konkretes Beispiel hierfür ist ...", "Obwohl", "Deshalb weil", "Trotzdem dass"], answer: "Ein konkretes Beispiel hierfür ist ...", explanation: "Damit wird ein Argument konkret belegt." },
      { question: "Welche Formulierung zeigt Zustimmung?", options: ["Da stimme ich dir zu.", "Das stimmt nie.", "Ich lehne alles ab.", "Keinesfalls."], answer: "Da stimme ich dir zu.", explanation: "Das ist eine klare und höfliche Zustimmung." },
    ],
  },
  28: {
    question: "Wie kann man den eigenen B2-Fortschritt realistisch einschätzen und die nächsten Lernschritte planen?",
    branches: [
      { id: "staerke", title: "Stärken", prompt: "Was klappt schon gut?", keywords: ["Sprechen", "Schreiben", "Konnektoren", "Wortschatz"], example: "Ich kann inzwischen meine Meinung klar formulieren und meistens mit einem Grund und Beispiel erklären.", starter: "Eine meiner Stärken ist ..." },
      { id: "fehler", title: "Fehler erkennen", prompt: "Welche Fehler wiederholen sich?", keywords: ["Kasus", "Verbposition", "Artikel", "Endungen"], example: "Ich mache noch Fehler bei Dativ und Akkusativ, besonders nach Präpositionen.", starter: "Ich muss noch besonders auf ... achten." },
      { id: "strategie", title: "Verbessern", prompt: "Wie kann man gezielt üben?", keywords: ["Fehlerliste", "Wiederholung", "Aufnahme", "Korrektur"], example: "Ich kann eine Fehlerliste führen und jede Woche dieselben Strukturen in neuen Sätzen üben.", starter: "Um mich zu verbessern, werde ich ..." },
      { id: "plan", title: "Nächster Schritt", prompt: "Was ist der konkrete Lernplan?", keywords: ["Zeitplan", "Prüfung", "Wiederholen", "Ziel"], example: "In den nächsten zwei Wochen möchte ich täglich 30 Minuten sprechen und zwei B2-Texte pro Woche schreiben.", starter: "Mein nächster konkreter Schritt ist ..." },
    ],
    quiz: [
      { question: "Welche Form ist korrekt?", options: ["Obwohl ich Fortschritte gemacht habe, mache ich noch Kasusfehler.", "Obwohl ich habe Fortschritte gemacht, mache ich Fehler.", "Obwohl Fortschritte ich gemacht habe, ich Fehler mache.", "Obwohl gemacht ich Fortschritte."], answer: "Obwohl ich Fortschritte gemacht habe, mache ich noch Kasusfehler.", explanation: "Im obwohl-Nebensatz steht das Verb am Ende." },
      { question: "Welche Formulierung beschreibt ein konkretes Ziel?", options: ["Ich lerne irgendwann mehr.", "Ich möchte nächste Woche drei Sprechübungen aufnehmen.", "Deutsch ist wichtig.", "Ich sollte besser sein."], answer: "Ich möchte nächste Woche drei Sprechübungen aufnehmen.", explanation: "Ein gutes Lernziel ist konkret und messbar." },
      { question: "Welcher Satz verbindet Ziel und Mittel korrekt?", options: ["Um meine Aussprache zu verbessern, nehme ich mich regelmäßig auf.", "Damit meine Aussprache zu verbessern, nehme ich auf.", "Um ich verbessere Aussprache, nehme ich auf.", "Meine Aussprache um verbessern."], answer: "Um meine Aussprache zu verbessern, nehme ich mich regelmäßig auf.", explanation: "Um ... zu beschreibt ein Ziel bei gleichem Subjekt." },
      { question: "Was ist für Selbstkorrektur am sinnvollsten?", options: ["Wiederkehrende Fehler notieren und gezielt üben", "Fehler ignorieren", "Nur neue Wörter lernen", "Nur schneller sprechen"], answer: "Wiederkehrende Fehler notieren und gezielt üben", explanation: "Gezielte Fehleranalyse hilft, wiederkehrende Probleme systematisch zu reduzieren." },
    ],
  },
};

export default b2Days26To28SelfTutoring;
