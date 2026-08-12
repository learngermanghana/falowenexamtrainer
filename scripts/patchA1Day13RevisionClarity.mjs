import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pagePath = path.join(root, "web/src/components/A1Day13RevisionNumbersTimePricesWorkbookPage.js");
let source = fs.readFileSync(pagePath, "utf8");

const replaceRequired = (before, after, label) => {
  if (source.includes(after)) return;
  if (!source.includes(before)) throw new Error(`Could not patch A1 Day 13 ${label}.`);
  source = source.replace(before, after);
};

replaceRequired(
`const timePracticeItems = [
  ["2:15", "Es ist Viertel nach zwei."],
  ["5:45", "Es ist Viertel vor sechs."],
  ["7:30", "Es ist halb acht."],
  ["10:10", "Es ist zehn nach zehn."],
  ["8:20", "Es ist zwanzig nach acht."],
];`,
`const timePracticeItems = [
  ["2:15", "Es ist Viertel nach zwei.", "Es ist 2 Uhr 15."],
  ["5:45", "Es ist Viertel vor sechs.", "Es ist 5 Uhr 45."],
  ["7:30", "Es ist halb acht.", "Es ist 7 Uhr 30."],
  ["10:10", "Es ist zehn nach zehn.", "Es ist 10 Uhr 10."],
  ["8:20", "Es ist zwanzig nach acht.", "Es ist 8 Uhr 20."],
];`,
"time answer variants",
);

replaceRequired(
`const groupTaskChecklist = [
  "Write five simple sentences about days and activities.",
  "Use at least two sentences that start with Ich.",
  "Use at least two sentences that start with a day, for example Am Montag.",
  "Use the verb in position 2.",
  "Use different days and different activities where possible.",
];`,
`const groupTaskChecklist = [
  "Write seven simple sentences about days and activities.",
  "Use both sentence patterns so your sentences do not all begin with Ich.",
  "Start at least three sentences with a day, for example Am Montag.",
  "Keep the verb in position 2.",
  "Use different days and activities where possible.",
];`,
"seven-sentence checklist",
);

const oldPractice = `function PracticeInputSection({ title, subtitle, items, placeholder = "Type your answer..." }) {
  const [inputs, setInputs] = useState({});

  return (
    <section style={section}>
      <div style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        {subtitle ? <p style={{ margin: 0 }}>{subtitle}</p> : null}
      </div>

      {items.map((item, i) => {
        const prompt = Array.isArray(item) ? item[0] : item.question;
        const helper = Array.isArray(item) ? null : \`${'${item.object}'} · ${'${item.price}'}\`;

        return (
          <div key={\`${'${prompt}'}-${'${i}'}\`} style={card}>
            <strong>{prompt}</strong>
            {helper ? <span style={{ color: "#6b7280", fontSize: 13 }}>Use: {helper}</span> : null}
            <input
              style={inputStyle}
              placeholder={placeholder}
              value={inputs[i] || ""}
              onChange={(e) => setInputs((prev) => ({ ...prev, [i]: e.target.value }))}
            />
          </div>
        );
      })}
    </section>
  );
}`;

const newPractice = `function PracticeInputSection({ title, subtitle, items, placeholder = "Type your answer..." }) {
  const [inputs, setInputs] = useState({});
  const [checked, setChecked] = useState({});

  return (
    <section style={section}>
      <div style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        {subtitle ? <p style={{ margin: 0 }}>{subtitle}</p> : null}
      </div>

      {items.map((item, i) => {
        const prompt = Array.isArray(item) ? item[0] : item.question;
        const helper = Array.isArray(item) ? null : \`${'${item.object}'} · ${'${item.price}'}\`;
        const modelAnswers = Array.isArray(item) ? item.slice(1).filter(Boolean) : [];

        return (
          <div key={\`${'${prompt}'}-${'${i}'}\`} style={card}>
            <strong>{prompt}</strong>
            {helper ? <span style={{ color: "#6b7280", fontSize: 13 }}>Use: {helper}</span> : null}
            <input
              style={inputStyle}
              placeholder={placeholder}
              value={inputs[i] || ""}
              onChange={(e) => setInputs((prev) => ({ ...prev, [i]: e.target.value }))}
            />
            {modelAnswers.length ? (
              <>
                <button
                  type="button"
                  style={darkBtn}
                  onClick={() => setChecked((prev) => ({ ...prev, [i]: true }))}
                >
                  Check answer
                </button>
                {checked[i] ? (
                  <div style={{ ...infoBox, marginTop: 2 }}>
                    <strong>Model answer{modelAnswers.length > 1 ? "s" : ""}:</strong>
                    {modelAnswers.map((answer) => <div key={answer}>{answer}</div>)}
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        );
      })}
    </section>
  );
}`;

replaceRequired(oldPractice, newPractice, "check-answer controls");

