import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, db, getDocs, isFirebaseConfigured, query, where } from "../firebase";
import { styles } from "../styles";
import { PrimaryActionBar, SectionHeader } from "./ui";

const getInitials = (name = "Student") =>
  String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "S";

const normaliseMember = (snapshot) => {
  const data = snapshot.data() || {};
  return {
    id: snapshot.id,
    name: data.name || data.displayName || "Student",
    biography: data.biography || "",
  };
};

const avatarStyle = (index) => ({
  width: 42,
  height: 42,
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  marginLeft: index === 0 ? 0 : -10,
  border: "3px solid #fff",
  background: index % 2 === 0 ? "#dbeafe" : "#ede9fe",
  color: index % 2 === 0 ? "#1d4ed8" : "#6d28d9",
  fontWeight: 900,
  boxShadow: "0 6px 16px rgba(15, 23, 42, 0.12)",
});

const HomeClassPreviewCard = ({ studentProfile }) => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const className = studentProfile?.className || "";
  const level = String(studentProfile?.level || "").toUpperCase();
  const isSelfLearning = ["B2", "C1"].includes(level);
  const shouldShow = Boolean(className && level && !isSelfLearning);

  const loadMembers = useCallback(async () => {
    if (!shouldShow) return;
    if (!isFirebaseConfigured || !db) {
      setStatus("error");
      setError("Class members are temporarily unavailable.");
      return;
    }

    setStatus("loading");
    setError("");
    try {
      const result = await getDocs(
        query(
          collection(db, "students"),
          where("level", "==", studentProfile.level),
          where("className", "==", className),
        ),
      );
      const nextMembers = result.docs.map(normaliseMember).sort((a, b) => a.name.localeCompare(b.name));
      setMembers(nextMembers);
      setStatus("success");
    } catch (loadError) {
      console.error("Failed to load home class preview", loadError);
      setMembers([]);
      setStatus("error");
      setError("Could not load your class right now.");
    }
  }, [className, shouldShow, studentProfile?.level]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const previewMembers = useMemo(() => members.slice(0, 4), [members]);
  const remainingCount = Math.max(members.length - previewMembers.length, 0);

  if (!shouldShow) return null;

  return (
    <section
      aria-label="Your class"
      style={{
        ...styles.card,
        display: "grid",
        gap: 12,
        border: "1px solid #c7d2fe",
        background: "linear-gradient(135deg, #ffffff, #eef2ff)",
      }}
    >
      <SectionHeader
        eyebrow="Your class"
        title={className}
        subtitle="Meet the classmates learning with you. Class communication now stays inside Falowen."
        actions={
          <span style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3", borderColor: "#c7d2fe" }}>
            {status === "success" ? `${members.length} member${members.length === 1 ? "" : "s"}` : level}
          </span>
        }
      />

      {status === "loading" ? <p style={{ ...styles.helperText, margin: 0 }}>Loading your classmates…</p> : null}
      {status === "error" ? <p style={{ ...styles.helperText, margin: 0, color: "#b91c1c" }}>{error}</p> : null}

      {status === "success" ? (
        <div style={{ display: "flex", alignItems: "center", minHeight: 46 }} aria-label={`${members.length} class members`}>
          {previewMembers.map((member, index) => (
            <div key={member.id} style={avatarStyle(index)} title={member.name} aria-label={member.name}>
              {getInitials(member.name)}
            </div>
          ))}
          {remainingCount > 0 ? (
            <div style={{ ...avatarStyle(previewMembers.length), background: "#e2e8f0", color: "#334155" }}>
              +{remainingCount}
            </div>
          ) : null}
          {members.length === 0 ? (
            <p style={{ ...styles.helperText, margin: 0 }}>Your classmates will appear here when their profiles are ready.</p>
          ) : null}
        </div>
      ) : null}

      <PrimaryActionBar align="start" wrap>
        <button type="button" style={styles.primaryButton} onClick={() => navigate("/campus/discussion")}>
          View classmates
        </button>
        <button type="button" style={styles.secondaryButton} onClick={() => navigate("/campus/discussion")}>
          Open class discussion
        </button>
      </PrimaryActionBar>
    </section>
  );
};

export default HomeClassPreviewCard;
