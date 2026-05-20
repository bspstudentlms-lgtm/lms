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

  const [blogs, setBlogs] = useState([
  {
    id: 1,
    title: "Professional Ceramic Moulding for Beginner",
    description: "What if the most exciting tech career in India isn’t about building another SaaS product?",
    date: "17-03-2026",
    time: "5 mins",
    image: "/assets/images/blog/1.png",
    url: "/blog-inner",
    category: "Game Development",
  },
  {
    id: 2,
    title: "Education Is About Create Leaders For Tomorrow",
    description: "Learn how modern education is changing the future of creative industries.",
    date: "20-03-2026",
    time: "4 mins",
    image: "/assets/images/blog/2.png",
    url: "/blog-inner",
    category: "Industry Trends",
  },
  {
    id: 3,
    title: "Top 10 Skills Every Game Developer Needs",
    description: "Master coding, creativity, teamwork, and problem solving in gaming.",
    date: "22-03-2026",
    time: "6 mins",
    image: "/assets/images/blog/3.png",
    url: "/blog-inner",
    category: "Game Development",
  },
  {
    id: 4,
    title: "How AR and VR Are Changing Gaming",
    description: "Explore immersive gaming experiences using AR and VR technologies.",
    date: "25-03-2026",
    time: "8 mins",
    image: "/assets/images/blog/3.png",
    url: "/blog-inner",
    category: "AR / VR",
  },
  {
    id: 5,
    title: "Beginner Guide to Game Art Design",
    description: "Understand textures, characters, environments, and visual storytelling.",
    date: "27-03-2026",
    time: "7 mins",
    image: "/assets/images/blog/3.png",
    url: "/blog-inner",
    category: "Game Art",
  },
  {
    id: 6,
    title: "Why Unreal Engine Is Popular in 2026",
    description: "Discover the features that make Unreal Engine the top choice.",
    date: "29-03-2026",
    time: "5 mins",
    image: "/assets/images/blog/3.png",
    url: "/blog-inner",
    category: "Game Development",
  },
  {
    id: 7,
    title: "Career Opportunities in Esports Industry",
    description: "Gaming is no longer just entertainment — it’s a massive industry.",
    date: "01-04-2026",
    time: "9 mins",
    image: "/assets/images/blog/3.png",
    url: "/blog-inner",
    category: "Industry Trends",
  },
  {
    id: 8,
    title: "Unity vs Unreal Engine Comparison",
    description: "Which engine should beginners choose for game development?",
    date: "03-04-2026",
    time: "6 mins",
    image: "/assets/images/blog/3.png",
    url: "/blog-inner",
    category: "Game Development",
  },
  {
    id: 9,
    title: "How to Start a Career in Game Design",
    description: "Build your portfolio and enter the exciting world of game design.",
    date: "05-04-2026",
    time: "5 mins",
    image: "/assets/images/blog/3.png",
    url: "/blog-inner",
    category: "Game Design",
  },
  {
    id: 10,
    title: "Future of Metaverse Gaming",
    description: "The metaverse is opening new possibilities for players and creators.",
    date: "08-04-2026",
    time: "10 mins",
    image: "/assets/images/blog/3.png",
    url: "/blog-inner",
    category: "AR / VR",
  },
]);

  const filteredBlogs = useMemo(() => {
  return blogs.filter((blog) => {
    const searchText = search.trim().toLowerCase();

    const text = [
      blog.title,
      blog.description,
      blog.date,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(searchText);
  });
}, [blogs, search]);


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
<div className="bg-white rounded-2xl shadow-md p-6 mb-10 space-y-4" style={{ boxShadow: "0 0 10px #cdcdcd", paddingTop: "40px" }}>


            <input
              type="text"
              placeholder="Search blogs by title, date, category..."
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


              
              {/* SECONDARY FILTERS */}
              
            </div>
          </div>

        <div className="container">
          <div className="row">


            <div className="col-lg-9">
              <div className="row">
  {filteredBlogs.map((blog) => (
    <div
      key={blog.id}
      className="col-lg-4 col-sm-4 col-xs-12 wow fadeInUp"
    >
      <div className="single_blog">
        <div className="img_wrapper">
          <img
            src={blog.image}
            className="img-fluid"
            alt={blog.title}
          />

          <div className="time-badge">
            ⏱ {blog.time}
          </div>
        </div>

        <div className="content_box">
          <span>
            Published Date : <b>{blog.date}</b>
          </span>

          <h2>
            <a href={blog.url}>{blog.title}</a>
          </h2>

          <p>{blog.description}</p>

          <a href={blog.url} className="cta">
            <span>READ MORE</span>
          </a>
        </div>
      </div>
    </div>
  ))}
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
