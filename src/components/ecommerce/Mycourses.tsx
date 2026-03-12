"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/icons";
import EnrollModal from "@/components/EnrollModal";

/* ================= TYPES ================= */
interface Course {
  islivesession_missed(islivesession_missed: any): unknown;

  recording_available(recording_available: any): unknown;
  livewebinar_enddate: boolean;
  zoom_link: string;
  webinar_status: number;
  webinarstatus: string;
  date: string;
  watched_topics: number;
  course_id: number;
  coursetype: number;
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

const COURSE_TYPE_STYLES = {
  1: {
    label: "📘 Course",
    badge: "bg-blue-600 text-white text-[10px]",
    border: "border-l-blue-500",
    bg: "bg-blue-50/40",
    cta: "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
    dn: "displayNone"
  },
  2: {
    label: "  🎥 RECORDED WEBINAR",
    badge: "bg-purple-600 text-white text-[10px]",
    border: "border-l-purple-500",
    bg: "bg-purple-50/40",
    cta: "border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white",
    dn: "displayNone"
  },
  3: {
    label: "  🔴 LIVE WEBINAR",
    badge: "bg-green-600 text-white text-[10px] animate-glow",
    border: "border-l-green-500",
    bg: "bg-green-50/40",
    cta: "border-green-600 text-green-600 hover:bg-green-600 hover:text-white ",
    dn: "displayBlock"
  },
};

const CTA_CONFIG = {
  1: {
    text: "Know More",
    className:
      "border-red-600 text-red-600 hover:bg-red-600 hover:text-white",
  },
  2: {
    text: "Watch Now",
    className:
      "border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white",
  },
  3: {
    text: "Join Webinar",
    className:
      "border-green-600 text-green-600 hover:bg-green-600 hover:text-white",
  },
};




export default function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [open1, setOpen1] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(0);

  /* ================= INIT ================= */
  useEffect(() => {
    setRole(localStorage.getItem("role"));
    const enrolled = localStorage.getItem("enrolledcourses");
    
    setEnrolledCourses(enrolled ? enrolled.split(",").map(c => c.trim()) : []);
  }, []);

  
  // useEffect(() => {
  //   const userId = localStorage.getItem("userId");
  //   axios
  //     .get<Course[]>(
  //       `https://www.backstagepass.co.in/reactapi/featured_courses_api.php?student_id=${userId}`
  //     )
  //     .then(res => {
  //       setCourses(res.data);
  //       setLoading(false);
  //     })
  //     .catch(() => setLoading(false));
  // }, []);



 useEffect(() => {
  const userId = localStorage.getItem("userId");

  axios.get("https://www.backstagepass.co.in/reactapi/featured_courses_api.php", {
    params: {
      student_id: userId,
      t: Date.now()
    }
  })
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

          const style =
  COURSE_TYPE_STYLES[(course as any).coursetype] ??
  COURSE_TYPE_STYLES[1];


  if (course.is_coursecompleted === 1) {
    progress = 100;
  } else if (course.course_per_completed > 0) {
    progress = course.course_per_completed;
  } else {
    progress = 0;
  }

   

  const getLiveCountdown = (dateStr?: string) => {
  if (!dateStr) return null;

  const end = new Date(dateStr).getTime();
  const now = Date.now();
  const diff = end - now;

  if (diff <= 0) return "Session Expired";

  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff / (1000 * 60)) % 60);

  return `${h}h ${m}m left`;
};

const isLive = (course as any).coursetype === 3;

const liveCountdown = getLiveCountdown((course as any).live_end_time);

const cta = CTA_CONFIG[course.coursetype as keyof typeof CTA_CONFIG];
//  const hasAnyEnrollment = enrolledCourses.length > 0;

