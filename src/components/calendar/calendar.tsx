"use client";
import { Video, CalendarDays, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface Event {
  dayIndex: number; // 0=Mon
  time: string;
  title: string;
  zoom: string;
  mentor: string;
}

const days = [
  { label: "Mon", date: 19 },
  { label: "Tue", date: 20 },
  { label: "Wed", date: 21 },
  { label: "Thu", date: 22 },
  { label: "Fri", date: 23 },
];

export default function MentorCalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeDay, setActiveDay] = useState(1); // Tue

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
      <p className="text-sm text-gray-500 mb-3">January 2026</p>

      {/* DAY STRIP (CALENDAR FEEL) */}
      <div className="flex gap-3 mb-8">
        {days.map((day, idx) => (
          <button
            key={day.label}
            onClick={() => setActiveDay(idx)}
            className={`w-20 rounded-xl border py-3 text-center transition
              ${activeDay === idx
                ? "bg-red-600 text-white shadow"
                : "bg-gray-50 hover:bg-gray-100"}
            `}
          >
            <p className="text-xs">{day.label}</p>
            <p className="text-lg font-bold">{day.date}</p>
          </button>
        ))}
      </div>

      {/* SELECTED DAY LABEL */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-gray-500" />
        <h3 className="text-lg font-semibold">
          {days[activeDay].label}, Jan {days[activeDay].date}
        </h3>
      </div>

      {/* EVENTS */}
      {dayEvents.length === 0 ? (
        <div className="text-gray-500 text-sm bg-gray-50 p-6 rounded-xl">
          No sessions scheduled for this day
        </div>
      ) : (
        <div className="space-y-4">
          {dayEvents.map((event, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-green-50 border border-green-300 rounded-xl p-4"
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

              {event.zoom && (
                <a
                  href={event.zoom}
                  target="_blank"
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold"
                >
                  Join Zoom
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
