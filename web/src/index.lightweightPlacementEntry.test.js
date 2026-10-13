import fs from "fs";
import path from "path";

describe("lightweight placement-test entry", () => {
  const indexSource = fs.readFileSync(path.join(__dirname, "index.jsx"), "utf8");
  const authenticatedRootSource = fs.readFileSync(path.join(__dirname, "AuthenticatedAppRoot.jsx"), "utf8");

  test("keeps the heavy campus app out of the initial placement-test entry", () => {
    expect(indexSource).toContain("React.lazy(() => import('./components/PlacementTestPage'))");
    expect(indexSource).toContain("React.lazy(() => import('./AuthenticatedAppRoot'))");
    expect(indexSource).toContain("isPlacementTestPage ? <PlacementTestPage /> : <AuthenticatedAppRoot />");
    expect(indexSource).not.toContain("import App from './App'");
    expect(indexSource).not.toContain("RouteScopedBackgroundServices from './components/RouteScopedBackgroundServices'");
    expect(indexSource).not.toContain("import './i18n'");
  });

  test("loads the campus-only services inside the authenticated chunk", () => {
    expect(authenticatedRootSource).toContain("import App from './App'");
    expect(authenticatedRootSource).toContain("RouteScopedBackgroundServices");
    expect(authenticatedRootSource).toContain("import './i18n'");
    expect(authenticatedRootSource).toContain("<Route path=\"*\" element={<App />} />");
  });
});
