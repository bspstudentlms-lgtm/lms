"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  params: {
    course: string;
  };
}

export default function SSOLogin({ params }: Props) {
  const router = useRouter();
  const course = params.course || "dashboard";

  useEffect(() => {
    // automatically trigger Google login
    signIn("google", { callbackUrl: `/` + course });
  }, [course]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting to Google login...</p>
    </div>
  );
}