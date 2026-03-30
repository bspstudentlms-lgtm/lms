"use client";

import { useState, useEffect, useMemo, KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import axios from "axios";
import { Heart, Lock, PlayCircle, ShoppingCart } from "lucide-react";

/* ================= TYPES ================= */
type Course = {
  time: string;
  date: string;

  course_id: number;
  coursetype: number; // 1 = Course, 2 = Recorded, 3 = Live
  title: string;
  description: string;
  image: string;
  category: string;
  level: string;
  urlpath: string;
  duration: string;
  tags: string[];
  webinar_datetime: string;
  mentor_name: string;
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
  const [showFilters, setShowFilters] = useState(false);


const applyFilterAndClose = (callback: () => void) => {
  callback();

  // safer mobile check
  if (typeof window !== "undefined" && window.innerWidth <= 768) {
    setShowFilters(false);
  }
};


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
          shortname: item.shortname,
          level: item.level,
          urlpath: item.urlpath,
          mentor_name: item.mentor_name,
          webinar_datetime: item.webinar_datetime,
          coursetype: Number(item.coursetype),
          duration: item.duration || "0:00",
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
    const text = [
      c.title,
      c.description,
      c.category,
      c.level,
    ]
      .filter(Boolean) // remove undefined/null
      .join(" ")
      .toLowerCase();

    const searchText = search.trim().toLowerCase();

    if (searchText && !text.includes(searchText)) return false;

    if (typeFilter === "course" && c.coursetype !== 1) return false;
    if (typeFilter === "recorded" && c.coursetype !== 2) return false;
    if (typeFilter === "live" && c.coursetype !== 3) return false;

    if (categoryFilter !== "all" && c.category !== categoryFilter)
      return false;

    if (levelFilter !== "all" && c.level !== levelFilter)
      return false;

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

    //if (hasAccess) {
    // user purchased → go inside course
    window.open(`/${course.urlpath}`);
    //} else {
    // user NOT purchased → show popup
    //setLockedCourse(course);
    // setShowAccessModal(true);
    //}
  };

  const formatWebinar = (dateString?: string) => {
    if (!dateString) {
      return {
        date: "Coming Soon",
        time: "",
      };
    }

    // Fix for Safari parsing issue
    const dateObj = new Date(dateString.replace(" ", "T"));

    if (isNaN(dateObj.getTime())) {
      return {
        date: "Coming Soon",
        time: "",
      };
    }

    return {
      date: dateObj.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      time: dateObj.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  /* ================= RENDER ================= */
  return (
    <div>
      <div>

        <div className="mobile-filter-btn">
  <button onClick={() => setShowFilters(true)}>
    Filters ⚙️
  </button>
</div>

<div className={`filters-wrapper ${showFilters ? "show" : ""}`}>
  
  {/* CLOSE BUTTON */}
  <div className="filter-header">
    <h4>Filters</h4>
    <button onClick={() => setShowFilters(false)}>✕</button>
  </div>



        {/* ================= SEARCH SECTION ================= */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-10 space-y-4" style={{ boxShadow: "0 0 10px #cdcdcd", paddingTop: "40px" }}>


          <input
  type="text"
  placeholder="Search courses, webinars, skills..."
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      // close filters on mobile
      if (typeof window !== "undefined" && window.innerWidth <= 768) {
        setShowFilters(false);
      }
    }
  }}
  className="w-full border border-gray-200 rounded-xl px-5 py-3 text-sm 
  focus:outline-none focus:ring-2 focus:ring-red-500"
/>

          {/* FILTER ROW */}
          <div className="flex flex-wrap items-center justify-between gap-4" style={{ marginTop: "20px" }}>


            <div className="product_filter">
              <ul className="flex flex-wrap gap-3" style={{ marginBottom: "0px" }}>
                {[
                  ["all", "All"],
                  ["course", "Course"],
                  ["recorded", "Recorded Webinar"],
                  ["live", "Live Webinar"],
                ].map(([key, label]) => (
                  <li
                    key={key}
                    onClick={() =>
  applyFilterAndClose(() => setTypeFilter(key as any))
}
                    className={`filter
            ${typeFilter === key
                        ? "active"
                        : ""
                      }
          `}
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            {/* SECONDARY FILTERS */}
            <div className="flex gap-3 mobileflexDirection">
              <select
                value={categoryFilter}
                onChange={(e) =>
  applyFilterAndClose(() => setCategoryFilter(e.target.value))
}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white"
              >
                <option value="all">All Categories</option>
                <option value="Game Design">Game Design</option>
                <option value="Game Art">Game Art</option>
                <option value="Game Development">Game Development</option>
              </select>

              <select
                value={levelFilter}
                onChange={(e) =>
  applyFilterAndClose(() => setLevelFilter(e.target.value))
}
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
  {/* YOUR EXISTING FILTER CODE */}
  {/* All, Course, Webinar, Dropdowns etc */}

</div>

        {/* ================= CARDS GRID ================= */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="row">
            {filteredCourses.map((course) => {
              /* ============ COURSE CARD ============ */
              if (course.coursetype === 1)
                return (
                  //   <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">

                  //     {/* IMAGE */}
                  //     <div className="relative h-70">
                  //       <Image
                  //         src={course.image}
                  //         alt={course.title}
                  //         fill
                  //         className="object-contain"
                  //       />

                  //       {/* Soft bottom gradient */}
                  //       <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent" />

                  //       {/* Badge */}
                  //       <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-4 py-1 rounded-full">
                  //         📘 COURSE
                  //       </span>
                  //       <button
                  //         onClick={() => handleFavouriteClick(course)}
                  //         className="absolute top-2 right-2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition"
                  //       >
                  //         {favourites[course.course_id] ? (
                  //           <Heart />
                  //         ) : (
                  //           <Heart />
                  //         )}
                  //       </button>
                  //     </div>


                  //     <div className="p-4 flex flex-col flex-1">
                  //       <h4 className="text-lg font-semibold text-gray-900 line-clamp-2 min-h-[48px]">
                  //         {course.title}
                  //       </h4>

                  //       <p className="text-xs text-gray-500 mt-1">
                  //         {course.category} • {course.level}
                  //       </p>

                  //       <p className="text-sm text-gray-600 mt-3 line-clamp-3 min-h-[65px]">
                  //         {course.description}
                  //       </p>


                  //       <Link className="mt-auto" href="/basics-of-maya-for-beginners" >
                  //         <button
                  //           onClick={() => {

                  //             localStorage.clear();
                  //             sessionStorage.clear();
                  //           }}
                  //           className=" w-full py-2.5 rounded-lg border border-red-600 text-red-600 font-semibold
                  //  hover:bg-red-600 hover:text-white transition"
                  //         >
                  //           Know More
                  //         </button></Link>
                  //     </div>


                  //   </div>

                  <div className="col-lg-4 col-sm-6 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
                    <div className="course-slide">
                      <div className="course-img">
                        <a target="_blank" href={course.urlpath}>
                          <img src="assets/images/all-img/c1.png" alt="" />
                          <Image
                            src={course.image}
                            alt={course.title}
                            fill
                          />
                        </a>
                        <div className="course-date">
                          <span className="month bg-blue-600">📘 COURSE</span>
                          <button
                            onClick={() => handleFavouriteClick(course)}
                            className="absolute top-0 right-3 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition" style={{ borderRadius: "32px", boxShadow: "0 0 10px #cdcdcd" }}
                          >
                            {favourites[course.course_id] ? (
                              <Heart />
                            ) : (
                              <Heart />
                            )}
                          </button>
                        </div>

                      </div>
                      <div className="course-content" style={{ minHeight: "340px" }}><a className="c_btn" target="_blank" href={course.urlpath}>{course.category}</a>
                        <h3><a href={course.urlpath} target="_blank"> {course.title}</a></h3>
                        <span><i className="fa fa-graduation-cap"></i>{course.level}</span>
                        <span><i className="fa fa-clock-o"></i>{course.duration} hours</span>
                        <span><i className="fa fa-user"></i>{course.mentor_name ? course.mentor_name : "Mentor"}</span>
                        <span className="course-desc">{course.description}</span>


                      </div>
                    </div>
                  </div>

                );




              if (course.coursetype === 2)
                return (
                  <div className="col-lg-4 col-sm-6 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
                    <div className="course-slide">
                      <div className="course-img">
                        <a target="_blank" href={course.urlpath}>
                          <img src="assets/images/all-img/c1.png" alt="" />
                          <Image
                            src={course.image}
                            alt={course.title}
                            fill
                          />
                        </a>
                        <div className="course-date">
                          <span className="month bg-purple-600">🎥 RECORDED WEBINAR</span>
                          <button
                            onClick={() => handleFavouriteClick(course)}
                            className="absolute top-0 right-3 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition" style={{ borderRadius: "32px", boxShadow: "0 0 10px #cdcdcd" }}
                          >
                            {favourites[course.course_id] ? (
                              <Heart />
                            ) : (
                              <Heart />
                            )}
                          </button>
                        </div>

                      </div>
                      <div className="course-content" style={{ minHeight: "340px" }}><a className="c_btn" href={course.urlpath} target="_blank">{course.category}</a>
                        <h3><a href={course.urlpath} target="_blank"> {course.title}</a></h3>
                        <span><i className="fa fa-graduation-cap"></i>{course.level}</span>
                        <span><i className="fa fa-clock-o"></i>{course.duration} hours</span>
                        <span><i className="fa fa-user"></i>{course.mentor_name ? course.mentor_name : "Mentor"}</span><br />
                        <span className="course-desc">{course.description}</span>


                      </div>
                    </div>
                  </div>
                  //   <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">

                  //     {/* IMAGE */}
                  //     <div className="relative h-70">
                  //       <Image
                  //         src={course.image}
                  //         alt={course.title}
                  //         fill
                  //         className="object-contain"
                  //       />


                  //       <div className="absolute inset-0" />


                  //       <span className="absolute top-4 left-4 bg-purple-600 text-white text-xs px-4 py-1 rounded-full">
                  //         🎥 RECORDED WEBINAR
                  //       </span>

                  //       <button
                  //         onClick={() => handleFavouriteClick(course)}
                  //         className="absolute top-2 right-2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition"
                  //       >
                  //         {favourites[course.course_id] ? (
                  //           <Heart />
                  //         ) : (
                  //           <Heart />
                  //         )}
                  //       </button>


                  //     </div>


                  //     <div className="p-4 flex flex-col flex-1">
                  //       <h4 className="text-lg font-semibold text-gray-900 line-clamp-2 min-h-[48px]">
                  //         {course.title}
                  //       </h4>

                  //       <p className="text-xs text-gray-500 mt-1">
                  //         {course.category} • {course.level}
                  //       </p>

                  //       <p className="text-sm text-gray-600 mt-3 line-clamp-3 min-h-[65px]">
                  //         {course.description}
                  //       </p>


                  //       <button onClick={() => {
                  //         localStorage.removeItem("postLoginRedirect");
                  //         localStorage.removeItem("openEnrollModal");
                  //         sessionStorage.clear();
                  //         handleWatchNow(course);
                  //       }}
                  //         className="mt-auto w-full py-2.5 rounded-lg border border-purple-600 text-purple-600 font-semibold
                  //  hover:bg-purple-600 hover:text-white transition"
                  //       >
                  //         Watch Now
                  //       </button>
                  //     </div>
                  //   </div>

                );


              return (

                // <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col relative">


                //   <div className="absolute inset-x-0 top-0 h-1 bg-green-600" />


                //   <div className="relative h-70">
                //     <Image
                //       src={course.image}
                //       alt={course.title}
                //       fill
                //       className="object-contain"
                //     />


                //     <div className="absolute inset-0" />


                //     <span className="absolute top-4 left-4 bg-green-600 text-white text-xs px-4 py-1 rounded-full flex items-center gap-1">
                //       <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                //       LIVE WEBINAR
                //     </span>
                //     <button
                //       onClick={() => handleFavouriteClick(course)}
                //       className="absolute top-2 right-2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition"
                //     >
                //       {favourites[course.course_id] ? (
                //         <Heart />
                //       ) : (
                //         <Heart />
                //       )}
                //     </button>
                //   </div>


                //   <div className="p-4 flex flex-col flex-1">
                //     <h4 className="text-lg font-semibold text-gray-900 line-clamp-2 min-h-[48px]">
                //       {course.title}
                //     </h4>

                //     <p className="text-xs text-gray-500 mt-1">
                //       {course.category} • {course.level}
                //     </p>

                //     <p className="text-sm text-gray-600 mt-3 line-clamp-3 min-h-[65px]">
                //       {course.description}
                //     </p>


                //     <div className="flex gap-4 text-xs mb-4 text-green-700 mt-3">
                //       <span className="flex items-center gap-1">
                //         📅 {course.date ?? "Coming soon"}
                //       </span>
                //       <span className="flex items-center gap-1">
                //         ⏰ {course.time ?? "To be announced"}
                //       </span>
                //     </div>


                //     <button
                //       className="mt-auto mt-3 w-full py-2.5 rounded-lg border border-green-600 text-green-600 font-semibold
                //  hover:bg-green-600 hover:text-white transition"
                //     >
                //       Register Now
                //     </button>
                //   </div>
                // </div>

                <div className="col-lg-4 col-sm-6 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
                  <div className="course-slide">
                    <div className="course-img">
                      <a target="_blank" href={course.urlpath}>
                        <img src="assets/images/all-img/c1.png" alt="" />
                        <Image
                          src={course.image}
                          alt={course.title}
                          fill
                        />
                      </a>
                      <div className="course-date">
                        <span className="month bg-green-600">🎥 LIVE WEBINAR</span>
                        <button
                          onClick={() => handleFavouriteClick(course)}
                          className="absolute top-0 right-3 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition" style={{ borderRadius: "32px", boxShadow: "0 0 10px #cdcdcd" }}
                        >
                          {favourites[course.course_id] ? (
                            <Heart />
                          ) : (
                            <Heart />
                          )}
                        </button>
                      </div>

                    </div>
                    <div className="course-content" style={{ minHeight: "340px" }}><a className="c_btn" target="_blank" href={course.urlpath}>{course.category}</a>
                      <h3><a href={course.urlpath} target="_blank"> {course.title}</a></h3>
                      {/* <span><i className="fa fa-graduation-cap"></i>{course.level}</span> */}
                      <span> <span>{(() => {
                        const webinar = formatWebinar(course.webinar_datetime);

                        return (
                          <>
                            <span>
                              <i className="fa fa-calendar"></i> {webinar.date}
                            </span>

                            {webinar.time && (
                              <span>
                                <i className="fa fa-clock-o"></i> {webinar.time}
                              </span>
                            )}
                          </>
                        );
                      })()}</span></span>
                      <span><i className="fa fa-user"></i>{course.mentor_name ? course.mentor_name : "Mentor"}</span>
                      <span className="course-desc">{course.description}</span>


                    </div>
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


        {showAccessModal && lockedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">


              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Lock className="text-white w-5 h-5" />
                </div>
                <h2 className="text-white text-lg font-semibold">
                  Access Restricted
                </h2>
              </div>


              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <PlayCircle className="text-purple-600 w-6 h-6 mt-1" />
                  <p className="text-sm text-gray-700 leading-relaxed">
                    This is a <span className="font-semibold">recorded webinar</span>.
                    You need to purchase the course to unlock and watch this content.
                  </p>
                </div>


                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-6">
                  <p className="text-sm font-semibold text-gray-900">
                    {lockedCourse.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {lockedCourse.category} • {lockedCourse.level}
                  </p>
                </div>


                <div className="flex gap-3">


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

      </div>
    </div>
  );
}
