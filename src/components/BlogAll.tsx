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
        "https://www.backstagepass.co.in/reactapi/save_favourite_course.php",
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


        <div className="container">
          <div className="row">


            <div className="col-lg-9">
              <div className="row">


                <div className="col-lg-4 col-sm-4 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
                  <div className="single_blog">
                    <div className="img_wrapper">
                    <img src="assets/images/blog/2.png" className="img-fluid" alt="image" />
                    <div className="time-badge">
                      ⏱ 5 mins
                    </div>
                    </div>
                    <div className="content_box">
                      <span>Published Date : <b>17-03-2026</b></span>
                      <h2><a href="/blog-inner">Professional Ceramic Moulding for Beginner</a></h2>
                      <p>What if the most exciting tech career in India isnt about building another SaaS.....</p>
                      <a href="/blog-inner" className="cta"><span>READ MORE</span>
                        <svg width="13px" height="10px" viewBox="0 0 13 10" style={{ top: "-6px" }}>
                          <path d="M1,5 L11,5"></path>
                          <polyline points="8 1 12 5 8 9"></polyline>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-4 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s" data-wow-offset="0">
                  <div className="single_blog">
                    <div className="img_wrapper">
                    <img src="assets/images/blog/2.png" className="img-fluid" alt="image" />
                    <div className="time-badge">
                      ⏱ 4 mins
                    </div>
                    </div>
                    <div className="content_box">
                      <span>Published Date : <b>17-03-2026</b></span>
                      <h2><a href="/blog-inner">Education Is About Create Leaders For Tomorrow </a></h2>
                      <p>What if the most exciting tech career in India isnt about building another SaaS.....</p>
                      <a href="/blog-inner" className="cta"><span>READ MORE</span>
                        <svg width="13px" height="10px" viewBox="0 0 13 10" style={{ top: "-6px" }}>
                          <path d="M1,5 L11,5"></path>
                          <polyline points="8 1 12 5 8 9"></polyline>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-4 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
                  <div className="single_blog">
                    <div className="img_wrapper">
                    <img src="assets/images/blog/2.png" className="img-fluid" alt="image" />
                    <div className="time-badge">
                      ⏱ 3 mins
                    </div>
                    </div>
                    <div className="content_box">
                      <span>Published Date : <b>17-03-2026</b></span>
                      <h2><a href="/blog-inner">Professional Ceramic Moulding for Beginner</a></h2>
                      <p>What if the most exciting tech career in India isnt about building another SaaS.....</p>
                      <a href="/blog-inner" className="cta"><span>READ MORE</span>
                        <svg width="13px" height="10px" viewBox="0 0 13 10" style={{ top: "-6px" }}>
                          <path d="M1,5 L11,5"></path>
                          <polyline points="8 1 12 5 8 9"></polyline>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-4 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
                  <div className="single_blog">
                    <div className="img_wrapper">
                    <img src="assets/images/blog/2.png" className="img-fluid" alt="image" />
                    <div className="time-badge">
                      ⏱ 9 mins
                    </div>
                    </div>
                    <div className="content_box">
                      <span>Published Date : <b>17-03-2026</b></span>
                      <h2><a href="/blog-inner">Professional Ceramic Moulding for Beginner</a></h2>
                      <p>What if the most exciting tech career in India isnt about building another SaaS.....</p>
                      <a href="/blog-inner" className="cta"><span>READ MORE</span>
                        <svg width="13px" height="10px" viewBox="0 0 13 10" style={{ top: "-6px" }}>
                          <path d="M1,5 L11,5"></path>
                          <polyline points="8 1 12 5 8 9"></polyline>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-4 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
                  <div className="single_blog">
                    <div className="img_wrapper">
                    <img src="assets/images/blog/2.png" className="img-fluid" alt="image" />
                    <div className="time-badge">
                      ⏱ 8 mins
                    </div>
                    </div>
                    <div className="content_box">
                      <span>Published Date : <b>17-03-2026</b></span>
                      <h2><a href="/blog-inner">Professional Ceramic Moulding for Beginner</a></h2>
                      <p>What if the most exciting tech career in India isnt about building another SaaS.....</p>
                      <a href="/blog-inner" className="cta"><span>READ MORE</span>
                        <svg width="13px" height="10px" viewBox="0 0 13 10" style={{ top: "-6px" }}>
                          <path d="M1,5 L11,5"></path>
                          <polyline points="8 1 12 5 8 9"></polyline>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-4 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
                  <div className="single_blog">
                    <div className="img_wrapper">
                    <img src="assets/images/blog/2.png" className="img-fluid" alt="image" />
                    <div className="time-badge">
                      ⏱ 5 mins
                    </div>
                    </div>
                    <div className="content_box">
                      <span>Published Date : <b>17-03-2026</b></span>
                      <h2><a href="/blog-inner">Professional Ceramic Moulding for Beginner</a></h2>
                      <p>What if the most exciting tech career in India isnt about building another SaaS.....</p>
                      <a href="/blog-inner" className="cta"><span>READ MORE</span>
                        <svg width="13px" height="10px" viewBox="0 0 13 10" style={{ top: "-6px" }}>
                          <path d="M1,5 L11,5"></path>
                          <polyline points="8 1 12 5 8 9"></polyline>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-4 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
                  <div className="single_blog">
                    <div className="img_wrapper">
                    <img src="assets/images/blog/2.png" className="img-fluid" alt="image" />
                    <div className="time-badge">
                      ⏱ 6 mins
                    </div>
                    </div>
                    <div className="content_box">
                      <span>Published Date : <b>17-03-2026</b></span>
                      <h2><a href="/blog-inner">Professional Ceramic Moulding for Beginner</a></h2>
                      <p>What if the most exciting tech career in India isnt about building another SaaS.....</p>
                      <a href="/blog-inner" className="cta"><span>READ MORE</span>
                        <svg width="13px" height="10px" viewBox="0 0 13 10" style={{ top: "-6px" }}>
                          <path d="M1,5 L11,5"></path>
                          <polyline points="8 1 12 5 8 9"></polyline>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-4 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
                  <div className="single_blog">
                    <div className="img_wrapper">
                    <img src="assets/images/blog/2.png" className="img-fluid" alt="image" />
                    <div className="time-badge">
                      ⏱ 7 mins
                    </div>
                    </div>
                    <div className="content_box">
                      <span>Published Date : <b>17-03-2026</b></span>
                      <h2><a href="/blog-inner">Professional Ceramic Moulding for Beginner</a></h2>
                      <p>What if the most exciting tech career in India isnt about building another SaaS.....</p>
                      <a href="/blog-inner" className="cta"><span>READ MORE</span>
                        <svg width="13px" height="10px" viewBox="0 0 13 10" style={{ top: "-6px" }}>
                          <path d="M1,5 L11,5"></path>
                          <polyline points="8 1 12 5 8 9"></polyline>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-4 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
                  <div className="single_blog">
                    <div className="img_wrapper">
                    <img src="assets/images/blog/2.png" className="img-fluid" alt="image" />
                    <div className="time-badge">
                      ⏱ 9 mins
                    </div>
                    </div>
                    <div className="content_box">
                      <span>Published Date : <b>17-03-2026</b></span>
                      <h2><a href="/blog-inner">Professional Ceramic Moulding for Beginner</a></h2>
                      <p>What if the most exciting tech career in India isnt about building another SaaS.....</p>
                      <a href="/blog-inner" className="cta"><span>READ MORE</span>
                        <svg width="13px" height="10px" viewBox="0 0 13 10" style={{ top: "-6px" }}>
                          <path d="M1,5 L11,5"></path>
                          <polyline points="8 1 12 5 8 9"></polyline>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="category_box">
  <div className="category_header">CATEGORIES</div>

  <ul className="category_list">
    <li className="active">All</li>
    <li>Game Development</li>
    <li>Game Design</li>
    <li>Industry Trends</li>
    <li>AR / VR</li>
    <li>Game Art</li>
    <li>Others</li>
  </ul>
</div>
            </div>
          </div>
        </div>
      


    </div>
    </div>
  );
}
