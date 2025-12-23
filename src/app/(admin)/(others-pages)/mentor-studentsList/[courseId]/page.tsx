// app/mentor-dashboard/page.tsx
"use client";

import React ,{ useEffect, useState }from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter,useParams   } from "next/navigation";

import MentorDashboards from "@/components/charts/MentorDashboardStudentsList";


const MentorDashboard = () => {
 const params = useParams();
const courseId = params.courseId as string;

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
  <p className="text-gray-500 text-sm mt-1">Here’s your mentoring activity at a glance .</p>
</div>



<MentorDashboards   courseId={courseId} />




    </div>
  );
};

export default MentorDashboard;
