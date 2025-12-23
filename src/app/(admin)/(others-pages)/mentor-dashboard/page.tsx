// app/mentor-dashboard/page.tsx
"use client";

import React ,{ useEffect, useState }from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import WeeklySessionChart from "@/components/charts/WeeklySessionChart";
import MonthlyBookingsChart from "@/components/charts/MonthlyBookingsChart";
import MentorDashboards from "@/components/charts/MentorDashboard";


const MentorDashboard = () => {

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "mentor") {
      router.replace("/");
    }
  }, [user]);

  

  
  type Session = {
  id: number;
  first_name: string;
  last_name: string;
  scheduled_date: string;
  slot: string;
  zoom_link?: string;
  display_date: string;
  summary: string;
  totalsessioncount: number;
};
const [sessions, setSessions] = useState<Session[]>([]);
const [upcoming, setUpcoming] = useState<Session[]>([]);
const [totalsessioncount, setTotalSessionCount] = useState<number>(0);

const mentor_id = typeof window !== 'undefined' ? localStorage.getItem('mentor_id') : null;

useEffect(() => {
  if (!mentor_id) return;

  fetch(`https://backstagepass.co.in/reactapi/get_upcoming_sessions.php?mentorid=${mentor_id}&type=upcoming`)
    .then((res) => res.json())
    .then((data) => setUpcoming(data))
    .catch((err) => console.error("Error fetching upcoming sessions:", err));
}, [mentor_id]);

useEffect(() => {
  if (!mentor_id) return;

  fetch(`https://backstagepass.co.in/reactapi/get_upcoming_sessions.php?mentorid=${mentor_id}&type=total`)
  .then(res => res.json())
  .then(data => setTotalSessionCount(data.total));
   
}, [mentor_id]);

    const fetchSessions = () => {
    
    fetch(`https://backstagepass.co.in/reactapi/get_sessions.php?mentorid=${mentor_id}`)
      .then((res) => res.json())
      .then((data) => setSessions(data))
      .catch((err) => console.error("Error fetching sessions:", err));
  };

  useEffect(() => {
    fetchSessions();
  }, [mentor_id]);
 const updateStatus = (session_id: number, status: "accepted" | "declined") => {
    fetch("https://backstagepass.co.in/reactapi/update_session_status.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ session_id, status }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetchSessions(); // Refresh list after update
        } else {
          console.error("Failed to update status");
        }
      });
  };
  if (!user || user.role !== "mentor") return null;
  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-semibold text-gray-800">Mentor Dashboard</h1>
      <p className="text-gray-500 mt-2">Welcome back! Here’s what’s happening.</p> */}

      <div className="mb-6">
  <h1 className="text-3xl font-semibold text-gray-800">Welcome back, {user?.name} 👋</h1>
  <p className="text-gray-500 text-sm mt-1">Here’s your mentoring activity at a glance.</p>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <div className="bg-white shadow rounded-xl p-4">
    <p className="text-sm text-gray-500">Total Sessions</p>
    <h2 className="text-2xl font-bold text-brand-600">{totalsessioncount}</h2>
  </div>
  <div className="bg-white shadow rounded-xl p-4">
    <p className="text-sm text-gray-500">Upcoming Sessions</p>
    <h2 className="text-2xl font-bold text-yellow-500">{upcoming.length}</h2>
  </div>
  <div className="bg-white shadow rounded-xl p-4">
    <p className="text-sm text-gray-500">Students Mentored</p>
    <h2 className="text-2xl font-bold text-green-500">0</h2>
  </div>
  {/* <div className="bg-white shadow rounded-xl p-4">
    <p className="text-sm text-gray-500">Average Rating</p>
    <h2 className="text-2xl font-bold text-purple-600">4.8 ⭐</h2>
  </div> */}
</div>

<MentorDashboards />
<WeeklySessionChart />
      <MonthlyBookingsChart />


<div className="mt-10">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Sessions</h3>
      <ul className="space-y-3">
        {upcoming.length === 0 ? (
          <p className="text-gray-500">No upcoming sessions.</p>
        ) : (
          upcoming.map((session) => (
            <li
              key={session.id}
              className="p-4 bg-white rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-700">
                  {session.first_name} {session.last_name}
                </p>
                <p className="text-sm text-gray-500">
                  {session.display_date} · {session.slot}
                </p>
              </div>
              {session.zoom_link ? (
                <a
                  href={session.zoom_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm font-medium underline"
                >
                  Join Zoom
                </a>
              ) : (
                <span className="text-gray-400 text-sm">No Zoom link</span>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
{/* <div className="mt-10">
  <button className="bg-brand-600 hover:bg-brand-700 text-white text-sm px-6 py-2 rounded-md shadow">
    Manage Availability
  </button>
</div> */}

{/* <div className="mt-10">
  <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Booking Requests</h3>
  <div className="space-y-4">
    <div className="p-4 bg-white rounded-xl shadow">
      <p className="text-gray-700 font-medium">Rahul K — wants to book 15 July, 11 AM</p>
      <div className="mt-2 flex gap-3">
        <button className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded-md">Accept</button>
        <button className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-md">Decline</button>
      </div>
    </div>
  </div>
</div> */}
<div className="mt-10">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Booking Requests</h3>
      <div className="space-y-4">
        {sessions.length === 0 ? (
          <p className="text-gray-500">No pending requests.</p>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="p-4 bg-white rounded-xl shadow">
              <p className="text-gray-700 font-medium">{session.summary}</p>
              <div className="mt-2 flex gap-3">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded-md"
                  onClick={() => updateStatus(session.id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-md"
                  onClick={() => updateStatus(session.id, "declined")}
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>



    </div>
  );
};

export default MentorDashboard;
