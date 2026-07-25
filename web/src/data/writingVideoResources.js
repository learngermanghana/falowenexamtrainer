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
    3: {
      key: "b1-day3-erfolgsgeschichten-writing-video",
      title: "B1 Day 3 · Erfolgsgeschichten · Schreiben explanation",
      description:
        "Watch this Schreiben video inside Teil 2 before drafting the email to Frau Wolmer. It explains how to apologise politely, give a reason and use an appropriate greeting and closing.",
      url: "https://youtu.be/8uAMihJTzvo",
    },
    4: {
      key: "b1-day4-wohnung-suchen-writing-video",
      title: "B1 Day 4 · Wohnung suchen · Schreiben explanation",
      description:
        "Watch this Schreiben video inside Teil 2 before starting the apartment-search writing task. Use it to understand the prompt, organise the message and cover every required point.",
      url: "https://youtu.be/mHQiEdVVRSQ",
    },
    5: {
      key: "b1-day5-besichtigungstermin-writing-video",
      title: "B1 Day 5 · Der Besichtigungstermin · Schreiben explanation",
      description:
        "Watch this Schreiben video inside Teil 2 before drafting the polite email to the landlord. It explains how to show interest, request or suggest a viewing appointment, ask for confirmation and include contact details.",
      url: "https://youtu.be/n1whPCP2KzA",
    },
    6: {
      key: "b1-day6-stadt-oder-land-writing-video",
      title: "B1 Day 6 · Stadt oder Land · Schreiben explanation",
      description:
        "Watch this Schreiben video inside Teil 2 before writing your opinion about city and country life. Use it to compare both places, react to the given opinion and justify your own decision clearly.",
      url: "https://youtu.be/bklCB9MdTcA?si=qGzQjqY9xuypNTJD",
    },
    7: {
      key: "b1-day7-fast-food-hausmannskost-writing-video",
      title: "B1 Day 7 · Fast Food vs. Hausmannskost · Schreiben explanation",
      description:
        "Watch this Schreiben video inside Teil 2 before writing your opinion about Fertiggerichte and healthy eating. Use it to react to the given opinion, explain advantages and disadvantages and give your own practical solution.",
      url: "https://youtu.be/oGOn3zKpNjo",
    },
    8: {
      key: "b1-day8-gesundheit-writing-video",
      chapter: "3.8",
      title: "B1 Day 8 · Gesundheit · Schreiben explanation",
      description:
        "Watch this Schreiben video inside Teil 2 before drafting the B1 Day 8 writing task. Use it to understand the Gesundheit prompt, organise the response and cover every required point clearly.",
      url: "https://youtu.be/kGQWOEfhP-k",
    },
    20: {
      key: "b1-day20-beruf-qualifikationen-writing-video",
      title: "B1 Day 20 · Ausbildung und Qualifikationen · Schreiben explanation",
      description:
        "Watch this Schreiben video inside Teil 2 before responding to Felix. It explains how to compare Ausbildung and practical experience, justify your opinion and include a relevant example.",
      url: "https://youtu.be/og1iVBKnIb0",
    },
    21: {
      key: "b1-day21-lebensformen-heute-writing-video",
      title: "B1 Day 21 · Lebensformen heute · Schreiben explanation",
      description:
        "Watch this Schreiben video inside Teil 2 before responding to Mara's opinion. It explains how to compare family life, shared accommodation and single life, present advantages and disadvantages, and justify your own view.",
      url: "https://youtu.be/1JYyJfnumig",
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
    2: {
      key: "b2-day2-beziehungen-kommunikation-writing-video",
      chapter: "1.2",
      title: "B2 Day 2 · Beziehungen und Kommunikation · Schreiben explanation",
      description:
        "Watch this Schreiben video on the Write page before drafting the B2 Day 2 text. It explains how to understand the Chapter 1.2 task, organise the response and cover every required point.",
      url: "https://youtu.be/eozUFkeHBYc",
    },
    3: {
      key: "b2-day3-oeffentliches-privates-leben-writing-video",
      title: "B2 Day 3 · Öffentliches und privates Leben · Schreiben explanation",
      description:
        "Watch this Schreiben video on the Write page before drafting your B2 text. It explains how to understand the task, structure the response and address every required point.",
      url: "https://youtu.be/qCO2p1Ahy7U",
    },
    4: {
      key: "b2-day4-bildung-lernen-writing-video",
      chapter: "1.4",
      title: "B2 Day 4 · Bildung und Lernen · Schreiben explanation",
      description:
        "Watch this Schreiben video on the Write page before drafting the B2 Day 4 text. Use it to understand the Chapter 1.4 task, organise the response and cover every required point.",
      url: "https://youtu.be/ltTxYa_T2xc",
    },
    5: {
      key: "b2-day5-bildung-lernen-writing-video",
      chapter: "1.5",
      title: "B2 Day 5 · Bildung und Lernen · Schreiben explanation",
      description:
        "Watch this Schreiben video on the Write page before drafting the B2 Day 5 opinion text. Use it to compare learning formats, explain why Weiterbildung matters and cover all required points clearly.",
      url: "https://youtu.be/-6_zmU9ibJI?si=Mvlld1_jVP7nU1nL",
    },
    6: {
      key: "b2-day6-migration-integration-writing-video",
      chapter: "2.1",
      title: "B2 Day 6 · Migration und Integration · Schreiben explanation",
      description:
        "Watch this Schreiben video on the Write page before drafting the B2 Day 6 opinion text. Use it to organise the integration argument, explain difficulties, propose measures and describe their benefits clearly.",
      url: "https://youtu.be/19WaMcKL8v4",
    },
    7: {
      key: "b2-day7-gesellschaftliche-vielfalt-writing-video",
      chapter: "2.2",
      title: "B2 Day 7 · Gesellschaftliche Vielfalt · Schreiben explanation",
      description:
        "Watch this Schreiben video on the Write page before drafting the B2 Day 7 text. Use it to understand the Chapter 2.2 task, organise the response and cover every required point clearly.",
      url: "https://youtu.be/pzvyE35CZbI",
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
    10: {
      key: "c1-day10-integration-gesellschaft-writing-video",
      title: "C1 Day 10 · Integration und Gesellschaft · Schreiben explanation",
      description:
        "Watch this Schreiben video on the writing page before drafting your C1 response. It explains how to analyse the task, build a differentiated argument and cover every required point.",
      url: "https://youtu.be/I5OU_ZXz4c0",
    },
    11: {
      key: "c1-day11-engagement-ehrenamt-writing-video",
      title: "C1 Day 11 · Engagement und Ehrenamt · Schreiben explanation",
      description:
        "Watch this Schreiben video on the Write page before drafting the C1 discussion post. It explains how to structure the argument, address the counterpoint about state responsibility and develop concrete support measures.",
      url: "https://youtu.be/Ww6gq3lmmpk",
    },
    12: {
      key: "c1-day12-freizeit-kultur-writing-video",
      chapter: "3.2",
      title: "C1 Day 12 · Freizeit und Kultur · Schreiben explanation",
      description:
        "Watch this Schreiben video on the Write page before drafting the C1 argumentative text. Use it to structure the discussion of cultural participation, benefits, challenges, funding models and your final position.",
      url: "https://youtu.be/0lWMEqPU6x4",
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