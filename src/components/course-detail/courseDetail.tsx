"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Calendar from "@/components/mentor/mentor";
import Muxvideo from "@/components/MuxVideoplayer";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";


interface CourseClientProps {
  id: string;
}


type TopicVideoVersion = {
  playback_id?: string;
  file?: string;
};

type TopicBase = {
  id: string | number;
  text: string;
  type: "video" | "quiz";
  watched?: boolean;
  video_duration?: string;
  mentor_name?: string;
  description?: string;
};

type VideoTopic = TopicBase & {
  type: "video";
  video: TopicVideoVersion[] | string[] | any[];
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
  description?: string;
};

type Topic = VideoTopic | QuizTopic;

type Module = {
  resourceslink: null;
  questions_limit: string;
  selfassessmentlink: boolean;
  selfassessment: any;
  score: ReactNode;

  is_last: string;
  mandatory_status: string;
  quiz_score: ReactNode;
  type: string;
  id: string | number;
  title: string;
  topics: Topic[];
  completed: string;
  total_video_duration?: string;
};

type AssignmentState = {
  coursename: ReactNode;
  marks: any;
  releaseAt?: string | null; // ISO string when downloaded
  downloaded?: boolean;
  submittedAt?: string | null;
  submittedFileName?: string | null;
  evaluated?: boolean;
};

