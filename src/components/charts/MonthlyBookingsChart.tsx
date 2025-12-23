"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const bookingsData = [
  { month: "Jan", count: 4 },
  { month: "Feb", count: 7 },
  { month: "Mar", count: 5 },
  { month: "Apr", count: 9 },
  { month: "May", count: 3 },
  { month: "Jun", count: 6 },
];

export default function MonthlyBookingsChart() {
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-10">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Monthly Booking Summary
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={bookingsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#10B981" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
