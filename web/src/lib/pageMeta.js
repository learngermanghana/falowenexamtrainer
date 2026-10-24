const ensureMetaTag = (attribute, value) => {
  if (typeof document === "undefined") return null;
  let tag = document.querySelector(`meta[${attribute}="${value}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, value);
    document.head.appendChild(tag);
  }
  return tag;
};

const ensureJsonLdTag = (id) => {
  if (typeof document === "undefined") return null;
  let tag = document.querySelector(`script[data-schema-id="${id}"]`);
  if (!tag) {
    tag = document.createElement("script");
    tag.setAttribute("type", "application/ld+json");
    tag.setAttribute("data-schema-id", id);
    document.head.appendChild(tag);
  }
  return tag;
};

export const updatePageMeta = ({
  title,
  description,
  lang,
  canonicalPath,
  imageUrl,
  ogType = "website",
  twitterCard = "summary_large_image",
  structuredData,
} = {}) => {
  if (typeof document === "undefined") return;

  if (title) {
    document.title = title;
    const ogTitleTag = ensureMetaTag("property", "og:title");
    if (ogTitleTag) ogTitleTag.setAttribute("content", title);
  }

  if (description) {
    const descriptionTag = ensureMetaTag("name", "description");
    if (descriptionTag) descriptionTag.setAttribute("content", description);
    const ogDescriptionTag = ensureMetaTag("property", "og:description");
    if (ogDescriptionTag) ogDescriptionTag.setAttribute("content", description);
  }

  const canonicalHref = typeof window !== "undefined"
    ? `${window.location.origin}${canonicalPath || window.location.pathname}`
    : null;
  if (canonicalHref) {
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", canonicalHref);

    const ogUrlTag = ensureMetaTag("property", "og:url");
    if (ogUrlTag) ogUrlTag.setAttribute("content", canonicalHref);
  }

  const defaultOgImage = imageUrl || "https://www.falowen.app/falo.png";
  const ogTypeTag = ensureMetaTag("property", "og:type");
  if (ogTypeTag) ogTypeTag.setAttribute("content", ogType);
  const ogImageTag = ensureMetaTag("property", "og:image");
  if (ogImageTag) ogImageTag.setAttribute("content", defaultOgImage);
  const twitterCardTag = ensureMetaTag("name", "twitter:card");
  if (twitterCardTag) twitterCardTag.setAttribute("content", twitterCard);
  const twitterTitleTag = ensureMetaTag("name", "twitter:title");
  if (twitterTitleTag && title) twitterTitleTag.setAttribute("content", title);
  const twitterDescriptionTag = ensureMetaTag("name", "twitter:description");
  if (twitterDescriptionTag && description) twitterDescriptionTag.setAttribute("content", description);
  const twitterImageTag = ensureMetaTag("name", "twitter:image");
  if (twitterImageTag) twitterImageTag.setAttribute("content", defaultOgImage);

  if (structuredData) {
    const items = Array.isArray(structuredData) ? structuredData : [structuredData];
    items.forEach((item, index) => {
      if (!item) return;
      const scriptTag = ensureJsonLdTag(item.id || `page-schema-${index + 1}`);
      if (!scriptTag) return;
      scriptTag.text = JSON.stringify(item.schema || item);
    });
  }

  if (lang) {
    document.documentElement.lang = lang;
  }
};
