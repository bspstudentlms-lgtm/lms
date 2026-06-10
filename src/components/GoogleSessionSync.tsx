"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";

export default function GoogleSessionSync() {
  const { data: session } = useSession();
  const { login } = useAuth();

  useEffect(() => {
    if (
      session?.user &&
      !localStorage.getItem("user")
    ) {
      login({
        id: (session.user as any).id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "",
        role: "student",
      });
    }
  }, [session]);

  return null;
}