"use client";

import { useState, useEffect, useMemo, KeyboardEvent } from "react";
import Image from "next/image";
import { Heart } from 'lucide-react';
import axios from "axios";
import { Lock, PlayCircle, ShoppingCart } from "lucide-react";


type Course = {
  coursetype: number;
  duration: number;
  course_id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  level: string;
  urlpath: string;
  tags: string[];
  is_coursecompleted?: number | null;
};

export default function CourseGrid() {
  const [favourites, setFavourites] = useState<{ [key: number]: boolean }>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [email, setEmail] = useState("");

  const [showAccessModal, setShowAccessModal] = useState(false);
const [lockedCourse, setLockedCourse] = useState<Course | null>(null);


  const isCourse = (course: Course) => course.coursetype === 1;

const isLiveWebinar = (course: Course) =>
  course.coursetype === 3 ;


const isRecordedWebinar = (course: Course) =>
  course.coursetype === 2 ;

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


  const unique = <T,>(arr: T[]): T[] => [...new Set(arr)];


  // ---------- SEARCH + FILTER STATE ----------
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const levelOptions = ["Beginner", "Intermediate", "Advanced"];
  const categoryOptions = ["Game Design", "Game Art"];



  useEffect(() => {
    axios
      .get("https://www.backstagepass.co.in/reactapi/featured_courses_api.php")
      .then((response) => {
        const formatted: Course[] = response.data.map((item: any) => ({
          course_id: Number(item.id),
          title: item.title,
          description: item.description || item.shortname || "No description available",
          image: item.image,
          category: item.category,
          level: item.level,
          urlpath: item.urlpath,
          coursetype: Number(item.coursetype),   // 🔥 IMPORTANT
          duration: Number(item.duration),       // 🔥 IMPORTANT
          tags: [item.category, item.level, item.shortname],
        }));


        setCourses(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setLoading(false);
      });
  }, []);



  const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && keywordInput.trim()) {
      e.preventDefault();
      const value = keywordInput.trim().toLowerCase();
      if (!keywords.includes(value)) {
        setKeywords((prev) => [...prev, value]);
      }
      setKeywordInput("");
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords((prev) => prev.filter((k) => k !== kw));
  };
  const mapCategory = (cat: string): Course["category"] => {
    const c = cat.toLowerCase();
    if (c.includes("design")) return "frontend";
    if (c.includes("art")) return "uiux";
    return "fullstack"; // fallback
  };
  const mapLevel = (lvl: string): Course["level"] => {
    const l = lvl.toLowerCase();
    if (l === "beginner") return "beginner";
    if (l === "intermediate") return "intermediate";
    return "beginner"; // default
  };
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      if (categoryFilter !== "all" && course.category !== categoryFilter) return false;
      if (levelFilter !== "all" && course.level !== levelFilter) return false;

      if (keywords.length > 0) {
        const haystack = (course.title + " " + course.description + " " + course.tags.join(" ")).toLowerCase();
        if (!keywords.some((kw) => haystack.includes(kw.toLowerCase()))) return false;
      }

      return true;
    });
  }, [courses, categoryFilter, levelFilter, keywords]);




  // ---------- FAVOURITE LOGIC ----------
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

  // ================= TEMP: STATIC RECORDED WEBINARS =================
