import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { scoreResume } from "@/lib/ats";
import { db, storage } from "@/lib/firebaseAdmin";
import { getSuggestionsFromOpenRouter } from "@/lib/openrouter";
import { parseResumeFromBuffer } from "@/lib/resumeParser";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;
    const jobDescription = String(formData.get("jobDescription") || "");

    if (!file) {
      return NextResponse.json({ error: "Resume file is required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const lines = await parseResumeFromBuffer(buffer);
    const baseAnalysis = scoreResume(lines, jobDescription);
    const aiSuggestions = await getSuggestionsFromOpenRouter(lines, jobDescription);

    const resumeId = randomUUID();
    const filePath = `resumes/${resumeId}/${file.name}`;
    const bucket = storage.bucket();
    await bucket.file(filePath).save(buffer, {
      contentType: file.type || "application/pdf",
      resumable: false
    });

    await db.collection("resumes").doc(resumeId).set({
      resumeId,
      filePath,
      originalFileName: file.name,
      jobDescription,
      lines,
      analysis: {
        ...baseAnalysis,
        suggestions: aiSuggestions
      },
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({
      resumeId,
      lines,
      analysis: {
        ...baseAnalysis,
        suggestions: aiSuggestions
      }
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Upload failed" }, { status: 500 });
  }
}
