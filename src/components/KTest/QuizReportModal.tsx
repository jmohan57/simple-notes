import { capitalizeWords } from "@/helpers/capitalizeWords";
import { formatDateTime } from "@/helpers/formatDateTime";
import { IQuiz } from "@/types/quiz-interface";
import React from "react";
import { FaClock } from "react-icons/fa";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import "@/components/KTest/Custom CSS/animate-fade-in.css";
import "@/components/MyBoards/Custom CSS/scrollbar.css";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  quizData: IQuiz | null;
}

const QuizReportModal: React.FC<Props> = ({ isOpen, closeModal, quizData }) => {
  if (!isOpen && !quizData) {
    return null;
  }

  if (quizData) {
    const totalCorrectQuestion: number =
      quizData.reportData.map((dl) => dl.correct).length > 0
        ? quizData.reportData
            .map((dl) => dl.correct)
            .reduce((acc, dl) => acc + dl)
        : 0;

    const totalInCorrectQuestion: number =
      quizData.reportData.map((dl) => dl.incorrect).length > 0
        ? quizData.reportData
            .map((dl) => dl.incorrect)
            .reduce((acc, dl) => acc + dl)
        : 0;

    const totalQuestions: number =
      totalCorrectQuestion + totalInCorrectQuestion;

    const pieChartData = {
      labels: ["Correct", "Incorrect"],
      datasets: [
        {
          data: [totalCorrectQuestion, totalInCorrectQuestion],
          backgroundColor: ["#13ed46", "#d92e2b"],
          hoverBackgroundColor: ["#0c8227", "#6e1716"],
        },
      ],
    };

    const barGraphData = {
      labels: quizData.reportData.map((d, i) => `Difficulty ${(i + 1) * 10}%`),
      datasets: [
        {
          label: "Correct",
          data: quizData.reportData.map((d) => d.correct),
          backgroundColor: "#13ed46",
          hoverBackgroundColor: "#0c8227",
        },
        {
          label: "Incorrect",
          data: quizData.reportData.map((d) => d.incorrect),
          backgroundColor: "#d92e2b",
          hoverBackgroundColor: "#6e1716",
        },
      ],
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-80 bg-gray-900 z-30">
        <div
          className="bg-white dark:bg-slate-900 flex flex-col w-[90%] md:w-[75%] justify-center
        items-center p-8 rounded-lg shadow-lg zoom-in max-h-[98vh] overflow-y-auto"
        >
          <h2
            className={`${
              quizData.topic.length > 20
                ? "text-base md:text-lg"
                : "text-lg md:text-2xl"
            } font-semibold mb-4 mt-4 text-center`}
          >
            Knowledge Test Report on {capitalizeWords(quizData.topic)}
          </h2>
          <div className="w-full flex flex-col space-y-4">
            {/* Time */}
            <div
              className="w-full flex flex-wrap justify-between items-center bg-gray-300 dark:bg-blue-950
            dark:border-2 dark:border-white p-3 rounded-md"
            >
              <p className="flex gap-2 items-center">
                <FaClock />
                <b>Started On: </b> {formatDateTime(quizData.startedOn)}
              </p>
              <p className="flex gap-2 items-center">
                <FaClock />
                <b>Ended On: </b> {formatDateTime(quizData.submittedOn!)}
              </p>
            </div>

            {/* Performance */}
            <div className="w-full flex-col flex md:flex-row justify-between items-center max-h-[60vh] overflow-y-auto">
              <div
                className="w-[90%] md:w-[20%] flex flex-col bg-gray-300 dark:bg-blue-950
                dark:border-2 dark:border-white p-6 rounded-md text-xl font-bold justify-center items-center
                my-2 gap-4 text-center min-h-[200px]"
              >
                <h1>Total Questions Attempted</h1>
                <h1 className="text-4xl">{totalQuestions}</h1>
              </div>
              <div
                className="w-[90%] md:w-[30%] flex flex-col bg-gray-300 dark:bg-blue-950
                dark:border-2 dark:border-white p-4 rounded-md text-2xl font-bold justify-center items-center
                m-2 min-h-[200px]"
              >
                <Pie
                  className="text-black dark:text-white"
                  data={pieChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
              <div
                className="w-[90%] md:w-[40%] flex flex-col bg-gray-300 dark:bg-blue-950
                dark:border-2 dark:border-white p-4 rounded-md text-2xl font-bold justify-center items-center
                m-2 min-h-[200px]"
              >
                <Bar
                  data={barGraphData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-6 hover:bg-blue-600 transition-colors duration-300"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    );
  }
};

export default QuizReportModal;
