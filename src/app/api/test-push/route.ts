// import { NextResponse } from "next/server";
// import admin from "firebase-admin";

// // 🔹 Firebase Admin Init (ONLY ONCE)
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
//   });
// }

// console.log("📨 Push request received");

// export async function POST(req: Request) {
//   const { token } = await req.json();

//   // 🔹 DYNAMIC DATA (later from DB)
//   const session = {
//     studentName: "gayathri",
//     date: "January 23",
//     time: "3:00 PM",
//     zoomLink: "https://zoom.us/j/123456789",
//   };

//   await admin.messaging().send({
//     token,
//     notification: {
//       title: "🔔 Session Starting Soon",
//       body: `${session.studentName} – ${session.date}, ${session.time}`,
//     },
//     webpush: {
//       fcmOptions: {
//         link: session.zoomLink, // 👉 opens Zoom on click
//       },
//     },
//   });

//   return NextResponse.json({ success: true });
// }
