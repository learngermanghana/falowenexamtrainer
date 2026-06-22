#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATCH_SCRIPT = ROOT / "scripts/apply_resubmission_cooldown_status_fix.py"

markers = {
    ROOT / "web/src/components/CourseTab.js": "Needs improvement",
    ROOT / "web/src/hooks/useLessonProgress.js": "pendingSubmission: hasPendingSubmission",
    ROOT / "web/src/components/AssignmentSubmissionPage.js": "getCooldownRemainingSeconds",
    ROOT / "functions/index.js": "RESUBMISSION_COOLDOWN_MS",
}

applied = [marker in path.read_text(encoding="utf-8") for path, marker in markers.items()]
if all(applied):
    print("Resubmission cooldown and assignment status fix already applied.")
    raise SystemExit(0)
if any(applied):
    missing = [str(path.relative_to(ROOT)) for (path, _), present in zip(markers.items(), applied) if not present]
    raise RuntimeError(f"Fix is only partially applied; missing markers in: {', '.join(missing)}")

source = PATCH_SCRIPT.read_text(encoding="utf-8")
old = '''replace_once(
    functions_index,
\'''      return result;
\''',
\'''      return {
        ...result,
        nextAllowedAt: new Date(Date.now() + RESUBMISSION_COOLDOWN_MS).toISOString(),
        cooldownSeconds: Math.ceil(RESUBMISSION_COOLDOWN_MS / 1000),
      };
\''',
)
'''
new = '''replace_once(
    functions_index,
\'''      });

      return result;
    } catch (error) {
      console.error("submitAssignmentResubmission error", {
\''',
\'''      });

      return {
        ...result,
        nextAllowedAt: new Date(Date.now() + RESUBMISSION_COOLDOWN_MS).toISOString(),
        cooldownSeconds: Math.ceil(RESUBMISSION_COOLDOWN_MS / 1000),
      };
    } catch (error) {
      console.error("submitAssignmentResubmission error", {
\''',
)
'''
if source.count(old) != 1:
    raise RuntimeError("Could not safely narrow the callable return-value patch.")
source = source.replace(old, new, 1)

namespace = {"__file__": str(PATCH_SCRIPT), "__name__": "__main__"}
exec(compile(source, str(PATCH_SCRIPT), "exec"), namespace)
