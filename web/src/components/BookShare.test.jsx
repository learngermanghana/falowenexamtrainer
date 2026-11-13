import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import BookShare from "./BookShare";

const page = {
  title: "German A1 Exam Preparation — The Falowen Method",
  description: "A1 exam workbook, speaking cards and two practice tests.",
  href: "/books/german-a1-exam-preparation",
  thumbnail: "/books/share/catalog.jpg",
  cover: "/books/german-a1-exam-preparation-cover.svg",
};

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

test("individual book pages show LinkedIn and Instagram at the bottom", () => {
  render(<BookShare page={page} inlineActions />);
  expect(screen.getByRole("region", { name: "Share this book" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Share .* on LinkedIn/ })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwww.falowen.app%2Fbooks%2Fgerman-a1-exam-preparation",
  );
  expect(screen.getByRole("button", { name: /Prepare an Instagram post/ })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "More sharing options" })).toBeInTheDocument();
});

test("Instagram offers an honest thumbnail and caption workflow rather than a broken share link", () => {
  render(<BookShare page={page} inlineActions />);
  fireEvent.click(screen.getByRole("button", { name: /Prepare an Instagram post/ }));
  expect(screen.getByText(/Instagram does not offer a direct prefilled web share link/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Download thumbnail" })).toHaveAttribute("href", page.thumbnail);
  expect(screen.getByRole("link", { name: "Open Instagram" })).toHaveAttribute("href", "https://www.instagram.com/");
  expect(screen.getByRole("button", { name: "Copy message" })).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: "Your message" })).toHaveValue(
    page.title + "\n\n" + page.description,
  );
});

test("catalog cards keep their compact Share book button", () => {
  render(<BookShare page={page} />);
  expect(screen.getByRole("button", { name: "Share " + page.title })).toBeInTheDocument();
  expect(screen.queryByRole("region", { name: "Share this book" })).not.toBeInTheDocument();
});
