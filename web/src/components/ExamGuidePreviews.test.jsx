import React from "react";
import {render,screen,fireEvent,within} from "@testing-library/react";
import ExamGuidePreviews from "./ExamGuidePreviews";

test.each([
 ["A1","Du oder Sie?","Landlord inquiry · Sample answer",5],
 ["A2","Reading comprehension","Cancelling a dinner",5],
 ["B1","Reading: blog comprehension","A letter about moving house",5],
])("offers %s source-derived sample pages, without exposing any private PDF", (level,first,last)=>{
 render(<ExamGuidePreviews level={level}/>);
 expect(screen.getByRole("region",{name:level+" book preview"})).toBeInTheDocument();
 const excerpt=screen.getByRole("article", {name: /Reformatted excerpt from page 5:/});
 expect(within(excerpt).getByRole("heading", {name:first})).toBeInTheDocument();
 expect(excerpt).not.toHaveAttribute("role","img");
 // The actual example text must remain navigable/readable—not merely folded
 // into an atomic image label for assistive technology.
 expect(within(excerpt).getAllByText(/.+/).length).toBeGreaterThan(4);
 expect(screen.getByText(/reformatted for web/)).toBeInTheDocument();
 const buttons=screen.getAllByRole("button",{name:/Book page/i});
 expect(buttons).toHaveLength(3);
 fireEvent.click(buttons[2]);
 const nextExcerpt=screen.getByRole("article",{name:/Reformatted excerpt from page/});
 expect(within(nextExcerpt).getByRole("heading",{name:last})).toBeInTheDocument();
 expect(within(nextExcerpt).getAllByText(/.+/).length).toBeGreaterThan(4);
 expect(screen.queryByRole("link",{name:/Download full|Buy now/i})).not.toBeInTheDocument();
});
