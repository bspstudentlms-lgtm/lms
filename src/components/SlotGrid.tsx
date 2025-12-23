"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Check, Lock } from "lucide-react";

interface SlotGridProps {
  selectedDate: Date | string;
  courseId: string;
}

export const SlotGrid: React.FC<SlotGridProps> = ({ selectedDate, courseId }) => {
  const times = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  const dateObj = new Date(selectedDate);
  const formattedDate = dateObj.toLocaleDateString("en-CA");

  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchBookedSlots() {
      try {
        const res = await fetch(
          `https://backstagepass.co.in/reactapi/available-slots.php?courseid=${courseId}`
        );
        const data = await res.json();
        setBookedSlots(new Set(data.bookedSlots || []));
      } catch (err) {
        console.error("Failed to load booked slots", err);
      }
    }
    fetchBookedSlots();
  }, [courseId]);

  function to24(time12h: string): string {
    const [time, period] = time12h.split(" ");
    let [hour, minute] = time.split(":").map(Number);
    if (period === "PM" && hour < 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0"
    )}:00`;
  }

  const toggleSlot = (time: string) => {
    const key = `${formattedDate}-${time}`;
    if (bookedSlots.has(key)) return;

    setSelectedSlots((prev) =>
      prev.includes(key)
        ? prev.filter((s) => s !== key)
        : [...prev, key]
    );
  };

  const closeModal = () => {
  setShowModal(false);
};


  const handleSave = async () => {
    if (!selectedSlots.length) return;

    const mentor_id = localStorage.getItem("mentor_id");
    const payload = {
      mentor_id,
      date: format(selectedDate as Date, "yyyy-MM-dd"),
      slots: selectedSlots.map((s) => to24(s.slice(11))),
      courseId,
    };

    const res = await fetch(
      "https://backstagepass.co.in/reactapi/insert_availability.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();
    if (result.success) setShowModal(true);
  };

  return (
    <div className="space-y-5">
      {/* Slots */}
      <div className="space-y-3">
        {times.map((time) => {
          const key = `${formattedDate}-${time}`;
          const isBooked = bookedSlots.has(key);
          const isSelected = selectedSlots.includes(key);

          return (
            <div
              key={time}
              onClick={() => toggleSlot(time)}
              className={`
                flex items-center justify-between px-4 py-3 rounded-lg border transition
                ${isBooked
                  ? "bg-blue-50 border-blue-300 cursor-not-allowed"
                  : isSelected
                    ? "bg-green-500 text-white border-green-600 shadow-sm"
                    : "bg-white hover:bg-gray-50 cursor-pointer"
                }
              `}
            >
              <span className="font-medium">{time}</span>

              {isBooked && (
                <span className="flex items-center gap-1 text-blue-600 text-sm">
                  <Lock className="w-4 h-4" /> Booked
                </span>
              )}

              {isSelected && (
                <span className="flex items-center gap-1 text-white text-sm">
                  <Check className="w-4 h-4" /> Selected
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-500 rounded" />
          Selected
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-blue-500 rounded" />
          Booked
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 border rounded bg-white" />
          Available
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow"
        >
          Save Slots
        </button>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal */}
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Slots Saved Successfully
                </h2>
                <p className="text-sm text-gray-500">
                  Your availability has been updated
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4" />

            {/* Slot List */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Selected Slots
              </p>

              <ul className="space-y-2 max-h-40 overflow-auto">
                {selectedSlots.map((slot, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 border text-sm"
                  >
                    <span className="text-gray-700">{slot}</span>
                    <span className="text-green-600 font-medium">✓</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-5 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
