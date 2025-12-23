"use client";

import { useState,useEffect, useMemo, KeyboardEvent } from "react";
import Image from "next/image";
import { Heart } from 'lucide-react';
import axios from "axios";

type Course = {
  urlpath: any;
  course_id: number;
  title: string;
  description: string;
  image: string;
  category: string;  // now accepts any category from API
  level: string;     // now accepts any level from API
  tags: string[];    // used for search
};





export default function CourseGrid() {
  const [favourites, setFavourites] = useState<{ [key: number]: boolean }>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [email, setEmail] = useState("");
  
  
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

  return (
    <div className="w-full bg-gray-50 py-10">
      <div className="max-w-8xl mx-auto px-4">
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
          {filteredCourses.map((course) => (
            <div
              key={course.course_id}
              className="bg-white shadow-lg flex flex-col h-full"
            >
              <div className="relative w-full h-52">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                />

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
              <p className="mt-2 pl-5 pb-5 pr-5 text-sm text-gray-600 line-clamp-3">
                {course.description}
              </p>
              <div className="pl-5 pr-5 pb-5 flex gap-3 mt-auto">
                
                <button
    onClick={() => {
      if (course.urlpath) {
        window.open(course.urlpath, "_blank"); // opens in a new tab
      } else {
        alert("URL not available");
      }
    }}
    className={`px-6 py-2 rounded-md text-sm w-full ${
      course.urlpath
        ? "bg-red-600 text-white hover:bg-red-700"
        : "bg-gray-400 text-white cursor-not-allowed"
    }`}
    disabled={!course.urlpath}
  >
    Know More
  </button>
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
    </div>
  );
}
function mapCategory(category: any) {
  throw new Error("Function not implemented.");
}

function mapLevel(level: any) {
  throw new Error("Function not implemented.");
}

