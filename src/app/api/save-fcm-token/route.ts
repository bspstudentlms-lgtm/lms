import { NextResponse } from "next/server";

// TEMP: use DB later
const tokens: any[] = [];

export async function POST(req: Request) {
  const { userId, role, token } = await req.json();

  tokens.push({ userId, role, token });

  console.log("FCM SAVED:", userId, role, token);

  return NextResponse.json({ success: true });
}
