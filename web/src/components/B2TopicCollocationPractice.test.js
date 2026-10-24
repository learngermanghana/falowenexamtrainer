import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import B2TopicCollocationPractice from "./B2TopicCollocationPractice";
import { B2_LESSON_CONTENT_ALIGNMENT } from "../data/b2LessonContentAlignment";

it.each(Array.from({ length: 28 }, (_, i) => i + 1))("renders current topic and usable collocation checks for Day %i", (day) => {
  render(<B2TopicCollocationPractice day={day} />);
  expect(screen.getByText(B2_LESSON_CONTENT_ALIGNMENT[day].title)).toBeInTheDocument();
  expect(screen.getAllByRole("group")).toHaveLength(3);
  screen.getAllByRole("group").forEach((group) => {
    expect(within(group).getAllByRole("button")).toHaveLength(3);
    expect(group.getAttribute("aria-label")).toContain("___");
  });
});

it("replaces identity with environmental collocations and explains preposition case", () => {
  render(<B2TopicCollocationPractice day={1} />);
  expect(screen.queryByText(/Persönliche Identität/)).not.toBeInTheDocument();
  expect(screen.getByText("Abfall vermeiden")).toBeInTheDocument();
  const group = screen.getByRole("group", { name: "verzichten ___ + Akk" });
  fireEvent.click(within(group).getByRole("button", { name: "mit" }));
  expect(within(group).getByRole("status")).toHaveTextContent("Noch nicht.");
  fireEvent.click(within(group).getByRole("button", { name: "auf" }));
  expect(within(group).getByRole("status")).toHaveTextContent("Richtig.");
  expect(within(group).getByRole("status")).toHaveTextContent("Akkusativ");
});

it("does not carry answers or writing into a different lesson", () => {
  const { rerender } = render(<B2TopicCollocationPractice day={1} />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Wir vermeiden Müll." } });
  fireEvent.click(within(screen.getAllByRole("group")[0]).getByRole("button", { name: "auf" }));
  rerender(<B2TopicCollocationPractice day={2} />);
  expect(screen.getByRole("textbox")).toHaveValue("");
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  expect(screen.getByText("Rohstoffe zurückgewinnen")).toBeInTheDocument();
});
