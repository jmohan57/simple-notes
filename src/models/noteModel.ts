import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  noteTitle: {
    type: String,
    required: [true, "Note Title is required"],
  },
  noteBody: {
    type: String,
    required: [true, "Note Body is required"],
  },
  createdBy: {
    type: String,
    required: [true, "Created By is required"],
  },
  lastEditedOn: {
    type: Date,
    default: Date.now(),
  },
  colorTheme: {
    type: String,
    default: "Default",
  }
});

const Note = mongoose.models.notes || mongoose.model("notes", noteSchema);

export default Note;
