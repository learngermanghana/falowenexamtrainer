import React from "react";
import { render, screen } from "@testing-library/react";
import ResourceLinkRow from "../components/ResourceLinkRow";

describe("ResourceLinkRow", () => {
  it("shows only one link when the resource is already in-app", () => {
    render(
      <ul>
        <ResourceLinkRow label="Workbook" url="/campus/workbook/day-1" />
      </ul>
    );

    expect(screen.getByRole("link", { name: "Workbook" })).toHaveAttribute("href", "/campus/workbook/day-1");
    expect(screen.queryByRole("link", { name: /Open external/i })).not.toBeInTheDocument();
  });

  it("shows only one link for absolute falowen in-app campus URLs", () => {
    render(
      <ul>
        <ResourceLinkRow
          label="Grammarbook"
          url="https://www.falowen.app/campus/course/directions-imperative-11"
        />
      </ul>
    );

    expect(screen.getByRole("link", { name: "Grammarbook" })).toHaveAttribute(
      "href",
      "https://www.falowen.app/campus/course/directions-imperative-11"
    );
    expect(screen.queryByRole("link", { name: /Open external/i })).not.toBeInTheDocument();
  });
});
