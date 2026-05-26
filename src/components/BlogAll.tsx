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

interface Category {
  cat_id: number;
  cat_name: string;
}

/* ================= COMPONENT ================= */
export default function CourseGrid() {
  const [favourites, setFavourites] = useState<{ [key: number]: boolean }>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [email, setEmail] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const wordLimit = 14;

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
  fetch(`https://www.backstagepass.co.in/reactapi/blogapi/categories_list.php?t=${Date.now()}`, {
    cache: "no-store"
  })
    .then(response => response.json())
    .then(result => {
      setCategories(result);
    })
    .catch(error => {
      console.error('Error fetching categories:', error);
    });
}, []); 

  /* ---------- FILTER LOGIC ---------- */

  const [blogs, setBlogs] = useState<any[]>([]);

const [currentPage, setCurrentPage] = useState(1);

useEffect(() => {
  setIsLoading(true);

  const url =
    selectedCatId === null
      ? "https://www.backstagepass.co.in/reactapi/blogapi/blog_list.php"
      : `https://www.backstagepass.co.in/reactapi/blogapi/blog_list.php?categoryId=${selectedCatId}`;

  fetch(url, { cache: "no-store" })
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setBlogs(data);
        setCurrentPage(1);
      } else if (data.status === "empty") {
        setBlogs([]);
      }

      setIsLoading(false);
    })
    .catch((err) => {
      console.error("Failed to fetch blogs", err);
      setIsLoading(false);
    });
}, [selectedCatId]);

  const filteredBlogs = useMemo(() => {
  const searchText = search.trim().toLowerCase();

  if (!searchText) return blogs;

  return blogs.filter((blog) => {
    const text = [
      blog.tittle_event,
      blog.description,
      blog.event_s_dt,
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

  
const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>?/gm, "");
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
 {filteredBlogs.map((item) => (
    <div
      key={item.id}
      className="col-lg-4 col-sm-4 col-xs-12 wow fadeInUp"
    >
      <div className="single_blog">
        <div className="img_wrapper">
          <img
            src={`https://www.backstagepass.co.in/blog_new/uploads/events/${item.card_image}`}
            className="img-fluid"
            alt={item.tittle_event}
          />

          <div className="time-badge">
            ⏱ {item.duration} mins
          </div>
        </div>

        <div className="content_box">
          <span>
            Published Date : <b>{item.event_s_dt}</b>
          </span>

          <h2>
            
              <a
										href={`/blogs/${item.event_title_url}`}
										className="cta"
									>
              {item.tittle_event}
              </a>
          </h2>

          <p>
  {item.description
    ? stripHtml(item.description).slice(0, 90) + "..."
    : ""}
</p>

          <a
          href={`/blogs/${item.event_title_url}`}
          className="cta"
        >
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
    {categories.map((category) => (
                  <li key={category.cat_id}>
                    <div className='textrightpc'>
                      <p
                        onClick={() =>
                          setSelectedCatId(
                            selectedCatId === category.cat_id ? null : category.cat_id
                          )
                        }
                        className={selectedCatId === category.cat_id ? 'selected' : ''}
                        style={{ userSelect: 'none', cursor: 'pointer' }}
                      >
                        {category.cat_name}
                      </p>
                    </div>
                  </li>
                ))}
  </ul>
</div>
            </div>
          </div>
        </div>
      


    </div>
    </div>
  );
}
