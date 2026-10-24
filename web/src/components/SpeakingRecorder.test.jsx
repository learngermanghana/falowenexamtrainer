import React from "react";
import {render,screen,fireEvent} from "@testing-library/react";
import SpeakingRecorder from "./SpeakingRecorder";

test("the real microphone switches between record and stop",()=>{
  const stop=jest.fn();
  const {rerender}=render(<SpeakingRecorder recording={false} disabled={false} onStop={stop} onRecord={jest.fn()}/>);
  expect(screen.getAllByRole("button")).toHaveLength(1);
  rerender(<SpeakingRecorder recording disabled={false} onStop={stop}/>);
  fireEvent.click(screen.getByRole("button",{name:"Stop and send recording"}));
  expect(stop).toHaveBeenCalledTimes(1);
});

test("examiner speaking disables the record button without decorative playback controls",()=>{
  render(<SpeakingRecorder disabled onRecord={jest.fn()}/>);
  expect(screen.getByRole("button",{name:"Record German answer"})).toBeDisabled();
  expect(screen.getAllByRole("button")).toHaveLength(1);
});
