import fs from "fs";
import path from "path";
import { waitFor } from "@testing-library/dom";

const root = path.resolve(__dirname, "../..");
const markup = fs.readFileSync(path.join(root, "public/book-appointment/index.html"), "utf8");
const source = fs.readFileSync(path.join(root, "public/book-appointment/app.js"), "utf8");

const slot = {
  slotId: "6b1f4e75-e741-4ac2-bfea-6a4e927e47e1",
  date: "2026-12-02",
  time: "14:00",
  durationMinutes: 30,
  topic: "Falowen consultation",
};

const loadPage = () => {
  document.open();
  document.write(markup);
  document.close();
  window.scrollTo = jest.fn();
  const fetchMock = jest.fn(async (url, options = {}) => {
    if (options.method === "POST") {
      return { ok: true, json: async () => ({
        ok: true, bookingId: "BOOK-123", date: slot.date, time: slot.time,
        topic: slot.topic, confirmationEmailSent: true,
      }) };
    }
    return { ok: true, json: async () => ({ ok: true, slots: [slot] }) };
  });
  // Execute exactly the deployed static JS against real jsdom DOM nodes.
  new Function("window", "document", "fetch", "Intl", "FormData", source)(
    window, document, fetchMock, Intl, FormData,
  );
  return fetchMock;
};

describe("public appointment booking is loaded on demand", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    jest.restoreAllMocks();
  });

  test("WhatsApp-first landing triggers no availability API until an explicit click", async () => {
    const fetchMock = loadPage();
    expect(document.getElementById("booking-entry").hidden).toBe(false);
    expect(document.getElementById("choose-step").hidden).toBe(true);
    expect(document.getElementById("loading-slots").hidden).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();

    const chat = document.querySelector("a.booking-contact-whatsapp");
    expect(chat.getAttribute("href")).toContain("phone=233205706589");
    expect(chat.getAttribute("target")).toBe("_blank");
    expect(chat.getAttribute("rel")).toContain("noopener");
    // Contact button is a normal external link: no Falowen API or JS request.
    expect(fetchMock).not.toHaveBeenCalled();

    const open = document.getElementById("show-appointment-times");
    open.click();
    open.click();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock.mock.calls[0][0]).toBe("/api/public/appointments?view=public");
    expect(fetchMock.mock.calls[0][1]).toEqual(expect.objectContaining({
      credentials: "omit", cache: "no-store",
    }));
    await waitFor(() => expect(document.getElementById("choose-step").hidden).toBe(false));
    expect(document.getElementById("booking-entry").hidden).toBe(true);
    expect(document.querySelector(".booking-time-button")).not.toBeNull();
  });

  test("manual refresh and booking POST still work after choosing calendar", async () => {
    const fetchMock = loadPage();
    expect(fetchMock).not.toHaveBeenCalled();
    document.getElementById("show-appointment-times").click();
    await waitFor(() => expect(document.querySelector(".booking-time-button")).not.toBeNull());
    document.getElementById("refresh-times").click();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    document.querySelector(".booking-time-button").click();
    document.getElementById("summary-next").click();
    expect(document.getElementById("details-step").hidden).toBe(false);

    document.getElementById("booking-name").value = "Ada Lovelace";
    document.getElementById("booking-email").value = "ada@example.com";
    const form = document.getElementById("booking-contact-form");
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    await waitFor(() => expect(fetchMock.mock.calls.some(([, options]) => options?.method === "POST")).toBe(true));
    const [url, options] = fetchMock.mock.calls.find(([, request]) => request?.method === "POST");
    expect(url).toBe("/api/public/appointments");
    expect(JSON.parse(options.body)).toEqual(expect.objectContaining({
      action: "book", slotId: slot.slotId, name: "Ada Lovelace", email: "ada@example.com",
    }));
    await waitFor(() => expect(document.getElementById("success-step").hidden).toBe(false));
    expect(document.getElementById("success-details").textContent).toContain("BOOK-123");
  });
});
