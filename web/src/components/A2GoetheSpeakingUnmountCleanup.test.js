import fs from "fs";
import path from "path";

const read = (file) =>
  fs.readFileSync(path.resolve(__dirname, file), "utf8");

describe("A2 speaking preview recorder cleanup", () => {
  test.each([
    ["Teil 1", "./A2GoetheSpeakingMockTeil1Preview.jsx"],
    ["Teil 2", "./A2GoetheSpeakingMockTeil2Preview.jsx"],
    ["Teil 3", "./A2GoetheSpeakingMockTeil3Preview.jsx"],
  ])("%s stops media capture and revokes object URLs on unmount", (_label, file) => {
    const source = read(file);

    expect(source).toContain("useEffect(() => {");
    expect(source).toContain("mountedRef.current = false");
    expect(source).toContain("clearTimer();");
    expect(source).toContain('recorder.state === "recording"');
    expect(source).toContain("recorder.stop()");
    expect(source).toContain("stopTracks();");
    expect(source).toContain("revokeObjectUrl");
  });
});
