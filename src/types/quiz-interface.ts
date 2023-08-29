export interface QuestionOption {
  letter?: string;
  text?: string;
}

export interface QuestionObject {
  question: string;
  options: QuestionOption[];
  correctAnswer?: string;
  selectedOption?: string;
  isCorrect?: boolean;
}

export interface QuizReport {
  difficultyLevel: number;
  correct: number;
  incorrect: number;
}

export interface IQuiz {
  username?: string;
  topic: string;
  startedOn: string;
  isEnded?: boolean;
  submittedOn?: string;
  currentDifficultyLevel: number;
  currentQuizData: QuestionObject[];
  reportData: QuizReport[];
}
