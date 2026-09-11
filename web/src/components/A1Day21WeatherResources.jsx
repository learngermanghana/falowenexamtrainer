import { getA1TeacherVideoResources } from "../data/a1TeacherVideoResources";
import {
  buildA1AssignmentVideoModel,
  extractYouTubeVideoId,
} from "./A1WorkbookVideoHeader";

export const A1_DAY21_ASSIGNMENT_KEY = "A1-13";
export const A1_DAY21_CHAPTER = "13";

const toVideoModel = (resource, kind, fallbackTitle) => {
  const sourceUrl = String(resource?.url || resource?.sourceUrl || "").trim();
  const youtubeId = extractYouTubeVideoId(sourceUrl);
  if (!sourceUrl || !youtubeId) return null;

  return {
    kind,
    title: String(resource?.title || fallbackTitle).trim() || fallbackTitle,
    description: String(resource?.description || "").trim(),
    sourceUrl,
    youtubeId,
    embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}`,
  };
};

export const buildA1Day21WeatherResourceModels = () => {
  const teacherResource = getA1TeacherVideoResources(21).find(
    (resource) => String(resource.chapter || "").trim() === A1_DAY21_CHAPTER,
  );
  const aiVideo = buildA1AssignmentVideoModel(A1_DAY21_ASSIGNMENT_KEY);

  return {
    teacher: toVideoModel(
      teacherResource,
      "teacher",
      "Weather · Teacher lecture",
    ),
    ai: toVideoModel(
      aiVideo?.videoResource || aiVideo,
      "ai",
      "Weather · AI grammar video",
    ),
  };
};

/**
 * Kept as a compatibility component because older Day 21 workbook code imports it.
 *
 * A1TutorMarkedWorkbookShell now has one canonical media surface for every A1
 * workbook: A1WorkbookMediaPanel. Rendering a second Day-21-only copy here made
 * the teacher lecture and AI video appear again inside Overview/Grammar. Returning
 * null keeps old imports safe while ensuring the shared top Video Resources panel
 * is the only place those videos are rendered.
 */
export default function A1Day21WeatherResources() {
  return null;
}
