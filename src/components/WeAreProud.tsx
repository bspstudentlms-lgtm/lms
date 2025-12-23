"use client";
import React from "react";

const stats = [
  { value: "3916363", label: "Learners" },
  { value: "194", label: "Mentors" },
  { value: "51455295", label: "Lines of Code Submission" },
  { value: "1673", label: "Videos" },
];

const progressStats = [
  { value: 72, label: "of Learners complete their courses within 3 months" },
  { value: 78, label: "of Learners could recollect the concepts faster" },
  { value: 84, label: "of Learners have better understanding over complex topics" },
];

export default function ProudSection() {
  return (
    <div className="py-16 bg-white">
      <h2 className="text-center text-3xl font-bold mb-12">
        We are proud of...
      </h2>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-gray-50 p-6 text-center rounded-lg shadow-sm"
          >
            <p className="text-green-600 text-3xl font-bold">{stat.value}</p>
            <p className="text-gray-600 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Circular Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {progressStats.map((stat, i) => (
          <div
            key={i}
            className="bg-gray-50 p-6 rounded-lg shadow-sm flex items-center"
          >
            {/* Circle */}
            <div className="relative w-24 h-24 flex items-center justify-center mr-4">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#22c55e"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={
                    2 * Math.PI * 40 - (stat.value / 100) * (2 * Math.PI * 40)
                  }
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-lg font-bold text-gray-900">
                {stat.value}%
              </span>
            </div>

            {/* Label */}
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
