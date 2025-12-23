"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRightIcon } from "@/icons";
import Link from 'next/link';

import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
// Define the TypeScript interface for the table rows
interface Course {
  id: number;
  title: string;
  image: string;
  duration: number;
  status: "Delivered" | "Pending" | "Canceled";
  category?: string;
  price?: string;
  shortname: string;
}
interface Student {
  course_per_completed: number;
  first_name: string;
  last_name: string;
  closingdate: string;
  status: string;
}



export default function RecentOrders() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] =  useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
// Define the table data using the interface
 const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    // This runs only on client side after first render
    const storedUserId  = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);
  useEffect(() => {
    const enrolled = localStorage.getItem("enrolledcourses");
    const parsed = enrolled ? enrolled.split(",").map((c) => c.trim()) : [];
    setEnrolledCourses(parsed);
  }, []);

  useEffect(() => {
    axios
      .get("https://www.backstagepass.co.in/reactapi/featured_courses_api.php")
      .then((response) => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setLoading(false);
      });
  }, []);

  const openModal = (course: Course) => {
  setSelectedCourse(course);
  setIsOpen(true);
};

  const closeModal = () => {
    setIsOpen(false);
    setSelectedCourse(null);
  };

  const handleSave = () => {
    console.log("Saving changes...");
    closeModal();
  };

  const handlePaynow = () => {
    window.open(
      "https://www.backstagepass.co.in/landingpage/short-course",
      "_blank"
    );
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
const [students, setStudents] = useState<Student[]>([]);

useEffect(() => {
  if (selectedCourse) {
    fetch(`https://backstagepass.co.in/reactapi/get_students_by_course_and_mentor.php?course_id=${selectedCourse.id}&mentor_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        setStudents(data);
      })
      .catch(err => console.error(err));
  }
}, [selectedCourse,userId]);
  return (
    <div className="overflow-hidden rounded-2xl mt-8 border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Courses List
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
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Courses
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Duration
              </TableCell>

              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Students List
              </TableCell>
             
              
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell>
              
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
  {filteredCourses.length > 0 ? (
    filteredCourses.map((course, index) => {
      const isEnrolled = enrolledCourses.includes(course.shortname);
      return (
        <TableRow key={index} className="">
          <TableCell className="py-3">
            <div className="flex items-center gap-3">
              <div className="h-[100px] w-[100px] overflow-hidden rounded-md">
                <Image
                  width={100}
                  height={100}
                  src={course.image}
                  className="h-[100px] w-[100px]"
                  alt={course.title}
                />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-theme-lg dark:text-white/90">
                  {course.title}
                </p>
                <span className="text-gray-500 text-theme-xs dark:text-gray-400">

                
                  
                </span>
              </div>
            </div>
          </TableCell>
          <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
            {course.duration} {"Hours"}
          </TableCell>
          
          <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
            

  <Badge variant="light" color="primary">
  <a
    href={`mentor-studentsList/${course.id}`}
    style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
  >
    View list
  </a>
</Badge>
              
           


          </TableCell>

          {selectedCourse && (
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[1000px] p-5 lg:p-10"
        >
          <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
           Students List for {selectedCourse.title}
          </h4>
          <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Name
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
               Course completion (%)
              </TableCell>

              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
               Closing date
              </TableCell>
             
              
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                sechudle
              </TableCell>
              
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
   {students.map((student, index) => (
        <TableRow key={index} className="">
          <TableCell className="py-3">
            <div className="flex items-center gap-3">
              
              <div>
                <p className="font-medium text-gray-800 text-theme-lg dark:text-white/90">
                  {student.first_name} {student.last_name || ""}
                </p>
                <span className="text-gray-500 text-theme-xs dark:text-gray-400">

                
                  
                </span>
              </div>
            </div>
          </TableCell>
          <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400 pr-3">
            
  <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
  <div
    className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
    style={{ width: `${student.course_per_completed}%` }}
  >
    {student.course_per_completed}%
  </div>
</div>

          </TableCell>
          
          <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
            

 
      <span style={{ cursor: 'pointer' }}>
         {new Date(student.closingdate).toLocaleDateString()}
      </span>
   


              
           


          </TableCell>

          
        


          <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
            

  <Badge variant="light" color="primary">
    {student.status === 'booked' ? 'Yes' : 'No'}
  </Badge>

              
           


          </TableCell>
        </TableRow>
        ))}
</TableBody>

        </Table>
          <div className="flex items-center justify-end w-full gap-3 mt-8">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
            
          </div>
        </Modal>
        )}


          <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
            

  <Badge variant="light" color="primary" endIcon={<ArrowRightIcon />}>
    <Link href={`/mentor-calendar/${course.id}`}>
      <span style={{ cursor: 'pointer' }}>
        Manage Availability
      </span>
    </Link>
  </Badge>

              
           


          </TableCell>
        </TableRow>
      );
    })
  ) : (
    <TableRow>
      <td colSpan={4} className="text-center text-gray-500">
        No courses available.
      </td>
    </TableRow>
  )}
</TableBody>

        </Table>
      </div>
    </div>
  );
}
