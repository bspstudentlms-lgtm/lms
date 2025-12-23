"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/icons";

/* ================= TYPES ================= */
interface Course {
  id: number;
  title: string;
  image: string;
  duration: number;
  shortname: string;
  urlpath: string;

  last_watched_topic_id: number;
  is_coursecompleted: number;
  course_per_completed: number;

  // optional from API (real progress)
  completed_topics?: number;
  total_topics?: number;
}

/* ================= SKELETON ================= */
const CourseSkeleton = () => (
  <div className="animate-pulse rounded-2xl border bg-white p-5">
    <div className="flex gap-5">
      <div className="h-28 w-28 rounded-xl bg-gray-200" />
      <div className="flex-1 space-y-4">
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-2 w-full rounded bg-gray-200" />
        <div className="h-10 w-40 rounded bg-gray-200" />
      </div>
    </div>
  </div>
);

export default function MyCourses() {
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
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!role) return null;

  /* ================= FILTERS ================= */
  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const enrolledList = filtered.filter(c =>
    enrolledCourses.includes(c.shortname)
  );

  const recommendedList = filtered.filter(
    c => !enrolledCourses.includes(c.shortname)
  );

  /* ================= CARD ================= */
  const CourseCard = ({ course, enrolled }: { course: Course; enrolled: boolean }) => {
    const isCompleted = course.is_coursecompleted === 1;
    const isStarted = course.last_watched_topic_id > 0;

          let progress = 0;

  if (course.is_coursecompleted === 1) {
    progress = 100;
  } else if (course.course_per_completed > 0) {
    progress = course.course_per_completed;
  } else {
    progress = 0;
  }

    return (
      <div className="relative rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div className="flex gap-5">
          {/* IMAGE */}
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-cover"
            />

            {/* COMPLETED RIBBON */}
            {isCompleted && (
              <div className="absolute top-2 left-[-36px] rotate-[-45deg] bg-green-600 px-10 py-1 text-xs font-semibold text-white shadow">
                COMPLETED
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 leading-snug">
                {course.title}
              </h4>

              <div className="mt-3 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                    ⏱
                  </span>
                  {course.duration} Hours
                </div>

                {enrolled ? (
                  <span className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
                    Enrolled
                  </span>
                ) : (
                  <span className="rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-600">
                    Not Enrolled
                  </span>
                )}
              </div>

              {/* PROGRESS */}
              {enrolled && (
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs font-medium text-gray-500">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-[#E11D2E] transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ACTION */}
            <div className="mt-5">
  {enrolled ? (
    course.is_coursecompleted == 1 ? (
      <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
        <Link
        href={`/coursedetails/${course.id}`} >
        Completed ✓
        </Link>
      </span>
    ) : course.last_watched_topic_id == 0 ? (
      <Link
        href={`/coursedetails/${course.id}`}
        className="inline-flex items-center gap-2 rounded-lg bg-[#E11D2E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#B91C1C] transition"
      >
        Start Course
        <ArrowRightIcon />
      </Link>
    ) : (
      <Link
        href={`/coursedetails/${course.id}`}
        className="inline-flex items-center gap-2 rounded-lg bg-[#E11D2E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#B91C1C] transition"
      >
        Continue Watching
        <ArrowRightIcon />
      </Link>
    )
  ) : (
    <button
      onClick={() =>
        course.urlpath
          ? window.open(course.urlpath, "_blank")
          : alert("URL not available")
      }
      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition"
    >
      View More
      <ArrowRightIcon />
    </button>
  )}
</div>
          </div>
        </div>

        {/* MOBILE STICKY CTA */}
        {enrolled && !isCompleted && (
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white p-4 sm:hidden">
            <Link
              href={`/coursedetails/${course.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E11D2E] py-3 text-base font-semibold text-white"
            >
              Continue Watching
              <ArrowRightIcon />
            </Link>
          </div>
        )}
      </div>
    );
  };

  /* ================= PAGE ================= */
  return (
    <div className="min-h-screen bg-white p-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <input
          type="text"
          placeholder="Search courses..."
          onChange={e => setSearchTerm(e.target.value)}
          className="h-11 w-full sm:w-80 rounded-xl border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#E11D2E]"
        />
      </div>

      {/* ENROLLED */}
      <h3 className="mb-4 text-lg font-semibold">Enrolled Courses</h3>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <CourseSkeleton key={i} />
          ))}
        </div>
      ) : enrolledList.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-gray-50 py-16 text-center">
          <h4 className="text-lg font-semibold text-gray-800">
            No courses yet
          </h4>
          <p className="mt-1 text-sm text-gray-500">
            Explore courses and start learning today 🚀
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {enrolledList.map(course => (
            <CourseCard key={course.id} course={course} enrolled />
          ))}
        </div>
      )}

      {/* RECOMMENDED */}
      <h3 className="mt-12 mb-4 text-lg font-semibold">Recommended Courses</h3>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {recommendedList.map(course => (
          <CourseCard key={course.id} course={course} enrolled={false} />
        ))}
      </div>
    </div>
  );
}
