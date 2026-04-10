"use client";

import { useState } from "react";
import ResumeEditor from "@/components/ResumeEditor";
import { ResumeAnalysis, ResumeLine } from "@/types/resume";

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [lines, setLines] = useState<ResumeLine[] | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const upload = async () => {
    if (!file) return;
    const data = new FormData();
    data.append("resume", file);
    data.append("jobDescription", jobDescription);

    const res = await fetch("/api/resume/upload", { method: "POST", body: data });
    if (!res.ok) return;
    const body = await res.json();
    setResumeId(body.resumeId);
    setLines(body.lines);
    setAnalysis(body.analysis);
  };

  return (
    <main>
      <div className="card">
        <h2>Upload Resume</h2>
        <div className="grid">
          <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <textarea
            rows={6}
            placeholder="Optional: paste job description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <button onClick={upload}>Analyze Resume</button>
        </div>
      </div>
      {resumeId && lines && analysis && (
        <ResumeEditor initialLines={lines} initialAnalysis={analysis} resumeId={resumeId} jobDescription={jobDescription} />
      )}
    </main>
  );
}
