import { connect } from "@/dbconfig/dbConfig";
import Quiz from "@/models/quizModel";
import { QuestionObject } from "@/types/quiz-interface";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username } = reqBody;

    // Find if the current quiz session is already exists
    const quizes = await Quiz.find({ username });

    if (!quizes) {
      // No quiz session
      return NextResponse.json({
        message: "No active quiz session found!",
        status: 404,
        succcess: true,
        resultObject: null,
      });
    } else {
      const quiz = quizes.find((q) => q.isEnded === false);
      if (quiz) {
        const quizData: QuestionObject[] = quiz.currentQuizData;
        return NextResponse.json({
          message: "Questions fetched successfully",
          status: 200,
          success: true,
          resultObject: {
            currentQuizData: quizData.map((q) => {
              return {
                question: q.question,
                options: q.options,
                selectedOption: q.selectedOption ?? null,
                isCorrect: q.isCorrect ?? null,
              };
            }),
            topic: quiz.topic,
            startedOn: quiz.startedOn,
            currentDifficultyLevel: quiz.currentDifficultyLevel,
            reportData: quiz.reportData,
          },
        });
      } else {
        return NextResponse.json({
          message: "History fetched successfully",
          status: 200,
          success: true,
          resultObject: quizes,
        });
      }
    }
  } catch (error) {
    return NextResponse.json({
      error: error,
      message: "Sorry, something went wrong !",
      status: 500,
      success: false,
    });
  }
}
