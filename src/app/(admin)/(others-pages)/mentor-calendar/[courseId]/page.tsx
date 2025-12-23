"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { DayPicker, DateRange } from "react-day-picker";
import 'react-day-picker/dist/style.css';
import { SlotGrid } from "@/components/SlotGrid";
import { useParams } from "next/navigation";

export default function MentorCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const params = useParams();
  const courseId = Array.isArray(params.courseId)
    ? params.courseId[0]
    : params.courseId;
 
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="text-2xl font-semibold mb-6">🗓️ Mentor Availability </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 rounded-xl shadow-md">
        {/* Left: Calendar */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Select Date</h2>
          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              showOutsideDays
              disabled={{ before: new Date() }}
              className="text-gray-800"
              modifiersClassNames={{
                selected: "bg-brand-500 text-white",
                today: "text-brand-500 font-bold",
                disabled: "opacity-30 cursor-not-allowed",
              }}
            />
            {selectedDate && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: <strong>{format(selectedDate, "PPP")}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Right: Slot Grid */}
        <div className="overflow-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Select Time</h2>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <SlotGrid
        selectedDate={selectedDate || new Date()}
        courseId={courseId || ""}
      />
          </div>
        </div>
      </div>
    </div>
  );
}