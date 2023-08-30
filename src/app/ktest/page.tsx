"use client";

import ConfirmModal from "@/components/KTest/ConfirmModal";
import QuizContainer from "@/components/KTest/QuizContainer";
import QuizReportModal from "@/components/KTest/QuizReportModal";
import MainScreenLoader from "@/components/MainScreenLoader";
import NavBar from "@/components/NavBar";
import PasswordChangeModal from "@/components/PasswordChangeModal";
import { capitalizeWords } from "@/helpers/capitalizeWords";
import { questionLoadingArray } from "@/helpers/questionsLoadingArray";
import { suggestedQuizTopic } from "@/helpers/suggestedQuizTopic";
import { IQuiz } from "@/types/quiz-interface";
import { UserInterface } from "@/types/user-interface";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { AiOutlineHistory, AiOutlineLoading } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyBoardsPage() {
  const router = useRouter();
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserInterface>();
  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const [quizTopic, setQuizTopic] = useState("");
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [loadingText, setLoadingText] = useState(questionLoadingArray[0]);
  const [quizData, setQuizData] = useState<IQuiz | null>();
  const [diffLevel, setDiffLevel] = useState(1);
  const [endQuizModalOpen, setEndQuizModalOpen] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [reportModalData, setReportModalData] = useState<IQuiz | null>(null);
  const [quizHistory, setQuizHistory] = useState<IQuiz[]>([]);

  // ---- useEffects Region Start ---- //
  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    getQuizSession();
  }, [user]);

  useEffect(() => {
    let i = questionLoadingArray.indexOf(loadingText);
    setTimeout(() => {
      i === questionLoadingArray.length - 1 ? (i = 0) : (i = i + 1);
      setLoadingText(questionLoadingArray[i]);
    }, 10000);
  }, [loadingText]);
  // ---- useEffects Region End ---- //

  // ---- Handler Functions & API Calls ---- //
  const getUserDetails = async () => {
    try {
      const response = await axios.post("/api/auth/authuser");
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        router.push("/login");
      }
    } catch (error: any) {
      router.push("/login");
    }
  };

  const getQuizSession = async () => {
    if (user?.username) {
      try {
        const response = await axios.post("/api/ktest/fetchquizsession", {
          username: user?.username,
        });
        if (response.data.success) {
          if (response.data.resultObject.length >= 0) {
            setQuizHistory(response.data.resultObject);
          } else {
            setQuizData(response.data.resultObject ?? null);

            const diffLevel =
              response.data.resultObject.currentDifficultyLevel ?? 1;
            setDiffLevel(diffLevel);
          }
        }
      } catch (error: any) {
        toast.error("Sorry, something went wrong !");
        router.push("/home");
      } finally {
        setUserLoading(false);
      }
    }
  };

  const handleSigningOut = async () => {
    setUserLoading(true);
    try {
      const response = await axios.post("api/auth/signout");
      if (response.data.success) {
        router.push("/login");
      } else {
        toast.error("Error occured while signing out");
      }
    } catch (error) {
      toast.error("Error occured while signing out");
    }
  };

  const handleTopic = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (quizTopic.trim() !== "") {
        generateQuiz(quizTopic, diffLevel);
      }
    }
  };

  const generateQuiz = async (topic: string, currentDiffLevel: number) => {
    setLoadingQuiz(true);
    if (topic === undefined || currentDiffLevel === undefined) return;
    try {
      const response = await axios.post("/api/ktest/getquestions", {
        topic,
        diffLevel: currentDiffLevel,
        username: user?.username,
      });

      if (response.data.success) {
        if (response.data.resultObject.currentQuizData[0].options.length > 4) {
          generateQuiz(topic, currentDiffLevel);
        } else {
          setLoadingQuiz(false);
          setQuizData(response.data.resultObject);
        }
      } else {
        setLoadingQuiz(false);
        toast.error(
          "Error occured while generating questions, please try again !"
        );
      }
    } catch (error) {
      setLoadingQuiz(false);
      toast.error(
        "Error occured while generating questions, please try again !"
      );
    }
  };

  const onContinueQuiz = () => {
    const quizReport = quizData?.reportData.find(
      (qr) => qr.difficultyLevel === quizData.currentDifficultyLevel
    );

    if (
      quizReport &&
      (quizData?.currentDifficultyLevel! > 5
        ? quizReport?.correct > quizReport?.incorrect * 2
        : quizReport?.correct > quizReport?.incorrect) &&
      quizData?.currentDifficultyLevel! < 10
    ) {
      generateQuiz(quizData?.topic!, quizData?.currentDifficultyLevel! + 1);
    } else {
      generateQuiz(quizData?.topic!, quizData?.currentDifficultyLevel!);
    }
  };

  const onEndQuiz = async () => {
    setIsEnding(true);
    try {
      const response = await axios.post("/api/ktest/endquiz", {
        topic: quizData?.topic,
        username: user?.username,
      });

      if (response.data.success) {
        setQuizData(null);
        setReportModalData(response.data.resultObject);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error occured while ending quiz !");
    } finally {
      setIsEnding(false);
      setEndQuizModalOpen(false);
    }
  };

  // ---- Handler Functions & API Calls End ---- //

  return !userLoading && user ? (
    <div
      className={`w-full h-full min-h-screen bg-gradient-to-b from-slate-500 to-slate-800 ${
        endQuizModalOpen && "fixed"
      }`}
    >
      <ToastContainer position="top-center" />
      <NavBar
        user={user!}
        onPasswordChange={() => setPasswordModalOpen(true)}
        isSigningOut={handleSigningOut}
      />

      <PasswordChangeModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSave={() => {
          setPasswordModalOpen(false);
          toast.success("Password updated !");
        }}
        username={user.username!}
      />

      <ConfirmModal
        isOpen={endQuizModalOpen}
        isEnding={isEnding}
        onClose={() => setEndQuizModalOpen(false)}
        onConfirm={onEndQuiz}
      />

      <QuizReportModal
        isOpen={reportModalData !== null}
        closeModal={() => setReportModalData(null)}
        quizData={reportModalData}
      />

      {/* Main Container */}
      <div
        className={`w-full p-2 md:p-6 flex flex-col flex-wrap md:flex-row justify-center items-center md:justify-evenly gap-4`}
      >
        {/* Topic Input */}

        <div className="w-full flex justify-center items-center">
          {!loadingQuiz && !quizData ? (
            <div className="w-full flex flex-col justify-center items-center gap-4">
              <input
                type="text"
                placeholder="Enter a topic you want to test your knowledge on ..."
                className="w-[90%] md:w-[60%] p-2 rounded-md shadow-md border-2 border-blue-500 dark:border-white 
              bg-white dark:bg-gray-800 outline-none focus:scale-110 duration-300"
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                onKeyDown={handleTopic}
              />

              {/* Suggested Topics */}
              <h1 className="text-white font-bold mt-4">Suggested Topics</h1>
              <span className="w-[90%] md:w-[60%] flex justify-center items-center flex-wrap gap-2">
                {suggestedQuizTopic.map((topic, i) => (
                  <div
                    key={i}
                    className="bg-white text-black border-black border-2 shadow-lg p-3 rounded-full cursor-pointer"
                    onClick={() => setQuizTopic(topic)}
                  >
                    {topic}
                  </div>
                ))}
              </span>

              {/* Quiz History */}
              {quizHistory?.length > 0 && (
                <span
                  className="w-[90%] md:w-[60%] flex-col flex-wrap justify-center items-start gap-2 mt-4 p-4 
                bg-white border-black border-2 dark:bg-slate-800 dark:border-white rounded-md shadow-lg zoom-in"
                >
                  <span className="w-full flex justify-start items-center gap-2 mb-4">
                    <AiOutlineHistory className="w-6 h-6" />
                    <h1 className="font-bold text-xl">History</h1>
                  </span>
                  <span
                    className={`w-full mt-2 flex ${
                      quizHistory.length > 3
                        ? "justify-evenly"
                        : "justify-start"
                    } items-center gap-4 flex-wrap`}
                  >
                    {quizHistory.map((quiz, i) => (
                      <span
                        key={i}
                        className={`bg-gradient-to-br from-blue-800 to-red-700
                        rounded-md p-4 text-white font-semibold cursor-pointer hover:scale-95 duration-150 shrink-0`}
                        onClick={() => setReportModalData(quiz)}
                      >
                        {capitalizeWords(quiz.topic)}
                      </span>
                    ))}
                  </span>
                </span>
              )}
            </div>
          ) : (
            <>
              {loadingQuiz && (
                <span className="mt-10 flex flex-col justify-center items-center gap-8 text-white">
                  <AiOutlineLoading className="w-12 h-12 animate-spin" />
                  <h1 className="text-2xl text-center font-bold">
                    {loadingText}
                  </h1>
                </span>
              )}
              {!loadingQuiz && quizData?.currentQuizData && (
                <QuizContainer
                  quizData={quizData}
                  username={user.username!}
                  onUpdateQuizData={(updatedQuizData: IQuiz) => {
                    setQuizData(updatedQuizData);
                  }}
                  onContinueQuiz={onContinueQuiz}
                  onEndQuiz={() => setEndQuizModalOpen(true)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  ) : (
    <>
      <MainScreenLoader />
    </>
  );
}

export default MyBoardsPage;
