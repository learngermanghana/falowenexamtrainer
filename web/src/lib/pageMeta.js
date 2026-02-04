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

  if (lang) {
    document.documentElement.lang = lang;
  }
};
