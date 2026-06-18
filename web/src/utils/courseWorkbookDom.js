import { getWorkbookNativeTabKey } from "./courseWorkbookSubmission";

const HIDDEN_ATTRIBUTE = "data-falowen-hidden-native-tabs";
const PAGE_ATTRIBUTE = "data-falowen-workbook-page-display";

export const getWorkbookPageRoot = (hostRef) => hostRef?.current?.nextElementSibling || null;

const rememberDisplay = (element, attribute) => {
  if (!element || element.hasAttribute(attribute)) return;
  element.setAttribute(attribute, element.style.display || "");
};

const restoreDisplay = (element, attribute) => {
  if (!element || !element.hasAttribute(attribute)) return;
  element.style.display = element.getAttribute(attribute) || "";
  element.removeAttribute(attribute);
};

export const setWorkbookPageVisible = (pageRoot, visible) => {
  if (!pageRoot) return;
  if (visible) {
    restoreDisplay(pageRoot, PAGE_ATTRIBUTE);
    return;
  }
  rememberDisplay(pageRoot, PAGE_ATTRIBUTE);
  pageRoot.style.display = "none";
};

export const activateWorkbookNativeTab = (pageRoot, tabKey) => {
  if (!pageRoot || !tabKey) return false;
  const button = Array.from(pageRoot.querySelectorAll("button")).find(
    (candidate) => getWorkbookNativeTabKey(candidate.textContent) === tabKey
  );
  if (!button) return false;
  button.click();
  return true;
};

export const hideWorkbookNativeTabs = (pageRoot) => {
  if (!pageRoot) return;
  const buttons = Array.from(pageRoot.querySelectorAll("button")).filter((button) =>
    getWorkbookNativeTabKey(button.textContent)
  );
  const counts = new Map();
  buttons.forEach((button) => {
    const parent = button.parentElement;
    if (parent) counts.set(parent, (counts.get(parent) || 0) + 1);
  });
  const row = [...counts.entries()].sort((a, b) => b[1] - a[1]).find(([, count]) => count >= 3)?.[0];
  if (row) {
    rememberDisplay(row, HIDDEN_ATTRIBUTE);
    row.style.display = "none";
  }
};

export const restoreWorkbookDom = (pageRoot) => {
  if (!pageRoot) return;
  setWorkbookPageVisible(pageRoot, true);
  Array.from(pageRoot.querySelectorAll(`[${HIDDEN_ATTRIBUTE}]`)).forEach((element) =>
    restoreDisplay(element, HIDDEN_ATTRIBUTE)
  );
};
