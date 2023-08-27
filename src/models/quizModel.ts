import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  username: { type: String },
  topic: { type: String },
  startedOn: { type: Date },
  isEnded: { type: Boolean },
  submittedOn: { type: Date },
  currentDifficultyLevel: { type: Number },
  currentQuizData: { type: Array },
  reportData: { type: Array },
});

const Quiz = mongoose.models.quizes || mongoose.model("quizes", quizSchema);

export default Quiz;
