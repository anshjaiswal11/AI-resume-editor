import { AtsBreakdown, ResumeLine } from "@/types/resume";

const clamp = (num: number) => Math.max(0, Math.min(100, Math.round(num)));

export function scoreResume(lines: ResumeLine[], jobDescription?: string): { score: number; breakdown: AtsBreakdown } {
  const text = lines.map((line) => line.text).join(" ").toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);

  const sections = new Set(lines.map((line) => line.section.toLowerCase()));
  const sectionCompleteness = (sections.size / 6) * 100;

  const impactCount = lines.filter((line) => /\d+%|\$\d+|\d+x|increased|reduced|improved/i.test(line.text)).length;
  const impact = (impactCount / Math.max(lines.length, 1)) * 140;

  const avgLineLength = words.length / Math.max(lines.length, 1);
  const readability = 100 - Math.abs(avgLineLength - 14) * 4;

  const formatting = lines.length > 10 ? 80 : 55;
  const grammar = 78;

  let keywordMatch = 50;
  if (jobDescription) {
    const jdWords = new Set(jobDescription.toLowerCase().split(/\W+/).filter((w) => w.length > 3));
    const resumeWords = new Set(words.filter((w) => w.length > 3));
    let overlap = 0;
    jdWords.forEach((w) => {
      if (resumeWords.has(w)) overlap += 1;
    });
    keywordMatch = (overlap / Math.max(jdWords.size, 1)) * 100;
  }

  const breakdown: AtsBreakdown = {
    keywordMatch: clamp(keywordMatch),
    sectionCompleteness: clamp(sectionCompleteness),
    impact: clamp(impact),
    readability: clamp(readability),
    formatting: clamp(formatting),
    grammar: clamp(grammar)
  };

  const score = clamp(
    breakdown.keywordMatch * 0.35 +
      breakdown.sectionCompleteness * 0.2 +
      breakdown.impact * 0.15 +
      breakdown.readability * 0.1 +
      breakdown.formatting * 0.1 +
      breakdown.grammar * 0.1
  );

  return { score, breakdown };
}
