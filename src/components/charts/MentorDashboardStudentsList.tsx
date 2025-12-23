"use client";

import React, { useEffect, useRef, useState } from "react";
import { differenceInDays, addDays, parseISO } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";

/* ---------- Types ---------- */
interface Student {
  id?: number | string;
  course_per_completed?: number;
  first_name?: string;
  last_name?: string | null;
  closingdate?: string | null;
  status?: string | null;
  assignment_url?: string | null;
  assignment?: string | null;
  assignment_file?: string | null;
  file_url?: string | null;
  uploaded_file?: string | null;
  assignment_id?: number | string | null;
  marks?: number | null;
  result?: "Pass" | "Fail" | null;
  submitted_date?: string | null;
  [key: string]: any;
}

interface RecentOrdersProps {
  courseId?: string | number | null; // prop from parent
  defaultCourseId?: number; // fallback
}

/* ------------------ AnimatedTimer (inline component) ------------------ */
/**
 * AnimatedTimer props:
 * - submittedDate: ISO string (or null)
 * - daysWindow: how many days after submittedDate the assignment closes (default 7)
 */
function AnimatedTimer({
  submittedDate,
  daysWindow = 7,
}: {
  submittedDate?: string | null;
  daysWindow?: number;
}) {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!submittedDate) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-sm text-gray-400">Not started</div>
      </div>
    );
  }

  // safe parse
  let start: Date;
  try {
    start = parseISO(submittedDate as string);
  } catch {
    return (
      <div className="flex flex-col items-center">
        <div className="text-sm text-red-500">Invalid date</div>
      </div>
    );
  }

  const deadline = addDays(start, daysWindow);
  const diffMs = Math.max(0, deadline.getTime() - now.getTime());

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diffMs / (1000 * 60)) % 60);
  const secs = Math.floor((diffMs / 1000) % 60);

  const totalWindowMs = daysWindow * 24 * 60 * 60 * 1000;
  const percent = Math.round(((totalWindowMs - (deadline.getTime() - now.getTime())) / totalWindowMs) * 100);
  const clampedPercent = Math.max(0, Math.min(100, percent));

  // color thresholds: >66% green, 33-66 amber, <33 red
  const remainingRatio = diffMs / totalWindowMs;
  let color = "#16a34a"; // green
  if (remainingRatio <= 0.33) color = "#ef4444"; // red
  else if (remainingRatio <= 0.66) color = "#f59e0b"; // amber

  const smallLabel =
    diffMs <= 0 ? (
      <span className="text-xs font-semibold text-red-600">Expired</span>
    ) : days === 0 ? (
      <span className="text-xs font-semibold text-amber-600">Last day!</span>
    ) : (
      <span className="text-xs text-gray-500">{days} day{days !== 1 ? "s" : ""} left</span>
    );

  // ring style uses conic-gradient inline so no extra stylesheet required
  const ringStyle: React.CSSProperties = {
    background: `conic-gradient(${color} ${clampedPercent}%, #e6e9ee ${clampedPercent}% 100%)`,
  };

  const padded = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-3">
      <div
        className={`relative w-15 h-15 rounded-full flex items-center justify-center transform transition-all`}
        style={{}}
      >
        {/* ring */}
        <div
          className={`absolute inset-0 rounded-full`}
          style={{
            ...ringStyle,
            boxShadow: remainingRatio <= 0.15 ? "0 6px 18px rgba(239,68,68,0.18)" : "0 6px 18px rgba(37,99,235,0.06)",
            transition: "background 400ms ease, box-shadow 400ms ease",
          }}
        />

        {/* inner circle */}
        <div
          className={`relative z-10 w-10 h-10 rounded-full bg-white flex flex-col items-center justify-center text-center`}
          style={{
            boxShadow: "inset 0 0 18px rgba(0,0,0,0.04)",
            transform: remainingRatio <= 0.15 ? "scale(1.04)" : "scale(1)",
            transition: "transform 320ms ease",
          }}
        >
          <div className="text-sm font-semibold" style={{ color }}>
            {clampedPercent}%
          </div>
          {/* <div className="text-xs text-gray-500 mt-0.5">{padded(hours)}:{padded(mins)}</div> */}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="text-sm font-medium text-gray-700">Assignment</div>
        <div className="text-xs text-gray-500 mt-1">
          {smallLabel}
          <div className="text-xs text-gray-400 mt-1">
            {days}d {padded(hours)}h {padded(mins)}m {padded(secs)}s
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------ RecentOrders component ------------------ */
export default function RecentOrders({ courseId, defaultCourseId = 1 }: RecentOrdersProps) {
  const finalCourseId = courseId ?? defaultCourseId;

  const [students, setStudents] = useState<Student[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state for result form
  const [modalOpenFor, setModalOpenFor] = useState<string | number | null>(null);
  const [marksInput, setMarksInput] = useState<string>("");
  const [overrideResult, setOverrideResult] = useState<"Pass" | "Fail" | "">("");
  // Download state per student key
  const [downloadingFor, setDownloadingFor] = useState<string | number | null>(null);

  const marksInputRef = useRef<HTMLInputElement | null>(null);

  /* ---------- load mentor id ---------- */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("userId");
      setUserId(stored);
    } catch {
      setUserId(null);
    }
  }, []);

  /* ---------- fetch students ---------- */
  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();

    async function loadStudents() {
      setLoading(true);
      setError(null);
      try {
        const url = `https://backstagepass.co.in/reactapi/get_students_by_course_and_mentor.php?course_id=${encodeURIComponent(
          String(finalCourseId)
        )}&mentor_id=${encodeURIComponent(String(userId))}`;

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : (Array.isArray(data?.students) ? data.students : []);
        setStudents(list);
      } catch (err: any) {
        if (err.name !== "AbortError") setError(err.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
    return () => controller.abort();
  }, [userId, finalCourseId]);

  /* ---------- helpers ---------- */
  function formatDate(dateString?: string | null) {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
  }

  function clampPct(n: number | undefined | null) {
    if (n == null) return 0;
    const num = Math.round(Number(n));
    return Math.max(0, Math.min(100, num));
  }

  function resolveAssignmentUrl(student: Student): string | null {
    const candidates = [
      student.assignment_url,
      student.assignment,
      student.assignment_file,
      student.file_url,
      student.uploaded_file ? `https://backstagepass.co.in/reactapi/uploads/${student.uploaded_file}` : null,
    ];

    const found = candidates.find((v) => typeof v === "string" && v.trim().length > 0) as string | undefined;
    if (found) {
      try {
        return new URL(found).toString();
      } catch {
        const origin = "https://backstagepass.co.in";
        return origin.replace(/\/$/, "") + "/" + found.replace(/^\//, "");
      }
    }

    if (student.assignment_id != null && String(student.assignment_id).trim() !== "") {
      const id = encodeURIComponent(String(student.assignment_id));
      return `https://backstagepass.co.in/reactapi/get_assignment_by_id.php?id=${id}`;
    }

    return null;
  }

  async function downloadAssignment(student: Student, key: string | number) {
    const assignmentUrl = resolveAssignmentUrl(student);
    if (!assignmentUrl) {
      alert("No assignment available for download.");
      return;
    }

    try {
      setDownloadingFor(key);

      const parsed = new URL(assignmentUrl, window.location.href);
      const isSameOrigin = parsed.origin === window.location.origin || parsed.origin === "https://backstagepass.co.in";

      if (isSameOrigin) {
        const a = document.createElement("a");
        a.href = assignmentUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        try {
          const segments = parsed.pathname.split("/");
          const filename = segments[segments.length - 1] || "assignment";
          a.download = filename;
        } catch {}
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        const res = await fetch(assignmentUrl, { method: "GET", credentials: "include" });
        if (!res.ok) {
          window.open(assignmentUrl, "_blank", "noopener");
          return;
        }
        const blob = await res.blob();
        const contentDisposition = res.headers.get("Content-Disposition") || "";
        let filename = "assignment";
        const match = /filename\*?=(?:UTF-8'')?["']?([^;"']+)/i.exec(contentDisposition);
        if (match && match[1]) {
          filename = decodeURIComponent(match[1]);
        } else {
          try {
            const segs = parsed.pathname.split("/");
            filename = segs[segs.length - 1] || filename;
          } catch {}
        }
        const link = document.createElement("a");
        const blobUrl = window.URL.createObjectURL(blob);
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download assignment. Try opening in a new tab.");
    } finally {
      setDownloadingFor(null);
    }
  }

  /* ---------- modal open/close and keyboard handling ---------- */
  useEffect(() => {
    if (modalOpenFor != null) {
      // focus on input after modal opens
      setTimeout(() => {
        marksInputRef.current?.focus();
      }, 50);
    }
  }, [modalOpenFor]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && modalOpenFor != null) {
        closeModal();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpenFor]);

  function openModalFor(studentKey: string | number) {
    const s = students.find((st, idx) => (st.id ?? `${st.first_name}-${st.last_name ?? ""}-${idx}`) === studentKey);
    setMarksInput(s?.marks != null ? String(s.marks) : "");
    setOverrideResult(s?.result ?? "");
    setModalOpenFor(studentKey);
  }

  function closeModal() {
    setModalOpenFor(null);
    setMarksInput("");
    setOverrideResult("");
  }

  function handleMarksChange(v: string) {
    const sanitized = v.replace(/[^\d]/g, "");
    setMarksInput(sanitized);
    setOverrideResult("");
  }

  async function handleSubmitResult(studentKey: string | number) {
    const raw = Number(marksInput);
    if (Number.isNaN(raw) || raw < 0 || raw > 100) {
      alert("Enter valid marks (0–100)");
      return;
    }

    const marks = Math.max(0, Math.min(100, Math.round(raw)));
    const computed = marks >= 70 ? "Pass" : "Fail";
    const finalResult = (overrideResult as "Pass" | "Fail") || computed;

    setStudents((prev) =>
      prev.map((st, idx) => {
        const key = st.id ?? `${st.first_name}-${st.last_name ?? ""}-${idx}`;
        if (key === studentKey) {
          return { ...st, marks, result: finalResult };
        }
        return st;
      })
    );

    try {
      await fetch("https://backstagepass.co.in/reactapi/save_assignment_result.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: studentKey,
          marks,
          result: finalResult,
        }),
      });
    } catch (error) {
      alert("Failed to save result. Please try again.");
      console.error(error);
    }

    closeModal();
  }

  const overlayRef = useRef<HTMLDivElement | null>(null);

  /* ---------- Render ---------- */
  return (
    <div className="overflow-hidden rounded-2xl mt-8 border border-gray-200 bg-white px-4 pb-3 pt-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Students List</h3>

      <Table>
        <TableHeader className="border-gray-200 border-y bg-gray-50">
          <TableRow>
            <TableCell isHeader className="py-4 px-4 font-semibold text-gray-700 text-left">Name</TableCell>
            <TableCell isHeader className="py-4 px-4 font-semibold text-gray-700 text-left">Course completion (%)</TableCell>
            <TableCell isHeader className="py-4 px-4 font-semibold text-gray-700 text-left">Course Closing date</TableCell>
            <TableCell isHeader className="py-4 px-4 font-semibold text-gray-700 text-left">Schedule</TableCell>
            <TableCell isHeader className="py-4 px-4 font-semibold text-gray-700 text-left">Assignment</TableCell>
            <TableCell isHeader className="py-4 px-4 font-semibold text-gray-700 text-left">Assignment Closing date</TableCell>
            <TableCell isHeader className="py-4 px-4 font-semibold text-gray-700 text-left">Result</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <td colSpan={7} className="text-center text-gray-500 py-6">Loading students...</td>
            </TableRow>
          ) : error ? (
            <TableRow>
              <td colSpan={7} className="text-center text-red-500 py-6">{error}</td>
            </TableRow>
          ) : students.length === 0 ? (
            <TableRow>
              <td colSpan={7} className="text-center text-gray-500 py-6">No students found.</td>
            </TableRow>
          ) : (
            students.map((student, index) => {
              const pct = clampPct(student.course_per_completed ?? 0);
              const key = student.id ?? `${student.first_name}-${student.last_name ?? ""}-${index}`;
              const assignmentUrl = resolveAssignmentUrl(student);
              const isDownloading = downloadingFor === key;

              return (
                <React.Fragment key={key}>
                  <TableRow className="hover:bg-gray-50 transition-colors">
                    <TableCell className="py-4 px-4 text-gray-800 capitalize">
                      {student.first_name ?? "-"} {student.last_name ?? ""}
                    </TableCell>

                    <TableCell className="py-4 px-4 text-gray-800 w-48">
                      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div
                          role="progressbar"
                          aria-valuenow={pct}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          className="text-xs font-medium text-center p-0.5 leading-none rounded-full h-6 flex items-center justify-center"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: "rgb(37 99 235)",
                            color: "white",
                          }}
                        >
                          {pct}%
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 px-4 text-gray-800">{formatDate(student.closingdate)}</TableCell>

                    <TableCell className="py-4 px-4 text-gray-800">
                      <Badge variant="light" color="primary">{student.status === "booked" ? "Yes" : "No"}</Badge>
                    </TableCell>

                    <TableCell className="py-4 px-4 text-left">
                      <div className="flex items-center justify-center gap-2">
                        {student.uploaded_file ? (
                          <a style={{display: "flex", alignItems: "center", justifyContent: "center"}}
                            href={`https://backstagepass.co.in/reactapi/uploads/${student.uploaded_file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="text-blue-600 hover:underline font-medium"
                          >
                            Student Uploaded Assignment <button
                          type="button"
                          onClick={(ev) => {
                            ev.preventDefault();
                            downloadAssignment(student, key);
                          }}
                          className="text-sm px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-100 flex items-center gap-1"
                          disabled={isDownloading}
                          aria-label="Download assignment (authenticated)"
                          title="Download (use this if direct link doesn't work)"
                        >
                          {isDownloading ? "Downloading..." : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                              </svg>
                            </>
                          )}
                        </button>
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">No file uploaded</span>
                        )}

                        
                      </div>
                    </TableCell>

                    <TableCell className="py-4 px-4 text-gray-800">
                      {/* Replaced Badge with AnimatedTimer */}
                      <AnimatedTimer submittedDate={student.submitted_date ?? null} daysWindow={7} />
                    </TableCell>

                    <TableCell className="py-4 px-4 text-gray-800">
                      {student.marks != null && student.marks != 0 ?(
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{student.marks}%</span>
                          <Button variant="ghost" size="sm" onClick={() => openModalFor(key)}>Edit</Button>
                        </div>
                      ) : (
                        <Button variant="secondary" size="sm" onClick={() => openModalFor(key)}>Result</Button>
                      )}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* ---------- Modal (renders when modalOpenFor is set) ---------- */}
      {modalOpenFor != null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* overlay */}
          <div
            ref={overlayRef}
            className="fixed inset-0 bg-black/40"
            onClick={() => closeModal()}
          />

          {/* modal content */}
          <div className="relative z-50 max-w-2xl w-full mx-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Enter Result</h3>
                  <p className="text-sm text-gray-500 mt-1">Add marks and optionally override Pass/Fail.</p>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={closeModal}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-6 gap-3 items-center" style={{alignItems : "flex-end"}}>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Marks (0–100)</label>
                  <input
                    ref={marksInputRef}
                    type="text"
                    inputMode="numeric"
                    value={marksInput}
                    onChange={(e) => handleMarksChange(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 p-2"
                    placeholder="e.g. 78"
                    aria-label="Marks"
                    autoFocus
                  />
                </div>

                <div className="md:col-span-2 flex items-end gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSubmitResult(modalOpenFor)}
                    aria-label="Submit result"
                  >
                    Submit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={closeModal}>Cancel</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
