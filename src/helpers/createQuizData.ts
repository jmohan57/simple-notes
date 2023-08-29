import { QuestionObject, QuestionOption } from "@/types/quiz-interface";

export function createQuizData(questionsString: string): QuestionObject[] {
  const delimiter = questionsString.includes("**Question:**")
    ? "**Question:**"
    : "Question:";
  const questionStrings = questionsString
    .split(delimiter)
    .filter((str) => str.trim().length > 0);

  const questionObjects: QuestionObject[] = [];

  questionStrings.forEach((questionStr) => {
    const answerDelimiter = questionStr.includes("**Answer:**")
      ? "**Answer:**"
      : "Answer:";
    const [questionBlock, answerBlock] = questionStr.split(answerDelimiter);

    const questionMatch = questionBlock.match(/(.+)\n/i);
    const question = questionMatch ? questionMatch[1].trim() : "";

    const optionsMatches = questionBlock.match(/\(([A-Da-d])\) (.+)\n/g);
    const options: QuestionOption[] = [];
    if (optionsMatches) {
      optionsMatches.forEach((match) => {
        const optionMatch = match.match(/\(([A-Da-d])\) (.+)\n/i);
        if (optionMatch) {
          const [, letter, text] = optionMatch;
          options.push({ letter: letter.toUpperCase(), text });
        }
      });
    }

    if (options.length === 0) {
      const optionsMatchesAlt = questionBlock.match(/([A-Da-d])\. (.+)/g);
      if (optionsMatchesAlt) {
        optionsMatchesAlt.forEach((match) => {
          const optionMatch = match.match(/([A-Da-d])\. (.+)/i);
          if (optionMatch) {
            const [, letter, text] = optionMatch;
            options.push({ letter: letter.toUpperCase(), text });
          }
        });
      }
    }

    const answerMatch = answerBlock.match(/([A-Da-d])/i);
    let correctAnswer = answerMatch ? answerMatch[1].toUpperCase() : "";
    correctAnswer = options.find((option) => option.letter === correctAnswer)
      ?.text!;

    const questionObject: QuestionObject = {
      question,
      options,
      correctAnswer,
    };

    questionObjects.push(questionObject);
  });

  return questionObjects;
}
