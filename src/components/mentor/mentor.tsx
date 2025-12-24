"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";

/* ---------------- Types ---------------- */

interface CalendarProps {
  id: string;
}

interface DateEntry {
  key: string;
  label: string;
  value: string;
}

type TimeSlotsMap = Record<string, string[]>;

/* ---------------- Component ---------------- */

const Calendar: React.FC<CalendarProps> = ({ id }) => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const [userId, setUserId] = useState<string | null>(null);
  const [dates, setDates] = useState<DateEntry[]>([]);
  const [timeSlotsMap, setTimeSlotsMap] = useState<TimeSlotsMap>({});
  const [selectedDateKey, setSelectedDateKey] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [mentorid, setMentorid] = useState("");
  const [mentorname, setMentorname] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  useEffect(() => {
    async function loadDateData() {
      try {
        const res = await fetch(
          `https://backstagepass.co.in/reactapi/get-available-dates.php?courseid=${id}`
        );
        const data = await res.json();

        if (!data?.dates?.length) {
          setNoDataMessage("No availability found");
          setDates([]);
          return;
        }

        setDates(data.dates);
        setTimeSlotsMap(data.timeSlotsMap);
        setMentorid(data.mentorid);
        setMentorname(data.mentorname);
        setZoomLink(data.zoomLink);
        setSelectedDateKey(data.dates[0].key);
        setNoDataMessage(null);
      } catch (err) {
        setNoDataMessage("Failed to load availability");
      }
    }

    loadDateData();
  }, [id]);

  /* ---------------- Handlers ---------------- */

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });

  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });

  const handleBooking = async () => {
    try {
      const res = await fetch(
        `https://backstagepass.co.in/reactapi/insert_mentorbook.php?id=${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            mentorid,
            slot: selectedSlot,
            date: selectedDateKey,
          }),
        }
      );

      if (!res.ok) throw new Error("Booking failed");
      setIsBooked(true);
    } catch {
      alert("Booking failed. Please try again.");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="mx-auto max-w-4xl bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      {/* ---------------- Date Tabs ---------------- */}
      <div className="relative mb-6">
         {!noDataMessage && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border p-2 rounded-full hover:bg-gray-100"
        >
          ‹
        </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto no-scrollbar px-8"
        >
          {dates.map((date) => (
            <button
              key={date.key}
              onClick={() => {
                setSelectedDateKey(date.key);
                setSelectedSlot("");
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition
                ${
                  selectedDateKey === date.key
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {date.label}
            </button>
          ))}
        </div>
 {!noDataMessage && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border p-2 rounded-full hover:bg-gray-100"
        >
          ›
        </button>
      )}
      </div>

      {/* ---------------- Slots ---------------- */}
      {noDataMessage ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {noDataMessage}
        </div>
      ) : (
        <>
          <h3 className="text-base font-semibold mb-3">
            Available Time Slots
          </h3>

          <div className="space-y-3">
            {timeSlotsMap[selectedDateKey]?.map((slot) => (
              <label
                key={slot}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition
                  ${
                    selectedSlot === slot
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
              >
                <span className="font-medium">{slot}</span>
                <input
                  type="radio"
                  name="slot"
                  checked={selectedSlot === slot}
                  onChange={() => setSelectedSlot(slot)}
                  className="accent-blue-600"
                />
              </label>
            ))}
          </div>
        </>
      )}

      {/* ---------------- Book Button ---------------- */}
      {selectedSlot && (
        <button
          onClick={handleBooking}
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-xl text-base font-semibold shadow-md hover:bg-blue-700 transition"
        >
          Book {selectedSlot}
        </button>
      )}

      {/* ---------------- Confirmation Modal ---------------- */}
      {isBooked && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl text-center">
            <h2 className="text-xl font-bold text-green-600 mb-2">
              ✅ Booking Confirmed!
            </h2>

            <p className="text-gray-700 mb-4">
              Session booked with <b>{mentorname}</b>
            </p>

            <p className="text-sm text-gray-600">
              <b>Time:</b> {selectedSlot} <br />
              <b>Date:</b>{" "}
              {dates.find((d) => d.key === selectedDateKey)?.label}
            </p>

            <a
              href={zoomLink}
              target="_blank"
              className="block mt-4 text-blue-600 underline break-all"
            >
              Join Zoom
            </a>

            <button
              onClick={() => {
                setIsBooked(false);
                router.push("/calendar");
              }}
              className="mt-6 bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-900"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
