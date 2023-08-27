import { connect } from "@/dbconfig/dbConfig";
import Quiz from "@/models/quizModel";
import { QuestionObject, QuizReport } from "@/types/quiz-interface";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { topic, username, question, selectedOption } = reqBody;

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
      let isCorrect = false;
      let quizData: QuestionObject[] = quiz.currentQuizData;
      let quizReport: QuizReport[] = quiz.reportData;
      let selectedQuestion: QuestionObject | undefined = quizData.find(
        (q) => q.question === question
      );

      if (selectedQuestion?.selectedOption) {
        // If answer is already saved
        return NextResponse.json({
          message:
            "Answer is already saved from another source, reload the page !",
          status: 500,
          success: false,
        });
      }

      if (selectedQuestion) {
        const index = quizData.indexOf(selectedQuestion);
        isCorrect = selectedQuestion.correctAnswer === selectedOption;

        selectedQuestion = { ...selectedQuestion, selectedOption, isCorrect };

        quizData.splice(index, 1, selectedQuestion);

        // Update the report
        let sameDiffArr = quizReport.find(
          (qr) => qr.difficultyLevel === quiz.currentDifficultyLevel
        );
        if (sameDiffArr) {
          const index = quizReport.indexOf(sameDiffArr);
          sameDiffArr = {
            ...sameDiffArr,
            correct: isCorrect ? sameDiffArr.correct + 1 : sameDiffArr.correct,
            incorrect: !isCorrect
              ? sameDiffArr.incorrect + 1
              : sameDiffArr.incorrect,
          };
          quizReport.splice(index, 1, sameDiffArr);
        } else {
          quizReport.push({
            difficultyLevel: quiz.currentDifficultyLevel,
            correct: isCorrect ? 1 : 0,
            incorrect: isCorrect ? 0 : 1,
          });
        }
      }
      quiz.currentQuizData = quizData;
      quiz.reportData = quizReport;
      await quiz.save();

      return NextResponse.json({
        message: "Answer saved successfully !",
        status: 200,
        success: true,
        resultObject: { isCorrect, reportData: quizReport },
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
