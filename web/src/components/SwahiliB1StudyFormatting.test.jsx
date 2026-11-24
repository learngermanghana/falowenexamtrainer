import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Day26Grammar, Day26Speaking, Day26Writing } from "./SwahiliB1Day26Learning";
import { Day27Grammar, Day27Speaking, Day27Writing } from "./SwahiliB1Day27Learning";
test.each([[Day26Grammar,Day26Speaking,Day26Writing],[Day27Grammar,Day27Speaking,Day27Writing]])("B1 study sections keep grammar, speaking and writing structured", (Grammar,Speaking,Writing)=>{
 const {container,rerender}=render(<Grammar/>);
 expect(container.querySelectorAll(".swahili-b1-study__section").length).toBeGreaterThan(5);
 expect(screen.getAllByRole("table").length).toBeGreaterThan(3);
 expect(screen.getAllByRole("radio").length).toBeGreaterThan(10);
 rerender(<Speaking/>);
 expect(screen.getByText("Ramani ya mawazo")).toBeTruthy();
 expect(screen.getByText("Mfano wa jibu")).toBeTruthy();
 const onChange=jest.fn();
 rerender(<Writing value="" onChange={onChange}/>);
 expect(container.querySelector(".swahili-b1-study__editor")).toBeTruthy();
 fireEvent.change(screen.getByRole("textbox"),{target:{value:"Mimi ninajifunza."}});
 expect(onChange).toHaveBeenCalledWith("Mimi ninajifunza.");
});
