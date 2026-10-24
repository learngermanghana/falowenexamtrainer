export const A1_DAY20_CHAPTER123_GRAMMAR_ROUTE =
  "/campus/course/letter-writing-intro-12-3";

export const A1_DAY20_CHAPTER123_WORKBOOK_ROUTE =
  "/campus/course/letter-writing-intro-german-a1-day-12-3";

export const A1_DAY20_CHAPTER123_LESSON_ROUTE =
  "/campus/course/lesson/A1/20?chapter=12.3";

export const A1_DAY20_CHAPTER123_RESOURCE_HUB_ROUTE =
  "/campus/course/lesson/A1/20?chapter=12.3&hub=1";

export const shouldOpenA1Day20Workbook = (search = "") => {
  try {
    const params = new URLSearchParams(String(search || ""));

    // Shared workbook tabs use `workbookTab` for the visible panel and mirror
    // it to `view` (for example, `view=grammar`). Those internal tab URLs must
    // retain ownership of the dedicated workbook route.
    return params.get("view") === "workbook" || Boolean(params.get("workbookTab"));
  } catch (_error) {
    return false;
  }
};
