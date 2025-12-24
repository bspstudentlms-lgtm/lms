"use client";
import React, { useRef, useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";

interface CompletedCourse {
  user_id: any;
  course_id: number;
  course_name: string;
  issued_date: string;
  certificate_link: string;
}
export default function CertificateCard() {
  const { isOpen, openModal, closeModal } = useModal();
   const [userId, setUserId] = useState<string | null>(null);
    const [document, setDocument] = useState<{ name: string; link: string } | null>(null);
    const [courses, setCourses] =  useState<CompletedCourse[]>([]);
  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };
   const fetchCompletedCourses = async () => {
  if (!userId) return;

  try {
    const response = await fetch(
      `https://backstagepass.co.in/reactapi/completed_courses.php?user_id=${userId}`
    );

    const data = await response.json();
// console.log('alldata'+data.completed_courses);
    if (data.completed_courses) {
     
      setCourses(data.completed_courses);
    }

  } catch (error) {
    console.error("Error fetching completed courses:", error);
  }
};

useEffect(() => {
   const storedUserId  = localStorage.getItem('userId');
   setUserId(storedUserId);
  fetchCompletedCourses();
}, [userId]);

  const downloadCertificate = (course: CompletedCourse) => {
  if (!userId || !course.course_id) {
    alert("User ID or Course ID is missing!");
    return;
  }

  const query = new URLSearchParams({
    user_id: userId.toString(),
    course_id: course.course_id.toString(),
  }).toString();

  window.open(`/api/certificate?${query}`, "_blank");
};
  return (
    <>
    {courses && courses.length > 0 ? (
  courses.map((course, index) => (
      <div  key={course.course_id ?? index} className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden">
              <Image
                width={80}
                height={80}
                src="/images/icons/file-pdf.svg"
                alt="user"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {course.course_name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ✅ Issued
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date : {course.issued_date}
                </p>
              </div>
            </div>
            
          </div>
          

           <button
             onClick={() => downloadCertificate(course)}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            {/* <a
            href={course.certificate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          > */}
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
    d="M9 1.5C9.41421 1.5 9.75 1.83579 9.75 2.25V9.18934L11.7197 7.21967C12.0126 6.92678 12.4874 6.92678 12.7803 7.21967C13.0732 7.51256 13.0732 7.98744 12.7803 8.28033L9.53033 11.5303C9.23744 11.8232 8.76256 11.8232 8.46967 11.5303L5.21967 8.28033C4.92678 7.98744 4.92678 7.51256 5.21967 7.21967C5.51256 6.92678 5.98744 6.92678 6.28033 7.21967L8.25 9.18934V2.25C8.25 1.83579 8.58579 1.5 9 1.5ZM3.75 13.5C3.33579 13.5 3 13.8358 3 14.25C3 14.6642 3.33579 15 3.75 15H14.25C14.6642 15 15 14.6642 15 14.25C15 13.8358 14.6642 13.5 14.25 13.5H3.75Z"
    fill=""
  />
</svg>


            Download
            {/* </a> */}
          </button>
          
        </div>
      </div>

      ))
) : (
  <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
    <p className="text-sm text-gray-500 dark:text-gray-400">
      No certificates found
    </p>
  </div>
)}
      
    </>
  );
}
