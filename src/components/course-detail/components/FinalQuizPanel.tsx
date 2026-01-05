"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/* ---------- TYPES ---------- */
export type QuizTopic = {
  question: string;
  options: string[];
  correct: string;
};

interface FinalQuizPanelProps {
  currentModule: {
    topics: QuizTopic[];
  };
  finalIndex: number;
  finalAnswers: Record<number, number>;
  finalSubmitted: boolean;

  computeFinalProgressPercent: () => number;
  handleFinalSelect: (qIndex: number, optIndex: number) => void;
  handleFinalPrev: () => void;

  setFinalSubmitted: (v: boolean) => void;
  setPageNotice: (v: string | null) => void;
}

/* ---------- COMPONENT ---------- */
const FinalQuizPanel: React.FC<FinalQuizPanelProps> = ({
  currentModule,
  finalIndex,
  finalAnswers,
  finalSubmitted,
  computeFinalProgressPercent,
  handleFinalSelect,
  handleFinalPrev,
  setFinalSubmitted,
  setPageNotice,
}) => {
  const topics = currentModule?.topics ?? [];
  const q = topics[finalIndex];
  function handleRetakeQuiz() {
    setFinalAnswers({});        // Clear all answers
    setFinalIndex(0);           // Go back to first question
    setFinalSubmitted(false);   // Mark quiz as not submitted
    setFinalScore(null);        // Clear score
  }

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

  if (!q) {
    return <div className="p-6 text-center">No question found.</div>;
  }
  return (
    <div className="absolute inset-0 p-6 overflow-auto bg-white">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        {/* HEADER */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">🏁 Final Quiz</h3>
          <p className="text-sm text-gray-500 mb-3">
            Answer each question to progress.
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
            {Object.keys(finalAnswers).length} / {topics.length} answered
          </p>
        </div>

        {/* QUESTION */}
        <div className="p-4 border rounded-lg">
          <div className="mb-4 font-medium">
            Q{finalIndex + 1}. {q.question}
          </div>

          <ul className="space-y-2">
            {q.options.map((opt, optIdx) => {
              const selected = finalAnswers[finalIndex] === optIdx;
              return (
                <li key={optIdx}>
                  <label
                    className={`inline-flex items-center gap-2 p-3 rounded w-full cursor-pointer ${
                      selected
                        ? "bg-green-100 border border-green-300"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`final-quiz-q-${finalIndex}`}
                      checked={selected}
                      onChange={() =>
                        handleFinalSelect(finalIndex, optIdx)
                      }
                    />
                    <span>{opt}</span>
                  </label>
                </li>
              );
            })}
          </ul>

          {/* NAV + SUBMIT */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={handleFinalPrev}
              disabled={finalIndex === 0}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {finalIndex + 1} / {topics.length}
              </span>

              <button
                disabled={Object.keys(finalAnswers).length !== topics.length}
                onClick={() => {
                  if (Object.keys(finalAnswers).length < topics.length) {
                    setPageNotice(
                      "Please answer all questions before submitting."
                    );
                    setTimeout(() => setPageNotice(null), 2200);
                    return;
                  }

                  let correct = 0;
                  topics.forEach((qq, idx) => {
                    const userAns = finalAnswers[idx];
                    const correctIdx = qq.options.indexOf(qq.correct);
                    if (userAns === correctIdx) correct++;
                  });

                  const score = Math.round((correct / topics.length) * 100);
                  setFinalSubmitted(true);
                  setPageNotice(`✅ Final Quiz completed! Score: ${score}%`);
                  setTimeout(() => setPageNotice(null), 3000);
                }}
                className={`px-4 py-2 rounded font-semibold ${
                  Object.keys(finalAnswers).length === topics.length
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-700 cursor-not-allowed"
                }`}
              >
                Submit Final Quiz
              </button>
            </div>
          </div>
        </div>

        {/* RESULT */}
        {finalSubmitted && (
          <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200 text-center">
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              🎉 Congratulations!
            </h2>
            <p className="text-lg text-gray-700">
              You have completed the Final Quiz.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default FinalQuizPanel;