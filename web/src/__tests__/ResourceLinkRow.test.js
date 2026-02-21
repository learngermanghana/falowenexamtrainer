import React from "react";
import { render, screen } from "@testing-library/react";
import ResourceLinkRow from "../components/ResourceLinkRow";

describe("ResourceLinkRow", () => {
  it("opens non-course resources in the in-app viewer", () => {
    render(
      <ul>
        <ResourceLinkRow label="Workbook" url="/campus/workbook/day-1" />
      </ul>
    );

    expect(screen.getByRole("link", { name: "Workbook" })).toHaveAttribute(
      "href",
      "/campus/course/resource-viewer?label=Workbook&url=%2Fcampus%2Fworkbook%2Fday-1"
    );
  });

  it("routes falowen internal course links directly to the app route", () => {
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
      "/campus/course/directions-imperative-11"
    );
  });
});
