import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { isLikelyPhoneNumber, normalizePhone } from "../lib/signupDataQuality";
import { styles } from "../styles";

export default function LearnerContactDetails({ reminder = false }) {
  const { studentProfile, saveStudentProfile } = useAuth();
  const [open, setOpen] = useState(!reminder);
  const [dismissed, setDismissed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [values, setValues] = useState(() => ({
    phone: studentProfile?.phone || "",
    address: studentProfile?.address || "",
    location: studentProfile?.location || "",
    emergencyContactName: studentProfile?.emergencyContactName || "",
    emergencyContactRelationship: studentProfile?.emergencyContactRelationship || "",
    emergencyContactPhone: studentProfile?.emergencyContactPhone || "",
  }));
  if (reminder && (dismissed || studentProfile?.emergencyContactPhone)) return null;
  const save = async (event) => {
    event.preventDefault();
    const next = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()]));
    next.phone = normalizePhone(next.phone);
    next.emergencyContactPhone = normalizePhone(next.emergencyContactPhone);
    if ((next.phone && !isLikelyPhoneNumber(next.phone)) || (next.emergencyContactPhone && !isLikelyPhoneNumber(next.emergencyContactPhone))) {
      setMessage("Enter valid phone numbers with 7–15 digits, including the country code where needed.");
      return;
    }
    if (next.emergencyContactPhone && !next.emergencyContactName) {
      setMessage("Please add the emergency contact’s name.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await saveStudentProfile(next);
      setMessage("Contact details saved.");
      if (reminder) setDismissed(true);
    } catch {
      setMessage("Could not save your details. Please try again.");
    } finally { setSaving(false); }
  };
  return <section style={{ ...styles.card, margin: 0, display: "grid", gap: 12 }} aria-label="Contact and emergency details">
    <h2 style={{ margin: 0, fontSize: 20 }}>Complete your contact details</h2>
    <p style={{ margin: 0 }}>Add someone we can contact in an urgent safety situation. Please let them know you’re listing them. You can update these details anytime in Account settings.</p>
    {reminder && <p style={{ margin: 0 }}>Please complete this before attending an in-person class. You can start your trial lessons now.</p>}
    {!open ? <button type="button" style={styles.secondaryButton} onClick={() => setOpen(true)}>Add contact details</button> :
      <form onSubmit={save} style={{ display: "grid", gap: 12 }}>
        {[
          ["phone", "Your phone number", "tel"],
          ["address", "Address", "text"],
          ["location", "City / region", "text"],
          ["emergencyContactName", "Emergency contact name", "text"],
          ["emergencyContactRelationship", "Relationship (for example, parent or friend)", "text"],
          ["emergencyContactPhone", "Emergency contact phone", "tel"],
        ].map(([key, label, type]) => <label key={key} style={{ display: "grid", gap: 5 }}>{label}
          <input type={type} value={values[key]} disabled={saving} onChange={(event) => setValues({ ...values, [key]: event.target.value })} style={{ ...styles.input, fontSize: 16 }} />
        </label>)}
        <button type="submit" style={styles.primaryButton} disabled={saving}>{saving ? "Saving…" : "Save contact details"}</button>
      </form>}
    {message && <p role="status" style={{ margin: 0 }}>{message}</p>}
    {reminder && <button type="button" style={styles.secondaryButton} disabled={saving} onClick={() => setDismissed(true)}>Add later</button>}
  </section>;
}
