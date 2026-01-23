
import { getToken } from "firebase/messaging";
import { messaging } from "@/lib/firebase";

export const enablePush = async () => {
  if (!("Notification" in window)) {
    alert("This browser does not support notifications");
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    alert("✅ Notifications enabled successfully");
  } else if (permission === "denied") {
    alert("❌ Notifications blocked. Please allow in browser settings");
  } else {
    alert("⚠️ Notification permission not granted yet");
  }

  const token = await getToken(messaging, {
    vapidKey: "BLwSCAxJ5c5P9lJ0BBSGB_tROdgm8ghQFhw-NFaW30lMOoDJf6HlEkucqGT1MFIlTRThv18_UQTkaSBNE4hlZy8",
  });

  console.log("FCM TOKEN 👉", token);
};
