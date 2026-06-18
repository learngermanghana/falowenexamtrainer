import { useEffect, useState } from "react";

const useLegacySubmissionVisibility = (hostRef) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const root = hostRef?.current;
    if (!root || typeof MutationObserver === "undefined") return undefined;
    const sync = () => {
      const legacyForm = root.querySelector(".course-book-tab-submission-page");
      if (legacyForm) legacyForm.style.display = "none";
      setVisible(Boolean(legacyForm));
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [hostRef]);

  return visible;
};

export default useLegacySubmissionVisibility;
