"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/icons";

interface Course {
  last_watched_topic_id: number;
  is_coursecompleted: number;
  urlpath: string;
  id: number;
  title: string;
  image: string;
  duration: number;
  shortname: string;
}

export default function DashboardCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= INIT ================= */
  useEffect(() => {
    setRole(localStorage.getItem("role"));
    const enrolled = localStorage.getItem("enrolledcourses");
    setEnrolledCourses(enrolled ? enrolled.split(",").map(c => c.trim()) : []);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    axios
      .get<Course[]>(
        `https://www.backstagepass.co.in/reactapi/featured_courses_api.php?student_id=${userId}`
      )
      .then(res => setCourses(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (!role) return null;

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ================= COURSE CARD ================= */
  const CourseCard = ({ course }: { course: Course }) => {
    const isEnrolled = enrolledCourses.includes(course.shortname);
    const isCompleted = course.is_coursecompleted === 1;
    //const isStarted = course.last_watched_topic_id !== 0;
     const isStarted = course.last_watched_topic_id > 0;

    return (
      <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">
        <div className="flex gap-4">
          {/* IMAGE */}
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-cover"
            />

            {/* COMPLETED RIBBON */}
            {isCompleted && (
              <span className="absolute left-2 top-2 rounded-md bg-green-600 px-2 py-1 text-xs font-semibold text-white">
                Completed
              </span>
            )}
          </div>

          {/* CONTENT */}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 leading-snug">
                {course.title}
              </h4>

              <div className="mt-3 flex flex-wrap items-center gap-4">
                {/* Duration */}
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                    ⏱
                  </span>
                  {course.duration} Hours
                </div>

                {/* Status */}
                {isEnrolled ? (
                  <span className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
                    Enrolled
                  </span>
                ) : (
                  <span className="rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-600">
                    Not Enrolled
                  </span>
                )}
              </div>
            </div>

            {/* ACTION */}
            <div className="mt-5">
              {!isEnrolled ? (
                <button
                  onClick={() =>
                    course.urlpath
                      ? window.open(course.urlpath, "_blank")
                      : alert("URL not available")
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-[#cdcdcd] px-5 py-2.5 text-sm font-semibold text-[#111] hover:bg-red-50"
                >
                  View More
                  <ArrowRightIcon />
                </button>
              ) : isCompleted ? (
                <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                <Link
                  href={`/coursedetails/${course.id}`}  >
                  Completed ✓
                  </Link>
                </span>
              ) : (
                <Link
                  href={`/coursedetails/${course.id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#E11D2E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#B91C1C]"
                >
                  {isStarted ? "Continue Watching" : "Start Course"}
                  <ArrowRightIcon />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-white p-6">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">All Courses</h2>
        <input
          type="text"
          placeholder="Search courses..."
          onChange={e => setSearchTerm(e.target.value)}
          className="h-10 w-72 rounded-lg border px-3 text-sm"
        />
      </div>

      {/* GRID */}
      {loading ? (
        <div className="text-center text-gray-500">Loading courses...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center text-gray-500">No courses found</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