const staticRecordedWebinars: Course[] = [
  {
    course_id: 9001,
    title: "Game Art Masterclass – Complete Recorded Session",
    description:
      "A full recorded masterclass covering the fundamentals of game art, workflows, and best practices used in the industry.",
    image:
      "https://images.unsplash.com/photo-1511376777868-611b54f68947",
    category: "Game Art",
    level: "Beginner",
    urlpath: "/recorded/game-art-masterclass",
    coursetype: 3,
    duration: 6,
    tags: ["game art", "recorded", "masterclass"],
  },
  {
    course_id: 9002,
    title: "Unity Basics – Recorded Webinar",
    description:
      "Learn Unity basics in this on-demand recorded webinar. Covers editor overview, components, and simple gameplay logic.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978",
    category: "Game Design",
    level: "Beginner",
    urlpath: "/recorded/unity-basics",
    coursetype: 3,
    duration: 4,
    tags: ["unity", "recorded", "game dev"],
  },
  {
    course_id: 9003,
    title: "Build Your First Game – Recorded Session",
    description:
      "Step-by-step recorded session on building your first playable game from scratch.",
    image:
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72",
    category: "Game Design",
    level: "Intermediate",
    urlpath: "/recorded/build-first-game",
    coursetype: 3,
    duration: 5,
    tags: ["game design", "recorded"],
  },
  {
    course_id: 9004,
    title: "Career Path in Game Development – Recorded Webinar",
    description:
      "Recorded career-focused webinar covering roles, skills, portfolios, and industry expectations.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    category: "Game Design",
    level: "Beginner",
    urlpath: "/recorded/game-dev-career",
    coursetype: 3,
    duration: 3,
    tags: ["career", "recorded", "webinar"],
  },
];
// ================= END STATIC DATA =================




  return (
    <div className="w-full bg-gray-50 py-10">
      <div className="max-w-8xl mx-auto px-4">
        {loading && (
  <div className="text-center py-10 text-gray-500">
    Loading courses...
  </div>
)}
        {/* ---------- SEARCH BAR (Naukri / LinkedIn style) ---------- */}
        <div className="mb-8 bg-white shadow-md p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Search Courses
          </h2>

          {/* ---------- FILTERS ---------- */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end mt-4 alignEqual">

            {/* Search Input */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-medium text-gray-700">Search</label>
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeywordKeyDown}
                placeholder="Search by course name, skill or keyword..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Type a skill and press <span className="font-semibold">Enter</span> or{" "}
                <span className="font-semibold">,</span> to add multiple keywords.
              </p>

            </div>


            {/* Category filter */}
            <div className="lg:w-48 mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="all">All</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Level filter */}
            <div className="lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="all">All</option>
                {levelOptions.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>
          </div>

          {(categoryFilter !== "all" || levelFilter !== "all") && (
            <button
              onClick={() => {
                setKeywords([]);
                setCategoryFilter("all");
                setLevelFilter("all");
              }}
              className="text-sm text-blue-600 underline mt-3 flex justify-end w-full"
            >
              Reset Filters
            </button>
          )}


          {/* Keyword chips */}
          {keywords.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {keywords.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => removeKeyword(kw)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium border border-red-200"
                >
                  {kw}
                  <span className="text-[10px]">✕</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setKeywords([])}
                className="text-xs text-gray-500 underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* ---------- GRID ---------- */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* {filteredCourses
  .filter((course) => isCourse(course) || isLiveWebinar(course))
  .map((course) => ( */}
   {filteredCourses
  .filter((course) => isCourse(course) || isLiveWebinar(course) || isRecordedWebinar(course))
  .map((course) => (

            <div
              key={course.course_id}
              className={`bg-white shadow-lg flex flex-col h-full relative
    ${course.coursetype === 3
                  ? "border-2 border-green-500 ring-2 ring-green-200"
                  : "border border-gray-100"
                }
  `}
            >
              <div className="relative w-full h-52">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                {course.coursetype === 3 && (
                  <span className="absolute top-3 left-3 bg-green-600 text-white text-[11px] font-semibold px-4 py-1 rounded-full shadow-md tracking-wide">
                    🔴 LIVE WEBINAR
                  </span>
                )}

                {course.coursetype === 1 && (
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-semibold px-4 py-1 rounded-full shadow-md tracking-wide">
                    📘 COURSE
                  </span>
                )}
                 {course.coursetype === 2 && (
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-semibold px-4 py-1 rounded-full shadow-md tracking-wide">
                    📘 RECORDED WEBINARS
                  </span>
                )}

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

              <h3 className="mt-4 pl-5 text-lg font-semibold text-gray-800">
                {course.title}
              </h3>
              <p className="mt-1 pl-5 text-xs text-gray-500">
                {course?.category?.toUpperCase()} • {course?.level?.toUpperCase()}
              </p>

              {course.coursetype === 3 && (
                <div className="mx-5 mt-2 bg-green-50 border border-green-200 rounded-md px-3 py-1 text-xs font-semibold text-green-700 flex items-center gap-2">
                  🟢 Live Session
                  <span className="text-green-500">•</span>
                  Limited Seats
                </div>
              )}

              {course.coursetype === 1 && (
                <div className="mx-5 mt-2 bg-blue-50 border border-blue-200 rounded-md px-3 py-1 text-xs font-semibold text-blue-700 flex items-center gap-2">
                  📘 Self-Paced
                  <span className="text-blue-400">•</span>
                  Learn Anytime
                </div>
              )}

              <p className="mt-2 pl-5 pr-5 mb-6 text-sm text-gray-600 line-clamp-3">
                {course.description}
              </p>
              <div className="pl-5 pr-5 pb-5 flex gap-3 mt-auto">
                {/* {(course.coursetype === 1 || course.coursetype === 3) && ( */}
                  <button
                    onClick={() => {
                      if (course.urlpath) {
                        window.open('/basics-of-maya-for-beginners', "_blank");
                      } else {
                        alert("URL not available");
                      }
                    }}
                    disabled={!course.urlpath}
                    className={`px-6 py-3 rounded-md text-sm font-semibold w-full transition-all duration-200
  ${course.urlpath
                        ? course.coursetype === 3
                          ? "bg-green-600 text-white hover:bg-green-700 hover:scale-[1.02]"
                          : "bg-red-600 text-white hover:bg-red-700 hover:scale-[1.02]"
                        : "bg-gray-400 text-white cursor-not-allowed"
                      }
`}
                  >
                    {course.coursetype === 3 ? "Register Now" : "Know More"}
                  </button>
                {/* )} */}
              </div>
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <div className="col-span-full text-center text-gray-500 text-sm">
              No courses match your search. Try different keywords or filters.
            </div>
          )}
        </div>
      </div>

      {/* ---------- MODAL ---------- */}
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

    {/* ================= RECORDED WEBINARS ================= */}
<div className="mt-20">

  <h2 className="text-2xl font-bold text-gray-900 mb-8">
    Recorded Webinars
  </h2>

  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {[...staticRecordedWebinars, ...courses.filter(isRecordedWebinar)]
      .slice(0, 4)
      .map((course) => (
        <div
          key={course.course_id}
          className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
        >
          {/* Thumbnail */}
          <div className="relative h-56">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/30" />

            <span className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-semibold px-4 py-1 rounded-full shadow">
              🎥 RECORDED WEBINAR
            </span>

            <div className="absolute inset-0 flex items-center justify-center">
  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
    <span className="text-purple-600 text-xl ml-[2px]">▶</span>
  </div>
</div>
          </div>

          {/* Content */}
          <div className="px-5 pt-4 flex-1">
            <h3 className="text-lg font-bold text-gray-900">
              {course.title}
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              {course.category.toUpperCase()} • {course.level.toUpperCase()}
            </p>

            <div className="mt-4 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold px-4 py-2 rounded-lg">
              🎧 On-Demand • Watch Anytime
            </div>

            <p className="mt-3 text-sm text-gray-600 line-clamp-3">
              {course.description}
            </p>
          </div>

          {/* CTA */}
          <div className="px-5 pb-5 mt-auto">
            <button
  onClick={() => handleWatchNow(course)}
  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl"
>
  Watch Now
</button>

          </div>
        </div>
      ))}
  </div>
</div>
{/* ================= END RECORDED WEBINARS ================= */}

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
          <button
            onClick={() => {
              window.open(`/basics-of-maya-for-beginners`, "_blank");
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-transform hover:scale-[1.02]"
          >
            <ShoppingCart className="w-4 h-4" />
            Buy Course
          </button>

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
  );
}
function mapCategory(category: any) {
  throw new Error("Function not implemented.");
}

function mapLevel(level: any) {
  throw new Error("Function not implemented.");
}

