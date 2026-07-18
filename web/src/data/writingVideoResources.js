const normalizeLevel = (level = "") => String(level || "").trim().toUpperCase();

const WRITING_VIDEO_RESOURCES = {
  B1: {
    1: {
      key: "b1-day1-traumwelt-writing-video",
      title: "B1 Day 1 · Traumwelt · Writing explanation",
      description:
        "Watch this video before writing. It explains how to understand the task, organise your text and cover every required point.",
      url: "https://youtu.be/nG1PUrvrS_s",
    },
    2: {
      key: "b1-day2-freunde-fuers-leben-writing-video",
      title: "B1 Day 2 · Freunde fürs Leben · Schreiben explanation",
      description:
        "Watch this Schreiben video inside Teil 2 before drafting the email about a lifelong friend. It is a writing-support resource, not an AI video or Falowen Radio.",
      url: "https://youtu.be/94IXPx5dTNY",
    },
  },
  B2: {
    1: {
      key: "b2-day1-persoenliche-identitaet-writing-video",
      title: "B2 Day 1 · Persönliche Identität · Writing explanation",
      description:
        "Watch this video before writing. It explains the task, the recommended structure and how to develop a clear B2 opinion text.",
      url: "https://youtu.be/w8TaNHk-a0U",
    },
    12: {
      key: "b2-day12-kultur-freizeit-letter-writing-video",
      format: "letter",
      title: "B2 Day 12 · Kultur und Freizeit · Brief schreiben",
      description:
        "Watch this Schreiben lesson before starting the task. It teaches you how to understand the letter prompt, organise the opening, cover every required point, connect your ideas and finish with an appropriate closing.",
      badge: "Watch before writing · Letter guide",
      heading: "Learn how to write this B2 letter",
      url: "https://youtu.be/3xWokVVz8cs",
    },
  },
  C1: {
    8: {
      key: "c1-day8-wohnen-stadtentwicklung-writing-video",
      title: "C1 Day 8 · Wohnen und Stadtentwicklung · Writing explanation",
      description:
        "Watch this video before writing. It explains how to analyse the task, structure a differentiated C1 response and address all content points.",
      url: "https://youtu.be/VdczhJS9ClY",
    },
    9: {
      key: "c1-day9-chapter-2-4-writing-video",
      title: "C1 Day 9 · Chapter 2.4 · Writing explanation",
      description:
        "Watch this video before writing. It explains how to analyse the task, organise a differentiated C1 response and address all required content points.",
      url: "https://youtu.be/tpj8TV8DaH8",
    },
  },
};

export const getWritingVideoResource = (level, day) => {
  const normalizedLevel = normalizeLevel(level);
  const normalizedDay = Number(day);

  return WRITING_VIDEO_RESOURCES[normalizedLevel]?.[normalizedDay] || null;
};

export const getYouTubeEmbedUrl = (url = "") => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    let videoId = "";

    if (host === "youtu.be") {
      [videoId = ""] = pathParts;
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      videoId = parsed.searchParams.get("v") || "";
      if (!videoId && ["embed", "shorts", "live"].includes(pathParts[0])) {
        videoId = pathParts[1] || "";
      }
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  } catch {
    return "";
  }
};

export { WRITING_VIDEO_RESOURCES };
