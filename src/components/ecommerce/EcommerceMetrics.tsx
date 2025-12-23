"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, ShootingStarIcon } from "@/icons";

export const EcommerceMetrics = () => {
   const [completedCoursesCount, setCompletedCoursesCount] = useState(0);
   const [enrolledcnt, setEnrolledcoursecount] = useState(0);
    
    useEffect(() => {
      const userId = localStorage.getItem("userId") ;
      const enrolled = localStorage.getItem('enrolledcourses');
      const enrolledCourses = enrolled ? enrolled.split(",").map(course => course.trim()) : [];
      const enrolledCoursesCount = enrolledCourses.length;
setEnrolledcoursecount(enrolledCoursesCount);

    const fetchCompletedCourses = async () => {
      
      if (!userId) return;

      try {
        const response = await fetch(`https://backstagepass.co.in/reactapi/completed_courses.php?user_id=${userId}`);
        const data = await response.json();

        // Expecting response like: { completed_courses: [1, 2, 3] }
        setCompletedCoursesCount(data.completed_courses?.length || 0);
      } catch (error) {
        console.error("Error fetching completed courses:", error);
      }
    };

    fetchCompletedCourses();
  }, []);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <svg
  className="fill-current"
  width="18"
  height="18"
  viewBox="0 0 18 18"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M3.75 2.25C3.05964 2.25 2.5 2.80964 2.5 3.5V13.5C2.5 14.1904 3.05964 14.75 3.75 14.75C5.8125 14.75 7.125 13.875 9 13.875C10.875 13.875 12.1875 14.75 14.25 14.75C14.9404 14.75 15.5 14.1904 15.5 13.5V3.5C15.5 2.80964 14.9404 2.25 14.25 2.25C12.1875 2.25 10.875 3.125 9 3.125C7.125 3.125 5.8125 2.25 3.75 2.25ZM4 3.75C5.80403 3.75 7.05152 4.6875 9 4.6875V12.3125C7.05152 12.3125 5.80403 11.375 4 11.375V3.75ZM14 3.75C12.1959 3.75 10.9485 4.6875 9 4.6875V12.3125C10.9485 12.3125 12.1959 11.375 14 11.375V3.75Z"
    fill=""
  />
</svg>

        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Courses Enrolled
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {enrolledcnt}
            </h4>
          </div>
          {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
        </div>
      </div>
      
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
            Courses Completed
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {completedCoursesCount}
            </h4>
          </div>

          {/* <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge> */}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <ShootingStarIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Certificates
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              04
            </h4>
          </div>
          {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
