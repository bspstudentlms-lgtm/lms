"use client";
import React, { useEffect, useState } from "react";
import { CalendarDays, Video, CircleX, Loader   } from "lucide-react";

function getCurrentWeekDayStrings() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // Sunday - Saturday : 0 - 6
  const monday = new Date(today);

  // Calculate the date for Monday of the current week
  const diffToMonday = (dayOfWeek + 6) % 7;
  monday.setDate(today.getDate() - diffToMonday);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const weekDaysWithDates = days.map((day, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dayOfMonth = date.getDate();
    return `${dayOfMonth} ${day}`;
  });

  return weekDaysWithDates;
}

const hours = ["9 AM","10 AM","11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM" ,"5 PM","6 PM"];
//const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const days = getCurrentWeekDayStrings();
const todayIndex = new Date().getDay() - 1; // Mon = 0
interface Event {
  dayIndex: number;
  time: string;
  title: string;
  zoom: string;
  mentor: string;
  color: string;
}

// const events = [
//   {
//     dayIndex: 1, // Tuesday
//     time: "1 PM",
//     title: "Zoom with Manasa",
//     zoom: "https://zoom.us/j/1111111111",
//     mentor: "Manasa M.",
//     color: "purple",
//   },
//   {
//     dayIndex: 3, // Thursday
//     time: "1 PM",
//     title: "Zoom with Sanjay",
//     zoom: "https://zoom.us/j/2222222222",
//     mentor: "Sanjay K.",
//     color: "green",
//   },
  // {
  //   dayIndex: 3, // Thursday again
  //   time: "1 PM",
  //   title: "Zoom with Ravi",
  //   zoom: "https://zoom.us/j/3333333333",
  //   mentor: "Ravi R.",
  //   color: "blue",
  // },
//];


export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
useEffect(() => {
fetch("https://backstagepass.co.in/reactapi/get_events.php")
  .then(res => res.text())
  .then(text => {
    console.log("Raw response:", text);
    const json = JSON.parse(text); // Catch HTML disguised as JSON
    setEvents(json);
  })
  .catch(err => console.error("Parsing failed:", err));
}, []);
  return (
    <div className="p-6 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <CalendarDays className="w-7 h-7 text-blue-500" />
        Calendar
      </h1>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-6 border-t border-l text-center text-sm font-medium min-w-[900px]">
          {/* Header Row */}
          <div className="bg-gray-100"></div>
          {days.map((day, idx) => (
            <div
              key={day}
              className={`border-r border-b py-2 ${
                idx === todayIndex ? "bg-blue-50 font-semibold text-blue-700" : "bg-gray-100"
              }`}
            >
              {day}
            </div>
          ))}

          {/* Time Rows */}
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              {/* Time column */}
              <div className="border-b border-r py-4 px-2 text-right text-sm text-gray-500 bg-white sticky left-0 z-10">
                {hour}
              </div>

              {/* Event grid */}
              {days.map((_, i) => (
                <div
  key={`${hour}-${i}`}
  className="relative h-[120px] border-b border-r bg-white overflow-hidden"
>
                  {/* Dummy event at 1 PM on Tue */}
                  {events
  .filter((e) => e.time === hour && e.dayIndex === i)
  .map((event, idx) => (
    <div
      key={idx}
      className={`absolute left-1 right-1 bg-${event.color}-100 border border-${event.color}-300 text-${event.color}-800 text-xs p-2 rounded-lg shadow-sm transition`}
      style={{ top: `${idx * 65}px` }} // stacks neatly
    >
      <div className="flex items-center gap-1 font-semibold mb-1">
       {event.color === "green" && <Video className="w-4 h-4" />}
       {event.color === "error" && <CircleX className="w-4 h-4" />}
       {event.color === "orange" && <Loader className="w-4 h-4" />}
        {event.title}
      </div>
      {event.zoom && (
  <a
    href={event.zoom}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 underline break-all"
  >
    {event.color === "green" ? "Join Zoom" : ""}
    
  </a>
)}
      {/* <div className="text-[10px] text-gray-500 mt-1">with {event.mentor}</div> */}
    </div>
))}

                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
