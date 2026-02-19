import React from "react";
import { render, screen } from "@testing-library/react";
import ResourceLinkRow from "../components/ResourceLinkRow";

describe("ResourceLinkRow", () => {
  it("opens resources in-app first and keeps external option", () => {
    render(
      <ul>
        <ResourceLinkRow label="Workbook" url="/campus/workbook/day-1" />
      </ul>
    );

    expect(screen.getByRole("link", { name: "Workbook" })).toHaveAttribute(
      "href",
      "/campus/course/resource-viewer?label=Workbook&url=%2Fcampus%2Fworkbook%2Fday-1"
    );
    expect(screen.getByRole("link", { name: /View externally/i })).toHaveAttribute(
      "href",
      "/campus/workbook/day-1"
    );
  });

  it("opens external links in-app first and still exposes external link", () => {
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
      "/campus/course/resource-viewer?label=Grammarbook&url=https%3A%2F%2Fwww.falowen.app%2Fcampus%2Fcourse%2Fdirections-imperative-11"
    );
    expect(screen.getByRole("link", { name: /View externally/i })).toHaveAttribute(
      "href",
      "https://www.falowen.app/campus/course/directions-imperative-11"
    );
  });
});