  const hasAnyEnrollment = courses.some(
  (course) =>
    enrolledCourses.includes(course.shortname) &&
    Number(course.coursetype) === 1
);

const isPurchased = enrolled;
const isLivestatus = Number(course.webinar_status) === 2;
const isWebinarCourse = Number(course.coursetype) === 3;

const isEnded = Number(course.islivesession_missed) === 1;

const hasRecording = Number(course.recording_available) === 1; 
    return (
      <div
  className={`relative rounded-2xl border-l-4 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg
  ${style.border} ${style.bg}`}
>
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
              <h4 className="text-lg font-semibold text-gray-900 leading-snug min-h-[54px]">
                {course.title}
              </h4>

              <span style={{marginRight: "10px"}}
  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}
>
  {style.label} 
</span> 
{Number(course.coursetype) !== 2 && (
  enrolled ? (
                  <span className="rounded-full bg-green-100 px-4 py-1.5 text-[10px] font-semibold text-green-700">
                    Enrolled 
                  </span>
                ) : (
                  <span className="rounded-full bg-orange-100 px-4 py-1.5 text-[10px] font-semibold text-orange-600">
                    Not Enrolled 
                  </span>
                )
)}

{isLive && (
  <span className="mt-3 inline-flex items-center gap-2 rounded-lg bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
    ⏰ {liveCountdown} 
  </span>
 
  
)}


              <div className="mt-3 flex flex-wrap items-center gap-4">
                {/* <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                    ⏱
                  </span>
                  {course.duration} Hours
                </div> */}

               
              </div>
              {/* {course.coursetype} */}

              <div className="flex gap-4 text-xs mb-4 text-green-700 mt-3">
              {course.webinarstatus ? <span className="flex items-center gap-1">{course.webinarstatus} </span> : null}
              
      {(course.webinar_status != 2) && (
  <span className={`flex items-center gap-1 ${style.dn}`}>
    📅 {course.date ? course.date : "Coming soon"}
  </span>
)}
      <span className="flex items-center gap-1">
        ⏰ {course.duration ? `${course.duration} Hours` : "To be announced"}
      </span>
    </div>

              {/* PROGRESS */}
              {enrolled && Number(course.coursetype) === 1  && (
                <div className="mt-4">
  <div className="mb-1 flex justify-between text-xs font-medium text-gray-500">
    <span>Progress</span>
    <span>
      {Number(course.is_coursecompleted) === 1 ? 100 : progress}%
      
    </span>
  </div>

  <div className="h-2 w-full rounded-full bg-gray-200">
    <div
      className="h-2 rounded-full bg-[#E11D2E] transition-all"
      style={{
        width: `${
           Number(course.is_coursecompleted) === 1 ? 100 : progress
        }%`,
      }}
    />
  </div>
</div>
              )}
            </div>

            {hasAnyEnrollment && Number(course.coursetype) === 2 && (
  <div className="mt-3">
    <div className="mb-1 flex justify-between text-xs font-medium text-gray-500">
      <span>Progress </span>
       <span>
      {Number(course.is_coursecompleted) === 1 ? 100 : progress}%
      
    </span>
    </div>

    <div className="h-2 w-full rounded-full bg-gray-200">
      <div
        className="h-2 rounded-full bg-purple-600 transition-all"
        style={{
        width: `${
           Number(course.is_coursecompleted) === 1 ? 100 : progress
        }%`,
      }}
      />
    </div>
  </div>
)}

