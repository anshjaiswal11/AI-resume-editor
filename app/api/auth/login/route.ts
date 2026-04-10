import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const user = await adminAuth.getUserByEmail(email);
    return NextResponse.json({ uid: user.uid, email: user.email });
  } catch {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
