
import Calendar from "@/components/calendar/calendar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Resources | BSP LMS",
  description:
    "BSP LMS Page",
};

export default function Resources() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {/* <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Calendar
        </h3> */}
        <div className="space-y-6">
          <Calendar />
          
          {/* <UserInfoCard />
          <UserAddressCard /> */}
        </div>
      </div>
    </div>
  );
}
