import pdfParse from "pdf-parse";
import { ResumeLine } from "@/types/resume";

const guessSection = (line: string): string => {
  if (/experience/i.test(line)) return "experience";
  if (/education/i.test(line)) return "education";
  if (/skill/i.test(line)) return "skills";
  if (/project/i.test(line)) return "projects";
  if (/summary|profile/i.test(line)) return "summary";
  return "general";
};

export async function parseResumeFromBuffer(buffer: Buffer): Promise<ResumeLine[]> {
  const parsed = await pdfParse(buffer);
  const rawLines = parsed.text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return rawLines.map((text, idx) => ({
    id: `line_${idx + 1}`,
    text,
    section: guessSection(text),
    order: idx
  }));
}
