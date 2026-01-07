"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { PlayCircle } from "lucide-react";
import Calendar from "@/components/mentor/mentor";
import Muxvideo from "@/components/MuxVideoplayer";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import QuizPanel from "./components/QuizPanel";
import AssignmentPanel from "./components/AssignmentPanel";
import FinalQuizPanel  from  "./components/FinalQuizPanel";

interface CourseClientProps {
  id: string;
}
interface QuizData {
  id?: number | string;
  questions: QuizQuestion[];
  questions_limit?: number;
  quiz_score?: number;
  mandatory_status?: number;
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
  description?: string;
  thumbnail?: string;
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
  
  
  selfassessmentlink?: string | null;
resourceslink?: string | null;
quiz?: any; 

  score?: React.ReactNode;
  is_last?: string;
   final_type?: 1 | 2;
  mandatory_status?: string;
  quiz_score?: React.ReactNode;
  type?: string;
  id: string | number;
  title: string;
  topics: Topic[];
  completed?: string;
  total_video_duration?: string;
  file?: string;
  questions_limit?:number;
};



interface FinalQuizModule {
  id: number | string;
  title: string;
  topics: QuizTopic[];
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
    useState<"overview" | "contact" | "outcome" | "assignment">("overview");

  const [resumeTime, setResumeTime] = useState<number>(0);
  const [topics, setTopics] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);
  
  const [lastWatchedModuleId, setLastWatchedModuleId] = useState<number | null>(null);
const [lastWatchedTopicId, setLastWatchedTopicId] = useState<number | null>(null);
const [assignmentFile, setAssignmentFile] = useState<string | null>(null);
const [assignmentType, setAssignmentType] = useState<number | null>(null);
const [courseName, setCourseName] = useState<string | null>(null);
const [loadingTopics, setLoadingTopics] = useState<Record<number, boolean>>({});
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
  const [completedModuleIds, setCompletedModuleIds] = useState<(number | string)[]>([]);
  // const [completedVideoCount, setCompletedVideoCount] = useState<number>(0);
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
  //const [openModule, setOpenModule] = useState<number | null>(null);
  const [openModule, setOpenModule] = useState<number>(-1);
  const [activeView, setActiveView] = useState<
    "content" | "quiz" | "assignment" | "final quiz" 
  >("content");
  console.log('activeview'+activeView);
  const currentModule =
    openModule !== null ? modules[openModule] : null;

const activeModule = openModule >= 0 ? modules[openModule] : null;
const finalQuizTopics = currentModule?.topics?.filter(
  (t): t is QuizTopic => t.type === "quiz"
) ?? [];
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

//   useEffect(() => {
//     if (
//       modules.length > 0 &&
//       modules[openModule]?.type === "quiz" &&
//       Array.isArray(modules[openModule]?.topics)
//     ) {
//       const fullQuiz = modules[openModule].topics;
//       const questionsLimit = Number(activeModule?.questions_limit) || 5;

//       const quizQuestions = (modules[openModule]?.topics ?? []).filter(isQuizQuestion);

// const randomSubset = getRandomQuestions(quizQuestions, questionsLimit);
// setCurrentQuestions(randomSubset);
//       setCurrentQuestions(randomSubset);
//     }
//   }, [openModule, modules]);

 



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
          setLastWatchedModuleId(progress.last_watched_module_id);
        }

        if (progress?.last_watched_topic_id) {
          setLastWatchedTopicId(progress.last_watched_topic_id);
        }

        if (progress?.assignment_file) {
          setAssignmentFile(progress.assignment_file);
        }
        if (progress?.assignment_type) {
          setAssignmentType(progress.assignment_type);
        }

        if (progress?.coursename) {
          setCourseName(progress.coursename);
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
          completed: Number(m.completed), 
          score: m.score,
          is_last: m.is_last,
          topics: null, // loaded later

        }));
const completedIds = formatted
  .filter((m) => m.completed === 1)
  .map((m) => m.id);

