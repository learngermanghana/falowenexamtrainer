import React from "react";
import {act,render,screen,fireEvent} from "@testing-library/react";
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

test("input meter shows the selected mic, responds to audio and closes on stop", () => {
  jest.useFakeTimers();
  const previous = window.AudioContext;
  const close = jest.fn().mockResolvedValue();
  let amplitude = 0;
  window.AudioContext = class {
    state = "running";
    resume = jest.fn().mockResolvedValue();
    close = close;
    createAnalyser() {
      return { getByteTimeDomainData: bytes => bytes.fill(128 + amplitude) };
    }
    createMediaStreamSource() { return { connect: jest.fn() }; }
  };
  try {
    const stream = {getAudioTracks: () => [{label:"Laptop mic"}]};
    const view = render(<SpeakingRecorder recording stream={stream}/>);
    expect(screen.getByText(/Laptop mic/)).toBeVisible();
    act(() => jest.advanceTimersByTime(150));
    const meter = screen.getByRole("meter");
    expect(meter.value).toBe(0);
    amplitude = 32;
    act(() => jest.advanceTimersByTime(150));
    expect(meter.value).toBeGreaterThan(0);
    view.rerender(<SpeakingRecorder recording={false}/>);
    expect(close).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("meter")).toBeNull();
  } finally {
    window.AudioContext = previous;
    jest.useRealTimers();
  }
});
