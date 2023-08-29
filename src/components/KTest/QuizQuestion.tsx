"use client";

import { QuestionObject, QuizReport } from "@/types/quiz-interface";
import axios from "axios";
import React, { useState } from "react";
import { BiLoader } from "react-icons/bi";
import { BsCheckCircleFill, BsFillXCircleFill } from "react-icons/bs";
import { toast } from "react-toastify";

interface QuizQuestionProps {
  question: QuestionObject;
  isSaving: (isSaving: boolean) => void;
  onAnswer: (
    question: string,
    selectedOption: string,
    reportData: QuizReport[]
  ) => void;
  username: string;
  topic: string;
}

function QuizQuestion(props: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState(
    props.question.selectedOption ?? ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isCorrect, setCorrect] = useState<boolean | null>(
    props.question.isCorrect ?? null
  );

  const handleAttempt = async (option: string) => {
    if (
      props.question.selectedOption ||
      isSaving ||
      selectedOption.length > 0
    ) {
      return;
    }

    setSelectedOption(option);
    setIsSaving(true);
    props.isSaving(true);

    try {
      const response = await axios.post("/api/ktest/saveanswer", {
        topic: props.topic,
        username: props.username,
        question: props.question.question,
        selectedOption: option,
      });

      if (response.data.success) {
        props.onAnswer(
          props.question.question,
          option,
          response.data.resultObject.reportData
        );
        setCorrect(response.data.resultObject.isCorrect);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Couldn't save answer !");
    } finally {
      setIsSaving(false);
      props.isSaving(false);
    }
  };

  return (
    <div
      className="w-full flex flex-col p-4 gap-4 justify-center rounded-md shadow-md bg-white 
    dark:bg-slate-900 border-2 border-slate-900 dark:border-white"
    >
      {/* Question Text */}
      <h1 className="text-lg md:text-xl font-bold">
        {props.question.question}
      </h1>
      {/* Options */}
      <span className="w-full flex flex-col gap-2">
        {props.question.options.map((option, i) => {
          return (
            option.text!.length > 0 && (
              <div
                key={i}
                className={`w-full flex p-2 justify-between rounded-md shadow-md ${
                  selectedOption === option.text ||
                  props.question.selectedOption === option.text
                    ? "bg-blue-200 dark:bg-gray-600"
                    : "bg-white dark:bg-slate-900"
                } border-2 
              border-slate-900 dark:border-white ${
                selectedOption.length === 0 &&
                "cursor-pointer hover:bg-blue-200 dark:hover:bg-gray-600"
              }`}
                onClick={() => handleAttempt(option.text!)}
              >
                {option.text}
                {isSaving && selectedOption === option.text && (
                  <span className="flex gap-1 italic text-sm items-center">
                    Saving
                    <BiLoader className="animate-spin" />
                  </span>
                )}
                {!isSaving && isCorrect !== null && (
                  <>
                    {isCorrect && selectedOption === option.text && (
                      <span className="flex gap-1 font-bold items-center text-green-500">
                        <p>Correct</p>
                        <BsCheckCircleFill />
                      </span>
                    )}
                    {!isCorrect && selectedOption === option.text && (
                      <span className="flex gap-1 font-bold items-center text-red-600">
                        <p>Incorrect</p>
                        <BsFillXCircleFill />
                      </span>
                    )}
                  </>
                )}
              </div>
            )
          );
        })}
      </span>
    </div>
  );
}

export default QuizQuestion;
