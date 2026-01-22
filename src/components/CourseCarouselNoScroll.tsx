"use client";

import { useState, useEffect, useMemo, KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import axios from "axios";
import { Heart, Lock, PlayCircle, ShoppingCart } from "lucide-react";

/* ================= TYPES ================= */
type Course = {
  course_id: number;
  coursetype: number; // 1 = Course, 2 = Recorded, 3 = Live
  title: string;
  description: string;
  image: string;
  category: string;
  level: string;
  urlpath: string;
  duration: number;
  tags: string[];
  is_coursecompleted?: number | null;
};

type TypeFilter = "all" | "course" | "recorded" | "live";

/* ================= COMPONENT ================= */
export default function CourseGrid() {
  const [favourites, setFavourites] = useState<{ [key: number]: boolean }>({});
   const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [email, setEmail] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- SEARCH / FILTER STATE ---------- */
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const [showAccessModal, setShowAccessModal] = useState(false);
const [lockedCourse, setLockedCourse] = useState<Course | null>(null);

  /* ---------- FETCH ---------- */
  useEffect(() => {
    axios
      .get("https://www.backstagepass.co.in/reactapi/featured_courses_api.php")
      .then((res) => {
        const formatted: Course[] = res.data.map((item: any) => ({
          course_id: Number(item.id),
          title: item.title,
          description: item.description || "No description",
          image: item.image,
          category: item.category,
          level: item.level,
          urlpath: item.urlpath,
          coursetype: Number(item.coursetype),
          duration: Number(item.duration),
          tags: [item.category, item.level],
        }));
        setCourses(formatted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ---------- FILTER LOGIC ---------- */
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const text =
        (c.title + c.description + c.category + c.level).toLowerCase();

      if (search && !text.includes(search.toLowerCase())) return false;

      if (typeFilter === "course" && c.coursetype !== 1) return false;
      if (typeFilter === "recorded" && c.coursetype !== 2) return false;
      if (typeFilter === "live" && c.coursetype !== 3) return false;

      if (categoryFilter !== "all" && c.category !== categoryFilter)
        return false;
      if (levelFilter !== "all" && c.level !== levelFilter) return false;

      return true;
    });
  }, [courses, search, typeFilter, categoryFilter, levelFilter]);

   const handleFavouriteClick = (course: Course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!email || !selectedCourse) return;

    try {
      const response = await fetch(
        "https://backstagepass.co.in/reactapi/save_favourite_course.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            courseid: selectedCourse.course_id,
          }),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        alert("Thanks! You will be notified when the course is live.");
        setFavourites((prev) => ({
          ...prev,
          [selectedCourse.course_id]: true,
        }));
        setShowModal(false);
        setEmail("");
      } else if (result.status === "exists") {
        alert("You have already favourited this course.");
        setShowModal(false);
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (error) {
      alert("Network error. Try again later.");
      console.error(error);
    }
  };


  const handleWatchNow = (course: Course) => {
  const hasAccess = course.is_coursecompleted === null;

  if (hasAccess) {
    // user purchased → go inside course
    window.open(`/course/${course.urlpath}`, "_blank");
  } else {
    // user NOT purchased → show popup
    setLockedCourse(course);
    setShowAccessModal(true);
  }
};

  /* ================= RENDER ================= */
  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* ================= SEARCH SECTION ================= */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-10 space-y-4">

  {/* SEARCH */}
  <input
    type="text"
    placeholder="Search courses, webinars, skills..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full border border-gray-200 rounded-xl px-5 py-3 text-sm 
               focus:outline-none focus:ring-2 focus:ring-red-500"
  />

  {/* FILTER ROW */}
  <div className="flex flex-wrap items-center justify-between gap-4">

    {/* TYPE FILTER (SEGMENTED CONTROL) */}
    <div className="flex bg-gray-100 rounded-xl p-1">
      {[
        ["all", "All"],
        ["course", "Course"],
        ["recorded", "Recorded Webinar"],
        ["live", "Live Webinar"],
      ].map(([key, label]) => (
        <button
          key={key}
          onClick={() => setTypeFilter(key as any)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition
            ${
              typeFilter === key
                ? "bg-white shadow text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>

    {/* SECONDARY FILTERS */}
    <div className="flex gap-3">
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white"
      >
        <option value="all">All Categories</option>
        <option value="Game Design">Game Design</option>
        <option value="Game Art">Game Art</option>
      </select>

      <select
        value={levelFilter}
        onChange={(e) => setLevelFilter(e.target.value)}
        className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white"
      >
        <option value="all">All Levels</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>
    </div>
  </div>
</div>


        {/* ================= CARDS GRID ================= */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
              /* ============ COURSE CARD ============ */
              if (course.coursetype === 1)
                return (
                 <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">

  {/* IMAGE */}
  <div className="relative h-70">
    <Image
      src={course.image}
      alt={course.title}
      fill
      className="object-contain"
    />

    {/* Soft bottom gradient */}
    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent" />

    {/* Badge */}
    <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-4 py-1 rounded-full">
     📘 COURSE
    </span>
    <button
                  onClick={() => handleFavouriteClick(course)}
                  className="absolute top-2 right-2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition"
                >
                  {favourites[course.course_id] ? (
                    <Heart />
                  ) : (
                    <Heart />
                  )}
                </button>
  </div>

  {/* CONTENT */}
  <div className="p-5 flex flex-col flex-1">
    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 min-h-[48px]">
      {course.title}
    </h3>

    <p className="text-xs text-gray-500 mt-1">
      {course.category} • {course.level}
    </p>

    <p className="text-sm text-gray-600 mt-3 line-clamp-3 min-h-[65px]">
      {course.description}
    </p>

    {/* Meta */}
    {/* <div className="text-xs text-gray-500">
      Self-paced • Learn anytime
    </div> */}

    {/* CTA */}
    <Link className="mt-auto" href="/basics-of-maya-for-beginners" target="_blank">
    <button
      className=" w-full py-2.5 rounded-lg border border-red-600 text-red-600 font-semibold
                 hover:bg-red-600 hover:text-white transition"
    >
      Know More
    </button></Link>
  </div>
</div>

                );

               

              /* ============ RECORDED WEBINAR ============ */
              if (course.coursetype === 2)
                return (
                 <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">

  {/* IMAGE */}
  <div className="relative h-70">
    <Image
      src={course.image}
      alt={course.title}
      fill
      className="object-contain"
    />

    {/* Soft dark overlay */}
    <div className="absolute inset-0" />

    {/* Badge */}
    <span className="absolute top-4 left-4 bg-purple-600 text-white text-xs px-4 py-1 rounded-full">
      🎥 RECORDED WEBINAR
    </span>

     <button
                  onClick={() => handleFavouriteClick(course)}
                  className="absolute top-2 right-2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition"
                >
                  {favourites[course.course_id] ? (
                    <Heart />
                  ) : (
                    <Heart />
                  )}
                </button>

    {/* Play Button (subtle) */}
    {/* <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-11 h-11 bg-white/90 rounded-full flex items-center justify-center shadow">
        <span className="text-purple-600 text-sm ml-[2px]">▶</span>
      </div>
    </div> */}
  </div>

  {/* CONTENT */}
  <div className="p-5 flex flex-col flex-1">
    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 min-h-[48px]">
      {course.title}
    </h3>

    <p className="text-xs text-gray-500 mt-1">
      {course.category} • {course.level}
    </p>

    <p className="text-sm text-gray-600 mt-3 line-clamp-3 min-h-[65px]">
      {course.description}
    </p>

    {/* Meta */}
    {/* <div className="text-xs text-gray-500 mt-3">
      On-demand • Watch anytime
    </div> */}

    {/* CTA */}
    <button onClick={() => handleWatchNow(course)}
      className="mt-auto w-full py-2.5 rounded-lg border border-purple-600 text-purple-600 font-semibold
                 hover:bg-purple-600 hover:text-white transition"
    >
      Watch Now
    </button>
  </div>
</div>

                );


              return (

               <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col relative">

  {/* TOP ACCENT (instead of border) */}
  <div className="absolute inset-x-0 top-0 h-1 bg-green-600" />

  {/* IMAGE */}
  <div className="relative h-70">
    <Image
      src={course.image}
      alt={course.title}
      fill
      className="object-contain"
    />

    {/* SOFT DARK GRADIENT */}
    <div className="absolute inset-0" />

    {/* LIVE BADGE */}
    <span className="absolute top-4 left-4 bg-green-600 text-white text-xs px-4 py-1 rounded-full flex items-center gap-1">
      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      LIVE WEBINAR
    </span>
     <button
                  onClick={() => handleFavouriteClick(course)}
                  className="absolute top-2 right-2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition"
                >
                  {favourites[course.course_id] ? (
                    <Heart />
                  ) : (
                    <Heart />
                  )}
                </button>
  </div>

  {/* CONTENT */}
  <div className="p-5 flex flex-col flex-1">
    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 min-h-[48px]">
      {course.title}
    </h3>

    <p className="text-xs text-gray-500 mt-1">
      {course.category} • {course.level}
    </p>

    <p className="text-sm text-gray-600 mt-3 line-clamp-3 min-h-[65px]">
      {course.description}
    </p>

    {/* DATE & TIME */}
    <div className="flex gap-4 text-xs mb-4 text-green-700 mt-3">
      <span className="flex items-center gap-1">
        📅 {course.date ?? "Coming soon"}
      </span>
      <span className="flex items-center gap-1">
        ⏰ {course.time ?? "To be announced"}
      </span>
    </div>

    {/* META */}
    {/* <div className="text-xs text-gray-500 mt-2 mb-2">
      Live session • Limited seats
    </div> */}

    {/* CTA */}
    <button
      className="mt-auto mt-3 w-full py-2.5 rounded-lg border border-green-600 text-green-600 font-semibold
                 hover:bg-green-600 hover:text-white transition"
    >
      Register Now
    </button>
  </div>
</div>

              );
            })}
          </div>
        )}


 {showModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Add to Favourites</h2>

            <div className="mb-4">
              <p className="text-gray-700 font-medium">Course:</p>
              <p className="text-gray-900">{selectedCourse.title}</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Your Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="you@example.com"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Submit
            </button>
          </div>
        </div>
      )}

        {/* ================= ACCESS MODAL ================= */}
{showAccessModal && lockedCourse && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full">
          <Lock className="text-white w-5 h-5" />
        </div>
        <h2 className="text-white text-lg font-semibold">
          Access Restricted
        </h2>
      </div>

      {/* BODY */}
      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <PlayCircle className="text-purple-600 w-6 h-6 mt-1" />
          <p className="text-sm text-gray-700 leading-relaxed">
            This is a <span className="font-semibold">recorded webinar</span>.
            You need to purchase the course to unlock and watch this content.
          </p>
        </div>

        {/* COURSE INFO */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-6">
          <p className="text-sm font-semibold text-gray-900">
            {lockedCourse.title}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {lockedCourse.category} • {lockedCourse.level}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          {/* <button
            onClick={() => {
              window.open(`/basics-of-maya-for-beginners`, "_blank");
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-transform hover:scale-[1.02]"
          >
            <ShoppingCart className="w-4 h-4" />
            Buy Course
          </button> */}

          <button
            onClick={() => setShowAccessModal(false)}
            className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}
{/* ================= END ACCESS MODAL ================= */}
      </div>
    </div>
  );
}
