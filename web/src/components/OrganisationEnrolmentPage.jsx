import { submitPartnershipForm as request } from "../lib/submitPartnershipForm";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./OrganisationEnrolmentPage.css";

const columns = [["name", "Full name"], ["email", "Student email"], ["phone", "Phone"], ["level", "Level"], ["location", "Location"], ["emergencyContactPhone", "Emergency number"]];
const emptyRow = () => Object.fromEntries(columns.map(([key]) => [key, ""]));
export default function OrganisationEnrolmentPage() {
  const [organisation, setOrganisation] = useState({ name: "", contactName: "", email: "", phone: "" });
  const [rows, setRows] = useState([emptyRow(), emptyRow(), emptyRow()]);
  const [consent, setConsent] = useState(false), [website, setWebsite] = useState("");
  const [requestId, setRequestId] = useState(() => crypto.randomUUID());
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [reference, setReference] = useState("");
  const update = (index, key, value) => setRows(old => old.map((row, i) => i === index ? { ...row, [key]: value } : row));
  const paste = (event, rowIndex, columnIndex) => {
    const text = event.clipboardData.getData("text");
    if (!text.includes("\t") && !text.includes("\n")) return;
    event.preventDefault();
    const values = text.replace(/\r/g, "").trimEnd().split("\n").map(line => line.split("\t"));
    if (rowIndex + values.length > 50) { setError("Maximum 50 students per submission."); return; }
    setRows(old => {
      const next = old.map(row => ({ ...row }));
      values.forEach((cells, r) => {
        const index = rowIndex + r; next[index] ||= emptyRow();
        cells.forEach((value, c) => { const key = columns[columnIndex + c]?.[0]; if (key) next[index][key] = value.trim(); });
      });
      return next;
    });
  };
  const run = async action => { setBusy(true); setError(""); try { await action(); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  return <section className="org-enrol"><div className="org-intro"><Link to="/partnerships">Partnership &amp; Referral Programme</Link><h1>Register your students together</h1><p>Fill one row for each student. Falowen will review your submission and confirm your agreement before sending account setup invitations.</p></div>
    {reference ? <div role="status"><h2>Submission received</h2><p>Your reference is <strong>{reference}</strong>. Falowen will contact your organisation after review. Students do not have accounts yet.</p><button onClick={() => { setReference(""); setRows([emptyRow()]); setRequestId(crypto.randomUUID()); setConsent(false); }}>Add another group of students</button></div> : <form onSubmit={event => { event.preventDefault(); run(async () => {
      const students = rows.filter(row => Object.values(row).some(value => value.trim()));
      const data = await request("organisation-enrolments", { organisation, students, consent, website, requestId });
      setReference(data.reference);
    }); }}>
      <fieldset disabled={busy}><legend>Organisation contact</legend><div className="org-contact">{[["name", "Organisation name"], ["contactName", "Contact person"], ["email", "Contact email"], ["phone", "Contact phone"]].map(([key, label]) => <label key={key}>{label}<input required maxLength={254} type={key === "email" ? "email" : key === "phone" ? "tel" : "text"} value={organisation[key]} onChange={e => setOrganisation({ ...organisation, [key]: e.target.value })}/></label>)}</div>
      <label className="org-trap" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)}/></label>
      <h2>Student details</h2><p>Paste rows from Excel or Google Sheets into a cell, or type directly. Columns: name, email, phone, level, location, emergency number. Use A1, A2, B1, B2, C1 or C2. Maximum 50 students.</p>
      <div className="org-scroll"><table><thead><tr><th>#</th>{columns.map(([key, label]) => <th key={key}>{label}{["name", "email", "phone", "level"].includes(key) ? " *" : ""}</th>)}<th>Remove</th></tr></thead>
        <tbody>{rows.map((row, index) => <tr key={index}><th scope="row">{index + 1}</th>{columns.map(([key, label], c) => <td key={key}><input aria-label={`Student ${index + 1} ${label}`} maxLength={254} type={key === "email" ? "email" : key.toLowerCase().includes("phone") ? "tel" : "text"} value={row[key]} onChange={e => update(index, key, e.target.value)} onPaste={e => paste(e, index, c)}/></td>)}<td><button type="button" aria-label={`Remove student ${index + 1}`} disabled={rows.length === 1} onClick={() => setRows(rows.filter((_, i) => i !== index))}>×</button></td></tr>)}</tbody></table></div>
      <button type="button" disabled={rows.length >= 50} onClick={() => setRows([...rows, emptyRow()])}>+ Add student</button>
      <label className="org-consent"><input required type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}/>I have permission to submit these students’ details and understand that Falowen must approve their enrolment.</label>
      <p>Use an email each student can access. Never enter passwords. Submissions are private and cannot be viewed from this public page. You can return here to submit more students.</p>
      {error && <p role="alert">{error}</p>}<button type="submit">{busy ? "Submitting…" : "Submit for Falowen review"}</button></fieldset>
    </form>}
  </section>;
}
