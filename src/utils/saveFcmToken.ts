export async function saveFcmToken(
  userId: number,
  role: "mentor" | "student"
) {
  const token = localStorage.getItem("fcmToken");
  if (!token) return;

  await fetch("/api/save-fcm-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, role, token }),
  });
}