const msToParts = (ms: number) => {
  if (ms <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
  const secs = Math.floor(ms / 1000);
  const days = Math.floor(secs / (24 * 3600));
  const hours = Math.floor((secs % (24 * 3600)) / 3600);
  const mins = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return { days, hours, mins, secs: s };
};

// Inline AssignmentPanel inside same file (per your request)
// Replace the old AssignmentPanel with this improved version

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
      const raw = localStorage.getItem(STORAGE_KEY);
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

  const isMentor =
    typeof window !== "undefined" && localStorage.getItem("role") === "mentor";

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  const mentorassignmentgrade = !!state.marks;
  //alert(submitted);

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
      alert("Assignment file not available.");
      return;
    }

    const nowIso = new Date().toISOString();
    setState((s) => ({ ...s, releaseAt: nowIso, downloaded: true }));

    try {
      const response = await fetch("https://backstagepass.co.in/reactapi/save_assignment_download.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          downloadTime: nowIso,
          userId: localStorage.getItem("userId"),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to save download time");
      window.open(assignmentFile, "_blank");
    } catch (error) {
      console.error("Failed to open assignment file or save download time:", error);
    }
  };
  useEffect(() => {
    const fetchAssignmentStatus = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await fetch(
          `https://backstagepass.co.in/reactapi/get_assignment_status.php?userId=${userId}&courseId=${courseId}`
        );
        const data = await res.json();

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
    if (!file || !studentWindowActive) return;
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in.");
      return;
    }
    const formData = new FormData();
    formData.append("assignmentFile", file);
    formData.append("userId", userId);
    formData.append("courseId", courseId);

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
      alert("Assignment submitted successfully.");
    } catch (err) {
      console.error(err);
      alert("There was an error submitting your assignment.");
    }
  };

  const markEvaluated = () => setState((s) => ({ ...s, evaluated: true }));
  const resetLocal = () => {
    if (!confirm("Reset assignment state locally?")) return;
    setState({ releaseAt: null, downloaded: false, submittedAt: null, submittedFileName: null, evaluated: false, marks: null, grade: null });
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg border border-gray-100 transform transition-all duration-400 ease-out animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 ">
            <img style={{ width: "50px" }} src="https://cdn1.iconfinder.com/data/icons/creative-round-ui/243/64-128.png" />
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-semibold leading-tight">Assignment</h3>
            <p className="text-xs text-gray-500 mt-0.5">Assignment task & submission window</p>
          </div>
        </div>

        {/* <button onClick={resetLocal} className="text-sm text-gray-400 hover:text-gray-600">Reset (local)</button> */}
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {state.marks == null && (
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
                    <div className="text-sm font-semibold text-green-600"><img src="https://cdn1.iconfinder.com/data/icons/creative-round-ui/240/14-1024.png" style={{ width: "90px" }} /></div>
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
                  <div className="text-lg font-semibold text-green-600">Submitted</div>
                  <div className="text-md text-gray-500">
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
        )}


        <div className="md:col-span-2 bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
          {!state.releaseAt ? (
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
              {/* ✅ Show success message if marks are not null */}
              {state.marks != null ? (
                <div className="text-center p-6 bg-green-50 rounded-md border border-green-200">
                  <h3 className="text-lg font-semibold text-green-700">
                    <img src="https://cdn4.iconfinder.com/data/icons/game-ui-set-3/96/Medal_bronze-512.png" style={{ width: "100px", margin: "0 auto" }} />
                    You Have Successfully Completed {state.coursename} Course You can download Certificate.
                  </h3>
                </div>
              ) : (
                <>
                  {/* ✅ Upload/submission UI shown only when marks are null */}
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
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M12 3v12" stroke="#4f46e5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 7l4-4 4 4" stroke="#4f46e5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M20 21H4" stroke="#4f46e5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="text-sm text-indigo-600 font-medium">
                            {studentWindowActive ? "Choose File" : "Upload Disabled"}
                          </span>
                        </label>

                        <div>
                          <button
                            onClick={() => {
                              if (!state.submittedAt) alert("Please select a file using 'Choose File' first.");
                            }}
                            className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>

                    {state.submittedAt && (
                      <div className="mt-3 bg-gray-50 rounded p-3 text-sm">
                        <div className="flex items-center justify-between">
                          <div style={{ lineHeight: "29px" }}>
                            <div className="text-xs text-gray-500">Submitted</div>
                            <div className="font-medium">{state.submittedFileName}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(state.submittedAt).toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="inline-block px-2 py-1 rounded bg-green-50 text-green-600 text-xs font-semibold">
                              Awaiting review
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Mentor logic still shown based on 'submitted' */}
              {isMentor && submitted && (state.marks == null || state.marks === 0) && (
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Mentor evaluation window</div>
                    <div className="mt-2 text-lg font-mono text-gray-800">--</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Ends: {mentorDeadline?.toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={markEvaluated}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      Mark Evaluated
                    </button>
                  </div>
                </div>
              )}

              {!isMentor && submitted && (state.marks == null || state.marks === 0) && (
                <div className="mt-4 text-sm text-gray-500" style={{ color: "#fff", display: "flex", alignItems: "center", justifyContent: "flex-start", padding: "10px 20px", marginBottom: "20px", background: "#ff9800" }}>
                  <img src="https://cdn1.iconfinder.com/data/icons/creative-round-ui/223/2-128.png" style={{ width: "30px", marginRight: "10px" }} /> Mentor will evaluate within {mentorWindowWeeks} week(s). You will be notified after evaluation.
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: string;
}

const CourseDetailsPage: React.FC<CourseClientProps> = ({ id }) => {
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  // Function to handle click on the thumbnail
  const handleThumbnailClick = (topicId: string) => {
    setIsPlaying((prevState) => ({
      ...prevState,
      [topicId]: true, // Set video to play for this specific topic
    }));
  };
  const videoRef = useRef<HTMLVideoElement | null>(null);
  //const [courseWhomFor, setCourseWhomFor] = useState("");
  const [courseOutcome, setCourseOutcome] = useState("");
  const [mentorname, setMentorname] = useState("");

  const [activeTab, setActiveTab] =
    useState<"overview" | "contact" | "outcome">("overview");

  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);
  const [courseName, setCourseName] = useState("");
  const [courseOverview, setCourseOverview] = useState("");
  const [courseEnddate, setCourseEnddate] = useState("");
  const [Courseassignmenttype, setCourseassignmenttype] = useState("");
  const [Assignmentfile, setCourseassignmentfile] = useState<string>("");
  const [isAssignmentenabled, setCourseassignmentenable] = useState<string>("");
  const [finalquizscorelimit, setFinalquizscorelimit] = useState<string>("");


  const [openModule, setOpenModule] = useState<number>(0);
  const [currentPointIndex, setCurrentPointIndex] = useState<number>(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);

  const [userId, setUserId] = useState<string | null>(null);

  // watched topic ids from server
  const [watchedTopicIds, setWatchedTopicIds] = useState<Set<number>>(new Set());
  // completed module ids stored as numbers
  const [completedModuleIds, setCompletedModuleIds] = useState<number[]>([]);

  // completed video count used for UI progress
  const [completedVideoCount, setCompletedVideoCount] = useState<number>(0);
  const [isReviewMode, setIsReviewMode] = useState(false);
  // quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState<Record<number, number>>({});

  // Final Quiz state (separate from other quiz state)
  const [finalAnswers, setFinalAnswers] = useState<Record<number, number>>({});
  const [finalIndex, setFinalIndex] = useState<number>(0);
  const [finalSubmitted, setFinalSubmitted] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const totalFinalQuestions = useMemo(() => {
    const m = modules.find((m) => m.title === "Final Quiz") ?? modules[openModule];
    return (m?.topics?.length ?? 0) || 5; // fallback 5
  }, [modules, openModule]);


  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);

  function getRandomQuestions(allQuestions: QuizQuestion[], limit: number): QuizQuestion[] {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  }

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

  // Ensure Final Quiz always has at least 5 questions (placeholders if server sent fewer)
  useEffect(() => {
    if (!modules || modules.length === 0) return;

    const fqIndex = modules.findIndex(
      (m) => String(m.title).toLowerCase() === "final quiz"
    );
    if (fqIndex === -1) return;

    const existingTopics = modules[fqIndex]?.topics ?? [];

    // ✅ Only run if Final Quiz module has fewer than 5 questions
    if (existingTopics.length >= 5) return;

    const fetchFinalQuiz = async () => {
      try {
        const resp = await fetch(
          `https://backstagepass.co.in/reactapi/final_quiz_api.php?id=${encodeURIComponent(id)}`
        );
        if (!resp.ok) throw new Error("Failed to fetch final quiz");

        const data = await resp.json();
        const fetchedQuestions = Array.isArray(data.questions) ? data.questions : [];

        let quizTopics: Topic[] = [];

        if (fetchedQuestions.length > 0) {
          quizTopics = fetchedQuestions.map((q, index) => ({
            id: `finalquiz-topic-${id}-${index + 1}`,
            text: `Final Quiz Q${index + 1}`,
            type: "quiz",
            question: q.question,
            options: q.options,
            correct: q.correct,
          })) as unknown as Topic[];
        }

        // Only update if we have at least one topic
        if (quizTopics.length > 0) {
          setModules((prev) => {
            const next = [...prev];
            next[fqIndex] = {
              ...next[fqIndex],
              topics: quizTopics.slice(0, 5),
            };
            return next;
          });
        }
      } catch (err) {
        console.error("Failed to load final quiz questions:", err);
      }
    };

    fetchFinalQuiz();
  }, [modules.length, id]); // 👈 only depend on module count and id




  const handleFinalSelect = (questionIndex: number, optionIndex: number) => {
    setFinalAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));

    // auto-advance after selecting (unless last question)
    const m = modules[openModule];
    const total = m?.topics?.length ?? totalFinalQuestions;
    if (questionIndex < total - 1) {
      setTimeout(() => setFinalIndex((i) => Math.min(i + 1, total - 1)), 120); // small delay to show selection
    } else {
      // last question selected
      // keep on last; allow submit
    }
  };

  const handleFinalPrev = () => {
    setFinalIndex((i) => Math.max(0, i - 1));
  };

  const computeFinalProgressPercent = () => {
    const m = modules[openModule];
    const total = m?.topics?.length ?? totalFinalQuestions;
    const answered = Object.keys(finalAnswers).length;
    return Math.round((answered / total) * 100);
  };



  // resume time for the current topic+playback
  const [resumeTime, setResumeTime] = useState<number>(0);


  useEffect(() => {
    setCurrentPointIndex(0);
    setQuizSubmitted(false);
    setQuizAnswers({});
  }, [openModule]);
  // load userId from localStorage once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("userId");
      setUserId(stored);
    } catch (err) {
      setUserId(null);
    }
  }, []);
  const goToNextModulenew = (assignmentFile?: any) => {
    const isLastModule = true;

    if (isLastModule) {



      // Do something with assignmentFile
      console.log("Assignment file passed:", assignmentFile);
      ensureAssignmentModule?.(assignmentFile); // <-- pass it here if needed

      return;
    }

    setOpenModule((prev) => prev + 1);
    setQuizSubmitted(false);
    setCurrentPointIndex(0);
    setQuizAnswers({});
    setCheckedAnswers({});
  };

  // Fetch modules for this course + user when userId or id change
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
        setCourseassignmentenable(data.assignmentenable ?? "");
        setFinalquizscorelimit(data.coursequizscore ?? "");

        //setCourseWhomFor(data.whom_for ?? "");   // adjust key names if your API uses different ones
        setCourseOutcome(data.outcome ?? "");
        setMentorname(data.mentor_name ?? "");




        // Ensure Assignment module exists in the module list (always show Assignment tab)
        let finalModules = [...fetchedModules];

        const currentModule = modules[openModule];
        const hasAssignment =
          String(data.assignmenttype).toLowerCase() === "assignment" &&
          data.assignmentfile &&
          data.assignmentfile.trim() !== "";


        const assignmentEnabled = data.assignmentenable === "yes";

        // If server provided an assignment, append it; otherwise append a placeholder assignment
        const assignmentExists = finalModules.some((m) => String(m.title).toLowerCase() === "assignment");
        if (hasAssignment) {
          if (assignmentEnabled && !assignmentExists) {
            finalModules.push({
              type: "assignment",
              id: `client-assignment-${id}`,
              title: "Assignment",
              file: data.assignmentfile,
              topics: [
                {
                  id: `assignment-topic-${id}`,
                  text: "Assignment",
                  type: "video",
                } as unknown as Topic,
              ],
              total_video_duration: "",
              is_last: "",
              mandatory_status: "",
              completed: "",
              quiz_score: undefined,
              score: undefined as any,
            } as unknown as Module);
          } else {
            // update existing assignment module if file is present
            finalModules = finalModules.map((m) =>
              String(m.title).toLowerCase() === "assignment"
                ? { ...m, file: data.assignmentfile }
                : m
            );
          }
        } else {
          // Remove any stale assignment module if file not valid
          finalModules = finalModules.filter(
            (m) => String(m.title).toLowerCase() !== "assignment"
          );

          // ---- HANDLE FINAL QUIZ PLACEHOLDER ----
          const finalQuizExists = finalModules.some(
            (m) => String(m.title).toLowerCase() === "final quiz"
          );
          if (assignmentEnabled) {
            if (!finalQuizExists) {
              finalModules.push({
                type: "quiz",
                id: `client-finalquiz-${id}`,
                title: "Final Quiz",
                topics: [
                  {
                    id: `finalquiz-topic-${id}-1`,
                    text: "Sample question (placeholder) - replace with server data",
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
                score: undefined as any,
              } as unknown as Module);
            }
          }
        }



        setModules(finalModules);

        // Determine if last module is complete and open assignment
        const lastIndex = fetchedModules.findIndex((m) => m.is_last === "yes");
        if (data.assignment_enabled === "yes" && lastIndex !== -1) {
          const isLastCompleted = fetchedModules[lastIndex]?.completed === "1";
          if (isLastCompleted) {
            // Open Assignment
            setOpenModule(finalModules.length - 1); // Assignment is last
            //goToNextModulenew(data.assignmentfile);
          } else {
            setOpenModule(0); // Start from beginning
          }
        } else {
          setOpenModule(0); // No assignment or no last module — open first
        }

        const completedQuiz = fetchedModules.find(
          (m) => m.type === "quiz" && m.completed === "1" && m.score
        );

        if (completedQuiz?.score) {
          const scoreValue = parseFloat(completedQuiz.score);
          if (!isNaN(scoreValue)) {
            setUserScore(scoreValue);
          } else {
            console.warn("Score from API is not a valid number:", completedQuiz.score);
            setUserScore(0); // fallback
          }
        } else {
          setUserScore(0); // no score found
        }

        // Derive watched count if server provided watched flags
        const watchedCount =
          fetchedModules
            .filter((m) => m.title !== "Assessment")
            .reduce((acc, m) => acc + (m.topics?.filter((t) => t.watched).length ?? 0), 0) || 0;

        setCompletedVideoCount(watchedCount);
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          console.error("fetch modules error:", err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      ac.abort();
    };
  }, [userId, id]);


  // fetch watched topic ids set (from server)
  const fetchWatchedStatus = async (uid?: string | null) => {
    if (!uid) return;
    try {
      const resp = await fetch(
        `https://backstagepass.co.in/reactapi/fetch_watched.php?user_id=${encodeURIComponent(
          uid
        )}&status=watched`
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

  // fetch user progress (completed modules list)
  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(
          `https://backstagepass.co.in/reactapi/get_user_progress.php?user_id=${encodeURIComponent(
            userId
          )}`
        );
        const data = await res.json();
        if (!mounted) return;
        const completed = Array.isArray(data.completedModules)
          ? data.completedModules.map((x: any) => Number(x)).filter((n: number) => !Number.isNaN(n))
          : [];
        // store to localStorage and state
        try {
          localStorage.setItem("completedModules", JSON.stringify(completed));
        } catch { }
        setCompletedModuleIds(completed);
      } catch (err) {
        console.error("get_user_progress error:", err);
      }
    })();

    // Also fetch watched topic ids
    fetchWatchedStatus(userId);

    return () => {
      mounted = false;
    };
  }, [userId]);

  // helper: get current topic safely
  const currentTopic: Topic | undefined = useMemo(() => {
    return modules?.[openModule]?.topics?.[currentPointIndex];
  }, [modules, openModule, currentPointIndex]);

  // compute total video points (exclude Assessment & Assignment)
  const totalVideoPoints = useMemo(() => {
    return modules
      .filter((m) => m.title !== "Assessment" && m.title !== "Assignment")
      .reduce((acc, m) => acc + (Array.isArray(m.topics) ? m.topics.length : 0), 0);
  }, [modules]);

  // progress percent guard divide by zero
  const progressPercentage =
    totalVideoPoints > 0 ? Math.round((completedVideoCount / totalVideoPoints) * 100) : 0;

  // When topic changes, fetch resumeTime for that topic+playback (if available)
  useEffect(() => {
    if (!userId || !currentTopic) {
      setResumeTime(0);
      return;
    }

    // const topicId = currentTopic.id;
    // const playbackId =
    //   (currentTopic as any).playback_id ??
    //   (Array.isArray((currentTopic as any).video)
    //     ? (currentTopic as any).video?.[currentVideoIndex]?.playback_id
    //     : undefined);

    // if (!topicId || !playbackId) {
    //   setResumeTime(0);
    //   return;
    // }

    const topicId = currentTopic.id;
    const video =
      Array.isArray((currentTopic as any).video)
        ? (currentTopic as any).video[currentVideoIndex]
        : null;

    if (!topicId || !video) {
      setResumeTime(0);
      return;
    }

    let mounted = true;
    const ac = new AbortController();

    (async () => {
      try {
        // const res = await fetch(
        //   `https://backstagepass.co.in/reactapi/get_progress.php?user_id=${encodeURIComponent(
        //     userId
        //   )}&topic_id=${encodeURIComponent(String(topicId))}&playback_id=${encodeURIComponent(
        //     String(playbackId)
        //   )}`,

        const res = await fetch(
          `https://backstagepass.co.in/reactapi/get_progress.php?user_id=${encodeURIComponent(
            userId
          )}&topic_id=${encodeURIComponent(String(topicId))}}`,
          { signal: ac.signal }
        );
        if (!res.ok) throw new Error("failed to fetch progress");
        const json = await res.json();
        const ct = parseFloat(json.current_time) || 0;
        if (mounted) setResumeTime(ct);
      } catch (err) {
        if ((err as any).name !== "AbortError") console.error(err);
      }
    })();

    return () => {
      mounted = false;
      ac.abort();
    };
  }, [userId, currentTopic, currentVideoIndex]);
  useEffect(() => {
    //  Safety check to avoid calling localStorage with undefined index
    if (!modules || !modules[openModule]) return;

    const submitted = localStorage.getItem(`quizSubmitted-${openModule}`);
    const score = localStorage.getItem(`quizScore-${openModule}`);

    if (submitted === "true") {
      setQuizSubmitted(true);
    }

    if (score) {
      setUserScore(parseInt(score, 10));
    }
  }, [modules, openModule]);

  useEffect(() => {
    const fetchFinalQuizScore = async () => {
      try {
        const resp = await fetch(`https://backstagepass.co.in/reactapi/get_final_quiz_score.php?user_id=${userId}&course_id=${id}`);
        const data = await resp.json();

        if (data?.score !== undefined) {

          setFinalScore(data.score);
          setFinalSubmitted(true);
        } else {
          setFinalScore(0);
          setFinalSubmitted(false);
        }
      } catch (e) {
        console.error("Error fetching final quiz score", e);
      }
    };

    fetchFinalQuizScore();
  }, [userId, id]);

  // When modules load, attempt to restore last topic from server
  useEffect(() => {
    if (!userId || modules.length === 0) return;
    let mounted = true;

    (async () => {
      try {
        const res = await fetch(
          `https://backstagepass.co.in/reactapi/get_last_topic.php?user_id=${encodeURIComponent(
            userId
          )}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;

        const lastTopicId = data.topic_id;
        //const lastPlaybackId = data.playback_id;

        if (!lastTopicId) return;

        let found = false;
        modules.forEach((module, mIndex) => {
          if (Array.isArray(module.topics)) {
            module.topics.forEach((topic, tIndex) => {
              if (String(topic.id) === String(lastTopicId)) {
                setOpenModule(mIndex);
                setCurrentPointIndex(tIndex);

                if (Array.isArray((topic as any).video)) {
                  const idx = (topic as any).video.findIndex((v: any) => v.topic_id === topic.id);
                  setCurrentVideoIndex(idx >= 0 ? idx : 0);
                } else {
                  setCurrentVideoIndex(0);
                }
                found = true;
              }
            });
          }
        });

        if (!found) {
          setOpenModule(0);
          setCurrentPointIndex(0);
        }
      } catch (err) {
        console.error("get_last_topic error:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [modules, userId]);

  // when a video finishes, advance index or module; also mark watched
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
    } catch (e) {
      console.error(e);
    }

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
            try {
              localStorage.setItem("completedModules", JSON.stringify(updated));
            } catch { }
            return updated;
          });
        }

        let nextIdx = openModule + 1;
        while (nextIdx < modules.length && (modules[nextIdx].topics?.length ?? 0) === 0) {
          nextIdx++;
        }
        if (nextIdx < modules.length) {
          setOpenModule(nextIdx);
          return 0;
        } else {
          return 0;
        }
      }
    });
  };

  // Utils for module unlocking
  // const isModuleUnlocked = (index: number) => {
  //   if (index === 0) return true;
  //   const previousModuleWithId = modules.slice(0, index).reverse().find((m) => m.id !== undefined && m.id !== null);
  //   if (!previousModuleWithId) return true;
  //   const prevId = Number(previousModuleWithId.id);
  //   return completedModuleIds.includes(prevId);
  // };
  const [checkedAnswers, setCheckedAnswers] = useState<{ [questionIndex: number]: boolean }>({});

  const handleCheckQuestion = (questionIndex: number) => {
    setCheckedAnswers((prev) => ({
      ...prev,
      [questionIndex]: true
    }));
  };
  const isModuleUnlocked = (index: number) => {
    const current = modules[index];

    // First module is always unlocked
    if (index === 0) return true;

    // If current is an Assessment module
    if (current.title === "Assessment") {
      // Find the immediate previous video module
      const previousVideoModule = [...modules]
        .slice(0, index)
        .reverse()
        .find((m) => m.type === "video");

      if (!previousVideoModule) return false;

      return completedModuleIds.includes(Number(previousVideoModule.id));
    }

    // If current is a video module
    // Find the previous video module in normal order
    let previousVideoIndex = -1;
    for (let i = index - 1; i >= 0; i--) {
      if (modules[i].type === "video") {
        previousVideoIndex = i;
        break;
      }
    }

    if (previousVideoIndex === -1) return false;

    const previousVideo = modules[previousVideoIndex];
    const videoDone = completedModuleIds.includes(Number(previousVideo.id));

    // Check if there's an assessment module immediately after previous video
    const maybeAssessment = modules[previousVideoIndex + 1];
    const isAssessmentRequired =
      maybeAssessment?.title === "Assessment" && maybeAssessment.mandatory_status === "1";

    const quizKey = `quiz-${previousVideoIndex + 1}`;
    const quizDone = !isAssessmentRequired || completedModuleIds.includes(quizKey);

    return videoDone && quizDone;

  };



  // Quiz interactions
  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const goToPrevQuestion = () => {
    setCurrentPointIndex((p) => Math.max(0, p - 1));
  };

  const goToNextQuestion = () => {
    if (quizAnswers[currentPointIndex] === undefined) {
      alert("Please select an answer before proceeding.");
      return;
    }
    const maxIndex = (modules[openModule]?.topics?.length ?? 1) - 1;
    setCurrentPointIndex((c) => (c < maxIndex ? c + 1 : c));
  };

  // ensure Assignment module exists (client-side only)
  const ensureAssignmentModule = (assignmentFile?: any) => {

    setModules((prev) => {
      const exists = prev.some((m) => m.title === "Assignment");
      if (exists) return prev;

      const assignmentModule: Module = {
        type: "assignment",
        id: `client-assignment-${id}`,
        title: "Assignment",
        file: assignmentFile,
        topics: [
          {
            id: `assignment-topic-${id}`,
            text: "Assignment",
            type: "video",
            // add file reference if needed
          } as unknown as Topic,
        ],
        total_video_duration: "",
        is_last: "",
        mandatory_status: "",
        completed: "",
        quiz_score: undefined
      };

      const updated = [...prev, assignmentModule];

      // Set openModule to the new assignment module index (last index)
      setOpenModule(updated.length - 1);  // <-- Add this to switch to assignment automatically

      setCurrentPointIndex(0);  // Reset any relevant indexes
      setQuizSubmitted(false);  // If you track quiz submission state
      setQuizAnswers({});
      setCheckedAnswers({});

      return updated;
    });
  };

  const [userScore, setUserScore] = useState(0);
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
      const justCompletedModule = modules.slice(0, openModule).reverse().find((m) => m.id);
      await fetch("https://backstagepass.co.in/reactapi/submit_quiz.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          module_id: Number(justCompletedModule?.id),
          score,
        }),
      });

      if (score >= 20 && justCompletedModule) {
        const nextModuleWithId = modules
          .slice(modules.indexOf(justCompletedModule) + 1)
          .find((m) => m.id);
        if (nextModuleWithId && !Number.isNaN(Number(nextModuleWithId.id))) {

          //  const aboveId = Number(justCompletedModule.id);
          //const quizKey = `quiz-${openModule}`; // <-- Add a quiz-specific key

          // setCompletedModuleIds((prev) => {
          //   const updated = Array.from(new Set([...prev, aboveId]));
          //   try {
          //     localStorage.setItem("completedModules", JSON.stringify(updated));
          //   } catch {}
          //   return updated;
          // });
          const aboveId = Number(justCompletedModule.id);
          const quizKey = `quiz-${openModule}`;

          setCompletedModuleIds((prev) => {
            const updated = Array.from(new Set([...prev, aboveId, quizKey]));
            try {
              localStorage.setItem("completedModules", JSON.stringify(updated));
            } catch { }
            return updated;
          });
        } else {
          try {
            await fetch(
              `https://backstagepass.co.in/reactapi/fetch_watched.php?user_id=${userId}&courseid=${id}&status=completed`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId }),
              }
            );
          } catch (e) {
            console.error("setCompletedCourseDetails failed:", e);
          }
        }

        // ***** HERE: append the Assignment module client-side *****
        //ensureAssignmentModule();
      } else {
        const attempts = (quizAttempts[moduleId] || 0) + 1;
        if (attempts >= 3) {
          //alert("You've failed 3 attempts. Please rewatch the video and try again.");
          setQuizSubmitted(false);
        } else {
          //alert(`Attempt ${attempts} failed. Please try again.`);
        }
      }
    } catch (err) {
      console.error("submit quiz error:", err);
    }
    setUserScore(score);
    setQuizSubmitted(true);
  };

  // small render guards
  if (loading) {
    return <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-[#E11D2E]" />
      <p className="text-sm font-medium text-gray-600">
        Loading your course…
      </p>
    </div>;
  }
  const goToNextTopicOrModule = (p0: number) => {
    const currentModule = modules[openModule];

    if (currentPointIndex < currentModule.topics.length - 1) {
      setCurrentPointIndex((prev) => prev + 1);
    } else {
      // Move to next unlocked module
      for (let i = openModule + 1; i < modules.length; i++) {
        if (isModuleUnlocked(i)) {
          setOpenModule(i);
          setCurrentPointIndex(0);
          break;
        }
      }
    }
  };

  const goToPrevTopicOrModule = (p0: number) => {
    if (currentPointIndex > 0) {
      setCurrentPointIndex((prev) => prev - 1);
    } else {
      // Move to previous unlocked module (if any)
      for (let i = openModule - 1; i >= 0; i--) {
        if (isModuleUnlocked(i)) {
          const lastTopicIndex = modules[i].topics?.length ? modules[i].topics.length - 1 : 0;
          setOpenModule(i);
          setCurrentPointIndex(lastTopicIndex);
          break;
        }
      }
    }
  };
  const handleCheckQuiz = () => {
    setQuizSubmitted(true);
    // Optionally play sound or show explanation here
  };

  // const goToNextModule = (assignmentFile?: any) => {
  //   const isLastModule = openModule === modules.length - 1;
  //  if (isLastModule) {
  //     if (Courseassignmenttype === "Assignment") {
  //       console.log("Assignment file passed:", assignmentFile);
  //       ensureAssignmentModule?.(assignmentFile);
  //     } else {
  //       //  Check if the last module is NOT already the Final Quiz
  //       const finalQuizIndex = modules.findIndex(
  //         (mod) => mod.title === "Final Quiz"
  //       );

  //       if (finalQuizIndex !== -1) {
  //         setOpenModule(finalQuizIndex); //  Go to the Final Quiz module
  //       } else {
  //         alert("Final Quiz not found.");
  //       }
  //     }
  //     return;
  //   }

  //   setOpenModule((prev) => prev + 1);
  //   setQuizSubmitted(false);
  //   setCurrentPointIndex(0);
  //   setQuizAnswers({});
  //   setCheckedAnswers({});
  // };
  const goToNextModule = (assignmentFile?: any) => {
    localStorage.setItem(`quizSubmitted-${openModule}`, "true");
    localStorage.setItem(`quizScore-${openModule}`, userScore.toString());
    const isLastModule = openModule === modules.length - 1;

    if (isLastModule) {
      if (Courseassignmenttype === "Assignment") {
        console.log("Assignment file passed:", assignmentFile);
        ensureAssignmentModule?.(assignmentFile);
      } else {
        const finalQuizIndex = modules.findIndex(
          (mod) => mod.title === "Final Quiz"
        );

        if (finalQuizIndex === -1) {
          // Create final quiz module
          const finalQuizModule = {
            type: "quiz",
            id: `client-finalquiz-${id}`,
            title: "Final Quiz",
            topics: [
              {
                id: `finalquiz-topic-${id}-1`,
                text: "Sample question",
                type: "quiz",
                question: "What's 2 + 2?",
                options: ["1", "2", "3", "4"],
                correct: "4",
              },
            ],
            total_video_duration: "",
            is_last: "",
            mandatory_status: "0",
            completed: "",
            quiz_score: undefined,
            score: undefined,
          };

          setModules((prev) => [...prev, finalQuizModule]);
          setOpenModule(modules.length); // Open the newly added module
        } else {
          setOpenModule(finalQuizIndex);
        }
      }
      return;
    }


    // Next module
    setOpenModule((prev) => prev + 1);
    setQuizSubmitted(false);
    setCurrentPointIndex(0);
    setQuizAnswers({});
    setCheckedAnswers({});
  };

  const showComingSoonMessage = () => {
    // You can use a toast, modal, alert, etc.
    alert("Assessment coming soon!");
  };

  const currentModule = modules[openModule];


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
  const isMandatory = currentModule?.mandatory_status === "1";
  const isCompleted = currentModule?.completed === "1";
  const isLastModule = currentModule?.is_last === "yes";

  let requiredScore = 0;
  let hasPassed = false;

  if (isQuiz && currentModule?.quiz_score) {
    requiredScore = parseInt(currentModule.quiz_score, 10);

    hasPassed = userScore >= requiredScore;

  }

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

  const handleContinue = () => {
    const nextModuleArg = isLastModule && Courseassignmenttype === "Assignment" ? Assignmentfile : "";
    goToNextModule(nextModuleArg);
  };


  return (
    <div className="min-h-screen">
      {/* <p className="text-xl font-bold marquee">Your course completed on {courseEnddate}</p> */}
      <style jsx>{`
        .marquee {
          display: inline-block;
          white-space: nowrap;
          animation: scroll-right 10s linear infinite;
          color: #dc2626;
        }
        @keyframes scroll-right {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>

      <div className="flex flex-wrap items-center justify-between gap-6 bg-white coursedetails p-4">
        <h2 className="text-xl font-bold flex-1 min-w-[200px]">{courseName}</h2>

        

        <div className="flex items-center gap-4 flex-1 min-w-[250px]" style={{ justifyContent: "flex-end" }}>
          <div className="w-12 h-12">
            <CircularProgressbar
              value={progressPercentage}
              text={`${progressPercentage}%`}
              styles={buildStyles({
                textColor: "#2563eb",
                pathColor: "#2563eb",
                trailColor: "#e5e7eb",
              })}
            />
          </div>
          <div>
            <h3 className="text-md font-semibold mb-1">Course Progress</h3>
            <p className="text-sm text-gray-600">
              {completedVideoCount} of {totalVideoPoints} videos completed
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-9xl mx-auto bg-white overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="md:col-span-2 p-4">
          {modules.length > 0 && modules[openModule] ? (
            modules[openModule].title === "Assessment" ? (


              <div className="p-6" style={{ background: "#fff", boxShadow: "0 0 10px #cdcdcd" }}>
                {/* CASE 1: MANDATORY & COMPLETED */}
                {isMandatory && isCompleted ? (
                  <div className="text-center p-8">
                    {hasPassed && (
                      <p className="text-green-600 mb-4 text-lg font-semibold">
                        🎉 Congratulations! You passed the quiz.
                      </p>
                    )}
                    <h3 className="text-2xl font-semibold mb-4">Quiz Completed</h3>
                    <p className="text-lg mt-2 font-medium text-green-700">Your Score is: {modules[openModule]?.score}</p>

                    <button onClick={handleContinue} className="mt-4 ml-4 px-4 py-2 bg-green-600 text-white rounded">
                      {continueLabel}
                    </button>
                  </div>
                ) : !quizSubmitted ? (
                  <>
                    {/* CASE 2: Quiz in Progress */}
                    <h2 className="text-xl font-semibold mb-4">
                      Question {currentPointIndex + 1} of {currentQuestions.length}
                    </h2>

                    {isMandatory && (
                      <p className="bg-red-500 text-white-600 font-medium mt-2" style={{ padding: "10px 20px", marginBottom: "20px", background: "#ff4436", color: "#fff" }}>
                        <img src="https://cdn1.iconfinder.com/data/icons/creative-round-ui/212/82-128.png" style={{ width: "30px", marginRight: "10px", display: "inline-block", verticalAlign: "middle" }} />
                        You must score at least {modules[openModule].quiz_score}% to proceed.
                      </p>
                    )}

                    <p className="mb-4 text-lg">{currentQuestions[currentPointIndex]?.question}</p>

                    {/* Options */}
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
                            onClick={goToNextQuestion}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                            disabled={quizAnswers[currentPointIndex] === undefined}
                          >
                            Next
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


                  // CASE 3: Quiz Submitted
                  <div className="text-center p-8">
                    <h3 className="text-2xl font-semibold mb-4">Quiz Submitted!</h3>
                    <p>You answered {Object.keys(quizAnswers).length} questions.</p>
                    <p className="text-lg mt-2 font-medium text-green-700">
                      {/* Score: {userScore} / {modules[openModule].quiz_score} */}
                      Score: {userScore} / 100
                    </p>


                    {/* Case: Failed Mandatory */}
                    {isMandatory && !hasPassed && (
                      <p className="text-red-600 mb-2">You did not pass the quiz. Please try again.</p>
                    )}
                    <div className="mt-6 flex justify-center gap-4">
  <button
    onClick={() => setIsReviewMode(true)}
    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
  >
    Review Quiz
  </button>

  {isMandatory && !hasPassed && (
    <button
      onClick={handleRetake}
      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
    >
      Retake Quiz
    </button>
  )}
</div>



                    {/* Case: Passed or Non-Mandatory */}
                    {(!isMandatory || hasPassed) && (
                      <div className="mt-6">
                        {hasPassed ? (
                          <p className="text-green-600 mb-2">
                            🎉 Congratulations! You passed the quiz.
                          </p>
                        ) : (
                          <p className="text-red-600 mb-2">
                            You did not pass the quiz.This is Non-Mandatory  you can continue for next video.
                          </p>
                        )}

                        <div className="flex justify-center gap-x-4">
                          {/* {!isMandatory && (
              <button onClick={handleRetake} className="px-4 py-2 bg-blue-600 text-white rounded">
                Retake Quizkk
              </button>
            )} */}
                          <button onClick={handleContinue} className="px-4 py-2 bg-green-600 text-white rounded">
                            {continueLabel}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>



            ) : modules[openModule].title === "Assignment" ? (
              <div className="p-6">
                <AssignmentPanel
                  courseId={id}
                  studentWindowWeeks={2}
                  mentorWindowWeeks={1}
                  assignmentFile={currentModule?.file ?? ""}
                />
              </div>
              //) : modules[openModule].title === "selfassessment" ? (
            ) : modules[openModule].title === "resources" && currentModule?.resourceslink != null ? (
              <div className="p-6 text-center">
                <p className="text-lg font-semibold mb-4">
                  📚 This is a resources module. Please download the document below to access the resources.
                </p>
                {currentModule?.resourceslink ? (
                  <a
                    href={typeof modules[openModule].resourceslink === 'string' ? modules[openModule].resourceslink : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Download Resources
                  </a>
                ) : (
                  <p className="text-red-500">No resources file available.</p>
                )}
              </div>

            ) : modules[openModule].title === "selfassessment" && currentModule?.selfassessmentlink != null ? (
              <div className="p-6 text-center">
                <p className="text-lg font-semibold mb-4">
                  📄 This is a self-assessment module. Please download the document below and review the questions.
                </p>
                {currentModule?.selfassessmentlink ? (
                  <a
                    href={typeof modules[openModule].selfassessmentlink === 'string' ? modules[openModule].selfassessmentlink : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Download Self-Assessment
                  </a>
                ) : (
                  <p className="text-red-500">No self-assessment file available.</p>
                )}
              </div>
            ) :

              modules[openModule].title === "Final Quiz" ? (
                <div className="p-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm border">
                    {
                      !finalSubmitted || finalScore === null ? (
                        <>
                          {/* Quiz Header + Progress */}
                          <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2">🏁 Final Quiz</h3>
                            <p className="text-sm text-gray-500 mb-3">
                              Answer each question to progress. The progress bar increases as you answer.
                            </p>
                            <div className="final-progress-container">
                              <div
                                className="final-progress-fill"
                                style={{ width: `${computeFinalProgressPercent()}%` }}
                              >
                                <span className="final-progress-label">
                                  {computeFinalProgressPercent()}%
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-blue-700 mt-1">
                              {Object.keys(finalAnswers).length} / {modules[openModule].topics.length} answered
                            </p>
                          </div>

                          {/* Quiz Questions */}
                          <div className="space-y-4">
                            {(() => {
                              const module = modules[openModule];
                              const topics = module?.topics ?? [];
                              const q = topics[finalIndex];
                              if (!q) return <div>No question found.</div>;

                              return (
                                <div key={finalIndex} className="p-4 border rounded-lg">
                                  <div className="mb-4 font-medium">
                                    Q{finalIndex + 1}. {q.question}
                                  </div>

                                  <ul className="space-y-2">
                                    {q.options?.map((opt: string, optIdx: number) => {
                                      const selected = finalAnswers[finalIndex] === optIdx;
                                      return (
                                        <li key={optIdx}>
                                          <label
                                            className={`inline-flex items-center gap-2 p-3 rounded w-full cursor-pointer ${selected
                                              ? "bg-green-100 border border-green-300"
                                              : "hover:bg-gray-50"
                                              }`}
                                          >
                                            <input
                                              type="radio"
                                              name={`final-quiz-q-${finalIndex}`}
                                              checked={selected}
                                              onChange={() => handleFinalSelect(finalIndex, optIdx)}
                                            />
                                            <span>{opt}</span>
                                          </label>
                                        </li>
                                      );
                                    })}
                                  </ul>

                                  <div className="mt-4 flex items-center justify-between">
                                    <button
                                      onClick={handleFinalPrev}
                                      disabled={finalIndex === 0}
                                      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                    >
                                      Prev
                                    </button>

                                    <div className="flex items-center gap-3">
                                      <div className="text-sm text-gray-600">
                                        {finalIndex + 1} / {modules[openModule].topics.length}
                                      </div>

                                      <button
                                        onClick={async () => {
                                          const module = modules[openModule];
                                          const questions = module?.topics ?? [];

                                          if (
                                            Object.keys(finalAnswers).length < questions.length
                                          ) {
                                            alert("Please answer all questions before submitting.");
                                            return;
                                          }

                                          let correctCount = 0;
                                          questions.forEach((qq: any, idx: number) => {
                                            const userAnsIdx = finalAnswers[idx];
                                            const correctIdx = qq.options?.indexOf(qq.correct);
                                            if (
                                              userAnsIdx !== undefined &&
                                              userAnsIdx === correctIdx
                                            )
                                              correctCount++;
                                          });
                                          const score = questions.length
                                            ? Math.round((correctCount / questions.length) * 100)
                                            : 0;

                                          try {
                                            await fetch(
                                              "https://backstagepass.co.in/reactapi/submit_final_quiz.php",
                                              {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                  user_id: userId,
                                                  course_id: id,
                                                  score,
                                                }),
                                              }
                                            );

                                            setFinalScore(score);
                                            setFinalSubmitted(true);
                                            alert(`Final Quiz submitted. Your score: ${score}%`);
                                          } catch (e) {
                                            console.error("submit final quiz error:", e);
                                            alert("Failed to submit final quiz score.");
                                          }
                                        }}
                                        className={`px-4 py-2 rounded font-semibold ${Object.keys(finalAnswers).length ===
                                          modules[openModule].topics.length
                                          ? "bg-blue-600 text-white"
                                          : "bg-gray-300 text-gray-700 cursor-not-allowed"
                                          }`}
                                        disabled={
                                          Object.keys(finalAnswers).length !==
                                          modules[openModule].topics.length
                                        }
                                      >
                                        Submit Final Quiz
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </>
                      ) : finalSubmitted && finalScore !== null ? (
                        Number(finalScore) >= Number(finalquizscorelimit) ? (
                          //  Passed
                          <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200 text-center animate-fade-in">
                            <h2 className="text-2xl font-bold text-green-700 mb-2">🎉 Congratulations!</h2>
                            <p className="text-lg text-gray-700">You have completed the Final Quiz.</p>
                            <p className="text-xl font-semibold text-green-800 mt-3">
                              Your Score: {finalScore}%<br />
                              Passing Score: {finalquizscorelimit}%
                            </p>
                            <p className="text-sm text-gray-500 mt-2">Well done! You can now return to your dashboard.</p>
                          </div>
                        ) : (
                          //  Failed
                          <div className="mt-8 p-6 bg-red-50 rounded-lg border border-red-200 text-center animate-fade-in">
                            <h2 className="text-2xl font-bold text-red-700 mb-2">😞 Quiz Not Passed</h2>
                            <p className="text-lg text-red-700">
                              Your Score: {finalScore}%<br />
                              Passing Score: {finalquizscorelimit}%
                            </p>
                            <p className="text-sm mt-2 font-semibold">You did not pass the final quiz.</p>
                            <button
                              onClick={handleRetakeQuiz}
                              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Retake Quiz1
                            </button>
                          </div>
                        )
                      ) : (
                        <div>📋 Quiz Still Ongoing</div>
                      )}

                  </div>
                </div>
              ) : (

                <>
                <div className="relative rounded-xl overflow-hidden border bg-white">
                  {!isPlaying[currentTopic.id] ? (
                    <div className="video-thumbnail"
                      style={{ position: 'relative', width: '100%', height: 'auto' }}
                    >
                      {/* Use the thumbnail image from currentTopic */}
                      <img
                        src={currentTopic?.thumbnail}
                        alt="Video Thumbnail"
                        className="thumbnail-image"
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block',
                          borderRadius: '8px', // Optional: for rounded corners
                        }}
                      />
                      {/* Play Icon - Overlayed on the Thumbnail */}
                      {!isPlaying[currentTopic.id] && (
                        <div
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
                          onClick={() => handleThumbnailClick(String(currentTopic?.id ?? ""))}
                        >
                          {/* Play Button Styled */}
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
                      )}
                    </div>
                  ) : (
                    <Muxvideo
                      key={`module-${openModule}-topic-${currentPointIndex}-video-${currentVideoIndex}`}
                      videos={
                        (currentTopic && (currentTopic.type === "video" ? (currentTopic as VideoTopic).video : [])) ||
                        []
                      }
                      userId={userId ?? ""}
                      topicId={String(currentTopic?.id ?? "")}
                      resumeTime={resumeTime}
                      currentVideoIndex={currentVideoIndex}
                      onFinish={handleVideoEnd}
                      autoplay={true}
                    />
                  )}

                  <ul className="space-y-2">
                    {modules.map((module, index) => {
                      const hideAssessment = module.title === "Assessment" && !Array.from(watchedTopicIds).length;
                      if (hideAssessment) return null;

                      const isUnlocked = isModuleUnlocked(index);
                      const isCompletedModule = completedModuleIds.includes(Number(module.id));
                      const isOpen = openModule === index;
                      return (
                        <li key={index} className="rounded-lg">


                          {isOpen && module.title !== "Assessment" && module.title !== "Assignment" && module.title?.toLowerCase?.() !== "final quiz" && (

                            <ul className="pl-0 pb-4 text-sm list-disc text-gray-600">
                              
                              {Array.isArray(module?.topics) &&
                                module.topics.map((point, idx) => {
                                  const pointKey = `${index}-${idx}`;
                                  const isCurrentPlaying = openModule === index && currentPointIndex === idx;
                                  const isCompletedTopic = watchedTopicIds.has(Number(point.id));


                                  return (
                                    
                                    <li
                                      key={idx}
                                      className={`mb-1 flex items-center p-1 justify-between ${isCurrentPlaying ? "bg-white-200 text-grey-800 font-medium" : "hover:bg-white-100"
                                        }`}
                                    >
                                     
                                      <div className="flex items-center gap-3 flex-1">
                              <label className="flex items-center cursor-pointer">
                                <input type="checkbox" checked={isCompletedTopic} readOnly />
                              </label>
                              <p className="flex-1">{point.text}</p>
                              <span
                                style={{
                                  color: "#111",
                                  fontSize: "12px",
                                  backgroundColor: "#f0f0f0",
                                  padding: "4px 8px",
                                  borderRadius: "8px",
                                  fontWeight: "400",
                                }}
                              >
                                {point.video_duration ?? ""}
                              </span>
                            </div>

{isCurrentPlaying && (
    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
        <button
          onClick={() => goToPrevTopicOrModule(idx - 1)}
          className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
        >
          ← Previous
        </button>

        <button
          onClick={() => goToNextTopicOrModule(idx + 1)}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          Next →
        </button>
      </div>
    </div>
  )}
                                    </li>
                                  );
                                })}
                            </ul>
                            
                          )}

                          

                          {isOpen && module.title === "Assessment" && (
                            <div className="p-4 text-sm text-gray-600 italic">Complete the quiz in the left panel.</div>
                          )}

                          {isOpen && module.title === "Assignment" && (
                            <div className="p-4 text-sm text-gray-600 italic">Complete the assignment in the left panel.</div>
                          )}
                        </li>
  
                       
                      );
                      
                    })}
                    
                  </ul></div></>

              )
          ) : (
            <p>Loading...</p>
          )}
        </div>







        <aside className="w-[360px] shrink-0 border-l bg-white px-4 py-6 sticky top-24 max-h-[calc(100vh-120px)] sidebar-scroll">
  <ul className="space-y-3">
    {(() => {
      let visibleIndex = -1;

      return modules.map((module, index) => {
        const hideAssessment =
          module.title === "Assessment" &&
          !Array.from(watchedTopicIds).length;

        if (hideAssessment) return null;

        visibleIndex++;

        const isUnlocked = isModuleUnlocked(index);
        const isCompleted = completedModuleIds.includes(Number(module.id));
        const isOpen = openModule === index;

        return (
          <React.Fragment key={index}>
            {/* ===== MODULE CARD ===== */}
            <li
              className={`rounded-xl border transition
                ${isOpen ? "border-blue-300 shadow-sm" : "border-gray-200"}
                ${!isUnlocked && module.title !== "Assignment" && module.title !== "Final Quiz"
                  ? "opacity-60"
                  : ""}
              `}
            >
              <button
                disabled={
                  !isUnlocked &&
                  module.title !== "Assignment" &&
                  module.title !== "Final Quiz"
                }
                onClick={() => {
                  if (
                    isUnlocked ||
                    module.title === "Assignment" ||
                    module.title === "Final Quiz"
                  ) {
                    setOpenModule(index);
                    setCurrentPointIndex(0);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition
                  ${
                    isOpen
                      ? "bg-blue-600 text-white"
                      : "bg-gray-50 text-gray-800 hover:bg-gray-100"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <span className="text-green-500 text-sm">✔</span>
                  ) : !isUnlocked ? (
                    <span className="text-gray-400 text-sm">🔒</span>
                  ) : null}

                  <span className="font-medium text-sm">
                    {module.title
                      .replace("selfassessment", "Self Assessment")
                      .replace("resources", "Resources")}
                  </span>
                </div>

                <span className="text-lg opacity-70">›</span>
              </button>

              {isOpen && module.title === "Assessment" && (
                <div className="px-4 py-3 text-xs text-gray-500 bg-gray-50">
                  Complete the quiz in the left panel.
                </div>
              )}

              {isOpen && module.title === "Assignment" && (
                <div className="px-4 py-3 text-xs text-gray-500 bg-gray-50">
                  Complete the assignment in the left panel.
                </div>
              )}
            </li>

            {/* ===== NEXT SECTION DIVIDER ===== */}
            {module.title === "Assessment" && (
              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-[11px] font-semibold tracking-widest text-gray-400">
                  NEXT SECTION
                </span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>
            )}
          </React.Fragment>
        );
      });
    })()}
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

    </div>
  );
};


export default CourseDetailsPage;