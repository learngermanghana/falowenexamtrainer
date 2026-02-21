import React, { memo, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

/** =========================
 *  UI helpers
 *  ========================= */
const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 10 }} aria-label={title}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const TopicImageBreak = ({ src, alt, title, subtitle }) => (
  <div style={{ ...styles.card, padding: 0, overflow: "hidden" }} aria-label={title || "Topic image"}>
    <img
      src={src}
      alt={alt}
      style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
      loading="lazy"
    />
    {(title || subtitle) && (
      <div style={{ padding: 12, display: "grid", gap: 4 }}>
        {title && <div style={{ fontWeight: 900 }}>{title}</div>}
        {subtitle && <div style={{ opacity: 0.85 }}>{subtitle}</div>}
      </div>
    )}
  </div>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((x) => (
      <li key={x}>{x}</li>
    ))}
  </ul>
);

/** =========================
 *  Free-to-use images (Unsplash License)
 *  ========================= */
const IMG_LETTER =
  "https://source.unsplash.com/n9AaeihA9HI/1600x900"; // notebook/letter vibe
const IMG_PRACTICE =
  "https://source.unsplash.com/2JIvboGLeho/1600x900"; // studying / writing vibe

/** =========================
 *  A1 Weil Practice Block
 *  ========================= */
const WeilPractice = () => {
  const questions = useMemo(
    () => [
      {
        id: "q1",
        title: "Example 1 (Modal verb)",
        prompt: "Ich kann nicht kommen. → Ich schreibe Ihnen, weil ...",
        choices: [
          "ich kann nicht kommen.",
          "ich nicht kommen kann.",
        ],
        answer: "ich nicht kommen kann.",
        explanation: "Nach „weil“ kommt das Verb (kann) am Ende.",
      },
      {
        id: "q2",
        title: "Example 2 (Normal verb)",
        prompt: "Ich komme nicht. → Ich schreibe Ihnen, weil ...",
        choices: [
          "ich nicht komme.",
          "ich komme nicht.",
        ],
        answer: "ich nicht komme.",
        explanation: "Nach „weil“ kommt das Verb (komme) am Ende.",
      },
      {
        id: "q3",
        title: "Tip with „möchte“",
        prompt: "Ich schreibe Ihnen, weil ...",
        choices: [
          "ich möchte den Termin absagen.",
          "ich den Termin absagen möchte.",
        ],
        answer: "ich den Termin absagen möchte.",
        explanation: "„möchte“ steht am Ende (weil-Satz).",
      },
    ],
    []
  );

  const [selected, setSelected] = useState(() => Object.fromEntries(questions.map((q) => [q.id, ""])));
  const [checked, setChecked] = useState(false);

  const score = useMemo(() => {
    if (!checked) return null;
    let s = 0;
    questions.forEach((q) => {
      if (selected[q.id] === q.answer) s++;
    });
    return s;
  }, [checked, selected, questions]);

  const reset = () => {
    setSelected(Object.fromEntries(questions.map((q) => [q.id, ""])));
    setChecked(false);
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <p style={{ margin: 0 }}>
        Rule: After <strong>weil</strong>, the verb goes to the <strong>end</strong>.
      </p>

      {questions.map((q, idx) => {
        const val = selected[q.id];
        const isCorrect = checked && val === q.answer;
        const isWrong = checked && val && val !== q.answer;

        return (
          <div key={q.id} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, display: "grid", gap: 8 }}>
            <div style={{ fontWeight: 800 }}>
              {idx + 1}) {q.title}
            </div>
            <div style={{ opacity: 0.9 }}>{q.prompt}</div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {q.choices.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelected((p) => ({ ...p, [q.id]: c }))}
                  style={{
                    ...styles.secondaryButton,
                    width: "fit-content",
                    borderColor: val === c ? "#111827" : undefined,
                    fontWeight: val === c ? 800 : 500,
                  }}
                  aria-label={`Choose: ${c}`}
                >
                  {c}
                </button>
              ))}

              {isCorrect && <span style={{ fontWeight: 800 }}>✅ richtig</span>}
              {isWrong && <span style={{ fontWeight: 800 }}>❌ falsch</span>}
            </div>

            {checked && (
              <div style={{ opacity: 0.9 }}>
                <strong>Why:</strong> {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button
          type="button"
          style={{ ...styles.primaryButton, width: "fit-content" }}
          onClick={() => setChecked(true)}
          disabled={Object.values(selected).some((v) => !v)}
        >
          Check answers
        </button>
        <button type="button" style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={reset}>
          Reset
        </button>

        {checked && (
          <div style={{ marginLeft: "auto", fontWeight: 900 }}>
            Score: {score}/{questions.length}
          </div>
        )}
      </div>
    </div>
  );
};

/** =========================
 *  Copy-ready letter templates (A1 + weil only)
 *  ========================= */
const CopyLetterBuilder = () => {
  const [mode, setMode] = useState("formal"); // formal | informal

  // Formal greeting
  const [formalGreetingType, setFormalGreetingType] = useState("damen"); // frau | herr | damen
  const [formalName, setFormalName] = useState("");

  // Informal greeting
  const [informalGreetingType, setInformalGreetingType] = useState("hallo"); // hallo | liebe | lieber
  const [informalName, setInformalName] = useState("");

  // A1 reasons (weil only)
  const REASONS = useMemo(
    () => [
      { id: "absage", label: "Termin absagen", weil: "ich den Termin absagen möchte" },
      { id: "kurs", label: "Deutschkurs besuchen", weil: "ich einen Deutschkurs besuchen möchte" },
      { id: "geburtstag", label: "Gratulieren (Geburtstag)", weil: "ich dir zum Geburtstag gratulieren möchte" },
      { id: "anfragen", label: "Anfragen stellen", weil: "ich Anfragen stellen möchte" },
    ],
    []
  );
  const [reasonId, setReasonId] = useState("absage");
  const reason = REASONS.find((r) => r.id === reasonId) || REASONS[0];

  // Body lines (simple)
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");

  // Name
  const [senderName, setSenderName] = useState("");

  const greeting = useMemo(() => {
    if (mode === "formal") {
      if (formalGreetingType === "frau") return `Sehr geehrte Frau ${formalName || "..."},`;
      if (formalGreetingType === "herr") return `Sehr geehrter Herr ${formalName || "..."},`;
      return "Sehr geehrte Damen und Herren,";
    }

    if (informalGreetingType === "liebe") return `Liebe ${informalName || "..."},`;
    if (informalGreetingType === "lieber") return `Lieber ${informalName || "..."},`;
    return `Hallo ${informalName || "..."},`;
  }, [mode, formalGreetingType, formalName, informalGreetingType, informalName]);

  const opener = mode === "formal"
    ? "Ich hoffe, es geht Ihnen gut."
    : "Wie geht es dir? Ich hoffe, es geht dir gut.";

  const weilSentence = useMemo(() => {
    if (mode === "formal") return `Ich schreibe Ihnen, weil ${reason.weil}.`;
    // special case birthday (contains "dir" already)
    if (reasonId === "geburtstag") return "Ich schreibe dir, weil ich dir zum Geburtstag gratulieren möchte.";
    return `Ich schreibe dir, weil ${reason.weil}.`;
  }, [mode, reason, reasonId, reasonId]);

  const closing = mode === "formal"
    ? "Ich freue mich im Voraus auf Ihre Antwort."
    : "Ich freue mich im Voraus auf deine Antwort.";

  const signoff = mode === "formal" ? "Mit freundlichen Grüßen," : "Liebe Grüße,";

  const letter = useMemo(() => {
    const out = [];
    out.push(greeting);
    out.push("");
    out.push(opener);
    out.push(weilSentence);
    out.push("");
    if ((line1 || "").trim()) out.push(line1.trim());
    if ((line2 || "").trim()) out.push(line2.trim());
    out.push("");
    out.push(closing);
    out.push(signoff);
    out.push(senderName || (mode === "formal" ? "[Your Full Name]" : "[Your First Name]"));
    return out.join("\n");
  }, [greeting, opener, weilSentence, line1, line2, closing, signoff, senderName, mode]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      alert("Copied!");
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="radio" name="mode2" checked={mode === "formal"} onChange={() => setMode("formal")} />
          Formal (Sie)
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="radio" name="mode2" checked={mode === "informal"} onChange={() => setMode("informal")} />
          Informal (du)
        </label>
      </div>

      {/* Greeting choices */}
      {mode === "formal" ? (
        <div style={{ display: "grid", gap: 10 }}>
          <strong>Greeting (Formal)</strong>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="radio" name="fg" checked={formalGreetingType === "frau"} onChange={() => setFormalGreetingType("frau")} />
              Sehr geehrte Frau + Name
            </label>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="radio" name="fg" checked={formalGreetingType === "herr"} onChange={() => setFormalGreetingType("herr")} />
              Sehr geehrter Herr + Name
            </label>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="radio" name="fg" checked={formalGreetingType === "damen"} onChange={() => setFormalGreetingType("damen")} />
              Sehr geehrte Damen und Herren
            </label>
          </div>

          {(formalGreetingType === "frau" || formalGreetingType === "herr") && (
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontWeight: 800 }}>Name</span>
              <input
                value={formalName}
                onChange={(e) => setFormalName(e.target.value)}
                placeholder="e.g., Müller"
                style={{ padding: 10, borderRadius: 10, border: "1px solid #d1d5db" }}
              />
            </label>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          <strong>Greeting (Informal)</strong>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="radio" name="ig" checked={informalGreetingType === "hallo"} onChange={() => setInformalGreetingType("hallo")} />
              Hallo + Name
            </label>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="radio" name="ig" checked={informalGreetingType === "liebe"} onChange={() => setInformalGreetingType("liebe")} />
              Liebe + Name (female)
            </label>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="radio" name="ig" checked={informalGreetingType === "lieber"} onChange={() => setInformalGreetingType("lieber")} />
              Lieber + Name (male)
            </label>
          </div>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontWeight: 800 }}>First name</span>
            <input
              value={informalName}
              onChange={(e) => setInformalName(e.target.value)}
              placeholder="e.g., Max"
              style={{ padding: 10, borderRadius: 10, border: "1px solid #d1d5db" }}
            />
          </label>
        </div>
      )}

      {/* Reason */}
      <div style={{ display: "grid", gap: 8 }}>
        <strong>Reason (weil)</strong>
        <select
          value={reasonId}
          onChange={(e) => setReasonId(e.target.value)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #d1d5db" }}
        >
          {REASONS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>

        <div style={{ ...styles.card, display: "grid", gap: 6 }}>
          <div style={{ fontWeight: 900 }}>Weil sentence preview</div>
          <div>{weilSentence}</div>
        </div>
      </div>

      {/* Body writing */}
      <div style={{ display: "grid", gap: 8 }}>
        <strong>Main body (write 1–2 simple lines)</strong>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 800 }}>Line 1</span>
          <input
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
            placeholder={mode === "formal" ? "e.g., Können Sie mir bitte Informationen geben?" : "e.g., Alles Gute zum Geburtstag!"}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #d1d5db" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 800 }}>Line 2 (optional)</span>
          <input
            value={line2}
            onChange={(e) => setLine2(e.target.value)}
            placeholder={mode === "formal" ? "e.g., Wann beginnt der Kurs?" : "e.g., Hast du eine Feier?"}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #d1d5db" }}
          />
        </label>
      </div>

      {/* Name + copy */}
      <div style={{ display: "grid", gap: 8 }}>
        <strong>Sign your name</strong>
        <input
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          placeholder={mode === "formal" ? "Your full name" : "Your first name"}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #d1d5db" }}
        />

        <strong>Final letter (copy & submit)</strong>
        <pre
          style={{
            margin: 0,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "#0b1220",
            color: "#e5e7eb",
            overflowX: "auto",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {letter}
        </pre>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" style={{ ...styles.primaryButton, width: "fit-content" }} onClick={copy}>
            Copy letter
          </button>
        </div>

        <div style={{ borderRadius: 10, background: "#ecfdf5", border: "1px solid #86efac", padding: 10 }}>
          {completionNote}
        </div>
      </div>
    </div>
  );
};

/** =========================
 *  Page: Note → Practice → Copy & Submit
 *  ========================= */
const LetterWritingA1IntroPage = () => {
  const navigate = useNavigate();
  // if you want i18n later, you can add useTranslation()—kept simple here.

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 Letter Writing: Formal & Informal (weil)</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Read the structure → practice “weil” word order → build your own letter and copy it.
        </p>
      </header>

      <TopicImageBreak
        src={IMG_LETTER}
        alt="Notebook and writing materials"
        title="Step 1: Read the note"
        subtitle="First understand the structure. Then you practice."
      />

      <Section title="Formal Letter Structure (Note)">
        <BulletList
          items={[
            "Sehr geehrte Frau + Name (female)",
            "Sehr geehrter Herr + Name (male)",
            "Sehr geehrte Damen und Herren (unknown receiver)",
          ]}
        />
        <p style={{ margin: 0 }}>
          <strong>Opening:</strong> Ich hoffe, es geht Ihnen gut. Ich schreibe Ihnen, weil [reason for writing].
        </p>
        <p style={{ margin: 0 }}>
          <strong>weil rule:</strong> After <strong>weil</strong>, the verb (or modal verb) goes to the end.
        </p>
        <BulletList
          items={[
            "Example 1: Ich kann nicht kommen. → Ich schreibe Ihnen, weil ich nicht kommen kann.",
            "Example 2: Ich komme nicht. → Ich schreibe Ihnen, weil ich nicht komme.",
            "Tip: You can often start with „Ich“ and end with „möchte“: Ich schreibe Ihnen, weil ich den Termin absagen möchte.",
          ]}
        />
        <p style={{ margin: 0 }}>
          <strong>Conclusion (fixed):</strong> Ich freue mich im Voraus auf Ihre Antwort.
          <br />
          <strong>Closing:</strong> Mit freundlichen Grüßen,
          <br />
          <strong>Name:</strong> [Your Full Name]
        </p>
      </Section>

      <Section title="Informal Letter Structure (Note)">
        <BulletList
          items={[
            "Hallo [Name]",
            "Liebe [Name] (female) / Lieber [Name] (male)",
          ]}
        />
        <p style={{ margin: 0 }}>
          <strong>Opening:</strong> Wie geht es dir? Ich hoffe, es geht dir gut. Ich schreibe dir, weil [reason for writing].
        </p>
        <p style={{ margin: 0 }}>
          <strong>weil rule:</strong> After <strong>weil</strong>, the verb (or modal verb) goes to the end.
        </p>
        <BulletList
          items={[
            "Example 1: Ich kann nicht kommen. → Ich schreibe dir, weil ich nicht kommen kann.",
            "Example 2: Ich komme nicht. → Ich schreibe dir, weil ich nicht komme.",
            "Tip: Ich schreibe dir, weil ich den Termin absagen möchte.",
          ]}
        />
        <p style={{ margin: 0 }}>
          <strong>Conclusion (fixed):</strong> Ich freue mich im Voraus auf deine Antwort.
          <br />
          <strong>Closing:</strong> Liebe Grüße / Viele Grüße
          <br />
          <strong>Name:</strong> [Your First Name]
        </p>
      </Section>

      <TopicImageBreak
        src={IMG_PRACTICE}
        alt="Person writing and studying"
        title="Step 2: Practice"
        subtitle="Train the weil rule before writing the full letter."
      />

      <Section title="Practice: weil word order (A1)">
        <WeilPractice />
      </Section>

      <TopicImageBreak
        src={IMG_LETTER}
        alt="Notebook and writing materials"
        title="Step 3: Write + copy"
        subtitle="Build your own letter and submit it."
      />

      <Section title="Write your letter (A1) — Copy & Submit">
        <A1WeilLetterBuilder />
      </Section>
    </main>
  );
};

export default memo(LetterWritingA1IntroPage);
