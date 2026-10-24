import React from "react";
import {fireEvent,render,screen} from "@testing-library/react";
import {
  readingLevelConfig,formatReadingTime,readingProgressPercent,
  ReadingPracticeHeader,ReadingPracticeParts,ReadingPracticeSampleList
} from "./ReadingPracticeShell";

test("reading level contract keeps the correct exam structure without inventing B2/C2 material",()=>{
  expect(Object.keys(readingLevelConfig)).toEqual(["A1","A2","B1","B2","C1","C2"]);
  expect(readingLevelConfig.A1).toMatchObject({questions:15,parts:3,minutes:25});
  expect(readingLevelConfig.A2).toMatchObject({questions:20,parts:4,minutes:30});
  expect(readingLevelConfig.B1).toMatchObject({questions:30,parts:5,minutes:65});
  expect(readingLevelConfig.B2.available).toBe(false);
  expect(readingLevelConfig.C2.available).toBe(false);
  expect(formatReadingTime(3900)).toBe("65:00");
  expect(formatReadingTime(-30)).toBe("00:00");
  expect(readingProgressPercent(10,30)).toBe(33);
});

test("shared Lesen header displays level, timer, progress and practice-mode semantics",()=>{
  const toggle=jest.fn(),back=jest.fn();
  render(<ReadingPracticeHeader level="B1" sampleLabel="Lesen Sample 2" total={30}
    partCount={5} durationSeconds={3900} secondsLeft={2732} answered={14}
    onBack={back} onToggleTimer={toggle} timerRunning={true}/>);
  expect(screen.getByText("Lesen Sample 2")).toBeInTheDocument();
  expect(screen.getByText("45:32")).toBeInTheDocument();
  expect(screen.getByRole("progressbar",{name:"Questions answered"})).toHaveAttribute("aria-valuenow","14");
  expect(screen.getByText(/Timer can be paused/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Pause timer"}));
  fireEvent.click(screen.getByRole("button",{name:/All Lesen samples/}));
  expect(toggle).toHaveBeenCalledTimes(1);
  expect(back).toHaveBeenCalledTimes(1);
});

test("shared navigation shows all Teile with answered counts and previous / next",()=>{
  const onSelect=jest.fn();
  const parts=[{id:"teil1",total:6,answered:6},{id:"teil2",total:6,answered:3},
    {id:"teil3",total:7,answered:0},{id:"teil4",total:7,answered:0},{id:"teil5",total:4,answered:0}];
  render(<ReadingPracticeParts level="B1" parts={parts} activePart="teil2" onSelect={onSelect}/>);
  expect(screen.getByRole("navigation",{name:"B1 Lesen part selector"})).toBeInTheDocument();
  expect(screen.getByText("6/6 answered")).toBeInTheDocument();
  expect(screen.getByText("3/6 answered")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:/Next Teil/}));
  fireEvent.click(screen.getByRole("button",{name:/Previous Teil/}));
  expect(onSelect).toHaveBeenNthCalledWith(1,"teil3");
  expect(onSelect).toHaveBeenNthCalledWith(2,"teil1");
});

test("sample cards can resume selected practice while showing previously saved score",()=>{
  const open=jest.fn();
  render(<ReadingPracticeSampleList level="B1" samples={[
    {id:"sample-a",label:"Lesen Sample 1",detail:"30 questions · 5 Teile",status:"In progress"},
    {id:"sample-b",label:"Lesen Sample 2",detail:"30 questions · 5 Teile"}
  ]} results={[{setId:"sample-b",percent:80}]} onOpen={open}/>);
  expect(screen.getByText("In progress")).toBeInTheDocument();
  expect(screen.getByText(/Latest: 80%/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:/Lesen Sample 1/}));
  expect(open).toHaveBeenCalledWith(expect.objectContaining({id:"sample-a"}));
});
