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

export const updatePageMeta = ({ title, description, lang } = {}) => {
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

  const canonicalHref = typeof window !== "undefined" ? window.location.href : null;
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

  const defaultOgImage = "https://www.falowen.app/falo.png";
  const ogImageTag = ensureMetaTag("property", "og:image");
  if (ogImageTag) ogImageTag.setAttribute("content", defaultOgImage);

  if (lang) {
    document.documentElement.lang = lang;
  }
};
