export type ResumeLine = {
  id: string;
  text: string;
  section: string;
  order: number;
};

export type AtsBreakdown = {
  keywordMatch: number;
  sectionCompleteness: number;
  impact: number;
  readability: number;
  formatting: number;
  grammar: number;
};

export type Suggestion = {
  lineId: string;
  reason: string;
  proposedText: string;
  impactOnATS: string;
};

export type ResumeAnalysis = {
  score: number;
  breakdown: AtsBreakdown;
  suggestions: Suggestion[];
};
