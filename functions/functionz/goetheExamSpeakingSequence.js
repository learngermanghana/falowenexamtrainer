// Short, predictable oral-exam practice sequences. These are simulations,
// not official Goethe examination scripts. No extra model calls for A1/A2 prompts.
const clean = (value) => String(value || "").replace(/\s+/g, " ").trim().slice(0, 120);
const partNumber = (task) => {
  const value = String(task?.teil || "");
  const match = value.match(/(?:teil[\s-]*)([123])/i);
  return match ? Number(match[1]) : 1;
};
const maxAnswersForExam = (level) => level === "A1" || level === "A2" ? 3 : 4;

function examPlan(level, task = {}) {
  const part = partNumber(task);
  const topic = clean(task.prompt) || "Ihren Alltag";
  const keyword = clean(task.keywords);
  const card = keyword ? " (Stichwort: " + keyword + ")" : "";
  if (level === "A1") {
    if (part === 1) return {
      maxAnswers:3,
      opening:"Guten Tag. Stellen Sie sich bitte vor. Wie heißen Sie, woher kommen Sie und wo wohnen Sie?",
      followups:[
        "Danke. Was machen Sie beruflich und was machen Sie gern in Ihrer Freizeit?",
        "Welche Sprachen sprechen Sie? Erzählen Sie bitte noch etwas über sich.",
        "Vielen Dank. Teil 1 ist beendet. Sie können jetzt Ihre Rückmeldung ansehen.",
      ],
    };
    if (part === 2) return {
      maxAnswers:3,
      opening:"Teil 2. Ihr Thema ist „" + topic + "“" + card + ". Stellen Sie mir bitte eine Frage dazu.",
      followups:[
        "Danke für Ihre Frage. Stellen Sie mir bitte noch eine andere Frage zum Thema „" + topic + "“.",
        "Vielen Dank. Können Sie noch eine letzte kurze Frage zum Thema stellen?",
        "Vielen Dank. Teil 2 ist beendet. Sie können jetzt Ihre Rückmeldung ansehen.",
      ],
    };
    return {
      maxAnswers:3,
      opening:"Teil 3. Die Karte zeigt: „" + topic + "“. Formulieren Sie bitte eine höfliche Bitte.",
      followups:[
        "Danke. Können Sie die Bitte auch mit „Können Sie bitte ...?“ formulieren?",
        "Vielen Dank. Stellen Sie bitte noch eine höfliche Bitte zu dieser Situation.",
        "Vielen Dank. Teil 3 ist beendet. Sie können jetzt Ihre Rückmeldung ansehen.",
      ],
    };
  }
  if (level === "A2") {
    if (part === 1) return {
      maxAnswers:3,
      opening:"Guten Tag. Teil 1. Das Thema ist „" + topic + "“. Was können Sie darüber erzählen?",
      followups:[
        "Danke. Können Sie mir ein konkretes Beispiel zu „" + topic + "“ geben?",
        "Und warum ist dieses Thema für Sie wichtig?",
        "Vielen Dank. Teil 1 ist beendet. Sie können jetzt Ihre Rückmeldung ansehen.",
      ],
    };
    if (part === 2) return {
      maxAnswers:3,
      opening:"Teil 2. Ihre Aufgabe lautet: „" + topic + "“. Erzählen Sie bitte etwas darüber.",
      followups:[
        "Danke. Können Sie dazu noch ein Beispiel oder ein Erlebnis beschreiben?",
        "Was gefällt Ihnen daran besonders? Begründen Sie bitte kurz.",
        "Vielen Dank. Teil 2 ist beendet. Sie können jetzt Ihre Rückmeldung ansehen.",
      ],
    };
    return {
      maxAnswers:3,
      opening:"Teil 3. Wir möchten zusammen etwas planen: „" + topic + "“. Machen Sie bitte einen Vorschlag.",
      followups:[
        "Das ist eine Idee. Wann und wo sollen wir uns treffen?",
        "Gut. Was müssen wir noch organisieren? Können wir uns darauf einigen?",
        "Danke. Unsere Planung ist beendet. Sie können jetzt Ihre Rückmeldung ansehen.",
      ],
    };
  }
  return {
    maxAnswers:4,
    opening:"Guten Tag. Ihre Sprechaufgabe lautet: „" + topic + "“. Bitte beginnen Sie.",
    followups:[],
  };
}

const progress = (level, answeredTurns = 0) => {
  const maxAnswers = maxAnswersForExam(level);
  const answered = Math.min(maxAnswers, Math.max(0, Number(answeredTurns) || 0));
  return {answered,maxAnswers,complete:answered >= maxAnswers};
};

module.exports = {examPlan,progress,maxAnswersForExam,partNumber};
