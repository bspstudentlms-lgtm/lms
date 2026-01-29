"use client";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { onMessage } from "firebase/messaging";
// import { messaging } from "@/lib/firebase";




export default function ClientProviders({ children }: { children: React.ReactNode }) {
//   useEffect(() => {
//   if (!("Notification" in window)) return;

//   onMessage(messaging, (payload) => {
//     console.log("🔥 Foreground message:", payload);

//     if (Notification.permission !== "granted") return;

//     new Notification(payload.notification?.title || "Notification", {
//       body: payload.notification?.body || "",
//       icon: "/favicon.ico",
//     });
//   });
// }, []);


//  useEffect(() => {
//   if ("serviceWorker" in navigator) {
//     navigator.serviceWorker
//       .register("/firebase-messaging-sw.js", { scope: "/" })
//       .then(() => console.log("✅ Firebase SW registered"))
//       .catch(err => console.error("❌ SW failed", err));
//   }
// }, []);

  return (
    <SessionProvider>
      <ThemeProvider>
        <SidebarProvider>
          <AuthProvider>{children}</AuthProvider>
        </SidebarProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
