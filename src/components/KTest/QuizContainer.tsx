"use client";

import QuizQuestion from "@/components/KTest/QuizQuestion";
import { capitalizeWords } from "@/helpers/capitalizeWords";
import { formatDateTime } from "@/helpers/formatDateTime";
import { IQuiz, QuestionObject, QuizReport } from "@/types/quiz-interface";
import React, { useState } from "react";
import "@/components/KTest/Custom CSS/animate-fade-in.css";

interface QuizContainerProps {
  quizData: IQuiz;
  username: string;
  onUpdateQuizData: (data: IQuiz) => void;
  onContinueQuiz: () => void;
  onEndQuiz: () => void;
}

function QuizContainer(props: QuizContainerProps) {
  const [savingQuestion, setSavingQuestion] = useState(false);

  const onAnswer = (
    question: string,
    selectedOption: string,
    reportData: QuizReport[]
  ) => {
    const quiz = props.quizData;
    let quizData: QuestionObject[] = quiz.currentQuizData;
    let selectedQuestion: QuestionObject | undefined = quizData.find(
      (q) => q.question === question
    );

    if (selectedQuestion) {
      const index = quizData.indexOf(selectedQuestion);
      selectedQuestion = { ...selectedQuestion, selectedOption };

      quizData.splice(index, 1, selectedQuestion);
    }

    props.onUpdateQuizData({ ...quiz, currentQuizData: quizData, reportData });
  };

  const isSingleQuestionSaving = (isSaving: boolean) => {
    setSavingQuestion(isSaving);
  };

  return (
    <div className="w-full md:w-[80%] flex flex-col justify-center items-center md:p-6 gap-4 zoom-in">
      {/* Quiz Topic and details */}
      <div className="w-full flex flex-col p-4 gap-4 justify-center items-center rounded-md shadow-md bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-white">
        <h1 className={`${props.quizData.topic.length > 20 ? 'text-base md:text-lg' : 'text-xl md:text-2xl'} font-bold`}>
          {capitalizeWords(props.quizData.topic)}
        </h1>
        <span className="w-full flex justify-between flex-wrap items-center">
          <p>
            <b>Started on:</b> {formatDateTime(props.quizData.startedOn)}
          </p>
          <p>
            <b>Difficulty Level:</b>{" "}
            {`${props.quizData.currentDifficultyLevel * 10} %`}
          </p>
        </span>
      </div>
      {/* Quiz Questions and Options */}
      {props.quizData.currentQuizData.map((question, i) => {
        return (
          <QuizQuestion
            key={i}
            question={question}
            isSaving={isSingleQuestionSaving}
            onAnswer={onAnswer}
            username={props.username}
            topic={props.quizData.topic}
          />
        );
      })}

      {/* Buttons */}
      <div className="w-full flex justify-center gap-6 my-4">
        <button
          className="p-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 disabled:cursor-not-allowed"
          disabled={savingQuestion}
          onClick={props.onEndQuiz}
        >
          End Test
        </button>
        <button
          className="p-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 disabled:cursor-not-allowed"
          disabled={savingQuestion}
          onClick={props.onContinueQuiz}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default QuizContainer;
