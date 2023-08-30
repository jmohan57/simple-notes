import { connect } from "@/dbconfig/dbConfig";
import { createQuizData } from "@/helpers/createQuizData";
import Quiz from "@/models/quizModel";
import { NextRequest, NextResponse } from "next/server";
import { TextServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";

connect();

const MODEL_NAME = "models/text-bison-001";
const API_KEY = process.env.PALMAI_KEY;

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY!),
});

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { topic, diffLevel, username } = reqBody;

    const prompt = `Generate 2 mcq questions with 4 options and correct answer option, the format will be like Question: Question text next line options with a,b,c,d (in capital always) next line Answer: Answer option, do not use any question 1 or question 2, just plain question. No explanation and strictly no repeat questions, on topic ${topic} or if this is a link, read the content in it then generate the question from it, difficulty level is ${diffLevel} out of 10, where 10 is the most difficult question to answer, strictly follow the difficulty level.`;

    const questions = await client.generateText({
      model: MODEL_NAME,
      prompt: {
        text: prompt,
      },
    });

    const quizData = createQuizData(questions[0].candidates![0].output!);

    // Find if the current quiz session is already exists
    const quiz = await Quiz.findOne({ username }).where({
      isEnded: false,
      topic,
    });

    let savedQuiz;
    if (!quiz) {
      // No quiz session, create a new one
      const newQuiz = new Quiz({
        username: username,
        topic: topic,
        startedOn: Date.now(),
        isEnded: false,
        currentDifficultyLevel: diffLevel,
        currentQuizData: quizData,
        reportData: [],
      });
      savedQuiz = await newQuiz.save();
    } else {
      quiz.currentDifficultyLevel = diffLevel;
      quiz.currentQuizData = quizData;

      savedQuiz = await quiz.save();
    }

    return NextResponse.json({
      message: "Questions generated successfully",
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
        topic: savedQuiz.topic,
        startedOn: savedQuiz.startedOn,
        currentDifficultyLevel: savedQuiz.currentDifficultyLevel,
        reportData: savedQuiz.reportData,
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: error,
      message: "Sorry, something went wrong !",
      status: 500,
      success: false,
    });
  }
}
