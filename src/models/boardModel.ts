import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  boardName: {
    type: String,
    required: [true, "Board name is required"],
  },
  boardDescription: {
    type: String,
    required: [true, "Board description is required"],
  },
  createdBy: {
    type: String,
    required: [true, "Created By is required"],
  },
  lastEditedOn: {
    type: Date,
    default: Date.now(),
  },
  boardBackground: {
    type: String,
    default: "Default",
  },
  pinned: {
    type: Boolean,
    default: false,
  }
});

const Board = mongoose.models.boards || mongoose.model("boards", boardSchema);

export default Board;
