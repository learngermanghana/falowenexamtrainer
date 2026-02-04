import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, db, getDocs, isFirebaseConfigured, query, where } from "../firebase";
import { styles } from "../styles";

const ClassMembersTab = () => {
  const { studentProfile } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMembers = async () => {
      if (!isFirebaseConfigured || !db) {
        setError("Firebase is not configured. Please add your credentials.");
        setLoading(false);
        return;
      }

      if (!studentProfile?.level || !studentProfile?.className) {
        setError("Add your level and class in the account page to view classmates.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const studentsRef = collection(db, "students");
        const q = query(
          studentsRef,
          where("level", "==", studentProfile.level),
          where("className", "==", studentProfile.className)
        );
        const snapshot = await getDocs(q);
        const nextMembers = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            name: data.name || data.email || "Student",
            email: data.email || "",
            biography: data.biography || "",
            level: data.level || "",
            className: data.className || "",
          };
        });

        nextMembers.sort((a, b) => a.name.localeCompare(b.name));

        setMembers(nextMembers);
      } catch (err) {
        console.error("Failed to load class members", err);
        setError("Could not load class members. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [studentProfile?.className, studentProfile?.level]);

  if (loading) {
    return (
      <div style={styles.card}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Loading class members ...</div>
        <p style={{ ...styles.helperText, margin: 0 }}>Pulling profiles for your group.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...styles.card, borderColor: "#fca5a5", background: "#fef2f2" }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Cannot show members</div>
        <p style={{ ...styles.helperText, margin: 0 }}>{error}</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div style={styles.card}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>No classmates found</div>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Save your biography in the account page. Once everyone adds theirs, you will see them here.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {members.map((member) => (
        <div key={member.id} style={{ ...styles.card, margin: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{ display: "grid", gap: 4 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{member.name}</div>
              <div style={{ fontSize: 13, color: "#4b5563" }}>{member.email}</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={styles.badge}>Level: {member.level || "–"}</span>
              <span style={styles.badge}>Class: {member.className || "–"}</span>
            </div>
          </div>
          <p style={{ ...styles.helperText, margin: "10px 0 0", whiteSpace: "pre-wrap" }}>
            {member.biography || "No biography yet."}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ClassMembersTab;
