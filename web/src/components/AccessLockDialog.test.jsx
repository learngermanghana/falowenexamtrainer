import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import AccessLockDialog, { courseLockInfo, examLockInfo } from "./AccessLockDialog";

test("German exam locks offer only Pay now and Cancel, including for trial learners", () => {
  render(<AccessLockDialog info={examLockInfo({title:"Lesen",level:"A2",trialExam:{id:"mock-1",route:"/campus/course/a2-final-mock-exam"}})} onClose={jest.fn()} />);
  const dialog=screen.getByRole("dialog");
  const links=within(dialog).getAllByRole("link");
  expect(links.map(link=>link.textContent)).toEqual(["Pay now","Cancel"]);
  expect(links[0].getAttribute("href")).toBe("/mock/payment");
  expect(links[1].getAttribute("href")).toBe("/exams/overview");
  expect(within(dialog).queryByRole("button")).toBeNull();
});
test("verification failures offer a retry rather than asking the learner to pay",()=>{
  const retryAccess=jest.fn(),onClose=jest.fn();
  render(<AccessLockDialog info={examLockInfo({trialExam:{accessError:true,retryAccess}})} onClose={onClose}/>);
  expect(screen.queryByText("Pay now")).toBeNull();
  expect(screen.getByRole("link",{name:"Cancel"}).getAttribute("href")).toBe("/exams/overview");
  fireEvent.click(screen.getByRole("button",{name:"Retry access check"}));
  expect(retryAccess).toHaveBeenCalledTimes(1);
  expect(onClose).toHaveBeenCalledTimes(1);
});
test("course access dialog retains its existing actions",()=>{
  render(<AccessLockDialog info={courseLockInfo({title:"Course lesson"})} onClose={jest.fn()}/>);
  expect(screen.getByRole("link",{name:"View plans"}).getAttribute("href")).toBe("/mock/payment");
  expect(screen.getByRole("link",{name:"My courses & subscriptions"})).toBeTruthy();
  expect(screen.getByRole("button",{name:"Keep browsing"})).toBeTruthy();
  expect(screen.queryByText("Pay now")).toBeNull();
});
