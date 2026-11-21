import React from "react";
import {render,screen,fireEvent,cleanup,within} from "@testing-library/react";
import "@testing-library/jest-dom";
import HomepageStartPaths from "./HomepageStartPaths";
afterEach(cleanup);
test("placement card switches from German to Kiswahili without changing exam or signup actions",()=>{
  render(<HomepageStartPaths language="en" />);
  const section=screen.getByRole("region",{name:"Where should you start?"});
  expect(within(section).getAllByRole("article")).toHaveLength(3);
  const testLink=within(section).getByRole("link",{name:/Take placement test/});
  expect(testLink).toHaveAttribute("href","/placement-test");
  fireEvent.change(within(section).getByRole("combobox",{name:"Choose test language"}),{target:{value:"swahili"}});
  expect(testLink).toHaveAttribute("href","/placement-test?language=swahili");
  expect(within(section).getByRole("link",{name:/Try a sample test/})).toHaveAttribute("href","/exam-practice");
  expect(within(section).getByRole("link",{name:/Start learning/})).toHaveAttribute("href","/signup");
});
test("homepage signup callback is retained and translated in German and French",()=>{
  for(const language of ["de","fr"]){
    const signup=jest.fn(), view=render(<HomepageStartPaths language={language} onSignUp={signup}/>);
    fireEvent.click(within(view.container).getByRole("link",{name: language==="de"?"Jetzt lernen":"Commencer à apprendre"}));
    expect(signup).toHaveBeenCalledTimes(1);
    view.unmount();
  }
});
