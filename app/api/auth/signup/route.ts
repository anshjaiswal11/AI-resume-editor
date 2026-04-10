import { NextRequest, NextResponse } from "next/server";
import { adminAuth, db } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const user = await adminAuth.createUser({ email, password });
    await db.collection("users").doc(user.uid).set({
      uid: user.uid,
      email: user.email,
      createdAt: new Date().toISOString()
    });
    return NextResponse.json({ uid: user.uid, email: user.email });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Unable to sign up" }, { status: 400 });
  }
}
