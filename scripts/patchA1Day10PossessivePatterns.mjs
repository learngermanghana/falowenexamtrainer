import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function updateFile(relativePath, transform) {
  const filePath = path.join(root, relativePath);
  const source = fs.readFileSync(filePath, "utf8");
  const updated = transform(source);
  fs.writeFileSync(filePath, updated, "utf8");
}

updateFile("web/src/data/lessonVideoDictionary.js", (source) => {
  const requestedUrl = "https://youtu.be/7h0XURhtGFg";
  if (source.includes(requestedUrl)) return source;

  const marker = "    11: {\n";
  const day10Block = `    10: {
      videoResources: [
        {
          key: "a1-day10-possessive-articles-ai-video",
          chapter: "6",
          title: "A1 Day 10 · Possessive Articles · AI video",
          description:
            "AI video lesson for mein, dein, sein, ihr, unser, euer and possessive endings in nominative and accusative sentences.",
          url: "${requestedUrl}",
        },
      ],
    },
`;

  if (!source.includes(marker)) {
    throw new Error("A1 Day 11 video anchor was not found.");
  }
  return source.replace(marker, `${day10Block}${marker}`);
});

updateFile("web/src/components/ObjectsAndColorsPage.js", (source) => {
  if (source.includes('stem: "5) Das sind ___ Bücher."')) return source;

  const start = source.indexOf("const PracticeBlock = () => {");
  const end = source.indexOf("\nconst ColorsInteractive = () => {", start);
  if (start < 0 || end < 0) {
    throw new Error("A1 Day 10 possessive practice block was not found.");
  }

  const replacement = `const possessivePracticeQuestions = [
  {
    stem: "1) Das ist ___ Tisch.",
    options: ["mein", "meine", "meinen"],
    answer: "mein",
    pattern: "ein Tisch",
    result: "mein Tisch",
  },
  {
    stem: "2) Ich suche ___ Tisch.",
    options: ["mein", "meine", "meinen"],
    answer: "meinen",
    pattern: "einen Tisch",
    result: "meinen Tisch",
  },
  {
    stem: "3) Das ist ___ Tasche.",
    options: ["mein", "meine", "meinen"],
    answer: "meine",
    pattern: "eine Tasche",
    result: "meine Tasche",
  },
  {
    stem: "4) Er liest ___ Buch.",
    options: ["sein", "seine", "seinen"],
    answer: "sein",
    pattern: "ein Buch",
    result: "sein Buch",
  },
  {
    stem: "5) Das sind ___ Bücher.",
    options: ["unser", "unsere", "unseren"],
    answer: "unsere",
    pattern: "die Bücher",
    result: "unsere Bücher",
  },
];

const PracticeBlock = () => {
  const [answers, setAnswers] = useState({});

  const Option = ({ name, value, checked, onChange }) => (
    <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} />
      {value}
    </label>
  );

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <p style={{ margin: 0 }}>Choose the correct possessive word. Use the article pattern to help you.</p>

      {possessivePracticeQuestions.map((question, index) => {
        const selected = answers[index] || "";
        return (
          <div key={question.stem} style={{ display: "grid", gap: 6 }}>
            <strong>{question.stem}</strong>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {question.options.map((option) => (
                <Option
                  key={option}
                  name={\`possessive-q-\${index + 1}\`}
                  value={option}
                  checked={selected === option}
                  onChange={(event) =>
                    setAnswers((current) => ({ ...current, [index]: event.target.value }))
                  }
                />
              ))}
            </div>
            {selected ? (
              <p style={{ margin: 0 }}>
                {selected === question.answer ? "✅ Correct" : "❌ Try again"} — The pattern is{" "}
                <strong>{question.pattern}</strong>, so you say <strong>{question.result}</strong>.
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
`;

  return `${source.slice(0, start)}${replacement}${source.slice(end)}`;
});

const videoSource = fs.readFileSync(path.join(root, "web/src/data/lessonVideoDictionary.js"), "utf8");
const grammarSource = fs.readFileSync(path.join(root, "web/src/components/ObjectsAndColorsPage.js"), "utf8");

if (!videoSource.includes("https://youtu.be/7h0XURhtGFg")) {
  throw new Error("A1 Day 10 AI video mapping is missing.");
}
if (!grammarSource.includes('stem: "5) Das sind ___ Bücher."')) {
  throw new Error("A1 Day 10 possessive practice does not contain five questions.");
}

console.log("Applied A1 Day 10 AI video and five-question possessive practice.");
