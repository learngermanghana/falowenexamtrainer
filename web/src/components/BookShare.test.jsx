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

test("Instagram displays a working inline post-preparation panel without relying on a popup", () => {
  render(<BookShare page={page} inlineActions />);
  const instagramButton = screen.getByRole("button", { name: /Prepare an Instagram post for/ });
  expect(instagramButton).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(instagramButton);
  expect(instagramButton).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("region", { name: "Instagram post preparation" })).toBeInTheDocument();
  expect(screen.getByText(/Instagram does not offer a direct prefilled web share link/)).toBeInTheDocument();
  expect(screen.getByRole("img", { name: /book cover/ })).toHaveAttribute("src", page.cover);
  expect(screen.getByRole("link", { name: "Download share image (JPG)" })).toHaveAttribute("href", page.thumbnail);
  expect(screen.getByRole("link", { name: "Open Instagram" })).toHaveAttribute("href", "https://www.instagram.com/");
  expect(screen.getByRole("button", { name: "Copy caption and book link" })).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: "Your Instagram caption" })).toHaveValue(
    page.title + "\n\n" + page.description,
  );
  fireEvent.click(instagramButton);
  expect(screen.queryByRole("region", { name: "Instagram post preparation" })).not.toBeInTheDocument();
});

test("catalog cards keep their compact Share book button", () => {
  render(<BookShare page={page} />);
  expect(screen.getByRole("button", { name: "Share " + page.title })).toBeInTheDocument();
  expect(screen.queryByRole("region", { name: "Share this book" })).not.toBeInTheDocument();
});
