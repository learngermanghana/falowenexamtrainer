import { addDoc, collection, db, doc, isFirebaseConfigured, serverTimestamp, setDoc } from "../firebase";

let latestLead = null;

const normalizeValue = (value) => (value || "").trim().toLowerCase();

const buildLeadKey = (payload) => {
  const payloadEmail = normalizeValue(payload.email);
  if (payloadEmail) return `email:${encodeURIComponent(payloadEmail)}`;
  const payloadPhone = normalizeValue(payload.phone);
  if (payloadPhone) return `phone:${encodeURIComponent(payloadPhone)}`;
  return null;
};

export const getLatestLead = () => {
  return latestLead;
};

const persistLeadToFirestore = async (entry) => {
  if (!isFirebaseConfigured || !db) return null;
  const leadKey = buildLeadKey(entry);
  const payload = {
    ...entry,
    updatedAt: serverTimestamp(),
  };
  if (!leadKey) {
    return addDoc(collection(db, "leadCaptures"), {
      ...payload,
      createdAt: serverTimestamp(),
    });
  }
  return setDoc(doc(collection(db, "leadCaptures"), leadKey), payload, { merge: true });
};

export const captureLead = (payload) => {
  if (!payload) return null;
  const capturedAt = Date.now();
  const entry = { ...payload, capturedAt };
  latestLead = entry;
  persistLeadToFirestore(entry);

  if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: "lead_capture", ...entry });
  }

  return entry;
};
