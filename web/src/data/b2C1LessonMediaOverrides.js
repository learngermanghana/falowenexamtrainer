export const B2_C1_LESSON_VIDEO_OVERRIDES = Object.freeze({
  B2: Object.freeze({}),
  C1: Object.freeze({
    16: Object.freeze({
      videoResources: Object.freeze([
        Object.freeze({
          key: "c1-day16-technologie-alltag-ai-video",
          chapter: "4.1",
          title: "C1 Day 16 · Technologie im Alltag · AI video",
          description:
            "AI video lesson for evaluating digital tools, permanent availability, digital overload and self-determined technology use at C1 level.",
          url: "https://youtu.be/H4mPDTiMkwg",
        }),
      ]),
    }),
    17: Object.freeze({
      videoResources: Object.freeze([
        Object.freeze({
          key: "c1-day17-umwelt-verantwortung-ai-video",
          chapter: "4.2",
          title: "C1 Day 17 · Umwelt und Verantwortung · AI video",
          description:
            "AI video lesson for discussing sustainability, climate responsibility and personal action in a differentiated way at C1 level.",
          url: "https://youtu.be/g-HaC_4ogaQ",
        }),
      ]),
    }),
    18: Object.freeze({
      videoResources: Object.freeze([
        Object.freeze({
          key: "c1-day18-gesellschaft-zusammenhalt-ai-video",
          chapter: "4.3",
          title: "C1 Day 18 · Gesellschaft und Zusammenhalt · AI video",
          description:
            "AI video lesson for analysing community, conflict, solidarity and social cohesion at C1 level.",
          url: "https://youtu.be/ULtTH3LmWBo",
        }),
      ]),
    }),
    10: Object.freeze({
      videoResources: Object.freeze([
        Object.freeze({
          key: "c1-day10-integration-gesellschaft-ai-video",
          chapter: "2.5",
          title: "C1 Day 10 · Integration und Gesellschaft · AI video",
          description:
            "AI video lesson for discussing integration, participation and social cohesion in a differentiated way.",
          url: "https://youtu.be/S_c9eIH-rzY",
        }),
      ]),
    }),
    11: Object.freeze({
      videoResources: Object.freeze([
        Object.freeze({
          key: "c1-day11-engagement-ehrenamt-ai-video",
          chapter: "3.1",
          title: "C1 Day 11 · Engagement und Ehrenamt · AI video",
          description:
            "AI video lesson for discussing social engagement and voluntary work at C1 level.",
          url: "https://youtu.be/F67RRmGNK1c",
        }),
      ]),
    }),
    12: Object.freeze({
      videoResources: Object.freeze([
        Object.freeze({
          key: "c1-day12-freizeit-kultur-ai-video",
          chapter: "3.2",
          title: "C1 Day 12 · Freizeit und Kultur · AI video",
          description:
            "AI video lesson for evaluating cultural participation, quality of life, access and public cultural funding at C1 level.",
          url: "https://youtu.be/LpsmADd4U30",
        }),
      ]),
    }),
    14: Object.freeze({
      videoResources: Object.freeze([
        Object.freeze({
          key: "c1-day14-innovation-zukunft-ai-video",
          chapter: "3.4",
          title: "C1 Day 14 · Innovation und Zukunft · AI video",
          description:
            "AI video lesson for evaluating technological change, future scenarios, opportunities and risks at C1 level.",
          url: "https://youtu.be/GEQNr4JedlM",
        }),
      ]),
    }),
  }),
});

export const B2_C1_LESSON_RADIO_OVERRIDES = Object.freeze({
  B2: Object.freeze({}),
  C1: Object.freeze({
    11: Object.freeze({
      key: "c1-day11-engagement-ehrenamt-falowen-radio",
      title: "Engagement und Ehrenamt 3.1",
      youtubeId: "orR1ptbJtnc",
      duration: "",
      instruction:
        "Höre aufmerksam zu und stimme dich auf das Thema Engagement und Ehrenamt ein. Danach gehst du weiter zum Lernteil.",
    }),
    12: Object.freeze({
      key: "c1-day12-freizeit-kultur-falowen-radio",
      title: "Freizeit und Kultur 3.2",
      youtubeId: "54qgZXZ8bdM",
      duration: "",
      instruction:
        "Höre aufmerksam zu und stimme dich auf Freizeit, Kultur, Teilhabe und Lebensqualität ein. Danach gehst du weiter zum Lernteil.",
    }),
  }),
});

const mergeVideoResources = (current = [], incoming = []) => {
  const incomingKeys = new Set(incoming.map((resource) => resource?.key).filter(Boolean));
  const incomingUrls = new Set(incoming.map((resource) => resource?.url).filter(Boolean));

  return [
    ...current.filter(
      (resource) =>
        !incomingKeys.has(resource?.key) && !incomingUrls.has(resource?.url),
    ),
    ...incoming,
  ];
};

export const applyB2C1LessonVideoOverrides = (dictionary = {}) => {
  Object.entries(B2_C1_LESSON_VIDEO_OVERRIDES).forEach(
    ([level, dayOverrides]) => {
      if (!dictionary[level]) dictionary[level] = {};

      Object.entries(dayOverrides).forEach(([day, override]) => {
        const current = dictionary[level][day] || {};
        const currentResources = Array.isArray(current.videoResources)
          ? current.videoResources
          : [];
        const overrideResources = Array.isArray(override.videoResources)
          ? override.videoResources
          : [];

        dictionary[level][day] = {
          ...current,
          ...override,
          videoResources: mergeVideoResources(
            currentResources,
            overrideResources,
          ),
        };
      });
    },
  );

  return dictionary;
};

export const getB2C1RadioResource = (level = "", day = 0) => {
  const normalizedLevel = String(level || "")
    .trim()
    .toUpperCase();
  return B2_C1_LESSON_RADIO_OVERRIDES[normalizedLevel]?.[Number(day)] || null;
};