setModules(formatted);
setCompletedModuleIds(completedIds);
        console.log("Completed modules from API:", completedIds);
      } catch (err) {
        console.error("Course init error:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, userId]);
  
  const didRestoreRef = useRef(false);

  useEffect(() => {
    if (!modules.length) return;
    if (didRestoreRef.current) return; // 🔒 run only once

    didRestoreRef.current = true;

    
     const lastModuleId = Number(lastWatchedModuleId);
    const lastTopicId = Number(lastWatchedTopicId);

    const moduleIndex =
      modules.findIndex((m) => Number(m.id) === lastModuleId) >= 0
        ? modules.findIndex((m) => Number(m.id) === lastModuleId)
        : 0;

    setOpenModule(moduleIndex);

    fetchTopics(Number(modules[moduleIndex].id), moduleIndex).then(() => {
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

  



  const fetchTopics = async (moduleId: number, index: number) => {
  // already loaded → skip
  if (modules[index]?.topics) return;

  try {
    // 🔄 show loader for this module
    setLoadingTopics((prev) => ({ ...prev, [index]: true }));

    const res = await fetch(
      `https://backstagepass.co.in/reactapi/api/gettopicapi.php?module_id=${encodeURIComponent(
        moduleId
      )}`,
      { cache: "no-store" }
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

      if (item.type === "quiz" && Array.isArray(item.topics)) {
        quiz = item;
      }
    });

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
  } finally {
    // ✅ hide loader
    setLoadingTopics((prev) => ({ ...prev, [index]: false }));
  }
};
  

  useEffect(() => {
    if (openModule === null) return;

    const topics = modules[openModule]?.topics;
    const lastTopicId = Number(lastWatchedTopicId);
    if (!topics || !topics.length) return;

    const topicIndex = topics.findIndex(
      (t: any) => Number(t.id) === lastTopicId
    );

    setCurrentPointIndex(topicIndex >= 0 ? topicIndex : 0);
  }, [modules, openModule]);



 

  // ensure final quiz exists / has at least 5 questions
  const [quizLoading, setQuizLoading] = useState<boolean>(false);
 

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





const fetchWatchedStatus = async (uid?: string | null) => {
  console.log("fetchWatchedStatus ENTERED with uid:", uid);

  if (!uid) return;

  try {
    const resp = await fetch(
      `https://backstagepass.co.in/reactapi/fetch_watched.php?user_id=${encodeURIComponent(
        uid
      )}&status=watched`,
      {
        cache: "no-store",
      }
    );

    console.log("response status:", resp.status);

    if (!resp.ok) {
      throw new Error("Failed to fetch watched status");
    }

    const json = await resp.json();
    console.log("response json:", json);

    const arr = Array.isArray(json.watched_topic_ids)
      ? json.watched_topic_ids
      : [];

    const parsedSet: Set<number> = new Set(
  arr.map((n: unknown) => Number(n)).filter((n) => !Number.isNaN(n))
);

setWatchedTopicIds(parsedSet);
  } catch (e) {
    console.error("fetchWatchedStatus error:", e);
  }
};


useEffect(() => {
  console.log("useEffect fired, userId:", userId);
  if (userId) {
    fetchWatchedStatus(userId);
  }
}, [userId]);

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


  const currentTopic = useMemo(() => {
    if (openModule === null) return null;
    const mod = modules[openModule];
    if (!mod || !mod.topics || mod.topics.length === 0) return null;
    return mod.topics[currentPointIndex] ?? null;
  }, [modules, openModule, currentPointIndex]);

     const completedVideoCount = useMemo(() => {
      
  if (!currentModule?.topics) return 0;

  return currentModule.topics.filter((t) =>
    watchedTopicIds.has(Number(t.id))
  ).length;
}, [currentModule?.topics, watchedTopicIds]);


  const totalVideoPoints = currentModule?.topics?.length ?? 0;

  

const progressPercentage =
  totalVideoPoints > 0
    ? Math.round((completedVideoCount / totalVideoPoints) * 100)
    : 0;
  // final quiz helpers
  const handleFinalSelect = (questionIndex: number, optionIndex: number) => {
    setFinalAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
    const module = modules[openModule];
    const totalFinalQuestions =
  module?.topics?.length ?? totalQuestions;

const total = totalFinalQuestions;
    //const total = module?.topics?.length ?? totalFinalQuestions;
    if (questionIndex < total - 1) {
      setTimeout(() => setFinalIndex((i) => Math.min(i + 1, total - 1)), 120);
    }
  };
  const handleFinalPrev = () => setFinalIndex((i) => Math.max(0, i - 1));
  const computeFinalProgressPercent = () => {
    const module = modules[openModule];
   // const total = module?.topics?.length ?? totalFinalQuestions;
   const totalFinalQuestions =
  module?.topics?.length ?? totalQuestions;

const total = totalFinalQuestions;
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
    //setCompletedVideoCount((prev) => prev + 1);


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
  const [usernewScore, setNewUserScore] = useState(0);
  

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
    setNewUserScore(score);
    setHasPassed(passed);
    setQuizSubmitted(true);
    setIsQuizActive(true);   // quiz attempt is over
    setIsReviewMode(false);   // do NOT auto-enter review
        // quiz is completed (for Review button)
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
 const isCompleted = Number(currentModule?.completed) === 1;
  const canContinue =
    // no quiz at all
    !isMandatory ||           // non-mandatory quiz (always allow)
    (isMandatory && isCompleted); // mandatory + passed

 const questionLimit =
  currentModule?.questions_limit ?? currentQuestions.length;

  const totalQuestions = Math.min(
    questionLimit,
    currentQuestions.length
  );

  const isLastQuestion = currentPointIndex === totalQuestions - 1;

  const isQuiz = currentModule?.type === "quiz";
  

  const isLastModule = currentModule?.is_last === "yes";


  let requiredScore = 0;


  

  const continueLabel = isLastModule
    ? Courseassignmenttype === "Assignment"
      ? "Continue"
      : "Continue"
    : "Continue";

  

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

    
await fetchTopics(Number(modules[nextIndex].id), nextIndex);
    setQuizSubmitted(false);
    setUserScore(0);
  };




 const startQuiz = async (moduleIndex: number) => {
  const module = modules[moduleIndex];

  if (!module) {
    alert("Module not found");
    return;
  }

  
  setIsReviewMode(false);
  setQuizSubmitted(false);
  setIsQuizActive(true);
   setActiveView("quiz");

  // ✅ If quiz already completed → show RESULT screen
  if (Number(module.completed) === 1) {
   
    setIsQuizActive(true);
    setQuizSubmitted(true);
    setQuizLoading(false);
    return;
  }

  try {
    setQuizLoading(true);

    // reset fresh quiz state
    setCurrentQuestions([]);
    setCurrentPointIndex(0);
    setQuizAnswers({});
    setCheckedAnswers({});
    setIsPlaying({});

    const res = await fetch(
      `https://backstagepass.co.in/reactapi/api/getquizquestions.php?module_id=${module.id}&limit=${module.questions_limit}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to load quiz questions");

    const data = await res.json();

    if (!Array.isArray(data) || !data.length) {
      throw new Error("No quiz questions found");
    }

    const sanitizedQuestions: QuizQuestion[] = data.map(
      (q: any, index: number) => ({
        id: q.id ?? index,
        question: q.question,
        options: q.options,
        type: q.type,
        correct: q.correct,
      })
    );

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

const getPointLabel = (point: any): string => {
  if ("text" in point && point.text) return point.text;
  if ("title" in point && point.title) return point.title;
  if ("question" in point && point.question) return point.question;
  return "";
};
const handlePointClick = (index: number, point: any) => {
  // 🚨 EXIT QUIZ MODE COMPLETELY
  setIsQuizActive(false);
  setIsReviewMode(false);
  setQuizSubmitted(false);

  // ✅ SWITCH TO CONTENT VIEW
  setActiveView("content");

  // ✅ Update topic
  setCurrentPointIndex(index);

  // ✅ Play video after mount
  setTimeout(() => {
    if (videoRef.current && point.startTime != null) {
      videoRef.current.currentTime = point.startTime;
      videoRef.current.play();
    }
  }, 0);
};

const formatDuration = (duration?: string | null): string => {
  if (!duration) return "";

  const parts = duration.split(":");

  if (parts.length === 3 && parts[0] === "00") {
    return `${parts[1]}:${parts[2]}`;
  }

  return duration;
};



  return (
    <div className="min-h-screen px-4 md:px-2 py-6 bg-white-50">
      <div className="max-w-9xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight">
              {courseName}</h1>
            <div className="mt-2 flex items-center gap-3">
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
                            assignmentFile={assignmentFile ?? ""}
                          />
                        </div>
                      );
                    }

                   if (activeView === "final quiz") {
                    return (
                      <FinalQuizPanel
                        currentModule={{ topics: finalQuizTopics }}
                        finalIndex={finalIndex}
                        finalAnswers={finalAnswers}
                        finalSubmitted={finalSubmitted}
                        computeFinalProgressPercent={computeFinalProgressPercent}
                        handleFinalSelect={handleFinalSelect}
                        handleFinalPrev={handleFinalPrev}
                        setFinalSubmitted={setFinalSubmitted}
                        setPageNotice={setPageNotice}
                      />
                    );
                  }

                    // Default -> video player newone
                    return (
                      <div className="absolute inset-0">
                        {isQuizActive ? (
    <QuizPanel
      isQuizActive={isQuizActive}
      isCompleted={isCompleted}
      isMandatory={isMandatory}
      hasPassed={hasPassed}
      canContinue={canContinue}
      continueLabel={continueLabel}
      currentModule={currentModule}
      currentQuestions={currentQuestions}
      currentPointIndex={currentPointIndex}
      quizSubmitted={quizSubmitted}
      isReviewMode={isReviewMode}
      quizAnswers={quizAnswers}
      checkedAnswers={checkedAnswers}
      newscore={usernewScore}
      setIsReviewMode={setIsReviewMode}
      setQuizSubmitted={setQuizSubmitted}
      setCurrentPointIndex={setCurrentPointIndex}
      setQuizAnswers={setQuizAnswers}
      handleAnswerSelect={handleAnswerSelect}
      handleSubmitQuiz={handleSubmitQuiz}
      handleContinue={handleContinue}
     
    />

                        ) : (
                          /* ================= VIDEO UI ================= */
                          <>
                          {loadingTopics[openModule] && (
                          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-[#E11D2E]" />
      <p className="text-sm font-medium text-gray-600">
        Loading your course…
      </p>
    </div>
                        )}
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
              {!isQuizActive && activeView !== "assignment" && (
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{currentModule?.title ?? "—"}</h3>
                  <p className="text-sm text-gray-500">Topic {currentPointIndex + 1} / {(currentModule?.topics?.length ?? 0)}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => { if (currentPointIndex > 0) setCurrentPointIndex(currentPointIndex - 1); }} className="px-4 py-2 rounded-md bg-black text-white hover:opacity-95 transition">Previous</button>
                  <button onClick={() => { 
                  const module = openModule !== null ? modules[openModule] : undefined;
                    
                    if (currentPointIndex < (module?.topics?.length ?? 1) - 1) setCurrentPointIndex(currentPointIndex + 1); }} className="px-4 py-2 rounded-md bg-black text-white hover:opacity-95 transition">Next</button>
                </div>
              </div>
              )}
            </div>
          </div>

          <aside className="p-4 rounded-lg bg-white shadow-sm border border-gray-100 sticky top-6 max-h-[75vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">📘 Course Material</h2>
           

            <ul className="space-y-3">
              {modules.map((module, index) => {
                const isOpen = openModule === index;
const isCompletedModule = completedModuleIds.includes(Number(module.id));

const isUnlocked =
  isCompletedModule ||
  lastWatchedModuleId === Number(module.id) ||
  isModuleUnlocked(index);

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

                        
                        if (typeof module.id === "number") {
                          fetchTopics(module.id, index);
                        } else {
                          const id = parseInt(module.id, 10);
                          if (!Number.isNaN(id)) {
                            fetchTopics(id, index);
                          }
                        }
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
                              <div className="flex gap-2 flex-1">
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
      key={idx}
      onClick={() => handlePointClick(idx, point)}
      className={`text-sm leading-snug cursor-pointer transition-colors
        ${isCurrentPlaying
          ? "text-blue-700 font-medium"
          : "text-gray-800 hover:text-blue-600"}
      `}
      title={getPointLabel(point)}
    >
      {getPointLabel(point).length > 35
        ? getPointLabel(point).slice(0, 32) + "..."
        : getPointLabel(point)}
    </p>

                              </div>
                              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                <svg width="14" height="14" viewBox="0 0 24 24">
                                  <rect x="3" y="5" width="18" height="14" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                  <polygon points="10 9 16 12 10 15 10 9" fill="currentColor" />
                                </svg>
                                <span>{formatDuration(point.video_duration)} </span>
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






                          {isOpen &&
  isModuleLoaded &&
  module.is_last === "yes" &&
  assignmentType && (
    <li
      onClick={() =>
        setActiveView(assignmentType === 2 ? "assignment" : "final quiz")
      }
      className="mb-2 flex items-center justify-between p-3 rounded bg-blue-50 text-blue-800 font-medium cursor-pointer"
    >
      <div className="flex gap-3 flex-1">
        {/* CHECK ICON */}
        <span className="h-4 w-4 rounded-full border flex items-center justify-center mt-1 bg-green-500 border-green-500">
          <svg width="12" height="12" viewBox="0 0 24 24">
            <path
              d="M20 6L9 17l-5-5"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </span>

        {/* TEXT */}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">
            {assignmentType === 2 ? "Assignment" : "Final Quiz"}
          </p>
          <p className="text-xs text-gray-500">
            {assignmentType === 2
              ? "Test your understanding"
              : "Complete the final assessment"}
          </p>
        </div>
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
    </li>
  )}
 </ul>)}
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
