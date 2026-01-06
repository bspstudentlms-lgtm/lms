"use client";

import React, { useEffect, useState, ReactNode } from "react";

/* ================= TYPES ================= */

type AssignmentState = {
  startedAt: any;
  coursename?: ReactNode;
  marks?: number | null;
  grade?: string | null;
  releaseAt?: string | null;
  downloaded?: boolean;
  submittedAt?: string | null;
  submittedFileName?: string | null;
  evaluated?: boolean;
};

export interface AssignmentPanelProps {
  courseId: string;
  studentWindowWeeks?: number;
  mentorWindowWeeks?: number;
  assignmentFile?: any;
}

/* ================= COMPONENT ================= */

const AssignmentPanel: React.FC<AssignmentPanelProps> = ({
  courseId,
  studentWindowWeeks = 2,
  mentorWindowWeeks = 1,
  assignmentFile,
}) => {
  const STORAGE_KEY = `bp_assignment_course_${courseId}`;

  const [state, setState] = useState<AssignmentState>(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY)
          : null;
      return raw
        ? (JSON.parse(raw) as AssignmentState)
        : {
            releaseAt: null,
            downloaded: false,
            submittedAt: null,
            submittedFileName: null,
            evaluated: false,
            marks: null,
          };
    } catch {
      return {
        releaseAt: null,
        downloaded: false,
        submittedAt: null,
        submittedFileName: null,
        evaluated: false,
        marks: null,
      };
    }
  });

  const [notice, setNotice] = useState<string | null>(null);

  const isMentor =
    typeof window !== "undefined" &&
    localStorage.getItem("role") === "mentor";

  /* ================= PERSIST LOCAL ================= */

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch {}
  }, [state, STORAGE_KEY]);

  /* ================= TIME LOGIC ================= */

  const submissionDate = state.submittedAt
    ? new Date(state.submittedAt)
    : null;

  const mentorDeadline = submissionDate
    ? new Date(
        submissionDate.getTime() +
          mentorWindowWeeks * 7 * 24 * 60 * 60 * 1000
      )
    : null;

  const [sp, setSp] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [studentDeadline, setStudentDeadline] = useState<Date | null>(null);
  const [studentWindowActive, setStudentWindowActive] = useState(false);
  const [studentWindowExpired, setStudentWindowExpired] = useState(false);

  const submitted = !!state.submittedAt;

  useEffect(() => {
    if (!state.releaseAt) return;

    const releaseTime = new Date(state.releaseAt);
    const deadline = new Date(
      releaseTime.getTime() +
        studentWindowWeeks * 7 * 24 * 60 * 60 * 1000
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
  }, [state.releaseAt, studentWindowWeeks, submitted]);

  /* ================= DOWNLOAD ================= */

  const handleDownload = async () => {
   // const fileName = localStorage.getItem("assignment_file");
    assignmentFile
const fileName =assignmentFile;
    const fileUrl = fileName
      ? `https://backstagepass.co.in/websiteadmin/uploads/assignments/${fileName}`
      : null;

    if (!fileUrl) {
      setNotice("Assignment file not available.");
      return;
    }

    const nowIso = new Date().toISOString();
    setState((s) => ({ ...s, releaseAt: nowIso, downloaded: true }));
    setNotice("Starting download...");

    try {
      await fetch(
        "https://backstagepass.co.in/reactapi/save_assignment_download.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId,
            downloadTime: nowIso,
            userId: localStorage.getItem("userId"),
          }),
        }
      );

      window.open(fileUrl, "_blank");
      setNotice("Assignment downloaded. Submission window started.");
    } catch (e) {
      console.error(e);
      setNotice("Download started, but failed to record timestamp.");
    }
  };

  /* ================= FETCH STATUS ================= */

  useEffect(() => {
    const fetchAssignmentStatus = async () => {
      try {
        const userId = localStorage.getItem("userId");

        const res = await fetch(
          `https://backstagepass.co.in/reactapi/get_assignment_status.php?userId=${userId}&courseId=${courseId}&_t=${Date.now()}`,
          { cache: "no-store" }
        );

        const data = await res.json();
        console.log(data);
        if (!data.releaseAt) {
  localStorage.removeItem(STORAGE_KEY);
  setState({
    releaseAt: null,
    downloaded: false,
    submittedAt: null,
    submittedFileName: null,
    evaluated: false,
    marks: null,
    grade: null,
    coursename: null,
  });
  return;
}

        if (data.releaseAt) {
          
          setState((s) => ({
            ...s,
            releaseAt: data.releaseAt,
            downloaded: true,
            submittedAt: data.submittedAt ?? null,
            submittedFileName: data.submittedFileName ?? null,
            evaluated: data.evaluated ?? false,
            marks: data.marks ?? null,
            grade: data.grade ?? null,
            coursename: data.coursename ?? null,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch assignment status:", err);
      }
    };

    fetchAssignmentStatus();
  }, [courseId]);

  /* ================= UPLOAD ================= */

  const handleFileSelect = async (file: File | null) => {
    if (!file || !studentWindowActive) return;

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const formData = new FormData();
    formData.append("assignmentFile", file);
    formData.append("userId", userId);
    formData.append("courseId", courseId);

    try {
      await fetch(
        "https://backstagepass.co.in/reactapi/submit_assignment.php",
        {
          method: "POST",
          body: formData,
        }
      );

      setState((s) => ({
        ...s,
        submittedAt: new Date().toISOString(),
        submittedFileName: file.name,
      }));

      setNotice("Assignment submitted successfully.");
    } catch (err) {
      console.error(err);
      setNotice("Error submitting assignment.");
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
  /* ================= UI ================= */
const isAssignmentPassed =
  typeof state.marks === "number" && state.marks >=60;
  const isAssignmentFailed = typeof state.marks === "number" && state.marks > 0 && state.marks  < 60;
  
const hasStartedAssignment =
  typeof state.releaseAt === "string" &&
  state.releaseAt.trim() !== "";
  
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
            {(!isAssignmentPassed && !isAssignmentFailed) ? (
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
           ) : null}

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              
              
              {!hasStartedAssignment  ? (
                <div className="text-center">
                  <div className="text-sm text-gray-400">Not started</div>
                </div>
              ) : (isAssignmentPassed || isAssignmentFailed) ? null : submitted ? (
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
            {!hasStartedAssignment  ? (
              <p className="text-sm text-gray-600">
                Download assignment to begin the student submission window ({studentWindowWeeks} weeks).
              </p>
            ) : (isAssignmentPassed || isAssignmentFailed) ? null : submitted ? (
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
          {!hasStartedAssignment ? (
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

              {isAssignmentPassed ? (
  /* ================= PASS ================= */
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
) : isAssignmentFailed ? (
  /* ================= FAIL ================= */
  <div className="text-center p-6 bg-red-50 rounded-md border border-red-200">
    <h3 className="text-lg font-semibold text-red-700">
      ❌ Assignment Not Passed
    </h3>
    <p className="mt-2 text-sm text-red-600">
      You scored <strong>{state.marks}</strong>%.  
      Minimum <strong>60%</strong> is required to pass.
    </p>
    <p className="mt-3 text-sm text-gray-600">
      Please rework your assignment and contact your mentor for next steps.
    </p>
  </div>
              ) : (
                <>
                  {/* ================= STATUS HEADER ================= */}
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Released on</div>
                      <div className="font-medium">
                       {state.startedAt
                        ? new Date(state.startedAt).toLocaleString()
                        : "--"}
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

                       {!submitted && (
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
                    )}
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
};

export default AssignmentPanel;
