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
type UIModule = {
  id: number;
  title: string;
  type: "video" | "quiz";
  topics?: Topic[];
  total_video_duration?: string;
  selfassessmentlink?: string;
  resourceslink?: string;
  quiz?: QuizData;
  mandatory_status?: number;
};

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: string;
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
  has_quiz: number;
  resourceslink: boolean;
  selfassessmentlink: boolean;
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
  coursename: ReactNode;
  marks: null;
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
    } catch { }
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
    const fileName = localStorage.getItem("assignment_file");

    const assignmentFile = fileName
      ? `https://backstagepass.co.in/websiteadmin/uploads/assignments/${fileName}`
      : null; if (!assignmentFile) {
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
  useEffect(() => {
    const fetchAssignmentStatus = async () => {
      try {
        const userId = localStorage.getItem("userId");

        const res = await fetch(
          `https://backstagepass.co.in/reactapi/get_assignment_status.php?userId=${userId}&courseId=${courseId}&_t=${Date.now()}`,
          {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
            },
          }
        );

        const data = await res.json();
        console.log("Assignment status:", data);

        if (data.releaseAt) {
          setState((s) => ({
            ...s,
            releaseAt: data.releaseAt,
            downloaded: true,
            submittedAt: data.submittedAt || null,
            submittedFileName: data.submittedFileName || null,
            evaluated: data.evaluated || false,
            marks: data.marks || null,
            grade: data.grade || null,
            coursename: data.coursename || null,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch assignment status:", err);
      }
    };

    fetchAssignmentStatus();
  }, [courseId]);


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
              <path d="M3 7a2 2 0 0 1 2-2h10l4 4v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="#ef4444" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 12h6" stroke="#ef4444" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
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
            /* ================= BEFORE DOWNLOAD ================= */
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="font-medium">Assignment Document</p>
                <p className="text-sm text-gray-500 mt-1">
                  Start your submission timer by downloading the assignment.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownload}
                  className="px-5 py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow hover:shadow-lg transform transition hover:-translate-y-0.5"
                >
                  Download & Start Timer
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ================= COURSE COMPLETED ================= */}

              {state.marks !== null && state.marks !== "null" ? (
                <div className="text-center p-6 bg-green-50 rounded-md border border-green-200">
                  <h3 className="text-lg font-semibold text-green-700">
                    <img
                      src="https://cdn4.iconfinder.com/data/icons/game-ui-set-3/96/Medal_bronze-512.png"
                      alt="Completed"
                      style={{ width: "100px", margin: "0 auto" }}
                    />
                    You Have Successfully Completed {state.coursename} Course.
                    <br />
                    You can download Certificate.
                  </h3>
                </div>
              ) : (
                <>
                  {/* ================= STATUS HEADER ================= */}
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Released on</div>
                      <div className="font-medium">
                        {new Date(state.releaseAt!).toLocaleString()}
                      </div>
                    </div>

                    <div className="text-right">
                      {submitted ? (
                        <div className="text-sm text-green-600 font-semibold">
                          Submitted
                        </div>
                      ) : studentWindowActive ? (
                        <div className="text-sm text-blue-600 font-semibold">
                          Open
                        </div>
                      ) : studentWindowExpired ? (
                        <div className="text-sm text-red-600 font-semibold">
                          Closed
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* ================= UPLOAD BOX ================= */}
                  <div className="border-dashed border-2 border-gray-100 rounded-lg p-4 hover:border-indigo-200 transition">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-medium">Upload your assignment</p>
                        <p className="text-xs text-gray-500 mt-1">
                          You have {studentWindowWeeks} weeks from download to submit.
                        </p>

                        {studentWindowActive && (
                          <p className="text-xs text-gray-400 mt-1">
                            Make sure your file format is PDF / DOCX and under allowed size.
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <label
                          className={`inline-flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer ${studentWindowActive
                              ? "bg-white hover:bg-gray-50"
                              : "bg-gray-50 opacity-60 cursor-not-allowed"
                            }`}
                        >
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0] ?? null;
                              if (f) handleFileSelect(f);
                            }}
                            disabled={!studentWindowActive}
                          />
                          <span className="text-sm text-indigo-600 font-medium">
                            {studentWindowActive ? "Choose File" : "Upload Disabled"}
                          </span>
                        </label>

                        <button
                          onClick={() => {
                            if (!state.submittedAt) {
                              setNotice(
                                "Please select a file using 'Choose File' first."
                              );
                            }
                          }}
                          className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
                          disabled={!studentWindowActive}
                        >
                          Submit
                        </button>
                      </div>
                    </div>

                    {/* ================= SUBMITTED INFO ================= */}
                    {state.submittedAt && (
                      <div className="mt-3 bg-gray-50 rounded p-3 text-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-gray-500">Submitted</div>
                            <div className="font-medium">
                              {state.submittedFileName}
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(state.submittedAt).toLocaleString()}
                            </div>
                          </div>

                          <span className="inline-block px-2 py-1 rounded bg-green-50 text-green-600 text-xs font-semibold">
                            Awaiting review
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ================= MENTOR VIEW ================= */}
                  {isMentor && submitted && (
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500">
                          Mentor evaluation window
                        </div>
                        <div className="mt-2 text-lg font-mono text-gray-800">--</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Ends: {mentorDeadline?.toLocaleString()}
                        </div>
                      </div>

                      <button
                        onClick={markEvaluated}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        Mark Evaluated
                      </button>
                    </div>
                  )}

                  {/* ================= STUDENT VIEW ================= */}
                  {!isMentor && submitted && (
                    <div className="mt-4 text-sm text-gray-500">
                      Mentor will evaluate within {mentorWindowWeeks} week(s).
                      You will be notified after evaluation.
                    </div>
                  )}
                </>
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
  const [hasPassed, setHasPassed] = useState(false);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  // Function to handle click on the thumbnail
  const handleThumbnailClick = (topicId: string) => {
    setIsPlaying((prevState) => ({
      ...prevState,
      [topicId]: true, // Set video to play for this specific topic
    }));
  };
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [courseOutcome, setCourseOutcome] = useState("");
  const [mentorname, setMentorname] = useState("");
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [activeTab, setActiveTab] =
    useState<"overview" | "contact" | "outcome">("overview");

  const [resumeTime, setResumeTime] = useState<number>(0);
  const [topics, setTopics] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);
  const [courseName, setCourseName] = useState("");
  const [courseOverview, setCourseOverview] = useState("");
  const [courseEnddate, setCourseEnddate] = useState("");
  const [Courseassignmenttype, setCourseassignmenttype] = useState("");
  const [Assignmentfile, setCourseassignmentfile] = useState<string>("");
  const [isAssignmentenabled, setCourseassignmentenable] = useState<string>("");

  // const [openModule, setOpenModule] = useState<number>(0);
  const [currentPointIndex, setCurrentPointIndex] = useState<number>(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);

  const [userId, setUserId] = useState<string | null>(null);

  const [watchedTopicIds, setWatchedTopicIds] = useState<Set<number>>(new Set());
  const [completedModuleIds, setCompletedModuleIds] = useState<number[]>([]);
  const [completedVideoCount, setCompletedVideoCount] = useState<number>(0);
  const [isReviewMode, setIsReviewMode] = useState(false);

  // existing quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState<Record<number, number>>({});

  // Final Quiz state
  const [finalAnswers, setFinalAnswers] = useState<Record<number, number>>({});
  const [finalIndex, setFinalIndex] = useState<number>(0);
  const [finalSubmitted, setFinalSubmitted] = useState<boolean>(false);

  const [pageNotice, setPageNotice] = useState<string | null>(null);

  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);

  const [isModuleLoaded, setIsModuleLoaded] = useState(false);
  const [openModule, setOpenModule] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<
    "content" | "quiz" | "assignment"
  >("content");
  const currentModule =
    openModule !== null ? modules[openModule] : null;



  function getRandomQuestions(allQuestions: QuizQuestion[], limit: number): QuizQuestion[] {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  }

  useEffect(() => {
    // reset quiz UI whenever module changes
    setQuizSubmitted(false);
    setUserScore(0);
    setIsQuizActive(false);
  }, [openModule]);
  useEffect(() => {
    if (currentModule?.topics) {
      setIsModuleLoaded(true);
    } else {
      setIsModuleLoaded(false);
    }
  }, [currentModule]);

  useEffect(() => {
    if (
      modules.length > 0 &&
      modules[openModule]?.type === "quiz" &&
      Array.isArray(modules[openModule]?.topics)
    ) {
      const fullQuiz = modules[openModule].topics;
      const questionsLimit = parseInt(modules[openModule].questions_limit || "5");

      const randomSubset = getRandomQuestions(fullQuiz, questionsLimit);
      setCurrentQuestions(randomSubset);
    }
  }, [openModule, modules]);

  // const totalFinalQuestions = useMemo(() => {
  //   const m = modules.find((m) => String(m.title).toLowerCase() === "final quiz") ?? modules[openModule];
  //   return (m?.topics?.length ?? 5);
  // }, [modules, openModule]);
  const lastModuleId = (() => {
    const v = localStorage.getItem("last_watched_module_id");
    return v ? Number(v) : null;
  })();

  const lastTopicId = (() => {
    const v = localStorage.getItem("last_watched_topic_id");
    return v ? Number(v) : null;
  })();
  console.log('lasttopic:' + lastTopicId);



  useEffect(() => {
    if (!id || !userId) return;

    const init = async () => {
      try {
        /* ===============================
           1️⃣ FETCH LAST WATCHED PROGRESS
        =============================== */
        const progressRes = await fetch(
          `https://backstagepass.co.in/reactapi/api/getdetails.php?student_id=${userId}&course_main_id=${id}`,
          { cache: "no-store" }
        );

        if (progressRes.ok) {
          const progress = await progressRes.json();

          if (progress?.last_watched_module_id) {
            localStorage.setItem(
              "last_watched_module_id",
              String(progress.last_watched_module_id)
            );
          }

          if (progress?.last_watched_topic_id) {
            localStorage.setItem(
              "last_watched_topic_id",
              String(progress.last_watched_topic_id)
            );
          }
          if (progress?.assignment_file) {
            localStorage.setItem(
              "assignment_file",
              progress.assignment_file
            );
          }
        }

        /* ===============================
           2️⃣ FETCH MODULES
        =============================== */
        setLoading(true);

        const moduleRes = await fetch(
          `https://backstagepass.co.in/reactapi/api/getmodules.php?course_id=${encodeURIComponent(
            id
          )}&user_id=${encodeURIComponent(userId)}`,
          { cache: "no-store" }
        );

        if (!moduleRes.ok) {
          throw new Error("Failed to fetch modules");
        }

        const data = await moduleRes.json();

        const formatted = data.map((m: any) => ({
          id: m.id,
          title: m.title,
          type: "video",
          mandatory_status: Number(m.mandatory_status),
          questions_limit: Number(m.questions_limit),
          quiz_score: Number(m.quiz_score),
          selfassessmentfile: m.selfassessmentfile,
          resources: m.resources,
          has_quiz: Number(m.has_quiz),
          completed: m.completed,
          score: m.score,
          is_last: m.is_last,
          topics: null, // loaded later

        }));

        setModules(formatted);
      } catch (err) {
        console.error("Course init error:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, userId]);
  // useEffect(() => {
  //     // reset quiz UI whenever module changes
  //     setQuizSubmitted(false);
  //     setUserScore(0);
  //     setIsQuizActive(false);
  //   }, [openModule]);
  const didRestoreRef = useRef(false);

  useEffect(() => {
    if (!modules.length) return;
    if (didRestoreRef.current) return; // 🔒 run only once

    didRestoreRef.current = true;

    const lastModuleId = Number(localStorage.getItem("last_watched_module_id"));
    const lastTopicId = Number(localStorage.getItem("last_watched_topic_id"));

    const moduleIndex =
      modules.findIndex((m) => Number(m.id) === lastModuleId) >= 0
        ? modules.findIndex((m) => Number(m.id) === lastModuleId)
        : 0;

    setOpenModule(moduleIndex);

    fetchTopics(modules[moduleIndex].id, moduleIndex).then(() => {
      const topics = modules[moduleIndex]?.topics;
      if (!topics?.length) {
        setCurrentPointIndex(0);
        return;
      }

      const topicIndex =
        topics.findIndex((t: any) => Number(t.id) === lastTopicId) >= 0
          ? topics.findIndex((t: any) => Number(t.id) === lastTopicId)
          : 0;

      setCurrentPointIndex(topicIndex);
    });
  }, [modules]);

  useEffect(() => {
    const module = modules[openModule ?? -1];
    const topic = module?.topics?.[currentPointIndex];

    if (!module || !topic) return;

    localStorage.setItem("last_watched_module_id", String(module.id));
    localStorage.setItem("last_watched_topic_id", String(topic.id));
  }, [openModule, currentPointIndex]);
  // useEffect(() => {
  //   if (!modules.length) return;

  //   const lastModuleId = Number(localStorage.getItem("last_watched_module_id"));
  //   const moduleIndex = modules.findIndex(m => Number(m.id) === lastModuleId);

  //   if (moduleIndex >= 0) {
  //     setOpenModule(moduleIndex);
  //     fetchTopics(modules[moduleIndex].id, moduleIndex);
  //   } else {
  //     setOpenModule(0);
  //     fetchTopics(modules[0].id, 0);
  //   }
  // }, [modules]);

  // useEffect(() => {
  //   if (!modules.length) return;

  //   let moduleIndex = 0;

  //   // 🔹 Restore module if exists
  //   if (lastModuleId) {
  //     const found = modules.findIndex(
  //       (m) => Number(m.id) === lastModuleId
  //     );
  //     if (found !== -1) {
  //       moduleIndex = found;
  //     }
  //   }

  //   setOpenModule(moduleIndex);

  //   // 🔹 Load topics for selected module
  //   fetchTopics(modules[moduleIndex].id, moduleIndex).then(() => {
  //     const updatedModule = modules[moduleIndex];

  //     if (!updatedModule?.topics?.length) return;

  //     let topicIndex = 0;

  //     // 🔹 Restore topic if exists
  //     if (lastTopicId) {
  //       const foundTopic = updatedModule.topics.findIndex(
  //         (t: any) => Number(t.id) === lastTopicId
  //       );
  //       if (foundTopic !== -1) {
  //         topicIndex = foundTopic;
  //       }
  //     }

  //     setCurrentPointIndex(topicIndex);
  //   });
  // }, [modules]);




  const fetchTopics = async (moduleId: number, index: number) => {
    // already loaded → skip
    if (modules[index]?.topics) return;

    try {
      const res = await fetch(
        `https://backstagepass.co.in/reactapi/api/gettopicapi.php?module_id=${encodeURIComponent(
          moduleId
        )}`,
        {
          cache: "no-store", // ✅ disable cache
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch topics");
      }

      const data = await res.json();

      let topics: any[] = [];
      let selfassessmentlink = "";
      let resourceslink = "";
      let quiz: any = null;
      let totalDuration = 0;

      data.forEach((item: any) => {
        if (item.type === "video") {
          topics.push(item);

          if (item.video_duration) {
            const [h = 0, m = 0, s = 0] = item.video_duration
              .split(":")
              .map(Number);

            totalDuration += h * 3600 + m * 60 + s;
          }
        }

        if (item.title === "selfassessment") {
          selfassessmentlink = item.selfassessmentlink;
        }

        if (item.title === "resources") {
          resourceslink = item.resourceslink;
        }

        // ✅ FIXED QUIZ DETECTION
        if (item.type === "quiz" && Array.isArray(item.topics)) {
          quiz = item;
        }
      });

      // ✅ functional state update (prevents stale state bugs)
      setModules((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          topics,
          selfassessmentlink,
          resourceslink,
          quiz,
          total_video_duration: new Date(totalDuration * 1000)
            .toISOString()
            .substring(11, 8),
        };
        return updated;
      });
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };
  useEffect(() => {
    const module = modules[openModule ?? -1];
    const topic = module?.topics?.[currentPointIndex];

    if (!module || !topic) return;

    try {
      localStorage.setItem(
        "last_watched_module_id",
        String(module.id)
      );
      localStorage.setItem(
        "last_watched_topic_id",
        String(topic.id)
      );
    } catch { }
  }, [openModule, currentPointIndex]);

  // useEffect(() => {
  //   if (openModule === null) return;

  //   const topics = modules[openModule]?.topics;
  //   if (!topics || !topics.length) return;

  //   const topicIndex = topics.findIndex(
  //     (t: any) => Number(t.id) === lastTopicId
  //   );

  //   setCurrentPointIndex(topicIndex >= 0 ? topicIndex : 0);
  // }, [modules, openModule]);



  // useEffect(() => {
  //   if (openModule === null) return;

  //   localStorage.setItem(
  //     "last_watched_module_id",
  //     String(modules[openModule]?.id)
  //   );

  //   localStorage.setItem(
  //     "last_watched_topic_id",
  //     String(modules[openModule]?.topics?.[currentPointIndex]?.id)
  //   );
  // }, [openModule, currentPointIndex]);

  // ensure final quiz exists / has at least 5 questions
  const [quizLoading, setQuizLoading] = useState<boolean>(false);
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
        } catch { }
        setCompletedModuleIds(completed);
      } catch (err) {
        console.error("get_user_progress error:", err);
      }
    })();
    fetchWatchedStatus(userId);
    return () => { mounted = false; };
  }, [userId]);

  // currentTopic safe getter
  // const currentTopic: Topic | undefined = useMemo(() => {
  //   return modules?.[openModule]?.topics?.[currentPointIndex];
  // }, [modules, openModule, currentPointIndex]);
  const currentTopic = useMemo(() => {
    if (openModule === null) return null;
    const mod = modules[openModule];
    if (!mod || !mod.topics || mod.topics.length === 0) return null;
    return mod.topics[currentPointIndex] ?? null;
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
            try { localStorage.setItem("completedModules", JSON.stringify(updated)); } catch { }
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
  const handleNextOrSubmit = () => {
    if (quizAnswers[currentPointIndex] === undefined) {
      setPageNotice("Please select an answer before proceeding.");
      setTimeout(() => setPageNotice(null), 2200);
      return;
    }

    if (isLastQuestion) {
      handleSubmitQuiz();
      return;
    }

    setCurrentPointIndex((c) => c + 1);
  };
  const goToNextQuestion = () => {
    if (quizAnswers[currentPointIndex] === undefined) {
      setPageNotice("Please select an answer before proceeding.");
      setTimeout(() => setPageNotice(null), 2200);
      return;
    }

    const questionLimit =
      modules[openModule]?.questions_limit ?? currentQuestions.length;

    const maxIndex = Math.min(questionLimit, currentQuestions.length) - 1;

    setCurrentPointIndex((c) => (c < maxIndex ? c + 1 : c));
  };

  const handleSubmitQuiz = async () => {
    const assessmentModule = modules[openModule];
    if (!assessmentModule) return;

    const questionLimit =
      assessmentModule.questions_limit ?? currentQuestions.length;

    const totalQuestions = Math.min(
      questionLimit,
      currentQuestions.length
    );

    let correctCount = 0;

    currentQuestions
      .slice(0, totalQuestions)
      .forEach((q: any, idx: number) => {
        const userAns = quizAnswers[idx];
        const correctIdx = q.options.indexOf(q.correct);
        if (userAns === correctIdx) correctCount++;
      });

    const score = totalQuestions
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;

    const moduleId = Number(assessmentModule.id);

    const passScore = Number(assessmentModule.quiz_score ?? 0);
    // attempts
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

      // ✅ PASS
      if (score >= passScore) {
        const quizKey = `quiz-${moduleId}`;

        setCompletedModuleIds((prev) => {
          const updated = Array.from(
            new Set([...prev, moduleId, quizKey as any])
          );
          try {
            localStorage.setItem("completedModules", JSON.stringify(updated));
          } catch { }
          return updated;
        });

        setPageNotice("Quiz completed successfully 🎉");
      }
      // ❌ FAIL
      else {
        const attempts = (quizAttempts[moduleId] || 0) + 1;

        if (attempts >= 3) {
          setPageNotice(
            "You've failed 3 attempts. Please rewatch the video and try again."
          );
        } else {
          setPageNotice(`Attempt ${attempts} failed. Please try again.`);
        }
      }

      setTimeout(() => setPageNotice(null), 3000);
    } catch (err) {
      console.error("submit quiz error:", err);
      setPageNotice("Failed to submit quiz (server error).");
      setTimeout(() => setPageNotice(null), 3000);
    }






    // score is percentage (0–100)
    const passed = score >= passScore;

    setUserScore(score);
    setHasPassed(passed);
    setQuizSubmitted(true);
  };

  // small render guard
  if (loading) {
    return <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-[#E11D2E]" />
      <p className="text-sm font-medium text-gray-600">
        Loading your course…
      </p>
    </div>;
  }

  //const currentModule = modules[openModule];


  const isMandatory =
    currentModule?.has_quiz === 1 &&
    Number(currentModule?.mandatory_status) === 1;
  const isCompleted = currentModule?.completed === "1";
  const canContinue =
    // no quiz at all
    !isMandatory ||           // non-mandatory quiz (always allow)
    (isMandatory && hasPassed); // mandatory + passed

  const questionLimit =
    modules[openModule]?.questions_limit ?? currentQuestions.length;

  const totalQuestions = Math.min(
    questionLimit,
    currentQuestions.length
  );

  const isLastQuestion = currentPointIndex === totalQuestions - 1;



  function handleRetakeQuiz() {
    setFinalAnswers({});        // Clear all answers
    setFinalIndex(0);           // Go back to first question
    setFinalSubmitted(false);   // Mark quiz as not submitted
    setFinalScore(null);        // Clear score
  }
  //   const isMandatory = modules[openModule]?.mandatory_status === "1";
  // const isCompleted = modules[openModule]?.completed === "1";
  // const isLastModule = modules[openModule]?.is_last === "yes";
  // const requiredScore = parseInt(modules[openModule]?.quiz_score || "0", 10);
  // alert(modules[openModule]?.quiz_score);
  // const hasPassed = userScore >= requiredScore;

  // if (modules[openModule]?.type === "quiz" && modules[openModule]?.quiz_score) {
  //   const requiredScore = parseInt(modules[openModule].quiz_score, 10);
  //   const hasPassed = userScore >= requiredScore;

  // } else {
  //   console.warn("This module doesn't have a quiz score");
  // }


  const isQuiz = currentModule?.type === "quiz";
  //const isMandatory = currentModule?.mandatory_status === "1";

  const isLastModule = currentModule?.is_last === "yes";


  let requiredScore = 0;


  //  if (isQuiz && currentModule?.quiz_score) {
  //   requiredScore = parseInt(currentModule.quiz_score, 10);

  //   hasPassed = userScore >= requiredScore;

  // }

  const continueLabel = isLastModule
    ? Courseassignmenttype === "Assignment"
      ? "Continue"
      : "Continue"
    : "Continue";

  const handleRetake = () => {
    setQuizSubmitted(false);
    setCurrentPointIndex(0);
    setQuizAnswers({});
    setCheckedAnswers({});
    setUserScore(0);
    localStorage.removeItem(`quizSubmitted-${openModule}`);
    localStorage.removeItem(`quizScore-${openModule}`);

    const fullQuiz = modules[openModule]?.topics || [];
    const questionsLimit = parseInt(modules[openModule]?.questions_limit || "2", 10);
    const newRandomSubset = getRandomQuestions(fullQuiz, questionsLimit);
    setCurrentQuestions(newRandomSubset);
  };

  // const handleContinue = () => {
  //     const nextModuleArg = isLastModule && Courseassignmenttype === "Assignment" ? Assignmentfile : "";
  //    alert(nextModuleArg);
  //     goToNextModule(nextModuleArg);
  //   };

  const handleContinue = async () => {
    if (openModule === null) return;
    if (isLastModule && isMandatory && hasPassed) {
      setActiveTab("assignment");
      return;
    }

    const nextIndex = openModule + 1;
    if (nextIndex >= modules.length) return;

    setOpenModule(nextIndex);
    setCurrentPointIndex(0);

    await fetchTopics(modules[nextIndex].id, nextIndex);

    setQuizSubmitted(false);
    setUserScore(0);
  };


  //   const startQuiz = (moduleIndex: number) => {
  //   const module = modules[moduleIndex];

  //   if (!module) {
  //     alert("Module not found");
  //     return;
  //   }

  //   if (!module.quiz || !Array.isArray(module.quiz.topics)) {
  //     alert("Quiz not available for this module");
  //     return;
  //   }

  //   setIsQuizActive(true);
  //   setCurrentQuestions(module.quiz.topics);
  //   setCurrentPointIndex(0);
  //   setQuizAnswers({});
  //   setCheckedAnswers({});
  //   setQuizSubmitted(false);
  //   setIsPlaying({});
  // };



  const startQuiz = async (moduleIndex: number) => {
    const module = modules[moduleIndex];

    if (!module) {
      alert("Module not found");
      return;
    }

    // ✅ IF QUIZ ALREADY COMPLETED → SHOW RESULT ONLY
    if (isCompleted) {
      setIsQuizActive(true);
      setQuizSubmitted(true);
      setQuizLoading(false);
      setUserScore(userScore);
      return;
    }

    try {
      setIsQuizActive(true);
      setQuizLoading(true);

      // 🔹 Reset quiz state (ONLY for fresh quiz)
      setCurrentQuestions([]);
      setCurrentPointIndex(0);
      setQuizAnswers({});
      setCheckedAnswers({});
      setQuizSubmitted(false);
      setIsPlaying({});

      const res = await fetch(
        `https://backstagepass.co.in/reactapi/api/getquizquestions.php?module_id=${module.id}&limit=${module.questions_limit}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        throw new Error("Failed to load quiz questions");
      }

      const data = await res.json();

      if (!Array.isArray(data) || !data.length) {
        throw new Error("No quiz questions found");
      }

      const sanitizedQuestions = data.map((q) => ({
        question: q.question,
        options: q.options,
        type: q.type,
        correct: q.correct,
      }));

      setCurrentQuestions(sanitizedQuestions);
    } catch (err) {
      console.error(err);
      alert("Unable to start quiz. Please try again.");
      setIsQuizActive(false);
    } finally {
      setQuizLoading(false);
    }
  };

  interface ChecklistItemProps {
    title: string;
    duration?: string;
    checked?: boolean;
    active?: boolean;
    showResources?: boolean;
    onResourcesClick?: () => void;
  }

  interface ResourceChecklistRowProps {
    title: string;
    duration: string;
    onResourcesClick?: () => void;
  }

  const ResourceChecklistRow = ({
    title,
    duration,
    onResourcesClick,
  }: ResourceChecklistRowProps) => {
    return (
      <div className="flex items-start justify-between px-4 py-3 hover:bg-gray-50">
        {/* LEFT SIDE */}
        <div className="flex gap-3">
          {/* Checkbox */}
          <div className="mt-1 h-5 w-5 border border-gray-400 rounded-sm bg-white" />

          {/* Title + Duration */}
          <div>
            <p className="text-sm text-gray-900 leading-snug">
              {title}
            </p>


          </div>

        </div>
        <div>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
            {/* document / time icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 2h7l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M13 2v5h5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <span>{duration}</span>
          </div>
          {/* RIGHT SIDE */}
          <button
            onClick={onResourcesClick}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-purple-600
                   border border-purple-400 rounded-md hover:bg-purple-50"
          >
            {/* folder icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            Resources
            {/* dropdown arrow */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };



  return (
    <div className="min-h-screen px-4 md:px-2 py-6 bg-white-50">
      <div className="max-w-9xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight">{courseName}</h1>
            <div className="mt-2 flex items-center gap-3">

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



                    // if (titleLower === "assignment" || String(currentModule.type).toLowerCase() === "assignment") {
                    //{activeView === "assignment" && (
                    if (activeView === "assignment") {
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

                    // Default -> video player newone
                    return (
                      <div className="absolute inset-0">
                        {isQuizActive ? (
                          /* ================= QUIZ UI ================= */
                          <div className="absolute inset-0 p-6 overflow-auto bg-white">
                            {isMandatory && isCompleted ? (
                              <div className="text-center p-8">
                                <h3 className="text-2xl font-semibold mb-4">Quiz Completed</h3>
                                <p className="text-lg mt-2 font-medium text-green-700">
                                  Your Score is: {currentModule?.score}
                                </p>
                                <button
                                  onClick={handleContinue}
                                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
                                >
                                  Continue
                                </button>
                              </div>
                            ) : !quizSubmitted ? (
                              /* ---- Quiz In Progress (your existing quiz JSX) ---- */
                              <>
                                <h2 className="text-xl font-semibold mb-4">
                                  Question {currentPointIndex + 1} of {modules[openModule]?.questions_limit}
                                </h2>


                                {isMandatory && (
                                  <p className="bg-red-500 text-white-600 font-medium mt-2" style={{ padding: "10px 20px", marginBottom: "20px", background: "#ff4436", color: "#fff" }}>
                                    <img src="https://cdn1.iconfinder.com/data/icons/creative-round-ui/212/82-128.png" style={{ width: "30px", marginRight: "10px", display: "inline-block", verticalAlign: "middle" }} />
                                    You must score at least {modules[openModule].quiz_score}% to proceed.
                                  </p>
                                )}
                                <p className="mb-4 text-lg">{currentQuestions[currentPointIndex]?.question}</p>
                                <ul className="space-y-3 mb-6">
                                  {currentQuestions[currentPointIndex]?.options?.map((option, idx) => {
                                    const selectedIdx = quizAnswers[currentPointIndex];
                                    const correctAnswer = currentQuestions[currentPointIndex]?.correct;
                                    const isCorrect = option === correctAnswer;
                                    const isSelected = selectedIdx === idx;
                                    const isChecked = checkedAnswers[currentPointIndex];

                                    let optionClasses = "inline-flex items-center space-x-2 p-2 rounded w-full ";
                                    if (isChecked && !isMandatory) {
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
                                            checked={isSelected}
                                            onChange={() => handleAnswerSelect(currentPointIndex, idx)}
                                            className="form-radio"
                                            disabled={isChecked}
                                          />
                                          <span>{option}</span>
                                        </label>
                                      </li>
                                    );
                                  })}
                                </ul>
                                {/* Navigation */}
                                <div className="flex justify-between">
                                  <button
                                    onClick={goToPrevQuestion}
                                    disabled={currentPointIndex === 0}
                                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                                  >
                                    Prev
                                  </button>

                                  {
                                    currentPointIndex === currentQuestions.length - 1 ? (
                                      // Always show Submit on the last question
                                      <button
                                        onClick={handleSubmitQuiz}
                                        className="px-4 py-2 bg-blue-600 text-white rounded"
                                        disabled={quizAnswers[currentPointIndex] === undefined}
                                      >
                                        Submit
                                      </button>
                                    ) : isMandatory ? (
                                      // If it's a mandatory question, show the Next button
                                      <button
                                        disabled={quizAnswers[currentPointIndex] === undefined}
                                        className="px-4 py-2 bg-blue-600 text-white rounded"
                                        onClick={handleNextOrSubmit}
                                      >
                                        {isLastQuestion ? "Submit" : "Next"}
                                      </button>
                                    ) : (
                                      // If it's a non-mandatory question, show the Check button (if answered) and Next button
                                      quizAnswers[currentPointIndex] !== undefined ? (
                                        <>
                                          <button
                                            onClick={() => handleCheckQuestion(currentPointIndex)}
                                            className="px-4 py-2 bg-purple-600 text-white rounded"
                                          >
                                            Check
                                          </button>
                                          <button
                                            onClick={goToNextQuestion}
                                            className="px-4 py-2 bg-blue-600 text-white rounded"
                                            disabled={quizAnswers[currentPointIndex] === undefined}
                                          >
                                            Next
                                          </button>
                                        </>
                                      ) : (
                                        // Show a disabled "Next" button if no answer is selected for non-mandatory questions
                                        <button
                                          onClick={goToNextQuestion}
                                          className="px-4 py-2 bg-blue-600 text-white rounded"
                                          disabled={true}
                                        >
                                          Next
                                        </button>
                                      )
                                    )
                                  }


                                </div>
                              </>
                            ) : isReviewMode ? (
                              /* ---------------- REVIEW MODE ------------------ */
                              <div className="p-6">
                                <h3 className="text-2xl font-semibold mb-4">Review Your Answers</h3>

                                {currentQuestions.map((q, qIndex) => {
                                  const userAnswerIdx = quizAnswers[qIndex];
                                  const correctAnswer = q.correct;

                                  return (
                                    <div key={qIndex} className="mb-6 p-4 border rounded">
                                      <p className="text-lg font-semibold mb-2">
                                        {qIndex + 1}. {q.question}
                                      </p>

                                      <ul className="space-y-2">
                                        {q.options.map((opt, idx) => {
                                          const isCorrect = opt === correctAnswer;
                                          const isSelected = idx === userAnswerIdx;

                                          let className = "p-2 rounded border flex items-center gap-2 ";
                                          if (isSelected && isCorrect)
                                            className += "bg-green-200 border-green-600 text-green-900";
                                          else if (isSelected && !isCorrect)
                                            className += "bg-red-200 border-red-600 text-red-900";
                                          else if (isCorrect) className += "bg-green-100 border-green-400";
                                          else className += "bg-gray-100 border-gray-300";

                                          return (
                                            <li key={idx} className={className}>
                                              <input type="radio" checked={isSelected} disabled />
                                              <span>{opt}</span>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    </div>
                                  );
                                })}

                                <button
                                  onClick={() => setIsReviewMode(false)}
                                  className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                  Back
                                </button>
                              </div>
                            ) : (
                              <div className="text-center p-8">
                                <h3 className="text-2xl font-semibold mb-4">Quiz Submitted!</h3>
                                <p>You answered {currentModule?.questions_limit} questions.</p>
                                <p className="text-lg mt-2 font-medium text-green-700">Score: {currentModule?.score} / 100


                                </p>
                                {isMandatory && quizSubmitted && !hasPassed && (
                                  <p className="text-red-600 mb-2">You did not pass the quiz. Please try again.</p>
                                )}
                                {isMandatory && quizSubmitted && hasPassed && (
                                  <p className="text-green-600 mb-2">
                                    Congratulations! You passed the quiz.
                                  </p>

                                )}

                                <div className="mt-6 flex justify-center gap-4">
                                  <button
                                    onClick={() => setIsReviewMode(true)}
                                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                  >
                                    Review Quiz
                                  </button>
                                  {/* {isMandatory && hasPassed && (
  <button
    onClick={handleContinue}
    className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
  >
    Continue
  </button>
)} */}
                                  {canContinue && (
                                    <button
                                      onClick={handleContinue}
                                      className="px-4 py-2 bg-green-600 text-white rounded"
                                    >
                                      {continueLabel}
                                    </button>
                                  )}


                                  {isMandatory && !hasPassed && (
                                    <button onClick={() => { setQuizSubmitted(false); setCurrentPointIndex(0); setQuizAnswers({}); }} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded">Retake Quiz</button>
                                  )}
                                </div>

                                {/* 
                              {(currentModule.mandatory_status !== "1" || userScore >= parseInt(String(currentModule.quiz_score || "0"), 10)) && (
                                <button onClick={() => { for (let i = openModule + 1; i < modules.length; i++) { setOpenModule(i); break; } }} className="mt-4 ml-4 px-4 py-2 bg-green-600 text-white rounded">Continue</button>
                              )} */}
                              </div>

                            )}
                          </div>
                        ) : (
                          /* ================= VIDEO UI ================= */
                          <>
                            {currentTopic?.id && !isPlaying[currentTopic.id] && (
                              <div className="video-thumbnail relative">
                                <img
                                  src={currentTopic.thumbnail}
                                  alt="Video Thumbnail"
                                  className="w-full rounded"
                                />
                                <div
                                  onClick={() => handleThumbnailClick(String(currentTopic.id))}
                                 style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              backgroundColor: 'rgba(255, 0, 0, 0.85)',
                              padding: '15px',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              boxShadow: '0 0 12px rgba(255,0,0,0.6)',
                            }}
                                >
                                  <button
                              style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: 'white',
                                fontSize: '25px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                padding: 0,
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              ▶
                            </button>
                                </div>
                              </div>
                            )}

                            {currentTopic?.id && isPlaying[currentTopic.id] && (
                              <Muxvideo
                                key={`module-${openModule}-topic-${currentPointIndex}`}
                                videos={
                                  currentTopic.type === "video"
                                    ? (currentTopic as VideoTopic).video
                                    : []
                                }
                                userId={userId ?? ""}
                                topicId={String(currentTopic.id)}
                                resumeTime={resumeTime}
                                currentVideoIndex={currentVideoIndex}
                                onFinish={handleVideoEnd}
                                autoplay
                              />
                            )}
                          </>
                        )}
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
            {/* <div className="mb-3">
              <div className="w-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full h-2 overflow-hidden">
                <div style={{ width: `${progressPercentage}%` }} className="h-full bg-white/10" />
              </div>
              <p className="text-xs text-gray-500 mt-2">{progressPercentage}% complete</p>
            </div> */}

            <ul className="space-y-3">
              {modules.map((module, index) => {
                const isOpen = openModule === index;
                const isUnlocked = isModuleUnlocked(index);
                const isCompletedModule = completedModuleIds.includes(Number(module.id));

                return (
                  <li key={module.id} className="border rounded-lg">
                    {/* MODULE HEADER */}
                    <button
                      disabled={!isUnlocked}
                      className={`w-full flex items-center justify-between px-4 py-3 transition
            ${isOpen ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-800 hover:bg-gray-100"}
          `}
                      onClick={() => {
                        if (!isUnlocked) return;

                        setOpenModule(index);
                        setCurrentPointIndex(0);
                        setFinalIndex(0);
                        setFinalAnswers({});
                        setFinalSubmitted(false);
                        setPageNotice(null);

                        // 🔥 Load topics lazily
                        fetchTopics(module.id, index);
                      }}
                      aria-expanded={isOpen}
                    >
                      <div className="flex justify-between w-full items-center">
                        <span
                          className="font-medium text-sm"
                          title={module.title}
                        >
                          {module.title.length > 20
                            ? module.title.slice(0, 17) + "..."
                            : module.title}
                        </span>

                        {module.total_video_duration && (
                          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            {module.total_video_duration}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 ml-3">
                        {isCompletedModule && <span className="text-green-500 text-sm">✔</span>}
                        {!isUnlocked && <span className="text-gray-400 text-sm">🔒</span>}
                      </div>
                    </button>

                    {/* VIDEO TOPICS */}
                    {isOpen && module.topics?.length > 0 && (
                      <ul className="pt-2 pb-2 text-sm text-gray-600">
                        {module.topics.map((point, idx) => {
                          const isCurrentPlaying =
                            openModule === index && currentPointIndex === idx;

                          const isCompletedTopic =
                            watchedTopicIds.has(Number(point.id));

                          return (
                            <li
                              key={point.id}
                              className={`mb-2 flex items-center justify-between p-3 rounded
                    ${isCurrentPlaying
                                  ? "bg-blue-50 text-blue-800 font-medium"
                                  : "hover:bg-gray-50"}
                  `}
                            >
                              <div className="flex gap-3 flex-1">
                                {/* CHECK */}
                                <span
                                  className={`h-4 w-4 rounded-full border flex items-center justify-center mt-1
                        ${isCompletedTopic
                                      ? "bg-green-500 border-green-500"
                                      : "border-gray-300"}
                      `}
                                >
                                  {isCompletedTopic && (
                                    <svg width="12" height="12" viewBox="0 0 24 24">
                                      <path
                                        d="M20 6L9 17l-5-5"
                                        stroke="white"
                                        strokeWidth="2"
                                        fill="none"
                                      />
                                    </svg>
                                  )}
                                </span>

                                {/* TITLE */}
                                <p
                                  className={`text-sm leading-snug
    ${isCurrentPlaying ? "text-blue-700" : "text-gray-800"}
  `}
                                  title={point.text || point.title || point.question || ""}
                                >
                                  {(() => {
                                    const label =
                                      point.text ??
                                      point.title ??
                                      point.question ??
                                      "";

                                    return label.length > 35
                                      ? label.slice(0, 32) + "..."
                                      : label;
                                  })()}
                                </p>

                              </div>
                              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                <svg width="14" height="14" viewBox="0 0 24 24">
                                  <rect x="3" y="5" width="18" height="14" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                  <polygon points="10 9 16 12 10 15 10 9" fill="currentColor" />
                                </svg>
                                <span>{module.total_video_duration} </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    {isOpen && (
                      <ul className="pt-0 pb-2 text-sm text-gray-600">
                        {module.selfassessmentlink && (
                          <li className={`mb-2 flex items-center justify-between p-3 rounded bg-blue-50 text-blue-800 font-medium`}>
                            <div className="flex gap-3 flex-1">
                              {/* CHECK */}
                              <span
                                className={`h-4 w-4 rounded-full border flex items-center justify-center mt-1 bg-green-500 border-green-500`}
                              >

                                <svg width="12" height="12" viewBox="0 0 24 24">
                                  <path
                                    d="M20 6L9 17l-5-5"
                                    stroke="white"
                                    strokeWidth="2"
                                    fill="none"
                                  />
                                </svg>

                              </span>

                              {/* TITLE */}
                              <p
                                className={`text-sm leading-snug
     text-blue-700
  `}

                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800">
                                    Self Assessment
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Practice questions for this module
                                  </p>
                                </div>
                              </p>

                            </div>
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500"><a
                              href={module.selfassessmentlink}
                              target="_blank"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M7 3l10 9-4 1 3 6-2 1-3-6-4 3V3z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinejoin="round"
                                />
                              </svg>

                              <span>Click </span></a>
                            </div>
                          </li>)}

                          {module.resourceslink && (
                          <li className={`mb-2 flex items-center justify-between p-3 rounded bg-blue-50 text-blue-800 font-medium`}>
                            <div className="flex gap-3 flex-1">
                              {/* CHECK */}
                              <span
                                className={`h-4 w-4 rounded-full border flex items-center justify-center mt-1 bg-green-500 border-green-500`}
                              >

                                <svg width="12" height="12" viewBox="0 0 24 24">
                                  <path
                                    d="M20 6L9 17l-5-5"
                                    stroke="white"
                                    strokeWidth="2"
                                    fill="none"
                                  />
                                </svg>

                              </span>

                              {/* TITLE */}
                              <p
                                className={`text-sm leading-snug
     text-blue-700
  `}

                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800">
                                    Resources
                                  </p>
                                  <p className="text-xs text-gray-500">
                                     Download reference materials
                                  </p>
                                </div>
                              </p>

                            </div>
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500"><a
                              href={module.resourceslink}
                              target="_blank"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M7 3l10 9-4 1 3 6-2 1-3-6-4 3V3z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinejoin="round"
                                />
                              </svg>

                              <span>Click </span></a>
                            </div>
                          </li>)}


                           {isModuleLoaded && module.has_quiz == 1 && (
                          <li className={`mb-2 flex items-center justify-between p-3 rounded bg-blue-50 text-blue-800 font-medium`} onClick={() => startQuiz(index)}>
                            <div className="flex gap-3 flex-1">
                              {/* CHECK */}
                              <span
                                className={`h-4 w-4 rounded-full border flex items-center justify-center mt-1 bg-green-500 border-green-500`}
                              >

                                <svg width="12" height="12" viewBox="0 0 24 24">
                                  <path
                                    d="M20 6L9 17l-5-5"
                                    stroke="white"
                                    strokeWidth="2"
                                    fill="none"
                                  />
                                </svg>

                              </span>

                              {/* TITLE */}
                              <p
                                className={`text-sm leading-snug
     text-blue-700
  `}

                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800">
                                    Start Quiz
                                  </p>
                                  <p className="text-xs text-gray-500">
                                     Test your understanding
                                  </p>
                                </div>
                              </p>

                            </div>
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                              <div>
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M7 3l10 9-4 1 3 6-2 1-3-6-4 3V3z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinejoin="round"
                                />
                              </svg>

                              <span>Click </span></div>
                            </div>
                          </li>)}






                          {isOpen && isModuleLoaded && module.is_last == 'yes' && (
                          <li className={`mb-2 flex items-center justify-between p-3 rounded bg-blue-50 text-blue-800 font-medium`} onClick={() => setActiveView("assignment")}>
                            <div className="flex gap-3 flex-1">
                              {/* CHECK */}
                              <span
                                className={`h-4 w-4 rounded-full border flex items-center justify-center mt-1 bg-green-500 border-green-500`}
                              >

                                <svg width="12" height="12" viewBox="0 0 24 24">
                                  <path
                                    d="M20 6L9 17l-5-5"
                                    stroke="white"
                                    strokeWidth="2"
                                    fill="none"
                                  />
                                </svg>

                              </span>

                              {/* TITLE */}
                              <p
                                className={`text-sm leading-snug
     text-blue-700
  `}

                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800">
                                    Assignment
                                  </p>
                                  <p className="text-xs text-gray-500">
                                     Test your understanding
                                  </p>
                                </div>
                              </p>

                            </div>
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                              <div>
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M7 3l10 9-4 1 3 6-2 1-3-6-4 3V3z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinejoin="round"
                                />
                              </svg>

                              <span>Click </span></div>
                            </div>
                          </li>)}


                          {/* {isOpen && isModuleLoaded && module.is_last == 'yes' && (
                      <div className="px-4 pb-3 text-sm">
                        <button
                          onClick={() => setActiveView("assignment")}
                          className="text-blue-600 hover:underline"
                        >
                          📝 
                        </button>
                      </div>
                    )} */}
                      </ul>)}


{/*                   
                    {isOpen && (
                      <div className="px-3 pb-3 space-y-2">

                     
                        {module.selfassessmentlink && (
                          <a
                            href={module.selfassessmentlink}
                            target="_blank"
                            className="flex items-center gap-3 p-3 rounded-lg border bg-white hover:bg-gray-50 transition"
                          >
                            <span className="text-blue-600 text-lg">📄</span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">
                                Self Assessment
                              </p>
                              <p className="text-xs text-gray-500">
                                Practice questions for this module
                              </p>
                            </div>
                          </a>
                        )}



                       
                        {module.resourceslink && (
                          <a
                            href={module.resourceslink}
                            target="_blank"
                            className="flex items-center gap-3 p-3 rounded-lg border bg-white hover:bg-gray-50 transition"
                          >
                            <span className="text-green-600 text-lg">📚</span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">
                                Resources
                              </p>
                              <p className="text-xs text-gray-500">
                                Download reference materials
                              </p>
                            </div>
                          </a>
                        )}

                       
                        {isModuleLoaded && module.has_quiz == 1 && (
                          <button
                            onClick={() => startQuiz(index)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg border bg-blue-50 hover:bg-blue-100 transition"
                          >
                            <span className="text-orange-600 text-lg">📝</span>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium text-blue-800">
                                Start Quiz
                              </p>
                              <p className="text-xs text-blue-700">
                                Test your understanding
                              </p>
                            </div>
                          </button>
                        )}
                      </div>
                    )} */}

                    {/* {isOpen && isModuleLoaded && module.is_last == 'yes' && (
                      <div className="px-4 pb-3 text-sm">
                        <button
                          onClick={() => setActiveView("assignment")}
                          className="text-blue-600 hover:underline"
                        >
                          📝 Assignment
                        </button>
                      </div>
                    )} */}
                  </li>
                );
              })}
            </ul>

          </aside>
        </div>

        <div className="max-w-5xl pl-5 pt-5 bg-white overflow-hidden grid">
          {/* TAB HEADER */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-2 text-sm font-medium border-b-2 ${activeTab === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-blue-600"
                  }`}
              >
                Overview
              </button>

              <button
                onClick={() => setActiveTab("contact")}
                className={`pb-2 text-sm font-medium border-b-2 ${activeTab === "contact"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-blue-600"
                  }`}
              >
                Connect with Mentor
              </button>

              {/* <button
        onClick={() => setActiveTab("whomfor")}
        className={`pb-2 text-sm font-medium border-b-2 ${
          activeTab === "whomfor"
            ? "border-blue-600 text-blue-600"
            : "border-transparent text-gray-600 hover:text-blue-600"
        }`}
      >
        Whom For
      </button> */}

              <button
                onClick={() => setActiveTab("outcome")}
                className={`pb-2 text-sm font-medium border-b-2 ${activeTab === "outcome"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-blue-600"
                  }`}
              >
                Outcome
              </button>
            </nav>
          </div>

          {/* TAB CONTENT */}
          <div className="mt-4 text-sm text-gray-700">
            {activeTab === "overview" && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Topic Overview</h3>
                {/* <p>{courseOverview || "Overview will be updated soon."}</p> */}

                <p>{currentTopic?.description || "Overview will be updated soon."} </p>
              </div>
            )}

            {activeTab === "contact" && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Connect with Mentor</h3>
                <Calendar id={id} />
              </div>
            )}

            {/* {activeTab === "whomfor" && (
      <div>
        <h3 className="text-lg font-semibold mb-2">Whom is this course for?</h3>
        <p>
          {courseWhomFor ||
            "This section will describe who should take this course (beginners, intermediate learners, etc.)."}
        </p>
      </div>
    )} */}

            {activeTab === "outcome" && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Course Outcome</h3>
                <p>
                  {courseOutcome ||
                    "This section will list the learning outcomes and skills you will gain after completing the course."}
                </p>
              </div>
            )}
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
          background: #fff;
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
