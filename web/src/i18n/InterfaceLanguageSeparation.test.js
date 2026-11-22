import i18n, { changeInterfaceLanguage, readAccountInterfaceLanguage, restoreAccountInterfaceLanguage } from "./index";
import { enrolledCourses } from "../utils/courseEnrollment";

describe("app language is independent of course enrollment", () => {
  afterEach(async () => {
    await changeInterfaceLanguage("en");
    window.localStorage.removeItem("falowen:course:test-student");
  });

  test("English, German, French and Kiswahili have resource bundles", () => {
    for (const language of ["en", "de", "fr", "sw"]) {
      expect(i18n.hasResourceBundle(language, "translation")).toBe(true);
      expect(i18n.getResource(language, "translation", "uiLanguageFlow.steps")).toHaveLength(3);
    }
  });

  test("switching the app does not alter a German/Swahili course preference", async () => {
    window.localStorage.setItem("falowen:course:test-student", "german");
    const enrolled = enrolledCourses({ program: "german", secondaryProgram: "swahili" });
    await changeInterfaceLanguage("fr");
    expect(i18n.language).toBe("fr");
    expect(window.localStorage.getItem("falowen:interface-language")).toBe("fr");
    expect(window.localStorage.getItem("falowen:course:test-student")).toBe("german");
    expect(enrolled).toEqual(["german", "swahili"]);
    await changeInterfaceLanguage("sw");
    expect(i18n.language).toBe("sw");
    expect(i18n.t("signupPage.title")).toBe("Fungua akaunti");
    expect(window.localStorage.getItem("falowen:course:test-student")).toBe("german");
  });

  test("remembers interface language for the correct account without changing courses", async () => {
    window.localStorage.setItem("falowen:course:alice", "german");
    await changeInterfaceLanguage("fr", "alice");
    expect(readAccountInterfaceLanguage("alice")).toBe("fr");
    expect(readAccountInterfaceLanguage("bob")).toBe("");
    expect(window.localStorage.getItem("falowen:course:alice")).toBe("german");

    await changeInterfaceLanguage("sw", "bob");
    expect(readAccountInterfaceLanguage("alice")).toBe("fr");
    expect(readAccountInterfaceLanguage("bob")).toBe("sw");
    await restoreAccountInterfaceLanguage("alice");
    expect(i18n.language).toBe("fr");
    expect(window.localStorage.getItem("falowen:course:alice")).toBe("german");

    await restoreAccountInterfaceLanguage("bob", "de");
    expect(i18n.language).toBe("de");
    expect(readAccountInterfaceLanguage("bob", "de")).toBe("de");
  });
});
