import { connect } from "@/dbconfig/dbConfig";
import { createQuizData } from "@/helpers/createQuizData";
import Quiz from "@/models/quizModel";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

connect();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { topic, diffLevel, username } = reqBody;

    const questions = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Generate 1 question of mcq type with correct answer, on the topic ${topic} with difficulty level ${diffLevel}, where maximum difficulty level is 10.`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const quizData = createQuizData(questions.choices[0].message.content!);

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