replaceRequired(
`      <div style={{ display: "grid", gap: 6 }}>
        <p style={{ margin: 0, color: "#166534", fontWeight: 800 }}>Practical group assignment</p>
        <h2 style={{ margin: 0 }}>Build your own sentences with days and activities</h2>
        <p style={{ margin: 0 }}>
          This is not a tutor assignment. First learn the sentence patterns below. Then write your own sentences and save them for your class discussion.
        </p>
      </div>

      <div style={infoBox}>
        <strong>Step 1: Learn the two sentence structures</strong>
        <div><strong>Structure 1:</strong> Subject + Verb + Time + Activity</div>
        <div>Ich gehe am Montag zur Schule.</div>
        <div>Ich lese am Freitag.</div>
        <div style={{ marginTop: 6 }}><strong>Structure 2:</strong> Time + Verb + Subject + Activity</div>
        <div>Am Montag gehe ich zur Schule.</div>
        <div>Am Dienstag treibe ich Sport.</div>
        <div style={{ color: "#1e40af", marginTop: 6 }}>
          Important: If the sentence starts with a day, the verb comes directly after the day.
        </div>
      </div>

      <div style={tipBox}>
        <strong>Step 2: Choose your day and activity</strong>
        <div><strong>Days:</strong> Montag · Dienstag · Mittwoch · Donnerstag · Freitag · Samstag · Sonntag</div>
        <div><strong>Activities:</strong> kochen · Freunde treffen · Hausaufgaben machen · fernsehen · lesen</div>
        <div>im Park spazieren gehen · zur Schule gehen · arbeiten · Sport treiben · einkaufen gehen</div>
      </div>

      <div style={infoBox}>
        <strong>Step 3: Use the correct verb form for ich</strong>
        <div>gehen → ich gehe</div>
        <div>machen → ich mache</div>
        <div>lesen → ich lese</div>
        <div>treffen → ich treffe</div>
        <div>arbeiten → ich arbeite</div>
        <div>fernsehen → ich sehe fern</div>
        <div>Sport treiben → ich treibe Sport</div>
        <div>einkaufen gehen → ich gehe einkaufen</div>
      </div>`,
`      <div style={{ display: "grid", gap: 6 }}>
        <p style={{ margin: 0, color: "#166534", fontWeight: 800 }}>Practical group assignment</p>
        <h2 style={{ margin: 0 }}>Now build 7 sentences</h2>
        <p style={{ margin: 0 }}>
          Use the days and activities from the learning box above. This is class practice, not a tutor assignment.
        </p>
      </div>`,
"duplicate group instructions",
);

replaceRequired(
`          placeholder="Write your 5 sentences here. Example pattern only: Ich ... am Montag ... / Am Dienstag ... ich ..."`,
`          placeholder="Write your 7 sentences here. Mix both patterns: Ich ... am Montag ... / Am Dienstag ... ich ..."`,
"seven-sentence placeholder",
);

replaceRequired(
`          <div style={infoBox}>
            <div><strong>Sentence Structures:</strong></div>
            <div>1. Subject + Verb + Time + Other Elements</div>
            <div>2. Time + Verb + Subject + Other Elements</div>
          </div>

          <div style={tipBox}>
            <div><strong>Days of the Week in German</strong></div>
            <div>Montag · Dienstag · Mittwoch · Donnerstag · Freitag · Samstag · Sonntag</div>
          </div>

          <div style={infoBox}>
            <div><strong>Activities to Use in Sentences</strong></div>
            <div>kochen · Freunde treffen · Hausaufgaben machen · fernsehen · lesen</div>
            <div>im Park spazieren gehen · zur Schule gehen · arbeiten · Sport treiben · einkaufen gehen</div>
          </div>`,
`          <div style={infoBox}>
            <div><strong>Two useful sentence patterns</strong></div>
            <div><strong>1. Subject + Verb + Time + Other Elements</strong></div>
            <div>Ich gehe am Montag zur Schule.</div>
            <div>Ich lese am Freitag.</div>
            <div style={{ marginTop: 6 }}><strong>2. Time + Verb + Subject + Other Elements</strong></div>
            <div>Am Montag gehe ich zur Schule.</div>
            <div>Am Dienstag treibe ich Sport.</div>
            <div style={{ color: "#1e40af", marginTop: 6 }}>
              Start some sentences with the time or day so you do not repeat <strong>Ich ... Ich ... Ich ...</strong> in every sentence. When the time comes first, the verb still stays in position 2: <strong>Am Montag gehe ich ...</strong>
            </div>
          </div>

          <div style={tipBox}>
            <div><strong>Days:</strong> Montag · Dienstag · Mittwoch · Donnerstag · Freitag · Samstag · Sonntag</div>
            <div><strong>Activities:</strong> kochen · Freunde treffen · Hausaufgaben machen · fernsehen · lesen · im Park spazieren gehen · zur Schule gehen · arbeiten · Sport treiben · einkaufen gehen</div>
          </div>`,
"sentence-building explanation",
);

replaceRequired(
`          subtitle="Read the numbers out loud in German and type what you think. The model answer is not shown here, so you practise actively."`,
`          subtitle="Read each number out loud, type your answer, then use Check answer to compare it with the model."`,
"numbers subtitle",
);

replaceRequired(
`          subtitle="Say the time in German. Use the patterns above to help you."`,
`          subtitle="Say the time in German, then check both common forms: conversational time and the Uhr + minutes form."`,
"time subtitle",
);

fs.writeFileSync(pagePath, source, "utf8");
console.log("A1 Day 13 revision practice is shorter, checkable and clearer for sentence variation.");
