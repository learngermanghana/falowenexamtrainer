import React from "react";
import { getAllowedWorkbookTabs, getA1WorkbookTabDefinitions } from "./A1SharedAssignmentWorkbookLayout";
import { __TESTING__ } from "./A1UnifiedTutorWorkbookNavigation";
import { readFileSync } from "node:fs";

const local = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const section = [{key:"teil-2",number:2,label:"Reading + Questions"}];

describe("optional A1 tutor Music navigation", () => {
  test("Day 1 is five tabs with Music before final Review & Submit", () => {
    const tabs=getA1WorkbookTabDefinitions({sections:section,hasGrammar:true,hasMusic:true});
    expect(tabs.map(x=>x.label)).toEqual(["Overview","Grammar","Reading + Questions","♫ Music","Review & Submit"]);
    expect(tabs.at(-2)).toEqual({key:"music",label:"♫ Music",optional:true});
    expect(getAllowedWorkbookTabs(section,true,true)).toEqual(["overview","grammar","teil-2","music","submit"]);
  });

  test("Music never alters required sections or legacy self-learning workbooks", () => {
    const tabs=getA1WorkbookTabDefinitions({sections:section,hasGrammar:true});
    expect(tabs.some(x=>x.key==="music")).toBe(false);
    expect(getAllowedWorkbookTabs(section,true)).toEqual(["overview","grammar","teil-2","submit"]);
    const multi=getA1WorkbookTabDefinitions({sections:[{key:"teil-1",label:"Teil 1"},{key:"teil-2",label:"Teil 2"},{key:"teil-3",label:"Teil 3"}],hasGrammar:true,hasMusic:true});
    expect(multi.at(-1).key).toBe("submit");
    expect(multi.filter(x=>x.optional).map(x=>x.key)).toEqual(["music"]);
  });

  test("unified tutor routes support deep-linked Music and restore workbook after leaving", () => {
    expect(__TESTING__.getRequestedSharedView("?workbookTab=music")).toBe("music");
    expect(__TESTING__.getRequestedSharedView("?workbookTab=submit")).toBe("submit");
    const unified=local("./A1UnifiedTutorWorkbookNavigation.js");
    expect(unified).toContain('showOrHidePageForMusic(pageRootRef.current, activeView === "music")');
    expect(unified).toContain('showOrHidePageForMusic(pageRootRef.current, false)');
    expect(unified).toContain('data-a1-unified-tutor-music-panel');
    expect(unified).toContain('hideLegacyNotes');
  });

  test("teacher shell owns one Music tab and never duplicates an optional card", () => {
    const shell=local("./A1TutorMarkedWorkbookShell.js");
    const layout=local("./A1SharedAssignmentWorkbookLayout.jsx");
    const media=local("./A1WorkbookMediaPanel.jsx");
    expect(shell).toContain('includeMusic={false}');
    expect(shell).toContain('music={<WorkbookDayMusic level="A1"');
    expect(media).toContain('includeMusic = true');
    expect(layout).toContain('data-a1-tutor-music-panel="true"');
    expect(layout).toContain('activeTab === "music" ? music : null');
    expect(layout).toContain('const requiredTabs = tabs.filter((tab) => !tab.optional)');
    expect(layout).toContain('data-workbook-tab-key={tab.key}');
    const css=local("./a1TutorMusicTabs.css");
    expect(css).toContain('grid-template-columns: repeat(2, minmax(0, 1fr))');
    expect(css).toContain('[data-workbook-tab-key="submit"]');
  });
});
