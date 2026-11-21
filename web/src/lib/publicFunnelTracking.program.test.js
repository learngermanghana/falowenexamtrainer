import { buildPublicFunnelUrl, rememberPublicFunnelContext } from "./publicFunnelTracking";

beforeEach(() => { window.localStorage.clear(); window.sessionStorage.clear(); });

test("Kiswahili program survives funnel serialization for signup links with attribution intact",()=>{
  const path=buildPublicFunnelUrl("/signup/",{
    source:"placement-test", video:"lesson-2", leadId:"pt_test",
    level:"B1", program:"swahili", utm_source:"radio",
    utm_content:"continue_application"
  });
  const url=new URL(path,window.location.origin);
  expect(url.pathname).toBe("/signup/");
  expect(url.searchParams.get("program")).toBe("swahili");
  expect(url.searchParams.get("level")).toBe("B1");
  expect(url.searchParams.get("source")).toBe("placement-test");
  expect(url.searchParams.get("utm_source")).toBe("radio");
  expect(url.searchParams.get("utm_content")).toBe("continue_application");
});
test("never adds a signup program from stored attribution or to non-signup routes",()=>{
  rememberPublicFunnelContext({program:"swahili",source:"placement-test"});
  const german=new URL(buildPublicFunnelUrl("/signup/",{level:"A2"}),window.location.origin);
  expect(german.searchParams.get("program")).toBeNull();
  const classes=new URL(buildPublicFunnelUrl("/classes/",{program:"swahili",level:"A2"}),window.location.origin);
  expect(classes.searchParams.get("program")).toBeNull();
  const explicitGerman=new URL(buildPublicFunnelUrl("/signup",{program:"german",level:"A1"}),window.location.origin);
  expect(explicitGerman.searchParams.get("program")).toBe("german");
  const invalid=new URL(buildPublicFunnelUrl("/signup/",{program:"unknown"}),window.location.origin);
  expect(invalid.searchParams.get("program")).toBeNull();
});
