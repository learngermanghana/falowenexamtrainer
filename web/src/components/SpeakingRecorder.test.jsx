import React from "react";
import {render,screen,fireEvent} from "@testing-library/react";
import SpeakingRecorder from "./SpeakingRecorder";

test("recording exposes Stop and prevents simultaneous playback",()=>{
  const stop=jest.fn();
  render(<SpeakingRecorder recording disabled={false} listenDisabled replayDisabled onStop={stop}/>);
  expect(screen.getByRole("button",{name:"Replay examiner audio"})).toBeDisabled();
  expect(screen.getByRole("button",{name:"Play my last recording"})).toBeDisabled();
  fireEvent.click(screen.getByRole("button",{name:"Stop and send recording"}));
  expect(stop).toHaveBeenCalledTimes(1);
});

test("waiting for the examiner disables recording while keeping Listen available",()=>{
  const listen=jest.fn();
  render(<SpeakingRecorder disabled listenDisabled={false} replayDisabled onListen={listen}/>);
  expect(screen.getByRole("button",{name:"Record German answer"})).toBeDisabled();
  fireEvent.click(screen.getByRole("button",{name:"Replay examiner audio"}));
  expect(listen).toHaveBeenCalledTimes(1);
});
