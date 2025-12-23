
import CourseDetail from "@/components/course-detail/courseDetail";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Course Details Page | BSP LMS",
  description:
    "BSP LMS Page",
};

export default function CourseDetailsPage() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        CourseDetailsPage
        </h3> */}
        <div className="space-y-6">
          <CourseDetail />
          
        </div>
      </div>
    </div>
  );
}
