import React, { useEffect, useMemo, useState } from "react";
import { fetchClassDirectoryMembers } from "../services/studentDirectory";
import { styles } from "../styles";
import { PillBadge, PrimaryActionBar, SectionHeader } from "./ui";

const MAX_PREVIEW_MEMBERS = 4;

const getInitials = (name = "Student") =>
  String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "S";

const firstName = (name = "Student") => String(name).trim().split(/\s+/)[0] || "Student";

const HomeClassMembersCard = ({ studentProfile, onViewMembers, onOpenDiscussion }) => {
  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState("loading");
  const className = String(studentProfile?.className || "").trim();
  const level = String(studentProfile?.level || "").trim().toUpperCase();

  useEffect(() => {
    let mounted = true;
    if (!level || !className) {
      setMembers([]);
      setStatus("empty");
      return undefined;
    }

    setStatus("loading");
    fetchClassDirectoryMembers({ level, className })
      .then((items) => {
        if (!mounted) return;
        setMembers(items);
        setStatus("success");
      })
      .catch((error) => {
        console.error("Failed to load home class preview", error);
        if (!mounted) return;
        setMembers([]);
        setStatus("error");
      });

    return () => {
      mounted = false;
    };
  }, [className, level]);

  const previewMembers = useMemo(
    () => members.slice(0, MAX_PREVIEW_MEMBERS),
    [members],
  );
  const remainingCount = Math.max(0, members.length - previewMembers.length);
  const previewNames = previewMembers.map((member) => firstName(member.name)).join(", ");

  if (!level || !className) return null;

  return (
    <section
      aria-label="Your class"
      style={{
        ...styles.card,
        display: "grid",
        gap: 14,
        border: "1px solid #c7d2fe",
        background: "linear-gradient(135deg, #eef2ff, #ffffff 72%)",
      }}
    >
      <SectionHeader
        eyebrow="Your class"
        title={className}
        subtitle="See who is learning with you and continue the conversation inside Falowen."
        actions={<PillBadge tone="info">{level}</PillBadge>}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div aria-label="Class member preview" style={{ display: "flex", alignItems: "center", paddingLeft: 8 }}>
          {previewMembers.map((member, index) => (
            <div
              key={member.id}
              title={member.name}
              aria-label={member.name}
              style={{
                width: 42,
                height: 42,
                marginLeft: index === 0 ? 0 : -8,
                borderRadius: "50%",
                border: "3px solid #ffffff",
                background: member.photoURL
                  ? `url(${member.photoURL}) center/cover no-repeat`
                  : "linear-gradient(135deg, #4338ca, #2563eb)",
                color: "#ffffff",
                display: "grid",
                placeItems: "center",
                fontSize: 12,
                fontWeight: 900,
                boxShadow: "0 6px 16px rgba(30, 64, 175, 0.18)",
              }}
            >
              {member.photoURL ? null : getInitials(member.name)}
            </div>
          ))}
          {remainingCount > 0 ? (
            <div
              aria-label={`${remainingCount} more class members`}
              style={{
                minWidth: 42,
                height: 42,
                marginLeft: -8,
                padding: "0 8px",
                borderRadius: 999,
                border: "3px solid #ffffff",
                background: "#e0e7ff",
                color: "#3730a3",
                display: "grid",
                placeItems: "center",
                fontSize: 12,
                fontWeight: 900,
              }}
            >
              +{remainingCount}
            </div>
          ) : null}
        </div>

        <div style={{ display: "grid", gap: 3, minWidth: 180 }}>
          <strong>
            {status === "loading"
              ? "Loading classmates…"
              : `${members.length} class member${members.length === 1 ? "" : "s"}`}
          </strong>
          <span style={{ ...styles.helperText, margin: 0 }}>
            {status === "error"
              ? "Class members could not be loaded right now."
              : previewNames || "Class profiles will appear here once members are enrolled."}
          </span>
        </div>
      </div>

      <PrimaryActionBar align="start" wrap>
        <button type="button" style={styles.primaryButton} onClick={onViewMembers}>
          View classmates
        </button>
        <button type="button" style={styles.secondaryButton} onClick={onOpenDiscussion}>
          Open class discussion
        </button>
      </PrimaryActionBar>
    </section>
  );
};

export default HomeClassMembersCard;
