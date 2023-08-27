import { QuestionObject } from "@/types/quiz-interface";

export function createQuizData(responseText: string): QuestionObject[] {
  // Split the response into individual questions
  const questions = responseText.split(/\d+\./).filter(Boolean);

  // Process each question to create JSON objects
  const quizData = questions.map((question) => {
    const lines = question.trim().split("\n");
    const q = lines[0].trim(); // Question
    const options = lines.slice(1, -1).map((line) => line.trim()); // Answer options
    const correctAnswer = lines[lines.length - 1].match(/answer: (.*)/)![1]; // Correct answer

    return {
      question: q,
      options: options,
      correctAnswer: correctAnswer,
    };
  });

  return quizData;
}

