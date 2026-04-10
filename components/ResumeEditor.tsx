"use client";

import { useMemo, useState } from "react";
import { ResumeAnalysis, ResumeLine } from "@/types/resume";

type Props = {
  initialLines: ResumeLine[];
  initialAnalysis: ResumeAnalysis;
  resumeId: string;
  jobDescription?: string;
};

export default function ResumeEditor({ initialLines, initialAnalysis, resumeId, jobDescription }: Props) {
  const [lines, setLines] = useState(initialLines);
  const [analysis, setAnalysis] = useState(initialAnalysis);

  const lineMap = useMemo(() => new Map(lines.map((line) => [line.id, line])), [lines]);

  const applySuggestion = async (lineId: string, proposedText: string) => {
    const res = await fetch("/api/resume/apply-change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId, lineId, proposedText, jobDescription })
    });

    if (!res.ok) return;
    const body = await res.json();
    setLines(body.lines);
    setAnalysis(body.analysis);
  };

  return (
    <div className="grid grid-2">
      <section className="card">
        <h3>Live ATS Score: {analysis.score}/100</h3>
        <p className="muted">Keyword match: {analysis.breakdown.keywordMatch} | Impact: {analysis.breakdown.impact}</p>
        <h4>Suggestions</h4>
        <div className="grid">
          {analysis.suggestions.map((s) => (
            <article key={`${s.lineId}-${s.proposedText}`} className="card">
              <p className="muted">Current: {lineMap.get(s.lineId)?.text || "line missing"}</p>
              <p>
                <strong>Proposed:</strong> {s.proposedText}
              </p>
              <p className="muted">{s.reason}</p>
              <button onClick={() => applySuggestion(s.lineId, s.proposedText)}>Accept change</button>
            </article>
          ))}
        </div>
      </section>
      <section className="card">
        <h3>Resume Preview</h3>
        {lines.map((line) => (
          <p key={line.id}>{line.text}</p>
        ))}
      </section>
    </div>
  );
}
