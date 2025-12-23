"use client";

import React, { useEffect,useState } from "react";
import { format } from "date-fns";
interface SlotGridProps {
  selectedDate: Date | string;
   courseId: string;
}

export const SlotGrid: React.FC<SlotGridProps> = ({ selectedDate,courseId }) => {
  
  
 // alert(selectedDate);
 // const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = ["Available"];
  const times = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  // const bookedSlots = new Set([
  //   "Mon-11:00 AM",
  //   "Thu-03:00 PM",
  //   "Sat-12:00 PM",
  // ]);
const dateObj = new Date(selectedDate);
//console.log('before'+dateObj);
  //const formattedDate = dateObj.toISOString().split("T")[0]; // e.g. "2025-07-09"
  const formattedDate = dateObj.toLocaleDateString('en-CA');
  //console.log('after'+formattedDate);
  const [bookedSlotList, setBookedSlotList] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());

  useEffect(() => {
  async function fetchBookedSlots() {
    try {
     const response = await fetch(`https://backstagepass.co.in/reactapi/available-slots.php?courseid=${courseId}`);
      const data = await response.json(); 

      const slots = data.bookedSlots; 
      setBookedSlotList(slots);
      setBookedSlots(new Set(slots)); 
    } catch (error) {
      console.error("Failed to fetch booked slots", error);
    }
  }

  fetchBookedSlots();
}, []);

  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
function to24(time12h: string): string {
  const [time, period] = time12h.split(" ");
  let [hour, minute] = time.split(":").map(Number);

  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
}
  const handleToggleSlot = (day: string, time: string) => {
    const slotKey = `${day}-${time}`;
    if (bookedSlots.has(slotKey)) return;

    setSelectedSlots((prev) =>
      prev.includes(slotKey)
        ? prev.filter((slot) => slot !== slotKey)
        : [...prev, slotKey]
    );
  };

 const handleSave = async () => {
  
  if (!selectedDate || selectedSlots.length === 0) return;
const mentor_id  = localStorage.getItem('mentor_id');
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  // Extract time from slot key (e.g., "Mon-10:00 AM" → "10:00 AM")
  //const times = selectedSlots.map((slot) => slot.split("-")[1]);
 // const full = "2025-07-09-11:00 AM";
 //alert(selectedSlots);
//const times = selectedSlots.map((slot) => slot.slice(11));
const times = selectedSlots.map(slot => to24(slot.slice(11)));
  const payload = {
    mentor_id: mentor_id, // Replace with real mentor ID
    date: formattedDate,
    slots: times,
    courseId: courseId,
  };

  try {
    const response = await fetch("https://backstagepass.co.in/reactapi/insert_availability.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log(result);

    if (result.success) {
      setShowModal(true);
    } else {
      console.error("Error:", result.message);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      {/* Slot Table */}
      <table className="table-auto w-full border border-gray-300 text-sm text-gray-700">
        <thead>
          <tr>
            <th className="border p-2 text-left bg-gray-100">Time / Day </th>
            {days.map((day) => (
              <th key={day} className="border p-2 bg-gray-100 text-center">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
         

  {times.map((time) => {
    const slotKey = `${formattedDate}-${time}`;
    const isBooked = bookedSlots.has(slotKey);
    const isSelected = selectedSlots.includes(slotKey);

    return (
      <tr key={time}>
        <td className="border p-2">{time}</td>
        <td
  onClick={() => handleToggleSlot(formattedDate, time)}
  className={`border p-2 text-center cursor-pointer transition ${
    isBooked
      ? "text-blue-600 font-bold cursor-not-allowed" // blue tick styling
      : isSelected
      ? "bg-green-500 text-white font-bold"
      : "hover:bg-gray-100"
  }`}
>
          {isBooked ? "✓" : isSelected ? "✓" : ""}
        </td>
      </tr>
    );
  })}
</tbody>
      </table>

      {/* Legend */}
      <div className="mt-4 flex gap-6 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-sm border"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-sm border"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white rounded-sm border"></div>
          <span>Available</span>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          Save Slots
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-99999">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">✅ Slots Saved</h2>
            <p className="text-sm mb-3">Selected Slots:</p>
            <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
              {selectedSlots.map((slot, index) => (
                <li key={index}>{slot}</li>
              ))}
              <li>Zoom : <a style={{color: "#f00"}} href="https://zoom.us/j/1111111111">Link</a></li>
            </ul>
            <button
              onClick={closeModal}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
