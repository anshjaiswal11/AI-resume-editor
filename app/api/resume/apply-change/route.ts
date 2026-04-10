import { NextRequest, NextResponse } from "next/server";
import { scoreResume } from "@/lib/ats";
import { db } from "@/lib/firebaseAdmin";
import { getSuggestionsFromOpenRouter } from "@/lib/openrouter";
import { ResumeLine } from "@/types/resume";

export async function POST(req: NextRequest) {
  try {
    const { resumeId, lineId, proposedText, jobDescription } = await req.json();

    const docRef = db.collection("resumes").doc(resumeId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const data = snapshot.data();
    const currentLines = (data?.lines || []) as ResumeLine[];
    const lines = currentLines.map((line) => (line.id === lineId ? { ...line, text: proposedText } : line));

    const baseAnalysis = scoreResume(lines, jobDescription || data?.jobDescription);
    const suggestions = await getSuggestionsFromOpenRouter(lines, jobDescription || data?.jobDescription);
    const analysis = { ...baseAnalysis, suggestions };

    await docRef.update({ lines, analysis, updatedAt: new Date().toISOString() });

    return NextResponse.json({ lines, analysis });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Change apply failed" }, { status: 500 });
  }
}
