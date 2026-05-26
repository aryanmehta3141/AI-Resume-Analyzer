/**
 * Normalize API response so UI always gets expected camelCase fields.
 * Handles snake_case, null, or missing keys from the backend/AI.
 */
export function mapAnalysis(data) {
  if (!data) return null;

  return {
    fileName: data.fileName ?? data.file_name ?? "resume.pdf",
    atsScore: Number(data.atsScore ?? data.ats_score ?? data.score ?? 0) || 0,
    formattingSuggestions:
      data.formattingSuggestions ?? data.formatting_suggestions ?? [],
    keywordImprovements:
      data.keywordImprovements ?? data.keyword_improvements ?? [],
    missingSkills: data.missingSkills ?? data.missing_skills ?? [],
    feedback: data.feedback ?? data.summary ?? "",
  };
}

export function hasAnalysisContent(mapped) {
  if (!mapped) return false;
  return (
    mapped.atsScore > 0 ||
    mapped.feedback?.length > 0 ||
    mapped.formattingSuggestions?.length > 0 ||
    mapped.keywordImprovements?.length > 0 ||
    mapped.missingSkills?.length > 0
  );
}
