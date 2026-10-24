const app = require("../functions/functionz/paymentAwareApp");
const { publicClassesHandler } = require("../functions/functionz/routes/publicClasses");
const { classParticipationMeHandler } = require("../functions/functionz/routes/classParticipation");
const { admissionsEngagementHandler } = require("../functions/functionz/routes/admissionsEngagement");

let deploymentStatusCache = null;
let deploymentStatusCacheTime = 0;
const DEPLOYMENT_STATUS_CACHE_MS = 5 * 60 * 1000;
const FALOWEN_GITHUB_REPO = "learngermanghana/falowenexamtrainer";

async function loadDeploymentStatus() {
  const now = Date.now();
  if (deploymentStatusCache && now - deploymentStatusCacheTime < DEPLOYMENT_STATUS_CACHE_MS) {
    return deploymentStatusCache;
  }

  const deployedSha = String(process.env.VERCEL_GIT_COMMIT_SHA || "").trim();
  const environment = String(process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown").trim();

  if (!deployedSha) {
    deploymentStatusCache = {
      status: "unknown",
      deployedSha: "",
      mainSha: "",
      behindBy: null,
      environment,
      checkedAt: new Date(now).toISOString(),
      message: "Deployment SHA is unavailable in this environment.",
    };
    deploymentStatusCacheTime = now;
    return deploymentStatusCache;
  }

  const headers = {
    accept: "application/vnd.github+json",
    "user-agent": "falowen-deployment-status",
  };
  const mainResponse = await fetch(`https://api.github.com/repos/${FALOWEN_GITHUB_REPO}/commits/main`, { headers });
  if (!mainResponse.ok) throw new Error(`GitHub main lookup failed (${mainResponse.status})`);

  const mainCommit = await mainResponse.json();
  const mainSha = String(mainCommit?.sha || "").trim();

  if (mainSha && deployedSha === mainSha) {
    deploymentStatusCache = {
      status: "current",
      deployedSha,
      mainSha,
      behindBy: 0,
      environment,
      checkedAt: new Date(now).toISOString(),
      message: "Production matches main.",
    };
    deploymentStatusCacheTime = now;
    return deploymentStatusCache;
  }

  let behindBy = null;
  let status = "behind";
  let message = "Production does not match main.";

  if (mainSha) {
    const compareResponse = await fetch(
      `https://api.github.com/repos/${FALOWEN_GITHUB_REPO}/compare/${deployedSha}...main`,
      { headers },
    );
    if (compareResponse.ok) {
      const comparison = await compareResponse.json();
      const aheadBy = Number(comparison?.ahead_by);
      const comparisonStatus = String(comparison?.status || "");
      if (Number.isFinite(aheadBy)) behindBy = aheadBy;
      if (comparisonStatus === "ahead" || comparisonStatus === "identical") {
        status = aheadBy > 0 ? "behind" : "current";
      } else if (comparisonStatus === "diverged") {
        status = "diverged";
      } else if (comparisonStatus === "behind") {
        status = "ahead";
      }
      message = behindBy > 0
        ? `Production is ${behindBy} commit${behindBy === 1 ? "" : "s"} behind main.`
        : "Production SHA differs from main.";
    }
  }

  deploymentStatusCache = {
    status,
    deployedSha,
    mainSha,
    behindBy,
    environment,
    checkedAt: new Date(now).toISOString(),
    message,
  };
  deploymentStatusCacheTime = now;
  return deploymentStatusCache;
}

async function deploymentStatusHandler(req, res) {
  if (!["GET", "HEAD"].includes(req.method)) {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ status: "error", message: "Method Not Allowed" });
  }
  try {
    const result = await loadDeploymentStatus();
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    if (req.method === "HEAD") return res.status(200).end();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Deployment status lookup failed:", error);
    return res.status(503).json({
      status: "unknown",
      deployedSha: String(process.env.VERCEL_GIT_COMMIT_SHA || ""),
      mainSha: "",
      behindBy: null,
      environment: String(process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown"),
      checkedAt: new Date().toISOString(),
      message: "Could not verify production against main.",
    });
  }
}

module.exports = (req, res) => {
  if (typeof req.url === "string") {
    if (req.url === "/api") req.url = "/";
    else if (req.url.startsWith("/api/")) req.url = req.url.slice(4);
  }

  if (req.url === "/deployment-status" || req.url?.startsWith("/deployment-status?")) {
    return deploymentStatusHandler(req, res);
  }

  if (req.url === "/public/classes" || req.url?.startsWith("/public/classes?")) {
    return publicClassesHandler(req, res);
  }

  if (req.url === "/class-participation/me" || req.url?.startsWith("/class-participation/me?")) {
    return classParticipationMeHandler(req, res);
  }

  if (req.url === "/public/admissions-engagement" || req.url?.startsWith("/public/admissions-engagement?")) {
    return admissionsEngagementHandler(req, res);
  }

  return app(req, res);
};
