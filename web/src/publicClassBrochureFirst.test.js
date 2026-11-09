import fs from "fs";
import path from "path";
import vm from "vm";

const getSource = (name) =>
  fs.readFileSync(path.resolve(__dirname, `../public/classes/${name}`), "utf8");

describe("Falowen brochure-first class enquiries", () => {
  test("makes the selected-class brochure available without personal details", () => {
    const leadPage = getSource("class-leads.js");
    const simpleFlow = getSource("class-simple-flow.js");

    expect(leadPage).toContain('id="leadViewBrochure"');
    expect(leadPage).toContain('${buildClassUrl(selected)}');
    expect(leadPage).toContain("if (brochureLink && url) brochureLink.href = url;");
    expect(leadPage.indexOf('id="leadViewBrochure"')).toBeLessThan(
      leadPage.indexOf('id="leadName"')
    );
    expect(leadPage).toContain("No login or personal details required.");
    expect(simpleFlow).toContain("Open the brochure without signing up");
    expect(simpleFlow).toContain("Register or ask a specific question");
  });

  test("does not allow the share-format helper to replace the personal enquiry link", () => {
    const share = getSource("class-lead-share-format.js");
    expect(share).not.toContain("whatsapp.href = buildWhatsAppUrl(data, course);");
    expect(share).toContain('whatsapp.textContent = "Ask a question on WhatsApp";');
  });

  test("the form WhatsApp message contains the brochure source and the selected readable class", () => {
    const source = getSource("funnel-journey.js");
    const fields = {
      "#leadName": { value: "Charlene Addison" },
      "#leadEmail": { value: "charlene@example.com" },
      "#leadPhone": { value: "+233000000000" },
      "#leadClass": { value: "b1-berlin-klasse" },
      "#leadClass option:checked": { textContent: "B1 Berlin Klasse · Next intake" },
      "#leadQuestion": { value: "" },
      ".lead-whatsapp": { href: "" },
    };
    const listeners = {};
    const form = {
      dataset: {},
      querySelector: (selector) => fields[selector] || null,
      addEventListener: (name, fn) => { listeners[name] = fn; },
    };
    const store = {};
    const storage = {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => { store[key] = String(value); },
    };
    const fakeWindow = {
      location: { search: "", pathname: "/classes/", origin: "https://www.falowen.app" },
      addEventListener: () => {},
      setTimeout: () => {},
      dataLayer: [],
    };
    const fakeDocument = {
      body: {},
      head: { appendChild: () => {} },
      getElementById: (id) => id === "leadCaptureForm" ? form : null,
      querySelector: () => null,
      createElement: () => ({ id: "", textContent: "" }),
    };
    class FakeMutationObserver { observe() {} }

    vm.runInNewContext(source, {
      window: fakeWindow,
      document: fakeDocument,
      localStorage: storage,
      MutationObserver: FakeMutationObserver,
      URL,
      URLSearchParams,
      Date,
      Math,
    });

    const message = new URL(fields[".lead-whatsapp"].href).searchParams.get("text");
    expect(message).toContain("Falowen class brochure page");
    expect(message).toContain("B1 Berlin Klasse");
    expect(message).not.toContain("YouTube");
    expect(message).not.toContain("have not completed it");
    expect(message).not.toContain("b1-berlin-klasse");
    const journey = JSON.parse(store["falowen:public-funnel-context"]);
    expect(journey.source).toBe("classes_brochure");
    expect(journey.utm_source).toBe("falowen");
    expect(journey.video).toBe("");

    fields["#leadQuestion"].value = "Is the next intake still open?";
    listeners.input();
    const updated = new URL(fields[".lead-whatsapp"].href).searchParams.get("text");
    expect(updated).toContain("My question: Is the next intake still open?");
  });
});
