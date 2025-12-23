"use client";

import { usePathname } from "next/navigation";
import AppHeader from "@/layout/AppHeader";

export default function ConditionalHeader() {
  const pathname = usePathname();

 
  if (pathname !== "/") return null;

  return <AppHeader />;
}