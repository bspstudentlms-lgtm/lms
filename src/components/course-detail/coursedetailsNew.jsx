"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { PlayCircle } from "lucide-react";
import Calendar from "@/components/mentor/mentor";
import Muxvideo from "@/components/MuxVideoplayer";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface CourseClientProps {
  id: string;
}

type TopicBase = {
  id: string | number;
  text: string;
  type: "video" | "quiz";
  watched?: boolean;
  video_duration?: string;
  mentor_name?: string;
};

type VideoTopic = TopicBase & {
  type: "video";
  video: any[];
  playback_id?: string;
  video_format?: string;
  video_duration?: string;
  description?: string;
  locked?: boolean;
};

type QuizTopic = TopicBase & {
  type: "quiz";
  question: string;
  options: string[];
  correct: string;
};

type Topic = VideoTopic | QuizTopic;

type Module = {
  score?: React.ReactNode;
  is_last?: string;
  mandatory_status?: string;
  quiz_score?: React.ReactNode;
  type?: string;
  id: string | number;
  title: string;
  topics: Topic[];
  completed?: string;
  total_video_duration?: string;
  file?: string;
};

type AssignmentState = {
  releaseAt?: string | null;
  downloaded?: boolean;
  submittedAt?: string | null;
  submittedFileName?: string | null;
  evaluated?: boolean;
};

