"use client";

import React from "react";

type QuizPanelProps = {
  isCompleted: boolean;
  isMandatory: boolean;
  hasPassed: boolean;
  canContinue: boolean;
  continueLabel: string;
  currentModule: any;
  currentQuestions: any[];
  currentPointIndex: number;
  newscore:number;
  quizSubmitted: boolean;
  isReviewMode: boolean;
  quizAnswers: Record<number, number>;
  checkedAnswers: Record<number, boolean>;

  setIsReviewMode: (v: boolean) => void;
  setQuizSubmitted: (v: boolean) => void;
  setCurrentPointIndex: (v: number) => void;
  setQuizAnswers: (v: Record<number, number>) => void;

  handleAnswerSelect: (qIndex: number, optIndex: number) => void;
  handleSubmitQuiz: () => void;
  handleContinue: () => void;
};

const QuizPanel: React.FC<QuizPanelProps> = ({
  isCompleted,
  isMandatory,
  hasPassed,
  canContinue,
  continueLabel,
  currentModule,
  currentQuestions,
  currentPointIndex,
  quizSubmitted,
  isReviewMode,
  quizAnswers,
  checkedAnswers,
  setIsReviewMode,
  setQuizSubmitted,
  setCurrentPointIndex,
  setQuizAnswers,
  handleAnswerSelect,
  handleSubmitQuiz,
  handleContinue,
  newscore,
}) => {
  const question = currentQuestions[currentPointIndex];

  return (
    <div className="w-full h-full bg-white p-6 overflow-auto">
      {/* ================= HEADER ================= */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {currentModule?.title}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Question {currentPointIndex + 1} of {currentModule?.questions_limit}
        </p>
      </div>

      {/* ================= QUIZ COMPLETED ================= */}
      {/* {isCompleted && quizSubmitted && (
        <div className="text-center py-10">
             
        <p className="text-green-600 mb-4 text-lg font-semibold">
          🎉 Congratulations! You passed the quiz.
        </p>
   
          <h3 className="text-2xl font-semibold text-green-700">
            Quiz Completed  🎉
          </h3>
          <p className="mt-3 text-lg text-gray-700">
            Your Score is:{" "}
            <span className="font-bold text-green-600">
                {currentModule?.score}/ 100
            </span>
          </p>

          {canContinue && (
            <button
              onClick={handleContinue}
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              {continueLabel}
            </button>
          )}
        </div>
      )} */}

      {quizSubmitted && !isReviewMode && (
  <div className="text-center py-10">
    {/* ===== Title ===== */}
    <h3 className="text-2xl font-semibold mb-3">
      {hasPassed || isCompleted ? "Quiz Completed 🎉" : "Quiz Submitted"}
    </h3>

    {/* ===== Success / Fail Message ===== */}
    {(hasPassed || isCompleted) ? (
      <p className="text-green-600 mb-4 text-lg font-semibold">
        🎉 Congratulations! You passed the quiz.
      </p>
    ) : (
      isMandatory && (
        <p className="text-red-600 mt-2">
          You did not pass. Please try again.
        </p>
      )
    )}

    {/* ===== Score ===== */}
    <p className="text-lg text-gray-700">
      Your Score:{" "}
      <span className="font-bold text-green-600">
        {(isCompleted ? currentModule?.score : newscore) ?? 0} / 100
      </span>
    </p>

    {/* ===== Actions ===== */}
    <div className="mt-6 flex justify-center gap-4">
      {/* Review */}
      <button
        onClick={() => setIsReviewMode(true)}
        className="px-5 py-2 bg-green-600 text-white rounded"
      >
        Review Quiz
      </button>

      {/* Continue */}
      {/* {canContinue && (hasPassed || isCompleted) && ( */}
       {(hasPassed || isCompleted) && (
        <button
          onClick={handleContinue}
          className="px-5 py-2 bg-blue-600 text-white rounded"
        >
          {continueLabel}
        </button>
      )}

      {/* Retake */}
      {isMandatory && !hasPassed && !isCompleted && (
        <button
          onClick={() => {
            setQuizSubmitted(false);
            setCurrentPointIndex(0);
            setQuizAnswers({});
          }}
          className="px-5 py-2 bg-orange-600 text-white rounded"
        >
          Retake Quiz
        </button>
      )}
    </div>
  </div>
)}

      {/* ================= REVIEW MODE ================= */}
      {isReviewMode && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Review Answers</h3>

          {currentQuestions.map((q, qIndex) => (
            <div key={qIndex} className="mb-6 border rounded-lg p-4">
              <p className="font-medium mb-3">
                {qIndex + 1}. {q.question}
              </p>

              <ul className="space-y-2">
                {q.options.map((opt: string, idx: number) => {
                  const isCorrect = opt === q.correct;
                  const isSelected = quizAnswers[qIndex] === idx;

                  let cls =
                    "p-2 rounded border flex items-center gap-2 ";
                  if (isCorrect)
                    cls += "bg-green-100 border-green-500";
                  else if (isSelected)
                    cls += "bg-red-100 border-red-500";
                  else cls += "bg-gray-50 border-gray-200";

                  return (
                    <li key={idx} className={cls}>
                      <input type="radio" checked={isSelected} disabled />
                      <span>{opt}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <button
            onClick={() => setIsReviewMode(false)}
            className="px-5 py-2 bg-blue-600 text-white rounded-md"
          >
            Back
          </button>
        </div>
      )}

      {/* ================= QUIZ QUESTIONS ================= */}
      {!quizSubmitted && !isReviewMode && question && (
        <>
          {isMandatory && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700 font-medium">
              You must score at least {currentModule?.quiz_score}% to proceed.
            </div>
          )}

          <p className="text-lg font-medium mb-4">
            {question.question}
          </p>

          <ul className="space-y-3 mb-6">
  {question.options.map((opt: string, idx: number) => {
    const isSelected = quizAnswers[currentPointIndex] === idx;
    const isChecked = checkedAnswers[currentPointIndex];

    return (
      <li key={idx}>
        <label
          className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition
            ${
              isSelected
                ? "bg-blue-100 border-blue-500"
                : "hover:bg-gray-100 border-gray-300"
            }
            ${isChecked ? "opacity-60 cursor-not-allowed" : ""}
          `}
        >
          {/* RADIO BUTTON */}
          <input
            type="radio"
            name={`question-${currentPointIndex}`}
            checked={isSelected}
            disabled={isChecked}
            onChange={() =>
              !isChecked &&
              handleAnswerSelect(currentPointIndex, idx)
            }
            className="h-4 w-4 accent-blue-600"
          />

          {/* OPTION TEXT */}
          <span className="text-gray-800">{opt}</span>
        </label>
      </li>
    );
  })}
</ul>

          <div className="flex justify-between">
            <button
              disabled={currentPointIndex === 0}
              onClick={() =>
                setCurrentPointIndex((p) => Math.max(p - 1, 0))
              }
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>

            {currentPointIndex === currentQuestions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={() =>
                  setCurrentPointIndex((p) => p + 1)
                }
                disabled={quizAnswers[currentPointIndex] === undefined}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            )}
          </div>
        </>
      )}

      {/* ================= SUBMITTED RESULT ================= */}
      {/* {quizSubmitted && !isReviewMode && !isCompleted && (
        <div className="text-center py-8">
          <h3 className="text-2xl font-semibold mb-3">
            Quiz Submitted
          </h3>

          <p className="text-lg">
            Score:{" "}
            <span className="font-bold">
              {newscore} / 100
            </span>
          </p>

          {isMandatory && !hasPassed && (
            <p className="text-red-600 mt-2">
              You did not pass. Please try again.
            </p>
          )}

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setIsReviewMode(true)}
              className="px-5 py-2 bg-green-600 text-white rounded"
            >
              Review Quiz
            </button>

            {canContinue && (
              <button
                onClick={handleContinue}
                className="px-5 py-2 bg-blue-600 text-white rounded"
              >
                {continueLabel}
              </button>
            )}

            {isMandatory && !hasPassed && (
              <button
                onClick={() => {
                  setQuizSubmitted(false);
                  setCurrentPointIndex(0);
                  setQuizAnswers({});
                }}
                className="px-5 py-2 bg-orange-600 text-white rounded"
              >
                Retake Quiz
              </button>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default QuizPanel;
