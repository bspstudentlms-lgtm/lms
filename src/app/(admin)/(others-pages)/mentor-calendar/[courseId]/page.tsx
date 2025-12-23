"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { CalendarDays } from "lucide-react";
import { SlotGrid } from "@/components/SlotGrid";
import { useParams } from "next/navigation";

export default function MentorCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const params = useParams();
  const courseId = Array.isArray(params.courseId)
    ? params.courseId[0]
    : params.courseId;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <CalendarDays className="w-7 h-7 text-blue-600" />
          Mentor Availability
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Choose your available dates and time slots for student bookings.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 pt-10 pl-10 pr-10 pb-25">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">

          {/* LEFT – DATE PICKER */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              📅 Select Date
            </h2>

            <div className="h-full rounded-xl border border-gray-200 p-5 bg-white shadow-sm flex flex-col justify-between">

             <div className="flex-1 flex items-center justify-center">
  <DayPicker
    mode="single"
    selected={selectedDate}
    onSelect={setSelectedDate}
    showOutsideDays
    disabled={{ before: new Date() }}
    className="rdp-custom"
    modifiersClassNames={{
      selected: "bg-blue-600 text-white rounded-full",
      today: "text-blue-600 font-semibold",
      disabled: "opacity-30 cursor-not-allowed",
    }}
  />
</div>


              {selectedDate && (
                <div className="mt-4 flex items-center justify-center">
                  <span className="text-sm text-gray-600">
                    Selected:
                    <span className="ml-1 font-medium text-gray-900">
                      {format(selectedDate, "EEEE, MMM d yyyy")}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT – TIME SLOTS */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              ⏰ Select Time
            </h2>

            <div className="h-full rounded-xl border border-gray-200 p-4 bg-white shadow-sm flex flex-col">

              <SlotGrid
                selectedDate={selectedDate || new Date()}
                courseId={courseId || ""}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
