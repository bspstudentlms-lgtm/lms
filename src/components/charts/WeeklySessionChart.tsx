"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const sessionData = [
  { day: "Mon", sessions: 2 },
  { day: "Tue", sessions: 1 },
  { day: "Wed", sessions: 3 },
  { day: "Thu", sessions: 0 },
  { day: "Fri", sessions: 2 },
  { day: "Sat", sessions: 1 },
  { day: "Sun", sessions: 0 },
];

export default function WeeklySessionChart() {
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-10">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Weekly Mentoring Sessions
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={sessionData}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="sessions" stroke="#4F46E5" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
