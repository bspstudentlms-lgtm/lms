"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
 const pathname = usePathname();
 
  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      {/* {window.location.pathname !== '/home' ?  */}
       {/* {pathname  !== '/' ? 
      <AppSidebar /> : null } */}
        <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      {/* <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${window.location.pathname !== '/home' ? mainContentMargin : null}`}
      > */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${pathname !== '/' ? mainContentMargin : null}`}
      >
        
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        {/* <div className={` mx-auto max-w-(--breakpoint-2xl) ${window.location.pathname !== '/home' ? "p-4 md:p-6" : ""}`}>{children}</div>
      </div> */}
        <div className={` mx-auto max-w-(--breakpoint-2xl) ${pathname !== '/' ? "p-4 md:p-6" : ""}`}>{children}</div>
      </div>
    </div>
  );
}
