import { NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_ADMIN_KEY!)
    ),
  });
}

export async function GET() {
  const sessions = await getUpcomingSessions();
  const now = new Date();

  for (const s of sessions) {
    const sessionTime = parseSessionDate(
      s.display_date,
      s.slot
    );

    const diff = Math.floor(
      (sessionTime.getTime() - now.getTime()) / 60000
    );

    if (diff === 30 && !s.notified30) {
      await sendPush(s, 30);
    }

    if (diff === 15 && !s.notified15) {
      await sendPush(s, 15);
    }
  }

  return NextResponse.json({ success: true });
}