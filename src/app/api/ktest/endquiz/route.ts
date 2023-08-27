import { connect } from "@/dbconfig/dbConfig";
import Quiz from "@/models/quizModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { topic, username } = reqBody;

    // Find if the current quiz session is already exists
    const quiz = await Quiz.findOne({ username }).where({
      isEnded: false,
      topic,
    });

    if (!quiz) {
      return NextResponse.json({
        message: "Sorry, quiz data not found !",
        status: 404,
        success: false,
      });
    } else {
      quiz.isEnded = true;
      quiz.submittedOn = Date.now();
      quiz.currentQuizData = [];
      const endedQuiz = await quiz.save();

      return NextResponse.json({
        message: "Quiz ended successfully !",
        status: 200,
        success: true,
        resultObject: endedQuiz,
      });
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
