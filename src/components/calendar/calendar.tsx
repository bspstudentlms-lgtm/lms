"use client";

import { Video, CalendarDays, Clock } from "lucide-react";
import { useEffect, useState } from "react";

/* ================= TYPES ================= */
interface Event {
   mentor_status: "pending" | "declined" | "accepted";
  dayIndex: number; // 0=Mon ... 4=Fri (from API)
  time: string;     // "11 AM"
  title: string;
  zoom: string;
  mentor: string;
}

/* ================= HELPERS ================= */
function getCurrentWeek() {
  const today = new Date();
  const day = today.getDay(); // 0=Sun, 1=Mon

  // find Monday
  const monday = new Date(today);
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(today.getDate() + diff);

  return Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    return {
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate(),
      fullDate: d,
    };
  });
}

function isSessionExpired(dateObj: Date, timeStr: string) {
  const [time, meridiem] = timeStr.split(" ");
  let hours = parseInt(time, 10);

  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  const sessionDateTime = new Date(dateObj);
  sessionDateTime.setHours(hours, 0, 0, 0);

  return Date.now() > sessionDateTime.getTime();
}

/* ================= COMPONENT ================= */
export default function MentorCalendar() {
  const [events, setEvents] = useState<Event[]>([]);

  const weekDays = getCurrentWeek();

  const todayIndex = weekDays.findIndex(
    d => d.fullDate.toDateString() === new Date().toDateString()
  );

  const [activeDay, setActiveDay] = useState(
    todayIndex !== -1 ? todayIndex : 0
  );

  const currentMonthYear = weekDays[0].fullDate.toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  useEffect(() => {
    fetch("https://backstagepass.co.in/reactapi/get_events.php?_=" + Date.now())
      .then(res => res.json())
      .then(setEvents)
      .catch(console.error);
  }, []);

  const dayEvents = events.filter(e => e.dayIndex === activeDay);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm">

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-6">
        <CalendarDays className="w-6 h-6 text-red-600" />
        <h2 className="text-2xl font-bold">Mentor Calendar</h2>
      </div>

      {/* MONTH */}
      <p className="text-sm text-gray-500 mb-3">{currentMonthYear}</p>

      {/* WEEK STRIP */}
      <div className="flex gap-3 mb-8">
        {weekDays.map((day, idx) => (
          <button
            key={idx}
            onClick={() => setActiveDay(idx)}
            className={`w-20 rounded-xl border py-3 text-center transition
              ${activeDay === idx
                ? "bg-red-600 text-white shadow"
                : "bg-gray-50 hover:bg-gray-100"}`}
          >
            <p className="text-xs">{day.label}</p>
            <p className="text-lg font-bold">{day.date}</p>
          </button>
        ))}
      </div>

      {/* SELECTED DAY */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-gray-500" />
        <h3 className="text-lg font-semibold">
          {weekDays[activeDay].label},{" "}
          {weekDays[activeDay].fullDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </h3>
      </div>

      {/* EVENTS */}
      {dayEvents.length === 0 ? (
        <div className="text-gray-500 text-sm bg-gray-50 p-6 rounded-xl">
          No sessions scheduled for this day
        </div>
      ) : (
        <div className="space-y-4">
          {dayEvents.map((event, idx) => {
            const expired = isSessionExpired(
              weekDays[activeDay].fullDate,
              event.time
            );

            return (
              <div
                key={idx}
                className={`flex items-center justify-between rounded-xl p-4 border
                  ${expired
                    ? "bg-gray-50 border-gray-200"
                    : "bg-green-50 border-green-300"}`}
              >
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    <Video className="w-4 h-4 text-green-600" />
                    {event.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    ⏰ {event.time}
                  </p>
                </div>

                {expired ? (
  <span className="text-sm font-semibold text-red-500">
    Session Expired
  </span>
) : event.zoom && event.mentor_status === "accepted" ? (
  <a
    href={event.zoom}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold"
  >
    Join Zoom
  </a>
) : event.mentor_status === "pending" ? (
  <span className="text-sm text-yellow-600 font-semibold">
    Approval Pending
  </span>
) : event.mentor_status === "declined" ? (
  <span className="text-sm text-red-500 font-semibold">
    Declined
  </span>
) : (
  <span className="text-sm text-gray-400">
    No Zoom link
  </span>
)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
