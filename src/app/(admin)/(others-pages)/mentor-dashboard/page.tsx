"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import MentorDashboards from "@/components/charts/MentorDashboard";
import { saveFcmToken } from "@/utils/saveFcmToken";

type Session = {
  expired_message: string;
  session_status: string;
  id: number;
  first_name: string;
  last_name: string;
  display_date: string;
  slot: string;
  zoom_link?: string;
  summary: string;
};

function parseSessionDate(displayDate: string, slot: string) {
  const year = new Date().getFullYear();
  return new Date(`${displayDate} ${year} ${slot}`);
}

const MentorDashboard = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [upcoming, setUpcoming] = useState<Session[]>([]);
  const [requests, setRequests] = useState<Session[]>([]);
  const [totalSessionCount, setTotalSessionCount] = useState(0);

  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllRequests, setShowAllRequests] = useState(false);
  //const [mentorId, setMentorId] = useState<string | null>(null);
  //   useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     setMentorId(localStorage.getItem("mentor_id"));
  //   }
  // }, []);

  useEffect(() => {
  if (user?.mentor_id) {
    saveFcmToken(user.mentor_id, "mentor");
  }
}, [user]);


  useEffect(() => {
    if (loading) return;

    if (!user || user.role !== "mentor") {
      router.replace("/login");
    }
  }, [loading, user, router]);

  /* ================= API ================= */
  const mentorId = user?.mentor_id;


  /* ================= API ================= */
  useEffect(() => {
    if (!mentorId) return;

    const ts = Date.now(); // 🔥 cache buster

    fetch(
      `https://backstagepass.co.in/reactapi/get_upcoming_sessions.php?mentorid=${mentorId}&type=upcoming&_=${ts}`,
      { cache: "no-store" }
    )
      .then(res => res.json())
      .then(setUpcoming)
      .catch(console.error);

    fetch(
      `https://backstagepass.co.in/reactapi/get_upcoming_sessions.php?mentorid=${mentorId}&type=total&_=${ts}`,
      { cache: "no-store" }
    )
      .then(res => res.json())
      .then(data => setTotalSessionCount(data.total))
      .catch(console.error);

    fetch(
      `https://backstagepass.co.in/reactapi/get_sessions.php?mentorid=${mentorId}&_=${ts}`,
      { cache: "no-store" }
    )
      .then(res => res.json())
      .then(setRequests)
      .catch(console.error);

  }, [mentorId]);

  const updateStatus = async (
    session_id: number,
    status: "accepted" | "declined"
  ) => {
    try {
      const res = await fetch(
        "https://backstagepass.co.in/reactapi/update_session_status.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session_id, status }),
        }
      );

      if (!res.ok) {
        throw new Error("Status update failed");
      }

      const result = await res.json();

      if (result?.success !== true) {
        throw new Error(result?.message || "Update failed");
      }

      // ✅ Success alert
      alert(
        status === "accepted"
          ? "Session accepted successfully ✅"
          : "Session declined successfully ❌"
      );

      // 🔥 Cache-busted GET
      const listRes = await fetch(
        `https://backstagepass.co.in/reactapi/get_sessions.php?mentorid=${mentorId}&_=${Date.now()}`,
        {
          cache: "no-store",
        }
      );

      const data = await listRes.json();
      setRequests(data);
    } catch (error) {
      console.error(error);

      // ❌ Error alert
      alert("Something went wrong. Please try again.");
    }
  };

  

