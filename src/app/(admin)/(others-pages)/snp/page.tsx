"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import Badge from "../../../../components/ui/badge/Badge";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRightIcon } from "@/icons";
import Link from 'next/link';
// Define the TypeScript interface for the table rows
interface Course {
  urlpath: any;
  id: number;
  title: string;
  image: string;
  duration: number;
  status: "Delivered" | "Pending" | "Canceled";
  category?: string;
  price?: string;
  shortname: string;
}

// Define the table data using the interface


export default function RecentOrders() {

  const [courses, setCourses] = useState<Course[]>([]);

  const [loading, setLoading] = useState(true);
  //const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  useEffect(() => {
    const enrolled = localStorage.getItem('enrolledcourses');
    const courses = enrolled ? enrolled.split(",").map(course => course.trim()) : [];
    setEnrolledCourses(courses);
  }, []);
  
  useEffect(() => {
    axios.get<Course[]>('https://www.backstagepass.co.in/reactapi/featured_courses_api.php')
  .then((response) => {
    setCourses(response.data);
    setLoading(false);
  })
  .catch((err) => {
    console.error('Error fetching courses:', err);
   // setError('There was an error fetching the courses data!');
    setLoading(false);
  });
  }, []); // Runs only once after the first render

  const [roleFromStorage, setRoleFromStorage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role");
      setRoleFromStorage(role);
    }
  }, []);

  if (!roleFromStorage) return null; // or a loader while role loads

  // const handleViewMore = () => {
  //   window.open(path, '_blank'); // Open the URL in a new tab/window
  // };
  const handlePaynow = () => {
   const pathpaynow='https://www.backstagepass.co.in/landingpage/short-course';
    window.open(pathpaynow, '_blank'); // Open the URL in a new tab/window
  };



  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
           Courses Offered
          </h3>
        </div>

       

        <div className="flex items-center gap-3">
        <div className="hidden lg:block">
            <form onSubmit={(e) => {
                e.preventDefault(); // prevent page refresh on enter
              }}>
              <div className="relative">
                <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                      fill=""
                    />
                  </svg>
                </span>
                <input
                 // ref={inputRef}
                  type="text"
                  placeholder="Search or type command..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                />

                <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                  <span> ⌘ </span>
                  <span> K </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">

        
          
          
         

     
          

          <div className="course-section">
  {filteredCourses.length > 0 ? (
    filteredCourses.map((course, index) => {
      const isEnrolled = enrolledCourses.includes(course.shortname);
      return (
        
        <div className="course-grid"  key={index}>
            <div className="course-card">
              
              <Image
                  width={100}
                  height={100}
                  src={course.image}
                  className="course-image"
                  alt={course.title}
                />
                <div className="course-details">
              <h3 className="course-title">{course.title}</h3>
              <div className="course-info"><p><strong>Duration:</strong> {course.duration} {"Hours"}</p><p><strong>Mode:</strong> Online &amp; Interactive</p><p><strong>Coming Soon</strong></p></div>
              <a style={{marginRight: "10px"}}  onClick={() => {
      if (course.urlpath) {
        window.open(course.urlpath, "_blank"); // opens in a new tab
      } else {
        alert("URL not available");
      }
    }}  rel="noopener noreferrer"><button className="view-button">View More</button></a>
              {/* <a href="https://www.backstagepass.co.in/landingpage/short-course" target="_blank" rel="noopener noreferrer"><button className="view-button">Pay Now</button></a> */}
              </div>
              </div>
              </div>
        
      );
    })
  ) : (
    <TableRow>
      <td colSpan={4} className="text-center text-gray-500">
        No courses available.
      </td>
    </TableRow>
  )}


         </div>
      </div>
    </div>
  );
}
