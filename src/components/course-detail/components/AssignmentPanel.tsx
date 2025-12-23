/* ---------------- AssignmentPanel (UPDATED & SAFE) ---------------- */
interface AssignmentPanelProps {
  courseId: string;
  studentWindowWeeks?: number;
  mentorWindowWeeks?: number;
  assignmentFile?: string;
}

function AssignmentPanel({
  courseId,
  studentWindowWeeks = 2,
  mentorWindowWeeks = 1,
  assignmentFile,
}: AssignmentPanelProps) {
  const STORAGE_KEY = `bp_assignment_course_${courseId}`;

  const [state, setState] = useState<AssignmentState>({
    releaseAt: null,
    downloaded: false,
    submittedAt: null,
    submittedFileName: null,
    evaluated: false,
    marks: null,
    coursename: null,
  });

  const isMentor =
    typeof window !== "undefined" &&
    localStorage.getItem("role") === "mentor";

  /* ---------------- Persist Local State ---------------- */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  /* ---------------- Fetch Assignment Status (SERVER) ---------------- */
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const res = await fetch(
          `https://backstagepass.co.in/reactapi/get_assignment_status.php?userId=${userId}&courseId=${courseId}`
        );
        const data = await res.json();

        if (data?.releaseAt) {
          setState({
            releaseAt: data.releaseAt,
            downloaded: true,
            submittedAt: data.submittedAt || null,
            submittedFileName: data.submittedFileName || null,
            evaluated: data.evaluated || false,
            marks: data.marks || null,
            coursename: data.coursename || null,
          });
        }
      } catch (e) {
        console.error("Assignment status fetch failed", e);
      }
    };

    fetchStatus();
  }, [courseId]);

  /* ---------------- Time Window Logic ---------------- */
  const releaseDate = state.releaseAt ? new Date(state.releaseAt) : null;
  const studentDeadline = releaseDate
    ? new Date(
        releaseDate.getTime() +
          studentWindowWeeks * 7 * 24 * 60 * 60 * 1000
      )
    : null;

  const now = Date.now();
  const studentWindowActive =
    studentDeadline && now < studentDeadline.getTime() && !state.submittedAt;

  /* ---------------- Download Assignment ---------------- */
  const handleDownload = async () => {
    if (!assignmentFile) {
      alert("Assignment file not available");
      return;
    }

    const nowIso = new Date().toISOString();
    setState((s) => ({
      ...s,
      releaseAt: nowIso,
      downloaded: true,
    }));

    try {
      await fetch(
        "https://backstagepass.co.in/reactapi/save_assignment_download.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId,
            userId: localStorage.getItem("userId"),
            downloadTime: nowIso,
          }),
        }
      );

      window.open(assignmentFile, "_blank");
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  /* ---------------- Submit Assignment ---------------- */
  const handleFileUpload = async (file: File) => {
    if (!studentWindowActive) {
      alert("Submission window closed");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const formData = new FormData();
    formData.append("assignmentFile", file);
    formData.append("userId", userId);
    formData.append("courseId", courseId);

    try {
      const res = await fetch(
        "https://backstagepass.co.in/reactapi/submit_assignment.php",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      setState((s) => ({
        ...s,
        submittedAt: new Date().toISOString(),
        submittedFileName: file.name,
      }));

      alert("Assignment submitted successfully");
    } catch (e) {
      console.error(e);
      alert("Submission failed");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-4">📄 Assignment</h3>

      {/* NOT DOWNLOADED */}
      {!state.releaseAt && (
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Download the assignment to start the submission window.
          </p>
          <button
            onClick={handleDownload}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Download Assignment
          </button>
        </div>
      )}

      {/* DOWNLOADED */}
      {state.releaseAt && !state.submittedAt && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">
            Submission deadline:{" "}
            <strong>{studentDeadline?.toLocaleString()}</strong>
          </p>

          <label className="inline-block cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded">
            Upload Assignment
            <input
              type="file"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileUpload(f);
              }}
            />
          </label>
        </div>
      )}

      {/* SUBMITTED */}
      {state.submittedAt && (
        <div className="mt-4 bg-green-50 p-4 rounded border border-green-200">
          <p className="font-semibold text-green-700">
            ✅ Assignment Submitted
          </p>
          <p className="text-sm text-gray-600">
            File: {state.submittedFileName}
          </p>
        </div>
      )}

      {/* COMPLETED */}
      {state.marks != null && (
        <div className="mt-6 bg-green-100 p-6 rounded text-center">
          <h4 className="text-xl font-bold text-green-700">
            🎉 Course Completed
          </h4>
          <p className="mt-2">
            You have successfully completed{" "}
            <strong>{state.coursename}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