const enableNotifications = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    localStorage.setItem("notify_enabled", "true");
    alert("Notifications activated ✅");
  }
};


 useEffect(() => {
  if (localStorage.getItem("notify_enabled") !== "true") return;
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  if (!upcoming.length) return;

  const notifiedKey = "session_notified";
  const notified = JSON.parse(localStorage.getItem(notifiedKey) || "{}");

  const interval = setInterval(() => {
    const now = new Date();

    upcoming.forEach(session => {
      const sessionTime = parseSessionDate(
        session.display_date,
        session.slot
      );

      const diffMin = Math.floor(
        (sessionTime.getTime() - now.getTime()) / 60000
      );

      const sessionId = session.id;
      const fullName =
        session.first_name +
        (session.last_name ? ` ${session.last_name}` : "");

      // 🔔 2-MIN TEST (change to 30 later)
     
       const notification = new Notification("⏰ Session Reminder", {
  body: [
    `📘 ${session.coursename}`,
    `👩‍🎓 ${fullName}`,
    `🗓 ${session.display_date} • ${session.slot}`,
    `🔗 Click to join Zoom`,
  ].join("\n"),
  icon:
    "https://learning.backstagepass.co.in/images/logo/bsp_logo_newupdated.png",
});

notification.onclick = () => {
  if (session.zoom_link) {
    window.open(session.zoom_link, "_blank");
  }
};



        notified[`${sessionId}_30`] = true;
      
    });

    localStorage.setItem(notifiedKey, JSON.stringify(notified));
  }, 60 * 5000); // every 1 minute

  return () => clearInterval(interval);
}, [upcoming]);




  if (!user || user.role !== "mentor") return null;

  

  /* ================= VIEW LOGIC ================= */
  const visibleUpcoming = showAllUpcoming ? upcoming : upcoming.slice(0, 2);
  const visibleRequests = showAllRequests ? requests : requests.slice(0, 2);

  const maxRows = Math.max(
    visibleUpcoming.length,
    visibleRequests.length
  );

  const rows = Array.from({ length: maxRows }).map((_, index) => ({
    upcoming: visibleUpcoming[index],
    request: visibleRequests[index],
  }));

  console.log("rows", rows);

  function isSessionExpired(displayDate: string, slot: string) {
    // Example:
    // displayDate = "January 20"
    // slot = "11:00 AM"

    const year = new Date().getFullYear(); // current year
    const sessionDateTime = new Date(`${displayDate} ${year} ${slot}`);
    const now = new Date();

    return now > sessionDateTime;
  }

  const sendSessionNotification = async (upcoming: Session) => {
    console.log("Clicked", upcoming);

    if (!("Notification" in window)) {
      alert("Notifications not supported");
      return;
    }

    if (Notification.permission !== "granted") {
      alert("Permission not granted");
      return;
    }

    // 🔔 Foreground notification
    new Notification("🎓 Session Reminder", {
      body: `${upcoming.first_name} • ${upcoming.display_date} • ${upcoming.slot}`,
      icon: "https://learning.backstagepass.co.in/images/logo/bsp_logo_newupdated.png",
    });
  };





  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Here’s your mentoring activity at a glance.
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total Sessions" value={totalSessionCount} color="red" />
          <StatCard title="Upcoming Sessions" value={upcoming.length} color="yellow" />
          <StatCard title="Students Mentored" value={0} color="green" />
        </div>

        {/* ================= CHART ================= */}
        <div className="mt-10 bg-white rounded-xl border shadow-sm p-6">
          {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Session Analytics
          </h3> */}
          <MentorDashboards />
        </div>

        {/* ================= UPCOMING + REQUESTS ================= */}
        <div className="mt-12">
          {/* Headers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Upcoming Sessions
            </h3>
            <h3 className="text-xl font-semibold text-gray-800">
              Recent Booking Requests
            </h3>
          </div>

          {/* Rows */}
          <div className="grid gap-6">
            {rows.map((row, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LEFT CARD */}
                {row.upcoming ? (
                  <div className="h-full bg-white border rounded-xl p-5 shadow-sm flex justify-between items-center">
             {/* <button onClick={enableNotifications}>
  🔔 Enable Session Reminders
</button> */}

                    <div>
                      <p className="font-semibold text-gray-800">
                        {row.upcoming.first_name} {row.upcoming.last_name}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {row.upcoming.display_date} · {row.upcoming.slot}
                      </p>
                    </div>
                    {row.upcoming.zoom_link ? (
                      isSessionExpired(row.upcoming.display_date, row.upcoming.slot) ? (
                        <span className="text-sm  font-medium text-red-300 cursor-not-allowed">
                          Session Expired
                        </span>
                      ) : (
                        <a
                          href={row.upcoming.zoom_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-red-600 hover:underline"
                        >
                          Join Zoom →
                        </a>
                      )
                    ) : (
                      <span className="text-sm text-gray-400">
                        No Zoom link
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-left justify-left bg-gray-50 border border-dashed rounded-xl p-8 text-left">
                    <p className="text-gray-400 font-medium">
                      No Upcoming Sessions
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      New Upcoming Sessions will appear here once students book sessions.
                    </p>
                  </div>
                )}

                

                {/* RIGHT CARD */}
                {row.request ? (
                  <div className="h-full bg-white border rounded-xl p-5 shadow-sm flex flex-col justify-between">
                    <p className="text-gray-800 font-medium">
                      {row.request.summary}
                    </p>
                    <div className="flex gap-3 mt-4">
                      {row.request.session_status === "expired" ? (
                        <span className="text-sm font-semibold text-red-500">
                          {row.request.expired_message}
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => updateStatus(row.request.id, "accepted")}
                            className="px-4 py-2 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white"
                          >
                            Accept
                          </button>

                          <button
                            onClick={() => updateStatus(row.request.id, "declined")}
                            className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white"
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </div>

                  </div>
                ) : (
                  <div className="flex flex-col items-left justify-left bg-gray-50 border border-dashed rounded-xl p-8 text-left">
                    <p className="text-gray-400 font-medium">
                      No recent booking requests
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      New requests will appear here once students book sessions.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* VIEW MORE BUTTONS (INSIDE CORRECT COLUMN) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-3">
            <div>
              {upcoming.length > 2 && (
                <button
                  onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  {showAllUpcoming ? "Show less" : "View more"}
                </button>
              )}
            </div>

            <div>
              {requests.length > 2 && (
                <button
                  onClick={() => setShowAllRequests(!showAllRequests)}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  {showAllRequests ? "Show less" : "View more"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= STAT CARD ================= */
const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: "red" | "yellow" | "green";
}) => {
  const colorMap = {
    red: "border-red-500 text-red-600",
    yellow: "border-yellow-400 text-yellow-500",
    green: "border-green-500 text-green-600",
  };

  return (
    <div
      className={`bg-white rounded-xl border-l-4 ${colorMap[color]} p-5 shadow-sm`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
};

export default MentorDashboard;