            {/* ACTION */}
            <div className="mt-3">
 {enrolled &&  Number(course.coursetype) === 1 ? (
    course.is_coursecompleted == 1 ? (
      <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
        <Link
        href={`/coursedetails/${course.id}`}
             onClick={() => {
    // ✅ set source ONLY when going to course details
    
      localStorage.setItem("courseSourceMenu", "mycourses");
    
  }}
        >
        Completed ✓
        </Link>
      </span>
    ) : course.last_watched_topic_id == 0 ? (
      <Link
        href={`/coursedetails/${course.id}`}
         onClick={() => {
    // ✅ set source ONLY when going to course details
    
      localStorage.setItem("courseSourceMenu", "mycourses");
    
  }}
        className="inline-flex items-center gap-2 rounded-lg bg-[#E11D2E] px-6 py-1.5 text-sm font-semibold text-white hover:bg-[#B91C1C] transition"
      >
        Start Course
        <ArrowRightIcon />
      </Link>
    ) : (
      <Link
        href={`/coursedetails/${course.id}`}
             onClick={() => {
    // ✅ set source ONLY when going to course details
    
      localStorage.setItem("courseSourceMenu", "mycourses");
    
  }}
        className="inline-flex items-center gap-2 rounded-lg bg-[#E11D2E] px-6 py-1.5 text-sm font-semibold text-white hover:bg-[#B91C1C] transition"
      >
        Continue Learning
        <ArrowRightIcon />
      </Link>
    )
  
  // ) : enrolled &&  Number(course.coursetype) === 3  && course.webinar_status==2 ?  (
  //   <Link
  //       href={course.zoom_link}
             
  //       className="inline-flex items-center gap-2 rounded-lg bg-[#E11D2E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#B91C1C] transition"
  //     >
  //       Join Webinar
        
  //     </Link>

  ) : enrolled &&  Number(course.coursetype) === 3  && course.webinar_status==2 ?   (

   !isEnded ? (
    // 🟢 LIVE WEBINAR
    <Link
      href={course.zoom_link}
      className="inline-flex items-center gap-2 rounded-lg bg-[#E11D2E] px-6 py-1.5 text-sm font-semibold text-white hover:bg-[#B91C1C] transition"
    >
      Join Webinar
    </Link>
  ) :  (

    hasRecording ? (
      // 🎥 WATCH RECORDING
      <Link
        href={`/coursedetails/${course.id}`}
        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition"
      >
        ▶ Watch Recording
      </Link>
    ) : (
      <span className="text-sm text-gray-500">
        Recording will be available soon
      </span>
    )

  )



  ) : (hasAnyEnrollment && Number(course.coursetype) === 2) ? (

    
    
    <Link
      href={`/coursedetails/${course.id}`}
      onClick={() =>
        localStorage.setItem("courseSourceMenu", "mycourses")
      }
      className={`inline-flex items-center justify-center gap-2 w-[60%] rounded-lg px-6 py-1.5 text-sm font-semibold transition border ${cta.className}`}
    >
      <span> {
         course.is_coursecompleted
          ? "Completed ✓"
          : course.watched_topics > 0 
          ?   "Continue Learning"
          : cta.text 
        } </span>
      <ArrowRightIcon />
    </Link>
  ) : Number(course.coursetype) === 3 ? (
     <button
      onClick={() =>
        alert(
          "Please purchase this live webinar to attend"
        )
      }
      className={`inline-flex items-center justify-center gap-2 w-[60%] rounded-lg px-6 py-1.5 text-sm font-semibold transition border ${cta.className}`}
    >
      <span>{cta.text} </span>
      <ArrowRightIcon />
    </button>
 ) : (
    <a
  href={`/${course.urlpath}`}
 
  className={`inline-flex items-center justify-center gap-2 w-[60%] rounded-lg px-6 py-1.5 text-sm font-semibold transition border ${cta.className}`}
>
  <span style={{}}>{cta.text}</span>
  <ArrowRightIcon />
</a>
  )}
</div>
          </div>
        </div>

        {/* MOBILE STICKY CTA */}
        {enrolled && !isCompleted && (
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white p-4 sm:hidden">
            <Link
              href={`/coursedetails/${course.id}`}
                   onClick={() => {
    // ✅ set source ONLY when going to course details
    
      localStorage.setItem("courseSourceMenu", "mycourses");
    
  }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E11D2E] py-3 text-base font-semibold text-white"
            >
              Continue Learning
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
      <h3 className="mt-12 mb-4 text-lg font-semibold">Recommended Free Webinars</h3>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {recommendedList.map(course => (
          <CourseCard key={course.id} course={course} enrolled={false} />
        ))}
      </div>

          <EnrollModal
  open={open1}
  onClose={() => setOpen1(false)}
  courseId={selectedCourseId}
/>
    
    </div>
  );
}
