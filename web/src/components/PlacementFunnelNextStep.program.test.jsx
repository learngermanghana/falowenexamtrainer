import React from "react";
import {render,screen,cleanup} from "@testing-library/react";
import "@testing-library/jest-dom";
import PlacementFunnelNextStep from "./PlacementFunnelNextStep";

beforeEach(()=>{window.localStorage.clear();window.sessionStorage.clear();});
afterEach(cleanup);

const result={attemptId:"pt_123456789012",level:"B1",correct:23,total:30,a1:9,a2:8,b1:6,registered:true};

const query=(link)=>new URL(link.getAttribute("href"),window.location.origin).searchParams;

test("both Kiswahili post-result signup actions retain program=swahili and B1",()=>{
  render(<PlacementFunnelNextStep result={{...result,language:"swahili"}} />);
  const recommended=screen.getByRole("link",{name:"Start Kiswahili learning"});
  const application=screen.getByRole("link",{name:"Continue application"});
  for(const link of [recommended,application]){
    expect(new URL(link.getAttribute("href"),window.location.origin).pathname).toBe("/signup/");
    expect(query(link).get("program")).toBe("swahili");
    expect(query(link).get("level")).toBe("B1");
    expect(query(link).get("leadId")).toBe(result.attemptId);
  }
  expect(query(recommended).get("utm_content")).toBe("recommended_class");
  expect(query(application).get("utm_content")).toBe("continue_application");
});

test("German result keeps existing classes route and German-default signup",()=>{
  render(<PlacementFunnelNextStep result={{...result,language:"german"}} />);
  const recommended=screen.getByRole("link",{name:"Choose a B1 class"});
  const application=screen.getByRole("link",{name:"Continue application"});
  expect(new URL(recommended.getAttribute("href"),window.location.origin).pathname).toBe("/classes/");
  expect(new URL(application.getAttribute("href"),window.location.origin).pathname).toBe("/signup/");
  expect(query(recommended).get("program")).toBeNull();
  expect(query(application).get("program")).toBeNull();
});
