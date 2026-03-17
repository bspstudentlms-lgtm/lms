"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/icons";

interface Course {
  course_per_completed: number;
  recording_available(recording_available: any): unknown;
  islivesession_missed(islivesession_missed: any): unknown;
  watched_topics: number;
  zoom_link: string;
  date: string;
  webinar_status: number;
  webinarstatus: string;
  coursetype: 2 | 1 | 3;
  last_watched_topic_id: number;
  is_coursecompleted: number;
  urlpath: string;
  id: number;
  title: string;
  image: string;
  duration: number;
  shortname: string;
}
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
    text: "Enroll Now",
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
export default function DashboardCourses() {
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
      .then(res => setCourses(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (!role) return null;

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
    const enrolledList = filtered.filter(c =>
    enrolledCourses.includes(c.shortname)
  );

  const recommendedList = filtered.filter(
    c => !enrolledCourses.includes(c.shortname)
  );

  /* ================= COURSE CARD ================= */
  const CourseCard = ({ course }: { course: Course }) => {
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
const hasAnyEnrollment = courses.some(
  (course) =>
    enrolledCourses.includes(course.shortname) &&
    Number(course.coursetype) === 1
);

const isPurchased = enrolledCourses.includes(course.shortname);;
const isLivestatus = Number(course.webinar_status) === 2;
const isWebinarCourse = Number(course.coursetype) === 3;

const isEnded = Number(course.islivesession_missed) === 1;

const hasRecording = Number(course.recording_available) === 1; 
//     const isEnrolled = enrolledCourses.includes(course.shortname);
   
//    const isCompleted = Number(course.is_coursecompleted) === 1;
  
//     const cta = CTA_CONFIG[course.coursetype as keyof typeof CTA_CONFIG];
//     //const isStarted = course.last_watched_topic_id !== 0;
//      const isStarted = course.last_watched_topic_id > 0;
//  const style =
//   COURSE_TYPE_STYLES[(course as any).coursetype] ??
//   COURSE_TYPE_STYLES[1];

//     return (
//       <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">
//         <div className="flex gap-4">
//           {/* IMAGE */}
//           <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100">
//             <Image
//               src={course.image}
//               alt={course.title}
//               fill
//               className="object-cover"
//             />

//             {/* COMPLETED RIBBON */}
//             {isCompleted && (
//               <span className="absolute left-2 top-2 rounded-md bg-green-600 px-2 py-1 text-xs font-semibold text-white">
//                 Completed
//               </span>
//             )}
//           </div>

//           {/* CONTENT */}
//           <div className="flex flex-1 flex-col justify-between">
//             <div>
//               <h4 className="text-lg font-semibold text-gray-900 leading-snug">
//                 {course.title}
//               </h4>

//               <span style={{marginRight: "10px"}}
//   className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}
// >
//   {style.label} 
// </span> 
//               <div className="mt-3 flex flex-wrap items-center gap-4">
//                 {/* Duration */}
//                 {/* <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                   <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
//                     ⏱
//                   </span>
//                   {course.duration} Hours
//                 </div> */}
//                 <div className="flex gap-4 text-xs mb-4 text-green-700 mt-3">
//                <span className="flex items-center gap-1">{course.webinarstatus} </span>
              
//       {(course.webinar_status != 2) && (
//   <span className={`flex items-center gap-1 ${style.dn}`}>
//     📅 {course.date ? course.date : "Coming soon"}
//   </span>
// )}
//       <span className="flex items-center gap-1">
//         ⏰ {course.duration ? `${course.duration} Hours` : "To be announced"}
//       </span>
//     </div>

//                 {/* Status */}
//                 {isEnrolled ? (
//                   <span className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
//                     Enrolled
//                   </span>
//                 ) : (
//                   <span className="rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-600">
//                     Not Enrolled
//                   </span>
//                 )}
                
//               </div>
//             </div>

//             {/* ACTION */}
//             <div className="mt-5">
//               {!isEnrolled ? (
//                 <button
//                   onClick={() =>
//                     course.urlpath
//                       ? window.open(course.urlpath, "_blank")
//                       : alert("URL not available")
//                   }
//                   className={`inline-flex items-center justify-center gap-2 w-[50%] rounded-lg px-6 py-2.5 text-sm font-semibold transition border ${cta.className}`}
//                 >
//                   <span>{cta.text} </span>
//                   <ArrowRightIcon />
//                 </button>
//               ) : isCompleted ? (
//                 <span className={`inline-flex items-center justify-center gap-2 w-[50%] rounded-lg px-6 py-2.5 text-sm font-semibold transition border ${cta.className}`}>
//                 <Link
//                   href={`/coursedetails/${course.id}`}
//                   onClick={() => {
//                   localStorage.setItem("courseSourceMenu", "home");
//                   }}
//                   >
//                   Completed ✓
//                   </Link>
//                 </span>
//               ) : (
//                 <Link
//                   href={`/coursedetails/${course.id}`}
//                   onClick={() => {
//                    localStorage.setItem("courseSourceMenu", "home");
//        }}
//                   className={`inline-flex items-center justify-center gap-2 w-[50%] rounded-lg px-6 py-2.5 text-sm font-semibold transition border ${cta.className}`}
//                 >
//                   {isStarted ? "Continue Learning" : "Start Course"}
//                   <ArrowRightIcon />
//                 </Link>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };
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
  isPurchased ? (
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
            {course.webinarstatus ?   <span className="flex items-center gap-1">{course.webinarstatus} </span> : null }
              
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
              {isPurchased && Number(course.coursetype) === 1 && (
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
      <span>Progress</span>
      <span>{Number(course.is_coursecompleted) === 1 ? 100 : progress}%</span>
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
 {isPurchased &&  Number(course.coursetype) === 1 ? (
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
        className="inline-flex items-center gap-2 rounded-lg bg-[#E11D2E] px-6 py-1.5 text-sm font-semibold text-white hover:bg-[#B91C1C] transition"  style={{fontSize: "13px", fontWeight: "400"}}
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

  ) : isPurchased &&  Number(course.coursetype) === 3  && course.webinar_status==2 ?   (

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
        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-1.5 text-sm font-semibold text-white hover:bg-green-700 transition"
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
      <span style={{fontSize: "13px", fontWeight: "400"}}> {
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
      <span style={{fontSize: "13px", fontWeight: "400"}}>{cta.text} </span>
      <ArrowRightIcon />
    </button>
 ) : (
    <a
  href={`/${course.urlpath}`}
 
  className={`inline-flex items-center justify-center gap-2 w-[60%] rounded-lg px-6 py-1.5 text-sm font-semibold transition border ${cta.className}`}
>
  <span style={{fontSize: "13px", fontWeight: "400"}}>{cta.text}</span>
  <ArrowRightIcon />
</a>
  )}
</div>
          </div>
        </div>

        {/* MOBILE STICKY CTA */}
        {isPurchased && !isCompleted && (
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white p-4 sm:hidden">
            <Link
              href={`/coursedetails/${course.id}`}
                   onClick={() => {
    // ✅ set source ONLY when going to course details
    
      localStorage.setItem("courseSourceMenu", "mycourses");
    
  }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E11D2E] py-3 text-base font-semibold text-white"  style={{fontSize: "13px", fontWeight: "400"}}
            >
              Continue Learning
              <ArrowRightIcon />
            </Link>
          </div>
        )}
      </div>
    );
  };
  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-white p-6">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">All Courses</h2>
        <input
          type="text"
          placeholder="Search courses..."
          onChange={e => setSearchTerm(e.target.value)}
          className="h-10 w-72 rounded-lg border px-3 text-sm"
        />
      </div>

      {/* GRID */}
      {loading ? (
        <div className="text-center text-gray-500">Loading courses...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center text-gray-500">No courses found</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