/* ---------------- AssignmentPanel ---------------- */
interface AssignmentPanelProps {
  courseId: string;
  studentWindowWeeks?: number;
  mentorWindowWeeks?: number;
  assignmentFile?: any;
}
function AssignmentPanel({
  courseId,
  studentWindowWeeks = 2,
  mentorWindowWeeks = 1,
  assignmentFile,
}: AssignmentPanelProps) {
  const STORAGE_KEY = `bp_assignment_course_${courseId}`;
  const [state, setState] = useState<AssignmentState>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      return raw
        ? (JSON.parse(raw) as AssignmentState)
        : {
            releaseAt: null,
            downloaded: false,
            submittedAt: null,
            submittedFileName: null,
            evaluated: false,
          };
    } catch {
      return {
        releaseAt: null,
        downloaded: false,
        submittedAt: null,
        submittedFileName: null,
        evaluated: false,
      };
    }
  });

  const [notice, setNotice] = useState<string | null>(null);
  const isMentor =
    typeof window !== "undefined" && localStorage.getItem("role") === "mentor";

  useEffect(() => {
    try {
      if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, STORAGE_KEY]);

  const releaseAtDate = state.releaseAt ? new Date(state.releaseAt) : null;
  const submissionDate = state.submittedAt ? new Date(state.submittedAt) : null;
  const mentorDeadline = submissionDate
    ? new Date(submissionDate.getTime() + mentorWindowWeeks * 7 * 24 * 60 * 60 * 1000)
    : null;

  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const [sp, setSp] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [studentDeadline, setStudentDeadline] = useState<Date | null>(null);
  const [studentWindowActive, setStudentWindowActive] = useState(false);
  const [studentWindowExpired, setStudentWindowExpired] = useState(false);
  const submitted = !!state.submittedAt;

  useEffect(() => {
    if (!state.releaseAt) return;
    const releaseTime = new Date(state.releaseAt);
    const deadline = new Date(
      releaseTime.getTime() + studentWindowWeeks * 7 * 24 * 60 * 60 * 1000
    );
    setStudentDeadline(deadline);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setSp({ d, h, m, s });
      setStudentWindowActive(now < deadline && !submitted);
      setStudentWindowExpired(now >= deadline && !submitted);
    }, 1000);
    return () => clearInterval(interval);
  }, [state.releaseAt, studentWindowWeeks, state.submittedAt]);

  const handleDownload = async () => {
    if (!assignmentFile) {
      setNotice("Assignment file not available.");
      return;
    }
    const nowIso = new Date().toISOString();
    setState((s) => ({ ...s, releaseAt: nowIso, downloaded: true }));
    setNotice("Starting download...");

    try {
      const response = await fetch("https://backstagepass.co.in/reactapi/save_assignment_download.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          downloadTime: nowIso,
          userId: typeof window !== "undefined" ? localStorage.getItem("userId") : null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to save download time");
      // open file
      if (typeof window !== "undefined") window.open(assignmentFile, "_blank");
      setNotice("Assignment downloaded. Submission window started.");
      setTimeout(() => setNotice(null), 3500);
    } catch (error) {
      console.error("Failed to open assignment file or save download time:", error);
      setNotice("Download started, but failed to record timestamp. (Check console)");
    }
  };

  const handleFileSelect = async (file: File | null) => {
    if (!file || !studentWindowActive) {
      setNotice("Submission window closed or no file selected.");
      return;
    }
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!userId) {
      setNotice("User not logged in.");
      return;
    }
    const formData = new FormData();
    formData.append("assignmentFile", file);
    formData.append("userId", userId);
    formData.append("courseId", courseId);

    setNotice("Uploading file...");
    try {
      const response = await fetch("https://backstagepass.co.in/reactapi/submit_assignment.php", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Submission failed.");
      setState((s) => ({
        ...s,
        submittedAt: new Date().toISOString(),
        submittedFileName: file.name,
      }));
      setNotice("Assignment submitted successfully.");
      setTimeout(() => setNotice(null), 3500);
    } catch (err) {
      console.error(err);
      setNotice("There was an error submitting your assignment.");
    }
  };

  const markEvaluated = () => {
    setState((s) => ({ ...s, evaluated: true }));
    setNotice("Marked as evaluated.");
    setTimeout(() => setNotice(null), 2500);
  };
  const resetLocal = () => {
    if (!confirm("Reset assignment state locally?")) return;
    setState({ releaseAt: null, downloaded: false, submittedAt: null, submittedFileName: null, evaluated: false });
    setNotice("Local assignment state reset.");
    setTimeout(() => setNotice(null), 2000);
  };

  return (
    <div className="surface-card p-6 rounded-xl">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-pink-50 to-yellow-50 p-2 rounded-lg shadow-inner">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 7a2 2 0 0 1 2-2h10l4 4v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="#ef4444" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 12h6" stroke="#ef4444" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-semibold leading-tight">📝 Assignment</h3>
            <p className="text-xs text-gray-500 mt-0.5">Assignment task & submission window</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={resetLocal} className="text-sm text-gray-500 hover:text-gray-700">Reset (local)</button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div className="flex items-center gap-4 md:col-span-2">
          <div className="relative w-28 h-28">
            <svg viewBox="0 0 36 36" className="w-28 h-28">
              <defs>
                <linearGradient id={`g1-${courseId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>

              <circle cx="18" cy="18" r="15.5" fill="transparent" stroke="#f3f4f6" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.5" fill="transparent"
                stroke={`url(#g1-${courseId})`}
                strokeWidth="3"
                strokeLinecap="round"
                className="ring-anim"
                strokeDasharray={Math.PI * 2 * 15.5}
                strokeDashoffset={Math.PI * 2 * 15.5 * (1 - 0)}
                style={{ transition: "stroke-dashoffset 900ms cubic-bezier(.2,.9,.3,1)" }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {!state.releaseAt ? (
                <div className="text-center">
                  <div className="text-sm text-gray-400">Not started</div>
                </div>
              ) : submitted ? (
                <div className="text-center">
                  <div className="text-sm font-semibold text-green-600">Submitted</div>
                  <div className="text-xs text-gray-500 mt-0.5">{state.submittedFileName ?? ""}</div>
                </div>
              ) : studentWindowActive ? (
                <div className="text-center">
                  <div className="text-sm font-semibold text-blue-600">Open</div>
                  <div className="text-xs text-gray-500">time left</div>
                </div>
              ) : studentWindowExpired ? (
                <div className="text-center">
                  <div className="text-sm font-semibold text-red-500">Expired</div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex-1">
            {!state.releaseAt ? (
              <p className="text-sm text-gray-600">
                Download assignment to begin the student submission window ({studentWindowWeeks} weeks).
              </p>
            ) : submitted ? (
              <div>
                <div className="text-sm font-semibold text-green-600">Submitted</div>
                <div className="text-xs text-gray-500">
                  You submitted on {new Date(state.submittedAt!).toLocaleString()}
                </div>
              </div>
            ) : studentWindowActive ? (
              <div>
                <div className="text-xs text-gray-500">Student submission window</div>
                <div className="mt-2 text-lg font-mono text-gray-800">
                  {sp.d}d {sp.h}h {sp.m}m {sp.s}s
                </div>
                <div className="mt-2 text-sm text-gray-500">Ends: {studentDeadline?.toLocaleString()}</div>
              </div>
            ) : studentWindowExpired ? (
              <div>
                <div className="text-sm font-semibold text-red-600">Submission window closed</div>
                <div className="text-xs text-gray-500">Please contact mentor for next steps.</div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
          {!state.releaseAt ? (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="font-medium">Assignment Document</p>
                <p className="text-sm text-gray-500 mt-1">Start your submission timer by downloading the assignment.</p>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={handleDownload} className="px-5 py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow hover:shadow-lg transform transition hover:-translate-y-0.5">
                  Download & Start Timer
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-500">Released on</div>
                  <div className="font-medium">{new Date(state.releaseAt!).toLocaleString()}</div>
                </div>

                <div className="text-right">
                  {submitted ? (
                    <div className="text-sm text-green-600 font-semibold">Submitted</div>
                  ) : studentWindowActive ? (
                    <div className="text-sm text-blue-600 font-semibold">Open</div>
                  ) : studentWindowExpired ? (
                    <div className="text-sm text-red-600 font-semibold">Closed</div>
                  ) : null}
                </div>
              </div>

              <div className="border-dashed border-2 border-gray-100 rounded-lg p-4 hover:border-indigo-200 transition">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium">Upload your assignment</p>
                    <p className="text-xs text-gray-500 mt-1">You have {studentWindowWeeks} weeks from download to submit.</p>
                    {studentWindowActive && <p className="text-xs text-gray-400 mt-1">Make sure your file format is PDF / DOCX and under allowed size.</p>}
                  </div>

                  <div className="flex items-center gap-3">
                    <label className={`inline-flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer ${studentWindowActive ? "bg-white hover:bg-gray-50" : "bg-gray-50 opacity-60 cursor-not-allowed"}`}>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0] ?? null; if (f) handleFileSelect(f); }}
                        disabled={!studentWindowActive}
                        aria-disabled={!studentWindowActive}
                        aria-label="Upload assignment file"
                      />
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M12 3v12" stroke="#4f46e5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 7l4-4 4 4" stroke="#4f46e5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 21H4" stroke="#4f46e5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span className="text-sm text-indigo-600 font-medium">{studentWindowActive ? "Choose File" : "Upload Disabled"}</span>
                    </label>

                    <div>
                      <button
                        onClick={() => { if (!state.submittedAt) setNotice("Please select a file using 'Choose File' first."); }}
                        className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
                        aria-disabled={!studentWindowActive}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>

                {state.submittedAt && (
                  <div className="mt-3 bg-gray-50 rounded p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500">Submitted</div>
                        <div className="font-medium">{state.submittedFileName}</div>
                        <div className="text-xs text-gray-400">{new Date(state.submittedAt).toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="inline-block px-2 py-1 rounded bg-green-50 text-green-600 text-xs font-semibold">Awaiting review</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {isMentor && submitted && (
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Mentor evaluation window</div>
                    <div className="mt-2 text-lg font-mono text-gray-800">--</div>
                    <div className="text-xs text-gray-400 mt-1">Ends: {mentorDeadline?.toLocaleString()}</div>
                  </div>

                  <div>
                    <button onClick={markEvaluated} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Mark Evaluated</button>
                  </div>
                </div>
              )}

              {!isMentor && submitted && (
                <div className="mt-4 text-sm text-gray-500">Mentor will evaluate within {mentorWindowWeeks} week(s). You will be notified after evaluation.</div>
              )}
            </>
          )}
        </div>
      </div>

      {notice && <div className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 rounded">{notice}</div>}
    </div>
  );
}

/* ---------------- Main Page ---------------- */
const CourseDetailsPage: React.FC<CourseClientProps> = ({ id }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);
  const [courseName, setCourseName] = useState("");
  const [courseOverview, setCourseOverview] = useState("");
  const [courseEnddate, setCourseEnddate] = useState("");
  const [Courseassignmenttype, setCourseassignmenttype] = useState("");
  const [Assignmentfile, setCourseassignmentfile] = useState<string>("");
  const [isAssignmentenabled, setCourseassignmentenable] = useState<string>("");

  const [openModule, setOpenModule] = useState<number>(0);
  const [currentPointIndex, setCurrentPointIndex] = useState<number>(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);

  const [userId, setUserId] = useState<string | null>(null);

  const [watchedTopicIds, setWatchedTopicIds] = useState<Set<number>>(new Set());
  const [completedModuleIds, setCompletedModuleIds] = useState<number[]>([]);
  const [completedVideoCount, setCompletedVideoCount] = useState<number>(0);

  // existing quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState<Record<number, number>>({});

  // Final Quiz state
  const [finalAnswers, setFinalAnswers] = useState<Record<number, number>>({});
  const [finalIndex, setFinalIndex] = useState<number>(0);
  const [finalSubmitted, setFinalSubmitted] = useState<boolean>(false);

  const [pageNotice, setPageNotice] = useState<string | null>(null);

  const totalFinalQuestions = useMemo(() => {
    const m = modules.find((m) => String(m.title).toLowerCase() === "final quiz") ?? modules[openModule];
    return (m?.topics?.length ?? 5);
  }, [modules, openModule]);

  // ensure final quiz exists / has at least 5 questions
  useEffect(() => {
    if (!modules || modules.length === 0) return;
    const fqIndex = modules.findIndex((m) => String(m.title).toLowerCase() === "final quiz");
    if (fqIndex === -1) return;

    const existingTopics = modules[fqIndex]?.topics ?? [];
    if ((existingTopics?.length ?? 0) >= 5) return;

    const placeholders: Topic[] = [
      {
        id: `finalquiz-topic-${id}-1`,
        text: "Final Quiz Q1",
        type: "quiz",
        question: "What is 2 + 2?",
        options: ["1", "2", "3", "4"],
        correct: "4",
      } as unknown as Topic,
      {
        id: `finalquiz-topic-${id}-2`,
        text: "Final Quiz Q2",
        type: "quiz",
        question: "Which is a frontend library?",
        options: ["Django", "React", "Laravel", "Flask"],
        correct: "React",
      } as unknown as Topic,
      {
        id: `finalquiz-topic-${id}-3`,
        text: "Final Quiz Q3",
        type: "quiz",
        question: "HTML stands for?",
        options: [
          "Hyper Text Markup Language",
          "Home Tool Markup Language",
          "High Text Markup Lang",
          "None",
        ],
        correct: "Hyper Text Markup Language",
      } as unknown as Topic,
      {
        id: `finalquiz-topic-${id}-4`,
        text: "Final Quiz Q4",
        type: "quiz",
        question: "CSS is used for?",
        options: ["Styling", "Database", "Routing", "Authentication"],
        correct: "Styling",
      } as unknown as Topic,
      {
        id: `finalquiz-topic-${id}-5`,
        text: "Final Quiz Q5",
        type: "quiz",
        question: "Which one is JS package manager?",
        options: ["npm", "pip", "gem", "composer"],
        correct: "npm",
      } as unknown as Topic,
    ];

    const merged = [...(existingTopics ?? []), ...placeholders.slice(existingTopics?.length ?? 0)].slice(0, 5);

    setModules((prev) => {
      const next = [...prev];
      next[fqIndex] = { ...next[fqIndex], topics: merged };
      return next;
    });
  }, [modules, id, setModules]);

  useEffect(() => {
    setCurrentPointIndex(0);
    setQuizSubmitted(false);
    setQuizAnswers({});
  }, [openModule]);

  // load userId
  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
      setUserId(stored);
    } catch {
      setUserId(null);
    }
  }, []);

  // Fetch modules
  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const resp = await fetch(
          `https://backstagepass.co.in/reactapi/video_api.php?id=${encodeURIComponent(id)}&user_id=${encodeURIComponent(userId)}`,
          { signal: ac.signal }
        );
        if (!resp.ok) throw new Error("Failed to fetch modules");
        const data = await resp.json();
        if (!mounted) return;
        const fetchedModules: Module[] = Array.isArray(data.modules) ? data.modules : [];

        setCourseName(data.coursename ?? "");
        setCourseEnddate(data.paymentdate ?? "");
        setCourseOverview(data.courseoverview ?? "");
        setCourseassignmenttype(data.assignmenttype ?? "");
        setCourseassignmentfile(data.assignmentfile ?? "");
        setCourseassignmentenable(data.assignment_enabled ?? "");

        // Build finalModules and ensure Assignment & Final Quiz exist
        const finalModules = [...fetchedModules];

        const assignmentExists = finalModules.some((m) => String(m.title).toLowerCase() === "assignment");
        if (!assignmentExists) {
          finalModules.push({
            type: "assignment",
            id: `client-assignment-${id}`,
            title: "Assignment",
            file: data?.assignmentfile ?? "",
            topics: [
              { id: `assignment-topic-${id}`, text: "Assignment", type: "video" } as unknown as Topic,
            ],
            total_video_duration: "",
            is_last: "",
            mandatory_status: "",
            completed: "",
            quiz_score: undefined,
          } as unknown as Module);
        } else if (data.assignment_enabled === "yes" && data.assignmentfile) {
          for (let i = 0; i < finalModules.length; i++) {
            if (String(finalModules[i].title).toLowerCase() === "assignment") {
              finalModules[i] = { ...finalModules[i], file: data.assignmentfile };
            }
          }
        }

        const finalQuizExists = finalModules.some((m) => String(m.title).toLowerCase() === "final quiz");
        if (!finalQuizExists) {
          finalModules.push({
            type: "quiz",
            id: `client-finalquiz-${id}`,
            title: "Final Quiz",
            topics: [
              {
                id: `finalquiz-topic-${id}-1`,
                text: "Placeholder question",
                type: "quiz",
                question: "Placeholder: what's 2 + 2?",
                options: ["1", "2", "3", "4"],
                correct: "4",
              } as unknown as Topic,
            ],
            total_video_duration: "",
            is_last: "",
            mandatory_status: "0",
            completed: "",
            quiz_score: undefined,
          } as unknown as Module);
        }

        setModules(finalModules);
        setOpenModule(0);

        const watchedCount = fetchedModules
          .filter((m) => m.title !== "Assessment")
          .reduce((acc, m) => acc + (m.topics?.filter((t) => t.watched).length ?? 0), 0) || 0;
        setCompletedVideoCount(watchedCount);
      } catch (err) {
        if ((err as any).name !== "AbortError") console.error("fetch modules error:", err);
        setPageNotice("Failed to load modules (check console).");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      ac.abort();
    };
  }, [userId, id]);

  // fetch watched topic ids
  const fetchWatchedStatus = async (uid?: string | null) => {
    if (!uid) return;
    try {
      const resp = await fetch(
        `https://backstagepass.co.in/reactapi/fetch_watched.php?user_id=${encodeURIComponent(uid)}&status=watched`
      );
      if (!resp.ok) throw new Error("failed");
      const json = await resp.json();
      const arr = Array.isArray(json.watched_topic_ids) ? json.watched_topic_ids : [];
      const parsed = new Set(arr.map((n: any) => Number(n)).filter((n: number) => !Number.isNaN(n)));
      setWatchedTopicIds(parsed);
    } catch (err) {
      console.error("fetchWatchedStatus error:", err);
    }
  };

  // fetch user progress (completed modules)
  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(
          `https://backstagepass.co.in/reactapi/get_user_progress.php?user_id=${encodeURIComponent(userId)}`
        );
        const data = await res.json();
        if (!mounted) return;
        const completed = Array.isArray(data.completedModules)
          ? data.completedModules.map((x: any) => Number(x)).filter((n: number) => !Number.isNaN(n))
          : [];
        try {
          localStorage.setItem("completedModules", JSON.stringify(completed));
        } catch {}
        setCompletedModuleIds(completed);
      } catch (err) {
        console.error("get_user_progress error:", err);
      }
    })();
    fetchWatchedStatus(userId);
    return () => { mounted = false; };
  }, [userId]);

  // currentTopic safe getter
  const currentTopic: Topic | undefined = useMemo(() => {
    return modules?.[openModule]?.topics?.[currentPointIndex];
  }, [modules, openModule, currentPointIndex]);

  // progress percent
  const totalVideoPoints = useMemo(() => {
    return modules
      .filter((m) => m.title !== "Assessment" && m.title !== "Assignment")
      .reduce((acc, m) => acc + (Array.isArray(m.topics) ? m.topics.length : 0), 0);
  }, [modules]);

  const progressPercentage = totalVideoPoints > 0 ? Math.round((completedVideoCount / totalVideoPoints) * 100) : 0;

  // final quiz helpers
  const handleFinalSelect = (questionIndex: number, optionIndex: number) => {
    setFinalAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
    const module = modules[openModule];
    const total = module?.topics?.length ?? totalFinalQuestions;
    if (questionIndex < total - 1) {
      setTimeout(() => setFinalIndex((i) => Math.min(i + 1, total - 1)), 120);
    }
  };
  const handleFinalPrev = () => setFinalIndex((i) => Math.max(0, i - 1));
  const computeFinalProgressPercent = () => {
    const module = modules[openModule];
    const total = module?.topics?.length ?? totalFinalQuestions;
    const answered = Object.keys(finalAnswers).length;
    return Math.round((answered / total) * 100);
  };

  // video end
  const handleVideoEnd = async () => {
    const topic = currentTopic;
    if (!topic) return;
    const topicId = topic.id;
    try {
      if (userId) {
        fetch("https://backstagepass.co.in/reactapi/mark_watched.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, topic_id: topicId }),
        }).catch((e) => console.error("mark_watched failed:", e));
      }
    } catch (e) { console.error(e); }

    setWatchedTopicIds((prev) => {
      const next = new Set(prev);
      next.add(Number(topicId));
      return next;
    });
    setCompletedVideoCount((prev) => prev + 1);

    setCurrentPointIndex((prevPointIndex) => {
      const module = modules[openModule];
      const pointsCount = module?.topics?.length ?? 0;
      if (prevPointIndex < pointsCount - 1) {
        return prevPointIndex + 1;
      } else {
        const previousModuleId = Number(module?.id);
        if (!Number.isNaN(previousModuleId)) {
          setCompletedModuleIds((prev) => {
            const updated = Array.from(new Set([...prev, previousModuleId]));
            try { localStorage.setItem("completedModules", JSON.stringify(updated)); } catch {}
            return updated;
          });
        }
        let nextIdx = openModule + 1;
        while (nextIdx < modules.length && (modules[nextIdx].topics?.length ?? 0) === 0) nextIdx++;
        if (nextIdx < modules.length) {
          setOpenModule(nextIdx);
          return 0;
        } else return 0;
      }
    });
  };

  const [checkedAnswers, setCheckedAnswers] = useState<{ [k: number]: boolean }>({});
  const handleCheckQuestion = (questionIndex: number) => setCheckedAnswers((p) => ({ ...p, [questionIndex]: true }));

  const isModuleUnlocked = (index: number) => {
    if (index === 0) return true;
    const current = modules[index];
    if (!current) return false;
    if (current.title === "Assessment") {
      const previousVideoModule = [...modules].slice(0, index).reverse().find((m) => m.type === "video");
      if (!previousVideoModule) return false;
      return completedModuleIds.includes(Number(previousVideoModule.id));
    }
    let prevVideoIndex = -1;
    for (let i = index - 1; i >= 0; i--) if (modules[i].type === "video") { prevVideoIndex = i; break; }
    if (prevVideoIndex === -1) return false;
    const previousVideo = modules[prevVideoIndex];
    const videoDone = completedModuleIds.includes(Number(previousVideo.id));
    const maybeAssessment = modules[prevVideoIndex + 1];
    const isAssessmentRequired = maybeAssessment?.title === "Assessment" && maybeAssessment.mandatory_status === "1";
    const quizKey = `quiz-${prevVideoIndex + 1}`;
    const quizDone = !isAssessmentRequired || completedModuleIds.includes(quizKey);
    return videoDone && quizDone;
  };

  // ---------- Assessment quiz submit (re-using your earlier logic) ----------
  const [userScore, setUserScore] = useState(0);

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const goToPrevQuestion = () => {
    setCurrentPointIndex((p) => Math.max(0, p - 1));
  };

  const goToNextQuestion = () => {
    if (quizAnswers[currentPointIndex] === undefined) {
      setPageNotice("Please select an answer before proceeding.");
      setTimeout(() => setPageNotice(null), 2200);
      return;
    }
    const maxIndex = (modules[openModule]?.topics?.length ?? 1) - 1;
    setCurrentPointIndex((c) => (c < maxIndex ? c + 1 : c));
  };

  const handleSubmitQuiz = async () => {
    const assessmentModule = modules[openModule];
    if (!assessmentModule) return;

    const questions = assessmentModule.topics as QuizTopic[];
    let correctCount = 0;
    questions.forEach((q, idx) => {
      const userAns = quizAnswers[idx];
      const correctIdx = q.options.indexOf((q as any).correct);
      if (userAns === correctIdx) correctCount++;
    });

    const score = questions.length ? (correctCount / questions.length) * 100 : 0;

    const moduleId = Number(assessmentModule?.id);
    setQuizAttempts((prev) => {
      const attempts = (prev[moduleId] || 0) + 1;
      return { ...prev, [moduleId]: attempts };
    });

    try {
      await fetch("https://backstagepass.co.in/reactapi/submit_quiz.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          module_id: moduleId,
          score,
        }),
      });

      const justCompletedModule = modules.slice(0, openModule).reverse().find((m) => m.id);
      if (score >= 20 && justCompletedModule) {
        const aboveId = Number(justCompletedModule.id);
        const quizKey = `quiz-${openModule}`;
        setCompletedModuleIds((prev) => {
          const updated = Array.from(new Set([...prev, aboveId, quizKey as any]));
          try { localStorage.setItem("completedModules", JSON.stringify(updated)); } catch {}
          return updated;
        });
      } else {
        const attempts = (quizAttempts[moduleId] || 0) + 1;
        if (attempts >= 3) {
          setPageNotice("You've failed 3 attempts. Please rewatch the video and try again.");
          setQuizSubmitted(false);
        } else {
          setPageNotice(`Attempt ${attempts} failed. Please try again.`);
        }
        setTimeout(() => setPageNotice(null), 3000);
      }
    } catch (err) {
      console.error("submit quiz error:", err);
      setPageNotice("Failed to submit quiz (server error).");
      setTimeout(() => setPageNotice(null), 3000);
    }
    setUserScore(score);
    setQuizSubmitted(true);
  };

  // small render guard
  if (loading) return <div className="p-6">Loading course details…</div>;

  const currentModule = modules[openModule];

  return (
    <div className="min-h-screen px-4 md:px-8 py-6 bg-gray-50">
      <div className="max-w-9xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight">{courseName}</h1>
            <div className="mt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full font-semibold">
                ✅ Completed on {courseEnddate || "—"}
              </span>
              <p className="text-sm text-gray-500">Course overview & progress</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-12 h-12">
              <CircularProgressbar
                value={progressPercentage}
                text={`${progressPercentage}%`}
                styles={buildStyles({ textColor: "#2563eb", pathColor: "#2563eb", trailColor: "#e5e7eb", strokeLinecap: "round" })}
              />
            </div>
            <div className="text-right">
              <h3 className="text-sm font-semibold">📊 Course Progress</h3>
              <p className="text-xs text-gray-500">{completedVideoCount} of {totalVideoPoints} videos completed</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="video-surface p-4 rounded-lg">
              {/* provide a stable aspect ratio */}
              <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden bg-black">
                {/* If currentModule is a video, render Muxvideo, otherwise render module UI */}
                {currentModule ? (
                  (() => {
                    const titleLower = String(currentModule.title || "").toLowerCase();

                    if (titleLower === "assessment") {
                      return (
                        <div className="absolute inset-0 p-6 overflow-auto bg-white">
                          {currentModule?.mandatory_status === "1" && currentModule?.completed === "1" ? (
                            <div className="text-center p-8">
                              <h3 className="text-2xl font-semibold mb-4">Quiz Completed</h3>
                              <p className="text-lg mt-2 font-medium text-green-700">Your Score is: {currentModule?.score}</p>
                              <button
                                onClick={() => {
                                  for (let i = openModule + 1; i < modules.length; i++) { setOpenModule(i); break; }
                                }}
                                className="mt-4 ml-4 px-4 py-2 bg-green-600 text-white rounded"
                              >
                                Continue
                              </button>
                            </div>
                          ) : !quizSubmitted ? (
                            <div>
                              <h2 className="text-xl font-semibold mb-4">Question {currentPointIndex + 1} of {currentModule.topics.length}</h2>
                              {currentModule.type === "quiz" && currentModule.mandatory_status === "1" && (
                                <p className="text-blue-600 font-medium mt-2">You must score at least {currentModule.quiz_score} % to progress.</p>
                              )}

                              <p className="mb-4 text-lg">{(currentModule.topics[currentPointIndex] as QuizTopic).question}</p>

                              <ul className="space-y-3 mb-6">
                                {(currentModule.topics[currentPointIndex] as QuizTopic).options?.map((option, idx) => {
                                  const selectedIdx = quizAnswers[currentPointIndex];
                                  const correctAnswer = (currentModule.topics[currentPointIndex] as QuizTopic).correct;
                                  const isCorrect = option === correctAnswer;
                                  const isSelected = selectedIdx === idx;
                                  const isChecked = checkedAnswers[currentPointIndex];

                                  let optionClasses = "inline-flex items-center space-x-2 p-2 rounded w-full ";

                                  if (isChecked && currentModule.mandatory_status === "0") {
                                    if (isCorrect) {
                                      optionClasses += "bg-green-200 text-green-900 font-semibold";
                                    } else if (isSelected && !isCorrect) {
                                      optionClasses += "bg-red-200 text-red-900 font-semibold";
                                    } else {
                                      optionClasses += "bg-gray-100 text-gray-500";
                                    }
                                  } else {
                                    optionClasses += "hover:bg-gray-100";
                                  }

                                  return (
                                    <li key={idx}>
                                      <label className={optionClasses}>
                                        <input
                                          type="radio"
                                          name={`question-${currentPointIndex}`}
                                          checked={selectedIdx === idx}
                                          onChange={() => handleAnswerSelect(currentPointIndex, idx)}
                                          className="form-radio"
                                          disabled={isChecked}
                                          aria-checked={selectedIdx === idx}
                                        />
                                        <span>{option}</span>
                                      </label>
                                    </li>
                                  );
                                })}
                              </ul>

                              <div className="flex justify-between">
                                <button
                                  onClick={goToPrevQuestion}
                                  disabled={currentPointIndex === 0}
                                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                                >
                                  Prev
                                </button>

                                {currentModule.type === "quiz" && currentModule.mandatory_status === "0" ? (
                                  !checkedAnswers[currentPointIndex] ? (
                                    <button
                                      onClick={() => handleCheckQuestion(currentPointIndex)}
                                      className="px-4 py-2 bg-purple-600 text-white rounded"
                                      disabled={quizAnswers[currentPointIndex] === undefined}
                                    >
                                      Check
                                    </button>
                                  ) : currentPointIndex === currentModule.topics.length - 1 ? (
                                    <button onClick={handleSubmitQuiz} className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
                                  ) : (
                                    <button onClick={goToNextQuestion} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
                                  )
                                ) : currentModule.type === "quiz" && currentModule.mandatory_status === "1" ? (
                                  currentPointIndex === currentModule.topics.length - 1 ? (
                                    <button onClick={handleSubmitQuiz} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={quizAnswers[currentPointIndex] === undefined}>Submit</button>
                                  ) : (
                                    <button onClick={goToNextQuestion} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={quizAnswers[currentPointIndex] === undefined}>Next</button>
                                  )
                                ) : null}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center p-8">
                              <h3 className="text-2xl font-semibold mb-4">Quiz Submitted!</h3>
                              <p>You answered {Object.keys(quizAnswers).length} questions.</p>
                              <p className="text-lg mt-2 font-medium text-green-700">Score: {userScore} / {currentModule.topics.length}</p>

                              {currentModule.mandatory_status !== "1" && (
                                <button onClick={() => { setQuizSubmitted(false); setCurrentPointIndex(0); setQuizAnswers({}); }} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded">Retake Quiz</button>
                              )}

                              {(currentModule.mandatory_status !== "1" || userScore >= parseInt(String(currentModule.quiz_score || "0"), 10)) && (
                                <button onClick={() => { for (let i = openModule + 1; i < modules.length; i++) { setOpenModule(i); break; } }} className="mt-4 ml-4 px-4 py-2 bg-green-600 text-white rounded">Continue</button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }

                    if (titleLower === "assignment" || String(currentModule.type).toLowerCase() === "assignment") {
                      return (
                        <div className="absolute inset-0 p-6 overflow-auto bg-white">
                          <AssignmentPanel
                            courseId={id}
                            studentWindowWeeks={2}
                            mentorWindowWeeks={1}
                            assignmentFile={currentModule?.file ?? ""}
                          />
                        </div>
                      );
                    }

                    if (titleLower === "final quiz") {
                      return (
                        <div className="absolute inset-0 p-6 overflow-auto bg-white">
                          <div className="bg-white rounded-lg p-6 shadow-sm border">
                            <div className="mb-6">
                              <h3 className="text-xl font-semibold mb-2">🏁 Final Quiz</h3>
                              <p className="text-sm text-gray-500 mb-3">Answer each question to progress.</p>

                              <div className="final-progress-container">
                                <div className="final-progress-fill" style={{ width: `${computeFinalProgressPercent()}%` }}>
                                  <span className="final-progress-label">{computeFinalProgressPercent()}%</span>
                                </div>
                              </div>
                              <p className="text-sm text-blue-700 mt-1">{Object.keys(finalAnswers).length} / {currentModule.topics.length} answered</p>
                            </div>

                            <div className="space-y-4">
                              {(() => {
                                const topics = currentModule.topics ?? [];
                                const q = topics[finalIndex];
                                if (!q) return <div>No question found.</div>;
                                return (
                                  <div key={finalIndex} className="p-4 border rounded-lg">
                                    <div className="mb-4 font-medium">Q{finalIndex + 1}. {(q as QuizTopic).question}</div>
                                    <ul className="space-y-2">
                                      {(q as QuizTopic).options?.map((opt, optIdx) => {
                                        const selected = finalAnswers[finalIndex] === optIdx;
                                        return (
                                          <li key={optIdx}>
                                            <label className={`inline-flex items-center gap-2 p-3 rounded w-full cursor-pointer ${selected ? "bg-green-100 border border-green-300" : "hover:bg-gray-50"}`}>
                                              <input type="radio" name={`final-quiz-q-${finalIndex}`} checked={selected} onChange={() => handleFinalSelect(finalIndex, optIdx)} />
                                              <span>{opt}</span>
                                            </label>
                                          </li>
                                        );
                                      })}
                                    </ul>

                                    <div className="mt-4 flex items-center justify-between">
                                      <div>
                                        <button onClick={handleFinalPrev} disabled={finalIndex === 0} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Prev</button>
                                      </div>

                                      <div className="flex items-center gap-3">
                                        <div className="text-sm text-gray-600">{finalIndex + 1} / {currentModule.topics.length}</div>

                                        <button
                                          onClick={() => {
                                            const questions = currentModule?.topics ?? [];
                                            if (Object.keys(finalAnswers).length < questions.length) {
                                              setPageNotice("Please answer all questions before submitting.");
                                              setTimeout(() => setPageNotice(null), 2200);
                                              return;
                                            }
                                            let correctCount = 0;
                                            questions.forEach((qq: any, idx: number) => {
                                              const userAnsIdx = finalAnswers[idx];
                                              const correctIdx = qq.options?.indexOf(qq.correct);
                                              if (userAnsIdx !== undefined && userAnsIdx === correctIdx) correctCount++;
                                            });
                                            const score = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
                                            setFinalSubmitted(true);
                                            setPageNotice(`✅ Final Quiz completed! Your score: ${score}%`);
                                            setTimeout(() => setPageNotice(null), 3000);
                                            console.log("Final Quiz Score (Static):", score);
                                          }}
                                          className={`px-4 py-2 rounded font-semibold ${Object.keys(finalAnswers).length === currentModule.topics.length ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700 cursor-not-allowed"}`}
                                          disabled={Object.keys(finalAnswers).length !== currentModule.topics.length}
                                        >
                                          Submit Final Quiz
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}

                              {finalSubmitted && (
                                <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200 text-center">
                                  <h2 className="text-2xl font-bold text-green-700 mb-2">🎉 Congratulations!</h2>
                                  <p className="text-lg text-gray-700">You have completed the Final Quiz.</p>
                                  <p className="text-xl font-semibold text-green-800 mt-3">
                                    Your Score: {(() => {
                                      const questions = currentModule.topics ?? [];
                                      let correctCount = 0;
                                      questions.forEach((q: any, idx: number) => {
                                        const userAnsIdx = finalAnswers[idx];
                                        const correctIdx = q.options?.indexOf(q.correct);
                                        if (userAnsIdx !== undefined && userAnsIdx === correctIdx) correctCount++;
                                      });
                                      return Math.round((correctCount / questions.length) * 100);
                                    })()}%
                                  </p>
                                  <p className="text-sm text-gray-500 mt-2">Well done! You can now return to your dashboard.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Default -> video player
                    return (
                      <div className="absolute inset-0">
                        <Muxvideo
                          key={`module-${openModule}-topic-${currentPointIndex}-video-${currentVideoIndex}`}
                          videos={
                            (currentTopic && (currentTopic.type === "video" ? (currentTopic as VideoTopic).video : [])) || []
                          }
                          userId={userId ?? ""}
                          topicId={String(currentTopic?.id ?? "")}
                          resumeTime={0}
                          currentVideoIndex={currentVideoIndex}
                          onFinish={handleVideoEnd}
                        />
                      </div>
                    );
                  })()
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">No module selected</div>
                )}
              </div>

              {/* below the player show title and navigation */}
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{currentModule?.title ?? "—"}</h3>
                  <p className="text-sm text-gray-500">Topic {currentPointIndex + 1} / {(currentModule?.topics?.length ?? 0)}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => { if (currentPointIndex > 0) setCurrentPointIndex(currentPointIndex - 1); }} className="px-4 py-2 rounded-md bg-black text-white hover:opacity-95 transition">Previous</button>
                  <button onClick={() => { const module = modules[openModule]; if (currentPointIndex < (module?.topics?.length ?? 1) - 1) setCurrentPointIndex(currentPointIndex + 1); }} className="px-4 py-2 rounded-md bg-black text-white hover:opacity-95 transition">Next</button>
                </div>
              </div>
            </div>
          </div>

          <aside className="p-4 rounded-lg bg-white shadow-sm border border-gray-100 sticky top-6 max-h-[75vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">📘 Course Material</h2>
            <div className="mb-3">
              <div className="w-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full h-2 overflow-hidden">
                <div style={{ width: `${progressPercentage}%` }} className="h-full bg-white/10" />
              </div>
              <p className="text-xs text-gray-500 mt-2">{progressPercentage}% complete</p>
            </div>

            <ul className="space-y-3">
              {modules.map((module, index) => {
                const hideAssessment = module.title === "Assessment" && !Array.from(watchedTopicIds).length;
                if (hideAssessment) return null;
                const isUnlocked = isModuleUnlocked(index);
                const isCompletedModule = completedModuleIds.includes(Number(module.id));
                const isOpen = openModule === index;

                return (
                  <li key={index} className="border rounded-lg">
                    <button
                      disabled={module.title !== "Assignment" && module.title !== "Final Quiz" && !isUnlocked}
                      className={`w-full flex items-center justify-between p-3 text-left ${isOpen ? "bg-blue-50 border-blue-200" : "bg-white hover:bg-gray-50"} ${module.title !== "Assignment" && module.title !== "Final Quiz" && !isUnlocked ? "opacity-60 cursor-not-allowed" : ""}`}
                      onClick={() => {
                        if (module.title === "Assignment" || module.title === "Final Quiz" || isUnlocked) {
                          setOpenModule(index);
                          setCurrentPointIndex(0);
                          setFinalIndex(0);
                          setFinalAnswers({});
                          setFinalSubmitted(false);
                          setPageNotice(null);
                        }
                      }}
                      aria-expanded={isOpen}
                      aria-controls={`module-${index}-content`}
                    >
                      <div className="flex items-center gap-3">
                        {module.title !== "Assessment" && <PlayCircle size={18} className="text-blue-600" />}
                        <span className="font-medium">{module.title}</span>
                        <span className="ml-2 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">{module.total_video_duration ?? ""}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {isCompletedModule && <span className="text-green-600 text-sm">✔ Completed</span>}
                        {!isUnlocked && module.title !== "Assignment" && module.title !== "Final Quiz" && <small className="text-xs text-gray-400">Locked</small>}
                      </div>
                    </button>

                    {isOpen && module.title !== "Assessment" && module.title !== "Assignment" && (
                      <ul id={`module-${index}-content`} className="pl-4 pt-2 pb-3 text-sm text-gray-600">
                        {module.topics.map((point, idx) => {
                          const isCurrentPlaying = openModule === index && currentPointIndex === idx;
                          const isCompletedTopic = watchedTopicIds.has(Number(point.id));
                          return (
                            <li key={idx} className={`mb-2 flex items-center justify-between p-2 rounded ${isCurrentPlaying ? "bg-blue-50 text-blue-800 font-medium" : "hover:bg-gray-50"}`}>
                              <div className="flex items-center gap-3">
                                <input type="checkbox" checked={isCompletedTopic} readOnly className="cursor-default" aria-checked={isCompletedTopic} />
                                <span>{point.text}</span>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">{(point as any).video_duration ?? ""}</span>
                                {isCurrentPlaying && (
                                  <div className="flex gap-2">
                                    <button onClick={() => { if (currentPointIndex > 0) setCurrentPointIndex(currentPointIndex - 1); }} className="text-blue-600 hover:underline">⬅</button>
                                    <button onClick={() => { const module = modules[openModule]; if (currentPointIndex < (module?.topics?.length ?? 1) - 1) setCurrentPointIndex(currentPointIndex + 1); }} className="text-blue-600 hover:underline">➡</button>
                                  </div>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    {isOpen && module.title === "Assessment" && (
                      <div className="p-3 text-sm text-gray-600 italic">Complete the quiz in the main panel.</div>
                    )}

                    {isOpen && module.title === "Assignment" && (
                      <div className="p-3 text-sm text-gray-600 italic">Complete the assignment in the main panel.</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>

        <div className="mt-8 max-w-5xl bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
          <div className="border-b border-gray-200 pb-3 mb-4">
            <nav className="flex space-x-6">
              <button className="pb-2 text-sm font-medium border-b-2 border-blue-600 text-blue-600">Overview</button>
              <button className="pb-2 text-sm font-medium text-gray-600">Contact with Mentor</button>
            </nav>
          </div>

          <div className="text-sm text-gray-700">
            <div>
              <h3 className="text-lg font-semibold mb-2">Course Overview</h3>
              <p>{courseOverview}</p>
            </div>

            <div className="mt-4">
              <Calendar id={id} />
            </div>
          </div>
        </div>

        {pageNotice && <div className="mt-4 px-4 py-2 bg-yellow-50 text-yellow-700 rounded">{pageNotice}</div>}
      </div>

      {/* Global styles moved to bottom to avoid nested styled-jsx */}
      <style jsx global>{`
        .surface-card {
          background: linear-gradient(180deg, #ffffff, #fbfbfd);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(16,24,40,0.06);
          border: 1px solid rgba(15,23,42,0.04);
        }

        .video-surface {
          background: linear-gradient(180deg, #0b1220, #07101a);
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 8px 28px rgba(15,23,42,0.06);
        }

        /* Final Quiz Progress Bar Styling */
        .final-progress-container {
          width: 100%;
          height: 28px;
          border-radius: 9999px;
          background: linear-gradient(to right, #e5e7eb, #f3f4f6);
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          position: relative;
        }

        .final-progress-fill {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(90deg, #22c55e, #16a34a);
          background-size: 200% 100%;
          color: white;
          font-weight: 700;
          font-size: 0.9rem;
          border-radius: 9999px;
          transition: width 0.5s ease-in-out, background-position 1.5s linear;
          position: relative;
        }

        .final-progress-label {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
        }

        /* small animation class */
        .animate-fade-in { animation: fadeInUp 420ms cubic-bezier(.2,.9,.3,1) both; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CourseDetailsPage;
