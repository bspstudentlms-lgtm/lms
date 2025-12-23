"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

const courses = [
  {
    course_id: 1,
    title: "React Fundamentals",
    description: "Learn the basics of React including components, hooks, and state management.",
    image: "/images/carousel/game_design_thumbnail.webp",
  },
  {
    course_id: 2,
    title: "Angular Essentials",
    description: "Master Angular core concepts, directives, and services for modern apps.",
    image: "/images/carousel/maya_thumbnail.webp",
  },
  {
    course_id: 3,
    title: "Node.js Mastery",
    description: "Understand backend development using Node.js, Express, and MongoDB.",
    image: "/images/carousel/game_design_thumbnail.webp",
  },
  {
    course_id: 4,
    title: "Next.js Advanced",
    description: "Server-side rendering, API routes, and full-stack with Next.js.",
    image: "/images/carousel/maya_thumbnail.webp",
  },
  {
    course_id: 5,
    title: "UI/UX Design",
    description: "Principles of user experience and creating clean, usable interfaces.",
    image: "/images/carousel/game_design_thumbnail.webp",
  },
];


export default function CourseCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [favourites, setFavourites] = useState<{ [key: number]: boolean }>({});
const [showModal, setShowModal] = useState(false);
const [selectedCourse, setSelectedCourse] = useState<any>(null);
const [email, setEmail] = useState('');

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);
const handleFavouriteClick = (index: number) => {
  setSelectedCourse(courses[index]);
  setShowModal(true);
};

  return (
    <div className="w-full bg-gray-50 py-10">
      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {courses.map((course, index) => (
            <div
              key={index}
              className="min-w-[25%] px-3 md:min-w-[25%] sm:min-w-full"
            >
              <div className="bg-white rounded-2xl shadow-lg flex flex-col h-full">
                <div className="relative w-full h-52">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover rounded-t-2xl"
                  />
                  
                   
              <button
                onClick={() => handleFavouriteClick(index)}
                className="absolute top-2 right-2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition"
              >
                {favourites[index] ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="red"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 7.25c0-2.485-2.015-4.5-4.5-4.5a4.498 4.498 0 00-3.75 2.016A4.498 4.498 0 009.75 2.75c-2.485 0-4.5 2.015-4.5 4.5 0 4.28 6.75 9 6.75 9s6.75-4.72 6.75-9z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 7.25c0-2.485-2.015-4.5-4.5-4.5a4.498 4.498 0 00-3.75 2.016A4.498 4.498 0 009.75 2.75c-2.485 0-4.5 2.015-4.5 4.5 0 4.28 6.75 9 6.75 9s6.75-4.72 6.75-9z"
                    />
                  </svg>
                )}
              </button>
                </div>
                <h3 className="mt-4 pl-5 text-lg font-semibold text-gray-800">
                  {course.title}
                </h3>
                <p className="mt-2 pl-5 pb-5 pr-5 text-sm text-gray-600 line-clamp-3">
                  {course.description}
                </p>
                <div className="pl-5 pr-5 pb-5 flex gap-3">
                  <button
                    className="px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                  >
                    Syllabus
                  </button>
                  <button
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Know More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
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
        <label className="block text-gray-700 font-medium mb-1">Your Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="you@example.com"
        />
      </div>

      <button
       onClick={async () => {
  if (!email || !selectedCourse) return;

  try {
    const response = await fetch('https://backstagepass.co.in/reactapi/save_favourite_course.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        courseid: selectedCourse.course_id, 
      }),
    });

    const result = await response.json();

    if (result.status === 'success') {
      alert('Thanks! You will be notified when the course is live.');
      setFavourites((prev) => ({
        ...prev,
        [courses.indexOf(selectedCourse)]: true,
      }));
      setShowModal(false);
      setEmail('');
    } else if (result.status === 'exists') {
      alert('You have already favourited this course.');
      setShowModal(false);
    } else {
      alert(result.message || 'Something went wrong');
    }
  } catch (error) {
    alert('Network error. Try again later.');
    console.error(error);
  }
}}

        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
      >
        Submit
      </button>
    </div>
  </div>
)}


      {/* Arrows */}
      {/* <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={scrollPrev}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ◀ Prev
        </button>
        <button
          onClick={scrollNext}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Next ▶
        </button>
      </div> */}

      {/* Dots */}
      <div className="flex justify-center gap-3 mt-6">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === selectedIndex ? "bg-red-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
