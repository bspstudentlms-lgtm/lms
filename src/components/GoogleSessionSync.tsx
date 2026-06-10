"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";

export default function GoogleSessionSync() {
  const { data: session } = useSession();
  const { login } = useAuth();

  useEffect(() => {
    if (session?.user) {
      login({
        id: (session.user as any).id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "",
        role: "student",
      });
    }
  }, [session, login]);

  return null;
}